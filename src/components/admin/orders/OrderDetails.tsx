import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../../../types/order.types';
import { formatPrice } from '../../../utils/formatPrice';
import { OrderStatusBadge } from './OrderStatus';
import { MapPin, Phone, Mail, Calendar, CheckCircle2, XCircle, Copy, Check, ExternalLink, Image as ImageIcon, ShieldAlert, Compass } from 'lucide-react';
import { useStore } from '../../../store/store';
import { Button } from '../../common/Button';
import { generateGoogleMapsLink } from '../../../utils/delivery';
import orderApi from '../../../services/orderApi';

interface OrderDetailsProps {
  order: Order;
  onUpdateStatus: (status: OrderStatus) => void;
  onOrderUpdated?: (order: Order) => void;
}

export const OrderDetailsModalContent: React.FC<OrderDetailsProps> = ({ order, onUpdateStatus, onOrderUpdated }) => {
  const { verifyPayment, rejectPayment, showToast } = useStore();
  const [copiedUtr, setCopiedUtr] = useState(false);
  const [copiedMaps, setCopiedMaps] = useState(false);
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectReason, setRejectReason] = useState('Payment not found in bank statement');
  const [showScreenshotModal, setShowScreenshotModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!order.paymentScreenshot && order.id) {
      orderApi.getById(order.id).then((full) => {
        if (full?.paymentScreenshot) {
          onOrderUpdated?.(full);
        }
      }).catch(() => {});
    }
  }, [order.id, order.paymentScreenshot, onOrderUpdated]);

  const handleCopyUtr = (utr: string) => {
    if (!utr) return;
    navigator.clipboard.writeText(utr);
    setCopiedUtr(true);
    showToast('UTR copied to clipboard', 'info');
    setTimeout(() => setCopiedUtr(false), 2000);
  };

  const handleCopyMapsLink = (url: string) => {
    if (!url || url === '#') return;
    navigator.clipboard.writeText(url);
    setCopiedMaps(true);
    showToast('Google Maps navigation link copied!', 'info');
    setTimeout(() => setCopiedMaps(false), 2000);
  };

  const handleVerify = async () => {
    setIsProcessing(true);
    try {
      await verifyPayment(order.id);
      // Build updated order locally and notify parent
      const updated: Order = { ...order, paymentStatus: 'paid', paymentVerifiedAt: new Date().toISOString() };
      onOrderUpdated?.(updated);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmReject = async () => {
    const trimmed = rejectReason.trim();
    if (!trimmed) {
      showToast('Please provide a reason for rejecting the payment.', 'error');
      return;
    }
    setIsProcessing(true);
    try {
      await rejectPayment(order.id, trimmed);
      setShowRejectInput(false);
      const updated: Order = { ...order, paymentStatus: 'rejected', paymentRejectedReason: trimmed };
      onOrderUpdated?.(updated);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header bar */}
      <div className="flex items-center justify-between" style={{ borderBottom: '1px solid #E7E5E4', paddingBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', color: '#1C1917', margin: 0 }}>Order {order.orderNumber}</h3>
          <div style={{ fontSize: '0.8rem', color: '#78716C', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={14} /> Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
          </div>
        </div>
        <div>
          <OrderStatusBadge status={order.orderStatus} />
        </div>
      </div>

      {/* Payment Verification Card */}
      <div
        style={{
          padding: '1.25rem',
          backgroundColor: order.paymentStatus === 'verification_pending' ? '#FFFBEB' : (order.paymentStatus === 'paid' ? '#F0FDF4' : '#FAF7F2'),
          borderRadius: '14px',
          border: order.paymentStatus === 'verification_pending' ? '1.5px solid #FCD34D' : (order.paymentStatus === 'paid' ? '1.5px solid #BBF7D0' : '1px solid #E7E5E4'),
        }}
      >
        <div className="flex items-center justify-between flex-wrap gap-2" style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.75rem' }}>
          <div>
            <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, color: '#78716C' }}>
              Payment Verification & Audit
            </div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1C1917', textTransform: 'uppercase' }}>
              {order.paymentMethod === 'upi' ? 'Direct UPI / Bank Transfer' : 'Cash on Delivery (COD)'}
            </div>
          </div>

          <div>
            {order.paymentStatus === 'verification_pending' && (
              <span style={{ fontSize: '0.82rem', fontWeight: 800, padding: '4px 10px', borderRadius: '8px', background: '#D97706', color: '#FFFFFF' }}>
                ⏳ VERIFICATION PENDING
              </span>
            )}
            {order.paymentStatus === 'paid' && (
              <span style={{ fontSize: '0.82rem', fontWeight: 800, padding: '4px 10px', borderRadius: '8px', background: '#059669', color: '#FFFFFF' }}>
                ✓ PAID & VERIFIED
              </span>
            )}
            {order.paymentStatus === 'rejected' && (
              <span style={{ fontSize: '0.82rem', fontWeight: 800, padding: '4px 10px', borderRadius: '8px', background: '#DC2626', color: '#FFFFFF' }}>
                ✕ REJECTED
              </span>
            )}
            {order.paymentMethod === 'cod' && order.paymentStatus !== 'paid' && (
              <span style={{ fontSize: '0.82rem', fontWeight: 800, padding: '4px 10px', borderRadius: '8px', background: '#2563EB', color: '#FFFFFF' }}>
                💵 COD PENDING
              </span>
            )}
          </div>
        </div>

        {/* UTR & Screenshot display */}
        {order.paymentMethod === 'upi' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1rem' }}>
            <div className="flex items-center justify-between flex-wrap gap-2" style={{ backgroundColor: '#FFFFFF', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E7E5E4' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: '#78716C', display: 'block' }}>Customer Submitted UTR / Ref Number:</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '1.1rem', color: '#D97706' }}>
                  {order.utrNumber || 'No UTR provided'}
                </span>
              </div>
              {order.utrNumber && (
                <button
                  type="button"
                  onClick={() => handleCopyUtr(order.utrNumber!)}
                  style={{
                    backgroundColor: copiedUtr ? '#059669' : '#FEF3C7',
                    color: copiedUtr ? '#FFFFFF' : '#92400E',
                    border: '1px solid #FDE68A',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {copiedUtr ? <Check size={14} /> : <Copy size={14} />}
                  {copiedUtr ? 'Copied' : 'Copy UTR'}
                </button>
              )}
            </div>

            {/* Screenshot attachment preview */}
            {order.paymentScreenshot ? (
              <div style={{ backgroundColor: '#FFFFFF', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E7E5E4', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div className="flex items-center gap-3">
                  <img
                    src={order.paymentScreenshot}
                    alt="Payment receipt proof"
                    style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #E7E5E4', cursor: 'pointer' }}
                    onClick={() => setShowScreenshotModal(true)}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1C1917' }}>Customer Payment Slip Attached</div>
                    <div style={{ fontSize: '0.75rem', color: '#78716C' }}>Click thumbnail to inspect full receipt</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowScreenshotModal(true)}
                  style={{
                    background: '#F5F5F4',
                    border: '1px solid #D6D3D1',
                    borderRadius: '6px',
                    padding: '5px 10px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <ExternalLink size={12} /> View Full Slip
                </button>
              </div>
            ) : (
              <div style={{ fontSize: '0.8rem', color: '#78716C', fontStyle: 'italic' }}>
                Note: No payment screenshot was attached by customer. Please verify with UTR: <strong>{order.utrNumber}</strong> in your bank portal.
              </div>
            )}
          </div>
        )}

        {/* Verification Action Buttons */}
        {order.paymentStatus === 'verification_pending' && (
          <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '1rem' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#44403C', marginBottom: '8px' }}>
              Bank Account Verification Decision:
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <Button
                size="sm"
                onClick={handleVerify}
                disabled={isProcessing}
                leftIcon={<CheckCircle2 size={16} />}
                style={{ backgroundColor: '#059669', borderColor: '#059669' }}
              >
                {isProcessing ? 'Verifying...' : 'Verify & Confirm Payment'}
              </Button>

              {!showRejectInput ? (
                <button
                  type="button"
                  onClick={() => setShowRejectInput(true)}
                  style={{
                    backgroundColor: '#FEF2F2',
                    color: '#DC2626',
                    border: '1px solid #FECACA',
                    borderRadius: '10px',
                    padding: '8px 16px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <XCircle size={16} /> Reject Payment
                </button>
              ) : null}
            </div>

            {showRejectInput && (
              <div style={{ marginTop: '0.75rem', backgroundColor: '#FEF2F2', padding: '12px', borderRadius: '10px', border: '1px solid #FCA5A5' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#991B1B', display: 'block', marginBottom: '4px' }}>
                  Rejection Reason (will be shown to customer):
                </label>
                <input
                  type="text"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #F87171',
                    fontSize: '0.85rem',
                    marginBottom: '8px',
                  }}
                />
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="danger" disabled={isProcessing || !rejectReason.trim()} onClick={handleConfirmReject}>
                    {isProcessing ? 'Rejecting...' : 'Confirm Rejection'}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowRejectInput(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* COD Mark as Paid Button */}
        {order.paymentMethod === 'cod' && order.paymentStatus !== 'paid' && (
          <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.82rem', color: '#78716C' }}>Payment to be collected on doorstep.</span>
            <Button
              size="sm"
              disabled={isProcessing}
              onClick={handleVerify}
              leftIcon={<CheckCircle2 size={14} />}
            >
              {isProcessing ? 'Updating...' : `Mark COD Collected (${formatPrice(order.total)})`}
            </Button>
          </div>
        )}

        {order.paymentStatus === 'paid' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#047857', fontSize: '0.85rem', fontWeight: 700 }}>
            <CheckCircle2 size={16} /> Verified on bank records. Safe to fulfill & dispatch.
          </div>
        )}

        {order.paymentStatus === 'rejected' && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ color: '#B91C1C', fontSize: '0.85rem', fontWeight: 600 }}>
              Rejected: {order.paymentRejectedReason}
            </div>
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleVerify}
              style={{
                background: '#ECFDF5',
                color: '#065F46',
                border: '1px solid #A7F3D0',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: isProcessing ? 'not-allowed' : 'pointer',
              }}
            >
              {isProcessing ? 'Updating...' : 'Re-verify as Paid'}
            </button>
          </div>
        )}
      </div>

      {/* Fulfillment Status Control */}
      <div style={{ padding: '1rem', backgroundColor: '#FAF7F2', borderRadius: '12px', border: '1px solid #E7E5E4' }}>
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#44403C', marginBottom: '0.5rem' }}>
          Change Fulfillment Status:
        </label>
        <div className="flex items-center gap-2 flex-wrap">
          {(['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as OrderStatus[]).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => onUpdateStatus(st)}
              style={{
                padding: '4px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                border: order.orderStatus === st ? '2px solid #D97706' : '1px solid #D6D3D1',
                background: order.orderStatus === st ? '#FEF3C7' : '#FFFFFF',
                color: order.orderStatus === st ? '#92400E' : '#57534E',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Customer & Shipping info */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div>
          <h4 style={{ fontSize: '0.95rem', color: '#1C1917', marginBottom: '0.5rem' }}>Customer Details</h4>
          <div style={{ fontSize: '0.88rem', color: '#44403C', lineHeight: 1.6 }}>
            <div style={{ fontWeight: 700 }}>{order.customerName || 'Customer'}</div>
            <div className="flex items-center gap-2" style={{ color: '#78716C' }}><Mail size={14} /> {order.customerEmail || '—'}</div>
            <div className="flex items-center gap-2" style={{ color: '#78716C' }}><Phone size={14} /> {order.customerPhone || '—'}</div>
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '0.95rem', color: '#1C1917', marginBottom: '0.5rem' }}>Shipping Address</h4>
          <div style={{ fontSize: '0.88rem', color: '#44403C', lineHeight: 1.6 }}>
            <div className="flex items-start gap-2">
              <MapPin size={16} color="#D97706" style={{ marginTop: '3px', flexShrink: 0 }} />
              <div>
                {order.shippingAddress ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ fontWeight: 700, color: '#1C1917' }}>
                      🏠 {order.shippingAddress.addressLine1}
                    </div>
                    {order.shippingAddress.addressLine2 && (
                      <div style={{ color: '#44403C' }}>
                        🛣️ {order.shippingAddress.addressLine2}
                      </div>
                    )}
                    {order.shippingAddress.landmark && (
                      <div style={{ color: '#92400E', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#FEF3C7', padding: '2px 8px', borderRadius: '6px', width: 'fit-content' }}>
                        📍 Landmark: <strong>{order.shippingAddress.landmark}</strong>
                      </div>
                    )}
                    <div style={{ color: '#57534E' }}>
                      🌆 {order.shippingAddress.city}, {order.shippingAddress.state} - <strong>{order.shippingAddress.pincode}</strong>
                    </div>
                    {typeof order.shippingAddress.latitude === 'number' && typeof order.shippingAddress.longitude === 'number' && (
                      <div style={{ fontSize: '0.78rem', color: '#047857', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        🛰️ GPS Doorstep Pin: <strong>{order.shippingAddress.latitude.toFixed(4)}, {order.shippingAddress.longitude.toFixed(4)}</strong>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ color: '#78716C', fontStyle: 'italic' }}>No shipping address provided</div>
                )}
              </div>
            </div>

            {/* Google Maps Actions for Admin & Drivers */}
            {order.shippingAddress && (
              <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <a
                  href={order.shippingAddress.googleMapsLink || generateGoogleMapsLink(order.shippingAddress)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#EFF6FF',
                    color: '#1D4ED8',
                    border: '1px solid #BFDBFE',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  🗺️ Open in Google Maps <ExternalLink size={12} />
                </a>

                <button
                  type="button"
                  onClick={() => handleCopyMapsLink(order.shippingAddress?.googleMapsLink || generateGoogleMapsLink(order.shippingAddress))}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: copiedMaps ? '#ECFDF5' : '#F5F5F4',
                    color: copiedMaps ? '#065F46' : '#57534E',
                    border: '1px solid #D6D3D1',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {copiedMaps ? <Check size={12} /> : <Copy size={12} />}
                  {copiedMaps ? 'Link Copied' : 'Copy Maps Link'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Items list */}
      <div>
        <h4 style={{ fontSize: '0.95rem', color: '#1C1917', marginBottom: '0.75rem' }}>Ordered Honeys</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', border: '1px solid #E7E5E4', borderRadius: '12px', padding: '1rem' }}>
          {(order.items || []).map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={item.image || 'https://res.cloudinary.com/kisnodzz/image/upload/v1791042814/madhuvan_honey/products/t6l1edtfc4xg0wmxb8we.jpg'}
                  alt={item.productName}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://res.cloudinary.com/kisnodzz/image/upload/v1791042814/madhuvan_honey/products/t6l1edtfc4xg0wmxb8we.jpg';
                  }}
                  style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#1C1917' }}>{item.productName}</div>
                  <div style={{ fontSize: '0.78rem', color: '#78716C' }}>Qty: {item.quantity} × {item.size}</div>
                </div>
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1C1917' }}>
                {formatPrice(item.price * item.quantity)}
              </div>
            </div>
          ))}

          <div style={{ borderTop: '1px solid #E7E5E4', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1rem' }}>
            <span>Order Total:</span>
            <span style={{ color: '#D97706' }}>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Screenshot Viewer Lightbox Modal */}
      {showScreenshotModal && order.paymentScreenshot && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setShowScreenshotModal(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '1.25rem',
              maxWidth: '90vw',
              maxHeight: '90vh',
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1C1917' }}>
                Payment Slip Proof — Order {order.orderNumber}
              </div>
              <button
                type="button"
                onClick={() => setShowScreenshotModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', padding: '4px' }}
              >
                ✕
              </button>
            </div>
            <img
              src={order.paymentScreenshot}
              alt="Payment receipt full view"
              style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: '8px' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
