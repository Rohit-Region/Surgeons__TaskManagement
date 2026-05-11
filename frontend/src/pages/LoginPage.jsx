import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../api/authApi';
import { checkBackend, isBackendOnline } from '../api/client';
import { seedDemoData } from '../api/demoStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkBackend().then((online) => {
      setDemoMode(!online);
      setChecking(false);
      if (!online) seedDemoData();
    });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginApi(username, password);
      login(data.token);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Invalid username or password.');
      setPassword('');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={s.page}>
      {/* Subtle background grid */}
      <div style={s.grid} />
      {/* Soft glow */}
      <div style={s.glow} />

      {/* Main card */}
      <div style={s.card}>
        {/* Logo */}
        <div style={s.logoWrap}>
          <div style={s.logoCircle}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="3" y="3" width="18" height="18" rx="4" stroke="#fff" strokeWidth="2"/>
            </svg>
          </div>
        </div>

        <h1 style={s.title}>Welcome back</h1>
        <p style={s.subtitle}>Sign in to your Task Management workspace</p>

        {/* Demo mode banner */}
        {demoMode && (
          <div style={{
            background: 'rgba(245,158,11,0.12)',
            border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: 10, padding: '12px 14px',
            fontSize: '0.8rem', color: '#FCD34D',
            marginBottom: 20, lineHeight: 1.8,
          }}>
            <strong>⚡ Demo Mode</strong> — Backend offline. Using local data.<br/>
            <span style={{ color: '#94A3B8' }}>Admin:</span> <code style={{ color: '#FCD34D' }}>admin / admin123</code><br/>
            <span style={{ color: '#94A3B8' }}>User &nbsp;:</span> <code style={{ color: '#FCD34D' }}>Rohit / 123456</code>
          </div>
        )}

        {error && (
          <div style={s.errorBox} role="alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" stroke="#EF4444" strokeWidth="2"/>
              <path d="M12 8v4M12 16h.01" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate style={s.form}>
          {/* Username */}
          <div style={s.fieldWrap}>
            <label style={s.label}>Username</label>
            <div style={s.inputWrap}>
              <svg style={s.inputIcon} width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="7" r="4" stroke="#94A3B8" strokeWidth="2"/>
              </svg>
              <input
                style={s.input}
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                disabled={loading}
                autoComplete="username"
              />
            </div>
          </div>

          {/* Password */}
          <div style={s.fieldWrap}>
            <label style={s.label}>Password</label>
            <div style={s.inputWrap}>
              <svg style={s.inputIcon} width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="#94A3B8" strokeWidth="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                style={s.input}
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                style={s.eyeBtn}
                tabIndex={-1}
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !username || !password}
            style={{
              ...s.submitBtn,
              opacity: loading || !username || !password ? 0.7 : 1,
              cursor: loading || !username || !password ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                <span style={s.spinner} />
                Signing in...
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                Sign In
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            )}
          </button>
        </form>

        {/* Footer hint */}
        <p style={s.hint}>
          🔒 Secured with JWT authentication
        </p>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const s = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0A0A0F',
    padding: '24px',
    position: 'relative',
    overflow: 'hidden',
  },
  grid: {
    position: 'absolute', inset: 0,
    backgroundImage: `
      linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)
    `,
    backgroundSize: '48px 48px',
    pointerEvents: 'none',
  },
  glow: {
    position: 'absolute',
    top: '20%', left: '50%',
    transform: 'translateX(-50%)',
    width: 600, height: 400,
    background: 'radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  card: {
    background: '#111118',
    border: '1px solid rgba(255,255,255,0.08)',
    backdropFilter: 'blur(20px)',
    borderRadius: 20,
    boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 32px 64px rgba(0,0,0,0.5)',
    padding: '44px 40px',
    width: '100%',
    maxWidth: 420,
    position: 'relative',
    zIndex: 10,
    animation: 'fadeInUp 0.5s cubic-bezier(0.4,0,0.2,1) both',
  },
  logoWrap: {
    display: 'flex', justifyContent: 'center', marginBottom: 28,
  },
  logoCircle: {
    width: 52, height: 52,
    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
    borderRadius: 14,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
  },
  title: {
    fontSize: '1.5rem', fontWeight: 700,
    color: '#F8FAFC', textAlign: 'center',
    marginBottom: 6, letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '0.875rem', color: '#64748B',
    textAlign: 'center', marginBottom: 32, lineHeight: 1.5,
  },
  errorBox: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: 'rgba(239,68,68,0.1)', color: '#FCA5A5',
    border: '1px solid rgba(239,68,68,0.2)',
    borderRadius: 10, padding: '11px 14px',
    fontSize: '0.875rem', marginBottom: 20,
  },
  form: { display: 'flex', flexDirection: 'column', gap: 20 },
  fieldWrap: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: {
    fontSize: '0.75rem', fontWeight: 600,
    color: '#94A3B8', letterSpacing: '0.04em', textTransform: 'uppercase',
  },
  inputWrap: {
    position: 'relative', display: 'flex', alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute', left: 14, pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '12px 14px 12px 42px',
    fontSize: '0.9rem',
    color: '#F1F5F9',
    background: '#1A1A24',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 10,
    transition: 'all 200ms ease',
    outline: 'none',
  },
  eyeBtn: {
    position: 'absolute', right: 12,
    background: 'none', border: 'none',
    cursor: 'pointer', fontSize: 15, padding: 4,
    color: '#64748B',
  },
  submitBtn: {
    width: '100%',
    padding: '13px',
    fontSize: '0.9rem', fontWeight: 600,
    color: '#fff',
    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
    border: 'none', borderRadius: 10,
    boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
    transition: 'all 200ms ease',
    marginTop: 4,
    letterSpacing: '0.01em',
  },
  spinner: {
    width: 18, height: 18,
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'spin 0.7s linear infinite',
  },
  hint: {
    textAlign: 'center', fontSize: '0.75rem',
    color: '#334155', marginTop: 24,
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
  },
};
