import React from 'react';
import { SliderItem } from '../../../types/slider.types';
import { Trash2, Edit2, Play, Eye, Video, Image as ImageIcon, ArrowUpRight } from 'lucide-react';
import { Badge } from '../../common/Badge';

interface SliderTableProps {
  sliders: SliderItem[];
  onPlay: (slider: SliderItem) => void;
  onEdit: (slider: SliderItem) => void;
  onDelete: (id: string) => void;
}

export const SliderTable: React.FC<SliderTableProps> = ({
  sliders,
  onPlay,
  onEdit,
  onDelete,
}) => {
  const sorted = [...sliders].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E7E5E4', overflow: 'hidden' }}>
      <div className="table-responsive" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid #E7E5E4', color: '#57534E' }}>
              <th style={{ padding: '1rem', width: '70px' }}>Order</th>
              <th style={{ padding: '1rem' }}>Slide Banner Preview</th>
              <th style={{ padding: '1rem' }}>Headline & Eyebrow</th>
              <th style={{ padding: '1rem' }}>Media Type</th>
              <th style={{ padding: '1rem' }}>Call To Action</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((slide, index) => (
              <tr key={slide.id || index} style={{ borderBottom: '1px solid #F5F1E9' }}>
                {/* Order */}
                <td style={{ padding: '1rem', fontWeight: 700, color: '#D97706' }}>
                  #{slide.order || index + 1}
                </td>

                {/* Banner Preview */}
                <td style={{ padding: '1rem' }}>
                  <div
                    onClick={() => onPlay(slide)}
                    style={{
                      position: 'relative',
                      width: '110px',
                      height: '62px',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      flexShrink: 0,
                      backgroundColor: '#0C0A08',
                      border: '1px solid #E7E5E4',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                    }}
                    title="Click to preview slide"
                  >
                    <img
                      src={slide.imageUrl}
                      alt={slide.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://res.cloudinary.com/kisnodzz/image/upload/v1791042834/madhuvan_honey/sliders/cbv03eqxofw3ja6dxast.jpg';
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        transition: 'background-color 0.2s',
                      }}
                    >
                      {slide.mediaType === 'video' ? (
                        <div
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            background: '#D97706',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Play size={12} fill="#FFFFFF" style={{ marginLeft: '1px' }} />
                        </div>
                      ) : (
                        <div
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            background: 'rgba(0,0,0,0.6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Eye size={13} color="#FFFFFF" />
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Headline & Eyebrow */}
                <td style={{ padding: '1rem', maxWidth: '320px' }}>
                  {slide.badge && (
                    <div
                      style={{
                        fontSize: '0.72rem',
                        color: '#D97706',
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        marginBottom: '3px',
                      }}
                    >
                      {slide.badge}
                    </div>
                  )}
                  <div
                    style={{
                      fontWeight: 700,
                      color: '#1C1917',
                      fontSize: '0.92rem',
                      lineHeight: 1.3,
                      marginBottom: '4px',
                    }}
                  >
                    {slide.title}
                  </div>
                  {slide.subtitle && (
                    <div
                      style={{
                        fontSize: '0.78rem',
                        color: '#78716C',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {slide.subtitle}
                    </div>
                  )}
                </td>

                {/* Media Type */}
                <td style={{ padding: '1rem' }}>
                  {slide.mediaType === 'video' ? (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        backgroundColor: '#FEF3C7',
                        color: '#92400E',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                      }}
                    >
                      <Video size={13} /> Video Loop
                    </span>
                  ) : (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        backgroundColor: '#F3F4F6',
                        color: '#374151',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                      }}
                    >
                      <ImageIcon size={13} /> High-Res Image
                    </span>
                  )}
                </td>

                {/* Call to Action */}
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontSize: '0.85rem' }}>
                    <div style={{ fontWeight: 600, color: '#1C1917', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>{slide.ctaText || 'Shop Now'}</span>
                      <ArrowUpRight size={13} color="#78716C" />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#78716C' }}>{slide.linkUrl || '/shop'}</div>
                    {slide.secondaryCtaText && (
                      <div style={{ fontSize: '0.75rem', color: '#D97706', marginTop: '2px', fontWeight: 500 }}>
                        2nd: {slide.secondaryCtaText}
                      </div>
                    )}
                  </div>
                </td>

                {/* Status */}
                <td style={{ padding: '1rem' }}>
                  {slide.isActive !== false ? (
                    <Badge variant="green" size="sm">Active</Badge>
                  ) : (
                    <Badge variant="gray" size="sm">Draft / Hidden</Badge>
                  )}
                </td>

                {/* Actions */}
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button
                      onClick={() => onPlay(slide)}
                      style={{
                        padding: '6px',
                        borderRadius: '6px',
                        background: '#FEF3C7',
                        color: '#92400E',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                      title="Preview Slide"
                    >
                      <Play size={16} />
                    </button>

                    <button
                      onClick={() => onEdit(slide)}
                      style={{
                        padding: '6px',
                        borderRadius: '6px',
                        background: '#EFF6FF',
                        color: '#2563EB',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                      title="Edit Slide"
                    >
                      <Edit2 size={16} />
                    </button>

                    <button
                      onClick={() => onDelete(slide.id)}
                      style={{
                        padding: '6px',
                        borderRadius: '6px',
                        background: '#FEF2F2',
                        color: '#DC2626',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                      title="Delete Slide"
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
