import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  X,
  ShieldCheck,
  Flame,
  Truck,
} from 'lucide-react';
import { useStore } from '../../../store/store';
import { SliderItem } from '../../../types/slider.types';
import { HeroShimmer } from '../../common/Shimmer';

interface QuoteSlide {
  id: string;
  quote: string;
  author: string;
  authorRole: string;
  varietyName: string;
  price: number;
  originalPrice: number;
  linkUrl: string;
  videoUrl?: string;
}

const HONEYVEDA_SLIDES: QuoteSlide[] = [
  {
    id: 'vineeta-quote',
    quote: '"Ye ajwain bada interesting hai, meetha hai lekein ajwain vala taste aa raha hai"',
    author: '— Vineeta Singh',
    authorRole: 'Shark Tank India Judge • CEO, SUGAR Cosmetics',
    varietyName: 'Raw Ajwain & Wild Forest Honey',
    price: 498,
    originalPrice: 650,
    linkUrl: '/shop',
    videoUrl:
      'https://res.cloudinary.com/kisnodzz/video/upload/f_auto,q_auto/v1/madhuvan_honey/videos/WhatsApp-Video-2026-10-02-at-1-1790995078981.mp4',
  },
  {
    id: 'master-beekeeper-quote',
    quote: '"Ye honey sach me 100% pure aur unheated hai — jungle ki live enzymes aur raw pollen ka asali swaad!"',
    author: '— Master Beekeeper Ramesh',
    authorRole: '3rd Generation Forest Apiary Gatherer',
    varietyName: '100% Raw Forest Comb Harvest',
    price: 549,
    originalPrice: 720,
    linkUrl: '/shop',
    videoUrl:
      'https://res.cloudinary.com/kisnodzz/video/upload/f_auto,q_auto/v1/madhuvan_honey/videos/WhatsApp-Video-2026-10-02-at-1-1791020235595.mp4',
  },
  {
    id: 'scientist-purity-quote',
    quote: '"Zero added sugar syrups, zero artificial heating. Tested and certified 100% NMR pure at national labs."',
    author: '— Dr. Ananya Sen',
    authorRole: 'Food Biochemist & Honey Purity Researcher',
    varietyName: 'Himalayan White Acacia Honey',
    price: 699,
    originalPrice: 899,
    linkUrl: '/shop',
    videoUrl:
      'https://res.cloudinary.com/kisnodzz/video/upload/f_auto,q_auto/v1/madhuvan_honey/videos/WhatsApp-Video-2026-10-02-at-1-1791020416024.mp4',
  },
];

export const Hero: React.FC = () => {
  const { sliders, isSlidersLoading } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string>('');
  const [isMuted, setIsMuted] = useState(true);

  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentSlide = HONEYVEDA_SLIDES[currentIndex] || HONEYVEDA_SLIDES[0];

  // Auto-advance slides every 7 seconds
  useEffect(() => {
    if (isHovered || isVideoModalOpen) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HONEYVEDA_SLIDES.length);
    }, 7000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isHovered, isVideoModalOpen]);

  // Restart video playback when slide changes
  useEffect(() => {
    if (heroVideoRef.current) {
      heroVideoRef.current.currentTime = 0;
      heroVideoRef.current.play().catch(() => {});
    }
  }, [currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % HONEYVEDA_SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + HONEYVEDA_SLIDES.length) % HONEYVEDA_SLIDES.length);
  };

  const toggleAudio = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsMuted((prev) => {
      const nextMuted = !prev;
      if (heroVideoRef.current) {
        heroVideoRef.current.muted = nextMuted;
      }
      return nextMuted;
    });
  };

  const openVideo = (url?: string) => {
    if (url) {
      if (heroVideoRef.current) {
        heroVideoRef.current.pause();
      }
      setActiveVideoUrl(url);
      setIsVideoModalOpen(true);
    }
  };

  const closeVideo = () => {
    setIsVideoModalOpen(false);
    if (heroVideoRef.current) {
      heroVideoRef.current.play().catch(() => {});
    }
  };

  if (isSlidersLoading && sliders.length === 0) {
    return <HeroShimmer />;
  }

  return (
    <section
      id="honeyveda-hero-section"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '88vh',
        background: 'linear-gradient(135deg, #F39C12 0%, #E67E22 35%, #D97706 70%, #B45309 100%)',
        color: '#FFFFFF',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingTop: '2.25rem',
      }}
    >
      {/* ── Background Honey Droplets & Swirl Watermark Texture ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at 75% 25%, rgba(254, 243, 199, 0.25) 0%, transparent 45%),
            radial-gradient(circle at 25% 75%, rgba(180, 83, 9, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.15) 0%, transparent 65%)
          `,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* ── Top Subtle Dark Vignette: Ensures Clean Header Readability ── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '110px',
          background: 'linear-gradient(180deg, rgba(30, 20, 10, 0.45) 0%, rgba(30, 20, 10, 0.15) 60%, transparent 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* =========================================================================
          TOP RIGHT: SHARK TANK INDIA OFFICIAL STYLE RIBBON
          ========================================================================= */}
      <div
        id="shark-tank-ribbon"
        style={{
          position: 'absolute',
          top: 0,
          right: 'clamp(1rem, 4vw, 3.5rem)',
          background: 'linear-gradient(180deg, #09172A 0%, #0F2847 100%)',
          color: '#FFFFFF',
          padding: '14px 16px 20px',
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 86%, 0 100%)',
          textAlign: 'center',
          zIndex: 20,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
          borderLeft: '1px solid rgba(245, 158, 11, 0.4)',
          borderRight: '1px solid rgba(245, 158, 11, 0.4)',
          minWidth: '94px',
          userSelect: 'none',
        }}
      >
        <div
          style={{
            fontSize: '0.62rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#93C5FD',
            marginBottom: '2px',
          }}
        >
          As seen on
        </div>
        <div
          style={{
            fontSize: '1rem',
            fontWeight: 900,
            letterSpacing: '0.05em',
            lineHeight: 1.05,
            color: '#FFFFFF',
            fontFamily: "'Playfair Display', Georgia, serif",
          }}
        >
          SHARK
        </div>
        <div
          style={{
            fontSize: '1rem',
            fontWeight: 900,
            letterSpacing: '0.05em',
            lineHeight: 1.05,
            color: '#FFFFFF',
            fontFamily: "'Playfair Display', Georgia, serif",
          }}
        >
          TANK
        </div>
        <div
          style={{
            fontSize: '0.74rem',
            fontWeight: 800,
            letterSpacing: '0.14em',
            color: '#F59E0B',
            marginTop: '3px',
          }}
        >
          INDIA
        </div>
      </div>

      {/* =========================================================================
          MAIN STAGE: 3-COLUMN COMPOSITION (Cartoon Avatar + Centered Quote + Honey Jar)
          ========================================================================= */}
      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 5,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 'clamp(1rem, 2.5vh, 2.5rem)',
          paddingBottom: 'clamp(1.5rem, 3.5vh, 3rem)',
        }}
      >
        <div
          id="honeyveda-stage-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(180px, 1fr) minmax(360px, 2fr) minmax(200px, 1.1fr)',
            alignItems: 'center',
            gap: 'clamp(1.5rem, 3vw, 3rem)',
            width: '100%',
          }}
        >
          {/* ── LEFT: Exact Same Box as Right Side Jar - Playing Video ── */}
          <div
            id="honeyveda-video-col"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: 'clamp(200px, 24vw, 290px)',
                filter: 'drop-shadow(0 20px 35px rgba(0, 0, 0, 0.45))',
                transform: 'rotate(-4deg)',
                animation: 'videoFloat 6s ease-in-out infinite',
                cursor: 'pointer',
              }}
              onClick={() => openVideo(currentSlide.videoUrl)}
              title="Click to expand video"
            >
              {/* Exact matching box container */}
              <div
                style={{
                  width: '100%',
                  aspectRatio: '1 / 1',
                  borderRadius: '22px',
                  overflow: 'hidden',
                  boxShadow: '0 16px 36px rgba(0, 0, 0, 0.3)',
                  background: '#0D0905',
                  position: 'relative',
                }}
              >
                <video
                  ref={heroVideoRef}
                  key={currentSlide.videoUrl}
                  src={currentSlide.videoUrl}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />

                {/* Ambient Scrim for badge contrast */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 28%, transparent 65%, rgba(0,0,0,0.6) 100%)',
                    pointerEvents: 'none',
                  }}
                />

                {/* Top-Right: Sound toggle button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAudio();
                  }}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(10, 8, 6, 0.85)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                    zIndex: 4,
                  }}
                  title={isMuted ? 'Click to Unmute' : 'Click to Mute'}
                  aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
                >
                  {isMuted ? <VolumeX size={15} color="#FBBF24" /> : <Volume2 size={15} color="#34D399" />}
                </button>

                {/* Top-Left: Live Clip pill */}
                <div
                  style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    background: 'rgba(10, 8, 6, 0.85)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '9999px',
                    padding: '4px 9px',
                    fontSize: '0.66rem',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    zIndex: 4,
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#EF4444',
                      boxShadow: '0 0 6px #EF4444',
                      display: 'inline-block',
                      animation: 'pulseDot 1.5s infinite',
                    }}
                  />
                  <span>Live Video</span>
                </div>
              </div>

              {/* Matching Bottom Pill (Same style as the right-side jar price tag pill) */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '10px',
                  background: 'rgba(10, 8, 6, 0.9)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  borderRadius: '12px',
                  padding: '6px 12px',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.4)',
                  zIndex: 4,
                }}
              >
                <Play size={13} fill="#FBBF24" color="#FBBF24" />
                <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#FBBF24' }}>Shark Tank Pitch</span>
              </div>
            </div>
          </div>

          {/* ── CENTER: Big Viral Quote + Attribution + Slider Dots ── */}
          <div
            id="honeyveda-quote-col"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '1.25rem',
              padding: '0 clamp(0.5rem, 2vw, 1.5rem)',
            }}
          >
            {/* The Famous Quote */}
            <h2
              id="honeyveda-quote-text"
              style={{
                fontSize: 'clamp(1.45rem, 2.8vw, 2.35rem)',
                fontWeight: 700,
                lineHeight: 1.35,
                color: '#FFFFFF',
                fontFamily: "'Playfair Display', Georgia, serif",
                letterSpacing: '-0.01em',
                margin: 0,
                textShadow: '0 2px 14px rgba(0, 0, 0, 0.4)',
                maxWidth: '680px',
              }}
            >
              {currentSlide.quote}
            </h2>

            {/* Author Attribution */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
              <div
                style={{
                  fontSize: 'clamp(0.95rem, 1.4vw, 1.15rem)',
                  fontWeight: 600,
                  color: '#FEF3C7',
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: 'italic',
                }}
              >
                {currentSlide.author}
              </div>
              <div
                style={{
                  fontSize: '0.8rem',
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontWeight: 500,
                  letterSpacing: '0.02em',
                }}
              >
                {currentSlide.authorRole}
              </div>
            </div>

            {/* CTA Actions: Explore Honey + Watch Video Clip */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                flexWrap: 'wrap',
                justifyContent: 'center',
                marginTop: '0.5rem',
              }}
            >
              <Link
                to={currentSlide.linkUrl}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#FFFFFF',
                  color: '#B45309',
                  padding: '11px 26px',
                  borderRadius: '9999px',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
                  transition: 'all 0.25s ease',
                }}
                className="honeyveda-cta-btn"
              >
                <span>Shop Raw Honey</span>
                <ArrowRight size={16} />
              </Link>

              {currentSlide.videoUrl && (
                <button
                  onClick={() => openVideo(currentSlide.videoUrl)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(0, 0, 0, 0.35)',
                    border: '1px solid rgba(255, 255, 255, 0.35)',
                    backdropFilter: 'blur(10px)',
                    color: '#FFFFFF',
                    padding: '11px 22px',
                    borderRadius: '9999px',
                    fontWeight: 700,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                  }}
                  className="honeyveda-video-btn"
                >
                  <Play size={15} fill="#FFFFFF" />
                  <span>Watch Video Clip</span>
                </button>
              )}
            </div>

            {/* Slider Dots (Exact HoneyVeda Style: White & Orange Dots) */}
            <div
              id="honeyveda-slider-dots"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '1rem',
              }}
            >
              {HONEYVEDA_SLIDES.map((slide, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={slide.id}
                    onClick={() => setCurrentIndex(idx)}
                    style={{
                      width: isActive ? '22px' : '9px',
                      height: '9px',
                      borderRadius: '9999px',
                      background: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.45)',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: isActive ? '0 0 10px rgba(255, 255, 255, 0.8)' : 'none',
                    }}
                    title={`Slide ${idx + 1}`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                );
              })}
            </div>
          </div>

          {/* ── RIGHT: Authentic Madhuvan Raw Honey Jar with Jute Lid Tie ── */}
          <div
            id="honeyveda-jar-col"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: 'clamp(200px, 24vw, 290px)',
                filter: 'drop-shadow(0 20px 35px rgba(0, 0, 0, 0.45))',
                transform: 'rotate(4deg)',
                animation: 'jarFloat 6s ease-in-out infinite',
              }}
            >
              <img
                src="/images/brand/madhuvan_jute_jar.jpg"
                alt="Madhuvan Raw Forest Honey in Jute Burlap Lid Jar"
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                  borderRadius: '22px',
                  boxShadow: '0 16px 36px rgba(0, 0, 0, 0.3)',
                }}
              />

              {/* Price Tag Pill */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '10px',
                  background: 'rgba(10, 8, 6, 0.9)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  borderRadius: '12px',
                  padding: '6px 12px',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.4)',
                }}
              >
                <span style={{ fontSize: '0.96rem', fontWeight: 800, color: '#FBBF24' }}>₹{currentSlide.price}</span>
                <span style={{ fontSize: '0.78rem', color: '#9CA3AF', textDecoration: 'line-through' }}>₹{currentSlide.originalPrice}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          BOTTOM FULL-WIDTH LUXURY TRUST TICKER (HONEYVEDA MARQUEE STRIP)
          ========================================================================= */}
      <div
        id="honeyveda-bottom-ticker"
        style={{
          width: '100%',
          background: '#FFFFFF',
          color: '#1C1917',
          padding: '12px 0',
          borderTop: '1px solid #E7E5E4',
          borderBottom: '1px solid #E7E5E4',
          overflow: 'hidden',
          zIndex: 10,
          position: 'relative',
        }}
      >
        <div className="honeyveda-ticker-marquee">
          <div className="honeyveda-ticker-track">
            {/* Repeated items for smooth seamless infinite scroll */}
            {[...Array(2)].map((_, loopIdx) => (
              <div
                key={loopIdx}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '2.5rem',
                  paddingRight: '2.5rem',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  color: '#292524',
                  whiteSpace: 'nowrap',
                }}
              >
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <Flame size={16} color="#DC2626" />
                  <span>No heating to cut corners</span>
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.1rem' }}>🐝</span>
                  <span>Gentle bee colony</span>
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.1rem' }}>🌱</span>
                  <span>Sustainable Farming</span>
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.1rem' }}>🌿</span>
                  <span>No processing for taste!</span>
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.1rem' }}>🐝</span>
                  <span>Focussed Bee Conservation</span>
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={16} color="#059669" />
                  <span>100% NMR Lab Certified Pure</span>
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <Truck size={16} color="#D97706" />
                  <span>Free Delivery on orders above ₹400</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          EMBEDDED VIDEO POPUP MODAL (When "Watch Video Clip" is clicked)
          ========================================================================= */}
      {isVideoModalOpen && activeVideoUrl && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(14px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={closeVideo}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '820px',
              aspectRatio: '16 / 9',
              background: '#0C0A08',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.75)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <video
              ref={modalVideoRef}
              src={activeVideoUrl}
              autoPlay
              controls
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />

            {/* Close Button */}
            <button
              onClick={closeVideo}
              style={{
                position: 'absolute',
                top: '14px',
                right: '14px',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'rgba(0, 0, 0, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
              }}
              aria-label="Close video"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ── Keyframe Animations & Responsive Layout Styles ── */}
      <style>{`
        @keyframes videoFloat {
          0%, 100% {
            transform: rotate(-4deg) translateY(0px);
          }
          50% {
            transform: rotate(-3deg) translateY(-10px);
          }
        }

        @keyframes jarFloat {
          0%, 100% {
            transform: rotate(4deg) translateY(0px);
          }
          50% {
            transform: rotate(3deg) translateY(-10px);
          }
        }

        @keyframes pulseDot {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.35;
            transform: scale(0.8);
          }
        }

        .honeyveda-cta-btn:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35) !important;
          background: #FEF3C7 !important;
        }

        .honeyveda-video-btn:hover {
          background: rgba(255, 255, 255, 0.2) !important;
          border-color: rgba(255, 255, 255, 0.6) !important;
          transform: translateY(-1px);
        }

        .honeyveda-ticker-marquee {
          overflow: hidden;
          width: 100%;
        }

        .honeyveda-ticker-track {
          display: flex;
          width: max-content;
          animation: tickerScroll 26s linear infinite;
        }

        .honeyveda-ticker-track:hover {
          animation-play-state: paused;
        }

        @keyframes tickerScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @media (max-width: 992px) {
          #honeyveda-hero-section {
            padding-top: 4.5rem !important;
          }

          #honeyveda-stage-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }

          #honeyveda-video-col {
            order: 2 !important;
          }

          #honeyveda-video-col > div {
            width: 200px !important;
          }

          #honeyveda-quote-col {
            order: 1 !important;
          }

          #honeyveda-jar-col {
            order: 3 !important;
          }

          #honeyveda-jar-col > div {
            width: 200px !important;
          }
        }

        @media (max-width: 640px) {
          #shark-tank-ribbon {
            right: 1rem !important;
            padding: 10px 12px 16px !important;
            min-width: 80px !important;
          }

          #honeyveda-quote-text {
            font-size: 1.35rem !important;
          }
        }
      `}</style>
    </section>
  );
};
