export default function BrandMark({ size = 30, className = '' }) {
  return (
    <svg
      className={`brand-mark ${className}`}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
    >
      <rect x="0.75" y="0.75" width="30.5" height="30.5" rx="8" fill="var(--bg-inset)" stroke="var(--line-bright)" strokeWidth="1.2" />

      <g className="brand-mark-car">
        <path
          d="M6 18.5 L7.3 13.6c.35-1.3 1.55-2.2 2.9-2.2h1l1.6-2.3c.5-.72 1.32-1.15 2.2-1.15h5.3c.88 0 1.7.43 2.2 1.15l1.6 2.3h1c1.35 0 2.55.9 2.9 2.2l1.3 4.9Z"
          fill="var(--hud-teal)"
        />
        <circle cx="11" cy="19.2" r="2.15" fill="var(--bg-inset)" stroke="var(--text-hi)" strokeWidth="1.5" />
        <circle cx="22" cy="19.2" r="2.15" fill="var(--bg-inset)" stroke="var(--text-hi)" strokeWidth="1.5" />
      </g>

      {/* inventory / stock-level bars */}
      <g className="brand-mark-bars">
        <rect className="brand-mark-bar" x="5.5" y="25" width="3" height="3.2" rx="1" fill="var(--ignition)" />
        <rect className="brand-mark-bar" x="10.5" y="23.4" width="3" height="4.8" rx="1" fill="var(--amber)" />
        <rect className="brand-mark-bar" x="15.5" y="21.8" width="3" height="6.4" rx="1" fill="var(--hud-teal)" />
        <rect className="brand-mark-bar" x="20.5" y="24.2" width="3" height="4" rx="1" fill="var(--hud-teal-dim)" />
      </g>
    </svg>
  );
}
