import React from 'react';
import { Sparkles, ShieldCheck, Truck } from 'lucide-react';
import { FREE_SHIPPING_THRESHOLD } from '../../../utils/constants';

export const AnnouncementBar: React.FC = () => {
  return (
    <div
      style={{
        background: 'linear-gradient(90deg, #78350F 0%, #92400E 50%, #78350F 100%)',
        color: '#FEF3C7',
        fontSize: '0.8rem',
        padding: '0.45rem 1rem',
        textAlign: 'center',
        borderBottom: '1px solid rgba(245, 158, 11, 0.2)',
      }}
    >
      <div className="container flex items-center justify-between" style={{ padding: 0 }}>
        <div className="flex items-center gap-2" style={{ display: 'none' }} id="announcement-left">
          <ShieldCheck size={14} color="#F59E0B" />
          <span>FSSAI & Lab Certified 100% Raw Unheated Honey</span>
        </div>
        <div style={{ margin: '0 auto', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
          <Sparkles size={14} color="#FBBF24" />
          <span>Spring Harvest Fest: Free Wooden Honey Dipper + Free Shipping over ₹{FREE_SHIPPING_THRESHOLD}! Code: <strong>MADHUVAN10</strong></span>
        </div>
        <div className="flex items-center gap-2" style={{ display: 'none' }} id="announcement-right">
          <Truck size={14} color="#F59E0B" />
          <span>Pan-India 2-4 Day Express Dispatch</span>
        </div>
      </div>
    </div>
  );
};
