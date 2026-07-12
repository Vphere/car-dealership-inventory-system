import './AuthShowcase.css';

// Large decorative instrument-cluster gauge for the auth split-screen.
// Purely presentational — mirrors the stock gauge used on vehicle cards.
export default function AuthShowcase() {
  return (
    <div className="auth-showcase" aria-hidden="true">
      <div className="auth-showcase-content">
        <svg className="auth-gauge" width="220" height="220" viewBox="0 0 220 220">
          <circle cx="110" cy="110" r="94" className="auth-gauge-track" strokeWidth="2" fill="none" />
          <circle
            cx="110"
            cy="110"
            r="80"
            className="auth-gauge-arc"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="377 502"
            transform="rotate(-210 110 110)"
          />
          <line x1="110" y1="110" x2="150" y2="70" className="auth-gauge-needle" strokeWidth="3" strokeLinecap="round" />
          <circle cx="110" cy="110" r="6" fill="var(--text-hi)" />
        </svg>
        <p className="auth-showcase-eyebrow">Live inventory, always in view</p>
        <h2 className="auth-showcase-title">
          Run AutoVault from<br />one dashboard.
        </h2>
        <p className="auth-showcase-copy">
          Track stock, prices, and every listing in real time — built for
          dealers who need the whole floor at a glance.
        </p>
      </div>
    </div>
  );
}
