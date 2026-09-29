import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../../../store/store';
import { ProductCard } from '../product/ProductCard';
import { SectionTitle } from '../../common/SectionTitle';

export const FeaturedProducts: React.FC = () => {
  const { products } = useStore();
  const featured = products.filter((p) => p.isFeatured).slice(0, 4);

  return (
    <section style={{ padding: '5rem 0', backgroundColor: '#FAF7F2' }}>
      <div className="container">
        <div className="flex items-end justify-between flex-wrap gap-4" style={{ marginBottom: '2.5rem' }}>
          <div>
            <SectionTitle
              align="left"
              subtitle="Pure Harvest Reserve"
              title="Signature Raw Honeys"
              description="Cold-extracted, unpasteurized honey directly from indigenous apiaries."
            />
          </div>
          <Link
            to="/shop"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#D97706',
              fontWeight: 700,
              fontSize: '0.95rem',
              marginBottom: '2rem',
            }}
          >
            <span>View All ({products.length}) Varieties</span>
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-4 gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
