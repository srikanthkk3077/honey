import React from 'react';
import { useStore } from '../../../store/store';
import { formatPrice } from '../../../utils/formatPrice';

export const OrderSummary: React.FC = () => {
  const { cart, cartSubtotal, cartShippingFee, cartTotal } = useStore();

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        padding: '1.75rem',
        border: '1px solid #E7E5E4',
      }}
    >
      <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: '#1C1917' }}>
        Items ({cart.length})
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '320px', overflowY: 'auto', marginBottom: '1.5rem', paddingRight: '4px' }}>
        {cart.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <img
              src={item.image}
              alt={item.name}
              style={{ width: '54px', height: '54px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #E7E5E4' }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1C1917', lineHeight: 1.3 }}>{item.name}</div>
              <div style={{ fontSize: '0.8rem', color: '#78716C' }}>Qty: {item.quantity} × {item.size}</div>
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#1C1917' }}>
              {formatPrice(item.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid #E7E5E4', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
        <div className="flex items-center justify-between">
          <span style={{ color: '#78716C' }}>Subtotal</span>
          <span style={{ fontWeight: 600, color: '#1C1917' }}>{formatPrice(cartSubtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span style={{ color: '#78716C' }}>Shipping</span>
          <span style={{ fontWeight: 600, color: cartShippingFee === 0 ? '#059669' : '#1C1917' }}>
            {cartShippingFee === 0 ? 'FREE' : formatPrice(cartShippingFee)}
          </span>
        </div>
        <div
          className="flex items-baseline justify-between"
          style={{ borderTop: '1px solid #E7E5E4', paddingTop: '0.75rem', marginTop: '0.5rem' }}
        >
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1C1917' }}>Total Due</span>
          <span style={{ fontWeight: 800, fontSize: '1.5rem', color: '#1C1917' }}>
            {formatPrice(cartTotal)}
          </span>
        </div>
      </div>
    </div>
  );
};
