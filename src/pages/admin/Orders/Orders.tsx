import React, { useState } from 'react';
import { useStore } from '../../../store/store';
import { OrderTable } from '../../../components/admin/orders/OrderTable';
import { Order, OrderStatus } from '../../../types/order.types';
import { Modal } from '../../../components/common/Modal';
import { OrderDetailsModalContent } from '../../../components/admin/orders/OrderDetails';
import { Input } from '../../../components/common/Input';
import { Search } from 'lucide-react';

export const Orders: React.FC = () => {
  const { orders, updateOrderStatus } = useStore();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = orders.filter((o) => {
    if (statusFilter !== 'all' && o.orderStatus !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleUpdateStatus = (st: OrderStatus) => {
    if (selectedOrder) {
      updateOrderStatus(selectedOrder.id, st);
      setSelectedOrder({ ...selectedOrder, orderStatus: st });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.85rem', color: '#1C1917', margin: '0 0 0.25rem 0' }}>
          Customer Orders & Dispatch
        </h1>
        <p style={{ color: '#78716C', margin: 0, fontSize: '0.9rem' }}>
          Track orders, change shipping statuses, and generate courier dispatch slips.
        </p>
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', backgroundColor: '#FFFFFF', padding: '1rem 1.25rem', borderRadius: '14px', border: '1px solid #E7E5E4' }}>
        <div style={{ maxWidth: '300px', flex: 1 }}>
          <Input
            placeholder="Search order # or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search size={16} />}
          />
        </div>

        <div className="flex items-center gap-2">
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
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

      <OrderTable
        orders={filtered}
        onViewOrder={(o) => setSelectedOrder(o)}
      />

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
          />
        )}
      </Modal>
    </div>
  );
};
