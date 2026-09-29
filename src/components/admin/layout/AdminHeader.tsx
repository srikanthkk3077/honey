import React from 'react';
import { Bell, Menu, ShieldCheck } from 'lucide-react';
import { useStore } from '../../../store/store';

export const AdminHeader: React.FC<{ onMobileToggle?: () => void }> = ({ onMobileToggle }) => {
  const { user } = useStore();

  return (
    <header
      style={{
        height: '70px',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E7E5E4',
        padding: '0 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 30,
      }}
    >
      <div className="flex items-center gap-3">
        {onMobileToggle && (
          <button
            onClick={onMobileToggle}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              padding: '4px',
              cursor: 'pointer',
            }}
            id="admin-menu-toggle"
          >
            <Menu size={24} />
          </button>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={20} color="#059669" />
          <span style={{ fontWeight: 700, fontSize: '1rem', color: '#1C1917' }}>
            Madhuvan Apiary Control Center
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div
          style={{
            position: 'relative',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '50%',
            color: '#57534E',
          }}
        >
          <Bell size={20} />
          <span
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#EF4444',
            }}
          />
        </div>

        <div className="flex items-center gap-3" style={{ borderLeft: '1px solid #E7E5E4', paddingLeft: '1rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#FEF3C7',
              color: '#92400E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.9rem',
            }}
          >
            A
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1C1917' }}>
              {user?.name || 'Administrator'}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600 }}>Super Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
};
