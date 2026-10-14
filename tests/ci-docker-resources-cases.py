import contextlib
import io
import importlib.util
import os
import pathlib
import sys
import tempfile
import time
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('resources', 'scripts/ci-docker-resources.py')
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)


def row():
    return {'at': m.utc(), 'wall': time.time(), 'monotonic': time.monotonic(),
            'host': {'freeBytes': 64 * m.GIB}, 'backing': {'freeBytes': 64 * m.GIB},
            'memory': {'MemAvailable': 2 * m.GIB}, 'swapUsedBytes': 123}


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
            with tempfile.TemporaryDirectory(prefix='cabadrive-ci-residual-') as directory:
                root=pathlib.Path(directory);release=root/'release';ready=root/'ready'
                payload="import os,signal,time,pathlib;signal.signal(signal.SIGINT,signal.SIG_IGN);pathlib.Path('ready').write_text(str(os.getpid()));\nwhile not pathlib.Path('release').exists():time.sleep(.01)"
                command=[sys.executable,'-c',payload]
                if descendant:
                    command=[sys.executable,'-c',"import subprocess,sys;subprocess.Popen([sys.executable,'-c',"+repr(payload)+"])"]
                log=m.BoundedFile(root/'log',65536);series=m.BoundedFile(root/'samples',65536)
                def sample():
                    until=time.monotonic()+3
                    while not ready.exists() and time.monotonic()<until:time.sleep(.01)
                    return row()
                def check(_):
                    if not descendant:raise ValueError('controlled reserve failure')
                try:
                    with contextlib.redirect_stdout(io.TextIOWrapper(io.BytesIO())), (patch.object(m.os,'replace',side_effect=PermissionError('injected marker refusal')) if refused else contextlib.nullcontext()):
                        result=m.run_owned(command,root,log,series,sample,(lambda _:None) if down else check,{},stop_grace=.15,can_interrupt=not down,total_seconds=.2 if down else None)
                    self.assertTrue(result['boundedClosureDeadlineExceeded'])
                    self.assertFalse(result['allPipesDrainedAndChildWaited'])
                    self.assertTrue(result['pipesOpen'])
                    self.assertEqual(result['childStillAlive'],not descendant)
                    self.assertEqual(result['ownSigintSent'],not (descendant or refused or down))
                finally:
                    release.write_text('release exact test-owned child without another signal')
                    if 'result' in locals():
                        try:os.waitpid(result['pid'],0)
                        except ChildProcessError:pass
                    log.file.close();series.file.close()

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
        with tempfile.TemporaryDirectory(prefix='cabadrive-ci-group-') as directory:
            root=pathlib.Path(directory); release=root/'release'; done=root/'done'; foreign=root/'foreign'
            foreign.write_text('unchanged')
            payload="import os,time,pathlib;os.close(1);os.close(2);pathlib.Path('ready').write_text(str(os.getpid()));\nwhile not pathlib.Path('release').exists():time.sleep(.01)\npathlib.Path('done').write_text('done')"
            code="import subprocess,sys,pathlib,time;subprocess.Popen([sys.executable,'-c',"+repr(payload)+"]);\nwhile not pathlib.Path('ready').exists():time.sleep(.01)"
            log=m.BoundedFile(root/'log',65536);series=m.BoundedFile(root/'samples',65536)
            try:
                with contextlib.redirect_stdout(io.TextIOWrapper(io.BytesIO())):
                    result=m.run_owned([sys.executable,'-c',code],root,log,series,row,lambda _:None,{})
                self.assertTrue(result['allPipesDrainedAndChildWaited'])
                self.assertFalse(result['allOwnedClosureProven'])
                self.assertTrue(result['groupPresent']);self.assertTrue(result['groupClosureKnown'])
                self.assertIn(int((root/'ready').read_text()),[x['pid'] for x in result['residualGroupMembers']])
                self.assertFalse(result['ownSigintSent']);self.assertTrue(result['errors'])
                self.assertEqual(foreign.read_text(),'unchanged')
            finally:
                release.write_text('release exact owned fixture')
                until=time.monotonic()+3
                while not done.exists() and time.monotonic()<until:time.sleep(.01)
                self.assertTrue(done.exists());log.file.close();series.file.close()

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

    def test_observed_slow_history_inspect_and_wait_and_reserve_refusal(self):
        import json
        with tempfile.TemporaryDirectory(prefix='cabadrive-query-observer-') as directory:
            root=pathlib.Path(directory);log=m.BoundedFile(root/'log',65536);series=m.BoundedFile(root/'samples',65536)
            result={};calls=[]
            def sample():calls.append(time.monotonic());return row()
            observer=m.Observation(root,log,series,sample,lambda value:m.validate(value,0,123,m.GIB),result)
            try:
                # Real owned query subprocesses stand in for read-only Docker CLI.
                def delayed(value):return observer.query([sys.executable,'-c','import time;time.sleep(1.1);print('+repr(json.dumps(value))+')'])
                history_calls=0
                def history():
                    nonlocal history_calls
                    history_calls+=1
                    return json.loads(delayed([{'ref':'default/default/current','status':'running' if history_calls==1 else 'completed'}]))
                detail={'Ref':'current','Context':str(root),'Dockerfile':'Dockerfile','StartedAt':'2026-10-14T08:00:01+00:00','CompletedAt':'2026-10-14T08:01:00+00:00','Status':'completed'}
                outcome=m.terminal_tasks([], '2026-10-14T08:00:00+00:00',root,'retention',True,history,lambda _:json.loads(delayed(detail)),sleep=lambda _:observer.wait(.3))
                self.assertEqual(outcome['observedCurrentRefs'],['default/default/current'])
                self.assertGreaterEqual(len(calls),8)
                self.assertLessEqual(max(b-a for a,b in zip(calls,calls[1:])),1.3)
                started=time.monotonic()
                def low_sample():
                    value=row()
                    if time.monotonic()-started>0.3:value['host']['freeBytes']=m.RESERVE-1
                    return value
                observer.sample=low_sample
                with self.assertRaises(ValueError):delayed('must not admit another allocator')
                self.assertTrue(result['failedQueryOutcomes'][-1]['ownSigintSent'])
                self.assertTrue(result['failedQueryOutcomes'][-1]['allOwnedClosureProven'])
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


if __name__ == '__main__':
    suite = unittest.defaultTestLoader.loadTestsFromTestCase(Cases)
    result = unittest.TextTestRunner(verbosity=2).run(suite)
    if result.wasSuccessful(): print('LINUX_RESOURCE_REGRESSIONS_PASS')
    sys.exit(0 if result.wasSuccessful() else 1)
