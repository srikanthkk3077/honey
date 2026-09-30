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
  Award,
  ShieldCheck,
  ShoppingBag,
  ArrowRight,
  Check,
  Flame
} from 'lucide-react';
import { useStore } from '../../../store/store';
import { VideoModal } from '../video/VideoModal';
import { VideoItem } from '../../../types/video.types';
import confetti from 'canvas-confetti';

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

  // Fallback videos if store is empty
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
      videoRef.current.play().catch(() => {
        // Autoplay may be restricted if unmuted; handled gracefully
      });
    }

    // Scroll active thumbnail into view
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

  // Find tagged product in current video
  const taggedProduct = currentVideo?.taggedProductId
    ? products.find((p) => p.id === currentVideo.taggedProductId)
    : products[0];

  // Handle Quick Add to Cart from the OTT hero
  const handleQuickAdd = () => {
    if (taggedProduct) {
      const sizeToAdd = taggedProduct.selectedSize || (taggedProduct.sizes?.[0]?.size ?? '500g');
      addToCart(taggedProduct, sizeToAdd, 1);
      setAddedAnimation(true);
      setTimeout(() => setAddedAnimation(false), 1800);

      // Trigger celebratory golden confetti
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#F59E0B', '#D97706', '#FEF3C7', '#10B981']
        });
      } catch {
        // optional confetti
      }
    }
  };

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '88vh',
        height: '90vh',
        maxHeight: '920px',
        backgroundColor: '#0F0C09',
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
      {/* 1. Full-Length Seamless Background Video */}
      {currentVideo && (
        <video
          key={currentVideo.videoUrl}
          ref={videoRef}
          src={currentVideo.videoUrl}
          poster={currentVideo.thumbnailUrl}
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
            transition: 'opacity 0.6s ease-in-out',
            opacity: isVideoLoading ? 0.85 : 1,
          }}
        />
      )}

      {/* Video Poster Fallback Image while loading */}
      {currentVideo && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${currentVideo.thumbnailUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0,
          }}
        />
      )}

      {/* 2. Deep Cinematic Gradient Overlays for Razor-Sharp Text Readability */}
      {/* Left to right dark vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, rgba(8, 7, 5, 0.98) 0%, rgba(8, 7, 5, 0.88) 32%, rgba(8, 7, 5, 0.55) 60%, rgba(8, 7, 5, 0.15) 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
        id="hero-left-gradient"
      />

      {/* Bottom to top transition gradient */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '240px',
          background: 'linear-gradient(0deg, #181511 0%, rgba(24, 21, 17, 0.85) 35%, transparent 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* Top subtle vignette for header seamlessness */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '120px',
          background: 'linear-gradient(180deg, rgba(8, 7, 5, 0.75) 0%, transparent 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* 3. Main OTT Content Grid (Left: Show Meta & CTAs, Right: Thumbnails & Audio) */}
      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 3,
          paddingTop: '2.5rem',
          paddingBottom: '3rem',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(320px, 1.35fr) minmax(280px, 1fr)',
            alignItems: 'flex-end',
            gap: '2.5rem',
          }}
          id="hero-content-grid"
        >
          {/* ==============================================================
              LEFT COLUMN: Brand Emblem, Highlights, Title, Synopsis, CTAs
              ============================================================== */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {/* Top Brand Logo / Emblem */}
            <div className="flex items-center gap-3">
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  backdropFilter: 'blur(12px)',
                  padding: '6px 14px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #FEF3C7 0%, #F59E0B 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img src="/icons/bee.svg" alt="Madhuvan Bee" width="18" height="18" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontWeight: 900,
                      fontSize: '1.05rem',
                      letterSpacing: '0.08em',
                      color: '#FBBF24',
                      lineHeight: 1,
                    }}
                  >
                    MADHUVAN
                  </span>
                  <span
                    style={{
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      letterSpacing: '0.18em',
                      color: '#FEF3C7',
                      textTransform: 'uppercase',
                    }}
                  >
                    Artisanal Raw Forest Honey
                  </span>
                </div>
              </div>

              {/* Live Reel Indicator */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.5)',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#FCA5A5',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#EF4444',
                    display: 'inline-block',
                    animation: 'pulse 1.5s infinite',
                  }}
                />
                Apiary Reel
              </div>
            </div>

            {/* Sponsor-Style Brand Trust Badges Strip (matching Bigg Boss sponsors) */}
            <div
              className="flex items-center gap-2 flex-wrap"
              style={{
                marginTop: '0.2rem',
              }}
            >
              {[
                { label: '100% Wild Forest', icon: <Sparkles size={12} color="#F59E0B" /> },
                { label: 'NMR Lab Certified', icon: <ShieldCheck size={12} color="#10B981" /> },
                { label: 'Zero Added Sugar', icon: <Award size={12} color="#38BDF8" /> },
                { label: 'Cold Extracted < 30°C', icon: <Flame size={12} color="#F97316" /> },
              ].map((badge, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(6px)',
                    padding: '3px 9px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: '#E7E5E4',
                  }}
                >
                  {badge.icon}
                  <span>{badge.label}</span>
                </div>
              ))}
            </div>

            {/* Accent Cyan Highlight Line (Matching "New Episode Daily • New Season") */}
            <div
              className="flex items-center gap-2"
              style={{
                color: '#38BDF8',
                fontWeight: 700,
                fontSize: '0.92rem',
                letterSpacing: '0.02em',
                marginTop: '0.15rem',
              }}
            >
              <span>Fresh 2026 Harvest</span>
              <span>•</span>
              <span style={{ color: '#FBBF24' }}>Deep Sundarbans & Kashmir Valleys</span>
              <span>•</span>
              <span>Single-Origin Reserve</span>
            </div>

            {/* Metadata Line (Matching "2026 • U/A 16+ • Telugu") */}
            <div
              className="flex items-center gap-3 text-light"
              style={{
                fontSize: '0.86rem',
                color: '#A8A29E',
                fontWeight: 500,
              }}
            >
              <span style={{ fontWeight: 700, color: '#FFFFFF' }}>2026</span>
              <span>•</span>
              <span
                style={{
                  background: 'rgba(245, 158, 11, 0.2)',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  color: '#FBBF24',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                }}
              >
                NMR GRADE A+
              </span>
              <span>•</span>
              <span>Ethical Honey Hunting</span>
              <span>•</span>
              <span>Live Enzymes Active</span>
            </div>

            {/* Grand Video Story Title */}
            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.85rem, 3.4vw, 3.1rem)',
                lineHeight: 1.15,
                fontWeight: 800,
                color: '#FFFFFF',
                margin: '0.2rem 0',
                textShadow: '0 4px 20px rgba(0,0,0,0.7)',
                maxWidth: '680px',
              }}
            >
              {currentVideo?.title || 'Taste the Liquid Gold of Virgin Forests'}
            </h1>

            {/* Story Synopsis */}
            <p
              style={{
                fontSize: '0.98rem',
                color: '#D6D3D1',
                lineHeight: 1.6,
                margin: 0,
                maxWidth: '580px',
                textShadow: '0 2px 8px rgba(0,0,0,0.6)',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {currentVideo?.description ||
                '100% Raw, unheated, and unpasteurized honey ethically gathered from giant wild bees in protected biosphere reserves. Packed with live enzymes, propolis, and unheated flower pollen.'}
            </p>

            {/* Genre / Tag Badges (Matching "Reality | Celebrities | Competition | Games") */}
            <div
              style={{
                fontSize: '0.84rem',
                color: '#A8A29E',
                fontWeight: 500,
                marginTop: '0.1rem',
              }}
            >
              <span style={{ color: '#E7E5E4' }}>Wild Comb Nectar</span>
              <span style={{ margin: '0 8px', color: '#57534E' }}>|</span>
              <span style={{ color: '#E7E5E4' }}>Unpasteurized</span>
              <span style={{ margin: '0 8px', color: '#57534E' }}>|</span>
              <span style={{ color: '#E7E5E4' }}>Cold Centrifuged</span>
              <span style={{ margin: '0 8px', color: '#57534E' }}>|</span>
              <span style={{ color: '#FBBF24', fontWeight: 600 }}>Ayurvedic Rasayana</span>
            </div>

            {/* CTA Action Buttons (Matching Screenshot "Watch Now" + "+" Button) */}
            <div
              className="flex items-center gap-3 flex-wrap"
              style={{ marginTop: '0.75rem' }}
            >
              {/* Primary Glowing CTA Button: Watch Story / Buy */}
              <button
                onClick={() => setSelectedModalVideo(currentVideo)}
                style={{
                  background: 'linear-gradient(135deg, #0284C7 0%, #7C3AED 50%, #C026D3 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '13px 26px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '1rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  boxShadow: '0 8px 30px rgba(124, 58, 237, 0.45)',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 12px 35px rgba(192, 38, 211, 0.6)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(124, 58, 237, 0.45)';
                }}
                id="hero-watch-story-btn"
              >
                <Play size={20} fill="#FFFFFF" />
                <span>Watch Story in HD</span>
              </button>

              {/* Secondary Frosted Glass Button: "+" Quick Add to Basket */}
              <button
                onClick={handleQuickAdd}
                title={`Quick Order ${taggedProduct?.name || 'Honey'}`}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: addedAnimation ? '#059669' : 'rgba(255, 255, 255, 0.18)',
                  backdropFilter: 'blur(12px)',
                  border: addedAnimation ? '1px solid #10B981' : '1px solid rgba(255, 255, 255, 0.28)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                }}
                onMouseOver={(e) => {
                  if (!addedAnimation) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!addedAnimation) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
                id="hero-quick-add-btn"
              >
                {addedAnimation ? <Check size={22} color="#FFFFFF" /> : <Plus size={24} />}
              </button>

              {/* Tertiary Link: Explore Honey Vault */}
              <Link
                to="/shop"
                style={{
                  background: 'rgba(245, 158, 11, 0.12)',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  backdropFilter: 'blur(10px)',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  color: '#FBBF24',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(245, 158, 11, 0.25)';
                  e.currentTarget.style.borderColor = '#F59E0B';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(245, 158, 11, 0.12)';
                  e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.35)';
                }}
              >
                <ShoppingBag size={18} />
                <span>Shop This Honey ({taggedProduct ? `₹${taggedProduct.price}` : '₹649'})</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* ==============================================================
              RIGHT COLUMN: Sound Toggle & Horizontal Thumbnails Reel Strip
              ============================================================== */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '1.25rem',
            }}
          >
            {/* Audio Toggle Button (matching speaker icon on right in screenshot) */}
            <button
              onClick={toggleSound}
              style={{
                width: '42px',
                height: '42px',
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
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(245, 158, 11, 0.3)';
                e.currentTarget.style.borderColor = '#F59E0B';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.55)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
              }}
              title={isMuted ? 'Unmute Ambient Sound' : 'Mute Sound'}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} color="#FBBF24" />}
            </button>

            {/* Horizontal Video Carousel Thumbnails (matching bottom-right strip in screenshot) */}
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
                    width: '32px',
                    height: '56px',
                    borderRadius: '8px',
                    background: 'rgba(0, 0, 0, 0.65)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
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
                  <ChevronLeft size={18} />
                </button>
              )}

              {/* Thumbnails Row */}
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
                  return (
                    <div
                      key={video.id}
                      onClick={() => setCurrentIndex(idx)}
                      style={{
                        position: 'relative',
                        width: '78px',
                        height: '48px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: isActive ? '2px solid #F59E0B' : '1px solid rgba(255, 255, 255, 0.25)',
                        boxShadow: isActive ? '0 0 16px rgba(245, 158, 11, 0.7)' : '0 4px 10px rgba(0,0,0,0.4)',
                        transform: isActive ? 'scale(1.08)' : 'scale(1)',
                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        flexShrink: 0,
                      }}
                      onMouseOver={(e) => {
                        if (!isActive) e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.7)';
                      }}
                      onMouseOut={(e) => {
                        if (!isActive) e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                      }}
                      title={video.title}
                    >
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          filter: isActive ? 'brightness(1)' : 'brightness(0.7)',
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
                            top: '4px',
                            right: '4px',
                            width: '14px',
                            height: '14px',
                            borderRadius: '50%',
                            background: '#D97706',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Play size={8} fill="#FFFFFF" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Next Arrow (matching the right chevron in screenshot) */}
              <button
                onClick={handleNext}
                style={{
                  width: '32px',
                  height: '56px',
                  borderRadius: '8px',
                  background: 'rgba(0, 0, 0, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
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
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Fullscreen Video Modal for Customer Watching */}
      <VideoModal
        video={selectedModalVideo}
        onClose={() => setSelectedModalVideo(null)}
      />

      {/* Responsive Styles and Keyframe Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.9); }
        }

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
            background: linear-gradient(180deg, rgba(8, 7, 5, 0.8) 0%, rgba(8, 7, 5, 0.95) 70%, #181511 100%) !important;
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
