import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '../../common/Button';
import { useStore } from '../../../store/store';

export const EmptyCart: React.FC = () => {
  const { setCartDrawerOpen } = useStore();

  return (
    <div
      style={{
        textAlign: 'center',
        padding: '4rem 1.5rem',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        border: '1px solid #E7E5E4',
        maxWidth: '520px',
        margin: '2rem auto',
      }}
    >
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: '#FFFBEB',
          color: '#D97706',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto',
        }}
      >
        <ShoppingBag size={38} />
      </div>

      <h3 style={{ fontSize: '1.5rem', color: '#1C1917', marginBottom: '0.5rem' }}>
        Your Honey Basket is Empty
      </h3>
      <p style={{ color: '#78716C', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
        You haven't added any pure raw honey or honeycombs yet. Explore our fresh seasonal harvests from Himalayan valleys and Sundarbans.
      </p>

      <Link to="/shop" onClick={() => setCartDrawerOpen(false)}>
        <Button size="lg" rightIcon={<ArrowRight size={18} />}>
          Discover Fresh Harvest
        </Button>
      </Link>
    </div>
  );
};
