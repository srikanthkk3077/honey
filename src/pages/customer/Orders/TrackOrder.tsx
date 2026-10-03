import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useStore } from '../../../store/store';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import {
  Search,
  CheckCircle2,
  Package,
  Truck,
  Home,
  Clock,
  XCircle,
  Copy,
  Check,
  ExternalLink,
  MapPin,
  MessageCircle,
  Calendar,
  AlertCircle,
  ShieldCheck,
  Loader,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { formatPrice } from '../../../utils/formatPrice';
import { Order, OrderStatus } from '../../../types/order.types';
import orderApi from '../../../services/orderApi';
import { CONTACT_INFO } from '../../../utils/constants';
import { generateGoogleMapsLink } from '../../../utils/delivery';
import { WhatsAppIcon } from '../../../components/common/WhatsAppIcon';

export const TrackOrder: React.FC = () => {
  const { orders } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [matchedOrder, setMatchedOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [copiedTracking, setCopiedTracking] = useState(false);

  const doSearch = async (q: string) => {
    const cleanQuery = q.trim();
    if (!cleanQuery) return;
    setIsSearching(true);
    setSearched(true);
    try {
      const found = await orderApi.track(cleanQuery);
      setMatchedOrder(found);
    } catch {
      // Fallback: search local store orders
      const clean = cleanQuery.toLowerCase();
      const found = orders.find(
        (o) =>
          o.orderNumber.toLowerCase() === clean ||
          o.trackingNumber?.toLowerCase() === clean ||
          o.customerPhone.includes(clean)
      );
      setMatchedOrder(found || null);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      doSearch(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
      doSearch(query.trim());
    }
  };

  const handleCopyTracking = (code: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2200);
  };

  // Human friendly date & time formatting
  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return null;
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return null;
    }
  };

  // Estimated delivery or actual delivered date
  const getDeliveryDateInfo = (order: Order) => {
    if (order.deliveredAt) {
      try {
        const d = new Date(order.deliveredAt);
        if (!isNaN(d.getTime())) {
          return {
            label: 'Delivered On',
            date: d.toLocaleDateString('en-IN', {
              weekday: 'short',
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }),
            isDelivered: true,
          };
        }
      } catch {
        // Fallback
      }
    }

    // Estimate based on creation date + 3 to 4 days
    const baseDate = order.createdAt ? new Date(order.createdAt) : new Date();
    const estDate = new Date(baseDate.getTime() + 3 * 24 * 60 * 60 * 1000);
    return {
      label: 'Estimated Delivery',
      date: estDate.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      isDelivered: false,
    };
  };

  // Helper to determine status progress and colors
  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return {
          label: 'Delivered to Doorstep',
          badgeText: 'Delivered',
          headline: 'Package Delivered Successfully 🎉',
          subtext: 'Your 100% raw forest honey has arrived. We hope you cherish its pure nature.',
          progressPercentage: 100,
          themeColor: '#059669',
          themeBg: '#ECFDF5',
          themeBorder: '#A7F3D0',
          badgeBg: '#D1FAE5',
          badgeColor: '#065F46',
          icon: <CheckCircle2 size={24} color="#059669" />,
        };
      case 'shipped':
        return {
          label: 'In Transit with Courier',
          badgeText: 'On The Way',
          headline: 'Your Honey Is On The Move 🚚',
          subtext: 'Consignment is in transit with our express delivery partner and will reach you soon.',
          progressPercentage: 75,
          themeColor: '#D97706',
          themeBg: '#FFFBEB',
          themeBorder: '#FDE68A',
          badgeBg: '#FEF3C7',
          badgeColor: '#92400E',
          icon: <Truck size={24} color="#D97706" />,
        };
      case 'processing':
        return {
          label: 'Preparing & Packing',
          badgeText: 'Packing in Progress',
          headline: 'Packing & Quality Seal 📦',
          subtext: 'Our apiary experts are carefully boxing your jars with eco-thermal cushioning.',
          progressPercentage: 50,
          themeColor: '#F59E0B',
          themeBg: '#FFFBEB',
          themeBorder: '#FDE68A',
          badgeBg: '#FEF3C7',
          badgeColor: '#B45309',
          icon: <Package size={24} color="#D97706" />,
        };
      case 'cancelled':
        return {
          label: 'Order Cancelled',
          badgeText: 'Cancelled',
          headline: 'This Consignment Was Cancelled',
          subtext: 'This order has been cancelled. Any pre-payments will be processed to the original source.',
          progressPercentage: 0,
          themeColor: '#DC2626',
          themeBg: '#FEF2F2',
          themeBorder: '#FECACA',
          badgeBg: '#FEE2E2',
          badgeColor: '#991B1B',
          icon: <XCircle size={24} color="#DC2626" />,
        };
      case 'pending':
      default:
        return {
          label: 'Order Confirmed',
          badgeText: 'Order Received',
          headline: 'Order Confirmed & Queued ⏳',
          subtext: 'We have received your order. We are validating payment and assigning honey batches.',
          progressPercentage: 25,
          themeColor: '#2563EB',
          themeBg: '#EFF6FF',
          themeBorder: '#BFDBFE',
          badgeBg: '#DBEAFE',
          badgeColor: '#1E40AF',
          icon: <Clock size={24} color="#2563EB" />,
        };
    }
  };

  // Compute the 4 sequential milestones with clear states: 'completed' | 'current' | 'upcoming'
  const getTrackingSteps = (order: Order) => {
    const status = order.orderStatus;
    const destCity = order.shippingAddress?.city || 'Your City';
    const carrierName = 'Delhivery Express';
    const trackingCode = order.trackingNumber || 'MDH-TRK-' + (order.orderNumber.replace(/\D/g, '') || '11200');

    // Step 1: Placed
    // Step 2: Packed
    // Step 3: In Transit
    // Step 4: Delivered
    let s1State: 'completed' | 'current' | 'upcoming' = 'completed';
    let s2State: 'completed' | 'current' | 'upcoming' = 'upcoming';
    let s3State: 'completed' | 'current' | 'upcoming' = 'upcoming';
    let s4State: 'completed' | 'current' | 'upcoming' = 'upcoming';

    if (status === 'pending') {
      s1State = 'current';
      s2State = 'upcoming';
      s3State = 'upcoming';
      s4State = 'upcoming';
    } else if (status === 'processing') {
      s1State = 'completed';
      s2State = 'current';
      s3State = 'upcoming';
      s4State = 'upcoming';
    } else if (status === 'shipped') {
      s1State = 'completed';
      s2State = 'completed';
      s3State = 'current';
      s4State = 'upcoming';
    } else if (status === 'delivered') {
      s1State = 'completed';
      s2State = 'completed';
      s3State = 'completed';
      s4State = 'completed';
    }

    return [
      {
        stepNumber: 1,
        title: 'Order Confirmed & Placed',
        state: s1State,
        icon: <CheckCircle2 size={18} />,
        description: 'Order registered in our system and verified for pure forest harvest.',
        timestamp: formatDateTime(order.createdAt) || 'Order Placed',
        hint: s1State === 'current' ? 'Verifying payment & assigning apiary harvest batch' : undefined,
      },
      {
        stepNumber: 2,
        title: 'Packed with Eco-Thermal Protection',
        state: s2State,
        icon: <Package size={18} />,
        description: 'Sealed with tamper-evident beeswax label and eco-friendly shock absorbing cushion.',
        timestamp:
          s2State === 'completed' || s2State === 'current'
            ? 'Apiary Packaging Facility'
            : 'Estimated within 12 hours of order',
        hint: s2State === 'current' ? 'Currently being packed and weighed for courier dispatch' : undefined,
      },
      {
        stepNumber: 3,
        title: 'In Transit with Express Courier',
        state: s3State,
        icon: <Truck size={18} />,
        description: `Handed over to ${carrierName}. Moving towards ${destCity}.`,
        trackingNumber: trackingCode,
        timestamp:
          s3State === 'completed' || s3State === 'current'
            ? `Dispatched via ${carrierName}`
            : 'Pending courier pickup',
        hint: s3State === 'current' ? `En route to delivery hub in ${destCity}` : undefined,
      },
      {
        stepNumber: 4,
        title: 'Delivered to Doorstep',
        state: s4State,
        icon: <Home size={18} />,
        description: `Delivered to ${order.shippingAddress?.fullName || 'recipient'} at ${destCity}.`,
        timestamp:
          s4State === 'completed'
            ? formatDateTime(order.deliveredAt) || 'Delivered to Doorstep'
            : getDeliveryDateInfo(order).date,
        hint: s4State === 'completed' ? 'Package successfully handed over' : 'Courier will contact you on delivery',
      },
    ];
  };

  const deliveryInfo = matchedOrder ? getDeliveryDateInfo(matchedOrder) : null;
  const statusConfig = matchedOrder ? getStatusConfig(matchedOrder.orderStatus) : null;
  const trackingSteps = matchedOrder ? getTrackingSteps(matchedOrder) : [];

  return (
    <div style={{ padding: '3rem 0 6rem 0', backgroundColor: '#FAF7F2', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '780px', margin: '0 auto', padding: '0 1rem' }}>
        
        {/* Navigation Breadcrumb / Back link */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link
            to="/orders"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#78716C',
              fontSize: '0.88rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            ← Back to My Orders
          </Link>
          <span style={{ fontSize: '0.8rem', color: '#B45309', fontWeight: 600, backgroundColor: '#FEF3C7', padding: '4px 10px', borderRadius: '12px' }}>
            ⚡ Live Dispatch Radar
          </span>
        </div>

        {/* Page Title & Subtitle */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1
            style={{
              fontSize: '2.25rem',
              color: '#1C1917',
              margin: '0 0 0.5rem 0',
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 700,
            }}
          >
            Track Your Honey Consignment
          </h1>
          <p style={{ color: '#78716C', fontSize: '1rem', maxWidth: '520px', margin: '0 auto', lineHeight: 1.5 }}>
            Enter your order number or phone to see live milestone updates, courier tracking, and estimated arrival.
          </p>
        </div>

        {/* Search Bar Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            padding: '1.5rem',
            border: '1.5px solid #E7E5E4',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)',
            marginBottom: '2rem',
          }}
        >
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '260px' }}>
              <Input
                placeholder="Enter Order # (e.g. MDH-7810) or Phone..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                leftIcon={<Search size={18} color="#D97706" />}
                style={{ fontSize: '1rem', padding: '0.75rem 1rem 0.75rem 2.5rem' }}
              />
            </div>
            <Button
              type="submit"
              size="md"
              disabled={isSearching || !query.trim()}
              rightIcon={
                isSearching ? (
                  <Loader size={16} style={{ animation: 'spin 0.8s linear infinite' }} />
                ) : (
                  <ArrowRight size={16} />
                )
              }
              style={{
                padding: '0.75rem 1.5rem',
                fontWeight: 700,
                fontSize: '0.95rem',
                backgroundColor: '#D97706',
                borderColor: '#D97706',
              }}
            >
              {isSearching ? 'Locating…' : 'Locate Package'}
            </Button>
          </form>

          {/* Quick Helper Links / Sample ID */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '0.85rem',
              fontSize: '0.82rem',
              color: '#78716C',
              flexWrap: 'wrap',
            }}
          >
            <span>Quick search:</span>
            <button
              type="button"
              onClick={() => {
                setQuery('MDH-7810');
                setSearchParams({ q: 'MDH-7810' });
                doSearch('MDH-7810');
              }}
              style={{
                background: '#FAF7F2',
                border: '1px solid #E7E5E4',
                color: '#B45309',
                borderRadius: '6px',
                padding: '3px 8px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.8rem',
              }}
            >
              MDH-7810
            </button>
            <span style={{ color: '#A8A29E' }}>•</span>
            <span>You can also enter your 10-digit registered mobile number</span>
          </div>
        </div>

        {/* Results Section */}
        {searched && (
          <div>
            {matchedOrder && statusConfig && deliveryInfo ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                
                {/* 1. HERO STATUS CARD (Crystal Clear Current State) */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '24px',
                    padding: '2rem',
                    border: `1.5px solid ${statusConfig.themeBorder}`,
                    boxShadow: '0 10px 35px rgba(0, 0, 0, 0.05)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Top colored accent stripe */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '5px',
                      background: `linear-gradient(90deg, ${statusConfig.themeColor}, #F59E0B)`,
                    }}
                  />

                  {/* Header Row: Order Number & Delivery Estimate */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      flexWrap: 'wrap',
                      gap: '1rem',
                      paddingBottom: '1.25rem',
                      borderBottom: '1px solid #F5F1E9',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span
                          style={{
                            fontSize: '0.8rem',
                            fontWeight: 800,
                            color: statusConfig.badgeColor,
                            backgroundColor: statusConfig.badgeBg,
                            padding: '4px 10px',
                            borderRadius: '20px',
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          {statusConfig.badgeText}
                        </span>
                        <span style={{ fontSize: '0.85rem', color: '#78716C' }}>
                          Placed on {formatDateTime(matchedOrder.createdAt)?.split(',')[0] || 'Recently'}
                        </span>
                      </div>
                      <h2
                        style={{
                          fontSize: '1.65rem',
                          color: '#1C1917',
                          margin: 0,
                          fontWeight: 800,
                          fontFamily: "'Outfit', sans-serif",
                        }}
                      >
                        Order #{matchedOrder.orderNumber}
                      </h2>
                    </div>

                    {/* Delivery / Arrival Callout Box */}
                    <div
                      style={{
                        backgroundColor: statusConfig.themeBg,
                        border: `1px solid ${statusConfig.themeBorder}`,
                        padding: '0.75rem 1.25rem',
                        borderRadius: '16px',
                        textAlign: 'right',
                        minWidth: '180px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: statusConfig.badgeColor,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          marginBottom: '2px',
                        }}
                      >
                        {deliveryInfo.label}
                      </div>
                      <div
                        style={{
                          fontSize: '1.15rem',
                          fontWeight: 800,
                          color: '#1C1917',
                        }}
                      >
                        {deliveryInfo.date}
                      </div>
                    </div>
                  </div>

                  {/* Status Banner Message */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      margin: '1.25rem 0',
                      padding: '1rem 1.25rem',
                      backgroundColor: statusConfig.themeBg,
                      borderRadius: '16px',
                      border: `1px solid ${statusConfig.themeBorder}`,
                    }}
                  >
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        backgroundColor: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                      }}
                    >
                      {statusConfig.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#1C1917', marginBottom: '2px' }}>
                        {statusConfig.headline}
                      </div>
                      <div style={{ fontSize: '0.88rem', color: '#57534E', lineHeight: 1.4 }}>
                        {statusConfig.subtext}
                      </div>
                    </div>
                  </div>

                  {/* Overall Journey Progress Bar */}
                  <div style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.82rem', fontWeight: 600, color: '#78716C' }}>
                      <span>Dispatch Progress</span>
                      <span style={{ color: statusConfig.themeColor, fontWeight: 700 }}>
                        {statusConfig.progressPercentage}% Completed
                      </span>
                    </div>
                    <div
                      style={{
                        height: '8px',
                        backgroundColor: '#F5F1E9',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        position: 'relative',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${statusConfig.progressPercentage}%`,
                          background: `linear-gradient(90deg, #F59E0B 0%, ${statusConfig.themeColor} 100%)`,
                          borderRadius: '10px',
                          transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. STEP-BY-STEP LIVE TIMELINE (Clear, Connected, Human-friendly) */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '24px',
                    padding: '2rem',
                    border: '1.5px solid #E7E5E4',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.03)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', borderBottom: '1px solid #F5F1E9', paddingBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1C1917', margin: 0 }}>
                        Consignment Milestones
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: '#78716C', margin: '4px 0 0 0' }}>
                        Track step-by-step progress from apiary harvesting to final handover
                      </p>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700, backgroundColor: '#ECFDF5', padding: '4px 8px', borderRadius: '6px' }}>
                      Live Status
                    </span>
                  </div>

                  {/* Connected Timeline List */}
                  <div style={{ position: 'relative', paddingLeft: '0.5rem' }}>
                    {trackingSteps.map((step, idx) => {
                      const isLast = idx === trackingSteps.length - 1;
                      const isCompleted = step.state === 'completed';
                      const isCurrent = step.state === 'current';
                      const isUpcoming = step.state === 'upcoming';

                      return (
                        <div
                          key={step.stepNumber}
                          style={{
                            display: 'flex',
                            gap: '1.25rem',
                            position: 'relative',
                            paddingBottom: isLast ? '0' : '2.25rem',
                          }}
                        >
                          {/* Vertical Connector Line */}
                          {!isLast && (
                            <div
                              style={{
                                position: 'absolute',
                                left: '19px',
                                top: '40px',
                                bottom: '0',
                                width: '2px',
                                backgroundColor: isCompleted ? '#059669' : '#E7E5E4',
                                transition: 'background-color 0.3s',
                              }}
                            />
                          )}

                          {/* Node Icon Circle */}
                          <div style={{ position: 'relative', zIndex: 2, flexShrink: 0 }}>
                            <div
                              style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: isCompleted
                                  ? '#059669'
                                  : isCurrent
                                  ? '#D97706'
                                  : '#FFFFFF',
                                color: isCompleted || isCurrent ? '#FFFFFF' : '#A8A29E',
                                border: isUpcoming ? '2px solid #E7E5E4' : 'none',
                                boxShadow: isCurrent
                                  ? '0 0 0 5px rgba(217, 119, 6, 0.25), 0 4px 12px rgba(217, 119, 6, 0.3)'
                                  : isCompleted
                                  ? '0 2px 8px rgba(5, 150, 105, 0.25)'
                                  : 'none',
                                transition: 'all 0.3s ease',
                              }}
                            >
                              {isCompleted ? (
                                <Check size={20} strokeWidth={2.5} />
                              ) : isCurrent ? (
                                step.icon
                              ) : (
                                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{step.stepNumber}</span>
                              )}
                            </div>
                          </div>

                          {/* Step Content */}
                          <div
                            style={{
                              flex: 1,
                              backgroundColor: isCurrent ? '#FFFBEB' : 'transparent',
                              border: isCurrent ? '1.5px solid #FDE68A' : 'none',
                              padding: isCurrent ? '1rem 1.25rem' : '0.15rem 0',
                              borderRadius: isCurrent ? '16px' : '0',
                              transition: 'all 0.2s',
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '6px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <h4
                                  style={{
                                    fontSize: '1.02rem',
                                    fontWeight: isCurrent || isCompleted ? 800 : 600,
                                    color: isUpcoming ? '#78716C' : '#1C1917',
                                    margin: 0,
                                  }}
                                >
                                  {step.title}
                                </h4>

                                {/* Active Stage Badge */}
                                {isCurrent && (
                                  <span
                                    style={{
                                      fontSize: '0.72rem',
                                      fontWeight: 800,
                                      color: '#92400E',
                                      backgroundColor: '#FEF3C7',
                                      padding: '2px 8px',
                                      borderRadius: '12px',
                                      letterSpacing: '0.04em',
                                      textTransform: 'uppercase',
                                      animation: 'pulse 2s infinite',
                                    }}
                                  >
                                    ● Current Stage
                                  </span>
                                )}

                                {isCompleted && (
                                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#059669' }}>
                                    ✓ Completed
                                  </span>
                                )}
                              </div>

                              {/* Timestamp / Status date */}
                              {step.timestamp && (
                                <span
                                  style={{
                                    fontSize: '0.8rem',
                                    fontWeight: isCurrent ? 700 : 500,
                                    color: isCurrent ? '#B45309' : '#A8A29E',
                                  }}
                                >
                                  {step.timestamp}
                                </span>
                              )}
                            </div>

                            {/* Description */}
                            <p
                              style={{
                                fontSize: '0.88rem',
                                color: isUpcoming ? '#A8A29E' : '#57534E',
                                margin: '6px 0 0 0',
                                lineHeight: 1.5,
                              }}
                            >
                              {step.description}
                            </p>

                            {/* Helpful hint for active step */}
                            {step.hint && (
                              <div
                                style={{
                                  marginTop: '8px',
                                  fontSize: '0.82rem',
                                  color: isCurrent ? '#92400E' : '#78716C',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  fontWeight: 500,
                                }}
                              >
                                <ShieldCheck size={14} color={isCurrent ? '#D97706' : '#78716C'} />
                                {step.hint}
                              </div>
                            )}

                            {/* Step 3 Special: Tracking Number & Copy Button */}
                            {step.trackingNumber && (
                              <div
                                style={{
                                  marginTop: '10px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  flexWrap: 'wrap',
                                }}
                              >
                                <div
                                  style={{
                                    fontFamily: 'monospace',
                                    fontSize: '0.88rem',
                                    fontWeight: 700,
                                    color: '#1C1917',
                                    backgroundColor: '#FFFFFF',
                                    padding: '6px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid #E7E5E4',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                  }}
                                >
                                  <Truck size={14} color="#D97706" />
                                  <span>{step.trackingNumber}</span>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleCopyTracking(step.trackingNumber!)}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    padding: '6px 12px',
                                    borderRadius: '8px',
                                    backgroundColor: copiedTracking ? '#ECFDF5' : '#FAF7F2',
                                    border: copiedTracking ? '1px solid #A7F3D0' : '1px solid #E7E5E4',
                                    color: copiedTracking ? '#065F46' : '#57534E',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                  }}
                                >
                                  {copiedTracking ? (
                                    <>
                                      <Check size={13} color="#059669" />
                                      <span>Copied!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy size={13} />
                                      <span>Copy AWB</span>
                                    </>
                                  )}
                                </button>

                                <a
                                  href={`https://www.delhivery.com/track/package/${step.trackingNumber}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    color: '#D97706',
                                    textDecoration: 'none',
                                    padding: '6px 8px',
                                  }}
                                >
                                  <span>Track on Delhivery</span>
                                  <ExternalLink size={13} />
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. COURIER, SHIPPING DESTINATION & PAYMENT DETAILS GRID */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '1.25rem',
                  }}
                >
                  {/* Courier Partner Details Card */}
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '20px',
                      padding: '1.5rem',
                      border: '1.5px solid #E7E5E4',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #F5F1E9', paddingBottom: '0.75rem' }}>
                      <Truck size={18} color="#D97706" />
                      <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#1C1917' }}>
                        Carrier & Dispatch Info
                      </h4>
                    </div>

                    <div style={{ fontSize: '0.88rem', color: '#57534E', lineHeight: 1.6 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ color: '#78716C' }}>Delivery Partner:</span>
                        <strong style={{ color: '#1C1917' }}>Delhivery Express Surface/Air</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ color: '#78716C' }}>Tracking AWB:</span>
                        <strong style={{ fontFamily: 'monospace', color: '#D97706' }}>
                          {matchedOrder.trackingNumber || 'MDH-TRK-112710'}
                        </strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ color: '#78716C' }}>Origin:</span>
                        <span>Jim Corbett Apiary, Uttarakhand</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#78716C' }}>Destination:</span>
                        <strong>
                          {matchedOrder.shippingAddress?.city}, {matchedOrder.shippingAddress?.state}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Destination Card */}
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '20px',
                      padding: '1.5rem',
                      border: '1.5px solid #E7E5E4',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #F5F1E9', paddingBottom: '0.75rem' }}>
                      <MapPin size={18} color="#059669" />
                      <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#1C1917' }}>
                        Delivery Address
                      </h4>
                    </div>

                    <div style={{ fontSize: '0.88rem', color: '#57534E', lineHeight: 1.6 }}>
                      <strong style={{ color: '#1C1917', fontSize: '0.92rem' }}>
                        {matchedOrder.shippingAddress?.fullName}
                      </strong>
                      <div style={{ color: '#78716C', fontSize: '0.82rem' }}>
                        📞 {matchedOrder.shippingAddress?.phone}
                      </div>
                      <div style={{ marginTop: '4px' }}>
                        {matchedOrder.shippingAddress?.addressLine1}
                        {matchedOrder.shippingAddress?.addressLine2 ? `, ${matchedOrder.shippingAddress.addressLine2}` : ''}
                      </div>
                      <div>
                        {matchedOrder.shippingAddress?.city}, {matchedOrder.shippingAddress?.state} -{' '}
                        <strong>{matchedOrder.shippingAddress?.pincode}</strong>
                      </div>

                      {matchedOrder.shippingAddress && (
                        <div style={{ marginTop: '8px' }}>
                          <a
                            href={matchedOrder.shippingAddress.googleMapsLink || generateGoogleMapsLink(matchedOrder.shippingAddress)}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              color: '#2563EB',
                              textDecoration: 'none',
                              backgroundColor: '#EFF6FF',
                              padding: '5px 10px',
                              borderRadius: '8px',
                              border: '1px solid #BFDBFE',
                            }}
                          >
                            🗺️ View Destination on Google Maps <ExternalLink size={12} />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 4. PACKAGE ITEMS & INVOICE SUMMARY */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '20px',
                    padding: '1.5rem',
                    border: '1.5px solid #E7E5E4',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottom: '1px solid #F5F1E9',
                      paddingBottom: '0.75rem',
                      marginBottom: '1rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Package size={18} color="#D97706" />
                      <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#1C1917' }}>
                        Package Contents ({matchedOrder.items?.length || 1} {matchedOrder.items?.length === 1 ? 'item' : 'items'})
                      </h4>
                    </div>

                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#D97706' }}>
                      Total Paid: {formatPrice(matchedOrder.total)}
                    </div>
                  </div>

                  {/* Item List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {matchedOrder.items && matchedOrder.items.length > 0 ? (
                      matchedOrder.items.map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.65rem 0',
                            borderBottom: idx < matchedOrder.items.length - 1 ? '1px solid #FAF7F2' : 'none',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.productName}
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src = 'https://res.cloudinary.com/kisnodzz/image/upload/v1791042814/madhuvan_honey/products/t6l1edtfc4xg0wmxb8we.jpg';
                                }}
                                style={{
                                  width: '46px',
                                  height: '46px',
                                  borderRadius: '10px',
                                  objectFit: 'cover',
                                  border: '1px solid #E7E5E4',
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: '46px',
                                  height: '46px',
                                  borderRadius: '10px',
                                  backgroundColor: '#FEF3C7',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: '#D97706',
                                }}
                              >
                                🍯
                              </div>
                            )}
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#1C1917' }}>
                                {item.productName}
                              </div>
                              <div style={{ fontSize: '0.8rem', color: '#78716C' }}>
                                Jar Size: {item.size} • Qty: {item.quantity}
                              </div>
                            </div>
                          </div>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1C1917' }}>
                            {formatPrice(item.price * item.quantity)}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ fontSize: '0.88rem', color: '#78716C' }}>
                        Pure Raw Forest Honey Jar • 1 Consignment
                      </div>
                    )}
                  </div>

                  {/* Payment Info Badge */}
                  <div
                    style={{
                      marginTop: '1rem',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid #F5F1E9',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '8px',
                      fontSize: '0.85rem',
                    }}
                  >
                    <span style={{ color: '#78716C' }}>
                      Payment Method:{' '}
                      <strong style={{ color: '#1C1917', textTransform: 'uppercase' }}>
                        {matchedOrder.paymentMethod}
                      </strong>{' '}
                      {matchedOrder.paymentStatus === 'paid' && (
                        <span style={{ color: '#059669', fontWeight: 700 }}>✓ Verified</span>
                      )}
                    </span>

                    <Link
                      to={`/orders/${matchedOrder.id}`}
                      style={{
                        color: '#D97706',
                        fontWeight: 700,
                        textDecoration: 'none',
                        fontSize: '0.85rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <span>View Full Order Details</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>

                {/* 5. NEED ASSISTANCE / WHATSAPP SUPPORT CTA */}
                <div
                  style={{
                    backgroundColor: '#FFFBEB',
                    border: '1.5px solid #FDE68A',
                    borderRadius: '20px',
                    padding: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        backgroundColor: '#FEF3C7',
                        color: '#D97706',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <HelpCircle size={22} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, color: '#92400E', fontSize: '0.95rem' }}>
                        Have any questions about this delivery?
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#78716C' }}>
                        Our customer support team is available Mon–Sat (9 AM – 7 PM IST) to assist you.
                      </div>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Hi Madhuvan Honey, I have a query about tracking my order #${matchedOrder.orderNumber}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: '#25D366',
                      color: '#FFFFFF',
                      padding: '0.65rem 1.25rem',
                      borderRadius: '12px',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      textDecoration: 'none',
                      boxShadow: '0 4px 12px rgba(37, 211, 102, 0.25)',
                    }}
                  >
                    <WhatsAppIcon size={16} color="#FFFFFF" />
                    <span>WhatsApp Support</span>
                  </a>
                </div>

              </div>
            ) : (
              /* No Order Found Empty State */
              <div
                style={{
                  textAlign: 'center',
                  backgroundColor: '#FFFFFF',
                  padding: '3.5rem 2rem',
                  borderRadius: '24px',
                  border: '1.5px solid #E7E5E4',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.03)',
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#FEF2F2',
                    color: '#DC2626',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem auto',
                  }}
                >
                  <AlertCircle size={32} />
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1C1917', marginBottom: '0.5rem' }}>
                  No Order Found for "{query}"
                </h3>
                <p style={{ color: '#78716C', maxWidth: '440px', margin: '0 auto 1.5rem auto', lineHeight: 1.6, fontSize: '0.92rem' }}>
                  Please check the spelling of your Order ID (format: <strong>MDH-XXXX</strong>) or try searching with the phone number used during checkout.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <Link to="/orders">
                    <Button size="sm" variant="outline">
                      View My Orders List
                    </Button>
                  </Link>
                  <a
                    href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Hi Madhuvan Honey, I need help finding my order with query: ${query}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="sm" leftIcon={<WhatsAppIcon size={16} color="#FFFFFF" />} style={{ backgroundColor: '#25D366', borderColor: '#25D366' }}>
                      WhatsApp Support
                    </Button>
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
