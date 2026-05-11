import React, { useState } from 'react';
import { updateTaskStatus } from '../../api/tasksApi';
import { useToast } from '../../context/ToastContext';
import Spinner from '../Spinner';

const STATUSES = ['Pending', 'In Progress', 'Completed'];

const statusColors = {
  'Pending': 'var(--color-neutral-text)',
  'In Progress': 'var(--color-warning-text)',
  'Completed': 'var(--color-success-text)',
};

export default function StatusSelector({ task, onStatusUpdated }) {
  const { showToast } = useToast();
  const [currentStatus, setCurrentStatus] = useState(task.status);
  const [loading, setLoading] = useState(false);

  async function handleChange(e) {
    const newStatus = e.target.value;
    const previousStatus = currentStatus;

    // Optimistic update
    setCurrentStatus(newStatus);
    setLoading(true);

    try {
      await updateTaskStatus(task.id, newStatus);
      showToast(`Status updated to "${newStatus}"`, 'success');
      onStatusUpdated?.(task.id, newStatus);
    } catch (err) {
      // Revert on error
      setCurrentStatus(previousStatus);
      const msg =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to update status.';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {loading && <Spinner size="sm" color="var(--color-primary)" />}
      <select
        value={currentStatus}
        onChange={handleChange}
        disabled={loading}
        aria-label={`Update status for "${task.title}"`}
        style={{
          flex: 1,
          padding: '8px 12px',
          fontSize: 'var(--text-sm)',
          fontWeight: 600,
          color: statusColors[currentStatus] || 'var(--color-text-primary)',
          background: 'var(--color-surface)',
          border: '1.5px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          outline: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
          transition: 'border-color var(--transition-fast)',
          appearance: 'auto',
        }}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </div>
  );
}
