import React, { useState } from 'react';
import { Product } from '../../../types/product.types';
import { useStore } from '../../../store/store';
import { Input } from '../../common/Input';
import { Button } from '../../common/Button';
import { ProductImageUpload } from './ProductImageUpload';

interface ProductFormProps {
  initialData?: Partial<Product>;
  onSubmit: (data: Omit<Product, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEdit = false,
}) => {
  const { categories } = useStore();

  const [name, setName] = useState(initialData?.name || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [tagline, setTagline] = useState(initialData?.tagline || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [story, setStory] = useState(initialData?.story || '');
  const [category, setCategory] = useState(initialData?.category || categories[0]?.name || 'Wild Forest Honey');
  const [price, setPrice] = useState(initialData?.price ? String(initialData.price) : '599');
  const [originalPrice, setOriginalPrice] = useState(initialData?.originalPrice ? String(initialData.originalPrice) : '799');
  const [stock, setStock] = useState(initialData?.stock ? String(initialData.stock) : '40');
  const [origin, setOrigin] = useState(initialData?.origin || 'Uttarakhand Himalayan Foothills');
  const [nectarSource, setNectarSource] = useState(initialData?.nectarSource || 'Wild Forest Flora');
  const [harvestSeason, setHarvestSeason] = useState(initialData?.harvestSeason || 'Spring Harvest');
  const [purityScore, setPurityScore] = useState(initialData?.purityScore ? String(initialData.purityScore) : '99.8');
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured ?? true);
  const [isBestSeller, setIsBestSeller] = useState(initialData?.isBestSeller ?? false);
  const [isOrganicCertified, setIsOrganicCertified] = useState(initialData?.isOrganicCertified ?? true);
  const [images, setImages] = useState<string[]>(
    initialData?.images && initialData.images.length > 0
      ? initialData.images
      : ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80']
  );

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEdit && !slug) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^\w ]+/g, '')
          .replace(/ +/g, '-')
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const catObj = categories.find((c) => c.name === category);
    const p = parseFloat(price);
    const origP = parseFloat(originalPrice);

    const productPayload: Omit<Product, 'id' | 'createdAt'> = {
      name,
      slug: slug || name.toLowerCase().replace(/ +/g, '-'),
      tagline,
      description,
      story,
      category,
      categorySlug: catObj?.slug || 'wild-forest-honey',
      price: p,
      originalPrice: origP,
      discountPercent: origP > p ? Math.round(((origP - p) / origP) * 100) : 0,
      stock: parseInt(stock, 10),
      origin,
      nectarSource,
      harvestSeason,
      purityScore: parseFloat(purityScore),
      isFeatured,
      isBestSeller,
      isOrganicCertified,
      images,
      rating: initialData?.rating || 4.9,
      reviewsCount: initialData?.reviewsCount || 1,
      selectedSize: '500g',
      sizes: [
        { size: '250g', price: Math.round(p * 0.6), originalPrice: Math.round(origP * 0.6), stock: 20, sku: `MV-${slug.slice(0, 3).toUpperCase()}-250` },
        { size: '500g', price: p, originalPrice: origP, stock: parseInt(stock, 10), sku: `MV-${slug.slice(0, 3).toUpperCase()}-500` },
        { size: '1kg', price: Math.round(p * 1.8), originalPrice: Math.round(origP * 1.8), stock: 15, sku: `MV-${slug.slice(0, 3).toUpperCase()}-1000` }
      ],
      benefits: [
        '100% Raw and unheated enzymatically active nectar',
        'Certified zero adulteration or C3/C4 sugars',
        'Rich in natural bee propolis and trace minerals'
      ],
      nutritionFacts: {
        energy: '304 kcal per 100g',
        carbohydrates: '82.4g',
        naturalSugars: '80.1g',
        proteins: '0.3g',
        antioxidants: 'Rich in polyphenols'
      },
      reviews: initialData?.reviews || []
    };

    onSubmit(productPayload);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        <Input
          label="Product Name"
          required
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="e.g. Madhuvan Sundarbans Wild Honey"
        />

        <Input
          label="URL Slug"
          required
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="sundarbans-wild-honey"
        />
      </div>

      <Input
        label="Short Tagline"
        required
        value={tagline}
        onChange={(e) => setTagline(e.target.value)}
        placeholder="Dark, multi-floral raw honey from deep forest reserves"
      />

      <div>
        <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#44403C', marginBottom: '0.35rem' }}>
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            width: '100%',
            padding: '0.65rem 0.95rem',
            borderRadius: '10px',
            border: '1px solid #D6D3D1',
            background: '#FFFFFF',
            outline: 'none',
          }}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 130px), 1fr))', gap: '1rem' }}>
        <Input
          label="Price (₹)"
          required
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <Input
          label="Original MRP (₹)"
          required
          type="number"
          value={originalPrice}
          onChange={(e) => setOriginalPrice(e.target.value)}
        />
        <Input
          label="Current Stock"
          required
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#44403C', marginBottom: '0.35rem' }}>
          Product Description
        </label>
        <textarea
          rows={3}
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: '100%', boxSizing: 'border-box', padding: '0.65rem 0.95rem', borderRadius: '10px', border: '1px solid #D6D3D1', outline: 'none', fontFamily: 'inherit' }}
        />
      </div>

      <ProductImageUpload images={images} onChange={setImages} />

      {/* Origin, Nectar, Harvest */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '1rem' }}>
        <Input
          label="Harvest Origin"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
        />
        <Input
          label="Nectar Source"
          value={nectarSource}
          onChange={(e) => setNectarSource(e.target.value)}
        />
        <Input
          label="Purity Score (%)"
          type="number"
          step="0.1"
          value={purityScore}
          onChange={(e) => setPurityScore(e.target.value)}
        />
      </div>

      {/* Checkboxes */}
      <div className="flex items-center gap-4 flex-wrap" style={{ marginTop: '0.5rem' }}>
        <label className="flex items-center gap-2" style={{ cursor: 'pointer', fontSize: '0.9rem' }}>
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            style={{ accentColor: '#D97706', width: '16px', height: '16px' }}
          />
          <span>Featured on Home</span>
        </label>

        <label className="flex items-center gap-2" style={{ cursor: 'pointer', fontSize: '0.9rem' }}>
          <input
            type="checkbox"
            checked={isBestSeller}
            onChange={(e) => setIsBestSeller(e.target.checked)}
            style={{ accentColor: '#D97706', width: '16px', height: '16px' }}
          />
          <span>Bestseller Tag</span>
        </label>

        <label className="flex items-center gap-2" style={{ cursor: 'pointer', fontSize: '0.9rem' }}>
          <input
            type="checkbox"
            checked={isOrganicCertified}
            onChange={(e) => setIsOrganicCertified(e.target.checked)}
            style={{ accentColor: '#D97706', width: '16px', height: '16px' }}
          />
          <span>100% Raw Certified</span>
        </label>
      </div>

      {/* Form Buttons */}
      <div className="flex items-center justify-end gap-3 flex-wrap" style={{ marginTop: '1rem', borderTop: '1px solid #E7E5E4', paddingTop: '1.25rem' }}>
        <Button variant="ghost" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" size="md">
          {isEdit ? 'Update Honey Product' : 'Publish Product'}
        </Button>
      </div>
    </form>
  );
};
