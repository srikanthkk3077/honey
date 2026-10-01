import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Tag, Truck } from 'lucide-react';
import { useStore } from '../../../store/store';
import { formatPrice } from '../../../utils/formatPrice';
import { FREE_SHIPPING_THRESHOLD } from '../../../utils/constants';
import { Button } from '../../common/Button';

export const CartSummary: React.FC = () => {
  const { cartSubtotal, cartDiscount, cartShippingFee, cartTotal, setCartDrawerOpen, showToast, isAuthenticated } = useStore();
  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(0);
  const navigate = useNavigate();

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'MADHUVAN10') {
      const extraDiscount = Math.round(cartSubtotal * 0.1);
      setDiscountApplied(extraDiscount);
      showToast('10% Harvest discount applied!', 'success');
    } else {
      showToast('Invalid promo code. Try MADHUVAN10', 'error');
    }
  };

  const finalTotal = Math.max(0, cartTotal - discountApplied);
  const freeShippingAway = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);

  return (
    <div
      className="cart-summary-card"
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        padding: 'clamp(1.25rem, 3vw, 1.75rem)',
        border: '1px solid #E7E5E4',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
      }}
    >
      <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: '#1C1917' }}>
        Order Summary
      </h3>

      {/* Free shipping progress bar */}
      <div
        style={{
          backgroundColor: '#FFFBEB',
          border: '1px solid #FEF3C7',
          padding: '0.85rem 1rem',
          borderRadius: '12px',
          marginBottom: '1.5rem',
          fontSize: '0.85rem',
        }}
      >
        {freeShippingAway > 0 ? (
          <div>
            <div className="flex items-center gap-2" style={{ color: '#92400E', fontWeight: 600, marginBottom: '6px' }}>
              <Truck size={16} /> Add {formatPrice(freeShippingAway)} more for Free Pan-India Delivery!
            </div>
            <div style={{ width: '100%', height: '6px', background: '#FEF3C7', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${Math.min(100, ((FREE_SHIPPING_THRESHOLD - freeShippingAway) / FREE_SHIPPING_THRESHOLD) * 100)}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #F59E0B, #D97706)',
                }}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2" style={{ color: '#065F46', fontWeight: 700 }}>
            🎉 You have qualified for Free Express Shipping!
          </div>
        )}
      </div>

      {/* Breakdown lines */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
        <div className="flex items-center justify-between">
          <span style={{ color: '#78716C' }}>Subtotal</span>
          <span style={{ fontWeight: 600, color: '#1C1917' }}>{formatPrice(cartSubtotal)}</span>
        </div>

        {cartDiscount > 0 && (
          <div className="flex items-center justify-between">
            <span style={{ color: '#059669' }}>Total Savings</span>
            <span style={{ fontWeight: 600, color: '#059669' }}>- {formatPrice(cartDiscount)}</span>
          </div>
        )}

        {discountApplied > 0 && (
          <div className="flex items-center justify-between">
            <span style={{ color: '#D97706' }}>Coupon Discount (MADHUVAN10)</span>
            <span style={{ fontWeight: 600, color: '#D97706' }}>- {formatPrice(discountApplied)}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span style={{ color: '#78716C' }}>Shipping</span>
          <span style={{ fontWeight: 600, color: cartShippingFee === 0 ? '#059669' : '#1C1917' }}>
            {cartShippingFee === 0 ? 'FREE' : formatPrice(cartShippingFee)}
          </span>
        </div>

        <div
          style={{
            paddingTop: '1rem',
            marginTop: '0.5rem',
            borderTop: '1px solid #E7E5E4',
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1C1917' }}>Total</span>
          <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1C1917' }}>
            {formatPrice(finalTotal)}
          </span>
        </div>
      </div>

      {/* Promo Code Input */}
      <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Promo code (e.g. MADHUVAN10)"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          style={{
            flex: 1,
            minWidth: 0,
            padding: '0.65rem 0.85rem',
            borderRadius: '10px',
            border: '1px solid #D6D3D1',
            fontSize: '0.85rem',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '0.65rem 1rem',
            borderRadius: '10px',
            background: '#1C1917',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Apply
        </button>
      </form>

      {/* Checkout Button */}
      <Button
        size="lg"
        fullWidth
        rightIcon={<ArrowRight size={18} />}
        onClick={() => {
          setCartDrawerOpen(false);
          // If not logged in, redirect to login with checkout as the return destination
          if (!isAuthenticated) {
            navigate('/login?redirect=/checkout');
          } else {
            navigate('/checkout');
          }
        }}
      >
        Proceed to Secure Checkout
      </Button>

      {/* Safe Guarantee */}
      <div className="flex items-center justify-center gap-2" style={{ marginTop: '1.25rem', color: '#78716C', fontSize: '0.8rem' }}>
        <ShieldCheck size={16} color="#059669" />
        <span>100% Guaranteed Safe & Temperature-Protected Dispatch</span>
      </div>
    </div>
  );
};
