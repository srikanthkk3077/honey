import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useStore } from '../../../store/store';
import { ProductGrid } from '../../../components/customer/product/ProductGrid';
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  LayoutGrid,
  List,
  Leaf,
  ShieldCheck,
  FlaskConical,
  Truck,
  Heart,
  Droplet,
  ArrowRight,
} from 'lucide-react';
import { DEFAULT_SHOP_CONFIG } from '../../../types/customer.types';

// Price range options matching reference design
interface PriceRangeOption {
  id: string;
  label: string;
  min: number;
  max: number;
}

const PRICE_RANGES: PriceRangeOption[] = [
  { id: 'under-500', label: 'Under ₹500', min: 0, max: 500 },
  { id: '501-1000', label: '₹501 – ₹1,000', min: 501, max: 1000 },
  { id: '1001-1500', label: '₹1,001 – ₹1,500', min: 1001, max: 1500 },
  { id: '1501-2000', label: '₹1,501 – ₹2,000', min: 1501, max: 2000 },
  { id: 'above-2000', label: 'Above ₹2,000', min: 2001, max: Infinity },
];

export const Shop: React.FC = () => {
  const { products, categories, wishlist, isProductsLoading, settings } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL query state
  const selectedCategory = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('q') || '';
  const filterParam = searchParams.get('filter') || '';
  const priceParam = searchParams.get('price') || '';

  // Local UI state
  const [sortBy, setSortBy] = useState<'best-selling' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('best-selling');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Shop configuration from store settings (managed by admin!)
  const shopConfig = settings?.shopConfig || DEFAULT_SHOP_CONFIG;

  // Helper: check if product price falls within selected price range
  const matchesPrice = (productPrice: number, rangeId: string) => {
    if (!rangeId) return true;
    const range = PRICE_RANGES.find((r) => r.id === rangeId);
    if (!range) return true;
    return productPrice >= range.min && productPrice <= range.max;
  };

  // Filter & sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((prod) => {
        // Category match
        if (selectedCategory !== 'all') {
          const catSlug = (prod.categorySlug || '').toLowerCase();
          const selCat = selectedCategory.toLowerCase();
          const prodName = (prod.name || '').toLowerCase();
          const catName = (
            typeof prod.category === 'object' && prod.category !== null
              ? (prod.category as any).name
              : prod.category || ''
          ).toLowerCase();

          const matchesCategory =
            catSlug === selCat ||
            catSlug.includes(selCat) ||
            selCat.includes(catSlug) ||
            catName.includes(selCat.replace(/-/g, ' ')) ||
            prodName.includes(selCat.replace(/-/g, ' '));

          if (!matchesCategory) return false;
        }

        // Search match
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const catStr = typeof prod.category === 'string' ? prod.category : (prod.category as any)?.name || '';
          if (
            !prod.name.toLowerCase().includes(query) &&
            !prod.description.toLowerCase().includes(query) &&
            !catStr.toLowerCase().includes(query)
          ) {
            return false;
          }
        }

        // Wishlist match
        if (filterParam === 'wishlist' && !wishlist.includes(prod.id)) {
          return false;
        }

        // Price range match (using primary price)
        if (priceParam && !matchesPrice(prod.price, priceParam)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        // 'best-selling' default
        if (a.isBestSeller && !b.isBestSeller) return -1;
        if (!a.isBestSeller && b.isBestSeller) return 1;
        return (b.reviewsCount || 0) - (a.reviewsCount || 0);
      });
  }, [products, selectedCategory, searchQuery, filterParam, priceParam, wishlist, sortBy]);

  // Handlers for URL filters
  const handleCategorySelect = (slug: string) => {
    const params = new URLSearchParams(searchParams);
    if (slug === 'all') {
      params.delete('category');
    } else {
      params.set('category', slug);
    }
    setSearchParams(params);
  };

  const handlePriceSelect = (rangeId: string) => {
    const params = new URLSearchParams(searchParams);
    if (priceParam === rangeId) {
      params.delete('price');
    } else {
      params.set('price', rangeId);
    }
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const isFiltered =
    selectedCategory !== 'all' || Boolean(searchQuery) || Boolean(filterParam) || Boolean(priceParam);

  const selectedCategoryLabel = useMemo(() => {
    if (selectedCategory === 'all') return 'All Honeys';
    const cat = categories.find((c) => c.slug === selectedCategory);
    return cat ? cat.name : selectedCategory.replace(/-/g, ' ');
  }, [categories, selectedCategory]);

  const selectedPriceLabel = useMemo(() => {
    if (!priceParam) return '';
    const r = PRICE_RANGES.find((item) => item.id === priceParam);
    return r ? r.label : '';
  }, [priceParam]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    categories.forEach((c) => {
      counts[c.slug] = products.filter((p) => {
        const pSlug = (p.categorySlug || '').toLowerCase();
        const cSlug = (c.slug || '').toLowerCase();
        const pName = (p.name || '').toLowerCase();
        const cClean = (c.name || '').toLowerCase().replace(' honey', '').trim();
        return pSlug === cSlug || (cClean && pName.includes(cClean));
      }).length;
    });
    return counts;
  }, [categories, products]);

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', color: '#1C1917' }}>
      {/* ─── Hero Banner ──────────────────────────────────────────────────────── */}
      {shopConfig.heroBannerMode === 'static' ? (
        <section
          style={{
            position: 'relative',
            backgroundColor: '#F5ECE1',
            borderBottom: '1px solid #EBE4D8',
            overflow: 'hidden',
          }}
        >
          <img
            src={shopConfig.heroBackgroundImageUrl || '/images/shop/shop_hero_banner_clean.png'}
            alt="Shop Honey Banner"
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '340px',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </section>
      ) : (
        <section
          style={{
            position: 'relative',
            backgroundColor: '#FAF7F2',
            backgroundImage: `linear-gradient(to right, #FAF7F2 0%, rgba(250, 247, 242, 0.98) 25%, rgba(250, 247, 242, 0.85) 36%, rgba(250, 247, 242, 0.25) 46%, rgba(250, 247, 242, 0) 54%, transparent 100%), url('${shopConfig.heroBackgroundImageUrl || shopConfig.heroGraphicUrl || '/images/shop/shop_hero_bg_jar_forest.jpg'}')`,
            backgroundSize: 'cover',
            backgroundPosition: shopConfig.heroBgPosition === 'center' ? 'center center' : shopConfig.heroBgPosition === 'left' ? 'center left' : 'center right',
            backgroundRepeat: 'no-repeat',
            borderBottom: '1px solid #EBE4D8',
            overflow: 'hidden',
            padding: '2.5rem 0',
          }}
        >
          {/* Subtle decorative honeycomb in top left */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '180px',
              height: '100%',
              backgroundImage: "url('/images/shop/top_left_leaf_decor.png')",
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'left top',
              backgroundSize: 'contain',
              opacity: 0.65,
              pointerEvents: 'none',
            }}
          />

          <div className="container" style={{ position: 'relative', zIndex: 2 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '2rem',
              }}
            >
              {/* Left Content */}
              <div style={{ maxWidth: '620px', padding: '0.5rem 0' }}>
                <p
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    letterSpacing: '0.22em',
                    color: '#2E7D32',
                    textTransform: 'uppercase',
                    marginBottom: '0.65rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>{shopConfig.eyebrow}</span>
                </p>

                <h1
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(2.1rem, 4.5vw, 3.2rem)',
                    fontWeight: 800,
                    color: '#29180E',
                    lineHeight: 1.15,
                    margin: '0 0 0.75rem 0',
                  }}
                >
                  {shopConfig.title}
                </h1>

                <p
                  style={{
                    color: '#57534E',
                    fontSize: '1rem',
                    lineHeight: 1.5,
                    margin: '0 0 1.5rem 0',
                    maxWidth: '520px',
                  }}
                >
                  {shopConfig.subtitle}
                </p>

                {/* 3 Trust badges row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    flexWrap: 'wrap',
                  }}
                >
                  {shopConfig.trustBadges.map((badge, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          border: '1.5px solid #2E7D32',
                          backgroundColor: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#2E7D32',
                          flexShrink: 0,
                        }}
                      >
                        {idx === 0 ? (
                          <Leaf size={16} />
                        ) : idx === 1 ? (
                          <ShieldCheck size={16} />
                        ) : (
                          <Droplet size={16} />
                        )}
                      </div>
                      <div style={{ lineHeight: 1.15 }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1C1917' }}>
                          {badge.title}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#78716C', fontWeight: 500 }}>
                          {badge.subtitle}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Script Text or Watermark */}
              {shopConfig.heroScriptText && (
                <div
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    padding: '0.75rem 1.5rem',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontStyle: 'italic',
                      fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)',
                      color: '#92400E',
                      fontWeight: 700,
                      letterSpacing: '0.02em',
                      textShadow: '0 1px 3px rgba(255,255,255,0.9)',
                    }}
                  >
                    {shopConfig.heroScriptText}
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ─── Main Content Layout ──────────────────────────────────────────────── */}
      <div className="container" style={{ padding: '2rem 1rem 4rem' }}>
        <div style={{ display: 'flex', gap: '1.75rem', alignItems: 'flex-start' }}>

          {/* ─── Left Sidebar (Filters) ─── */}
          <aside
            style={{
              width: '240px',
              flexShrink: 0,
              position: 'sticky',
              top: '85px',
            }}
            className="shop-desktop-sidebar"
          >
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #EAE6DF',
                boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
                padding: '1.25rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
              }}
            >
              {/* Sidebar Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '0.85rem',
                  borderBottom: '1px solid #F3EFEA',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      backgroundColor: '#D97706',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <SlidersHorizontal size={14} color="#FFFFFF" />
                  </div>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1C1917' }}>
                    Filters
                  </span>
                </div>

                {isFiltered && (
                  <button
                    onClick={handleClearFilters}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#DC2626',
                      cursor: 'pointer',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px',
                    }}
                  >
                    <X size={12} /> Clear
                  </button>
                )}
              </div>

              {/* ── Category Section ── */}
              <div>
                <p
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#78716C',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: '0.65rem',
                  }}
                >
                  CATEGORY
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  {/* "All Honeys" option */}
                  {(() => {
                    const isActive = selectedCategory === 'all' && filterParam !== 'wishlist';
                    return (
                      <button
                        key="all"
                        onClick={() => handleCategorySelect('all')}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '7px 10px',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: isActive ? '#FDE68A' : 'transparent',
                          color: isActive ? '#78350F' : '#44403C',
                          fontWeight: isActive ? 700 : 500,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'background-color 0.15s ease',
                        }}
                        onMouseOver={(e) => {
                          if (!isActive) e.currentTarget.style.backgroundColor = '#FAF6F0';
                        }}
                        onMouseOut={(e) => {
                          if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              width: '14px',
                              height: '14px',
                              borderRadius: '50%',
                              border: isActive ? '4px solid #D97706' : '1.5px solid #D6D3D1',
                              backgroundColor: '#FFFFFF',
                              display: 'inline-block',
                              boxSizing: 'border-box',
                            }}
                          />
                          <span>All Honeys</span>
                        </span>
                        <span
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            backgroundColor: isActive ? 'rgba(217,119,6,0.18)' : '#F5F5F4',
                            color: isActive ? '#78350F' : '#78716C',
                            padding: '1px 7px',
                            borderRadius: '12px',
                          }}
                        >
                          {categoryCounts.all || products.length}
                        </span>
                      </button>
                    );
                  })()}

                  {/* Dynamic Categories from DB */}
                  {categories.map((cat) => {
                    const isActive = selectedCategory === cat.slug;
                    const count = categoryCounts[cat.slug] || 0;
                    return (
                      <button
                        key={cat.id || cat.slug}
                        onClick={() => handleCategorySelect(cat.slug)}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '7px 10px',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: isActive ? '#FDE68A' : 'transparent',
                          color: isActive ? '#78350F' : '#44403C',
                          fontWeight: isActive ? 700 : 500,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'background-color 0.15s ease',
                        }}
                        onMouseOver={(e) => {
                          if (!isActive) e.currentTarget.style.backgroundColor = '#FAF6F0';
                        }}
                        onMouseOut={(e) => {
                          if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              width: '14px',
                              height: '14px',
                              borderRadius: '50%',
                              border: isActive ? '4px solid #D97706' : '1.5px solid #D6D3D1',
                              backgroundColor: '#FFFFFF',
                              display: 'inline-block',
                              boxSizing: 'border-box',
                            }}
                          />
                          <span>{cat.name}</span>
                        </span>
                        <span
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            backgroundColor: isActive ? 'rgba(217,119,6,0.18)' : '#F5F5F4',
                            color: isActive ? '#78350F' : '#78716C',
                            padding: '1px 7px',
                            borderRadius: '12px',
                          }}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Price Range Section ── */}
              <div style={{ paddingTop: '0.75rem', borderTop: '1px solid #F3EFEA' }}>
                <p
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#78716C',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: '0.65rem',
                  }}
                >
                  PRICE RANGE
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {PRICE_RANGES.map((range) => {
                    const isSelected = priceParam === range.id;
                    return (
                      <button
                        key={range.id}
                        onClick={() => handlePriceSelect(range.id)}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '6px 8px',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: isSelected ? '#FAF6F0' : 'transparent',
                          color: isSelected ? '#78350F' : '#44403C',
                          fontWeight: isSelected ? 700 : 500,
                          fontSize: '0.81rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          transition: 'background-color 0.15s ease',
                        }}
                      >
                        <span
                          style={{
                            width: '14px',
                            height: '14px',
                            borderRadius: '50%',
                            border: isSelected ? '4px solid #D97706' : '1.5px solid #D6D3D1',
                            backgroundColor: '#FFFFFF',
                            display: 'inline-block',
                            boxSizing: 'border-box',
                          }}
                        />
                        <span>{range.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Wishlist Saved Items Filter (if any) ── */}
              {wishlist.length > 0 && (
                <div style={{ paddingTop: '0.75rem', borderTop: '1px solid #F3EFEA' }}>
                  <button
                    onClick={() => {
                      const params = new URLSearchParams(searchParams);
                      if (filterParam === 'wishlist') {
                        params.delete('filter');
                      } else {
                        params.set('filter', 'wishlist');
                      }
                      setSearchParams(params);
                    }}
                    style={{
                      width: '100%',
                      padding: '7px 10px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: filterParam === 'wishlist' ? '#FEE2E2' : 'transparent',
                      color: filterParam === 'wishlist' ? '#DC2626' : '#57534E',
                      fontWeight: filterParam === 'wishlist' ? 700 : 500,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Heart
                        size={14}
                        fill={filterParam === 'wishlist' ? '#DC2626' : 'none'}
                        color={filterParam === 'wishlist' ? '#DC2626' : '#57534E'}
                      />
                      <span>Saved Favorites</span>
                    </span>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        backgroundColor: filterParam === 'wishlist' ? '#FECACA' : '#F5F5F4',
                        color: filterParam === 'wishlist' ? '#991B1B' : '#78716C',
                        padding: '1px 7px',
                        borderRadius: '12px',
                      }}
                    >
                      {wishlist.length}
                    </span>
                  </button>
                </div>
              )}

              {/* ── Sidebar Promo Card (Admin customizable!) ── */}
              {shopConfig.sidebarPromo?.isActive !== false && (
                <div
                  style={{
                    position: 'relative',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    marginTop: '0.5rem',
                    height: '110px',
                    backgroundImage: `url(${shopConfig.sidebarPromo?.imageUrl || '/images/shop/sidebar_promo.png'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      textShadow: '0 1px 3px rgba(0,0,0,0.6)',
                      lineHeight: 1.2,
                      margin: 0,
                      maxWidth: '120px',
                    }}
                  >
                    {shopConfig.sidebarPromo?.title || 'Pure Honey\nBetter Health'}
                  </p>

                  <Link
                    to={shopConfig.sidebarPromo?.linkUrl || '/about'}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: 'rgba(45, 24, 16, 0.85)',
                      backdropFilter: 'blur(4px)',
                      color: '#FFFFFF',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '20px',
                      textDecoration: 'none',
                      width: 'fit-content',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <span>{shopConfig.sidebarPromo?.buttonText || 'Learn More →'}</span>
                  </Link>
                </div>
              )}
            </div>
          </aside>

          {/* ─── Main Products Section ─── */}
          <main style={{ flex: 1, minWidth: 0 }}>
            {/* ── Top Controls Bar ── */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #EAE6DF',
                padding: '0.65rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '1.25rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              }}
            >
              {/* Left Controls: Grid/List switch + Active Chips */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                {/* Mobile Filter Button (screens < 1024px) */}
                <button
                  onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                  style={{
                    display: 'none',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '5px 10px',
                    borderRadius: '8px',
                    border: '1px solid #D6D3D1',
                    backgroundColor: '#FAF6F0',
                    color: '#78350F',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                  className="shop-mobile-filter-btn"
                >
                  <SlidersHorizontal size={14} />
                  <span>Filters</span>
                </button>

                {/* View toggle (Grid / List) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <button
                    onClick={() => setViewMode('grid')}
                    title="Grid View"
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: viewMode === 'grid' ? '#FAF6F0' : 'transparent',
                      color: viewMode === 'grid' ? '#78350F' : '#A8A29E',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    title="List View"
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: viewMode === 'list' ? '#FAF6F0' : 'transparent',
                      color: viewMode === 'list' ? '#78350F' : '#A8A29E',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <List size={17} />
                  </button>
                </div>

                {/* Active Filter Pill Chip */}
                {selectedCategory !== 'all' ? (
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      backgroundColor: '#FAF6F0',
                      border: '1px solid #EAE0D0',
                      padding: '3px 9px',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#78350F',
                    }}
                  >
                    <span>{selectedCategoryLabel}</span>
                    <button
                      onClick={() => handleCategorySelect('all')}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        color: '#78350F',
                      }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      backgroundColor: '#FAF6F0',
                      border: '1px solid #EAE0D0',
                      padding: '3px 9px',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#78350F',
                    }}
                  >
                    <span>All Honeys</span>
                    <span style={{ fontSize: '0.7rem', color: '#A8A29E' }}>✕</span>
                  </div>
                )}

                {/* Price Filter Chip */}
                {priceParam && (
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      backgroundColor: '#FAF6F0',
                      border: '1px solid #EAE0D0',
                      padding: '3px 9px',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#78350F',
                    }}
                  >
                    <span>{selectedPriceLabel}</span>
                    <button
                      onClick={() => handlePriceSelect(priceParam)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        color: '#78350F',
                      }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>

              {/* Right Controls: Sort By dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.82rem', color: '#78716C', fontWeight: 500 }}>
                  Sort by
                </span>
                <div style={{ position: 'relative' }}>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    style={{
                      padding: '6px 28px 6px 10px',
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB',
                      backgroundColor: '#FFFFFF',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: '#1C1917',
                      outline: 'none',
                      cursor: 'pointer',
                      appearance: 'none',
                      WebkitAppearance: 'none',
                    }}
                  >
                    <option value="best-selling">Best Selling</option>
                    <option value="price-asc">Price: Low → High</option>
                    <option value="price-desc">Price: High → Low</option>
                    <option value="rating">Top Rated</option>
                    <option value="newest">Newest</option>
                  </select>
                  <ChevronDown
                    size={14}
                    style={{
                      position: 'absolute',
                      right: '9px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                      color: '#78716C',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Mobile Drawer (visible when mobileFilterOpen is true) */}
            {mobileFilterOpen && (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #EAE6DF',
                  padding: '1rem',
                  marginBottom: '1.25rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>Filters</span>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#78716C' }}
                  >
                    <X size={16} />
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '0.75rem' }}>
                  <button
                    onClick={() => { handleCategorySelect('all'); setMobileFilterOpen(false); }}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: '1px solid #D6D3D1',
                      backgroundColor: selectedCategory === 'all' ? '#FDE68A' : '#FFF',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    All Honeys
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id || c.slug}
                      onClick={() => { handleCategorySelect(c.slug); setMobileFilterOpen(false); }}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        border: '1px solid #D6D3D1',
                        backgroundColor: selectedCategory === c.slug ? '#FDE68A' : '#FFF',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Product Grid ── */}
            <ProductGrid
              products={filteredProducts}
              isLoading={isProductsLoading}
              layout={viewMode}
            />
          </main>
        </div>

        {/* ─── Bottom Trust Banner ────────────────────────────────────────────── */}
        <div
          style={{
            marginTop: '3.5rem',
            backgroundColor: '#F5ECE1',
            borderRadius: '16px',
            border: '1px solid #EBE4D8',
            padding: '1.5rem 2rem',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative Honeycomb & Leaves at Bottom-Right */}
          <div
            style={{
              position: 'absolute',
              right: '0',
              bottom: '0',
              width: '130px',
              height: '95px',
              backgroundImage: "url('/images/shop/bottom_right_leaf.png')",
              backgroundSize: 'contain',
              backgroundPosition: 'right bottom',
              backgroundRepeat: 'no-repeat',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1.5rem',
              alignItems: 'center',
              position: 'relative',
              zIndex: 2,
              paddingRight: '60px',
            }}
          >
            {shopConfig.bottomTrustItems.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    border: '1.5px solid #2E7D32',
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2E7D32',
                    flexShrink: 0,
                  }}
                >
                  {idx === 0 ? (
                    <Leaf size={18} />
                  ) : idx === 1 ? (
                    <FlaskConical size={18} />
                  ) : idx === 2 ? (
                    <Truck size={18} />
                  ) : (
                    <ShieldCheck size={18} />
                  )}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      color: '#1C1917',
                      lineHeight: 1.2,
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      fontSize: '0.74rem',
                      color: '#78716C',
                      fontWeight: 500,
                    }}
                  >
                    {item.subtitle}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 1024px) {
          .shop-desktop-sidebar {
            display: none !important;
          }
          .shop-mobile-filter-btn {
            display: inline-flex !important;
          }
        }
      `}</style>
    </div>
  );
};
