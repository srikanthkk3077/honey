import React, { useState } from 'react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName }) => {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Main Image */}
      <div
        style={{
          borderRadius: '24px',
          overflow: 'hidden',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E7E5E4',
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
          aspectRatio: '1/1',
          position: 'relative',
        }}
      >
        <img
          src={images[activeImage] || images[0]}
          alt={productName}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex items-center gap-2 flex-wrap">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveImage(idx)}
              style={{
                width: 'clamp(56px, 16vw, 74px)',
                height: 'clamp(56px, 16vw, 74px)',
                borderRadius: '12px',
                overflow: 'hidden',
                border: activeImage === idx ? '2px solid #D97706' : '1px solid #E7E5E4',
                padding: '2px',
                background: '#FFFFFF',
                cursor: 'pointer',
                opacity: activeImage === idx ? 1 : 0.65,
                transition: 'all 0.2s',
                flexShrink: 0,
              }}
            >
              <img src={img} alt={`${productName} thumbnail ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
