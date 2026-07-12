import BrandMark from './BrandMark';
import './BrandMark.css';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-top">
        <div className="site-footer-brand">
          <BrandMark size={24} />
          <span className="site-footer-word">
            Auto<span className="site-footer-word-accent">Vault</span>
          </span>
        </div>
        <p className="site-footer-tagline">
          Live dealership inventory — browse, search, and manage stock in one place.
        </p>
      </div>

      <div className="site-footer-bottom">
        <span>&copy; {new Date().getFullYear()} AutoVault. All rights reserved.</span>
        <span className="site-footer-credit">Built with React &amp; Spring Boot.</span>
      </div>
    </footer>
  );
}
