import { useToast } from '../hooks/useToast';
import './Toast.css';

export default function ToastStack() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.variant}`}>
          <span>{t.message}</span>
          <button
            className="toast-close"
            aria-label="Dismiss notification"
            onClick={() => dismiss(t.id)}
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}
