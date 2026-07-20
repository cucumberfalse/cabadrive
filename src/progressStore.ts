import { useSyncExternalStore } from "react";
import {
  createProgressStore,
  type ProgressAction,
  type RecoveryEvent,
  type StorageLike,
} from "./progressStoreCore";

export * from "./progressStoreCore";

// When the browser has no usable localStorage (disabled by privacy/sandbox
// settings), writes must fail so the store surfaces a storageWriteFailed
// recovery event instead of silently reporting success and losing data on reload.
const unavailableStorage: StorageLike = {
  getItem: () => null,
  setItem: () => {
    throw new Error("Browser storage is unavailable");
  },
  removeItem: () => undefined,
};
function currentBrowserStorage() {
  try {
    return typeof window === "undefined" ? unavailableStorage : window.localStorage;
  } catch {
    return unavailableStorage;
  }
}
const browserStorage = currentBrowserStorage();
const store = createProgressStore(browserStorage);

export function useProgress() {
  return useSyncExternalStore(
    (onStoreChange) => store.subscribe(onStoreChange),
    store.getSnapshot,
    store.getSnapshot,
  );
}
export function dispatchProgress(action: ProgressAction) {
  return store.dispatch(action);
}
export function exportProgress() {
  return store.exportProgress();
}
export function subscribeProgressRecovery(listener: (event: RecoveryEvent) => void) {
  return store.subscribeRecovery(listener);
}
export function getLastProgressRecovery() {
  return store.getLastRecovery();
}
