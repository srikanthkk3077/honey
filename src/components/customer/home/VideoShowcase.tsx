import React, { useState } from 'react';
import { useStore } from '../../../store/store';
import { SectionTitle } from '../../common/SectionTitle';
import { VideoModal } from '../video/VideoModal';
import { VideoItem } from '../../../types/video.types';
import { Play, Eye, Clock, Film } from 'lucide-react';
import { Link } from 'react-router-dom';

export const VideoShowcase: React.FC = () => {
  const { videos } = useStore();
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  const featuredVideos = videos.filter((v) => v.featuredOnHome !== false);
  const homeVideos = (featuredVideos.length > 0 ? featuredVideos : videos).slice(0, 4);

  return (
    <section style={{ padding: '5.5rem 0', backgroundColor: '#181511', color: '#FFFFFF', position: 'relative' }}>
      <div className="container">
        <div className="flex items-end justify-between flex-wrap gap-4" style={{ marginBottom: '2.5rem' }}>
          <div>
            <SectionTitle
              align="left"



              light={true}

              
              subtitle="Apiary In Motion"
              title="Live Harvest Stories & Purity Reels"
              description="Step inside our high-altitude Himalayan hives and mangrove forests. Watch unheated raw extraction in action."
            />
          </div>

          <Link
            to="/videos"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#FBBF24',
              fontWeight: 700,
              fontSize: '0.95rem',
              marginBottom: '2rem',
            }}
          >
            <Film size={18} />
            <span>Watch All Videos ({videos.length})</span>
          </Link>
        </div>

        {/* Video Reel Cards */}
        <div className="grid grid-4 gap-6">
          {homeVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              style={{
                position: 'relative',
                borderRadius: '20px',
                overflow: 'hidden',
                cursor: 'pointer',
                aspectRatio: '9/14',
                boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
                e.currentTarget.style.borderColor = '#F59E0B';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              }}
            >
              {/* Thumbnail Image */}
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* Dark Gradient Overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(15, 12, 8, 0.95) 0%, rgba(15, 12, 8, 0.3) 50%, rgba(15, 12, 8, 0.6) 100%)',
                }}
              />

              {/* Category & Duration Pill Top */}
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  right: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  zIndex: 2,
                }}
              >
                <span
                  style={{
                    backgroundColor: 'rgba(217, 119, 6, 0.85)',
                    backdropFilter: 'blur(4px)',
                    color: '#FFFFFF',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '3px 8px',
                    borderRadius: '6px',
                  }}
                >
                  {video.category}
                </span>

                <span
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.65)',
                    backdropFilter: 'blur(4px)',
                    color: '#FFFFFF',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Clock size={12} /> {video.duration}
                </span>
              </div>

              {/* Central Play Button */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(245, 158, 11, 0.9)',
                  backdropFilter: 'blur(6px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  boxShadow: '0 0 25px rgba(245, 158, 11, 0.6)',
                  transition: 'transform 0.2s',
                  zIndex: 2,
                }}
              >
                <Play size={24} fill="#FFFFFF" style={{ marginLeft: '3px' }} />
              </div>

              {/* Bottom Information */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '14px',
                  right: '14px',
                  zIndex: 2,
                }}
              >
                <h4
                  style={{
                    color: '#FFFFFF',
                    fontSize: '0.98rem',
                    lineHeight: 1.35,
                    marginBottom: '6px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {video.title}
                </h4>

                <div className="flex items-center justify-between" style={{ fontSize: '0.75rem', color: '#A8A29E' }}>
                  <span className="flex items-center gap-1">
                    <Eye size={12} /> {video.views} views
                  </span>
                  {video.taggedProductName && (
                    <span style={{ color: '#FBBF24', fontWeight: 600 }}>Shop Honey 🍯</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal Player */}
      <VideoModal
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </section>
  );
};
