import React, { useState, useEffect } from 'react';
import { useStore } from '../../../store/store';
import { OrderTable } from '../../../components/admin/orders/OrderTable';
import { Order, OrderStatus } from '../../../types/order.types';
import { Modal } from '../../../components/common/Modal';
import { OrderDetailsModalContent } from '../../../components/admin/orders/OrderDetails';
import { Input } from '../../../components/common/Input';
import { Search, RefreshCw } from 'lucide-react';
import orderApi from '../../../services/orderApi';

export const Orders: React.FC = () => {
  const { updateOrderStatus, verifyPayment, rejectPayment, showToast } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const loadAdminOrders = async () => {
    setIsLoading(true);
    try {
      const result = await orderApi.getAll({ limit: 200 });
      setOrders(result.orders);
    } catch (err: any) {
      showToast('Could not load orders from server.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminOrders();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadAdminOrders, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pendingVerificationCount = orders.filter(
    (o) => o.paymentStatus === 'verification_pending'
  ).length;

  const filtered = orders.filter((o) => {
    if (statusFilter === 'pending_verification') {
      if (o.paymentStatus !== 'verification_pending') return false;
    } else if (statusFilter !== 'all' && o.orderStatus !== statusFilter) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        (o.utrNumber && o.utrNumber.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleUpdateStatus = async (st: OrderStatus) => {
    if (selectedOrder) {
      await updateOrderStatus(selectedOrder.id, st);
      const updated = { ...selectedOrder, orderStatus: st };
      setOrders((prev) => prev.map((o) => (o.id === selectedOrder.id ? updated : o)));
      setSelectedOrder(updated);
    }
  };

  // Called by OrderDetailsModalContent after verify/reject payment
  const handleOrderUpdated = (updatedOrder: Order) => {
    setOrders((prev) => prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));
    setSelectedOrder(updatedOrder);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '1.85rem', color: '#1C1917', margin: '0 0 0.25rem 0' }}>
            Customer Orders &amp; Dispatch
          </h1>
          <p style={{ color: '#78716C', margin: 0, fontSize: '0.9rem' }}>
            Verify incoming UPI payments, update fulfillment dispatch, and manage COD bookings.
          </p>
        </div>
        <button
          onClick={loadAdminOrders}
          disabled={isLoading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '10px',
            border: '1px solid #E7E5E4',
            background: '#FFFFFF',
            cursor: 'pointer',
            fontSize: '0.85rem',
            color: '#57534E',
            fontWeight: 600,
          }}
        >
          <RefreshCw size={14} style={{ animation: isLoading ? 'spin 1s linear infinite' : 'none' }} />
          {isLoading ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', backgroundColor: '#FFFFFF', padding: '1rem 1.25rem', borderRadius: '14px', border: '1px solid #E7E5E4' }}>
        <div style={{ flex: '1 1 240px', minWidth: 0, maxWidth: '360px' }}>
          <Input
            placeholder="Search order #, customer, or UTR..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search size={16} />}
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setStatusFilter('all')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: statusFilter === 'all' ? 700 : 500,
              border: statusFilter === 'all' ? '1px solid #D97706' : '1px solid #E7E5E4',
              background: statusFilter === 'all' ? '#FEF3C7' : '#FFFFFF',
              color: statusFilter === 'all' ? '#92400E' : '#57534E',
              cursor: 'pointer',
            }}
          >
            All Orders ({orders.length})
          </button>

          <button
            onClick={() => setStatusFilter('pending_verification')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 700,
              border: statusFilter === 'pending_verification' ? '2px solid #D97706' : '1px solid #FCD34D',
              background: statusFilter === 'pending_verification' ? '#D97706' : '#FFFBEB',
              color: statusFilter === 'pending_verification' ? '#FFFFFF' : '#B45309',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>⏳ Verify Payments</span>
            <span
              style={{
                backgroundColor: statusFilter === 'pending_verification' ? '#FFFFFF' : '#D97706',
                color: statusFilter === 'pending_verification' ? '#D97706' : '#FFFFFF',
                fontSize: '0.72rem',
                padding: '1px 6px',
                borderRadius: '10px',
                fontWeight: 800,
              }}
            >
              {pendingVerificationCount}
            </span>
          </button>

          {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: statusFilter === st ? 700 : 500,
                border: statusFilter === st ? '1px solid #D97706' : '1px solid #E7E5E4',
                background: statusFilter === st ? '#FEF3C7' : '#FFFFFF',
                color: statusFilter === st ? '#92400E' : '#57534E',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <OrderTable orders={filtered} onViewOrder={(o) => setSelectedOrder(o)} isLoading={isLoading} />

      {/* Modal for Order Details */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title="Order Fulfillment Information"
        maxWidth="620px"
      >
        {selectedOrder && (
          <OrderDetailsModalContent
            order={selectedOrder}
            onUpdateStatus={handleUpdateStatus}
            onOrderUpdated={handleOrderUpdated}
          />
        )}
      </Modal>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

