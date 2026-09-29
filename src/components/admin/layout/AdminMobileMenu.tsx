import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Layers,
  Settings,
  Film,
  X,
  ArrowLeft,
  LogOut,
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
    { name: 'Customer Orders', path: '/admin/orders', icon: <ShoppingBag size={20} /> },
    { name: 'Videos & Reels', path: '/admin/videos', icon: <Film size={20} /> },
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
          backgroundColor: '#181511',
          color: '#E7E5E4',
          height: '100%',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <div className="flex items-center justify-between" style={{ marginBottom: '2rem' }}>
            <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#FFFFFF', fontFamily: 'var(--font-serif)' }}>
              MADHUVAN ADMIN
            </span>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
              <X size={22} />
            </button>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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
                    fontSize: '0.95rem',
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
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
          <Link to="/" onClick={onClose} style={{ color: '#FBBF24', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowLeft size={16} /> Storefront
          </Link>
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};
