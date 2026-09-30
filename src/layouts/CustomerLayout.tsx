import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { AnnouncementBar } from '../components/customer/layout/AnnouncementBar';
import { Header } from '../components/customer/layout/Header';
import { Footer } from '../components/customer/layout/Footer';
import { MobileMenu } from '../components/customer/layout/MobileMenu';
import { useStore } from '../store/store';
import { CartItem } from '../components/customer/cart/CartItem';
import { CartSummary } from '../components/customer/cart/CartSummary';
import { EmptyCart } from '../components/customer/cart/EmptyCart';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '../components/common/Button';

export const CustomerLayout: React.FC = () => {
  const {
    cart,
    cartCount,
    cartDrawerOpen,
    setCartDrawerOpen,
    toasts,
    removeToast,
  } = useStore();

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
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div
              className="cart-drawer-header"
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid #E7E5E4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#FAF7F2',
              }}
            >
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} color="#D97706" />
                <h3 style={{ fontSize: '1.15rem', color: '#1C1917', margin: 0 }}>
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
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="cart-drawer-body" style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
              {cart.length === 0 ? (
                <EmptyCart />
              ) : (
                <div>
                  {cart.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            {cart.length > 0 && (
              <div className="cart-drawer-footer" style={{ padding: '1rem', borderTop: '1px solid #E7E5E4', backgroundColor: '#FAF7F2' }}>
                <CartSummary />
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
