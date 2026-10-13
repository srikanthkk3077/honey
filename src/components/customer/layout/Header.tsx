import React, { useEffect, useState } from 'react';
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
    setCartDrawerOpen,
    settings,
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
    // { name: 'Videos', path: '/videos' },
    // { name: 'Our Story', path: '/story' },
    { name: 'About Purity', path: '/about' },
    // { name: 'Blog & Recipes', path: '/blog' },
    { name: 'Contact', path: '/contact' },
    { name: 'My Orders', path: '/orders' },
  ];

  const isHome = location.pathname === '/';
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor:
          isHome && !isScrolled
            ? settings?.heroConfig?.backgroundColor || '#FDDCC3'
            : '#FFFFFF',
        borderBottom:
          isHome && !isScrolled
            ? '1px solid rgba(154, 70, 22, 0.12)'
            : '1px solid #E7E5E4',
        boxShadow: isScrolled
          ? '0 4px 20px rgba(0,0,0,0.06)'
          : isHome
            ? 'none'
            : '0 1px 3px rgba(0,0,0,0.02)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div className="container header-container" style={{ padding: '0.85rem clamp(0.75rem, 3vw, 1.5rem)' }}>
        <div className="flex items-center justify-between header-row" style={{ minWidth: 0 }}>
          {/* Mobile hamburger */}
          <div className="flex items-center gap-3 header-brand-group" style={{ minWidth: 0, flexShrink: 1 }}>
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

            {/* Brand Logo & Application Name */}
            <Link
              to="/"
              className="flex items-center header-logo-link"
              style={{ textDecoration: 'none', gap: 'clamp(8px, 1.2vw, 12px)', minWidth: 0, flexShrink: 1 }}
              aria-label="Madhuvan Raw Pure Honey Home"
            >
              <img
                src="/icons/madhuvan_bee_logo.svg"
                alt="Madhuvan Honey Logo"
                className="header-bee-logo"
                style={{
                  width: 'clamp(46px, 4.2vw, 56px)',
                  height: 'clamp(46px, 4.2vw, 56px)',
                  objectFit: 'contain',
                  flexShrink: 0,
                  display: 'block',
                  filter: 'drop-shadow(0 2px 8px rgba(199, 122, 18, 0.25))',
                  transition: 'transform 0.25s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              />
              <img
                src="/icons/madhuvan_wordmark.svg"
                alt="Madhuvan Raw Pure Honey"
                className="header-wordmark"
                style={{
                  height: 'clamp(46px, 4.2vw, 56px)',
                  width: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                  flexShrink: 1,
                }}
              />
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
              const isActive =
                location.pathname === link.path ||
                (link.path === '/orders' &&
                  (location.pathname.startsWith('/orders') || location.pathname.startsWith('/track-order')));
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  style={{
                    fontSize: '0.92rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#D97706' : '#292524',
                    position: 'relative',
                    padding: '0.25rem 0',
                    transition: 'color 0.2s ease',
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
          <div className="flex items-center gap-3 header-actions-group" style={{ flexShrink: 0 }}>
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="header-icon-btn header-search-btn"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#292524',
                padding: '6px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
              title="Search honey products"
            >
              <Search size={20} />
            </button>

            {/* Wishlist */}
            <Link
              to="/shop?filter=wishlist"
              className="header-icon-btn header-wishlist-link"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#292524',
                padding: '6px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0,
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
              className="header-icon-btn header-cart-btn"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#292524',
                padding: '6px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0,
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
            <div style={{ position: 'relative', flexShrink: 0 }}>
              {isAuthenticated ? (
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="header-user-btn"
                  style={{
                    background: '#FEF3C7',
                    border: '1px solid #F59E0B',
                    cursor: 'pointer',
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#92400E',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                  }}
                >
                  <UserIcon size={15} />
                  <span className="account-label" style={{ maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.name}
                  </span>
                </button>
              ) : (
                <Link
                  to="/login"
                  id="header-login-btn"
                  className="header-login-btn"
                  style={{
                    background: '#4A1F0A',
                    color: '#FFFFFF',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '7px 20px',
                    borderRadius: '9999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    letterSpacing: '0.02em',
                    textDecoration: 'none',
                    boxShadow: '0 4px 12px rgba(74, 31, 10, 0.22)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#381504')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4A1F0A')}
                >
                  Login
                </Link>
              )}

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
                minWidth: 0,
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
          #mobile-nav-toggle { display: flex !important; }
        }

        /* Tablets & small desktops */
        @media (max-width: 768px) {
          .header-brand-group {
            gap: 8px !important;
          }
          .header-actions-group {
            gap: 8px !important;
          }
          .header-bee-logo {
            width: 42px !important;
            height: 42px !important;
          }
          .header-wordmark {
            height: 38px !important;
          }
        }

        /* Mobile phones (<= 540px) */
        @media (max-width: 540px) {
          .header-container {
            padding: 0.55rem 0.65rem !important;
          }
          .header-row {
            min-width: 0 !important;
            gap: 6px !important;
          }
          .header-brand-group {
            gap: 6px !important;
            min-width: 0 !important;
            flex-shrink: 1 !important;
          }
          .header-logo-link {
            gap: 5px !important;
            min-width: 0 !important;
            flex-shrink: 1 !important;
          }
          #mobile-nav-toggle {
            padding: 2px !important;
            flex-shrink: 0 !important;
          }
          #mobile-nav-toggle svg {
            width: 22px !important;
            height: 22px !important;
          }
          .header-bee-logo {
            width: 34px !important;
            height: 34px !important;
            flex-shrink: 0 !important;
          }
          .header-wordmark {
            height: 28px !important;
            max-width: 105px !important;
            flex-shrink: 1 !important;
          }
          .header-actions-group {
            gap: 4px !important;
            flex-shrink: 0 !important;
          }
          .header-icon-btn {
            padding: 4px !important;
          }
          .header-icon-btn svg {
            width: 19px !important;
            height: 19px !important;
          }
          .account-label { display: none !important; }
          .brand-subtitle { display: none !important; }
          .header-wishlist-link { display: none !important; }
          .header-user-btn {
            padding: 0 !important;
            width: 32px !important;
            height: 32px !important;
            justify-content: center !important;
            gap: 0 !important;
            border-radius: 50% !important;
            flex-shrink: 0 !important;
          }
          #header-login-btn {
            padding: 5px 12px !important;
            font-size: 0.8rem !important;
            flex-shrink: 0 !important;
          }
        }

        /* Narrow mobile screens (<= 380px) */
        @media (max-width: 380px) {
          .header-container {
            padding: 0.5rem 0.4rem !important;
          }
          .header-brand-group {
            gap: 4px !important;
          }
          .header-logo-link {
            gap: 4px !important;
          }
          .header-bee-logo {
            width: 30px !important;
            height: 30px !important;
          }
          .header-wordmark {
            height: 24px !important;
            max-width: 82px !important;
          }
          .header-actions-group {
            gap: 3px !important;
          }
          .header-icon-btn {
            padding: 3px !important;
          }
          .header-icon-btn svg {
            width: 18px !important;
            height: 18px !important;
          }
        }
      `}</style>
    </header>
  );
};
