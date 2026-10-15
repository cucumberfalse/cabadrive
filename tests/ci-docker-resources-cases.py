import contextlib
import io
import importlib.util
import os
import pathlib
import sys
import tempfile
import time
import unittest
import json
import copy
import shutil
import subprocess
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('resources', 'scripts/ci-docker-resources.py')
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)


def row():
    return {'at': m.utc(), 'wall': time.time(), 'monotonic': time.monotonic(),
            'host': {'freeBytes': 64 * m.GIB}, 'backing': {'freeBytes': 64 * m.GIB},
            'memory': {'MemAvailable': 2 * m.GIB}, 'swapUsedBytes': 123}


class ResidualFixture:
    """Only the two deliberately residual fixtures use this cooperative lifetime."""
    def __init__(self):
        self.root = pathlib.Path(tempfile.mkdtemp(prefix='cabadrive-ci-residual-')).resolve()
        self.token = os.urandom(16).hex()
        self.launched = False
        self.identity = None
        self.terminal = False
        self.ack_while_live = False

    def payload(self, closed_pipes=False, acknowledge=True, lifetime=10):
        return """import os,signal,time,pathlib,json
root=pathlib.Path(%r);token=%r;deadline=time.monotonic()+%r
signal.signal(signal.SIGINT,signal.SIG_IGN)
if %r:os.close(1);os.close(2)
identity={'pid':os.getpid(),'group':os.getpgrp(),'root':str(root),'token':token}
def publish(name,value):
 (root/(name+'.tmp')).write_text(json.dumps(value));os.replace(root/(name+'.tmp'),root/name)
publish('ready',identity)
while not (root/'release').exists() and time.monotonic()<deadline:time.sleep(.01)
if (root/'release').exists() and %r:
 publish('done',dict(identity,rootPresent=root.is_dir()))
 while not (root/'exit-release').exists() and time.monotonic()<deadline:time.sleep(.01)
""" % (str(self.root), self.token, lifetime, closed_pipes, acknowledge)

    def bind(self, group=None, timeout=3):
        until = time.monotonic() + timeout
        while not (self.root/'ready').exists() and time.monotonic() < until: time.sleep(.01)
        value = json.loads((self.root/'ready').read_text())
        if set(value) != {'pid','group','root','token'} or value['root'] != str(self.root) or value['token'] != self.token:
            raise AssertionError('unbound fixture ready identity: ' + str(self.root))
        if type(value['pid']) is not int or type(value['group']) is not int or min(value['pid'],value['group']) <= 0 or value['group'] == os.getpgrp() or (group is not None and value['group'] != group):
            raise AssertionError('foreign fixture process identity: ' + str(self.root))
        members = m.group_members(value['group'])
        actual = next((x for x in members if x['pid'] == value['pid']), None)
        if actual is None or actual['state'].startswith('Z'):
            raise AssertionError('fixture must be live when ownership is bound: ' + str(self.root))
        self.identity = actual
        return value

    def live(self):
        if self.identity is None: raise AssertionError('fixture PID identity unavailable')
        current = next((x for x in m.group_members(self.identity['group']) if x['pid'] == self.identity['pid']), None)
        key = 'startTicks' if 'startTicks' in self.identity else 'start'
        return current is not None and current[key] == self.identity[key] and not current['state'].startswith('Z')

    def finish(self, timeout=3):
        if not self.launched:
            shutil.rmtree(self.root)
            return
        if self.identity is None: self.bind(timeout=timeout)
        (self.root/'release').write_text(self.token)
        until = time.monotonic() + timeout
        try:
            while not (self.root/'done').exists() and time.monotonic() < until: time.sleep(.01)
            if not (self.root/'done').exists():
                raise AssertionError('fixture completion ACK missing; controls preserved: ' + str(self.root))
            ack = json.loads((self.root/'done').read_text())
            if ack != dict(pid=self.identity['pid'],group=self.identity['group'],root=str(self.root),token=self.token,rootPresent=True):
                raise AssertionError('fixture completion ACK identity mismatch: ' + str(self.root))
            self.ack_while_live = self.live()
        finally:
            # Even an invalid/missing ACK must not strand an exact owned payload.
            (self.root/'exit-release').write_text(self.token)
        while self.live() and time.monotonic() < until: time.sleep(.01)
        self.terminal = not self.live()
        if not self.terminal: raise AssertionError('fixture still live; controls preserved: ' + str(self.root))
        try: os.waitpid(self.identity['pid'], os.WNOHANG)
        except ChildProcessError: pass  # Non-child descendants are terminal-observed, not waitpid-reaped.
        shutil.rmtree(self.root)


class Cases(unittest.TestCase):
    def test_capacity_memory_swap_boundaries(self):
        m.validate(row(), 16 * m.GIB, 123, m.GIB)
        for field in ['host', 'backing']:
            value = row(); value[field]['freeBytes'] = m.RESERVE - 1
            with self.assertRaises(ValueError): m.validate(value, 0, 123, m.GIB)
        for invalid in [m.GIB - 1, '2000000000', None]:
            value = row(); value['memory']['MemAvailable'] = invalid
            with self.assertRaises(ValueError): m.validate(value, 0, 123, m.GIB)
        value = row(); value['swapUsedBytes'] = 123 + m.GIB + 1
        with self.assertRaises(ValueError): m.validate(value, 0, 123, m.GIB)
        with self.assertRaises(KeyError): m.validate({}, 0, 123, m.GIB)

    def test_initial_forecast_cannot_be_replaced_by_reserve_only(self):
        value = row(); value['host']['freeBytes'] = 17 * m.GIB
        with self.assertRaises(ValueError): m.validate(value, sum(m.FORECAST.values()), 123, m.GIB)

    def exercise(self, sink_error=False, gap=False, bad_memory=False):
        with tempfile.TemporaryDirectory(prefix='cabadrive-linux-observer-') as directory:
            root = pathlib.Path(directory); ready = root / 'ready'; marker = root / 'finally'; next_stage = root / 'next'
            code = """import signal,time,pathlib,sys
def stop(*_):raise KeyboardInterrupt()
signal.signal(signal.SIGINT,stop)
pathlib.Path('ready').write_text('ready')
try:
 print('active',flush=True)
 while True:time.sleep(.01)
finally:
 sys.stdout.write('x'*1048576);sys.stdout.flush()
 marker=pathlib.Path(__import__('os').environ['CABADRIVE_CI_STOP_DIR'])/'stop.json'
 assert marker.is_file(), 'stop marker must precede interrupt'
 pathlib.Path('finally').write_text('done')
"""
            log = m.BoundedFile(root / 'commands.log', 2 * 1024 ** 2)
            series = m.BoundedFile(root / 'samples.jsonl', 65536)
            if sink_error:
                def fail(_): raise OSError('injected ENOSPC')
                log.write = fail
            calls = 0
            def sample():
                nonlocal calls
                end = time.monotonic() + 5
                while not ready.exists() and time.monotonic() < end: time.sleep(.01)
                value = row(); calls += 1
                if bad_memory: value['memory']['MemAvailable'] = 0
                if gap: value['wall'] += 1020 * (calls - 1)
                return value
            try:
                with contextlib.redirect_stdout(io.TextIOWrapper(io.BytesIO())):
                    result = m.run_owned([sys.executable, '-c', code], root, log, series, sample,
                                         lambda value: m.validate(value, 0, 123, m.GIB), {})
                self.assertTrue(result['ownSigintSent'])
                self.assertTrue(result['allPipesDrainedAndChildWaited'])
                self.assertTrue(result['errors'])
                self.assertEqual(marker.read_text(), 'done')
                self.assertFalse(next_stage.exists())
                self.assertNotEqual(result['group'], os.getpgrp())
            finally:
                log.file.close(); series.file.close()

    def test_low_memory_own_interrupt_finally(self): self.exercise(bad_memory=True)
    def test_wall_gap_own_interrupt_finally(self): self.exercise(gap=True)
    def test_failed_sink_drains_one_mib_finally(self): self.exercise(sink_error=True)

    def test_ignored_interrupt_open_pipe_marker_refusal_and_down_are_bounded_holds(self):
        for descendant,refused,down in [(False,False,False),(True,False,False),(False,True,False),(False,False,True)]:
            fixture=ResidualFixture();root=fixture.root;ready=root/'ready';result=None
            command=[sys.executable,'-c',fixture.payload()]
            if descendant:
                command=[sys.executable,'-c',"import subprocess,sys;subprocess.Popen([sys.executable,'-c',"+repr(fixture.payload())+"])"]
            log=m.BoundedFile(root/'log',65536);series=m.BoundedFile(root/'samples',65536)
            def sample():
                until=time.monotonic()+3
                while not ready.exists() and time.monotonic()<until:time.sleep(.01)
                return row()
            def check(_):
                if not descendant:raise ValueError('controlled reserve failure')
            try:
                fixture.launched=True
                with contextlib.redirect_stdout(io.TextIOWrapper(io.BytesIO())), (patch.object(m.os,'replace',side_effect=PermissionError('injected marker refusal')) if refused else contextlib.nullcontext()):
                    result=m.run_owned(command,root,log,series,sample,(lambda _:None) if down else check,{},stop_grace=.15,can_interrupt=not down,total_seconds=.2 if down else None)
                fixture.bind(result['group'])
                self.assertTrue(result['boundedClosureDeadlineExceeded'])
                self.assertFalse(result['allPipesDrainedAndChildWaited'])
                self.assertTrue(result['pipesOpen'])
                self.assertEqual(result['childStillAlive'],not descendant)
                self.assertEqual(result['ownSigintSent'],not (descendant or refused or down))
                if descendant:self.assertNotEqual(fixture.identity['pid'],result['pid'])
            finally:
                try:fixture.finish()
                finally:log.file.close();series.file.close()
            self.assertTrue(fixture.terminal)
            self.assertTrue(fixture.ack_while_live)
            self.assertFalse(root.exists())

    def test_cap_and_short_write(self):
        with tempfile.TemporaryDirectory() as directory:
            output = m.BoundedFile(pathlib.Path(directory) / 'proof', 4)
            with self.assertRaises(ValueError): output.write(b'12345')
            output.file.close()
            class Short:
                def write(self, _): return 1
            output.file = Short()
            with self.assertRaises(OSError): output.write(b'123')

    def test_filesystem_identity_and_exact_arithmetic(self):
        original = row()
        for name in ['host', 'backing']:
            original[name].update(path='/owned/' + name, device=1, filesystemId=2, blockBytes=4096, availableBlocks=16 * m.GIB // 4096, freeBytes=16 * m.GIB)
        m.validate(original, 0, 123, m.GIB, original)
        import copy
        for field, changed in [('device', 2), ('filesystemId', '2'), ('path', '/other'), ('blockBytes', 8192), ('availableBlocks', -1), ('freeBytes', 16 * m.GIB + 1)]:
            value = copy.deepcopy(original); value['host'][field] = changed
            with self.assertRaises(ValueError): m.validate(value, 0, 123, m.GIB, original)

    def test_actual_current_build_references_cannot_be_missing_or_nonterminal(self):
        started='2026-10-14T08:00:00+00:00'; root=pathlib.Path('/owned')
        with self.assertRaises(ValueError): m.terminal_tasks([], started, root, 'build', True, lambda: [], sleep=lambda _: None)
        rows=[{'ref':'default/default/current', 'status':'completed'}]
        detail={'Ref':'current','Context':'/owned','Dockerfile':'Dockerfile','Target':'stager','StartedAt':'2026-10-14T08:00:01+00:00','CompletedAt':'2026-10-14T08:01:00+00:00','Status':'completed'}
        with self.assertRaises(ValueError): m.terminal_tasks([], started, root, 'build', True, lambda: rows, lambda _: detail, lambda _: None)
        value=m.terminal_tasks([], started, root, 'retention', True, lambda: rows, lambda _: detail, lambda _: None)
        self.assertEqual(value['observedCurrentRefs'], ['default/default/current'])
        for field, change in [('Context','/foreign'), ('StartedAt','2026-10-13T00:00:00+00:00'), ('Status','running')]:
            invalid={**detail,field:change}
            with self.assertRaises(ValueError): m.terminal_tasks([],started,root,'retention',True,lambda:rows,lambda _:invalid,lambda _:None)
        relative={**detail,'Context':'.','Status':'failed'}
        expected_negative=m.terminal_tasks([],started,root,'image-pipeline',True,lambda:rows,lambda _:relative,lambda _:None)
        self.assertEqual(expected_negative['terminalTasks'][0]['Status'],'failed')
        without_target={key:value for key,value in relative.items() if key != 'Target'}
        self.assertIsNone(m.terminal_tasks([],started,root,'image-pipeline',True,lambda:rows,lambda _:without_target,lambda _:None)['terminalTasks'][0]['Target'])
        with self.assertRaises(ValueError):m.terminal_tasks([],started,root,'build',True,lambda:rows,lambda _:relative,lambda _:None)
        snapshots=iter([[{'ref':'default/default/current','status':'running'}], []])
        with self.assertRaises(ValueError): m.terminal_tasks([],started,root,'retention',False,lambda:next(snapshots),lambda _:detail,lambda _:None)


    def test_main_no_foreign_teardown_and_no_next_stage_after_failure(self):
        import json
        for refusal, failed_stage, down_failure in [(True, None, False), (False, 'build', False), (False, None, True), (False, None, False)]:
            with tempfile.TemporaryDirectory(prefix='cabadrive-ci-main-test-') as directory:
                proof=pathlib.Path(directory)/'proof'; calls=[]
                value=row()
                value['memory'].update(SwapTotal=m.GIB,SwapFree=m.GIB-123)
                for key in ['host','backing']:
                    value[key].update(path=directory,device=1,filesystemId=2,blockBytes=4096,availableBlocks=64*m.GIB//4096)
                def fake_run(command,*_,**__):
                    calls.append(command[-1])
                    return {'exit': 1 if command[-1] == failed_stage or (command[-1]=='down' and down_failure) else 0,'errors':[],'allPipesDrainedAndChildWaited':True,'allOwnedClosureProven':True}
                def fake_topology(_):
                    if refusal:raise ValueError('fresh project is foreign')
                    return {'backingPath':directory,'project':'cabadrive-ci-unit'}
                env={'CABADRIVE_CI_PROOF':str(proof),'CI_SOURCE_SHA':'a'*40,'GITHUB_SERVER_URL':'https://github.com','GITHUB_REPOSITORY':'cucumberfalse/cabadrive','GITHUB_RUN_ID':'1','GITHUB_JOB':'docker-validation','GITHUB_RUN_ATTEMPT':'1'}
                before_mask=os.umask(0o022);os.umask(before_mask)
                try:
                    with patch.dict(os.environ,env), patch.object(m,'topology',fake_topology), patch.object(m,'query',lambda _: 'b'*40), patch.object(m,'sample_paths',lambda *_:value), patch.object(m,'history',lambda **_:[]), patch.object(m,'terminal_tasks',lambda *_,**__:{}), patch.object(m,'run_owned',fake_run):
                        status=m.main()
                finally:os.umask(before_mask)
                result=json.loads((proof/'receipt.json').read_text())
                if refusal:self.assertEqual(calls,[])
                elif failed_stage:self.assertEqual(calls,m.STAGES[:m.STAGES.index(failed_stage)+1]+['down'])
                else:self.assertEqual(calls,m.STAGES+['down'])
                self.assertEqual(status,0 if not refusal and not failed_stage and not down_failure else 1)
                self.assertEqual(result['status']=='ALL_DOCKER_CI_COMMANDS_PASS',status==0)
                self.assertLessEqual(result['allocatedProofBytes'],16*1024**2)


    def test_teardown_verifier_refuses_unknown_and_inconsistent_outcomes(self):
        import copy,json
        good={'teardownSafe':True,'makeDownExit':0,'makeDown':{'exit':0,'allPipesDrainedAndChildWaited':True,'allOwnedClosureProven':True,'errors':[],'childStillAlive':False,'pipesOpen':False,'childWaited':True,'groupClosureKnown':True,'groupPresent':False,'residualGroupMembers':[]}}
        with tempfile.TemporaryDirectory() as directory:
            path=pathlib.Path(directory)/'receipt.json'
            path.write_text(json.dumps(good));self.assertEqual(m.verify_down(directory),0)
            for mutate in [lambda x:x.update(teardownSafe=False),lambda x:x.update(makeDownExit=None),lambda x:x['makeDown'].update(allOwnedClosureProven=False),lambda x:x['makeDown'].update(errors=['timeout']),lambda x:x['makeDown'].update(groupPresent=True),lambda x:x['makeDown'].update(groupClosureKnown=False),lambda x:x['makeDown'].update(residualGroupMembers=[{'pid':123}]),lambda x:x['makeDown'].update(exit=False)]:
                value=copy.deepcopy(good);mutate(value);path.write_text(json.dumps(value))
                with self.assertRaises(ValueError):m.verify_down(directory)
            path.unlink()
            with self.assertRaises(FileNotFoundError):m.verify_down(directory)

    def test_daemon_unknown_refuses_finally_and_external_retry(self):
        import json
        with tempfile.TemporaryDirectory() as directory:
            proof=pathlib.Path(directory)/'proof';calls=[];value=row();value['memory'].update(SwapTotal=m.GIB,SwapFree=m.GIB-123)
            for key in ['host','backing']:value[key].update(path=directory,device=1,filesystemId=2,blockBytes=4096,availableBlocks=64*m.GIB//4096)
            def child(command,*_,**__):calls.append(command[-1]);return {'exit':0,'errors':[],'allPipesDrainedAndChildWaited':True,'allOwnedClosureProven':True}
            def closure(*args, **kwargs):
                if args[3]=='build':raise ValueError('actual daemon closure unavailable')
                return {}
            env={'CABADRIVE_CI_PROOF':str(proof),'CI_SOURCE_SHA':'a'*40,'GITHUB_SERVER_URL':'https://github.com','GITHUB_REPOSITORY':'cucumberfalse/cabadrive','GITHUB_RUN_ID':'1','GITHUB_JOB':'docker-validation','GITHUB_RUN_ATTEMPT':'1'}
            before=os.umask(0o022);os.umask(before)
            try:
                with patch.dict(os.environ,env),patch.object(m,'topology',lambda _:{'backingPath':directory}),patch.object(m,'query',lambda _:'b'*40),patch.object(m,'sample_paths',lambda *_:value),patch.object(m,'history',lambda **_:[]),patch.object(m,'run_owned',child),patch.object(m,'terminal_tasks',closure):self.assertEqual(m.main(),1)
            finally:os.umask(before)
            receipt=json.loads((proof/'receipt.json').read_text());self.assertFalse(receipt['teardownSafe']);self.assertIsNone(receipt['makeDownExit']);self.assertEqual(calls,['install','browser','build'])

    def test_closed_pipe_descendant_is_not_group_closure(self):
        import json
        fixture=ResidualFixture();root=fixture.root;foreign=root/'foreign';foreign.write_text('unchanged');result=None
        payload=fixture.payload(closed_pipes=True)
        code="import subprocess,sys,pathlib,time;subprocess.Popen([sys.executable,'-c',"+repr(payload)+"]);deadline=time.monotonic()+3;\nwhile not pathlib.Path("+repr(str(root/'ready'))+").exists() and time.monotonic()<deadline:time.sleep(.01)"
        log=m.BoundedFile(root/'log',65536);series=m.BoundedFile(root/'samples',65536)
        try:
            fixture.launched=True
            with contextlib.redirect_stdout(io.TextIOWrapper(io.BytesIO())):
                result=m.run_owned([sys.executable,'-c',code],root,log,series,row,lambda _:None,{})
            fixture.bind(result['group'])
            self.assertTrue(result['allPipesDrainedAndChildWaited'])
            self.assertFalse(result['allOwnedClosureProven'])
            self.assertTrue(result['groupPresent']);self.assertTrue(result['groupClosureKnown'])
            self.assertIn(fixture.identity['pid'],[x['pid'] for x in result['residualGroupMembers']])
            self.assertNotEqual(fixture.identity['pid'],result['pid'])
            self.assertFalse(result['ownSigintSent']);self.assertTrue(result['errors'])
            self.assertEqual(foreign.read_text(),'unchanged')
        finally:
            try:fixture.finish()
            finally:log.file.close();series.file.close()
        self.assertTrue(fixture.terminal)
        self.assertTrue(fixture.ack_while_live)
        self.assertFalse(root.exists())

    def test_residual_fixture_early_failure_isolation_and_missing_ack_preserve_controls(self):
        first=ResidualFixture();second=ResidualFixture()
        try:
            self.assertIsNone(second.identity)
            self.assertFalse(second.launched)
            with self.assertRaisesRegex(RuntimeError,'before launch'):
                try:raise RuntimeError('before launch/result/ready assignment')
                finally:second.finish()
            self.assertFalse(second.root.exists())
            self.assertTrue(first.root.exists())
            self.assertIsNone(first.identity)
        finally:first.finish()
        early=ResidualFixture();process=None
        log=m.BoundedFile(early.root/'log',65536);series=m.BoundedFile(early.root/'samples',65536)
        try:
            with self.assertRaisesRegex(RuntimeError,'before result'):
                try:
                    process=subprocess.Popen([sys.executable,'-c',early.payload()],cwd=early.root,start_new_session=True)
                    early.launched=True
                    raise RuntimeError('before result/ready assignment')
                finally:
                    try:early.finish()
                    finally:log.file.close();series.file.close()
            self.assertTrue(early.terminal)
            self.assertTrue(early.ack_while_live)
            self.assertTrue(log.file.closed and series.file.closed)
            self.assertFalse(early.root.exists())
        finally:
            if process is not None:process.wait(timeout=3)
        fixture=ResidualFixture();process=None
        try:
            process=subprocess.Popen([sys.executable,'-c',fixture.payload(acknowledge=False,lifetime=1)],cwd=fixture.root,start_new_session=True)
            fixture.launched=True;fixture.bind(process.pid)
            with self.assertRaisesRegex(AssertionError,'ACK missing'):
                fixture.finish(timeout=.1)
            self.assertTrue(fixture.root.exists())
            # The failed cleanup is not reclassified as success. Independently wait for
            # this direct fixture child, then remove controls only after actual exit.
            self.assertEqual(process.wait(timeout=3),0)
            self.assertFalse(fixture.live())
        finally:
            if process is not None and process.poll() is None:
                (fixture.root/'release').write_text(fixture.token)
                (fixture.root/'exit-release').write_text(fixture.token)
                process.wait(timeout=3)
            if process is not None and process.poll() is not None:shutil.rmtree(fixture.root)

    def test_selector_failures_return_structured_hold_and_drain_large_finally(self):
        real=m.selectors.DefaultSelector
        for fault in ['register','select','unregister','close']:
            with tempfile.TemporaryDirectory(prefix='cabadrive-selector-fault-') as directory:
                root=pathlib.Path(directory);ready=root/'ready';foreign=root/'foreign';foreign.write_text('unchanged')
                code="""import signal,time,pathlib,sys
def stop(*_):raise KeyboardInterrupt()
signal.signal(signal.SIGINT,stop)
pathlib.Path('ready').write_text('ready')
try:
 print('active',flush=True)
 while True:time.sleep(.01)
finally:
 sys.stdout.write('x'*1048576);sys.stdout.flush();pathlib.Path('finally').write_text('done')
"""
                class Fault:
                    def __init__(self):self.inner=real();self.fired=False
                    def invoke(self,name,*args):
                        until=time.monotonic()+3
                        while not ready.exists() and time.monotonic()<until:time.sleep(.01)
                        # unregister/close fault is after an already issued stop.
                        if name==fault and not self.fired:
                            self.fired=True;raise OSError('injected selector '+name)
                        return getattr(self.inner,name)(*args)
                    def register(self,*args):return self.invoke('register',*args)
                    def select(self,*args):return self.invoke('select',*args)
                    def unregister(self,*args):return self.invoke('unregister',*args)
                    def close(self):return self.invoke('close')
                log=m.BoundedFile(root/'log',2*1024**2);series=m.BoundedFile(root/'samples',65536)
                def sample():
                    until=time.monotonic()+3
                    while not ready.exists() and time.monotonic()<until:time.sleep(.01)
                    return row()
                def check(_):
                    if fault in ['unregister','close']:raise ValueError('first resource failure')
                try:
                    with patch.object(m.selectors,'DefaultSelector',Fault),contextlib.redirect_stdout(io.TextIOWrapper(io.BytesIO())):
                        result=m.run_owned([sys.executable,'-c',code],root,log,series,sample,check,{})
                    self.assertTrue(result['allOwnedClosureProven'],result)
                    self.assertTrue(result['signalAttempted']);self.assertTrue(result['ownSigintSent'])
                    self.assertTrue(any('injected selector '+fault in item for item in result['errors']),result)
                    self.assertEqual((root/'finally').read_text(),'done')
                    self.assertGreaterEqual(result['drainedBytes']['stdout'],1048576)
                    self.assertEqual(result['openStreamIds'],[]);self.assertIsNotNone(result['stopStartedAt'])
                    self.assertEqual(foreign.read_text(),'unchanged')
                finally:log.file.close();series.file.close()

    def test_observed_history_and_inspect_have_intermediate_samples(self):
        with tempfile.TemporaryDirectory(prefix='cabadrive-query-observer-') as directory:
            root=pathlib.Path(directory);log=m.BoundedFile(root/'log',65536);series=m.BoundedFile(root/'samples',65536)
            result={};active=None;periodic=[];queries=[]
            def sample():
                if active is not None and (root/(active+'.ready')).exists():
                    periodic.append(active)
                    if periodic.count(active)>=2:(root/(active+'.release')).touch()
                return row()
            observer=m.Observation(root,log,series,sample,lambda value:m.validate(value,0,123,m.GIB),result)
            try:
                def observed_query(name,value):
                    nonlocal active
                    active=name;queries.append(name)
                    # The real owned process cannot finish until two observations
                    # occur while it is active, rather than just before/after it.
                    code="import pathlib,time,json; p=pathlib.Path("+repr(name)+"); pathlib.Path(str(p)+'.ready').touch(); end=time.monotonic()+20; " + "\nwhile not pathlib.Path(str(p)+'.release').exists():\n if time.monotonic()>end:raise RuntimeError('periodic observations missing')\n time.sleep(.01)\nprint("+repr(json.dumps(value))+")"
                    try:return json.loads(observer.query([sys.executable,'-c',code],timeout=25))
                    finally:active=None
                history_calls=0
                def history():
                    nonlocal history_calls
                    history_calls+=1
                    return observed_query('history'+str(history_calls),[{'ref':'default/default/current','status':'running' if history_calls==1 else 'completed'}])
                detail={'Ref':'current','Context':str(root),'Dockerfile':'Dockerfile','StartedAt':'2026-10-14T08:00:01+00:00','CompletedAt':'2026-10-14T08:01:00+00:00','Status':'completed'}
                waits=[]
                def controlled_wait(_):
                    import types
                    clock=[0.0];before=len(waits)
                    def wait_sample():waits.append(round(clock[0],3));return row()
                    def advance(seconds):clock[0]+=seconds
                    with patch.object(m,'time',types.SimpleNamespace(monotonic=lambda:clock[0],sleep=advance)):
                        waiting=m.Observation(root,log,series,wait_sample,lambda _:None,{})
                        waiting.wait(.6)
                    self.assertEqual(waits[before:],[0.0,.2,.4,.6])
                outcome=m.terminal_tasks([], '2026-10-14T08:00:00+00:00',root,'retention',True,history,lambda _:observed_query('inspect'+str(history_calls),detail),sleep=controlled_wait)
                self.assertEqual(outcome['observedCurrentRefs'],['default/default/current'])
                self.assertEqual(queries,['history1','history2','inspect2'])
                for name in queries:self.assertGreaterEqual(periodic.count(name),2)
                self.assertTrue(waits)
            finally:log.file.close();series.file.close()

    def test_observed_query_reserve_refusal_stops_real_owned_child(self):
        with tempfile.TemporaryDirectory(prefix='cabadrive-query-reserve-') as directory:
            root=pathlib.Path(directory);log=m.BoundedFile(root/'log',65536);series=m.BoundedFile(root/'samples',65536)
            result={};ready=root/'ready';foreign=root/'foreign';foreign.write_text('unchanged')
            def sample():
                value=row()
                if ready.exists():value['host']['freeBytes']=m.RESERVE-1
                return value
            observer=m.Observation(root,log,series,sample,lambda value:m.validate(value,0,123,m.GIB),result)
            code="""import signal,pathlib,time,os
def stop(*_):raise KeyboardInterrupt()
signal.signal(signal.SIGINT,stop)
try:
 pathlib.Path('ready').touch()
 while True:time.sleep(.01)
finally:
 assert (pathlib.Path(os.environ['CABADRIVE_CI_STOP_DIR'])/'stop.json').is_file()
 pathlib.Path('finally').write_text('done')
"""
            try:
                with self.assertRaises(ValueError):observer.query([sys.executable,'-c',code])
                outcome=result['failedQueryOutcomes'][-1]
                self.assertTrue(outcome['ownSigintSent']);self.assertTrue(outcome['allOwnedClosureProven'])
                self.assertEqual((root/'finally').read_text(),'done');self.assertEqual(foreign.read_text(),'unchanged')
            finally:log.file.close();series.file.close()

    def test_fresh_admission_after_history_prevents_allocator_and_detects_gap(self):
        import json
        for gap in [False,True]:
            with tempfile.TemporaryDirectory() as directory:
                proof=pathlib.Path(directory)/'proof';value=row();value['memory'].update(SwapTotal=m.GIB,SwapFree=m.GIB-123);calls=[]
                for key in ['host','backing']:value[key].update(path=directory,device=1,filesystemId=2,blockBytes=4096,availableBlocks=64*m.GIB//4096)
                def history(**_):
                    if gap:value['wall']+=6
                    else:value['host']['freeBytes']=m.RESERVE-1;value['host']['availableBlocks']=0
                    return []
                env={'CABADRIVE_CI_PROOF':str(proof),'CI_SOURCE_SHA':'a'*40,'GITHUB_SERVER_URL':'https://github.com','GITHUB_REPOSITORY':'cucumberfalse/cabadrive','GITHUB_RUN_ID':'1','GITHUB_JOB':'docker-validation','GITHUB_RUN_ATTEMPT':'1'}
                before=os.umask(0o022);os.umask(before)
                try:
                    with patch.dict(os.environ,env),patch.object(m,'topology',lambda _:{'backingPath':directory}),patch.object(m,'query',lambda _:'b'*40),patch.object(m,'sample_paths',lambda *_:dict(value)),patch.object(m,'history',history),patch.object(m,'run_owned',lambda command,*_,**__:calls.append(command)):
                        self.assertEqual(m.main(),1)
                finally:os.umask(before)
                receipt=json.loads((proof/'receipt.json').read_text());self.assertEqual(calls,[]);self.assertFalse(receipt['teardownSafe'])

    def test_missing_topology_is_not_vm_not_applicable(self):
        old = m.platform.system
        try:
            m.platform.system = lambda: 'Darwin'
            with self.assertRaises(ValueError): m.topology(pathlib.Path.cwd())
        finally: m.platform.system = old


class QueryCases(unittest.TestCase):
    @contextlib.contextmanager
    def mock_cli(self):
        import json
        with tempfile.TemporaryDirectory(prefix='cabadrive-query-contract-') as directory:
            root = pathlib.Path(directory).resolve()
            proof = root / 'proof'; proof.mkdir(mode=0o700)
            binary = root / 'docker'
            binary.write_text('#!' + sys.executable + '\n' + r'''import json,os,pathlib,sys,time
args=sys.argv[1:]
with open('calls.jsonl','a') as f:f.write(json.dumps(args)+'\n')
mode=os.environ.get('QUERY_CASE','normal')
if mode=='known-failure':
 sys.stderr.write('ERROR: mock query failed '+('x'*50));sys.exit(1)
if mode=='bad-json':print('not-json');sys.exit(0)
if mode=='large':sys.stderr.write('x'*70000);sys.stderr.flush();sys.exit(1)
if mode=='query-cap':sys.stdout.write('x'*(3*1024*1024));sys.stdout.flush();sys.exit(0)
if mode=='timeout':time.sleep(3)
if args[:3]==['buildx','history','ls']:
 for raw in ['first','second']:print(json.dumps({'ref':'chosen/node0/'+raw,'status':'completed'}))
elif args[:3]==['buildx','history','inspect']:
 if '--builder' not in args or args[args.index('--builder')+1]!='chosen' or '/' in args[-1]:
  sys.stderr.write('ERROR: raw reference and explicit matching builder required');sys.exit(1)
 raw=args[-1]
 print(json.dumps({'Ref':raw,'Context':os.getcwd(),'Dockerfile':'Dockerfile','Target':'stager' if raw=='first' else 'runtime','StartedAt':'2026-10-14T08:00:01+00:00','CompletedAt':'2026-10-14T08:01:00+00:00','Status':'completed'}))
 sys.stderr.write('WARNING: safe mock warning on stderr\n')
else:sys.exit(2)
''')
            binary.chmod(0o700)
            log = m.BoundedFile(proof / 'commands.log', 1024 ** 2)
            series = m.BoundedFile(proof / 'samples.jsonl', 1024 ** 2)
            result = {'currentStage':'build'}
            observer = m.Observation(root, log, series, row, lambda _:None, result)
            foreign=root/'foreign';foreign.write_text('unchanged')
            try:
                with patch.dict(os.environ, {'PATH':str(root)+os.pathsep+os.environ['PATH']}):
                    yield root, observer, result
                self.assertEqual(foreign.read_text(),'unchanged')
            finally:
                log.file.close();series.file.close()

    def test_real_cli_full_tuple_uses_explicit_builder_raw_id_and_separate_warning(self):
        import json
        with self.mock_cli() as (root, observer, result):
            value=m.terminal_tasks([], '2026-10-14T08:00:00+00:00',root,'build',True,observer=observer)
            self.assertEqual({p['Target'] for p in value['terminalTasks']},{'stager','runtime'})
            self.assertEqual(value['observedCurrentRefs'],['chosen/node0/first','chosen/node0/second'])
            calls=[json.loads(x) for x in (root/'calls.jsonl').read_text().splitlines()]
            inspections=[x for x in calls if x[:3]==['buildx','history','inspect']]
            self.assertEqual(inspections,[['buildx','history','inspect','--builder','chosen','--format=json',raw] for raw in ['first','second']])
            self.assertEqual({p['builder'] for p in value['terminalTasks']},{'chosen'})
            self.assertEqual({p['node'] for p in value['terminalTasks']},{'node0'})
            self.assertNotIn('queryFailureDiagnostics',result)

    def test_reference_malformed_duplicate_node_collision_and_wrong_response_ref_refuse(self):
        valid={'ref':'chosen/node0/first','status':'completed'}
        for rows in [[{'ref':'first'}],[{'ref':'chosen//first'}],[{'ref':'chosen/node0/first/extra'}],[valid,valid],[valid,{'ref':'chosen/node1/first'}],[valid,{'ref':'foreign/node0/second'}]]:
            with self.assertRaises(ValueError):m.history_identities(rows)
        with self.assertRaisesRegex(ValueError,'unexpected builder/node'):
            m.terminal_tasks([valid], '2026-10-14T08:00:00+00:00',pathlib.Path('/owned'),'retention',True,lambda:[valid,{'ref':'chosen/newnode/second','status':'completed'}])
        with self.assertRaises(ValueError):
            m.terminal_tasks([], '2026-10-14T08:00:00+00:00',pathlib.Path('/owned'),'retention',True,lambda:[valid],lambda _:{'Ref':'other','Context':'/owned','StartedAt':'2026-10-14T08:00:01+00:00','CompletedAt':'2026-10-14T08:01:00+00:00','Status':'completed'})

    def test_known_75_stderr_failure_is_persisted_before_hold_with_full_argv_and_lifecycle(self):
        import hashlib,json,stat
        with self.mock_cli() as (root,observer,result),patch.dict(os.environ,{'QUERY_CASE':'known-failure'}):
            args=['docker','buildx','history','inspect','--builder','chosen','--format=json','first']
            with self.assertRaisesRegex(ValueError,'query HOLD'):observer.query(args,history_identity={'fullRef':'chosen/node0/first','builder':'chosen','node':'node0','rawId':'first'})
            first=result['queryFailureDiagnostics'][0]
            self.assertTrue(first['persisted']);self.assertEqual(first['argv'],args)
            self.assertTrue(first['rawRunnerLocal']);self.assertFalse(first['rawUploaded']);self.assertFalse(first['rawAvailableAfterJob'])
            self.assertEqual(first['lifecycle']['historyIdentity'],{'fullRef':'chosen/node0/first','builder':'chosen','node':'node0','rawId':'first'})
            self.assertEqual(first['streams']['stderr']['bytesObserved'],75)
            self.assertEqual(first['streams']['stdout']['bytesObserved'],0)
            raw=pathlib.Path(first['privatePath']).read_bytes()
            self.assertEqual(raw,b'ERROR: mock query failed '+b'x'*50)
            self.assertEqual(first['privateSha256'],hashlib.sha256(raw).hexdigest())
            self.assertEqual(first['lifecycle']['exit'],1);self.assertEqual(first['lifecycle']['errors'],[])
            self.assertTrue(first['lifecycle']['allOwnedClosureProven'])
            self.assertEqual(stat.S_IMODE(pathlib.Path(first['privatePath']).stat().st_mode),0o600)
            saved=(root/'proof'/first['safePath']).read_bytes()
            self.assertNotIn(b'ERROR: mock',saved)
            with self.assertRaises(ValueError):observer.query(args)
            self.assertEqual((root/'proof'/first['safePath']).read_bytes(),saved)
            self.assertEqual(len(result['queryFailureDiagnostics']),2)

    def test_bad_json_diagnostic_overflow_and_four_record_cap(self):
        import json
        with self.mock_cli() as (root,observer,result):
            for mode in ['bad-json','large','known-failure','known-failure','known-failure']:
                with patch.dict(os.environ,{'QUERY_CASE':mode}),self.assertRaises(ValueError):
                    observer.query(['docker','buildx','history','inspect','--builder','chosen','--format=json','first'])
            records=result['queryFailureDiagnostics'];self.assertEqual(len(records),4)
            self.assertTrue(result['queryFailureRecordLimitExceeded'])
            self.assertEqual(records[0]['category'],'inspect-json-decode')
            second=records[1];self.assertFalse(second['streams']['stderr']['complete'])
            self.assertEqual(second['streams']['stderr']['bytesObserved'],70000)
            self.assertEqual(second['privateBytes'],65536)
            self.assertLessEqual(sum(p.stat().st_size for p in (root/'proof-query-private').glob('*.bin')),256*1024)

    def test_diagnostic_short_write_and_serialization_failures_do_not_hide_command_exit(self):
        for fault in ['short-write','serialization']:
            with self.mock_cli() as (root,observer,result),patch.dict(os.environ,{'QUERY_CASE':'known-failure'}):
                original_fdopen=m.os.fdopen; original_encode=m.encode
                class Short:
                    def __init__(inner,file):inner.file=file
                    def __enter__(inner):return inner
                    def __exit__(inner,*_):inner.file.close()
                    def write(inner,data):return inner.file.write(data[:-1])
                    def fileno(inner):return inner.file.fileno()
                def encode(value):
                    if isinstance(value,dict) and 'category' in value:raise TypeError('injected metadata serialization refusal')
                    return original_encode(value)
                mutation=patch.object(m.os,'fdopen',lambda *a,**kw:Short(original_fdopen(*a,**kw))) if fault=='short-write' else patch.object(m,'encode',encode)
                with mutation,self.assertRaisesRegex(ValueError,'query failure retained'):
                    observer.query(['docker','buildx','history','inspect','--builder','chosen','--format=json','first'])
                record=result['queryFailureDiagnostics'][0]
                self.assertFalse(record['persisted']);self.assertEqual(record['lifecycle']['exit'],1)
                self.assertEqual(record['diagnosticError'],'OSError' if fault=='short-write' else 'TypeError')
                self.assertEqual(result['lastQueryOutcome']['command'][-1],'first')

    def test_query_startup_failure_persists_unknown_closure_before_hold(self):
        with self.mock_cli() as (_,observer,result),patch.object(m,'run_owned',side_effect=OSError('injected startup failure')):
            with self.assertRaisesRegex(ValueError,'query HOLD'):
                observer.query(['docker','buildx','history','ls','--no-trunc','--format=json'])
            record=result['queryFailureDiagnostics'][0]
            self.assertTrue(record['persisted'])
            self.assertIsNone(record['lifecycle']['exit'])
            self.assertIsNone(record['lifecycle']['childStillAlive'])
            self.assertFalse(record['lifecycle']['allOwnedClosureProven'])
            self.assertEqual(record['lifecycle']['errors'],['OSError: query startup/receipt unavailable'])

    def test_query_cap_timeout_and_diagnostic_write_refusal_keep_original_failure(self):
        for mode in ['query-cap','timeout','known-failure']:
            with self.mock_cli() as (root,observer,result),patch.dict(os.environ,{'QUERY_CASE':mode}):
                refusal=patch.object(m.os,'open',side_effect=PermissionError('injected diagnostic refusal')) if mode=='known-failure' else contextlib.nullcontext()
                with refusal,self.assertRaises(ValueError):
                    observer.query(['docker','buildx','history','inspect','--builder','chosen','--format=json','first'],timeout=.15 if mode=='timeout' else 10)
                record=result['queryFailureDiagnostics'][0]
                self.assertEqual(record['lifecycle']['command'] if 'command' in record['lifecycle'] else record['argv'],record['argv'])
                if mode=='query-cap':self.assertTrue(record['outputCapExceeded'])
                if mode=='timeout':self.assertTrue(record['lifecycle']['boundedClosureDeadlineExceeded'])
                if mode=='known-failure':
                    self.assertFalse(record['persisted']);self.assertEqual(record['diagnosticError'],'PermissionError')
                    self.assertEqual(record['lifecycle']['exit'],1)
                self.assertFalse((root/'next-stage').exists())


class SeriesCases(unittest.TestCase):
    def sample(self):
        value = row()
        for index, name in enumerate(('host', 'backing')):
            value[name] = {'path': '/owned/' + name, 'device': index + 1,
                           'filesystemId': index + 2, 'blockBytes': 4096,
                           'availableBlocks': 123456, 'freeBytes': 505675777}
        # Intentionally independently measured, rather than inferred arithmetic.
        value['memory'].update(SwapTotal=1024, SwapFree=901)
        return value

    def assert_exact(self, before, after):
        self.assertEqual(m.encode(before), m.encode(after))
        if type(before) is dict:
            self.assertEqual(set(before), set(after))
            for key in before: self.assert_exact(before[key], after[key])
        else:
            self.assertIs(type(before), type(after))

    def test_versioned_and_legacy_exact_roundtrip_and_topology_frames(self):
        values = [self.sample()]
        second = copy.deepcopy(values[0]); second['wall'] = 123; second['monotonic'] = 456.0
        second['host']['device'] = 99; second['backing']['path'] = '/different/backing'
        values.append(second)
        third = copy.deepcopy(second); third['at'] = '2026-10-14T00:00:00.' + '1' * 90 + '+00:00'
        third['memory'] = {key: 2**64-1 for key in m.MEMORY_KEYS}
        for name in ('host', 'backing'):
            third[name].update(availableBlocks=2**64-1, freeBytes=2**64-1)
        third['swapUsedBytes'] = 2**64-1
        values.append(third)
        with tempfile.TemporaryDirectory() as directory:
            series = m.SampleSeries(pathlib.Path(directory) / 'series')
            try:
                for value in values: series.append_sample(value)
                actual = list(m.read_samples(io.BytesIO(pathlib.Path(series.file.name).read_bytes())))
                for original, decoded in zip(values, actual): self.assert_exact(original, decoded)
                self.assertEqual(len(actual), 3)
                self.assertEqual(series.stats['topologyFrames'], 1)
                self.assertEqual(series.stats['fullFrames'], 1)
                self.assertEqual(series.stats['samples'], 3)
                self.assertLessEqual(series.summary()['maximumHeaderBytes'], 4096)
                self.assertEqual(series.summary()['stableHeaderConservativeSlots'], 24560)
                self.assertEqual(series.summary()['bytes'], pathlib.Path(series.file.name).stat().st_size)
                legacy = b''.join(m.encode(value) for value in values)
                for original, decoded in zip(values, m.read_samples(io.BytesIO(legacy))): self.assert_exact(original, decoded)
            finally: series.file.close()

    def test_key_type_anomaly_and_oversized_frame_refusals(self):
        changes = [lambda x: x.update(extra=1), lambda x: x.update(wall=float('nan')),
                   lambda x: x.update(monotonic=-1), lambda x: x['host'].update(device=True),
                   lambda x: x['host'].update(freeBytes=2**64), lambda x: x['memory'].update(MemAvailable=-1),
                   lambda x: x['host'].update(path='relative'), lambda x: x['memory'].update(extra=0),
                   lambda x: x.update(at='not-a-timestamp'), lambda x: x['host'].update(path='/'+'x'*4096)]
        with tempfile.TemporaryDirectory() as directory:
            for index, change in enumerate(changes):
                series=m.SampleSeries(pathlib.Path(directory)/str(index)); value=self.sample(); change(value)
                try:
                    with self.assertRaises((ValueError, TypeError)):series.append_sample(value)
                    self.assertEqual(series.size, 0)
                    self.assertTrue(series.summary()['incomplete'])
                    if series.summary()['appendable']:
                        series.append_sample(self.sample())
                        self.assertEqual(series.stats['samples'],1)
                finally:series.file.close()

    def test_reader_rejects_unknown_duplicate_inconsistent_truncated_and_invalid_frames(self):
        value = self.sample(); metadata = m.sample_metadata(value)
        header = m.compact_json([m.SERIES_MAGIC, 1, *metadata])
        sample = m.compact_json(['s', *m.sample_values(value)])
        changed = copy.deepcopy(metadata); changed[0][1] = 3
        cases = [b'', header, header+sample[:-1], header+header+sample,
                 m.compact_json([m.SERIES_MAGIC, True, *metadata])+sample,
                 m.compact_json([m.SERIES_MAGIC, 2, *metadata])+sample,
                 header+m.compact_json(['t', *metadata])+sample,
                 header+m.compact_json(['t', *changed]),
                 header+m.compact_json(['t', *changed])+m.compact_json(['t', *metadata])+sample,
                 header+m.compact_json(['s', *m.sample_values(value)[:-1]]),
                 header+m.compact_json(['s', 'x'*4096]), header+b'["s",NaN]\n',
                 header+b'\xff\n', header+b'{"x":1,"x":2}\n',
                 header+m.compact_json(['f', {**value,'host':{**value['host'],'device':99}}])]
        for scalar in [True, 1.0, -1, 2**64]:
            changed_values=m.sample_values(value); changed_values[4]=scalar
            cases.append(header+m.compact_json(['s',*changed_values]))
        for raw in cases:
            with self.subTest(raw=raw[:80]), self.assertRaises((ValueError, UnicodeError)):
                list(m.read_samples(io.BytesIO(raw)))

    def test_exact_byte_ledger_boundary_and_one_byte_overflow_are_incomplete(self):
        value=self.sample()
        required=len(m.compact_json([m.SERIES_MAGIC,1,*m.sample_metadata(value)]))+len(m.compact_json(['s',*m.sample_values(value)]))
        with tempfile.TemporaryDirectory() as directory:
            for cap in [required,required-1]:
                series=m.SampleSeries(pathlib.Path(directory)/str(cap),cap=cap)
                try:
                    if cap==required:
                        series.append_sample(value)
                        self.assertEqual(series.size,cap)
                        self.assertEqual(series.summary()['remainingBytes'],0)
                        with self.assertRaisesRegex(ValueError,'series cap'):series.append_sample(value)
                        self.assertEqual(len(list(m.read_samples(io.BytesIO(pathlib.Path(series.file.name).read_bytes())))),1)
                    else:
                        with self.assertRaisesRegex(ValueError,'series cap'):series.append_sample(value)
                        self.assertEqual(series.size,0)
                    self.assertTrue(series.summary()['incomplete'])
                    with self.assertRaisesRegex(ValueError,'append disabled'):series.append_sample(value)
                finally:series.file.close()

    def test_sample_sink_short_write_and_oserror_permanently_refuse_append(self):
        with tempfile.TemporaryDirectory() as directory:
            for fault in ['short','error']:
                series=m.SampleSeries(pathlib.Path(directory)/fault)
                real=series.file
                class Sink:
                    def write(self,data):
                        if fault=='error':raise OSError('injected sample sink ENOSPC')
                        return real.write(data[:-1])
                series.file=Sink()
                try:
                    with self.assertRaises(OSError):series.append_sample(self.sample())
                    self.assertTrue(series.summary()['incomplete'])
                    with self.assertRaises(ValueError):series.append_sample(self.sample())
                    with self.assertRaises(ValueError):list(m.read_samples(io.BytesIO(pathlib.Path(real.name).read_bytes())))
                finally:real.close()

    def test_controlled_allowed_1787_gap_and_invalid_clock_rows_remain_recorded(self):
        with tempfile.TemporaryDirectory() as directory:
            series=m.SampleSeries(pathlib.Path(directory)/'series');result={};expected=[]
            try:
                for offset,invalid in [(0,False),(1.787,False),(7.788,True),(8,False),(7,True),(9,False)]:
                    value=self.sample();value['wall']=1000+offset;value['monotonic']=100+len(expected)
                    expected.append(value)
                    if invalid:
                        with self.assertRaisesRegex(ValueError,'wall sample gap/jump'):m.observe(lambda:value,lambda _:None,series,result)
                    else:m.observe(lambda:value,lambda _:None,series,result)
                with open(series.file.name,'rb') as source:stored=list(m.read_samples(source))
                self.assertEqual(len(stored),len(expected))
                for actual,wanted in zip(stored,expected):self.assert_exact(actual,wanted)
                self.assertTrue(result['seriesObservation']['acceptanceHold'])
                self.assertFalse(result['seriesObservation']['incomplete'])
                self.assertEqual(result['seriesObservation']['failed'],2)
                self.assertTrue(series.summary()['appendable'])
            finally:series.file.close()

    def test_sample_gap_error_and_postappend_check_failure_are_explicit(self):
        with tempfile.TemporaryDirectory() as directory:
            for fault in ['sample','gap','backward','check']:
                series=m.SampleSeries(pathlib.Path(directory)/fault); result={}; value=self.sample()
                if fault=='gap': result['lastSample']={**value,'wall':value['wall']-6}
                if fault=='backward': result['lastSample']={**value,'wall':value['wall']+6}
                def source():
                    if fault=='sample': raise OSError('sample unavailable')
                    return value
                def check(_):
                    if fault=='check':raise ValueError('resource threshold HOLD')
                try:
                    with self.assertRaises((OSError,ValueError)):m.observe(source,check,series,result)
                    state=result['seriesObservation']
                    self.assertEqual(state['attempted'],1);self.assertEqual(state['failed'],1)
                    self.assertEqual(state['persisted'],int(fault!='sample'))
                    self.assertEqual(state['incomplete'],fault=='sample')
                    self.assertEqual(series.summary()['incomplete'],fault=='sample')
                    self.assertTrue(state['acceptanceHold']);self.assertTrue(series.summary()['appendable'])
                    self.assertIn('firstError',state)
                    later=copy.deepcopy(value);later['wall']+=1;later['monotonic']+=1
                    m.observe(lambda:later,lambda _:None,series,result)
                    with open(series.file.name,'rb') as source:
                        stored=list(m.read_samples(source))
                    self.assertEqual(len(stored),1+int(fault!='sample'))
                    self.assert_exact(stored[-1],later)
                finally:series.file.close()

    def test_resource_crossing_keeps_healthy_stop_and_finally_samples(self):
        with tempfile.TemporaryDirectory() as directory:
            root=pathlib.Path(directory); ready=root/'ready'; foreign=root/'foreign';foreign.write_text('unchanged')
            log=m.BoundedFile(root/'log',2*1024**2);series=m.SampleSeries(root/'series');result={};calls=0
            code="""import pathlib,signal,time,sys,os
def stop(*_):raise KeyboardInterrupt()
signal.signal(signal.SIGINT,stop)
pathlib.Path('ready').write_text('ready')
try:
 while True:time.sleep(.01)
finally:
 assert (pathlib.Path(os.environ['CABADRIVE_CI_STOP_DIR'])/'stop.json').is_file()
 sys.stdout.write('x'*1048576);sys.stdout.flush();pathlib.Path('finally').write_text('done')
"""
            def source():
                nonlocal calls
                until=time.monotonic()+3
                while not ready.exists() and time.monotonic()<until:time.sleep(.01)
                value=self.sample();calls+=1
                for name in ('host','backing'):value[name].update(freeBytes=64*m.GIB,availableBlocks=64*m.GIB//4096)
                if calls==1:value['host']['freeBytes']=m.RESERVE-1
                return value
            try:
                with contextlib.redirect_stdout(io.TextIOWrapper(io.BytesIO())),patch.object(m.os,'killpg',wraps=m.os.killpg) as interrupt:
                    outcome=m.run_owned([sys.executable,'-c',code],root,log,series,source,lambda value:m.validate(value,0,123,m.GIB),result)
                self.assertEqual(interrupt.call_count,1);self.assertTrue(outcome['ownSigintSent'])
                self.assertTrue(outcome['allOwnedClosureProven']);self.assertTrue(outcome['errors'])
                state=result['seriesObservation'];self.assertTrue(state['acceptanceHold']);self.assertFalse(state['incomplete'])
                self.assertEqual(state['attempted'],state['persisted']);self.assertGreaterEqual(state['persisted'],2)
                self.assertFalse(series.summary()['incomplete']);self.assertTrue(series.summary()['appendable'])
                with open(series.file.name,'rb') as source_file:stored=list(m.read_samples(source_file))
                self.assertEqual(len(stored),calls);self.assertEqual(stored[0]['host']['freeBytes'],m.RESERVE-1)
                self.assertEqual(stored[-1]['host']['freeBytes'],64*m.GIB)
                self.assertEqual((root/'finally').read_text(),'done');self.assertEqual(foreign.read_text(),'unchanged');self.assertFalse((root/'next').exists())
            finally:log.file.close();series.file.close()

    def test_cap_abort_keeps_real_owned_child_finally_and_refuses_next_stage(self):
        with tempfile.TemporaryDirectory() as directory:
            root=pathlib.Path(directory); ready=root/'ready'; log=m.BoundedFile(root/'log',2*1024**2)
            series=m.SampleSeries(root/'series',cap=1); result={}
            code="""import pathlib,signal,time,sys
def stop(*_):raise KeyboardInterrupt()
signal.signal(signal.SIGINT,stop)
pathlib.Path('ready').write_text('ready')
try:
 while True:time.sleep(.01)
finally:
 sys.stdout.write('x'*1048576);sys.stdout.flush();pathlib.Path('finally').write_text('done')
"""
            def source():
                until=time.monotonic()+3
                while not ready.exists() and time.monotonic()<until:time.sleep(.01)
                return self.sample()
            try:
                with contextlib.redirect_stdout(io.TextIOWrapper(io.BytesIO())):
                    outcome=m.run_owned([sys.executable,'-c',code],root,log,series,source,lambda _:None,result)
                self.assertTrue(outcome['ownSigintSent']);self.assertTrue(outcome['allOwnedClosureProven'])
                self.assertTrue(outcome['errors']);self.assertTrue(result['seriesObservation']['incomplete'])
                self.assertEqual(result['seriesObservation']['persisted'],0)
                self.assertEqual((root/'finally').read_text(),'done');self.assertFalse((root/'next').exists())
            finally:log.file.close();series.file.close()
        # The real main status may not upgrade an incomplete series to PASS.
        with tempfile.TemporaryDirectory() as directory:
            proof=pathlib.Path(directory)/'proof'; value=self.sample(); allocations=[]
            real_series=m.SampleSeries
            class TinySeries(real_series):
                def __init__(self,path):super().__init__(path,cap=1)
            env={'CABADRIVE_CI_PROOF':str(proof),'CI_SOURCE_SHA':'a'*40,'GITHUB_SERVER_URL':'https://github.com','GITHUB_REPOSITORY':'cucumberfalse/cabadrive','GITHUB_RUN_ID':'1','GITHUB_JOB':'docker-validation','GITHUB_RUN_ATTEMPT':'1'}
            before=os.umask(0o022);os.umask(before)
            try:
                with patch.dict(os.environ,env),patch.object(m,'SampleSeries',TinySeries),patch.object(m,'topology',lambda _:{'backingPath':directory}),patch.object(m,'query',lambda _:'b'*40),patch.object(m,'sample_paths',lambda *_:value),patch.object(m,'validate',lambda *_:None),patch.object(m,'history',lambda **_:[]),patch.object(m,'run_owned',lambda *args,**kw:allocations.append(args)):
                    self.assertEqual(m.main(),1)
            finally:os.umask(before)
            receipt=json.loads((proof/'receipt.json').read_text())
            self.assertEqual(receipt['status'],'HOLD');self.assertEqual(allocations,[])
            self.assertTrue(receipt['sampleSeries']['incomplete']);self.assertTrue(receipt['seriesObservation']['incomplete'])


if __name__ == '__main__':
    suite = unittest.defaultTestLoader.loadTestsFromModule(sys.modules[__name__])
    result = unittest.TextTestRunner(verbosity=2).run(suite)
    if result.wasSuccessful(): print('LINUX_RESOURCE_REGRESSIONS_PASS')
    sys.exit(0 if result.wasSuccessful() else 1)
