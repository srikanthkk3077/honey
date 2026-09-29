import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'forest' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  style = {},
  ...props
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          background: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
          color: '#FFFFFF',
          border: 'none',
          boxShadow: '0 4px 14px rgba(217, 119, 6, 0.35)',
        };
      case 'secondary':
        return {
          background: '#FEF3C7',
          color: '#92400E',
          border: '1px solid #FDE68A',
        };
      case 'forest':
        return {
          background: 'linear-gradient(135deg, #064E3B 0%, #065F46 100%)',
          color: '#FFFFFF',
          border: 'none',
          boxShadow: '0 4px 14px rgba(6, 78, 59, 0.35)',
        };
      case 'outline':
        return {
          background: 'transparent',
          color: '#92400E',
          border: '1.5px solid #D97706',
        };
      case 'ghost':
        return {
          background: 'transparent',
          color: '#57534E',
          border: 'none',
        };
      case 'danger':
        return {
          background: '#DC2626',
          color: '#FFFFFF',
          border: 'none',
        };
      default:
        return {};
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return { padding: '0.45rem 0.85rem', fontSize: '0.85rem', borderRadius: '8px' };
      case 'lg':
        return { padding: '0.9rem 2rem', fontSize: '1.05rem', borderRadius: '14px', fontWeight: 600 };
      case 'md':
      default:
        return { padding: '0.65rem 1.4rem', fontSize: '0.95rem', borderRadius: '10px' };
    }
  };

  return (
    <button
      disabled={disabled || isLoading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        opacity: disabled || isLoading ? 0.65 : 1,
        transition: 'all 0.2s ease',
        fontWeight: 500,
        width: fullWidth ? '100%' : 'auto',
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...style,
      }}
      className={`btn-honey ${className}`}
      {...props}
    >
      {isLoading ? (
        <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  );
};
