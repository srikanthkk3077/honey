import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  id,
  style = {},
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%' }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#44403C',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}
        >
          {label}
          {props.required && <span style={{ color: '#DC2626' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {leftIcon && (
          <span style={{ position: 'absolute', left: '12px', color: '#78716C', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          style={{
            width: '100%',
            padding: '0.65rem 0.95rem',
            paddingLeft: leftIcon ? '2.4rem' : '0.95rem',
            paddingRight: rightIcon ? '2.4rem' : '0.95rem',
            borderRadius: '10px',
            border: error ? '1.5px solid #EF4444' : '1px solid #D6D3D1',
            background: '#FFFFFF',
            fontSize: '0.95rem',
            color: '#1C1917',
            outline: 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            ...style,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#D97706';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(217, 119, 6, 0.15)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error ? '#EF4444' : '#D6D3D1';
            e.currentTarget.style.boxShadow = 'none';
          }}
          className={className}
          {...props}
        />
        {rightIcon && (
          <span style={{ position: 'absolute', right: '12px', color: '#78716C', display: 'flex', alignItems: 'center' }}>
            {rightIcon}
          </span>
        )}
      </div>
      {error && <span style={{ fontSize: '0.8rem', color: '#DC2626' }}>{error}</span>}
      {helperText && !error && <span style={{ fontSize: '0.8rem', color: '#78716C' }}>{helperText}</span>}
    </div>
  );
};
