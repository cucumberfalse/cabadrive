import { useSyncExternalStore } from "react";

export type ServiceWorkerUpdateState = {
  available: boolean;
  applying: boolean;
};

type ServiceWorkerContainerLike = Pick<ServiceWorkerContainer, "addEventListener" | "register">;

const initialState: ServiceWorkerUpdateState = { available: false, applying: false };

export function createServiceWorkerUpdateManager(
  serviceWorker: ServiceWorkerContainerLike,
  reload: () => void,
  scheduleInterval: (handler: () => void, milliseconds: number) => unknown,
) {
  let state = initialState;
  let registration: ServiceWorkerRegistration | undefined;
  let reloadOnControllerChange = false;
  let reloadHandled = false;
  let dismissedWorker: ServiceWorker | null = null;
  let started = false;
  const listeners = new Set<() => void>();
  const publish = (next: ServiceWorkerUpdateState) => {
    if (state.available === next.available && state.applying === next.applying) return;
    state = next;
    listeners.forEach((listener) => listener());
  };
  const inspectWaiting = () => {
    const waiting = registration?.waiting ?? null;
    if (waiting && waiting !== dismissedWorker) publish({ available: true, applying: false });
  };
  const observeInstalling = () => {
    const installing = registration?.installing;
    if (!installing) return;
    installing.addEventListener("statechange", () => {
      if (installing.state === "installed") inspectWaiting();
    });
  };
  const check = async () => {
    try {
      await registration?.update();
      inspectWaiting();
    } catch {
      // Updates are best effort; study and the installed offline build stay usable.
    }
  };

  return {
    getSnapshot: () => state,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    async start() {
      if (started) return;
      started = true;
      serviceWorker.addEventListener("controllerchange", () => {
        if (!reloadOnControllerChange || reloadHandled) return;
        reloadHandled = true;
        reload();
      });
      try {
        registration = await serviceWorker.register("/sw.js", { updateViaCache: "none" });
        registration.addEventListener("updatefound", observeInstalling);
        inspectWaiting();
        await check();
        scheduleInterval(() => void check(), 60 * 60 * 1000);
      } catch {
        // Registration failure must never block the local learning experience.
      }
    },
    apply() {
      const waiting = registration?.waiting;
      if (!waiting) return;
      reloadOnControllerChange = true;
      publish({ available: true, applying: true });
      waiting.postMessage({ type: "SKIP_WAITING" });
    },
    dismiss() {
      dismissedWorker = registration?.waiting ?? null;
      publish(initialState);
    },
  };
}

const manager =
  typeof navigator !== "undefined" && "serviceWorker" in navigator
    ? createServiceWorkerUpdateManager(
        navigator.serviceWorker,
        () => window.location.reload(),
        (handler, milliseconds) => window.setInterval(handler, milliseconds),
      )
    : undefined;

export function startServiceWorkerUpdates() {
  return manager?.start();
}

export function useServiceWorkerUpdate() {
  return useSyncExternalStore(
    (listener) => manager?.subscribe(listener) ?? (() => undefined),
    () => manager?.getSnapshot() ?? initialState,
    () => initialState,
  );
}

export function applyServiceWorkerUpdate() {
  manager?.apply();
}

export function dismissServiceWorkerUpdate() {
  manager?.dismiss();
}
