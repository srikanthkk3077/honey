import React, { useState, useMemo } from 'react';
import { useStore } from '../../../store/store';
import {
  Star,
  Sparkles,
  Search,
  CheckCircle,
  Eye,
  Trash2,
  ExternalLink,
  MessageSquare,
  Award,
  ThumbsUp,
  RefreshCw,
} from 'lucide-react';
import { ShimmerBox } from '../../../components/common/Shimmer';

export const Reviews: React.FC = () => {
  const { allReviews, toggleReviewHome, deleteReview, refreshAllReviews, isAllReviewsLoading } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'featured' | 'five_star' | 'unfeatured'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshAllReviews();
    setIsRefreshing(false);
  };

  // Metrics
  const totalCount = allReviews.length;
  const homeCount = allReviews.filter((r) => r.showOnHome).length;
  const fiveStarCount = allReviews.filter((r) => r.rating === 5).length;
  const avgRating =
    totalCount > 0
      ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / totalCount).toFixed(1)
      : '5.0';

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return allReviews.filter((r) => {
      // Tab filter
      if (activeTab === 'featured' && !r.showOnHome) return false;
      if (activeTab === 'unfeatured' && r.showOnHome) return false;
      if (activeTab === 'five_star' && r.rating !== 5) return false;

      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = r.userName?.toLowerCase().includes(query);
        const matchesComment = r.comment?.toLowerCase().includes(query);
        const matchesProduct = r.productName?.toLowerCase().includes(query);
        return matchesName || matchesComment || matchesProduct;
      }
      return true;
    });
  }, [allReviews, activeTab, searchTerm]);

  const handleToggle = async (r: any) => {
    const prodId = r.productId;
    const revId = r.id || r.reviewId;
    if (!prodId || !revId) return;
    await toggleReviewHome(prodId, revId);
  };

  const handleDelete = async (r: any) => {
    const prodId = r.productId;
    const revId = r.id || r.reviewId;
    if (!prodId || !revId) return;
    if (window.confirm(`Are you sure you want to permanently delete the review from ${r.userName}?`)) {
      setDeletingId(revId);
      await deleteReview(prodId, revId);
      setDeletingId(null);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#D97706',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Feedback Management
            </span>
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#1C1917', margin: 0 }}>
            Customer Reviews & Experiences
          </h1>
          <p style={{ color: '#78716C', fontSize: '0.95rem', margin: '4px 0 0 0' }}>
            Manage verified product reviews and choose which ones are showcased on the Customer Home page.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing || isAllReviewsLoading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0.65rem 1.25rem',
            borderRadius: '12px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E7E5E4',
            color: '#44403C',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#D97706')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#E7E5E4')}
        >
          <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        {/* Metric 1: Total Reviews */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '1.5rem',
            borderRadius: '18px',
            border: '1px solid #E7E5E4',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: '0.82rem', color: '#78716C', fontWeight: 600, textTransform: 'uppercase' }}>
              Total Reviews
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1C1917', marginTop: '4px' }}>
              {totalCount}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 600, marginTop: '2px' }}>
              Across all honey jars
            </div>
          </div>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              backgroundColor: '#EFF6FF',
              color: '#3B82F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MessageSquare size={24} />
          </div>
        </div>

        {/* Metric 2: Showcased on Home */}
        <div
          style={{
            backgroundColor: '#FFFBEB',
            padding: '1.5rem',
            borderRadius: '18px',
            border: '1px solid #FDE68A',
            boxShadow: '0 2px 10px rgba(217, 119, 6, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: '0.82rem', color: '#B45309', fontWeight: 700, textTransform: 'uppercase' }}>
              Showcased on Home
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#92400E', marginTop: '4px' }}>
              {homeCount}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#B45309', fontWeight: 600, marginTop: '2px' }}>
              Active on Customer Landing
            </div>
          </div>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              backgroundColor: '#FDE68A',
              color: '#B45309',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={24} />
          </div>
        </div>

        {/* Metric 3: Average Rating */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '1.5rem',
            borderRadius: '18px',
            border: '1px solid #E7E5E4',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: '0.82rem', color: '#78716C', fontWeight: 600, textTransform: 'uppercase' }}>
              Average Rating
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1C1917', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {avgRating}
              <Star size={20} fill="#F59E0B" color="#F59E0B" />
            </div>
            <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 600, marginTop: '2px' }}>
              Customer satisfaction score
            </div>
          </div>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              backgroundColor: '#FEF3C7',
              color: '#D97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Award size={24} />
          </div>
        </div>

        {/* Metric 4: 5-Star Reviews */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '1.5rem',
            borderRadius: '18px',
            border: '1px solid #E7E5E4',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: '0.82rem', color: '#78716C', fontWeight: 600, textTransform: 'uppercase' }}>
              5-Star Ratings
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1C1917', marginTop: '4px' }}>
              {fiveStarCount}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#78716C', fontWeight: 600, marginTop: '2px' }}>
              {totalCount > 0 ? Math.round((fiveStarCount / totalCount) * 100) : 100}% of all feedback
            </div>
          </div>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              backgroundColor: '#ECFDF5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ThumbsUp size={24} />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          padding: '1.25rem',
          borderRadius: '18px',
          border: '1px solid #E7E5E4',
          marginBottom: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Tab Buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: `All Reviews (${totalCount})` },
            { id: 'featured', label: `⭐ Showcased on Home (${homeCount})` },
            { id: 'five_star', label: `5 Stars (${fiveStarCount})` },
            { id: 'unfeatured', label: `Standard Reviews (${totalCount - homeCount})` },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '0.55rem 1.15rem',
                  borderRadius: '10px',
                  border: isActive ? '1px solid #D97706' : '1px solid #E7E5E4',
                  backgroundColor: isActive ? '#FFFBEB' : '#FFFFFF',
                  color: isActive ? '#B45309' : '#57534E',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div style={{ position: 'relative', width: 'clamp(240px, 30vw, 360px)' }}>
          <Search
            size={16}
            color="#A8A29E"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder="Search customer, comment or product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '0.55rem 1rem 0.55rem 2.4rem',
              borderRadius: '10px',
              border: '1px solid #E7E5E4',
              fontSize: '0.88rem',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Reviews List */}
      {isAllReviewsLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E7E5E4',
                padding: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center', width: '60%' }}>
                <ShimmerBox width="46px" height="46px" borderRadius="50%" style={{ flexShrink: 0 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                  <ShimmerBox width="140px" height="18px" />
                  <ShimmerBox width="90%" height="14px" />
                  <ShimmerBox width="60%" height="14px" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <ShimmerBox width="120px" height="36px" borderRadius="10px" />
                <ShimmerBox width="36px" height="36px" borderRadius="10px" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredReviews.length === 0 ? (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            border: '1px solid #E7E5E4',
            padding: '4rem 2rem',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍯</div>
          <h3 style={{ fontSize: '1.25rem', color: '#1C1917', marginBottom: '0.5rem' }}>
            No reviews match your filter
          </h3>
          <p style={{ color: '#78716C', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto' }}>
            Try changing the tab or searching for another keyword.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredReviews.map((r: any) => {
            const revId = r.id || r.reviewId;
            const isDeleting = deletingId === revId;
            const initials = r.userName
              ? r.userName
                  .split(' ')
                  .map((w: string) => w[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()
              : 'MV';

            return (
              <div
                key={revId}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  border: r.showOnHome ? '2px solid #F59E0B' : '1px solid #E7E5E4',
                  boxShadow: r.showOnHome
                    ? '0 6px 20px rgba(245, 158, 11, 0.12)'
                    : '0 2px 6px rgba(0,0,0,0.02)',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  transition: 'all 0.2s ease',
                }}
              >
                {/* Header row: Reviewer info, Product, and Action Toggle */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  }}
                >
                  {/* Left: Customer Profile */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #FDE68A 0%, #D97706 100%)',
                        color: '#78350F',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        flexShrink: 0,
                      }}
                    >
                      {initials}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 700, fontSize: '1rem', color: '#1C1917' }}>
                          {r.userName}
                        </span>
                        {r.verified && (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px',
                              fontSize: '0.72rem',
                              color: '#059669',
                              backgroundColor: '#ECFDF5',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontWeight: 600,
                            }}
                          >
                            <CheckCircle size={11} /> Verified
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#78716C' }}>
                        {r.date} • {r.userRole || 'Verified Patron'}
                      </div>
                    </div>
                  </div>

                  {/* Middle: Associated Product */}
                  {r.productName && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        backgroundColor: '#FAF7F2',
                        padding: '6px 12px',
                        borderRadius: '12px',
                        border: '1px solid #E7E5E4',
                      }}
                    >
                      {r.productImage && (
                        <img
                          src={r.productImage}
                          alt={r.productName}
                          style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover' }}
                        />
                      )}
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#A8A29E', fontWeight: 600, textTransform: 'uppercase' }}>
                          Product Bought
                        </div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1C1917' }}>
                          {r.productName}
                        </div>
                      </div>
                      {r.productSlug && (
                        <a
                          href={`/product/${r.productSlug}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: '#D97706', display: 'flex', alignItems: 'center' }}
                          title="View Product in Store"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  )}

                  {/* Right: "Show on Home Page" Switch & Delete */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* The Toggle Button / Switch */}
                    <button
                      type="button"
                      onClick={() => handleToggle(r)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '0.5rem 1rem',
                        borderRadius: '9999px',
                        border: r.showOnHome ? '1.5px solid #F59E0B' : '1px solid #D6D3D1',
                        backgroundColor: r.showOnHome ? '#FEF3C7' : '#F5F5F4',
                        color: r.showOnHome ? '#B45309' : '#57534E',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: r.showOnHome ? '0 2px 8px rgba(245, 158, 11, 0.25)' : 'none',
                      }}
                    >
                      <Sparkles size={14} color={r.showOnHome ? '#D97706' : '#78716C'} />
                      <span>{r.showOnHome ? 'Showcased on Home' : 'Show on Home Page'}</span>
                      {/* Pill indicator */}
                      <span
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          backgroundColor: r.showOnHome ? '#10B981' : '#D6D3D1',
                          display: 'inline-block',
                        }}
                      />
                    </button>

                    {/* Delete button */}
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={() => handleDelete(r)}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        backgroundColor: '#FEF2F2',
                        border: '1px solid #FEE2E2',
                        color: '#EF4444',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FEE2E2')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FEF2F2')}
                      title="Delete Review"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Rating Stars and Comment Body */}
                <div
                  style={{
                    backgroundColor: '#FAF7F2',
                    borderRadius: '12px',
                    padding: '1rem 1.25rem',
                    border: '1px solid #F5F5F4',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < r.rating ? '#F59E0B' : 'none'}
                        color={i < r.rating ? '#F59E0B' : '#D6D3D1'}
                      />
                    ))}
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1C1917', marginLeft: '6px' }}>
                      {r.rating}.0 / 5.0
                    </span>
                  </div>

                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.94rem',
                      color: '#44403C',
                      lineHeight: 1.6,
                      fontStyle: 'italic',
                    }}
                  >
                    "{r.comment}"
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default Reviews;
