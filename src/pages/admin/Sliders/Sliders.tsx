import React, { useState } from 'react';
import { useStore } from '../../../store/store';
import { SliderTable } from '../../../components/admin/sliders/SliderTable';
import { SliderModal } from '../../../components/admin/sliders/SliderModal';
import { HeroEditor } from '../../../components/admin/hero/HeroEditor';
import { ShopHeroEditor } from '../../../components/admin/shop/ShopHeroEditor';
import { SliderItem } from '../../../types/slider.types';
import { Button } from '../../../components/common/Button';
import { Plus, SlidersHorizontal, Search, Play, X, ArrowRight, ExternalLink, Film, Sparkles, LayoutPanelLeft, Layers, ShoppingBag } from 'lucide-react';
import { Input } from '../../../components/common/Input';
import { Link } from 'react-router-dom';

export const Sliders: React.FC = () => {
  const { sliders, addSlider, updateSlider, deleteSlider, settings, updateHeroConfig, showToast } = useStore();
  const [activeTab, setActiveTab] = useState<'hero' | 'shop' | 'carousel'>('hero');
  const [modalOpen, setModalOpen] = useState(false);
  const [previewSlider, setPreviewSlider] = useState<SliderItem | null>(null);
  const [editingSlider, setEditingSlider] = useState<SliderItem | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [isSavingMode, setIsSavingMode] = useState(false);

  const currentMode = settings?.heroConfig?.heroDisplayMode || 'hero';

  const handleSetDisplayMode = async (mode: 'hero' | 'carousel') => {
    if (mode === currentMode) return;
    setIsSavingMode(true);
    try {
      await updateHeroConfig({ ...(settings?.heroConfig || {}), heroDisplayMode: mode } as any);
      showToast(`Home page hero switched to ${mode === 'hero' ? 'Hero Banner' : 'Carousel Sliders'} mode!`, 'success');
    } catch (err: any) {
      showToast(`Failed to update display mode: ${err?.message || 'Server error'}`, 'error');
    } finally {
      setIsSavingMode(false);
    }
  };

  const filtered = sliders.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      (s.subtitle && s.subtitle.toLowerCase().includes(search.toLowerCase())) ||
      (s.badge && s.badge.toLowerCase().includes(search.toLowerCase()))
  );

  const handleEdit = (slider: SliderItem) => {
    setEditingSlider(slider);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this home page hero slider?')) {
      deleteSlider(id);
    }
  };

  const handleModalSubmit = async (data: Partial<SliderItem>) => {
    if (editingSlider) {
      await updateSlider(editingSlider.id, data);
    } else {
      await addSlider(data);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1
            style={{
              fontSize: '1.85rem',
              color: '#1C1917',
              margin: '0 0 0.25rem 0',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <SlidersHorizontal size={28} color="#D97706" />
            <span>Hero Page & Sliders Manager</span>
          </h1>
          <p style={{ color: '#78716C', margin: 0, fontSize: '0.9rem' }}>
            Customize the main artisanal Hero page banner, headlines, trust badges, buttons, and optional carousel slides.
          </p>
        </div>

        {activeTab === 'carousel' && (
          <Button
            size="md"
            leftIcon={<Plus size={16} />}
            onClick={() => {
              setEditingSlider(undefined);
              setModalOpen(true);
            }}
          >
            Add New Carousel Slide
          </Button>
        )}
      </div>

      {/* ── Home Page Display Mode Toggle ── */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E7E5E4',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
        }}
      >
        <div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1C1917', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>🏠</span> Home Page Hero Section — Display Mode
          </div>
          <p style={{ fontSize: '0.82rem', color: '#78716C', margin: 0 }}>
            Choose what to show on the home page hero area. Saved & applied immediately.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            disabled={isSavingMode}
            onClick={() => handleSetDisplayMode('hero')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '7px',
              padding: '0.6rem 1.2rem',
              borderRadius: '10px',
              border: currentMode === 'hero' ? '2px solid #D97706' : '1.5px solid #E7E5E4',
              backgroundColor: currentMode === 'hero' ? '#FEF3C7' : '#FFFFFF',
              color: currentMode === 'hero' ? '#92400E' : '#57534E',
              fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer',
              boxShadow: currentMode === 'hero' ? '0 0 0 3px rgba(217,119,6,0.12)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ fontSize: '1rem' }}>🍯</span>
            Hero Banner
            {currentMode === 'hero' && <span style={{ fontSize: '0.7rem', backgroundColor: '#D97706', color: '#fff', borderRadius: '9999px', padding: '1px 7px', marginLeft: '4px' }}>LIVE</span>}
          </button>

          <button
            type="button"
            disabled={isSavingMode}
            onClick={() => handleSetDisplayMode('carousel')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '7px',
              padding: '0.6rem 1.2rem',
              borderRadius: '10px',
              border: currentMode === 'carousel' ? '2px solid #D97706' : '1.5px solid #E7E5E4',
              backgroundColor: currentMode === 'carousel' ? '#FEF3C7' : '#FFFFFF',
              color: currentMode === 'carousel' ? '#92400E' : '#57534E',
              fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer',
              boxShadow: currentMode === 'carousel' ? '0 0 0 3px rgba(217,119,6,0.12)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ fontSize: '1rem' }}>🎞️</span>
            Carousel Sliders
            {currentMode === 'carousel' && <span style={{ fontSize: '0.7rem', backgroundColor: '#D97706', color: '#fff', borderRadius: '9999px', padding: '1px 7px', marginLeft: '4px' }}>LIVE</span>}
          </button>
        </div>
      </div>

      {/* Main Switcher Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          borderBottom: '2px solid #E7E5E4',
          paddingBottom: '0',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0.75rem 1.5rem',
            border: 'none',
            backgroundColor: activeTab === 'hero' ? '#FFFFFF' : 'transparent',
            color: activeTab === 'hero' ? '#B45309' : '#78716C',
            fontWeight: activeTab === 'hero' ? 800 : 600,
            fontSize: '0.96rem',
            cursor: 'pointer',
            borderRadius: '12px 12px 0 0',
            borderTop: activeTab === 'hero' ? '3px solid #D97706' : '3px solid transparent',
            borderLeft: activeTab === 'hero' ? '1px solid #E7E5E4' : '1px solid transparent',
            borderRight: activeTab === 'hero' ? '1px solid #E7E5E4' : '1px solid transparent',
            boxShadow: activeTab === 'hero' ? '0 -2px 10px rgba(0,0,0,0.03)' : 'none',
            position: 'relative',
            bottom: '-2px',
          }}
        >
          <Sparkles size={17} color={activeTab === 'hero' ? '#D97706' : '#A8A29E'} />
          <span>Hero Banner (Artisanal Forest Layout)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('shop')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0.75rem 1.5rem',
            border: 'none',
            backgroundColor: activeTab === 'shop' ? '#FFFFFF' : 'transparent',
            color: activeTab === 'shop' ? '#B45309' : '#78716C',
            fontWeight: activeTab === 'shop' ? 800 : 600,
            fontSize: '0.96rem',
            cursor: 'pointer',
            borderRadius: '12px 12px 0 0',
            borderTop: activeTab === 'shop' ? '3px solid #D97706' : '3px solid transparent',
            borderLeft: activeTab === 'shop' ? '1px solid #E7E5E4' : '1px solid transparent',
            borderRight: activeTab === 'shop' ? '1px solid #E7E5E4' : '1px solid transparent',
            boxShadow: activeTab === 'shop' ? '0 -2px 10px rgba(0,0,0,0.03)' : 'none',
            position: 'relative',
            bottom: '-2px',
          }}
        >
          <ShoppingBag size={17} color={activeTab === 'shop' ? '#D97706' : '#A8A29E'} />
          <span>Shop Honey Page (Banner & Badges)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('carousel')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0.75rem 1.5rem',
            border: 'none',
            backgroundColor: activeTab === 'carousel' ? '#FFFFFF' : 'transparent',
            color: activeTab === 'carousel' ? '#B45309' : '#78716C',
            fontWeight: activeTab === 'carousel' ? 800 : 600,
            fontSize: '0.96rem',
            cursor: 'pointer',
            borderRadius: '12px 12px 0 0',
            borderTop: activeTab === 'carousel' ? '3px solid #D97706' : '3px solid transparent',
            borderLeft: activeTab === 'carousel' ? '1px solid #E7E5E4' : '1px solid transparent',
            borderRight: activeTab === 'carousel' ? '1px solid #E7E5E4' : '1px solid transparent',
            boxShadow: activeTab === 'carousel' ? '0 -2px 10px rgba(0,0,0,0.03)' : 'none',
            position: 'relative',
            bottom: '-2px',
          }}
        >
          <SlidersHorizontal size={17} color={activeTab === 'carousel' ? '#D97706' : '#A8A29E'} />
          <span>Carousel Sliders ({sliders.length})</span>
        </button>
      </div>

      {/* ── TAB 1: ARTISANAL HOME HERO EDITOR ── */}
      {activeTab === 'hero' && <HeroEditor />}

      {/* ── TAB 2: SHOP HONEY PAGE EDITOR ── */}
      {activeTab === 'shop' && <ShopHeroEditor />}

      {/* ── TAB 3: CAROUSEL SLIDERS TABLE ── */}
      {activeTab === 'carousel' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Distinction Info Banner */}
          <div
            style={{
              backgroundColor: '#FFFBEB',
              border: '1px solid #FDE68A',
              borderRadius: '14px',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: '#FEF3C7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                🍯
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#92400E' }}>
                  Carousel Sliders (Home Hero)
                </div>
                <div style={{ fontSize: '0.8rem', color: '#78716C' }}>
                  Add multiple slides with video/image backgrounds. Switch the display mode above to "Carousel Sliders" to show these on the home page instead of the Hero Banner.
                </div>
              </div>
            </div>

            <Link
              to="/admin/videos"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#B45309',
                fontSize: '0.85rem',
                fontWeight: 700,
                textDecoration: 'none',
                backgroundColor: '#FFFFFF',
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1px solid #FCD34D',
              }}
            >
              <Film size={15} />
              <span>Go to Videos & Reels</span>
            </Link>
          </div>

          {/* Filter / Search */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '1rem',
              border: '1px solid #E7E5E4',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <div style={{ width: '320px' }}>
              <Input
                placeholder="Search sliders by title or badge..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search size={16} color="#78716C" />}
              />
            </div>
            <div style={{ fontSize: '0.88rem', color: '#78716C', marginLeft: 'auto' }}>
              Showing {filtered.length} of {sliders.length} sliders
            </div>
          </div>

          {/* Table */}
          <SliderTable
            sliders={filtered}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPlay={(slider) => setPreviewSlider(slider)}
          />
        </div>
      )}

      {/* Edit / Add Modal */}
      <SliderModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingSlider(undefined);
        }}
        onSubmit={handleModalSubmit}
        initialData={editingSlider}
      />

      {/* Full Preview Modal for Carousel Slides */}
      {previewSlider && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setPreviewSlider(null)}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '960px',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
              backgroundColor: '#000',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button
              onClick={() => setPreviewSlider(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                zIndex: 30,
                background: 'rgba(0,0,0,0.6)',
                border: 'none',
                color: '#fff',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={20} />
            </button>

            {/* Slide Content Preview */}
            <div style={{ position: 'relative', width: '100%', minHeight: '440px', display: 'flex', alignItems: 'center' }}>
              {previewSlider.mediaType === 'video' && previewSlider.videoUrl ? (
                <video
                  src={previewSlider.videoUrl}
                  poster={previewSlider.imageUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <img
                  src={previewSlider.imageUrl}
                  alt={previewSlider.title}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}

              {/* Gradient Overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.2) 100%)',
                }}
              />

              {/* Text overlay */}
              <div style={{ position: 'relative', zIndex: 10, padding: '3rem', maxWidth: '640px' }}>
                {previewSlider.badge && (
                  <span
                    style={{
                      display: 'inline-block',
                      backgroundColor: 'rgba(245, 158, 11, 0.25)',
                      color: '#FCD34D',
                      border: '1px solid rgba(245, 158, 11, 0.5)',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      marginBottom: '1rem',
                    }}
                  >
                    {previewSlider.badge}
                  </span>
                )}
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: '0.75rem' }}>
                  {previewSlider.title}
                </h2>
                {previewSlider.subtitle && (
                  <p style={{ fontSize: '1.1rem', color: '#D6D3D1', lineHeight: 1.5, marginBottom: '2rem' }}>
                    {previewSlider.subtitle}
                  </p>
                )}

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div
                    style={{
                      backgroundColor: '#D97706',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      padding: '0.75rem 1.75rem',
                      borderRadius: '9999px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span>{previewSlider.ctaText || 'Shop Collection'}</span>
                    <ArrowRight size={16} />
                  </div>
                  {previewSlider.secondaryCtaText && (
                    <div
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        padding: '0.6rem 1.2rem',
                        borderRadius: '9999px',
                      }}
                    >
                      {previewSlider.secondaryCtaText}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Bottom Bar */}
            <div
              style={{
                padding: '1rem 1.5rem',
                backgroundColor: '#181511',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ color: '#A8A29E', fontSize: '0.85rem' }}>
                Media Type: <strong style={{ color: '#FFFFFF' }}>{previewSlider.mediaType.toUpperCase()}</strong> • Order:{' '}
                <strong style={{ color: '#F59E0B' }}>#{previewSlider.order}</strong>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  const s = previewSlider;
                  setPreviewSlider(null);
                  handleEdit(s);
                }}
              >
                Edit This Slide
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sliders;
