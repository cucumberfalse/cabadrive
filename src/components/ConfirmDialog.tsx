import { useEffect, useId, useRef, type ReactNode, type SyntheticEvent } from "react";

// Native <dialog> confirmation: showModal() provides the focus trap, Esc
// (cancel event), ::backdrop, and focus return to the opener for free.
export function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel,
  cancelLabel = "Отмена",
  onConfirm,
  onCancel,
  confirmDisabled = false,
  danger = false,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmDisabled?: boolean;
  danger?: boolean;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      cancelButtonRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  function cancelFromEsc(event: SyntheticEvent<HTMLDialogElement>) {
    event.preventDefault();
    onCancel();
  }

  function cancelFromBackdrop(event: SyntheticEvent<HTMLDialogElement>) {
    if (event.target === dialogRef.current) onCancel();
  }

  return (
    <dialog
      ref={dialogRef}
      className="confirm-dialog"
      aria-labelledby={titleId}
      onCancel={cancelFromEsc}
      onClick={cancelFromBackdrop}
    >
      <div className="confirm-dialog-inner">
        <h2 id={titleId}>{title}</h2>
        {children}
        <div className="confirm-dialog-actions">
          <button type="button" className="tool-button" ref={cancelButtonRef} onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={danger ? "tool-button danger-button" : "tool-button"}
            disabled={confirmDisabled}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
