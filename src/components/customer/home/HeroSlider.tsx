import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useStore } from '../../../store/store';
import { SliderItem } from '../../../types/slider.types';
import { DEFAULT_HERO_CONFIG } from '../../../types/customer.types';

// Fallback slide built from heroConfig when no sliders exist
const buildFallbackSlide = (heroConfig: any): SliderItem => ({
  id: 'hero-fallback',
  title: `${heroConfig?.titleLine1 || 'More Than Honey'} ${heroConfig?.titleLine2 || 'A Healthier Lifestyle'}`,
  subtitle: heroConfig?.subtitle || "Pure honey, collected from forest flowers for your family's better health.",
  badge: heroConfig?.eyebrow || 'PURE HONEY, NATURE’S GENUINE GIFT',
  mediaType: 'image',
  imageUrl: heroConfig?.heroImageUrl || '/images/brand/hero_illustration_feathered.png',
  videoUrl: '',
  linkUrl: heroConfig?.primaryCtaLink || '/shop',
  ctaText: heroConfig?.primaryCtaText || 'SHOP RAW HONEY',
  secondaryCtaText: heroConfig?.secondaryCtaText || 'Watch Our Story',
  secondaryCtaLink: heroConfig?.secondaryCtaLink || '/videos',
  order: 1,
  isActive: true,
});

// Slide background component with smooth image & video support
const SlideBackground: React.FC<{ slide: SliderItem; isActive: boolean }> = ({ slide, isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isActive) {
      videoRef.current.play().catch(() => { });
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isActive]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: isActive ? 1 : 0,
        pointerEvents: isActive ? 'auto' : 'none',
        zIndex: isActive ? 2 : 1,
      }}
    >
      {slide.mediaType === 'video' && slide.videoUrl ? (
        <video
          ref={videoRef}
          src={slide.videoUrl}
          poster={slide.imageUrl}
          muted
          loop
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <img
          src={slide.imageUrl || '/images/brand/hero_illustration_feathered.png'}
          alt={slide.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center',
            display: 'block',
          }}
          loading="eager"
        />
      )}

      {/* Elegant dark overlay gradient for readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(20, 10, 4, 0.88) 0%, rgba(20, 10, 4, 0.55) 50%, rgba(20, 10, 4, 0.25) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export const HeroSlider: React.FC = () => {
  const { sliders, settings } = useStore();
  const heroConfig = settings?.heroConfig || DEFAULT_HERO_CONFIG;

  const activeSliders = (sliders || [])
    .filter((s) => s.isActive !== false)
    .sort((a, b) => a.order - b.order);

  const slides: SliderItem[] =
    activeSliders.length > 0 ? activeSliders : [buildFallbackSlide(heroConfig)];

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

  // Autoplay timer
  useEffect(() => {
    if (total <= 1 || isPaused) return;
    intervalRef.current = setInterval(goNext, 6000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [goNext, total, isPaused]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev]);

  const slide = slides[current];

  return (
    <section
      id="hero-carousel-slider"
      aria-label="Home Banner Carousel"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: 'clamp(460px, 68vh, 600px)',
        height: 'clamp(460px, 68vh, 600px)',
        overflow: 'hidden',
        backgroundColor: '#1C1917',
      }}
      onMouseEnter={() => total > 1 && setIsPaused(true)}
      onMouseLeave={() => total > 1 && setIsPaused(false)}
    >
      {/* Background Media Layers */}
      {slides.map((s, i) => (
        <SlideBackground key={s.id} slide={s} isActive={i === current} />
      ))}

      {/* Slide Text Content */}
      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 10,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 1.5rem',
        }}
      >
        <div style={{ maxWidth: '640px' }}>
          {/* Eyebrow Badge */}
          {slide.badge && (
            <div
              key={`badge-${current}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(217, 119, 6, 0.22)',
                border: '1px solid rgba(245, 158, 11, 0.45)',
                color: '#FDE68A',
                fontSize: '0.82rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '1.25rem',
                backdropFilter: 'blur(8px)',
                animation: 'heroSlideFadeUp 0.5s ease both',
              }}
            >
              <span>🍯</span>
              <span>{slide.badge}</span>
            </div>
          )}

          {/* Headline */}
          <h1
            key={`title-${current}`}
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 1.15,
              margin: '0 0 1.25rem 0',
              textShadow: '0 2px 14px rgba(0, 0, 0, 0.4)',
              animation: 'heroSlideFadeUp 0.6s ease both',
            }}
          >
            {slide.title}
          </h1>

          {/* Subtitle */}
          {slide.subtitle && (
            <p
              key={`subtitle-${current}`}
              style={{
                fontSize: 'clamp(1rem, 1.8vw, 1.18rem)',
                lineHeight: 1.6,
                color: '#E7E5E4',
                margin: '0 0 2rem 0',
                maxWidth: '560px',
                textShadow: '0 1px 8px rgba(0, 0, 0, 0.3)',
                animation: 'heroSlideFadeUp 0.7s ease both',
              }}
            >
              {slide.subtitle}
            </p>
          )}

          {/* Action CTAs */}
          <div
            key={`actions-${current}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              animation: 'heroSlideFadeUp 0.8s ease both',
            }}
          >
            {slide.ctaText && (
              <Link
                to={slide.linkUrl || '/shop'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#D97706',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.96rem',
                  padding: '0.9rem 2rem',
                  borderRadius: '9999px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 18px rgba(217, 119, 6, 0.45)',
                  transition: 'all 0.25s ease',
                }}
              >
                <span>{slide.ctaText}</span>
                <ArrowRight size={17} />
              </Link>
            )}

            {slide.secondaryCtaText && (
              <Link
                to={slide.secondaryCtaLink || '/videos'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(8px)',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.96rem',
                  padding: '0.9rem 1.75rem',
                  borderRadius: '9999px',
                  textDecoration: 'none',
                  border: '1.5px solid rgba(255, 255, 255, 0.35)',
                  transition: 'all 0.25s ease',
                }}
              >
                <Play size={15} fill="#FFFFFF" />
                <span>{slide.secondaryCtaText}</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Arrows (shown if more than 1 slide) */}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous slide"
            style={{
              position: 'absolute',
              top: '50%',
              left: 'clamp(1rem, 2.5vw, 2.5rem)',
              transform: 'translateY(-50%)',
              zIndex: 20,
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.18)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <ChevronLeft size={22} />
          </button>

          <button
            type="button"
            onClick={goNext}
            aria-label="Next slide"
            style={{
              position: 'absolute',
              top: '50%',
              right: 'clamp(1rem, 2.5vw, 2.5rem)',
              transform: 'translateY(-50%)',
              zIndex: 20,
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.18)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {total > 1 && (
        <div
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: 0,
            right: 0,
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              style={{
                width: i === current ? '34px' : '9px',
                height: '9px',
                borderRadius: '9999px',
                border: 'none',
                backgroundColor: i === current ? '#F59E0B' : 'rgba(255, 255, 255, 0.4)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: 0,
              }}
            />
          ))}
        </div>
      )}

      {/* Counter Badge */}
      {total > 1 && (
        <div
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            zIndex: 20,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '9999px',
            padding: '4px 12px',
            color: '#FFFFFF',
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
          }}
        >
          {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </div>
      )}

      {/* Progress Bar */}
      {total > 1 && !isPaused && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '3px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            zIndex: 20,
          }}
        >
          <div
            key={`bar-${current}`}
            style={{
              height: '100%',
              backgroundColor: '#F59E0B',
              animation: 'heroSlideProgress 6s linear forwards',
            }}
          />
        </div>
      )}

      <style>{`
        @keyframes heroSlideFadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes heroSlideProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
};

export default HeroSlider;
