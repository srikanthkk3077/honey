import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Layers,
  Settings,
  ArrowLeft,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../../../store/store';

export const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const { logout } = useStore();

  const links = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Honey Products', path: '/admin/products', icon: <Package size={20} /> },
    { name: 'Customer Orders', path: '/admin/orders', icon: <ShoppingBag size={20} /> },
    { name: 'Registered Customers', path: '/admin/customers', icon: <Users size={20} /> },
    { name: 'Categories', path: '/admin/categories', icon: <Layers size={20} /> },
    { name: 'Store Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: '#181511',
        color: '#E7E5E4',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.5rem',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      <div>
        {/* Brand */}
        <div className="flex items-center gap-2" style={{ marginBottom: '2.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #FEF3C7, #F59E0B)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img src="/icons/bee.svg" alt="Madhuvan" width="24" height="24" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 800, fontSize: '1.15rem', color: '#FFFFFF' }}>
              MADHUVAN
            </div>
            <div style={{ fontSize: '0.7rem', color: '#FBBF24', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Admin Console
            </div>
          </div>
        </div>

        {/* Links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          {links.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
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
                  transition: 'all 0.15s',
                }}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer controls */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#FBBF24',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Storefront</span>
        </Link>

        <button
          onClick={logout}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#EF4444',
            fontSize: '0.85rem',
            cursor: 'pointer',
            padding: 0,
            marginTop: '0.25rem',
          }}
        >
          <LogOut size={16} />
          <span>Log Out Admin</span>
        </button>
      </div>
    </aside>
  );
};
