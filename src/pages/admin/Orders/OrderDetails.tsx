import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../../../store/store';
import { OrderDetailsModalContent } from '../../../components/admin/orders/OrderDetails';
import { ArrowLeft, Loader } from 'lucide-react';
import orderApi from '../../../services/orderApi';
import { Order } from '../../../types/order.types';
import { Button } from '../../../components/common/Button';

export const AdminOrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getOrderById, updateOrderStatus } = useStore();
  const [fetchedOrder, setFetchedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const localOrder = id ? getOrderById(id) : undefined;
  const order = fetchedOrder || localOrder;

  useEffect(() => {
    if (id) {
      if (!localOrder) setIsLoading(true);
      orderApi
        .getById(id)
        .then(setFetchedOrder)
        .catch((err) => console.error('Failed to load admin order details', err))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  if (isLoading) {
    return (
      <div style={{ padding: '6rem 1rem', textAlign: 'center' }}>
        <Loader size={36} color="#D97706" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }} />
        <p style={{ color: '#78716C' }}>Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h3 style={{ marginBottom: '1rem', color: '#1C1917' }}>Order not found</h3>
        <Link to="/admin/orders">
          <Button variant="outline" size="sm">Back to Orders</Button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '750px', margin: '0 auto' }}>
      <Link
        to="/admin/orders"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: '#78716C',
          marginBottom: '1.5rem',
          fontSize: '0.9rem',
          textDecoration: 'none',
          fontWeight: 600,
        }}
      >
        <ArrowLeft size={16} /> Back to All Orders
      </Link>

      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          padding: '2rem',
          border: '1px solid #E7E5E4',
          boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
        }}
      >
        <OrderDetailsModalContent
          order={order}
          onUpdateStatus={(st) => updateOrderStatus(order.id, st)}
          onOrderUpdated={(updated) => setFetchedOrder(updated)}
        />
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};
