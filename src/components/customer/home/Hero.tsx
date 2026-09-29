import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Sparkles, Droplets, Award, Star } from 'lucide-react';
import { Button } from '../../common/Button';

export const Hero: React.FC = () => {
  return (
    <section
      style={{
        position: 'relative',
        background: 'radial-gradient(ellipse at 80% 20%, #FEF3C7 0%, #FAF7F2 60%, #F5F1E9 100%)',
        padding: '4.5rem 0 5rem 0',
        overflow: 'hidden',
        borderBottom: '1px solid #E7E5E4',
      }}
    >
      {/* Decorative honeycomb ambient glows */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />

      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            alignItems: 'center',
            gap: '3.5rem',
          }}
        >
          {/* Left Column: Headlines & CTAs */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                background: '#FEF3C7',
                border: '1px solid #FDE68A',
                borderRadius: '9999px',
                color: '#92400E',
                fontSize: '0.85rem',
                fontWeight: 600,
                marginBottom: '1.25rem',
              }}
            >
              <Sparkles size={16} color="#D97706" />
              <span>Direct From Wild Deep-Forest Apiaries</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)',
                lineHeight: 1.12,
                color: '#1C1917',
                marginBottom: '1.25rem',
              }}
            >
              Taste the Liquid Gold of <span style={{ color: '#D97706', fontStyle: 'italic' }}>Virgin Forests.</span>
            </h1>

            <p
              style={{
                fontSize: '1.12rem',
                color: '#57534E',
                lineHeight: 1.65,
                marginBottom: '2rem',
                maxWidth: '540px',
              }}
            >
              100% Raw, Unpasteurized & NMR Lab Tested Honey. Ethically collected from giant wild bees in Sundarbans and Himalayan valleys. Packed with live enzymes, propolis & raw bio-actives.
            </p>

            {/* CTAs */}
            <div className="flex items-center gap-4 flex-wrap" style={{ marginBottom: '2.5rem' }}>
              <Link to="/shop">
                <Button
                  size="lg"
                  rightIcon={<ArrowRight size={18} />}
                  style={{
                    background: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
                    boxShadow: '0 8px 24px rgba(217, 119, 6, 0.35)',
                  }}
                >
                  Explore Honey Vault
                </Button>
              </Link>
              <Link to="/about">
                <Button
                  variant="outline"
                  size="lg"
                  leftIcon={<ShieldCheck size={18} color="#D97706" />}
                >
                  Purity Certificate
                </Button>
              </Link>
            </div>

            {/* Micro Stats */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1.5rem',
                paddingTop: '1.75rem',
                borderTop: '1px solid #E7E5E4',
              }}
            >
              <div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.65rem', fontWeight: 800, color: '#1C1917' }}>
                  100%
                </div>
                <div style={{ fontSize: '0.78rem', color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Raw & Unheated
                </div>
              </div>

              <div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.65rem', fontWeight: 800, color: '#059669' }}>
                  0%
                </div>
                <div style={{ fontSize: '0.78rem', color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Added Sugar
                </div>
              </div>

              <div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.65rem', fontWeight: 800, color: '#D97706' }}>
                  14,500+
                </div>
                <div style={{ fontSize: '0.78rem', color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Jars Delivered
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Showcase Visual */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            {/* Main Honey Showcase Frame */}
            <div
              style={{
                position: 'relative',
                borderRadius: '28px',
                overflow: 'hidden',
                boxShadow: '0 20px 45px rgba(120, 53, 15, 0.22)',
                border: '8px solid #FFFFFF',
                width: '100%',
                maxWidth: '480px',
                aspectRatio: '4/4.5',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=900&q=80"
                alt="Pure Madhuvan Wild Forest Honey Jar with Honey Dipper"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* Gradient overlay for text legibility */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(24, 21, 17, 0.8) 0%, transparent 50%)',
                }}
              />

              {/* Honey Label Badge inside image */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '20px',
                  right: '20px',
                  color: '#FFFFFF',
                }}
              >
                <div className="flex items-center gap-1" style={{ color: '#FBBF24', marginBottom: '4px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="#FBBF24" />
                  ))}
                  <span style={{ fontSize: '0.8rem', color: '#FFFFFF', marginLeft: '6px' }}>4.9/5 (1,240+ Verified Reviews)</span>
                </div>
                <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', margin: 0 }}>
                  Madhuvan Sundarbans Wild Honey
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#E7E5E4', margin: '4px 0 0 0' }}>
                  Harvested at 28°C cold-filtration • Rich in wild floral pollen
                </p>
              </div>
            </div>

            {/* Floating Floating Pill: NMR Tested */}
            <div
              style={{
                position: 'absolute',
                top: '15px',
                left: '-15px',
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '12px 18px',
                boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
                border: '1px solid #FDE68A',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                animation: 'floatBee 5s infinite ease-in-out',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: '#ECFDF5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Award size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1C1917' }}>NMR Certified</div>
                <div style={{ fontSize: '0.75rem', color: '#78716C' }}>Zero Rice / Corn Syrup</div>
              </div>
            </div>

            {/* Floating Pill: Raw Enzymes */}
            <div
              style={{
                position: 'absolute',
                bottom: '80px',
                right: '-20px',
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '12px 18px',
                boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
                border: '1px solid #FEF3C7',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                animation: 'floatBee 6s infinite ease-in-out reverse',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: '#FFFBEB',
                  color: '#D97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Droplets size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1C1917' }}>Active Diastase</div>
                <div style={{ fontSize: '0.75rem', color: '#78716C' }}>Never Heated Above 40°C</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
