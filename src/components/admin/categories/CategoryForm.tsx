import React, { useState, useRef } from 'react';
import { Category } from '../../../types/product.types';
import { Input } from '../../common/Input';
import { Button } from '../../common/Button';
import { UploadCloud, Image as ImageIcon, Loader2, X, Link as LinkIcon } from 'lucide-react';
import { uploadImage } from '../../../services/uploadApi';

interface CategoryFormProps {
  onSubmit: (data: Omit<Category, 'id' | 'productCount'>) => void;
  onCancel: () => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ onSubmit, onCancel }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80');
  const [isUploading, setIsUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(val.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-'));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    setUploadError(null);
    setIsUploading(true);
    try {
      const url = await uploadImage(file);
      setImage(url);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
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

      {/* Category Banner Image Upload */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
          <label style={{ fontSize: '0.88rem', fontWeight: 600, color: '#44403C' }}>
            Category Banner Image
          </label>
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            style={{
              fontSize: '0.78rem',
              color: '#D97706',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: 600,
            }}
          >
            <LinkIcon size={12} />
            {showUrlInput ? 'Use file uploader' : 'Paste image URL instead'}
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {!showUrlInput ? (
          <div
            onClick={() => !isUploading && fileInputRef.current?.click()}
            style={{
              border: '2px dashed #CBD5E1',
              borderRadius: '12px',
              backgroundColor: '#F8FAFC',
              padding: '1.25rem',
              textAlign: 'center',
              cursor: isUploading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
            }}
          >
            {isUploading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#92400E', fontWeight: 600 }}>
                <Loader2 size={20} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                <span>Uploading category banner...</span>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <UploadCloud size={24} color="#D97706" />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 600, color: '#1C1917', fontSize: '0.9rem' }}>
                    Click to upload banner image
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                    PNG, JPG, WEBP up to 20MB
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Input
            label=""
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://..."
          />
        )}

        {uploadError && (
          <div style={{ color: '#DC2626', fontSize: '0.8rem', marginTop: '0.35rem' }}>
            {uploadError}
          </div>
        )}

        {/* Banner Preview */}
        {image && (
          <div
            style={{
              marginTop: '0.75rem',
              position: 'relative',
              borderRadius: '10px',
              overflow: 'hidden',
              height: '100px',
              border: '1px solid #E2E8F0',
            }}
          >
            <img src={image} alt="Category preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#44403C', marginBottom: '0.35rem' }}>
          Short Description
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of the honey collection..."
          style={{ width: '100%', boxSizing: 'border-box', padding: '0.65rem 0.95rem', borderRadius: '10px', border: '1px solid #D6D3D1', outline: 'none', fontFamily: 'inherit' }}
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
