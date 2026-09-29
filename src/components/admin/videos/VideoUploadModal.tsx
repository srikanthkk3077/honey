import React, { useState, useRef } from 'react';
import { useStore } from '../../../store/store';
import { VideoItem, VideoCategory } from '../../../types/video.types';
import { Input } from '../../common/Input';
import { Button } from '../../common/Button';
import { Upload, Film, Link as LinkIcon, Image, CheckCircle, Video } from 'lucide-react';

interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: VideoItem;
}

export const VideoUploadModal: React.FC<VideoUploadModalProps> = ({ isOpen, onClose, initialData }) => {
  const { products, addVideo, updateVideo } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [videoUrl, setVideoUrl] = useState(initialData?.videoUrl || '');
  const [thumbnailUrl, setThumbnailUrl] = useState(
    initialData?.thumbnailUrl || 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80'
  );
  const [category, setCategory] = useState<VideoCategory>(initialData?.category || 'harvest');
  const [duration, setDuration] = useState(initialData?.duration || '0:45');
  const [taggedProductId, setTaggedProductId] = useState(initialData?.taggedProductId || '');
  const [featuredOnHome, setFeaturedOnHome] = useState(initialData?.featuredOnHome ?? true);
  const [fileName, setFileName] = useState('');
  const [previewError, setPreviewError] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      // Create local object URL for preview and playback
      const objectUrl = URL.createObjectURL(file);
      setVideoUrl(objectUrl);
      setPreviewError('');

      // Auto set a reasonable title if title is empty
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !videoUrl.trim()) {
      setPreviewError('Please provide both a video title and a video source.');
      return;
    }

    const selectedProduct = products.find((p) => p.id === taggedProductId);

    const videoData = {
      title,
      description,
      videoUrl,
      thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
      category,
      duration: duration || '0:30',
      taggedProductId: selectedProduct ? selectedProduct.id : undefined,
      taggedProductName: selectedProduct ? selectedProduct.name : undefined,
      taggedProductSlug: selectedProduct ? selectedProduct.slug : undefined,
      featuredOnHome,
    };

    if (initialData) {
      updateVideo(initialData.id, videoData);
    } else {
      addVideo(videoData);
    }

    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          overflowY: 'auto',
          boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
          padding: '2rem',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#1C1917', margin: '0 0 0.25rem 0' }}>
            {initialData ? 'Edit Harvest Video' : 'Upload New Apiary Video Reel'}
          </h2>
          <p style={{ color: '#78716C', fontSize: '0.88rem', margin: 0 }}>
            Upload raw harvest footage, purity test demonstrations, or beekeeper stories.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Upload Method Switcher */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#44403C', marginBottom: '0.5rem' }}>
              Video Source Method:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setUploadMode('file')}
                style={{
                  padding: '0.75rem',
                  borderRadius: '12px',
                  border: uploadMode === 'file' ? '2px solid #D97706' : '1px solid #D6D3D1',
                  background: uploadMode === 'file' ? '#FEF3C7' : '#FFFFFF',
                  color: uploadMode === 'file' ? '#92400E' : '#57534E',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                }}
              >
                <Upload size={18} />
                <span>Upload Video File (MP4/WebM)</span>
              </button>

              <button
                type="button"
                onClick={() => setUploadMode('url')}
                style={{
                  padding: '0.75rem',
                  borderRadius: '12px',
                  border: uploadMode === 'url' ? '2px solid #D97706' : '1px solid #D6D3D1',
                  background: uploadMode === 'url' ? '#FEF3C7' : '#FFFFFF',
                  color: uploadMode === 'url' ? '#92400E' : '#57534E',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                }}
              >
                <LinkIcon size={18} />
                <span>Video URL / Web Link</span>
              </button>
            </div>
          </div>

          {/* Mode 1: File Uploader */}
          {uploadMode === 'file' ? (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/webm,video/ogg,video/quicktime"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed #D97706',
                  borderRadius: '16px',
                  backgroundColor: '#FFFBEB',
                  padding: '2rem 1.5rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
              >
                <Video size={36} color="#D97706" style={{ margin: '0 auto 0.75rem auto' }} />
                <div style={{ fontWeight: 700, color: '#92400E', fontSize: '1rem', marginBottom: '0.25rem' }}>
                  {fileName ? `Selected: ${fileName}` : 'Click to Browse Video from Computer'}
                </div>
                <p style={{ color: '#78716C', fontSize: '0.8rem', margin: 0 }}>
                  Supports MP4, WebM, MOV video files. Immediate live preview available.
                </p>
              </div>
            </div>
          ) : (
            /* Mode 2: URL Input */
            <Input
              label="Direct Video URL (MP4 or Embed)"
              required
              placeholder="e.g. https://domain.com/video.mp4"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              leftIcon={<Film size={16} />}
              helperText="You can paste direct MP4/WebM URLs or YouTube/Vimeo video links"
            />
          )}

          {/* Video Preview if URL is set */}
          {videoUrl && (
            <div style={{ borderRadius: '12px', overflow: 'hidden', backgroundColor: '#000', maxHeight: '180px' }}>
              <video src={videoUrl} controls style={{ width: '100%', height: '180px', objectFit: 'contain' }} />
            </div>
          )}

          {/* Title & Duration */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
            <Input
              label="Video Title"
              required
              placeholder="e.g. Traditional Sundarbans Comb Harvest"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <Input
              label="Duration"
              placeholder="0:45"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>

          {/* Category & Tagged Product */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#44403C', marginBottom: '0.35rem' }}>
                Reel Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as VideoCategory)}
                style={{ width: '100%', padding: '0.65rem 0.95rem', borderRadius: '10px', border: '1px solid #D6D3D1', outline: 'none', background: '#FFFFFF' }}
              >
                <option value="harvest">Wild Apiary Harvest</option>
                <option value="purity">NMR Purity Test</option>
                <option value="recipe">Ayurvedic Recipe & Tonics</option>
                <option value="story">Nomadic Beekeeper Story</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#44403C', marginBottom: '0.35rem' }}>
                Tag Honey Product (Optional)
              </label>
              <select
                value={taggedProductId}
                onChange={(e) => setTaggedProductId(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.95rem', borderRadius: '10px', border: '1px solid #D6D3D1', outline: 'none', background: '#FFFFFF' }}
              >
                <option value="">-- No Tagged Product --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Thumbnail Image URL */}
          <Input
            label="Cover Poster Image URL"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            leftIcon={<Image size={16} />}
            helperText="Thumbnail shown in video cards before playback"
          />

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#44403C', marginBottom: '0.35rem' }}>
              Video Description / Caption
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What happens in this video? E.g., Watch Mowals harvest wild honeycomb..."
              style={{ width: '100%', padding: '0.65rem 0.95rem', borderRadius: '10px', border: '1px solid #D6D3D1', outline: 'none', fontFamily: 'inherit' }}
            />
          </div>

          {/* Feature on Home toggle */}
          <label className="flex items-center gap-2" style={{ cursor: 'pointer', fontSize: '0.9rem' }}>
            <input
              type="checkbox"
              checked={featuredOnHome}
              onChange={(e) => setFeaturedOnHome(e.target.checked)}
              style={{ accentColor: '#D97706', width: '16px', height: '16px' }}
            />
            <span>Feature prominently on Storefront Home Page</span>
          </label>

          {previewError && (
            <div style={{ color: '#DC2626', fontSize: '0.85rem' }}>{previewError}</div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3" style={{ borderTop: '1px solid #E7E5E4', paddingTop: '1.25rem' }}>
            <Button variant="ghost" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="md">
              {initialData ? 'Save Video Changes' : 'Publish Video to Store'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
