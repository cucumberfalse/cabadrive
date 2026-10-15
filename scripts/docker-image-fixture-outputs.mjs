import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { lstatSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { checkpointInventory } from "./docker-image-checkpoint.mjs";

const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
export const nativeOutputCaps = { public: 0.3 * 1024 ** 3, dist: 0.33 * 1024 ** 3 };

export function publicSeed(context, inventory) {
  const included = inventory.filter((record) => record.path.startsWith("public/"));
  assert(included.length <= 100, "included public seed exceeds100 files");
  const records = included.map((record) => {
    assert(
      !record.path.startsWith("public/content/"),
      "generated public content cannot seed outputs",
    );
    const relative = record.path.slice("public/".length);
    assert(relative && !relative.split("/").some((part) => !part || part === "." || part === ".."));
    const path = join(context, record.path);
    const stat = lstatSync(path);
    assert(stat.isFile() && stat.nlink === 1, "public seed must be independent regular input");
    assert.equal(stat.mode & 0o777, record.mode, "public seed mode drift");
    assert.equal(record.mode, 0o644, "public seed requires ordinary0644 input, no mode repair");
    const bytes = readFileSync(path);
    assert.equal(bytes.length, record.bytes, "public seed size drift");
    assert.equal(hash(bytes), record.sha256, "public seed hash drift");
    return {
      path: relative,
      bytes: bytes.length,
      sha256: record.sha256,
      data: bytes.toString("base64"),
    };
  });
  assert(
    records.reduce((sum, record) => sum + record.bytes, 0) <= 1024 ** 2,
    "public seed exceeds1MiB",
  );
  const serialized = JSON.stringify(records);
  assert(Buffer.byteLength(serialized) <= 2 * 1024 ** 2, "public seed transport exceeds2MiB");
  return { records, serialized };
}

export function nativeOutputMounts(outputVolumes) {
  return Object.entries(outputVolumes).flatMap(([target, volume]) => [
    "--mount",
    `type=volume,source=${volume},target=/app/${target},volume-nocopy`,
  ]);
}

export function prepareNativeOutputs({ docker, context, image, token, volumes, uid, gid }) {
  const seed = publicSeed(context, checkpointInventory(context));
  const outputVolumes = {};
  for (const target of ["public", "dist"]) {
    const name = `${token}-${target}`;
    assert.notEqual(
      docker(["volume", "inspect", name], { failure: true }).status,
      0,
      "output volume already exists",
    );
    const created = docker([
      "volume",
      "create",
      "--label",
      `com.cabadrive.image-pipeline-test=${token}`,
      name,
    ]);
    // Exact absent-then-created name is owned before any later assertion.
    volumes.push(name);
    assert.equal(created.stdout.trim(), name, "unexpected created output volume");
    const identity = JSON.parse(docker(["volume", "inspect", name]).stdout)[0];
    assert.equal(identity.Name, name);
    assert.equal(identity.Labels?.["com.cabadrive.image-pipeline-test"], token);
    outputVolumes[target] = name;
  }
  docker([
    "run",
    "--rm",
    "--network=none",
    ...nativeOutputMounts(outputVolumes),
    "--entrypoint",
    "node",
    image,
    "--input-type=module",
    "-e",
    `import assert from 'node:assert/strict';import {readdirSync,lstatSync,chownSync,readFileSync} from 'node:fs';
    const mounts=readFileSync('/proc/self/mountinfo','utf8').trim().split('\\n').map(line=>line.split(' '));
    for(const path of ['/app/public','/app/dist']){
      assert(lstatSync(path).isDirectory()&&!lstatSync(path).isSymbolicLink());
      assert.deepEqual(readdirSync(path),[],'fresh nocopy output root must be empty');
      const row=mounts.find(row=>row[4]===path);assert(row&&row[5].split(',').includes('rw'));
      assert(!['fakeowner','virtiofs','9p'].includes(row[row.indexOf('-')+1]),'outputs require Linux-native volumes');
      chownSync(path,${uid},${gid});
      assert.equal(lstatSync(path).uid,${uid});assert.equal(lstatSync(path).gid,${gid});
    }
    console.log('Fresh empty Linux-native output roots initialized; no input permissions imported');`,
  ]);
  const result = docker(
    [
      "run",
      "--rm",
      "-i",
      "--network=none",
      "--user",
      `${uid}:${gid}`,
      ...nativeOutputMounts(outputVolumes),
      "--entrypoint",
      "node",
      image,
      "--input-type=module",
      "-e",
      `import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {readFileSync,readdirSync,mkdirSync,writeFileSync,lstatSync} from 'node:fs';import {dirname,join} from 'node:path';
    const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
    assert.deepEqual(readdirSync('/app/public'),[]);assert.deepEqual(readdirSync('/app/dist'),[]);
    const input=readFileSync(0);assert(input.length<=2*1024**2);const seed=JSON.parse(input);
    assert(Array.isArray(seed)&&seed.length<=100);assert(seed.reduce((sum,row)=>sum+row.bytes,0)<=1024**2);
    const paths=new Set();for(const row of seed){
      assert(typeof row.path==='string'&&row.path&&!row.path.startsWith('/')&&!row.path.split('/').some(part=>!part||part==='.'||part==='..')&&!row.path.startsWith('content/'));
      assert(!paths.has(row.path));paths.add(row.path);const bytes=Buffer.from(row.data,'base64');assert.equal(bytes.length,row.bytes);assert.equal(hash(bytes),row.sha256);
      const path=join('/app/public',row.path);mkdirSync(dirname(path),{recursive:true,mode:0o755});for(let directory=dirname(path);directory!=='/app';directory=dirname(directory)){const stat=lstatSync(directory);assert(stat.isDirectory()&&!stat.isSymbolicLink());assert.equal(stat.mode&0o777,0o755,'public seed directory mode');assert.equal(stat.uid,process.getuid());}writeFileSync(path,bytes,{flag:'wx',mode:0o644});
      assert.equal(lstatSync(path).mode&0o777,0o644);assert.equal(lstatSync(path).uid,process.getuid());assert.equal(hash(readFileSync(path)),row.sha256);
    }console.log(JSON.stringify(seed.map(({data,...record})=>record)));`,
    ],
    { input: seed.serialized },
  );
  assert.deepEqual(
    JSON.parse(result.stdout),
    seed.records.map(({ path, bytes, sha256 }) => ({ path, bytes, sha256 })),
  );
  return outputVolumes;
}

export function probeNativeOutputs(run) {
  const result = run([
    "node",
    "--input-type=module",
    "-e",
    `
    import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {readFileSync,readdirSync,lstatSync} from 'node:fs';import {join} from 'node:path';
    const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
    const relative='content/assets/learning/generated/v1/topic-learning-adverse-weather-and-visibility-1.svg';
    assert.equal(lstatSync('/app/'+relative).mode&0o777,0o644,'canonical SVG mode');
    const canonical=readFileSync('/app/'+relative),canonicalHash=hash(canonical);
    for(const target of ['public','dist']){const path='/app/'+target+'/'+relative,stat=lstatSync(path);assert.equal(stat.mode&0o777,0o644,'formerly denied SVG mode');assert.equal(hash(readFileSync(path)),canonicalHash,'formerly denied SVG exact canonical bytes');}
    const result={};for(const [target,cap]of Object.entries(${JSON.stringify(nativeOutputCaps)})){
      const root='/app/'+target;let allocated=0;const files=[];
      const walk=(directory,prefix='')=>{const directoryStat=lstatSync(directory);assert(directoryStat.isDirectory());allocated+=directoryStat.blocks*512;
        for(const name of readdirSync(directory).sort()){const path=join(directory,name),relative=prefix?prefix+'/'+name:name,stat=lstatSync(path);assert(!stat.isSymbolicLink(),'output symlink refused');
          if(stat.isDirectory())walk(path,relative);else{assert(stat.isFile());allocated+=stat.blocks*512;assert(stat.uid===process.getuid()&&(stat.mode&0o400),'output must be readable by actual build user');
            const bytes=readFileSync(path);files.push({path:relative,bytes:bytes.length,allocatedBytes:stat.blocks*512,mode:stat.mode&0o777,uid:stat.uid,gid:stat.gid,sha256:hash(bytes)});}
        }};walk(root);assert(allocated<=cap,'native '+target+' output allocation exceeds disposed cap');result[target]={allocatedBytes:allocated,files,boundaryProof:{path:relative,canonicalSha256:canonicalHash,outputSha256:canonicalHash,mode:0o644,readable:true}};
    }console.log(JSON.stringify(result));
  `,
  ]);
  assert(
    Buffer.byteLength(result.stdout) <= 4 * 1024 ** 2,
    "native output inventory exceeds4MiB proof cap",
  );
  return JSON.parse(result.stdout);
}

export function candidateVolumeMount(outputVolumes) {
  return `type=volume,source=${outputVolumes.dist},target=/candidate,readonly,volume-nocopy`;
}

export function assertNativeCandidateUnchanged(run, expected) {
  assert.deepEqual(
    probeNativeOutputs(run).dist,
    expected,
    "native candidate changed before completed publication/committed hash proof",
  );
}
