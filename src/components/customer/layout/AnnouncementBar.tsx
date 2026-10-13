import React, { useState, useEffect } from 'react';
import { FREE_SHIPPING_THRESHOLD } from '../../../utils/constants';

export const AnnouncementBar: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const messages = [
    'First order? Get Flat 10% OFF',
    `Free Delivery on orders above ₹${FREE_SHIPPING_THRESHOLD}`,
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % messages.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [messages.length]);

  return (
    <div
      style={{
        background: 'linear-gradient(90deg, #6B3410 0%, #8A4513 50%, #6B3410 100%)',
        color: '#FEF3C7',
        fontSize: '0.8rem',
        padding: '0.42rem 0.75rem',
        textAlign: 'center',
        borderBottom: '1px solid rgba(245, 158, 11, 0.25)',
        letterSpacing: '0.02em',
        fontWeight: 600,
      }}
    >
      {/* Desktop view: Both messages side by side */}
      <div
        className="announcement-desktop"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          fontSize: '0.8rem',
        }}
      >
        <span>First order? Get Flat 10% OFF</span>
        <span style={{ color: '#F59E0B' }}>✦</span>
        <span>Free Delivery on orders above ₹{FREE_SHIPPING_THRESHOLD}</span>
      </div>

      {/* Mobile view: Smooth alternating message that always fits 100% without clipping */}
      <div
        className="announcement-mobile"
        style={{
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          fontSize: '0.75rem',
        }}
      >
        <span style={{ color: '#F59E0B' }}>✦</span>
        <span key={activeIdx} className="announcement-fade">
          {messages[activeIdx]}
        </span>
        <span style={{ color: '#F59E0B' }}>✦</span>
      </div>

      <style>{`
        @keyframes announcementFadeIn {
          from { opacity: 0; transform: translateY(3px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .announcement-fade {
          animation: announcementFadeIn 0.35s ease-out;
        }
        @media (max-width: 640px) {
          .announcement-desktop { display: none !important; }
          .announcement-mobile { display: flex !important; }
        }
      `}</style>
    </div>
  );
};
