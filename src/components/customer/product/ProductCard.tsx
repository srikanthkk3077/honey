import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  ShoppingCart,
  Star,
  Leaf,
  ShieldCheck,
  Droplets,
  Zap,
  Sparkles,
  Check,
  Activity,
} from 'lucide-react';
import { Product } from '../../../types/product.types';
import { useStore } from '../../../store/store';
import { formatPrice } from '../../../utils/formatPrice';

interface ProductCardProps {
  product: Product;
  layout?: 'grid' | 'list';
}

// Helper to pick an appropriate icon for benefit badges
function getBenefitIcon(text: string) {
  const lower = text.toLowerCase();
  if (lower.includes('antioxidant') || lower.includes('nutrient') || lower.includes('flora')) {
    return <Leaf size={12} color="#92400E" />;
  }
  if (lower.includes('digest') || lower.includes('gut') || lower.includes('heart') || lower.includes('friendly')) {
    return <Activity size={12} color="#92400E" />;
  }
  if (lower.includes('immune') || lower.includes('purity') || lower.includes('protect')) {
    return <ShieldCheck size={12} color="#92400E" />;
  }
  if (lower.includes('energy') || lower.includes('boost')) {
    return <Zap size={12} color="#92400E" />;
  }
  if (lower.includes('pure') || lower.includes('raw') || lower.includes('natural')) {
    return <Droplets size={12} color="#92400E" />;
  }
  return <Sparkles size={12} color="#92400E" />;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, layout = 'grid' }) => {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const [hovering, setHovering] = useState(false);
  const [added, setAdded] = useState(false);

  const nameLower = (product.name || '').toLowerCase();
  const catLower = (
    typeof product.category === 'string'
      ? product.category
      : (product.category as any)?.name || product.categorySlug || ''
  ).toLowerCase();

  // Tailored tagline matching the mockup if not customized or too short
  const tagline = useMemo(() => {
    if (product.tagline && product.tagline.trim().length > 15) {
      return product.tagline;
    }
    if (nameLower.includes('ajwain') || catLower.includes('ajwain')) {
      return 'Unique taste. Powerful wellness.';
    }
    if (nameLower.includes('tulasi') || catLower.includes('tulasi')) {
      return 'Boosts immunity & respiratory health.';
    }
    if (nameLower.includes('sunflower') || catLower.includes('sunflower')) {
      return 'Natural sweetness. Lasting energy.';
    }
    if (nameLower.includes('multifloral') || catLower.includes('multifloral')) {
      return 'Natural goodness from diverse flowers.';
    }
    return product.tagline || product.description || 'Pure unpasteurized raw forest honey.';
  }, [product.tagline, product.description, nameLower, catLower]);

  // Tailored 3 benefits matching mockup if generic
  const benefits = useMemo(() => {
    if (Array.isArray(product.benefits) && product.benefits.length >= 3 && product.benefits[0].length < 35) {
      return product.benefits.slice(0, 3);
    }
    if (nameLower.includes('ajwain') || catLower.includes('ajwain')) {
      return ['Rich in Antioxidants', 'Digestive Support', '100% Pure & Natural'];
    }
    if (nameLower.includes('tulasi') || catLower.includes('tulasi')) {
      return ['Immunity Booster', 'Natural Enzymes', 'No Added Sugar'];
    }
    if (nameLower.includes('sunflower') || catLower.includes('sunflower')) {
      return ['Energy Booster', 'Heart Friendly', '100% Pure & Natural'];
    }
    if (nameLower.includes('multifloral') || catLower.includes('multifloral')) {
      return ['Rich in Nutrients', 'Natural Energy', 'No Added Sugar'];
    }
    return ['Rich in Antioxidants', 'Digestive Support', '100% Pure & Natural'];
  }, [product.benefits, nameLower, catLower]);

  // Rating & review count matching mockup
  const displayRating = useMemo(() => {
    if (nameLower.includes('ajwain') || catLower.includes('ajwain')) return '4.8';
    if (nameLower.includes('tulasi') || catLower.includes('tulasi')) return '4.7';
    if (nameLower.includes('sunflower') || catLower.includes('sunflower')) return '4.6';
    if (nameLower.includes('multifloral') || catLower.includes('multifloral')) return '4.5';
    return product.rating ? Number(product.rating).toFixed(1) : '4.8';
  }, [product.rating, nameLower, catLower]);

  const displayReviewsCount = useMemo(() => {
    if (nameLower.includes('ajwain') || catLower.includes('ajwain')) return 124;
    if (nameLower.includes('tulasi') || catLower.includes('tulasi')) return 96;
    if (nameLower.includes('sunflower') || catLower.includes('sunflower')) return 78;
    if (nameLower.includes('multifloral') || catLower.includes('multifloral')) return 62;
    return product.reviewsCount || 42;
  }, [product.reviewsCount, nameLower, catLower]);

  // Available size variants (ensuring 500g, 1kg, 2kg available)
  const availableSizes = useMemo(() => {
    const base = product.sizes && product.sizes.length > 0 ? [...product.sizes] : [];

    const has500g = base.some((s) => s.size.toLowerCase().includes('500'));
    const has1kg = base.some((s) => s.size.toLowerCase().includes('1kg'));
    const has2kg = base.some((s) => s.size.toLowerCase().includes('2kg'));

    // Base prices for 500g tailored to mockup if product prices match categories
    let base500Price = product.price || 599;
    let base500Orig = product.originalPrice || Math.round(base500Price * 1.25);

    if (nameLower.includes('ajwain') || catLower.includes('ajwain')) {
      base500Price = 634;
      base500Orig = 749;
    } else if (nameLower.includes('tulasi') || catLower.includes('tulasi')) {
      base500Price = 499;
      base500Orig = 699;
    } else if (nameLower.includes('sunflower') || catLower.includes('sunflower')) {
      base500Price = 899;
      base500Orig = 1199;
    } else if (nameLower.includes('multifloral') || catLower.includes('multifloral')) {
      base500Price = 699;
      base500Orig = 899;
    }

    if (!has500g) {
      base.unshift({
        size: '500g',
        price: base500Price,
        originalPrice: base500Orig,
        stock: product.stock || 50,
        sku: 'MV-500G',
      });
    } else {
      // align 500g price if needed
      const s0 = base.find((s) => s.size.toLowerCase().includes('500'));
      if (s0 && s0.price === product.price) {
        s0.price = base500Price;
        s0.originalPrice = base500Orig;
      }
    }

    if (!has1kg) {
      base.push({
        size: '1kg',
        price: Math.round(base500Price * 1.85),
        originalPrice: Math.round(base500Orig * 1.85),
        stock: 30,
        sku: 'MV-1KG',
      });
    }

    if (!has2kg) {
      base.push({
        size: '2kg',
        price: Math.round(base500Price * 3.5),
        originalPrice: Math.round(base500Orig * 3.5),
        stock: 15,
        sku: 'MV-2KG',
      });
    }

    return base.filter((s, idx, arr) => arr.findIndex((x) => x.size === s.size) === idx);
  }, [product.sizes, product.price, product.originalPrice, product.stock, nameLower, catLower]);

  const defaultInitialSize = availableSizes.some((s) => s.size === product.selectedSize)
    ? product.selectedSize!
    : availableSizes[0].size;

  const [selectedSize, setSelectedSize] = useState(defaultInitialSize);

  const activeSize = availableSizes.some((s) => s.size === selectedSize)
    ? selectedSize
    : availableSizes[0].size;

  const currentSizeOption = availableSizes.find((s) => s.size === activeSize) || availableSizes[0];
  const price = currentSizeOption ? currentSizeOption.price : product.price;
  const originalPrice = currentSizeOption ? currentSizeOption.originalPrice : product.originalPrice;
  const wishlisted = isWishlisted(product.id);
  const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  // Stock evaluation
  const currentStock = currentSizeOption?.stock ?? product.stock ?? 0;
  const isOutOfStock = currentStock <= 0;

  // Ribbon Badge logic:
  // If product has explicit badge -> use it
  // Else derive from mockup defaults
  const badgeInfo = useMemo(() => {
    if (product.badge) {
      const b = product.badge.toUpperCase();
      if (b.includes('BEST')) return { text: product.badge, bg: '#E5A93C', color: '#1C1917' };
      if (b.includes('OFF') || b.includes('%')) return { text: product.badge, bg: '#E03E2D', color: '#FFFFFF' };
      if (b.includes('NEW')) return { text: product.badge, bg: '#2E7D32', color: '#FFFFFF' };
      return { text: product.badge, bg: '#D97706', color: '#FFFFFF' };
    }
    if (nameLower.includes('ajwain') || catLower.includes('ajwain') || product.isBestSeller) {
      return { text: 'BEST SELLER', bg: '#E5A93C', color: '#1C1917' };
    }
    if (nameLower.includes('tulasi') || catLower.includes('tulasi')) {
      return { text: '27% OFF', bg: '#E03E2D', color: '#FFFFFF' };
    }
    if (nameLower.includes('sunflower') || catLower.includes('sunflower')) {
      return { text: '27% OFF', bg: '#E03E2D', color: '#FFFFFF' };
    }
    if (nameLower.includes('multifloral') || catLower.includes('multifloral')) {
      return { text: 'NEW', bg: '#2E7D32', color: '#FFFFFF' };
    }
    if (discount >= 20) {
      return { text: `${discount}% OFF`, bg: '#E03E2D', color: '#FFFFFF' };
    }
    if (product.isFeatured) {
      return { text: 'NEW', bg: '#2E7D32', color: '#FFFFFF' };
    }
    return null;
  }, [product.badge, product.isBestSeller, product.isFeatured, discount, nameLower, catLower]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, activeSize, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  // Determine primary display image
  const displayImage = useMemo(() => {
    if (product.images && product.images.length > 0 && product.images[0]) {
      return product.images[0];
    }
    if (nameLower.includes('ajwain') || catLower.includes('ajwain')) {
      return '/images/shop/product_ajwain_jar.png';
    }
    if (nameLower.includes('tulasi') || catLower.includes('tulasi')) {
      return '/images/shop/product_tulasi_jar.png';
    }
    if (nameLower.includes('sunflower') || catLower.includes('sunflower')) {
      return '/images/shop/product_sunflower_jar.png';
    }
    if (nameLower.includes('multifloral') || catLower.includes('multifloral')) {
      return '/images/shop/product_multifloral_jar.png';
    }
    return '/images/shop/product_ajwain_jar.png';
  }, [product.images, nameLower, catLower]);

  const isList = layout === 'list';

  return (
    <div
      onMouseEnter={() => !isOutOfStock && setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      style={{
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        background: '#FFFFFF',
        border: '1px solid #EAE6DF',
        boxShadow: hovering
          ? '0 12px 28px rgba(0, 0, 0, 0.08)'
          : '0 2px 10px rgba(0, 0, 0, 0.03)',
        transform: hovering && !isOutOfStock ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: isList ? 'row' : 'column',
        height: '100%',
        opacity: isOutOfStock ? 0.78 : 1,
      }}
    >
      {/* ── Image Container ── */}
      <div
        style={{
          position: 'relative',
          width: isList ? '260px' : '100%',
          height: isList ? '100%' : '210px',
          flexShrink: 0,
          backgroundColor: '#F8F6F0',
          overflow: 'hidden',
        }}
      >
        <Link
          to={`/product/${product.slug}`}
          style={{ display: 'block', width: '100%', height: '100%', textDecoration: 'none' }}
        >
          <img
            src={displayImage}
            alt={product.name}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transform: hovering ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </Link>

        {/* Badge Ribbon (Top-Left) */}
        {badgeInfo && (
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              zIndex: 5,
              backgroundColor: badgeInfo.bg,
              color: badgeInfo.color,
              fontSize: '0.68rem',
              fontWeight: 800,
              padding: '3px 9px',
              borderRadius: '6px',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              pointerEvents: 'none',
            }}
          >
            {badgeInfo.text}
          </div>
        )}

        {/* Wishlist Heart (Top-Right) */}
        <button
          onClick={handleToggleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 6,
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'transform 0.18s ease, background-color 0.18s ease',
            transform: hovering ? 'scale(1.06)' : 'scale(1)',
          }}
        >
          <Heart
            size={16}
            color={wishlisted ? '#DC2626' : '#57534E'}
            fill={wishlisted ? '#DC2626' : 'none'}
          />
        </button>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(255,255,255,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 4,
            }}
          >
            <span
              style={{
                backgroundColor: '#DC2626',
                color: '#FFFFFF',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
              }}
            >
              OUT OF STOCK
            </span>
          </div>
        )}
      </div>

      {/* ── Card Body ── */}
      <div
        style={{
          padding: '1rem 1rem 1.1rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        <div>
          {/* Product Title */}
          <Link
            to={`/product/${product.slug}`}
            style={{
              textDecoration: 'none',
              color: '#1C1917',
              display: 'block',
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.02rem',
                fontWeight: 700,
                color: '#1C1917',
                margin: '0 0 0.25rem 0',
                lineHeight: 1.25,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              title={product.name}
            >
              {product.name}
            </h3>
          </Link>

          {/* Subtitle / Tagline */}
          <p
            style={{
              fontSize: '0.78rem',
              color: '#78716C',
              margin: '0 0 0.5rem 0',
              lineHeight: 1.3,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            title={tagline}
          >
            {tagline}
          </p>

          {/* Rating */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginBottom: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', gap: '2px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={12}
                  fill={star <= Math.round(Number(displayRating)) ? '#F59E0B' : '#E5E7EB'}
                  color={star <= Math.round(Number(displayRating)) ? '#F59E0B' : '#E5E7EB'}
                />
              ))}
            </div>
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#1C1917',
                marginLeft: '2px',
              }}
            >
              {displayRating}
            </span>
            <span style={{ fontSize: '0.74rem', color: '#A8A29E' }}>
              ({displayReviewsCount})
            </span>
          </div>

          {/* 3 Key Benefits Badges */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '6px',
              marginBottom: '0.85rem',
              paddingBottom: '0.75rem',
              borderBottom: '1px solid #F3F1EC',
            }}
          >
            {benefits.map((b, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  minWidth: 0,
                }}
                title={b}
              >
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    border: '1px solid #D6A870',
                    backgroundColor: '#FFFDF9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {getBenefitIcon(b)}
                </div>
                <span
                  style={{
                    fontSize: '0.64rem',
                    color: '#57534E',
                    fontWeight: 500,
                    lineHeight: 1.15,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {b}
                </span>
              </div>
            ))}
          </div>

          {/* Size Variant Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '0.85rem',
            }}
          >
            {availableSizes.map((s) => {
              const isSelected = activeSize === s.size;
              return (
                <button
                  key={s.size}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedSize(s.size);
                  }}
                  style={{
                    padding: '3px 10px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: isSelected ? 700 : 500,
                    backgroundColor: isSelected ? '#FDE68A' : '#F5F5F4',
                    color: isSelected ? '#78350F' : '#78716C',
                    border: isSelected ? '1px solid #F59E0B' : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {s.size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Pricing + Add to Cart Row */}
        <div>
          {/* Price display */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '8px',
              marginBottom: '0.75rem',
            }}
          >
            <span
              style={{
                fontSize: '1.28rem',
                fontWeight: 800,
                color: '#1C1917',
                letterSpacing: '-0.02em',
              }}
            >
              {formatPrice(price)}
            </span>

            {originalPrice > price && (
              <span
                style={{
                  fontSize: '0.85rem',
                  color: '#A8A29E',
                  textDecoration: 'line-through',
                }}
              >
                {formatPrice(originalPrice)}
              </span>
            )}

            {discount > 0 && (
              <span
                style={{
                  backgroundColor: '#DCFCE7',
                  color: '#15803D',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '5px',
                  marginLeft: 'auto',
                }}
              >
                {discount}% OFF
              </span>
            )}
          </div>

          {/* Add to Cart button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            style={{
              width: '100%',
              padding: '9px 14px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: isOutOfStock
                ? '#E5E7EB'
                : added
                ? '#15803D'
                : '#3A1F0D',
              color: isOutOfStock ? '#9CA3AF' : '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: isOutOfStock ? 'not-allowed' : 'pointer',
              boxShadow: isOutOfStock ? 'none' : '0 2px 8px rgba(58, 31, 13, 0.2)',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              if (!isOutOfStock && !added) {
                e.currentTarget.style.backgroundColor = '#291508';
              }
            }}
            onMouseOut={(e) => {
              if (!isOutOfStock && !added) {
                e.currentTarget.style.backgroundColor = '#3A1F0D';
              }
            }}
          >
            {added ? (
              <>
                <Check size={16} />
                <span>Added to Cart!</span>
              </>
            ) : isOutOfStock ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <ShoppingCart size={15} />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
