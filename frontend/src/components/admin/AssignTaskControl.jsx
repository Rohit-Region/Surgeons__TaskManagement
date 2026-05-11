import React, { useState } from 'react';
import { assignTask } from '../../api/tasksApi';
import { useToast } from '../../context/ToastContext';
import Spinner from '../Spinner';

export default function AssignTaskControl({ task, users, onAssigned }) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const currentAssigneeId = task.assignee?.id ?? '';

  async function handleChange(e) {
    const userId = e.target.value || null;
    if (!userId) return; // "Unassigned" selected — skip for now

    setLoading(true);
    try {
      await assignTask(task.id, userId);
      showToast('Task assigned successfully!', 'success');
      onAssigned?.();
    } catch (err) {
      const msg =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to assign task.';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {loading && <Spinner size="sm" color="var(--color-primary)" />}
      <select
        value={currentAssigneeId}
        onChange={handleChange}
        disabled={loading}
        aria-label={`Assign task "${task.title}"`}
        style={{
          flex: 1,
          padding: '6px 10px',
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-primary)',
          background: 'var(--color-surface)',
          border: '1.5px solid var(--color-border)',
          borderRadius: 'var(--radius-sm)',
          outline: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
        }}
      >
        <option value="">— Unassigned —</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.username}
          </option>
        ))}
      </select>
    </div>
  );
}
