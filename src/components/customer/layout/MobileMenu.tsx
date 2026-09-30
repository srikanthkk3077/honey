import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, ShieldCheck, Heart, ShoppingBag, Phone, MapPin } from 'lucide-react';
import { useStore } from '../../../store/store';
import { CONTACT_INFO } from '../../../utils/constants';

export const MobileMenu: React.FC = () => {
  const { mobileMenuOpen, setMobileMenuOpen, cartCount, wishlist, isAuthenticated, user, logout } = useStore();
  const location = useLocation();

  if (!mobileMenuOpen) return null;

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Shop Honey', path: '/shop' },
    { name: 'Ayurveda & Purity', path: '/about' },
    { name: 'Contact Apiary', path: '/contact' },
    ...(isAuthenticated ? [{ name: 'My Orders & Tracking', path: '/orders' }] : [{ name: 'Track Order', path: '/track-order' }]),
    { name: 'Apiary Videos', path: '/videos' },
    { name: 'Our Story & Hives', path: '/story' },
    { name: 'Honey Recipes & Blog', path: '/blog' },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        backgroundColor: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={() => setMobileMenuOpen(false)}
    >
      <div
        style={{
          width: '85%',
          maxWidth: '340px',
          height: '100%',
          backgroundColor: '#FFFFFF',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflowY: 'auto',
          animation: 'slideInLeft 0.25s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between" style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #E7E5E4' }}>
            <div className="flex items-center gap-2">
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #FEF3C7, #F59E0B)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img src="/icons/bee.svg" alt="Madhuvan" width="24" height="24" />
              </div>
              <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 800, fontSize: '1.25rem' }}>MADHUVAN</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              style={{ background: 'none', border: 'none', padding: '6px', cursor: 'pointer' }}
            >
              <X size={22} />
            </button>
          </div>

          {/* Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#D97706' : '#1C1917',
                    background: isActive ? '#FEF3C7' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  {link.name}
                  {link.path === '/shop' && cartCount > 0 && (
                    <span style={{ background: '#D97706', color: '#fff', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px' }}>
                      {cartCount} in cart
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom profile / admin */}
        <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid #E7E5E4', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ fontSize: '0.82rem', color: '#78716C', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Phone size={14} /> {CONTACT_INFO.phone}
          </div>
          <div style={{ fontSize: '0.82rem', color: '#78716C', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={14} /> Uttarakhand Apiaries
          </div>

          <Link
            to="/admin/login"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: '0.65rem 1rem',
              borderRadius: '8px',
              background: '#FFFBEB',
              border: '1px solid #FDE68A',
              color: '#92400E',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <ShieldCheck size={16} /> Admin Portal
          </Link>

          {isAuthenticated ? (
            <button
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              style={{
                padding: '0.65rem',
                borderRadius: '8px',
                border: '1px solid #EF4444',
                color: '#EF4444',
                background: 'transparent',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Sign Out ({user?.name})
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                padding: '0.65rem',
                borderRadius: '8px',
                background: '#1C1917',
                color: '#FFFFFF',
                textAlign: 'center',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              Customer Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
