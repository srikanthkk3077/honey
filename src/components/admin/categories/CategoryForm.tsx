import React, { useState } from 'react';
import { Category } from '../../../types/product.types';
import { Input } from '../../common/Input';
import { Button } from '../../common/Button';

interface CategoryFormProps {
  onSubmit: (data: Omit<Category, 'id' | 'productCount'>) => void;
  onCancel: () => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80');

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(val.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-'));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name,
      slug: slug || name.toLowerCase().replace(/ +/g, '-'),
      description,
      image,
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <Input
        label="Category Name"
        required
        value={name}
        onChange={(e) => handleNameChange(e.target.value)}
        placeholder="e.g. Rare Mountain Monofloral"
      />

      <Input
        label="Category Slug"
        required
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        placeholder="rare-mountain-monofloral"
      />

      <Input
        label="Banner Image URL"
        required
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <div>
        <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#44403C', marginBottom: '0.35rem' }}>
          Short Description
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of the honey collection..."
          style={{ width: '100%', padding: '0.65rem 0.95rem', borderRadius: '10px', border: '1px solid #D6D3D1', outline: 'none', fontFamily: 'inherit' }}
        />
      </div>

      <div className="flex items-center justify-end gap-3" style={{ borderTop: '1px solid #E7E5E4', paddingTop: '1rem' }}>
        <Button variant="ghost" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" size="md">
          Save Category
        </Button>
      </div>
    </form>
  );
};
