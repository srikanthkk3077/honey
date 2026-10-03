import React from 'react';
import { Order } from '../../../types/order.types';
import { formatPrice } from '../../../utils/formatPrice';
import { OrderStatusBadge } from './OrderStatus';
import { Eye, PackageSearch, MapPin } from 'lucide-react';
import { generateGoogleMapsLink } from '../../../utils/delivery';

interface OrderTableProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
  isLoading?: boolean;
}

// ─── Skeleton shimmer row ─────────────────────────────────────────────────────
const SkeletonRow: React.FC = () => (
  <tr style={{ borderBottom: '1px solid #F5F1E9' }}>
    {[120, 160, 60, 80, 100, 90, 70].map((w, i) => (
      <td key={i} style={{ padding: '1rem' }}>
        <div
          style={{
            height: '14px', width: `${w}px`, maxWidth: '100%',
            borderRadius: '6px', background: 'linear-gradient(90deg,#F5F1E9 25%,#EDE9E0 50%,#F5F1E9 75%)',
            backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite',
          }}
        />
        {i === 1 && (
          <div style={{ height: '10px', width: '80px', borderRadius: '4px', background: 'linear-gradient(90deg,#F5F1E9 25%,#EDE9E0 50%,#F5F1E9 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite', marginTop: '5px' }} />
        )}
      </td>
    ))}
  </tr>
);

export const OrderTable: React.FC<OrderTableProps> = ({ orders, onViewOrder, isLoading = false }) => {
  const COLS = ['Order #', 'Customer', 'Items', 'Total', 'Payment', 'Fulfillment', 'Action'];

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E7E5E4', overflow: 'hidden' }}>
      <div className="table-responsive" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid #E7E5E4', color: '#57534E' }}>
              {COLS.map((c, i) => (
                <th key={c} style={{ padding: '1rem', textAlign: i === COLS.length - 1 ? 'right' : 'left' }}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              // ── Skeleton rows ──────────────────────────────────────────────
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : orders.length === 0 ? (
              // ── Empty state ────────────────────────────────────────────────
              <tr>
                <td colSpan={7} style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', color: '#A8A29E' }}>
                    <PackageSearch size={48} strokeWidth={1.2} />
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: '#57534E' }}>No orders found</div>
                    <div style={{ fontSize: '0.85rem' }}>Orders placed by customers will appear here</div>
                  </div>
                </td>
              </tr>
            ) : (
              // ── Order rows ─────────────────────────────────────────────────
              orders.map((order) => (
                <tr key={order.id} style={{ borderBottom: '1px solid #F5F1E9' }}>
                  <td style={{ padding: '1rem', fontWeight: 700, color: '#1C1917' }}>
                    {order.orderNumber}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 600, color: '#1C1917' }}>{order.customerName}</div>
                    <div style={{ fontSize: '0.78rem', color: '#78716C', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                      <span>{order.shippingAddress.city}</span>
                      <a
                        href={order.shippingAddress.googleMapsLink || generateGoogleMapsLink(order.shippingAddress)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`Open destination in Google Maps`}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          color: '#2563EB',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '2px',
                          textDecoration: 'none',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          backgroundColor: '#EFF6FF',
                          padding: '1px 5px',
                          borderRadius: '4px',
                        }}
                      >
                        <MapPin size={10} /> Maps ↗
                      </a>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: '#57534E' }}>
                    {order.items.reduce((acc, i) => acc + i.quantity, 0)} jars
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 700, color: '#1C1917' }}>
                    {formatPrice(order.total)}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {order.paymentStatus === 'verification_pending' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#92400E', background: '#FEF3C7', border: '1px solid #FDE68A', padding: '2px 8px', borderRadius: '6px', width: 'fit-content' }}>
                          ⏳ Verify UTR
                        </span>
                        {order.utrNumber && (
                          <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#78716C', fontWeight: 600 }}>
                            {order.utrNumber}
                          </span>
                        )}
                      </div>
                    )}
                    {order.paymentStatus === 'paid' && (
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#065F46', background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '3px 8px', borderRadius: '6px' }}>
                        ✓ Paid ({order.paymentMethod.toUpperCase()})
                      </span>
                    )}
                    {order.paymentStatus === 'rejected' && (
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#991B1B', background: '#FEF2F2', border: '1px solid #FECACA', padding: '3px 8px', borderRadius: '6px' }}>
                        ✕ Rejected
                      </span>
                    )}
                    {order.paymentMethod === 'cod' && order.paymentStatus !== 'paid' && (
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1E40AF', background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '3px 8px', borderRadius: '6px' }}>
                        💵 COD Pending
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <OrderStatusBadge status={order.orderStatus} />
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button
                      onClick={() => onViewOrder(order)}
                      style={{ padding: '6px 12px', borderRadius: '8px', background: '#FEF3C7', color: '#92400E', border: 'none', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Eye size={14} /> View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};
