import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");

// Executed inside the actual stager image with only its existing state mounted RO.
export const committedProbe = String.raw`
const fs=require('node:fs'),crypto=require('node:crypto');
(async()=>{
 const {verifyCommittedState}=await import('/app/scripts/stage-static-release.mjs');
 const verified=verifyCommittedState('/state');
 if(verified.valid!==true)throw Error('production committed-state verification failed');
 const digest=b=>crypto.createHash('sha256').update(b).digest('hex');
 const id=verified.releaseId,meta='/state/metadata/'+id+'.json',st=fs.lstatSync(meta);
 if(!st.isFile()||st.isSymbolicLink()||st.size<=1048576||st.size>2097152)throw Error('metadata must be actual >1MiB within2MiB');
 const bytes=fs.readFileSync(meta),metadata=JSON.parse(bytes);
 if(metadata.releaseId!==id)throw Error('metadata tuple differs');
 function inventory(root){
  const rows=[];let total=0;
  function walk(dir,prefix=''){
   for(const name of fs.readdirSync(dir).sort()){
    const p=dir+'/'+name,r=prefix?prefix+'/'+name:name,s=fs.lstatSync(p);
    if(s.isSymbolicLink())throw Error('inventory contains symlink');
    if(s.isDirectory())walk(p,r);
    else if(s.isFile()){
     const fd=fs.openSync(p,fs.constants.O_RDONLY|fs.constants.O_NOFOLLOW),h=crypto.createHash('sha256'),buffer=Buffer.alloc(65536);let size=0;
     try{let n;while((n=fs.readSync(fd,buffer,0,buffer.length,null))>0){h.update(buffer.subarray(0,n));size+=n}}finally{fs.closeSync(fd)}
     if(size!==s.size)throw Error('inventory changed while read');
     rows.push({path:r,size,mode:s.mode&511,sha256:h.digest('hex')});total+=size;
    }else throw Error('inventory contains special entry');
   }
  }
  walk(root);return {files:rows.length,bytes:total,sha256:digest(JSON.stringify(rows))};
 }
 const small=p=>{const s=fs.lstatSync(p);if(!s.isFile()||s.isSymbolicLink()||s.size>2097152)throw Error('invalid tuple file');const b=fs.readFileSync(p);return {bytes:b.length,sha256:digest(b)}};
 process.stdout.write(JSON.stringify({verified,metadata:{bytes:bytes.length,sha256:digest(bytes)},marker:small('/state/releases/'+id+'/.release-state.json'),retainedInventory:small('/state/retained-assets.json'),release:inventory('/state/releases/'+id),assets:inventory('/state/assets')}));
})().catch(e=>{console.error(e.message);process.exitCode=1});`;

export function validateTuple(tuple) {
  assert.equal(tuple.verified.valid, true);
  assert.match(tuple.verified.releaseId, /^[a-f0-9]{64}$/u);
  assert.ok(tuple.metadata.bytes > 1048576 && tuple.metadata.bytes <= 2097152);
  for (const part of ["metadata", "marker", "retainedInventory", "release", "assets"]) {
    assert.match(tuple[part].sha256, /^[a-f0-9]{64}$/u);
    assert.ok(Number.isSafeInteger(tuple[part].bytes) && tuple[part].bytes > 0);
  }
  assert.ok(tuple.release.files > 0 && tuple.assets.files > 0);
  return tuple;
}

export async function proveProductionRetry({ root, project, port, run, fetchImpl = fetch }) {
  assert.match(project, /^cabadrive-ci-[a-z0-9-]+$/u);
  const env = { ...process.env, COMPOSE_PROJECT_NAME: project, CABADRIVE_HOST_PORT: String(port) };
  const command =
    run ||
    ((file, args) =>
      execFileSync(file, args, { cwd: root, env, encoding: "utf8", maxBuffer: 4 * 1024 ** 2 }));
  const image = command("docker", ["compose", "images", "-q", "stager"]).trim();
  assert.match(image, /^(?:sha256:)?[a-f0-9]{64}$/u);
  const inspected = JSON.parse(command("docker", ["image", "inspect", image]))[0];
  assert.match(inspected.Id, /^sha256:[a-f0-9]{64}$/u);
  assert.ok(
    !inspected.Config.Volumes || Object.keys(inspected.Config.Volumes).length === 0,
    "probe image cannot create anonymous volumes",
  );
  const volume = `${project}_release-state`;
  const owned = JSON.parse(command("docker", ["volume", "inspect", volume]))[0];
  assert.equal(owned.Name, volume);
  assert.equal(owned.Labels["com.docker.compose.project"], project);
  const probe = () =>
    validateTuple(
      JSON.parse(
        command("docker", [
          "run",
          "--rm",
          "--network",
          "none",
          "--read-only",
          "--mount",
          `type=volume,source=${volume},target=/state,readonly,volume-nocopy`,
          "--entrypoint",
          "node",
          image,
          "-e",
          committedProbe,
        ]),
      ),
    );
  const qa = JSON.parse(
    readFileSync(resolve(root, "content/image-derivatives.manifest.json"), "utf8"),
  );
  const variants = qa.sources[0].variants.filter((v) => [480, 800, 1240].includes(v.width));
  assert.equal(variants.length, 9);
  assert.equal(new Set(variants.map((v) => `${v.width}/${v.format}`)).size, 9);
  const checks = async () => {
    const records = [];
    for (const variant of variants) {
      assert.match(variant.path, /^content\/img\/[a-zA-Z0-9_./-]+$/u);
      const response = await fetchImpl(`http://127.0.0.1:${port}/${variant.path}`);
      const bytes = Buffer.from(await response.arrayBuffer());
      const mime = { avif: "image/avif", webp: "image/webp", jpeg: "image/jpeg" }[variant.format];
      assert.equal(response.status, 200);
      assert.equal(hash(bytes), variant.sha256);
      assert.equal(response.headers.get("content-type")?.split(";")[0], mime);
      assert.match(
        response.headers.get("cache-control") || "",
        /public, max-age=31536000, immutable/u,
      );
      assert.equal(response.headers.get("x-content-type-options"), "nosniff");
      records.push({
        path: variant.path,
        width: variant.width,
        format: variant.format,
        status: response.status,
        bytes: bytes.length,
        sha256: hash(bytes),
        mime,
        immutable: true,
        nosniff: true,
      });
    }
    return records;
  };
  const before = probe();
  const httpBefore = await checks();
  command("make", ["stage"]); // Real default CMD; an exited make-up stager is insufficient.
  const after = probe();
  assert.deepEqual(after, before, "same-release retry changed committed tuple/inventory/bytes");
  const httpAfter = await checks();
  assert.deepEqual(httpAfter, httpBefore);
  return {
    status: "PRODUCTION_PUBLICATION_AND_REAL_RETRY_PASS",
    before,
    after,
    httpBefore,
    httpAfter,
    makeStageExit: 0,
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await proveProductionRetry({
    root: process.cwd(),
    project: process.env.COMPOSE_PROJECT_NAME,
    port: process.env.CABADRIVE_HOST_PORT || "5173",
  });
  const bytes = JSON.stringify(result, null, 2) + "\n";
  assert.ok(Buffer.byteLength(bytes) <= 64 * 1024, "production summary exceeds64KiB");
  writeFileSync(process.env.CABADRIVE_CI_PROOF + "/production.json", bytes, {
    mode: 0o600,
    flag: "wx",
  });
  console.log(result.status);
}
