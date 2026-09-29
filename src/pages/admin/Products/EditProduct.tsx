import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../../store/store';
import { ProductForm } from '../../../components/admin/products/ProductForm';

export const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getProductById, updateProduct } = useStore();
  const navigate = useNavigate();

  const product = id ? getProductById(id) : undefined;

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <h3>Product not found</h3>
        <button onClick={() => navigate('/admin/products')}>Back to Inventory</button>
      </div>
    );
  }

  const handleUpdate = (data: any) => {
    if (id) {
      updateProduct(id, data);
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
