import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { AnnouncementBar } from '../components/customer/layout/AnnouncementBar';
import { Header } from '../components/customer/layout/Header';
import { Footer } from '../components/customer/layout/Footer';
import { MobileMenu } from '../components/customer/layout/MobileMenu';
import { useStore } from '../store/store';
import { CartItem } from '../components/customer/cart/CartItem';
import { EmptyCart } from '../components/customer/cart/EmptyCart';
import { X, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { formatPrice } from '../utils/formatPrice';
import { FREE_SHIPPING_THRESHOLD } from '../utils/constants';

export const CustomerLayout: React.FC = () => {
  const {
    cart,
    cartCount,
    cartSubtotal,
    cartDiscount,
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
        <Outlet />
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
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
          onClick={() => setCartDrawerOpen(false)}
        >
          <div
            className="cart-drawer-panel"
            style={{
              width: '100%',
              maxWidth: '440px',
              backgroundColor: '#FFFFFF',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-10px 0 30px rgba(0,0,0,0.15)',
              animation: 'slideInRight 0.25s ease-out',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div
              className="cart-drawer-header"
              style={{
                padding: '1.15rem 1.5rem',
                borderBottom: '1px solid #E7E5E4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#FAF7F2',
                flexShrink: 0,
              }}
            >
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} color="#D97706" />
                <h3 style={{ fontSize: '1.15rem', color: '#1C1917', margin: 0, fontWeight: 700 }}>
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
                }}
                aria-label="Close Basket"
              >
                <X size={20} />
              </button>
            </div>

            {/* Free shipping progress bar banner */}
            {cart.length > 0 && (
              <div
                style={{
                  backgroundColor: '#FFFBEB',
                  borderBottom: '1px solid #FEF3C7',
                  padding: '0.65rem 1.25rem',
                  fontSize: '0.8rem',
                  flexShrink: 0,
                }}
              >
                {freeShippingAway > 0 ? (
                  <div>
                    <div className="flex items-center gap-1.5" style={{ color: '#92400E', fontWeight: 600, marginBottom: '4px' }}>
                      <Truck size={14} /> Add {formatPrice(freeShippingAway)} more for Free Express Delivery!
                    </div>
                    <div style={{ width: '100%', height: '4px', background: '#FEF3C7', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${Math.min(100, ((FREE_SHIPPING_THRESHOLD - freeShippingAway) / FREE_SHIPPING_THRESHOLD) * 100)}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #F59E0B, #D97706)',
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5" style={{ color: '#065F46', fontWeight: 700 }}>
                    🎉 You have qualified for Free Express Delivery!
                  </div>
                )}
              </div>
            )}

            {/* Drawer Body - SCROLLABLE WITH minHeight: 0 and flex: 1 */}
            <div
              className="cart-drawer-body"
              style={{
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
                padding: '1.25rem',
              }}
            >
              {cart.length === 0 ? (
                <EmptyCart />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {cart.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>

            {/* Drawer Footer - CLEAN, COMPACT, NEVER OVERLAPPING */}
            {cart.length > 0 && (
              <div
                className="cart-drawer-footer"
                style={{
                  flexShrink: 0,
                  padding: '1.15rem 1.25rem',
                  borderTop: '1px solid #E7E5E4',
                  backgroundColor: '#FAF7F2',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                }}
              >
                {/* Breakdown Summary */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.88rem' }}>
                  <span style={{ color: '#78716C' }}>Subtotal</span>
                  <span style={{ fontWeight: 700, color: '#1C1917' }}>{formatPrice(cartSubtotal)}</span>
                </div>

                {cartDiscount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                    <span style={{ color: '#059669', fontWeight: 600 }}>Total Savings</span>
                    <span style={{ color: '#059669', fontWeight: 700 }}>- {formatPrice(cartDiscount)}</span>
                  </div>
                )}

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    paddingTop: '0.5rem',
                    borderTop: '1px solid #E7E5E4',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#1C1917' }}>Total</div>
                    <div style={{ fontSize: '0.72rem', color: '#78716C' }}>Taxes included • Free delivery</div>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '1.35rem', color: '#1C1917' }}>
                    {formatPrice(cartTotal)}
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
                    padding: '0.85rem',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(217, 119, 6, 0.35)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span>Proceed to Secure Checkout</span>
                  <ArrowRight size={16} />
                </button>

                {/* View Full Cart Link */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2px' }}>
                  <Link
                    to="/cart"
                    onClick={() => setCartDrawerOpen(false)}
                    style={{
                      fontSize: '0.82rem',
                      color: '#78716C',
                      textDecoration: 'underline',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
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
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', padding: 0 }}
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
        @media (max-width: 480px) {
          .cart-drawer-header {
            padding: 1rem !important;
          }
          .cart-drawer-body {
            padding: 0.85rem !important;
          }
          .cart-drawer-footer {
            padding: 0.75rem !important;
          }
          .toast-container {
            left: 16px !important;
            right: 16px !important;
            bottom: 16px !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};
