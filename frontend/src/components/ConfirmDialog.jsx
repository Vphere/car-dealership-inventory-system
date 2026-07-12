import { useState, useEffect } from 'react';
import './ConfirmDialog.css';

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
}) {
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !busy) {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [busy, onCancel]);

  const handleConfirm = async () => {
    setBusy(true);

    try {
      await onConfirm();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="confirm-backdrop">
      <div
        className="confirm-panel"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
      >
        <h2 id="confirm-title">{title}</h2>

        <p>{message}</p>

        <div className="confirm-actions">
          <button
            className="confirm-cancel"
            onClick={onCancel}
            disabled={busy}
          >
            Cancel
          </button>

          <button
            className="confirm-danger"
            onClick={handleConfirm}
            disabled={busy}
          >
            {busy ? 'Removing…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}