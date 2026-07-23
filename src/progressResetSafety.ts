import type { StorageLike } from "./progressStoreCore";

// Undo snapshot for destructive progress operations (reset, import replacement).
// The value is the raw canonical `exportProgress()` string; sessionStorage keeps
// it until the browser session ends, which bounds the undo window without timers.
export const RESET_UNDO_KEY = "cabadrive.progress.reset-undo.v1";

export const IMPORT_REJECTED_MESSAGE =
  "Не удалось импортировать файл: это не корректный экспорт прогресса Cabadrive. Текущий прогресс не изменён.";
export const UNDO_UNAVAILABLE_MESSAGE =
  "Прогресс сброшен. Отмена недоступна: хранилище сессии недоступно.";

export function saveUndoSnapshot(storage: StorageLike, snapshot: string): boolean {
  try {
    storage.setItem(RESET_UNDO_KEY, snapshot);
    return true;
  } catch {
    return false;
  }
}

export function readUndoSnapshot(storage: StorageLike): string | null {
  try {
    return storage.getItem(RESET_UNDO_KEY);
  } catch {
    return null;
  }
}

export function clearUndoSnapshot(storage: StorageLike): void {
  try {
    storage.removeItem(RESET_UNDO_KEY);
  } catch {
    // Best effort: a stale snapshot only re-offers undo and stays session-scoped.
  }
}

export function exportFileName(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `cabadrive-progress-${year}-${month}-${day}.json`;
}
