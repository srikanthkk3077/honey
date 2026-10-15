import React, { useState, useEffect, useMemo, useCallback } from 'react';
import orderApi from '../../../services/orderApi';
import { Order } from '../../../types/order.types';
import { useStore } from '../../../store/store';
import { formatPrice } from '../../../utils/formatPrice';
import {
  CheckCircle2, XCircle, Clock, RefreshCw, Search,
  AlertCircle, Eye, ChevronDown, ChevronUp, Phone, Mail, MapPin,
  ShieldCheck, Ban,
} from 'lucide-react';

type FilterType = 'all_pending' | 'verification_pending' | 'rejected' | 'paid';

export const PaymentVerification: React.FC = () => {
  const { showToast } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('verification_pending');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectingOrderId, setRejectingOrderId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadOrders = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const result = await orderApi.getAll({ limit: 100 });
      setOrders(result.orders);
    } catch {
      if (!silent) showToast('Failed to load orders.', 'error');
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadOrders();
    const interval = setInterval(() => loadOrders(true), 30000);
    return () => clearInterval(interval);
  }, [loadOrders]);

  const handleVerify = async (orderId: string) => {
    setProcessingId(orderId);
    try {
      const updated = await orderApi.verifyPayment(orderId);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      showToast('Payment verified & order confirmed! ✓', 'success');
    } catch {
      showToast('Could not verify payment. Please try again.', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (orderId: string) => {
    if (!rejectReason.trim()) {
      showToast('Please provide a rejection reason.', 'error');
      return;
    }
    setProcessingId(orderId);
    try {
      const updated = await orderApi.rejectPayment(orderId, rejectReason.trim());
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      setRejectingOrderId(null);
      setRejectReason('');
      showToast('Payment rejected. Customer will be notified.', 'info');
    } catch {
      showToast('Could not reject payment. Please try again.', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (filter === 'verification_pending') return o.paymentStatus === 'verification_pending';
      if (filter === 'rejected') return o.paymentStatus === 'rejected';
      if (filter === 'paid') return o.paymentStatus === 'paid' && o.paymentMethod === 'upi';
      return o.paymentMethod === 'upi' || o.paymentStatus === 'verification_pending';
    }).filter((o) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        (o.orderNumber || '').toLowerCase().includes(q) ||
        (o.customerName || '').toLowerCase().includes(q) ||
        (o.customerPhone || '').toLowerCase().includes(q) ||
        (o.utrNumber || '').toLowerCase().includes(q)
      );
    });
  }, [orders, filter, search]);

  const pendingCount = orders.filter((o) => o.paymentStatus === 'verification_pending').length;
  const rejectedCount = orders.filter((o) => o.paymentStatus === 'rejected').length;
  const verifiedCount = orders.filter((o) => o.paymentStatus === 'paid' && o.paymentMethod === 'upi').length;

  const getStatusBadge = (order: Order) => {
    if (order.paymentStatus === 'paid') {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '8px', backgroundColor: '#ECFDF5', color: '#065F46', fontSize: '0.78rem', fontWeight: 700 }}>
          <CheckCircle2 size={12} /> Verified & Paid
        </span>
      );
    }
    if (order.paymentStatus === 'verification_pending') {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '8px', backgroundColor: '#FEF3C7', color: '#92400E', fontSize: '0.78rem', fontWeight: 700 }}>
          <Clock size={12} /> Pending Verification
        </span>
      );
    }
    if (order.paymentStatus === 'rejected') {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '8px', backgroundColor: '#FEF2F2', color: '#B91C1C', fontSize: '0.78rem', fontWeight: 700 }}>
          <XCircle size={12} /> Rejected
        </span>
      );
    }
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '8px', backgroundColor: '#F3F4F6', color: '#374151', fontSize: '0.78rem', fontWeight: 700 }}>
        {order.paymentStatus}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <RefreshCw size={32} color="#D97706" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto', display: 'block' }} />
        <p style={{ color: '#78716C' }}>Loading payment verification queue…</p>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
        .pv-row:hover { background: #FFFBEB !important; }
        @media (max-width: 768px) {
          .pv-stats-row { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .pv-stats-row { grid-template-columns: 1fr !important; }
          .pv-filter-tabs { flex-direction: column !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', color: '#1C1917', margin: '0 0 0.25rem 0' }}>
            💳 Payment Verification
          </h1>
          <p style={{ color: '#78716C', margin: 0, fontSize: '0.9rem' }}>
            Review UPI payment proofs, verify transactions, and confirm or reject customer orders.
          </p>
        </div>
        <button
          id="pv-refresh-btn"
          onClick={() => loadOrders()}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '8px 16px', borderRadius: '10px',
            border: '1px solid #E7E5E4', background: '#FFFFFF',
            fontSize: '0.85rem', fontWeight: 600, color: '#57534E', cursor: 'pointer',
          }}
        >
          <RefreshCw size={15} color="#D97706" /> Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="pv-stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        <div style={{ backgroundColor: '#FFFBEB', border: '1.5px solid #FDE68A', borderRadius: '14px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Clock size={22} color="#D97706" />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#92400E', lineHeight: 1 }}>{pendingCount}</div>
            <div style={{ fontSize: '0.8rem', color: '#78716C', marginTop: '2px' }}>Pending Verification</div>
          </div>
        </div>
        <div style={{ backgroundColor: '#ECFDF5', border: '1.5px solid #A7F3D0', borderRadius: '14px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <CheckCircle2 size={22} color="#059669" />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#065F46', lineHeight: 1 }}>{verifiedCount}</div>
            <div style={{ fontSize: '0.8rem', color: '#78716C', marginTop: '2px' }}>Verified & Paid (UPI)</div>
          </div>
        </div>
        <div style={{ backgroundColor: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: '14px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <XCircle size={22} color="#DC2626" />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#B91C1C', lineHeight: 1 }}>{rejectedCount}</div>
            <div style={{ fontSize: '0.8rem', color: '#78716C', marginTop: '2px' }}>Rejected</div>
          </div>
        </div>
      </div>

      {/* Filters + Search */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E7E5E4', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="pv-filter-tabs" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {([
            { key: 'verification_pending', label: `⏳ Pending (${pendingCount})` },
            { key: 'all_pending', label: 'All UPI Orders' },
            { key: 'paid', label: `✓ Verified (${verifiedCount})` },
            { key: 'rejected', label: `✗ Rejected (${rejectedCount})` },
          ] as { key: FilterType; label: string }[]).map((tab) => (
            <button
              key={tab.key}
              id={`pv-filter-${tab.key}`}
              onClick={() => setFilter(tab.key)}
              style={{
                padding: '7px 14px', borderRadius: '10px', border: 'none',
                fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                backgroundColor: filter === tab.key ? '#D97706' : '#FAF7F2',
                color: filter === tab.key ? '#FFFFFF' : '#57534E',
                transition: 'all 0.15s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative' }}>
          <Search size={16} color="#A8A29E" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            id="pv-search-input"
            type="text"
            placeholder="Search by order #, customer, phone, or UTR..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '10px 12px 10px 36px', borderRadius: '10px',
              border: '1px solid #E7E5E4', fontSize: '0.88rem', outline: 'none',
              boxSizing: 'border-box' as const,
            }}
          />
        </div>
      </div>

      {/* Orders List */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E7E5E4' }}>
          <ShieldCheck size={44} color="#D97706" style={{ margin: '0 auto 1rem auto', display: 'block' }} />
          <h3 style={{ color: '#1C1917', marginBottom: '0.5rem' }}>
            {filter === 'verification_pending' ? 'No Payments Pending Verification' : 'No orders match your filter'}
          </h3>
          <p style={{ color: '#78716C', fontSize: '0.9rem' }}>
            {filter === 'verification_pending' ? 'All UPI payments have been verified. Great work!' : 'Try adjusting your search or filter.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map((order) => (
            <div
              key={order.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: order.paymentStatus === 'verification_pending'
                  ? '1.5px solid #FDE68A'
                  : order.paymentStatus === 'rejected'
                    ? '1.5px solid #FECACA'
                    : '1px solid #E7E5E4',
                overflow: 'hidden',
                animation: 'fadeIn 0.2s ease',
              }}
            >
              {/* Order Row Header */}
              <div
                className="pv-row"
                style={{ padding: '1.1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', cursor: 'pointer', transition: 'background 0.15s' }}
                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
              >
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 800, color: '#1C1917', fontSize: '0.95rem' }}>{order.orderNumber}</span>
                    {getStatusBadge(order)}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#57534E' }}>
                    {order.customerName} • {order.customerPhone}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#A8A29E', marginTop: '2px' }}>
                    {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#D97706' }}>{formatPrice(order.total)}</div>
                  {order.utrNumber && (
                    <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#57534E', marginTop: '2px' }}>
                      UTR: {order.utrNumber}
                    </div>
                  )}
                </div>

                <div style={{ flexShrink: 0, color: '#A8A29E' }}>
                  {expandedId === order.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {/* Expanded Detail Panel */}
              {expandedId === order.id && (
                <div style={{ borderTop: '1px solid #F5F1E9', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', backgroundColor: '#FFFDF7' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                    {/* Customer Details */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#92400E', textTransform: 'uppercase' as const, letterSpacing: '0.04em', marginBottom: '4px' }}>Customer</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#1C1917' }}>
                        <Phone size={13} color="#D97706" /> {order.customerPhone}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#1C1917' }}>
                        <Mail size={13} color="#D97706" /> {order.customerEmail}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.82rem', color: '#57534E' }}>
                        <MapPin size={13} color="#D97706" style={{ marginTop: '2px', flexShrink: 0 }} />
                        <span>
                          {order.shippingAddress?.addressLine1}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                        </span>
                      </div>
                    </div>

                    {/* Payment Details */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#92400E', textTransform: 'uppercase' as const, letterSpacing: '0.04em', marginBottom: '4px' }}>Payment Details</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span style={{ color: '#57534E' }}>UTR Number:</span>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1C1917' }}>{order.utrNumber || '—'}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span style={{ color: '#57534E' }}>Amount:</span>
                        <span style={{ fontWeight: 800, color: '#D97706' }}>{formatPrice(order.total)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span style={{ color: '#57534E' }}>Method:</span>
                        <span style={{ fontWeight: 600, color: '#1C1917', textTransform: 'uppercase' as const }}>{order.paymentMethod}</span>
                      </div>
                      {order.paymentVerifiedAt && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                          <span style={{ color: '#57534E' }}>Verified At:</span>
                          <span style={{ color: '#059669', fontWeight: 600 }}>
                            {new Date(order.paymentVerifiedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                          </span>
                        </div>
                      )}
                      {order.paymentRejectedReason && (
                        <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '0.5rem 0.75rem', fontSize: '0.8rem', color: '#B91C1C', marginTop: '4px' }}>
                          <strong>Rejection Reason:</strong> {order.paymentRejectedReason}
                        </div>
                      )}
                    </div>

                    {/* Payment Screenshot */}
                    {order.paymentScreenshot && (
                      <div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#92400E', textTransform: 'uppercase' as const, letterSpacing: '0.04em', marginBottom: '8px' }}>Payment Screenshot</div>
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <img
                            src={order.paymentScreenshot}
                            alt="Payment screenshot"
                            style={{ width: '130px', height: '130px', objectFit: 'cover', borderRadius: '10px', border: '1.5px solid #FDE68A', cursor: 'zoom-in' }}
                            onClick={() => setSelectedScreenshot(order.paymentScreenshot!)}
                          />
                          <button
                            type="button"
                            onClick={() => setSelectedScreenshot(order.paymentScreenshot!)}
                            style={{
                              position: 'absolute', bottom: '6px', right: '6px',
                              backgroundColor: 'rgba(0,0,0,0.6)', border: 'none',
                              borderRadius: '6px', padding: '3px 8px',
                              color: '#FFFFFF', fontSize: '0.7rem', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', gap: '3px',
                            }}
                          >
                            <Eye size={11} /> View
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Order Items */}
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#92400E', textTransform: 'uppercase' as const, letterSpacing: '0.04em', marginBottom: '8px' }}>
                      Order Items ({order.items.length})
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {order.items.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', color: '#44403C', padding: '6px 0', borderBottom: idx < order.items.length - 1 ? '1px dashed #F5F1E9' : 'none' }}>
                          <span>{item.productName} ({item.size}) × {item.quantity}</span>
                          <span style={{ fontWeight: 700 }}>{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons — Pending */}
                  {order.paymentStatus === 'verification_pending' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1C1917' }}>Admin Action:</div>
                      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                        <button
                          id={`verify-btn-${order.id}`}
                          type="button"
                          onClick={() => handleVerify(order.id)}
                          disabled={processingId === order.id}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '7px',
                            padding: '10px 20px', borderRadius: '12px', border: 'none',
                            backgroundColor: processingId === order.id ? '#D1FAE5' : '#059669',
                            color: '#FFFFFF', fontWeight: 700, fontSize: '0.9rem',
                            cursor: processingId === order.id ? 'not-allowed' : 'pointer',
                            transition: 'all 0.15s',
                          }}
                        >
                          {processingId === order.id ? (
                            <RefreshCw size={15} style={{ animation: 'spin 1s linear infinite' }} />
                          ) : (
                            <CheckCircle2 size={16} />
                          )}
                          Verify & Confirm Payment
                        </button>

                        {rejectingOrderId === order.id ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: '240px' }}>
                            <input
                              type="text"
                              placeholder="Enter rejection reason (shown to customer)..."
                              value={rejectReason}
                              onChange={(e) => setRejectReason(e.target.value)}
                              style={{
                                width: '100%', padding: '9px 12px', borderRadius: '10px',
                                border: '1.5px solid #FCA5A5', fontSize: '0.85rem', outline: 'none',
                                boxSizing: 'border-box' as const,
                              }}
                              autoFocus
                            />
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                id={`confirm-reject-btn-${order.id}`}
                                type="button"
                                onClick={() => handleReject(order.id)}
                                disabled={processingId === order.id}
                                style={{
                                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                                  padding: '8px 16px', borderRadius: '10px', border: 'none',
                                  backgroundColor: '#DC2626', color: '#FFFFFF',
                                  fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                                }}
                              >
                                <Ban size={14} /> Confirm Rejection
                              </button>
                              <button
                                type="button"
                                onClick={() => { setRejectingOrderId(null); setRejectReason(''); }}
                                style={{
                                  padding: '8px 14px', borderRadius: '10px',
                                  border: '1px solid #E7E5E4', background: '#FFFFFF',
                                  fontSize: '0.85rem', cursor: 'pointer', color: '#57534E',
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            id={`reject-btn-${order.id}`}
                            type="button"
                            onClick={() => { setRejectingOrderId(order.id); setRejectReason(''); }}
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: '7px',
                              padding: '10px 20px', borderRadius: '12px',
                              border: '1.5px solid #FECACA',
                              backgroundColor: '#FEF2F2', color: '#DC2626',
                              fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                              transition: 'all 0.15s',
                            }}
                          >
                            <XCircle size={16} /> Reject Payment
                          </button>
                        )}
                      </div>

                      {!order.utrNumber && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#92400E', backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '8px', padding: '0.6rem 0.85rem' }}>
                          <AlertCircle size={14} />
                          No UTR number submitted. Customer may not have completed the payment yet.
                        </div>
                      )}
                    </div>
                  )}

                  {/* Verified State */}
                  {order.paymentStatus === 'paid' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#065F46', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '10px', padding: '0.75rem 1rem' }}>
                      <CheckCircle2 size={16} />
                      Payment verified and order confirmed. Dispatch can proceed.
                    </div>
                  )}

                  {/* Rejected State */}
                  {order.paymentStatus === 'rejected' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#B91C1C', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '0.75rem 1rem' }}>
                        <XCircle size={16} />
                        This payment was rejected. Customer should re-submit payment proof.
                      </div>
                      <button
                        type="button"
                        onClick={() => handleVerify(order.id)}
                        disabled={processingId === order.id}
                        style={{
                          alignSelf: 'flex-start',
                          display: 'inline-flex', alignItems: 'center', gap: '6px',
                          padding: '8px 16px', borderRadius: '10px', border: 'none',
                          backgroundColor: '#059669', color: '#FFFFFF',
                          fontWeight: 600, fontSize: '0.85rem',
                          cursor: processingId === order.id ? 'not-allowed' : 'pointer',
                        }}
                      >
                        <CheckCircle2 size={14} /> Override & Mark as Paid
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Screenshot Lightbox */}
      {selectedScreenshot && (
        <div
          onClick={() => setSelectedScreenshot(null)}
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)',
            zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
            <img
              src={selectedScreenshot}
              alt="Payment screenshot full view"
              style={{ maxWidth: '100%', maxHeight: '85vh', borderRadius: '14px', border: '2px solid #FFFFFF' }}
            />
            <button
              type="button"
              onClick={() => setSelectedScreenshot(null)}
              style={{
                position: 'absolute', top: '-12px', right: '-12px',
                backgroundColor: '#DC2626', border: 'none', borderRadius: '50%',
                width: '32px', height: '32px', color: '#FFFFFF', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
              }}
            >
              ✕
            </button>
            <div style={{ textAlign: 'center', marginTop: '8px', color: '#E7E5E4', fontSize: '0.8rem' }}>
              Click outside to close
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentVerification;
