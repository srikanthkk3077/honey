import React from 'react';
import { useStore } from '../../../store/store';
import { formatPrice } from '../../../utils/formatPrice';

export const TopProducts: React.FC = () => {
  const { products } = useStore();
  const top = products.slice(0, 4);

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: 'clamp(1rem, 2.5vw, 1.5rem)', border: '1px solid #E7E5E4' }}>
      <h3 style={{ fontSize: '1.15rem', color: '#1C1917', marginBottom: '1.25rem' }}>
        Best Selling Harvests
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {top.map((p) => (
          <div key={p.id} className="flex items-center gap-3">
            <img
              src={p.images[0]}
              alt={p.name}
              style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #E7E5E4', flexShrink: 0 }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#1C1917', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {p.name}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#78716C' }}>
                Stock: <span style={{ color: p.stock < 10 ? '#DC2626' : '#059669', fontWeight: 600 }}>{p.stock} jars left</span>
              </div>
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#D97706' }}>
              {formatPrice(p.price)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
