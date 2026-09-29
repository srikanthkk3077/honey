import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, User as UserIcon, Menu, Search, ShieldCheck } from 'lucide-react';
import { useStore } from '../../../store/store';

export const Header: React.FC = () => {
  const {
    cartCount,
    wishlist,
    user,
    isAuthenticated,
    logout,
    setMobileMenuOpen,
    setCartDrawerOpen
  } = useStore();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop Honey', path: '/shop' },
    { name: 'Our Story', path: '/story' },
    { name: 'About Purity', path: '/about' },
    { name: 'Blog & Recipes', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E7E5E4',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
      }}
    >
      <div className="container" style={{ padding: '0.85rem 1.5rem' }}>
        <div className="flex items-center justify-between">
          {/* Mobile hamburger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                color: '#1C1917',
                cursor: 'pointer',
                padding: '4px',
              }}
              id="mobile-nav-toggle"
              aria-label="Open mobile menu"
            >
              <Menu size={24} />
            </button>

            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #FEF3C7 0%, #F59E0B 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(245, 158, 11, 0.25)',
                }}
              >
                <img src="/icons/bee.svg" alt="Madhuvan Honey" width="28" height="28" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontWeight: 800,
                    fontSize: '1.45rem',
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                    color: '#1C1917',
                  }}
                >
                  MADHUVAN
                </span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.18em',
                    color: '#D97706',
                    textTransform: 'uppercase',
                  }}
                >
                  Raw Forest Honey
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.75rem',
            }}
            id="desktop-nav"
          >
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  style={{
                    fontSize: '0.92rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#D97706' : '#44403C',
                    position: 'relative',
                    padding: '0.25rem 0',
                  }}
                >
                  {link.name}
                  {isActive && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '-2px',
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: '#D97706',
                        borderRadius: '2px',
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-3">
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#44403C',
                padding: '6px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Search honey products"
            >
              <Search size={20} />
            </button>

            {/* Wishlist */}
            <Link
              to="/shop?filter=wishlist"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#44403C',
                padding: '6px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
              }}
              title="Saved items"
            >
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '0px',
                    right: '0px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: '#EF4444',
                    color: '#fff',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => setCartDrawerOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#44403C',
                padding: '6px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
              }}
              title="Shopping cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '0px',
                    right: '0px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #D97706, #B45309)',
                    color: '#fff',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(217, 119, 6, 0.4)',
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account / Admin */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                style={{
                  background: isAuthenticated ? '#FEF3C7' : '#F5F5F4',
                  border: isAuthenticated ? '1px solid #F59E0B' : '1px solid #E7E5E4',
                  cursor: 'pointer',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: isAuthenticated ? '#92400E' : '#44403C',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}
              >
                <UserIcon size={16} />
                <span style={{ maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {isAuthenticated ? user?.name : 'Account'}
                </span>
              </button>

              {profileOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '110%',
                    right: 0,
                    width: '210px',
                    background: '#FFFFFF',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    border: '1px solid #E7E5E4',
                    padding: '0.5rem',
                    zIndex: 60,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  {isAuthenticated ? (
                    <>
                      <div style={{ padding: '0.5rem', borderBottom: '1px solid #F5F5F4' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#1C1917' }}>{user?.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#78716C' }}>{user?.email}</div>
                      </div>
                      <Link
                        to="/orders"
                        onClick={() => setProfileOpen(false)}
                        style={{ padding: '0.5rem', borderRadius: '6px', fontSize: '0.85rem', color: '#44403C' }}
                      >
                        My Orders & Tracking
                      </Link>
                      {user?.role === 'admin' ? (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setProfileOpen(false)}
                          style={{
                            padding: '0.5rem',
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            color: '#065F46',
                            background: '#ECFDF5',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <ShieldCheck size={14} /> Admin Portal
                        </Link>
                      ) : null}
                      <button
                        onClick={() => {
                          logout();
                          setProfileOpen(false);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: '0.5rem',
                          textAlign: 'left',
                          fontSize: '0.85rem',
                          color: '#DC2626',
                          cursor: 'pointer',
                          borderRadius: '6px',
                        }}
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setProfileOpen(false)}
                        style={{ padding: '0.5rem', borderRadius: '6px', fontSize: '0.85rem', color: '#1C1917', fontWeight: 600 }}
                      >
                        Customer Login
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setProfileOpen(false)}
                        style={{ padding: '0.5rem', borderRadius: '6px', fontSize: '0.85rem', color: '#57534E' }}
                      >
                        Create New Account
                      </Link>
                      <div style={{ height: '1px', background: '#E7E5E4', margin: '4px 0' }} />
                      <Link
                        to="/admin/login"
                        onClick={() => setProfileOpen(false)}
                        style={{
                          padding: '0.5rem',
                          borderRadius: '6px',
                          fontSize: '0.82rem',
                          color: '#B45309',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: '#FFFBEB',
                        }}
                      >
                        <ShieldCheck size={14} /> Honey Admin Portal
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search bar dropdown */}
        {searchOpen && (
          <form
            onSubmit={handleSearchSubmit}
            style={{
              marginTop: '0.75rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid #F5F5F4',
              display: 'flex',
              gap: '0.5rem',
            }}
          >
            <input
              type="text"
              placeholder="Search raw forest honey, acacia, tulsi, honeycomb..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
              style={{
                flex: 1,
                padding: '0.65rem 1rem',
                borderRadius: '8px',
                border: '1px solid #D6D3D1',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              style={{
                padding: '0 1.25rem',
                background: '#D97706',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Search
            </button>
          </form>
        )}
      </div>

      <style>{`
        @media (max-width: 920px) {
          #desktop-nav { display: none !important; }
          #mobile-nav-toggle { display: block !important; }
        }
      `}</style>
    </header>
  );
};
