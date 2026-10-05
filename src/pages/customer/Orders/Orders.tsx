import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../../store/store';
import { SectionTitle } from '../../../components/common/SectionTitle';
import { formatPrice } from '../../../utils/formatPrice';
import { OrderStatusBadge } from '../../../components/admin/orders/OrderStatus';
import {
  Package,
  ArrowRight,
  Truck,
  RefreshCw,
  Search,
  Copy,
  Check,
  LogIn,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { OrderCardShimmer } from '../../../components/common/Shimmer';
import { Pagination } from '../../../components/common/Pagination';
import { Order } from '../../../types/order.types';

const safeFormatDate = (dateStr?: string | Date) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return isNaN(d.getTime())
    ? '—'
    : d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
};

interface OrderCardProps {
  order: Order;
}

const OrderCard: React.FC<OrderCardProps> = React.memo(({ order }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyOrderNumber = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!order.orderNumber) return;
    navigator.clipboard.writeText(order.orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const items = order.items || [];
  const itemCount = items.reduce((acc, i) => acc + (i.quantity || 1), 0);

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        padding: '1.75rem',
        border: '1px solid #E7E5E4',
        boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between flex-wrap gap-2"
        style={{ borderBottom: '1px solid #F5F1E9', paddingBottom: '1rem', marginBottom: '1rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 800, fontSize: '1.15rem', color: '#1C1917' }}>
            Order #{order.orderNumber}
          </span>
          <button
            type="button"
            onClick={handleCopyOrderNumber}
            title="Copy Order ID"
            style={{
              background: copied ? '#ECFDF5' : '#F5F5F4',
              color: copied ? '#059669' : '#78716C',
              border: copied ? '1px solid #A7F3D0' : '1px solid #E7E5E4',
              borderRadius: '6px',
              padding: '2px 6px',
              cursor: 'pointer',
              fontSize: '0.72rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            {copied ? <Check size={11} /> : <Copy size={11} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <span style={{ fontSize: '0.8rem', color: '#78716C', marginLeft: '6px' }}>
            Placed {safeFormatDate(order.createdAt)}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {order.paymentStatus === 'verification_pending' && (
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '6px',
                background: '#FEF3C7',
                color: '#92400E',
                border: '1px solid #FDE68A',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Clock size={12} /> Verifying UTR
            </span>
          )}
          {order.paymentStatus === 'paid' && (
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '6px',
                background: '#ECFDF5',
                color: '#065F46',
                border: '1px solid #A7F3D0',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <CheckCircle2 size={12} /> Paid
            </span>
          )}
          {order.paymentStatus === 'rejected' && (
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '6px',
                background: '#FEF2F2',
                color: '#DC2626',
                border: '1px solid #FECACA',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <XCircle size={12} /> Payment Rejected
            </span>
          )}
          {order.paymentMethod === 'cod' && order.paymentStatus !== 'paid' && (
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '6px',
                background: '#EFF6FF',
                color: '#1E40AF',
                border: '1px solid #BFDBFE',
              }}
            >
              💵 COD
            </span>
          )}
          <OrderStatusBadge status={order.orderStatus} />
          <span style={{ fontWeight: 800, fontSize: '1.15rem', color: '#D97706', marginLeft: '6px' }}>
            {formatPrice(order.total)}
          </span>
        </div>
      </div>

      {/* Items list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={item.image || 'https://res.cloudinary.com/kisnodzz/image/upload/v1791042814/madhuvan_honey/products/t6l1edtfc4xg0wmxb8we.jpg'}
                alt={item.productName || 'Honey product'}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://res.cloudinary.com/kisnodzz/image/upload/v1791042814/madhuvan_honey/products/t6l1edtfc4xg0wmxb8we.jpg';
                }}
                style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }}
              />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1C1917' }}>
                  {item.productName || 'Raw Forest Honey'}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#78716C' }}>
                  Qty: {item.quantity || 1} {item.size ? `× ${item.size}` : ''}
                </div>
              </div>
            </div>
            <div style={{ fontWeight: 600, color: '#1C1917', fontSize: '0.9rem' }}>
              {formatPrice((item.price || 0) * (item.quantity || 1))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div
        className="flex items-center justify-between flex-wrap gap-2"
        style={{ borderTop: '1px solid #F5F1E9', paddingTop: '1rem' }}
      >
        <div style={{ fontSize: '0.82rem', color: '#78716C' }}>
          Tracking:{' '}
          <strong style={{ color: order.trackingNumber ? '#D97706' : '#78716C' }}>
            {order.trackingNumber || 'Processing dispatch'}
          </strong>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to={`/track-order?q=${encodeURIComponent(order.orderNumber)}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#FEF3C7',
              color: '#92400E',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 700,
              textDecoration: 'none',
              border: '1px solid #FDE68A',
            }}
          >
            <Truck size={14} />
            <span>Track Parcel</span>
          </Link>
          <Link
            to={`/orders/${order.id}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              color: '#D97706',
              fontWeight: 700,
              fontSize: '0.88rem',
              textDecoration: 'none',
            }}
          >
            <span>View Details &amp; Invoice</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
});

export const Orders: React.FC = () => {
  const { orders, isOrdersLoading, refreshOrders, isAuthenticated } = useStore();
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);

  const handleManualRefresh = useCallback(async () => {
    setIsManualRefreshing(true);
    try {
      await refreshOrders();
    } finally {
      setIsManualRefreshing(false);
    }
  }, [refreshOrders]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshOrders();

      // Auto-poll every 20 seconds silently so payments verified by Admin reflect live
      const interval = setInterval(() => {
        refreshOrders();
      }, 20000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, refreshOrders]);

  // Status counts for filter tabs
  const counts = useMemo(() => {
    let pendingVerification = 0;
    let active = 0;
    let delivered = 0;
    let rejected = 0;

    orders.forEach((o) => {
      if (o.paymentStatus === 'verification_pending') {
        pendingVerification++;
      }
      if (o.orderStatus === 'delivered') {
        delivered++;
      } else if (o.orderStatus === 'cancelled' || o.paymentStatus === 'rejected') {
        rejected++;
      } else {
        active++;
      }
    });

    return {
      all: orders.length,
      pendingVerification,
      active,
      delivered,
      rejected,
    };
  }, [orders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // Status filter
      if (statusFilter === 'verification_pending') {
        if (o.paymentStatus !== 'verification_pending') return false;
      } else if (statusFilter === 'active') {
        if (o.orderStatus === 'delivered' || o.orderStatus === 'cancelled' || o.paymentStatus === 'rejected') {
          return false;
        }
      } else if (statusFilter === 'delivered') {
        if (o.orderStatus !== 'delivered') return false;
      } else if (statusFilter === 'rejected') {
        if (o.orderStatus !== 'cancelled' && o.paymentStatus !== 'rejected') return false;
      }

      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesNumber = (o.orderNumber || '').toLowerCase().includes(q);
        const matchesTracking = (o.trackingNumber || '').toLowerCase().includes(q);
        const matchesItems = (o.items || []).some((item) =>
          (item.productName || '').toLowerCase().includes(q)
        );
        return matchesNumber || matchesTracking || matchesItems;
      }

      return true;
    });
  }, [orders, statusFilter, search]);

  // Pagination calculation
  const totalFiltered = filteredOrders.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const validPage = Math.min(currentPage, totalPages);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedOrders = useMemo(() => {
    return filteredOrders.slice((validPage - 1) * pageSize, validPage * pageSize);
  }, [filteredOrders, validPage, pageSize]);

  const handleFilterChange = useCallback((newFilter: string) => {
    setStatusFilter(newFilter);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((val: string) => {
    setSearch(val);
    setCurrentPage(1);
  }, []);

  return (
    <div style={{ padding: '3.5rem 0 6rem 0', backgroundColor: '#FAF7F2', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '860px' }}>
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4" style={{ marginBottom: '2rem' }}>
          <div>
            <SectionTitle
              align="left"
              subtitle="Your Account"
              title="Orders &amp; Parcel Tracking"
              description="Review your order history, verified payments, and live courier dispatch."
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {isAuthenticated && (
              <button
                type="button"
                onClick={handleManualRefresh}
                disabled={isOrdersLoading || isManualRefreshing}
                title="Refresh order statuses"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#FFFFFF',
                  color: '#78716C',
                  border: '1px solid #E7E5E4',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: isOrdersLoading || isManualRefreshing ? 'not-allowed' : 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                }}
              >
                <RefreshCw
                  size={14}
                  style={{
                    animation: isOrdersLoading || isManualRefreshing ? 'spin 1s linear infinite' : 'none',
                  }}
                />
                <span>{isOrdersLoading || isManualRefreshing ? 'Updating...' : 'Refresh'}</span>
              </button>
            )}

            <Link to="/track-order">
              <Button variant="outline" size="sm" leftIcon={<Truck size={16} />}>
                Quick Parcel Lookup
              </Button>
            </Link>
          </div>
        </div>

        {/* When user is NOT authenticated */}
        {!isAuthenticated ? (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '3.5rem 2rem',
              textAlign: 'center',
              border: '1px solid #E7E5E4',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#FEF3C7',
                color: '#D97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto',
              }}
            >
              <LogIn size={28} />
            </div>
            <h3 style={{ fontSize: '1.4rem', color: '#1C1917', marginBottom: '0.5rem', fontWeight: 800 }}>
              Sign In to View Your Account Orders
            </h3>
            <p
              style={{
                color: '#78716C',
                maxWidth: '480px',
                margin: '0 auto 2rem auto',
                fontSize: '0.95rem',
                lineHeight: 1.6,
              }}
            >
              Access your saved purchases, live invoice records, UPI settlement statuses, and instant parcel dispatch updates.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <Link to="/login">
                <Button size="md" leftIcon={<LogIn size={16} />}>
                  Sign In to Account
                </Button>
              </Link>
              <Link to="/track-order">
                <Button variant="outline" size="md" leftIcon={<Truck size={16} />}>
                  Track by Order ID
                </Button>
              </Link>
            </div>
          </div>
        ) : isOrdersLoading && orders.length === 0 ? (
          <OrderCardShimmer count={3} />
        ) : orders.length === 0 ? (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '4rem 2rem',
              textAlign: 'center',
              border: '1px solid #E7E5E4',
            }}
          >
            <Package size={48} color="#D97706" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.35rem', color: '#1C1917', marginBottom: '0.5rem', fontWeight: 800 }}>
              No orders placed yet
            </h3>
            <p style={{ color: '#78716C', marginBottom: '1.5rem' }}>
              When you purchase 100% raw artisanal honey, you can track every step of fulfillment right here.
            </p>
            <Link to="/shop">
              <Button size="md">Explore Honey Shop</Button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Filter toolbar & search */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E7E5E4',
                padding: '1rem 1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              {/* Search bar */}
              <div style={{ position: 'relative' }}>
                <Search
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#A8A29E',
                  }}
                />
                <input
                  type="text"
                  placeholder="Search by order number (e.g. ORD-1001) or honey product..."
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 36px',
                    borderRadius: '10px',
                    border: '1px solid #E7E5E4',
                    fontSize: '0.88rem',
                    outline: 'none',
                    backgroundColor: '#FAF7F2',
                    color: '#1C1917',
                  }}
                />
              </div>

              {/* Status filter tabs */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  flexWrap: 'wrap',
                  borderTop: '1px solid #F5F1E9',
                  paddingTop: '0.75rem',
                }}
              >
                <button
                  type="button"
                  onClick={() => handleFilterChange('all')}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: statusFilter === 'all' ? 700 : 500,
                    border: statusFilter === 'all' ? '1px solid #D97706' : '1px solid #E7E5E4',
                    background: statusFilter === 'all' ? '#FEF3C7' : '#FFFFFF',
                    color: statusFilter === 'all' ? '#92400E' : '#57534E',
                    cursor: 'pointer',
                  }}
                >
                  All ({counts.all})
                </button>

                {counts.pendingVerification > 0 && (
                  <button
                    type="button"
                    onClick={() => handleFilterChange('verification_pending')}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      border:
                        statusFilter === 'verification_pending'
                          ? '1px solid #D97706'
                          : '1px solid #FCD34D',
                      background:
                        statusFilter === 'verification_pending' ? '#D97706' : '#FFFBEB',
                      color:
                        statusFilter === 'verification_pending' ? '#FFFFFF' : '#B45309',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>⏳ Verifying UTR</span>
                    <span
                      style={{
                        background:
                          statusFilter === 'verification_pending' ? '#FFFFFF' : '#D97706',
                        color:
                          statusFilter === 'verification_pending' ? '#D97706' : '#FFFFFF',
                        fontSize: '0.7rem',
                        padding: '1px 5px',
                        borderRadius: '6px',
                        fontWeight: 800,
                      }}
                    >
                      {counts.pendingVerification}
                    </span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleFilterChange('active')}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: statusFilter === 'active' ? 700 : 500,
                    border: statusFilter === 'active' ? '1px solid #D97706' : '1px solid #E7E5E4',
                    background: statusFilter === 'active' ? '#FEF3C7' : '#FFFFFF',
                    color: statusFilter === 'active' ? '#92400E' : '#57534E',
                    cursor: 'pointer',
                  }}
                >
                  In Progress ({counts.active})
                </button>

                <button
                  type="button"
                  onClick={() => handleFilterChange('delivered')}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: statusFilter === 'delivered' ? 700 : 500,
                    border: statusFilter === 'delivered' ? '1px solid #059669' : '1px solid #E7E5E4',
                    background: statusFilter === 'delivered' ? '#ECFDF5' : '#FFFFFF',
                    color: statusFilter === 'delivered' ? '#065F46' : '#57534E',
                    cursor: 'pointer',
                  }}
                >
                  ✓ Delivered ({counts.delivered})
                </button>

                {counts.rejected > 0 && (
                  <button
                    type="button"
                    onClick={() => handleFilterChange('rejected')}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: statusFilter === 'rejected' ? 700 : 500,
                      border: statusFilter === 'rejected' ? '1px solid #DC2626' : '1px solid #E7E5E4',
                      background: statusFilter === 'rejected' ? '#FEF2F2' : '#FFFFFF',
                      color: statusFilter === 'rejected' ? '#991B1B' : '#57534E',
                      cursor: 'pointer',
                    }}
                  >
                    Cancelled / Disputed ({counts.rejected})
                  </button>
                )}
              </div>
            </div>

            {/* Orders list or empty filtered state */}
            {filteredOrders.length === 0 ? (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  padding: '3rem 2rem',
                  textAlign: 'center',
                  border: '1px solid #E7E5E4',
                }}
              >
                <AlertCircle size={36} color="#A8A29E" style={{ margin: '0 auto 0.75rem auto' }} />
                <h4 style={{ fontSize: '1.1rem', color: '#1C1917', marginBottom: '0.25rem' }}>
                  No orders match this filter
                </h4>
                <p style={{ color: '#78716C', fontSize: '0.88rem', marginBottom: '1rem' }}>
                  Try changing your status filter or clearing your search term.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter('all');
                    setSearch('');
                  }}
                  style={{
                    backgroundColor: '#FEF3C7',
                    color: '#92400E',
                    border: '1px solid #FDE68A',
                    borderRadius: '8px',
                    padding: '6px 14px',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                  }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                {paginatedOrders.map((ord) => (
                  <OrderCard key={ord.id} order={ord} />
                ))}

                {/* Pagination Controls */}
                {totalFiltered > 0 && (
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1px solid #E7E5E4',
                      overflow: 'hidden',
                    }}
                  >
                    <Pagination
                      currentPage={validPage}
                      totalPages={totalPages}
                      totalItems={totalFiltered}
                      pageSize={pageSize}
                      onPageChange={setCurrentPage}
                      onPageSizeChange={(size) => {
                        setPageSize(size);
                        setCurrentPage(1);
                      }}
                      pageSizeOptions={[5, 10, 20]}
                      itemLabel="orders"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};
