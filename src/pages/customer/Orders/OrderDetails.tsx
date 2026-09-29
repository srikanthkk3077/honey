import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../../../store/store';
import { formatPrice } from '../../../utils/formatPrice';
import { OrderStatusBadge } from '../../../components/admin/orders/OrderStatus';
import { ArrowLeft, MapPin, Truck, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Button } from '../../../components/common/Button';

export const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getOrderById } = useStore();
  const order = id ? getOrderById(id) : undefined;

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

        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '2.5rem', border: '1px solid #E7E5E4' }}>
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

          {/* Delivery Tracker Bar */}
          <div style={{ backgroundColor: '#FAF7F2', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem', border: '1px solid #E7E5E4' }}>
            <div className="flex items-center gap-2" style={{ fontWeight: 700, color: '#1C1917', marginBottom: '0.5rem' }}>
              <Truck size={18} color="#D97706" /> Courier Tracking Number:
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 700, color: '#D97706', background: '#FFFFFF', padding: '8px 14px', borderRadius: '8px', display: 'inline-block' }}>
              {order.trackingNumber || 'GENERATING-AWB'}
            </div>
          </div>

          {/* Items */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '1.05rem', color: '#1C1917', marginBottom: '1rem' }}>Purchased Honey</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between" style={{ paddingBottom: '1rem', borderBottom: '1px solid #F5F1E9' }}>
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.productName} style={{ width: '56px', height: '56px', borderRadius: '12px', objectFit: 'cover' }} />
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
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1C1917', marginBottom: '0.4rem' }}>
              Delivering To:
            </div>
            <div style={{ fontSize: '0.9rem', color: '#57534E', lineHeight: 1.6 }}>
              {order.shippingAddress.fullName} • {order.shippingAddress.phone}<br />
              {order.shippingAddress.addressLine1} {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
