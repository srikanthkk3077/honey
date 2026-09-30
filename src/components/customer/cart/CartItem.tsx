import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../../../types/order.types';
import { useStore } from '../../../store/store';
import { formatPrice } from '../../../utils/formatPrice';
import { QuantitySelector } from '../product/QuantitySelector';

export const CartItem: React.FC<{ item: CartItemType }> = ({ item }) => {
  const { updateCartQuantity, removeFromCart, setCartDrawerOpen } = useStore();

  return (
    <div
      className="cart-item-row"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.15rem 0',
        borderBottom: '1px solid #E7E5E4',
        gap: '0.85rem',
      }}
    >
      {/* Product Image & Info */}
      <div className="flex items-start gap-3" style={{ flex: '1 1 200px', minWidth: 0 }}>
        <Link
          to={`/product/${item.slug}`}
          onClick={() => setCartDrawerOpen(false)}
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '12px',
            overflow: 'hidden',
            backgroundColor: '#FAF7F2',
            border: '1px solid #E7E5E4',
            flexShrink: 0,
          }}
        >
          <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </Link>

        <div style={{ minWidth: 0, flex: 1 }}>
          <Link
            to={`/product/${item.slug}`}
            onClick={() => setCartDrawerOpen(false)}
            style={{
              fontWeight: 700,
              fontSize: '0.92rem',
              color: '#1C1917',
              lineHeight: 1.3,
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'normal',
            }}
          >
            {item.name}
          </Link>
          <div style={{ fontSize: '0.8rem', color: '#78716C', marginTop: '2px' }}>
            Size: <span style={{ fontWeight: 600, color: '#D97706' }}>{item.size}</span>
          </div>
          <div className="flex items-baseline gap-2" style={{ marginTop: '2px' }}>
            <span style={{ fontWeight: 700, color: '#1C1917', fontSize: '0.9rem' }}>
              {formatPrice(item.price)}
            </span>
            {item.originalPrice > item.price && (
              <span style={{ fontSize: '0.78rem', color: '#A8A29E', textDecoration: 'line-through' }}>
                {formatPrice(item.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quantity, Total & Delete */}
      <div className="flex items-center justify-between gap-3" style={{ flex: '0 0 auto', marginLeft: 'auto' }}>
        <QuantitySelector
          quantity={item.quantity}
          onDecrease={() => updateCartQuantity(item.id, item.quantity - 1)}
          onIncrease={() => updateCartQuantity(item.id, item.quantity + 1)}
          size="sm"
        />

        <div style={{ minWidth: '65px', textAlign: 'right', fontWeight: 800, fontSize: '0.98rem', color: '#1C1917' }}>
          {formatPrice(item.price * item.quantity)}
        </div>

        <button
          onClick={() => removeFromCart(item.id)}
          style={{
            background: 'none',
            border: 'none',
            color: '#A8A29E',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = '#DC2626')}
          onMouseOut={(e) => (e.currentTarget.style.color = '#A8A29E')}
          title="Remove item"
        >
          <Trash2 size={17} />
        </button>
      </div>
    </div>
  );
};
