import React from 'react';

export const Loader: React.FC<{ text?: string; size?: 'sm' | 'md' | 'lg' }> = ({
  text = 'Loading pure nectar...',
  size = 'md'
}) => {
  const dim = size === 'sm' ? 24 : size === 'lg' ? 56 : 38;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem',
        gap: '1rem',
      }}
    >
      <div
        style={{
          width: `${dim}px`,
          height: `${dim}px`,
          border: '3px solid #FEF3C7',
          borderTopColor: '#D97706',
          borderRadius: '50%',
          animation: 'spin 0.75s linear infinite',
        }}
      />
      {text && <p style={{ fontSize: '0.9rem', color: '#78716C', fontWeight: 500 }}>{text}</p>}
    </div>
  );
};
