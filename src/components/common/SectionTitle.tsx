import React from 'react';

interface SectionTitleProps {
  subtitle?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center' | 'right';
  light?: boolean;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  subtitle,
  title,
  description,
  align = 'center',
  light = false,
}) => {
  return (
    <div
      style={{
        textAlign: align,
        maxWidth: align === 'center' ? '700px' : '100%',
        margin: align === 'center' ? '0 auto 3rem auto' : '0 0 2rem 0',
      }}
    >
      {subtitle && (
        <span
          style={{
            display: 'inline-block',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: light ? '#FDE68A' : '#D97706',
            marginBottom: '0.5rem',
          }}
        >
          {subtitle}
        </span>
      )}
      <h2
        style={{
          fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
          color: light ? '#FFFFFF' : '#1C1917',
          marginBottom: '0.85rem',
          lineHeight: 1.2,
        }}
      >
        {title}
      </h2>
      {description && (
        <p
          style={{
            fontSize: '1.05rem',
            color: light ? 'rgba(255, 255, 255, 0.8)' : '#57534E',
            lineHeight: 1.6,
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
};
