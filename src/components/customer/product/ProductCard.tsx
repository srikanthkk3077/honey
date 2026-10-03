import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, ShieldCheck, Sparkles, Plus, Minus } from 'lucide-react';
import { Product } from '../../../types/product.types';
import { useStore } from '../../../store/store';
import { formatPrice } from '../../../utils/formatPrice';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const [hovering, setHovering] = useState(false);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

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
  const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, activeSize, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      style={{
        position: 'relative',
        borderRadius: '20px',
        overflow: 'hidden',
        background: '#fff',
        boxShadow: hovering
          ? '0 20px 60px rgba(217,119,6,0.22), 0 4px 20px rgba(0,0,0,0.08)'
          : '0 4px 20px rgba(0,0,0,0.06)',
        transform: hovering ? 'translateY(-6px)' : 'translateY(0)',
        transition: 'all 0.38s cubic-bezier(.4,2,.6,1)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        border: hovering ? '1.5px solid rgba(217,119,6,0.28)' : '1.5px solid rgba(230,225,218,0.7)',
      }}
    >
      {/* ── Image Area ── */}
      <Link
        to={`/product/${product.slug}`}
        style={{ display: 'block', position: 'relative', flexShrink: 0 }}
      >
        {/* Amber radial glow */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          background: 'radial-gradient(ellipse at 50% 80%, rgba(251,191,36,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <img
          src={product.images[0]}
          alt={product.name}
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            display: 'block',
            transform: hovering ? 'scale(1.07)' : 'scale(1)',
            transition: 'transform 0.52s cubic-bezier(.4,2,.6,1)',
            position: 'relative', zIndex: 1,
          }}
        />

        {/* Discount ribbon */}
        {discount > 0 && (
          <div style={{
            position: 'absolute', top: 0, left: 0, zIndex: 5,
            background: 'linear-gradient(135deg, #DC2626 60%, #B91C1C 100%)',
            color: '#fff', fontWeight: 800, fontSize: '0.72rem',
            padding: '5px 10px 5px 8px',
            borderRadius: '0 0 12px 0',
            letterSpacing: '0.03em',
          }}>
            -{discount}% OFF
          </div>
        )}

        {/* Bestseller / Organic pill badges – top-right */}
        <div style={{
          position: 'absolute', top: '10px', right: '10px', zIndex: 5,
          display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px',
        }}>
          {product.isBestSeller && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: '#fff', fontSize: '0.68rem', fontWeight: 700,
              padding: '3px 8px', borderRadius: '20px',
              boxShadow: '0 2px 8px rgba(217,119,6,0.4)',
              letterSpacing: '0.02em',
            }}>
              <Sparkles size={10} /> Bestseller
            </span>
          )}
          {product.isOrganicCertified && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              color: '#fff', fontSize: '0.68rem', fontWeight: 700,
              padding: '3px 8px', borderRadius: '20px',
              boxShadow: '0 2px 8px rgba(5,150,105,0.35)',
            }}>
              <ShieldCheck size={10} /> Organic
            </span>
          )}
        </div>

        {/* Wishlist FAB – bottom-right of image */}
        <button
          onClick={handleToggleWishlist}
          aria-label="Wishlist"
          style={{
            position: 'absolute', bottom: '10px', right: '10px', zIndex: 6,
            width: '34px', height: '34px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: wishlisted ? '#DC2626' : 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(6px)',
            border: 'none', cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(0,0,0,0.18)',
            color: wishlisted ? '#fff' : '#6B7280',
            transform: hovering ? 'scale(1.12)' : 'scale(1)',
            transition: 'all 0.22s ease',
          }}
        >
          <Heart size={15} fill={wishlisted ? '#fff' : 'none'} />
        </button>
      </Link>

      {/* ── Body ── */}
      <div style={{
        padding: '1rem 1.1rem 1.1rem',
        display: 'flex', flexDirection: 'column', flex: 1,
      }}>

        {/* Category + Rating row */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '0.4rem',
        }}>
          <span style={{
            fontSize: '0.68rem', fontWeight: 700, color: '#D97706',
            textTransform: 'uppercase', letterSpacing: '0.08em',
            background: 'rgba(251,191,36,0.12)', padding: '2px 7px',
            borderRadius: '20px', border: '1px solid rgba(217,119,6,0.18)',
          }}>
            {product.category}
          </span>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '3px',
            fontSize: '0.78rem', fontWeight: 700, color: '#B45309',
          }}>
            <Star size={12} fill="#F59E0B" color="#F59E0B" />
            <span>{product.rating}</span>
            <span style={{ color: '#A8A29E', fontWeight: 400, fontSize: '0.72rem' }}>
              ({product.reviewsCount})
            </span>
          </div>
        </div>

        {/* Product name */}
        <Link to={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
          <h3 style={{
            fontSize: '1rem', fontWeight: 800, color: '#1C1917',
            lineHeight: 1.3, marginBottom: '0.3rem',
            minHeight: '2.6rem',
          }}>
            {product.name}
          </h3>
        </Link>

        {/* Tagline */}
        <p style={{
          fontSize: '0.79rem', color: '#78716C', lineHeight: 1.45,
          marginBottom: '0.85rem',
          display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden', minHeight: '2.25rem',
        }}>
          {product.tagline}
        </p>

        {/* Size Selector */}
        {availableSizes.length >= 1 && (
          <div style={{ marginBottom: '0.85rem' }}>
            <p style={{ fontSize: '0.7rem', color: '#A8A29E', fontWeight: 600, marginBottom: '0.35rem', letterSpacing: '0.04em' }}>
              SIZE
            </p>
            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
              {availableSizes.map((s) => (
                <button
                  key={s.size}
                  type="button"
                  onClick={(e) => { e.preventDefault(); setSelectedSize(s.size); }}
                  style={{
                    padding: '3px 10px', borderRadius: '8px',
                    fontSize: '0.74rem',
                    fontWeight: activeSize === s.size ? 700 : 500,
                    border: activeSize === s.size
                      ? '1.5px solid #D97706'
                      : '1.5px solid #E7E5E4',
                    background: activeSize === s.size
                      ? 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)'
                      : '#FAFAF9',
                    color: activeSize === s.size ? '#92400E' : '#57534E',
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                    boxShadow: activeSize === s.size ? '0 2px 6px rgba(217,119,6,0.2)' : 'none',
                  }}
                >
                  {s.size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Price + Quantity Stepper */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '0.75rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#1C1917', letterSpacing: '-0.02em' }}>
              {formatPrice(price)}
            </span>
            {originalPrice > price && (
              <span style={{ fontSize: '0.83rem', color: '#A8A29E', textDecoration: 'line-through' }}>
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          {/* Quantity stepper */}
          <div style={{
            display: 'flex', alignItems: 'center',
            border: '1.5px solid #E7E5E4', borderRadius: '10px', overflow: 'hidden',
          }}>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); setQty(Math.max(1, qty - 1)); }}
              style={{
                width: '28px', height: '28px', border: 'none',
                background: '#FAFAF9', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#57534E', transition: 'background 0.15s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = '#F5F5F4')}
              onMouseOut={(e) => (e.currentTarget.style.background = '#FAFAF9')}
            >
              <Minus size={12} />
            </button>
            <span style={{
              width: '28px', textAlign: 'center', fontSize: '0.82rem',
              fontWeight: 700, color: '#1C1917', userSelect: 'none',
            }}>
              {qty}
            </span>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); setQty(qty + 1); }}
              style={{
                width: '28px', height: '28px', border: 'none',
                background: '#FAFAF9', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#57534E', transition: 'background 0.15s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = '#F5F5F4')}
              onMouseOut={(e) => (e.currentTarget.style.background = '#FAFAF9')}
            >
              <Plus size={12} />
            </button>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          style={{
            width: '100%',
            padding: '0.68rem 0.5rem',
            borderRadius: '12px',
            border: 'none',
            background: added
              ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
              : 'linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #B45309 100%)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '7px',
            cursor: 'pointer',
            boxShadow: added
              ? '0 4px 14px rgba(5,150,105,0.35)'
              : '0 4px 16px rgba(217,119,6,0.35)',
            transition: 'all 0.28s cubic-bezier(.4,2,.6,1)',
            letterSpacing: '0.02em',
            transform: added ? 'scale(0.98)' : 'scale(1)',
          }}
          onMouseOver={(e) => {
            if (!added) {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
              e.currentTarget.style.boxShadow = '0 8px 22px rgba(217,119,6,0.42)';
            }
          }}
          onMouseOut={(e) => {
            if (!added) {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(217,119,6,0.35)';
            }
          }}
        >
          <ShoppingBag size={15} />
          <span>{added ? '✓ Added to Basket!' : `Add to Basket · ${activeSize}`}</span>
        </button>
      </div>

      {/* Animated bottom amber accent bar */}
      <div style={{
        height: '3px',
        background: hovering
          ? 'linear-gradient(90deg, #F59E0B 0%, #D97706 50%, #F59E0B 100%)'
          : 'linear-gradient(90deg, transparent 0%, rgba(217,119,6,0.15) 50%, transparent 100%)',
        transition: 'background 0.4s ease',
        flexShrink: 0,
      }} />
    </div>
  );
};
