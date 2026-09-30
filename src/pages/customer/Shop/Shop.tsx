import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../../../store/store';
import { ProductGrid } from '../../../components/customer/product/ProductGrid';
import { SectionTitle } from '../../../components/common/SectionTitle';
import { Filter, Search, X } from 'lucide-react';

export const Shop: React.FC = () => {
  const { products, categories, wishlist } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('q') || '';
  const filterParam = searchParams.get('filter') || '';

  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [showOnlyOrganic, setShowOnlyOrganic] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Category filter
      if (selectedCategory !== 'all' && prod.categorySlug !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = prod.name.toLowerCase().includes(query);
        const matchesDesc = prod.description.toLowerCase().includes(query);
        const matchesCat = prod.category.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }
      // Wishlist filter
      if (filterParam === 'wishlist' && !wishlist.includes(prod.id)) {
        return false;
      }
      // Organic flag
      if (showOnlyOrganic && !prod.isOrganicCertified) {
        return false;
      }
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
    if (slug === 'all') {
      params.delete('category');
    } else {
      params.set('category', slug);
    }
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams());
    setShowOnlyOrganic(false);
  };

  return (
    <div style={{ padding: '3.5rem 0 6rem 0', backgroundColor: '#FAF7F2' }}>
      <div className="container">
        {/* Page Title */}
        <SectionTitle
          subtitle="Spring & Autumn Harvests"
          title={filterParam === 'wishlist' ? 'Your Saved Honeys' : 'Pure Raw Honey Collection'}
          description="Browse lab-certified unprocessed forest honeys, wildflower mono-florals, and edible honeycomb frames."
        />

        {/* Filter Navigation Bar */}
        <div
          className="shop-filter-bar"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            padding: '1.25rem 1.5rem',
            border: '1px solid #E7E5E4',
            marginBottom: '2.5rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {/* Categories Horizontal Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleCategorySelect('all')}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '0.88rem',
                fontWeight: selectedCategory === 'all' && filterParam !== 'wishlist' ? 700 : 500,
                border: selectedCategory === 'all' && filterParam !== 'wishlist' ? '1.5px solid #D97706' : '1px solid #E7E5E4',
                background: selectedCategory === 'all' && filterParam !== 'wishlist' ? '#FEF3C7' : '#FFFFFF',
                color: selectedCategory === 'all' && filterParam !== 'wishlist' ? '#92400E' : '#57534E',
                cursor: 'pointer',
              }}
            >
              All Honeys ({products.length})
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.slug)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontWeight: selectedCategory === cat.slug ? 700 : 500,
                  border: selectedCategory === cat.slug ? '1.5px solid #D97706' : '1px solid #E7E5E4',
                  background: selectedCategory === cat.slug ? '#FEF3C7' : '#FFFFFF',
                  color: selectedCategory === cat.slug ? '#92400E' : '#57534E',
                  cursor: 'pointer',
                }}
              >
                {cat.name}
              </button>
            ))}

            {wishlist.length > 0 && (
              <button
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.set('filter', 'wishlist');
                  setSearchParams(params);
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontWeight: filterParam === 'wishlist' ? 700 : 500,
                  border: filterParam === 'wishlist' ? '1.5px solid #EF4444' : '1px solid #E7E5E4',
                  background: filterParam === 'wishlist' ? '#FEF2F2' : '#FFFFFF',
                  color: filterParam === 'wishlist' ? '#991B1B' : '#57534E',
                  cursor: 'pointer',
                }}
              >
                ❤️ Saved Items ({wishlist.length})
              </button>
            )}
          </div>

          {/* Secondary Controls: Search, Sort, Organic toggle */}
          <div className="flex items-center justify-between flex-wrap gap-4" style={{ borderTop: '1px solid #F5F1E9', paddingTop: '1rem' }}>
            <div className="flex items-center gap-4 flex-wrap">
              {/* Organic toggle */}
              <label className="flex items-center gap-2" style={{ cursor: 'pointer', fontSize: '0.88rem', color: '#44403C' }}>
                <input
                  type="checkbox"
                  checked={showOnlyOrganic}
                  onChange={(e) => setShowOnlyOrganic(e.target.checked)}
                  style={{ accentColor: '#059669', width: '16px', height: '16px' }}
                />
                <span>NMR Certified Raw Only</span>
              </label>

              {(selectedCategory !== 'all' || searchQuery || filterParam || showOnlyOrganic) && (
                <button
                  onClick={handleClearFilters}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#DC2626',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <X size={14} /> Clear Active Filters
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span style={{ fontSize: '0.85rem', color: '#78716C' }}>Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D6D3D1',
                  background: '#FFFFFF',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated (4.8+)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div style={{ marginBottom: '1.5rem', color: '#78716C', fontSize: '0.9rem' }}>
          Showing <strong>{filteredProducts.length}</strong> raw honey varieties
          {searchQuery && <span> matching "<strong>{searchQuery}</strong>"</span>}
        </div>

        {/* Product Grid */}
        <ProductGrid products={filteredProducts} />
      </div>

      <style>{`
        @media (max-width: 640px) {
          .shop-filter-bar {
            padding: 1rem !important;
            border-radius: 16px !important;
          }
        }
      `}</style>
    </div>
  );
};
