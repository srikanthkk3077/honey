import React, { useState, useRef } from 'react';
import { SliderItem, SliderMediaType } from '../../../types/slider.types';
import { Input } from '../../common/Input';
import { Button } from '../../common/Button';
import {
  Upload,
  Link as LinkIcon,
  Video,
  Image as ImageIcon,
  Loader2,
  UploadCloud,
  AlertCircle,
  Play,
} from 'lucide-react';
import { uploadImage, uploadVideo } from '../../../services/uploadApi';

interface SliderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<SliderItem>) => Promise<any>;
  initialData?: SliderItem;
}

export const SliderModal: React.FC<SliderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const videoInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const mobileImageInputRef = useRef<HTMLInputElement>(null);

  const [mediaType, setMediaType] = useState<SliderMediaType>(initialData?.mediaType || 'video');
  const [videoSourceMode, setVideoSourceMode] = useState<'file' | 'url'>('url');
  const [title, setTitle] = useState(initialData?.title || '');
  const [subtitle, setSubtitle] = useState(initialData?.subtitle || '');
  const [badge, setBadge] = useState(initialData?.badge || '100% RAW & UNHEATED • SINGLE-ORIGIN');
  const [imageUrl, setImageUrl] = useState(
    initialData?.imageUrl ||
      'https://res.cloudinary.com/kisnodzz/image/upload/v1791042834/madhuvan_honey/sliders/cbv03eqxofw3ja6dxast.jpg'
  );
  const [mobileImageUrl, setMobileImageUrl] = useState(initialData?.mobileImageUrl || '');
  const [videoUrl, setVideoUrl] = useState(initialData?.videoUrl || '');
  const [linkUrl, setLinkUrl] = useState(initialData?.linkUrl || '/shop');
  const [ctaText, setCtaText] = useState(initialData?.ctaText || 'Explore Pure Honey');
  const [secondaryCtaText, setSecondaryCtaText] = useState(initialData?.secondaryCtaText || '');
  const [secondaryCtaLink, setSecondaryCtaLink] = useState(initialData?.secondaryCtaLink || '/videos');
  const [order, setOrder] = useState<number>(initialData?.order || 1);
  const [isActive, setIsActive] = useState<boolean>(initialData?.isActive !== false);

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingMobileImage, setIsUploadingMobileImage] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoUploadStatus, setVideoUploadStatus] = useState<string | null>(null);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [mobileImageUploadError, setMobileImageUploadError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setFormError('Please select a valid video file (MP4, WebM, MOV).');
      return;
    }

    setFormError(null);
    setIsUploadingVideo(true);
    setVideoUploadStatus('Uploading & optimizing video via Cloudinary CDN...');

    // Temporary preview
    const localUrl = URL.createObjectURL(file);
    setVideoUrl(localUrl);

    try {
      const { videoUrl: cdnUrl, posterUrl } = await uploadVideo(file);
      setVideoUrl(cdnUrl);
      if (posterUrl && (!imageUrl || imageUrl.includes('unsplash.com'))) {
        setImageUrl(posterUrl);
      }
      setVideoUploadStatus(null);
    } catch (err: any) {
      console.error('Slider video upload failed:', err);
      setFormError(err.message || 'Failed to upload video to Cloudinary. Please try again.');
      setVideoUploadStatus(null);
      setVideoUrl(''); // Never retain local blob on failure
    } finally {
      setIsUploadingVideo(false);
      if (videoInputRef.current) {
        videoInputRef.current.value = '';
      }
    }
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageUploadError('Please select a valid image file (PNG, JPG, WEBP, AVIF).');
      return;
    }

    setImageUploadError(null);
    setIsUploadingImage(true);
    try {
      const url = await uploadImage(file);
      setImageUrl(url);
    } catch (err: any) {
      setImageUploadError(err.message || 'Failed to upload background image');
    } finally {
      setIsUploadingImage(false);
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
    }
  };

  const handleMobileImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMobileImageUploadError('Please select a valid image file (PNG, JPG, WEBP, AVIF).');
      return;
    }

    setMobileImageUploadError(null);
    setIsUploadingMobileImage(true);
    try {
      const url = await uploadImage(file);
      setMobileImageUrl(url);
    } catch (err: any) {
      setMobileImageUploadError(err.message || 'Failed to upload mobile image');
    } finally {
      setIsUploadingMobileImage(false);
      if (mobileImageInputRef.current) {
        mobileImageInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isUploadingVideo) {
      setFormError('Please wait for video upload to Cloudinary to complete before saving.');
      return;
    }
    if (isUploadingImage) {
      setFormError('Please wait for image upload to Cloudinary to complete before saving.');
      return;
    }
    if (isUploadingMobileImage) {
      setFormError('Please wait for mobile image upload to Cloudinary to complete before saving.');
      return;
    }
    if (!title.trim()) {
      setFormError('Slide Headline / Title is required.');
      return;
    }
    if (!imageUrl.trim()) {
      setFormError('A background / poster image is required for this slide.');
      return;
    }
    if (mediaType === 'video' && !videoUrl.trim()) {
      setFormError('Please provide a video file or video URL, or switch Media Type to Image.');
      return;
    }
    if (mediaType === 'video' && videoUrl.startsWith('blob:')) {
      setFormError('Video is still uploading or failed to reach Cloudinary. Please wait or re-select.');
      return;
    }

    setFormError(null);
    setIsSubmitting(true);
    try {
      await onSubmit({
        title,
        subtitle,
        badge,
        mediaType,
        imageUrl,
        mobileImageUrl: mobileImageUrl.trim() || undefined,
        videoUrl: mediaType === 'video' ? videoUrl : '',
        linkUrl: linkUrl || '/shop',
        ctaText: ctaText || 'Explore Pure Honey',
        secondaryCtaText,
        secondaryCtaLink: secondaryCtaText ? secondaryCtaLink || '/videos' : '',
        order: Number(order) || 1,
        isActive,
      });
      onClose();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save slider');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(6px)',
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
          maxWidth: '740px',
          maxHeight: '92vh',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          overflowY: 'auto',
          boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
          padding: 'clamp(1.25rem, 3.5vw, 2.25rem)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#1C1917', margin: '0 0 0.35rem 0' }}>
            {initialData ? 'Edit Home Hero Slider' : 'Add New Home Hero Slider'}
          </h2>
          <p style={{ color: '#78716C', fontSize: '0.88rem', margin: 0 }}>
            Configure full-screen top banner sliders with background video loops or photography, headlines, and primary actions.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Media Type Switcher */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#44403C', marginBottom: '0.45rem' }}>
              Slide Media Background Type:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setMediaType('video')}
                style={{
                  padding: '0.75rem',
                  borderRadius: '12px',
                  border: mediaType === 'video' ? '2px solid #D97706' : '1px solid #D6D3D1',
                  background: mediaType === 'video' ? '#FEF3C7' : '#FFFFFF',
                  color: mediaType === 'video' ? '#92400E' : '#57534E',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                }}
              >
                <Video size={18} />
                <span>Ambient Video Loop</span>
              </button>

              <button
                type="button"
                onClick={() => setMediaType('image')}
                style={{
                  padding: '0.75rem',
                  borderRadius: '12px',
                  border: mediaType === 'image' ? '2px solid #D97706' : '1px solid #D6D3D1',
                  background: mediaType === 'image' ? '#FEF3C7' : '#FFFFFF',
                  color: mediaType === 'image' ? '#92400E' : '#57534E',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                }}
              >
                <ImageIcon size={18} />
                <span>High-Resolution Photo</span>
              </button>
            </div>
          </div>

          {/* If Video: Video Source & Preview */}
          {mediaType === 'video' && (
            <div
              style={{
                backgroundColor: '#FFFBEB',
                border: '1px solid #FDE68A',
                borderRadius: '16px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.9rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#92400E' }}>
                  Video Source:
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setVideoSourceMode('file')}
                    style={{
                      fontSize: '0.78rem',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: videoSourceMode === 'file' ? '1px solid #D97706' : '1px solid #D6D3D1',
                      background: videoSourceMode === 'file' ? '#D97706' : '#FFFFFF',
                      color: videoSourceMode === 'file' ? '#FFFFFF' : '#44403C',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setVideoSourceMode('url')}
                    style={{
                      fontSize: '0.78rem',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: videoSourceMode === 'url' ? '1px solid #D97706' : '1px solid #D6D3D1',
                      background: videoSourceMode === 'url' ? '#D97706' : '#FFFFFF',
                      color: videoSourceMode === 'url' ? '#FFFFFF' : '#44403C',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Video URL
                  </button>
                </div>
              </div>

              {videoSourceMode === 'file' ? (
                <div>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/mp4,video/webm,video/ogg,video/mov"
                    onChange={handleVideoFileChange}
                    style={{ display: 'none' }}
                  />
                  <div
                    onClick={() => !isUploadingVideo && videoInputRef.current?.click()}
                    style={{
                      border: isUploadingVideo ? '2px dashed #059669' : '2px dashed #D97706',
                      borderRadius: '12px',
                      backgroundColor: isUploadingVideo ? '#ECFDF5' : '#FFFFFF',
                      padding: '1.25rem',
                      textAlign: 'center',
                      cursor: isUploadingVideo ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {isUploadingVideo ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                        <Loader2 size={24} className="animate-spin" color="#059669" />
                        <div style={{ fontWeight: 600, color: '#065F46', fontSize: '0.9rem' }}>
                          {videoUploadStatus || 'Uploading & optimizing video via Cloudinary CDN...'}
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload size={24} color="#D97706" style={{ margin: '0 auto 0.5rem auto' }} />
                        <div style={{ fontWeight: 600, color: '#92400E', fontSize: '0.9rem' }}>
                          Click to choose video from computer (MP4, WebM)
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#78716C', marginTop: '2px' }}>
                          Auto-uploaded and compressed on Cloudinary CDN
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <Input
                  label="Direct MP4 / WebM URL"
                  placeholder="https://res.cloudinary.com/...mp4 or cdn link"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  leftIcon={<LinkIcon size={16} />}
                />
              )}

              {videoUrl && (
                <div style={{ borderRadius: '10px', overflow: 'hidden', backgroundColor: '#000', maxHeight: '160px' }}>
                  <video src={videoUrl} controls style={{ width: '100%', height: '160px', objectFit: 'contain' }} />
                </div>
              )}
            </div>
          )}          {/* Background / Poster Image Upload (Laptop & Mobile) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            {/* 1. Desktop Image */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>💻</span>
                  <span>{mediaType === 'video' ? 'Laptop Video Poster / Fallback Image' : 'Laptop / Desktop Background Photography'}</span>
                </label>
                <span style={{ fontSize: '0.72rem', color: '#64748B', backgroundColor: '#E2E8F0', padding: '2px 6px', borderRadius: '4px' }}>
                  Landscape / 16:9
                </span>
              </div>

              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                style={{ display: 'none' }}
              />

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <Input
                    placeholder="Paste Cloudinary or web image URL"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    leftIcon={<ImageIcon size={16} />}
                  />
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => imageInputRef.current?.click()}
                  disabled={isUploadingImage}
                  leftIcon={isUploadingImage ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                >
                  {isUploadingImage ? 'Uploading...' : 'Browse Laptop Image'}
                </Button>
              </div>

              {imageUploadError && (
                <div style={{ color: '#DC2626', fontSize: '0.8rem', marginTop: '0.35rem' }}>
                  {imageUploadError}
                </div>
              )}

              {imageUrl && (
                <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img
                    src={imageUrl}
                    alt="Laptop Slide preview"
                    style={{ width: '100px', height: '56px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #CBD5E1' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://res.cloudinary.com/kisnodzz/image/upload/v1791042834/madhuvan_honey/sliders/cbv03eqxofw3ja6dxast.jpg';
                    }}
                  />
                  <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                    Laptop / Desktop Preview (Used in main banner and thumbnail navigation)
                  </span>
                </div>
              )}
            </div>

            {/* 2. Mobile Image */}
            <div style={{ paddingTop: '0.75rem', borderTop: '1px dashed #CBD5E1' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>📱</span>
                  <span>Mobile Phone View Image (Optional / Custom)</span>
                </label>
                {mobileImageUrl ? (
                  <span style={{ fontSize: '0.72rem', color: '#047857', backgroundColor: '#D1FAE5', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                    ✓ Custom Mobile Set
                  </span>
                ) : (
                  <span style={{ fontSize: '0.72rem', color: '#64748B', backgroundColor: '#E2E8F0', padding: '2px 6px', borderRadius: '4px' }}>
                    Uses Laptop Fallback
                  </span>
                )}
              </div>

              <input
                ref={mobileImageInputRef}
                type="file"
                accept="image/*"
                onChange={handleMobileImageFileChange}
                style={{ display: 'none' }}
              />

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <Input
                    placeholder="Optional: Paste mobile-optimized image URL"
                    value={mobileImageUrl}
                    onChange={(e) => setMobileImageUrl(e.target.value)}
                    leftIcon={<ImageIcon size={16} />}
                  />
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => mobileImageInputRef.current?.click()}
                  disabled={isUploadingMobileImage}
                  leftIcon={isUploadingMobileImage ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                >
                  {isUploadingMobileImage ? 'Uploading...' : 'Browse Mobile Image'}
                </Button>
                {mobileImageUrl && (
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={() => setMobileImageUrl('')}
                  >
                    Clear
                  </Button>
                )}
              </div>

              {mobileImageUploadError && (
                <div style={{ color: '#DC2626', fontSize: '0.8rem', marginTop: '0.35rem' }}>
                  {mobileImageUploadError}
                </div>
              )}

              <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '56px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {mobileImageUrl ? (
                    <img
                      src={mobileImageUrl}
                      alt="Mobile preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <img
                      src={imageUrl}
                      alt="Laptop fallback preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }}
                    />
                  )}
                </div>
                <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                  {mobileImageUrl
                    ? 'Showing custom mobile portrait image on mobile view.'
                    : 'If empty, mobile devices automatically display your Laptop / Desktop image.'}
                </span>
              </div>
            </div>
          </div>

          {/* Eyebrow Badge & Order */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
            <Input
              label="Eyebrow Badge Tag"
              placeholder="e.g. 100% RAW & UNHEATED • SINGLE-ORIGIN"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
            />
            <Input
              label="Display Order"
              type="number"
              min="1"
              value={order.toString()}
              onChange={(e) => setOrder(parseInt(e.target.value, 10) || 1)}
            />
          </div>

          {/* Headline / Title */}
          <Input
            label="Hero Headline / Title *"
            required
            placeholder="e.g. Taste the Liquid Gold of Virgin Forests"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Subtitle / Description */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#44403C', marginBottom: '0.35rem' }}>
              Slide Subtitle / Description
            </label>
            <textarea
              rows={2}
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Direct from wild Sundarbans mangroves..."
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '0.65rem 0.95rem',
                borderRadius: '10px',
                border: '1px solid #D6D3D1',
                outline: 'none',
                fontFamily: 'inherit',
                fontSize: '0.9rem',
              }}
            />
          </div>

          {/* Primary CTA Button */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input
              label="Primary Button Text"
              placeholder="e.g. Explore Pure Honey"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
            />
            <Input
              label="Primary Button Link"
              placeholder="e.g. /shop"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
            />
          </div>

          {/* Secondary CTA Button (Optional) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input
              label="Secondary Button Text (Optional)"
              placeholder="e.g. Watch Harvest Stories"
              value={secondaryCtaText}
              onChange={(e) => setSecondaryCtaText(e.target.value)}
            />
            <Input
              label="Secondary Button Link"
              placeholder="e.g. /videos"
              value={secondaryCtaLink}
              onChange={(e) => setSecondaryCtaLink(e.target.value)}
            />
          </div>

          {/* Active Status Checkbox */}
          <label className="flex items-center gap-2" style={{ cursor: 'pointer', fontSize: '0.9rem' }}>
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              style={{ accentColor: '#D97706', width: '16px', height: '16px' }}
            />
            <span style={{ fontWeight: 600, color: '#1C1917' }}>
              Active (Visible in Home Page Hero Carousel)
            </span>
          </label>

          {formError && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#DC2626',
                backgroundColor: '#FEF2F2',
                padding: '0.75rem',
                borderRadius: '10px',
                fontSize: '0.85rem',
              }}
            >
              <AlertCircle size={16} />
              <span>{formError}</span>
            </div>
          )}

          {/* Actions */}
          <div
            className="flex items-center justify-end gap-3 flex-wrap"
            style={{ borderTop: '1px solid #E7E5E4', paddingTop: '1.25rem' }}
          >
            <Button variant="ghost" type="button" onClick={onClose} disabled={isSubmitting || isUploadingVideo || isUploadingImage}>
              Cancel
            </Button>
            <Button type="submit" size="md" disabled={isSubmitting || isUploadingVideo || isUploadingImage}>
              {isUploadingVideo
                ? 'Uploading Video to Cloudinary...'
                : isUploadingImage
                ? 'Uploading Image to Cloudinary...'
                : isSubmitting
                ? 'Saving...'
                : initialData
                ? 'Save Slider Changes'
                : 'Publish Hero Slider'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
