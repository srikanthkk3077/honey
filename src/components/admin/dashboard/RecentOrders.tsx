import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../../utils/formatPrice';
import { Badge } from '../../common/Badge';
import orderApi from '../../../services/orderApi';
import { Order } from '../../../types/order.types';

export const RecentOrders: React.FC = () => {
  const [recent, setRecent] = useState<Order[]>([]);

  useEffect(() => {
    orderApi.getAll({ limit: 5 })
      .then((result) => setRecent(result.orders))
      .catch(() => {}); // silently fail — dashboard is non-critical
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge variant="green" size="sm">Delivered</Badge>;
      case 'shipped':
        return <Badge variant="blue" size="sm">Shipped</Badge>;
      case 'processing':
        return <Badge variant="gold" size="sm">Processing</Badge>;
      case 'cancelled':
        return <Badge variant="red" size="sm">Cancelled</Badge>;
      default:
        return <Badge variant="gray" size="sm">Pending</Badge>;
    }
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: 'clamp(1rem, 2.5vw, 1.5rem)', border: '1px solid #E7E5E4' }}>
      <div className="flex items-center justify-between" style={{ marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1.15rem', color: '#1C1917', margin: 0 }}>Recent Orders</h3>
        <Link to="/admin/orders" style={{ fontSize: '0.85rem', color: '#D97706', fontWeight: 600 }}>
          View All Orders
        </Link>
      </div>

      <div className="table-responsive" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E7E5E4', color: '#78716C' }}>
              <th style={{ padding: '0.6rem 0' }}>Order ID</th>
              <th style={{ padding: '0.6rem 0.5rem' }}>Customer</th>
              <th style={{ padding: '0.6rem 0.5rem' }}>Amount</th>
              <th style={{ padding: '0.6rem 0.5rem' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((order) => (
              <tr key={order.id} style={{ borderBottom: '1px solid #F5F1E9' }}>
                <td style={{ padding: '0.75rem 0', fontWeight: 700, color: '#1C1917' }}>
                  {order.orderNumber}
                </td>
                <td style={{ padding: '0.75rem 0.5rem', color: '#44403C' }}>
                  {order.customerName}
                </td>
                <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700, color: '#1C1917' }}>
                  {formatPrice(order.total)}
                </td>
                <td style={{ padding: '0.75rem 0.5rem' }}>
                  {getStatusBadge(order.orderStatus)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
