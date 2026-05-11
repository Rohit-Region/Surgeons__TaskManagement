import React, { useState } from 'react';
import { createUser } from '../../api/usersApi';
import { useToast } from '../../context/ToastContext';

export default function CreateUserForm({ onUserCreated }) {
  const { showToast } = useToast();
  const [form, setForm]     = useState({ username: '', password: '', role: 'user' });
  const [errors, setErrors] = useState({});
  const [loading, setLoad]  = useState(false);

  function validate() {
    const e = {};
    if (!form.username.trim()) e.username = 'Username is required';
    if (!form.password.trim()) e.password = 'Password is required';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setErrors({});
    setLoad(true);
    try {
      await createUser(form);
      showToast(`User "${form.username}" created!`, 'success');
      setForm({ username: '', password: '', role: 'user' });
      onUserCreated?.();
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Failed to create user.';
      showToast(msg, 'error');
    } finally {
      setLoad(false);
    }
  }

  return (
    <div style={s.card}>
      <div style={s.cardHeader}>
        <div style={s.iconBox}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="9" cy="7" r="4" stroke="#fff" strokeWidth="2"/>
            <line x1="19" y1="8" x2="19" y2="14" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            <line x1="22" y1="11" x2="16" y2="11" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <h3 style={s.title}>Add Team Member</h3>
          <p style={s.sub}>Create a new user account</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={s.form}>
        <div style={s.row}>
          <Field label="Username" error={errors.username}>
            <input
              style={{ ...s.input, ...(errors.username ? s.inputErr : {}) }}
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              placeholder="e.g. john_doe"
              disabled={loading}
            />
          </Field>
          <Field label="Password" error={errors.password}>
            <input
              style={{ ...s.input, ...(errors.password ? s.inputErr : {}) }}
              type="password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="Min. 6 characters"
              disabled={loading}
            />
          </Field>
        </div>

        <Field label="Role">
          <div style={s.roleRow}>
            {['user', 'admin'].map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setForm(f => ({ ...f, role: r }))}
                style={{
                  ...s.roleBtn,
                  ...(form.role === r ? s.roleBtnActive : {}),
                }}
              >
                {r === 'admin' ? '👑 Admin' : '👤 User'}
              </button>
            ))}
          </div>
        </Field>

        <button type="submit" disabled={loading} style={s.btn}>
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
              <span style={s.spinner} /> Creating...
            </span>
          ) : '+ Add Member'}
        </button>
      </form>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}
      </label>
      {children}
      {error && <span style={{ fontSize: '0.75rem', color: '#EF4444' }}>{error}</span>}
    </div>
  );
}

const s = {
  card: {
    background: '#fff', borderRadius: 20,
    border: '1px solid #E2E8F0',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    overflow: 'hidden',
  },
  cardHeader: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '18px 20px',
    background: 'linear-gradient(135deg,#667eea,#764ba2)',
  },
  iconBox: {
    width: 36, height: 36,
    background: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: '0.95rem', fontWeight: 700, color: '#fff' },
  sub:   { fontSize: '0.75rem', color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  form:  { padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 },
  row:   { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  input: {
    width: '100%', padding: '10px 12px',
    fontSize: '0.875rem', color: '#0F172A',
    background: '#F8FAFC', border: '1.5px solid #E2E8F0',
    borderRadius: 10, outline: 'none',
    transition: 'border-color 200ms ease',
  },
  inputErr: { borderColor: '#EF4444', background: '#FEF2F2' },
  roleRow: { display: 'flex', gap: 8 },
  roleBtn: {
    flex: 1, padding: '9px',
    fontSize: '0.85rem', fontWeight: 600,
    background: '#F8FAFC', color: '#64748B',
    border: '1.5px solid #E2E8F0', borderRadius: 10,
    cursor: 'pointer', transition: 'all 200ms ease',
  },
  roleBtnActive: {
    background: 'linear-gradient(135deg,#667eea,#764ba2)',
    color: '#fff', border: '1.5px solid transparent',
    boxShadow: '0 4px 12px rgba(102,126,234,0.35)',
  },
  btn: {
    width: '100%', padding: '11px',
    fontSize: '0.9rem', fontWeight: 700,
    color: '#fff',
    background: 'linear-gradient(135deg,#667eea,#764ba2)',
    border: 'none', borderRadius: 12,
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(102,126,234,0.35)',
    transition: 'all 200ms ease',
  },
  spinner: {
    width: 16, height: 16,
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff', borderRadius: '50%',
    display: 'inline-block',
    animation: 'spin 0.7s linear infinite',
  },
};
