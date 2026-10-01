import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../../store/store';
import { ProductForm } from '../../../components/admin/products/ProductForm';

export const AddProduct: React.FC = () => {
  const { addProduct } = useStore();
  const navigate = useNavigate();

  const handleAdd = async (data: any) => {
    await addProduct(data);
    navigate('/admin/products');
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', color: '#1C1917', margin: '0 0 0.25rem 0' }}>
          List New Raw Honey Harvest
        </h1>
        <p style={{ color: '#78716C', margin: 0, fontSize: '0.9rem' }}>
          Add details about origin, floral source, lab purity, pricing, and packaging.
        </p>
      </div>

      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '2rem', border: '1px solid #E7E5E4' }}>
        <ProductForm onSubmit={handleAdd} onCancel={() => navigate('/admin/products')} />
      </div>
    </div>
  );
};
