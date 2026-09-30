import React, { useState } from 'react';
import { ProductReview } from '../../../types/product.types';
import { Star, CheckCircle, MessageSquarePlus } from 'lucide-react';
import { Button } from '../../common/Button';
import { useStore } from '../../../store/store';

interface ProductReviewsProps {
  productId: string;
  reviews: ProductReview[];
  rating: number;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({ productId, reviews, rating }) => {
  const { showToast } = useStore();
  const [localReviews, setLocalReviews] = useState<ProductReview[]>(reviews);
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [formRating, setFormRating] = useState(5);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    const newRev: ProductReview = {
      id: 'rev-' + Date.now(),
      userName: name.trim(),
      rating: formRating,
      comment: comment.trim(),
      date: new Date().toISOString().split('T')[0],
      verified: true
    };

    setLocalReviews([newRev, ...localReviews]);
    setName('');
    setComment('');
    setShowAddForm(false);
    showToast('Thank you for sharing your experience with Madhuvan Honey!', 'success');
  };

  return (
    <div style={{ marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid #E7E5E4' }}>
      <div className="flex items-center justify-between flex-wrap gap-4" style={{ marginBottom: '2rem' }}>
        <div>
          <h3 style={{ fontSize: '1.65rem', color: '#1C1917', marginBottom: '0.25rem' }}>
            Customer Reviews & Experiences
          </h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1" style={{ color: '#F59E0B' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="#F59E0B" />
              ))}
            </div>
            <span style={{ fontWeight: 700, fontSize: '1rem', color: '#1C1917' }}>{rating} out of 5</span>
            <span style={{ color: '#78716C', fontSize: '0.9rem' }}>({localReviews.length} reviews)</span>
          </div>
        </div>

        <Button
          variant="outline"
          leftIcon={<MessageSquarePlus size={16} />}
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel Review' : 'Write a Review'}
        </Button>
      </div>

      {/* Review Submission Form */}
      {showAddForm && (
        <form
          onSubmit={handleReviewSubmit}
          style={{
            backgroundColor: '#FAF7F2',
            padding: 'clamp(1rem, 3vw, 1.75rem)',
            borderRadius: '16px',
            border: '1px solid #E7E5E4',
            marginBottom: '2.5rem',
            animation: 'fadeInUp 0.2s ease',
          }}
        >
          <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#1C1917' }}>
            Share your taste & aroma thoughts
          </h4>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#44403C', marginBottom: '0.35rem' }}>
              Rating:
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  type="button"
                  key={num}
                  onClick={() => setFormRating(num)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: num <= formRating ? '#F59E0B' : '#D6D3D1',
                    padding: '2px',
                  }}
                >
                  <Star size={24} fill={num <= formRating ? '#F59E0B' : 'none'} />
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#44403C', marginBottom: '0.35rem' }}>
                Your Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dr. Priyanshu Sen"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '0.65rem 0.95rem',
                  borderRadius: '10px',
                  border: '1px solid #D6D3D1',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#44403C', marginBottom: '0.35rem' }}>
                Your Feedback & Taste Notes
              </label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Describe flavor notes, floral smell, texture, or health benefits noticed..."
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '0.65rem 0.95rem',
                  borderRadius: '10px',
                  border: '1px solid #D6D3D1',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>

          <Button type="submit" size="md">
            Publish Review
          </Button>
        </form>
      )}

      {/* Reviews list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {localReviews.map((rev) => (
          <div
            key={rev.id}
            style={{
              padding: 'clamp(1rem, 3vw, 1.5rem)',
              borderRadius: '16px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E7E5E4',
            }}
          >
            <div className="flex items-center justify-between flex-wrap gap-2" style={{ marginBottom: '0.6rem' }}>
              <div className="flex items-center gap-2 flex-wrap">
                <span style={{ fontWeight: 700, color: '#1C1917' }}>{rev.userName}</span>
                {rev.verified && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.75rem', color: '#059669', background: '#ECFDF5', padding: '2px 6px', borderRadius: '4px' }}>
                    <CheckCircle size={12} /> Verified Purchaser
                  </span>
                )}
              </div>
              <span style={{ fontSize: '0.8rem', color: '#A8A29E' }}>{rev.date}</span>
            </div>

            <div className="flex items-center gap-1" style={{ color: '#F59E0B', marginBottom: '0.6rem' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill={i < rev.rating ? '#F59E0B' : 'none'} />
              ))}
            </div>

            <p style={{ color: '#57534E', fontSize: '0.92rem', lineHeight: 1.6 }}>
              {rev.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
