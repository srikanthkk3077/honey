import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Receipt,
  Users,
  Layers,
  Settings,
  Film,
  SlidersHorizontal,
  X,
  ArrowLeft,
  LogOut,
  MessageSquare,
} from 'lucide-react';
import { useStore } from '../../../store/store';

interface AdminMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminMobileMenu: React.FC<AdminMobileMenuProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { logout } = useStore();

  if (!isOpen) return null;

  const links = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Honey Products', path: '/admin/products', icon: <Package size={20} /> },
    { name: 'Hero & Sliders', path: '/admin/sliders', icon: <SlidersHorizontal size={20} /> },
    { name: 'Videos & Reels', path: '/admin/videos', icon: <Film size={20} /> },
    { name: 'Customer Reviews', path: '/admin/reviews', icon: <MessageSquare size={20} /> },
    { name: 'Customer Orders', path: '/admin/orders', icon: <ShoppingBag size={20} /> },
    { name: 'Transactions', path: '/admin/transactions', icon: <Receipt size={20} /> },
    { name: 'Registered Customers', path: '/admin/customers', icon: <Users size={20} /> },
    { name: 'Categories', path: '/admin/categories', icon: <Layers size={20} /> },
    { name: 'Store Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '280px',
          maxWidth: '85%',
          backgroundColor: '#181511',
          color: '#E7E5E4',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '1.25rem 1.25rem 1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
          <div className="flex items-center justify-between">
            <span style={{ fontWeight: 800, fontSize: '1.15rem', color: '#FFFFFF', fontFamily: 'var(--font-serif)' }}>
              MADHUVAN ADMIN
            </span>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Nav */}
        <nav
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            padding: '1rem 0.85rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
          }}
        >
          {links.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  fontSize: '0.92rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#FFFFFF' : '#A8A29E',
                  backgroundColor: isActive ? '#D97706' : 'transparent',
                }}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer controls */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            padding: '1rem 1.25rem 1.25rem 1.25rem',
            backgroundColor: '#181511',
            flexShrink: 0,
          }}
        >
          <Link to="/" onClick={onClose} style={{ color: '#FBBF24', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: 600 }}>
            <ArrowLeft size={16} /> Back to Storefront
          </Link>
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', padding: 0 }}
          >
            <LogOut size={16} /> Log Out Admin
          </button>
        </div>
      </div>
    </div>
  );
};
