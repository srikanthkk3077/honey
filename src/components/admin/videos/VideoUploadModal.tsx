import React, { useState, useRef } from 'react';
import { useStore } from '../../../store/store';
import { VideoItem, VideoCategory } from '../../../types/video.types';
import { Input } from '../../common/Input';
import { Button } from '../../common/Button';
import {
  Upload,
  Film,
  Link as LinkIcon,
  Image as ImageIcon,
  CheckCircle,
  Video,
  Loader2,
  UploadCloud,
  X,
  AlertCircle,
} from 'lucide-react';
import { uploadImage, uploadVideo } from '../../../services/uploadApi';

interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: VideoItem;
}

export const VideoUploadModal: React.FC<VideoUploadModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const { products, addVideo, updateVideo } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const posterInputRef = useRef<HTMLInputElement>(null);

  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [videoUrl, setVideoUrl] = useState(initialData?.videoUrl || '');
  const [thumbnailUrl, setThumbnailUrl] = useState(
    initialData?.thumbnailUrl ||
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'
  );
  const [category, setCategory] = useState<VideoCategory>(initialData?.category || 'harvest');
  const [duration, setDuration] = useState(initialData?.duration || '0:45');
  const [taggedProductId, setTaggedProductId] = useState(initialData?.taggedProductId || '');
  const [featuredOnHome, setFeaturedOnHome] = useState(initialData?.featuredOnHome ?? true);
  const [fileName, setFileName] = useState('');
  const [previewError, setPreviewError] = useState('');
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoUploadStatus, setVideoUploadStatus] = useState<string | null>(null);

  // Poster upload state
  const [isUploadingPoster, setIsUploadingPoster] = useState(false);
  const [showPosterUrlInput, setShowPosterUrlInput] = useState(false);
  const [posterUploadError, setPosterUploadError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setPreviewError('');

    // Instant local preview while uploading
    const objectUrl = URL.createObjectURL(file);
    setVideoUrl(objectUrl);

    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    }

    setIsUploadingVideo(true);
    setVideoUploadStatus('Uploading & optimizing video via Cloudinary...');

    try {
      const { videoUrl: cdnUrl, posterUrl: autoPoster } = await uploadVideo(file);
      setVideoUrl(cdnUrl);
      if (autoPoster && (!thumbnailUrl || thumbnailUrl.includes('unsplash.com'))) {
        setThumbnailUrl(autoPoster);
      }
      setVideoUploadStatus(null);
    } catch (err: any) {
      console.error('Video upload failed:', err);
      setPreviewError(err.message || 'Failed to upload video to Cloudinary. Local preview active.');
      setVideoUploadStatus(null);
    } finally {
      setIsUploadingVideo(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handlePosterFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPosterUploadError('Please select a valid image file (PNG, JPG, WEBP, AVIF).');
      return;
    }

    setPosterUploadError(null);
    setIsUploadingPoster(true);
    try {
      const url = await uploadImage(file);
      setThumbnailUrl(url);
    } catch (err: any) {
      setPosterUploadError(err.message || 'Failed to upload cover poster image');
    } finally {
      setIsUploadingPoster(false);
      if (posterInputRef.current) {
        posterInputRef.current.value = '';
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
      thumbnailUrl:
        thumbnailUrl ||
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
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
        padding: 'clamp(0.5rem, 2vw, 1.5rem)',
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
          padding: 'clamp(1rem, 3.5vw, 2rem)',
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
            <label
              style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#44403C',
                marginBottom: '0.5rem',
              }}
            >
              Video Source Method:
            </label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
                gap: '0.75rem',
              }}
            >
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
                {isUploadingVideo ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <Loader2 size={32} color="#D97706" style={{ animation: 'spin 1s linear infinite' }} />
                    <div style={{ fontWeight: 700, color: '#92400E', fontSize: '0.95rem' }}>
                      {videoUploadStatus || 'Uploading to Cloudinary...'}
                    </div>
                    <p style={{ color: '#78716C', fontSize: '0.78rem', margin: 0 }}>
                      Processing video streaming and auto-generating cover thumbnail
                    </p>
                  </div>
                ) : (
                  <>
                    <div style={{ fontWeight: 700, color: '#92400E', fontSize: '1rem', marginBottom: '0.25rem' }}>
                      {fileName ? `Selected: ${fileName} (Cloudinary Ready)` : 'Click to Browse Video from Computer'}
                    </div>
                    <p style={{ color: '#78716C', fontSize: '0.8rem', margin: 0 }}>
                      Supports MP4, WebM, MOV. Auto-compressed and delivered via Cloudinary CDN.
                    </p>
                  </>
                )}
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
            <div
              style={{
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: '#000',
                maxHeight: '180px',
              }}
            >
              <video src={videoUrl} controls style={{ width: '100%', height: '180px', objectFit: 'contain' }} />
            </div>
          )}

          {/* Title & Duration */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
              gap: '1rem',
            }}
          >
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
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
              gap: '1rem',
            }}
          >
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#44403C',
                  marginBottom: '0.35rem',
                }}
              >
                Reel Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as VideoCategory)}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '0.65rem 0.95rem',
                  borderRadius: '10px',
                  border: '1px solid #D6D3D1',
                  outline: 'none',
                  background: '#FFFFFF',
                }}
              >
                <option value="harvest">Wild Apiary Harvest</option>
                <option value="purity">NMR Purity Test</option>
                <option value="recipe">Ayurvedic Recipe & Tonics</option>
                <option value="story">Nomadic Beekeeper Story</option>
              </select>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#44403C',
                  marginBottom: '0.35rem',
                }}
              >
                Tag Honey Product (Optional)
              </label>
              <select
                value={taggedProductId}
                onChange={(e) => setTaggedProductId(e.target.value)}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '0.65rem 0.95rem',
                  borderRadius: '10px',
                  border: '1px solid #D6D3D1',
                  outline: 'none',
                  background: '#FFFFFF',
                }}
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

          {/* Cover Poster Image Upload Section */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.4rem',
              }}
            >
              <label
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#44403C',
                }}
              >
                Cover Poster Image
              </label>
              <button
                type="button"
                onClick={() => setShowPosterUrlInput(!showPosterUrlInput)}
                style={{
                  fontSize: '0.78rem',
                  color: '#D97706',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: 600,
                }}
              >
                <LinkIcon size={12} />
                {showPosterUrlInput ? 'Use file uploader' : 'Paste poster link instead'}
              </button>
            </div>

            <input
              ref={posterInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp,image/avif"
              onChange={handlePosterFileChange}
              style={{ display: 'none' }}
            />

            {!showPosterUrlInput ? (
              <div
                onClick={() => !isUploadingPoster && posterInputRef.current?.click()}
                style={{
                  border: '2px dashed #CBD5E1',
                  borderRadius: '12px',
                  backgroundColor: '#F8FAFC',
                  padding: '1.25rem',
                  textAlign: 'center',
                  cursor: isUploadingPoster ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.borderColor = '#D97706')}
                onMouseOut={(e) => (e.currentTarget.style.borderColor = '#CBD5E1')}
              >
                {isUploadingPoster ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#92400E', fontWeight: 600 }}>
                    <Loader2 size={20} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                    <span>Uploading cover image...</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <UploadCloud size={24} color="#D97706" />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 600, color: '#1C1917', fontSize: '0.9rem' }}>
                        Click to upload cover poster from computer
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                        PNG, JPG, WEBP up to 20MB (Shown in video cards before playback)
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Input
                label=""
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                leftIcon={<ImageIcon size={16} />}
                helperText="Thumbnail shown in video cards before playback"
              />
            )}

            {posterUploadError && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#DC2626',
                  fontSize: '0.8rem',
                  marginTop: '0.35rem',
                }}
              >
                <AlertCircle size={14} />
                <span>{posterUploadError}</span>
              </div>
            )}

            {/* Poster Preview Card */}
            {thumbnailUrl && (
              <div
                style={{
                  marginTop: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px',
                  borderRadius: '12px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                }}
              >
                <img
                  src={thumbnailUrl}
                  alt="Poster preview"
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '8px',
                    objectFit: 'cover',
                    flexShrink: 0,
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80';
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1C1917' }}>
                    Current Cover Poster
                  </div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: '#64748B',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {thumbnailUrl}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => posterInputRef.current?.click()}
                  style={{
                    fontSize: '0.78rem',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    backgroundColor: '#FEF3C7',
                    color: '#92400E',
                    border: '1px solid #FDE68A',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Change
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#44403C',
                marginBottom: '0.35rem',
              }}
            >
              Video Description / Caption
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What happens in this video? E.g., Watch Mowals harvest wild honeycomb..."
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '0.65rem 0.95rem',
                borderRadius: '10px',
                border: '1px solid #D6D3D1',
                outline: 'none',
                fontFamily: 'inherit',
              }}
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
            <span>Feature in &ldquo;Live Harvest Stories &amp; Purity Reels&rdquo; on Home Page</span>
          </label>

          {previewError && (
            <div style={{ color: '#DC2626', fontSize: '0.85rem' }}>{previewError}</div>
          )}

          {/* Form Actions */}
          <div
            className="flex items-center justify-end gap-3 flex-wrap"
            style={{ borderTop: '1px solid #E7E5E4', paddingTop: '1.25rem' }}
          >
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
