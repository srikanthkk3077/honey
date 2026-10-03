import React from 'react';

interface PageLoaderProps {
  message?: string;
  minHeight?: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({
  message = 'Loading pure nectar...',
  minHeight = '65vh',
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight,
        width: '100%',
        padding: '2.5rem 1rem',
        boxSizing: 'border-box',
        animation: 'pageLoaderFadeIn 0.25s ease-out',
      }}
    >
      {/* Top micro progress bar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          zIndex: 9999,
          background: 'rgba(254, 243, 199, 0.4)',
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, #F59E0B, #D97706, #B45309, #F59E0B)',
            backgroundSize: '200% 100%',
            animation: 'pageLoaderBar 1.2s ease-in-out infinite',
          }}
        />
      </div>

      {/* Honey Spinner Centerpiece */}
      <div
        style={{
          position: 'relative',
          width: '64px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem',
        }}
      >
        {/* Soft radial aura */}
        <div
          style={{
            position: 'absolute',
            inset: '-6px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, rgba(254, 243, 199, 0) 70%)',
            animation: 'pageLoaderPulse 1.8s ease-in-out infinite',
          }}
        />

        {/* Outer glowing track ring */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '3px solid #FEF3C7',
          }}
        />

        {/* Spinning golden arc */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '3px solid transparent',
            borderTopColor: '#D97706',
            borderRightColor: '#F59E0B',
            animation: 'pageLoaderSpin 0.75s linear infinite',
          }}
        />

        {/* Honey Drop SVG Icon in center */}
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            color: '#D97706',
            animation: 'pageLoaderDrop 1.5s ease-in-out infinite alternate',
          }}
        >
          <path
            d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
            fill="currentColor"
            opacity="0.9"
          />
        </svg>
      </div>

      {/* Text Label */}
      {message && (
        <p
          style={{
            fontSize: '0.92rem',
            color: '#78716C',
            fontWeight: 600,
            letterSpacing: '0.02em',
            margin: 0,
            fontFamily: "'Outfit', sans-serif",
            animation: 'pageLoaderTextPulse 1.5s ease-in-out infinite alternate',
          }}
        >
          {message}
        </p>
      )}

      {/* Inline styles for scoped animations */}
      <style>{`
        @keyframes pageLoaderFadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pageLoaderSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pageLoaderBar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes pageLoaderPulse {
          0%, 100% { transform: scale(0.9); opacity: 0.5; }
          50% { transform: scale(1.25); opacity: 0.85; }
        }
        @keyframes pageLoaderDrop {
          0% { transform: scale(0.92) translateY(1px); }
          100% { transform: scale(1.08) translateY(-1px); }
        }
        @keyframes pageLoaderTextPulse {
          0% { opacity: 0.7; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default PageLoader;
