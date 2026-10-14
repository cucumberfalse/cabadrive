"""Bounded native-Linux Docker CI observation. No cleanup or runner configuration."""
import datetime
import hashlib
import json
import os
import pathlib
import platform
import selectors
import signal
import socket
import stat
import subprocess
import sys
import time
import secrets

GIB = 1024 ** 3
RESERVE = 2 * GIB
FORECAST = {
    'contextsAndCopyLayers': 4 * GIB,
    'imagesAndBuildLayers': 4 * GIB,
    'retainedStatesAndExports': 3 * GIB,
    'nativeCompilerAndDependencies': 2 * GIB,
    'workingCopiesProofAndUncertainty': 2 * GIB,
    'additionalSwapAllowance': GIB,
}
STAGES = ['install', 'browser', 'build', 'up', 'smoke', 'production-retry', 'retention', 'image-pipeline', 'headers']
# Each complete upcoming build/fixture is conservatively charged the full union.
# Completed allocations are already present in the live free-space samples;
# no unproven completion/cleanup credit is used to reduce an upcoming envelope.
# The final header-only phase adds no build payload; the16MiB proof is reserved
# in the existing2GiB working/proof/uncertainty category throughout.
REMAINING_GIB = {stage: (0 if stage == 'headers' else 16) for stage in STAGES}



def utc():
    return datetime.datetime.now(datetime.timezone.utc).isoformat()


def encode(value):
    return (json.dumps(value, sort_keys=True) + '\n').encode()


class BoundedFile:
    def __init__(self, path, cap):
        self.file = open(path, 'xb', buffering=0)
        os.chmod(path, 0o600)
        self.cap = cap
        self.size = 0

    def write(self, data):
        if self.size + len(data) > self.cap:
            raise ValueError('proof file cap exceeded')
        written = self.file.write(data)
        if written != len(data):
            raise OSError('short evidence write')
        self.size += written


def query(args, timeout=10):
    p = subprocess.run(args, capture_output=True, text=True, timeout=timeout)
    if p.returncode or len(p.stdout.encode()) > 2 * 1024 ** 2:
        raise ValueError('bounded read-only query failed: ' + args[0])
    return p.stdout.strip()


def topology(root):
    if platform.system() != 'Linux':
        raise ValueError('native Linux proof required')
    context = json.loads(query(['docker', 'context', 'inspect']))[0]
    endpoint = context['Endpoints']['docker']['Host']
    if not endpoint.startswith('unix:///'):
        raise ValueError('remote daemon topology unavailable')
    path = pathlib.Path(endpoint.removeprefix('unix://'))
    if not stat.S_ISSOCK(path.stat().st_mode):
        raise ValueError('daemon socket identity unavailable')
    info = json.loads(query(['docker', 'info', '--format', '{{json .}}']))
    if info['OSType'] != 'linux' or info['Name'] != socket.gethostname() or info['KernelVersion'] != platform.release():
        raise ValueError('daemon is not proven on this host')
    daemons = []
    for p in pathlib.Path('/proc').iterdir():
        if p.name.isdigit():
            try:
                if (p / 'comm').read_text().strip() == 'dockerd':
                    status = (p / 'status').read_text()
                    uid = next(x for x in status.splitlines() if x.startswith('Uid:')).split()[1:]
                    if uid != ['0'] * 4:
                        raise ValueError('unexpected dockerd ownership')
                    daemons.append(int(p.name))
            except (FileNotFoundError, ProcessLookupError):
                pass
    backing = pathlib.Path(info['DockerRootDir'])
    if len(daemons) != 1 or not backing.is_absolute() or backing.stat().st_uid != 0:
        raise ValueError('native daemon/root identity unavailable')
    project = os.environ['COMPOSE_PROJECT_NAME']
    if not project.startswith('cabadrive-ci-'):
        raise ValueError('unexpected project ownership')
    # No adoption: existing names OR project ownership labels are a refusal.
    for command in [['docker', 'ps', '-aq'], ['docker', 'network', 'ls', '-q'], ['docker', 'volume', 'ls', '-q']]:
        if query(command + ['--filter', 'label=com.docker.compose.project=' + project]):
            raise ValueError('fresh project label already exists')
    if query(['docker', 'volume', 'ls', '-q', '--filter', 'name=' + project]):
        raise ValueError('fresh project volume name already exists')
    for suffix in ['-stager', '-cabadrive']:
        if query(['docker', 'image', 'ls', '-q', project + suffix]):
            raise ValueError('fresh project output tag already exists')
    return {'context': context['Name'], 'endpoint': endpoint, 'socketDevice': path.stat().st_dev,
            'socketInode': path.stat().st_ino, 'daemonPids': daemons, 'host': info['Name'],
            'kernel': info['KernelVersion'], 'dockerVersion': info['ServerVersion'],
            'backingPath': str(backing), 'project': project, 'vmMemory': 'not-applicable: proven same-host native dockerd',
            'workingMemoryAllowanceBytes': 256 * 1024 ** 2, 'hostPath': str(root)}


def sample_paths(root, backing):
    rows = {}
    for name, path in [('host', root), ('backing', backing)]:
        fs = os.statvfs(path)
        rows[name] = {'path': str(path), 'device': os.stat(path).st_dev,
                      'filesystemId': fs.f_fsid, 'availableBlocks': fs.f_bavail,
                      'blockBytes': fs.f_frsize, 'freeBytes': fs.f_bavail * fs.f_frsize}
    memory = {}
    for line in pathlib.Path('/proc/meminfo').read_text().splitlines():
        parts = line.split()
        if parts[0] in ['MemAvailable:', 'SwapTotal:', 'SwapFree:']:
            if len(parts) != 3 or parts[2] != 'kB' or not parts[1].isdigit():
                raise ValueError('invalid Linux memory metric')
            memory[parts[0][:-1]] = int(parts[1]) * 1024
    if set(memory) != {'MemAvailable', 'SwapTotal', 'SwapFree'} or memory['SwapFree'] > memory['SwapTotal']:
        raise ValueError('missing or inconsistent Linux memory metric')
    return {'at': utc(), 'wall': time.time(), 'monotonic': time.monotonic(), **rows,
            'memory': memory, 'swapUsedBytes': memory['SwapTotal'] - memory['SwapFree']}


def validate(row, remaining_bytes, baseline_swap, swap_allowance, identities=None):
    for name in ['host', 'backing']:
        if identities is not None:
            for field in ['path', 'device', 'filesystemId', 'blockBytes']:
                if type(row[name].get(field)) is not type(identities[name][field]) or row[name].get(field) != identities[name][field]:
                    raise ValueError(name + ' filesystem identity changed')
            blocks, size = row[name]['availableBlocks'], row[name]['blockBytes']
            if type(blocks) is not int or blocks < 0 or type(size) is not int or size <= 0 or blocks * size != row[name]['freeBytes']:
                raise ValueError('invalid free-block arithmetic')
        value = row[name]['freeBytes']
        if type(value) is not int or value < RESERVE + remaining_bytes:
            raise ValueError(name + ' remaining-peak/reserve HOLD')
    if type(row['memory']['MemAvailable']) is not int or row['memory']['MemAvailable'] < GIB:
        raise ValueError('MemAvailable below1GiB')
    if row['swapUsedBytes'] > baseline_swap + swap_allowance:
        raise ValueError('declared swap allowance exceeded')


def group_members(group):
    """Non-signalling exact process-group observation; unavailable is never absence."""
    rows = []
    if pathlib.Path('/proc/self/stat').exists():
        for path in pathlib.Path('/proc').iterdir():
            if not path.name.isdigit():
                continue
            try:
                raw = (path / 'stat').read_text()
                fields = raw[raw.rfind(')') + 2:].split()
                if int(fields[2]) == group:
                    rows.append({'pid': int(path.name), 'group': group, 'state': fields[0], 'startTicks': fields[19]})
            except (FileNotFoundError, ProcessLookupError):
                continue
    else:
        raw = query(['ps', '-axo', 'pid=,pgid=,stat=,lstart='], timeout=1)
        for line in raw.splitlines():
            fields = line.split(None, 3)
            if len(fields) != 4:
                raise ValueError('unknown process group identity')
            if int(fields[1]) == group:
                rows.append({'pid': int(fields[0]), 'group': group, 'state': fields[2], 'start': fields[3]})
    return sorted(rows, key=lambda item: item['pid'])


def observe(sample, check, series, observations):
    row = sample()
    previous = observations.get('lastSample')
    observations['lastSample'] = row
    if previous:
        wall, mono = row['wall'] - previous['wall'], row['monotonic'] - previous['monotonic']
        observations['maximumWallGapSeconds'] = max(observations.get('maximumWallGapSeconds', 0), wall)
        observations['maximumMonotonicGapSeconds'] = max(observations.get('maximumMonotonicGapSeconds', 0), mono)
        if wall < 0 or wall > 5:
            raise ValueError('wall sample gap/jump HOLD')
    for name in ['host', 'backing']:
        if name not in observations.get('minima', {}) or row[name]['freeBytes'] < observations['minima'][name]['freeBytes']:
            observations.setdefault('minima', {})[name] = {'at': row['at'], **row[name]}
    series.write(encode(row))
    check(row)
    return row


def run_owned(command, root, log, series, sample, check, observations, can_interrupt=True, stop_grace=60, total_seconds=None, forward_stdout=True):
    """Bounded one-signal stop, independent pipe/leader/group facts on every path."""
    stop_directory = pathlib.Path(log.file.name).parent / ('stop-' + secrets.token_hex(8))
    stop_directory.mkdir(mode=0o700)
    token = secrets.token_hex(32)
    environment = {**os.environ, 'CABADRIVE_CI_STOP_DIR': str(stop_directory.resolve()),
                   'CABADRIVE_CI_STOP_TOKEN': token, 'CABADRIVE_CI_STOP_OWNER': str(os.getpid())}
    child = subprocess.Popen(command, cwd=root, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                             start_new_session=True, umask=0o022, env=environment)
    group, child_started, started_clock = child.pid, utc(), time.monotonic()
    stop_started = stop_at = signal_refusal = None
    bounded_residual = interrupted = interrupt_attempted = sink_failed = False
    pipe_exit_started = None
    errors, error_count = [], 0
    streams = {'stdout': child.stdout, 'stderr': child.stderr}
    drained_bytes = {'stdout': 0, 'stderr': 0}
    selector = None
    next_sample = 0

    def abort(error):
        nonlocal interrupted, interrupt_attempted, sink_failed, error_count, stop_started, stop_at, signal_refusal
        if stop_started is None:
            stop_started, stop_at = time.monotonic(), utc()
        error_count += 1
        if len(errors) < 16:
            errors.append(type(error).__name__ + ': ' + str(error)[:1024])
        sink_failed = True
        if can_interrupt and not interrupt_attempted and child.poll() is None:
            interrupt_attempted = True
            try:
                if os.getpgid(child.pid) != group or group == os.getpgrp():
                    raise RuntimeError('refuse foreign process-group signal')
                marker = encode({'schemaVersion': 1, 'token': token, 'ownerPid': os.getpid(),
                                 'groupPid': group, 'reason': 'resource-observer-stop'})
                pending = stop_directory / 'stop.pending'
                with open(pending, 'xb') as output:
                    os.chmod(pending, 0o600)
                    if output.write(marker) != len(marker):
                        raise OSError('short stop marker write; refusing unmarked interrupt')
                    output.flush(); os.fsync(output.fileno())
                os.replace(pending, stop_directory / 'stop.json')
                os.killpg(group, signal.SIGINT)
                interrupted = True
            except Exception as caught:
                signal_refusal = type(caught).__name__ + ': ' + str(caught)[:1024]
                error_count += 1
                if len(errors) < 16:
                    errors.append('Interrupt refused: ' + signal_refusal)

    def disable_selector(error):
        nonlocal selector
        abort(error)
        if selector is not None:
            try:
                selector.close()
            except Exception as caught:
                abort(caught)
            selector = None

    try:
        for stream in streams.values():
            os.set_blocking(stream.fileno(), False)
        try:
            selector = selectors.DefaultSelector()
            for stream in streams.values():
                selector.register(stream, selectors.EVENT_READ)
        except Exception as error:
            disable_selector(error)
        while streams or child.poll() is None:
            now = time.monotonic()
            if child.poll() is not None and streams and pipe_exit_started is None:
                pipe_exit_started = now
            if total_seconds is not None and now - started_clock >= total_seconds:
                abort(TimeoutError('owned command total deadline'))
                bounded_residual = True
                break
            if (pipe_exit_started is not None and now - pipe_exit_started >= stop_grace) or (stop_started is not None and now - stop_started >= stop_grace):
                bounded_residual = True
                abort(TimeoutError('bounded owned stop/drain deadline; closure unknown'))
                break
            if now >= next_sample:
                try:
                    observe(sample, check, series, observations)
                except Exception as error:
                    observations.setdefault('firstCrossing', {'at': utc(), 'error': str(error)[:1024]})
                    abort(error)
                next_sample = time.monotonic() + 1
            if selector is not None:
                try:
                    selector.select(0.1)
                except Exception as error:
                    disable_selector(error)
            else:
                time.sleep(0.05)
            # Nonblocking fallback also drains streams that failed registration.
            for name, stream in list(streams.items()):
                try:
                    data = os.read(stream.fileno(), 65536)
                except BlockingIOError:
                    continue
                except Exception as error:
                    abort(error)
                    continue
                if not data:
                    if selector is not None:
                        try:
                            selector.unregister(stream)
                        except Exception as error:
                            disable_selector(error)
                    stream.close()
                    del streams[name]
                else:
                    drained_bytes[name] += len(data)
                    if not sink_failed:
                        try:
                            log.write(data)
                            if forward_stdout:
                                sys.stdout.buffer.write(data)
                                sys.stdout.buffer.flush()
                        except Exception as error:
                            abort(error)
    except Exception as error:
        # Last-resort structured HOLD; never infer successful draining here.
        abort(error)
        bounded_residual = True
    finally:
        if selector is not None:
            try:
                selector.close()
            except Exception as error:
                abort(error)
        try:
            observe(sample, check, series, observations)
        except Exception as error:
            abort(error)
        alive = child.poll() is None
        exit_code = None if alive else child.wait()
        drained = not streams
        try:
            members = group_members(group)
            group_known, group_present = True, bool(members)
            if group_present:
                abort(ValueError('exact owned process group remains after leader/pipe closure'))
        except Exception as error:
            members, group_known, group_present = [], False, None
            abort(error)
        for stream in streams.values():
            try:
                stream.close()
            except Exception as error:
                abort(error)
    closed = drained and not alive and group_known and group_present is False
    return {'exit': exit_code, 'startedAt': child_started, 'pid': child.pid, 'group': group,
            'childStillAlive': alive, 'pipesOpen': not drained, 'openStreamIds': sorted(streams),
            'drainedBytes': drained_bytes, 'boundedClosureDeadlineExceeded': bounded_residual,
            'stopStartedAt': stop_at, 'stopStartedMonotonic': stop_started,
            'stopDeadlineMonotonic': None if stop_started is None else min(stop_started + stop_grace, started_clock + total_seconds if total_seconds is not None else float('inf')),
            'signalAttempted': interrupt_attempted, 'ownSigintSent': interrupted, 'signalRefusal': signal_refusal,
            'groupClosureKnown': group_known, 'groupPresent': group_present, 'residualGroupMembers': members,
            'errors': errors, 'errorCount': error_count, 'pipesDrained': drained,
            'allPipesDrainedAndChildWaited': drained and not alive, 'childWaited': not alive,
            'allOwnedClosureProven': closed}


class Observation:
    def __init__(self, root, log, series, sample, check, result):
        self.root, self.log, self.series, self.sample, self.check, self.result = root, log, series, sample, check, result

    def tick(self):
        return observe(self.sample, self.check, self.series, self.result)

    def wait(self, seconds):
        deadline = time.monotonic() + seconds
        while True:
            self.tick()
            left = deadline - time.monotonic()
            if left <= 0:
                return
            time.sleep(min(0.2, left))

    def query(self, args, timeout=10):
        class Capture:
            file = self.log.file
            data = bytearray()
            def write(inner, value):
                if len(inner.data) + len(value) > 2 * 1024 ** 2:
                    raise ValueError('read-only query output cap exceeded')
                inner.data.extend(value)
        capture = Capture()
        outcome = run_owned(args, self.root, capture, self.series, self.sample, self.check, self.result,
                            total_seconds=timeout, forward_stdout=False)
        self.result['observedQueryCount'] = self.result.get('observedQueryCount', 0) + 1
        self.result['lastQueryOutcome'] = {'command': args[:4], **outcome}
        if outcome['errors']:
            failures = self.result.setdefault('failedQueryOutcomes', [])
            if len(failures) < 4:
                failures.append({'command': args[:4], **outcome})
        if outcome['exit'] != 0 or outcome['errors'] or not outcome['allOwnedClosureProven']:
            raise ValueError('bounded observed read-only query HOLD')
        self.tick()
        return bytes(capture.data).decode().strip()


TERMINAL = {'completed', 'error', 'failed', 'canceled', 'cancelled'}


def history(timeout=10, read=query):
    return [json.loads(line) for line in read(['docker', 'buildx', 'history', 'ls', '--no-trunc', '--format=json'], timeout=timeout).splitlines() if line.strip()]


def terminal_tasks(before, started, root, stage, successful, read_history=None, inspect=None, sleep=time.sleep, timeout=60, observer=None):
    old = {row.get('ref', row.get('Ref')) for row in before}
    seen = set()
    deadline = time.monotonic() + timeout
    def remaining():
        value = deadline - time.monotonic()
        if value <= 0:
            raise ValueError('bounded daemon closure deadline exceeded')
        return min(10, value)
    read = observer.query if observer else query
    sleep = observer.wait if observer else sleep
    read_history = read_history or (lambda: history(timeout=remaining(), read=read))
    inspect = inspect or (lambda ref: json.loads(read(['docker', 'buildx', 'history', 'inspect', '--format=json', ref], timeout=remaining())))
    for attempt in range(12):
        remaining()
        rows = read_history()
        remaining()
        ids = {row.get('ref', row.get('Ref')) for row in rows}
        if None in ids or not seen <= ids:
            raise ValueError('current BuildKit reference missing/dropped')
        seen |= ids - old
        if all(str(row.get('status', row.get('Status', ''))).lower() in TERMINAL for row in rows):
            if successful and stage in ['build', 'retention', 'image-pipeline'] and not seen:
                raise ValueError('successful build stage lacks actual current BuildKit task')
            proofs = []
            for ref in sorted(seen):
                remaining()
                detail = inspect(ref)
                remaining()
                context = pathlib.Path(detail['Context'])
                if not context.is_absolute():
                    context = (root / context).resolve()
                allowed = context == root or context.is_relative_to(root) or (context.is_absolute() and any(part.startswith(('cabadrive-docker-images-', 'cabadrive-docker-retention-')) for part in context.parts))
                if not allowed or detail['Ref'] != ref.rsplit('/', 1)[-1] or datetime.datetime.fromisoformat(detail['StartedAt'].replace('Z', '+00:00')) < datetime.datetime.fromisoformat(started) or not detail.get('CompletedAt') or str(detail['Status']).lower() not in TERMINAL:
                    raise ValueError('unbound/nonterminal current BuildKit task')
                proofs.append({key: detail.get(key) for key in ['Ref', 'Context', 'Dockerfile', 'Target', 'StartedAt', 'CompletedAt', 'Status']})
            if successful and stage == 'build' and ({p['Target'] for p in proofs} != {'stager', 'runtime'} or any(p['Status'] != 'completed' for p in proofs)):
                raise ValueError('both actual Compose build targets required')
            return {'observedCurrentRefs': sorted(seen), 'terminalTasks': proofs, 'failedBeforeAnyObservedTask': not successful and not seen}
        if attempt < 11:
            sleep(min(5, remaining()))
    raise ValueError('daemon BuildKit tasks nonterminal after owned client drained; HOLD')


def main():
    os.umask(0o077)
    root = pathlib.Path.cwd()
    proof = pathlib.Path(os.environ['CABADRIVE_CI_PROOF'])
    proof.mkdir(mode=0o700, parents=True, exist_ok=False)
    log = BoundedFile(proof / 'commands.log', 8 * 1024 ** 2)
    series = BoundedFile(proof / 'samples.jsonl', 6 * 1024 ** 2)
    result = {'status': 'HOLD', 'overallAcceptance': False, 'startedAt': utc(), 'stages': [],
              'forecastBytes': sum(FORECAST.values()), 'forecastCategories': FORECAST,
              'remainingStageEnvelopeGiB': REMAINING_GIB,
              'forecastLimitation': 'Conservative category union, not a proven maximum; no cache/cleanup credit.',
              'reserveBytes': RESERVE, 'proofCapBytes': 16 * 1024 ** 2,
              'memorySemantics': 'https://docs.kernel.org/filesystems/proc.html#meminfo',
              'observedOnly': True, 'samplingTargetSeconds': 1, 'maximumAllowedWallGapSeconds': 5}
    ownership_admitted = False
    allocation_started = False
    closure_known = True
    teardown_safe = False
    try:
        source = os.environ['CI_SOURCE_SHA']
        checkout = query(['git', 'rev-parse', 'HEAD'])
        if any(len(x) != 40 or any(c not in '0123456789abcdef' for c in x) for x in [source, checkout]):
            raise ValueError('full source/checkout SHA required')
        result.update(sourceHead=source, measuredCheckout=checkout,
                      runUrl=os.environ['GITHUB_SERVER_URL'] + '/' + os.environ['GITHUB_REPOSITORY'] + '/actions/runs/' + os.environ['GITHUB_RUN_ID'],
                      job=os.environ['GITHUB_JOB'], runAttempt=os.environ['GITHUB_RUN_ATTEMPT'])
        result['topology'] = topology(root)
        result['buildxVersion'] = query(['docker', 'buildx', 'version'])
        result['buildxSchemaSources'] = ['https://github.com/docker/buildx/blob/master/commands/history/ls.go', 'https://github.com/docker/buildx/blob/master/commands/history/inspect.go', 'https://docs.docker.com/reference/cli/docker/buildx/history/inspect/']
        ownership_admitted = True
        result['ownershipAdmitted'] = True
        if os.environ.get('GITHUB_OUTPUT'):
            with open(os.environ['GITHUB_OUTPUT'], 'a') as output:
                output.write('ownership-admitted=true\n')
        sample = lambda: sample_paths(root, result['topology']['backingPath'])
        initial = sample()
        result['initialSample'] = initial
        result['lastSample'] = initial
        baseline = initial['swapUsedBytes']
        allowance = min(GIB, initial['memory']['SwapFree'])
        result['swapBudget'] = {'baselineUsedBytes': baseline, 'additionalBytes': allowance, 'totalBytes': initial['memory']['SwapTotal']}
        validate(initial, sum(FORECAST.values()), baseline, allowance, initial)
        observer = Observation(root, log, series, sample, lambda value: validate(value, 0, baseline, allowance, initial), result)
        for stage in STAGES:
            result['currentStage'] = stage
            closure_known = False
            before_history = history(read=observer.query)
            if any(str(item.get('status', item.get('Status', ''))).lower() not in TERMINAL for item in before_history):
                raise ValueError('unexpected active BuildKit task before stage')
            # History and all preceding waits were sampled; this final admission
            # is deliberately AFTER history and directly BEFORE the allocator.
            validate(observer.tick(), REMAINING_GIB[stage] * GIB, baseline, allowance, initial)
            closure_known = True
            started = utc()
            if stage in ['build', 'up', 'production-retry', 'retention', 'image-pipeline']:
                allocation_started = True
            closure_known = False
            row = run_owned(['bash', 'scripts/ci-docker-stage.sh', stage], root, log, series, sample,
                            lambda value: validate(value, 0, baseline, allowance, initial), result)
            entry = {'stage': stage, 'completedAt': utc(), **row}
            result['stages'].append(entry)
            if not row['allOwnedClosureProven']:
                raise ValueError('owned client/pipe closure unknown; teardown refused')
            entry['buildkitClosure'] = terminal_tasks(before_history, started, root, stage, row['exit'] == 0, observer=observer)
            closure_known = True
            if row['exit'] or row['errors']:
                raise ValueError('stage failed or observation HOLD: ' + stage)
        result['status'] = 'ALL_DOCKER_CI_COMMANDS_PASS'
    except Exception as error:
        result['error'] = type(error).__name__ + ': ' + str(error)[:2048]
    finally:
        # Never adopt a failed/unknown ownership namespace for teardown.
        result['makeDownExit'] = None
        if ownership_admitted and allocation_started and closure_known:
            try:
                down = run_owned(['make', 'down'], root, log, series, sample,
                                 lambda value: validate(value, 0, baseline, allowance, initial),
                                 result, can_interrupt=False, total_seconds=120)
                result['makeDown'] = down
                result['makeDownExit'] = down['exit']
                teardown_safe = down['exit'] == 0 and not down['errors'] and down['allOwnedClosureProven']
                if not teardown_safe:
                    result['status'] = 'HOLD'
            except Exception as error:
                result['makeDownError'] = type(error).__name__ + ': ' + str(error)[:2048]
                result['status'] = 'HOLD'
        else:
            result['makeDownNotAdmitted'] = 'Fresh ownership/allocation or actual client/pipe/daemon closure unavailable; teardown refused.'
        result['teardownSafe'] = teardown_safe
        if os.environ.get('GITHUB_OUTPUT'):
            with open(os.environ['GITHUB_OUTPUT'], 'a') as output:
                output.write('teardown-safe=' + str(teardown_safe).lower() + '\n')
        result['proofHashes'] = {path.name: hashlib.sha256(path.read_bytes()).hexdigest()
                                 for path in proof.iterdir() if path.is_file()}
        result['completedAt'] = utc()
        result['allocatedProofBytes'] = sum(p.stat().st_blocks * 512 for p in proof.rglob('*')) + 128 * 1024
        if result['allocatedProofBytes'] > 16 * 1024 ** 2:
            result['status'] = 'HOLD'
            result['proofCapExceeded'] = True
        raw = encode(result)
        if len(raw) > 64 * 1024:
            raise ValueError('receipt cap exceeded')
        with open(proof / 'receipt.json', 'xb') as f:
            f.write(raw)
    return 0 if result['status'] == 'ALL_DOCKER_CI_COMMANDS_PASS' else 1


def verify_down(proof):
    path = pathlib.Path(proof) / 'receipt.json'
    info = path.lstat()
    if not stat.S_ISREG(info.st_mode) or info.st_size > 65536:
        raise ValueError('missing/bounded regular teardown receipt required')
    receipt = json.loads(path.read_text())
    down = receipt.get('makeDown', {})
    if (receipt.get('teardownSafe') is not True or type(receipt.get('makeDownExit')) is not int or receipt['makeDownExit'] != 0
            or type(down.get('exit')) is not int or down['exit'] != 0 or down.get('allOwnedClosureProven') is not True
            or down.get('childStillAlive') is not False or down.get('pipesOpen') is not False or down.get('childWaited') is not True
            or down.get('groupClosureKnown') is not True or down.get('groupPresent') is not False or down.get('residualGroupMembers') != []
            or down.get('errors') != []):
        raise ValueError('actual successful bounded make down proof unavailable; no retry allowed')
    return 0


if __name__ == '__main__':
    sys.exit(verify_down(os.environ['CABADRIVE_CI_PROOF']) if sys.argv[1:] == ['--verify-down'] else main())
