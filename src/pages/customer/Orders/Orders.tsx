import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../../store/store';
import { formatPrice } from '../../../utils/formatPrice';
import confetti from 'canvas-confetti';
import {
  Package,
  ArrowRight,
  Truck,
  RefreshCw,
  Search,
  Check,
  Clock,
  CheckCircle2,
  XCircle,
  Copy,
  ChevronDown,
  X,
  MapPin,
  ExternalLink,
  MessageCircle,
  ShoppingBag,
  Sparkles,
  AlertCircle,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { Order, OrderStatus } from '../../../types/order.types';
import orderApi from '../../../services/orderApi';
import { CONTACT_INFO } from '../../../utils/constants';

// Format short date like "7 Oct 2026" or "7 Oct"
const formatPlacedDate = (dateStr?: string | Date) => {
  if (!dateStr) return '7 Oct 2026';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '7 Oct 2026';
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const formatShortDate = (dateStr?: string | Date, offsetDays = 0) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  if (offsetDays !== 0) {
    d.setDate(d.getDate() + offsetDays);
  }
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
};

interface TrackingModalProps {
  order: Order | null;
  onClose: () => void;
  onBuyAgain: (order: Order) => void;
}

const TrackingModal: React.FC<TrackingModalProps> = ({ order, onClose, onBuyAgain }) => {
  const [copied, setCopied] = useState(false);

  if (!order) return null;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const trackingCode = order.trackingNumber || `MDH-TRK-${order.orderNumber.replace(/\D/g, '') || '849201'}`;
  const courier = 'Delhivery Express';

  const isDelivered = order.orderStatus === 'delivered';
  const isShipped = order.orderStatus === 'shipped';
  const isProcessing = order.orderStatus === 'processing' || order.orderStatus === 'pending';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(28, 25, 23, 0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '560px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.22)',
          border: '1px solid #ECE7DD',
          overflow: 'hidden',
          animation: 'fadeInScale 0.25s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            background: 'linear-gradient(135deg, #FAF7F2 0%, #F5EFE4 100%)',
            borderBottom: '1px solid #EAE3D5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Live Consignment Tracking
              </span>
            </div>
            <h3 style={{ margin: '2px 0 0 0', fontSize: '1.3rem', fontWeight: 800, color: '#1C1917', fontFamily: 'var(--font-serif)' }}>
              Order #{order.orderNumber}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#FFFFFF',
              border: '1px solid #E7E5E4',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#57534E',
              transition: 'all 0.2s',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem 1.75rem', maxHeight: '75vh', overflowY: 'auto' }}>
          {/* Tracking Number Bar */}
          <div
            style={{
              backgroundColor: '#FAF7F2',
              borderRadius: '14px',
              padding: '1rem 1.25rem',
              border: '1px solid #ECE7DD',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', color: '#78716C', fontWeight: 600, textTransform: 'uppercase' }}>
                Courier: {courier}
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1C1917', letterSpacing: '0.02em', marginTop: '2px' }}>
                {trackingCode}
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(trackingCode)}
              style={{
                backgroundColor: copied ? '#ECFDF5' : '#FFFFFF',
                color: copied ? '#059669' : '#542A0C',
                border: copied ? '1px solid #A7F3D0' : '1px solid #D6D3D1',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>

          {/* Stepper details */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem', fontWeight: 700 }}>
              Dispatch Milestones
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', paddingLeft: '1.75rem' }}>
              {/* Connecting line */}
              <div
                style={{
                  position: 'absolute',
                  left: '7px',
                  top: '10px',
                  bottom: '10px',
                  width: '2px',
                  background: '#E7E5E4',
                  zIndex: 1,
                }}
              />

              {/* Step 1 */}
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div
                  style={{
                    position: 'absolute',
                    left: '-1.75rem',
                    top: '2px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: '#D97706',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 0 3px #FEF3C7',
                  }}
                >
                  <Check size={10} color="#FFFFFF" strokeWidth={3} />
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#1C1917' }}>
                  Order Confirmed &amp; Invoiced
                </div>
                <div style={{ fontSize: '0.78rem', color: '#78716C' }}>
                  Harvested from sustainable apiaries • {formatPlacedDate(order.createdAt)}
                </div>
              </div>

              {/* Step 2 */}
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div
                  style={{
                    position: 'absolute',
                    left: '-1.75rem',
                    top: '2px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: isProcessing || isShipped || isDelivered ? '#D97706' : '#D6D3D1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isProcessing ? '0 0 0 3px #FEF3C7' : 'none',
                  }}
                >
                  {isShipped || isDelivered ? (
                    <Check size={10} color="#FFFFFF" strokeWidth={3} />
                  ) : (
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FFFFFF' }} />
                  )}
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#1C1917' }}>
                  Carefully Jarred &amp; Sealed
                </div>
                <div style={{ fontSize: '0.78rem', color: '#78716C' }}>
                  Quality tested for 100% purity • Tamper-evident glass seal attached
                </div>
              </div>

              {/* Step 3 */}
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div
                  style={{
                    position: 'absolute',
                    left: '-1.75rem',
                    top: '2px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: isShipped || isDelivered ? '#2563EB' : '#D6D3D1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isShipped ? '0 0 0 3px #DBEAFE' : 'none',
                  }}
                >
                  {isDelivered ? (
                    <Check size={10} color="#FFFFFF" strokeWidth={3} />
                  ) : isShipped ? (
                    <Truck size={10} color="#FFFFFF" />
                  ) : (
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FFFFFF' }} />
                  )}
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#1C1917' }}>
                  In Transit with {courier}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#78716C' }}>
                  {isShipped || isDelivered
                    ? 'Dispatched from central fulfillment hub. Climate-controlled handling.'
                    : 'Awaiting courier pickup.'}
                </div>
              </div>

              {/* Step 4 */}
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div
                  style={{
                    position: 'absolute',
                    left: '-1.75rem',
                    top: '2px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: isDelivered ? '#16A34A' : '#D6D3D1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isDelivered ? '0 0 0 3px #DCFCE7' : 'none',
                  }}
                >
                  {isDelivered ? (
                    <Check size={10} color="#FFFFFF" strokeWidth={3} />
                  ) : (
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FFFFFF' }} />
                  )}
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: isDelivered ? '#16A34A' : '#1C1917' }}>
                  {isDelivered ? 'Delivered to Doorstep ✓' : 'Expected Handover'}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#78716C' }}>
                  {isDelivered
                    ? `Successfully received on ${formatPlacedDate(order.deliveredAt || order.createdAt)}`
                    : 'Safe signature delivery at customer address'}
                </div>
              </div>
            </div>
          </div>

          {/* Destination */}
          <div
            style={{
              borderTop: '1px solid #ECE7DD',
              paddingTop: '1rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              fontSize: '0.85rem',
              color: '#57534E',
            }}
          >
            <MapPin size={18} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 700, color: '#1C1917' }}>
                Delivering to: {order.shippingAddress?.fullName || order.customerName}
              </div>
              <div style={{ color: '#78716C' }}>
                {order.shippingAddress?.addressLine1}
                {order.shippingAddress?.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}
                {order.shippingAddress?.landmark ? ` (Near ${order.shippingAddress.landmark})` : ''}, {order.shippingAddress?.city},{' '}
                {order.shippingAddress?.state} {order.shippingAddress?.pincode}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '1rem 1.75rem',
            backgroundColor: '#FAF7F2',
            borderTop: '1px solid #EAE3D5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <Link
            to={`/track-order?q=${encodeURIComponent(order.orderNumber)}`}
            style={{
              fontSize: '0.84rem',
              color: '#D97706',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            Full Tracking Page <ExternalLink size={13} />
          </Link>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Link
              to={`/orders/${order.id}`}
              style={{
                backgroundColor: '#FFFFFF',
                color: '#542A0C',
                border: '1px solid #D6D3D1',
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '0.82rem',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              View Invoice
            </Link>
            {isDelivered && (
              <button
                type="button"
                onClick={() => {
                  onBuyAgain(order);
                  onClose();
                }}
                style={{
                  backgroundColor: '#542A0C',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '8px 18px',
                  borderRadius: '10px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Buy Again
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface OrderCardProps {
  order: Order;
  index: number;
  onOpenTrack: (order: Order) => void;
  onBuyAgain: (order: Order) => void;
}

const OrderCard: React.FC<OrderCardProps> = React.memo(({ order, onOpenTrack, onBuyAgain }) => {
  const [copied, setCopied] = useState(false);
  const items = order.items || [];
  const firstItem = items[0] || {
    productName: 'Raw Forest Honey',
    size: '500g',
    price: order.total || 899,
    quantity: 1,
    image: '/images/products/sunflower_honey.jpg',
  };

  const handleCopyOrderNumber = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!order.orderNumber) return;
    navigator.clipboard.writeText(order.orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Status-specific themes & labels matching the screenshot
  const isProcessing = order.orderStatus === 'processing' || order.orderStatus === 'pending';
  const isShipped = order.orderStatus === 'shipped';
  const isDelivered = order.orderStatus === 'delivered';
  const isCancelled = order.orderStatus === 'cancelled';

  // Fallback image helper
  const getProductImage = (name: string, currentImg?: string) => {
    const n = (name || '').toLowerCase();
    if (n.includes('sunflower')) return '/images/products/sunflower_honey.jpg';
    if (n.includes('ajwain')) return '/images/products/ajwain_honey.jpg';
    if (n.includes('honeycomb') || n.includes('frame')) return '/images/products/honeycomb_frame.jpg';
    return currentImg || '/images/brand/madhuvan_honey_jar.jpg';
  };

  const itemImg = getProductImage(firstItem.productName, firstItem.image);

  return (
    <div
      className="order-card-honey"
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '22px',
        padding: '1.5rem 1.75rem',
        border: '1px solid #ECE7DD',
        boxShadow: '0 4px 18px rgba(74, 31, 10, 0.03)',
        transition: 'all 0.25s ease',
        position: 'relative',
      }}
    >
      {/* Top Header Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          borderBottom: '1px solid #F5EFE6',
          paddingBottom: '1rem',
          marginBottom: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 800, fontSize: '1.08rem', color: '#1C1917' }}>
            Order #{order.orderNumber}
          </span>
          <span style={{ color: '#D6D3D1', fontWeight: 300 }}>|</span>
          <span style={{ fontSize: '0.86rem', color: '#78716C', fontWeight: 500 }}>
            Placed {formatPlacedDate(order.createdAt)}
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
              padding: '2px 7px',
              cursor: 'pointer',
              fontSize: '0.72rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              marginLeft: '4px',
            }}
          >
            {copied ? <Check size={11} /> : <Copy size={11} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Status Badge Pill */}
        <div>
          {isProcessing && (
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                padding: '4px 16px',
                borderRadius: '9999px',
                backgroundColor: '#FEF3C7',
                color: '#D97706',
                border: '1px solid #FDE68A',
                display: 'inline-block',
                letterSpacing: '0.01em',
              }}
            >
              Processing
            </span>
          )}
          {isShipped && (
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                padding: '4px 16px',
                borderRadius: '9999px',
                backgroundColor: '#DBEAFE',
                color: '#2563EB',
                border: '1px solid #BFDBFE',
                display: 'inline-block',
                letterSpacing: '0.01em',
              }}
            >
              Shipped
            </span>
          )}
          {isDelivered && (
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                padding: '4px 16px',
                borderRadius: '9999px',
                backgroundColor: '#DCFCE7',
                color: '#16A34A',
                border: '1px solid #BBF7D0',
                display: 'inline-block',
                letterSpacing: '0.01em',
              }}
            >
              Delivered
            </span>
          )}
          {isCancelled && (
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                padding: '4px 16px',
                borderRadius: '9999px',
                backgroundColor: '#FEE2E2',
                color: '#DC2626',
                border: '1px solid #FECACA',
                display: 'inline-block',
                letterSpacing: '0.01em',
              }}
            >
              Cancelled
            </span>
          )}
        </div>
      </div>

      {/* Main Card Content Grid */}
      <div
        className="order-card-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(200px, 1.2fr) minmax(280px, 2fr) minmax(130px, 0.9fr)',
          alignItems: 'center',
          gap: '1.25rem',
        }}
      >
        {/* Column 1: Product Item Preview */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img
            src={itemImg}
            alt={firstItem.productName}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/images/brand/madhuvan_honey_jar.jpg';
            }}
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '14px',
              objectFit: 'cover',
              border: '1px solid #F1EAE0',
              flexShrink: 0,
              backgroundColor: '#FAF7F2',
            }}
          />
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1C1917', lineHeight: 1.25 }}>
              {firstItem.productName}
            </div>
            <div style={{ fontSize: '0.84rem', color: '#78716C', marginTop: '2px', fontWeight: 500 }}>
              {firstItem.quantity || 1} × {firstItem.size || '500g'}
            </div>
            <div style={{ fontWeight: 800, fontSize: '1.08rem', color: '#1C1917', marginTop: '3px' }}>
              ₹{Number(firstItem.price || order.total).toLocaleString('en-IN')}
            </div>
            {items.length > 1 && (
              <span style={{ fontSize: '0.72rem', color: '#D97706', fontWeight: 700 }}>
                +{items.length - 1} more item{items.length > 2 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Column 2: Stepper Tracking Timeline */}
        <div style={{ padding: '0 0.5rem' }}>
          {isProcessing && (
            /* Card 1: Processing Stepper (Amber theme) */
            <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              {/* Step 1: Order Placed */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, zIndex: 2 }}>
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#D97706',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    boxShadow: '0 2px 6px rgba(217, 119, 6, 0.3)',
                  }}
                >
                  <Check size={13} strokeWidth={3} />
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1C1917', marginTop: '6px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                  Order Placed
                </div>
                <div style={{ fontSize: '0.68rem', color: '#78716C', fontWeight: 500, textAlign: 'center' }}>
                  {formatShortDate(order.createdAt) || '7 Oct'}
                </div>
              </div>

              {/* Line 1 -> 2 (Active Amber) */}
              <div style={{ flex: 1, height: '3px', backgroundColor: '#D97706', margin: '-16px -8px 0 -8px', zIndex: 1 }} />

              {/* Step 2: Processing (Active Amber) */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, zIndex: 2 }}>
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#FEF3C7',
                    border: '2px solid #D97706',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#D97706',
                  }}
                >
                  <Clock size={12} strokeWidth={2.5} style={{ animation: 'pulse 2s infinite' }} />
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#D97706', marginTop: '6px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                  Processing
                </div>
                <div style={{ fontSize: '0.68rem', color: '#78716C', fontWeight: 500, textAlign: 'center' }}>
                  {formatShortDate(order.createdAt, 1) || '8 Oct'}
                </div>
              </div>

              {/* Line 2 -> 3 (Inactive Grey) */}
              <div style={{ flex: 1, height: '2px', backgroundColor: '#E7E5E4', margin: '-16px -8px 0 -8px', zIndex: 1 }} />

              {/* Step 3: Shipped (Inactive Grey) */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, zIndex: 2 }}>
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor: '#F5F5F4',
                    border: '1.5px solid #D6D3D1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#A8A29E',
                  }}
                >
                  <Truck size={11} />
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#A8A29E', marginTop: '6px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                  Shipped
                </div>
                <div style={{ fontSize: '0.68rem', color: 'transparent', height: '14px' }}>-</div>
              </div>

              {/* Line 3 -> 4 (Inactive Grey) */}
              <div style={{ flex: 1, height: '2px', backgroundColor: '#E7E5E4', margin: '-16px -8px 0 -8px', zIndex: 1 }} />

              {/* Step 4: Delivered (Inactive Grey) */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, zIndex: 2 }}>
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor: '#F5F5F4',
                    border: '1.5px solid #D6D3D1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#A8A29E',
                  }}
                >
                  <Package size={11} />
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#A8A29E', marginTop: '6px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                  Delivered
                </div>
                <div style={{ fontSize: '0.68rem', color: 'transparent', height: '14px' }}>-</div>
              </div>
            </div>
          )}

          {isShipped && (
            /* Card 2: Shipped Stepper (Blue theme matching screenshot) */
            <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              {/* Step 1: Order Placed */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, zIndex: 2 }}>
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#2563EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)',
                  }}
                >
                  <Check size={13} strokeWidth={3} />
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1C1917', marginTop: '6px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                  Order Placed
                </div>
                <div style={{ fontSize: '0.68rem', color: '#78716C', fontWeight: 500, textAlign: 'center' }}>
                  {formatShortDate(order.createdAt) || '5 Oct'}
                </div>
              </div>

              {/* Line 1 -> 2 (Active Blue) */}
              <div style={{ flex: 1, height: '3px', backgroundColor: '#2563EB', margin: '-16px -8px 0 -8px', zIndex: 1 }} />

              {/* Step 2: Shipped (Active Blue) */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, zIndex: 2 }}>
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#2563EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)',
                  }}
                >
                  <Truck size={12} color="#FFFFFF" />
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#2563EB', marginTop: '6px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                  Shipped
                </div>
                <div style={{ fontSize: '0.68rem', color: '#78716C', fontWeight: 500, textAlign: 'center' }}>
                  {formatShortDate(order.createdAt, 1) || '6 Oct'}
                </div>
              </div>

              {/* Line 2 -> 3 (Inactive Grey) */}
              <div style={{ flex: 1, height: '2px', backgroundColor: '#E7E5E4', margin: '-16px -8px 0 -8px', zIndex: 1 }} />

              {/* Step 3: Out for Delivery */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, zIndex: 2 }}>
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor: '#F5F5F4',
                    border: '1.5px solid #D6D3D1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#A8A29E',
                  }}
                >
                  <Package size={11} />
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#A8A29E', marginTop: '6px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                  Out for Delivery
                </div>
                <div style={{ fontSize: '0.68rem', color: 'transparent', height: '14px' }}>-</div>
              </div>

              {/* Line 3 -> 4 (Inactive Grey) */}
              <div style={{ flex: 1, height: '2px', backgroundColor: '#E7E5E4', margin: '-16px -8px 0 -8px', zIndex: 1 }} />

              {/* Step 4: Delivered */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, zIndex: 2 }}>
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor: '#F5F5F4',
                    border: '1.5px solid #D6D3D1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#A8A29E',
                  }}
                >
                  <Check size={11} />
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#A8A29E', marginTop: '6px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                  Delivered
                </div>
                <div style={{ fontSize: '0.68rem', color: 'transparent', height: '14px' }}>-</div>
              </div>
            </div>
          )}

          {isDelivered && (
            /* Card 3: Delivered Stepper (All Completed Green theme matching screenshot) */
            <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              {/* Step 1 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, zIndex: 2 }}>
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#16A34A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    boxShadow: '0 2px 6px rgba(22, 163, 74, 0.3)',
                  }}
                >
                  <Check size={13} strokeWidth={3} />
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1C1917', marginTop: '6px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                  Order Placed
                </div>
                <div style={{ fontSize: '0.68rem', color: '#78716C', fontWeight: 500, textAlign: 'center' }}>
                  {formatShortDate(order.createdAt) || '3 Oct'}
                </div>
              </div>

              {/* Line 1 -> 2 (Green) */}
              <div style={{ flex: 1, height: '3px', backgroundColor: '#16A34A', margin: '-16px -8px 0 -8px', zIndex: 1 }} />

              {/* Step 2 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, zIndex: 2 }}>
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#16A34A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    boxShadow: '0 2px 6px rgba(22, 163, 74, 0.3)',
                  }}
                >
                  <Check size={13} strokeWidth={3} />
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1C1917', marginTop: '6px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                  Processing
                </div>
                <div style={{ fontSize: '0.68rem', color: '#78716C', fontWeight: 500, textAlign: 'center' }}>
                  {formatShortDate(order.createdAt, 1) || '4 Oct'}
                </div>
              </div>

              {/* Line 2 -> 3 (Green) */}
              <div style={{ flex: 1, height: '3px', backgroundColor: '#16A34A', margin: '-16px -8px 0 -8px', zIndex: 1 }} />

              {/* Step 3 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, zIndex: 2 }}>
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#16A34A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    boxShadow: '0 2px 6px rgba(22, 163, 74, 0.3)',
                  }}
                >
                  <Check size={13} strokeWidth={3} />
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1C1917', marginTop: '6px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                  Shipped
                </div>
                <div style={{ fontSize: '0.68rem', color: '#78716C', fontWeight: 500, textAlign: 'center' }}>
                  {formatShortDate(order.createdAt, 2) || '5 Oct'}
                </div>
              </div>

              {/* Line 3 -> 4 (Green) */}
              <div style={{ flex: 1, height: '3px', backgroundColor: '#16A34A', margin: '-16px -8px 0 -8px', zIndex: 1 }} />

              {/* Step 4 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, zIndex: 2 }}>
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#16A34A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    boxShadow: '0 2px 6px rgba(22, 163, 74, 0.3)',
                  }}
                >
                  <Check size={13} strokeWidth={3} />
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#16A34A', marginTop: '6px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                  Delivered
                </div>
                <div style={{ fontSize: '0.68rem', color: '#78716C', fontWeight: 500, textAlign: 'center' }}>
                  {formatShortDate(order.deliveredAt || order.createdAt, 3) || '6 Oct'}
                </div>
              </div>
            </div>
          )}

          {isCancelled && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#DC2626', fontSize: '0.85rem' }}>
              <XCircle size={18} />
              <span>Consignment cancelled or payment disputed. Contact support for refund assistance.</span>
            </div>
          )}
        </div>

        {/* Column 3: Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
          {isDelivered ? (
            <button
              type="button"
              onClick={() => onBuyAgain(order)}
              style={{
                backgroundColor: '#542A0C',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                padding: '9px 24px',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 3px 10px rgba(84, 42, 12, 0.25)',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#3E1C07';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#542A0C';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Buy Again
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onOpenTrack(order)}
              style={{
                backgroundColor: '#542A0C',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                padding: '9px 22px',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 3px 10px rgba(84, 42, 12, 0.25)',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#3E1C07';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#542A0C';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Track Order
            </button>
          )}

          {isDelivered ? (
            <Link
              to={`/orders/${order.id}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                color: '#6B3710',
                fontWeight: 700,
                fontSize: '0.82rem',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
            >
              <span>View Invoice</span>
              <ArrowRight size={13} />
            </Link>
          ) : (
            <Link
              to={`/orders/${order.id}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                color: '#6B3710',
                fontWeight: 700,
                fontSize: '0.82rem',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
            >
              <span>View Details</span>
              <ArrowRight size={13} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
});

export const Orders: React.FC = () => {
  const {
    orders,
    isOrdersLoading,
    refreshOrders,
    isAuthenticated,
    addToCart,
    products,
    setCartDrawerOpen,
    showToast,
  } = useStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [guestLookupQuery, setGuestLookupQuery] = useState('');
  const [isSearchingBackend, setIsSearchingBackend] = useState(false);
  const [searchedBackendOrder, setSearchedBackendOrder] = useState<Order | null>(null);

  // Sync with live backend every 20s if authenticated or on initial mount
  useEffect(() => {
    if (isAuthenticated) {
      refreshOrders();
      const interval = setInterval(() => {
        refreshOrders();
      }, 20000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, refreshOrders]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshOrders();
      showToast('Synced fresh order updates from apiaries', 'success');
    } catch {
      showToast('Connected to local offline cache', 'info');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Buy Again handler
  const handleBuyAgain = (order: Order) => {
    const item = order.items?.[0];
    if (!item) return;

    // Match with existing product or create cart item
    const matched = products.find(
      (p) =>
        p.id === item.productId ||
        p.name.toLowerCase().includes(item.productName.toLowerCase()) ||
        item.productName.toLowerCase().includes(p.name.toLowerCase())
    );

    if (matched) {
      addToCart(matched, item.size || '500g', 1);
    } else if (products.length > 0) {
      // Fallback: add first product
      addToCart(products[0], item.size || '500g', 1);
    }

    // Trigger sweet honey celebration confetti!
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#F59E0B', '#D97706', '#FEF3C7', '#B45309'],
    });

    setCartDrawerOpen(true);
    showToast(`Added ${item.productName} to your Honey Basket! 🍯`, 'success');
  };

  // Live filter orders
  const filteredOrders = useMemo(() => {
    let list = [...orders];

    // If an online order was found via search, prepend it
    if (searchedBackendOrder && !list.some((o) => o.orderNumber === searchedBackendOrder.orderNumber)) {
      list = [searchedBackendOrder, ...list];
    }

    return list.filter((order) => {
      // Status filter
      if (statusFilter !== 'all') {
        if (statusFilter === 'processing' && order.orderStatus !== 'processing' && order.orderStatus !== 'pending') {
          return false;
        }
        if (statusFilter === 'shipped' && order.orderStatus !== 'shipped') {
          return false;
        }
        if (statusFilter === 'delivered' && order.orderStatus !== 'delivered') {
          return false;
        }
        if (statusFilter === 'cancelled' && order.orderStatus !== 'cancelled') {
          return false;
        }
      }

      // Search query
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesNumber = (order.orderNumber || '').toLowerCase().includes(q);
        const matchesTracking = (order.trackingNumber || '').toLowerCase().includes(q);
        const matchesCustomer = (order.customerName || '').toLowerCase().includes(q);
        const matchesItems = (order.items || []).some((item) =>
          (item.productName || '').toLowerCase().includes(q)
        );
        return matchesNumber || matchesTracking || matchesCustomer || matchesItems;
      }

      return true;
    });
  }, [orders, statusFilter, search, searchedBackendOrder]);

  // Handle direct backend lookup if search doesn't find in local list
  const handleBackendSearch = async () => {
    if (!search.trim()) return;
    setIsSearchingBackend(true);
    try {
      const found = await orderApi.track(search.trim());
      if (found) {
        setSearchedBackendOrder(found);
        showToast(`Located consignment ${found.orderNumber} in database!`, 'success');
      } else {
        showToast(`No consignment found matching "${search.trim()}"`, 'info');
      }
    } catch {
      showToast(`No consignment found matching "${search.trim()}"`, 'info');
    } finally {
      setIsSearchingBackend(false);
    }
  };

  const statusLabelMap: Record<string, string> = {
    all: 'All Orders',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };

  return (
    <div
      style={{
        minHeight: '85vh',
        backgroundColor: '#FAF7F2',
        backgroundImage:
          'radial-gradient(circle at 10% 25%, rgba(254, 243, 199, 0.5) 0%, rgba(250, 247, 242, 1) 45%, #FAF7F2 100%)',
        padding: '3rem 0 6rem 0',
      }}
    >
      <div className="container" style={{ maxWidth: '1240px', padding: '0 1.5rem' }}>
        {/* Main 2-Column Responsive Layout */}
        <div
          className="my-orders-two-column-layout"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(280px, 360px) 1fr',
            gap: '2.75rem',
            alignItems: 'flex-start',
          }}
        >
          {/* ================= LEFT COLUMN: HERO ART & TIMELINE ================= */}
          <div
            className="my-orders-left-hero"
            style={{
              position: 'sticky',
              top: '90px',
              display: 'flex',
              flexDirection: 'column',
              positionAnchor: 'unset',
            }}
          >
            {/* Catchy Serif Title & Subtitle */}
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.1rem, 2.7vw, 2.6rem)',
                fontWeight: 800,
                color: '#1C1917',
                lineHeight: 1.12,
                letterSpacing: '-0.025em',
                margin: 0,
              }}
            >
              From our forest
              <br />
              to your home
            </h2>

            <p
              style={{
                color: '#57534E',
                fontSize: '1.05rem',
                marginTop: '0.6rem',
                marginBottom: '1.5rem',
                fontWeight: 500,
              }}
            >
              Track your honey journey here.
            </p>

            {/* Flying Bumblebee Asset with Flutter Animation */}
            <div
              style={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'flex-end',
                paddingRight: '2rem',
                marginBottom: '-1.5rem',
                zIndex: 10,
              }}
            >
              <div
                className="floating-bee"
                style={{
                  width: '64px',
                  height: '64px',
                  filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.12))',
                }}
              >
                <img
                  src="/images/brand/flying_bee.jpg"
                  alt="Wild honeybee pollinating"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/icons/bee.svg';
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    transform: 'rotate(-10deg)',
                  }}
                />
              </div>
            </div>

            {/* Honey Jar Showcase Image */}
            <div
              style={{
                position: 'relative',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 20px 45px rgba(84, 42, 12, 0.14)',
                border: '1px solid rgba(217, 119, 6, 0.2)',
                backgroundColor: '#FFFFFF',
              }}
            >
              <img
                src="/images/brand/madhuvan_jute_jar.jpg"
                alt="Madhuvan Raw Honey jar with wooden dipper"
                style={{
                  width: '100%',
                  aspectRatio: '1 / 1',
                  objectFit: 'cover',
                  display: 'block',
                  transition: 'transform 0.4s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '1rem 1.25rem',
                  background: 'linear-gradient(to top, rgba(28, 25, 23, 0.8) 0%, transparent 100%)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, letterSpacing: '0.02em' }}>
                    Madhuvan 100% Raw Honey
                  </div>
                </div>
                <Sparkles size={18} color="#F59E0B" />
              </div>
            </div>

            {/* Honey Guarantee Badges */}
            <div
              style={{
                marginTop: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #ECE7DD',
                fontSize: '0.8rem',
                color: '#78716C',
                fontWeight: 600,
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <ShieldCheck size={16} color="#059669" /> Zero Sugar Syrup
              </span>
              <span>•</span>
              <span>Wild Hive Sourced</span>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: ORDERS SECTION ================= */}
          <div className="my-orders-right-content" style={{ minWidth: 0, position: 'relative' }}>
            {/* Header: Title & Subtitle */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '1.5rem',
              }}
            >
              <div>
                <h1
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(2.1rem, 3.2vw, 2.65rem)',
                    fontWeight: 800,
                    color: '#1C1917',
                    lineHeight: 1.15,
                    margin: 0,
                    letterSpacing: '-0.02em',
                  }}
                >
                  My Orders
                </h1>
                <p style={{ color: '#78716C', fontSize: '0.96rem', marginTop: '0.35rem', fontWeight: 400 }}>
                  Stay updated on your honey orders and deliveries.
                </p>
              </div>

              {/* Silent Sync / Refresh button */}
              <button
                type="button"
                onClick={handleManualRefresh}
                disabled={isRefreshing || isOrdersLoading}
                title="Sync with live database"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#FFFFFF',
                  color: '#542A0C',
                  border: '1px solid #ECE7DD',
                  borderRadius: '10px',
                  padding: '7px 14px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: isRefreshing || isOrdersLoading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.02)',
                  transition: 'all 0.2s',
                }}
              >
                <RefreshCw
                  size={13}
                  style={{
                    animation: isRefreshing || isOrdersLoading ? 'spin 1s linear infinite' : 'none',
                  }}
                />
                <span>{isRefreshing ? 'Syncing...' : 'Sync Live'}</span>
              </button>
            </div>

            {/* Search Bar & Dropdown Filter Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '1.75rem',
                flexWrap: 'wrap',
              }}
            >
              {/* Search input with rounded pill styling */}
              <div
                style={{
                  flex: '1 1 320px',
                  position: 'relative',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '9999px',
                  border: '1px solid #ECE7DD',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 1rem',
                  height: '46px',
                }}
              >
                <Search size={17} color="#A8A29E" style={{ flexShrink: 0, marginRight: '8px' }} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search orders, products..."
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '0.9rem',
                    color: '#1C1917',
                    background: 'transparent',
                  }}
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch('');
                      setSearchedBackendOrder(null);
                    }}
                    style={{
                      border: 'none',
                      background: 'none',
                      color: '#A8A29E',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                    }}
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* All Orders Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #ECE7DD',
                    borderRadius: '9999px',
                    padding: '0 1.25rem',
                    height: '46px',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: '#1C1917',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span>{statusLabelMap[statusFilter] || 'All Orders'}</span>
                  <ChevronDown size={15} color="#78716C" />
                </button>

                {dropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '52px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1px solid #ECE7DD',
                      boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
                      padding: '6px',
                      zIndex: 50,
                      minWidth: '170px',
                      animation: 'fadeInScale 0.15s ease-out',
                    }}
                  >
                    {['all', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => {
                          setStatusFilter(st);
                          setDropdownOpen(false);
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '9px 14px',
                          borderRadius: '10px',
                          border: 'none',
                          backgroundColor: statusFilter === st ? '#FEF3C7' : 'transparent',
                          color: statusFilter === st ? '#92400E' : '#1C1917',
                          fontSize: '0.86rem',
                          fontWeight: statusFilter === st ? 700 : 500,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span>{statusLabelMap[st]}</span>
                        {statusFilter === st && <Check size={14} color="#D97706" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Orders List Container with Vertical Progress Guideline */}
            <div style={{ position: 'relative' }}>
              {/* Subtle Vertical Progress Connector Line connecting the orders matching the screenshot */}
              <div
                className="journey-vertical-line"
                style={{
                  position: 'absolute',
                  left: '-22px',
                  top: '36px',
                  bottom: '36px',
                  width: '3px',
                  background: 'linear-gradient(180deg, #D97706 0%, #2563EB 50%, #16A34A 100%)',
                  borderRadius: '3px',
                  opacity: 0.85,
                }}
              />

              {/* Order Cards Stack */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {filteredOrders.length === 0 ? (
                  /* Empty state */
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '22px',
                      padding: '3.5rem 2rem',
                      textAlign: 'center',
                      border: '1px solid #ECE7DD',
                      boxShadow: '0 4px 18px rgba(0,0,0,0.02)',
                    }}
                  >
                    <Package size={44} color="#D97706" style={{ margin: '0 auto 1rem auto' }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1C1917', marginBottom: '0.4rem' }}>
                      No orders found
                    </h3>
                    <p style={{ color: '#78716C', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
                      {search
                        ? `We could not locate any order matching "${search}". You can query the live backend consignment database directly.`
                        : 'Explore our pure honey harvest and place your first consignment order.'}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      {search ? (
                        <>
                          <button
                            type="button"
                            onClick={handleBackendSearch}
                            disabled={isSearchingBackend}
                            style={{
                              backgroundColor: '#542A0C',
                              color: '#FFFFFF',
                              border: 'none',
                              padding: '9px 18px',
                              borderRadius: '10px',
                              fontWeight: 700,
                              fontSize: '0.84rem',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            <Search size={14} />
                            <span>{isSearchingBackend ? 'Searching Database...' : 'Search Backend Database'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSearch('');
                              setStatusFilter('all');
                              setSearchedBackendOrder(null);
                            }}
                            style={{
                              backgroundColor: '#FAF7F2',
                              color: '#78716C',
                              border: '1px solid #ECE7DD',
                              padding: '9px 16px',
                              borderRadius: '10px',
                              fontWeight: 600,
                              fontSize: '0.84rem',
                              cursor: 'pointer',
                            }}
                          >
                            Reset Filter
                          </button>
                        </>
                      ) : (
                        <Link
                          to="/shop"
                          style={{
                            backgroundColor: '#542A0C',
                            color: '#FFFFFF',
                            textDecoration: 'none',
                            padding: '10px 22px',
                            borderRadius: '10px',
                            fontWeight: 700,
                            fontSize: '0.88rem',
                          }}
                        >
                          Explore Honey Shop
                        </Link>
                      )}
                    </div>
                  </div>
                ) : (
                  filteredOrders.map((ord, idx) => (
                    <div key={ord.id || ord.orderNumber} style={{ position: 'relative' }}>
                      {/* Colored Journey Dot on the vertical guideline */}
                      <div
                        className="journey-node-dot"
                        style={{
                          position: 'absolute',
                          left: '-28px',
                          top: '32px',
                          width: '15px',
                          height: '15px',
                          borderRadius: '50%',
                          backgroundColor:
                            ord.orderStatus === 'processing'
                              ? '#D97706'
                              : ord.orderStatus === 'shipped'
                              ? '#2563EB'
                              : '#16A34A',
                          border: '3px solid #FAF7F2',
                          boxShadow:
                            ord.orderStatus === 'processing'
                              ? '0 0 0 2px #FEF3C7, 0 2px 6px rgba(217, 119, 6, 0.4)'
                              : ord.orderStatus === 'shipped'
                              ? '0 0 0 2px #DBEAFE, 0 2px 6px rgba(37, 99, 235, 0.4)'
                              : '0 0 0 2px #DCFCE7, 0 2px 6px rgba(22, 163, 74, 0.4)',
                          zIndex: 5,
                        }}
                      />

                      <OrderCard
                        order={ord}
                        index={idx}
                        onOpenTrack={(o) => setActiveTrackingOrder(o)}
                        onBuyAgain={handleBuyAgain}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Consignment Tracking Drawer / Modal */}
      <TrackingModal
        order={activeTrackingOrder}
        onClose={() => setActiveTrackingOrder(null)}
        onBuyAgain={handleBuyAgain}
      />

      {/* Scoped CSS animations & responsive rules */}
      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.8; }
        }
        @keyframes beeHover {
          0%, 100% {
            transform: translate(0, 0) rotate(-6deg);
          }
          33% {
            transform: translate(6px, -8px) rotate(-2deg);
          }
          66% {
            transform: translate(-4px, -12px) rotate(-9deg);
          }
        }
        .floating-bee {
          animation: beeHover 4.5s ease-in-out infinite;
        }
        .order-card-honey:hover {
          border-color: #DFD5C6 !important;
          box-shadow: 0 10px 28px rgba(74, 31, 10, 0.07) !important;
          transform: translateY(-2px);
        }
        @media (max-width: 992px) {
          .my-orders-two-column-layout {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .my-orders-left-hero {
            position: relative !important;
            top: 0 !important;
            max-width: 480px;
            margin: 0 auto;
          }
          .journey-vertical-line, .journey-node-dot {
            display: none !important;
          }
        }
        @media (max-width: 768px) {
          .order-card-grid {
            grid-template-columns: 1fr !important;
            gap: 1.25rem !important;
          }
          .order-card-honey {
            padding: 1.25rem 1rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Orders;
