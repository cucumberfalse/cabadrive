import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  readlinkSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import {
  prepareNativeOutputs,
  nativeOutputMounts,
  probeNativeOutputs,
  candidateVolumeMount,
  assertNativeCandidateUnchanged,
} from "./docker-image-fixture-outputs.mjs";

export const viteTemporaryCap = 16 * 1024 ** 2;

// Never follow package links. The one declared temporary boundary is excluded;
// every installed directory, regular file and symlink remains part of the proof.
export function installedPackageInventory(directory) {
  const records = [];
  const walk = (prefix = "") => {
    for (const name of readdirSync(join(directory, prefix)).sort()) {
      const path = prefix ? `${prefix}/${name}` : name;
      if (path === ".vite-temp") continue;
      const stat = lstatSync(join(directory, path));
      const entry = { path, mode: stat.mode & 0o777, uid: stat.uid, gid: stat.gid };
      if (stat.isSymbolicLink())
        records.push({ ...entry, type: "link", target: readlinkSync(join(directory, path)) });
      else if (stat.isDirectory()) {
        records.push({ ...entry, type: "directory" });
        walk(path);
      } else {
        assert(stat.isFile(), `unexpected installed dependency type: ${path}`);
        records.push({
          ...entry,
          type: "file",
          bytes: stat.size,
          sha256: createHash("sha256")
            .update(readFileSync(join(directory, path)))
            .digest("hex"),
        });
      }
    }
  };
  walk();
  return records;
}

export function linuxFixtureArguments(
  { context, dependencyVolume, image, uid, gid, outputVolumes },
  args,
  temporary = true,
) {
  return [
    "run",
    "--rm",
    "--network=none",
    "--user",
    `${uid}:${gid}`,
    "--mount",
    `type=bind,source=${context},target=/app`,
    "--mount",
    `type=volume,source=${dependencyVolume},target=/app/node_modules,readonly`,
    ...(temporary
      ? [
          "--tmpfs",
          `/app/node_modules/.vite-temp:rw,nosuid,nodev,size=${viteTemporaryCap},mode=0700,uid=${uid},gid=${gid}`,
        ]
      : []),
    ...(outputVolumes ? nativeOutputMounts(outputVolumes) : []),
    "--env",
    "COREPACK_HOME=/app/.cache/corepack",
    "--workdir",
    "/app",
    "--entrypoint",
    args[0],
    image,
    ...args.slice(1),
  ];
}

const identityCode = `
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {installedPackageInventory} from './scripts/docker-image-fixture-dependencies.mjs';
import {nativeTools} from './scripts/image-qa.mjs';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
assert(readFileSync('pnpm-lock.yaml').equals(readFileSync('node_modules/.pnpm/lock.yaml')));
const tools=await nativeTools();
const records=installedPackageInventory('/app/node_modules');
assert(records.length>100,'real installed package inventory is required');
console.log(JSON.stringify({records,lockSha256:hash(readFileSync('pnpm-lock.yaml')),nativeReceiptSha256:hash(readFileSync('.cache/image-qa/install-receipt.json')),nativeBinaries:Object.fromEntries(Object.entries(tools).map(([key,path])=>[key,hash(readFileSync(path))]))}));
`;

const temporaryProofCode = `
import assert from 'node:assert/strict';
import {readFileSync,readdirSync,statfsSync,statSync,writeFileSync,rmSync,openSync,closeSync,writeSync} from 'node:fs';
const target='/app/node_modules/.vite-temp';
const mounts=readFileSync('/proc/self/mountinfo','utf8').trim().split('\\n').map(line=>line.split(' '));
const parent=mounts.find(row=>row[4]==='/app/node_modules');
const nested=mounts.find(row=>row[4]===target);
assert(parent?.[5].split(',').includes('ro'),'dependency parent must remain readonly');
assert(nested?.[5].split(',').includes('rw')&&nested[nested.indexOf('-')+1]==='tmpfs','exact nested writable tmpfs required');
assert.equal(statSync(target).uid,process.getuid());assert.equal(statSync(target).gid,process.getgid());
assert.equal(statSync(target).mode&0o777,0o700);
assert.deepEqual(readdirSync(target),[],'per-container tmpfs must start empty');
const stat=statfsSync(target);const cap=stat.blocks*stat.bsize;
assert(cap>0&&cap<=${viteTemporaryCap},'temporary mount exceeds16MiB');
const available=Number(readFileSync('/proc/meminfo','utf8').match(/^MemAvailable:\\s+(\\d+)/m)[1])*1024;
assert(available>=256*1024**2,'insufficient VM memory headroom');
const {installedPackageInventory}=await import('./scripts/docker-image-fixture-dependencies.mjs');
const packageFile=installedPackageInventory('/app/node_modules').find(record=>record.type==='file'&&record.path.endsWith('/package.json'));assert(packageFile,'actual installed package file required');
for(const path of ['/app/node_modules/.pnpm/lock.yaml','/app/node_modules/'+packageFile.path]) {
 let refusal;try{const fd=openSync(path,'r+');closeSync(fd);}catch(error){refusal=error.code;}
 assert(['EROFS','EACCES','EPERM'].includes(refusal),'installed package/lock write must be refused');
}
const memory=()=>Number(readFileSync('/sys/fs/cgroup/memory.current','utf8'));
const swap=()=>Number(readFileSync('/sys/fs/cgroup/memory.swap.current','utf8'));
const memoryBefore=memory(),swapBefore=swap();
const probe=target+'/capacity-proof';let refusal,fd;
try{fd=openSync(probe,'w');const chunk=Buffer.alloc(64*1024);for(let bytes=0;bytes<=${viteTemporaryCap};bytes+=chunk.length)writeSync(fd,chunk);}catch(error){refusal=error.code;}
const memoryWithFullTmpfs=memory(),swapWithFullTmpfs=swap();if(fd!==undefined)closeSync(fd);rmSync(probe,{force:true});
const incrementalMemoryAndSwap=Math.max(0,memoryWithFullTmpfs-memoryBefore)+Math.max(0,swapWithFullTmpfs-swapBefore);
assert(incrementalMemoryAndSwap<=0.03*1024**3,'tmpfs metadata/swap increment exceeds0.03GiB allowance');
assert.equal(refusal,'ENOSPC','effective tmpfs size cap must reject overflow');
writeFileSync(target+'/lifetime-proof','ephemeral');
console.log(JSON.stringify({status:'VITE_TEMP_BOUNDARY_PASS',capBytes:cap,vmMemoryAvailable:available,parentReadonly:true,packageAndLockWritesRefused:true,memoryBefore,memoryWithFullTmpfs,swapBefore,swapWithFullTmpfs,incrementalMemoryAndSwap}));
`;

export function prepareLinuxFixtureDependencies({
  docker,
  context,
  image,
  token,
  volumes,
  uid,
  gid,
  evidenceRoot,
}) {
  mkdirSync(evidenceRoot, { recursive: true, mode: 0o700 });
  const dependencyVolume = docker([
    "volume",
    "create",
    "--label",
    `com.cabadrive.image-pipeline-test=${token}`,
    `${token}-dependencies`,
  ]).stdout.trim();
  volumes.push(dependencyVolume);
  // Native receipts/binaries come from the pinned Linux tools image. The host
  // context bind contains no Darwin cache and cannot shadow their identity.
  docker([
    "run",
    "--rm",
    "--network=none",
    "--mount",
    `type=bind,source=${context},target=/fixture`,
    "--entrypoint",
    "node",
    image,
    "--input-type=module",
    "-e",
    `import {mkdirSync,cpSync,chownSync,readdirSync,statSync} from "node:fs"; import {join} from "node:path";
    const size=(path)=>readdirSync(path,{withFileTypes:true}).reduce((sum,entry)=>{const child=join(path,entry.name);return sum+(entry.isDirectory()?size(child):statSync(child).size);},0);
    const copiedBytes=size("/app/.cache/image-qa/bin")+statSync("/app/.cache/image-qa/install-receipt.json").size+size("/root/.cache/node/corepack");
    if(copiedBytes>40*1024**2)throw new Error("Linux tool/corepack changed-byte budget exceeds40MiB; revise remaining host forecast");
    console.log(JSON.stringify({linuxToolAndCorepackBytes:copiedBytes}));
    mkdirSync("/fixture/.cache/image-qa",{recursive:true});
    cpSync("/app/.cache/image-qa/bin","/fixture/.cache/image-qa/bin",{recursive:true});
    cpSync("/app/.cache/image-qa/install-receipt.json","/fixture/.cache/image-qa/install-receipt.json");
    cpSync("/root/.cache/node/corepack","/fixture/.cache/corepack",{recursive:true});
    const own=(path)=>{for(const entry of readdirSync(path,{withFileTypes:true})){const child=join(path,entry.name);if(entry.isDirectory())own(child);chownSync(child,${uid},${gid});}chownSync(path,${uid},${gid});};own("/fixture/.cache");`,
  ]);
  const outputVolumes = prepareNativeOutputs({ docker, context, image, token, volumes, uid, gid });
  const environment = { context, dependencyVolume, image, uid, gid, outputVolumes };
  const run = (args, failure = false, temporary = true) =>
    docker(linuxFixtureArguments(environment, args, temporary), { failure });
  // This first ordinary validator reproduces the old layout before creating the
  // mountpoint. It is a real Vite execution, not a simulated permission error.
  const original = run(["pnpm", "run", "validate:manual-ticket-placement"], true, false);
  assert.notEqual(original.status, 0, "original readonly layout must reproduce its Vite failure");
  assert.match(
    `${original.stdout}\n${original.stderr}`,
    /(?:ENOENT|EROFS)[\s\S]*node_modules\/\.vite-temp/,
  );
  // spawnSync.output duplicates stdout/stderr. Persist only exact command
  // evidence fields within the declared remaining1MiB allowance.
  const originalProof = JSON.stringify({
    exit: original.status,
    signal: original.signal,
    stdout: original.stdout,
    stderr: original.stderr,
    stdoutSha256: createHash("sha256").update(original.stdout).digest("hex"),
    stderrSha256: createHash("sha256").update(original.stderr).digest("hex"),
  });
  assert(
    Buffer.byteLength(originalProof) <= 1024 ** 2,
    `original Vite failure proof exceeds1MiB budget; stdoutSha256=${createHash("sha256").update(original.stdout).digest("hex")}; stderrSha256=${createHash("sha256").update(original.stderr).digest("hex")}; exit=${original.status}`,
  );
  writeFileSync(join(evidenceRoot, `${token}-vite-original-failure.json`), originalProof, {
    mode: 0o600,
  });
  const identity = (temporary = true) => {
    const output = run(
      ["node", "--input-type=module", "-e", identityCode],
      false,
      temporary,
    ).stdout;
    assert(
      Buffer.byteLength(output) <= 7 * 1024 ** 2,
      "installed identity exceeds evidence budget",
    );
    return JSON.parse(output);
  };
  const before = identity(false);
  writeFileSync(join(evidenceRoot, `${token}-dependencies-before.json`), JSON.stringify(before), {
    mode: 0o600,
  });
  docker([
    "run",
    "--rm",
    "--network=none",
    "--mount",
    `type=volume,source=${dependencyVolume},target=/dependencies`,
    "--entrypoint",
    "node",
    image,
    "--input-type=module",
    "-e",
    `import assert from 'node:assert/strict';import {existsSync,mkdirSync,chownSync,chmodSync,readdirSync,lstatSync} from 'node:fs';const path='/dependencies/.vite-temp';assert(!existsSync(path),'fresh volume must not contain a preexisting temporary boundary');mkdirSync(path);chownSync(path,${uid},${gid});chmodSync(path,0o700);assert(lstatSync(path).isDirectory()&&!lstatSync(path).isSymbolicLink());assert.deepEqual(readdirSync(path),[]);`,
  ]);
  const temporaryProof = JSON.parse(
    run(["node", "--input-type=module", "-e", temporaryProofCode]).stdout,
  );
  assert(
    Buffer.byteLength(JSON.stringify(temporaryProof)) <= 64 * 1024,
    "temporary proof exceeds evidence budget",
  );
  // A new container gets a new tmpfs; the previous marker must not survive.
  run([
    "node",
    "--input-type=module",
    "-e",
    "import assert from 'node:assert/strict';import {readdirSync} from 'node:fs';assert.deepEqual(readdirSync('/app/node_modules/.vite-temp'),[]);console.log('Per-container temporary lifetime PASS');",
  ]);
  let check = 0;
  const assertIntegrity = () => {
    const after = identity();
    assert.deepEqual(after, before, "installed package/link/lock/native identity changed");
    assert(check < 5, "integrity report count exceeds evidence budget");
    const evidence = JSON.stringify({ before, after, temporaryProof });
    assert(
      Buffer.byteLength(evidence) <= 14 * 1024 ** 2 + 64 * 1024,
      "integrity report exceeds evidence budget",
    );
    writeFileSync(join(evidenceRoot, `${token}-dependencies-${check++}.json`), evidence, {
      mode: 0o600,
    });
    return after;
  };
  assertIntegrity();
  const manual = run(["pnpm", "run", "validate:manual-ticket-placement"]);
  assert.match(manual.stdout, /Manual ticket placement valid:/);
  assertIntegrity();
  console.log(
    "Actual readonly dependency Vite failure,16MiB isolated tmpfs,manual validator,package/lock refusal,lifetime and installed/native integrity PASS",
  );
  return {
    run,
    assertIntegrity,
    temporaryProof,
    outputVolumes,
    probeOutputs: () => probeNativeOutputs(run),
    candidateMount: candidateVolumeMount(outputVolumes),
    assertCandidateUnchanged: (expected) => assertNativeCandidateUnchanged(run, expected),
  };
}
