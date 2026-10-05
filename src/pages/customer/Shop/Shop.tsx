import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../../../store/store';
import { ProductGrid } from '../../../components/customer/product/ProductGrid';
import { SlidersHorizontal, X, Heart, Leaf, ChevronDown } from 'lucide-react';

export const Shop: React.FC = () => {
  const { products, categories, wishlist, isProductsLoading } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('q') || '';
  const filterParam = searchParams.get('filter') || '';

  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [showOnlyOrganic, setShowOnlyOrganic] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      if (selectedCategory !== 'all') {
        const catSlug = (prod.categorySlug || '').toLowerCase();
        const selCat = selectedCategory.toLowerCase();
        const prodName = (prod.name || '').toLowerCase();
        const catName = (typeof prod.category === 'object' && prod.category !== null ? (prod.category as any).name : prod.category || '').toLowerCase();

        const matchesCategory =
          catSlug === selCat ||
          catSlug.includes(selCat) ||
          selCat.includes(catSlug) ||
          catName.includes(selCat.replace(/-/g, ' ')) ||
          prodName.includes(selCat.replace(/-/g, ' '));

        if (!matchesCategory) return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        if (!prod.name.toLowerCase().includes(query) &&
            !prod.description.toLowerCase().includes(query) &&
            !prod.category.toLowerCase().includes(query)) return false;
      }
      if (filterParam === 'wishlist' && !wishlist.includes(prod.id)) return false;
      if (showOnlyOrganic && !prod.isOrganicCertified) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.isFeatured ? 1 : -1;
    });
  }, [products, selectedCategory, searchQuery, filterParam, wishlist, showOnlyOrganic, sortBy]);

  const handleCategorySelect = (slug: string) => {
    const params = new URLSearchParams(searchParams);
    if (slug === 'all') { params.delete('category'); } else { params.set('category', slug); }
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams());
    setShowOnlyOrganic(false);
  };

  const isFiltered = selectedCategory !== 'all' || searchQuery || filterParam || showOnlyOrganic;

  return (
    <div style={{ backgroundColor: '#F7F3ED', minHeight: '100vh' }}>

      {/* â”€â”€ Hero Banner â”€â”€ */}
      <div style={{
        background: 'linear-gradient(135deg, #1C1209 0%, #3B1F00 40%, #92400E 100%)',
        padding: '3.5rem 0 3rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Honeycomb dots pattern */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.07,
          backgroundImage: 'radial-gradient(circle, #F59E0B 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        {/* Amber glow orb */}
        <div style={{
          position: 'absolute', top: '-60px', right: '10%',
          width: '320px', height: '320px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,158,11,0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p style={{
                fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.18em',
                color: '#FCD34D', textTransform: 'uppercase', marginBottom: '0.5rem',
              }}>
                ðŸ¯ Spring & Autumn Harvests
              </p>
              <h1 style={{
                fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900,
                color: '#FFFFFF', lineHeight: 1.15, marginBottom: '0.6rem',
              }}>
                Pure Raw Honey<br />
                <span style={{ color: '#FCD34D' }}>Collection</span>
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.95rem', maxWidth: '480px' }}>
                Cold-extracted wildflower mono-florals, edible honeycomb frames â€” direct from indigenous apiaries.
              </p>
            </div>
            {/* Stats pills */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {[
                { label: 'Varieties', value: products.length },
                // { label: 'Bestsellers', value: products.filter(p => p.isBestSeller).length },
              ].map(stat => (
                <div key={stat.label} style={{
                  background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '14px', padding: '10px 20px', textAlign: 'center',
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#FCD34D', lineHeight: 1 }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', marginTop: '2px', letterSpacing: '0.05em' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* â”€â”€ Main Layout: Sidebar + Grid â”€â”€ */}
      <div className="container" style={{ padding: '2.5rem 1rem 5rem', display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>

        {/* â”€â”€ Sidebar â”€â”€ */}
        <aside style={{
          width: sidebarOpen ? '240px' : '0',
          flexShrink: 0,
          transition: 'width 0.3s ease',
          overflow: 'hidden',
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid rgba(217,119,6,0.12)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            padding: '1.5rem',
            position: 'sticky',
            top: '90px',
            width: '240px',
          }}>
            {/* Sidebar header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <SlidersHorizontal size={16} color="#fff" />
              </div>
              <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1C1917' }}>Filters</span>
              {isFiltered && (
                <button onClick={handleClearFilters} style={{
                  marginLeft: 'auto', background: 'none', border: 'none',
                  color: '#DC2626', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: '2px',
                }}>
                  <X size={12} /> Clear
                </button>
              )}
            </div>

            {/* Categories */}
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{
                fontSize: '0.68rem', fontWeight: 700, color: '#A8A29E',
                textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.65rem',
              }}>
                Category
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {[{ name: `All Honeys`, slug: 'all', count: products.length }, ...categories.map(c => ({
                  name: c.name, slug: c.slug,
                  count: products.filter(p => {
                    const pSlug = (p.categorySlug || '').toLowerCase();
                    const cSlug = (c.slug || '').toLowerCase();
                    const pName = (p.name || '').toLowerCase();
                    const cClean = (c.name || '').toLowerCase().replace(' honey', '').trim();
                    return pSlug === cSlug || (cClean && pName.includes(cClean));
                  }).length,
                }))].map(cat => {
                  const isActive = cat.slug === 'all'
                    ? selectedCategory === 'all' && filterParam !== 'wishlist'
                    : selectedCategory === cat.slug;
                  return (
                    <button
                      key={cat.slug}
                      onClick={() => handleCategorySelect(cat.slug)}
                      style={{
                        width: '100%', textAlign: 'left',
                        padding: '8px 12px', borderRadius: '10px',
                        border: isActive ? '1.5px solid rgba(217,119,6,0.4)' : '1.5px solid transparent',
                        background: isActive
                          ? 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)'
                          : 'transparent',
                        color: isActive ? '#92400E' : '#57534E',
                        fontWeight: isActive ? 700 : 500,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        transition: 'all 0.18s ease',
                      }}
                      onMouseOver={e => { if (!isActive) e.currentTarget.style.background = '#FAF7F2'; }}
                      onMouseOut={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <span>{cat.name}</span>
                      <span style={{
                        fontSize: '0.7rem', fontWeight: 700,
                        background: isActive ? 'rgba(217,119,6,0.15)' : 'rgba(0,0,0,0.06)',
                        color: isActive ? '#92400E' : '#78716C',
                        padding: '1px 7px', borderRadius: '20px',
                      }}>{cat.count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div style={{ borderTop: '1px solid #F0EBE3', marginBottom: '1.25rem' }} />

            {/* Organic Toggle */}

            {/* Wishlist filter */}
            {wishlist.length > 0 && (
              <>
                <div style={{ borderTop: '1px solid #F0EBE3', marginBottom: '1.25rem' }} />
                <div>
                  <p style={{
                    fontSize: '0.68rem', fontWeight: 700, color: '#A8A29E',
                    textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.65rem',
                  }}>
                    My List
                  </p>
                  <button
                    onClick={() => {
                      const params = new URLSearchParams(searchParams);
                      if (filterParam === 'wishlist') { params.delete('filter'); } else { params.set('filter', 'wishlist'); }
                      setSearchParams(params);
                    }}
                    style={{
                      width: '100%', textAlign: 'left',
                      padding: '8px 12px', borderRadius: '10px',
                      border: filterParam === 'wishlist' ? '1.5px solid rgba(239,68,68,0.4)' : '1.5px solid transparent',
                      background: filterParam === 'wishlist' ? '#FEF2F2' : 'transparent',
                      color: filterParam === 'wishlist' ? '#991B1B' : '#57534E',
                      fontWeight: filterParam === 'wishlist' ? 700 : 500,
                      fontSize: '0.85rem', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      transition: 'all 0.18s ease',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Heart size={13} fill={filterParam === 'wishlist' ? '#EF4444' : 'none'} color={filterParam === 'wishlist' ? '#EF4444' : '#78716C'} />
                      Saved Items
                    </span>
                    <span style={{
                      fontSize: '0.7rem', fontWeight: 700,
                      background: filterParam === 'wishlist' ? 'rgba(239,68,68,0.15)' : 'rgba(0,0,0,0.06)',
                      color: filterParam === 'wishlist' ? '#991B1B' : '#78716C',
                      padding: '1px 7px', borderRadius: '20px',
                    }}>{wishlist.length}</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </aside>

        {/* â”€â”€ Main Content â”€â”€ */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Top Control Bar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '12px',
            background: '#FFFFFF', borderRadius: '16px',
            padding: '0.85rem 1.25rem',
            border: '1px solid rgba(217,119,6,0.1)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            marginBottom: '1.5rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Toggle sidebar button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '6px 12px', borderRadius: '9px',
                  border: '1.5px solid #E7E5E4', background: sidebarOpen ? '#FEF3C7' : '#fff',
                  color: sidebarOpen ? '#92400E' : '#57534E', cursor: 'pointer',
                  fontSize: '0.82rem', fontWeight: 600, transition: 'all 0.2s',
                }}
              >
                <SlidersHorizontal size={14} />
                {sidebarOpen ? 'Hide Filters' : 'Show Filters'}
              </button>

              <span style={{ color: '#78716C', fontSize: '0.88rem' }}>
                Showing <strong style={{ color: '#1C1917' }}>{filteredProducts.length}</strong> varieties
                {searchQuery && <span> for "<strong>{searchQuery}</strong>"</span>}
              </span>

              {isFiltered && (
                <button
                  onClick={handleClearFilters}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    background: '#FEF2F2', border: '1px solid rgba(239,68,68,0.25)',
                    borderRadius: '8px', padding: '4px 10px',
                    color: '#DC2626', fontSize: '0.78rem', fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <X size={12} /> Clear Filters
                </button>
              )}
            </div>

            {/* Sort */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.82rem', color: '#78716C', fontWeight: 500 }}>Sort by</span>
              <div style={{ position: 'relative' }}>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  style={{
                    padding: '7px 32px 7px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid #E7E5E4',
                    background: '#FAFAF9',
                    fontSize: '0.84rem', fontWeight: 600,
                    color: '#1C1917', outline: 'none', cursor: 'pointer',
                    appearance: 'none', WebkitAppearance: 'none',
                  }}
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low â†’ High</option>
                  <option value="price-desc">Price: High â†’ Low</option>
                  <option value="rating">Top Rated</option>
                </select>
                <ChevronDown size={13} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#78716C' }} />
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <ProductGrid products={filteredProducts} isLoading={isProductsLoading} />
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          aside { display: none !important; }
        }
      `}</style>
    </div>
  );
};

