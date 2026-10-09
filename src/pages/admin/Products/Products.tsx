import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../../store/store';
import { ProductTable } from '../../../components/admin/products/ProductTable';
import { Product } from '../../../types/product.types';
import { Button } from '../../../components/common/Button';
import { Plus, Search } from 'lucide-react';
import { Input } from '../../../components/common/Input';

export const Products: React.FC = () => {
  const { products, deleteProduct } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filtered = products.filter(
    (p) => {
      const catStr = typeof p.category === 'string' ? p.category : (p.category as any)?.name || '';
      const originStr = p.origin || '';
      return (
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        catStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        originStr.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  );

  const handleEdit = (p: Product) => {
    navigate(`/admin/products/edit/${p.id}`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this honey product from store inventory?')) {
      await deleteProduct(id);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '1.85rem', color: '#1C1917', margin: '0 0 0.25rem 0' }}>
            Honey Inventory & Batches
          </h1>
          <p style={{ color: '#78716C', margin: 0, fontSize: '0.9rem' }}>
            Manage listings, stock levels, glass sizes, and laboratory test scores.
          </p>
        </div>

        <Link to="/admin/products/add">
          <Button size="md" leftIcon={<Plus size={16} />}>
            Add New Honey
          </Button>
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          padding: '1rem 1.25rem',
          borderRadius: '14px',
          border: '1px solid #E7E5E4',
          maxWidth: '400px',
        }}
      >
        <Input
          placeholder="Filter by honey name, category, or origin..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<Search size={16} />}
        />
      </div>

      <ProductTable
        products={filtered}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};
