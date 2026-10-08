import React from 'react';
import { Product } from '../../../types/product.types';
import { ProductCard } from './ProductCard';
import { ProductCardShimmer } from '../../common/Shimmer';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  layout?: 'grid' | 'list';
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  layout = 'grid',
}) => {
  if (isLoading) {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            layout === 'list'
              ? '1fr'
              : 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '1.25rem',
        }}
      >
        <ProductCardShimmer count={8} />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '4rem 1.5rem',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px dashed #D6D3D1',
        }}
      >
        <span style={{ fontSize: '3rem', display: 'block', marginBottom: '0.75rem' }}>🍯</span>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem', color: '#1C1917', fontFamily: 'var(--font-serif)' }}>
          No honeys found
        </h3>
        <p style={{ color: '#78716C', maxWidth: '400px', margin: '0 auto', fontSize: '0.88rem' }}>
          Try clearing your filters or selecting a different honey category or price range.
        </p>
      </div>
    );
  }

  if (layout === 'list') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} layout="list" />
        ))}
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
        gap: '1.25rem',
      }}
      className="shop-product-grid"
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} layout="grid" />
      ))}
      <style>{`
        @media (min-width: 1200px) {
          .shop-product-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
        @media (min-width: 860px) and (max-width: 1199px) {
          .shop-product-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (min-width: 580px) and (max-width: 859px) {
          .shop-product-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 579px) {
          .shop-product-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
