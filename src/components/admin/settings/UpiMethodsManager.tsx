/**
 * UpiMethodsManager
 * ─────────────────
 * Admin component for managing dynamic UPI payment methods.
 * Supports uploading a logo image per method (shown in checkout).
 */
import React, { useState, useRef } from 'react';
import { Plus, Trash2, Edit3, Check, X, ToggleLeft, ToggleRight, ChevronDown, ImagePlus } from 'lucide-react';
import { UpiPaymentMethod, UpiMethodType } from '../../../types/customer.types';

// ─── Preset definitions ───────────────────────────────────────────────────────
interface PresetDef {
  label: string;
  deepLinkScheme: string;
  brandColor: string;
  iconLetter: string;
  placeholder: string;
}

export const UPI_PRESETS: Record<UpiMethodType, PresetDef> = {
  phonepe: {
    label: 'PhonePe',
    deepLinkScheme: 'phonepe://pay?',
    brandColor: '#5B21B6',
    iconLetter: 'P',
    placeholder: 'e.g. business@ybl',
  },
  googlepay: {
    label: 'Google Pay',
    deepLinkScheme: 'tez://upi/pay?',
    brandColor: '#1A73E8',
    iconLetter: 'G',
    placeholder: 'e.g. business@okicici',
  },
  paytm: {
    label: 'Paytm',
    deepLinkScheme: 'paytmmp://pay?',
    brandColor: '#00B9F1',
    iconLetter: 'T',
    placeholder: 'e.g. 9876543210@paytm',
  },
  bhim: {
    label: 'BHIM UPI',
    deepLinkScheme: 'upi://pay?',
    brandColor: '#1F5FBF',
    iconLetter: 'B',
    placeholder: 'e.g. business@upi',
  },
  generic_upi: {
    label: 'Any UPI App',
    deepLinkScheme: 'upi://pay?',
    brandColor: '#D97706',
    iconLetter: 'U',
    placeholder: 'e.g. madhuvanhoney@upi',
  },
  custom: {
    label: 'Custom Method',
    deepLinkScheme: 'upi://pay?',
    brandColor: '#6B7280',
    iconLetter: 'C',
    placeholder: 'Enter UPI ID',
  },
};

const DROPDOWN_OPTIONS: { type: UpiMethodType; label: string }[] = [
  { type: 'phonepe',     label: '📱 PhonePe' },
  { type: 'googlepay',   label: '🔵 Google Pay' },
  { type: 'paytm',       label: '💙 Paytm' },
  { type: 'bhim',        label: '🇮🇳 BHIM UPI' },
  { type: 'generic_upi', label: '🔗 Any UPI App (Generic)' },
  { type: 'custom',      label: '✏️ Custom Payment Method' },
];

function genId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// ─── Shared icon renderer ─────────────────────────────────────────────────────
interface MethodIconProps {
  iconImage?: string;
  iconLetter: string;
  color: string;
  size?: number;
}
export const MethodIcon: React.FC<MethodIconProps> = ({ iconImage, iconLetter, color, size = 36 }) => {
  if (iconImage) {
    return (
      <img
        src={iconImage}
        alt={iconLetter}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: size <= 24 ? '4px' : '8px',
          objectFit: 'contain',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E7E5E4',
          flexShrink: 0,
        }}
      />
    );
  }
  return (
    <div style={{
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: size <= 24 ? '4px' : '8px',
      background: color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}>
      <span style={{ color: '#FFFFFF', fontSize: `${Math.round(size * 0.38)}px`, fontWeight: 900 }}>{iconLetter}</span>
    </div>
  );
};

// ─── Image upload button ──────────────────────────────────────────────────────
interface ImageUploadProps {
  value: string;          // base64 or empty
  onChange: (val: string) => void;
  label?: string;
}
const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, label = 'Upload Logo' }) => {
  const ref = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert('Image must be less than 2 MB'); return; }
    const reader = new FileReader();
    reader.onloadend = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
    // reset input so re-selecting same file works
    e.target.value = '';
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
      {value ? (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img
            src={value}
            alt="logo preview"
            style={{ width: '52px', height: '52px', borderRadius: '10px', objectFit: 'contain', border: '1.5px solid #FCD34D', backgroundColor: '#FFFFFF', padding: '4px' }}
          />
          <button
            type="button"
            onClick={() => onChange('')}
            title="Remove image"
            style={{
              position: 'absolute', top: '-7px', right: '-7px',
              width: '20px', height: '20px', borderRadius: '50%',
              backgroundColor: '#DC2626', border: 'none', color: '#FFFFFF',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
            }}
          >
            <X size={12} />
          </button>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => ref.current?.click()}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '7px 14px', borderRadius: '9px',
          border: '1.5px dashed #D6D3D1',
          backgroundColor: '#FAFAF9',
          fontSize: '0.82rem', fontWeight: 600, color: '#57534E',
          cursor: 'pointer', transition: 'border-color 0.15s',
        }}
      >
        <ImagePlus size={15} color="#D97706" />
        {value ? 'Change Logo' : label}
      </button>

      <div style={{ fontSize: '0.72rem', color: '#A8A29E' }}>PNG / JPG / SVG · Max 2 MB</div>

      <input
        ref={ref}
        type="file"
        accept="image/*"
        onChange={handleFile}
        style={{ display: 'none' }}
      />
    </div>
  );
};

// ─── Props ────────────────────────────────────────────────────────────────────
interface UpiMethodsManagerProps {
  methods: UpiPaymentMethod[];
  masterUpiId: string;
  onChange: (methods: UpiPaymentMethod[]) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
export const UpiMethodsManager: React.FC<UpiMethodsManagerProps> = ({
  methods,
  masterUpiId,
  onChange,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  // Add-form state
  const [addType, setAddType] = useState<UpiMethodType>('phonepe');
  const [addLabel, setAddLabel] = useState('');
  const [addUpiId, setAddUpiId] = useState('');
  const [addIconImage, setAddIconImage] = useState('');

  // Edit-form state
  const [editLabel, setEditLabel] = useState('');
  const [editUpiId, setEditUpiId] = useState('');
  const [editIconImage, setEditIconImage] = useState('');

  const preset = UPI_PRESETS[addType];

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSelectType = (type: UpiMethodType) => {
    setAddType(type);
    setAddLabel(UPI_PRESETS[type].label);
    if (!addUpiId) setAddUpiId(masterUpiId || '');
    setShowTypeDropdown(false);
  };

  const openAddForm = () => {
    setAddType('phonepe');
    setAddLabel(UPI_PRESETS['phonepe'].label);
    setAddUpiId(masterUpiId || '');
    setAddIconImage('');
    setShowAddForm(true);
    setEditingId(null);
  };

  const handleAdd = () => {
    if (!addUpiId.trim()) { alert('Please enter a UPI ID for this method.'); return; }
    const label = addLabel.trim() || UPI_PRESETS[addType].label;
    const p = UPI_PRESETS[addType];
    const newMethod: UpiPaymentMethod = {
      id: genId(),
      type: addType,
      label,
      upiId: addUpiId.trim(),
      isActive: true,
      deepLinkScheme: p.deepLinkScheme,
      brandColor: p.brandColor,
      iconLetter: p.iconLetter,
      iconImage: addIconImage || undefined,
    };
    onChange([...methods, newMethod]);
    setShowAddForm(false);
    setAddUpiId('');
    setAddLabel('');
    setAddIconImage('');
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Remove this payment method?')) return;
    onChange(methods.filter((m) => m.id !== id));
  };

  const handleToggle = (id: string) => {
    onChange(methods.map((m) => m.id === id ? { ...m, isActive: !m.isActive } : m));
  };

  const startEdit = (m: UpiPaymentMethod) => {
    setEditingId(m.id);
    setEditLabel(m.label);
    setEditUpiId(m.upiId);
    setEditIconImage(m.iconImage || '');
    setShowAddForm(false);
  };

  const saveEdit = (id: string) => {
    onChange(methods.map((m) =>
      m.id === id
        ? {
            ...m,
            label: editLabel.trim() || m.label,
            upiId: editUpiId.trim() || m.upiId,
            iconImage: editIconImage || undefined,
          }
        : m
    ));
    setEditingId(null);
  };

  const cancelEdit = () => setEditingId(null);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <style>{`
        .upm-btn-icon { transition: opacity 0.15s; }
        .upm-btn-icon:hover { opacity: 0.75; }
        .upm-row { transition: background 0.1s; }
        .upm-row:hover { background: #FFFBEB !important; }
        .upm-dropdown { position: relative; }
        .upm-dd-menu {
          position: absolute; top: calc(100% + 4px); left: 0; right: 0;
          background: #FFFFFF; border: 1px solid #E7E5E4; border-radius: 10px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.1); z-index: 50; overflow: hidden;
        }
        .upm-dd-item { padding: 9px 14px; cursor: pointer; font-size: 0.88rem; transition: background 0.1s; }
        .upm-dd-item:hover { background: #FEF3C7; }
        .upm-img-upload-area:hover { border-color: #D97706 !important; }
      `}</style>

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1C1917' }}>📱 UPI App Quick-Pay Buttons</div>
          <div style={{ fontSize: '0.78rem', color: '#78716C', marginTop: '2px' }}>
            Customers see only enabled methods. Upload a logo image for each — shown in the checkout page.
          </div>
        </div>
        {!showAddForm && (
          <button
            type="button"
            id="upm-add-btn"
            onClick={openAddForm}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '7px 14px', borderRadius: '10px', border: 'none',
              backgroundColor: '#D97706', color: '#FFFFFF',
              fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
            }}
          >
            <Plus size={15} /> Add Payment Method
          </button>
        )}
      </div>

      {/* ── Add Form ────────────────────────────────────────────────────────── */}
      {showAddForm && (
        <div style={{
          backgroundColor: '#FFFBEB', border: '1.5px solid #FDE68A',
          borderRadius: '14px', padding: '1.25rem',
          display: 'flex', flexDirection: 'column', gap: '1rem',
        }}>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#92400E' }}>Add New Payment Method</div>

          {/* Type Dropdown */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#57534E', marginBottom: '4px' }}>Payment App</label>
            <div className="upm-dropdown">
              <button
                type="button"
                id="upm-type-dropdown-btn"
                onClick={() => setShowTypeDropdown((v) => !v)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #FCD34D',
                  backgroundColor: '#FFFFFF', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', color: '#1C1917',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MethodIcon iconImage={addIconImage} iconLetter={preset.iconLetter} color={preset.brandColor} size={26} />
                  {DROPDOWN_OPTIONS.find(o => o.type === addType)?.label || preset.label}
                </span>
                <ChevronDown size={16} color="#78716C" />
              </button>
              {showTypeDropdown && (
                <div className="upm-dd-menu">
                  {DROPDOWN_OPTIONS.map((opt) => (
                    <div key={opt.type} className="upm-dd-item" onClick={() => handleSelectType(opt.type)}>
                      {opt.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Logo upload */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#57534E', marginBottom: '6px' }}>
              Payment Logo / Icon{' '}
              <span style={{ fontWeight: 400, color: '#A8A29E' }}>(shown to customer on checkout)</span>
            </label>
            <ImageUpload value={addIconImage} onChange={setAddIconImage} label="Upload Logo Image" />
          </div>

          {/* Custom label */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#57534E', marginBottom: '4px' }}>
              Button Label <span style={{ fontWeight: 400, color: '#A8A29E' }}>(shown to customer)</span>
            </label>
            <input
              type="text"
              id="upm-add-label"
              placeholder={UPI_PRESETS[addType].label}
              value={addLabel}
              onChange={(e) => setAddLabel(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #D6D3D1', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' as const }}
            />
          </div>

          {/* UPI ID */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#57534E', marginBottom: '4px' }}>
              UPI ID (VPA) <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              type="text"
              id="upm-add-upi-id"
              placeholder={preset.placeholder}
              value={addUpiId}
              onChange={(e) => setAddUpiId(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #FCD34D', fontSize: '0.9rem', outline: 'none', fontFamily: 'monospace', boxSizing: 'border-box' as const }}
            />
            <div style={{ fontSize: '0.73rem', color: '#78716C', marginTop: '3px' }}>
              Deep link: <code style={{ fontSize: '0.7rem', color: '#92400E' }}>{preset.deepLinkScheme}pa=<em>{addUpiId || 'YOUR_UPI_ID'}</em>&amp;am=ORDER_AMOUNT…</code>
            </div>
          </div>

          {/* Preview */}
          {(addIconImage || addLabel || addUpiId) && (
            <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E7E5E4', borderRadius: '10px', padding: '0.75rem 1rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#78716C', marginBottom: '8px', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>
                Preview (as customer sees it):
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '12px', border: `1.5px solid ${preset.brandColor}55`, backgroundColor: `${preset.brandColor}10` }}>
                <MethodIcon iconImage={addIconImage} iconLetter={preset.iconLetter} color={preset.brandColor} size={24} />
                <span style={{ fontWeight: 700, fontSize: '0.88rem', color: preset.brandColor }}>
                  Pay with {addLabel || preset.label}
                </span>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              id="upm-confirm-add-btn"
              onClick={handleAdd}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '8px 18px', borderRadius: '10px', border: 'none',
                backgroundColor: '#059669', color: '#FFFFFF',
                fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer',
              }}
            >
              <Check size={15} /> Add Method
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid #E7E5E4', background: '#FFFFFF', fontSize: '0.88rem', cursor: 'pointer', color: '#57534E' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {methods.length === 0 && !showAddForm && (
        <div style={{ textAlign: 'center', padding: '1.5rem', borderRadius: '12px', border: '1.5px dashed #E7E5E4', backgroundColor: '#FAFAF9', color: '#A8A29E', fontSize: '0.88rem' }}>
          No payment methods added yet. Click <strong>Add Payment Method</strong> to begin.
        </div>
      )}

      {/* ── Methods list ────────────────────────────────────────────────────── */}
      {methods.map((m) => {
        const isEditing = editingId === m.id;
        const p = UPI_PRESETS[m.type];
        const color = m.brandColor || p.brandColor;
        const letter = m.iconLetter || p.iconLetter;

        return (
          <div
            key={m.id}
            className="upm-row"
            style={{
              border: m.isActive ? `1.5px solid ${color}44` : '1px solid #E7E5E4',
              borderRadius: '12px',
              backgroundColor: m.isActive ? `${color}08` : '#FAFAF9',
              overflow: 'hidden',
              transition: 'all 0.2s',
            }}
          >
            {/* Row header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0.85rem 1rem', flexWrap: 'wrap' }}>
              {/* Icon — real image or letter fallback */}
              <MethodIcon
                iconImage={isEditing ? editIconImage : m.iconImage}
                iconLetter={letter}
                color={m.isActive ? color : '#D1D5DB'}
                size={38}
              />

              {/* Name & UPI ID / edit form */}
              <div style={{ flex: 1, minWidth: '140px' }}>
                {isEditing ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {/* Edit logo */}
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#57534E', marginBottom: '4px' }}>Logo Image:</div>
                      <ImageUpload value={editIconImage} onChange={setEditIconImage} label="Change Logo" />
                    </div>
                    <input
                      id={`upm-edit-label-${m.id}`}
                      type="text"
                      value={editLabel}
                      onChange={(e) => setEditLabel(e.target.value)}
                      placeholder="Button label"
                      style={{ width: '100%', padding: '6px 10px', borderRadius: '8px', border: '1.5px solid #FCD34D', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' as const }}
                    />
                    <input
                      id={`upm-edit-upi-${m.id}`}
                      type="text"
                      value={editUpiId}
                      onChange={(e) => setEditUpiId(e.target.value)}
                      placeholder="UPI ID"
                      style={{ width: '100%', padding: '6px 10px', borderRadius: '8px', border: '1.5px solid #FCD34D', fontSize: '0.85rem', fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box' as const }}
                    />
                  </div>
                ) : (
                  <>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1C1917' }}>{m.label}</div>
                    <div style={{ fontSize: '0.78rem', fontFamily: 'monospace', color: '#57534E', marginTop: '1px' }}>{m.upiId}</div>
                    {m.iconImage && (
                      <div style={{ fontSize: '0.7rem', color: '#059669', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        ✓ Custom logo uploaded
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Status badge */}
              <span style={{
                fontSize: '0.72rem', fontWeight: 700, padding: '2px 9px', borderRadius: '6px',
                backgroundColor: m.isActive ? '#ECFDF5' : '#F3F4F6',
                color: m.isActive ? '#065F46' : '#6B7280', flexShrink: 0,
              }}>
                {m.isActive ? 'Active' : 'Disabled'}
              </span>

              {/* Action buttons */}
              {isEditing ? (
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  <button type="button" title="Save" className="upm-btn-icon" onClick={() => saveEdit(m.id)}
                    style={{ background: '#059669', border: 'none', borderRadius: '8px', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <Check size={14} color="#FFFFFF" />
                  </button>
                  <button type="button" title="Cancel" className="upm-btn-icon" onClick={cancelEdit}
                    style={{ background: '#F3F4F6', border: 'none', borderRadius: '8px', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <X size={14} color="#374151" />
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  {/* Toggle */}
                  <button type="button" title={m.isActive ? 'Disable' : 'Enable'} id={`upm-toggle-${m.id}`} className="upm-btn-icon"
                    onClick={() => handleToggle(m.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '3px' }}>
                    {m.isActive ? <ToggleRight size={26} color={color} /> : <ToggleLeft size={26} color="#D1D5DB" />}
                  </button>
                  {/* Edit */}
                  <button type="button" title="Edit" id={`upm-edit-${m.id}`} className="upm-btn-icon"
                    onClick={() => startEdit(m)}
                    style={{ background: '#FEF3C7', border: 'none', borderRadius: '8px', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <Edit3 size={14} color="#D97706" />
                  </button>
                  {/* Delete */}
                  <button type="button" title="Delete" id={`upm-delete-${m.id}`} className="upm-btn-icon"
                    onClick={() => handleDelete(m.id)}
                    style={{ background: '#FEF2F2', border: 'none', borderRadius: '8px', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <Trash2 size={14} color="#DC2626" />
                  </button>
                </div>
              )}
            </div>

            {/* Deep-link preview strip */}
            {!isEditing && m.isActive && (
              <div style={{ padding: '0 1rem 0.6rem 1rem', fontSize: '0.7rem', color: '#78716C' }}>
                <span style={{ opacity: 0.7 }}>Deep link: </span>
                <code style={{ fontSize: '0.68rem', color: '#92400E' }}>
                  {m.deepLinkScheme || p.deepLinkScheme}pa={m.upiId}&amp;am=…
                </code>
              </div>
            )}
          </div>
        );
      })}

      {methods.length > 0 && (
        <div style={{ fontSize: '0.75rem', color: '#92400E', backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '8px', padding: '0.6rem 0.85rem', lineHeight: 1.5 }}>
          💡 <strong>Tip:</strong> Active methods appear as quick-pay buttons on checkout. The uploaded logo replaces the letter icon. Use the toggle to enable/disable without deleting.
        </div>
      )}
    </div>
  );
};

export default UpiMethodsManager;
