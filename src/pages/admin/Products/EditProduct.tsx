import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../../store/store';
import { ProductForm } from '../../../components/admin/products/ProductForm';
import { Product } from '../../../types/product.types';
import productApi from '../../../services/productApi';
import { Loader } from 'lucide-react';

export const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getProductById, updateProduct } = useStore();
  const navigate = useNavigate();
  const [fetchedProduct, setFetchedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const localProduct = id ? getProductById(id) : undefined;
  const product = localProduct || fetchedProduct;

  useEffect(() => {
    if (!localProduct && id) {
      setIsLoading(true);
      productApi
        .getById(id)
        .then(setFetchedProduct)
        .catch(() => {
          return productApi.getBySlug(id).then(setFetchedProduct);
        })
        .catch(() => {})
        .finally(() => setIsLoading(false));
    }
  }, [id, localProduct]);

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 1rem' }}>
        <Loader size={36} color="#D97706" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }} />
        <p style={{ color: '#78716C' }}>Loading product details…</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <h3>Product not found</h3>
        <button
          onClick={() => navigate('/admin/products')}
          style={{
            marginTop: '1rem',
            padding: '8px 16px',
            borderRadius: '10px',
            backgroundColor: '#D97706',
            color: '#FFFFFF',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Back to Inventory
        </button>
      </div>
    );
  }

  const handleUpdate = async (data: any) => {
    // Use the actual product.id (MongoDB _id) instead of the URL param
    // which might be a slug or a different identifier
    const productId = product?.id || id;
    if (productId) {
      await updateProduct(productId, data);
      navigate('/admin/products');
    }
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', color: '#1C1917', margin: '0 0 0.25rem 0' }}>
          Edit {product.name}
        </h1>
        <p style={{ color: '#78716C', margin: 0, fontSize: '0.9rem' }}>
          Update harvest batch notes, sizes, inventory levels, and pricing.
        </p>
      </div>

      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '2rem', border: '1px solid #E7E5E4' }}>
        <ProductForm
          initialData={product}
          isEdit={true}
          onSubmit={handleUpdate}
          onCancel={() => navigate('/admin/products')}
        />
      </div>
    </div>
  );
};
