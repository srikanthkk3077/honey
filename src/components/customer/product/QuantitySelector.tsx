import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  max?: number;
  size?: 'sm' | 'md';
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onDecrease,
  onIncrease,
  max = 99,
  size = 'md',
}) => {
  const isSm = size === 'sm';

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        border: '1.5px solid #E7E5E4',
        borderRadius: '10px',
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
      }}
    >
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= 1}
        style={{
          width: isSm ? '28px' : '36px',
          height: isSm ? '28px' : '36px',
          border: 'none',
          background: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
          color: quantity <= 1 ? '#D6D3D1' : '#44403C',
        }}
      >
        <Minus size={isSm ? 12 : 15} />
      </button>

      <span
        style={{
          width: isSm ? '28px' : '36px',
          textAlign: 'center',
          fontSize: isSm ? '0.85rem' : '0.95rem',
          fontWeight: 700,
          color: '#1C1917',
        }}
      >
        {quantity}
      </span>

      <button
        type="button"
        onClick={onIncrease}
        disabled={quantity >= max}
        style={{
          width: isSm ? '28px' : '36px',
          height: isSm ? '28px' : '36px',
          border: 'none',
          background: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: quantity >= max ? 'not-allowed' : 'pointer',
          color: quantity >= max ? '#D6D3D1' : '#44403C',
        }}
      >
        <Plus size={isSm ? 12 : 15} />
      </button>
    </div>
  );
};
