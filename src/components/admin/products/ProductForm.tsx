import React, { useState } from 'react';
import { Product, ProductSizeOption } from '../../../types/product.types';
import { useStore } from '../../../store/store';
import { Input } from '../../common/Input';
import { Button } from '../../common/Button';
import { ProductImageUpload } from './ProductImageUpload';
import { Plus, Trash2, Package, Sparkles, Layers, RotateCcw } from 'lucide-react';

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

  // ─── Dynamic Size Options State ──────────────────────────────────────────────
  const [sizes, setSizes] = useState<ProductSizeOption[]>(() => {
    if (initialData?.sizes && initialData.sizes.length > 0) {
      return initialData.sizes.map((s) => ({
        size: s.size || '',
        price: Number(s.price) || 0,
        originalPrice: Number(s.originalPrice) || Number(s.price) || 0,
        stock: Number(s.stock) || 10,
        sku: s.sku || '',
      }));
    }
    const p = parseFloat(initialData?.price ? String(initialData.price) : '599');
    const origP = parseFloat(initialData?.originalPrice ? String(initialData.originalPrice) : '799');
    const stk = parseInt(initialData?.stock ? String(initialData.stock) : '40', 10);
    return [
      { size: '250g', price: Math.round(p * 0.65), originalPrice: Math.round(origP * 0.65), stock: 20, sku: 'MV-250G' },
      { size: '500g', price: p, originalPrice: origP, stock: stk, sku: 'MV-500G' },
      { size: '1kg', price: Math.round(p * 1.8), originalPrice: Math.round(origP * 1.8), stock: 15, sku: 'MV-1KG' },
    ];
  });

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

  // ─── Size Option Handlers ───────────────────────────────────────────────────
  const handleSizeChange = (index: number, field: keyof ProductSizeOption, value: any) => {
    setSizes((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };

      // If user updates price on first size, sync main price
      if (index === 0 && field === 'price' && value) {
        setPrice(String(value));
      }
      if (index === 0 && field === 'originalPrice' && value) {
        setOriginalPrice(String(value));
      }
      return updated;
    });
  };

  const handleAddSize = () => {
    const currentPrice = parseFloat(price) || 599;
    const currentOrigPrice = parseFloat(originalPrice) || 799;
    setSizes((prev) => [
      ...prev,
      {
        size: '',
        price: currentPrice,
        originalPrice: currentOrigPrice,
        stock: 20,
        sku: `MV-${(slug || 'HONEY').slice(0, 4).toUpperCase()}-${prev.length + 1}`,
      },
    ]); 
  };

  const handleRemoveSize = (index: number) => {
    if (sizes.length <= 1) {
      
      alert('A product must have at least one selectable size.');
      return;
    }
    setSizes((prev) => prev.filter((_, i) => i !== index));
  };

  // Preset size templates
  const applyPreset = (preset: 'standard' | 'honeycomb' | 'mini' | 'single') => {
    const p = parseFloat(price) || 599;
    const origP = parseFloat(originalPrice) || 799;

    if (preset === 'standard') {
      setSizes([
        { size: '250g', price: Math.round(p * 0.65), originalPrice: Math.round(origP * 0.65), stock: 20, sku: 'MV-250G' },
        { size: '500g', price: p, originalPrice: origP, stock: parseInt(stock, 10) || 40, sku: 'MV-500G' },
        { size: '1kg', price: Math.round(p * 1.8), originalPrice: Math.round(origP * 1.8), stock: 15, sku: 'MV-1KG' },
      ]);
    } else if (preset === 'honeycomb') {
      setSizes([
        { size: '350g Comb', price: 899, originalPrice: 1199, stock: 25, sku: 'MV-COMB-350' },
        { size: '700g Comb', price: 1699, originalPrice: 2199, stock: 15, sku: 'MV-COMB-700' },
      ]);
      setPrice('899');
      setOriginalPrice('1199');
    } else if (preset === 'mini') {
      setSizes([
        { size: '50g Sampler', price: 149, originalPrice: 199, stock: 50, sku: 'MV-50G' },
        { size: '100g Jar', price: 249, originalPrice: 329, stock: 40, sku: 'MV-100G' },
        { size: '250g Jar', price: 449, originalPrice: 599, stock: 30, sku: 'MV-250G' },
      ]);
      setPrice('149');
      setOriginalPrice('199');
    } else if (preset === 'single') {
      setSizes([
        { size: '500g Jar', price: p, originalPrice: origP, stock: parseInt(stock, 10) || 40, sku: 'MV-500G' },
      ]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate sizes
    if (sizes.length === 0) {
      alert('Please add at least one selectable size variant for this product.');
      return;
    }

    const emptySize = sizes.find((s) => !s.size || !s.size.trim());
    if (emptySize) {
      alert('Please enter a size label (e.g. "250g", "500g", "350g Comb") for all size rows.');
      return;
    }

    const catObj = categories.find((c) => c.name === category);

    // Clean and validate sizes
    const cleanedSizes: ProductSizeOption[] = sizes.map((s) => ({
      size: s.size.trim(),
      price: Math.max(0, parseFloat(String(s.price)) || 0),
      originalPrice: Math.max(0, parseFloat(String(s.originalPrice)) || parseFloat(String(s.price)) || 0),
      stock: Math.max(0, parseInt(String(s.stock), 10) || 0),
      sku: s.sku.trim() || `MV-${(slug || name).slice(0, 3).toUpperCase()}-${s.size.replace(/\D/g, '') || 'STD'}`,
    }));

    // Derive primary price & use the typed total stock directly
    const p = cleanedSizes[0]?.price || parseFloat(price) || 599;
    const origP = cleanedSizes[0]?.originalPrice || parseFloat(originalPrice) || 799;
    const totalStock = parseInt(stock, 10) || 0;

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
      stock: totalStock,
      origin,
      nectarSource,
      harvestSeason,
      purityScore: parseFloat(purityScore) || 99.8,
      isFeatured,
      isBestSeller,
      isOrganicCertified,
      images,
      rating: initialData?.rating || 4.9,
      reviewsCount: initialData?.reviewsCount || 1,
      selectedSize: cleanedSizes[0]?.size || '500g',
      sizes: cleanedSizes,
      benefits: initialData?.benefits || [
        '100% Raw and unheated enzymatically active nectar',
        'Certified zero adulteration or C3/C4 sugars',
        'Rich in natural bee propolis and trace minerals',
      ],
      nutritionFacts: initialData?.nutritionFacts || {
        energy: '304 kcal per 100g',
        carbohydrates: '82.4g',
        naturalSugars: '80.1g',
        proteins: '0.3g',
        antioxidants: 'Rich in polyphenols',
      },
      reviews: initialData?.reviews || [],
    };

    onSubmit(productPayload);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* ── Basic Info ──────────────────────────────────────────────────────── */}
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
            fontSize: '0.9rem',
          }}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* ── Base Pricing & Inventory Preview ─────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 130px), 1fr))', gap: '1rem' }}>
        <Input
          label="Base Price (₹)"
          required
          type="number"
          value={price}
          onChange={(e) => {
            setPrice(e.target.value);
            if (sizes[0]) {
              handleSizeChange(0, 'price', parseFloat(e.target.value) || 0);
            }
          }}
        />
        <Input
          label="Base Original MRP (₹)"
          required
          type="number"
          value={originalPrice}
          onChange={(e) => {
            setOriginalPrice(e.target.value);
            if (sizes[0]) {
              handleSizeChange(0, 'originalPrice', parseFloat(e.target.value) || 0);
            }
          }}
        />
        <Input
          label="Total Stock (units)"
          required
          type="number"
          value={stock}
          onChange={(e) => {
            const newTotal = e.target.value;
            setStock(newTotal);
            // Distribute new total across size variants proportionally
            const parsed = parseInt(newTotal, 10);
            if (!isNaN(parsed) && parsed >= 0 && sizes.length > 0) {
              const currentSum = sizes.reduce((s, sz) => s + (sz.stock || 0), 0);
              setSizes((prev) =>
                prev.map((sz, i) => ({
                  ...sz,
                  stock:
                    currentSum > 0
                      ? Math.max(0, Math.round((sz.stock / currentSum) * parsed))
                      : i === 0
                      ? parsed
                      : 0,
                }))
              );
            }
          }}
        />
      </div>

      {/* ── Dynamic Product Size Options Manager ─────────────────────────────── */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '1.25rem',
          border: '1.5px solid #FDE68A',
          boxShadow: '0 4px 15px rgba(217, 119, 6, 0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '0.75rem' }}>
          <div className="flex items-center gap-2">
            <div style={{ padding: '6px', backgroundColor: '#FEF3C7', color: '#D97706', borderRadius: '8px' }}>
              <Package size={20} />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#1C1917', fontWeight: 800 }}>
                Select Size Variants ({sizes.length})
              </h4>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#78716C' }}>
                Admin handles all sizes here. These exact size buttons will appear for customers on the storefront & product page.
              </p>
            </div>
          </div>

          {/* Quick Presets */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: '#78716C', fontWeight: 600 }}>Presets:</span>
            <button
              type="button"
              onClick={() => applyPreset('standard')}
              style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #D6D3D1', backgroundColor: '#FAF7F2', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
            >
              250g / 500g / 1kg
            </button>
            <button
              type="button"
              onClick={() => applyPreset('honeycomb')}
              style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #D6D3D1', backgroundColor: '#FAF7F2', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
            >
              Honeycomb Comb
            </button>
            <button
              type="button"
              onClick={() => applyPreset('single')}
              style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #D6D3D1', backgroundColor: '#FAF7F2', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
            >
              Single Size Only
            </button>
          </div>
        </div>

        {/* Live Preview of Size Pills */}
        <div style={{ backgroundColor: '#FAF7F2', padding: '10px 14px', borderRadius: '10px', marginBottom: '1rem', border: '1px solid #E7E5E4' }}>
          <div style={{ fontSize: '0.75rem', color: '#78716C', marginBottom: '6px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Customer Storefront Preview:
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {sizes.map((s, idx) => (
              <span
                key={idx}
                style={{
                  padding: '4px 10px',
                  borderRadius: '8px',
                  backgroundColor: idx === 0 ? '#FEF3C7' : '#FFFFFF',
                  border: idx === 0 ? '1.5px solid #D97706' : '1px solid #D6D3D1',
                  color: idx === 0 ? '#92400E' : '#1C1917',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>{s.size || `Size #${idx + 1}`}</span>
                <span style={{ color: '#D97706', fontSize: '0.75rem' }}>₹{s.price}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Sizes Editable Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {sizes.map((s, index) => (
            <div
              key={index}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr)) 40px',
                gap: '8px',
                alignItems: 'end',
                padding: '10px',
                backgroundColor: '#FAF7F2',
                borderRadius: '10px',
                border: '1px solid #E7E5E4',
              }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#44403C', marginBottom: '2px' }}>
                  Size Name *
                </label>
                <input
                  type="text"
                  value={s.size}
                  onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
                  placeholder="e.g. 500g or 350g Comb"
                  style={{ width: '100%', padding: '7px 9px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#44403C', marginBottom: '2px' }}>
                  Price (₹) *
                </label>
                <input
                  type="number"
                  value={s.price}
                  onChange={(e) => handleSizeChange(index, 'price', parseFloat(e.target.value) || 0)}
                  placeholder="599"
                  style={{ width: '100%', padding: '7px 9px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#44403C', marginBottom: '2px' }}>
                  MRP (₹)
                </label>
                <input
                  type="number"
                  value={s.originalPrice}
                  onChange={(e) => handleSizeChange(index, 'originalPrice', parseFloat(e.target.value) || 0)}
                  placeholder="799"
                  style={{ width: '100%', padding: '7px 9px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#44403C', marginBottom: '2px' }}>
                  Stock (Units)
                </label>
                <input
                  type="number"
                  value={s.stock}
                  onChange={(e) => handleSizeChange(index, 'stock', parseInt(e.target.value, 10) || 0)}
                  placeholder="20"
                  style={{ width: '100%', padding: '7px 9px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#44403C', marginBottom: '2px' }}>
                  SKU (Optional)
                </label>
                <input
                  type="text"
                  value={s.sku}
                  onChange={(e) => handleSizeChange(index, 'sku', e.target.value)}
                  placeholder="MV-500G"
                  style={{ width: '100%', padding: '7px 9px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '36px' }}>
                <button
                  type="button"
                  onClick={() => handleRemoveSize(index)}
                  disabled={sizes.length <= 1}
                  title={sizes.length <= 1 ? 'Minimum 1 size required' : 'Delete this size'}
                  style={{
                    backgroundColor: '#FEF2F2',
                    border: '1px solid #FECACA',
                    color: '#DC2626',
                    borderRadius: '8px',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: sizes.length <= 1 ? 'not-allowed' : 'pointer',
                    opacity: sizes.length <= 1 ? 0.4 : 1,
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Size Button */}
        <div style={{ marginTop: '0.85rem' }}>
          <button
            type="button"
            onClick={handleAddSize}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              backgroundColor: '#FFFBEB',
              border: '1.5px dashed #F59E0B',
              borderRadius: '8px',
              color: '#92400E',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            <Plus size={16} /> Add Another Size Variant
          </button>
        </div>
      </div>

      {/* ── Product Description ─────────────────────────────────────────────── */}
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

      {/* ── Origin, Nectar, Harvest ─────────────────────────────────────────── */}
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

      {/* ── Checkboxes ──────────────────────────────────────────────────────── */}
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

      {/* ── Form Buttons ────────────────────────────────────────────────────── */}
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
