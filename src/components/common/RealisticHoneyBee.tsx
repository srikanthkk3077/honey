import React, { memo } from 'react';
import './RealisticHoneyBee.css';

export interface RealisticHoneyBeeProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  flipped?: boolean;
  showPollen?: boolean;
  alt?: string;
  onClick?: () => void;
}

/**
 * RealisticHoneyBee Component
 * Renders an authentic, photorealistic European honey bee (Apis mellifera)
 * with translucent veined wings, fuzzy thorax/abdomen, delicate legs,
 * sunlight wing shimmer, and floating golden pollen dust.
 */
export const RealisticHoneyBee: React.FC<RealisticHoneyBeeProps> = memo(({
  size = 38,
  className = '',
  style,
  flipped = false,
  showPollen = true,
  alt = 'Madhuvan wild honey bee pollinating',
  onClick,
}) => {
  return (
    <div
      className={`realistic-bee-wrapper ${flipped ? 'flipped' : ''} ${className}`}
      style={{
        width: size,
        height: size,
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
      onClick={onClick}
      role="img"
      aria-label={alt}
    >
      {/* Photorealistic Honey Bee (Apis mellifera) */}
      <img
        src="/images/brand/realistic_honeybee.png"
        alt={alt}
        className="realistic-bee-img"
        loading="eager"
        decoding="async"
        onError={(e) => {
          // Graceful fallback to svg if needed
          const target = e.currentTarget;
          if (target.src.indexOf('realistic_honeybee.png') !== -1) {
            target.src = '/icons/bee.svg';
          }
        }}
      />

      {/* Gossamer Wing Sunlight Shimmer (high frequency wing flutter gleam) */}
      <div className="realistic-bee-wing-sheen" aria-hidden="true" />

      {/* Micro Pollen Dust Motes */}
      {showPollen && (
        <>
          <span className="realistic-bee-pollen realistic-bee-pollen-1" aria-hidden="true" />
          <span className="realistic-bee-pollen realistic-bee-pollen-2" aria-hidden="true" />
          <span className="realistic-bee-pollen realistic-bee-pollen-3" aria-hidden="true" />
        </>
      )}
    </div>
  );
});

RealisticHoneyBee.displayName = 'RealisticHoneyBee';

export default RealisticHoneyBee;
