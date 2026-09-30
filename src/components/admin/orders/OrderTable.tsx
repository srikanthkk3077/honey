import React from 'react';
import { Order } from '../../../types/order.types';
import { formatPrice } from '../../../utils/formatPrice';
import { OrderStatusBadge } from './OrderStatus';
import { Eye } from 'lucide-react';

interface OrderTableProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
}

export const OrderTable: React.FC<OrderTableProps> = ({ orders, onViewOrder }) => {
  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E7E5E4', overflow: 'hidden' }}>
      <div className="table-responsive" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid #E7E5E4', color: '#57534E' }}>
              <th style={{ padding: '1rem' }}>Order #</th>
              <th style={{ padding: '1rem' }}>Customer</th>
              <th style={{ padding: '1rem' }}>Items</th>
              <th style={{ padding: '1rem' }}>Total</th>
              <th style={{ padding: '1rem' }}>Payment</th>
              <th style={{ padding: '1rem' }}>Fulfillment</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} style={{ borderBottom: '1px solid #F5F1E9' }}>
                <td style={{ padding: '1rem', fontWeight: 700, color: '#1C1917' }}>
                  {order.orderNumber}
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: 600, color: '#1C1917' }}>{order.customerName}</div>
                  <div style={{ fontSize: '0.78rem', color: '#78716C' }}>{order.shippingAddress.city}</div>
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
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      background: '#FEF3C7',
                      color: '#92400E',
                      border: 'none',
                      fontWeight: 600,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Eye size={14} /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
