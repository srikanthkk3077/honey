import React from 'react';
import { Order, OrderStatus } from '../../../types/order.types';
import { formatPrice } from '../../../utils/formatPrice';
import { OrderStatusBadge } from './OrderStatus';
import { MapPin, Phone, Mail, PackageCheck, Calendar } from 'lucide-react';

interface OrderDetailsProps {
  order: Order;
  onUpdateStatus: (status: OrderStatus) => void;
}

export const OrderDetailsModalContent: React.FC<OrderDetailsProps> = ({ order, onUpdateStatus }) => {
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

      {/* Status control */}
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
            <div style={{ fontWeight: 700 }}>{order.customerName}</div>
            <div className="flex items-center gap-2" style={{ color: '#78716C' }}><Mail size={14} /> {order.customerEmail}</div>
            <div className="flex items-center gap-2" style={{ color: '#78716C' }}><Phone size={14} /> {order.customerPhone}</div>
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '0.95rem', color: '#1C1917', marginBottom: '0.5rem' }}>Shipping Address</h4>
          <div style={{ fontSize: '0.88rem', color: '#44403C', lineHeight: 1.6 }}>
            <div className="flex items-start gap-2">
              <MapPin size={16} color="#D97706" style={{ marginTop: '3px', flexShrink: 0 }} />
              <div>
                {order.shippingAddress.addressLine1}
                {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Items list */}
      <div>
        <h4 style={{ fontSize: '0.95rem', color: '#1C1917', marginBottom: '0.75rem' }}>Ordered Honeys</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', border: '1px solid #E7E5E4', borderRadius: '12px', padding: '1rem' }}>
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={item.image} alt={item.productName} style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover' }} />
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
    </div>
  );
};
