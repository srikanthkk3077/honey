import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ZoomIn, Maximize2, X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

const ZOOM_FACTOR = 2.5;

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomMode, setZoomMode] = useState<'side' | 'inner'>('side');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Gallery container and element refs for direct 60/120fps DOM transforms
  const containerRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const zoomImageRef = useRef<HTMLImageElement>(null);
  const mainImageRef = useRef<HTMLImageElement>(null);

  // Dimensions cache
  const boundsRef = useRef({
    containerWidth: 0,
    containerHeight: 0,
    lensWidth: 0,
    lensHeight: 0,
    maxLensX: 0,
    maxLensY: 0,
    rectLeft: 0,
    rectTop: 0,
  });

  const validImages = images && images.length > 0
    ? images
    : ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1000&q=80'];
  const currentImage = validImages[activeImage] || validImages[0];

  // Determine whether to use Flipkart side-by-side floating zoom or responsive inner zoom
  const updateDimensionsAndMode = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cWidth = rect.width;
    const cHeight = rect.height;

    // Check available screen space to the right
    const spaceOnRight = window.innerWidth - rect.right;
    const shouldUseSideZoom = window.innerWidth >= 1024 && spaceOnRight >= 360;

    setZoomMode(shouldUseSideZoom ? 'side' : 'inner');

    const lWidth = Math.round(cWidth / ZOOM_FACTOR);
    const lHeight = Math.round(cHeight / ZOOM_FACTOR);

    boundsRef.current = {
      containerWidth: cWidth,
      containerHeight: cHeight,
      lensWidth: lWidth,
      lensHeight: lHeight,
      maxLensX: cWidth - lWidth,
      maxLensY: cHeight - lHeight,
      rectLeft: rect.left,
      rectTop: rect.top,
    };

    if (lensRef.current) {
      lensRef.current.style.width = `${lWidth}px`;
      lensRef.current.style.height = `${lHeight}px`;
    }

    if (zoomImageRef.current) {
      zoomImageRef.current.style.width = `${cWidth * ZOOM_FACTOR}px`;
      zoomImageRef.current.style.height = `${cHeight * ZOOM_FACTOR}px`;
    }
  }, []);

  useEffect(() => {
    updateDimensionsAndMode();
    window.addEventListener('resize', updateDimensionsAndMode);
    return () => window.removeEventListener('resize', updateDimensionsAndMode);
  }, [updateDimensionsAndMode]);

  // Recalculate dimensions when active image loads/changes
  useEffect(() => {
    updateDimensionsAndMode();
  }, [activeImage, updateDimensionsAndMode]);

  // Mouse hover event handlers for Flipkart zoom
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    updateDimensionsAndMode();
    setIsZooming(true);
    handleMouseMove(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { containerWidth, containerHeight, lensWidth, lensHeight, maxLensX, maxLensY } = boundsRef.current;
    if (!containerRef.current || containerWidth === 0) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (zoomMode === 'side') {
      // 1. Center the lens over the cursor & clamp strictly within container boundaries
      let lensX = mouseX - lensWidth / 2;
      let lensY = mouseY - lensHeight / 2;

      lensX = Math.max(0, Math.min(lensX, maxLensX));
      lensY = Math.max(0, Math.min(lensY, maxLensY));

      // Fast hardware-accelerated transform for the lens
      if (lensRef.current) {
        lensRef.current.style.transform = `translate3d(${lensX}px, ${lensY}px, 0)`;
      }

      // 2. Shift the zoomed image in the side preview window in opposite direction
      if (zoomImageRef.current) {
        const zoomX = lensX * ZOOM_FACTOR;
        const zoomY = lensY * ZOOM_FACTOR;
        zoomImageRef.current.style.transform = `translate3d(-${zoomX}px, -${zoomY}px, 0)`;
      }
    } else {
      // Responsive inner-zoom mode: scale the image inside its frame centered on mouse
      if (mainImageRef.current) {
        const xPercent = Math.max(0, Math.min(100, (mouseX / containerWidth) * 100));
        const yPercent = Math.max(0, Math.min(100, (mouseY / containerHeight) * 100));
        mainImageRef.current.style.transformOrigin = `${xPercent}% ${yPercent}%`;
        mainImageRef.current.style.transform = 'scale(2.2)';
      }
    }
  };

  const handleMouseLeave = () => {
    setIsZooming(false);
    if (mainImageRef.current) {
      mainImageRef.current.style.transform = 'scale(1)';
      mainImageRef.current.style.transformOrigin = 'center center';
    }
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowRight') setActiveImage((prev) => (prev + 1) % validImages.length);
      if (e.key === 'ArrowLeft') setActiveImage((prev) => (prev - 1 + validImages.length) % validImages.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, validImages.length]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        position: 'relative',
        zIndex: isZooming ? 45 : 1, // Elevate above sibling columns when zooming
      }}
    >
      {/* Main Image Container & Magnifier Lens */}
      <div
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsLightboxOpen(true)}
        style={{
          borderRadius: '24px',
          overflow: 'hidden',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E7E5E4',
          boxShadow: isZooming
            ? '0 12px 32px rgba(217, 119, 6, 0.12), 0 4px 16px rgba(0,0,0,0.06)'
            : '0 8px 24px rgba(0,0,0,0.06)',
          aspectRatio: '1/1',
          position: 'relative',
          cursor: isZooming ? 'crosshair' : 'zoom-in',
          userSelect: 'none',
          transition: 'box-shadow 0.25s ease',
        }}
      >
        {/* Main Product Image */}
        <img
          ref={mainImageRef}
          src={currentImage}
          alt={productName}
          onLoad={updateDimensionsAndMode}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: zoomMode === 'inner' && isZooming ? 'none' : 'transform 0.25s ease-out',
            willChange: 'transform',
          }}
        />

        {/* Flipkart Translucent Magnifier Lens */}
        {zoomMode === 'side' && isZooming && (
          <div
            ref={lensRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              pointerEvents: 'none',
              backgroundColor: 'rgba(245, 158, 11, 0.18)', // Madhuvan Honey amber tint
              border: '1.5px solid #D97706',
              boxShadow: '0 0 14px rgba(217, 119, 6, 0.35), inset 0 0 10px rgba(255, 255, 255, 0.25)',
              borderRadius: '8px',
              zIndex: 20,
              willChange: 'transform',
            }}
          />
        )}

        {/* "Roll over image to zoom in" Helper Pill (Flipkart style) */}
        <div
          style={{
            position: 'absolute',
            bottom: '14px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(17, 24, 39, 0.78)',
            backdropFilter: 'blur(8px)',
            color: '#FFFFFF',
            padding: '6px 14px',
            borderRadius: '9999px',
            fontSize: '0.78rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            pointerEvents: 'none',
            transition: 'opacity 0.2s ease, transform 0.2s ease',
            opacity: isZooming ? 0 : 1,
            zIndex: 15,
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
            whiteSpace: 'nowrap',
          }}
        >
          <ZoomIn size={14} color="#F59E0B" />
          <span>Roll over image to zoom in</span>
        </div>

        {/* Expand / Lightbox Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsLightboxOpen(true);
          }}
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 15,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#FFFFFF';
            e.currentTarget.style.transform = 'scale(1.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.92)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          title="Click to view full screen"
          aria-label="View Fullscreen"
        >
          <Maximize2 size={16} color="#44403C" />
        </button>

        {/* Image Counter Badge if multiple images */}
        {validImages.length > 1 && (
          <div
            style={{
              position: 'absolute',
              top: '14px',
              left: '14px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(8px)',
              color: '#44403C',
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              fontWeight: 700,
              zIndex: 15,
              border: '1px solid rgba(0, 0, 0, 0.06)',
            }}
          >
            {activeImage + 1} / {validImages.length}
          </div>
        )}
      </div>

      {/* ==============================================================
          FLIPKART SIDE-BY-SIDE FLOATING ZOOM PREVIEW WINDOW
          Appears adjacent to the main product card on desktop
          ============================================================== */}
      {zoomMode === 'side' && isZooming && (
        <div
          style={{
            position: 'absolute',
            left: 'calc(100% + 24px)',
            top: 0,
            width: '100%',
            height: `${boundsRef.current.containerHeight || 480}px`,
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            overflow: 'hidden',
            border: '1px solid #E7E5E4',
            boxShadow:
              '0 24px 50px -12px rgba(0, 0, 0, 0.25), 0 8px 24px -4px rgba(217, 119, 6, 0.12)',
            zIndex: 60,
            pointerEvents: 'none',
          }}
        >
          {/* Zoomed high-res image */}
          <img
            ref={zoomImageRef}
            src={currentImage}
            alt={`${productName} zoomed`}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              maxWidth: 'none',
              maxHeight: 'none',
              display: 'block',
              willChange: 'transform',
            }}
          />

          {/* Ultra-HD magnification indicator pill */}
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              right: '12px',
              backgroundColor: 'rgba(12, 10, 8, 0.82)',
              backdropFilter: 'blur(8px)',
              color: '#FFFFFF',
              padding: '4px 12px',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
          >
            <Sparkles size={13} color="#F59E0B" />
            <span>2.5X ULTRA-HD ZOOM</span>
          </div>
        </div>
      )}

      {/* ==============================================================
          THUMBNAILS STRIP (Flipkart hover & click instant switch)
          ============================================================== */}
      {validImages.length > 1 && (
        <div
          className="flex items-center gap-2 flex-wrap"
          style={{ paddingTop: '0.25rem' }}
        >
          {validImages.map((img, idx) => {
            const isActive = activeImage === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImage(idx)}
                onMouseEnter={() => setActiveImage(idx)} // Instant switch on hover like Flipkart!
                style={{
                  width: 'clamp(62px, 16vw, 76px)',
                  height: 'clamp(62px, 16vw, 76px)',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  border: isActive ? '2px solid #D97706' : '1px solid #E7E5E4',
                  boxShadow: isActive
                    ? '0 0 0 3px rgba(217, 119, 6, 0.28), 0 4px 10px rgba(217, 119, 6, 0.15)'
                    : 'none',
                  padding: '2px',
                  background: '#FFFFFF',
                  cursor: 'pointer',
                  opacity: isActive ? 1 : 0.68,
                  transform: isActive ? 'scale(1.04)' : 'scale(1)',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  flexShrink: 0,
                  outline: 'none',
                }}
                title={`View ${productName} image ${idx + 1}`}
              >
                <img
                  src={img}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '10px',
                    display: 'block',
                  }}
                />
              </button>
            );
          })}
        </div>
      )}

      {/* ==============================================================
          FULLSCREEN LIGHTBOX MODAL (On click / expand)
          ============================================================== */}
      {isLightboxOpen && (
        <div
          onClick={() => setIsLightboxOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(10, 8, 6, 0.94)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          {/* Top Bar with Title and Close Button */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              top: '20px',
              left: '24px',
              right: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#FFFFFF',
              zIndex: 1010,
            }}
          >
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 700 }}>{productName}</div>
              <div style={{ fontSize: '0.8rem', color: '#A8A29E' }}>
                Image {activeImage + 1} of {validImages.length}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.6)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)')}
              aria-label="Close Fullscreen"
            >
              <X size={20} />
            </button>
          </div>

          {/* Centered Large Image */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90vw',
              maxHeight: '75vh',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={currentImage}
              alt={productName}
              style={{
                maxWidth: '90vw',
                maxHeight: '75vh',
                objectFit: 'contain',
                borderRadius: '16px',
                boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
              }}
            />

            {/* Prev Image Arrow */}
            {validImages.length > 1 && (
              <button
                type="button"
                onClick={() => setActiveImage((prev) => (prev - 1 + validImages.length) % validImages.length)}
                style={{
                  position: 'absolute',
                  left: '-60px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#D97706')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)')}
                aria-label="Previous Image"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {/* Next Image Arrow */}
            {validImages.length > 1 && (
              <button
                type="button"
                onClick={() => setActiveImage((prev) => (prev + 1) % validImages.length)}
                style={{
                  position: 'absolute',
                  right: '-60px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#D97706')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)')}
                aria-label="Next Image"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>

          {/* Bottom Thumbnails Strip in Lightbox */}
          {validImages.length > 1 && (
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'absolute',
                bottom: '24px',
                display: 'flex',
                gap: '12px',
                padding: '8px 16px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(12px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            >
              {validImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(idx)}
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    border: activeImage === idx ? '2px solid #F59E0B' : '1px solid transparent',
                    opacity: activeImage === idx ? 1 : 0.6,
                    padding: 0,
                    background: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <img src={img} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
