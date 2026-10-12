import React, { useState, useEffect } from 'react';
import { Tag, X, CheckCircle2, Loader2, AlertCircle, ChevronDown, ChevronUp, Sparkles, Percent, IndianRupee } from 'lucide-react';
import couponApi, { AppliedCoupon, Coupon } from '../../../services/couponApi';
import { formatPrice } from '../../../utils/formatPrice';

interface CouponInputProps {
  cartTotal: number;
  userEmail?: string;
  appliedCoupon: AppliedCoupon | null;
  onApply: (coupon: AppliedCoupon) => void;
  onRemove: () => void;
}

export const CouponInput: React.FC<CouponInputProps> = ({
  cartTotal,
  userEmail,
  appliedCoupon,
  onApply,
  onRemove,
}) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
  const [showAvailable, setShowAvailable] = useState(false);
  const [applyingCode, setApplyingCode] = useState<string | null>(null);

  useEffect(() => {
    couponApi
      .getActive()
      .then((res) => setAvailableCoupons(res || []))
      .catch(() => setAvailableCoupons([]));
  }, []);

  const handleApplyCode = async (couponCodeToApply: string) => {
    const trimmed = couponCodeToApply.trim().toUpperCase();
    if (!trimmed) {
      setError('Please enter a coupon code.');
      return;
    }
    setIsLoading(true);
    setApplyingCode(trimmed);
    setError('');
    try {
      const coupon = await couponApi.validate(trimmed, cartTotal, userEmail);
      onApply(coupon);
      setCode('');
      setShowAvailable(false);
    } catch (e: any) {
      setError(e?.message || 'Invalid or expired coupon code.');
    } finally {
      setIsLoading(false);
      setApplyingCode(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleApplyCode(code);
    }
  };

  /* ── Applied State ── */
  if (appliedCoupon) {
    return (
      <div
        style={{
          background: 'linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 100%)',
          border: '1.5px solid #6EE7B7',
          borderRadius: '14px',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          boxShadow: '0 2px 8px rgba(5, 150, 105, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#D1FAE5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <CheckCircle2 size={18} color="#059669" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontFamily: 'monospace',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  background: '#D1FAE5',
                  color: '#065F46',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  letterSpacing: '0.05em',
                  border: '1px dashed #059669',
                }}
              >
                {appliedCoupon.code}
              </span>
              <span style={{ fontWeight: 700, color: '#065F46', fontSize: '0.88rem' }}>
                Applied!
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#047857', marginTop: '3px' }}>
              {appliedCoupon.description || (
                appliedCoupon.discountType === 'percentage'
                  ? `${appliedCoupon.discountValue}% discount`
                  : `₹${appliedCoupon.discountValue} off`
              )}
              {' · '}
              <strong style={{ color: '#065F46' }}>You save {formatPrice(appliedCoupon.discountAmount)}</strong>
            </div>
          </div>
        </div>
        <button
          onClick={onRemove}
          title="Remove coupon"
          type="button"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#059669',
            padding: '6px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#D1FAE5')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
        >
          <X size={18} />
        </button>
      </div>
    );
  }

  /* ── Input State ── */
  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Tag
            size={15}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#A8A29E',
              pointerEvents: 'none',
            }}
          />
          <input
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError('');
            }}
            onKeyDown={handleKeyDown}
            placeholder="Enter promo code"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.65rem 0.85rem 0.65rem 2.2rem',
              border: `1.5px solid ${error ? '#FCA5A5' : '#E7E5E4'}`,
              borderRadius: '10px',
              fontSize: '0.9rem',
              fontFamily: 'monospace',
              fontWeight: 600,
              letterSpacing: '0.05em',
              outline: 'none',
              background: '#FAFAF8',
              color: '#1C1917',
              boxSizing: 'border-box',
              transition: 'border-color 0.15s',
            }}
          />
        </div>
        <button
          onClick={() => handleApplyCode(code)}
          disabled={isLoading || !code.trim()}
          type="button"
          style={{
            padding: '0.65rem 1.25rem',
            background: isLoading || !code.trim() ? '#E7E5E4' : '#D97706',
            color: isLoading || !code.trim() ? '#A8A29E' : '#FFFFFF',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: isLoading || !code.trim() ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap',
            transition: 'all 0.15s',
            flexShrink: 0,
          }}
        >
          {isLoading && !applyingCode ? (
            <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
          ) : null}
          {isLoading && !applyingCode ? 'Applying…' : 'Apply'}
        </button>
      </div>

      {error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: '6px',
            color: '#DC2626',
            fontSize: '0.82rem',
          }}
        >
          <AlertCircle size={13} />
          <span>{error}</span>
        </div>
      )}

      {/* ── Available Offers Drawer / Accordion ── */}
      {availableCoupons.length > 0 && (
        <div style={{ marginTop: '0.75rem' }}>
          <button
            type="button"
            onClick={() => setShowAvailable(!showAvailable)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#D97706',
              fontSize: '0.82rem',
              fontWeight: 600,
            }}
          >
            <Sparkles size={14} />
            <span>Available Offers ({availableCoupons.length})</span>
            {showAvailable ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showAvailable && (
            <div
              style={{
                marginTop: '0.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                background: '#FFFBEB',
                border: '1px solid #FDE68A',
                borderRadius: '10px',
                padding: '0.75rem',
                maxHeight: '220px',
                overflowY: 'auto',
              }}
            >
              {availableCoupons.map((coupon) => {
                const isEligible = cartTotal >= coupon.minOrderAmount;
                const deficit = coupon.minOrderAmount - cartTotal;
                const isApplyingThis = isLoading && applyingCode === coupon.code;

                return (
                  <div
                    key={coupon.id || (coupon as any)._id}
                    style={{
                      background: '#FFFFFF',
                      border: '1px dashed #F59E0B',
                      borderRadius: '8px',
                      padding: '0.6rem 0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span
                          style={{
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            fontSize: '0.82rem',
                            background: '#FEF3C7',
                            color: '#92400E',
                            padding: '1px 6px',
                            borderRadius: '4px',
                            letterSpacing: '0.04em',
                          }}
                        >
                          {coupon.code}
                        </span>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#16A34A' }}>
                          {coupon.discountType === 'percentage'
                            ? `${coupon.discountValue}% OFF`
                            : `₹${coupon.discountValue} OFF`}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.73rem', color: '#78716C', marginTop: '2px' }}>
                        {coupon.minOrderAmount > 0
                          ? `On orders above ₹${coupon.minOrderAmount}`
                          : 'No minimum order'}
                        {coupon.maxDiscountAmount ? ` · Up to ₹${coupon.maxDiscountAmount}` : ''}
                      </div>
                    </div>

                    <div style={{ flexShrink: 0 }}>
                      {isEligible ? (
                        <button
                          type="button"
                          onClick={() => handleApplyCode(coupon.code)}
                          disabled={isLoading}
                          style={{
                            padding: '0.35rem 0.75rem',
                            background: '#D97706',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          {isApplyingThis ? (
                            <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} />
                          ) : null}
                          Apply
                        </button>
                      ) : (
                        <span
                          style={{
                            fontSize: '0.7rem',
                            color: '#9CA3AF',
                            fontStyle: 'italic',
                          }}
                        >
                          Add ₹{deficit} more
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default CouponInput;

