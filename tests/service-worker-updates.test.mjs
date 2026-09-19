import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import ts from "typescript";

const source = readFileSync("src/serviceWorkerUpdates.ts", "utf8");
const compiled = ts
  .transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
      isolatedModules: true,
    },
  })
  .outputText.replace('import { useSyncExternalStore } from "react";\n', "");
const { createServiceWorkerUpdateManager } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
);

class Emitter {
  listeners = new Map();
  addEventListener(name, listener) {
    const listeners = this.listeners.get(name) ?? [];
    listeners.push(listener);
    this.listeners.set(name, listeners);
  }
  emit(name) {
    for (const listener of this.listeners.get(name) ?? []) listener();
  }
}

test("update manager registers uncached, checks immediately/hourly, and applies waiting worker once", async () => {
  const container = new Emitter();
  const messages = [];
  let updateCalls = 0;
  let reloads = 0;
  let interval;
  const waiting = { postMessage: (message) => messages.push(message) };
  const registration = Object.assign(new Emitter(), {
    waiting,
    installing: null,
    update: async () => {
      updateCalls += 1;
    },
  });
  container.register = async (url, options) => {
    assert.equal(url, "/sw.js");
    assert.deepEqual(options, { updateViaCache: "none" });
    return registration;
  };
  const manager = createServiceWorkerUpdateManager(
    container,
    () => {
      reloads += 1;
    },
    (handler, milliseconds) => {
      interval = handler;
      assert.equal(milliseconds, 60 * 60 * 1000);
    },
  );

  await manager.start();
  assert.equal(updateCalls, 1);
  assert.deepEqual(manager.getSnapshot(), { available: true, applying: false });
  manager.apply();
  assert.deepEqual(messages, [{ type: "SKIP_WAITING" }]);
  assert.deepEqual(manager.getSnapshot(), { available: true, applying: true });
  container.emit("controllerchange");
  container.emit("controllerchange");
  assert.equal(reloads, 1);
  await interval();
  assert.equal(updateCalls, 2);
});

test("update manager dismisses the same waiting worker and keeps failures non-fatal", async () => {
  const container = new Emitter();
  const waiting = { postMessage() {} };
  const registration = Object.assign(new Emitter(), {
    waiting,
    installing: null,
    update: async () => {
      throw new Error("offline");
    },
  });
  container.register = async () => registration;
  const manager = createServiceWorkerUpdateManager(
    container,
    () => {},
    () => {},
  );

  await manager.start();
  assert.equal(manager.getSnapshot().available, true);
  manager.dismiss();
  assert.deepEqual(manager.getSnapshot(), { available: false, applying: false });
});

test("update manager observes an installation already in progress at startup", async () => {
  const container = new Emitter();
  const installing = Object.assign(new Emitter(), { state: "installing" });
  const registration = Object.assign(new Emitter(), {
    waiting: null,
    installing,
    update: async () => undefined,
  });
  container.register = async () => registration;
  const manager = createServiceWorkerUpdateManager(
    container,
    () => {},
    () => {},
  );

  await manager.start();
  const waiting = { postMessage() {} };
  registration.waiting = waiting;
  installing.state = "installed";
  installing.emit("statechange");

  assert.deepEqual(manager.getSnapshot(), { available: true, applying: false });
});

test("controller change reloads only the initiator and clears the other tab banner", async () => {
  const container = new Emitter();
  const waiting = { postMessage() {} };
  const registration = Object.assign(new Emitter(), {
    waiting,
    installing: null,
    update: async () => undefined,
  });
  container.register = async () => registration;
  let initiatorReloads = 0;
  let observerReloads = 0;
  const initiator = createServiceWorkerUpdateManager(
    container,
    () => {
      initiatorReloads += 1;
    },
    () => {},
  );
  const observer = createServiceWorkerUpdateManager(
    container,
    () => {
      observerReloads += 1;
    },
    () => {},
  );

  await Promise.all([initiator.start(), observer.start()]);
  assert.equal(observer.getSnapshot().available, true);
  initiator.apply();
  registration.waiting = null;
  container.emit("controllerchange");
  container.emit("controllerchange");

  assert.equal(initiatorReloads, 1);
  assert.equal(observerReloads, 0);
  assert.deepEqual(observer.getSnapshot(), { available: false, applying: false });
});
