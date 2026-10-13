#!/usr/bin/env node
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { fixturePng } from "../tests/image-pipeline-fixtures.mjs";
import { diskPath, jsonBytes, sha256 } from "./image-pipeline.mjs";
import { runPipeline } from "./image-pipeline-cli.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const temporary = mkdtempSync(join(tmpdir(), "cabadrive-docker-images-"));
const context = join(temporary, "context");
const token = `cabadrive-images-${process.pid}-${Date.now()}`;
const images = Object.fromEntries(
  ["prepare", "build", "stager", "runtime"].map((stage) => [stage, `${token}-${stage}`]),
);
const containers = [];
const createdImages = new Set();
const volumes = [];
const excluded = [
  ".git",
  ".cache",
  ".claude",
  ".omc",
  ".cabadrive-release-handoff",
  "node_modules",
  "dist",
  "public/content",
  "playwright-report",
  "test-results",
  "content/assets-masters",
  "content/assets-derived",
];
const masterPath = "content/assets-masters/docker-pipeline-master.png";
const sourcePath = "content/assets/questions/source-bandinopla-testdeconducir-b/b1.jpg";
const user = `${process.getuid()}:${process.getgid()}`;
const securityHeaders = {
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=()",
  "content-security-policy":
    "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'",
};

function docker(args, { failure = false } = {}) {
  const result = spawnSync("docker", args, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  if (result.error) throw result.error;
  if (!failure && result.status !== 0)
    throw new Error(`docker ${args.join(" ")} failed:\n${result.stdout}\n${result.stderr}`);
  return result;
}
function build(target, image, failure = false) {
  const result = docker(["build", "--progress=plain", "--target", target, "-t", image, context], {
    failure,
  });
  if (result.status === 0) createdImages.add(image);
  if (failure) {
    assert.notEqual(result.status, 0, "former ignore must fail the real full build");
    assert.match(`${result.stdout}\n${result.stderr}`, /ENOENT[^\n]*content\/assets-masters/);
  }
  return result;
}
function files(directory, prefix = "") {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(prefix, entry.name);
    assert(!entry.isSymbolicLink(), `unexpected payload symlink: ${path}`);
    return entry.isDirectory() ? files(join(directory, entry.name), path) : [path];
  });
}

let operationError;
const cleanupErrors = [];
try {
  if (!process.env.CABADRIVE_DOCKER_IMAGES_UNAVAILABLE_PROBE) {
    const probeRoot = join(temporary, "missing-docker-probe");
    const emptyPath = join(temporary, "empty-path");
    mkdirSync(probeRoot);
    mkdirSync(emptyPath);
    const unavailable = spawnSync(process.execPath, [fileURLToPath(import.meta.url)], {
      cwd: root,
      encoding: "utf8",
      env: {
        ...process.env,
        PATH: emptyPath,
        TMPDIR: probeRoot,
        CABADRIVE_DOCKER_IMAGES_UNAVAILABLE_PROBE: "1",
      },
    });
    assert.notEqual(unavailable.status, 0);
    assert.match(unavailable.stderr, /spawnSync docker ENOENT/);
    assert.deepEqual(readdirSync(probeRoot), [], "missing Docker must not leak creator temp");
    console.log("Missing Docker fails preserving original error with no temporary leak PASS");
  }
  // Docker is a mandatory explicit acceptance command; unavailable Docker fails.
  docker(["info", "--format", "{{.ServerVersion}}"]);
  cpSync(root, context, {
    recursive: true,
    filter: (path) => {
      const pathInRoot = relative(root, path);
      return !excluded.some((item) => pathInRoot === item || pathInRoot.startsWith(`${item}/`));
    },
  });
  const sourceSha256 = sha256(readFileSync(join(context, sourcePath)));
  const fixtureRegistry = {
    schemaVersion: 1,
    sources: [{ sourcePath, masterPath, class: "a", profile: "photo", targetWidth: 480 }],
  };
  // Exercise preparation from nonempty metadata, including future production
  // checkouts. Only this owned tooling-preparation context is reset to empty.
  writeFileSync(join(context, "content/image-pipeline.sources.json"), jsonBytes(fixtureRegistry));
  const incoming = JSON.parse(
    readFileSync(join(context, "content/image-derivatives.manifest.json")),
  );
  incoming.sources = [{ ...fixtureRegistry.sources[0], variants: [] }];
  writeFileSync(join(context, "content/image-derivatives.manifest.json"), jsonBytes(incoming));
  assert.equal(incoming.sources.length, 1);
  writeFileSync(
    join(context, "content/image-pipeline.sources.json"),
    jsonBytes({ schemaVersion: 1, sources: [] }),
  );
  await runPipeline("build", { root: context, rasterOnly: true });
  assert.equal(
    JSON.parse(readFileSync(join(context, "content/image-derivatives.manifest.json"))).sources
      .length,
    0,
  );
  // Obtain exactly the production Linux tools and encoders without requiring a
  // second host installation in Docker CI. This preparatory build is empty.
  build("build", images.prepare);
  const png = await fixturePng("photo", 480, 160);
  mkdirSync(dirname(join(context, masterPath)), { recursive: true });
  writeFileSync(join(context, masterPath), png);
  writeFileSync(join(context, "content/image-pipeline.sources.json"), jsonBytes(fixtureRegistry));
  docker([
    "run",
    "--rm",
    "--network=none",
    "--user",
    user,
    "--mount",
    `type=bind,source=${context},target=/fixture`,
    "--entrypoint",
    "node",
    images.prepare,
    "scripts/build-images.mjs",
    "--root",
    "/fixture",
    "--raster-only",
  ]);
  const manifest = JSON.parse(
    readFileSync(join(context, "content/image-derivatives.manifest.json")),
  );
  assert.equal(manifest.sources.length, 1);
  const source = manifest.sources[0];
  assert.equal(source.sourceSha256, sha256(png));
  assert.equal(source.masterWidth, 480);
  assert.deepEqual(
    source.variants.map((variant) => variant.format),
    ["avif", "webp", "jpeg"],
  );
  assert.equal(
    source.variants.filter((variant) => Number.isFinite(variant.qa.ssimulacra2)).length,
    1,
  );
  for (const variant of source.variants) {
    assert(variant.qa.dssim <= 0.01);
    if (variant.qa.ssimulacra2 !== undefined) assert(variant.qa.ssimulacra2 >= 70);
    assert.equal(sha256(readFileSync(join(context, diskPath(variant.path)))), variant.sha256);
  }

  const dockerignore = readFileSync(join(context, ".dockerignore"), "utf8");
  writeFileSync(join(context, ".dockerignore"), `${dockerignore}\ncontent/assets-masters\n`);
  build("build", `${token}-former-ignore`, true);
  console.log("Former master context exclusion fails real production validation PASS");
  writeFileSync(join(context, ".dockerignore"), dockerignore);
  build("build", images.build);
  // Recompute actual QA even when an identical production build layer is cached.
  const validated = docker([
    "run",
    "--rm",
    "--network=none",
    "--entrypoint",
    "node",
    images.build,
    "scripts/content-image-derivatives.mjs",
  ]);
  assert.match(validated.stdout, /Images: 1 verified PNG masters/);
  const probe = `
    import assert from 'node:assert/strict';
    import {readFileSync} from 'node:fs';
    import {createHash} from 'node:crypto';
    const hash=(path)=>createHash('sha256').update(readFileSync(path)).digest('hex');
    assert.equal(hash('/app/${masterPath}'), ${JSON.stringify(source.sourceSha256)});
    const manifest=JSON.parse(readFileSync('/app/content/image-derivatives.manifest.json'));
    for(const variant of manifest.sources[0].variants)
      for(const prefix of ['/app/public/', '/app/dist/'])
        assert.equal(hash(prefix+variant.path),variant.sha256);
    console.log('Build master SHA and public/dist three-codec bytes PASS');
  `;
  docker([
    "run",
    "--rm",
    "--network=none",
    "--entrypoint",
    "node",
    images.build,
    "--input-type=module",
    "-e",
    probe,
  ]);
  assert.equal(sha256(readFileSync(join(context, sourcePath))), sourceSha256);
  assert.equal(sha256(readFileSync(join(context, masterPath))), source.sourceSha256);

  build("stager", images.stager);
  build("runtime", images.runtime);
  const candidate = join(temporary, "candidate");
  mkdirSync(candidate);
  const stager = docker(["create", "--name", `${token}-candidate`, images.stager]).stdout.trim();
  containers.push(stager);
  docker(["cp", `${stager}:/candidate/.`, candidate]);
  const payload = files(candidate);
  assert(payload.length > 0);
  for (const path of payload) {
    assert(
      !/(^|\/)(assets-masters|assets-derived|image-qa|image-qa-locks|image-pipeline|\.cache)(\/|$)/.test(
        path,
      ),
    );
    assert(
      !/(^|\/)(dssim|ssimulacra2_rs|install-receipt\.json|svg-optimization\.evidence\.json)$/.test(
        path,
      ),
    );
    assert.notEqual(path, masterPath);
    assert.notEqual(basename(path), basename(masterPath));
    assert.notEqual(sha256(readFileSync(join(candidate, path))), source.sourceSha256);
  }
  for (const variant of source.variants)
    assert.equal(sha256(readFileSync(join(candidate, variant.path))), variant.sha256);
  const stateVolume = docker([
    "volume",
    "create",
    "--label",
    `com.cabadrive.image-pipeline-test=${token}`,
    `${token}-release-state`,
  ]).stdout.trim();
  volumes.push(stateVolume);
  const publisher = docker([
    "create",
    "--name",
    `${token}-publisher`,
    "--network=none",
    "--mount",
    `type=volume,source=${stateVolume},target=/state`,
    "--env",
    `CABADRIVE_COMPOSE_PROJECT=${token}`,
    images.stager,
  ]).stdout.trim();
  containers.push(publisher);
  // Execute the production default CMD; its actual publication normalizes
  // private candidate files to readable 0644. Never chmod the fixture payload.
  docker(["start", "--attach", publisher]);
  const publishedProbe = `
    import assert from 'node:assert/strict';
    import {readFileSync,readdirSync,statSync} from 'node:fs';
    import {basename,join} from 'node:path';
    import {createHash} from 'node:crypto';
    const hash=(path)=>createHash('sha256').update(readFileSync(path)).digest('hex');
    const walk=(root,prefix='')=>readdirSync(root,{withFileTypes:true}).flatMap(e=>{
      assert(!e.isSymbolicLink(),'unexpected published payload symlink');
      return e.isDirectory()?walk(join(root,e.name),join(prefix,e.name)):[join(prefix,e.name)];
    });
    const site=walk('/state/current');
    const assets=walk('/state/assets').map(p=>'assets/'+p);
    for(const path of [...site,...assets]) {
      assert(!/(^|\\/)(assets-masters|assets-derived|image-qa|image-qa-locks|image-pipeline|\\.cache)(\\/|$)/.test(path));
      assert(!/(^|\\/)(dssim|ssimulacra2_rs|install-receipt\\.json|svg-optimization\\.evidence\\.json)$/.test(path));
      assert.notEqual(path, ${JSON.stringify(masterPath)});
      assert.notEqual(basename(path), ${JSON.stringify(basename(masterPath))});
      assert.notEqual(hash(path.startsWith('assets/')?'/state/'+path:'/state/current/'+path), ${JSON.stringify(source.sourceSha256)});
    }
    for(const variant of ${JSON.stringify(source.variants)}) {
      assert.equal(hash('/state/current/'+variant.path),variant.sha256);
      assert.equal(statSync('/state/current/'+variant.path).mode&0o777,0o644);
    }
    console.log(JSON.stringify({publishedFiles:site.length+assets.length,derivativeMode:'0644',forbiddenPayloadFiles:0}));
  `;
  const published = JSON.parse(
    docker([
      "run",
      "--rm",
      "--network=none",
      "--mount",
      `type=volume,source=${stateVolume},target=/state,readonly`,
      "--entrypoint",
      "node",
      images.stager,
      "--input-type=module",
      "-e",
      publishedProbe,
    ]).stdout,
  );
  const runtime = docker([
    "create",
    "--name",
    `${token}-runtime`,
    "-p",
    "127.0.0.1::8080",
    "--mount",
    `type=volume,source=${stateVolume},target=/state,readonly`,
    images.runtime,
  ]).stdout.trim();
  containers.push(runtime);
  docker(["start", runtime]);
  const address = docker(["port", runtime, "8080/tcp"]).stdout.trim();
  const url = `http://${address}`;
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      ready = (await fetch(url)).ok;
    } catch {
      /* startup connection refused */
    }
    if (ready) break;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  assert(ready, "isolated runtime must become HTTP ready");
  for (const variant of source.variants) {
    const response = await fetch(`${url}/${variant.path}`);
    assert.equal(response.status, 200);
    for (const [header, value] of Object.entries(securityHeaders))
      assert.equal(response.headers.get(header), value);
    assert.match(
      response.headers.get("content-type"),
      new RegExp(`image/${variant.format === "jpeg" ? "jpeg" : variant.format}`),
    );
    assert.equal(sha256(Buffer.from(await response.arrayBuffer())), variant.sha256);
  }
  const masterResponse = await fetch(`${url}/${masterPath}`);
  const masterResponseBytes = Buffer.from(await masterResponse.arrayBuffer());
  assert.equal(masterResponse.status, 200); // Preserve the existing SPA routing contract.
  assert.match(masterResponse.headers.get("content-type"), /text\/html/);
  assert(masterResponseBytes.equals(readFileSync(join(candidate, "index.html"))));
  assert.notEqual(sha256(masterResponseBytes), source.sourceSha256);
  assert.equal((await fetch(`${url}/content/assets/docker-pipeline-master.png`)).status, 404);
  console.log(
    JSON.stringify({
      status: "PASS",
      sourcePath,
      sourceSha256,
      masterPath,
      masterSha256: source.sourceSha256,
      variants: source.variants,
      payloadFiles: payload.length,
      forbiddenPayloadFiles: 0,
      published,
      securityHeaders,
      literalMasterResponse: "existing SPA shell only; no PNG disclosure",
      images,
      imageIds: Object.fromEntries(
        Object.entries(images).map(([name, image]) => [
          name,
          docker(["image", "inspect", "--format", "{{.Id}}", image]).stdout.trim(),
        ]),
      ),
    }),
  );
} catch (error) {
  operationError = error;
} finally {
  for (const container of containers.reverse()) {
    try {
      docker(["rm", "--force", container]);
      assert.notEqual(docker(["container", "inspect", container], { failure: true }).status, 0);
    } catch (error) {
      cleanupErrors.push(error);
    }
  }
  for (const image of createdImages) {
    try {
      docker(["image", "rm", image]);
      assert.notEqual(docker(["image", "inspect", image], { failure: true }).status, 0);
    } catch (error) {
      cleanupErrors.push(error);
    }
  }
  for (const volume of volumes) {
    try {
      docker(["volume", "rm", volume]);
      assert.notEqual(docker(["volume", "inspect", volume], { failure: true }).status, 0);
    } catch (error) {
      cleanupErrors.push(error);
    }
  }
  try {
    rmSync(temporary, { recursive: true, force: true });
  } catch (error) {
    cleanupErrors.push(error);
  }
}
if (cleanupErrors.length)
  throw new AggregateError(
    operationError ? [operationError, ...cleanupErrors] : cleanupErrors,
    "Image-pipeline operation/teardown errors (creator temporary removal attempted)",
  );
console.log(`Exact-owned image-pipeline fixture teardown: ${token}`);
if (operationError) throw operationError;
