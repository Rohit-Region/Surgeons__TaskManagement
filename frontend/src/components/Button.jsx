import React from 'react';
import Spinner from './Spinner';

const variantStyles = {
  primary: {
    background: 'var(--color-primary)',
    color: '#fff',
    border: '1px solid transparent',
  },
  secondary: {
    background: 'var(--color-surface)',
    color: 'var(--color-primary)',
    border: '1px solid var(--color-border)',
  },
  danger: {
    background: 'var(--color-error)',
    color: '#fff',
    border: '1px solid transparent',
  },
};

const variantHover = {
  primary: { background: 'var(--color-primary-hover)' },
  secondary: { background: 'var(--color-primary-light)', borderColor: 'var(--color-primary)' },
  danger: { background: '#DC2626' },
};

const sizeStyles = {
  sm: { padding: '6px 12px', fontSize: 'var(--text-sm)', borderRadius: 'var(--radius-sm)' },
  md: { padding: '10px 20px', fontSize: 'var(--text-sm)', borderRadius: 'var(--radius-md)' },
  lg: { padding: '12px 28px', fontSize: 'var(--text-base)', borderRadius: 'var(--radius-md)' },
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  style = {},
  fullWidth = false,
}) {
  const [hovered, setHovered] = React.useState(false);

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: 600,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: 'background var(--transition-fast), box-shadow var(--transition-fast), border-color var(--transition-fast)',
    outline: 'none',
    width: fullWidth ? '100%' : undefined,
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...(hovered && !disabled && !loading ? variantHover[variant] : {}),
    ...style,
  };

  return (
    <button
      type={type}
      style={baseStyle}
      disabled={disabled || loading}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      {loading && (
        <Spinner
          size="sm"
          color={variant === 'secondary' ? 'var(--color-primary)' : '#fff'}
        />
      )}
      {children}
    </button>
  );
}
