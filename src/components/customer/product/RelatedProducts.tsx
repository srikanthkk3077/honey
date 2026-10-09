import React from 'react';
import { Product } from '../../../types/product.types';
import { ProductCard } from './ProductCard';

interface RelatedProductsProps {
  currentProductId: string;
  allProducts: Product[];
  category: string;
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({
  currentProductId,
  allProducts,
  category,
}) => {
  const related = allProducts
    .filter((p) => p.id !== currentProductId)
    .sort((a, b) => {
      // Prioritise same category
      const aMatch = (typeof a.category === 'string' ? a.category : (a.category as any)?.name || '').toLowerCase() === (typeof category === 'string' ? category : '').toLowerCase() || a.categorySlug === category;
      const bMatch = (typeof b.category === 'string' ? b.category : (b.category as any)?.name || '').toLowerCase() === (typeof category === 'string' ? category : '').toLowerCase() || b.categorySlug === category;
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return 0;
    })
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <div style={{ marginTop: '5rem', paddingTop: '3.5rem', borderTop: '1px solid #E7E5E4' }}>
      <div style={{ marginBottom: '2rem' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Explore More Nectars
        </span>
        <h3 style={{ fontSize: '1.75rem', color: '#1C1917', margin: '4px 0 0 0' }}>
          Pairs Well With Other Raw Varieties
        </h3>
      </div>

      <div className="grid grid-3 gap-6">
        {related.map((prod) => (
          <ProductCard key={prod.id} product={prod} />
        ))}
      </div>
    </div>
  );
};
