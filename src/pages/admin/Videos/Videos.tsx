import React, { useState } from 'react';
import { useStore } from '../../../store/store';
import { VideoTable } from '../../../components/admin/videos/VideoTable';
import { VideoUploadModal } from '../../../components/admin/videos/VideoUploadModal';
import { VideoModal } from '../../../components/customer/video/VideoModal';
import { VideoItem } from '../../../types/video.types';
import { Button } from '../../../components/common/Button';
import { Upload, Film, Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '../../../components/common/Input';
import { Link } from 'react-router-dom';

export const AdminVideos: React.FC = () => {
  const { videos, deleteVideo } = useStore();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [playingVideo, setPlayingVideo] = useState<VideoItem | null>(null);
  const [editingVideo, setEditingVideo] = useState<VideoItem | undefined>(undefined);
  const [search, setSearch] = useState('');

  const filtered = videos.filter(
    (v) =>
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.category.toLowerCase().includes(search.toLowerCase()) ||
      (v.taggedProductName && v.taggedProductName.toLowerCase().includes(search.toLowerCase()))
  );

  const handleEdit = (video: VideoItem) => {
    setEditingVideo(video);
    setUploadModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this video reel from public store?')) {
      deleteVideo(id);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '1.85rem', color: '#1C1917', margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Film size={28} color="#D97706" />
            <span>Short Videos & Apiary Reels</span>
          </h1>
          <p style={{ color: '#78716C', margin: 0, fontSize: '0.9rem' }}>
            Upload raw harvest clips, purity tests, and beekeeper reels for the storefront &ldquo;Live Harvest Stories&rdquo; showcase.
          </p>
        </div>

        <Button
          size="md"
          leftIcon={<Upload size={16} />}
          onClick={() => {
            setEditingVideo(undefined);
            setUploadModalOpen(true);
          }}
        >
          Upload New Video Reel
        </Button>
      </div>

      {/* Info notice linking to Hero Sliders */}
      <div
        style={{
          backgroundColor: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '14px',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.25rem' }}>🎬</span>
          <div style={{ fontSize: '0.85rem', color: '#475569' }}>
            <strong>Separate Video Placement:</strong> Videos uploaded here appear in the <em>&ldquo;Live Harvest Stories &amp; Purity Reels&rdquo;</em> showcase on the homepage and the <em>/videos</em> gallery.
          </div>
        </div>

        <Link
          to="/admin/sliders"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#B45309',
            fontSize: '0.85rem',
            fontWeight: 700,
            textDecoration: 'none',
            backgroundColor: '#FEF3C7',
            padding: '6px 14px',
            borderRadius: '8px',
            border: '1px solid #FDE68A',
          }}
        >
          <SlidersHorizontal size={15} />
          <span>Manage Top Hero Sliders</span>
        </Link>
      </div>

      {/* Filter / Search */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          padding: '1rem 1.25rem',
          borderRadius: '14px',
          border: '1px solid #E7E5E4',
          maxWidth: '350px',
        }}
      >
        <Input
          placeholder="Search by title or tagged honey..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search size={16} />}
        />
      </div>

      {/* Table */}
      <VideoTable
        videos={filtered}
        onPlay={(v) => setPlayingVideo(v)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Upload/Edit Modal */}
      <VideoUploadModal
        isOpen={uploadModalOpen}
        onClose={() => {
          setUploadModalOpen(false);
          setEditingVideo(undefined);
        }}
        initialData={editingVideo}
      />

      {/* Video Playback Modal */}
      <VideoModal
        video={playingVideo}
        onClose={() => setPlayingVideo(null)}
      />
    </div>
  );
};
