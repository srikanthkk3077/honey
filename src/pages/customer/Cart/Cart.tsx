import React from 'react';
import { useStore } from '../../../store/store';
import { CartItem } from '../../../components/customer/cart/CartItem';
import { CartSummary } from '../../../components/customer/cart/CartSummary';
import { EmptyCart } from '../../../components/customer/cart/EmptyCart';
import { SectionTitle } from '../../../components/common/SectionTitle';

export const Cart: React.FC = () => {
  const { cart, cartCount, clearCart } = useStore();

  return (
    <div style={{ padding: 'clamp(2rem, 4vw, 3.5rem) 0 5rem 0', backgroundColor: '#FAF7F2' }}>
      <div className="container">
        <SectionTitle
          subtitle="Your Selection"
          title={`Shopping Basket (${cartCount} ${cartCount === 1 ? 'Jar' : 'Jars'})`}
          description="Review your freshly harvested raw honey selection before proceeding to checkout."
        />

        {cart.length === 0 ? (
          <EmptyCart />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
              gap: '2rem',
              alignItems: 'start',
            }}
          >
            {/* Cart Items List */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                padding: 'clamp(1rem, 3vw, 2rem)',
                border: '1px solid #E7E5E4',
              }}
            >
              <div className="flex items-center justify-between" style={{ paddingBottom: '1rem', borderBottom: '1px solid #E7E5E4', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1C1917' }}>Honey Products</span>
                <button
                  onClick={clearCart}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#DC2626',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Empty Cart
                </button>
              </div>

              <div>
                {cart.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* Cart Summary */}
            <div style={{ position: 'sticky', top: '90px' }}>
              <CartSummary />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
