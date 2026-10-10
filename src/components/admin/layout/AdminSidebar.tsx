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
  ArrowLeft,
  LogOut,
  ShieldCheck,
  MessageSquare,
} from 'lucide-react';
import { useStore } from '../../../store/store';

export const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const { logout } = useStore();

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
    <aside
      className="admin-sidebar"
      style={{
        width: '260px',
        backgroundColor: '#181511',
        color: '#E7E5E4',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        maxHeight: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        borderRight: '1px solid rgba(255,255,255,0.08)',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <style>{`
        .admin-sidebar-nav {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.18) transparent;
        }
        .admin-sidebar-nav::-webkit-scrollbar {
          width: 5px;
        }
        .admin-sidebar-nav::-webkit-scrollbar-track {
          background: transparent;
        }
        .admin-sidebar-nav::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.18);
          border-radius: 10px;
        }
        .admin-sidebar-nav::-webkit-scrollbar-thumb:hover {
          background: #D97706;
        }
        .admin-nav-item:hover {
          background-color: rgba(255, 255, 255, 0.06) !important;
          color: #FFFFFF !important;
        }
      `}</style>

      {/* Brand Header - Fixed at Top */}
      <div
        style={{
          padding: '1.25rem 1.25rem 1rem 1.25rem',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          flexShrink: 0,
        }}
      >
        <div className="flex items-center gap-2">
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #FEF3C7, #F59E0B)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <img src="/icons/bee.svg" alt="Madhuvan" width="24" height="24" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 800, fontSize: '1.15rem', color: '#FFFFFF', lineHeight: 1.2 }}>
              MADHUVAN
            </div>
            <div style={{ fontSize: '0.7rem', color: '#FBBF24', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Admin Console
            </div>
          </div>
        </div>
      </div>

      {/* Nav Links - Scrollable Container */}
      <nav
        className="admin-sidebar-nav"
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '0.85rem 0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
        }}
      >
        {links.map((link) => {
          const isActive = location.pathname.startsWith(link.path);
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`admin-nav-item ${isActive ? 'active' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '0.7rem 0.85rem',
                borderRadius: '10px',
                fontSize: '0.9rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#FFFFFF' : '#A8A29E',
                backgroundColor: isActive ? '#D97706' : 'transparent',
                transition: 'all 0.15s ease',
                flexShrink: 0,
              }}
            >
              {link.icon}
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer controls - Fixed at Bottom */}
      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: '1rem 1.25rem 1.15rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          flexShrink: 0,
          backgroundColor: '#181511',
        }}
      >
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#FBBF24',
            fontSize: '0.85rem',
            fontWeight: 600,
            textDecoration: 'none',
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
            marginTop: '0.15rem',
          }}
        >
          <LogOut size={16} />
          <span>Log Out Admin</span>
        </button>
      </div>
    </aside>
  );
};
