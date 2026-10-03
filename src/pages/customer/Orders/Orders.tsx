import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../../store/store';
import { SectionTitle } from '../../../components/common/SectionTitle';
import { formatPrice } from '../../../utils/formatPrice';
import { OrderStatusBadge } from '../../../components/admin/orders/OrderStatus';
import { Package, ArrowRight, Truck, Loader } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { OrderCardShimmer } from '../../../components/common/Shimmer';

export const Orders: React.FC = () => {
  const { orders, isOrdersLoading, refreshOrders, isAuthenticated } = useStore();

  useEffect(() => {
    if (isAuthenticated) {
      refreshOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <div style={{ padding: '3.5rem 0 6rem 0', backgroundColor: '#FAF7F2' }}>
      <div className="container" style={{ maxWidth: '860px' }}>
        <div className="flex items-center justify-between flex-wrap gap-4" style={{ marginBottom: '2.5rem' }}>
          <div>
            <SectionTitle
              align="left"
              subtitle="Your Account"
              title="Orders &amp; Parcel Tracking"
              description="Review your order history and live dispatch status."
            />
          </div>
          <Link to="/track-order">
            <Button variant="outline" size="sm" leftIcon={<Truck size={16} />}>
              Quick Parcel Lookup
            </Button>
          </Link>
        </div>

        {isOrdersLoading ? (
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
            <h3 style={{ fontSize: '1.35rem', color: '#1C1917', marginBottom: '0.5rem' }}>No orders found</h3>
            <p style={{ color: '#78716C', marginBottom: '1.5rem' }}>When you order raw honey, you can track every step here.</p>
            <Link to="/shop">
              <Button size="md">Explore Honey Shop</Button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {orders.map((ord) => (
              <div
                key={ord.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '1.75rem',
                  border: '1px solid #E7E5E4',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-2" style={{ borderBottom: '1px solid #F5F1E9', paddingBottom: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ fontWeight: 800, fontSize: '1.15rem', color: '#1C1917' }}>
                      Order {ord.orderNumber}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#78716C', marginLeft: '10px' }}>
                      Placed {new Date(ord.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {ord.paymentStatus === 'verification_pending' && (
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A' }}>
                        ⏳ Verifying UTR
                      </span>
                    )}
                    {ord.paymentStatus === 'paid' && (
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: '#ECFDF5', color: '#065F46', border: '1px solid #A7F3D0' }}>
                        ✓ Paid
                      </span>
                    )}
                    {ord.paymentStatus === 'rejected' && (
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>
                        ✕ Payment Rejected
                      </span>
                    )}
                    {ord.paymentMethod === 'cod' && (
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: '#EFF6FF', color: '#1E40AF', border: '1px solid #BFDBFE' }}>
                        💵 COD
                      </span>
                    )}
                    <OrderStatusBadge status={ord.orderStatus} />
                    <span style={{ fontWeight: 800, fontSize: '1.15rem', color: '#D97706', marginLeft: '6px' }}>
                      {formatPrice(ord.total)}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  {ord.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image || 'https://res.cloudinary.com/kisnodzz/image/upload/v1791042814/madhuvan_honey/products/t6l1edtfc4xg0wmxb8we.jpg'}
                          alt={item.productName}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = 'https://res.cloudinary.com/kisnodzz/image/upload/v1791042814/madhuvan_honey/products/t6l1edtfc4xg0wmxb8we.jpg';
                          }}
                          style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1C1917' }}>{item.productName}</div>
                          <div style={{ fontSize: '0.8rem', color: '#78716C' }}>Qty: {item.quantity} × {item.size}</div>
                        </div>
                      </div>
                      <div style={{ fontWeight: 600, color: '#1C1917', fontSize: '0.9rem' }}>
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer action */}
                <div className="flex items-center justify-between flex-wrap gap-2" style={{ borderTop: '1px solid #F5F1E9', paddingTop: '1rem' }}>
                  <div style={{ fontSize: '0.82rem', color: '#78716C' }}>
                    Tracking: <strong>{ord.trackingNumber || 'Processing dispatch'}</strong>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/track-order?q=${encodeURIComponent(ord.orderNumber)}`}
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
                      <span>Track Shipment</span>
                    </Link>
                    <Link
                      to={`/orders/${ord.id}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: '#D97706',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                      }}
                    >
                      <span>View Invoice &amp; Details</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};
