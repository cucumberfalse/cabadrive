import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";
const modulePath =
  process.env.CABADRIVE_DESCRIPTOR_TEST_MODULE ||
  new URL("../scripts/stage-static-release.mjs", import.meta.url).pathname;
const helperSource = new URL("../scripts/rename-noreplace.c", import.meta.url).pathname;
function worker(body) {
  const result = spawnSync(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      `
import assert from 'node:assert/strict';import fs from 'node:fs';import child from 'node:child_process';
import {syncBuiltinESMExports} from 'node:module';import {join,dirname,basename} from 'node:path';import {tmpdir} from 'node:os';
const root=fs.realpathSync(fs.mkdtempSync(join(tmpdir(),'cabadrive-created-tree-')));
const helper=process.env.CABADRIVE_CREATED_TREE_TEST_HELPER||join(root,'helper');if(!process.env.CABADRIVE_CREATED_TREE_TEST_HELPER)child.execFileSync('cc',['-O2','-Wall','-Wextra',${JSON.stringify(helperSource)},'-o',helper]);process.env.CABADRIVE_RENAME_NOREPLACE_HELPER=helper;
const stager=await import(${JSON.stringify(modulePath)});
const candidate=join(root,'candidate'),state=join(root,'state'),output=join(root,'output'),destination=join(root,'export');
fs.mkdirSync(join(candidate,'assets'),{recursive:true});fs.writeFileSync(join(candidate,'assets','a.js'),'A');fs.writeFileSync(join(candidate,'index.html'),'shell');
const ownerUid=process.getuid()===0?12345:process.getuid(),ownerGid=process.getgid()===0?12345:process.getgid();
const publish=()=>stager.buildStaticPublish({stateRoot:state,candidateRoot:candidate,outputRoot:output});
const exporting=(options={},extra={})=>stager.exportStaticPublish({stateRoot:state,candidateRoot:candidate,outputRoot:output,destinationRoot:destination,options,...extra});
const snapshot=(path)=>{const s=fs.lstatSync(path,{bigint:true});return [s.dev,s.ino,s.uid,s.gid,s.mode,s.birthtimeNs].map(String);};
try { ${body} } finally {fs.rmSync(root,{recursive:true,force:true});}
`,
    ],
    {
      encoding: "utf8",
      timeout: 20000,
      env: { ...process.env, CABADRIVE_TEST_KERNEL_LOCK: "in-process" },
    },
  );
  assert.equal(result.error, undefined, result.error?.message);
  assert.equal(result.status, 0, result.stderr || result.stdout);
}

test("created ownership registry rejects replaced ancestors before foreign ownership changes", () => {
  for (const level of ["root", "assets"])
    worker(`
    publish();const original=fs.readdirSync;let changed,foreign,before;
    fs.readdirSync=(path,...args)=>{
      if(!changed&&String(path).includes('.export-')&&new Error().stack.includes('handBackTreeOwnership')&&(${JSON.stringify(level)}==='root'?!String(path).endsWith('/assets'):String(path).endsWith('/assets'))){
        changed=String(path);fs.renameSync(path,path+'.original');fs.mkdirSync(path);foreign=join(path,'foreign');fs.writeFileSync(foreign,'UNRELATED');before=snapshot(foreign);
      }return original(path,...args);
    };syncBuiltinESMExports();
    try{assert.throws(()=>exporting({ownerUid,ownerGid}),/ancestry changed|unregistered/);}finally{fs.readdirSync=original;syncBuiltinESMExports();}
    assert.ok(changed);assert.deepEqual(snapshot(foreign),before);assert.equal(fs.readFileSync(foreign,'utf8'),'UNRELATED');assert.equal(fs.existsSync(destination),false);
  `);
});

test("foreign child inserted in the original parent is preserved without handback", () =>
  worker(`
  publish();const original=fs.readdirSync;let foreign,before;
  fs.readdirSync=(path,...args)=>{if(!foreign&&String(path).includes('.export-')&&new Error().stack.includes('handBackTreeOwnership')){foreign=join(path,'foreign');fs.writeFileSync(foreign,'UNRELATED');before=snapshot(foreign);}return original(path,...args);};syncBuiltinESMExports();
  try{assert.throws(()=>exporting({ownerUid,ownerGid}),/unregistered/);}finally{fs.readdirSync=original;syncBuiltinESMExports();}
  assert.deepEqual(snapshot(foreign),before);assert.equal(fs.readFileSync(foreign,'utf8'),'UNRELATED');
`));

test("held export creator prevents recycled-root cleanup and preserves replacements", () =>
  worker(`
  publish();const original=fs.openSync;let foreign,before;
  fs.openSync=(path,flags,...args)=>{
    if(!foreign&&String(path).includes('.export-')&&typeof flags==='number'&&(flags&fs.constants.O_CREAT)){
      const temporary=dirname(dirname(path)),ino=fs.lstatSync(temporary,{bigint:true}).ino;
      fs.rmSync(temporary,{recursive:true});fs.mkdirSync(temporary);assert.notEqual(fs.lstatSync(temporary,{bigint:true}).ino,ino,'held creator inode stays allocated');
      foreign=join(temporary,'foreign');fs.writeFileSync(foreign,'UNRELATED');before=snapshot(foreign);throw new Error('controlled copy failure');
    }return original(path,flags,...args);
  };syncBuiltinESMExports();
  try{assert.throws(()=>exporting(),/controlled copy failure/);}finally{fs.openSync=original;syncBuiltinESMExports();}
  assert.deepEqual(snapshot(foreign),before);assert.equal(fs.readFileSync(foreign,'utf8'),'UNRELATED');
`));

test("failed publish cleanup preserves a substituted directory and unrelated bytes", () =>
  worker(`
  let foreign,before;assert.throws(()=>stager.buildStaticPublish({stateRoot:state,candidateRoot:candidate,outputRoot:output,onDurabilityOperation:({operation,path})=>{
    if(!foreign&&operation==='fsync-file'&&String(path).includes('.publish-')){const temporary=dirname(dirname(path));fs.renameSync(temporary,temporary+'.original');fs.mkdirSync(temporary);foreign=join(temporary,'foreign');fs.writeFileSync(foreign,'UNRELATED');before=snapshot(foreign);throw new Error('controlled publish failure');}
  }}),/controlled publish failure/);assert.deepEqual(snapshot(foreign),before);assert.equal(fs.readFileSync(foreign,'utf8'),'UNRELATED');assert.equal(fs.existsSync(output),false);
`));

test("recovered export rejects recycled-inode representation with changed birth generation", () =>
  worker(`
  stager.buildStaticPublish({stateRoot:state,candidateRoot:candidate,outputRoot:output,destinationRoot:destination,deferActivation:true});
  assert.throws(()=>exporting({ownerUid,ownerGid,faultAt:'after-export-identity-bind'},{allowPending:true}),/fault injection/);
  const pending=JSON.parse(fs.readFileSync(join(state,'publish-pending.json'),'utf8')),temporary=join(root,'.export.export-'+pending.exportNonce),old=fs.lstatSync(temporary,{bigint:true});
  fs.renameSync(temporary,temporary+'.original');fs.cpSync(temporary+'.original',temporary,{recursive:true});const before=snapshot(join(temporary,'assets','a.js')),original=fs.lstatSync;
  fs.lstatSync=(path,options)=>{const stat=original(path,options);if(path===temporary){stat.dev=options?.bigint?old.dev:Number(old.dev);stat.ino=options?.bigint?old.ino:Number(old.ino);if(options?.bigint)stat.birthtimeNs=old.birthtimeNs+1n;}return stat;};syncBuiltinESMExports();
  try{assert.throws(()=>exporting({ownerUid,ownerGid},{allowPending:true}),/exact bound temporary/);}finally{fs.lstatSync=original;syncBuiltinESMExports();}
  assert.deepEqual(snapshot(join(temporary,'assets','a.js')),before);assert.equal(fs.existsSync(destination),false);assert.equal(fs.readFileSync(join(temporary,'assets','a.js'),'utf8'),'A');
`));

test("native cleanup checks the registered entry at the final JS handoff", () =>
  worker(`
  publish();const original=child.spawnSync;let foreign,before;
  child.spawnSync=(command,args,options)=>{if(!foreign&&args[0]==='--owned-unlink'&&args[1]==='a.js'){const name=fs.readdirSync(root).find(name=>name.startsWith('.export.export-'));const target=join(root,name,'assets','a.js');fs.renameSync(target,target+'.original');fs.writeFileSync(target,'UNRELATED');foreign=target;before=snapshot(foreign);}return original(command,args,options);};syncBuiltinESMExports();
  try{assert.throws(()=>exporting({onDurabilityOperation:({operation,path})=>{if(operation==='fsync-file'&&path.endsWith('/a.js'))throw new Error('controlled copy failure');}}),/controlled copy failure/);}finally{child.spawnSync=original;syncBuiltinESMExports();}
  assert.ok(foreign);assert.deepEqual(snapshot(foreign),before);assert.equal(fs.readFileSync(foreign,'utf8'),'UNRELATED');
`));

test("ordinary owned cleanup and unchanged native no-replace CLI remain compatible", () =>
  worker(`
  publish();assert.throws(()=>exporting({onDurabilityOperation:({operation,path})=>{if(operation==='fsync-file'&&path.endsWith('/a.js'))throw new Error('controlled copy failure');}}),/controlled copy failure/);
  assert.equal(fs.readdirSync(root).some(name=>name.startsWith('.export.export-')),false);
  const source=join(root,'rename-source'),target=join(root,'rename-target');fs.writeFileSync(source,'owned');child.execFileSync(helper,[source,target]);assert.equal(fs.readFileSync(target,'utf8'),'owned');fs.writeFileSync(source,'second');assert.equal(child.spawnSync(helper,[source,target]).status,17);assert.equal(fs.readFileSync(target,'utf8'),'owned');
`));

test("durable created-entry proof permits exact new-process retry without new handback", () =>
  worker(`
  stager.buildStaticPublish({stateRoot:state,candidateRoot:candidate,outputRoot:output,destinationRoot:destination,deferActivation:true});
  assert.throws(()=>exporting({ownerUid,ownerGid,faultAt:'after-export-identity-bind'},{allowPending:true}),/fault injection/);
  const pending=JSON.parse(fs.readFileSync(join(state,'publish-pending.json'),'utf8'));assert.equal(pending.exportCreatedTree.schemaVersion,1);assert.ok(pending.exportCreatedTree.entries.some(entry=>entry.path==='assets/a.js'));
  const code="import {exportStaticPublish} from "+JSON.stringify(${JSON.stringify(modulePath)})+"; exportStaticPublish("+JSON.stringify({stateRoot:state,candidateRoot:candidate,outputRoot:output,destinationRoot:destination,allowPending:true,options:{ownerUid,ownerGid}})+");";child.execFileSync(process.execPath,['--input-type=module','-e',code],{env:process.env});assert.equal(fs.readFileSync(join(destination,'assets','a.js'),'utf8'),'A');assert.equal(fs.lstatSync(join(destination,'assets','a.js')).uid,ownerUid);
`));

test("durable registry rejects malformed schema and substituted copied entries without new ownership", () => {
  for (const change of [
    "schema",
    "root-birth",
    "missing-entry",
    "duplicate",
    "file-replacement",
    "directory-replacement",
    "unknown-child",
  ])
    worker(`
      stager.buildStaticPublish({stateRoot:state,candidateRoot:candidate,outputRoot:output,destinationRoot:destination,deferActivation:true});
      assert.throws(()=>exporting({ownerUid,ownerGid,faultAt:'after-export-identity-bind'},{allowPending:true}),/fault injection/);
      const journal=join(state,'publish-pending.json'),pending=JSON.parse(fs.readFileSync(journal,'utf8')),temporary=join(root,'.export.export-'+pending.exportNonce),change=${JSON.stringify(change)};
      let foreign;
      if(change==='schema')pending.exportCreatedTree.schemaVersion=99;
      if(change==='root-birth')pending.exportCreatedTree.entries[0].identity.birthtimeNs='0';
      if(change==='missing-entry')pending.exportCreatedTree.entries=pending.exportCreatedTree.entries.filter(entry=>entry.path!=='assets/a.js');
      if(change==='duplicate')pending.exportCreatedTree.entries.push(pending.exportCreatedTree.entries[0]);
      if(change==='file-replacement'){foreign=join(temporary,'assets','a.js');fs.renameSync(foreign,foreign+'.original');fs.writeFileSync(foreign,'A');}
      if(change==='directory-replacement'){foreign=join(temporary,'assets');fs.renameSync(foreign,foreign+'.original');fs.mkdirSync(foreign);fs.writeFileSync(join(foreign,'a.js'),'A');}
      if(change==='unknown-child'){foreign=join(temporary,'foreign');fs.writeFileSync(foreign,'UNRELATED');}
      if(!foreign)foreign=join(temporary,'assets','a.js');const before=snapshot(foreign);fs.writeFileSync(journal,JSON.stringify(pending));
      assert.throws(()=>exporting({ownerUid,ownerGid},{allowPending:true}));assert.deepEqual(snapshot(foreign),before);assert.equal(fs.existsSync(destination),false);
    `);
});

test("proof removal resumes only its durable exact receipt transition", () => {
  for (const boundary of ["before-removal", "after-removal", "parent-sync"])
    worker(`
      stager.buildStaticPublish({stateRoot:state,candidateRoot:candidate,outputRoot:output,destinationRoot:destination,deferActivation:true});
      const boundary=${JSON.stringify(boundary)};let reached=false;
      assert.throws(()=>exporting({onDurabilityOperation:({operation,path})=>{
        if(!reached&&((boundary==='before-removal'&&operation==='unlink-owned-entry'&&path.endsWith('/.cabadrive-export-owner.json'))||(boundary==='after-removal'&&operation==='unlink-owned-entry-durable'&&path.endsWith('/.cabadrive-export-owner.json'))||(boundary==='parent-sync'&&operation==='fsync-directory'&&path===destination&&!fs.existsSync(join(destination,'.cabadrive-export-owner.json'))))){reached=true;throw new Error('controlled proof-removal fault');}
      }},{allowPending:true}),/controlled proof-removal fault/);assert.equal(reached,true);
      const code="import {exportStaticPublish} from "+JSON.stringify(${JSON.stringify(modulePath)})+"; exportStaticPublish("+JSON.stringify({stateRoot:state,candidateRoot:candidate,outputRoot:output,destinationRoot:destination,allowPending:true})+");";
      child.execFileSync(process.execPath,['--input-type=module','-e',code],{env:process.env});
      assert.equal(fs.readFileSync(join(destination,'assets','a.js'),'utf8'),'A');assert.equal(fs.existsSync(join(destination,'.cabadrive-export-owner.json')),false);
    `);
});

test("missing proof cannot omit its registry entry without the exact receipt", () => {
  for (const mutation of ["missing", "digest", "birth", "nonce"])
    worker(`
      stager.buildStaticPublish({stateRoot:state,candidateRoot:candidate,outputRoot:output,destinationRoot:destination,deferActivation:true});
      assert.throws(()=>exporting({onDurabilityOperation:({operation,path})=>{if(operation==='unlink-owned-entry-durable'&&path.endsWith('/.cabadrive-export-owner.json'))throw new Error('controlled removal fault');}},{allowPending:true}),/controlled removal fault/);
      const receiptName=fs.readdirSync(state).find(name=>name.startsWith('export-receipt-')),receiptPath=join(state,receiptName),receipt=JSON.parse(fs.readFileSync(receiptPath,'utf8')),mutation=${JSON.stringify(mutation)};
      if(mutation==='missing')fs.unlinkSync(receiptPath);else{if(mutation==='digest')receipt.createdTreeSha256='0'.repeat(64);if(mutation==='birth')receipt.rootBirthtimeNs='0';if(mutation==='nonce')receipt.nonce='00000000-0000-0000-0000-000000000000';fs.writeFileSync(receiptPath,JSON.stringify(receipt));}
      const before=snapshot(join(destination,'assets','a.js'));assert.throws(()=>exporting({ownerUid,ownerGid},{allowPending:true}));assert.deepEqual(snapshot(join(destination,'assets','a.js')),before);assert.equal(fs.readFileSync(join(destination,'assets','a.js'),'utf8'),'A');
    `);
});

test("oversized coordinator pending authority rejects before state or destination mutation", () =>
  worker(`
  fs.mkdirSync(state);const pending=join(state,'publish-pending.json');fs.writeFileSync(pending,' '.repeat(8*1024*1024+1));const before=snapshot(pending);
  assert.throws(()=>stager.buildStaticPublish({stateRoot:state,candidateRoot:candidate,outputRoot:output,destinationRoot:destination,deferActivation:true}),/authority size limit/);
  assert.deepEqual(snapshot(pending),before);assert.equal(fs.existsSync(output),false);assert.equal(fs.existsSync(destination),false);
`));
