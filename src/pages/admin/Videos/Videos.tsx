import React, { useState } from 'react';
import { useStore } from '../../../store/store';
import { VideoTable } from '../../../components/admin/videos/VideoTable';
import { VideoUploadModal } from '../../../components/admin/videos/VideoUploadModal';
import { VideoModal } from '../../../components/customer/video/VideoModal';
import { VideoItem } from '../../../types/video.types';
import { Button } from '../../../components/common/Button';
import { Upload, Film, Search } from 'lucide-react';
import { Input } from '../../../components/common/Input';

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
          <h1 style={{ fontSize: '1.85rem', color: '#1C1917', margin: '0 0 0.25rem 0' }}>
            Video Stories & Apiary Reels
          </h1>
          <p style={{ color: '#78716C', margin: 0, fontSize: '0.9rem' }}>
            Upload raw harvest clips, attach tagged honey products, and stream to customer storefront.
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
          Upload New Video
        </Button>
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
