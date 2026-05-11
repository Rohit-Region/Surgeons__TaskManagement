import React, { useState } from 'react';
import AssignTaskControl from './AssignTaskControl';
import { deleteTask } from '../../api/tasksApi';
import { useToast } from '../../context/ToastContext';

const STATUS_CONFIG = {
  'Pending':     { color: '#94A3B8', bg: '#F8FAFC', border: '#CBD5E1', dot: '#94A3B8' },
  'In Progress': { color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A', dot: '#F59E0B' },
  'Completed':   { color: '#10B981', bg: '#ECFDF5', border: '#A7F3D0', dot: '#10B981' },
};

function ConfirmDialog({ title, onConfirm, onCancel, loading }) {
  return (
    <div style={d.overlay}>
      <div style={d.box}>
        <div style={d.iconWrap}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <polyline points="3 6 5 6 21 6" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 11v6M14 11v6" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3 style={d.title}>Delete Task</h3>
        <p style={d.msg}>
          Are you sure you want to delete <strong>"{title}"</strong>? This action cannot be undone.
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

function TaskCard({ task, users, onAssigned, onDelete }) {
  const cfg = STATUS_CONFIG[task.status] || STATUS_CONFIG['Pending'];

  return (
    <div style={{
      background: '#fff', borderRadius: 16,
      border: `1px solid #E2E8F0`,
      borderTop: `3px solid ${cfg.color}`,
      padding: '18px', display: 'flex', flexDirection: 'column', gap: 12,
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    }}>
      {/* Title + status + delete */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', flex: 1, lineHeight: 1.3 }}>
          {task.title}
        </h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            background: cfg.bg, color: cfg.color,
            border: `1px solid ${cfg.border}`,
            fontSize: '0.65rem', fontWeight: 700,
            padding: '2px 8px', borderRadius: 999,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: cfg.dot, display: 'inline-block' }} />
            {task.status}
          </span>
          <button
            onClick={() => onDelete(task)}
            style={s.deleteBtn}
            title="Delete task"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {task.description && (
        <p style={{ fontSize: '0.8rem', color: '#64748B', lineHeight: 1.5,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {task.description}
        </p>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {task.assignee ? (
          <>
            <div style={{
              width: 22, height: 22,
              background: 'linear-gradient(135deg,#6366F1,#8B5CF6)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.6rem', fontWeight: 800, color: '#fff', flexShrink: 0,
            }}>
              {task.assignee.username?.slice(0,1).toUpperCase()}
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#4F46E5' }}>
              {task.assignee.username}
            </span>
          </>
        ) : (
          <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontStyle: 'italic' }}>Unassigned</span>
        )}
      </div>

      <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 10 }}>
        <p style={{ fontSize: '0.65rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
          Assign to
        </p>
        <AssignTaskControl task={task} users={users} onAssigned={onAssigned} />
      </div>
    </div>
  );
}

export default function TaskManagementPanel({ tasks, users, onTasksChanged }) {
  const { showToast } = useToast();
  const [confirm, setConfirm] = useState(null); // { id, title }
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteTask(confirm.id);
      showToast(`Task "${confirm.title}" deleted.`, 'success');
      setConfirm(null);
      onTasksChanged?.();
    } catch (err) {
      showToast(err.response?.data?.error?.message || 'Failed to delete task.', 'error');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div style={p.wrap}>
        <div style={p.header}>
          <span style={p.count}>{tasks.length} task{tasks.length !== 1 ? 's' : ''}</span>
        </div>

        {tasks.length === 0 ? (
          <div style={p.empty}>
            <span style={{ fontSize: 40 }}>📋</span>
            <p style={{ color: '#94A3B8', fontSize: '0.875rem', marginTop: 10, fontWeight: 500 }}>
              No tasks yet. Create one above!
            </p>
          </div>
        ) : (
          <div style={p.grid}>
            {tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                users={users}
                onAssigned={onTasksChanged}
                onDelete={(t) => setConfirm({ id: t.id, title: t.title })}
              />
            ))}
          </div>
        )}
      </div>

      {confirm && (
        <ConfirmDialog
          title={confirm.title}
          onConfirm={handleDelete}
          onCancel={() => setConfirm(null)}
          loading={deleting}
        />
      )}
    </>
  );
}

const s = {
  deleteBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 26, height: 26, borderRadius: 7,
    background: '#FEF2F2', color: '#EF4444',
    border: '1px solid #FECACA',
    cursor: 'pointer', flexShrink: 0,
    transition: 'all 150ms ease',
  },
};

const p = {
  wrap: {
    background: '#fff', borderRadius: 20,
    border: '1px solid #E2E8F0',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
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
  grid: {
    padding: '16px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: 14,
  },
  empty: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '40px 20px', textAlign: 'center',
  },
};

const d = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.5)',
    backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000,
  },
  box: {
    background: '#fff', borderRadius: 20,
    padding: '32px 28px', maxWidth: 380, width: '90%',
    boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
    textAlign: 'center',
  },
  iconWrap: {
    width: 52, height: 52,
    background: '#FEF2F2', borderRadius: 14,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 16px',
    border: '1px solid #FECACA',
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
