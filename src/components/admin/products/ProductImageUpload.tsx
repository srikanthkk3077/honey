import React, { useState, useRef, DragEvent } from 'react';
import {
  UploadCloud,
  X,
  Image as ImageIcon,
  Loader2,
  Star,
  ArrowLeft,
  ArrowRight,
  Plus,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { uploadImages } from '../../../services/uploadApi';

interface ProductImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export const ProductImageUpload: React.FC<ProductImageUploadProps> = ({
  images,
  onChange,
  maxImages = 8,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showUrlFallback, setShowUrlFallback] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Handle file selection (multiple files)
  const processFiles = async (fileList: FileList | File[]) => {
    const validFiles: File[] = [];
    const filesArray = Array.from(fileList);

    setUploadError(null);

    for (const file of filesArray) {
      if (!file.type.startsWith('image/')) {
        setUploadError(`File "${file.name}" is not an image. Please upload PNG, JPG, WEBP, or AVIF.`);
        continue;
      }
      if (file.size > 20 * 1024 * 1024) {
        setUploadError(`File "${file.name}" exceeds 20MB limit.`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    if (images.length + validFiles.length > maxImages) {
      setUploadError(`You can upload a maximum of ${maxImages} images per product.`);
      return;
    }

    setIsUploading(true);
    try {
      const uploadedUrls = await uploadImages(validFiles);
      if (uploadedUrls.length > 0) {
        onChange([...images, ...uploadedUrls]);
      }
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload images. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  // Drag and Drop handlers
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  // Image manipulation actions
  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    const selected = images[index];
    const remaining = images.filter((_, i) => i !== index);
    onChange([selected, ...remaining]);
  };

  const handleMove = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const newImages = [...images];
    const temp = newImages[index];
    newImages[index] = newImages[targetIndex];
    newImages[targetIndex] = temp;
    onChange(newImages);
  };

  // Optional manual URL entry fallback
  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onChange([...images, urlInput.trim()]);
      setUrlInput('');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label style={{ fontSize: '0.88rem', fontWeight: 600, color: '#44403C' }}>
          Product Images ({images.length}/{maxImages})
        </label>
        <button
          type="button"
          onClick={() => setShowUrlFallback(!showUrlFallback)}
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
          <LinkIcon size={13} />
          {showUrlFallback ? 'Hide URL input' : 'Or enter image link'}
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,image/avif,image/svg+xml"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Main Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        style={{
          border: isDragging ? '2px dashed #D97706' : '2px dashed #CBD5E1',
          borderRadius: '16px',
          backgroundColor: isDragging ? '#FEF3C7' : '#F8FAFC',
          padding: '1.75rem 1.25rem',
          textAlign: 'center',
          cursor: isUploading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: isDragging ? '0 0 0 4px rgba(217, 119, 6, 0.15)' : 'none',
        }}
      >
        {isUploading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <Loader2 size={32} className="animate-spin" color="#D97706" style={{ animation: 'spin 1s linear infinite' }} />
            <div style={{ fontWeight: 600, color: '#92400E', fontSize: '0.95rem' }}>
              Uploading images to server...
            </div>
            <p style={{ color: '#78716C', fontSize: '0.8rem', margin: 0 }}>
              Optimizing and generating high-res store assets
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: '#FEF3C7',
                color: '#D97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.25rem',
              }}
            >
              <UploadCloud size={26} />
            </div>
            <div style={{ fontWeight: 700, color: '#1C1917', fontSize: '0.95rem' }}>
              Click to browse files or drag & drop images here
            </div>
            <p style={{ color: '#64748B', fontSize: '0.82rem', margin: 0 }}>
              Supports PNG, JPG, JPEG, WEBP, AVIF up to 20MB. You can select multiple images.
            </p>
          </div>
        )}
      </div>

      {/* Error alert if any */}
      {uploadError && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '10px',
            padding: '0.65rem 0.85rem',
            color: '#DC2626',
            fontSize: '0.83rem',
          }}
        >
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Optional fallback URL input */}
      {showUrlFallback && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '0.25rem' }}>
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
              background: '#FFFFFF',
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
            <Plus size={15} /> Add URL
          </button>
        </div>
      )}

      {/* Image Gallery Cards */}
      {images.length > 0 && (
        <div style={{ marginTop: '0.5rem' }}>
          <div
            style={{
              fontSize: '0.78rem',
              fontWeight: 600,
              color: '#78716C',
              marginBottom: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>Uploaded Product Gallery:</span>
            <span style={{ color: '#D97706', fontWeight: 500 }}>
              First image is used as the main product thumbnail
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: '12px',
            }}
          >
            {images.map((img, idx) => {
              const isPrimary = idx === 0;
              return (
                <div
                  key={idx}
                  style={{
                    position: 'relative',
                    borderRadius: '14px',
                    border: isPrimary ? '2px solid #D97706' : '1px solid #E2E8F0',
                    backgroundColor: '#FFFFFF',
                    overflow: 'hidden',
                    boxShadow: isPrimary
                      ? '0 4px 14px rgba(217, 119, 6, 0.2)'
                      : '0 2px 6px rgba(0,0,0,0.04)',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* Thumbnail container */}
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      aspectRatio: '1/1',
                      backgroundColor: '#F8FAFC',
                      overflow: 'hidden',
                      cursor: 'pointer',
                    }}
                    onClick={() => setPreviewImage(img)}
                    title="Click to view full preview"
                  >
                    <img
                      src={img}
                      alt={`Product photograph ${idx + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                      onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80';
                      }}
                    />

                    {/* Primary badge */}
                    {isPrimary && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '6px',
                          left: '6px',
                          backgroundColor: '#D97706',
                          color: '#FFFFFF',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          padding: '2px 7px',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        }}
                      >
                        <Star size={10} fill="#FFFFFF" /> Main Photo
                      </div>
                    )}

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(idx);
                      }}
                      title="Remove image"
                      style={{
                        position: 'absolute',
                        top: '6px',
                        right: '6px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(15, 23, 42, 0.75)',
                        color: '#FFFFFF',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#DC2626')}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.75)')}
                    >
                      <X size={13} />
                    </button>
                  </div>

                  {/* Actions Bar */}
                  <div
                    style={{
                      padding: '6px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#FFFFFF',
                      borderTop: '1px solid #F1F5F9',
                    }}
                  >
                    {!isPrimary ? (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(idx)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#D97706',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          padding: '2px 4px',
                        }}
                      >
                        Make Main
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600 }}>
                        Cover
                      </span>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={() => handleMove(idx, 'left')}
                          title="Move left"
                          style={{
                            background: '#F1F5F9',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '3px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <ArrowLeft size={11} color="#64748B" />
                        </button>
                      )}
                      {idx < images.length - 1 && (
                        <button
                          type="button"
                          onClick={() => handleMove(idx, 'right')}
                          title="Move right"
                          style={{
                            background: '#F1F5F9',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '3px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <ArrowRight size={11} color="#64748B" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Full preview modal */}
      {previewImage && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setPreviewImage(null)}
        >
          <div
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '85vh',
              borderRadius: '16px',
              overflow: 'hidden',
              backgroundColor: '#000',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewImage}
              alt="Full Preview"
              style={{
                maxWidth: '100%',
                maxHeight: '85vh',
                objectFit: 'contain',
                display: 'block',
              }}
            />
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0,0,0,0.6)',
                color: '#FFF',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
