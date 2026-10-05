import React, { useEffect, useRef, useState, useMemo } from 'react';
import { VideoItem } from '../../../types/video.types';
import { Product } from '../../../types/product.types';
import {
  X,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ShoppingBag,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Check,
  Sparkles,
  ZoomIn,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../../store/store';
import { formatPrice } from '../../../utils/formatPrice';

interface VideoModalProps {
  video: VideoItem | null;
  videoList?: VideoItem[];
  onClose: () => void;
  onSelectVideo?: (video: VideoItem) => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  video,
  videoList = [],
  onClose,
  onSelectVideo,
}) => {
  const { incrementVideoViews, getProductById, products, addToCart, setCartDrawerOpen } = useStore();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Video playback states
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');

  // Product interaction states
  const [selectedSize, setSelectedSize] = useState<string>('500g');
  const [quantity, setQuantity] = useState<number>(1);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isImageZoomed, setIsImageZoomed] = useState<boolean>(false);

  // Active video index in playlist
  const activeList = useMemo(() => {
    if (videoList && videoList.length > 0) return videoList;
    return video ? [video] : [];
  }, [videoList, video]);

  const currentIndex = useMemo(() => {
    if (!video) return -1;
    return activeList.findIndex((v) => v.id === video.id);
  }, [activeList, video]);

  // Handle lock scroll and view increment
  useEffect(() => {
    if (video) {
      document.body.style.overflow = 'hidden';
      incrementVideoViews(video.id);
      setIsPlaying(true);
      setProgress(0);
      setAddedAnimation(false);
      setIsDescExpanded(false);
      setQuantity(1);
      setSelectedImageIndex(0);
      setIsImageZoomed(false);

      // Reset video element playback
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Browser autoplay with audio blocked, fallback to muted play
            if (videoRef.current) {
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current.play().catch(() => setIsPlaying(false));
            }
          });
      }
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [video?.id]);

  // Keyboard navigation (Escape, Left, Right, Space)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!video) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNextVideo();
      } else if (e.key === 'ArrowLeft') {
        handlePrevVideo();
      } else if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        togglePlayPause();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  if (!video) return null;

  // Retrieve tagged product or fallback
  const storeProduct = video.taggedProductId
    ? getProductById(video.taggedProductId)
    : video.taggedProductSlug
    ? products.find((p) => p.slug === video.taggedProductSlug)
    : undefined;

  // Construct a safe, complete product object
  const activeProduct: Product = storeProduct || {
    id: video.taggedProductId || 'prod-reel-' + video.id,
    name: video.taggedProductName || 'Wild Forest Raw Honey',
    slug: video.taggedProductSlug || 'wild-forest-raw-honey',
    tagline: '100% Raw Forest Harvested Nectar',
    description:
      video.taggedProductDescription ||
      'Hand-harvested from natural rock combs in the pristine Jim Corbett biosphere. Unheated, unpasteurized, and rich in natural bee pollen.',
    story: 'Extracted using traditional Vedic cold-centrifuge techniques to preserve all natural antibacterial enzymes.',
    category: 'raw-honey',
    categorySlug: 'raw-honey',
    price: video.taggedProductPrice || 498,
    originalPrice: video.taggedProductOriginalPrice || 650,
    discountPercent: Math.round(
      (((video.taggedProductOriginalPrice || 650) - (video.taggedProductPrice || 498)) /
        (video.taggedProductOriginalPrice || 650)) *
        100
    ),
    rating: 4.9,
    reviewsCount: 142,
    stock: 25,
    images: [
      video.taggedProductImage ||
        video.thumbnailUrl ||
        'https://res.cloudinary.com/kisnodzz/image/upload/v1791042814/madhuvan_honey/products/t6l1edtfc4xg0wmxb8we.jpg',
    ],
    sizes: [
      { size: '250g', price: Math.round((video.taggedProductPrice || 498) * 0.58), originalPrice: Math.round((video.taggedProductOriginalPrice || 650) * 0.58), stock: 20, sku: 'SKU-250' },
      { size: '500g', price: video.taggedProductPrice || 498, originalPrice: video.taggedProductOriginalPrice || 650, stock: 25, sku: 'SKU-500' },
      { size: '1kg', price: Math.round((video.taggedProductPrice || 498) * 1.85), originalPrice: Math.round((video.taggedProductOriginalPrice || 650) * 1.85), stock: 15, sku: 'SKU-1000' },
    ],
    origin: 'Jim Corbett & Sunderbans Biosphere',
    nectarSource: 'Wild Himalayan Flora',
    purityScore: video.purityScore || 99.8,
    harvestSeason: 'Spring Blossom',
    benefits: ['100% Raw & Unheated', 'Naturally High Pollen', 'Lab NMR Tested'],
    nutritionFacts: {
      energy: '304 kcal per 100g',
      carbohydrates: '82.4g',
      naturalSugars: '80.1g',
      proteins: '0.3g',
      antioxidants: 'Rich in Pinocembrin & Chrysin',
    },
    reviews: [],
    isFeatured: true,
    isBestSeller: true,
    isOrganicCertified: true,
    createdAt: new Date().toISOString(),
  };

  const isEmbed =
    video.videoUrl.includes('youtube.com') ||
    video.videoUrl.includes('youtu.be') ||
    video.videoUrl.includes('vimeo.com');

  const currentSizeOption =
    activeProduct.sizes?.find((s) => s.size === selectedSize) ||
    activeProduct.sizes?.[0] || {
      size: '500g',
      price: activeProduct.price,
      originalPrice: activeProduct.originalPrice,
      stock: 10,
      sku: 'SKU-DEF',
    };

  // Switch to next/previous video
  const handleNextVideo = () => {
    if (activeList.length <= 1) return;
    const nextIdx = (currentIndex + 1) % activeList.length;
    const nextVid = activeList[nextIdx];
    if (onSelectVideo) {
      onSelectVideo(nextVid);
    }
  };

  const handlePrevVideo = () => {
    if (activeList.length <= 1) return;
    const prevIdx = (currentIndex - 1 + activeList.length) % activeList.length;
    const prevVid = activeList[prevIdx];
    if (onSelectVideo) {
      onSelectVideo(prevVid);
    }
  };

  // Video Playback Controls
  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const newMuted = !videoRef.current.muted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 1;
    setProgress((curr / dur) * 100);

    const m = Math.floor(curr / 60);
    const s = Math.floor(curr % 60);
    setCurrentTime(`${m}:${s < 10 ? '0' : ''}${s}`);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    const dur = videoRef.current.duration || 0;
    const m = Math.floor(dur / 60);
    const s = Math.floor(dur % 60);
    setDuration(`${m}:${s < 10 ? '0' : ''}${s}`);
  };

  // Add to Cart from Video Modal
  const handleAddToCart = () => {
    addToCart(activeProduct, currentSizeOption.size, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2400);
  };

  // Adjacent videos for 3D peek preview
  const prevVideoPreview = activeList.length > 1 && currentIndex > 0 ? activeList[currentIndex - 1] : null;
  const nextVideoPreview = activeList.length > 1 && currentIndex < activeList.length - 1 ? activeList[currentIndex + 1] : null;

  return (
    <div
      className="video-modal-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        backgroundColor: 'rgba(8, 6, 4, 0.94)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(0.5rem, 2vw, 2rem)',
        overflowY: 'auto',
      }}
      onClick={onClose}
    >
      {/* Top Floating Close Button */}
      <button
        onClick={onClose}
        style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          zIndex: 2050,
          background: 'rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          color: '#FFFFFF',
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s',
          boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(217, 119, 6, 0.85)')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)')}
        aria-label="Close Video Modal"
      >
        <X size={22} />
      </button>

      {/* Playlist Navigation: Previous Button */}
      {activeList.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrevVideo();
          }}
          style={{
            position: 'fixed',
            left: 'clamp(10px, 3vw, 40px)',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2040,
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            backgroundColor: 'rgba(28, 25, 23, 0.75)',
            backdropFilter: 'blur(12px)',
            border: '1.5px solid rgba(245, 158, 11, 0.4)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5)',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#D97706';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(28, 25, 23, 0.75)';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
          }}
          aria-label="Previous Video Reel"
        >
          <ChevronLeft size={28} />
        </button>
      )}

      {/* Playlist Navigation: Next Button */}
      {activeList.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNextVideo();
          }}
          style={{
            position: 'fixed',
            right: 'clamp(10px, 3vw, 40px)',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2040,
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            backgroundColor: 'rgba(28, 25, 23, 0.75)',
            backdropFilter: 'blur(12px)',
            border: '1.5px solid rgba(245, 158, 11, 0.4)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5)',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#D97706';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(28, 25, 23, 0.75)';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
          }}
          aria-label="Next Video Reel"
        >
          <ChevronRight size={28} />
        </button>
      )}

      {/* Main Container: Split Shoppable Cinema Box */}
      <div
        className="shoppable-video-modal-card"
        style={{
          width: '100%',
          maxWidth: '880px',
          maxHeight: '92vh',
          backgroundColor: '#181511',
          borderRadius: '28px',
          overflow: 'hidden',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.8), 0 0 40px rgba(217, 119, 6, 0.2)',
          border: '1.5px solid rgba(245, 158, 11, 0.35)',
          display: 'flex',
          flexDirection: 'row',
          position: 'relative',
          animation: 'modalSlideUp 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* LEFT PANEL: VERTICAL CINEMA VIDEO REEL */}
        <div
          className="modal-video-column"
          style={{
            flex: '1 1 50%',
            maxWidth: '50%',
            position: 'relative',
            backgroundColor: '#000000',
            aspectRatio: '9/16',
            minHeight: '480px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            overflow: 'hidden',
          }}
          onClick={togglePlayPause}
        >
          {isEmbed ? (
            <iframe
              src={video.videoUrl}
              title={video.title}
              style={{ width: '100%', height: '100%', border: 'none' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              ref={videoRef}
              src={video.videoUrl}
              poster={video.thumbnailUrl}
              autoPlay
              playsInline
              loop
              muted={isMuted}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          )}

          {/* Top Floating Video Controls & Brand Header */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              padding: '1.25rem 1rem',
              background: 'linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              zIndex: 10,
              pointerEvents: 'auto',
            }}
          >
            {/* Live Reel Pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(0, 0, 0, 0.65)',
                backdropFilter: 'blur(8px)',
                padding: '5px 10px',
                borderRadius: '20px',
                border: '1px solid rgba(245, 158, 11, 0.4)',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#F59E0B',
                  boxShadow: '0 0 8px #F59E0B',
                  animation: 'pulse 1.5s infinite',
                }}
              />
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#FEF3C7', letterSpacing: '0.04em' }}>
                MADHUVAN REEL
              </span>
            </div>

            {/* Audio Toggle Button */}
            {!isEmbed && (
              <button
                type="button"
                onClick={toggleMute}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0, 0, 0, 0.65)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#D97706')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.65)')}
                aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            )}
          </div>

          {/* Center Play/Pause Indicator (Shown when paused) */}
          {!isPlaying && !isEmbed && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(217, 119, 6, 0.92)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 0 30px rgba(245, 158, 11, 0.6)',
                zIndex: 10,
                animation: 'scaleIn 0.2s ease-out',
              }}
            >
              <Play size={28} fill="#FFFFFF" style={{ marginLeft: '3px' }} />
            </div>
          )}

          {/* Bottom Floating Title & Progress Scrubber */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '2.5rem 1rem 1rem 1rem',
              background: 'linear-gradient(0deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0) 100%)',
              zIndex: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: '#FEF3C7',
                  backgroundColor: 'rgba(217, 119, 6, 0.85)',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  textTransform: 'uppercase',
                }}
              >
                {video.category}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#D6D3D1', fontWeight: 600 }}>
                {currentTime} / {duration || video.duration}
              </span>
            </div>

            <h3
              style={{
                fontSize: '1.05rem',
                fontWeight: 700,
                color: '#FFFFFF',
                margin: '0 0 8px 0',
                lineHeight: 1.35,
                textShadow: '0 2px 8px rgba(0,0,0,0.6)',
              }}
            >
              {video.title}
            </h3>

            {/* Golden Animated Progress Bar */}
            <div
              style={{
                width: '100%',
                height: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #F59E0B, #D97706)',
                  borderRadius: '4px',
                  transition: 'width 0.1s linear',
                }}
              />
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: LUXURY SHOPPABLE HONEY CARD */}
        <div
          className="modal-product-column"
          style={{
            flex: '1 1 50%',
            maxWidth: '50%',
            backgroundColor: '#FFFFFF',
            padding: 'clamp(1.25rem, 3vw, 2rem)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflowY: 'auto',
          }}
        >
          {/* Top Header Badge & NMR Purity Pill */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
              }}
            >
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: '#92400E',
                  backgroundColor: '#FEF3C7',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Sparkles size={12} color="#D97706" />
                Featured In This Reel
              </span>

              {activeList.length > 1 && (
                <span style={{ fontSize: '0.78rem', color: '#78716C', fontWeight: 600 }}>
                  Reel {currentIndex + 1} of {activeList.length}
                </span>
              )}
            </div>

            {/* Product Hero: Highlighted Image + Title + Purity Seal */}
            <div
              className="reel-product-hero-card"
              style={{
                display: 'flex',
                gap: '1.15rem',
                marginBottom: '1.15rem',
                alignItems: 'center',
                backgroundColor: '#FFFDF7',
                padding: '0.85rem',
                borderRadius: '20px',
                border: '1.5px solid #FEF3C7',
                boxShadow: '0 6px 20px rgba(217, 119, 6, 0.07)',
              }}
            >
              {/* Highlighted Product Image Showcase */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                <div
                  className="reel-product-img-box"
                  onClick={() => setIsImageZoomed(true)}
                  title="Click to view full image"
                  style={{
                    position: 'relative',
                    borderRadius: '16px',
                    backgroundColor: '#FFFFFF',
                    border: '2px solid #F59E0B',
                    overflow: 'hidden',
                    boxShadow: '0 8px 24px rgba(245, 158, 11, 0.25), 0 2px 6px rgba(0, 0, 0, 0.04)',
                    cursor: 'zoom-in',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
                    e.currentTarget.style.boxShadow = '0 12px 28px rgba(245, 158, 11, 0.35), 0 4px 10px rgba(0, 0, 0, 0.06)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(245, 158, 11, 0.25), 0 2px 6px rgba(0, 0, 0, 0.04)';
                  }}
                >
                  <img
                    src={activeProduct.images[selectedImageIndex] || activeProduct.images[0]}
                    alt={activeProduct.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      padding: '4px',
                      transition: 'transform 0.3s ease',
                    }}
                  />

                  {/* Golden Pure Raw Highlight Pill */}
                  <span
                    style={{
                      position: 'absolute',
                      top: '6px',
                      left: '6px',
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      color: '#92400E',
                      backgroundColor: 'rgba(254, 243, 199, 0.95)',
                      padding: '2px 7px',
                      borderRadius: '6px',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      border: '1px solid rgba(245, 158, 11, 0.35)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
                    }}
                  >
                    <Sparkles size={9} color="#D97706" />
                    PURE RAW
                  </span>

                  {/* Subtle Zoom In badge in corner */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '6px',
                      right: '6px',
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(28, 25, 23, 0.75)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                    }}
                  >
                    <ZoomIn size={12} />
                  </div>
                </div>

                {/* Multiple Images Selector Thumbnails */}
                {activeProduct.images && activeProduct.images.length > 1 && (
                  <div style={{ display: 'flex', gap: '4px', marginTop: '2px' }}>
                    {activeProduct.images.slice(0, 4).map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImageIndex(idx);
                        }}
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '4px',
                          border: selectedImageIndex === idx ? '2px solid #D97706' : '1px solid #D6D3D1',
                          overflow: 'hidden',
                          padding: 0,
                          cursor: 'pointer',
                          backgroundColor: '#FFFFFF',
                        }}
                      >
                        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Title & Origin & Purity Badge beside the highlighted image */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.72rem',
                    color: '#059669',
                    fontWeight: 700,
                    marginBottom: '4px',
                    backgroundColor: '#ECFDF5',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    border: '1px solid #A7F3D0',
                  }}
                >
                  <ShieldCheck size={13} />
                  <span>100% Raw • {activeProduct.purityScore || 99.8}% NMR Tested</span>
                </div>

                <h2
                  style={{
                    fontSize: '1.35rem',
                    color: '#1C1917',
                    margin: '0 0 6px 0',
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontWeight: 700,
                    lineHeight: 1.25,
                  }}
                >
                  {activeProduct.name}
                </h2>

                <div style={{ fontSize: '0.8rem', color: '#78716C', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>Origin:</span>
                  <strong style={{ color: '#44403C' }}>{activeProduct.origin}</strong>
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div
              style={{
                backgroundColor: '#FAF7F2',
                padding: '0.85rem 1rem',
                borderRadius: '14px',
                border: '1px solid #E7E5E4',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#B45309' }}>
                  {formatPrice(currentSizeOption.price)}
                </span>
                {currentSizeOption.originalPrice > currentSizeOption.price && (
                  <span
                    style={{
                      fontSize: '0.92rem',
                      color: '#A8A29E',
                      textDecoration: 'line-through',
                      fontWeight: 500,
                    }}
                  >
                    {formatPrice(currentSizeOption.originalPrice)}
                  </span>
                )}
              </div>

              {currentSizeOption.originalPrice > currentSizeOption.price && (
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: '#059669',
                    backgroundColor: '#ECFDF5',
                    padding: '3px 8px',
                    borderRadius: '8px',
                    border: '1px solid #A7F3D0',
                  }}
                >
                  Save {Math.round(((currentSizeOption.originalPrice - currentSizeOption.price) / currentSizeOption.originalPrice) * 100)}%
                </span>
              )}
            </div>

            {/* Description with read more toggle */}
            <div style={{ marginBottom: '1.25rem' }}>
              <p
                style={{
                  fontSize: '0.86rem',
                  color: '#57534E',
                  lineHeight: 1.55,
                  margin: 0,
                  display: isDescExpanded ? 'block' : '-webkit-box',
                  WebkitLineClamp: isDescExpanded ? 'unset' : 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {activeProduct.description}
              </p>
              {activeProduct.description && activeProduct.description.length > 90 && (
                <button
                  type="button"
                  onClick={() => setIsDescExpanded(!isDescExpanded)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#D97706',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: '2px 0 0 0',
                  }}
                >
                  {isDescExpanded ? 'Show less' : 'Read more…'}
                </button>
              )}
            </div>

            {/* Size Selector */}
            {activeProduct.sizes && activeProduct.sizes.length > 0 && (
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#78716C', marginBottom: '6px' }}>
                  Select Jar Weight:
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {activeProduct.sizes.map((opt) => (
                    <button
                      key={opt.size}
                      type="button"
                      onClick={() => setSelectedSize(opt.size)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '10px',
                        fontSize: '0.85rem',
                        fontWeight: selectedSize === opt.size ? 800 : 600,
                        backgroundColor: selectedSize === opt.size ? '#FEF3C7' : '#FFFFFF',
                        border: selectedSize === opt.size ? '2px solid #D97706' : '1px solid #E7E5E4',
                        color: selectedSize === opt.size ? '#92400E' : '#57534E',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {opt.size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Actions: Quantity + Add to Cart + Product Link */}
          <div style={{ paddingTop: '1rem', borderTop: '1px solid #F0ECE4' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
              {/* Quantity Stepper */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1.5px solid #E7E5E4',
                  borderRadius: '12px',
                  backgroundColor: '#FAF7F2',
                  padding: '3px',
                }}
              >
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    width: '32px',
                    height: '34px',
                    border: 'none',
                    background: 'transparent',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: '#78716C',
                    cursor: 'pointer',
                  }}
                >
                  −
                </button>
                <span
                  style={{
                    width: '30px',
                    textAlign: 'center',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    color: '#1C1917',
                  }}
                >
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    width: '32px',
                    height: '34px',
                    border: 'none',
                    background: 'transparent',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: '#78716C',
                    cursor: 'pointer',
                  }}
                >
                  +
                </button>
              </div>

              {/* Add To Cart Primary Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                style={{
                  flex: 1,
                  padding: '0.85rem 1.25rem',
                  borderRadius: '14px',
                  background: addedAnimation
                    ? '#059669'
                    : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.98rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: addedAnimation
                    ? '0 6px 20px rgba(5, 150, 105, 0.4)'
                    : '0 6px 20px rgba(217, 119, 6, 0.35)',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {addedAnimation ? (
                  <>
                    <Check size={18} strokeWidth={2.5} />
                    <span>Added to Honey Basket!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    <span>Add to Honey Basket</span>
                  </>
                )}
              </button>
            </div>

            {/* Secondary Action: View Full Details Link */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Link
                to={`/product/${activeProduct.slug}`}
                onClick={onClose}
                style={{
                  fontSize: '0.84rem',
                  color: '#78716C',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px',
                }}
              >
                <span>View Full Honey Origin</span>
                <ArrowRight size={13} color="#D97706" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Product Image Lightbox Zoom Modal */}
      {isImageZoomed && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            animation: 'modalSlideUp 0.2s ease-out',
          }}
          onClick={() => setIsImageZoomed(false)}
        >
          <div
            style={{
              position: 'relative',
              maxWidth: '460px',
              width: '100%',
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '1.5rem',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.45)',
              border: '2px solid #F59E0B',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsImageZoomed(false)}
              style={{
                position: 'absolute',
                top: '14px',
                right: '14px',
                backgroundColor: '#F5F5F4',
                border: 'none',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#E7E5E4')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#F5F5F4')}
              aria-label="Close Image Preview"
            >
              <X size={18} color="#44403C" />
            </button>

            <div
              style={{
                width: '100%',
                height: '320px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#FFFDF7',
                borderRadius: '16px',
                overflow: 'hidden',
                padding: '1rem',
                border: '1px solid #FEF3C7',
              }}
            >
              <img
                src={activeProduct.images[selectedImageIndex] || activeProduct.images[0]}
                alt={activeProduct.name}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.15))',
                }}
              />
            </div>

            <div style={{ marginTop: '1rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.72rem',
                  color: '#059669',
                  fontWeight: 700,
                  marginBottom: '4px',
                }}
              >
                <ShieldCheck size={13} />
                <span>100% Raw • {activeProduct.purityScore || 99.8}% NMR Tested</span>
              </div>
              <h3 style={{ margin: '2px 0 4px 0', fontSize: '1.2rem', color: '#1C1917', fontWeight: 800 }}>
                {activeProduct.name}
              </h3>
              <p style={{ margin: 0, fontSize: '0.84rem', color: '#78716C' }}>
                Origin: <strong>{activeProduct.origin}</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Scoped CSS for modal styling and responsiveness */}
      <style>{`
        .reel-product-img-box {
          width: 125px;
          height: 125px;
        }

        @keyframes modalSlideUp {
          from {
            opacity: 0;
            transform: scale(0.94) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes scaleIn {
          from { transform: translate(-50%, -50%) scale(0.7); opacity: 0; }
          to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }

        @media (max-width: 768px) {
          .shoppable-video-modal-card {
            flex-direction: column !important;
            max-height: 94vh !important;
            max-width: 440px !important;
          }
          .modal-video-column {
            max-width: 100% !important;
            flex: 1 1 auto !important;
            aspect-ratio: 9/12 !important;
            min-height: 340px !important;
          }
          .modal-product-column {
            max-width: 100% !important;
            flex: 1 1 auto !important;
            padding: 1.25rem !important;
          }
          .reel-product-img-box {
            width: 100px !important;
            height: 100px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default VideoModal;
