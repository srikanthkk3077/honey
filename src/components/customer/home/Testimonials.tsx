import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useStore } from '../../../store/store';
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Check,
  ChefHat,
} from 'lucide-react';
import { Testimonial, INITIAL_TESTIMONIALS } from '../../../data/testimonials';
import { TestimonialCardShimmer } from '../../common/Shimmer';

// Helper to determine if an avatar string is a real customer portrait photo
const isRealCustomerAvatar = (avatar?: string): boolean => {
  if (!avatar || typeof avatar !== 'string') return false;
  const trimmed = avatar.trim();
  if (trimmed.length === 0) return false;
  // Filter out any product pictures that were mistakenly saved in the avatar field
  if (
    trimmed.includes('Honey-Jar') ||
    trimmed.includes('Honey-Stil') ||
    trimmed.includes('products/') ||
    trimmed.includes('Rustic-Ajwain') ||
    trimmed.includes('Sunflower-Honey') ||
    trimmed.includes('Raw-Forest-Honey') ||
    trimmed.includes('IMG-6672')
  ) {
    return false;
  }
  return true;
};

// Decorative vignette image on the bottom right of each card matching Image 1
const CardVignette: React.FC<{ index: number; item: Testimonial }> = ({ index, item }) => {
  const isChef =
    (item.role && item.role.toLowerCase().includes('chef')) ||
    (item.name && item.name.toLowerCase().includes('chef'));

  const isKidsOrToast =
    (item.comment &&
      (item.comment.toLowerCase().includes('toast') ||
        item.comment.toLowerCase().includes('kids') ||
        item.comment.toLowerCase().includes('butter'))) ||
    index % 3 === 2;

  // Chef Card Vignette (Chef Hat Icon + Gourmet Dish)
  if (isChef || index % 3 === 1) {
    return (
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          flexShrink: 0,
        }}
      >
        <div style={{ marginBottom: '-6px', zIndex: 2, marginRight: '4px' }}>
          <ChefHat size={22} color="#D97706" strokeWidth={1.8} />
        </div>
        <img
          src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=140&q=80"
          alt="Chef gourmet honey dish"
          style={{
            width: '64px',
            height: '52px',
            borderRadius: '12px',
            objectFit: 'cover',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          }}
        />
      </div>
    );
  }

  // Kids / Toast Card Vignette (Honey Bowl with Wooden Dipper)
  if (isKidsOrToast) {
    return (
      <div style={{ display: 'flex', alignItems: 'flex-end', flexShrink: 0 }}>
        <img
          src="https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=140&q=80"
          alt="Honey dipper and bowl"
          style={{
            width: '68px',
            height: '54px',
            borderRadius: '12px',
            objectFit: 'cover',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          }}
        />
      </div>
    );
  }

  // Standard Honey Jar Vignette
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', flexShrink: 0 }}>
      <img
        src="https://images.unsplash.com/photo-1587049352851-8d4e8913390a?auto=format&fit=crop&w=140&q=80"
        alt="Madhuvan honey jar"
        style={{
          width: '64px',
          height: '54px',
          borderRadius: '12px',
          objectFit: 'cover',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        }}
      />
    </div>
  );
};

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

  // Use database reviews, or fall back to default testimonials matching Image 1
  const displayReviews: Testimonial[] =
    homeReviews && homeReviews.length > 0 ? homeReviews : INITIAL_TESTIMONIALS;
  const totalReviews = displayReviews.length;

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

  // Max index calculation for card-by-card sliding
  const maxIndex = Math.max(0, totalReviews - cardsToShow);

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

  if (!isHomeReviewsLoading && totalReviews === 0) {
    return null;
  }

  return (
    <section
      id="testimonials-section"
      style={{
        position: 'relative',
        padding: '5rem 0',
        backgroundColor: '#FAF7F2',
        overflow: 'hidden',
        borderTop: '1px solid #ECE7DE',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Section Header matching Image 1: TESTIMONIALS eyebrow, What Our Customers Say heading, subtitle, arrows */}
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
          {/* Title Area */}
          <div>
            <div
              style={{
                color: '#EA580C',
                fontSize: '0.82rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '0.4rem',
              }}
            >
              TESTIMONIALS
            </div>

            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(2rem, 3.4vw, 2.75rem)',
                fontWeight: 800,
                color: '#1C1917',
                lineHeight: 1.15,
                margin: '0 0 0.5rem 0',
                letterSpacing: '-0.02em',
              }}
            >
              What Our Customers Say
            </h2>

            <p
              style={{
                color: '#57534E',
                fontSize: '1rem',
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              Real stories from families, health enthusiasts and professionals across India.
            </p>
          </div>

          {/* Slider Arrow Controls */}
          {totalReviews > cardsToShow && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={handlePrev}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #E7E5E4',
                  color: '#44403C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.borderColor = '#EA580C';
                  e.currentTarget.style.color = '#EA580C';
                  e.currentTarget.style.transform = 'scale(1.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.borderColor = '#E7E5E4';
                  e.currentTarget.style.color = '#44403C';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                aria-label="Previous Stories"
              >
                <ChevronLeft size={20} strokeWidth={2.4} />
              </button>

              <button
                type="button"
                onClick={handleNext}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #E7E5E4',
                  color: '#44403C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.borderColor = '#EA580C';
                  e.currentTarget.style.color = '#EA580C';
                  e.currentTarget.style.transform = 'scale(1.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.borderColor = '#E7E5E4';
                  e.currentTarget.style.color = '#44403C';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                aria-label="Next Stories"
              >
                <ChevronRight size={20} strokeWidth={2.4} />
              </button>
            </div>
          )}
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
            padding: '8px 0 16px 0',
          }}
        >
          {isHomeReviewsLoading ? (
            <TestimonialCardShimmer count={cardsToShow} />
          ) : (
            <div
              style={{
                display: 'flex',
                margin: '0 -12px',
                transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: `translate3d(-${currentIndex * (100 / cardsToShow)}%, 0, 0)`,
              }}
            >
              {displayReviews.map((item, idx) => {
                const cardKey = item.id || `rev-${idx}`;
                // Only treat as customer avatar if it's a real user image (NOT a product bottle image)
                const hasCustomerPhoto =
                  isRealCustomerAvatar(item.avatar) && !avatarErrors[cardKey];

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
                    {/* Testimonial Card matching Image 1 */}
                    <div
                      style={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '20px',
                        padding: '1.75rem',
                        border: '1px solid #ECE7DE',
                        boxShadow: '0 4px 18px rgba(0, 0, 0, 0.05)',
                        transition: 'all 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow =
                          '0 14px 30px rgba(217, 119, 6, 0.12)';
                        e.currentTarget.style.borderColor = '#FDBA74';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 18px rgba(0, 0, 0, 0.05)';
                        e.currentTarget.style.borderColor = '#ECE7DE';
                      }}
                    >
                      <div>
                        {/* Top Row: Stars + Large Golden Double Quote Icon */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '1rem',
                          }}
                        >
                          {/* 5 Solid Orange Stars */}
                          <div style={{ display: 'flex', gap: '3px' }}>
                            {[...Array(item.rating || 5)].map((_, i) => (
                              <Star
                                key={i}
                                size={18}
                                fill="#F59E0B"
                                stroke="#F59E0B"
                              />
                            ))}
                          </div>

                          {/* Decorative Soft Golden Quotation Symbol */}
                          <span
                            style={{
                              fontFamily: "'Playfair Display', Georgia, serif",
                              fontSize: '2.4rem',
                              lineHeight: 0.8,
                              color: '#FDE68A',
                              fontWeight: 900,
                              userSelect: 'none',
                              marginRight: '-4px',
                            }}
                          >
                            “
                          </span>
                        </div>

                        {/* Review Comment Quote */}
                        <p
                          style={{
                            fontSize: '0.98rem',
                            color: '#292524',
                            lineHeight: 1.65,
                            fontStyle: 'italic',
                            margin: '0 0 1.5rem 0',
                            minHeight: '4.8rem',
                            display: '-webkit-box',
                            WebkitLineClamp: 4,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          “{item.comment}”
                        </p>
                      </div>

                      {/* Card Footer: Left (Customer Info) & Right (Decorative Vignette) */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'flex-end',
                          justifyContent: 'space-between',
                          gap: '12px',
                          borderTop: '1px solid #F5F5F4',
                          paddingTop: '1.25rem',
                        }}
                      >
                        {/* Customer Profile Details */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                          {/* If customer image exists, render it. IF NOT, DO NOT RENDER ANY IMAGE! */}
                          {hasCustomerPhoto && (
                            <img
                              src={item.avatar}
                              alt={item.name}
                              onError={() =>
                                setAvatarErrors((prev) => ({ ...prev, [cardKey]: true }))
                              }
                              style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '1.5px solid #FDE68A',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                                flexShrink: 0,
                              }}
                            />
                          )}

                          <div style={{ minWidth: 0 }}>
                            <div
                              style={{
                                fontWeight: 700,
                                fontSize: '0.96rem',
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
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                marginTop: '2px',
                              }}
                            >
                              <span
                                style={{
                                  width: '14px',
                                  height: '14px',
                                  borderRadius: '50%',
                                  backgroundColor: '#10B981',
                                  color: '#FFFFFF',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0,
                                }}
                              >
                                <Check size={9} strokeWidth={3.5} />
                              </span>
                              <span
                                style={{
                                  fontSize: '0.78rem',
                                  fontWeight: 600,
                                  color: '#4B5563',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {item.role?.toLowerCase().includes('patron')
                                  ? 'Verified Patron'
                                  : 'Verified Buyer'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right Decorative Vignette matching Image 1 */}
                        <CardVignette index={idx} item={item} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Pagination Dots matching Image 1 */}
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
                    width: isActive ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '9999px',
                    backgroundColor: isActive ? '#F97316' : '#D1D5DB',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
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

export default Testimonials;
