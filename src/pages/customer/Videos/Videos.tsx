import React, { useState } from 'react';
import { useStore } from '../../../store/store';
import { SectionTitle } from '../../../components/common/SectionTitle';
import { VideoModal } from '../../../components/customer/video/VideoModal';
import { VideoItem, VideoCategory } from '../../../types/video.types';
import { Play, Eye, Clock, Search, Sparkles } from 'lucide-react';
import { Input } from '../../../components/common/Input';

export const Videos: React.FC = () => {
  const { videos } = useStore();
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = videos.filter((v) => {
    if (categoryFilter !== 'all' && v.category !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        v.title.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const categories = [
    { id: 'all', label: 'All Videos' },
    { id: 'harvest', label: 'Wild Harvest' },
    { id: 'purity', label: 'NMR Purity Tests' },
    { id: 'recipe', label: 'Ayurvedic Tonics' },
    { id: 'story', label: 'Nomadic Stories' },
  ];

  return (
    <div style={{ padding: 'clamp(2rem, 4vw, 3.5rem) 0 5rem 0', backgroundColor: '#FAF7F2' }}>
      <div className="container">
        <SectionTitle
          subtitle="Madhuvan Visual Chronicle"
          title="Watch Apiary Harvests & Purity In Action"
          description="Explore high-definition videos recorded live across wild biospheres, testing labs, and artisanal honey houses."
        />

        {/* Filter Navigation */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            padding: 'clamp(1rem, 2.5vw, 1.25rem) clamp(1rem, 3vw, 1.5rem)',
            border: '1px solid #E7E5E4',
            marginBottom: '2.5rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: categoryFilter === cat.id ? 700 : 500,
                  border: categoryFilter === cat.id ? '1.5px solid #D97706' : '1px solid #E7E5E4',
                  background: categoryFilter === cat.id ? '#FEF3C7' : '#FFFFFF',
                  color: categoryFilter === cat.id ? '#92400E' : '#57534E',
                  cursor: 'pointer',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div style={{ flex: '1 1 220px', minWidth: 0, maxWidth: '320px' }}>
            <Input
              placeholder="Search video clips..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search size={16} />}
            />
          </div>
        </div>

        {/* Video Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1px solid #E7E5E4' }}>
            <p style={{ color: '#78716C' }}>No videos match your filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-3 gap-6">
            {filtered.map((video) => (
              <div
                key={video.id}
                className="card"
                onClick={() => setSelectedVideo(video)}
                style={{
                  cursor: 'pointer',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                {/* Thumbnail Screen */}
                <div style={{ position: 'relative', aspectRatio: '16/10', backgroundColor: '#000000', overflow: 'hidden' }}>
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />

                  {/* Play badge */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(217, 119, 6, 0.9)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                    }}
                  >
                    <Play size={20} fill="#FFFFFF" style={{ marginLeft: '2px' }} />
                  </div>

                  <span
                    style={{
                      position: 'absolute',
                      bottom: '8px',
                      right: '8px',
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      color: '#fff',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '4px',
                    }}
                  >
                    {video.duration}
                  </span>
                </div>

                {/* Details */}
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <div className="flex items-center justify-between" style={{ marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D97706', textTransform: 'uppercase' }}>
                        {video.category}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#78716C', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Eye size={12} /> {video.views} plays
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.05rem', color: '#1C1917', lineHeight: 1.35, marginBottom: '0.5rem' }}>
                      {video.title}
                    </h3>

                    <p style={{ fontSize: '0.85rem', color: '#78716C', lineHeight: 1.5, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {video.description}
                    </p>
                  </div>

                  {video.taggedProductName && (
                    <div style={{ borderTop: '1px solid #F5F1E9', marginTop: '1rem', paddingTop: '0.75rem', fontSize: '0.8rem', color: '#059669', fontWeight: 600 }}>
                      🍯 Tags: {video.taggedProductName}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <VideoModal
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </div>
  );
};
