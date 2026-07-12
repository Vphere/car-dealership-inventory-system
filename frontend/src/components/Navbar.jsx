import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import BrandMark from './BrandMark';
import './BrandMark.css';
import './Navbar.css';

export default function Navbar({ onAddVehicle }) {
  const { user, isAdmin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const userRef = useRef(null);

  const displayName = user?.name || user?.email || '?';
  const initial = displayName[0]?.toUpperCase() || '?';

  // Close the email popover on outside click so it doesn't linger.
  useEffect(() => {
    if (!emailOpen) return;
    const handleClick = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) {
        setEmailOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [emailOpen]);

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <BrandMark size={34} />
        <span className="navbar-word">
          Auto<span className="navbar-word-accent">Vault</span>
        </span>
      </div>

      <button
        className="navbar-toggle"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>

      <div className={`navbar-actions ${menuOpen ? 'is-open' : ''}`}>
        {isAdmin && (
          <button
            className="navbar-add"
            onClick={() => {
              setMenuOpen(false);
              onAddVehicle?.();
            }}
          >
            + Add vehicle
          </button>
        )}

        <div className="navbar-user" ref={userRef}>
          <button
            type="button"
            className="navbar-avatar"
            onClick={() => setEmailOpen((v) => !v)}
            aria-expanded={emailOpen}
            aria-label="Show account email"
          >
            {initial}
          </button>

          <div className="navbar-user-text">
            <span className="navbar-name">{displayName}</span>
            {isAdmin && <span className="navbar-role-chip">Admin</span>}
          </div>

          {emailOpen && (
            <div className="navbar-email-popover" role="tooltip">
              <span className="navbar-email-popover-label">Signed in as</span>
              <span className="navbar-email-popover-value">{user?.email}</span>
            </div>
          )}
        </div>

        <button className="navbar-logout" onClick={logout}>
          Sign out
        </button>
      </div>
    </header>
  );
}
