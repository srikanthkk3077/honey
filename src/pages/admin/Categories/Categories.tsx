import React, { useState } from 'react';
import { useStore } from '../../../store/store';
import { CategoryTable } from '../../../components/admin/categories/CategoryTable';
import { CategoryForm } from '../../../components/admin/categories/CategoryForm';
import { Modal } from '../../../components/common/Modal';
import { Button } from '../../../components/common/Button';
import { Plus } from 'lucide-react';

export const Categories: React.FC = () => {
  const { categories, addCategory, deleteCategory } = useStore();
  const [modalOpen, setModalOpen] = useState(false);

  const handleAddCategory = (data: any) => {
    addCategory(data);
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this honey category?')) {
      deleteCategory(id);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '1.85rem', color: '#1C1917', margin: '0 0 0.25rem 0' }}>
            Honey Collections & Categories
          </h1>
          <p style={{ color: '#78716C', margin: 0, fontSize: '0.9rem' }}>
            Organize raw honey by floral source, harvest season, or medicinal formulation.
          </p>
        </div>

        <Button size="md" leftIcon={<Plus size={16} />} onClick={() => setModalOpen(true)}>
          New Category
        </Button>
      </div>

      <CategoryTable categories={categories} onDelete={handleDelete} />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create New Honey Collection"
      >
        <CategoryForm onSubmit={handleAddCategory} onCancel={() => setModalOpen(false)} />
      </Modal>
    </div>
  );
};
