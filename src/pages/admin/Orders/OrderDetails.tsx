import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../../../store/store';
import { OrderDetailsModalContent } from '../../../components/admin/orders/OrderDetails';
import { ArrowLeft } from 'lucide-react';

export const AdminOrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getOrderById, updateOrderStatus } = useStore();
  const order = id ? getOrderById(id) : undefined;

  if (!order) {
    return (
      <div style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h3>Order not found</h3>
        <Link to="/admin/orders">Back to Orders</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '750px', margin: '0 auto' }}>
      <Link to="/admin/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#78716C', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        <ArrowLeft size={16} /> Back to All Orders
      </Link>

      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '2rem', border: '1px solid #E7E5E4' }}>
        <OrderDetailsModalContent
          order={order}
          onUpdateStatus={(st) => updateOrderStatus(order.id, st)}
        />
      </div>
    </div>
  );
};
