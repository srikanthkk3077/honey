import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { AnnouncementBar } from '../components/customer/layout/AnnouncementBar';
import { Header } from '../components/customer/layout/Header';
import { Footer } from '../components/customer/layout/Footer';
import { MobileMenu } from '../components/customer/layout/MobileMenu';
import { useStore } from '../store/store';
import { CartItem } from '../components/customer/cart/CartItem';
import { EmptyCart } from '../components/customer/cart/EmptyCart';
import { X, ShoppingBag, ArrowRight, Truck, AlertCircle, CheckCircle2, Info, Lock, Tag } from 'lucide-react';
import { formatPrice } from '../utils/formatPrice';
import { FREE_SHIPPING_THRESHOLD } from '../utils/constants';
import { PageLoader } from '../components/common/PageLoader';

export const CustomerLayout: React.FC = () => {
  const {
    cart,
    cartCount,
    cartSubtotal,
    cartDiscount,
    cartShippingFee,
    cartTotal,
    cartDrawerOpen,
    setCartDrawerOpen,
    toasts,
    removeToast,
    isAuthenticated,
  } = useStore();
  const navigate = useNavigate();

  const freeShippingAway = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AnnouncementBar />
      <Header />
      <MobileMenu />

      <main style={{ flex: 1 }}>
        <React.Suspense fallback={<PageLoader />}>
          <Outlet />
        </React.Suspense>
      </main>

      <Footer />

      {/* Cart Drawer Slide-over */}
      {cartDrawerOpen && (
        <div
          className="cart-drawer-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: 'rgba(0,0,0,0.45)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            padding: '16px',
          }}
          onClick={() => setCartDrawerOpen(false)}
        >
          <div
            className="cart-drawer-panel"
            style={{
              width: '100%',
              maxWidth: '430px',
              backgroundColor: '#FAF8F5',
              height: 'calc(100vh - 32px)',
              maxHeight: '940px',
              borderRadius: '26px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 60px -15px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.06)',
              animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div
              className="cart-drawer-header"
              style={{
                padding: '1.25rem 1.35rem 0.85rem 1.35rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'transparent',
                flexShrink: 0,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(217, 119, 6, 0.28)',
                    flexShrink: 0,
                  }}
                >
                  <ShoppingBag size={19} color="#451A03" strokeWidth={2.4} />
                </div>
                <h3
                  style={{
                    fontSize: '1.25rem',
                    color: '#1C1917',
                    margin: 0,
                    fontWeight: 800,
                    fontFamily: "'Playfair Display', Georgia, serif",
                    letterSpacing: '-0.01em',
                  }}
                >
                  Honey Basket ({cartCount})
                </h3>
              </div>
              <button
                onClick={() => setCartDrawerOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '6px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  color: '#78716C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#EFEAE2';
                  e.currentTarget.style.color = '#1C1917';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#78716C';
                }}
                aria-label="Close Basket"
              >
                <X size={20} />
              </button>
            </div>

            {/* Free shipping banner */}
            {cart.length > 0 && (
              <div
                style={{
                  margin: '0 1.25rem 0.85rem 1.25rem',
                  padding: '0.7rem 1rem',
                  backgroundColor: '#FFF3E6',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  flexShrink: 0,
                  border: '1px solid rgba(251, 191, 36, 0.25)',
                }}
              >
                <Truck size={18} color="#EA580C" style={{ flexShrink: 0 }} />
                {freeShippingAway > 0 ? (
                  <span style={{ color: '#9A3412', fontWeight: 600, fontSize: '0.84rem' }}>
                    Add {formatPrice(freeShippingAway)} more for Free Express Delivery!
                  </span>
                ) : (
                  <span style={{ color: '#065F46', fontWeight: 700, fontSize: '0.84rem' }}>
                    🎉 You have qualified for Free Express Delivery!
                  </span>
                )}
              </div>
            )}

            {/* Drawer Body - SCROLLABLE */}
            <div
              className="cart-drawer-body"
              style={{
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
                padding: '0 1.25rem 0.75rem 1.25rem',
              }}
            >
              {cart.length === 0 ? (
                <EmptyCart />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {cart.map((item) => (
                    <CartItem key={item.id} item={item} variant="drawer" />
                  ))}
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            {cart.length > 0 && (
              <div
                className="cart-drawer-footer"
                style={{
                  flexShrink: 0,
                  padding: '1.15rem 1.25rem 1.35rem 1.25rem',
                  borderTop: '1px solid #EFEAE2',
                  backgroundColor: '#FAF8F5',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                }}
              >
                {/* Breakdown Summary */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                  <span style={{ color: '#57534E', fontWeight: 600 }}>Subtotal</span>
                  <span style={{ fontWeight: 700, color: '#1C1917', fontSize: '0.95rem' }}>{formatPrice(cartSubtotal)}</span>
                </div>

                {/* Discount */}
                {cartDiscount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.88rem' }}>
                    <span style={{ color: '#059669', fontWeight: 600 }}>Discount</span>
                    <span style={{ color: '#059669', fontWeight: 700 }}>- {formatPrice(cartDiscount)}</span>
                  </div>
                )}

                {/* Delivery Fee */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.88rem' }}>
                  <span style={{ color: '#57534E', fontWeight: 600 }}>Delivery Fee</span>
                  {cartShippingFee === 0 ? (
                    <span style={{ color: '#059669', fontWeight: 700 }}>FREE</span>
                  ) : (
                    <span style={{ fontWeight: 700, color: '#1C1917' }}>{formatPrice(cartShippingFee)}</span>
                  )}
                </div>

                {/* Total Warm Card */}
                <div
                  style={{
                    backgroundColor: '#FFEAD0',
                    borderRadius: '16px',
                    padding: '12px 16px',
                    marginTop: '0.35rem',
                    marginBottom: '0.35rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#1C1917' }}>Total</span>
                      <Info size={16} color="#B45309" />
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '1.35rem', color: '#1C1917' }}>
                      {formatPrice(cartTotal)}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#78716C', fontWeight: 500 }}>
                    Taxes included • {cartShippingFee === 0 ? 'Free delivery' : `${formatPrice(cartShippingFee)} delivery`}
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  type="button"
                  onClick={() => {
                    setCartDrawerOpen(false);
                    if (!isAuthenticated) {
                      navigate('/login?redirect=/checkout');
                    } else {
                      navigate('/checkout');
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '0.92rem 1.25rem',
                    borderRadius: '9999px',
                    background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.98rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    boxShadow: '0 6px 20px rgba(234, 88, 12, 0.4)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(234, 88, 12, 0.48)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(234, 88, 12, 0.4)';
                  }}
                >
                  <div
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '6px',
                      backgroundColor: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Lock size={13} color="#EA580C" strokeWidth={2.6} />
                  </div>
                  <span>Proceed to Secure Checkout</span>
                  <ArrowRight size={17} color="#FFFFFF" strokeWidth={2.4} />
                </button>

                {/* View Full Cart Link */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                  <Tag size={14} color="#78716C" />
                  <Link
                    to="/cart"
                    onClick={() => setCartDrawerOpen(false)}
                    style={{
                      fontSize: '0.82rem',
                      color: '#57534E',
                      textDecoration: 'none',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                    onMouseOut={(e) => (e.currentTarget.style.textDecoration = 'none')}
                  >
                    View detailed basket & enter coupon code
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Global Toasts */}
      <div className="toast-container" style={{ zIndex: 99999 }}>
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flex: 1, minWidth: 0 }}>
              {toast.type === 'error' && (
                <AlertCircle size={18} style={{ color: '#FCA5A5', flexShrink: 0, marginTop: '2px' }} />
              )}
              {toast.type === 'success' && (
                <CheckCircle2 size={18} style={{ color: '#6EE7B7', flexShrink: 0, marginTop: '2px' }} />
              )}
              {toast.type === 'info' && (
                <Info size={18} style={{ color: '#FCD34D', flexShrink: 0, marginTop: '2px' }} />
              )}
              <span style={{ fontSize: '0.88rem', lineHeight: '1.4', wordBreak: 'break-word' }}>
                {toast.message}
              </span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.7)',
                cursor: 'pointer',
                padding: '2px',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
              }}
              title="Close notification"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @media (max-width: 640px) {
          .cart-drawer-overlay {
            padding: 0 !important;
            align-items: stretch !important;
          }
          .cart-drawer-panel {
            height: 100% !important;
            max-height: 100% !important;
            border-radius: 0 !important;
            max-width: 100% !important;
          }
          .cart-drawer-header {
            padding: 1rem 1rem 0.65rem 1rem !important;
          }
          .cart-drawer-body {
            padding: 0 1rem 0.5rem 1rem !important;
          }
          .cart-drawer-footer {
            padding: 0.85rem 1rem 1.15rem 1rem !important;
          }
        }
      `}</style>
    </div>
  );
};
