import React from 'react';
import { useLocation } from 'react-router-dom';
import { Sparkles, ShieldCheck, Truck } from 'lucide-react';
import { FREE_SHIPPING_THRESHOLD } from '../../../utils/constants';

export const AnnouncementBar: React.FC = () => {
  return (
    <div
      style={{
        background: 'linear-gradient(90deg, #6B3410 0%, #8A4513 50%, #6B3410 100%)',
        color: '#FEF3C7',
        fontSize: '0.8rem',
        padding: '0.45rem 1rem',
        textAlign: 'center',
        borderBottom: '1px solid rgba(245, 158, 11, 0.25)',
        letterSpacing: '0.02em',
        fontWeight: 600,
      }}
    >
      <div
        className="container flex items-center justify-center flex-wrap gap-4"
        style={{ padding: 0, fontSize: 'clamp(0.72rem, 1.8vw, 0.82rem)' }}
      >
        <span>Up to 24% OFF All Honey + Up to 10% Off on Prepaid</span>
        <span style={{ color: '#F59E0B' }}>✦</span>
        <span>First order? Get Flat 10% OFF</span>
        <span style={{ color: '#F59E0B' }}>✦</span>
        <span>Free Delivery on orders above ₹{FREE_SHIPPING_THRESHOLD}</span>
      </div>
    </div>
  );
};
