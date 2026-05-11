import React, { useEffect, useState } from 'react';

const VARIANTS = {
  success: {
    bg: 'linear-gradient(135deg,#065f46,#047857)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
        <polyline points="22 4 12 14.01 9 11.01" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    bar: '#34D399',
  },
  error: {
    bg: 'linear-gradient(135deg,#991B1B,#DC2626)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="2"/>
        <line x1="15" y1="9" x2="9" y2="15" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
        <line x1="9" y1="9" x2="15" y2="15" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    bar: '#FCA5A5',
  },
  info: {
    bg: 'linear-gradient(135deg,#1e40af,#2563eb)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="2"/>
        <line x1="12" y1="8" x2="12" y2="12" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
        <line x1="12" y1="16" x2="12.01" y2="16" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    bar: '#93C5FD',
  },
};

function ToastItem({ toast, onRemove }) {
  const [visible, setVisible] = useState(false);
  const cfg = VARIANTS[toast.variant] || VARIANTS.info;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      role="alert"
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        background: cfg.bg,
        borderRadius: 14,
        padding: '14px 16px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        minWidth: 280, maxWidth: 360,
        position: 'relative', overflow: 'hidden',
        transform: visible ? 'translateX(0) scale(1)' : 'translateX(110%) scale(0.95)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.35s ease',
      }}
    >
      <div style={{
        width: 32, height: 32, borderRadius: 10,
        background: 'rgba(255,255,255,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {cfg.icon}
      </div>

      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff', flex: 1, lineHeight: 1.4 }}>
        {toast.message}
      </span>

      <button
        onClick={() => onRemove(toast.id)}
        style={{
          background: 'rgba(255,255,255,0.15)', border: 'none',
          borderRadius: 8, width: 26, height: 26,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#fff', fontSize: 16, flexShrink: 0,
        }}
      >
        ×
      </button>

      {/* Progress bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0,
        height: 3, background: cfg.bar,
        animation: 'progressShrink 3s linear forwards',
        borderRadius: '0 0 14px 14px',
      }} />

      <style>{`
        @keyframes progressShrink { from { width:100%; } to { width:0%; } }
      `}</style>
    </div>
  );
}

export default function Toast({ toasts, onRemove }) {
  if (!toasts?.length) return null;
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24,
      display: 'flex', flexDirection: 'column', gap: 10,
      zIndex: 9999,
    }}>
      {toasts.map(t => <ToastItem key={t.id} toast={t} onRemove={onRemove} />)}
    </div>
  );
}
