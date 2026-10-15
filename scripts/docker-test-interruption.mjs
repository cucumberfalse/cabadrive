import { execFileSync } from "node:child_process";
import { lstatSync, readFileSync, realpathSync } from "node:fs";
import { isAbsolute, join } from "node:path";

/** Cooperative command-boundary cancellation; cleanup never reopens forward admission. */
export function createInterruptionGate(env = process.env) {
  let cancelled;
  let cleanupDepth = 0;
  const directory = env.CABADRIVE_CI_STOP_DIR;
  const token = env.CABADRIVE_CI_STOP_TOKEN;
  const owner = env.CABADRIVE_CI_STOP_OWNER;
  const fail = (reason) => {
    cancelled ||= new Error(`Docker fixture cancelled: ${reason}`);
  };
  process.on("SIGINT", () => fail("SIGINT"));
  function privateEntry(path, directoryEntry) {
    const info = lstatSync(path);
    if (
      info.isSymbolicLink() ||
      (directoryEntry ? !info.isDirectory() : !info.isFile()) ||
      info.uid !== process.getuid() ||
      (info.mode & 0o777) !== (directoryEntry ? 0o700 : 0o600)
    )
      throw new Error("invalid private stop-marker ownership/type/mode");
    return info;
  }
  function check() {
    try {
      if (directory || token || owner) {
        if (
          !Number.isSafeInteger(Number(owner)) ||
          Number(owner) <= 1 ||
          !directory ||
          !isAbsolute(directory) ||
          !/^[a-f0-9]{64}$/u.test(token || "") ||
          !/^[1-9][0-9]*$/u.test(owner || "")
        )
          throw new Error("malformed stop-marker configuration");
        privateEntry(directory, true);
        if (realpathSync(directory) !== directory) throw new Error("aliased stop-marker directory");
        const path = join(directory, "stop.json");
        let info;
        try {
          info = privateEntry(path, false);
        } catch (error) {
          if (error.code !== "ENOENT") throw error;
        }
        if (info) {
          if (info.size > 1024) throw new Error("stop marker exceeds cap");
          const marker = JSON.parse(readFileSync(path, "utf8"));
          const group =
            process.platform === "linux"
              ? Number(readFileSync("/proc/self/stat", "utf8").split(") ").at(-1).split(" ")[2])
              : Number(
                  execFileSync("ps", ["-o", "pgid=", "-p", String(process.pid)], {
                    encoding: "utf8",
                    maxBuffer: 1024,
                  }).trim(),
                );
          if (marker.groupPid !== group)
            throw new Error("stop marker belongs to another process group");
          if (
            marker.schemaVersion !== 1 ||
            marker.token !== token ||
            marker.ownerPid !== Number(owner) ||
            !Number.isSafeInteger(marker.groupPid) ||
            marker.groupPid <= 1 ||
            marker.reason !== "resource-observer-stop"
          )
            throw new Error("wrong stop-marker invocation");
          fail("owned observer marker");
        }
      }
    } catch (error) {
      fail(error.message);
    }
    if (cancelled && cleanupDepth === 0) throw cancelled;
  }
  function forward(operation, register = () => {}) {
    check();
    let result;
    try {
      result = operation();
    } catch (error) {
      check();
      throw error;
    }
    try {
      check();
    } catch (error) {
      register(result);
      throw error;
    }
    return result;
  }
  async function wait(operation) {
    check();
    try {
      const result = await operation();
      check();
      return result;
    } catch (error) {
      check();
      throw error;
    }
  }
  return {
    check,
    forward,
    wait,
    beginCleanup() {
      cleanupDepth += 1;
    },
    endCleanup() {
      if (!cleanupDepth) throw new Error("unbalanced cleanup context");
      cleanupDepth -= 1;
    },
  };
}
