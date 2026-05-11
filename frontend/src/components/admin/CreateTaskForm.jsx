import React, { useState } from 'react';
import { createTask } from '../../api/tasksApi';
import { useToast } from '../../context/ToastContext';

export default function CreateTaskForm({ onTaskCreated }) {
  const { showToast } = useToast();
  const [title, setTitle]       = useState('');
  const [desc, setDesc]         = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoad]      = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) { setError('Task title is required'); return; }
    setError('');
    setLoad(true);
    try {
      await createTask({ title, description: desc });
      showToast(`Task "${title}" created!`, 'success');
      setTitle(''); setDesc('');
      onTaskCreated?.();
    } catch (err) {
      showToast(err.response?.data?.error?.message || 'Failed to create task.', 'error');
    } finally {
      setLoad(false);
    }
  }

  return (
    <div style={s.card}>
      <div style={s.cardHeader}>
        <div style={s.iconBox}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <h3 style={s.title}>Create Task</h3>
          <p style={s.sub}>Add a new task to the board</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={s.form}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={s.label}>Task Title *</label>
          <input
            style={{ ...s.input, ...(error ? s.inputErr : {}) }}
            value={title}
            onChange={e => { setTitle(e.target.value); setError(''); }}
            placeholder="e.g. Design landing page"
            disabled={loading}
          />
          {error && <span style={{ fontSize: '0.75rem', color: '#EF4444' }}>{error}</span>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={s.label}>Description <span style={{ color: '#94A3B8', fontWeight: 400 }}>(optional)</span></label>
          <textarea
            style={{ ...s.input, minHeight: 80, resize: 'vertical', lineHeight: 1.5 }}
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="Describe the task..."
            disabled={loading}
          />
        </div>

        <button type="submit" disabled={loading} style={s.btn}>
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
              <span style={s.spinner} /> Creating...
            </span>
          ) : '+ Create Task'}
        </button>
      </form>
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
    background: 'linear-gradient(135deg,#f093fb,#f5576c)',
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
  label: { fontSize: '0.75rem', fontWeight: 600, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.04em' },
  input: {
    width: '100%', padding: '10px 12px',
    fontSize: '0.875rem', color: '#0F172A',
    background: '#F8FAFC', border: '1.5px solid #E2E8F0',
    borderRadius: 10, outline: 'none',
    transition: 'border-color 200ms ease',
    fontFamily: 'inherit',
  },
  inputErr: { borderColor: '#EF4444', background: '#FEF2F2' },
  btn: {
    width: '100%', padding: '11px',
    fontSize: '0.9rem', fontWeight: 700,
    color: '#fff',
    background: 'linear-gradient(135deg,#f093fb,#f5576c)',
    border: 'none', borderRadius: 12,
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(245,87,108,0.35)',
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
