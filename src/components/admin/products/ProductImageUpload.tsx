import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ProductImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export const ProductImageUpload: React.FC<ProductImageUploadProps> = ({ images, onChange }) => {
  const [urlInput, setUrlInput] = useState('');

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onChange([...images, urlInput.trim()]);
      setUrlInput('');
    }
  };

  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <label style={{ fontSize: '0.88rem', fontWeight: 600, color: '#44403C' }}>
        Product Photographs (URLs)
      </label>

      {/* Existing thumbnails */}
      <div className="flex items-center gap-3 flex-wrap">
        {images.map((img, idx) => (
          <div
            key={idx}
            style={{
              position: 'relative',
              width: '80px',
              height: '80px',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid #D6D3D1',
            }}
          >
            <img src={img} alt={`Preview ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: '#FFFFFF',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>

      {/* Input to add image URL */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="url"
          placeholder="Paste image URL (e.g. Unsplash or CDN link)..."
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          style={{
            flex: 1,
            padding: '0.65rem 0.85rem',
            borderRadius: '10px',
            border: '1px solid #D6D3D1',
            fontSize: '0.85rem',
            outline: 'none',
          }}
        />
        <button
          type="button"
          onClick={handleAddUrl}
          style={{
            padding: '0.65rem 1rem',
            borderRadius: '10px',
            background: '#D97706',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Upload size={14} /> Add Image
        </button>
      </div>
    </div>
  );
};
