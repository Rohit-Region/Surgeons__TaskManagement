import React from 'react';

export default function Input({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
}) {
  const [focused, setFocused] = React.useState(false);

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-primary)',
    background: disabled ? 'var(--color-neutral-bg)' : 'var(--color-surface)',
    border: `1.5px solid ${error ? 'var(--color-error)' : focused ? 'var(--color-primary)' : 'var(--color-border)'}`,
    borderRadius: 'var(--radius-md)',
    outline: 'none',
    transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
    boxShadow: focused && !error ? '0 0 0 3px var(--color-primary-light)' : 'none',
    cursor: disabled ? 'not-allowed' : 'text',
  };

  const labelStyle = {
    display: 'block',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    color: error ? 'var(--color-error-text)' : 'var(--color-text-primary)',
    marginBottom: 'var(--space-1)',
  };

  const errorStyle = {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-error)',
    marginTop: 'var(--space-1)',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {label && (
        <label htmlFor={name} style={labelStyle}>
          {label}
          {required && <span style={{ color: 'var(--color-error)', marginLeft: '2px' }}>*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        style={inputStyle}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <span id={`${name}-error`} style={errorStyle} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
