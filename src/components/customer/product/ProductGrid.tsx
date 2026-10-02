import React from 'react';
import { Product } from '../../../types/product.types';
import { ProductCard } from './ProductCard';
import { ProductCardShimmer } from '../../common/Shimmer';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-3 gap-6">
        <ProductCardShimmer count={6} />
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
          borderRadius: '20px',
          border: '1px dashed #D6D3D1',
        }}
      >
        <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🍯</span>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#1C1917' }}>No honeys found</h3>
        <p style={{ color: '#78716C', maxWidth: '400px', margin: '0 auto' }}>
          Try clearing your search query or selecting a different honey category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
