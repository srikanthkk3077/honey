import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'green' | 'red' | 'blue' | 'gray';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'gold',
  size = 'md',
  icon,
  className = ''
}) => {
  const getStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'gold':
        return {
          background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
          color: '#92400E',
          border: '1px solid rgba(245, 158, 11, 0.4)',
        };
      case 'green':
        return {
          background: '#ECFDF5',
          color: '#065F46',
          border: '1px solid rgba(16, 185, 129, 0.3)',
        };
      case 'red':
        return {
          background: '#FEF2F2',
          color: '#991B1B',
          border: '1px solid rgba(239, 68, 68, 0.3)',
        };
      case 'blue':
        return {
          background: '#EFF6FF',
          color: '#1E40AF',
          border: '1px solid rgba(59, 130, 246, 0.3)',
        };
      case 'gray':
      default:
        return {
          background: '#F5F5F4',
          color: '#57534E',
          border: '1px solid #E7E5E4',
        };
    }
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: size === 'sm' ? '0.15rem 0.5rem' : '0.3rem 0.75rem',
        fontSize: size === 'sm' ? '0.72rem' : '0.8rem',
        fontWeight: 600,
        borderRadius: '9999px',
        ...getStyles(),
      }}
      className={className}
    >
      {icon}
      {children}
    </span>
  );
};
