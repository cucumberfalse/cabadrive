import { useSyncExternalStore } from "react";
import { createProgressStore, type ProgressAction, type RecoveryEvent } from "./progressStoreCore";

export * from "./progressStoreCore";

const unavailableStorage = {
  getItem: () => null,
  setItem: () => undefined,
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
