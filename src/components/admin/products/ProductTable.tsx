import React from 'react';
import { Product } from '../../../types/product.types';
import { formatPrice } from '../../../utils/formatPrice';
import { Badge } from '../../common/Badge';
import { ProductActions } from './ProductActions';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({ products, onEdit, onDelete }) => {
  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E7E5E4', overflow: 'hidden' }}>
      <div className="table-responsive" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid #E7E5E4', color: '#57534E' }}>
              <th style={{ padding: '1rem' }}>Product</th>
              <th style={{ padding: '1rem' }}>Category</th>
              <th style={{ padding: '1rem' }}>Price</th>
              <th style={{ padding: '1rem' }}>Stock</th>
              <th style={{ padding: '1rem' }}>Purity Score</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid #F5F1E9' }}>
                <td style={{ padding: '1rem' }}>
                  <div className="flex items-center gap-3">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #E7E5E4' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, color: '#1C1917' }}>{p.name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#78716C' }}>{p.origin}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#44403C' }}>{p.category}</span>
                </td>
                <td style={{ padding: '1rem', fontWeight: 700, color: '#1C1917' }}>
                  {formatPrice(p.price)}
                </td>
                <td style={{ padding: '1rem' }}>
                  <span
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: p.stock > 10 ? '#059669' : '#DC2626',
                    }}
                  >
                    {p.stock} units
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <Badge variant="green" size="sm">
                    {p.purityScore}% NMR
                  </Badge>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <ProductActions
                      slug={p.slug}
                      productId={p.id}
                      onEdit={() => onEdit(p)}
                      onDelete={() => onDelete(p.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
