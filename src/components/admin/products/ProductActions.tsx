import React from 'react';
import { Edit2, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductActionsProps {
  slug: string;
  productId: string;
  onEdit: () => void;
  onDelete: () => void;
}

export const ProductActions: React.FC<ProductActionsProps> = ({
  slug,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="flex items-center gap-2">
      <Link
        to={`/product/${slug}`}
        target="_blank"
        style={{
          padding: '6px',
          borderRadius: '6px',
          color: '#57534E',
          background: '#F5F5F4',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title="View on store"
      >
        <Eye size={16} />
      </Link>

      <button
        type="button"
        onClick={onEdit}
        style={{
          padding: '6px',
          borderRadius: '6px',
          color: '#2563EB',
          background: '#EFF6FF',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title="Edit product"
      >
        <Edit2 size={16} />
      </button>

      <button
        type="button"
        onClick={onDelete}
        style={{
          padding: '6px',
          borderRadius: '6px',
          color: '#DC2626',
          background: '#FEF2F2',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title="Delete product"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};
