import BrandMark from './BrandMark';
import './BrandMark.css';
import './AuthShowcase.css';

export default function AuthShowcase() {
  return (
    <div className="auth-showcase" aria-hidden="true">
      <div className="auth-showcase-content">
        <div className="auth-showcase-mark">
          <BrandMark size={96} />
        </div>
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
