import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../../store/store';
import { VideoModal } from '../video/VideoModal';
import { VideoItem } from '../../../types/video.types';
import { Film, ChevronLeft, ChevronRight, Volume2, Sparkles, Check, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VideoCardShimmer } from '../../common/Shimmer';

interface ReelCardProps {
  video: VideoItem;
  onSelectVideo: (video: VideoItem) => void;
}

const ReelCard: React.FC<ReelCardProps> = ({ video, onSelectVideo }) => {
  const { products, addToCart, setCartDrawerOpen } = useStore();

  const matchedProd = video.taggedProductId
    ? products.find((p) => p.id === video.taggedProductId || (p as any)._id === video.taggedProductId)
    : video.taggedProductSlug
      ? products.find((p) => p.slug === video.taggedProductSlug)
      : undefined;

  const prodName = matchedProd?.name || video.taggedProductName || 'Wild Forest Raw Honey';
  const prodPrice = matchedProd?.price || video.taggedProductPrice || 498;
  const prodOrigPrice = matchedProd?.originalPrice || video.taggedProductOriginalPrice || 650;
  const prodImage = matchedProd?.images?.[0] || video.taggedProductImage || video.thumbnailUrl;

  const availableSizes = matchedProd?.sizes && matchedProd.sizes.length > 0
    ? matchedProd.sizes
    : [{ size: video.taggedProductSize || '500g', price: prodPrice, originalPrice: prodOrigPrice, stock: matchedProd?.stock ?? 15 }];

  const [selectedSize, setSelectedSize] = useState<string>(
    availableSizes[0]?.size || '500g'
  );
  const [isAdded, setIsAdded] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeSizeOption = availableSizes.find((s) => s.size === selectedSize) || availableSizes[0];
  const currentPrice = activeSizeOption?.price || prodPrice;
  const currentOrigPrice = activeSizeOption?.originalPrice || prodOrigPrice;

  const isOutOfStock = matchedProd
    ? (matchedProd.stock <= 0 || (activeSizeOption && activeSizeOption.stock !== undefined && activeSizeOption.stock <= 0))
    : false;

  const discountPercent = currentOrigPrice > currentPrice
    ? Math.round(((currentOrigPrice - currentPrice) / currentOrigPrice) * 100)
    : (matchedProd?.discountPercent || 0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;

    const targetProd = matchedProd || ({
      id: video.taggedProductId || video.id,
      name: prodName,
      slug: video.taggedProductSlug || 'wild-forest-raw-honey',
      price: currentPrice,
      originalPrice: currentOrigPrice,
      stock: 15,
      images: [prodImage],
      sizes: availableSizes,
      selectedSize,
    } as any);

    addToCart(targetProd, selectedSize, 1);
    setCartDrawerOpen(true);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  const handleToggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div
      className="niyamaya-reel-card"
      style={{
        flex: '0 0 245px',
        width: '245px',
        borderRadius: '14px',
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 4px 18px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)',
        border: '1px solid #E5E7EB',
        display: 'flex',
        flexDirection: 'column',
        scrollSnapAlign: 'start',
        position: 'relative',
        transition: 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.28s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.12)';
        const vid = e.currentTarget.querySelector('video');
        if (vid && vid.paused) vid.play().catch(() => { });
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 18px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)';
      }}
      onClick={() => onSelectVideo(video)}
    >
      {/* Video Frame & Overlapping Thumbnail */}
      <div style={{ position: 'relative', width: '100%' }}>
        <div
          style={{
            width: '100%',
            aspectRatio: '9/13.5',
            backgroundColor: '#1C1917',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
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

          {/* Top-Left Red Ribbon Discount Badge (Matches Image 1) */}
          {discountPercent > 0 && (
            <div
              style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                backgroundColor: '#C5221F',
                color: '#FFFFFF',
                fontSize: '0.68rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                padding: '3px 10px 3px 7px',
                clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 50%, calc(100% - 6px) 100%, 0 100%)',
                zIndex: 6,
                textTransform: 'uppercase',
                boxShadow: '0 2px 6px rgba(197, 34, 31, 0.4)',
              }}
            >
              {discountPercent}% OFF
            </div>
          )}

          {/* Top-Right Frosted Sound Icon */}
          <div
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              backgroundColor: 'rgba(0, 0, 0, 0.45)',
              backdropFilter: 'blur(4px)',
              color: '#FFFFFF',
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 6,
            }}
          >
            <Volume2 size={12} />
          </div>

          {/* Subtle bottom vignette */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '35px',
              background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.25) 100%)',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Overlapping Product Thumbnail (Junction between Video & Details, like Image 1) */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelectVideo(video);
          }}
          title={prodName}
          style={{
            position: 'absolute',
            bottom: '-18px',
            left: '12px',
            width: '44px',
            height: '44px',
            borderRadius: '8px',
            backgroundColor: '#FFFFFF',
            border: '2px solid #FFFFFF',
            boxShadow: '0 3px 8px rgba(0, 0, 0, 0.14)',
            overflow: 'hidden',
            zIndex: 10,
            cursor: 'pointer',
          }}
        >
          <img
            src={prodImage}
            alt={prodName}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>

      {/* Product Information & Split Action Button */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          padding: '24px 12px 12px 12px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        {/* Product Title */}
        <h4
          title={prodName}
          style={{
            fontSize: '0.86rem',
            fontWeight: 600,
            color: '#111827',
            margin: '0 0 4px 0',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 1.3,
          }}
        >
          {prodName}
        </h4>

        {/* Price Row (Selling price in Red Bold, strikethrough in grey, format: Rs. X,XXX.00) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '8px',
            marginBottom: '12px',
          }}
        >
          <span
            style={{
              fontSize: '0.9rem',
              fontWeight: 700,
              color: '#C5221F',
            }}
          >
            Rs. {Number(currentPrice).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          {currentOrigPrice > currentPrice && (
            <span
              style={{
                fontSize: '0.76rem',
                color: '#9CA3AF',
                textDecoration: 'line-through',
                fontWeight: 400,
              }}
            >
              Rs. {Number(currentOrigPrice).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          )}
        </div>

        {/* Split Action Button Area */}
        <div style={{ marginTop: 'auto', position: 'relative' }} ref={dropdownRef}>
          {/* Size Selector Popover */}
          {isDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                bottom: '44px',
                left: 0,
                right: 0,
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.16)',
                border: '1px solid #E5E7EB',
                padding: '8px',
                zIndex: 30,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: '#6B7280',
                  textTransform: 'uppercase',
                  padding: '2px 4px 6px 4px',
                  borderBottom: '1px solid #F3F4F6',
                  marginBottom: '4px',
                }}
              >
                Select Size
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {availableSizes.map((s) => {
                  const isSelected = s.size === selectedSize;
                  const isSizeOOS = s.stock !== undefined && s.stock <= 0;
                  return (
                    <button
                      key={s.size}
                      type="button"
                      disabled={isSizeOOS}
                      onClick={() => {
                        setSelectedSize(s.size);
                        setIsDropdownOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 8px',
                        borderRadius: '6px',
                        border: isSelected ? '1.5px solid #111827' : '1px solid #E5E7EB',
                        backgroundColor: isSelected ? '#F9FAFB' : '#FFFFFF',
                        cursor: isSizeOOS ? 'not-allowed' : 'pointer',
                        opacity: isSizeOOS ? 0.5 : 1,
                        fontSize: '0.78rem',
                        fontWeight: isSelected ? 700 : 500,
                        color: '#111827',
                      }}
                    >
                      <span>{s.size}</span>
                      <span style={{ color: isSizeOOS ? '#DC2626' : '#C5221F', fontWeight: 600 }}>
                        {isSizeOOS ? 'Out of stock' : `Rs. ${Number(s.price).toLocaleString('en-IN')}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {isOutOfStock ? (
            /* Sold Out State (Grey Split Button - matches Card 3 & 5 in Image 1) */
            <div
              style={{
                width: '100%',
                height: '38px',
                backgroundColor: '#D1D5DB',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
                cursor: 'not-allowed',
              }}
            >
              <button
                type="button"
                disabled
                style={{
                  flex: 1,
                  height: '100%',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#6B7280',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                Sold out
              </button>
              <div
                style={{
                  width: '1px',
                  height: '60%',
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                }}
              />
              <button
                type="button"
                disabled
                style={{
                  width: '36px',
                  height: '100%',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#6B7280',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'not-allowed',
                }}
              >
                <ChevronDown size={14} />
              </button>
            </div>
          ) : (
            /* In Stock State (Black Split Button - matches Card 1, 2, 4 in Image 1) */
            <div
              style={{
                width: '100%',
                height: '38px',
                backgroundColor: '#000000',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              <button
                type="button"
                onClick={handleAddToCart}
                style={{
                  flex: 1,
                  height: '100%',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#FFFFFF',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'background-color 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#1F2937';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {isAdded ? (
                  <>
                    <Check size={14} color="#10B981" />
                    <span style={{ color: '#10B981' }}>Added!</span>
                  </>
                ) : (
                  'Add to Cart'
                )}
              </button>

              <div
                style={{
                  width: '1px',
                  height: '60%',
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                }}
              />

              <button
                type="button"
                onClick={handleToggleDropdown}
                title="Select size"
                style={{
                  width: '36px',
                  height: '100%',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#1F2937';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <ChevronDown size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const VideoShowcase: React.FC = () => {
  const { videos, isVideosLoading } = useStore();
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
    const scrollAmount = 270;
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
        padding: '5rem 0',
        backgroundColor: '#FAF8F5',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid #ECE7DE',
        borderBottom: '1px solid #ECE7DE',
      }}
    >
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
                width: '44px',
                height: '44px',
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
                width: '44px',
                height: '44px',
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
              gap: '1.25rem',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              padding: '0.75rem 0.25rem 1.5rem 0.25rem',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {displayVideos.map((video) => (
              <ReelCard
                key={video.id}
                video={video}
                onSelectVideo={(v) => setSelectedVideo(v)}
              />
            ))}
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

