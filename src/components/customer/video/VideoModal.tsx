import React, { useEffect, useRef } from 'react';
import { VideoItem } from '../../../types/video.types';
import { X, Eye, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../../store/store';
import { Button } from '../../common/Button';

interface VideoModalProps {
  video: VideoItem | null;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ video, onClose }) => {
  const { incrementVideoViews, getProductById } = useStore();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (video) {
      document.body.style.overflow = 'hidden';
      incrementVideoViews(video.id);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [video?.id]);

  if (!video) return null;

  const taggedProduct = video.taggedProductId ? getProductById(video.taggedProductId) : undefined;
  const isEmbed = video.videoUrl.includes('youtube.com') || video.videoUrl.includes('youtu.be') || video.videoUrl.includes('vimeo.com');

  return (
    <div
      className="video-modal-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(15, 12, 8, 0.88)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(0.5rem, 2vw, 1.5rem)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '820px',
          backgroundColor: '#1C1917',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'fadeInUp 0.25s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#181511',
          }}
        >
          <div className="flex items-center gap-2">
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Madhuvan Reel • {video.category}
            </span>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#FFFFFF',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Video Player Screen */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: '#000000' }}>
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
              controls
              autoPlay
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          )}
        </div>

        {/* Video Information & Tagged Product Banner */}
        <div style={{ padding: 'clamp(1rem, 3vw, 1.5rem)', display: 'flex', flexDirection: 'column', gap: '1rem', color: '#FFFFFF' }}>
          <div>
            <div className="flex items-center justify-between gap-4" style={{ marginBottom: '0.5rem' }}>
              <h3 style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.25rem)', color: '#FFFFFF', margin: 0 }}>
                {video.title}
              </h3>
              <div className="flex items-center gap-1" style={{ fontSize: '0.8rem', color: '#A8A29E', flexShrink: 0 }}>
                <Eye size={14} /> {video.views} plays
              </div>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#D6D3D1', lineHeight: 1.6, margin: 0 }}>
              {video.description}
            </p>
          </div>

          {/* Tagged Product Pill */}
          {taggedProduct && (
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                borderRadius: '16px',
                padding: '0.75rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}
            >
              <div className="flex items-center gap-3">
                <img
                  src={taggedProduct.images[0]}
                  alt={taggedProduct.name}
                  style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#FBBF24', fontWeight: 600 }}>FEATURED IN THIS VIDEO</div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#FFFFFF' }}>{taggedProduct.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#D6D3D1' }}>Purity: {taggedProduct.purityScore}% NMR Verified</div>
                </div>
              </div>

              <Link to={`/product/${taggedProduct.slug}`} onClick={onClose}>
                <Button size="sm" rightIcon={<ArrowRight size={14} />}>
                  Shop This Honey
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
