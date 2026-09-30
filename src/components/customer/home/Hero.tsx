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
  'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80', // Honey jar with wooden dipper
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
      const activeThumb = thumbnailListRef.current.children[currentIndex] as HTMLElement;
      if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
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
    if (!video.thumbnailUrl || video.thumbnailUrl.includes('photo-1546554137') || video.thumbnailUrl.includes('photo-1582794543')) {
      return PURE_HONEY_THUMBNAILS[idx % PURE_HONEY_THUMBNAILS.length];
    }
    return video.thumbnailUrl;
  };

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '90vh',
        height: '92vh',
        maxHeight: '920px',
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
      {/* 1. Full-Length Video (Highlighted & Crystal Clear) */}
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
            filter: 'brightness(0.95) contrast(1.04)',
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

      {/* 2. Soft, Subtle Gradient Overlays (Allows Video to be Highlighted) */}
      {/* Soft left vignette for text legibility without blocking the video */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, rgba(12, 10, 8, 0.8) 0%, rgba(12, 10, 8, 0.45) 38%, transparent 75%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
        id="hero-left-gradient"
      />

      {/* Soft bottom vignette for page flow */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '160px',
          background: 'linear-gradient(0deg, #181511 0%, rgba(24, 21, 17, 0.6) 35%, transparent 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* 3. Main Hero Content Layout */}
      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 3,
          paddingTop: '6rem',
          paddingBottom: '3rem',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(300px, 1.15fr) minmax(260px, 1fr)',
            alignItems: 'flex-end',
            gap: '2.5rem',
          }}
          id="hero-content-grid"
        >
          {/* ==============================================================
              LEFT COLUMN: Simple, Refined Text (Video is the Highlight)
              ============================================================== */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            {/* Simple Subtle Eyebrow Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(245, 158, 11, 0.18)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                backdropFilter: 'blur(8px)',
                padding: '5px 12px',
                borderRadius: '9999px',
                color: '#FEF3C7',
                fontSize: '0.78rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                marginBottom: '0.75rem',
              }}
            >
              <Sparkles size={13} color="#F59E0B" />
              <span>100% Pure Raw Honey • Single-Origin Harvest</span>
            </div>

            {/* Clean, Simple Title (Refined size, not giant) */}
            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.9rem, 3.4vw, 2.75rem)',
                lineHeight: 1.15,
                fontWeight: 800,
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
                margin: '0 0 0.75rem 0',
                textShadow: '0 3px 18px rgba(0, 0, 0, 0.7)',
                maxWidth: '580px',
              }}
            >
              Taste the Liquid Gold of{' '}
              <span style={{ color: '#F59E0B', fontStyle: 'italic' }}>
                Virgin Forests.
              </span>
            </h1>

            {/* Simple, Concise Description Text */}
            <p
              style={{
                fontSize: '1rem',
                color: 'rgba(255, 255, 255, 0.88)',
                lineHeight: 1.6,
                margin: '0 0 1.5rem 0',
                maxWidth: '500px',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.7)',
              }}
            >
              Direct from wild Sundarbans and Himalayan apiaries. Unheated, raw, and NMR lab certified pure with live natural enzymes.
            </p>

            {/* Simple, Clean Honey CTAs */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Primary Golden Button: Watch Story */}
              <button
                onClick={() => setSelectedModalVideo(currentVideo)}
                style={{
                  background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 60%, #B45309 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '11px 22px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(217, 119, 6, 0.4)',
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(217, 119, 6, 0.55)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(217, 119, 6, 0.4)';
                }}
                id="hero-watch-story-btn"
              >
                <Play size={16} fill="#FFFFFF" />
                <span>Watch Story</span>
              </button>

              {/* Secondary Frosted Glass Button: "+" Quick Add */}
              <button
                onClick={handleQuickAdd}
                title={`Quick Order ${taggedProduct?.name || 'Honey'}`}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: addedAnimation ? '#059669' : 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(10px)',
                  border: addedAnimation ? '1px solid #10B981' : '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={(e) => {
                  if (!addedAnimation) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.22)';
                    e.currentTarget.style.borderColor = '#F59E0B';
                  }
                }}
                onMouseOut={(e) => {
                  if (!addedAnimation) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                  }
                }}
                id="hero-quick-add-btn"
              >
                {addedAnimation ? <Check size={18} color="#FFFFFF" /> : <Plus size={20} />}
              </button>

              {/* Tertiary Link: Shop Honey */}
              <Link
                to="/shop"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  padding: '11px 18px',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(245, 158, 11, 0.2)';
                  e.currentTarget.style.borderColor = '#F59E0B';
                  e.currentTarget.style.color = '#FEF3C7';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
              >
                <ShoppingBag size={15} color="#F59E0B" />
                <span>Shop Honey ({taggedProduct ? `₹${taggedProduct.price}` : '₹649'})</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* ==============================================================
              RIGHT COLUMN: Sound Toggle & Pure Honey Thumbnail Strip
              ============================================================== */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '0.85rem',
            }}
          >
            {/* Audio Toggle Button */}
            <button
              onClick={toggleSound}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'rgba(0, 0, 0, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(8px)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(245, 158, 11, 0.25)';
                e.currentTarget.style.borderColor = '#F59E0B';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.45)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
              title={isMuted ? 'Unmute Ambient Sound' : 'Mute Sound'}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} color="#F59E0B" />}
            </button>

            {/* Horizontal Video Progress Bars / Pure Honey Thumbnails */}
            <div
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                justifyContent: 'flex-end',
              }}
            >
              {/* Prev Arrow */}
              {heroVideos.length > 3 && (
                <button
                  onClick={handlePrev}
                  style={{
                    width: '30px',
                    height: '50px',
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
                        height: '46px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: isActive ? '2px solid #F59E0B' : '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: isActive ? '0 0 14px rgba(245, 158, 11, 0.65)' : 'none',
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
                            width: '13px',
                            height: '13px',
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
              <button
                onClick={handleNext}
                style={{
                  width: '30px',
                  height: '50px',
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
            </div>
          </div>
        </div>
      </div>

      {/* 4. Fullscreen Video Modal */}
      <VideoModal
        video={selectedModalVideo}
        onClose={() => setSelectedModalVideo(null)}
      />

      {/* Keyframe Animations */}
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
            min-height: 92vh !important;
            height: auto !important;
            padding-top: 5rem !important;
          }

          #hero-content-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }

          #hero-left-gradient {
            background: linear-gradient(180deg, rgba(12, 10, 8, 0.7) 0%, rgba(12, 10, 8, 0.9) 70%, #181511 100%) !important;
          }
        }

        @media (max-width: 640px) {
          #ott-hero-section {
            min-height: 95vh !important;
            padding-bottom: 2rem !important;
          }

          #hero-thumbnail-strip {
            justify-content: flex-start !important;
          }
        }
      `}</style>
    </section>
  );
};
