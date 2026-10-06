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
} from 'lucide-react';
import { useStore } from '../../../store/store';
import { HeroConfig, HeroBadge, DEFAULT_HERO_CONFIG } from '../../../types/customer.types';
import { uploadImage, uploadVideo } from '../../../services/uploadApi';
import { Button } from '../../common/Button';
import { Input } from '../../common/Input';

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
  const [activeTab, setActiveTab] = useState<'content' | 'actions' | 'media' | 'badges' | 'style'>('content');

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

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

  const handleResetToDefault = () => {
    if (window.confirm('Reset Hero configuration to original design values?')) {
      setForm(DEFAULT_HERO_CONFIG);
      showToast('Hero config reset to defaults (click Save to publish)', 'info');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateHeroConfig(form);
      showToast('Hero page settings saved and published successfully!', 'success');
    } catch (err: any) {
      console.error('Hero update error:', err);
      showToast('Failed to save Hero settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

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
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: 600 }}>
            <Eye size={15} color="#F59E0B" />
            <span>Live Real-Time Hero Preview</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#A8A29E' }}>
            Updates instantly as you type below
          </span>
        </div>

        {/* Scaled Preview Frame */}
        <div
          style={{
            position: 'relative',
            backgroundColor: form.backgroundColor || '#FDDCC3',
            padding: '2.5rem 2rem',
            overflow: 'hidden',
            minHeight: '380px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {/* Right-Side Full Bleed Cover Preview */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: '58%',
              height: '100%',
              overflow: 'hidden',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          >
            <img
              src={form.heroImageUrl || '/images/brand/hero_illustration_feathered.png'}
              alt="Preview Cover"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center center',
                display: 'block',
              }}
            />
            {/* Multi-Stop Total Gradient Cover Overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `
                  linear-gradient(to right,
                    ${form.backgroundColor || '#FDDCC3'} 0%,
                    ${form.backgroundColor || '#FDDCC3'} 10%,
                    rgba(253, 220, 195, 0.94) 22%,
                    rgba(253, 220, 195, 0.65) 40%,
                    rgba(253, 220, 195, 0.2) 60%,
                    transparent 80%
                  ),
                  radial-gradient(circle at 0% 100%,
                    ${form.backgroundColor || '#FDDCC3'} 0%,
                    rgba(253, 220, 195, 0.88) 28%,
                    transparent 60%
                  ),
                  linear-gradient(to top, rgba(253, 220, 195, 0.45) 0%, transparent 16%),
                  linear-gradient(to bottom, rgba(253, 220, 195, 0.45) 0%, transparent 16%)
                `,
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
                  color: '#9E4616',
                  marginBottom: '0.5rem',
                }}
              >
                {form.eyebrow || 'FROM FOREST TO FAMILY'}
              </div>

              <div
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: '2.1rem',
                  fontWeight: 700,
                  lineHeight: 1.15,
                  color: '#2C150A',
                  marginBottom: '0.75rem',
                }}
              >
                <div>{form.titleLine1 || 'More Than Honey'}</div>
                <div>{form.titleLine2 || 'A Healthier Lifestyle'}</div>
              </div>

              <div
                style={{
                  fontSize: '0.92rem',
                  color: '#553725',
                  lineHeight: 1.5,
                  marginBottom: '1.5rem',
                  maxWidth: '440px',
                }}
              >
                {form.subtitle || "Pure honey, collected from forest flowers for your family's better health."}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.75rem' }}>
                <span
                  style={{
                    backgroundColor: '#4A1F0A',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    padding: '8px 18px',
                    borderRadius: '9999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  {form.primaryCtaText || 'SHOP RAW HONEY'} <ArrowRight size={13} />
                </span>

                {form.secondaryCtaText && (
                  <span
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.45)',
                      border: '1.5px solid rgba(138, 70, 32, 0.35)',
                      color: '#381B0E',
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
                        backgroundColor: '#381B0E',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FDDCC3',
                      }}
                    >
                      <Play size={8} fill="#FDDCC3" />
                    </span>
                    {form.secondaryCtaText || 'Watch Our Story'}
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
                          border: '1px solid rgba(154, 70, 22, 0.4)',
                          backgroundColor: 'rgba(255, 255, 255, 0.42)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#8A3E15',
                        }}
                      >
                        <Wheat size={14} />
                      </div>
                      <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#462717', maxWidth: '70px', lineHeight: 1.2 }}>
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
                    backgroundColor: 'rgba(253, 237, 219, 0.95)',
                    border: '1px solid #C47942',
                    borderRadius: '50px',
                    padding: '6px 14px',
                    transform: 'rotate(-4deg)',
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontStyle: 'italic',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#8C4318',
                    whiteSpace: 'pre-line',
                    boxShadow: '0 8px 18px rgba(138, 70, 32, 0.18)',
                  }}
                >
                  {form.calloutBadgeText || 'Pure Honey\nStronger Communities'}
                </div>
              )}
            </div>
          </div>
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
              placeholder="e.g. FROM FOREST TO FAMILY"
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
