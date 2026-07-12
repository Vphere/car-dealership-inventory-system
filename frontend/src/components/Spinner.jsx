import './Spinner.css';

export default function Spinner({ label = 'Loading' }) {
  return (
    <div className="spinner-wrap" role="status" aria-live="polite">
      <span className="spinner" />
      <span className="visually-hidden">{label}</span>
    </div>
  );
}
