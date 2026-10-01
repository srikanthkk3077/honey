import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  Plus,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Check
} from 'lucide-react';
import { useStore } from '../../../store/store';
import { VideoModal } from '../video/VideoModal';
import { VideoItem } from '../../../types/video.types';
import confetti from 'canvas-confetti';

// 100% Guaranteed Pure Honey & Beekeeping Photography (Zero Watermelon / Food)
const PURE_HONEY_THUMBNAILS = [
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80', // Golden raw honey jar with dipper
  'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=600&q=80', // Honeycomb dripping in sunlight
  'https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=600&q=80', // Bees on honeycomb
  'https://images.unsplash.com/photo-1579294800821-694d95e86143?auto=format&fit=crop&w=600&q=80', // Raw amber honey pouring into jar
  'https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=600&q=80', // Artisanal honey harvest in apiary
];

export const Hero: React.FC = () => {
  const { videos, products, addToCart } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [selectedModalVideo, setSelectedModalVideo] = useState<VideoItem | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const thumbnailListRef = useRef<HTMLDivElement>(null);

  const heroVideos = videos && videos.length > 0 ? videos : [];
  const currentVideo = heroVideos[currentIndex] || heroVideos[0];

  // Auto-advance video stories every 9 seconds when not hovered
  useEffect(() => {
    if (isHovered || heroVideos.length <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroVideos.length);
    }, 9000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isHovered, heroVideos.length]);

  // Restart video playback when index changes
  useEffect(() => {
    setIsVideoLoading(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }

    if (thumbnailListRef.current) {
      const container = thumbnailListRef.current;
      const activeThumb = container.children[currentIndex] as HTMLElement;
      if (activeThumb) {
        const containerWidth = container.clientWidth;
        const thumbLeft = activeThumb.offsetLeft;
        const thumbWidth = activeThumb.offsetWidth;
        const targetScrollLeft = thumbLeft - containerWidth / 2 + thumbWidth / 2;
        container.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
      }
    }
  }, [currentIndex]);

  const handleNext = () => {
    if (heroVideos.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % heroVideos.length);
    }
  };

  const handlePrev = () => {
    if (heroVideos.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + heroVideos.length) % heroVideos.length);
    }
  };

  const toggleSound = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (videoRef.current) {
      videoRef.current.muted = nextMute;
      if (!nextMute) {
        videoRef.current.volume = 0.5;
        videoRef.current.play().catch(() => {});
      }
    }
  };

  const taggedProduct = currentVideo?.taggedProductId
    ? products.find((p) => p.id === currentVideo.taggedProductId)
    : products[0];

  const handleQuickAdd = () => {
    if (taggedProduct) {
      const sizeToAdd = taggedProduct.selectedSize || (taggedProduct.sizes?.[0]?.size ?? '500g');
      addToCart(taggedProduct, sizeToAdd, 1);
      setAddedAnimation(true);
      setTimeout(() => setAddedAnimation(false), 1800);

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#F59E0B', '#D97706', '#FEF3C7', '#10B981']
        });
      } catch {}
    }
  };

  // Helper to ensure 100% pure honey thumbnail
  const getHoneyThumbnail = (video: VideoItem, idx: number) => {
    if (
      !video.thumbnailUrl ||
      video.thumbnailUrl.includes('photo-1546554137') ||
      video.thumbnailUrl.includes('photo-1582794543') ||
      video.thumbnailUrl.includes('photo-1587049352846')
    ) {
      return PURE_HONEY_THUMBNAILS[idx % PURE_HONEY_THUMBNAILS.length];
    }
    return video.thumbnailUrl;
  };

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100svh',
        backgroundColor: '#0C0A08',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        color: '#FFFFFF',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      id="ott-hero-section"
    >
      {/* 1. Full-Length Video */}
      {currentVideo && (
        <video
          key={currentVideo.videoUrl}
          ref={videoRef}
          src={currentVideo.videoUrl}
          poster={getHoneyThumbnail(currentVideo, currentIndex)}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          onLoadedData={() => setIsVideoLoading(false)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 1,
            filter: 'brightness(0.92) contrast(1.05)',
            transition: 'opacity 0.5s ease-in-out',
            opacity: isVideoLoading ? 0.9 : 1,
          }}
        />
      )}

      {/* Video Poster Fallback */}
      {currentVideo && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${getHoneyThumbnail(currentVideo, currentIndex)})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0,
          }}
        />
      )}

      {/* 2. Soft, Seamless Gradient Overlays */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, rgba(12, 10, 8, 0.88) 0%, rgba(12, 10, 8, 0.55) 45%, rgba(12, 10, 8, 0.3) 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
        id="hero-left-gradient"
      />

      {/* Sleek light black bottom gradient vignette for depth and button legibility */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '340px',
          background: 'linear-gradient(0deg, rgba(10, 8, 6, 0.92) 0%, rgba(10, 8, 6, 0.55) 50%, transparent 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
        id="hero-bottom-fade"
      />

      {/* 3. Main Hero Content Layout */}
      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 3,
          paddingTop: '6rem',
          paddingBottom: 'clamp(1.75rem, 4vh, 2.75rem)',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(320px, 1.25fr) minmax(260px, 1fr)',
            alignItems: 'flex-end',
            gap: '2.5rem',
          }}
          id="hero-content-grid"
        >
          {/* ==============================================================
              LEFT COLUMN: Main Text & CTA Action Buttons
              ============================================================== */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
            {/* Eyebrow Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(245, 158, 11, 0.22)',
                border: '1px solid rgba(245, 158, 11, 0.45)',
                backdropFilter: 'blur(8px)',
                padding: '6px 14px',
                borderRadius: '9999px',
                color: '#FEF3C7',
                fontSize: 'clamp(0.72rem, 2vw, 0.8rem)',
                fontWeight: 700,
                letterSpacing: '0.04em',
                marginBottom: '1rem',
              }}
            >
              <Sparkles size={14} color="#F59E0B" />
              <span>100% Pure Raw Honey • Single-Origin Harvest</span>
            </div>

            {/* Main Headline */}
            <h1
              id="hero-headline"
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.1rem, 5vw, 3.25rem)',
                lineHeight: 1.15,
                fontWeight: 800,
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
                margin: '0 0 1rem 0',
                textShadow: '0 3px 20px rgba(0, 0, 0, 0.8)',
                maxWidth: '620px',
                wordBreak: 'normal',
                overflowWrap: 'break-word',
              }}
            >
              Taste the Liquid Gold of{' '}
              <span style={{ color: '#F59E0B', fontStyle: 'italic' }}>
                Virgin Forests.
              </span>
            </h1>

            {/* Description Text */}
            <p
              id="hero-description"
              style={{
                fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)',
                color: 'rgba(255, 255, 255, 0.92)',
                lineHeight: 1.6,
                margin: '0 0 1.75rem 0',
                maxWidth: '540px',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
              }}
            >
              Direct from wild Sundarbans mangroves and Himalayan apiaries. Unheated, raw, and live natural enzymes.
            </p>

          </div>

          {/* ==============================================================
              RIGHT COLUMN: Video Stories / Reels Carousel & Audio Toggle
              ============================================================== */}
          <div
            id="hero-right-col"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '1rem',
              width: '100%',
            }}
          >
            {/* Audio Toggle & Stories Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {/* Live Apiary Stories ({currentIndex + 1}/{heroVideos.length}) */}
              </div>

              {/* Audio Toggle Button */}
              <button
                onClick={toggleSound}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(0, 0, 0, 0.55)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(8px)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(245, 158, 11, 0.25)';
                  e.currentTarget.style.borderColor = '#F59E0B';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.55)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                }}
                title={isMuted ? 'Unmute Ambient Sound' : 'Mute Sound'}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} color="#F59E0B" />}
              </button>
            </div>

            {/* Horizontal Video Progress Bars / Pure Honey Thumbnails */}
            <div
              id="hero-thumbnails-wrapper"
              style={{
                width: '100%',
                maxWidth: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                justifyContent: 'flex-end',
                overflow: 'hidden',
              }}
            >
              {/* Prev Arrow */}
              {heroVideos.length > 3 && (
                <button
                  onClick={handlePrev}
                  className="hero-nav-arrow"
                  style={{
                    width: '30px',
                    height: '46px',
                    borderRadius: '8px',
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    backdropFilter: 'blur(6px)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
                  }}
                  title="Previous Honey Story"
                >
                  <ChevronLeft size={16} />
                </button>
              )}

              {/* Thumbnails Row (Only Pure Honey & Bees) */}
              <div
                ref={thumbnailListRef}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  overflowX: 'auto',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  padding: '4px',
                  WebkitOverflowScrolling: 'touch',
                }}
                id="hero-thumbnail-strip"
              >
                {heroVideos.map((video, idx) => {
                  const isActive = idx === currentIndex;
                  const thumbImg = getHoneyThumbnail(video, idx);
                  return (
                    <div
                      key={video.id}
                      onClick={() => setCurrentIndex(idx)}
                      style={{
                        position: 'relative',
                        width: '74px',
                        height: '48px',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: isActive ? '2px solid #F59E0B' : '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: isActive ? '0 0 14px rgba(245, 158, 11, 0.7)' : 'none',
                        transform: isActive ? 'scale(1.05)' : 'scale(1)',
                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        flexShrink: 0,
                      }}
                      onMouseOver={(e) => {
                        if (!isActive) e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.6)';
                      }}
                      onMouseOut={(e) => {
                        if (!isActive) e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                      }}
                      title={video.title}
                    >
                      <img
                        src={thumbImg}
                        alt="Pure Honey Harvest"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          filter: isActive ? 'brightness(1)' : 'brightness(0.65)',
                        }}
                      />

                      {/* Active Thumbnail Progress Bar */}
                      {isActive && (
                        <div
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '3px',
                            background: '#F59E0B',
                            animation: !isHovered ? 'thumbProgress 9s linear infinite' : 'none',
                          }}
                        />
                      )}

                      {/* Small Play icon on active */}
                      {isActive && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '3px',
                            right: '3px',
                            width: '14px',
                            height: '14px',
                            borderRadius: '50%',
                            background: '#D97706',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Play size={7} fill="#FFFFFF" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Next Arrow */}
              {heroVideos.length > 3 && (
                <button
                  onClick={handleNext}
                  className="hero-nav-arrow"
                  style={{
                    width: '30px',
                    height: '46px',
                    borderRadius: '8px',
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    backdropFilter: 'blur(6px)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
                  }}
                  title="Next Honey Story"
                >
                  <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Fullscreen Video Modal */}
      <VideoModal
        video={selectedModalVideo}
        onClose={() => setSelectedModalVideo(null)}
      />

      {/* Keyframe Animations & Responsive Styles */}
      <style>{`
        @keyframes thumbProgress {
          from { width: 0%; }
          to { width: 100%; }
        }

        #hero-thumbnail-strip::-webkit-scrollbar {
          display: none;
        }

        @media (max-width: 992px) {
          #ott-hero-section {
            min-height: 100svh !important;
            height: auto !important;
            padding-top: 5rem !important;
            padding-bottom: 2rem !important;
            justify-content: flex-end !important;
          }

          #hero-content-grid {
            grid-template-columns: 1fr !important;
            gap: 1.75rem !important;
          }

          #hero-left-gradient {
            background: linear-gradient(180deg, rgba(12, 10, 8, 0.88) 0%, rgba(12, 10, 8, 0.45) 45%, rgba(12, 10, 8, 0.82) 100%) !important;
          }

          #hero-right-col {
            align-items: flex-start !important;
          }

          #hero-thumbnails-wrapper {
            justify-content: flex-start !important;
          }

          #hero-thumbnail-strip {
            justify-content: flex-start !important;
          }

          .hero-nav-arrow {
            display: none !important;
          }
        }

        @media (max-width: 480px) {
          #ott-hero-section {
            padding-top: 4.85rem !important;
            padding-bottom: 2.25rem !important;
          }

          .hero-cta-group {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 0.75rem !important;
          }

          .hero-cta-group a,
          .hero-cta-group button {
            width: 100% !important;
            justify-content: center !important;
          }

          .hero-featured-pill {
            width: 100% !important;
          }

          #hero-thumbnail-strip > div {
            width: 64px !important;
            height: 42px !important;
          }
        }
      `}</style>
    </section>
  );
};
