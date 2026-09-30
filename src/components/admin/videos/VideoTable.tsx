import React from 'react';
import { VideoItem } from '../../../types/video.types';
import { Trash2, Edit2, Play, Eye } from 'lucide-react';
import { Badge } from '../../common/Badge';

interface VideoTableProps {
  videos: VideoItem[];
  onPlay: (video: VideoItem) => void;
  onEdit: (video: VideoItem) => void;
  onDelete: (id: string) => void;
}

export const VideoTable: React.FC<VideoTableProps> = ({ videos, onPlay, onEdit, onDelete }) => {
  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E7E5E4', overflow: 'hidden' }}>
      <div className="table-responsive" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid #E7E5E4', color: '#57534E' }}>
              <th style={{ padding: '1rem' }}>Video Reel</th>
              <th style={{ padding: '1rem' }}>Category</th>
              <th style={{ padding: '1rem' }}>Duration</th>
              <th style={{ padding: '1rem' }}>Views</th>
              <th style={{ padding: '1rem' }}>Tagged Product</th>
              <th style={{ padding: '1rem' }}>Home Feature</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((vid) => (
              <tr key={vid.id} style={{ borderBottom: '1px solid #F5F1E9' }}>
                <td style={{ padding: '1rem' }}>
                  <div className="flex items-center gap-3">
                    <div
                      onClick={() => onPlay(vid)}
                      style={{
                        position: 'relative',
                        width: '74px',
                        height: '46px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        flexShrink: 0,
                        backgroundColor: '#000',
                      }}
                    >
                      <img src={vid.thumbnailUrl} alt={vid.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backgroundColor: 'rgba(0,0,0,0.4)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                        }}
                      >
                        <Play size={16} fill="#fff" />
                      </div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#1C1917', maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {vid.title}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#78716C' }}>
                        {new Date(vid.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                      </div>
                    </div>
                  </div>
                </td>

                <td style={{ padding: '1rem' }}>
                  <span style={{ textTransform: 'capitalize', color: '#44403C' }}>{vid.category}</span>
                </td>

                <td style={{ padding: '1rem', color: '#78716C' }}>
                  {vid.duration}
                </td>

                <td style={{ padding: '1rem', fontWeight: 600, color: '#1C1917' }}>
                  <span className="flex items-center gap-1">
                    <Eye size={14} color="#78716C" /> {vid.views}
                  </span>
                </td>

                <td style={{ padding: '1rem' }}>
                  {vid.taggedProductName ? (
                    <span style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 600 }}>
                      {vid.taggedProductName}
                    </span>
                  ) : (
                    <span style={{ color: '#A8A29E', fontSize: '0.8rem' }}>None</span>
                  )}
                </td>

                <td style={{ padding: '1rem' }}>
                  {vid.featuredOnHome ? (
                    <Badge variant="green" size="sm">Active</Badge>
                  ) : (
                    <Badge variant="gray" size="sm">Hidden</Badge>
                  )}
                </td>

                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button
                      onClick={() => onPlay(vid)}
                      style={{
                        padding: '6px',
                        borderRadius: '6px',
                        background: '#FEF3C7',
                        color: '#92400E',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                      title="Play Video"
                    >
                      <Play size={16} />
                    </button>

                    <button
                      onClick={() => onEdit(vid)}
                      style={{
                        padding: '6px',
                        borderRadius: '6px',
                        background: '#EFF6FF',
                        color: '#2563EB',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                      title="Edit Video"
                    >
                      <Edit2 size={16} />
                    </button>

                    <button
                      onClick={() => onDelete(vid.id)}
                      style={{
                        padding: '6px',
                        borderRadius: '6px',
                        background: '#FEF2F2',
                        color: '#DC2626',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                      title="Delete Video"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
