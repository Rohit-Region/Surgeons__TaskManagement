import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : 'AD';

  return (
    <div style={{ minHeight: '100vh', background: '#F1F5F9' }}>
      {/* Navbar */}
      <nav style={nav.bar}>
        <div style={nav.inner}>
          {/* Left */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={nav.logoBox}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="3" y="3" width="18" height="18" rx="4" stroke="#fff" strokeWidth="2"/>
              </svg>
            </div>
            <span style={nav.brand}>TaskFlow</span>
            <span style={nav.divider} />
            <span style={nav.badge}>Admin</span>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={nav.userChip}>
              <div style={nav.avatar}>{initials}</div>
              <span style={nav.username}>{user?.username || 'Admin'}</span>
            </div>
            <button onClick={handleLogout} style={nav.logoutBtn}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main style={{ maxWidth: 1320, margin: '0 auto', padding: '32px 24px' }}>
        {children}
      </main>
    </div>
  );
}

const nav = {
  bar: {
    background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
    position: 'sticky', top: 0, zIndex: 100,
  },
  inner: {
    maxWidth: 1320, margin: '0 auto',
    padding: '0 24px', height: 68,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  logoBox: {
    width: 38, height: 38,
    background: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  brand: {
    fontSize: '1.2rem', fontWeight: 800,
    color: '#fff', letterSpacing: '-0.02em',
  },
  divider: {
    width: 1, height: 20,
    background: 'rgba(255,255,255,0.2)',
  },
  badge: {
    background: 'linear-gradient(135deg, #818CF8, #C084FC)',
    color: '#fff',
    fontSize: '0.7rem', fontWeight: 700,
    padding: '3px 10px', borderRadius: 999,
    letterSpacing: '0.05em', textTransform: 'uppercase',
  },
  userChip: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 999, padding: '5px 14px 5px 5px',
  },
  avatar: {
    width: 30, height: 30,
    background: 'linear-gradient(135deg, #818CF8, #C084FC)',
    borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.7rem', fontWeight: 800, color: '#fff',
  },
  username: {
    fontSize: '0.875rem', fontWeight: 600, color: '#fff',
  },
  logoutBtn: {
    display: 'flex', alignItems: 'center', gap: 6,
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: 'rgba(255,255,255,0.9)',
    borderRadius: 10, padding: '8px 14px',
    fontSize: '0.85rem', fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 200ms ease',
  },
};
