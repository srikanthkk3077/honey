import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Play,
  X,
  Wheat,
  Ban,
  FlaskConical,
  Users,
  Leaf,
  ShieldCheck,
  CheckCircle2,
  Edit3,
} from 'lucide-react';
import { useStore } from '../../../store/store';
import { DEFAULT_HERO_CONFIG, HeroBadge } from '../../../types/customer.types';

// Render the trust badge icon based on the icon key
const renderBadgeIcon = (iconKey: string) => {
  const size = 20;
  const strokeWidth = 1.6;
  switch (iconKey) {
    case 'natural':
    case 'wheat':
      return <Wheat size={size} strokeWidth={strokeWidth} />;
    case 'no-sugar':
    case 'flask':
      return <FlaskConical size={size} strokeWidth={strokeWidth} />;
    case 'beekeepers':
    case 'users':
      return <Users size={size} strokeWidth={strokeWidth} />;
    case 'leaf':
      return <Leaf size={size} strokeWidth={strokeWidth} />;
    case 'shield':
      return <ShieldCheck size={size} strokeWidth={strokeWidth} />;
    default:
      return <CheckCircle2 size={size} strokeWidth={strokeWidth} />;
  }
};

export const Hero: React.FC = () => {
  const { settings, isAdmin } = useStore();
  const hero = settings?.heroConfig || DEFAULT_HERO_CONFIG;

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const activeBadges: HeroBadge[] = (hero.trustBadges && hero.trustBadges.length > 0
    ? hero.trustBadges
    : DEFAULT_HERO_CONFIG.trustBadges
  ).filter((b) => b.isActive);

  const heroImage = hero.heroImageUrl || '/images/brand/hero_illustration_feathered.png';
  const videoUrl =
    hero.storyVideoUrl ||
    'https://res.cloudinary.com/kisnodzz/video/upload/f_auto,q_auto/v1/madhuvan_honey/videos/WhatsApp-Video-2026-10-02-at-1-1790995078981.mp4';

  const handleSecondaryClick = (e: React.MouseEvent) => {
    if (hero.storyVideoUrl || videoUrl) {
      e.preventDefault();
      setIsVideoModalOpen(true);
    }
  };

  return (
    <section
      id="madhuvan-hero-section"
      style={{
        position: 'relative',
        width: '100%',
        backgroundColor: hero.backgroundColor || '#FDDCC3',
        backgroundImage: `
          radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.4) 0%, transparent 40%),
          radial-gradient(circle at 90% 80%, rgba(245, 158, 11, 0.08) 0%, transparent 45%)
        `,
        overflow: 'hidden',
        minHeight: 'clamp(540px, 82vh, 760px)',
        display: 'flex',
        alignItems: 'center',
        padding: 'clamp(1.5rem, 3.5vw, 3rem) 0 clamp(2rem, 4vw, 3.5rem)',
      }}
    >


      {/* ── Bottom-Left Botanical Floral Ornament ── */}
      {hero.showBotanicalAccent !== false && (
        <div
          className="hero-botanical-accent"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: 'clamp(140px, 24vh, 220px)',
            width: 'auto',
            pointerEvents: 'none',
            zIndex: 2,
            opacity: 0.95,
          }}
        >
          <img
            src="/images/brand/botanical_corner_clean.png"
            alt="Botanical Wildflower Ornament"
            style={{
              height: '100%',
              width: 'auto',
              display: 'block',
              objectFit: 'contain',
              objectPosition: 'bottom left',
            }}
            loading="eager"
          />
        </div>
      )}

      {/* ── Right-Side Full Bleed Cover Image with Total Gradient Cover Blend ── */}
      <div
        className="hero-right-cover-wrapper"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: 'clamp(52%, 60vw, 68%)',
          height: '100%',
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        <img
          src={heroImage}
          alt="Madhuvan Raw Forest Honey"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center',
            display: 'block',
          }}
          loading="eager"
        />

        {/* ── Smooth Left-Edge Gradient Blend ── */}
        <div
          className="hero-cover-gradient-mask"
          style={{
            position: 'absolute',
            inset: 0,
            background: `
              linear-gradient(to right,
                ${hero.backgroundColor || '#FDDCC3'} 0%,
                rgba(253, 220, 195, 0.82) 18%,
                rgba(253, 220, 195, 0.35) 38%,
                rgba(253, 220, 195, 0.08) 58%,
                transparent 75%
              )
            `,
            pointerEvents: 'none',
          }}
        />
      </div>

      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 5,
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 clamp(1rem, 3.5vw, 2.5rem)',
          width: '100%',
        }}
      >
        <div
          className="hero-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 1.15fr)',
            alignItems: 'center',
            gap: 'clamp(1.5rem, 3.5vw, 3.5rem)',
          }}
        >
          {/* =========================================================================
              LEFT COLUMN: HERO CONTENT & BADGES
              ========================================================================= */}
          <div
            className="hero-content"
            style={{
              display: 'flex',
              flexDirection: 'column',
              zIndex: 3,
              maxWidth: '580px',
            }}
          >
            {/* 1. Eyebrow Tagline */}
            <div
              style={{
                fontSize: 'clamp(0.78rem, 1.4vw, 0.92rem)',
                fontWeight: 800,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#9E4616',
                marginBottom: 'clamp(0.6rem, 1.2vw, 1rem)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>{hero.eyebrow || 'FROM FOREST TO FAMILY'}</span>
            </div>

            {/* 2. Main Headline (Serif Elegant Typography) */}
            <h1
              style={{
                fontFamily: "var(--font-serif, 'Playfair Display', Georgia, serif)",
                fontSize: 'clamp(2.4rem, 4.8vw, 3.9rem)',
                fontWeight: 700,
                lineHeight: 1.12,
                color: '#2C150A',
                margin: '0 0 clamp(0.75rem, 1.5vw, 1.2rem) 0',
                letterSpacing: '-0.015em',
              }}
            >
              <span style={{ display: 'block' }}>
                {hero.titleLine1 || 'More Than Honey'}
              </span>
              <span style={{ display: 'block', color: '#2C150A' }}>
                {hero.titleLine2 || 'A Healthier Lifestyle'}
              </span>
            </h1>

            {/* 3. Description / Subtitle */}
            <p
              style={{
                fontSize: 'clamp(1rem, 1.8vw, 1.16rem)',
                lineHeight: 1.62,
                color: '#553725',
                margin: '0 0 clamp(1.4rem, 2.5vw, 2.2rem) 0',
                maxWidth: '520px',
                fontWeight: 400,
              }}
            >
              {hero.subtitle ||
                "Pure honey, collected from forest flowers for your family's better health."}
            </p>

            {/* 4. Action CTA Buttons */}
            <div
              className="hero-actions"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(0.75rem, 1.8vw, 1.25rem)',
                flexWrap: 'wrap',
                marginBottom: 'clamp(2rem, 3.5vw, 3rem)',
              }}
            >
              {/* Primary Button */}
              <Link
                to={hero.primaryCtaLink || '/shop'}
                className="hero-primary-btn"
                id="hero-primary-cta"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: '#4A1F0A',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: 'clamp(0.86rem, 1.4vw, 0.95rem)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  padding: 'clamp(0.85rem, 1.4vw, 1rem) clamp(1.6rem, 2.5vw, 2.2rem)',
                  borderRadius: '9999px',
                  boxShadow: '0 8px 22px rgba(74, 31, 10, 0.28)',
                  textDecoration: 'none',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  userSelect: 'none',
                }}
              >
                <span>{hero.primaryCtaText || 'SHOP RAW HONEY'}</span>
                <ArrowRight size={17} className="hero-arrow-icon" />
              </Link>

              {/* Secondary Button */}
              {hero.secondaryCtaText && (
                <button
                  type="button"
                  onClick={handleSecondaryClick}
                  className="hero-secondary-btn"
                  id="hero-secondary-cta"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.45)',
                    backdropFilter: 'blur(6px)',
                    WebkitBackdropFilter: 'blur(6px)',
                    color: '#381B0E',
                    fontWeight: 600,
                    fontSize: 'clamp(0.86rem, 1.4vw, 0.95rem)',
                    padding: 'clamp(0.85rem, 1.4vw, 1rem) clamp(1.4rem, 2.2vw, 1.9rem)',
                    borderRadius: '9999px',
                    border: '1.5px solid rgba(138, 70, 32, 0.35)',
                    cursor: 'pointer',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    userSelect: 'none',
                  }}
                >
                  <span
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: '#381B0E',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FDDCC3',
                    }}
                  >
                    <Play size={10} style={{ marginLeft: '1px' }} fill="#FDDCC3" />
                  </span>
                  <span>{hero.secondaryCtaText || 'Watch Our Story'}</span>
                </button>
              )}
            </div>

            {/* 5. Trust Badges Row (4 circular line-art badges) */}
            {activeBadges.length > 0 && (
              <div
                className="hero-trust-badges"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'clamp(0.75rem, 2vw, 1.85rem)',
                  paddingTop: 'clamp(0.5rem, 1.5vw, 1rem)',
                  borderTop: '1px solid rgba(154, 70, 22, 0.18)',
                  maxWidth: '560px',
                }}
              >
                {activeBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className="trust-badge-item"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      gap: '7px',
                      flex: '1 1 0',
                      minWidth: '70px',
                    }}
                  >
                    {/* Circle Icon Container */}
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        border: '1.5px solid rgba(154, 70, 22, 0.4)',
                        backgroundColor: 'rgba(255, 255, 255, 0.42)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#8A3E15',
                        boxShadow: '0 2px 6px rgba(138, 62, 21, 0.08)',
                        transition: 'transform 0.2s ease, background-color 0.2s ease',
                      }}
                    >
                      {renderBadgeIcon(badge.icon)}
                    </div>
                    {/* Badge Label */}
                    <span
                      style={{
                        fontSize: 'clamp(0.72rem, 1.2vw, 0.8rem)',
                        fontWeight: 600,
                        color: '#462717',
                        lineHeight: 1.25,
                        maxWidth: '92px',
                      }}
                    >
                      {badge.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* =========================================================================
              RIGHT COLUMN: CALLOUT BADGE FLOATING OVER COVER IMAGE
              ========================================================================= */}
          <div
            className="hero-visual"
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'flex-end',
              width: '100%',
              minHeight: 'clamp(360px, 50vh, 480px)',
              userSelect: 'none',
              paddingTop: 'clamp(1rem, 3vw, 2.5rem)',
              paddingRight: 'clamp(0.5rem, 2vw, 2rem)',
            }}
          >
            {/* Callout Speech Bubble (Pure Honey / Stronger Communities) */}
            {hero.showCalloutBadge !== false && (
              <div
                className="hero-callout-badge"
                style={{
                  backgroundColor: 'rgba(253, 237, 219, 0.95)',
                  border: '1.5px solid #C47942',
                  borderRadius: '50px',
                  padding: '8px 18px',
                  boxShadow: '0 8px 22px rgba(138, 70, 32, 0.2)',
                  transform: 'rotate(-4deg)',
                  pointerEvents: 'none',
                  animation: 'floatCallout 4s ease-in-out infinite',
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-serif, 'Playfair Display', Georgia, serif)",
                    fontStyle: 'italic',
                    fontSize: 'clamp(0.78rem, 1.4vw, 0.92rem)',
                    fontWeight: 700,
                    color: '#8C4318',
                    lineHeight: 1.2,
                    textAlign: 'center',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {hero.calloutBadgeText || 'Pure Honey\nStronger Communities'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          VIDEO SHOWCASE MODAL ("Watch Our Story")
          ========================================================================= */}
      {isVideoModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(15, 12, 10, 0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setIsVideoModalOpen(false)}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '860px',
              backgroundColor: '#1C1917',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.5rem',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                backgroundColor: '#26201A',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>🍯</span>
                <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '1rem' }}>
                  Madhuvan Honey — Our Story & Forest Harvest
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#A8A29E',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 0.15s ease',
                }}
                aria-label="Close modal"
              >
                <X size={22} />
              </button>
            </div>

            {/* Video Player */}
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: '#000000' }}>
              <video
                src={videoUrl}
                controls
                autoPlay
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Scoped CSS animations & responsive rules */}
      <style>{`
        @keyframes floatCallout {
          0%, 100% {
            transform: rotate(-4deg) translateY(0);
          }
          50% {
            transform: rotate(-3deg) translateY(-6px);
          }
        }

        .hero-primary-btn:hover {
          background-color: #381504 !important;
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(74, 31, 10, 0.38) !important;
        }

        .hero-primary-btn:hover .hero-arrow-icon {
          transform: translateX(4px);
        }

        .hero-arrow-icon {
          transition: transform 0.2s ease;
        }

        .hero-secondary-btn:hover {
          background-color: rgba(255, 255, 255, 0.75) !important;
          border-color: #8C4318 !important;
          transform: translateY(-2px);
        }

        .trust-badge-item:hover > div {
          transform: translateY(-2px);
          background-color: rgba(255, 255, 255, 0.75) !important;
          border-color: #8C4318 !important;
        }

        @media (max-width: 960px) {
          .hero-right-cover-wrapper {
            width: 100% !important;
            opacity: 0.38 !important;
          }
          .hero-visual {
            display: none !important;
          }
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
            text-align: center;
          }
          .hero-content {
            max-width: 100% !important;
            align-items: center !important;
          }
          .hero-actions {
            justify-content: center !important;
          }
          .hero-trust-badges {
            justify-content: center !important;
            margin: 0 auto;
          }
          .hero-botanical-accent {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .hero-trust-badges {
            gap: 0.5rem !important;
            flex-wrap: wrap !important;
          }
          .trust-badge-item {
            min-width: 60px !important;
          }
          .trust-badge-item > div {
            width: 36px !important;
            height: 36px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
