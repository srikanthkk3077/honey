import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../../store/store';
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import { Testimonial } from '../../../data/testimonials';
import { TestimonialCardShimmer } from '../../common/Shimmer';

export const Testimonials: React.FC = () => {
  const { homeReviews, isHomeReviewsLoading } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3);
  const [isHovered, setIsHovered] = useState(false);
  const [avatarErrors, setAvatarErrors] = useState<Record<string, boolean>>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Touch swipe refs
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Pure live data from database/admin curation - zero mock data
  const rawReviews: Testimonial[] = homeReviews || [];
  const totalReviews = rawReviews.length;

  // Responsive cardsToShow detection
  const updateCardsToShow = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (window.innerWidth < 640) {
      setCardsToShow(1);
    } else if (window.innerWidth < 1024) {
      setCardsToShow(2);
    } else {
      setCardsToShow(3);
    }
  }, []);

  useEffect(() => {
    updateCardsToShow();
    window.addEventListener('resize', updateCardsToShow);
    return () => window.removeEventListener('resize', updateCardsToShow);
  }, [updateCardsToShow]);

  // Max index calculation for smooth card-by-card sliding
  const maxIndex = Math.max(0, totalReviews - cardsToShow);

  // Ensure currentIndex stays within bounds if reviews or cardsToShow change
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(Math.max(0, maxIndex));
    }
  }, [maxIndex, currentIndex]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Auto-play every 6s when not hovered
  useEffect(() => {
    if (isHovered || totalReviews <= cardsToShow) return;

    autoPlayRef.current = setInterval(() => {
      handleNext();
    }, 6000);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [handleNext, isHovered, totalReviews, cardsToShow]);

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
  };

  // If not loading and no admin-approved reviews are set, don't show an empty or dummy section
  if (!isHomeReviewsLoading && totalReviews === 0) {
    return null;
  }

  return (
    <section
      id="testimonials-section"
      style={{
        position: 'relative',
        padding: '6rem 0',
        backgroundColor: '#FCFAF6',
        overflow: 'hidden',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ambient warm golden glows in background */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '15%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.12) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(217, 119, 6, 0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Section Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            marginBottom: '2.5rem',
          }}
        >
          {/* Title & Badge */}
          <div style={{ maxWidth: '640px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '9999px',
                backgroundColor: '#FEF3C7',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                color: '#92400E',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '1rem',
                boxShadow: '0 2px 10px rgba(217, 119, 6, 0.1)',
              }}
            >
              <Sparkles size={13} color="#D97706" />
              <span>100% Real Community Reviews {totalReviews > 0 ? `(${totalReviews} Stories)` : ''}</span>
            </div>

            <h2
              style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontSize: 'clamp(2rem, 3.8vw, 2.85rem)',
                fontWeight: 800,
                color: '#1C1917',
                lineHeight: 1.15,
                margin: '0 0 0.85rem 0',
                letterSpacing: '-0.02em',
              }}
            >
              Loved by Doctors, Chefs & Families
            </h2>

            <p style={{ color: '#57534E', fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>
              Hear what patrons and certified nutritionists across India experience with unheated, unfiltered raw forest honey.
            </p>
          </div>

          {/* Right Header: Slider Navigation Arrows & Progress */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Quick Trust Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 16px',
                borderRadius: '16px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E7E5E4',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              }}
              className="hidden sm:flex"
            >
              <div style={{ display: 'flex', alignItems: 'center', color: '#F59E0B' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="#F59E0B" />
                ))}
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1C1917' }}>
                4.95 / 5.0 Rating
              </div>
            </div>

            {/* Slider Arrow Controls */}
            {totalReviews > cardsToShow && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handlePrev}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #E7E5E4',
                    color: '#44403C',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FEF3C7';
                    e.currentTarget.style.borderColor = '#D97706';
                    e.currentTarget.style.color = '#B45309';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.borderColor = '#E7E5E4';
                    e.currentTarget.style.color = '#44403C';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  aria-label="Previous Stories"
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #E7E5E4',
                    color: '#44403C',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FEF3C7';
                    e.currentTarget.style.borderColor = '#D97706';
                    e.currentTarget.style.color = '#B45309';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.borderColor = '#E7E5E4';
                    e.currentTarget.style.color = '#44403C';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  aria-label="Next Stories"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Carousel Viewport Container */}
        <div
          ref={containerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            overflow: 'hidden',
            width: '100%',
            padding: '12px 0 24px 0',
          }}
        >
          {isHomeReviewsLoading ? (
            <TestimonialCardShimmer count={cardsToShow} />
          ) : (
            /* Animated Carousel Track: 100% exact width math without pixel/percent mixing */
            <div
              style={{
                display: 'flex',
                margin: '0 -12px',
                transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: `translate3d(-${currentIndex * (100 / cardsToShow)}%, 0, 0)`,
              }}
            >
              {rawReviews.map((item, idx) => {
              const cardKey = item.id || `rev-${idx}`;
              const hasAvatar =
                !!item.avatar &&
                item.avatar.trim().length > 0 &&
                !avatarErrors[cardKey];
              const initials = item.name
                ? item.name
                    .split(' ')
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()
                : 'MV';

              return (
                <div
                  key={cardKey}
                  style={{
                    flex: `0 0 ${100 / cardsToShow}%`,
                    padding: '0 12px',
                    boxSizing: 'border-box',
                    minWidth: 0,
                  }}
                >
                  {/* Luxury Testimonial Card */}
                  <div
                    style={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '24px',
                      padding: '2rem',
                      border: '1.5px solid rgba(245, 158, 11, 0.22)',
                      boxShadow: '0 10px 30px -5px rgba(217, 119, 6, 0.08), 0 2px 8px rgba(0,0,0,0.03)',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-6px)';
                      e.currentTarget.style.borderColor = '#D97706';
                      e.currentTarget.style.boxShadow =
                        '0 20px 40px -10px rgba(217, 119, 6, 0.18), 0 4px 12px rgba(0,0,0,0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.22)';
                      e.currentTarget.style.boxShadow =
                        '0 10px 30px -5px rgba(217, 119, 6, 0.08), 0 2px 8px rgba(0,0,0,0.03)';
                    }}
                  >
                    {/* Subtle warm amber top accent bar */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: 'linear-gradient(90deg, #F59E0B 0%, #D97706 50%, #B45309 100%)',
                      }}
                    />

                    <div>
                      {/* Top Row: Stars + Verified Badge + Quote Icon */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '1.25rem',
                        }}
                      >
                        {/* Rating Stars & Badge */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ display: 'flex', gap: '2px', color: '#F59E0B' }}>
                            {[...Array(item.rating || 5)].map((_, i) => (
                              <Star key={i} size={16} fill="#F59E0B" />
                            ))}
                          </div>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              color: '#059669',
                              backgroundColor: '#ECFDF5',
                              padding: '2px 8px',
                              borderRadius: '9999px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <CheckCircle size={11} /> Verified
                          </span>
                        </div>

                        {/* Large translucent quote symbol */}
                        <Quote size={28} color="#FDE68A" style={{ opacity: 0.8 }} />
                      </div>

                      {/* Review Comment Quote */}
                      <p
                        style={{
                          fontSize: '1rem',
                          color: '#292524',
                          lineHeight: 1.68,
                          fontStyle: 'italic',
                          marginBottom: '1.75rem',
                          minHeight: '4.8rem',
                          display: '-webkit-box',
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        "{item.comment}"
                      </p>
                    </div>

                    {/* Card Footer: Product Bought & Customer Profile */}
                    <div style={{ borderTop: '1px solid #F5F5F4', paddingTop: '1.25rem' }}>
                      {/* Interactive Product Mention Capsule */}
                      {item.productMentioned && (
                        <div style={{ marginBottom: '1rem' }}>
                          <span
                            style={{
                              fontSize: '0.68rem',
                              color: '#A8A29E',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              letterSpacing: '0.06em',
                              display: 'block',
                              marginBottom: '2px',
                            }}
                          >
                            BOUGHT BY CUSTOMER
                          </span>
                          {item.productSlug ? (
                            <Link
                              to={`/product/${item.productSlug}`}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '0.82rem',
                                color: '#B45309',
                                fontWeight: 700,
                                textDecoration: 'none',
                                transition: 'color 0.15s ease',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.color = '#D97706')}
                              onMouseLeave={(e) => (e.currentTarget.style.color = '#B45309')}
                            >
                              <span>🍯 {item.productMentioned}</span>
                              <span style={{ fontSize: '0.85rem' }}>→</span>
                            </Link>
                          ) : (
                            <span
                              style={{
                                fontSize: '0.82rem',
                                color: '#B45309',
                                fontWeight: 700,
                              }}
                            >
                              🍯 {item.productMentioned}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Customer Profile Details */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {hasAvatar ? (
                          <img
                            src={item.avatar}
                            alt={item.name}
                            onError={() =>
                              setAvatarErrors((prev) => ({ ...prev, [cardKey]: true }))
                            }
                            style={{
                              width: '46px',
                              height: '46px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                              border: '2px solid #FDE68A',
                              boxShadow: '0 2px 8px rgba(217, 119, 6, 0.2)',
                              flexShrink: 0,
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '46px',
                              height: '46px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #FDE68A 0%, #D97706 100%)',
                              color: '#78350F',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800,
                              fontSize: '0.95rem',
                              boxShadow: '0 4px 12px rgba(217, 119, 6, 0.22)',
                              flexShrink: 0,
                            }}
                          >
                            {initials}
                          </div>
                        )}

                        <div style={{ minWidth: 0 }}>
                          <div
                            style={{
                              fontWeight: 700,
                              fontSize: '0.95rem',
                              color: '#1C1917',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {item.name}
                          </div>
                          <div
                            style={{
                              fontSize: '0.78rem',
                              color: '#78716C',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {item.role || 'Verified Patron'} {item.location ? `• ${item.location}` : ''}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        </div>

        {/* Bottom Pagination Dots */}
        {maxIndex > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '1.5rem',
            }}
          >
            {Array.from({ length: maxIndex + 1 }).map((_, dotIdx) => {
              const isActive = dotIdx === currentIndex;
              return (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => setCurrentIndex(dotIdx)}
                  style={{
                    width: isActive ? '28px' : '9px',
                    height: '9px',
                    borderRadius: '9999px',
                    backgroundColor: isActive ? '#D97706' : '#D6D3D1',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: isActive ? '0 2px 8px rgba(217, 119, 6, 0.35)' : 'none',
                  }}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
