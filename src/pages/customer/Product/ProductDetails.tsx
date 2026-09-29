import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../../../store/store';
import { ProductGallery } from '../../../components/customer/product/ProductGallery';
import { ProductInfo } from '../../../components/customer/product/ProductInfo';
import { ProductReviews } from '../../../components/customer/product/ProductReviews';
import { RelatedProducts } from '../../../components/customer/product/RelatedProducts';
import { ChevronRight, ShieldCheck, Check, Sparkles } from 'lucide-react';

export const ProductDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getProductBySlug, products } = useStore();

  const product = slug ? getProductBySlug(slug) : undefined;

  if (!product) {
    return (
      <div style={{ padding: '6rem 0', textAlign: 'center' }}>
        <div className="container">
          <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '1rem' }}>🍯</span>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem', color: '#1C1917' }}>Honey Harvest Not Found</h2>
          <p style={{ color: '#78716C', marginBottom: '2rem' }}>The product you are looking for may have been retired or out of season.</p>
          <Link
            to="/shop"
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              backgroundColor: '#D97706',
              color: '#FFFFFF',
              fontWeight: 600,
            }}
          >
            Return to Honey Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2.5rem 0 6rem 0', backgroundColor: '#FAF7F2' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2" style={{ fontSize: '0.85rem', color: '#78716C', marginBottom: '2rem' }}>
          <Link to="/" style={{ color: '#78716C' }}>Home</Link>
          <ChevronRight size={14} />
          <Link to="/shop" style={{ color: '#78716C' }}>Shop</Link>
          <ChevronRight size={14} />
          <Link to={`/shop?category=${product.categorySlug}`} style={{ color: '#78716C' }}>{product.category}</Link>
          <ChevronRight size={14} />
          <span style={{ color: '#1C1917', fontWeight: 600 }}>{product.name}</span>
        </div>

        {/* Product Main Showcase */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3.5rem',
            alignItems: 'start',
            backgroundColor: '#FFFFFF',
            borderRadius: '28px',
            padding: '2.5rem',
            border: '1px solid #E7E5E4',
            boxShadow: '0 8px 30px rgba(0,0,0,0.03)',
          }}
        >
          <ProductGallery images={product.images} productName={product.name} />
          <ProductInfo product={product} />
        </div>

        {/* Deep Dive: Story, Benefits, Nutrition */}
        <div
          style={{
            marginTop: '3.5rem',
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '3rem',
            border: '1px solid #E7E5E4',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
            {/* Story & Description */}
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Harvest Heritage
              </span>
              <h3 style={{ fontSize: '1.6rem', color: '#1C1917', margin: '6px 0 1.25rem 0' }}>
                The Forest Sanctuary Story
              </h3>
              <p style={{ color: '#57534E', lineHeight: 1.7, marginBottom: '1.25rem', fontSize: '0.98rem' }}>
                {product.description}
              </p>
              <p style={{ color: '#57534E', lineHeight: 1.7, fontSize: '0.98rem' }}>
                {product.story}
              </p>

              {/* Key Benefits Checklist */}
              <div style={{ marginTop: '2rem' }}>
                <h4 style={{ fontSize: '1.05rem', color: '#1C1917', marginBottom: '1rem' }}>
                  Therapeutic & Bio-Active Qualities:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {product.benefits.map((b, idx) => (
                    <div key={idx} className="flex items-start gap-2" style={{ fontSize: '0.92rem', color: '#44403C' }}>
                      <span style={{ color: '#059669', marginTop: '2px' }}><Check size={18} /></span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Nutrition & Certification Facts */}
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Lab Analysis
              </span>
              <h3 style={{ fontSize: '1.6rem', color: '#1C1917', margin: '6px 0 1.25rem 0' }}>
                Nutritional Composition
              </h3>

              <div
                style={{
                  border: '1px solid #E7E5E4',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  marginBottom: '2rem',
                }}
              >
                <div style={{ backgroundColor: '#FAF7F2', padding: '0.85rem 1.25rem', fontWeight: 700, fontSize: '0.9rem', color: '#1C1917' }}>
                  Typical Values per 100g serving
                </div>
                <div style={{ padding: '0.5rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem' }}>
                  <div className="flex items-center justify-between" style={{ borderBottom: '1px solid #F5F1E9', padding: '0.5rem 0' }}>
                    <span style={{ color: '#78716C' }}>Energy</span>
                    <span style={{ fontWeight: 600, color: '#1C1917' }}>{product.nutritionFacts.energy}</span>
                  </div>
                  <div className="flex items-center justify-between" style={{ borderBottom: '1px solid #F5F1E9', padding: '0.5rem 0' }}>
                    <span style={{ color: '#78716C' }}>Carbohydrates</span>
                    <span style={{ fontWeight: 600, color: '#1C1917' }}>{product.nutritionFacts.carbohydrates}</span>
                  </div>
                  <div className="flex items-center justify-between" style={{ borderBottom: '1px solid #F5F1E9', padding: '0.5rem 0' }}>
                    <span style={{ color: '#78716C' }}>Natural Honey Sugars</span>
                    <span style={{ fontWeight: 600, color: '#1C1917' }}>{product.nutritionFacts.naturalSugars}</span>
                  </div>
                  <div className="flex items-center justify-between" style={{ borderBottom: '1px solid #F5F1E9', padding: '0.5rem 0' }}>
                    <span style={{ color: '#78716C' }}>Protein & Pollen</span>
                    <span style={{ fontWeight: 600, color: '#1C1917' }}>{product.nutritionFacts.proteins}</span>
                  </div>
                  <div className="flex items-center justify-between" style={{ padding: '0.5rem 0' }}>
                    <span style={{ color: '#78716C' }}>Key Bioflavonoids</span>
                    <span style={{ fontWeight: 600, color: '#059669' }}>{product.nutritionFacts.antioxidants}</span>
                  </div>
                </div>
              </div>

              {/* Lab Seal Card */}
              <div
                style={{
                  backgroundColor: '#ECFDF5',
                  border: '1px solid #A7F3D0',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', flexShrink: 0 }}>
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#065F46', fontSize: '0.95rem' }}>Nuclear Magnetic Resonance (NMR) Passed</div>
                  <div style={{ fontSize: '0.8rem', color: '#047857' }}>
                    Guaranteed zero C3 sugarcane, C4 corn syrup, rice syrup, or synthetic invert sugar.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Customer Reviews */}
          <ProductReviews
            productId={product.id}
            reviews={product.reviews}
            rating={product.rating}
          />
        </div>

        {/* Related Honeys */}
        <RelatedProducts
          currentProductId={product.id}
          allProducts={products}
          category={product.category}
        />
      </div>
    </div>
  );
};
