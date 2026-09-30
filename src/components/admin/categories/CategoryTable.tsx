import React from 'react';
import { Category } from '../../../types/product.types';
import { Trash2 } from 'lucide-react';

interface CategoryTableProps {
  categories: Category[];
  onDelete: (id: string) => void;
}

export const CategoryTable: React.FC<CategoryTableProps> = ({ categories, onDelete }) => {
  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E7E5E4', overflow: 'hidden' }}>
      <div className="table-responsive" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid #E7E5E4', color: '#57534E' }}>
              <th style={{ padding: '1rem' }}>Category</th>
              <th style={{ padding: '1rem' }}>Slug</th>
              <th style={{ padding: '1rem' }}>Description</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} style={{ borderBottom: '1px solid #F5F1E9' }}>
                <td style={{ padding: '1rem' }}>
                  <div className="flex items-center gap-3">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                    <span style={{ fontWeight: 700, color: '#1C1917' }}>{cat.name}</span>
                  </div>
                </td>
                <td style={{ padding: '1rem', color: '#78716C', fontFamily: 'monospace' }}>
                  {cat.slug}
                </td>
                <td style={{ padding: '1rem', color: '#57534E', maxWidth: '300px' }}>
                  {cat.description}
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <button
                    onClick={() => onDelete(cat.id)}
                    style={{
                      padding: '6px',
                      borderRadius: '6px',
                      background: '#FEF2F2',
                      border: 'none',
                      color: '#DC2626',
                      cursor: 'pointer',
                    }}
                    title="Delete Category"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
