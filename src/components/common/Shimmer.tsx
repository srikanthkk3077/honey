import React from 'react';

/**
 * Universal Shimmer Skeleton Building Blocks
 * Features a warm artisanal honey/amber sweep animation
 */

export const ShimmerBox: React.FC<{
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  style?: React.CSSProperties;
  dark?: boolean;
  className?: string;
}> = ({
  width = '100%',
  height = '16px',
  borderRadius = '8px',
  style,
  dark = false,
  className = '',
}) => {
  return (
    <div
      className={`${dark ? 'shimmer-dark' : 'shimmer-box'} ${className}`}
      style={{
        width,
        height,
        borderRadius,
        ...style,
      }}
    />
  );
};

/**
 * Product Card Shimmer Skeleton (Matches ProductCard layout)
 */
export const ProductCardShimmer: React.FC<{ count?: number }> = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={`prod-shimmer-${idx}`}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1.5px solid #F0ECE4',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
            height: '100%',
          }}
        >
          {/* Image Placeholder */}
          <div style={{ position: 'relative', width: '100%', paddingTop: '100%', borderRadius: '18px', overflow: 'hidden' }}>
            <ShimmerBox
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '18px',
              }}
            />
            {/* Fake top badge shimmer */}
            <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
              <ShimmerBox width="80px" height="22px" borderRadius="9999px" />
            </div>
          </div>

          {/* Rating & Origin */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.25rem' }}>
            <ShimmerBox width="90px" height="14px" />
            <ShimmerBox width="60px" height="14px" />
          </div>

          {/* Title */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <ShimmerBox width="90%" height="20px" borderRadius="6px" />
            <ShimmerBox width="60%" height="16px" borderRadius="6px" />
          </div>

          {/* Price & Cart Button */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 'auto',
              paddingTop: '0.75rem',
              borderTop: '1px solid #FAF7F2',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <ShimmerBox width="70px" height="22px" borderRadius="6px" />
              <ShimmerBox width="45px" height="12px" />
            </div>
            <ShimmerBox width="105px" height="38px" borderRadius="12px" />
          </div>
        </div>
      ))}
    </>
  );
};

/**
 * Hero Banner Shimmer Skeleton (Matches Hero luxury layout)
 */
export const HeroShimmer: React.FC = () => {
  return (
    <div
      style={{
        position: 'relative',
        backgroundColor: '#1C1917',
        minHeight: '82vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        padding: '5rem 0',
      }}
    >
      <div className="container" style={{ position: 'relative', zIndex: 2, width: '100%' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 450px), 1fr))',
            alignItems: 'center',
            gap: '3.5rem',
          }}
        >
          {/* Left Column Text Shimmer */}
          <div>
            {/* Badge */}
            <ShimmerBox dark width="200px" height="28px" borderRadius="9999px" style={{ marginBottom: '1.5rem' }} />

            {/* Massive Heading */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '1.5rem' }}>
              <ShimmerBox dark width="92%" height="46px" borderRadius="12px" />
              <ShimmerBox dark width="80%" height="46px" borderRadius="12px" />
              <ShimmerBox dark width="65%" height="46px" borderRadius="12px" />
            </div>

            {/* Subtitle */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '2.5rem' }}>
              <ShimmerBox dark width="95%" height="18px" />
              <ShimmerBox dark width="75%" height="18px" />
            </div>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
              <ShimmerBox dark width="170px" height="52px" borderRadius="16px" />
              <ShimmerBox dark width="150px" height="52px" borderRadius="16px" />
            </div>

            {/* Trust Pills */}
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <ShimmerBox dark width="120px" height="24px" borderRadius="8px" />
              <ShimmerBox dark width="130px" height="24px" borderRadius="8px" />
              <ShimmerBox dark width="110px" height="24px" borderRadius="8px" />
            </div>
          </div>

          {/* Right Column Media Player Shimmer */}
          <div>
            <div
              style={{
                position: 'relative',
                borderRadius: '32px',
                aspectRatio: '16/10',
                border: '1.5px solid rgba(245, 158, 11, 0.25)',
                overflow: 'hidden',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
              }}
            >
              <ShimmerBox
                dark
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '32px',
                }}
              />
            </div>
          </div>
        </div>

        {/* Bottom Thumbnails Row */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '3rem', justifyContent: 'center' }}>
          {[1, 2, 3].map((i) => (
            <ShimmerBox key={i} dark width="140px" height="64px" borderRadius="16px" />
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Testimonial Card Shimmer Skeleton (Matches Home Testimonials)
 */
export const TestimonialCardShimmer: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div style={{ display: 'flex', gap: '24px', width: '100%', overflow: 'hidden' }}>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={`test-shimmer-${idx}`}
          style={{
            flex: '1 1 0',
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '2rem',
            border: '1.5px solid rgba(245, 158, 11, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '320px',
            boxShadow: '0 10px 30px -5px rgba(217, 119, 6, 0.08)',
          }}
        >
          <div>
            {/* Stars & Quote */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <ShimmerBox width="95px" height="16px" borderRadius="6px" />
                <ShimmerBox width="60px" height="16px" borderRadius="9999px" />
              </div>
              <ShimmerBox width="28px" height="28px" borderRadius="50%" />
            </div>

            {/* Quote Lines */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '2rem' }}>
              <ShimmerBox width="100%" height="16px" />
              <ShimmerBox width="95%" height="16px" />
              <ShimmerBox width="88%" height="16px" />
              <ShimmerBox width="60%" height="16px" />
            </div>
          </div>

          {/* Product Bought & Author */}
          <div style={{ borderTop: '1px solid #F5F5F4', paddingTop: '1.25rem' }}>
            <ShimmerBox width="160px" height="14px" style={{ marginBottom: '1rem' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ShimmerBox width="46px" height="46px" borderRadius="50%" style={{ flexShrink: 0 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                <ShimmerBox width="120px" height="16px" />
                <ShimmerBox width="80px" height="12px" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Video Reel Shimmer Skeleton (Matches VideoShowcase & Videos page)
 */
export const VideoCardShimmer: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={`vid-shimmer-${idx}`}
          style={{
            position: 'relative',
            borderRadius: '20px',
            overflow: 'hidden',
            aspectRatio: '9/14',
            backgroundColor: '#231E18',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '1.25rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
          }}
        >
          {/* Top tag & duration shimmer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', zIndex: 2 }}>
            <ShimmerBox dark width="80px" height="22px" borderRadius="9999px" />
            <ShimmerBox dark width="45px" height="22px" borderRadius="9999px" />
          </div>

          {/* Center Play Button Circle */}
          <div
            style={{
              position: 'absolute',
              top: '45%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 2,
            }}
          >
            <ShimmerBox dark width="56px" height="56px" borderRadius="50%" />
          </div>

          {/* Bottom Title & Tagged Product */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 2 }}>
            <ShimmerBox dark width="90%" height="18px" />
            <ShimmerBox dark width="65%" height="14px" />
            <ShimmerBox dark width="40%" height="12px" />
          </div>
        </div>
      ))}
    </>
  );
};

/**
 * Product Detail Page Shimmer Skeleton
 */
export const ProductDetailShimmer: React.FC = () => {
  return (
    <div style={{ padding: '2.5rem 0 6rem 0', backgroundColor: '#FAF7F2' }}>
      <div className="container">
        {/* Breadcrumb shimmer */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '2rem' }}>
          <ShimmerBox width="60px" height="16px" />
          <ShimmerBox width="60px" height="16px" />
          <ShimmerBox width="140px" height="16px" />
        </div>

        {/* Product showcase card */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))',
            gap: '3.5rem',
            backgroundColor: '#FFFFFF',
            borderRadius: '28px',
            padding: '2.5rem',
            border: '1px solid #E7E5E4',
            boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
          }}
        >
          {/* Left Gallery Shimmer */}
          <div>
            <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: '20px', overflow: 'hidden', marginBottom: '1rem' }}>
              <ShimmerBox style={{ width: '100%', height: '100%' }} />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              {[1, 2, 3, 4].map((i) => (
                <ShimmerBox key={i} width="72px" height="72px" borderRadius="14px" />
              ))}
            </div>
          </div>

          {/* Right Info Shimmer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <ShimmerBox width="120px" height="24px" borderRadius="9999px" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <ShimmerBox width="85%" height="34px" borderRadius="8px" />
              <ShimmerBox width="60%" height="24px" borderRadius="8px" />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <ShimmerBox width="100px" height="18px" />
              <ShimmerBox width="120px" height="18px" />
            </div>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <ShimmerBox width="120px" height="38px" borderRadius="8px" />
              <ShimmerBox width="80px" height="24px" borderRadius="6px" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <ShimmerBox width="100%" height="16px" />
              <ShimmerBox width="95%" height="16px" />
              <ShimmerBox width="80%" height="16px" />
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '1rem' }}>
              <ShimmerBox width="90px" height="42px" borderRadius="12px" />
              <ShimmerBox width="90px" height="42px" borderRadius="12px" />
              <ShimmerBox width="90px" height="42px" borderRadius="12px" />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <ShimmerBox width="120px" height="52px" borderRadius="14px" />
              <ShimmerBox width="200px" height="52px" borderRadius="14px" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Order Card Shimmer Skeleton (Matches Orders page)
 */
export const OrderCardShimmer: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={`ord-shimmer-${idx}`}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            padding: '1.75rem',
            border: '1px solid #E7E5E4',
            boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F5F1E9', paddingBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <ShimmerBox width="140px" height="22px" borderRadius="6px" />
              <ShimmerBox width="90px" height="16px" />
            </div>
            <ShimmerBox width="100px" height="26px" borderRadius="6px" />
          </div>

          {/* Items Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <ShimmerBox width="64px" height="64px" borderRadius="12px" style={{ flexShrink: 0 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
              <ShimmerBox width="60%" height="18px" />
              <ShimmerBox width="30%" height="14px" />
            </div>
            <ShimmerBox width="90px" height="24px" borderRadius="6px" style={{ flexShrink: 0 }} />
          </div>

          {/* Footer Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F5F1E9', paddingTop: '1rem' }}>
            <ShimmerBox width="120px" height="16px" />
            <div style={{ display: 'flex', gap: '10px' }}>
              <ShimmerBox width="100px" height="36px" borderRadius="10px" />
              <ShimmerBox width="120px" height="36px" borderRadius="10px" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};


