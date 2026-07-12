import './EmptyState.css';

export default function EmptyState({ title, message, actionLabel, onAction }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon" aria-hidden="true">
        <svg viewBox="0 0 64 40" width="56" height="35">
          <path
            d="M6 28 L10 14 Q12 10 17 10 L47 10 Q52 10 54 14 L58 28"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="2" y="28" width="60" height="7" rx="3.5" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="16" cy="35" r="4" fill="var(--bg-void)" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="48" cy="35" r="4" fill="var(--bg-void)" stroke="currentColor" strokeWidth="2.5" />
        </svg>
      </div>
      <h2>{title}</h2>
      <p>{message}</p>
      {actionLabel && (
        <button className="empty-state-action" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
