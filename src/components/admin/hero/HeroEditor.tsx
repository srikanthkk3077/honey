import React, { useState, useEffect, useRef } from 'react';
import {
  Save,
  RotateCcw,
  Upload,
  Link as LinkIcon,
  Video,
  Image as ImageIcon,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Wheat,
  Ban,
  FlaskConical,
  Users,
  Leaf,
  ShieldCheck,
  Eye,
  Loader2,
  ArrowRight,
  Play,
  Plus,
  Trash2,
  GripVertical,
} from 'lucide-react';
import { useStore } from '../../../store/store';
import { HeroConfig, HeroBadge, HeroBannerSlide, DEFAULT_HERO_CONFIG } from '../../../types/customer.types';
import { uploadImage, uploadVideo, uploadBase64Image } from '../../../services/uploadApi';
import { Button } from '../../common/Button';
import { Input } from '../../common/Input';
import { isDarkColor, getSlideGradientMask } from '../../../utils/color';

const AVAILABLE_ICONS = [
  { value: 'natural', label: 'Wheat / Natural', icon: <Wheat size={16} /> },
  { value: 'no-sugar', label: 'No Sugar / Ban', icon: <Ban size={16} /> },
  { value: 'beekeepers', label: 'Beekeepers / People', icon: <Users size={16} /> },
  { value: 'leaf', label: 'Leaf / Organic', icon: <Leaf size={16} /> },
  { value: 'shield', label: 'Shield / Pure', icon: <ShieldCheck size={16} /> },
];

const PRESET_BG_COLORS = [
  { label: 'Artisanal Peach Cream (Default)', value: '#FDDCC3' },
  { label: 'Warm Honey Ivory', value: '#FAF4EC' },
  { label: 'Golden Nectar Sand', value: '#FCE0C9' },
  { label: 'Subtle Forest Linen', value: '#F7EFE4' },
];

export const HeroEditor: React.FC = () => {
  const { settings, updateHeroConfig, showToast } = useStore();
  const currentHero = settings.heroConfig || DEFAULT_HERO_CONFIG;

  const [form, setForm] = useState<HeroConfig>(() => ({
    ...DEFAULT_HERO_CONFIG,
    ...currentHero,
  }));

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isUploadingBannerImage, setIsUploadingBannerImage] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'actions' | 'media' | 'badges' | 'style' | 'banners'>('banners');
  const [previewSlideIdx, setPreviewSlideIdx] = useState(0);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const bannerSlideImageRef = useRef<HTMLInputElement>(null);
  const uploadingSlideIndexRef = useRef<number>(-1);

  // Sync state when settings change
  useEffect(() => {
    if (settings.heroConfig) {
      setForm((prev) => ({
        ...prev,
        ...settings.heroConfig,
      }));
    }
  }, [settings.heroConfig]);

  const handleChange = (field: keyof HeroConfig, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleBadgeChange = (index: number, updates: Partial<HeroBadge>) => {
    setForm((prev) => {
      const newBadges = [...(prev.trustBadges || DEFAULT_HERO_CONFIG.trustBadges)];
      newBadges[index] = { ...newBadges[index], ...updates };
      return { ...prev, trustBadges: newBadges };
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WEBP)', 'error');
      return;
    }

    setIsUploadingImage(true);
    try {
      const url = await uploadImage(file);
      handleChange('heroImageUrl', url);
      showToast('Hero artwork uploaded to Cloudinary CDN!', 'success');
    } catch (err: any) {
      console.error('Image upload failed:', err);
      showToast(err.message || 'Image upload failed', 'error');
    } finally {
      setIsUploadingImage(false);
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      showToast('Please select a valid video file (MP4, WebM)', 'error');
      return;
    }

    setIsUploadingVideo(true);
    try {
      const { videoUrl } = await uploadVideo(file);
      handleChange('storyVideoUrl', videoUrl);
      showToast('Story video uploaded to Cloudinary CDN!', 'success');
    } catch (err: any) {
      console.error('Video upload failed:', err);
      showToast(err.message || 'Video upload failed', 'error');
    } finally {
      setIsUploadingVideo(false);
      if (videoInputRef.current) videoInputRef.current.value = '';
    }
  };

  // ── Banner Slides (multi-image hero slider) handlers ──────────────────────
  const handleBannerSlideImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const idx = uploadingSlideIndexRef.current;
    if (!file || idx < 0) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file', 'error');
      return;
    }
    setIsUploadingBannerImage(idx);
    try {
      const url = await uploadImage(file);
      setForm((prev) => {
        const slides = [...(prev.heroBannerSlides || [])];
        slides[idx] = { ...slides[idx], imageUrl: url };
        return { ...prev, heroBannerSlides: slides };
      });
      showToast('Banner image uploaded!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Upload failed', 'error');
    } finally {
      setIsUploadingBannerImage(null);
      uploadingSlideIndexRef.current = -1;
      if (bannerSlideImageRef.current) bannerSlideImageRef.current.value = '';
    }
  };

  const addBannerSlide = () => {
    const slides = form.heroBannerSlides || [];
    const newSlide: HeroBannerSlide = {
      id: `slide-${Date.now()}`,
      imageUrl: form.heroImageUrl || '/images/brand/hero_illustration_feathered.png',
      titleLine1: '',
      titleLine2: '',
      subtitle: '',
      eyebrow: '',
      primaryCtaText: '',
      primaryCtaLink: '',
      secondaryCtaText: '',
      secondaryCtaLink: '',
      backgroundColor: form.backgroundColor || '#FDDCC3',
      isActive: true,
      order: slides.length + 1,
    };
    setForm((prev) => ({ ...prev, heroBannerSlides: [...(prev.heroBannerSlides || []), newSlide] }));
  };

  const removeBannerSlide = (idx: number) => {
    setForm((prev) => {
      const slides = [...(prev.heroBannerSlides || [])];
      slides.splice(idx, 1);
      return { ...prev, heroBannerSlides: slides.map((s, i) => ({ ...s, order: i + 1 })) };
    });
  };

  const updateBannerSlide = (idx: number, updates: Partial<HeroBannerSlide>) => {
    setForm((prev) => {
      const slides = [...(prev.heroBannerSlides || [])];
      slides[idx] = { ...slides[idx], ...updates };
      return { ...prev, heroBannerSlides: slides };
    });
  };

  const moveBannerSlide = (idx: number, direction: 'up' | 'down') => {
    setForm((prev) => {
      const slides = [...(prev.heroBannerSlides || [])];
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= slides.length) return prev;
      const temp = slides[idx];
      slides[idx] = slides[targetIdx];
      slides[targetIdx] = temp;
      return {
        ...prev,
        heroBannerSlides: slides.map((s, i) => ({ ...s, order: i + 1 })),
      };
    });
  };

  const handleResetToDefault = () => {
    if (window.confirm('Reset Hero configuration to original design values?')) {
      setForm(DEFAULT_HERO_CONFIG);
      showToast('Hero config reset to defaults (click Save to publish)', 'info');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let heroImage = form.heroImageUrl;
      if (heroImage && heroImage.startsWith('data:image/')) {
        try {
          const cdnUrl = await uploadBase64Image(heroImage);
          if (cdnUrl && !cdnUrl.startsWith('data:')) {
            heroImage = cdnUrl;
          }
        } catch (e: any) {
          console.warn('Could not upload hero image base64:', e);
          throw new Error(`Hero artwork upload failed: ${e?.message || 'Invalid image file'}`);
        }
      }

      let updatedSlides = form.heroBannerSlides ? [...form.heroBannerSlides] : [];
      if (updatedSlides.length > 0) {
        for (let i = 0; i < updatedSlides.length; i++) {
          const slide = updatedSlides[i];
          if (slide.imageUrl && slide.imageUrl.startsWith('data:image/')) {
            try {
              const cdnUrl = await uploadBase64Image(slide.imageUrl);
              if (cdnUrl && !cdnUrl.startsWith('data:')) {
                updatedSlides[i] = { ...slide, imageUrl: cdnUrl };
              } else {
                throw new Error(`Cloud storage upload failed for Slide #${i + 1}. Please click "Upload Image" to re-upload.`);
              }
            } catch (err: any) {
              throw new Error(`Slide #${i + 1} upload failed: ${err?.message || 'Invalid or corrupted image data'}`);
            }
          }
        }
      }

      const finalForm: HeroConfig = {
        ...form,
        heroImageUrl: heroImage,
        heroBannerSlides: updatedSlides,
      };

      setForm(finalForm);
      await updateHeroConfig(finalForm);
      showToast('Hero page settings saved and published successfully!', 'success');
    } catch (err: any) {
      console.error('Hero update error:', err);
      showToast(err?.message || 'Failed to save Hero settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // ── Active banner slides for live preview ──
  const allBannerSlides = (form.heroBannerSlides || []).filter((s) => s.isActive !== false);
  const totalBannerSlides = allBannerSlides.length;
  const currentPreviewSlide = totalBannerSlides > 0 ? allBannerSlides[previewSlideIdx % totalBannerSlides] : null;

  const previewImage = currentPreviewSlide?.imageUrl || form.heroImageUrl || '/images/brand/hero_illustration_feathered.png';
  const previewEyebrow = (currentPreviewSlide?.eyebrow && currentPreviewSlide.eyebrow.trim())
    ? currentPreviewSlide.eyebrow
    : (form.eyebrow || 'PURE HONEY, NATURE’S GENUINE GIFT');
  const previewTitle1 = (currentPreviewSlide?.titleLine1 && currentPreviewSlide.titleLine1.trim())
    ? currentPreviewSlide.titleLine1
    : (form.titleLine1 || 'More Than Honey');
  const previewTitle2 = (currentPreviewSlide?.titleLine2 !== undefined && currentPreviewSlide.titleLine2.trim() !== '')
    ? currentPreviewSlide.titleLine2
    : (form.titleLine2 !== undefined ? form.titleLine2 : 'A Healthier Lifestyle');
  const previewSubtitle = (currentPreviewSlide?.subtitle && currentPreviewSlide.subtitle.trim())
    ? currentPreviewSlide.subtitle
    : (form.subtitle || "Pure honey, collected from forest flowers for your family's better health.");
  const previewPrimaryCta = (currentPreviewSlide?.primaryCtaText && currentPreviewSlide.primaryCtaText.trim())
    ? currentPreviewSlide.primaryCtaText
    : (form.primaryCtaText || 'SHOP RAW HONEY');
  const previewSecondaryCta = (currentPreviewSlide?.secondaryCtaText && currentPreviewSlide.secondaryCtaText.trim())
    ? currentPreviewSlide.secondaryCtaText
    : (form.secondaryCtaText || 'Watch Our Story');
  const previewBgColor = (currentPreviewSlide?.backgroundColor && currentPreviewSlide.backgroundColor.trim())
    ? currentPreviewSlide.backgroundColor
    : (form.backgroundColor || '#FDDCC3');
  const isPreviewDark = isDarkColor(previewBgColor);
  const previewGradientMask = getSlideGradientMask(previewBgColor);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* ── Top Header Actions Bar ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          backgroundColor: '#FFFFFF',
          padding: '1.25rem 1.5rem',
          borderRadius: '16px',
          border: '1px solid #E7E5E4',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.4rem' }}>🍯</span>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1C1917', margin: 0 }}>
              Hero Page Customizer
            </h2>
            <span
              style={{
                fontSize: '0.72rem',
                backgroundColor: '#FEF3C7',
                color: '#92400E',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '9999px',
                textTransform: 'uppercase',
              }}
            >
              Artisanal Layout
            </span>
          </div>
          <p style={{ color: '#78716C', fontSize: '0.86rem', margin: '4px 0 0 0' }}>
            Fully control headlines, trust badges, buttons, artwork, and story video displayed at the top of the Home page.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.55rem 1rem',
              backgroundColor: '#F5F5F4',
              color: '#44403C',
              fontSize: '0.88rem',
              fontWeight: 600,
              borderRadius: '10px',
              textDecoration: 'none',
              border: '1px solid #E7E5E4',
            }}
          >
            <ExternalLink size={15} />
            <span>View Live Home</span>
          </a>

          <button
            type="button"
            onClick={handleResetToDefault}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.55rem 1rem',
              backgroundColor: '#FFFFFF',
              color: '#78716C',
              fontSize: '0.88rem',
              fontWeight: 600,
              borderRadius: '10px',
              border: '1px solid #E7E5E4',
              cursor: 'pointer',
            }}
            title="Reset to original reference values"
          >
            <RotateCcw size={15} />
            <span>Reset</span>
          </button>

          <Button
            size="md"
            leftIcon={isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Publishing...' : 'Save & Publish Hero'}
          </Button>
        </div>
      </div>

      {/* ── Interactive Live Preview Box ── */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '18px',
          border: '1px solid #E7E5E4',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        }}
      >
        <div
          style={{
            padding: '0.75rem 1.25rem',
            backgroundColor: '#181511',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: 600 }}>
            <Eye size={15} color="#F59E0B" />
            <span>Live Real-Time Hero Preview</span>
            {totalBannerSlides > 1 && (
              <span style={{ fontSize: '0.74rem', backgroundColor: '#D97706', color: '#FFFFFF', padding: '2px 8px', borderRadius: '6px' }}>
                Previewing Slide #{((previewSlideIdx % totalBannerSlides) + 1)} of {totalBannerSlides}
              </span>
            )}
          </div>

          {/* Quick slide switcher in preview header */}
          {totalBannerSlides > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.74rem', color: '#A8A29E' }}>Switch Slide:</span>
              {allBannerSlides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPreviewSlideIdx(i)}
                  style={{
                    padding: '2px 8px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    borderRadius: '4px',
                    border: '1px solid',
                    borderColor: (previewSlideIdx % totalBannerSlides) === i ? '#F59E0B' : '#44403C',
                    backgroundColor: (previewSlideIdx % totalBannerSlides) === i ? '#F59E0B' : '#292524',
                    color: (previewSlideIdx % totalBannerSlides) === i ? '#1C1917' : '#D6D3D1',
                    cursor: 'pointer',
                  }}
                >
                  Slide #{i + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Scaled Preview Frame */}
        <div
          style={{
            position: 'relative',
            backgroundColor: previewBgColor,
            transition: 'background-color 0.4s ease',
            padding: '2.5rem 2rem',
            overflow: 'hidden',
            minHeight: '380px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {/* Full-Bleed Cover Preview */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          >
            <img
              key={`preview-img-${previewSlideIdx}`}
              src={previewImage}
              alt="Preview Cover"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center center',
                display: 'block',
              }}
            />
            {/* Dynamic Color-Matched Gradient Blend Overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: previewGradientMask,
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* Botanical Accent Preview */}
          {form.showBotanicalAccent && (
            <img
              src="/images/brand/botanical_corner_clean.png"
              alt=""
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                height: '140px',
                width: 'auto',
                pointerEvents: 'none',
                opacity: 0.9,
                filter: isPreviewDark ? 'brightness(0.95) drop-shadow(0 4px 12px rgba(0,0,0,0.5))' : 'none',
                objectFit: 'contain',
                objectPosition: 'bottom left',
                zIndex: 2,
              }}
            />
          )}

          <div
            style={{
              position: 'relative',
              zIndex: 3,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              alignItems: 'center',
              gap: '2rem',
              maxWidth: '1100px',
              width: '100%',
              margin: '0 auto',
            }}
          >
            {/* Left Content */}
            <div style={{ maxWidth: '480px' }}>
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: isPreviewDark ? '#F59E0B' : '#9E4616',
                  marginBottom: '0.5rem',
                  transition: 'color 0.3s ease',
                }}
              >
                {previewEyebrow}
              </div>

              <div
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: '2.1rem',
                  fontWeight: 700,
                  lineHeight: 1.15,
                  color: isPreviewDark ? '#FFFFFF' : '#2C150A',
                  marginBottom: '0.75rem',
                  textShadow: isPreviewDark ? '0 2px 12px rgba(0,0,0,0.4)' : 'none',
                  transition: 'color 0.3s ease',
                }}
              >
                <div>{previewTitle1}</div>
                <div style={{ color: isPreviewDark ? '#FFFBEB' : '#2C150A' }}>{previewTitle2}</div>
              </div>

              <div
                style={{
                  fontSize: '0.92rem',
                  color: isPreviewDark ? '#F5EBE1' : '#553725',
                  lineHeight: 1.5,
                  marginBottom: '1.5rem',
                  maxWidth: '440px',
                  transition: 'color 0.3s ease',
                }}
              >
                {previewSubtitle}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.75rem' }}>
                <span
                  style={{
                    backgroundColor: isPreviewDark ? '#F59E0B' : '#4A1F0A',
                    color: isPreviewDark ? '#1C1917' : '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    padding: '8px 18px',
                    borderRadius: '9999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: isPreviewDark ? '0 4px 14px rgba(245, 158, 11, 0.35)' : 'none',
                  }}
                >
                  {previewPrimaryCta} <ArrowRight size={13} />
                </span>

                {previewSecondaryCta && (
                  <span
                    style={{
                      backgroundColor: isPreviewDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(255, 255, 255, 0.45)',
                      border: isPreviewDark ? '1.5px solid rgba(255, 255, 255, 0.4)' : '1.5px solid rgba(138, 70, 32, 0.35)',
                      color: isPreviewDark ? '#FFFFFF' : '#381B0E',
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      padding: '8px 16px',
                      borderRadius: '9999px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        backgroundColor: isPreviewDark ? '#F59E0B' : '#381B0E',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isPreviewDark ? '#1C1917' : '#FDDCC3',
                      }}
                    >
                      <Play size={8} fill={isPreviewDark ? '#1C1917' : '#FDDCC3'} />
                    </span>
                    {previewSecondaryCta}
                  </span>
                )}
              </div>

              {/* Trust Badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {(form.trustBadges || DEFAULT_HERO_CONFIG.trustBadges)
                  .filter((b) => b.isActive)
                  .map((badge) => (
                    <div key={badge.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '4px' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          border: isPreviewDark ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(154, 70, 22, 0.4)',
                          backgroundColor: isPreviewDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(255, 255, 255, 0.42)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isPreviewDark ? '#FBBF24' : '#8A3E15',
                        }}
                      >
                        <Wheat size={14} />
                      </div>
                      <span style={{ fontSize: '0.68rem', fontWeight: 600, color: isPreviewDark ? '#FAF4EC' : '#462717', maxWidth: '70px', lineHeight: 1.2 }}>
                        {badge.label}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Right Visual Floating Callout */}
            <div style={{ position: 'relative', textAlign: 'right', minHeight: '260px' }}>
              {form.showCalloutBadge && (
                <div
                  style={{
                    display: 'inline-block',
                    backgroundColor: isPreviewDark ? 'rgba(28, 14, 8, 0.92)' : 'rgba(253, 237, 219, 0.95)',
                    border: isPreviewDark ? '1px solid #F59E0B' : '1px solid #C47942',
                    borderRadius: '50px',
                    padding: '6px 14px',
                    transform: 'rotate(-4deg)',
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontStyle: 'italic',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: isPreviewDark ? '#FBBF24' : '#8C4318',
                    whiteSpace: 'pre-line',
                    boxShadow: '0 8px 18px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  {form.calloutBadgeText || 'Pure Honey\nStronger Communities'}
                </div>
              )}
            </div>
          </div>

          {/* Multi-Image Preview Dots (if multiple banner slides exist) */}
          {totalBannerSlides > 1 && (
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                left: 0,
                right: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                zIndex: 10,
              }}
            >
              {allBannerSlides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPreviewSlideIdx(i)}
                  style={{
                    width: (previewSlideIdx % totalBannerSlides) === i ? '24px' : '7px',
                    height: '7px',
                    borderRadius: '9999px',
                    border: 'none',
                    backgroundColor: (previewSlideIdx % totalBannerSlides) === i
                      ? '#F59E0B'
                      : (isPreviewDark ? 'rgba(255, 255, 255, 0.35)' : 'rgba(158, 70, 22, 0.35)'),
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    padding: 0,
                  }}
                  title={`Preview Slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Editor Tabs Navigation ── */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid #E7E5E4',
          paddingBottom: '4px',
          flexWrap: 'wrap',
        }}
      >
        {[
          { id: 'banners', label: '🖼️ Banner Images' },
          { id: 'content', label: '1. Titles & Copy' },
          { id: 'actions', label: '2. Buttons & Video' },
          { id: 'media', label: '3. Artwork & Callout' },
          { id: 'badges', label: '4. Trust Badges' },
          { id: 'style', label: '5. Styling & Colors' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '10px 10px 0 0',
                border: 'none',
                backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                color: isActive ? '#B45309' : '#78716C',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.92rem',
                cursor: 'pointer',
                borderBottom: isActive ? '3px solid #D97706' : '3px solid transparent',
                boxShadow: isActive ? '0 -2px 8px rgba(0,0,0,0.03)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Hidden banner slide image input */}
      <input
        type="file"
        ref={bannerSlideImageRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleBannerSlideImageUpload}
      />

      {/* ── Tab 0: Multi-Image Banner Slides ── */}
      {activeTab === 'banners' && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E7E5E4',
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.75rem',
          }}
        >
          {/* Informational Header */}
          <div
            style={{
              padding: '1.25rem 1.5rem',
              borderRadius: '12px',
              backgroundColor: '#FFFBEB',
              border: '1px solid #FDE68A',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '1.2rem' }}>🖼️</span>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#92400E' }}>
                  Hero Banner Multi-Image Slider
                </span>
                <span
                  style={{
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    backgroundColor: (form.heroBannerSlides?.length || 0) > 1 ? '#D97706' : '#E5E7EB',
                    color: (form.heroBannerSlides?.length || 0) > 1 ? '#FFFFFF' : '#4B5563',
                  }}
                >
                  {(form.heroBannerSlides?.length || 0) > 1
                    ? `${form.heroBannerSlides?.length} Images (Slider Mode Active)`
                    : `${form.heroBannerSlides?.length || 0} Images`}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.86rem', color: '#78350F', lineHeight: 1.5 }}>
                Add multiple images to the Hero Banner! When 2 or more images are added, the Hero Banner automatically animates as a slider with smooth transitions, arrows, dot indicators, and auto-play on the live website.
              </p>
            </div>

            <Button
              size="sm"
              leftIcon={<Plus size={16} />}
              onClick={addBannerSlide}
            >
              Add Banner Image
            </Button>
          </div>

          {/* If no slides added yet */}
          {(!form.heroBannerSlides || form.heroBannerSlides.length === 0) ? (
            <div
              style={{
                border: '2px dashed #E7E5E4',
                borderRadius: '14px',
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                backgroundColor: '#FAFAF9',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#FEF3C7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#D97706',
                }}
              >
                <ImageIcon size={28} />
              </div>
              <div style={{ maxWidth: '420px' }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1C1917', marginBottom: '4px' }}>
                  Single Hero Image Currently In Use
                </div>
                <div style={{ fontSize: '0.84rem', color: '#78716C' }}>
                  Currently showing the single hero artwork ({form.heroImageUrl || 'Default image'}). Add multiple images here to enable smooth sliding!
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Sparkles size={15} />}
                  onClick={() => {
                    const firstSlide: HeroBannerSlide = {
                      id: `slide-1`,
                      imageUrl: form.heroImageUrl || '/images/brand/hero_illustration_feathered.png',
                      titleLine1: form.titleLine1 || 'More Than Honey',
                      titleLine2: form.titleLine2 || 'A Healthier Lifestyle',
                      subtitle: form.subtitle || "Pure honey, collected from forest flowers for your family's better health.",
                      eyebrow: form.eyebrow || 'PURE HONEY, NATURE’S GENUINE GIFT',
                      primaryCtaText: form.primaryCtaText || 'SHOP RAW HONEY',
                      primaryCtaLink: form.primaryCtaLink || '/shop',
                      secondaryCtaText: form.secondaryCtaText || 'Watch Our Story',
                      secondaryCtaLink: form.secondaryCtaLink || '/videos',
                      backgroundColor: form.backgroundColor || '#FDDCC3',
                      isActive: true,
                      order: 1,
                    };
                    const secondSlide: HeroBannerSlide = {
                      id: `slide-2`,
                      imageUrl: '/images/brand/hero_sunflower_cover.png',
                      titleLine1: 'Sunflower Honey Harvest',
                      titleLine2: 'Pure Golden Elixir',
                      subtitle: 'Sustainably gathered wild blossom nectar enriched with authentic healing floral pollen.',
                      eyebrow: 'SEASONAL LIMITED EDITION',
                      primaryCtaText: 'DISCOVER HARVEST',
                      primaryCtaLink: '/shop',
                      secondaryCtaText: 'Watch Harvest Video',
                      secondaryCtaLink: '/videos',
                      backgroundColor: '#FAF4EC',
                      isActive: true,
                      order: 2,
                    };
                    setForm((prev) => ({
                      ...prev,
                      heroBannerSlides: [firstSlide, secondSlide],
                    }));
                  }}
                >
                  Create 2-Image Slider Demo
                </Button>
                <Button
                  size="sm"
                  leftIcon={<Plus size={15} />}
                  onClick={addBannerSlide}
                >
                  Add First Banner Image
                </Button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {form.heroBannerSlides.map((slide, idx) => (
                <div
                  key={slide.id}
                  style={{
                    border: '1.5px solid #E7E5E4',
                    borderRadius: '14px',
                    padding: '1.25rem',
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}
                >
                  {/* Card Header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid #F5F5F4',
                      paddingBottom: '0.75rem',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          backgroundColor: '#FEF3C7',
                          color: '#92400E',
                          fontWeight: 800,
                          fontSize: '0.82rem',
                          padding: '3px 10px',
                          borderRadius: '8px',
                        }}
                      >
                        Slide #{idx + 1}
                      </span>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.84rem', fontWeight: 600, color: '#44403C' }}>
                        <input
                          type="checkbox"
                          checked={slide.isActive !== false}
                          onChange={(e) => updateBannerSlide(idx, { isActive: e.target.checked })}
                        />
                        <span>{slide.isActive !== false ? 'Active' : 'Inactive'}</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setPreviewSlideIdx(idx)}
                        style={{
                          fontSize: '0.74rem',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          border: '1px solid #D97706',
                          backgroundColor: (previewSlideIdx % (form.heroBannerSlides?.length || 1)) === idx ? '#D97706' : '#FFFBEB',
                          color: (previewSlideIdx % (form.heroBannerSlides?.length || 1)) === idx ? '#FFFFFF' : '#92400E',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        👁️ Preview Live
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => moveBannerSlide(idx, 'up')}
                        disabled={idx === 0}
                        style={{
                          padding: '4px 8px',
                          fontSize: '0.78rem',
                          borderRadius: '6px',
                          border: '1px solid #E7E5E4',
                          backgroundColor: '#FAFAF9',
                          cursor: idx === 0 ? 'not-allowed' : 'pointer',
                          opacity: idx === 0 ? 0.5 : 1,
                        }}
                        title="Move Up"
                      >
                        ↑ Up
                      </button>
                      <button
                        type="button"
                        onClick={() => moveBannerSlide(idx, 'down')}
                        disabled={idx === (form.heroBannerSlides?.length || 0) - 1}
                        style={{
                          padding: '4px 8px',
                          fontSize: '0.78rem',
                          borderRadius: '6px',
                          border: '1px solid #E7E5E4',
                          backgroundColor: '#FAFAF9',
                          cursor: idx === (form.heroBannerSlides?.length || 0) - 1 ? 'not-allowed' : 'pointer',
                          opacity: idx === (form.heroBannerSlides?.length || 0) - 1 ? 0.5 : 1,
                        }}
                        title="Move Down"
                      >
                        ↓ Down
                      </button>
                      <button
                        type="button"
                        onClick={() => removeBannerSlide(idx)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 10px',
                          fontSize: '0.78rem',
                          borderRadius: '6px',
                          border: '1px solid #FEE2E2',
                          backgroundColor: '#FEF2F2',
                          color: '#DC2626',
                          cursor: 'pointer',
                          fontWeight: 600,
                        }}
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Image Preview & URL / Upload */}
                  <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '1.25rem', alignItems: 'start' }}>
                    <div
                      style={{
                        width: '160px',
                        height: '110px',
                        borderRadius: '10px',
                        backgroundColor: '#FDDCC3',
                        border: '1px solid #E7E5E4',
                        overflow: 'hidden',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {slide.imageUrl ? (
                        <img
                          src={slide.imageUrl}
                          alt={`Slide ${idx + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <ImageIcon size={24} color="#9E4616" />
                      )}
                      {isUploadingBannerImage === idx && (
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFFFFF',
                            fontSize: '0.75rem',
                          }}
                        >
                          <Loader2 size={18} className="animate-spin" />
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#44403C' }}>
                        Banner Slide Image
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <div style={{ flex: 1 }}>
                          <Input
                            value={slide.imageUrl}
                            onChange={(e) => updateBannerSlide(idx, { imageUrl: e.target.value })}
                            placeholder="Enter image URL or upload below"
                          />
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          leftIcon={isUploadingBannerImage === idx ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                          onClick={() => {
                            uploadingSlideIndexRef.current = idx;
                            bannerSlideImageRef.current?.click();
                          }}
                          disabled={isUploadingBannerImage !== null}
                        >
                          {isUploadingBannerImage === idx ? 'Uploading...' : 'Upload Image'}
                        </Button>
                      </div>

                      {/* Quick preset images */}
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.74rem', color: '#78716C' }}>Quick pick:</span>
                        <button
                          type="button"
                          onClick={() => updateBannerSlide(idx, { imageUrl: '/images/brand/hero_illustration_feathered.png' })}
                          style={{
                            fontSize: '0.74rem',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            border: '1px solid #E7E5E4',
                            backgroundColor: '#F5F5F4',
                            cursor: 'pointer',
                          }}
                        >
                          Feathered Forest Artwork
                        </button>
                        <button
                          type="button"
                          onClick={() => updateBannerSlide(idx, { imageUrl: '/images/brand/hero_sunflower_cover.png' })}
                          style={{
                            fontSize: '0.74rem',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            border: '1px solid #E7E5E4',
                            backgroundColor: '#F5F5F4',
                            cursor: 'pointer',
                          }}
                        >
                          Sunflower Honey Harvest
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Slide Configuration Sections */}
                  <div
                    style={{
                      padding: '1.25rem',
                      backgroundColor: '#FAFAF9',
                      borderRadius: '12px',
                      border: '1px solid #E7E5E4',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1.1rem',
                    }}
                  >
                    {/* 1: Titles & Headlines */}
                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#92400E', marginBottom: '0.7rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>✍️</span>
                        <span>Titles & Copy for Slide #{idx + 1}</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                        <div style={{ gridColumn: 'span 2' }}>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#57534E', marginBottom: '3px' }}>
                            Eyebrow Tagline
                          </label>
                          <Input
                            value={slide.eyebrow || ''}
                            onChange={(e) => updateBannerSlide(idx, { eyebrow: e.target.value })}
                            placeholder={form.eyebrow || 'PURE HONEY, NATURE’S GENUINE GIFT'}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#57534E', marginBottom: '3px' }}>
                            Headline Line 1
                          </label>
                          <Input
                            value={slide.titleLine1 || ''}
                            onChange={(e) => updateBannerSlide(idx, { titleLine1: e.target.value })}
                            placeholder={form.titleLine1 || 'More Than Honey'}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#57534E', marginBottom: '3px' }}>
                            Headline Line 2
                          </label>
                          <Input
                            value={slide.titleLine2 || ''}
                            onChange={(e) => updateBannerSlide(idx, { titleLine2: e.target.value })}
                            placeholder={form.titleLine2 || 'A Healthier Lifestyle'}
                          />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#57534E', marginBottom: '3px' }}>
                            Subtitle Description
                          </label>
                          <Input
                            value={slide.subtitle || ''}
                            onChange={(e) => updateBannerSlide(idx, { subtitle: e.target.value })}
                            placeholder={form.subtitle || "Pure honey, collected from forest flowers for your family's better health."}
                          />
                        </div>
                      </div>
                    </div>

                    {/* 2: Action Buttons */}
                    <div style={{ borderTop: '1px solid #E7E5E4', paddingTop: '0.9rem' }}>
                      <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#92400E', marginBottom: '0.7rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>🔘</span>
                        <span>Buttons & Links for Slide #{idx + 1}</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#57534E', marginBottom: '3px' }}>
                            Primary Button Label
                          </label>
                          <Input
                            value={slide.primaryCtaText || ''}
                            onChange={(e) => updateBannerSlide(idx, { primaryCtaText: e.target.value })}
                            placeholder={form.primaryCtaText || 'SHOP RAW HONEY'}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#57534E', marginBottom: '3px' }}>
                            Primary Button Link
                          </label>
                          <Input
                            value={slide.primaryCtaLink || ''}
                            onChange={(e) => updateBannerSlide(idx, { primaryCtaLink: e.target.value })}
                            placeholder={form.primaryCtaLink || '/shop'}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#57534E', marginBottom: '3px' }}>
                            Secondary Button Label
                          </label>
                          <Input
                            value={slide.secondaryCtaText || ''}
                            onChange={(e) => updateBannerSlide(idx, { secondaryCtaText: e.target.value })}
                            placeholder={form.secondaryCtaText || 'Watch Our Story'}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#57534E', marginBottom: '3px' }}>
                            Secondary Button Link (or /videos)
                          </label>
                          <Input
                            value={slide.secondaryCtaLink || ''}
                            onChange={(e) => updateBannerSlide(idx, { secondaryCtaLink: e.target.value })}
                            placeholder={form.secondaryCtaLink || '/videos'}
                          />
                        </div>
                      </div>
                    </div>

                    {/* 3: Slide Style & Background Color */}
                    <div style={{ borderTop: '1px solid #E7E5E4', paddingTop: '0.9rem' }}>
                      <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#92400E', marginBottom: '0.7rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>🎨</span>
                        <span>Slide Style & Background Color</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="color"
                            value={slide.backgroundColor || form.backgroundColor || '#FDDCC3'}
                            onChange={(e) => updateBannerSlide(idx, { backgroundColor: e.target.value })}
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '8px',
                              border: '1.5px solid #D6D3D1',
                              cursor: 'pointer',
                              padding: '2px',
                            }}
                            title="Select Background Color"
                          />
                          <Input
                            value={slide.backgroundColor || ''}
                            onChange={(e) => updateBannerSlide(idx, { backgroundColor: e.target.value })}
                            placeholder={form.backgroundColor || '#FDDCC3'}
                            style={{ width: '120px' }}
                          />
                        </div>

                        {/* Palette Chips */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.74rem', color: '#78716C' }}>Presets:</span>
                          {[
                            { label: 'Honey Peach', color: '#FDDCC3' },
                            { label: 'Warm Cream', color: '#FAF4EC' },
                            { label: 'Amber Warmth', color: '#FCE0C9' },
                            { label: 'Wild Forest', color: '#3A1C0E' },
                            { label: 'Pure White', color: '#FFFFFF' },
                          ].map((preset) => (
                            <button
                              key={preset.color}
                              type="button"
                              onClick={() => updateBannerSlide(idx, { backgroundColor: preset.color })}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '4px 10px',
                                fontSize: '0.76rem',
                                borderRadius: '6px',
                                border: (slide.backgroundColor || form.backgroundColor) === preset.color ? '2px solid #B45309' : '1px solid #E7E5E4',
                                backgroundColor: '#FFFFFF',
                                cursor: 'pointer',
                                fontWeight: (slide.backgroundColor || form.backgroundColor) === preset.color ? 700 : 500,
                              }}
                            >
                              <span
                                style={{
                                  width: '12px',
                                  height: '12px',
                                  borderRadius: '50%',
                                  backgroundColor: preset.color,
                                  border: '1px solid #D6D3D1',
                                  display: 'inline-block',
                                }}
                              />
                              <span>{preset.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Plus size={15} />}
                  onClick={addBannerSlide}
                >
                  + Add Another Banner Image
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Tab 1: Content (Titles & Subtitle) ── */}
      {activeTab === 'content' && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E7E5E4',
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#44403C', marginBottom: '6px' }}>
              Eyebrow Tag (Small Top Label)
            </label>
            <Input
              value={form.eyebrow}
              onChange={(e) => handleChange('eyebrow', e.target.value)}
              placeholder="e.g. PURE HONEY, NATURE’S GENUINE GIFT"
            />
            <span style={{ fontSize: '0.78rem', color: '#78716C', marginTop: '4px', display: 'block' }}>
              Appears in warm terracotta capitals above the main headline.
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#44403C', marginBottom: '6px' }}>
                Headline Line 1
              </label>
              <Input
                value={form.titleLine1}
                onChange={(e) => handleChange('titleLine1', e.target.value)}
                placeholder="e.g. More Than Honey"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#44403C', marginBottom: '6px' }}>
                Headline Line 2
              </label>
              <Input
                value={form.titleLine2}
                onChange={(e) => handleChange('titleLine2', e.target.value)}
                placeholder="e.g. A Healthier Lifestyle"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#44403C', marginBottom: '6px' }}>
              Story Description / Subtitle
            </label>
            <textarea
              rows={3}
              value={form.subtitle}
              onChange={(e) => handleChange('subtitle', e.target.value)}
              placeholder="Pure honey, collected from forest flowers for your family's better health."
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: '1px solid #E7E5E4',
                fontSize: '0.95rem',
                fontFamily: 'inherit',
                color: '#1C1917',
                resize: 'vertical',
                outline: 'none',
              }}
            />
          </div>
        </div>
      )}

      {/* ── Tab 2: Buttons & Video ── */}
      {activeTab === 'actions' && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E7E5E4',
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.75rem',
          }}
        >
          {/* Primary CTA */}
          <div
            style={{
              padding: '1.25rem',
              borderRadius: '12px',
              backgroundColor: '#FAFAF9',
              border: '1px solid #F5F5F4',
            }}
          >
            <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', color: '#1C1917', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#4A1F0A' }} />
              Primary Button (Dark Pill)
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#57534E', marginBottom: '4px' }}>
                  Button Label
                </label>
                <Input
                  value={form.primaryCtaText}
                  onChange={(e) => handleChange('primaryCtaText', e.target.value)}
                  placeholder="e.g. SHOP RAW HONEY"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#57534E', marginBottom: '4px' }}>
                  Target Destination Link
                </label>
                <Input
                  value={form.primaryCtaLink}
                  onChange={(e) => handleChange('primaryCtaLink', e.target.value)}
                  placeholder="e.g. /shop"
                />
              </div>
            </div>
          </div>

          {/* Secondary CTA */}
          <div
            style={{
              padding: '1.25rem',
              borderRadius: '12px',
              backgroundColor: '#FAFAF9',
              border: '1px solid #F5F5F4',
            }}
          >
            <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', color: '#1C1917', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#D97706' }} />
              Secondary Button & Story Video Modal
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#57534E', marginBottom: '4px' }}>
                  Button Label
                </label>
                <Input
                  value={form.secondaryCtaText}
                  onChange={(e) => handleChange('secondaryCtaText', e.target.value)}
                  placeholder="e.g. Watch Our Story"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#57534E', marginBottom: '4px' }}>
                  Fallback Link (if no video modal)
                </label>
                <Input
                  value={form.secondaryCtaLink}
                  onChange={(e) => handleChange('secondaryCtaLink', e.target.value)}
                  placeholder="e.g. /videos"
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#57534E', marginBottom: '6px' }}>
                Story Video URL (Plays in popup modal)
              </label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <Input
                    value={form.storyVideoUrl || ''}
                    onChange={(e) => handleChange('storyVideoUrl', e.target.value)}
                    placeholder="https://res.cloudinary.com/... or MP4 link"
                  />
                </div>
                <input
                  type="file"
                  ref={videoInputRef}
                  accept="video/mp4,video/webm,video/mov"
                  style={{ display: 'none' }}
                  onChange={handleVideoUpload}
                />
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={isUploadingVideo ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  onClick={() => videoInputRef.current?.click()}
                  disabled={isUploadingVideo}
                >
                  {isUploadingVideo ? 'Uploading...' : 'Upload MP4'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 3: Media & Callout ── */}
      {activeTab === 'media' && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E7E5E4',
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.75rem',
          }}
        >
          {/* Illustration Image */}
          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#44403C', marginBottom: '8px' }}>
              Hero Forest & Apiary Illustration Image
            </label>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div
                style={{
                  width: '180px',
                  height: '120px',
                  borderRadius: '12px',
                  border: '1px solid #E7E5E4',
                  backgroundColor: '#FDDCC3',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={form.heroImageUrl || '/images/brand/hero_illustration_feathered.png'}
                  alt="Artwork Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, minWidth: '260px' }}>
                <Input
                  value={form.heroImageUrl}
                  onChange={(e) => handleChange('heroImageUrl', e.target.value)}
                  placeholder="/images/brand/... or Cloudinary URL"
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="file"
                    ref={imageInputRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={isUploadingImage ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    onClick={() => imageInputRef.current?.click()}
                    disabled={isUploadingImage}
                  >
                    {isUploadingImage ? 'Uploading...' : 'Upload New Illustration'}
                  </Button>
                  <button
                    type="button"
                    onClick={() => handleChange('heroImageUrl', '/images/brand/hero_sunflower_cover.png')}
                    style={{
                      padding: '0.45rem 0.85rem',
                      fontSize: '0.82rem',
                      borderRadius: '8px',
                      border: '1px solid #E7E5E4',
                      background: form.heroImageUrl?.includes('hero_sunflower') ? '#FEF3C7' : '#FFFFFF',
                      color: form.heroImageUrl?.includes('hero_sunflower') ? '#92400E' : '#57534E',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    🌻 Sunflower Harvest Cover
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('heroImageUrl', '/images/brand/hero_illustration_feathered.png')}
                    style={{
                      padding: '0.45rem 0.85rem',
                      fontSize: '0.82rem',
                      borderRadius: '8px',
                      border: '1px solid #E7E5E4',
                      background: form.heroImageUrl?.includes('hero_illustration') ? '#FEF3C7' : '#FFFFFF',
                      color: form.heroImageUrl?.includes('hero_illustration') ? '#92400E' : '#57534E',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    🎨 Forest Apiary Illustration
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Callout Speech Bubble */}
          <div
            style={{
              padding: '1.25rem',
              borderRadius: '12px',
              backgroundColor: '#FFFBEB',
              border: '1px solid #FDE68A',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#92400E' }}>
                Hand-Drawn Callout Bubble ("Pure Honey / Stronger Communities")
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={form.showCalloutBadge}
                  onChange={(e) => handleChange('showCalloutBadge', e.target.checked)}
                />
                <span>Show Callout Bubble</span>
              </label>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#78350F', marginBottom: '4px' }}>
                Bubble Text (Use Enter for new line)
              </label>
              <textarea
                rows={2}
                value={form.calloutBadgeText}
                onChange={(e) => handleChange('calloutBadgeText', e.target.value)}
                placeholder={'Pure Honey\nStronger Communities'}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #FCD34D',
                  fontSize: '0.9rem',
                  fontFamily: 'inherit',
                  outline: 'none',
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 4: Trust Badges (The 4 Badges) ── */}
      {activeTab === 'badges' && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E7E5E4',
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          <div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.05rem', color: '#1C1917' }}>
              Bottom Trust Badges Configuration
            </h3>
            <p style={{ margin: 0, fontSize: '0.86rem', color: '#78716C' }}>
              Manage the 4 circular engraved purity badges displayed along the bottom of the hero banner.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {(form.trustBadges || DEFAULT_HERO_CONFIG.trustBadges).map((badge, idx) => (
              <div
                key={badge.id || idx}
                style={{
                  padding: '1.25rem',
                  borderRadius: '12px',
                  border: badge.isActive ? '1.5px solid #FCD34D' : '1px solid #E7E5E4',
                  backgroundColor: badge.isActive ? '#FFFDF7' : '#F5F5F4',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#92400E' }}>
                    Badge #{idx + 1}
                  </span>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={badge.isActive}
                      onChange={(e) => handleBadgeChange(idx, { isActive: e.target.checked })}
                    />
                    <span>Active</span>
                  </label>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#57534E', marginBottom: '4px' }}>
                    Badge Label
                  </label>
                  <Input
                    value={badge.label}
                    onChange={(e) => handleBadgeChange(idx, { label: e.target.value })}
                    placeholder="e.g. 100% Natural"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#57534E', marginBottom: '4px' }}>
                    Icon Style
                  </label>
                  <select
                    value={badge.icon}
                    onChange={(e) => handleBadgeChange(idx, { icon: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #E7E5E4',
                      fontSize: '0.85rem',
                      backgroundColor: '#FFFFFF',
                      outline: 'none',
                    }}
                  >
                    {AVAILABLE_ICONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tab 5: Styling & Colors ── */}
      {activeTab === 'style' && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E7E5E4',
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.75rem',
          }}
        >
          {/* Background Color */}
          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#44403C', marginBottom: '8px' }}>
              Hero Section Background Tone
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <input
                type="color"
                value={form.backgroundColor || '#FDDCC3'}
                onChange={(e) => handleChange('backgroundColor', e.target.value)}
                style={{
                  width: '52px',
                  height: '42px',
                  borderRadius: '8px',
                  border: '1px solid #E7E5E4',
                  cursor: 'pointer',
                  padding: '2px',
                }}
              />
              <Input
                value={form.backgroundColor || '#FDDCC3'}
                onChange={(e) => handleChange('backgroundColor', e.target.value)}
                placeholder="#FDDCC3"
                style={{ width: '140px' }}
              />
            </div>

            {/* Presets */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {PRESET_BG_COLORS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => handleChange('backgroundColor', preset.value)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: form.backgroundColor === preset.value ? '2px solid #D97706' : '1px solid #E7E5E4',
                    backgroundColor: '#FAFAF9',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                  }}
                >
                  <span
                    style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      backgroundColor: preset.value,
                      border: '1px solid rgba(0,0,0,0.1)',
                    }}
                  />
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Botanical Accent Toggle */}
          <div
            style={{
              padding: '1rem',
              borderRadius: '12px',
              backgroundColor: '#FAFAF9',
              border: '1px solid #F5F5F4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#1C1917' }}>
                Bottom-Left Botanical Floral Accent
              </div>
              <div style={{ fontSize: '0.82rem', color: '#78716C', marginTop: '2px' }}>
                Shows the rustic engraved wildflower etching in the bottom-left corner of the hero section.
              </div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={form.showBotanicalAccent}
                onChange={(e) => handleChange('showBotanicalAccent', e.target.checked)}
              />
              <span>Enabled</span>
            </label>
          </div>
        </div>
      )}

      {/* ── Sticky Bottom Action Bar ── */}
      <div
        style={{
          position: 'sticky',
          bottom: '1rem',
          backgroundColor: '#FFFFFF',
          padding: '1rem 1.5rem',
          borderRadius: '14px',
          border: '1px solid #E7E5E4',
          boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 20,
        }}
      >
        <div style={{ fontSize: '0.85rem', color: '#78716C' }}>
          Remember to save your changes to publish them to the live website.
        </div>
        <Button
          size="md"
          leftIcon={isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? 'Publishing...' : 'Save & Publish Hero'}
        </Button>
      </div>
    </div>
  );
};

export default HeroEditor;
