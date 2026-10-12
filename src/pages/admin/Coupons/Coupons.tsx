import React, { useState, useEffect, useCallback } from 'react';
import {
  Tag, Plus, Search, Edit2, Trash2, ToggleLeft, ToggleRight,
  Percent, IndianRupee, Calendar, Users, Copy, CheckCircle2,
  AlertTriangle, X, RefreshCw, TrendingUp,
} from 'lucide-react';
import couponApi, { Coupon, DiscountType, CouponStatus } from '../../../services/couponApi';
import { Button } from '../../../components/common/Button';
import { formatPrice } from '../../../utils/formatPrice';

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const statusColor: Record<CouponStatus, { bg: string; text: string; border: string }> = {
  active:   { bg: '#ECFDF5', text: '#065F46', border: '#6EE7B7' },
  inactive: { bg: '#F3F4F6', text: '#6B7280', border: '#D1D5DB' },
  expired:  { bg: '#FEF2F2', text: '#991B1B', border: '#FCA5A5' },
};

function formatDate(d?: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function isExpired(expiresAt?: string | null) {
  return !!expiresAt && new Date() > new Date(expiresAt);
}

/* ─── Empty Form ─────────────────────────────────────────────────────────── */
const EMPTY_FORM = {
  code: '',
  description: '',
  discountType: 'percentage' as DiscountType,
  discountValue: '',
  minOrderAmount: '',
  maxDiscountAmount: '',
  usageLimit: '',
  perUserLimit: '1',
  status: 'active' as CouponStatus,
  expiresAt: '',
};

/* ─── Main Page ──────────────────────────────────────────────────────────── */
export const Coupons: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editCoupon, setEditCoupon] = useState<Coupon | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete confirm
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Copy feedback
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  /* ─── Load ─────────────────────────────────────────────────────────────── */
  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await couponApi.getAll({ status: filterStatus, search, limit: 100 });
      setCoupons(result.coupons);
      setTotal(result.total);
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [filterStatus, search]);

  useEffect(() => { load(); }, [load]);

  /* ─── Modal helpers ────────────────────────────────────────────────────── */
  const openCreate = () => {
    setEditCoupon(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setShowModal(true);
  };

  const openEdit = (c: Coupon) => {
    setEditCoupon(c);
    setForm({
      code: c.code,
      description: c.description || '',
      discountType: c.discountType,
      discountValue: String(c.discountValue),
      minOrderAmount: String(c.minOrderAmount),
      maxDiscountAmount: String(c.maxDiscountAmount || ''),
      usageLimit: String(c.usageLimit),
      perUserLimit: String(c.perUserLimit),
      status: c.status,
      expiresAt: c.expiresAt ? c.expiresAt.substring(0, 10) : '',
    });
    setFormError('');
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditCoupon(null); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!form.code.trim()) return setFormError('Coupon code is required.');
    if (!form.discountValue || isNaN(Number(form.discountValue))) return setFormError('Discount value must be a valid number.');
    if (form.discountType === 'percentage' && (Number(form.discountValue) <= 0 || Number(form.discountValue) > 100)) {
      return setFormError('Percentage discount must be between 1–100.');
    }
    if (form.discountType === 'flat' && Number(form.discountValue) <= 0) {
      return setFormError('Flat discount must be greater than 0.');
    }

    setIsSaving(true);
    try {
      const payload = {
        code: form.code.toUpperCase().trim(),
        description: form.description,
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        minOrderAmount: Number(form.minOrderAmount) || 0,
        maxDiscountAmount: Number(form.maxDiscountAmount) || 0,
        usageLimit: Number(form.usageLimit) || 0,
        perUserLimit: Number(form.perUserLimit) || 1,
        status: form.status,
        expiresAt: form.expiresAt || null,
      };

      if (editCoupon) {
        const updated = await couponApi.update(editCoupon.id, payload);
        setCoupons(prev => prev.map(c => c.id === updated.id ? updated : c));
      } else {
        const created = await couponApi.create(payload);
        setCoupons(prev => [created, ...prev]);
        setTotal(t => t + 1);
      }
      closeModal();
    } catch (err: any) {
      setFormError(err?.message || 'Failed to save coupon.');
    } finally {
      setIsSaving(false);
    }
  };

  /* ─── Toggle status ────────────────────────────────────────────────────── */
  const handleToggle = async (id: string) => {
    try {
      const updated = await couponApi.toggle(id);
      setCoupons(prev => prev.map(c => c.id === updated.id ? updated : c));
    } catch (e: any) {
      alert(e.message || 'Failed to toggle coupon status.');
    }
  };

  /* ─── Delete ───────────────────────────────────────────────────────────── */
  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await couponApi.delete(deleteId);
      setCoupons(prev => prev.filter(c => c.id !== deleteId));
      setTotal(t => t - 1);
      setDeleteId(null);
    } catch (e: any) {
      alert(e.message || 'Failed to delete coupon.');
    } finally {
      setIsDeleting(false);
    }
  };

  /* ─── Copy code ────────────────────────────────────────────────────────── */
  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 1800);
    });
  };

  /* ─── Stats ────────────────────────────────────────────────────────────── */
  const activeCoupons = coupons.filter(c => c.status === 'active').length;
  const totalUses = coupons.reduce((s, c) => s + c.usedCount, 0);

  /* ─── Render ───────────────────────────────────────────────────────────── */
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 style={{ fontSize: '1.85rem', color: '#1C1917', margin: '0 0 0.25rem 0' }}>
            Coupon Manager
          </h1>
          <p style={{ color: '#78716C', margin: 0, fontSize: '0.9rem' }}>
            Create promo codes, set discounts & manage expiry to drive more sales.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="outline" size="md" leftIcon={<RefreshCw size={15} />} onClick={load}>
            Refresh
          </Button>
          <Button size="md" leftIcon={<Plus size={16} />} onClick={openCreate}>
            New Coupon
          </Button>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Total Coupons', value: total, icon: <Tag size={20} color="#D97706" />, bg: '#FEF3C7' },
          { label: 'Active', value: activeCoupons, icon: <CheckCircle2 size={20} color="#059669" />, bg: '#ECFDF5' },
          { label: 'Total Uses', value: totalUses, icon: <TrendingUp size={20} color="#7C3AED" />, bg: '#F5F3FF' },
          { label: 'Inactive / Expired', value: total - activeCoupons, icon: <AlertTriangle size={20} color="#DC2626" />, bg: '#FEF2F2' },
        ].map(s => (
          <div key={s.label} style={{
            background: '#FFFFFF', borderRadius: '14px', padding: '1rem 1.25rem',
            border: '1px solid #E7E5E4', display: 'flex', alignItems: 'center', gap: '14px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}>
            <div style={{ width: 40, height: 40, borderRadius: '10px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {s.icon}
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1C1917', lineHeight: 1.1 }}>{s.value}</div>
              <div style={{ fontSize: '0.78rem', color: '#78716C', marginTop: '2px' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#A8A29E' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search coupon code..."
            style={{
              width: '100%', padding: '0.6rem 0.75rem 0.6rem 2.2rem',
              border: '1.5px solid #E7E5E4', borderRadius: '10px', fontSize: '0.88rem',
              outline: 'none', boxSizing: 'border-box', background: '#fff',
            }}
          />
        </div>
        {(['all', 'active', 'inactive', 'expired'] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            style={{
              padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', cursor: 'pointer',
              border: filterStatus === s ? '2px solid #D97706' : '1.5px solid #E7E5E4',
              background: filterStatus === s ? '#FFFBEB' : '#FFFFFF',
              color: filterStatus === s ? '#92400E' : '#78716C',
              fontWeight: filterStatus === s ? 700 : 500,
              transition: 'all 0.15s',
            }}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* ── Coupons Table / Cards ── */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#A8A29E' }}>Loading coupons...</div>
      ) : coupons.length === 0 ? (
        <div style={{
          background: '#FFFFFF', borderRadius: '16px', border: '1.5px dashed #E7E5E4',
          padding: '4rem 2rem', textAlign: 'center',
        }}>
          <Tag size={48} color="#D4C5A9" style={{ marginBottom: '1rem' }} />
          <p style={{ color: '#A8A29E', fontSize: '1rem', margin: 0 }}>No coupons found. Create your first promo code!</p>
          <Button style={{ marginTop: '1rem' }} leftIcon={<Plus size={15} />} onClick={openCreate}>New Coupon</Button>
        </div>
      ) : (
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E7E5E4', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: '#FAF7F2', borderBottom: '1.5px solid #E7E5E4' }}>
                  {['Code', 'Discount', 'Min Order', 'Used / Limit', 'Expires', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '0.85rem 1.1rem', textAlign: 'left', fontWeight: 700, color: '#78716C', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {coupons.map((c, idx) => {
                  const sc = statusColor[c.status];
                  const exp = isExpired(c.expiresAt);
                  return (
                    <tr key={c.id} style={{ borderBottom: idx < coupons.length - 1 ? '1px solid #F3F2F1' : 'none', transition: 'background 0.12s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#FAFAF9')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      {/* Code */}
                      <td style={{ padding: '0.9rem 1.1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            fontFamily: 'monospace', fontWeight: 800, fontSize: '0.95rem',
                            background: '#FEF3C7', color: '#92400E', padding: '3px 10px', borderRadius: '6px',
                            letterSpacing: '0.05em',
                          }}>{c.code}</span>
                          <button onClick={() => copyCode(c.code)} title="Copy code" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: copiedCode === c.code ? '#059669' : '#A8A29E' }}>
                            {copiedCode === c.code ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                          </button>
                        </div>
                        {c.description && <div style={{ fontSize: '0.78rem', color: '#A8A29E', marginTop: '3px' }}>{c.description}</div>}
                      </td>

                      {/* Discount */}
                      <td style={{ padding: '0.9rem 1.1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 700, color: '#059669' }}>
                          {c.discountType === 'percentage' ? <Percent size={14} /> : <IndianRupee size={14} />}
                          <span>
                            {c.discountType === 'percentage'
                              ? `${c.discountValue}% OFF`
                              : `₹${c.discountValue} OFF`}
                          </span>
                        </div>
                        {c.discountType === 'percentage' && c.maxDiscountAmount && c.maxDiscountAmount > 0 && (
                          <div style={{ fontSize: '0.75rem', color: '#A8A29E' }}>Max ₹{c.maxDiscountAmount}</div>
                        )}
                      </td>

                      {/* Min Order */}
                      <td style={{ padding: '0.9rem 1.1rem', color: '#44403C' }}>
                        {c.minOrderAmount > 0 ? formatPrice(c.minOrderAmount) : '—'}
                      </td>

                      {/* Used / Limit */}
                      <td style={{ padding: '0.9rem 1.1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Users size={13} color="#A8A29E" />
                          <span style={{ color: '#44403C' }}>
                            {c.usedCount} / {c.usageLimit === 0 ? '∞' : c.usageLimit}
                          </span>
                        </div>
                      </td>

                      {/* Expires */}
                      <td style={{ padding: '0.9rem 1.1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: exp ? '#DC2626' : '#44403C' }}>
                          <Calendar size={13} />
                          <span>{formatDate(c.expiresAt)}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '0.9rem 1.1rem' }}>
                        <span style={{
                          padding: '3px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700,
                          background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`,
                        }}>
                          {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '0.9rem 1.1rem' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => handleToggle(c.id)}
                            title={c.status === 'active' ? 'Deactivate' : 'Activate'}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: c.status === 'active' ? '#059669' : '#A8A29E' }}
                          >
                            {c.status === 'active' ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                          </button>
                          <button
                            onClick={() => openEdit(c)}
                            title="Edit"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#D97706' }}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteId(c.id)}
                            title="Delete"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#DC2626' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ════════ Create / Edit Modal ════════ */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem',
        }}
          onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div style={{
            background: '#FFFFFF', borderRadius: '20px', width: '100%', maxWidth: '580px',
            maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.18)',
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '1.5rem 1.75rem 1rem', borderBottom: '1px solid #F3F2F1',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: 38, height: 38, borderRadius: '10px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Tag size={20} color="#D97706" />
                </div>
                <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#1C1917' }}>
                  {editCoupon ? 'Edit Coupon' : 'Create New Coupon'}
                </h2>
              </div>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A8A29E', padding: '4px' }}>
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} style={{ padding: '1.5rem 1.75rem' }}>
              {formError && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1rem', color: '#DC2626', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={15} /> {formError}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

                {/* Code */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Coupon Code *</label>
                  <input
                    value={form.code}
                    onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                    placeholder="e.g. HONEY20"
                    style={inputStyle}
                    required
                  />
                </div>

                {/* Description */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Description (shown to customers)</label>
                  <input
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="e.g. Get 20% off on first order"
                    style={inputStyle}
                  />
                </div>

                {/* Discount Type */}
                <div>
                  <label style={labelStyle}>Discount Type *</label>
                  <select
                    value={form.discountType}
                    onChange={e => setForm(f => ({ ...f, discountType: e.target.value as DiscountType }))}
                    style={inputStyle}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>

                {/* Discount Value */}
                <div>
                  <label style={labelStyle}>
                    {form.discountType === 'percentage' ? 'Discount % *' : 'Discount Amount (₹) *'}
                  </label>
                  <input
                    type="number"
                    value={form.discountValue}
                    onChange={e => setForm(f => ({ ...f, discountValue: e.target.value }))}
                    placeholder={form.discountType === 'percentage' ? '20' : '100'}
                    min="0"
                    max={form.discountType === 'percentage' ? '100' : undefined}
                    style={inputStyle}
                    required
                  />
                </div>

                {/* Min Order Amount */}
                <div>
                  <label style={labelStyle}>Min Order Amount (₹)</label>
                  <input
                    type="number"
                    value={form.minOrderAmount}
                    onChange={e => setForm(f => ({ ...f, minOrderAmount: e.target.value }))}
                    placeholder="500"
                    min="0"
                    style={inputStyle}
                  />
                </div>

                {/* Max Discount Cap (only for %) */}
                {form.discountType === 'percentage' && (
                  <div>
                    <label style={labelStyle}>Max Discount Cap (₹)</label>
                    <input
                      type="number"
                      value={form.maxDiscountAmount}
                      onChange={e => setForm(f => ({ ...f, maxDiscountAmount: e.target.value }))}
                      placeholder="200 (optional)"
                      min="0"
                      style={inputStyle}
                    />
                  </div>
                )}

                {/* Usage Limit */}
                <div>
                  <label style={labelStyle}>Total Usage Limit (0 = unlimited)</label>
                  <input
                    type="number"
                    value={form.usageLimit}
                    onChange={e => setForm(f => ({ ...f, usageLimit: e.target.value }))}
                    placeholder="0"
                    min="0"
                    style={inputStyle}
                  />
                </div>

                {/* Per User Limit */}
                <div>
                  <label style={labelStyle}>Uses per Customer (0 = unlimited)</label>
                  <input
                    type="number"
                    value={form.perUserLimit}
                    onChange={e => setForm(f => ({ ...f, perUserLimit: e.target.value }))}
                    placeholder="1"
                    min="0"
                    style={inputStyle}
                  />
                </div>

                {/* Expires At */}
                <div>
                  <label style={labelStyle}>Expiry Date (optional)</label>
                  <input
                    type="date"
                    value={form.expiresAt}
                    onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))}
                    style={inputStyle}
                  />
                </div>

                {/* Status */}
                <div>
                  <label style={labelStyle}>Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm(f => ({ ...f, status: e.target.value as CouponStatus }))}
                    style={inputStyle}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Preview */}
              {form.discountValue && (
                <div style={{ marginTop: '1.25rem', background: '#ECFDF5', border: '1px solid #6EE7B7', borderRadius: '10px', padding: '0.75rem 1rem', fontSize: '0.88rem', color: '#065F46' }}>
                  <strong>Preview:</strong>{' '}
                  Code <strong>{form.code || 'CODE'}</strong> gives{' '}
                  {form.discountType === 'percentage'
                    ? `${form.discountValue}% discount${form.maxDiscountAmount ? ` (max ₹${form.maxDiscountAmount})` : ''}`
                    : `₹${form.discountValue} off`}
                  {form.minOrderAmount ? ` on orders above ₹${form.minOrderAmount}` : ''}
                  {form.expiresAt ? `, expires ${new Date(form.expiresAt).toLocaleDateString('en-IN')}` : ''}.
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <Button type="button" variant="outline" onClick={closeModal} disabled={isSaving}>Cancel</Button>
                <Button type="submit" isLoading={isSaving}>
                  {editCoupon ? 'Update Coupon' : 'Create Coupon'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════ Delete Confirm ════════ */}
      {deleteId && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1100,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '2rem', maxWidth: '380px', width: '90%', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <Trash2 size={24} color="#DC2626" />
            </div>
            <h3 style={{ margin: '0 0 0.5rem', color: '#1C1917' }}>Delete Coupon?</h3>
            <p style={{ color: '#78716C', margin: '0 0 1.5rem', fontSize: '0.9rem' }}>
              This action cannot be undone. The coupon will be permanently removed.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <Button variant="outline" onClick={() => setDeleteId(null)} disabled={isDeleting}>Cancel</Button>
              <Button
                onClick={handleDelete}
                isLoading={isDeleting}
                style={{ background: '#DC2626', borderColor: '#DC2626' }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Shared Styles ─────────────────────────────────────────────────────────── */
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#44403C', marginBottom: '5px',
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.6rem 0.85rem', border: '1.5px solid #E7E5E4', borderRadius: '10px',
  fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box', background: '#FAFAF8',
  color: '#1C1917', transition: 'border-color 0.15s',
};

export default Coupons;
