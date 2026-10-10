import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../../store/store';
import {
  ShopConfig,
  DEFAULT_SHOP_CONFIG,
  ShopTrustBadge,
  ShopSidebarPromo,
  ShopBottomTrustItem,
} from '../../../types/customer.types';
import { Button } from '../../common/Button';
import { uploadImage } from '../../../services/uploadApi';
import {
  Save,
  RotateCcw,
  Upload,
  Sparkles,
  Leaf,
  ShieldCheck,
  FlaskConical,
  Truck,
  Droplet,
  Eye,
  Loader2,
  Image as ImageIcon,
  CheckCircle2,
  ExternalLink,
  AlertCircle,
  Check,
} from 'lucide-react';

export const ShopHeroEditor: React.FC = () => {
  const { settings, updateShopConfig, showToast } = useStore();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingBg, setIsUploadingBg] = useState(false);
  const [isUploadingPromo, setIsUploadingPromo] = useState(false);

  const bgInputRef = useRef<HTMLInputElement>(null);
  const promoInputRef = useRef<HTMLInputElement>(null);

  const currentConfig = settings?.shopConfig || DEFAULT_SHOP_CONFIG;

  const [eyebrow, setEyebrow] = useState(currentConfig.eyebrow || 'PURE • NATURAL • RAW');
  const [title, setTitle] = useState(currentConfig.title || 'Our Honey Collection');
  const [subtitle, setSubtitle] = useState(
    currentConfig.subtitle || "Nature’s Finest. Pure Honey, Straight to Your Home."
  );
  const [heroBackgroundImageUrl, setHeroBackgroundImageUrl] = useState(
    currentConfig.heroBackgroundImageUrl ||
    currentConfig.heroGraphicUrl ||
    '/images/shop/shop_hero_bg_jar_forest.jpg'
  );
  const [heroBannerMode, setHeroBannerMode] = useState<'dynamic' | 'static'>(
    currentConfig.heroBannerMode || 'dynamic'
  );
  const [heroBgPosition, setHeroBgPosition] = useState<'right' | 'center' | 'left'>(
    currentConfig.heroBgPosition || 'right'
  );
  const [heroScriptText, setHeroScriptText] = useState(
    currentConfig?.heroScriptText || 'Pure Honey Pure Life'
  );

  // 3 Trust Badges in Hero
  const [trustBadges, setTrustBadges] = useState<ShopTrustBadge[]>(() => {
    return currentConfig.trustBadges?.length === 3
      ? currentConfig.trustBadges
      : DEFAULT_SHOP_CONFIG.trustBadges;
  });

  // Sidebar Promo Card
  const [promo, setPromo] = useState<ShopSidebarPromo>(() => {
    return currentConfig.sidebarPromo || DEFAULT_SHOP_CONFIG.sidebarPromo;
  });

  // Bottom 4 Trust Items
  const [bottomItems, setBottomItems] = useState<ShopBottomTrustItem[]>(() => {
    return currentConfig.bottomTrustItems?.length === 4
      ? currentConfig.bottomTrustItems
      : DEFAULT_SHOP_CONFIG.bottomTrustItems;
  });

  useEffect(() => {
    if (settings?.shopConfig) {
      const c = settings.shopConfig;
      setEyebrow(c.eyebrow || DEFAULT_SHOP_CONFIG.eyebrow);
      setTitle(c.title || DEFAULT_SHOP_CONFIG.title);
      setSubtitle(c.subtitle || DEFAULT_SHOP_CONFIG.subtitle);
      setHeroBackgroundImageUrl(
        c.heroBackgroundImageUrl ||
        c.heroGraphicUrl ||
        DEFAULT_SHOP_CONFIG.heroBackgroundImageUrl ||
        '/images/shop/shop_hero_bg_jar_forest.jpg'
      );
      setHeroBannerMode(c.heroBannerMode || 'dynamic');
      setHeroBgPosition(c.heroBgPosition || 'right');
      setHeroScriptText(c.heroScriptText || DEFAULT_SHOP_CONFIG.heroScriptText);
      if (c.trustBadges?.length === 3) setTrustBadges(c.trustBadges);
      if (c.sidebarPromo) setPromo(c.sidebarPromo);
      if (c.bottomTrustItems?.length === 4) setBottomItems(c.bottomTrustItems);
    }
  }, [settings?.shopConfig]);

  // Handle uploading custom background image
  const handleBgImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WEBP)', 'error');
      return;
    }

    setIsUploadingBg(true);
    try {
      const uploadedUrl = await uploadImage(file);
      if (uploadedUrl) {
        setHeroBackgroundImageUrl(uploadedUrl);
        showToast('Hero background image uploaded successfully!', 'success');
      }
    } catch (err: any) {
      showToast(`Upload failed: ${err?.message || 'Error'}`, 'error');
    } finally {
      setIsUploadingBg(false);
      if (bgInputRef.current) bgInputRef.current.value = '';
    }
  };

  // Handle uploading promo card image
  const handlePromoImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WEBP)', 'error');
      return;
    }

    setIsUploadingPromo(true);
    try {
      const uploadedUrl = await uploadImage(file);
      if (uploadedUrl) {
        setPromo((prev) => ({ ...prev, imageUrl: uploadedUrl }));
        showToast('Sidebar promo image uploaded successfully!', 'success');
      }
    } catch (err: any) {
      showToast(`Upload failed: ${err?.message || 'Error'}`, 'error');
    } finally {
      setIsUploadingPromo(false);
      if (promoInputRef.current) promoInputRef.current.value = '';
    }
  };

  const handleTrustBadgeChange = (
    index: number,
    field: 'title' | 'subtitle',
    value: string
  ) => {
    setTrustBadges((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleBottomItemChange = (
    index: number,
    field: 'title' | 'subtitle',
    value: string
  ) => {
    setBottomItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset Shop Page settings to original clean defaults?')) {
      setEyebrow(DEFAULT_SHOP_CONFIG.eyebrow);
      setTitle(DEFAULT_SHOP_CONFIG.title);
      setSubtitle(DEFAULT_SHOP_CONFIG.subtitle);
      setHeroBackgroundImageUrl('/images/shop/shop_hero_bg_jar_forest.jpg');
      setHeroBannerMode('dynamic');
      setHeroBgPosition('right');
      setHeroScriptText(DEFAULT_SHOP_CONFIG.heroScriptText);
      setTrustBadges(DEFAULT_SHOP_CONFIG.trustBadges);
      setPromo(DEFAULT_SHOP_CONFIG.sidebarPromo);
      setBottomItems(DEFAULT_SHOP_CONFIG.bottomTrustItems);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const newConfig: ShopConfig = {
        eyebrow,
        title,
        subtitle,
        heroGraphicUrl: heroBackgroundImageUrl,
        heroBackgroundImageUrl,
        heroBannerMode,
        heroBgPosition,
        heroScriptText,
        trustBadges,
        sidebarPromo: promo,
        bottomTrustItems: bottomItems,
      };
      await updateShopConfig(newConfig);
      showToast('Shop Honey page settings updated & saved successfully!', 'success');
    } catch (err: any) {
      showToast(`Failed to save: ${err?.message || 'Error'}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Detect if current background image has text baked into it while in dynamic mode
  const hasTextBakedIn =
    heroBannerMode === 'dynamic' &&
    (heroBackgroundImageUrl.includes('shop_hero_banner_clean.png') ||
      heroBackgroundImageUrl.includes('shop_hero_banner.png'));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={bgInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleBgImageUpload}
      />
      <input
        type="file"
        ref={promoInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handlePromoImageUpload}
      />

      {/* ── Header Bar ── */}
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
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.4rem' }}>🍯</span>
            <h2 style={{ margin: 0, fontSize: '1.35rem', color: '#1C1917', fontWeight: 800 }}>
              Shop Honey Page Banner & Elements Customizer
            </h2>
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', color: '#78716C' }}>
            Upload custom background images, switch between dynamic text and full artwork, and customize all shop elements.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <a
            href="/shop"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              border: '1px solid #D6D3D1',
              backgroundColor: '#FFFFFF',
              color: '#57534E',
              fontSize: '0.84rem',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ExternalLink size={14} />
            <span>View Storefront</span>
          </a>

          <button
            type="button"
            onClick={handleResetDefaults}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              border: '1px solid #D6D3D1',
              backgroundColor: '#FFFFFF',
              color: '#57534E',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <RotateCcw size={14} />
            <span>Reset Defaults</span>
          </button>

          <Button
            size="md"
            onClick={handleSave}
            isLoading={isSaving}
            leftIcon={<Save size={16} />}
          >
            Save Shop Page Settings
          </Button>
        </div>
      </div>

      {/* ── Mode Selection Banner ── */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '1.25rem 1.5rem',
          border: '1px solid #E7E5E4',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        }}
      >
        <div
          onClick={() => setHeroBannerMode('dynamic')}
          style={{
            cursor: 'pointer',
            padding: '1rem 1.25rem',
            borderRadius: '12px',
            border: heroBannerMode === 'dynamic' ? '2px solid #D97706' : '1.5px solid #E7E5E4',
            backgroundColor: heroBannerMode === 'dynamic' ? '#FFFBEB' : '#FAF7F2',
            position: 'relative',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.2rem' }}>✨</span>
              <strong style={{ fontSize: '0.95rem', color: heroBannerMode === 'dynamic' ? '#92400E' : '#1C1917' }}>
                Mode A: Dynamic Text Overlay (Recommended)
              </strong>
            </div>
            {heroBannerMode === 'dynamic' && (
              <span style={{ backgroundColor: '#D97706', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '12px' }}>
                ACTIVE
              </span>
            )}
          </div>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#78716C', lineHeight: 1.4 }}>
            Upload any scenic honey background image. The Eyebrow, Main Heading, Subtitle, and 3 Trust Badges will be cleanly rendered on top with editable text.
          </p>
        </div>

        <div
          onClick={() => setHeroBannerMode('static')}
          style={{
            cursor: 'pointer',
            padding: '1rem 1.25rem',
            borderRadius: '12px',
            border: heroBannerMode === 'static' ? '2px solid #D97706' : '1.5px solid #E7E5E4',
            backgroundColor: heroBannerMode === 'static' ? '#FFFBEB' : '#FAF7F2',
            position: 'relative',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.2rem' }}>🎨</span>
              <strong style={{ fontSize: '0.95rem', color: heroBannerMode === 'static' ? '#92400E' : '#1C1917' }}>
                Mode B: Full Artwork Graphic Banner
              </strong>
            </div>
            {heroBannerMode === 'static' && (
              <span style={{ backgroundColor: '#D97706', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '12px' }}>
                ACTIVE
              </span>
            )}
          </div>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#78716C', lineHeight: 1.4 }}>
            Upload a pre-designed banner artwork (from Photoshop/Canva) that already has all typography and branding in it. Renders purely as an image without overlapping text.
          </p>
        </div>
      </div>

      {/* ── Warning Notice if Baked-In Image is used in Dynamic Mode ── */}
      {hasTextBakedIn && (
        <div
          style={{
            backgroundColor: '#FEF2F2',
            border: '1.5px solid #F87171',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={22} color="#DC2626" />
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#991B1B' }}>
                Prevent Ghost Overlapping Text
              </div>
              <div style={{ fontSize: '0.8rem', color: '#7F1D1D' }}>
                The currently selected image already has text baked into it! To prevent double text, click below to switch to Full Artwork mode or use the clean background.
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setHeroBannerMode('static')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#DC2626',
                color: '#fff',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Switch to Full Artwork Mode
            </button>
            <button
              type="button"
              onClick={() => setHeroBackgroundImageUrl('/images/shop/shop_hero_bg_jar_forest.jpg')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #DC2626',
                backgroundColor: '#FFFFFF',
                color: '#DC2626',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Use Clean Jar Background
            </button>
          </div>
        </div>
      )}

      {/* ── Live Interactive Preview Card ── */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '1.5rem',
          border: '1.5px solid #FDE68A',
          boxShadow: '0 4px 20px rgba(217,119,6,0.08)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Eye size={18} color="#D97706" />
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#92400E',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Storefront Live Preview ({heroBannerMode === 'dynamic' ? 'Dynamic Text' : 'Full Artwork'})
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: '#78716C' }}>
              Image: <code style={{ fontSize: '0.75rem', backgroundColor: '#F5F5F4', padding: '2px 6px', borderRadius: '4px' }}>{heroBackgroundImageUrl.slice(-32)}</code>
            </span>
          </div>
        </div>

        {/* Hero preview mockup */}
        {heroBannerMode === 'static' ? (
          <div
            style={{
              position: 'relative',
              borderRadius: '14px',
              overflow: 'hidden',
              border: '1px solid #EBE4D8',
              backgroundColor: '#F5ECE1',
            }}
          >
            <img
              src={heroBackgroundImageUrl}
              alt="Shop Banner Artwork"
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '260px',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
        ) : (
          <div
            style={{
              position: 'relative',
              backgroundColor: '#FAF7F2',
              backgroundImage: `linear-gradient(to right, #FAF7F2 0%, rgba(250, 247, 242, 0.98) 25%, rgba(250, 247, 242, 0.85) 36%, rgba(250, 247, 242, 0.25) 46%, rgba(250, 247, 242, 0) 54%, transparent 100%), url('${heroBackgroundImageUrl}')`,
              backgroundSize: 'cover',
              backgroundPosition: heroBgPosition === 'center' ? 'center center' : heroBgPosition === 'left' ? 'center left' : 'center right',
              backgroundRepeat: 'no-repeat',
              borderRadius: '14px',
              padding: '2rem 2.25rem',
              border: '1px solid #EBE4D8',
              overflow: 'hidden',
              minHeight: '210px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {/* Left Content */}
            <div style={{ maxWidth: '520px', position: 'relative', zIndex: 2 }}>
              <p
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.2em',
                  color: '#2E7D32',
                  textTransform: 'uppercase',
                  margin: '0 0 0.4rem 0',
                }}
              >
                {eyebrow}
              </p>
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: '#29180E',
                  margin: '0 0 0.5rem 0',
                  lineHeight: 1.15,
                }}
              >
                {title}
              </h3>
              <p
                style={{
                  fontSize: '0.86rem',
                  color: '#57534E',
                  margin: '0 0 1.25rem 0',
                  lineHeight: 1.45,
                }}
              >
                {subtitle}
              </p>
              <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                {trustBadges.map((badge, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        border: '1.5px solid #2E7D32',
                        backgroundColor: '#FFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#2E7D32',
                        flexShrink: 0,
                      }}
                    >
                      {i === 0 ? <Leaf size={14} /> : i === 1 ? <ShieldCheck size={14} /> : <Droplet size={14} />}
                    </div>
                    <div style={{ fontSize: '0.72rem', lineHeight: 1.2 }}>
                      <strong style={{ color: '#1C1917', display: 'block' }}>{badge.title}</strong>
                      <span style={{ color: '#78716C', fontSize: '0.66rem' }}>{badge.subtitle}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side Watermark / Script Preview */}
            {heroScriptText && (
              <div
                style={{
                  position: 'relative',
                  zIndex: 2,
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontStyle: 'italic',
                  fontSize: '1.6rem',
                  color: '#B45309',
                  opacity: 0.9,
                  textAlign: 'right',
                  paddingRight: '1rem',
                  display: 'none',
                }}
                className="preview-script-watermark"
              >
                {heroScriptText}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Form Inputs ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>

        {/* ── Card 1: Hero Banner Background Image & Upload ── */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '1.5rem',
            borderRadius: '16px',
            border: '1px solid #E7E5E4',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1C1917', fontWeight: 800 }}>
              1. Hero Background Image
            </h3>
            <span
              style={{
                fontSize: '0.74rem',
                backgroundColor: '#FEF3C7',
                color: '#92400E',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '6px',
              }}
            >
              Cloudinary Upload
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            {/* Direct Upload Dropzone */}
            <div
              style={{
                border: '2px dashed #D97706',
                borderRadius: '14px',
                padding: '1.25rem',
                backgroundColor: '#FFFDF9',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                textAlign: 'center',
              }}
            >
              {heroBackgroundImageUrl && (
                <div
                  style={{
                    width: '100%',
                    height: '130px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    border: '1px solid #E7E5E4',
                    position: 'relative',
                  }}
                >
                  <img
                    src={heroBackgroundImageUrl}
                    alt="Active Background"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '6px',
                      right: '6px',
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      color: '#FFF',
                      fontSize: '0.7rem',
                      padding: '2px 8px',
                      borderRadius: '6px',
                    }}
                  >
                    Active Image
                  </div>
                </div>
              )}

              <button
                type="button"
                disabled={isUploadingBg}
                onClick={() => bgInputRef.current?.click()}
                style={{
                  width: '100%',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  backgroundColor: '#D97706',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  border: 'none',
                  cursor: isUploadingBg ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 8px rgba(217,119,6,0.3)',
                  transition: 'background-color 0.2s',
                }}
              >
                {isUploadingBg ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Uploading Image to Cloudinary...</span>
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    <span>Upload New Background Image</span>
                  </>
                )}
              </button>

              <p style={{ margin: 0, fontSize: '0.76rem', color: '#78716C' }}>
                Supports PNG, JPG, WEBP. Click above to upload from your computer.
              </p>
            </div>

            {/* Curated 1-Click Clean Presets */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#44403C',
                  marginBottom: '8px',
                }}
              >
                Curated Clean Presets (Zero Double Text):
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setHeroBackgroundImageUrl('/images/shop/shop_hero_bg_jar_forest.jpg');
                    setHeroBannerMode('dynamic');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border:
                      heroBackgroundImageUrl.includes('shop_hero_bg_jar_forest')
                        ? '1.5px solid #D97706'
                        : '1px solid #D6D3D1',
                    backgroundColor:
                      heroBackgroundImageUrl.includes('shop_hero_bg_jar_forest')
                        ? '#FEF3C7'
                        : '#FAF7F2',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <img
                    src="/images/shop/shop_hero_bg_jar_forest.jpg"
                    alt="Jar & Forest"
                    style={{ width: '40px', height: '30px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1C1917' }}>
                      🍯 Clean Jar on Timber & Sunlit Forest
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#78716C' }}>
                      Clean background with no baked-in text • Ideal for Dynamic Mode
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setHeroBackgroundImageUrl('/images/shop/shop_hero_bg_golden.jpg');
                    setHeroBannerMode('dynamic');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border:
                      heroBackgroundImageUrl.includes('shop_hero_bg_golden')
                        ? '1.5px solid #D97706'
                        : '1px solid #D6D3D1',
                    backgroundColor:
                      heroBackgroundImageUrl.includes('shop_hero_bg_golden')
                        ? '#FEF3C7'
                        : '#FAF7F2',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <img
                    src="/images/shop/shop_hero_bg_golden.jpg"
                    alt="Golden Flow"
                    style={{ width: '40px', height: '30px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1C1917' }}>
                      🐝 Artisanal Golden Honey Dipper & Forest
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#78716C' }}>
                      Dripping honey & wildflower blossoms • Ideal for Dynamic Mode
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setHeroBackgroundImageUrl('/images/shop/shop_hero_banner_clean.png');
                    setHeroBannerMode('static');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border:
                      heroBackgroundImageUrl.includes('shop_hero_banner_clean') &&
                        heroBannerMode === 'static'
                        ? '1.5px solid #D97706'
                        : '1px solid #D6D3D1',
                    backgroundColor:
                      heroBackgroundImageUrl.includes('shop_hero_banner_clean') &&
                        heroBannerMode === 'static'
                        ? '#FEF3C7'
                        : '#FAF7F2',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <img
                    src="/images/shop/shop_hero_banner_clean.png"
                    alt="Full Graphic"
                    style={{ width: '40px', height: '30px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1C1917' }}>
                      🎨 Full Pre-designed Mockup Artwork
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#78716C' }}>
                      Switches to Full Artwork Graphic mode (no overlay text)
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Image Alignment Position */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#44403C',
                  marginBottom: '6px',
                }}
              >
                Image Position / Alignment:
              </label>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => setHeroBgPosition('right')}
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backgroundColor: heroBgPosition === 'right' ? '#FEF3C7' : '#FAF7F2',
                    color: heroBgPosition === 'right' ? '#92400E' : '#57534E',
                    border: heroBgPosition === 'right' ? '1.5px solid #D97706' : '1px solid #D6D3D1',
                  }}
                >
                  Right (Jar on Right)
                </button>
                <button
                  type="button"
                  onClick={() => setHeroBgPosition('center')}
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backgroundColor: heroBgPosition === 'center' ? '#FEF3C7' : '#FAF7F2',
                    color: heroBgPosition === 'center' ? '#92400E' : '#57534E',
                    border: heroBgPosition === 'center' ? '1.5px solid #D97706' : '1px solid #D6D3D1',
                  }}
                >
                  Center
                </button>
                <button
                  type="button"
                  onClick={() => setHeroBgPosition('left')}
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backgroundColor: heroBgPosition === 'left' ? '#FEF3C7' : '#FAF7F2',
                    color: heroBgPosition === 'left' ? '#92400E' : '#57534E',
                    border: heroBgPosition === 'left' ? '1.5px solid #D97706' : '1px solid #D6D3D1',
                  }}
                >
                  Left
                </button>
              </div>
            </div>

            {/* Manual URL input fallback */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#44403C',
                  marginBottom: '4px',
                }}
              >
                Or Paste Image URL Directly:
              </label>
              <input
                type="text"
                value={heroBackgroundImageUrl}
                onChange={(e) => setHeroBackgroundImageUrl(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D6D3D1',
                  fontSize: '0.82rem',
                }}
                placeholder="https://... or /images/shop/..."
              />
            </div>
          </div>
        </div>

        {/* ── Card 2: Hero Banner Text Content (Dynamic Mode) ── */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '1.5rem',
            borderRadius: '16px',
            border: '1px solid #E7E5E4',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1C1917', fontWeight: 800 }}>
              2. Hero Banner Text Content
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#78716C' }}>
              Used in Dynamic Text Mode
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#44403C',
                  marginBottom: '4px',
                }}
              >
                Eyebrow Text (Small Caps)
              </label>
              <input
                type="text"
                value={eyebrow}
                onChange={(e) => setEyebrow(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D6D3D1',
                  fontSize: '0.85rem',
                }}
                placeholder="PURE • NATURAL • RAW"
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#44403C',
                  marginBottom: '4px',
                }}
              >
                Main Heading
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D6D3D1',
                  fontSize: '0.85rem',
                }}
                placeholder="Our Honey Collection"
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#44403C',
                  marginBottom: '4px',
                }}
              >
                Subtitle Description
              </label>
              <textarea
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                rows={2}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D6D3D1',
                  fontSize: '0.85rem',
                  resize: 'vertical',
                }}
                placeholder="Nature’s Finest. Pure Honey, Straight to Your Home."
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#44403C',
                  marginBottom: '4px',
                }}
              >
                Hero Script Watermark Text
              </label>
              <input
                type="text"
                value={heroScriptText}
                onChange={(e) => setHeroScriptText(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D6D3D1',
                  fontSize: '0.85rem',
                }}
                placeholder="Pure Honey Pure Life"
              />
            </div>
          </div>
        </div>

        {/* ── Card 3: 3 Hero Trust Badges ── */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '1.5rem',
            borderRadius: '16px',
            border: '1px solid #E7E5E4',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#1C1917', fontWeight: 800 }}>
            3. Hero Trust Badges (3 Items)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {trustBadges.map((badge, idx) => (
              <div
                key={idx}
                style={{
                  padding: '10px 12px',
                  borderRadius: '10px',
                  backgroundColor: '#FAF7F2',
                  border: '1px solid #E7E5E4',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: '#78716C',
                      marginBottom: '2px',
                    }}
                  >
                    Badge #{idx + 1} Title
                  </label>
                  <input
                    type="text"
                    value={badge.title}
                    onChange={(e) => handleTrustBadgeChange(idx, 'title', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      border: '1px solid #D6D3D1',
                      fontSize: '0.82rem',
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: '#78716C',
                      marginBottom: '2px',
                    }}
                  >
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={badge.subtitle}
                    onChange={(e) => handleTrustBadgeChange(idx, 'subtitle', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      border: '1px solid #D6D3D1',
                      fontSize: '0.82rem',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Card 4: Sidebar Promo Card ── */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '1.5rem',
            borderRadius: '16px',
            border: '1px solid #E7E5E4',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#1C1917', fontWeight: 800 }}>
            4. Sidebar Promo Card (Bottom of Left Filter)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              <input
                type="checkbox"
                checked={promo.isActive}
                onChange={(e) => setPromo({ ...promo, isActive: e.target.checked })}
              />
              <span>Enable Promo Card in Filters Sidebar</span>
            </label>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#44403C',
                  marginBottom: '4px',
                }}
              >
                Promo Card Title
              </label>
              <input
                type="text"
                value={promo.title}
                onChange={(e) => setPromo({ ...promo, title: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D6D3D1',
                  fontSize: '0.85rem',
                }}
                placeholder="Pure Honey Better Health"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: '#44403C',
                    marginBottom: '4px',
                  }}
                >
                  Button Text
                </label>
                <input
                  type="text"
                  value={promo.buttonText}
                  onChange={(e) => setPromo({ ...promo, buttonText: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #D6D3D1',
                    fontSize: '0.85rem',
                  }}
                  placeholder="Learn More →"
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: '#44403C',
                    marginBottom: '4px',
                  }}
                >
                  Link URL
                </label>
                <input
                  type="text"
                  value={promo.linkUrl}
                  onChange={(e) => setPromo({ ...promo, linkUrl: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #D6D3D1',
                    fontSize: '0.85rem',
                  }}
                  placeholder="/about"
                />
              </div>
            </div>

            {/* Promo Card Image Upload */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#44403C',
                  marginBottom: '4px',
                }}
              >
                Promo Background Image (Upload or URL)
              </label>

              {promo.imageUrl && (
                <div
                  style={{
                    width: '100%',
                    height: '80px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    marginBottom: '6px',
                    border: '1px solid #E7E5E4',
                  }}
                >
                  <img
                    src={promo.imageUrl}
                    alt="Promo preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="text"
                  value={promo.imageUrl}
                  onChange={(e) => setPromo({ ...promo, imageUrl: e.target.value })}
                  style={{
                    flex: 1,
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid #D6D3D1',
                    fontSize: '0.82rem',
                  }}
                  placeholder="/images/shop/sidebar_promo.png"
                />
                <button
                  type="button"
                  disabled={isUploadingPromo}
                  onClick={() => promoInputRef.current?.click()}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    backgroundColor: '#D97706',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: isUploadingPromo ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {isUploadingPromo ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  <span>Upload</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Card 5: Bottom 4 Guarantees Bar ── */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '1.5rem',
            borderRadius: '16px',
            border: '1px solid #E7E5E4',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#1C1917', fontWeight: 800 }}>
            5. Bottom Guarantee & Trust Bar (4 Items)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {bottomItems.map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '8px 10px',
                  borderRadius: '8px',
                  backgroundColor: '#FAF7F2',
                  border: '1px solid #E7E5E4',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#78716C',
                      marginBottom: '2px',
                    }}
                  >
                    Item #{idx + 1}
                  </label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleBottomItemChange(idx, 'title', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '5px 8px',
                      borderRadius: '6px',
                      border: '1px solid #D6D3D1',
                      fontSize: '0.8rem',
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#78716C',
                      marginBottom: '2px',
                    }}
                  >
                    Detail
                  </label>
                  <input
                    type="text"
                    value={item.subtitle}
                    onChange={(e) => handleBottomItemChange(idx, 'subtitle', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '5px 8px',
                      borderRadius: '6px',
                      border: '1px solid #D6D3D1',
                      fontSize: '0.8rem',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
