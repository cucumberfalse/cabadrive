#!/usr/bin/env node
import assert from "node:assert/strict";
import { spawnSync as nativeSpawnSync } from "node:child_process";
import { createInterruptionGate } from "./docker-test-interruption.mjs";
const interruption = createInterruptionGate();
const spawnSync = (...args) =>
  interruption.forward(
    () => nativeSpawnSync(...args),
    (result) => {
      if (args[0] !== "docker" || result.status !== 0) return;
      const command = args[1];
      if (command[0] === "build" && command.includes("-t"))
        createdImages.add(command[command.indexOf("-t") + 1]);
      if (
        command[0] === "volume" &&
        command[1] === "create" &&
        command.at(-1).startsWith(token + "-")
      ) {
        const volume = result.stdout.trim();
        if (!volumes.includes(volume)) volumes.push(volume);
      }
      if (
        command[0] === "create" &&
        command[command.indexOf("--name") + 1]?.startsWith(token + "-")
      ) {
        const container = result.stdout.trim();
        if (!containers.includes(container)) containers.push(container);
      }
    },
  );
const checkedLog = (...args) => {
  interruption.check();
  console.log(...args);
};
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
  statfsSync,
  realpathSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import {
  checkpointOptions,
  checkpointPaths,
  checkpointInventory,
  checkpointDigest,
  checkpointExcluded,
  readCheckpoint,
  writeCheckpoint,
  lockCheckpoint,
} from "./docker-image-checkpoint.mjs";
import { copyImageTestContext } from "./copy-image-test-context.mjs";
import { prepareLinuxFixtureDependencies } from "./docker-image-fixture-dependencies.mjs";
import { fixturePng } from "../tests/image-pipeline-fixtures.mjs";
import { diskPath, jsonBytes, sha256, metricSample, variantKey } from "./image-pipeline.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const options = checkpointOptions(process.argv.slice(2));
const resumedPaths = options.resume ? checkpointPaths(options.resume) : undefined;
const temporary =
  resumedPaths?.temporary ?? realpathSync(mkdtempSync(join(tmpdir(), "cabadrive-docker-images-")));
const context = join(temporary, "context");
const token = options.resume
  ? JSON.parse(readFileSync(resumedPaths.receiptPath)).token
  : `cabadrive-images-${process.pid}-${Date.now()}`;
const images = Object.fromEntries(
  ["prepare", "stager", "runtime"].map((stage) => [stage, `${token}-${stage}`]),
);
const containers = [];
const createdImages = new Set();
const volumes = [];
const excluded = checkpointExcluded;
const masterPath = "content/assets-masters/docker-pipeline-master.png";
const sourcePath = "content/assets/docker-pipeline-source.png";
const securityHeaders = {
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=()",
  "content-security-policy":
    "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'",
};

function docker(args, { failure = false, input } = {}) {
  const result = spawnSync("docker", args, {
    cwd: root,
    encoding: "utf8",
    input,
    maxBuffer: 64 * 1024 * 1024,
  });
  if (result.error) throw result.error;
  if (!failure && result.status !== 0)
    throw new Error(`docker ${args.join(" ")} failed:\n${result.stdout}\n${result.stderr}`);
  return result;
}
function capacity(phase, dockerPeakGiB = 0, hostPeakGiB = 0) {
  const probe = docker([
    "run",
    "--rm",
    "--network=none",
    "--name",
    `${token}-capacity`,
    "--entrypoint",
    "df",
    "alpine:3.21",
    "-k",
    "/",
  ]).stdout;
  const backingFree = Number(probe.trim().split("\n").at(-1).split(/\s+/)[3]) * 1024;
  const host = statfsSync(temporary);
  const hostFree = host.bavail * host.bsize;
  assert(Number.isFinite(backingFree));
  assert(
    backingFree >= (2 + dockerPeakGiB) * 1024 ** 3,
    `Docker backing needs remaining ${dockerPeakGiB} GiB plus 2 GiB reserve`,
  );
  assert(
    hostFree >= (2 + hostPeakGiB) * 1024 ** 3,
    `Host needs remaining ${hostPeakGiB} GiB plus 2 GiB reserve`,
  );
  checkedLog(
    JSON.stringify({
      phase,
      checkedAt: new Date().toISOString(),
      backingFree,
      hostFree,
      dockerPeakGiB,
      hostPeakGiB,
    }),
  );
}
function build(target, image, failure = false) {
  if (failure) capacity(`before-${target}`, 1.65, 1.75);
  else if (target !== "runtime") capacity(`before-${target}`, 3.24, 3.34);
  else capacity(`before-${target}`);
  checkedLog(`Docker target ${target} start ${new Date().toISOString()}`);
  const result = docker(
    [
      "build",
      "--progress=plain",
      "--target",
      target,
      "--label",
      `com.cabadrive.image-pipeline-test=${token}`,
      "--label",
      `com.cabadrive.image-pipeline-input=${checkpointDigest(inputInventory)}`,
      "--label",
      `com.cabadrive.image-pipeline-context=${checkpointDigest(temporary)}`,
      "-t",
      image,
      context,
    ],
    {
      failure,
    },
  );
  if (result.status === 0) createdImages.add(image);
  checkedLog(result.stdout, result.stderr);
  capacity(`after-${target}`);
  if (failure) {
    assert.notEqual(result.status, 0, "former ignore must fail the real full build");
    assert.match(`${result.stdout}\n${result.stderr}`, /ENOENT[^\n]*content\/assets-masters/);
  }
  return result;
}

let operationError;
let inputInventory;
let productionProof;
let productionBuilds = [];
let negativeProof;
let ownershipValidated = !options.resume;
let releaseLock;
let intentionalCheckpoint;
let finalReport;
let sealKeyPath;
const checkpointSignal = Symbol("intentional partial checkpoint");
const inspectImage = (image) => JSON.parse(docker(["image", "inspect", image]).stdout)[0];
const commandProof = (target, result) => ({
  target,
  exit: result.status,
  stdout: result.stdout,
  stderr: result.stderr,
  stdoutSha256: sha256(Buffer.from(result.stdout)),
  stderrSha256: sha256(Buffer.from(result.stderr)),
});
function stopAt(boundary) {
  interruption.check();
  if (options.after !== boundary) return;
  assert.equal(containers.length, 0);
  assert.equal(volumes.length, 0);
  assert.equal(
    docker([
      "ps",
      "--filter",
      `label=com.cabadrive.image-pipeline-test=${token}`,
      "--format",
      "{{.ID}}",
    ]).stdout.trim(),
    "",
    "checkpoint has running owned containers",
  );
  assert.deepEqual(checkpointInventory(root), inputInventory, "included root changed during phase");
  assert.deepEqual(
    checkpointInventory(context),
    inputInventory,
    "included context changed during phase",
  );
  interruption.check();
  const saved = writeCheckpoint({
    temporary,
    root,
    token,
    images,
    inventory: inputInventory,
    imageInspections: Object.fromEntries(
      ["prepare", "stager"].map((stage) => [stage, inspectImage(images[stage])]),
    ),
    production: productionProof,
    builds: productionBuilds,
    negative: negativeProof,
  });
  sealKeyPath = saved.sealKeyPath;
  // Verify the saved actual proofs through the same continuation gate.
  readCheckpoint(saved.path, root, inspectImage);
  intentionalCheckpoint = {
    status: "PARTIAL",
    completed: boundary,
    overallAcceptance: false,
    checkpoint: saved.path,
    retainedImages: [images.prepare, images.stager],
    context,
    inputSha256: checkpointDigest(inputInventory),
    nextPhase: boundary === "production" ? "negative" : "releases",
  };
  throw checkpointSignal;
}
const cleanupErrors = [];
try {
  interruption.check();
  if (!options.resume && !process.env.CABADRIVE_DOCKER_IMAGES_UNAVAILABLE_PROBE) {
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
    checkedLog("Missing Docker fails preserving original error with no temporary leak PASS");
  }
  // Docker is a mandatory explicit acceptance command; unavailable Docker fails.
  docker(["info", "--format", "{{.ServerVersion}}"]);
  if (options.resume) {
    releaseLock = lockCheckpoint(temporary);
    const resumed = readCheckpoint(options.resume, root, inspectImage);
    assert(
      !options.after ||
        (resumed.receipt.completed === "production" && options.after === "negative"),
      "checkpoint boundary already completed",
    );
    inputInventory = resumed.inventory;
    productionProof = resumed.production;
    productionBuilds = resumed.builds;
    sealKeyPath = resumed.sealKeyPath;
    if (resumed.receipt.completed === "negative")
      negativeProof = JSON.parse(readFileSync(join(temporary, "negative-predicate.json")));
    ownershipValidated = true;
    createdImages.add(images.prepare);
    createdImages.add(images.stager);
  } else {
    capacity("before-owned-context", 3.24, process.platform === "darwin" ? 3.34 : 4.47);
    checkedLog(JSON.stringify(copyImageTestContext(root, context, excluded)));
    capacity("after-owned-context", 3.24, 3.34);
    inputInventory = checkpointInventory(context);
    assert.deepEqual(
      checkpointInventory(root),
      inputInventory,
      "copy differs from complete included source",
    );
    releaseLock = lockCheckpoint(temporary);
  }
  const productionRegistry = JSON.parse(
    readFileSync(join(context, "content/image-pipeline.sources.json")),
  );
  assert.equal(
    productionRegistry.sources.filter((source) => source.class === "c").length,
    275,
    "Docker acceptance requires the real complete production inventory",
  );
  const fixtureRegistry = {
    schemaVersion: 1,
    sources: [
      ...productionRegistry.sources,
      { sourcePath, masterPath, class: "a", profile: "photo", targetWidth: 480 },
    ].sort((a, b) => a.sourcePath.localeCompare(b.sourcePath)),
  };
  // Build the actual complete production corpus before adding an owned class-a
  // fixture. Neither preparation nor acceptance bypasses production validation.
  if (!options.resume) {
    productionBuilds = [
      commandProof(
        "image-pipeline-fixture-tools",
        build("image-pipeline-fixture-tools", images.prepare),
      ),
      commandProof("stager", build("stager", images.stager)),
    ];
  }
  const productionManifest = JSON.parse(
    readFileSync(join(context, "content/image-derivatives.manifest.json")),
  );
  assert.equal(productionManifest.sources.length, 275);
  assert.equal(productionManifest.sources.flatMap((source) => source.variants).length, 3321);
  const candidateResult = docker(
    [
      "run",
      "--rm",
      "-i",
      "--network=none",
      "--entrypoint",
      "node",
      images.stager,
      "--input-type=module",
    ],
    {
      input: `import assert from "node:assert/strict"; import {readFileSync,readdirSync} from "node:fs"; import {join} from "node:path"; import {createHash} from "node:crypto";
    const hash=(path)=>createHash("sha256").update(readFileSync(path)).digest("hex");
    const masters=new Set(${JSON.stringify(productionManifest.sources.map((source) => source.sourceSha256))});
    const walk=(path)=>readdirSync(path,{withFileTypes:true}).flatMap(e=>{assert(!e.isSymbolicLink());assert(e.isDirectory()||e.isFile());return e.isDirectory()?walk(join(path,e.name)):[join(path,e.name)];});
    for(const path of walk("/candidate")){assert(!/(assets-masters|assets-derived|image-qa|install-receipt|ticket-upscale)/.test(path));assert(!masters.has(hash(path)));}
    for(const variant of ${JSON.stringify(productionManifest.sources.flatMap((source) => source.variants))}) assert.equal(hash("/candidate/"+variant.path),variant.sha256);
    const inventory=walk("/candidate").sort().map(path=>({path:path.slice("/candidate/".length),sha256:hash(path)}));
    console.log(JSON.stringify({status:"PRODUCTION_PAYLOAD_PASS",productionSources:275,variants:3321,inventory}));`,
    },
  );
  const candidateProof = {
    ...commandProof("production-candidate", candidateResult),
    inputSha256: checkpointDigest(inputInventory),
    imageId: inspectImage(images.stager).Id,
    result: JSON.parse(candidateResult.stdout),
  };
  candidateProof.resultSha256 = checkpointDigest(candidateProof.result);
  checkedLog(JSON.stringify({ phase: "production-candidate-predicate", ...candidateProof }));
  if (options.resume)
    assert.deepEqual(candidateProof, productionProof, "actual retained candidate changed");
  else productionProof = candidateProof;
  stopAt("production");
  if (!negativeProof) {
    const dockerignore = readFileSync(join(context, ".dockerignore"), "utf8");
    const filteredBytes = inputInventory
      .filter((entry) => !entry.path.startsWith("content/assets-masters/"))
      .reduce((sum, entry) => sum + entry.bytes, 0);
    assert(
      filteredBytes <= 0.75 * 1024 ** 3,
      "negative filtered context exceeds approved0.75GiB bound",
    );
    try {
      writeFileSync(join(context, ".dockerignore"), `${dockerignore}\ncontent/assets-masters\n`);
      const result = build("build", `${token}-former-ignore`, true);
      negativeProof = {
        ...commandProof("build", result),
        inputSha256: checkpointDigest(inputInventory),
        filteredBytes,
      };
      checkedLog(JSON.stringify({ phase: "former-ignore-predicate", ...negativeProof }));
      checkedLog("Former master context exclusion fails real production validation PASS");
    } finally {
      interruption.beginCleanup();
      try {
        writeFileSync(join(context, ".dockerignore"), dockerignore);
      } finally {
        interruption.endCleanup();
      }
    }
  }
  stopAt("negative");
  // Include up to128MiB of bounded complete package/native proof records.
  capacity("before-owned-linux-fixture-and-two-releases", 2.03, 2.66);
  const linux = prepareLinuxFixtureDependencies({
    docker,
    context,
    image: images.prepare,
    token,
    volumes,
    uid: process.getuid(),
    gid: process.getgid(),
    evidenceRoot: join(root, ".cache/image-qa/ticket-upscale"),
  });
  const ownedRun = linux.run;
  const pnpmVersion = ownedRun(["pnpm", "--version"]).stdout.trim();
  assert.equal(pnpmVersion, "10.33.0");
  checkedLog("Owned Linux frozen lock/modules and pnpm10.33.0 PASS");
  const journalPath = join(context, "content/image-metadata/ticket-upscale.journal.json");
  const journalBytes = readFileSync(journalPath);
  const journal = JSON.parse(journalBytes);
  const validateProductionContext = () =>
    ownedRun(["node", "scripts/content-image-derivatives.mjs"], true);
  try {
    rmSync(journalPath);
    const missing = validateProductionContext();
    assert.notEqual(missing.status, 0);
    assert.match(`${missing.stdout}\n${missing.stderr}`, /ENOENT[^\n]*ticket-upscale\.journal/);
  } finally {
    interruption.beginCleanup();
    try {
      writeFileSync(journalPath, journalBytes);
    } finally {
      interruption.endCleanup();
    }
  }
  const reviewPath = join(context, journal.records[0].reviewPath);
  const reviewBytes = readFileSync(reviewPath);
  try {
    writeFileSync(reviewPath, Buffer.concat([reviewBytes, Buffer.from(" ")]));
    const tampered = validateProductionContext();
    assert.notEqual(tampered.status, 0);
    assert.match(`${tampered.stdout}\n${tampered.stderr}`, /individual review integrity drift/);
  } finally {
    interruption.beginCleanup();
    try {
      writeFileSync(reviewPath, reviewBytes);
    } finally {
      interruption.endCleanup();
    }
  }
  checkedLog("Real production275 rejects missing journal and tampered individual review PASS");
  const png = await interruption.wait(() => fixturePng("photo", 480, 160));
  mkdirSync(dirname(join(context, masterPath)), { recursive: true });
  writeFileSync(join(context, masterPath), png);
  const canonicalSource = await interruption.wait(() =>
    sharp(png).resize(240, 80).png().toBuffer(),
  );
  writeFileSync(join(context, sourcePath), canonicalSource);
  const sourceSha256 = sha256(canonicalSource);
  assert.notEqual(
    sourceSha256,
    sha256(png),
    "canonical source and larger master have distinct bytes",
  );
  writeFileSync(join(context, "content/image-pipeline.sources.json"), jsonBytes(fixtureRegistry));
  capacity("before-first-fixture-generation");
  ownedRun(["node", "scripts/build-images.mjs"]);
  capacity("after-first-fixture-generation");
  const manifest = JSON.parse(
    readFileSync(join(context, "content/image-derivatives.manifest.json")),
  );
  assert.equal(manifest.sources.length, productionRegistry.sources.length + 1);
  const source = manifest.sources.find((source) => source.sourcePath === sourcePath);
  assert.equal(source.sourceSha256, sha256(png));
  assert.equal(source.masterWidth, 480);
  assert.deepEqual(
    source.variants.map((variant) => variant.format),
    ["avif", "webp", "jpeg"],
  );
  const globalVariants = manifest.sources.flatMap((source) =>
    source.variants.map((variant) => ({ ...variant, sourcePath: source.sourcePath })),
  );
  const globalSample = metricSample(globalVariants);
  assert.equal(globalSample.size, Math.ceil(globalVariants.length * 0.05));
  for (const variant of globalVariants)
    assert.equal(
      Number.isFinite(variant.qa.ssimulacra2),
      globalSample.has(variantKey(variant)),
      "production native metric evidence must match the complete global deterministic sample",
    );
  const checkChangedFixtureBytes = (variants) => {
    const paths = new Set([
      sourcePath,
      masterPath,
      "content/image-pipeline.sources.json",
      "content/image-derivatives.manifest.json",
      "content/image-delivery.manifest.json",
      ...variants.map((variant) => diskPath(variant.path)),
    ]);
    const changedBytes = [...paths].reduce(
      (sum, path) => sum + readFileSync(join(context, path)).length,
      0,
    );
    assert(
      changedBytes <= 10 * 1024 ** 2,
      "fixture/manifest changed-byte budget exceeds10MiB; revise host forecast",
    );
    checkedLog(JSON.stringify({ fixtureChangedBytes: changedBytes }));
  };
  checkChangedFixtureBytes(source.variants);
  for (const variant of source.variants) {
    assert(variant.qa.dssim <= 0.01);
    if (variant.qa.ssimulacra2 !== undefined) assert(variant.qa.ssimulacra2 >= 70);
    assert.equal(sha256(readFileSync(join(context, diskPath(variant.path)))), variant.sha256);
  }

  capacity("before-first-release-build");
  const fixtureBuild = ownedRun(["pnpm", "run", "build"]);
  linux.assertIntegrity();
  capacity("after-first-release-build");
  checkedLog(fixtureBuild.stdout, fixtureBuild.stderr);
  // Recompute actual QA even when an identical production build layer is cached.
  const validated = ownedRun(["node", "scripts/content-image-derivatives.mjs"]);
  linux.assertIntegrity();
  assert.match(
    validated.stdout,
    new RegExp(`Images: ${manifest.sources.length} verified PNG masters`),
  );
  const probe = `
    import assert from 'node:assert/strict';
    import {readFileSync} from 'node:fs';
    import {createHash} from 'node:crypto';
    const hash=(path)=>createHash('sha256').update(readFileSync(path)).digest('hex');
    assert.equal(hash('/app/${masterPath}'), ${JSON.stringify(source.sourceSha256)});
    const manifest=JSON.parse(readFileSync('/app/content/image-derivatives.manifest.json'));
    for(const variant of manifest.sources.find(source=>source.sourcePath===${JSON.stringify(sourcePath)}).variants)
      for(const prefix of ['/app/public/', '/app/dist/'])
        assert.equal(hash(prefix+variant.path),variant.sha256);
    console.log('Build master SHA and public/dist three-codec bytes PASS');
  `;
  ownedRun(["node", "--input-type=module", "-e", probe]);
  assert.equal(sha256(readFileSync(join(context, sourcePath))), sourceSha256);
  assert.equal(sha256(readFileSync(join(context, masterPath))), source.sourceSha256);

  build("runtime", images.runtime);
  const firstOutputs = linux.probeOutputs();
  const payload = firstOutputs.dist.files;
  assert(payload.length > 0);
  for (const record of payload) {
    const path = record.path;
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
    assert.notEqual(record.sha256, source.sourceSha256);
  }
  for (const variant of source.variants)
    assert.equal(payload.find((record) => record.path === variant.path)?.sha256, variant.sha256);
  const stateVolume = docker([
    "volume",
    "create",
    "--label",
    `com.cabadrive.image-pipeline-test=${token}`,
    `${token}-release-state`,
  ]).stdout.trim();
  if (!volumes.includes(stateVolume)) volumes.push(stateVolume);
  const publisher = docker([
    "create",
    "--name",
    `${token}-publisher`,
    "--network=none",
    "--mount",
    `type=volume,source=${stateVolume},target=/state`,
    "--env",
    `CABADRIVE_COMPOSE_PROJECT=${token}`,
    "--mount",
    linux.candidateMount,
    images.stager,
  ]).stdout.trim();
  if (!containers.includes(publisher)) containers.push(publisher);
  // Execute the production default CMD; its actual publication normalizes
  // private candidate files to readable 0644. Never chmod the fixture payload.
  docker(["start", "--attach", publisher]);
  const publishedProbe = `
    import assert from 'node:assert/strict';
    import {readFileSync,readdirSync,statSync} from 'node:fs';
    import {basename,join} from 'node:path';
    import {createHash} from 'node:crypto';
    import {verifyCommittedState} from '/app/scripts/stage-static-release.mjs';
    const committed=verifyCommittedState('/state');assert.equal(committed.valid,true,JSON.stringify(committed));
    const expected=JSON.parse(readFileSync(0,'utf8'));assert(Array.isArray(expected)&&expected.length>0);
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
    for(const record of expected)assert.equal(hash(record.path.startsWith('assets/')?'/state/'+record.path:'/state/current/'+record.path),record.sha256,'complete native candidate publication byte binding');
    console.log(JSON.stringify({publishedFiles:site.length+assets.length,derivativeMode:'0644',forbiddenPayloadFiles:0,completeCandidateFiles:expected.length,committedReleaseId:committed.releaseId}));
  `;
  const published = JSON.parse(
    docker(
      [
        "run",
        "--rm",
        "-i",
        "--network=none",
        "--mount",
        `type=volume,source=${stateVolume},target=/state,readonly`,
        "--entrypoint",
        "node",
        images.stager,
        "--input-type=module",
        "-e",
        publishedProbe,
      ],
      { input: JSON.stringify(payload) },
    ).stdout,
  );
  linux.assertCandidateUnchanged(firstOutputs.dist);
  // Publish a second genuine build with a changed owned master. The complete
  // production journal remains intact; ordinary generation/validation applies.
  const secondMaster = await interruption.wait(() =>
    sharp(png).modulate({ brightness: 0.97, hue: 8 }).png().toBuffer(),
  );
  assert.notEqual(sha256(secondMaster), source.sourceSha256);
  writeFileSync(join(context, masterPath), secondMaster);
  ownedRun(["node", "scripts/build-images.mjs"]);
  const secondManifest = JSON.parse(
    readFileSync(join(context, "content/image-derivatives.manifest.json")),
  );
  const secondSource = secondManifest.sources.find((record) => record.sourcePath === sourcePath);
  assert.equal(secondSource.sourceSha256, sha256(secondMaster));
  assert.equal(secondManifest.sources.length, manifest.sources.length);
  for (const old of source.variants) {
    assert(
      !secondSource.variants.some((variant) => variant.path === old.path),
      "second release needs genuinely new hashed URLs",
    );
    assert.equal(
      sha256(readFileSync(join(context, diskPath(old.path)))),
      old.sha256,
      "append-only source history retains the first release bytes",
    );
  }
  checkChangedFixtureBytes([...source.variants, ...secondSource.variants]);
  capacity("before-second-release-build");
  const secondBuild = ownedRun(["pnpm", "run", "build"]);
  linux.assertIntegrity();
  capacity("after-second-release-build");
  checkedLog(secondBuild.stdout, secondBuild.stderr);
  const secondOutputs = linux.probeOutputs();
  const secondPayload = secondOutputs.dist.files;
  for (const variant of [...source.variants, ...secondSource.variants])
    assert.equal(
      secondPayload.find((record) => record.path === variant.path)?.sha256,
      variant.sha256,
      "second complete native static package contains both releases",
    );
  const secondPublisher = docker([
    "create",
    "--name",
    `${token}-publisher-next`,
    "--network=none",
    "--mount",
    `type=volume,source=${stateVolume},target=/state`,
    "--env",
    `CABADRIVE_COMPOSE_PROJECT=${token}`,
    "--mount",
    linux.candidateMount,
    images.stager,
  ]).stdout.trim();
  if (!containers.includes(secondPublisher)) containers.push(secondPublisher);
  docker(["start", "--attach", secondPublisher]);
  const retainedProbe = publishedProbe.replace(
    JSON.stringify(source.variants),
    JSON.stringify([...source.variants, ...secondSource.variants]),
  );
  docker(
    [
      "run",
      "--rm",
      "-i",
      "--network=none",
      "--mount",
      `type=volume,source=${stateVolume},target=/state,readonly`,
      "--entrypoint",
      "node",
      images.stager,
      "--input-type=module",
      "-e",
      retainedProbe,
    ],
    { input: JSON.stringify(secondPayload) },
  );
  linux.assertCandidateUnchanged(secondOutputs.dist);
  checkedLog(
    "Two real complete static/Docker releases retain all old and new derivative hashes PASS",
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
  if (!containers.includes(runtime)) containers.push(runtime);
  docker(["start", runtime]);
  const address = docker(["port", runtime, "8080/tcp"]).stdout.trim();
  const url = `http://${address}`;
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      ready = (await interruption.wait(() => fetch(url))).ok;
    } catch {
      /* startup connection refused */
    }
    if (ready) break;
    await interruption.wait(() => new Promise((resolve) => setTimeout(resolve, 250)));
  }
  assert(ready, "isolated runtime must become HTTP ready");
  for (const variant of [...source.variants, ...secondSource.variants]) {
    const response = await interruption.wait(() => fetch(`${url}/${variant.path}`));
    assert.equal(response.status, 200);
    assert.match(response.headers.get("cache-control"), /max-age=31536000/);
    assert.match(response.headers.get("cache-control"), /immutable/);
    for (const [header, value] of Object.entries(securityHeaders))
      assert.equal(response.headers.get(header), value);
    assert.match(
      response.headers.get("content-type"),
      new RegExp(`image/${variant.format === "jpeg" ? "jpeg" : variant.format}`),
    );
    assert.equal(
      sha256(Buffer.from(await interruption.wait(() => response.arrayBuffer()))),
      variant.sha256,
    );
  }
  const masterResponse = await interruption.wait(() => fetch(`${url}/${masterPath}`));
  const masterResponseBytes = Buffer.from(
    await interruption.wait(() => masterResponse.arrayBuffer()),
  );
  assert.equal(masterResponse.status, 200); // Preserve the existing SPA routing contract.
  assert.match(masterResponse.headers.get("content-type"), /text\/html/);
  const nativeIndexSha256 = secondPayload.find((record) => record.path === "index.html")?.sha256;
  assert(nativeIndexSha256, "actual native index inventory required");
  assert.equal(sha256(masterResponseBytes), nativeIndexSha256);
  assert.notEqual(sha256(masterResponseBytes), source.sourceSha256);
  assert.equal(
    (await interruption.wait(() => fetch(`${url}/content/assets/docker-pipeline-master.png`)))
      .status,
    404,
  );
  for (const extension of ["avif", "webp", "jpg"]) {
    const missing = await interruption.wait(() => fetch(`${url}/content/img/absent.${extension}`));
    assert.equal(missing.status, 404);
    assert(
      sha256(Buffer.from(await interruption.wait(() => missing.arrayBuffer()))) !==
        nativeIndexSha256,
      "missing derivatives cannot substitute the SPA shell",
    );
    assert(!missing.headers.get("cache-control")?.includes("immutable"));
  }
  interruption.check();
  finalReport = {
    status: "PASS",
    completedPhases: [
      "production",
      "negative",
      "two-releases",
      "runtime",
      "exact-creator-teardown",
    ],
    inputSha256: checkpointDigest(inputInventory),
    phaseEvidence: { production: productionProof, productionBuilds, negative: negativeProof },
    viteTemporaryBoundary: linux.temporaryProof,
    sourcePath,
    sourceSha256,
    masterPath,
    masterSha256: source.sourceSha256,
    variants: source.variants,
    secondReleaseVariants: secondSource.variants,
    retainedDerivativeUrls: [...source.variants, ...secondSource.variants].map(
      (variant) => variant.path,
    ),
    productionSources: 275,
    productionMetricSample: globalSample.size,
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
  };
} catch (error) {
  if (error !== checkpointSignal) operationError = error;
} finally {
  interruption.beginCleanup();
  try {
    if (ownershipValidated && !intentionalCheckpoint) {
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
        if (sealKeyPath) rmSync(sealKeyPath);
      } catch (error) {
        cleanupErrors.push(error);
      }
    }
    if (releaseLock) {
      try {
        releaseLock();
      } catch (error) {
        cleanupErrors.push(error);
      }
    }
  } finally {
    interruption.endCleanup();
  }
}
if (cleanupErrors.length)
  throw new AggregateError(
    operationError ? [operationError, ...cleanupErrors] : cleanupErrors,
    "Image-pipeline operation/teardown errors (creator temporary removal attempted)",
  );
if (!intentionalCheckpoint && ownershipValidated)
  checkedLog(`Exact-owned image-pipeline fixture teardown: ${token}`);
if (operationError) throw operationError;
if (intentionalCheckpoint) checkedLog(JSON.stringify(intentionalCheckpoint));
else {
  checkedLog(JSON.stringify(finalReport));
}
