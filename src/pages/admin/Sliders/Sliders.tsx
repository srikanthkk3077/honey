import React, { useState } from 'react';
import { useStore } from '../../../store/store';
import { SliderTable } from '../../../components/admin/sliders/SliderTable';
import { SliderModal } from '../../../components/admin/sliders/SliderModal';
import { SliderItem } from '../../../types/slider.types';
import { Button } from '../../../components/common/Button';
import { Plus, SlidersHorizontal, Search, Play, X, ArrowRight, ExternalLink, Film } from 'lucide-react';
import { Input } from '../../../components/common/Input';
import { Link } from 'react-router-dom';

export const Sliders: React.FC = () => {
  const { sliders, addSlider, updateSlider, deleteSlider } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [previewSlider, setPreviewSlider] = useState<SliderItem | null>(null);
  const [editingSlider, setEditingSlider] = useState<SliderItem | undefined>(undefined);
  const [search, setSearch] = useState('');

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
          <h1 style={{ fontSize: '1.85rem', color: '#1C1917', margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <SlidersHorizontal size={28} color="#D97706" />
            <span>Home Page Hero Sliders</span>
          </h1>
          <p style={{ color: '#78716C', margin: 0, fontSize: '0.9rem' }}>
            Manage the top full-screen hero banner slides, background ambient videos, titles, and CTA links.
          </p>
        </div>

        <Button
          size="md"
          leftIcon={<Plus size={16} />}
          onClick={() => {
            setEditingSlider(undefined);
            setModalOpen(true);
          }}
        >
          Add New Hero Slider
        </Button>
      </div>

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
              Separated Management: Sliders vs Short Video Reels
            </div>
            <div style={{ fontSize: '0.8rem', color: '#78716C' }}>
              These sliders appear exclusively in the top Home Page Hero carousel. To manage short clips for the Apiary Reels section, use Videos & Reels.
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
          padding: '1rem 1.25rem',
          borderRadius: '14px',
          border: '1px solid #E7E5E4',
          maxWidth: '380px',
        }}
      >
        <Input
          placeholder="Search sliders by title, badge, or subtitle..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search size={16} />}
        />
      </div>

      {/* Sliders Table */}
      <SliderTable
        sliders={filtered}
        onPlay={(slide) => setPreviewSlider(slide)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Add / Edit Slider Modal */}
      <SliderModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingSlider(undefined);
        }}
        onSubmit={handleModalSubmit}
        initialData={editingSlider}
      />

      {/* Slide Live Preview Modal */}
      {previewSlider && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1100,
            backgroundColor: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
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
              maxWidth: '900px',
              backgroundColor: '#0C0A08',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setPreviewSlider(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                zIndex: 10,
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.6)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>

            {/* Media Background */}
            <div style={{ position: 'relative', width: '100%', height: '420px', overflow: 'hidden' }}>
              {previewSlider.mediaType === 'video' && previewSlider.videoUrl ? (
                <video
                  src={previewSlider.videoUrl}
                  poster={previewSlider.imageUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <img
                  src={previewSlider.imageUrl}
                  alt={previewSlider.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}

              {/* Gradient Overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(90deg, rgba(12,10,8,0.92) 0%, rgba(12,10,8,0.5) 60%, rgba(12,10,8,0.2) 100%)',
                  pointerEvents: 'none',
                }}
              />

              {/* Overlay Content Preview */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  padding: '2.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  maxWidth: '560px',
                  pointerEvents: 'none',
                }}
              >
                {previewSlider.badge && (
                  <div
                    style={{
                      background: 'rgba(245, 158, 11, 0.25)',
                      border: '1px solid rgba(245, 158, 11, 0.5)',
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      color: '#FEF3C7',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      marginBottom: '0.75rem',
                    }}
                  >
                    {previewSlider.badge}
                  </div>
                )}

                <h2
                  style={{
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.75rem',
                    lineHeight: 1.25,
                    fontWeight: 800,
                    margin: '0 0 0.75rem 0',
                    textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                  }}
                >
                  {previewSlider.title}
                </h2>

                {previewSlider.subtitle && (
                  <p
                    style={{
                      color: 'rgba(255,255,255,0.9)',
                      fontSize: '0.9rem',
                      lineHeight: 1.5,
                      margin: '0 0 1.25rem 0',
                    }}
                  >
                    {previewSlider.subtitle}
                  </p>
                )}

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <div
                    style={{
                      backgroundColor: '#D97706',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      padding: '0.6rem 1.2rem',
                      borderRadius: '9999px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>{previewSlider.ctaText || 'Shop Collection'}</span>
                    <ArrowRight size={14} />
                  </div>
                  {previewSlider.secondaryCtaText && (
                    <div
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        color: '#FFFFFF',
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
                Media Type: <strong style={{ color: '#FFFFFF' }}>{previewSlider.mediaType.toUpperCase()}</strong> • Order: <strong style={{ color: '#F59E0B' }}>#{previewSlider.order}</strong>
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
