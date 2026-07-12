import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import BrandMark from './BrandMark';
import './BrandMark.css';
import './Navbar.css';

export default function Navbar({ onAddVehicle }) {
  const { user, isAdmin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const initial = user?.email?.[0]?.toUpperCase() || '?';

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <BrandMark />
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
        <div className="navbar-user">
          <span className="navbar-avatar" aria-hidden="true">{initial}</span>
          <span className="navbar-email">{user?.email}</span>
          {isAdmin && <span className="navbar-role-chip">Admin</span>}
        </div>
        <button className="navbar-logout" onClick={logout}>
          Sign out
        </button>
      </div>
    </header>
  );
}
