import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../../types/product.types';
import { useStore } from '../../../store/store';
import { formatPrice } from '../../../utils/formatPrice';
import { QuantitySelector } from './QuantitySelector';
import { Button } from '../../common/Button';
import { Badge } from '../../common/Badge';
import { Star, ShieldCheck, Truck, RotateCcw, Droplet, Sparkles, Heart } from 'lucide-react';

export const ProductInfo: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart, toggleWishlist, isWishlisted, setCartDrawerOpen } = useStore();
  const navigate = useNavigate();

  const [selectedSize, setSelectedSize] = useState(
    product.selectedSize || product.sizes[0]?.size || '500g'
  );
  const [quantity, setQuantity] = useState(1);

  const currentSizeOption = product.sizes.find((s) => s.size === selectedSize) || product.sizes[0];
  const price = currentSizeOption ? currentSizeOption.price : product.price;
  const originalPrice = currentSizeOption ? currentSizeOption.originalPrice : product.originalPrice;
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, quantity);
    navigate('/checkout');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Badges & Category */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="gold" size="sm" icon={<Sparkles size={12} />}>
          {product.category}
        </Badge>
        {product.isOrganicCertified && (
          <Badge variant="green" size="sm" icon={<ShieldCheck size={12} />}>
            Purity: {product.purityScore}% NMR Verified
          </Badge>
        )}
      </div>

      {/* Product Title */}
      <div>
        <h1 style={{ fontSize: 'clamp(1.85rem, 3vw, 2.5rem)', color: '#1C1917', marginBottom: '0.5rem' }}>
          {product.name}
        </h1>
        <p style={{ fontSize: '1.05rem', color: '#78716C', fontStyle: 'italic' }}>
          {product.tagline}
        </p>
      </div>

      {/* Ratings */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1" style={{ color: '#F59E0B' }}>
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={18} fill={i < Math.floor(product.rating) ? '#F59E0B' : 'none'} />
          ))}
        </div>
        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1C1917' }}>{product.rating}</span>
        <span style={{ color: '#78716C', fontSize: '0.85rem' }}>• {product.reviewsCount} customer reviews</span>
      </div>

      {/* Price block */}
      <div
        style={{
          padding: '1.25rem',
          borderRadius: '16px',
          backgroundColor: '#FAF7F2',
          border: '1px solid #E7E5E4',
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
        }}
      >
        <div className="flex items-baseline gap-3">
          <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1C1917' }}>
            {formatPrice(price)}
          </span>
          {originalPrice > price && (
            <span style={{ fontSize: '1.15rem', color: '#A8A29E', textDecoration: 'line-through' }}>
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>
        {originalPrice > price && (
          <span style={{ padding: '4px 10px', background: '#ECFDF5', color: '#065F46', fontWeight: 700, borderRadius: '8px', fontSize: '0.85rem' }}>
            Save {Math.round(((originalPrice - price) / originalPrice) * 100)}% Today
          </span>
        )}
      </div>

      {/* Size Option Selection */}
      <div>
        <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#44403C', marginBottom: '0.6rem' }}>
          Select Jar Size:
        </label>
        <div className="flex items-center gap-3 flex-wrap">
          {product.sizes.map((s) => (
            <button
              key={s.size}
              type="button"
              onClick={() => setSelectedSize(s.size)}
              style={{
                padding: '0.75rem 1.4rem',
                borderRadius: '12px',
                border: selectedSize === s.size ? '2px solid #D97706' : '1px solid #D6D3D1',
                backgroundColor: selectedSize === s.size ? '#FFFBEB' : '#FFFFFF',
                color: selectedSize === s.size ? '#92400E' : '#1C1917',
                fontWeight: selectedSize === s.size ? 700 : 500,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{s.size}</span>
              <span style={{ fontSize: '0.78rem', color: selectedSize === s.size ? '#D97706' : '#78716C' }}>
                {formatPrice(s.price)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Quantity & Actions */}
      <div className="flex items-center gap-4 flex-wrap">
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#44403C', marginBottom: '0.4rem' }}>
            Quantity:
          </label>
          <QuantitySelector
            quantity={quantity}
            onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
            onIncrease={() => setQuantity((q) => q + 1)}
          />
        </div>

        <div className="flex items-center gap-3" style={{ flex: 1, minWidth: '240px', marginTop: '1.4rem' }}>
          <Button
            size="lg"
            fullWidth
            onClick={handleAddToCart}
            leftIcon={<Droplet size={18} />}
          >
            Add to Basket
          </Button>

          <Button
            size="lg"
            variant="forest"
            fullWidth
            onClick={handleBuyNow}
          >
            Instant Buy Now
          </Button>

          <button
            onClick={() => toggleWishlist(product.id)}
            style={{
              padding: '0.85rem',
              borderRadius: '12px',
              border: '1px solid #D6D3D1',
              background: '#FFFFFF',
              color: wishlisted ? '#DC2626' : '#78716C',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Wishlist"
          >
            <Heart size={22} fill={wishlisted ? '#DC2626' : 'none'} />
          </button>
        </div>
      </div>

      {/* Trust bullets */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          padding: '1rem 0',
          borderTop: '1px solid #E7E5E4',
          borderBottom: '1px solid #E7E5E4',
        }}
      >
        <div className="flex items-center gap-2">
          <Truck size={18} color="#D97706" />
          <span style={{ fontSize: '0.82rem', color: '#57534E' }}>Express 2-4 Day Safe Delivery</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} color="#059669" />
          <span style={{ fontSize: '0.82rem', color: '#57534E' }}>100% Raw Certified Guarantee</span>
        </div>
        <div className="flex items-center gap-2">
          <RotateCcw size={18} color="#3B82F6" />
          <span style={{ fontSize: '0.82rem', color: '#57534E' }}>Damage Free Glass Jar Transit</span>
        </div>
      </div>

      {/* Harvest Spec Sheet */}
      <div style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E7E5E4' }}>
        <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#1C1917' }}>Apiary Spec Sheet</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', fontSize: '0.88rem' }}>
          <div>
            <span style={{ color: '#78716C' }}>Geographic Origin:</span>
            <div style={{ fontWeight: 600, color: '#1C1917' }}>{product.origin}</div>
          </div>
          <div>
            <span style={{ color: '#78716C' }}>Floral Source:</span>
            <div style={{ fontWeight: 600, color: '#1C1917' }}>{product.nectarSource}</div>
          </div>
          <div>
            <span style={{ color: '#78716C' }}>Harvest Season:</span>
            <div style={{ fontWeight: 600, color: '#1C1917' }}>{product.harvestSeason}</div>
          </div>
          <div>
            <span style={{ color: '#78716C' }}>Lab NMR Purity:</span>
            <div style={{ fontWeight: 600, color: '#059669' }}>{product.purityScore}% (Unheated)</div>
          </div>
        </div>
      </div>
    </div>
  );
};
