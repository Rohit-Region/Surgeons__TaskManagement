import React from 'react';

const statusConfig = {
  'Pending': {
    background: 'var(--color-neutral-bg)',
    color: 'var(--color-neutral-text)',
    border: '1px solid #CBD5E1',
  },
  'In Progress': {
    background: 'var(--color-warning-bg)',
    color: 'var(--color-warning-text)',
    border: '1px solid #FCD34D',
  },
  'Completed': {
    background: 'var(--color-success-bg)',
    color: 'var(--color-success-text)',
    border: '1px solid #6EE7B7',
  },
};

export default function Badge({ status }) {
  const config = statusConfig[status] || statusConfig['Pending'];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 10px',
        fontSize: 'var(--text-xs)',
        fontWeight: 600,
        borderRadius: 'var(--radius-full)',
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
        ...config,
      }}
    >
      {status}
    </span>
  );
}
