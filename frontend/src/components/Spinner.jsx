import React from 'react';

const sizeMap = {
  sm: '16px',
  md: '24px',
  lg: '36px',
};

export default function Spinner({ size = 'md', color = 'currentColor' }) {
  const dim = sizeMap[size] || sizeMap.md;

  return (
    <span
      role="status"
      aria-label="Loading"
      style={{
        display: 'inline-block',
        width: dim,
        height: dim,
        border: `2px solid transparent`,
        borderTopColor: color,
        borderRightColor: color,
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
        flexShrink: 0,
      }}
    />
  );
}
