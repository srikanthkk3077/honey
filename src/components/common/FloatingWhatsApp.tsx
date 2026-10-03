import React, { useState } from 'react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { getWhatsAppUrl } from '../../utils/whatsapp';
import { CONTACT_INFO } from '../../utils/constants';

interface FloatingWhatsAppProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  phoneNumber,
  defaultMessage = 'Hello Madhuvan Honey! 🍯 I would like to inquire about your raw forest honey products and ordering.',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const href = getWhatsAppUrl(phoneNumber || CONTACT_INFO.whatsapp, defaultMessage);

  return (
    <aside aria-label="WhatsApp quick chat" style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 89 }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {/* Hover Tooltip / Floating Pill */}
        <div
          className="whatsapp-tooltip"
          style={{
            position: 'absolute',
            right: 'calc(100% + 12px)',
            whiteSpace: 'nowrap',
            backgroundColor: '#1F2937',
            color: '#FFFFFF',
            padding: '8px 14px',
            borderRadius: '12px',
            fontSize: '0.84rem',
            fontWeight: 600,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
            pointerEvents: 'none',
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateX(0) scale(1)' : 'translateX(8px) scale(0.95)',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#25D366',
              boxShadow: '0 0 8px #25D366',
            }}
          />
          <span>Chat on WhatsApp</span>
          <div
            style={{
              position: 'absolute',
              right: '-6px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: 0,
              height: 0,
              borderTop: '6px solid transparent',
              borderBottom: '6px solid transparent',
              borderLeft: '6px solid #1F2937',
            }}
          />
        </div>

        {/* WhatsApp Floating Action Button */}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with Madhuvan Honey on WhatsApp"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="floating-whatsapp-btn"
          style={{
            width: '58px',
            height: '58px',
            borderRadius: '50%',
            backgroundColor: '#25D366',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 20px rgba(37, 211, 102, 0.45), 0 2px 6px rgba(0,0,0,0.15)',
            textDecoration: 'none',
            position: 'relative',
            cursor: 'pointer',
            transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease',
          }}
        >
          {/* Subtle Radar Ripple Glow */}
          <span
            className="whatsapp-pulse-ring"
            style={{
              position: 'absolute',
              inset: '-4px',
              borderRadius: '50%',
              border: '2px solid rgba(37, 211, 102, 0.5)',
              animation: 'waRipple 2.2s infinite cubic-bezier(0.24, 0, 0.38, 1)',
              pointerEvents: 'none',
            }}
          />

          <WhatsAppIcon size={32} color="#FFFFFF" />

          {/* Active Online Status Dot */}
          <span
            style={{
              position: 'absolute',
              top: '3px',
              right: '3px',
              width: '13px',
              height: '13px',
              backgroundColor: '#10B981',
              borderRadius: '50%',
              border: '2.5px solid #FFFFFF',
            }}
          />
        </a>
      </div>

      <style>{`
        @keyframes waRipple {
          0% {
            transform: scale(0.95);
            opacity: 0.9;
          }
          70% {
            transform: scale(1.35);
            opacity: 0;
          }
          100% {
            transform: scale(1.35);
            opacity: 0;
          }
        }
        .floating-whatsapp-btn:hover {
          transform: scale(1.08) translateY(-2px);
          box-shadow: 0 10px 28px rgba(37, 211, 102, 0.6), 0 3px 8px rgba(0,0,0,0.2) !important;
        }
        .floating-whatsapp-btn:active {
          transform: scale(0.95);
        }
        @media (max-width: 640px) {
          aside[aria-label="WhatsApp quick chat"] {
            bottom: 18px !important;
            right: 18px !important;
          }
          .floating-whatsapp-btn {
            width: 52px !important;
            height: 52px !important;
          }
          .floating-whatsapp-btn svg {
            width: 28px !important;
            height: 28px !important;
          }
        }
      `}</style>
    </aside>
  );
};

export default FloatingWhatsApp;
