import React, { useState } from 'react';
import StatusSelector from './StatusSelector';

const STATUS_CONFIG = {
  'Pending':     { color: '#94A3B8', bg: '#F8FAFC', border: '#CBD5E1', label: '⏳ Pending',     gradient: 'linear-gradient(135deg,#94A3B8,#64748B)' },
  'In Progress': { color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A', label: '⚡ In Progress', gradient: 'linear-gradient(135deg,#F59E0B,#D97706)' },
  'Completed':   { color: '#10B981', bg: '#ECFDF5', border: '#A7F3D0', label: '✅ Completed',   gradient: 'linear-gradient(135deg,#10B981,#059669)' },
};

export default function TaskCard({ task, onStatusUpdated }) {
  const [hovered, setHovered] = useState(false);
  const cfg = STATUS_CONFIG[task.status] || STATUS_CONFIG['Pending'];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        borderRadius: 20,
        border: `1px solid ${hovered ? cfg.border : '#E2E8F0'}`,
        borderLeft: `5px solid ${cfg.color}`,
        boxShadow: hovered
          ? `0 12px 32px rgba(0,0,0,0.1), 0 0 0 1px ${cfg.border}`
          : '0 2px 8px rgba(0,0,0,0.06)',
        padding: '22px 22px 18px',
        display: 'flex', flexDirection: 'column', gap: 14,
        transition: 'all 250ms cubic-bezier(0.4,0,0.2,1)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        cursor: 'default',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
        <h3 style={{
          fontSize: '1rem', fontWeight: 700,
          color: '#0F172A', flex: 1, lineHeight: 1.3,
        }}>
          {task.title}
        </h3>
        {/* Status pill */}
        <span style={{
          display: 'inline-flex', alignItems: 'center',
          background: cfg.bg, color: cfg.color,
          border: `1px solid ${cfg.border}`,
          fontSize: '0.7rem', fontWeight: 700,
          padding: '3px 10px', borderRadius: 999,
          whiteSpace: 'nowrap', flexShrink: 0,
        }}>
          {cfg.label}
        </span>
      </div>

      {/* Description */}
      {task.description && (
        <p style={{
          fontSize: '0.875rem', color: '#64748B',
          lineHeight: 1.6,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {task.description}
        </p>
      )}

      {/* Assignee chip */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: 'linear-gradient(135deg,#EEF2FF,#F5F3FF)',
        border: '1px solid #C7D2FE',
        borderRadius: 999, padding: '4px 12px',
        alignSelf: 'flex-start',
      }}>
        <div style={{
          width: 20, height: 20,
          background: 'linear-gradient(135deg,#6366F1,#8B5CF6)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.6rem', fontWeight: 800, color: '#fff',
        }}>
          {task.assignee?.username?.slice(0,1).toUpperCase() || 'Y'}
        </div>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#4F46E5' }}>
          Assigned to you
        </span>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: '#F1F5F9' }} />

      {/* Status selector */}
      <div>
        <p style={{ fontSize: '0.7rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
          Update Status
        </p>
        <StatusSelector task={task} onStatusUpdated={onStatusUpdated} />
      </div>
    </div>
  );
}
