import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, ShieldCheck, Sparkles } from 'lucide-react';
import { Product } from '../../../types/product.types';
import { useStore } from '../../../store/store';
import { formatPrice } from '../../../utils/formatPrice';
import { Badge } from '../../common/Badge';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();

  const availableSizes = (product.sizes && product.sizes.length > 0)
    ? product.sizes
    : [
        {
          size: product.selectedSize || '500g',
          price: product.price,
          originalPrice: product.originalPrice,
          stock: product.stock,
          sku: '',
        },
      ];

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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, activeSize, 1);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        height: '100%',
      }}
    >
      {/* Top Badges */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        {product.isBestSeller && (
          <Badge variant="gold" size="sm" icon={<Sparkles size={12} />}>
            Bestseller
          </Badge>
        )}
        {product.isOrganicCertified && (
          <Badge variant="green" size="sm" icon={<ShieldCheck size={12} />}>
            100% Raw
          </Badge>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleToggleWishlist}
        aria-label="Wishlist"
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          zIndex: 10,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(4px)',
          border: 'none',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          color: wishlisted ? '#DC2626' : '#78716C',
          transition: 'transform 0.2s',
        }}
        onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <Heart size={18} fill={wishlisted ? '#DC2626' : 'none'} />
      </button>

      {/* Product Image Link */}
      <Link
        to={`/product/${product.slug}`}
        style={{
          display: 'block',
          position: 'relative',
          aspectRatio: '1/1',
          overflow: 'hidden',
          backgroundColor: '#FAF7F2',
        }}
      >
        <img
          src={product.images[0]}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
      </Link>

      {/* Content */}
      <div
        style={{
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        <div>
          {/* Category & Origin */}
          <div className="flex items-center justify-between" style={{ marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {product.category}
            </span>
            <div className="flex items-center gap-1" style={{ color: '#D97706', fontSize: '0.8rem', fontWeight: 600 }}>
              <Star size={13} fill="#D97706" />
              <span>{product.rating}</span>
              <span style={{ color: '#A8A29E', fontWeight: 400 }}>({product.reviewsCount})</span>
            </div>
          </div>

          {/* Title */}
          <Link to={`/product/${product.slug}`}>
            <h3
              style={{
                fontSize: '1.08rem',
                fontWeight: 700,
                color: '#1C1917',
                lineHeight: 1.35,
                marginBottom: '0.5rem',
                minHeight: '2.7rem',
              }}
            >
              {product.name}
            </h3>
          </Link>

          {/* Tagline snippet */}
          <p
            style={{
              fontSize: '0.82rem',
              color: '#78716C',
              lineHeight: 1.4,
              marginBottom: '1rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '2.3rem',
            }}
          >
            {product.tagline}
          </p>

          {/* Size Pill Selector */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#78716C', marginBottom: '0.35rem', fontWeight: 600 }}>
              Select Size:
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {availableSizes.map((s) => (
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
                    fontSize: '0.78rem',
                    fontWeight: activeSize === s.size ? 700 : 500,
                    border: activeSize === s.size ? '1.5px solid #D97706' : '1px solid #E7E5E4',
                    background: activeSize === s.size ? '#FEF3C7' : '#FFFFFF',
                    color: activeSize === s.size ? '#92400E' : '#57534E',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {s.size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing & Add to Cart */}
        <div>
          <div className="flex items-baseline justify-between" style={{ marginBottom: '0.85rem' }}>
            <div className="flex items-baseline gap-2">
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1C1917' }}>
                {formatPrice(price)}
              </span>
              {originalPrice > price && (
                <span style={{ fontSize: '0.9rem', color: '#A8A29E', textDecoration: 'line-through' }}>
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
            {originalPrice > price && (
              <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700, background: '#ECFDF5', padding: '2px 6px', borderRadius: '4px' }}>
                Save {Math.round(((originalPrice - price) / originalPrice) * 100)}%
              </span>
            )}
          </div>

            <button
              onClick={handleAddToCart}
              style={{
                width: '100%',
                padding: '0.7rem 0.5rem',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: 'clamp(0.82rem, 2.5vw, 0.9rem)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(217, 119, 6, 0.25)',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(217, 119, 6, 0.35)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(217, 119, 6, 0.25)';
              }}
            >
              <ShoppingBag size={16} />
              <span>Add to Basket ({activeSize})</span>
            </button>
        </div>
      </div>
    </div>
  );
};
