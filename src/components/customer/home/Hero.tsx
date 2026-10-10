import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useStore } from '../../../store/store';
import { DEFAULT_HERO_CONFIG, HeroBadge, HeroBannerSlide } from '../../../types/customer.types';
import { isDarkColor, colorWithAlpha, getSlideGradientMask } from '../../../utils/color';

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

  // ── Build the slides array ──────────────────────────────────────────────────
  // If admin added multiple banner slides, use those; otherwise fall back to single image
  const adminSlides: HeroBannerSlide[] = (hero.heroBannerSlides || []).filter(
    (s) => s.isActive !== false && s.imageUrl
  ).sort((a, b) => (a.order || 0) - (b.order || 0));

  // Build the effective slides to display
  const slides: HeroBannerSlide[] = adminSlides.length > 0
    ? adminSlides
    : [{
      id: 'default',
      imageUrl: hero.heroImageUrl || '/images/brand/hero_illustration_feathered.png',
      mobileImageUrl: hero.heroMobileImageUrl || '',
      titleLine1: hero.titleLine1,
      titleLine2: hero.titleLine2,
      subtitle: hero.subtitle,
      eyebrow: hero.eyebrow,
      primaryCtaText: hero.primaryCtaText,
      primaryCtaLink: hero.primaryCtaLink,
      isActive: true,
      order: 0,
    }];

  const total = slides.length;
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (index: number) => {
      if (isAnimating || index === current) return;
      setIsAnimating(true);
      setCurrent((index + total) % total);
      setTimeout(() => setIsAnimating(false), 700);
    },
    [isAnimating, current, total]
  );

  const goNext = useCallback(() => goTo((current + 1) % total), [current, total, goTo]);
  const goPrev = useCallback(() => goTo((current - 1 + total) % total), [current, total, goTo]);

  useEffect(() => {
    if (total <= 1 || isPaused) return;
    intervalRef.current = setInterval(goNext, 5500);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [goNext, total, isPaused]);

  // Helper for YouTube embed
  const getYouTubeEmbedUrl = (url?: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : null;
  };

  const slide = slides[current];

  // 1. Cover Image:
  // Active slide's imageUrl is the source of truth for that slide.
  const heroImage = slide?.imageUrl || hero.heroImageUrl || '/images/brand/hero_illustration_feathered.png';

  // 2. Headings & Titles:
  // Slide-specific values take precedence if non-empty; fallback to main hero config.
  const eyebrow = (slide?.eyebrow && slide.eyebrow.trim())
    ? slide.eyebrow
    : (hero.eyebrow || DEFAULT_HERO_CONFIG.eyebrow);

  const titleLine1 = (slide?.titleLine1 && slide.titleLine1.trim())
    ? slide.titleLine1
    : (hero.titleLine1 || DEFAULT_HERO_CONFIG.titleLine1);

  const titleLine2 = (slide?.titleLine2 !== undefined && slide.titleLine2.trim() !== '')
    ? slide.titleLine2
    : (hero.titleLine2 !== undefined ? hero.titleLine2 : DEFAULT_HERO_CONFIG.titleLine2);

  const subtitle = (slide?.subtitle && slide.subtitle.trim())
    ? slide.subtitle
    : (hero.subtitle || DEFAULT_HERO_CONFIG.subtitle);

  // 3. Buttons:
  const primaryCtaText = (slide?.primaryCtaText && slide.primaryCtaText.trim())
    ? slide.primaryCtaText
    : (hero.primaryCtaText || DEFAULT_HERO_CONFIG.primaryCtaText);

  const primaryCtaLink = (slide?.primaryCtaLink && slide.primaryCtaLink.trim())
    ? slide.primaryCtaLink
    : (hero.primaryCtaLink || DEFAULT_HERO_CONFIG.primaryCtaLink);

  const secondaryCtaText = (slide?.secondaryCtaText && slide.secondaryCtaText.trim())
    ? slide.secondaryCtaText
    : (hero.secondaryCtaText || DEFAULT_HERO_CONFIG.secondaryCtaText);

  const secondaryCtaLink = (slide?.secondaryCtaLink && slide.secondaryCtaLink.trim())
    ? slide.secondaryCtaLink
    : (hero.secondaryCtaLink || DEFAULT_HERO_CONFIG.secondaryCtaLink || '/videos');

  // 4. Style & Colors:
  const activeBgColor = (slide?.backgroundColor && slide.backgroundColor.trim())
    ? slide.backgroundColor
    : (hero.backgroundColor || '#FDDCC3');

  const isDark = isDarkColor(activeBgColor);

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const activeBadges: HeroBadge[] = (hero.trustBadges && hero.trustBadges.length > 0
    ? hero.trustBadges
    : DEFAULT_HERO_CONFIG.trustBadges
  ).filter((b) => b.isActive);

  const videoUrl =
    hero.storyVideoUrl ||
    'https://res.cloudinary.com/kisnodzz/video/upload/f_auto,q_auto/v1/madhuvan_honey/videos/WhatsApp-Video-2026-10-02-at-1-1790995078981.mp4';

  const ytEmbedUrl = getYouTubeEmbedUrl(videoUrl);

  const handleSecondaryClick = (e: React.MouseEvent) => {
    if (secondaryCtaLink === '#video' || secondaryCtaLink === '/videos' || !secondaryCtaLink) {
      if (hero.storyVideoUrl || videoUrl) {
        e.preventDefault();
        setIsVideoModalOpen(true);
      }
    }
  };

  return (
    <section
      id="madhuvan-hero-section"
      style={{
        position: 'relative',
        width: '100%',
        backgroundColor: activeBgColor,
        transition: 'background-color 0.85s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        minHeight: 'clamp(460px, 85vh, 620px)',
        display: 'flex',
        alignItems: 'center',
        padding: 'clamp(1rem, 2vw, 1.8rem) 0 clamp(1.2rem, 2.5vw, 2rem)',
      }}
      onMouseEnter={() => total > 1 && setIsPaused(true)}
      onMouseLeave={() => total > 1 && setIsPaused(false)}
    >
      {/* ── Stacked Crossfading Slide Backgrounds & Dynamic Gradient Masks ── */}
      {slides.map((s, idx) => {
        const isCurrent = idx === current;
        const sBg = s.backgroundColor && s.backgroundColor.trim()
          ? s.backgroundColor
          : (hero.backgroundColor || '#FDDCC3');
        const sDark = isDarkColor(sBg);
        const sImg = s.imageUrl || hero.heroImageUrl || '/images/brand/hero_illustration_feathered.png';
        const sMobileImg = (s.mobileImageUrl && s.mobileImageUrl.trim())
          || (hero.heroMobileImageUrl && hero.heroMobileImageUrl.trim())
          || null;
        const mask = getSlideGradientMask(sBg);

        return (
          <div
            key={s.id || `slide-bg-${idx}`}
            className="hero-slide-backdrop"
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: sBg,
              opacity: isCurrent ? 1 : 0,
              transition: 'opacity 0.85s cubic-bezier(0.4, 0, 0.2, 1)',
              pointerEvents: 'none',
              zIndex: isCurrent ? 2 : 1,
              overflow: 'hidden',
            }}
          >
            {/* Ambient subtle glow */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: sDark
                  ? `
                    radial-gradient(circle at 12% 25%, rgba(255, 255, 255, 0.08) 0%, transparent 45%),
                    radial-gradient(circle at 88% 75%, rgba(245, 158, 11, 0.16) 0%, transparent 50%)
                  `
                  : `
                    radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.45) 0%, transparent 40%),
                    radial-gradient(circle at 90% 80%, rgba(245, 158, 11, 0.10) 0%, transparent 45%)
                  `,
                pointerEvents: 'none',
              }}
            />

            {/* Full-Bleed Cover Image (spanning 100% width and height) */}
            <div
              className="hero-right-cover-wrapper"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                overflow: 'hidden',
              }}
            >
              <picture
                key={`hero-pic-${s.id || idx}-${sMobileImg || 'none'}`}
                style={{ width: '100%', height: '100%', display: 'block' }}
              >
                {sMobileImg && (
                  <source media="(max-width: 960px)" srcSet={sMobileImg} />
                )}
                <img
                  src={sImg}
                  alt={s.titleLine1 || 'Madhuvan Raw Honey'}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center center',
                    display: 'block',
                  }}
                  loading="eager"
                />
              </picture>

              {/* Dynamic Text-Backdrop Gradient Mask (localized behind left text area, preserving top/bottom corners) */}
              <div
                className="hero-cover-gradient-mask"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: mask,
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>
        );
      })}
      
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
            gap: 'clamp(1.2rem, 3vw, 2.8rem)',
          }}
        >
          {/* =========================================================================
              LEFT COLUMN: HERO CONTENT & BADGES
              ========================================================================= */}
          <div
            key={`hero-content-${current}`}
            className="hero-content"
            style={{
              display: 'flex',
              flexDirection: 'column',
              zIndex: 3,
              maxWidth: '560px',
              animation: total > 1 ? 'heroContentFade 0.65s cubic-bezier(0.16, 1, 0.3, 1) both' : 'none',
            }}
          >
            {/* 1. Eyebrow Tagline */}
            <div
              className="hero-eyebrow"
              style={{
                fontSize: 'clamp(0.76rem, 1.3vw, 0.88rem)',
                fontWeight: 800,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: isDark ? '#F59E0B' : '#9E4616',
                marginBottom: 'clamp(0.4rem, 0.8vw, 0.65rem)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'color 0.4s ease',
              }}
            >
              <span>{eyebrow}</span>
            </div>

            {/* 2. Main Headline (Serif Elegant Typography) */}
            <h1
              className="hero-headline"
              style={{
                fontFamily: "var(--font-serif, 'Playfair Display', Georgia, serif)",
                fontSize: 'clamp(2.1rem, 4.2vw, 3.4rem)',
                fontWeight: 700,
                lineHeight: 1.14,
                color: isDark ? '#FFFFFF' : '#2C150A',
                margin: '0 0 clamp(0.5rem, 1vw, 0.85rem) 0',
                letterSpacing: '-0.015em',
                textShadow: isDark ? '0 2px 14px rgba(0,0,0,0.45)' : 'none',
                transition: 'color 0.4s ease',
              }}
            >
              <Link
                to={primaryCtaLink}
                className="hero-headline-link"
                style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
              >
                <span className="hero-title-line-1" style={{ display: 'block' }}>
                  {titleLine1}
                </span>
                {titleLine2 && (
                  <span className="hero-title-line-2" style={{ display: 'block', color: isDark ? '#FFFBEB' : '#955C0D' }}>
                    {titleLine2}
                  </span>
                )}
              </Link>
            </h1>

            {/* 3. Description / Subtitle */}
            <p
              className="hero-subtitle"
              style={{
                fontSize: 'clamp(0.92rem, 1.5vw, 1.05rem)',
                lineHeight: 1.56,
                color: isDark ? '#F5EBE1' : '#553725',
                margin: '0 0 clamp(1rem, 1.8vw, 1.4rem) 0',
                maxWidth: '500px',
                fontWeight: 400,
                transition: 'color 0.4s ease',
              }}
            >
              {subtitle}
            </p>

            {/* 4. Action CTA Buttons */}
            <div
              className="hero-actions"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(0.75rem, 1.6vw, 1.15rem)',
                flexWrap: 'wrap',
                marginBottom: 'clamp(1.2rem, 2.2vw, 1.8rem)',
              }}
            >
              {/* Primary Button */}
              <Link
                to={primaryCtaLink}
                className="hero-primary-btn"
                id="hero-primary-cta"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: isDark ? '#F59E0B' : '#4A1F0A',
                  color: isDark ? '#1C1917' : '#FFFFFF',
                  fontWeight: 700,
                  fontSize: 'clamp(0.82rem, 1.3vw, 0.92rem)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  padding: 'clamp(0.75rem, 1.2vw, 0.9rem) clamp(1.4rem, 2.2vw, 1.9rem)',
                  borderRadius: '9999px',
                  boxShadow: isDark ? '0 8px 24px rgba(245, 158, 11, 0.35)' : '0 8px 22px rgba(74, 31, 10, 0.28)',
                  textDecoration: 'none',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  userSelect: 'none',
                }}
              >
                <span>{primaryCtaText}</span>
                <ArrowRight size={17} className="hero-arrow-icon" />
              </Link>

              {/* Secondary Button */}
              {secondaryCtaText && (
                ((!secondaryCtaLink || secondaryCtaLink === '/videos' || secondaryCtaLink === '#video') && (hero.storyVideoUrl || videoUrl)) ? (
                  <button
                    type="button"
                    onClick={handleSecondaryClick}
                    className="hero-secondary-btn"
                    id="hero-secondary-cta"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(255, 255, 255, 0.45)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      color: isDark ? '#FFFFFF' : '#381B0E',
                      fontWeight: 600,
                      fontSize: 'clamp(0.82rem, 1.3vw, 0.92rem)',
                      padding: 'clamp(0.75rem, 1.2vw, 0.9rem) clamp(1.3rem, 2vw, 1.75rem)',
                      borderRadius: '9999px',
                      border: isDark ? '1.5px solid rgba(255, 255, 255, 0.4)' : '1.5px solid rgba(138, 70, 32, 0.35)',
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
                        backgroundColor: isDark ? '#F59E0B' : '#381B0E',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isDark ? '#1C1917' : '#FDDCC3',
                      }}
                    >
                      <Play size={10} style={{ marginLeft: '1px' }} fill={isDark ? '#1C1917' : '#FDDCC3'} />
                    </span>
                    <span>{secondaryCtaText}</span>
                  </button>
                ) : (
                  <Link
                    to={secondaryCtaLink || '/videos'}
                    className="hero-secondary-btn"
                    id="hero-secondary-cta"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(255, 255, 255, 0.45)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      color: isDark ? '#FFFFFF' : '#381B0E',
                      fontWeight: 600,
                      fontSize: 'clamp(0.82rem, 1.3vw, 0.92rem)',
                      padding: 'clamp(0.75rem, 1.2vw, 0.9rem) clamp(1.3rem, 2vw, 1.75rem)',
                      borderRadius: '9999px',
                      border: isDark ? '1.5px solid rgba(255, 255, 255, 0.4)' : '1.5px solid rgba(138, 70, 32, 0.35)',
                      cursor: 'pointer',
                      textDecoration: 'none',
                      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                      userSelect: 'none',
                    }}
                  >
                    <span
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: isDark ? '#F59E0B' : '#381B0E',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isDark ? '#1C1917' : '#FDDCC3',
                      }}
                    >
                      <Play size={10} style={{ marginLeft: '1px' }} fill={isDark ? '#1C1917' : '#FDDCC3'} />
                    </span>
                    <span>{secondaryCtaText}</span>
                  </Link>
                )
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
                  borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.18)' : '1px solid rgba(154, 70, 22, 0.18)',
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
                        border: isDark ? '1.5px solid rgba(255, 255, 255, 0.3)' : '1.5px solid rgba(154, 70, 22, 0.4)',
                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(255, 255, 255, 0.42)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isDark ? '#FBBF24' : '#8A3E15',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
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
                        color: isDark ? '#FAF4EC' : '#462717',
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
                  backgroundColor: isDark ? 'rgba(28, 14, 8, 0.92)' : 'rgba(253, 237, 219, 0.95)',
                  border: isDark ? '1.5px solid #F59E0B' : '1.5px solid #C47942',
                  borderRadius: '50px',
                  padding: '8px 18px',
                  boxShadow: '0 8px 22px rgba(0, 0, 0, 0.25)',
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
                    color: isDark ? '#FBBF24' : '#8C4318',
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
              {ytEmbedUrl ? (
                <iframe
                  src={ytEmbedUrl}
                  title="Madhuvan Honey Story Video"
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  playsInline
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              )}
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
          filter: brightness(1.12);
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.32) !important;
        }

        .hero-primary-btn:hover .hero-arrow-icon {
          transform: translateX(4px);
        }

        .hero-arrow-icon {
          transition: transform 0.2s ease;
        }

        .hero-secondary-btn:hover {
          filter: brightness(1.15);
          transform: translateY(-2px);
        }

        .trust-badge-item:hover > div {
          transform: translateY(-2px);
          filter: brightness(1.12);
        }

        @media (max-width: 960px) {
          #madhuvan-hero-section {
            min-height: clamp(520px, 84vh, 650px) !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: flex-end !important;
            align-items: stretch !important;
            padding-top: 1rem !important;
            padding-bottom: clamp(3.2rem, 8vw, 4.2rem) !important;
          }

          #madhuvan-hero-section .container {
            margin-top: auto !important;
            margin-bottom: 0 !important;
            padding-left: 1.25rem !important;
            padding-right: 1.25rem !important;
            width: 100% !important;
          }

          .hero-grid {
            display: block !important;
            grid-template-columns: 1fr !important;
            gap: 0 !important;
            text-align: center !important;
            width: 100% !important;
            margin: 0 !important;
          }

          .hero-content {
            max-width: 100% !important;
            width: 100% !important;
            align-items: center !important;
            text-align: center !important;
            margin: 0 auto !important;
            padding: 0 !important;
            z-index: 5 !important;
            animation: none !important;
          }

          /* Hide descriptions, buttons, eyebrow, badges, and callouts on mobile view */
          .hero-eyebrow,
          .hero-subtitle,
          .hero-actions,
          .hero-trust-badges,
          .hero-visual,
          .hero-callout-badge,
          .hero-botanical-accent {
            display: none !important;
          }

          /* Keep only simple Title 1 and Title 2 at the bottom of the jar */
          .hero-headline {
            margin: 0 !important;
            text-align: center !important;
            line-height: 1.18 !important;
            padding: 0 0.5rem !important;
          }

          .hero-headline-link {
            text-decoration: none !important;
            color: inherit !important;
            display: block !important;
          }

          .hero-headline .hero-title-line-1 {
            display: block !important;
            font-family: var(--font-serif, 'Playfair Display', Georgia, serif) !important;
            font-size: clamp(1.45rem, 5.6vw, 2.05rem) !important;
            font-weight: 700 !important;
            color: #FFFFFF !important;
            letter-spacing: -0.01em !important;
            line-height: 1.2 !important;
            text-shadow: 0 2px 14px rgba(0, 0, 0, 0.95), 0 1px 4px rgba(0, 0, 0, 0.9) !important;
          }

          .hero-headline .hero-title-line-2 {
            display: block !important;
            font-family: var(--font-serif, 'Playfair Display', Georgia, serif) !important;
            font-size: clamp(1.15rem, 4.4vw, 1.48rem) !important;
            font-weight: 600 !important;
            color: #FDE68A !important;
            letter-spacing: -0.01em !important;
            margin-top: 4px !important;
            line-height: 1.2 !important;
            text-shadow: 0 2px 12px rgba(0, 0, 0, 0.95), 0 1px 4px rgba(0, 0, 0, 0.9) !important;
          }

          /* Bottom dark gradient: crystal clear over upper 50% so jar is 100% visible,
             smoothly darkening at the bottom behind Title 1 and Title 2 */
          .hero-cover-gradient-mask {
            opacity: 1 !important;
            background: linear-gradient(
              180deg,
              transparent 0%,
              transparent 45%,
              rgba(10, 5, 2, 0.15) 58%,
              rgba(10, 5, 2, 0.55) 72%,
              rgba(10, 5, 2, 0.85) 86%,
              rgba(10, 5, 2, 0.96) 100%
            ) !important;
          }

          .hero-right-cover-wrapper img {
            opacity: 1 !important;
            object-fit: cover !important;
            object-position: center center !important;
          }

          .hero-pagination-dots {
            bottom: clamp(0.75rem, 2.2vw, 1.15rem) !important;
          }
        }

        @keyframes heroImageFade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        @keyframes heroContentFade {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes heroProgressBar {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>

      {/* ── Pill dot indicators ── */}
      {total > 1 && (
        <div
          className="hero-pagination-dots"
          style={{
            position: 'absolute',
            bottom: 'clamp(1rem, 2vw, 1.75rem)',
            left: 0,
            right: 0,
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '7px',
          }}
        >
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              style={{
                width: i === current ? '32px' : '8px',
                height: '8px',
                borderRadius: '9999px',
                border: 'none',
                backgroundColor: i === current
                  ? '#F59E0B'
                  : (isDark ? 'rgba(255, 255, 255, 0.35)' : 'rgba(138, 62, 21, 0.35)'),
                cursor: 'pointer',
                transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                padding: 0,
                flexShrink: 0,
                boxShadow: i === current ? '0 0 8px rgba(245, 158, 11, 0.6)' : 'none',
              }}
            />
          ))}
        </div>
      )}

      {/* ── Auto-play progress bar ── */}
      {total > 1 && !isPaused && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '3px',
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(138, 62, 21, 0.12)',
            zIndex: 20,
          }}
        >
          <div
            key={`progress-${current}`}
            style={{
              height: '100%',
              backgroundColor: isDark ? '#F59E0B' : '#9E4616',
              animation: 'heroProgressBar 5.5s linear forwards',
            }}
          />
        </div>
      )}
    </section>
  );
};

export default Hero;
