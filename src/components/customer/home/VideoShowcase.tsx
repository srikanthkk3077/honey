import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useStore } from '../../../store/store';
import { VideoModal } from '../video/VideoModal';
import { VideoItem } from '../../../types/video.types';
import { ChevronLeft, ChevronRight, ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VideoCardShimmer } from '../../common/Shimmer';

// Fallback metadata matching Image 2 exactly
const FALLBACK_METADATA = [
  {
    title: 'Forest Honey Collection',
    duration: '', // No duration badge on tall card in Image 2
    fallbackPoster:
      'https://images.unsplash.com/photo-1473081556163-2a17de81fc97?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Beehive Care',
    duration: '1:12',
    fallbackPoster:
      'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Apiary Life',
    duration: '1:08',
    fallbackPoster:
      'https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Honey Extraction',
    duration: '0:52',
    fallbackPoster:
      'https://images.unsplash.com/photo-1587049352851-8d4e8913390a?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Packaging',
    duration: '0:46',
    fallbackPoster:
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80',
  },
];

const getDisplayTitle = (video: VideoItem, index: number): string => {
  const isGeneric =
    !video.title ||
    video.title.startsWith('WhatsApp Video') ||
    video.title.startsWith('f171e230') ||
    /^[0-9a-f-]{8,}/i.test(video.title);

  if (!isGeneric && video.title.trim().length > 0) {
    return video.title;
  }
  return FALLBACK_METADATA[index % FALLBACK_METADATA.length].title;
};

const getDisplayDuration = (video: VideoItem, index: number, isTall: boolean): string => {
  if (isTall) return ''; // Tall card in Image 2 has no duration badge
  if (video.duration && video.duration !== '0:45' && video.duration !== '0:00') {
    return video.duration;
  }
  return FALLBACK_METADATA[index % FALLBACK_METADATA.length].duration;
};

// Cute cartoon bumblebee vector icon matching Image 2
const ApiaryBeeIcon: React.FC<{ size?: number }> = ({ size = 46 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 54 54"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ flexShrink: 0 }}
    aria-hidden="true"
  >
    {/* Back Wing */}
    <ellipse
      cx="21"
      cy="13"
      rx="7"
      ry="12"
      transform="rotate(-25 21 13)"
      fill="#EBF8FF"
      stroke="#1C1917"
      strokeWidth="2.2"
    />
    {/* Front Wing */}
    <ellipse
      cx="29"
      cy="11"
      rx="7"
      ry="12"
      transform="rotate(15 29 11)"
      fill="#FFFFFF"
      stroke="#1C1917"
      strokeWidth="2.2"
    />
    {/* Honey Bee Body */}
    <ellipse
      cx="27"
      cy="31"
      rx="17"
      ry="13"
      fill="#F59E0B"
      stroke="#1C1917"
      strokeWidth="2.2"
    />
    {/* Body Stripes */}
    <path
      d="M21 18.5 C21 18.5 19.5 31 21 43.5 C23 43.8 25 43.8 26.5 43.5 C25 31 26.5 18.5 26.5 18.5 Z"
      fill="#1C1917"
    />
    <path
      d="M32 19 C32 19 30.5 31 32 43 C33.8 42.5 35.5 41.5 37 40 C35.5 30 37 20 37 20 Z"
      fill="#1C1917"
    />
    {/* Stinger */}
    <path d="M43 31 L48 30 L43 33 Z" fill="#1C1917" />
    {/* Bee Head */}
    <circle
      cx="14"
      cy="30"
      r="8.5"
      fill="#F59E0B"
      stroke="#1C1917"
      strokeWidth="2.2"
    />
    {/* Bee Eye */}
    <circle cx="11.5" cy="28" r="2.2" fill="#1C1917" />
    <circle cx="10.8" cy="27.3" r="0.7" fill="#FFFFFF" />
    {/* Bee Smile */}
    <path
      d="M10 33 Q13 36 15 33"
      stroke="#1C1917"
      strokeWidth="1.8"
      strokeLinecap="round"
      fill="none"
    />
    {/* Antenna Left */}
    <path
      d="M12 22 Q10 16 6 17"
      stroke="#1C1917"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    <circle cx="6" cy="17" r="1.8" fill="#1C1917" />
    {/* Antenna Right */}
    <path
      d="M16 22 Q16 15 13 14"
      stroke="#1C1917"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    <circle cx="13" cy="14" r="1.8" fill="#1C1917" />
  </svg>
);

interface ApiaryVideoCardProps {
  video: VideoItem;
  index: number;
  isTall: boolean;
  onSelect: (video: VideoItem) => void;
}

const ApiaryVideoCard: React.FC<ApiaryVideoCardProps> = ({
  video,
  index,
  isTall,
  onSelect,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const title = getDisplayTitle(video, index);
  const duration = getDisplayDuration(video, index, isTall);
  const fallbackPoster = FALLBACK_METADATA[index % FALLBACK_METADATA.length].fallbackPoster;

  // Autoplay videos automatically on mount and whenever videoUrl changes
  useEffect(() => {
    const vid = videoRef.current;
    if (vid) {
      vid.defaultMuted = true;
      vid.muted = true;
      vid.play().catch(() => {
        // Browsers permit muted autoplay
      });
    }
  }, [video.videoUrl]);

  const handleMouseEnter = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'translateY(-4px)';
      cardRef.current.style.boxShadow = '0 16px 36px rgba(0, 0, 0, 0.24)';
    }
    const playBtn = cardRef.current?.querySelector('.play-btn-circle') as HTMLElement | null;
    if (playBtn) {
      playBtn.style.transform = 'scale(1.12)';
      playBtn.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.45)';
    }
    if (videoRef.current && videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'translateY(0)';
      cardRef.current.style.boxShadow = '0 4px 18px rgba(0, 0, 0, 0.1)';
    }
    const playBtn = cardRef.current?.querySelector('.play-btn-circle') as HTMLElement | null;
    if (playBtn) {
      playBtn.style.transform = 'scale(1)';
      playBtn.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.35)';
    }
  };

  return (
    <div
      ref={cardRef}
      className={`apiary-video-card ${isTall ? 'apiary-card-tall' : 'apiary-card-landscape'}`}
      onClick={() => onSelect(video)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: 0,
        borderRadius: isTall ? '20px' : '18px',
        overflow: 'hidden',
        backgroundColor: '#1C1917',
        cursor: 'pointer',
        boxShadow: '0 4px 18px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.28s ease',
        userSelect: 'none',
      }}
    >
      {/* Video Element with Autoplay, Muted, Loop */}
      <video
        ref={videoRef}
        src={video.videoUrl}
        poster={video.thumbnailUrl || fallbackPoster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          transition: 'transform 0.4s ease',
        }}
      />

      {/* Dark Vignette Overlay for Crisp Legibility */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isTall
            ? 'linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.3) 45%, rgba(0, 0, 0, 0.05) 100%)'
            : 'linear-gradient(to top, rgba(0, 0, 0, 0.82) 0%, rgba(0, 0, 0, 0.25) 50%, rgba(0, 0, 0, 0.05) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Centered Circular White Play Button with Solid Black Play Icon */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      >
        <div
          className="play-btn-circle"
          style={{
            width: isTall ? '52px' : '46px',
            height: isTall ? '52px' : '46px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.35)',
            transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease',
          }}
        >
          <Play
            size={isTall ? 20 : 18}
            fill="#1C1917"
            stroke="none"
            style={{ transform: 'translateX(1.5px)' }}
          />
        </div>
      </div>

      {/* Bottom Left Title */}
      <div
        style={{
          position: 'absolute',
          bottom: isTall ? '18px' : '14px',
          left: isTall ? '18px' : '14px',
          right: duration ? '68px' : '16px',
          zIndex: 3,
          pointerEvents: 'none',
        }}
      >
        <h3
          style={{
            color: '#FFFFFF',
            margin: 0,
            fontSize: isTall ? '1.12rem' : '0.96rem',
            fontWeight: 700,
            lineHeight: 1.25,
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.9)',
            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: isTall ? 'normal' : 'nowrap',
            display: isTall ? '-webkit-box' : 'block',
            WebkitLineClamp: isTall ? 2 : undefined,
            WebkitBoxOrient: isTall ? 'vertical' : undefined,
          }}
        >
          {title}
        </h3>
      </div>

      {/* Bottom Right Duration Badge (shown on landscape cards) */}
      {duration && (
        <div
          style={{
            position: 'absolute',
            bottom: isTall ? '18px' : '14px',
            right: isTall ? '18px' : '14px',
            zIndex: 3,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.72)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              color: '#FFFFFF',
              fontSize: '0.78rem',
              fontWeight: 600,
              padding: '3px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              letterSpacing: '0.02em',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {duration}
          </div>
        </div>
      )}
    </div>
  );
};

// Chunk helper to divide videos into 5-video bento grid pages
function chunkArray<T>(items: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size));
  }
  return result;
}

export const VideoShowcase: React.FC = () => {
  const { videos, isVideosLoading } = useStore();
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const featuredVideos = videos.filter((v) => v.featuredOnHome !== false);
  const displayVideos = featuredVideos.length > 0 ? featuredVideos : videos;

  // Group videos into 5-video bento batches
  const pages = chunkArray(displayVideos, 5);

  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 20);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 20);
  }, []);

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
  }, [pages.length, checkScroll]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth || 600;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleCardClick = (video: VideoItem) => {
    setSelectedVideo(video);
  };

  if (!isVideosLoading && displayVideos.length === 0) {
    return null;
  }

  return (
    <section
      className="apiary-videos-section"
      style={{
        padding: '5rem 0',
        backgroundColor: '#FAF7F2',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid #ECE7DE',
        borderBottom: '1px solid #ECE7DE',
      }}
    >
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Header: Bee Icon + Title + Subtitle + Action Button + Scroll Controls */}
        <div
          className="flex items-center justify-between flex-wrap gap-4"
          style={{ marginBottom: '2.5rem' }}
        >
          {/* Left Title Area */}
          <div className="flex items-center gap-3.5">
            <ApiaryBeeIcon size={48} />
            <div>
              <h2
                style={{
                  fontSize: 'clamp(1.75rem, 2.7vw, 2.45rem)',
                  color: '#1C1917',
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontWeight: 800,
                  margin: '0 0 0.25rem 0',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.15,
                }}
              >
                Moments from Our Apiaries
              </h2>
              <p
                style={{
                  margin: 0,
                  color: '#57534E',
                  fontSize: 'clamp(0.88rem, 1.15vw, 1rem)',
                  fontWeight: 400,
                }}
              >
                A glimpse of our forests, bees and the pure honey we collect.
              </p>
            </div>
          </div>

          {/* Right Action Button & Scroll Controls */}
          <div className="flex items-center gap-3">
            <Link
              to="/videos"
              className="view-all-videos-pill"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#F97316',
                color: '#FFFFFF',
                padding: '0.65rem 1.35rem',
                borderRadius: '9999px',
                fontWeight: 700,
                fontSize: '0.92rem',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(249, 115, 22, 0.32)',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#EA580C';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(234, 88, 12, 0.42)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#F97316';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(249, 115, 22, 0.32)';
              }}
            >
              <span>View All Videos ({displayVideos.length})</span>
              <ArrowRight size={17} strokeWidth={2.4} />
            </Link>

            {/* Scroll Navigation Arrows (Enable smooth horizontal browsing) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleScroll('left')}
                disabled={!canScrollLeft}
                aria-label="Scroll left"
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: canScrollLeft ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)',
                  border: canScrollLeft ? '1.5px solid #FDBA74' : '1.5px solid #E7E5E4',
                  color: canScrollLeft ? '#EA580C' : '#A8A29E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: canScrollLeft ? 'pointer' : 'default',
                  boxShadow: canScrollLeft ? '0 3px 10px rgba(234, 88, 12, 0.12)' : 'none',
                  transition: 'all 0.2s ease',
                  opacity: canScrollLeft || pages.length > 1 ? 1 : 0.6,
                }}
                onMouseOver={(e) => {
                  if (canScrollLeft) {
                    e.currentTarget.style.backgroundColor = '#EA580C';
                    e.currentTarget.style.color = '#FFFFFF';
                    e.currentTarget.style.borderColor = '#EA580C';
                    e.currentTarget.style.transform = 'scale(1.06)';
                  }
                }}
                onMouseOut={(e) => {
                  if (canScrollLeft) {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.color = '#EA580C';
                    e.currentTarget.style.borderColor = '#FDBA74';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
              >
                <ChevronLeft size={20} strokeWidth={2.4} />
              </button>

              <button
                type="button"
                onClick={() => handleScroll('right')}
                disabled={!canScrollRight}
                aria-label="Scroll right"
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: canScrollRight ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)',
                  border: canScrollRight ? '1.5px solid #FDBA74' : '1.5px solid #E7E5E4',
                  color: canScrollRight ? '#EA580C' : '#A8A29E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: canScrollRight ? 'pointer' : 'default',
                  boxShadow: canScrollRight ? '0 3px 10px rgba(234, 88, 12, 0.12)' : 'none',
                  transition: 'all 0.2s ease',
                  opacity: canScrollRight || pages.length > 1 ? 1 : 0.6,
                }}
                onMouseOver={(e) => {
                  if (canScrollRight) {
                    e.currentTarget.style.backgroundColor = '#EA580C';
                    e.currentTarget.style.color = '#FFFFFF';
                    e.currentTarget.style.borderColor = '#EA580C';
                    e.currentTarget.style.transform = 'scale(1.06)';
                  }
                }}
                onMouseOut={(e) => {
                  if (canScrollRight) {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.color = '#EA580C';
                    e.currentTarget.style.borderColor = '#FDBA74';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
              >
                <ChevronRight size={20} strokeWidth={2.4} />
              </button>
            </div>
          </div>
        </div>

        {/* Bento Grid Container - Absolutely NO Vertical Scroll */}
        {isVideosLoading && displayVideos.length === 0 ? (
          <div className="flex gap-5" style={{ overflowX: 'hidden' }}>
            <VideoCardShimmer count={4} />
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="apiary-horizontal-scroll-container"
            style={{
              display: 'flex',
              overflowX: pages.length > 1 ? 'auto' : 'hidden',
              overflowY: 'hidden',
              scrollSnapType: 'x mandatory',
              gap: '24px',
              width: '100%',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
              padding: '0.25rem 0.1rem 1rem 0.1rem',
            }}
          >
            {pages.map((pageVideos, pageIdx) => {
              const baseIdx = pageIdx * 5;
              const card0 = pageVideos[0];
              const card1 = pageVideos[1];
              const card2 = pageVideos[2];
              const card3 = pageVideos[3];
              const card4 = pageVideos[4];

              return (
                <div
                  key={`bento-page-${pageIdx}`}
                  className="apiary-bento-grid-page"
                  style={{
                    flex: '0 0 100%',
                    minWidth: '100%',
                    width: '100%',
                    scrollSnapAlign: 'start',
                    boxSizing: 'border-box',
                    overflowY: 'hidden',
                  }}
                >
                  {/* Exactly Matches Image 2: 3 Columns, 2 Rows Grid */}
                  <div
                    className="apiary-bento-grid"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1.18fr 1fr 1fr',
                      gridTemplateRows: 'repeat(2, 210px)',
                      gap: '16px',
                      height: '436px',
                      width: '100%',
                      overflowY: 'hidden',
                      boxSizing: 'border-box',
                    }}
                  >
                    {/* Card 0 (Left Column: Full Height Tall Card Spanning 2 Rows) */}
                    {card0 && (
                      <div
                        className="apiary-card-wrapper apiary-card-tall-wrapper"
                        style={{
                          gridColumn: '1',
                          gridRow: '1 / span 2',
                          height: '100%',
                          width: '100%',
                          minHeight: 0,
                          minWidth: 0,
                          overflow: 'hidden',
                        }}
                      >
                        <ApiaryVideoCard
                          video={card0}
                          index={baseIdx}
                          isTall={true}
                          onSelect={handleCardClick}
                        />
                      </div>
                    )}

                    {/* Card 1 (Middle Column: Row 1 Landscape Card) */}
                    {card1 && (
                      <div
                        className="apiary-card-wrapper"
                        style={{
                          gridColumn: '2',
                          gridRow: '1 / span 1',
                          height: '100%',
                          width: '100%',
                          minHeight: 0,
                          minWidth: 0,
                          overflow: 'hidden',
                        }}
                      >
                        <ApiaryVideoCard
                          video={card1}
                          index={baseIdx + 1}
                          isTall={false}
                          onSelect={handleCardClick}
                        />
                      </div>
                    )}

                    {/* Card 2 (Middle Column: Row 2 Landscape Card) */}
                    {card2 && (
                      <div
                        className="apiary-card-wrapper"
                        style={{
                          gridColumn: '2',
                          gridRow: '2 / span 1',
                          height: '100%',
                          width: '100%',
                          minHeight: 0,
                          minWidth: 0,
                          overflow: 'hidden',
                        }}
                      >
                        <ApiaryVideoCard
                          video={card2}
                          index={baseIdx + 2}
                          isTall={false}
                          onSelect={handleCardClick}
                        />
                      </div>
                    )}

                    {/* Card 3 (Right Column: Row 1 Landscape Card) */}
                    {card3 && (
                      <div
                        className="apiary-card-wrapper"
                        style={{
                          gridColumn: '3',
                          gridRow: '1 / span 1',
                          height: '100%',
                          width: '100%',
                          minHeight: 0,
                          minWidth: 0,
                          overflow: 'hidden',
                        }}
                      >
                        <ApiaryVideoCard
                          video={card3}
                          index={baseIdx + 3}
                          isTall={false}
                          onSelect={handleCardClick}
                        />
                      </div>
                    )}

                    {/* Card 4 (Right Column: Row 2 Landscape Card) */}
                    {card4 && (
                      <div
                        className="apiary-card-wrapper"
                        style={{
                          gridColumn: '3',
                          gridRow: '2 / span 1',
                          height: '100%',
                          width: '100%',
                          minHeight: 0,
                          minWidth: 0,
                          overflow: 'hidden',
                        }}
                      >
                        <ApiaryVideoCard
                          video={card4}
                          index={baseIdx + 4}
                          isTall={false}
                          onSelect={handleCardClick}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Shoppable Video Reel Modal when any card is clicked */}
      <VideoModal
        video={selectedVideo}
        videoList={displayVideos}
        onClose={() => setSelectedVideo(null)}
        onSelectVideo={(v) => setSelectedVideo(v)}
      />

      <style>{`
        .apiary-horizontal-scroll-container::-webkit-scrollbar {
          display: none;
        }
        /* Mobile horizontal scroll support: Cards scroll horizontally with ZERO vertical overflow */
        @media (max-width: 860px) {
          .apiary-bento-grid {
            display: flex !important;
            overflow-x: auto !important;
            overflow-y: hidden !important;
            scroll-snap-type: x mandatory !important;
            height: 380px !important;
            gap: 14px !important;
            scrollbar-width: none !important;
          }
          .apiary-bento-grid::-webkit-scrollbar {
            display: none !important;
          }
          .apiary-card-wrapper {
            flex: 0 0 280px !important;
            min-width: 280px !important;
            width: 280px !important;
            height: 100% !important;
            scroll-snap-align: start !important;
          }
        }
        @media (max-width: 480px) {
          .apiary-bento-grid {
            height: 340px !important;
          }
          .apiary-card-wrapper {
            flex: 0 0 250px !important;
            min-width: 250px !important;
            width: 250px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default VideoShowcase;
