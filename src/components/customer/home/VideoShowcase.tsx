import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../../store/store';
import { VideoModal } from '../video/VideoModal';
import { VideoItem } from '../../../types/video.types';
import { Play, Film, ChevronLeft, ChevronRight, Volume2, ShoppingBag, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VideoCardShimmer } from '../../common/Shimmer';
import { formatPrice } from '../../../utils/formatPrice';

export const VideoShowcase: React.FC = () => {
  const { videos, isVideosLoading, products } = useStore();
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const featuredVideos = videos.filter((v) => v.featuredOnHome !== false);
  const displayVideos = featuredVideos.length > 0 ? featuredVideos : videos;

  // Track scroll position to update arrow states
  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 15);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 15);
  };

  useEffect(() => {
    checkScroll();
    const scroller = scrollRef.current;
    if (scroller) {
      scroller.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (scroller) scroller.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [displayVideos.length]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 320;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // If not loading and no videos are present, gracefully hide section
  if (!isVideosLoading && displayVideos.length === 0) {
    return null;
  }

  return (
    <section
      style={{
        padding: '5.5rem 0',
        background: 'linear-gradient(180deg, #FAF7F2 0%, #FFFBEB 35%, #FEF3C7 70%, #FAF7F2 100%)',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(245, 158, 11, 0.15)',
        borderBottom: '1px solid rgba(245, 158, 11, 0.15)',
      }}
    >
      {/* Subtle Golden Ambient Watermark / Aura */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          right: '5%',
          width: '550px',
          height: '550px',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, rgba(254, 243, 199, 0) 70%)',
          pointerEvents: 'none',
          borderRadius: '50%',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '5%',
          width: '450px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(217, 119, 6, 0.1) 0%, rgba(254, 243, 199, 0) 70%)',
          pointerEvents: 'none',
          borderRadius: '50%',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Header with Title and Scroll Arrows */}
        <div
          className="flex items-end justify-between flex-wrap gap-4"
          style={{ marginBottom: '2.5rem' }}
        >
          <div>
            {/* Unique Eyebrow Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '0.75rem',
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #FDE68A',
                padding: '5px 12px',
                borderRadius: '20px',
                boxShadow: '0 2px 8px rgba(217, 119, 6, 0.08)',
              }}
            >
              <Sparkles size={14} color="#D97706" />
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: '#92400E',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Madhuvan Apiary In Motion
              </span>
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#D97706',
                  animation: 'reelDotPulse 1.5s infinite',
                }}
              />
            </div>

            <h2
              style={{
                fontSize: 'clamp(2rem, 3.2vw, 2.6rem)',
                color: '#1C1917',
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 700,
                margin: '0 0 0.5rem 0',
                letterSpacing: '-0.01em',
              }}
            >
              Live Harvest Stories & Purity Reels
            </h2>

            <p style={{ color: '#57534E', fontSize: '1rem', maxWidth: '600px', margin: 0, lineHeight: 1.6 }}>
              Watch unheated raw extraction in action from our Himalayan &amp; Sundarbans apiaries. Tap any reel to watch in HD with sound and shop directly.
            </p>
          </div>

          {/* Action Links & Navigation Arrows */}
          <div className="flex items-center gap-3">
            <Link
              to="/videos"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#92400E',
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #FDE68A',
                padding: '0.55rem 1.15rem',
                borderRadius: '14px',
                fontWeight: 700,
                fontSize: '0.88rem',
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(217, 119, 6, 0.08)',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#FEF3C7';
                e.currentTarget.style.borderColor = '#D97706';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.borderColor = '#FDE68A';
              }}
            >
              <Film size={16} color="#D97706" />
              <span>Watch All Stories ({videos.length})</span>
            </Link>

            {/* Previous Reel Button */}
            <button
              type="button"
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: canScrollLeft ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)',
                border: canScrollLeft ? '2px solid #FDE68A' : '2px solid #E7E5E4',
                color: canScrollLeft ? '#92400E' : '#A8A29E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: canScrollLeft ? 'pointer' : 'default',
                boxShadow: canScrollLeft ? '0 4px 14px rgba(217, 119, 6, 0.12)' : 'none',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                if (canScrollLeft) {
                  e.currentTarget.style.backgroundColor = '#D97706';
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.borderColor = '#D97706';
                  e.currentTarget.style.transform = 'scale(1.06)';
                }
              }}
              onMouseOut={(e) => {
                if (canScrollLeft) {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.color = '#92400E';
                  e.currentTarget.style.borderColor = '#FDE68A';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
              aria-label="Scroll Left"
            >
              <ChevronLeft size={22} />
            </button>

            {/* Next Reel Button */}
            <button
              type="button"
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: canScrollRight ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)',
                border: canScrollRight ? '2px solid #FDE68A' : '2px solid #E7E5E4',
                color: canScrollRight ? '#92400E' : '#A8A29E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: canScrollRight ? 'pointer' : 'default',
                boxShadow: canScrollRight ? '0 4px 14px rgba(217, 119, 6, 0.12)' : 'none',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                if (canScrollRight) {
                  e.currentTarget.style.backgroundColor = '#D97706';
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.borderColor = '#D97706';
                  e.currentTarget.style.transform = 'scale(1.06)';
                }
              }}
              onMouseOut={(e) => {
                if (canScrollRight) {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.color = '#92400E';
                  e.currentTarget.style.borderColor = '#FDE68A';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
              aria-label="Scroll Right"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>

        {/* Horizontal Scrollable Video Reels Row */}
        {isVideosLoading && displayVideos.length === 0 ? (
          <div className="flex gap-5" style={{ overflowX: 'hidden' }}>
            <VideoCardShimmer count={4} />
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="video-reels-scroll-track"
            style={{
              display: 'flex',
              gap: '1.35rem',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              padding: '0.75rem 0.25rem 2rem 0.25rem',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {displayVideos.map((video) => {
              const matchedProd = video.taggedProductId
                ? products.find((p) => p.id === video.taggedProductId || (p as any)._id === video.taggedProductId)
                : video.taggedProductSlug
                ? products.find((p) => p.slug === video.taggedProductSlug)
                : undefined;

              const prodName = matchedProd?.name || video.taggedProductName || 'Wild Forest Raw Honey';
              const prodPrice = matchedProd?.price || video.taggedProductPrice || 498;
              const prodOrigPrice = matchedProd?.originalPrice || video.taggedProductOriginalPrice || 650;
              const prodImage = matchedProd?.images?.[0] || video.taggedProductImage || video.thumbnailUrl;

              return (
                <div
                  key={video.id}
                  onClick={() => setSelectedVideo(video)}
                  className="artisanal-reel-card"
                  style={{
                    flex: '0 0 255px',
                    width: '255px',
                    aspectRatio: '9/16',
                    position: 'relative',
                    borderRadius: '26px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    scrollSnapAlign: 'start',
                    boxShadow: '0 12px 30px rgba(180, 83, 9, 0.12), 0 4px 10px rgba(0, 0, 0, 0.04)',
                    border: '3.5px solid #FFFFFF',
                    outline: '1.5px solid rgba(245, 158, 11, 0.35)',
                    backgroundColor: '#FAF7F2',
                    transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                    e.currentTarget.style.outlineColor = '#D97706';
                    e.currentTarget.style.boxShadow =
                      '0 22px 45px rgba(217, 119, 6, 0.26), 0 8px 18px rgba(0, 0, 0, 0.08)';
                    const vidEl = e.currentTarget.querySelector('video');
                    if (vidEl && vidEl.paused) {
                      vidEl.play().catch(() => {});
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.outlineColor = 'rgba(245, 158, 11, 0.35)';
                    e.currentTarget.style.boxShadow =
                      '0 12px 30px rgba(180, 83, 9, 0.12), 0 4px 10px rgba(0, 0, 0, 0.04)';
                  }}
                >
                  {/* Background Video Element (Auto-plays muted) */}
                  <video
                    src={video.videoUrl}
                    poster={video.thumbnailUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />

                  {/* Gentle Cinematic Gradient Overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.65) 100%)',
                      pointerEvents: 'none',
                    }}
                  />

                  {/* Top Header: Floating Frosted Badges */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      right: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      zIndex: 3,
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        backdropFilter: 'blur(8px)',
                        color: '#FFFFFF',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        padding: '4px 9px',
                        borderRadius: '20px',
                        letterSpacing: '0.04em',
                        border: '1px solid rgba(255, 255, 255, 0.25)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                      }}
                    >
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: '#F59E0B',
                        }}
                      />
                      {video.category}
                    </span>

                    <span
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        backdropFilter: 'blur(8px)',
                        color: '#FFFFFF',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        padding: '4px 8px',
                        borderRadius: '20px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Volume2 size={12} />
                    </span>
                  </div>

                  {/* Elegant Frosted Center Play Pill (Subtle on hover, never blocking) */}
                 

                  {/* Floating Shoppable Product Card (Artisanal White & Gold) */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      left: '10px',
                      right: '10px',
                      zIndex: 4,
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(14px)',
                      borderRadius: '18px',
                      padding: '8px 10px',
                      border: '1.5px solid #FEF3C7',
                      boxShadow: '0 8px 24px rgba(28, 25, 23, 0.16)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    {/* Small Product Thumbnail */}
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        backgroundColor: '#FAF7F2',
                        flexShrink: 0,
                        border: '1.5px solid #FDE68A',
                      }}
                    >
                      <img
                        src={prodImage}
                        alt={prodName}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>

                    {/* Product Name & Pricing */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '0.82rem',
                          fontWeight: 800,
                          color: '#1C1917',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          lineHeight: 1.25,
                        }}
                      >
                        {prodName}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
                        <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#B45309' }}>
                          {formatPrice(prodPrice)}
                        </span>
                        {prodOrigPrice > prodPrice && (
                          <span
                            style={{
                              fontSize: '0.72rem',
                              color: '#A8A29E',
                              textDecoration: 'line-through',
                              fontWeight: 500,
                            }}
                          >
                            {formatPrice(prodOrigPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Shop Button Pill */}
                    <div
                      style={{
                        padding: '6px 10px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: '#FFFFFF',
                        flexShrink: 0,
                        boxShadow: '0 2px 8px rgba(217, 119, 6, 0.35)',
                      }}
                    >
                      <ShoppingBag size={12} />
                      <span style={{ fontSize: '0.72rem', fontWeight: 800 }}>Shop</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Shoppable Video Reel Modal */}
      <VideoModal
        video={selectedVideo}
        videoList={displayVideos}
        onClose={() => setSelectedVideo(null)}
        onSelectVideo={(v) => setSelectedVideo(v)}
      />

      <style>{`
        .video-reels-scroll-track::-webkit-scrollbar {
          display: none;
        }
        @keyframes reelDotPulse {
          0%, 100% { transform: scale(0.9); opacity: 0.6; }
          50% { transform: scale(1.3); opacity: 1; }
        }
      `}</style>
    </section>
  );
};

export default VideoShowcase;
