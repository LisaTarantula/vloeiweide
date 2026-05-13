import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const links = [
  { to: '/tijdlijn', label: 'Tijdlijn' },
  { to: '/verhalen', label: 'Verhalen' },
  { to: '/archief', label: 'Archief' },
  { to: '/kaart', label: 'Kaart' },
  { to: '/publicaties', label: 'Publicaties' },
  { to: '/herdenking', label: 'Herdenking' },
  { to: '/onderwijs', label: 'Onderwijs' },
  { to: '/gastboek', label: 'Gastboek' },
  { to: '/beheer', label: 'Beheer', admin: true },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" onClick={() => setOpen(false)}>
          <div className="navbar-brand-icon">✦</div>
          <div className="navbar-brand-text">
            <span className="title">De Vloeiweide</span>
            <span className="subtitle">Rijsbergen 1945</span>
          </div>
        </Link>
        <button className="navbar-toggle" onClick={() => setOpen(o => !o)} aria-label="Menu">
          {open ? '✕' : '☰'}
        </button>
        <ul className={`navbar-nav${open ? ' open' : ''}`}>
          {links.map(l => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                className={({ isActive }) => (isActive ? 'active' : '') + (l.admin ? ' admin-link' : '')}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
