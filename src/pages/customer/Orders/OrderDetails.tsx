import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../../../store/store';
import { formatPrice } from '../../../utils/formatPrice';
import { OrderStatusBadge } from '../../../components/admin/orders/OrderStatus';
import { ArrowLeft, MapPin, Truck, CheckCircle2, ShieldCheck, Clock, XCircle, Loader, ExternalLink } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { CONTACT_INFO } from '../../../utils/constants';
import orderApi from '../../../services/orderApi';
import { Order } from '../../../types/order.types';
import { generateGoogleMapsLink } from '../../../utils/delivery';
import { WhatsAppIcon } from '../../../components/common/WhatsAppIcon';
import { getWhatsAppUrl } from '../../../utils/whatsapp';

export const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getOrderById } = useStore();
  const [fetchedOrder, setFetchedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const localOrder = id ? getOrderById(id) : undefined;
  const order = localOrder || fetchedOrder;

  useEffect(() => {
    if (!localOrder && id) {
      setIsLoading(true);
      orderApi
        .getById(id)
        .then(setFetchedOrder)
        .catch(() => {
          return orderApi.track(id).then(setFetchedOrder);
        })
        .catch(() => {})
        .finally(() => setIsLoading(false));
    }
  }, [id, localOrder]);

  if (isLoading) {
    return (
      <div style={{ padding: '8rem 0', textAlign: 'center', backgroundColor: '#FAF7F2' }}>
        <Loader size={40} color="#D97706" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }} />
        <h3 style={{ color: '#1C1917' }}>Retrieving your order details…</h3>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ padding: '6rem 0', textAlign: 'center' }}>
        <div className="container">
          <h2>Order Not Found</h2>
          <p style={{ color: '#78716C', margin: '1rem 0 2rem 0' }}>The specified order record could not be located.</p>
          <Link to="/orders">
            <Button size="md">Return to Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '3.5rem 0 6rem 0', backgroundColor: '#FAF7F2' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <Link to="/orders" className="flex items-center gap-2" style={{ color: '#78716C', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Back to All Orders
        </Link>

        <div className="order-details-card" style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '2.5rem', border: '1px solid #E7E5E4' }}>
          <div className="flex items-center justify-between flex-wrap gap-2" style={{ borderBottom: '1px solid #E7E5E4', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#D97706', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Madhuvan Invoice & Tracking
              </span>
              <h2 style={{ fontSize: '1.75rem', color: '#1C1917', margin: '4px 0 0 0' }}>
                Order #{order.orderNumber}
              </h2>
            </div>
            <OrderStatusBadge status={order.orderStatus} />
          </div>

          {/* Payment Verification Status Banner */}
          {order.paymentStatus === 'verification_pending' && (
            <div
              style={{
                backgroundColor: '#FFFBEB',
                border: '1.5px solid #FDE68A',
                borderRadius: '16px',
                padding: '1.25rem',
                marginBottom: '1.75rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#FEF3C7',
                  color: '#D97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Clock size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, color: '#92400E', fontSize: '1rem', marginBottom: '2px' }}>
                  ⏳ Payment Verification in Progress
                </div>
                <div style={{ fontSize: '0.85rem', color: '#78716C', lineHeight: 1.5, marginBottom: '6px' }}>
                  We received your transaction reference <strong>(UTR: {order.utrNumber || 'Submitted'})</strong>. Our accounts team verifies bank credits every 15–30 minutes. Once confirmed, your honey jar will be prepped for dispatch.
                </div>
                <div style={{ fontSize: '0.78rem', color: '#B45309', fontWeight: 600 }}>
                  Need urgent dispatch? Contact us on WhatsApp: {CONTACT_INFO.whatsapp}
                </div>
              </div>
            </div>
          )}

          {order.paymentStatus === 'paid' && order.paymentMethod === 'upi' && (
            <div
              style={{
                backgroundColor: '#ECFDF5',
                border: '1.5px solid #A7F3D0',
                borderRadius: '16px',
                padding: '1.25rem',
                marginBottom: '1.75rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#D1FAE5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <CheckCircle2 size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 800, color: '#065F46', fontSize: '1rem', marginBottom: '2px' }}>
                  🎉 Payment Verified ✓
                </div>
                <div style={{ fontSize: '0.85rem', color: '#047857', lineHeight: 1.5 }}>
                  Your UPI transaction (UTR: {order.utrNumber}) has been verified. Your honey jar is being packed with organic honeycomb cushioning.
                </div>
              </div>
            </div>
          )}

          {order.paymentStatus === 'rejected' && (
            <div
              style={{
                backgroundColor: '#FEF2F2',
                border: '1.5px solid #FECACA',
                borderRadius: '16px',
                padding: '1.25rem',
                marginBottom: '1.75rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#FEE2E2',
                  color: '#DC2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <XCircle size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 800, color: '#991B1B', fontSize: '1rem', marginBottom: '2px' }}>
                  ❌ Payment Verification Failed
                </div>
                <div style={{ fontSize: '0.85rem', color: '#B91C1C', lineHeight: 1.5, marginBottom: '6px' }}>
                  Reason: {order.paymentRejectedReason || 'Could not locate transaction in bank statement with UTR ' + (order.utrNumber || 'N/A')}.
                </div>
                <div style={{ fontSize: '0.8rem', color: '#7F1D1D', fontWeight: 600 }}>
                  Please contact our apiary accounts team on {CONTACT_INFO.phone} or WhatsApp with your bank screenshot.
                </div>
              </div>
            </div>
          )}

          {order.paymentMethod === 'cod' && (
            <div
              style={{
                backgroundColor: '#EFF6FF',
                border: '1.5px solid #BFDBFE',
                borderRadius: '16px',
                padding: '1rem 1.25rem',
                marginBottom: '1.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: '#1E40AF',
                fontSize: '0.88rem',
              }}
            >
              <strong>💵 Cash on Delivery:</strong> Please pay {formatPrice(order.total)} to the delivery courier in cash or via courier UPI QR.
            </div>
          )}

          {/* Delivery Tracker Bar */}
          <div style={{ backgroundColor: '#FAF7F2', borderRadius: '16px', padding: '1.25rem', marginBottom: '2rem', border: '1px solid #E7E5E4' }}>
            <div className="flex items-center gap-2" style={{ fontWeight: 700, color: '#1C1917', marginBottom: '0.5rem' }}>
              <Truck size={18} color="#D97706" /> Courier Tracking Number:
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '1.05rem', fontWeight: 700, color: '#D97706', background: '#FFFFFF', padding: '8px 14px', borderRadius: '8px', display: 'inline-block', maxWidth: '100%', wordBreak: 'break-all' }}>
              {order.trackingNumber || 'GENERATING-AWB'}
            </div>
          </div>

          {/* Items */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '1.05rem', color: '#1C1917', marginBottom: '1rem' }}>Purchased Honey</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between flex-wrap gap-2" style={{ paddingBottom: '1rem', borderBottom: '1px solid #F5F1E9' }}>
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image || 'https://res.cloudinary.com/kisnodzz/image/upload/v1791042814/madhuvan_honey/products/t6l1edtfc4xg0wmxb8we.jpg'}
                      alt={item.productName}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://res.cloudinary.com/kisnodzz/image/upload/v1791042814/madhuvan_honey/products/t6l1edtfc4xg0wmxb8we.jpg';
                      }}
                      style={{ width: '52px', height: '52px', borderRadius: '12px', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, color: '#1C1917' }}>{item.productName}</div>
                      <div style={{ fontSize: '0.85rem', color: '#78716C' }}>Size: {item.size} • Qty: {item.quantity}</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1C1917' }}>
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price breakdown */}
          <div style={{ borderTop: '1px solid #E7E5E4', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.92rem', marginBottom: '2rem' }}>
            <div className="flex items-center justify-between">
              <span style={{ color: '#78716C' }}>Subtotal</span>
              <span style={{ fontWeight: 600 }}>{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex items-center justify-between">
                <span style={{ color: '#059669' }}>Discounts</span>
                <span style={{ fontWeight: 600, color: '#059669' }}>- {formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span style={{ color: '#78716C' }}>Shipping</span>
              <span style={{ fontWeight: 600 }}>{order.shippingFee === 0 ? 'FREE' : formatPrice(order.shippingFee)}</span>
            </div>
            <div className="flex items-center justify-between" style={{ borderTop: '1px solid #E7E5E4', paddingTop: '0.75rem', marginTop: '0.5rem', fontSize: '1.2rem', fontWeight: 800 }}>
              <span>Total Paid</span>
              <span style={{ color: '#D97706' }}>{formatPrice(order.total)}</span>
            </div>
          </div>

          {/* Shipping Address Box */}
          <div style={{ backgroundColor: '#FAF7F2', padding: '1.25rem', borderRadius: '14px', border: '1px solid #E7E5E4' }}>
            <div className="flex items-center justify-between flex-wrap gap-2" style={{ marginBottom: '0.4rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1C1917' }}>
                Delivering To:
              </div>
              <a
                href={order.shippingAddress.googleMapsLink || generateGoogleMapsLink(order.shippingAddress)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#2563EB',
                  textDecoration: 'none',
                  backgroundColor: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  padding: '4px 10px',
                  borderRadius: '6px',
                }}
              >
                <MapPin size={12} /> Open in Google Maps <ExternalLink size={11} />
              </a>
            </div>
            <div style={{ fontSize: '0.9rem', color: '#57534E', lineHeight: 1.6 }}>
              {order.shippingAddress.fullName} • {order.shippingAddress.phone}<br />
              {order.shippingAddress.addressLine1} {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} - <strong>{order.shippingAddress.pincode}</strong>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .order-details-card {
            padding: 1.25rem !important;
            border-radius: 18px !important;
          }
        }
      `}</style>
    </div>
  );
};
