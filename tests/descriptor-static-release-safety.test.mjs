import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";

const modulePath =
  process.env.CABADRIVE_DESCRIPTOR_TEST_MODULE ||
  new URL("../scripts/stage-static-release.mjs", import.meta.url).pathname;
const prelude = `
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
const root=fs.realpathSync(fs.mkdtempSync(join(tmpdir(),'cabadrive-descriptor-')));
const stager=await import(${JSON.stringify(modulePath)});
function replace(path,kind) {
  fs.renameSync(path,path+'.original');
  if(kind==='symlink') fs.symlinkSync(join(root,'foreign'),path);
  else if(kind==='fifo') execFileSync('mkfifo',[path]);
  else fs.writeFileSync(path,'foreign-project\\n');
}
fs.writeFileSync(join(root,'foreign'),'foreign-project\\n');
try {
`;
function worker(body) {
  const result = spawnSync(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      prelude + body + `\n} finally { fs.rmSync(root,{recursive:true,force:true}); }`,
    ],
    {
      timeout: 10000,
      encoding: "utf8",
      env: { ...process.env, CABADRIVE_TEST_KERNEL_LOCK: "in-process" },
    },
  );
  assert.equal(result.error, undefined, result.error?.message);
  assert.equal(result.status, 0, result.stderr || result.stdout);
}

test("hashing rejects descriptor/path substitution and prompt-rejects unsafe source types", () => {
  for (const kind of ["regular", "symlink", "fifo"])
    for (const when of ["before-open", "after-open"])
      worker(`
    const candidate=join(root,'candidate'); fs.mkdirSync(join(candidate,'assets'),{recursive:true});
    const target=join(candidate,'assets','a.js'); fs.writeFileSync(target,'original bytes');
    fs.writeFileSync(join(candidate,'index.html'),'shell'); fs.writeFileSync(join(candidate,'sw.js'),'worker');
    const originalOpen=fs.openSync; let changed=false;
    fs.openSync=(path,...args)=>{
      if(path!==target || changed) return originalOpen(path,...args);
      changed=true;
      if(${JSON.stringify(when)}==='before-open') replace(target,${JSON.stringify(kind)});
      const descriptor=originalOpen(path,...args);
      if(${JSON.stringify(when)}==='after-open') replace(target,${JSON.stringify(kind)});
      return descriptor;
    }; syncBuiltinESMExports();
    try { if(${JSON.stringify(when)}==='before-open' && ${JSON.stringify(kind)}==='regular') assert.equal(stager.createCandidateManifest(candidate).assets[0].size,fs.readFileSync(target).byteLength); else assert.throws(()=>stager.createCandidateManifest(candidate)); }
    finally { fs.openSync=originalOpen; syncBuiltinESMExports(); }
    assert.equal(changed,true);
    assert.equal(fs.readFileSync(join(root,'foreign'),'utf8'),'foreign-project\\n');
  `);
});

test("adopted project read and claim retain exact descriptor authority across callbacks", () => {
  for (const kind of ["regular", "symlink", "fifo"])
    for (const operation of ["read-open", "claim", "write-sync", "read-sync", "parent-sync"])
      worker(`
    const handoff=join(root,'handoff'); fs.mkdirSync(handoff); const record=join(handoff,'.adopted-project');
    const kind=${JSON.stringify(kind)}; const operation=${JSON.stringify(operation)};
    let changed=false;
    const mutate=(path)=>{ if(changed)return; changed=true; replace(path,kind); };
    if(operation.startsWith('read')) fs.writeFileSync(record,'original-project\\n');
    const originalOpen=fs.openSync;
    if(operation==='read-open') { fs.openSync=(path,...args)=>{ const fd=originalOpen(path,...args); if(path===record)mutate(path); return fd; }; syncBuiltinESMExports(); }
    const options={handoffRoot:handoff,project:'original-project',
      onBeforeAdoptedProjectClaim:({temporary})=>{if(operation==='claim')mutate(temporary);},
      onDurabilityOperation:({operation:op,path})=>{
        if(operation==='write-sync'&&op==='fsync-file')mutate(path);
        if(operation==='read-sync'&&op==='fsync-file')mutate(path);
        if(operation==='parent-sync'&&op==='fsync-directory')mutate(record);
      }};
    try { assert.throws(()=>operation.startsWith('read')?stager.verifyAdoptedProject(options):stager.writeAdoptedProject(options)); }
    finally { fs.openSync=originalOpen; syncBuiltinESMExports(); }
    assert.equal(changed,true);
    assert.equal(fs.readFileSync(join(root,'foreign'),'utf8'),'foreign-project\\n');
    if(operation==='claim'||operation==='write-sync') assert.equal(fs.existsSync(record),false);
    const replaced=operation==='claim'||operation==='write-sync'?fs.readdirSync(handoff).find(name=>name.startsWith('.adopted-project.next-')&&!name.endsWith('.original')):'.adopted-project';
    assert.ok(replaced); assert.ok(fs.lstatSync(join(handoff,replaced)));
  `);
});

test("adopted project rejects a replaced handoff root at its parent barrier", () =>
  worker(`
  const handoff=join(root,'handoff'); fs.mkdirSync(handoff); fs.writeFileSync(join(handoff,'.adopted-project'),'original-project\\n');
  assert.throws(()=>stager.verifyAdoptedProject({handoffRoot:handoff,onDurabilityOperation:({operation})=>{
    if(operation==='fsync-directory'){ fs.renameSync(handoff,handoff+'.original'); fs.mkdirSync(handoff); fs.writeFileSync(join(handoff,'.adopted-project'),'foreign-project\\n'); }
  }}));
  assert.equal(fs.readFileSync(join(handoff,'.adopted-project'),'utf8'),'foreign-project\\n');
`));

test("export handback rejects replacement before changing foreign ownership", () => {
  for (const kind of ["hardlink", "symlink", "fifo", "directory"])
    worker(`
    const candidate=join(root,'candidate'); fs.mkdirSync(join(candidate,'assets'),{recursive:true});
    fs.writeFileSync(join(candidate,'assets','a.js'),'asset'); fs.writeFileSync(join(candidate,'index.html'),'shell'); fs.writeFileSync(join(candidate,'sw.js'),'worker');
    const state=join(root,'state'), output=join(root,'publish'), destination=join(root,'export');
    stager.buildStaticPublish({stateRoot:state,candidateRoot:candidate,outputRoot:output});
    const foreign=join(root,'foreign'), before=fs.lstatSync(foreign); let changed=false;
    assert.throws(()=>stager.exportStaticPublish({stateRoot:state,candidateRoot:candidate,outputRoot:output,destinationRoot:destination,
      options:{ownerUid:process.getuid()===0?12345:process.getuid(),ownerGid:process.getgid()===0?12345:process.getgid(),
        onBeforeOwnershipChange:({path})=>{ if(changed||!path.endsWith('/assets/a.js'))return; changed=true; fs.renameSync(path,path+'.original');
          const kind=${JSON.stringify(kind)}; if(kind==='hardlink')fs.linkSync(foreign,path); else if(kind==='directory')fs.mkdirSync(path); else if(kind==='symlink')fs.symlinkSync(foreign,path); else execFileSync('mkfifo',[path]);
        }}}));
    assert.equal(changed,true);
    const after=fs.lstatSync(foreign); assert.equal(after.uid,before.uid); assert.equal(after.gid,before.gid);
    assert.equal(fs.readFileSync(foreign,'utf8'),'foreign-project\\n');
  `);
});

test("copied inventory rejects a substituted next source without following FIFO or symlink", () => {
  for (const kind of ["fifo", "symlink", "regular"])
    worker(`
    const candidate=join(root,'candidate'); fs.mkdirSync(join(candidate,'assets'),{recursive:true});
    fs.writeFileSync(join(candidate,'assets','a.js'),'assetA'); const next=join(candidate,'assets','b.js');fs.writeFileSync(next,'assetB');
    fs.writeFileSync(join(candidate,'index.html'),'shell');fs.writeFileSync(join(candidate,'sw.js'),'worker');let changed=false;
    assert.throws(()=>stager.stageStaticRelease({stateRoot:join(root,'state'),candidateRoot:candidate,onDurabilityOperation:({operation,path})=>{
      if(!changed&&operation==='fsync-file'&&path.endsWith('/a.js')){changed=true;replace(next,${JSON.stringify(kind)});}
    }}));
    assert.equal(changed,true);assert.equal(fs.readFileSync(join(root,'foreign'),'utf8'),'foreign-project\\n');
  `);
});

test("hashing rejects inline mutation even when size and mtime are restored", () =>
  worker(`
  const candidate=join(root,'candidate');fs.mkdirSync(join(candidate,'assets'),{recursive:true});
  const target=join(candidate,'assets','a.js');fs.writeFileSync(target,'AAAAAAAA');
  fs.writeFileSync(join(candidate,'index.html'),'shell');fs.writeFileSync(join(candidate,'sw.js'),'worker');
  const stamp=fs.statSync(target);const originalOpen=fs.openSync,originalRead=fs.readSync;let held,changed=false;
  fs.openSync=(path,...args)=>{const fd=originalOpen(path,...args);if(path===target)held=fd;return fd;};
  fs.readSync=(fd,...args)=>{const count=originalRead(fd,...args);if(fd===held&&!changed){changed=true;fs.writeFileSync(target,'BBBBBBBB');fs.utimesSync(target,stamp.atime,stamp.mtime);}return count;};syncBuiltinESMExports();
  try{assert.throws(()=>stager.createCandidateManifest(candidate));}finally{fs.openSync=originalOpen;fs.readSync=originalRead;syncBuiltinESMExports();}
  assert.equal(changed,true);
`));

test("adopted claim permits only its own link count and ctime transitions", () => {
  for (const operation of ["link", "unlink"])
    worker(`
    const handoff=join(root,'handoff');fs.mkdirSync(handoff);const record=join(handoff,'.adopted-project');
    const original=fs[${JSON.stringify(operation + "Sync")}];let changed=false;
    fs[${JSON.stringify(operation + "Sync")}]=(...args)=>{const result=original(...args);if(!changed&&String(args[0]).includes('.adopted-project.next-')){changed=true;fs.chmodSync(record,0o000);}return result;};syncBuiltinESMExports();
    try{assert.throws(()=>stager.writeAdoptedProject({handoffRoot:handoff,project:'original-project'}));}
    finally{fs[${JSON.stringify(operation + "Sync")}]=original;syncBuiltinESMExports();fs.chmodSync(record,0o600);}
    assert.equal(changed,true);
  `);
});

test("shared legacy and candidate bundles retain exact overlap admission", () =>
  worker(`
  const candidate=join(root,'candidate'), legacy=join(root,'legacy');
  for(const directory of [candidate,legacy]){fs.mkdirSync(join(directory,'assets'),{recursive:true});fs.writeFileSync(join(directory,'assets','same.js'),'same bytes');}
  fs.writeFileSync(join(candidate,'index.html'),'shell');fs.writeFileSync(join(candidate,'sw.js'),'worker');
  stager.writeLegacyHandoffManifest({legacyRoot:legacy,sourceId:'legacy',sourceKind:'baked-legacy-root'});
  stager.stageStaticRelease({stateRoot:join(root,'state'),candidateRoot:candidate,legacyRoot:legacy});
  assert.equal(stager.verifyCommittedState(join(root,'state')).valid,true);
  fs.writeFileSync(join(candidate,'assets','same.js'),'different bytes');
  assert.throws(()=>stager.stageStaticRelease({stateRoot:join(root,'state'),candidateRoot:candidate,legacyRoot:legacy}),/collision/);
`));

test("equal-byte injected copy hard links cannot change external ownership", () =>
  worker(`
  const candidate=join(root,'candidate');fs.mkdirSync(join(candidate,'assets'),{recursive:true});
  fs.writeFileSync(join(candidate,'assets','a.js'),'assetA');fs.writeFileSync(join(candidate,'assets','b.js'),'assetB');
  fs.writeFileSync(join(candidate,'index.html'),'shell');fs.writeFileSync(join(candidate,'sw.js'),'worker');
  const foreign=join(root,'foreign');fs.writeFileSync(foreign,'assetB');const before=fs.lstatSync(foreign);
  const state=join(root,'state'),output=join(root,'publish');stager.buildStaticPublish({stateRoot:state,candidateRoot:candidate,outputRoot:output});let changed=false;
  assert.throws(()=>stager.exportStaticPublish({stateRoot:state,candidateRoot:candidate,outputRoot:output,destinationRoot:join(root,'export'),options:{
    ownerUid:process.getuid()===0?12345:process.getuid(),ownerGid:process.getgid()===0?12345:process.getgid(),
    onDurabilityOperation:({operation,path})=>{if(!changed&&operation==='fsync-file'&&path.endsWith('/assets/a.js')){changed=true;fs.linkSync(foreign,join(path,'..','b.js'));}}
  }}),/hard-link/);
  assert.equal(changed,true);const after=fs.lstatSync(foreign);assert.equal(after.uid,before.uid);assert.equal(after.gid,before.gid);assert.equal(fs.readFileSync(foreign,'utf8'),'assetB');
`));

test("directory durability prompt-rejects unsafe types and held-path replacements", () => {
  for (const kind of ["fifo", "symlink", "regular", "directory"])
    for (const when of ["before-open", "after-open"])
      worker(`
    const candidate=join(root,'candidate');fs.mkdirSync(join(candidate,'assets'),{recursive:true});
    fs.writeFileSync(join(candidate,'assets','a.js'),'asset');fs.writeFileSync(join(candidate,'index.html'),'shell');fs.writeFileSync(join(candidate,'sw.js'),'worker');
    const state=join(root,'state');const originalOpen=fs.openSync;let changed=false;
    const substitute=()=>{changed=true;fs.renameSync(state,state+'.original');const kind=${JSON.stringify(kind)};if(kind==='directory')fs.mkdirSync(state);else if(kind==='fifo')execFileSync('mkfifo',[state]);else if(kind==='symlink')fs.symlinkSync(state+'.original',state);else fs.writeFileSync(state,'foreign');};
    fs.openSync=(path,...args)=>{
      if(path!==state||changed)return originalOpen(path,...args);
      if(${JSON.stringify(when)}==='before-open')substitute();
      const fd=originalOpen(path,...args);
      if(${JSON.stringify(when)}==='after-open')substitute();return fd;
    };syncBuiltinESMExports();
    try{assert.throws(()=>stager.stageStaticRelease({stateRoot:state,candidateRoot:candidate}));}
    finally{fs.openSync=originalOpen;syncBuiltinESMExports();}
    assert.equal(changed,true);assert.equal(fs.readFileSync(join(root,'foreign'),'utf8'),'foreign-project\\n');
  `);
});

test("export probe creation uses exclusive no-follow nonblocking flags and preserves occupied foreign entries", () => {
  for (const kind of ["regular", "symlink", "fifo"])
    worker(`
    const mapping=join(root,'.cabadrive-export-owner-mapping');fs.mkdirSync(mapping,{mode:0o700});
    const originalOpen=fs.openSync;let probe,changed=false;
    fs.openSync=(path,flags,...args)=>{
      if(!changed&&String(path).includes('.cabadrive-export-owner-probe.')){
        changed=true;
        probe=path;
        for(const flag of ['O_EXCL','O_NOFOLLOW','O_NONBLOCK','O_CREAT']) assert.ok(flags&fs.constants[flag],flag);
        if(${JSON.stringify(kind)}==='regular')fs.writeFileSync(path,'foreign',{mode:0o600});
        else if(${JSON.stringify(kind)}==='symlink')fs.symlinkSync(join(root,'foreign'),path);
        else execFileSync('mkfifo',[path]);
      }
      return originalOpen(path,flags,...args);
    };syncBuiltinESMExports();
    try{assert.throws(()=>stager.createExportOwnerAuthority({mappingDirectory:mapping,mappingName:'.cabadrive-export-owner-mapping',expectedParent:root,claimedUid:process.getuid(),claimedGid:process.getgid()}),/EEXIST/);}
    finally{fs.openSync=originalOpen;syncBuiltinESMExports();}
    assert.ok(fs.lstatSync(probe));assert.equal(fs.readFileSync(join(root,'foreign'),'utf8'),'foreign-project\\n');
    if(${JSON.stringify(kind)}==='regular')assert.equal(fs.readFileSync(probe,'utf8'),'foreign');
  `);
});

test("export probe creation cleans exact owned failures and never absorbs unrelated fchown metadata drift", () => {
  for (const failure of ["fchown", "fsync", "fchown-mode-drift", "observer-parent-open"])
    worker(`
    const mapping=join(root,'.cabadrive-export-owner-mapping');fs.mkdirSync(mapping,{mode:0o700});
    const originalChown=fs.fchownSync,originalSync=fs.fsyncSync,originalOpen=fs.openSync,originalClose=fs.closeSync;
    const held=new Set();let probe,probeFd,parentOpens=0,changed=false;
    fs.openSync=(path,...args)=>{
      if(path===root&&++parentOpens===2&&${JSON.stringify(failure)}==='observer-parent-open')throw new Error('injected parent open');
      const fd=originalOpen(path,...args);held.add(fd);if(String(path).includes('.cabadrive-export-owner-probe.')){probe=path;probeFd=fd;}return fd;
    };
    fs.closeSync=fd=>{held.delete(fd);return originalClose(fd);};
    fs.fchownSync=(fd,...args)=>{
      if(fd===probeFd&&${JSON.stringify(failure)}==='fchown'){changed=true;throw new Error('injected chown');}
      const result=originalChown(fd,...args);
      if(fd===probeFd&&${JSON.stringify(failure)}==='fchown-mode-drift'){changed=true;fs.fchmodSync(fd,0o000);}
      return result;
    };
    fs.fsyncSync=fd=>{if(fd===probeFd&&${JSON.stringify(failure)}==='fsync'){changed=true;throw new Error('injected fsync');}return originalSync(fd);};syncBuiltinESMExports();
    try{assert.throws(()=>stager.createExportOwnerAuthority({mappingDirectory:mapping,mappingName:'.cabadrive-export-owner-mapping',expectedParent:root,claimedUid:process.getuid(),claimedGid:process.getgid()}),/injected|ownership operation/);}
    finally{fs.openSync=originalOpen;fs.closeSync=originalClose;fs.fchownSync=originalChown;fs.fsyncSync=originalSync;syncBuiltinESMExports();}
    assert.equal(held.size,0,'all acquired descriptors close');
    if(${JSON.stringify(failure)}==='fchown-mode-drift'){assert.equal(fs.lstatSync(probe).mode&0o777,0);fs.chmodSync(probe,0o600);}
    else assert.equal(fs.existsSync(probe),false,'own failure leaves no probe orphan');
    assert.equal(fs.readFileSync(join(root,'foreign'),'utf8'),'foreign-project\\n');
  `);
});

test("export mapping is readonly owner-class authority and cleanup preserves a substituted witness", () =>
  worker(`
  const name='.cabadrive-export-owner-mapping',mapping=join(root,name);fs.mkdirSync(mapping,{mode:0o700});
  const options={mappingDirectory:mapping,mappingName:name,expectedParent:root,claimedUid:process.getuid(),claimedGid:process.getgid()};
  const first=stager.createExportOwnerAuthority(options);
  fs.writeFileSync(join(mapping,'foreign-content'),'witness contents are readonly');
  first.revalidate();first.close();assert.equal(fs.readFileSync(join(mapping,'foreign-content'),'utf8'),'witness contents are readonly');
  const second=stager.createExportOwnerAuthority({...options,onDurabilityOperation:({operation})=>{
    if(operation==='close-export-owner-probe'){fs.renameSync(mapping,mapping+'.original');fs.mkdirSync(mapping,{mode:0o700});fs.writeFileSync(join(mapping,'sentinel'),'foreign witness');}
  }});
  assert.throws(()=>second.close(),/mapping changed/);
  assert.equal(fs.readFileSync(join(mapping,'sentinel'),'utf8'),'foreign witness');
  assert.ok(fs.lstatSync(second.probe));second.close();
`));

test("created export descriptor rejects pathname substitution before its first fstat or ownership mutation", () => {
  for (const kind of ["regular", "symlink", "fifo", "hardlink"])
    worker(`
    const mapping=join(root,'.cabadrive-export-owner-mapping');fs.mkdirSync(mapping,{mode:0o700});
    const foreign=join(root,'foreign');const before=fs.lstatSync(foreign,{bigint:true});
    const originalOpen=fs.openSync,originalChown=fs.fchownSync;let probe,changed=false,chowns=0;
    fs.openSync=(path,...args)=>{
      const fd=originalOpen(path,...args);
      if(!changed&&String(path).includes('.cabadrive-export-owner-probe.')){
        changed=true;probe=path;fs.renameSync(path,path+'.original');
        if(${JSON.stringify(kind)}==='hardlink')fs.linkSync(foreign,path);
        else if(${JSON.stringify(kind)}==='symlink')fs.symlinkSync(foreign,path);
        else if(${JSON.stringify(kind)}==='fifo')execFileSync('mkfifo',[path]);
        else fs.writeFileSync(path,'foreign replacement',{mode:0o600});
      }
      return fd;
    };
    fs.fchownSync=(...args)=>{chowns++;return originalChown(...args);};syncBuiltinESMExports();
    try{assert.throws(()=>stager.createExportOwnerAuthority({mappingDirectory:mapping,mappingName:'.cabadrive-export-owner-mapping',expectedParent:root,claimedUid:process.getuid(),claimedGid:process.getgid()}),/descriptor access|changed/);}
    finally{fs.openSync=originalOpen;fs.fchownSync=originalChown;syncBuiltinESMExports();}
    assert.equal(changed,true);assert.equal(chowns,0,'no ownership mutation before exact created path binding');
    assert.ok(fs.lstatSync(probe));assert.equal(fs.readFileSync(foreign,'utf8'),'foreign-project\\n');
    const after=fs.lstatSync(foreign,{bigint:true});
    for(const key of ['dev','ino','mode','uid','gid','size','mtimeNs'])assert.equal(after[key],before[key]);
  `);
});
