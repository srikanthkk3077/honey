import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../../store/store';
import { SectionTitle } from '../../common/SectionTitle';
import { VideoModal } from '../video/VideoModal';
import { VideoItem } from '../../../types/video.types';
import { Play, Eye, Clock, Film, ChevronLeft, ChevronRight, Volume2, Sparkles, ShoppingBag } from 'lucide-react';
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
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
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
    const scrollAmount = 300;
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
        backgroundColor: '#14110E',
        color: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Golden Nectar Glow Accent */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          right: '5%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(217, 119, 6, 0.12) 0%, rgba(20, 17, 14, 0) 70%)',
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
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '0.75rem' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#F59E0B',
                  boxShadow: '0 0 10px #F59E0B',
                  animation: 'pulse 1.8s infinite',
                }}
              />
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: '#F59E0B',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                }}
              >
                Live Apiary Reels & Shorts
              </span>
            </div>

            <h2
              style={{
                fontSize: 'clamp(2rem, 3.5vw, 2.5rem)',
                color: '#FFFFFF',
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 700,
                margin: '0 0 0.5rem 0',
              }}
            >
              Watch Raw Harvest Stories
            </h2>

            <p style={{ color: '#A8A29E', fontSize: '0.98rem', maxWidth: '580px', margin: 0, lineHeight: 1.6 }}>
              Scroll through our authentic short videos. Watch unheated raw extraction in action and shop the featured honey in one tap.
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
                color: '#FBBF24',
                fontWeight: 700,
                fontSize: '0.92rem',
                marginRight: '0.75rem',
                textDecoration: 'none',
              }}
            >
              <Film size={18} />
              <span>All Videos ({videos.length})</span>
            </Link>

            {/* Previous Reel Button */}
            <button
              type="button"
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: canScrollLeft ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                border: '1.5px solid rgba(245, 158, 11, 0.35)',
                color: canScrollLeft ? '#FFFFFF' : '#78716C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: canScrollLeft ? 'pointer' : 'default',
                transition: 'all 0.2s',
                backdropFilter: 'blur(8px)',
              }}
              onMouseOver={(e) => {
                if (canScrollLeft) {
                  e.currentTarget.style.backgroundColor = '#D97706';
                  e.currentTarget.style.borderColor = '#D97706';
                }
              }}
              onMouseOut={(e) => {
                if (canScrollLeft) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.35)';
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
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: canScrollRight ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                border: '1.5px solid rgba(245, 158, 11, 0.35)',
                color: canScrollRight ? '#FFFFFF' : '#78716C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: canScrollRight ? 'pointer' : 'default',
                transition: 'all 0.2s',
                backdropFilter: 'blur(8px)',
              }}
              onMouseOver={(e) => {
                if (canScrollRight) {
                  e.currentTarget.style.backgroundColor = '#D97706';
                  e.currentTarget.style.borderColor = '#D97706';
                }
              }}
              onMouseOut={(e) => {
                if (canScrollRight) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.35)';
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
              gap: '1.25rem',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              paddingBottom: '1rem',
              paddingTop: '0.5rem',
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
                  className="short-video-reel-card"
                  style={{
                    flex: '0 0 250px',
                    width: '250px',
                    aspectRatio: '9/16',
                    position: 'relative',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    scrollSnapAlign: 'start',
                    boxShadow: '0 12px 35px rgba(0, 0, 0, 0.55)',
                    border: '1.5px solid rgba(245, 158, 11, 0.25)',
                    backgroundColor: '#1C1917',
                    transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                    e.currentTarget.style.borderColor = '#F59E0B';
                    e.currentTarget.style.boxShadow = '0 20px 45px rgba(217, 119, 6, 0.35)';
                    const vidEl = e.currentTarget.querySelector('video');
                    if (vidEl && vidEl.paused) {
                      vidEl.play().catch(() => {});
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.25)';
                    e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.55)';
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

                  {/* Gradient Lighting Overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.85) 100%)',
                      pointerEvents: 'none',
                    }}
                  />

                  {/* Top Header: Category Pill & Audio Status */}
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
                        backgroundColor: 'rgba(217, 119, 6, 0.9)',
                        backdropFilter: 'blur(6px)',
                        color: '#FFFFFF',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {video.category}
                    </span>

                    <span
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.65)',
                        backdropFilter: 'blur(6px)',
                        color: '#FFFFFF',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Clock size={11} /> {video.duration}
                    </span>
                  </div>

                  {/* Subtle Center Play Icon Ring */}
                  <div
                    className="center-play-button"
                    style={{
                      position: 'absolute',
                      top: '42%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(245, 158, 11, 0.85)',
                      backdropFilter: 'blur(8px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      boxShadow: '0 0 25px rgba(245, 158, 11, 0.5)',
                      zIndex: 2,
                      opacity: 0.9,
                      transition: 'transform 0.2s, opacity 0.2s',
                    }}
                  >
                    <Play size={20} fill="#FFFFFF" style={{ marginLeft: '2px' }} />
                  </div>

                  {/* Floating Shoppable Product Card at the bottom */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '10px',
                      right: '10px',
                      zIndex: 3,
                      backgroundColor: 'rgba(24, 21, 17, 0.9)',
                      backdropFilter: 'blur(12px)',
                      borderRadius: '16px',
                      padding: '8px 10px',
                      border: '1px solid rgba(245, 158, 11, 0.35)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    {/* Small Product Thumbnail */}
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        backgroundColor: '#FAF7F2',
                        flexShrink: 0,
                        border: '1px solid rgba(255, 255, 255, 0.2)',
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
                          fontWeight: 700,
                          color: '#FFFFFF',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          lineHeight: 1.2,
                        }}
                      >
                        {prodName}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FBBF24' }}>
                          {formatPrice(prodPrice)}
                        </span>
                        {prodOrigPrice > prodPrice && (
                          <span
                            style={{
                              fontSize: '0.7rem',
                              color: '#A8A29E',
                              textDecoration: 'line-through',
                            }}
                          >
                            {formatPrice(prodOrigPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Shop Bag Icon Pill */}
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: '#D97706',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                        flexShrink: 0,
                        boxShadow: '0 2px 8px rgba(217, 119, 6, 0.4)',
                      }}
                    >
                      <ShoppingBag size={14} />
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
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </section>
  );
};

export default VideoShowcase;
