import React, { useState } from 'react';
import { PaymentMethodType } from '../../../types/order.types';
import { UpiPaymentMethod } from '../../../types/customer.types';
import { UPI_PRESETS } from '../../admin/settings/UpiMethodsManager';
import {
  QrCode, Banknote, ShieldCheck, Copy, Check, Upload, X,
  Building2, AlertCircle, CheckCircle2, Smartphone, ExternalLink,
} from 'lucide-react';
import { Button } from '../../common/Button';
import { BUSINESS_PAYMENT_DETAILS } from '../../../utils/constants';
import { useStore } from '../../../store/store';
import { formatPrice } from '../../../utils/formatPrice';

interface PaymentMethodProps {
  selectedMethod: PaymentMethodType;
  onSelect: (method: PaymentMethodType) => void;
  onSubmit: (details?: { utrNumber?: string; paymentScreenshot?: string }) => void;
  onBack: () => void;
  isProcessing: boolean;
  isCodAvailable?: boolean;
}

// ─── Build a UPI intent URL for the given method ──────────────────────────────
function buildDeepLink(method: UpiPaymentMethod, amount: number, name: string): string {
  const preset = UPI_PRESETS[method.type];
  const scheme = method.deepLinkScheme || preset.deepLinkScheme || 'upi://pay?';
  const pa = encodeURIComponent(method.upiId);
  const pn = encodeURIComponent(name);
  const am = amount.toFixed(2);
  const tn = encodeURIComponent('MadhuvanHoney');
  // tez:// uses different path style
  if (scheme.startsWith('tez://')) {
    return `tez://upi/pay?pa=${pa}&pn=${pn}&am=${am}&cu=INR&tn=${tn}`;
  }
  // phonepe:// also uses query params directly
  return `${scheme}pa=${pa}&pn=${pn}&am=${am}&cu=INR&tn=${tn}`;
}

// App-store fallback URLs
const STORE_LINKS: Partial<Record<string, string>> = {
  phonepe:    'https://play.google.com/store/apps/details?id=com.phonepe.app',
  googlepay:  'https://play.google.com/store/apps/details?id=com.google.android.apps.nbu.paisa.user',
  paytm:      'https://play.google.com/store/apps/details?id=net.one97.paytm',
  bhim:       'https://play.google.com/store/apps/details?id=in.org.npci.upiapp',
};

// ─── Component ────────────────────────────────────────────────────────────────
export const PaymentMethod: React.FC<PaymentMethodProps> = ({
  selectedMethod,
  onSelect,
  onSubmit,
  onBack,
  isProcessing,
  isCodAvailable = true,
}) => {
  const { cartTotal, showToast, settings } = useStore();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fallbackMethodId, setFallbackMethodId] = useState<string | null>(null);
  const [utrTouched, setUtrTouched] = useState(false);

  // ── Settings-derived values ──────────────────────────────────────────────
  const isCodGloballyActive = settings?.paymentConfig?.isCodActive !== false;
  const isCodAllowed = isCodGloballyActive && (isCodAvailable !== false);

  // Active UPI quick-pay methods from admin
  const upiMethods: UpiPaymentMethod[] = (
    settings?.paymentConfig?.upiMethods ?? []
  ).filter((m) => m.isActive);

  // Master bank / UPI details
  const masterUpiId   = settings?.paymentConfig?.upiId          || BUSINESS_PAYMENT_DETAILS.upiId;
  const upiName       = settings?.paymentConfig?.accountHolderName || BUSINESS_PAYMENT_DETAILS.upiName;
  const bankName      = settings?.paymentConfig?.bankName        || BUSINESS_PAYMENT_DETAILS.bankName;
  const accountName   = settings?.paymentConfig?.accountHolderName || BUSINESS_PAYMENT_DETAILS.accountName;
  const accountNumber = settings?.paymentConfig?.accountNumber   || BUSINESS_PAYMENT_DETAILS.accountNumber;
  const ifscCode      = settings?.paymentConfig?.ifscCode        || BUSINESS_PAYMENT_DETAILS.ifscCode;
  const branch        = settings?.paymentConfig?.branchName      || BUSINESS_PAYMENT_DETAILS.branch;

  // Fallback to UPI if COD is disabled
  React.useEffect(() => {
    if (!isCodAllowed && selectedMethod === 'cod') onSelect('upi');
  }, [isCodAllowed, selectedMethod, onSelect]);

  // ── Clipboard ─────────────────────────────────────────────────────────────
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    showToast(`${label} copied!`, 'info');
    setTimeout(() => setCopiedField(null), 2500);
  };

  // ── Screenshot ───────────────────────────────────────────────────────────
  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setFormError('Screenshot must be < 5 MB'); return; }
    const reader = new FileReader();
    reader.onloadend = () => { setScreenshotPreview(reader.result as string); setFormError(null); };
    reader.readAsDataURL(file);
  };

  // ── UTR validation ────────────────────────────────────────────────────────
  const validateUtr = (v: string) => {
    const d = v.replace(/\D/g, '');
    if (!d) return 'UTR / Transaction reference number is required';
    if (d.length < 10) return `Too short — need at least 10 digits (${d.length}/12)`;
    if (d.length > 12) return 'UTR number must be 10–12 digits';
    return '';
  };
  const utrError = utrTouched ? validateUtr(utrNumber) : '';
  const utrOk    = !validateUtr(utrNumber) && utrNumber.length > 0;

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (selectedMethod === 'upi') {
      setUtrTouched(true);
      const err = validateUtr(utrNumber);
      if (err) { setFormError(err); return; }
      onSubmit({ utrNumber: utrNumber.trim(), paymentScreenshot: screenshotPreview || undefined });
    } else if (selectedMethod === 'cod') {
      if (!isCodAllowed) { setFormError('COD is disabled or unavailable for this address.'); return; }
      onSubmit();
    } else {
      onSubmit();
    }
  };

  // ── UPI app deep-link click ───────────────────────────────────────────────
  const handleUpiAppClick = (method: UpiPaymentMethod) => {
    const deepLink = buildDeepLink(method, cartTotal, upiName);
    const start = Date.now();
    // On mobile try to open the app
    window.location.href = deepLink;
    // After 1.3 s, if still on page the app likely wasn't installed
    setTimeout(() => {
      if (Date.now() - start < 2000) {
        setFallbackMethodId(method.id);
        setTimeout(() => setFallbackMethodId(null), 7000);
      }
    }, 1300);
  };

  // QR code using master UPI ID (for scan fallback)
  const qrUpiLink  = `upi://pay?pa=${encodeURIComponent(masterUpiId)}&pn=${encodeURIComponent(upiName)}&am=${cartTotal}&cu=INR&tn=MadhuvanHoney`;
  const qrCodeUrl  = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=8&data=${encodeURIComponent(qrUpiLink)}`;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Section heading */}
      <div>
        <h3 style={{ fontSize: '1.25rem', color: '#1C1917', margin: '0 0 0.25rem 0' }}>Select Payment Method</h3>
        <p style={{ color: '#78716C', fontSize: '0.88rem', margin: 0 }}>
          {isCodAllowed
            ? 'Zero gateway fees — Pay via direct UPI transfer or Cash on Delivery.'
            : 'Zero gateway fees — Pay securely via direct UPI transfer.'}
        </p>
      </div>

      {/* ── Payment method radio cards ─────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {/* UPI option */}
        <label style={{
          display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1.25rem',
          borderRadius: '16px',
          border: selectedMethod === 'upi' ? '2px solid #D97706' : '1px solid #E7E5E4',
          backgroundColor: selectedMethod === 'upi' ? '#FFFBEB' : '#FFFFFF',
          cursor: 'pointer', transition: 'all 0.15s ease',
        }}>
          <input
            type="radio" name="paymentMethod"
            checked={selectedMethod === 'upi'}
            onChange={() => onSelect('upi')}
            style={{ accentColor: '#D97706', width: '18px', height: '18px', marginTop: '4px' }}
          />
          <div style={{ flex: 1 }}>
            <div className="flex items-center gap-2">
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <QrCode size={20} color="#D97706" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.98rem', color: '#1C1917' }}>UPI / Bank Transfer</div>
                <div style={{ fontSize: '0.8rem', color: '#78716C' }}>
                  {upiMethods.length > 0
                    ? upiMethods.map(m => m.label).join(', ')
                    : 'Google Pay, PhonePe, Paytm, BHIM or IMPS'}
                </div>
              </div>
            </div>
          </div>
        </label>

        {/* COD option */}
        {isCodAllowed && (
          <label style={{
            display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1.25rem',
            borderRadius: '16px',
            border: selectedMethod === 'cod' ? '2px solid #D97706' : '1px solid #E7E5E4',
            backgroundColor: selectedMethod === 'cod' ? '#FFFBEB' : '#FFFFFF',
            cursor: 'pointer', transition: 'all 0.15s ease',
          }}>
            <input
              type="radio" name="paymentMethod"
              checked={selectedMethod === 'cod'}
              onChange={() => onSelect('cod')}
              style={{ accentColor: '#D97706', width: '18px', height: '18px', marginTop: '4px' }}
            />
            <div style={{ flex: 1 }}>
              <div className="flex items-center gap-2">
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Banknote size={20} color="#2563EB" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.98rem', color: '#1C1917' }}>Cash on Delivery (COD)</div>
                  <div style={{ fontSize: '0.8rem', color: '#78716C' }}>Pay cash or courier QR at doorstep</div>
                </div>
              </div>
            </div>
          </label>
        )}
      </div>

      {/* ── UPI detail panel ───────────────────────────────────────────────── */}
      {selectedMethod === 'upi' && (
        <div style={{
          backgroundColor: '#FFFFFF', borderRadius: '18px',
          border: '1.5px solid #FDE68A', padding: '1.5rem',
          display: 'flex', flexDirection: 'column', gap: '1.25rem',
          boxShadow: '0 4px 16px rgba(217, 119, 6, 0.06)',
        }}>
          {/* Step header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #FEF3C7', paddingBottom: '0.75rem' }}>
            <span style={{ fontWeight: 700, color: '#92400E', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Step 1 · Scan &amp; Transfer {formatPrice(cartTotal)}
            </span>
            <span style={{ fontSize: '0.78rem', color: '#78716C' }}>0% gateway fees</span>
          </div>

          {/* ── Dynamic UPI app buttons ──────────────────────────────────── */}
          {upiMethods.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#92400E', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Smartphone size={14} /> Quick-Pay — tap to open app:
              </div>

              {/* Button grid */}
              <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                {upiMethods.map((method) => {
                  const preset = UPI_PRESETS[method.type];
                  const color  = method.brandColor || preset.brandColor;
                  const letter = method.iconLetter  || preset.iconLetter;
                  return (
                    <button
                      key={method.id}
                      id={`upi-app-btn-${method.id}`}
                      type="button"
                      onClick={() => handleUpiAppClick(method)}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        padding: '10px 18px', borderRadius: '12px',
                        border: `1.5px solid ${color}55`,
                        backgroundColor: `${color}10`,
                        color, fontWeight: 700, fontSize: '0.88rem',
                        cursor: 'pointer', transition: 'all 0.15s ease',
                        flex: '1 1 130px', justifyContent: 'center',
                      }}
                    >
                      <div style={{
                        width: '22px', height: '22px', borderRadius: '5px',
                        background: color, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', flexShrink: 0,
                      }}>
                        <span style={{ color: '#FFF', fontSize: '11px', fontWeight: 900 }}>{letter}</span>
                      </div>
                      Pay with {method.label}
                    </button>
                  );
                })}
              </div>

              {/* App-not-installed fallback */}
              {fallbackMethodId && (() => {
                const m = upiMethods.find(x => x.id === fallbackMethodId);
                if (!m) return null;
                const storeUrl = STORE_LINKS[m.type];
                return (
                  <div style={{
                    backgroundColor: '#FEF9C3', border: '1px solid #FDE047',
                    borderRadius: '10px', padding: '0.75rem 1rem',
                    fontSize: '0.82rem', color: '#713F12',
                    display: 'flex', alignItems: 'flex-start', gap: '8px',
                    animation: 'slideIn 0.2s ease',
                  }}>
                    <AlertCircle size={15} style={{ marginTop: '1px', flexShrink: 0, color: '#D97706' }} />
                    <div>
                      <strong>{m.label} app not detected.</strong>{' '}
                      Scan the QR code or copy the UPI ID below.
                      {storeUrl && (
                        <> {' '}<a href={storeUrl} target="_blank" rel="noopener noreferrer"
                          style={{ color: '#1D4ED8', fontWeight: 700, textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                          Install app <ExternalLink size={11} />
                        </a></>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Divider */}
              <div style={{ borderBottom: '1px dashed #FDE68A' }} />
              <div style={{ fontSize: '0.78rem', color: '#78716C', textAlign: 'center' }}>
                Or scan the QR / enter UPI ID manually ↓
              </div>
            </div>
          )}

          {/* ── QR + UPI ID row ──────────────────────────────────────────── */}
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* QR code */}
            <div style={{ backgroundColor: '#FAF7F2', padding: '10px', borderRadius: '14px', border: '1px solid #E7E5E4', textAlign: 'center' }}>
              <img src={qrCodeUrl} alt="UPI QR Code" style={{ width: '135px', height: '135px', display: 'block', borderRadius: '8px' }} />
              <span style={{ fontSize: '0.7rem', color: '#78716C', marginTop: '4px', display: 'block', fontWeight: 600 }}>Scan with any UPI App</span>
            </div>

            {/* UPI IDs */}
            <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {/* Show per-method UPI IDs if they differ, otherwise just master */}
              {upiMethods.length > 0
                ? upiMethods.map((m) => (
                  <div key={m.id}>
                    <label style={{ fontSize: '0.72rem', color: '#78716C', fontWeight: 600, display: 'block', marginBottom: '3px' }}>
                      {m.label} UPI ID:
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 10px', borderRadius: '9px', backgroundColor: '#FAF7F2', border: '1px solid #E7E5E4' }}>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.9rem', color: '#1C1917' }}>{m.upiId}</span>
                      <button type="button" onClick={() => copyToClipboard(m.upiId, m.label + ' UPI')}
                        style={{ background: copiedField === m.label + ' UPI' ? '#059669' : '#D97706', color: '#FFF', border: 'none', borderRadius: '6px', padding: '3px 9px', fontSize: '0.73rem', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        {copiedField === m.label + ' UPI' ? <Check size={11} /> : <Copy size={11} />}
                        Copy
                      </button>
                    </div>
                  </div>
                ))
                : (
                  <div>
                    <label style={{ fontSize: '0.78rem', color: '#78716C', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Business UPI ID:</label>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '10px', backgroundColor: '#FAF7F2', border: '1px solid #E7E5E4' }}>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.95rem', color: '#1C1917' }}>{masterUpiId}</span>
                      <button type="button" onClick={() => copyToClipboard(masterUpiId, 'UPI ID')}
                        style={{ background: copiedField === 'UPI ID' ? '#059669' : '#D97706', color: '#FFF', border: 'none', borderRadius: '6px', padding: '4px 10px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        {copiedField === 'UPI ID' ? <Check size={12} /> : <Copy size={12} />}
                        {copiedField === 'UPI ID' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                )
              }

              <div>
                <label style={{ fontSize: '0.78rem', color: '#78716C', fontWeight: 600, display: 'block', marginBottom: '2px' }}>Beneficiary Name:</label>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1C1917' }}>{upiName}</div>
              </div>

              {/* Bank transfer toggle */}
              <button type="button" onClick={() => setShowBankDetails(!showBankDetails)}
                style={{ background: 'none', border: 'none', color: '#B45309', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', padding: 0, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Building2 size={14} />
                {showBankDetails ? 'Hide Bank Transfer Details' : 'Pay via NEFT / IMPS / RTGS'}
              </button>

              {showBankDetails && (
                <div style={{ padding: '0.85rem', borderRadius: '10px', backgroundColor: '#FAF7F2', border: '1px solid #E7E5E4', fontSize: '0.8rem', lineHeight: 1.6, color: '#44403C' }}>
                  <div><strong>Bank:</strong> {bankName}</div>
                  <div><strong>Account Name:</strong> {accountName}</div>
                  <div className="flex items-center justify-between">
                    <span><strong>Account No:</strong> {accountNumber}</span>
                    <button type="button" onClick={() => copyToClipboard(accountNumber, 'Account Number')} style={{ background: 'none', border: 'none', color: '#D97706', cursor: 'pointer', fontWeight: 700, fontSize: '0.75rem' }}>Copy</button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span><strong>IFSC:</strong> {ifscCode}</span>
                    <button type="button" onClick={() => copyToClipboard(ifscCode, 'IFSC')} style={{ background: 'none', border: 'none', color: '#D97706', cursor: 'pointer', fontWeight: 700, fontSize: '0.75rem' }}>Copy</button>
                  </div>
                  {branch && <div><strong>Branch:</strong> {branch}</div>}
                </div>
              )}
            </div>
          </div>

          {/* ── Step 2: Proof of payment ─────────────────────────────────── */}
          <div style={{ borderTop: '1px solid #FEF3C7', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <span style={{ fontWeight: 700, color: '#92400E', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Step 2 · Enter Transaction Proof
            </span>

            {/* UTR field */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: utrError ? '#DC2626' : '#1C1917', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                UPI Reference ID / UTR Number <span style={{ color: '#DC2626' }}>*</span>
                {utrOk && <CheckCircle2 size={14} color="#059669" style={{ marginLeft: 'auto' }} />}
              </label>
              <input
                type="text" inputMode="numeric" required
                placeholder="e.g. 408219485721 (10–12 digit number)"
                value={utrNumber} maxLength={12}
                onChange={(e) => { const v = e.target.value.replace(/\D/g, '').slice(0, 12); setUtrNumber(v); setFormError(null); }}
                onBlur={() => setUtrTouched(true)}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: '10px',
                  border: `1.5px solid ${utrError ? '#FCA5A5' : utrOk ? '#6EE7B7' : '#D6D3D1'}`,
                  backgroundColor: utrError ? '#FFF5F5' : utrOk ? '#F0FDF4' : '#FFFFFF',
                  fontSize: '0.92rem', outline: 'none', fontFamily: 'monospace',
                  transition: 'border-color 0.2s', boxSizing: 'border-box' as const,
                }}
              />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                {utrError
                  ? <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem', color: '#DC2626' }}><AlertCircle size={12} />{utrError}</div>
                  : <span style={{ fontSize: '0.74rem', color: utrOk ? '#059669' : '#78716C' }}>
                      {utrOk ? '✓ Valid UTR number' : 'Find this in your UPI app under Transaction Details'}
                    </span>
                }
                <span style={{ fontSize: '0.72rem', color: utrNumber.length >= 10 ? '#059669' : '#78716C', fontWeight: 600, flexShrink: 0, marginLeft: '8px' }}>
                  {utrNumber.length}/12
                </span>
              </div>
            </div>

            {/* Screenshot upload */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1C1917', display: 'block', marginBottom: '6px' }}>
                Upload Payment Screenshot{' '}
                <span style={{ fontSize: '0.75rem', color: '#78716C', fontWeight: 500 }}>(Optional — speeds up verification)</span>
              </label>
              {screenshotPreview ? (
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <img src={screenshotPreview} alt="Receipt preview" style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #E7E5E4' }} />
                  <button type="button" onClick={() => setScreenshotPreview(null)}
                    style={{ position: 'absolute', top: '-6px', right: '-6px', backgroundColor: '#DC2626', color: '#FFF', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '10px', border: '1.5px dashed #D6D3D1', backgroundColor: '#FAF7F2', cursor: 'pointer', fontSize: '0.85rem', color: '#57534E', fontWeight: 600, width: 'fit-content' }}>
                  <Upload size={16} color="#D97706" />
                  Choose screenshot (PNG / JPG)
                  <input type="file" accept="image/*" onChange={handleScreenshotChange} style={{ display: 'none' }} />
                </label>
              )}
            </div>

            {/* Verification notice */}
            <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '10px', padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#92400E', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <AlertCircle size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <strong>Verification Policy:</strong> Your order will be marked <strong>Payment Verification Pending</strong>. We match your UTR with our bank within 15–30 minutes before packing.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── COD helper box ─────────────────────────────────────────────────── */}
      {selectedMethod === 'cod' && (
        <div style={{ backgroundColor: '#EFF6FF', borderRadius: '14px', border: '1px solid #BFDBFE', padding: '1.25rem', color: '#1E40AF', fontSize: '0.88rem', lineHeight: 1.6 }}>
          <div style={{ fontWeight: 700, marginBottom: '4px' }}>💵 Zero Advance Payment Required</div>
          <div>Your honey jars will be dispatched to your address. Pay cash or scan the delivery executive's QR at your door.</div>
        </div>
      )}

      {/* Form error */}
      {formError && (
        <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '10px', padding: '0.75rem 1rem', color: '#B91C1C', fontSize: '0.85rem', fontWeight: 600 }}>
          {formError}
        </div>
      )}

      {/* ── Action buttons ─────────────────────────────────────────────────── */}
      <div className="payment-action-buttons" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
        <Button variant="ghost" type="button" onClick={onBack} disabled={isProcessing}>
          Back to Address
        </Button>
        <Button size="lg" type="submit" isLoading={isProcessing}>
          {selectedMethod === 'upi' ? 'I Have Paid — Place Order' : 'Confirm COD Order'}
        </Button>
      </div>

      <div className="flex items-center justify-center gap-2" style={{ color: '#78716C', fontSize: '0.8rem' }}>
        <ShieldCheck size={16} color="#059669" />
        <span>Direct apiary verified checkout · No third-party gateway charges</span>
      </div>

      <style>{`
        @keyframes spin    { from { transform:rotate(0deg); }   to { transform:rotate(360deg); } }
        @keyframes slideIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        @media (max-width: 480px) {
          .payment-action-buttons { flex-direction:column-reverse !important; align-items:stretch !important; }
          .payment-action-buttons button { width:100% !important; }
        }
      `}</style>
    </form>
  );
};
