import React from 'react';
import { Bell, Menu, ShieldCheck } from 'lucide-react';
import { useStore } from '../../../store/store';

export const AdminHeader: React.FC<{ onMobileToggle?: () => void }> = ({ onMobileToggle }) => {
  const { user } = useStore();

  return (
    <header
      className="admin-header"
      style={{
        height: '70px',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E7E5E4',
        padding: '0 clamp(0.75rem, 3vw, 2rem)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        gap: '0.75rem',
      }}
    >
      <div className="flex items-center gap-2" style={{ minWidth: 0 }}>
        {onMobileToggle && (
          <button
            onClick={onMobileToggle}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              padding: '6px',
              cursor: 'pointer',
              color: '#1C1917',
              borderRadius: '8px',
            }}
            id="admin-menu-toggle"
            aria-label="Open Admin Menu"
          >
            <Menu size={22} />
          </button>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <ShieldCheck size={20} color="#059669" style={{ flexShrink: 0 }} />
          <span style={{ fontWeight: 700, fontSize: 'clamp(0.85rem, 2.5vw, 1rem)', color: '#1C1917', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Madhuvan <span className="admin-header-title-suffix">Control Center</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3" style={{ flexShrink: 0 }}>
        <div
          style={{
            position: 'relative',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '50%',
            color: '#57534E',
          }}
          aria-label="Notifications"
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

        <div className="flex items-center gap-2" style={{ borderLeft: '1px solid #E7E5E4', paddingLeft: '0.75rem' }}>
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
              flexShrink: 0,
            }}
          >
            A
          </div>
          <div className="admin-user-info">
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1C1917', whiteSpace: 'nowrap' }}>
              {user?.name || 'Administrator'}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600 }}>Super Admin</div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 540px) {
          .admin-header-title-suffix {
            display: none;
          }
          .admin-user-info {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};
