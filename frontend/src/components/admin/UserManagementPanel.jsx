import React, { useState } from 'react';
import { deleteUser } from '../../api/usersApi';
import { useToast } from '../../context/ToastContext';

const ROLE_CONFIG = {
  admin: { bg: 'linear-gradient(135deg,#667eea,#764ba2)', label: 'Admin' },
  user:  { bg: 'linear-gradient(135deg,#4facfe,#00f2fe)', label: 'User'  },
};

const AVATAR_COLORS = [
  'linear-gradient(135deg,#667eea,#764ba2)',
  'linear-gradient(135deg,#f093fb,#f5576c)',
  'linear-gradient(135deg,#4facfe,#00f2fe)',
  'linear-gradient(135deg,#43e97b,#38f9d7)',
  'linear-gradient(135deg,#fa709a,#fee140)',
  'linear-gradient(135deg,#a18cd1,#fbc2eb)',
];

function ConfirmDialog({ username, onConfirm, onCancel, loading }) {
  return (
    <div style={d.overlay}>
      <div style={d.box}>
        <div style={d.iconWrap}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="12" y1="9" x2="12" y2="13" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
            <line x1="12" y1="17" x2="12.01" y2="17" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <h3 style={d.title}>Delete User</h3>
        <p style={d.msg}>
          Are you sure you want to delete <strong>"{username}"</strong>?
          Their assigned tasks will become unassigned.
        </p>
        <div style={d.actions}>
          <button onClick={onCancel} style={d.cancelBtn} disabled={loading}>Cancel</button>
          <button onClick={onConfirm} style={d.deleteBtn} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UserManagementPanel({ users, onUserDeleted }) {
  const { showToast } = useToast();
  const [confirm, setConfirm] = useState(null); // { id, username }
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteUser(confirm.id);
      showToast(`User "${confirm.username}" deleted.`, 'success');
      setConfirm(null);
      onUserDeleted?.();
    } catch (err) {
      showToast(err.response?.data?.error?.message || 'Failed to delete user.', 'error');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div style={s.wrap}>
        <div style={s.header}>
          <span style={s.count}>{users.length} member{users.length !== 1 ? 's' : ''}</span>
        </div>

        {users.length === 0 ? (
          <div style={s.empty}>
            <span style={{ fontSize: 36 }}>👥</span>
            <p style={{ color: '#94A3B8', fontSize: '0.875rem', marginTop: 10, fontWeight: 500 }}>
              No team members yet.
            </p>
          </div>
        ) : (
          <div style={s.list}>
            {users.map((u, i) => {
              const cfg = ROLE_CONFIG[u.role] || ROLE_CONFIG.user;
              const avatarBg = AVATAR_COLORS[i % AVATAR_COLORS.length];
              return (
                <div key={u.id} style={s.row}>
                  <div style={{ ...s.avatar, background: avatarBg }}>
                    {u.username.slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={s.name}>{u.username}</p>
                    <p style={s.id}>ID: {u.id?.slice(-8)}</p>
                  </div>
                  <span style={{ ...s.roleBadge, background: cfg.bg }}>
                    {cfg.label}
                  </span>
                  <button
                    onClick={() => setConfirm({ id: u.id, username: u.username })}
                    style={s.deleteBtn}
                    title="Delete user"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {confirm && (
        <ConfirmDialog
          username={confirm.username}
          onConfirm={handleDelete}
          onCancel={() => setConfirm(null)}
          loading={deleting}
        />
      )}
    </>
  );
}

const s = {
  wrap: {
    background: '#fff', borderRadius: 20,
    border: '1px solid #E2E8F0',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    overflow: 'hidden',
  },
  header: {
    display: 'flex', justifyContent: 'flex-end',
    padding: '12px 16px', borderBottom: '1px solid #F1F5F9',
  },
  count: {
    fontSize: '0.75rem', fontWeight: 700,
    color: '#6366F1', background: '#EEF2FF',
    padding: '3px 10px', borderRadius: 999,
  },
  list: { padding: '8px' },
  row: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '9px 10px', borderRadius: 12,
  },
  avatar: {
    width: 36, height: 36, borderRadius: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.7rem', fontWeight: 800, color: '#fff', flexShrink: 0,
  },
  name: { fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' },
  id:   { fontSize: '0.68rem', color: '#94A3B8', marginTop: 1, fontFamily: 'monospace' },
  roleBadge: {
    fontSize: '0.68rem', fontWeight: 700, color: '#fff',
    padding: '2px 9px', borderRadius: 999, flexShrink: 0,
  },
  deleteBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 28, height: 28, borderRadius: 8,
    background: '#FEF2F2', color: '#EF4444',
    border: '1px solid #FECACA',
    cursor: 'pointer', flexShrink: 0,
    transition: 'all 150ms ease',
  },
  empty: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '32px 20px', textAlign: 'center',
  },
};

const d = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.5)',
    backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000,
    animation: 'fadeIn 0.15s ease',
  },
  box: {
    background: '#fff', borderRadius: 20,
    padding: '32px 28px', maxWidth: 380, width: '90%',
    boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
    textAlign: 'center',
    animation: 'scaleIn 0.2s cubic-bezier(0.4,0,0.2,1)',
  },
  iconWrap: {
    width: 52, height: 52,
    background: '#FFFBEB', borderRadius: 14,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 16px',
    border: '1px solid #FDE68A',
  },
  title: { fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: 10 },
  msg:   { fontSize: '0.875rem', color: '#64748B', lineHeight: 1.6, marginBottom: 24 },
  actions: { display: 'flex', gap: 10 },
  cancelBtn: {
    flex: 1, padding: '10px',
    fontSize: '0.875rem', fontWeight: 600,
    background: '#F8FAFC', color: '#475569',
    border: '1px solid #E2E8F0', borderRadius: 10,
    cursor: 'pointer',
  },
  deleteBtn: {
    flex: 1, padding: '10px',
    fontSize: '0.875rem', fontWeight: 600,
    background: 'linear-gradient(135deg,#EF4444,#DC2626)',
    color: '#fff', border: 'none', borderRadius: 10,
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(239,68,68,0.3)',
  },
};
