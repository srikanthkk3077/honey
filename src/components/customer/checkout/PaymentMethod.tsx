import React, { useState } from 'react';
import { PaymentMethodType } from '../../../types/order.types';
import { QrCode, Banknote, ShieldCheck, Copy, Check, Upload, X, Building2, AlertCircle } from 'lucide-react';
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
}

export const PaymentMethod: React.FC<PaymentMethodProps> = ({
  selectedMethod,
  onSelect,
  onSubmit,
  onBack,
  isProcessing,
}) => {
  const { cartTotal, showToast } = useStore();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    showToast(`${label} copied to clipboard!`, 'info');
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFormError('Screenshot file size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
        setFormError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeScreenshot = () => {
    setScreenshotPreview(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (selectedMethod === 'upi') {
      if (!utrNumber.trim()) {
        setFormError('Please enter the 12-digit UTR / UPI Transaction Reference Number');
        return;
      }
      if (utrNumber.trim().length < 6) {
        setFormError('Please enter a valid Transaction / UTR reference number');
        return;
      }
      onSubmit({
        utrNumber: utrNumber.trim(),
        paymentScreenshot: screenshotPreview || undefined,
      });
    } else {
      onSubmit();
    }
  };

  const upiDeepLink = `upi://pay?pa=${BUSINESS_PAYMENT_DETAILS.upiId}&pn=${encodeURIComponent(BUSINESS_PAYMENT_DETAILS.upiName)}&am=${cartTotal}&cu=INR&tn=MadhuvanHoney`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=8&data=${encodeURIComponent(upiDeepLink)}`;

  return (
    <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h3 style={{ fontSize: '1.25rem', color: '#1C1917', margin: '0 0 0.25rem 0' }}>
          Select Payment Method
        </h3>
        <p style={{ color: '#78716C', fontSize: '0.88rem', margin: 0 }}>
          Launch with zero gateway fees — Pay via direct UPI transfer or Cash on Delivery.
        </p>
      </div>

      {/* Payment Options Radio Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {/* UPI / Bank Transfer Option */}
        <label
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem',
            padding: '1.25rem',
            borderRadius: '16px',
            border: selectedMethod === 'upi' ? '2px solid #D97706' : '1px solid #E7E5E4',
            backgroundColor: selectedMethod === 'upi' ? '#FFFBEB' : '#FFFFFF',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <input
            type="radio"
            name="paymentMethod"
            checked={selectedMethod === 'upi'}
            onChange={() => onSelect('upi')}
            style={{ accentColor: '#D97706', width: '18px', height: '18px', marginTop: '4px' }}
          />
          <div style={{ flex: 1 }}>
            <div className="flex items-center gap-2">
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: '#FEF3C7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <QrCode size={20} color="#D97706" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.98rem', color: '#1C1917' }}>
                  UPI / Bank Transfer
                </div>
                <div style={{ fontSize: '0.8rem', color: '#78716C' }}>
                  Google Pay, PhonePe, Paytm, BHIM or Direct IMPS / NEFT
                </div>
              </div>
            </div>
          </div>
        </label>

        {/* Cash on Delivery (COD) Option */}
        <label
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem',
            padding: '1.25rem',
            borderRadius: '16px',
            border: selectedMethod === 'cod' ? '2px solid #D97706' : '1px solid #E7E5E4',
            backgroundColor: selectedMethod === 'cod' ? '#FFFBEB' : '#FFFFFF',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <input
            type="radio"
            name="paymentMethod"
            checked={selectedMethod === 'cod'}
            onChange={() => onSelect('cod')}
            style={{ accentColor: '#D97706', width: '18px', height: '18px', marginTop: '4px' }}
          />
          <div style={{ flex: 1 }}>
            <div className="flex items-center gap-2">
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: '#EFF6FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Banknote size={20} color="#2563EB" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.98rem', color: '#1C1917' }}>
                  Cash on Delivery (COD)
                </div>
                <div style={{ fontSize: '0.8rem', color: '#78716C' }}>
                  Pay cash or courier QR at doorstep upon delivery
                </div>
              </div>
            </div>
          </div>
        </label>
      </div>

      {/* UPI Details Box (Shown when UPI is selected) */}
      {selectedMethod === 'upi' && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            border: '1.5px solid #FDE68A',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            boxShadow: '0 4px 16px rgba(217, 119, 6, 0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #FEF3C7', paddingBottom: '0.75rem' }}>
            <span style={{ fontWeight: 700, color: '#92400E', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Step 1: Scan & Transfer {formatPrice(cartTotal)}
            </span>
            <span style={{ fontSize: '0.78rem', color: '#78716C' }}>0% Gateway Surcharge</span>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* QR Code */}
            <div
              style={{
                backgroundColor: '#FAF7F2',
                padding: '10px',
                borderRadius: '14px',
                border: '1px solid #E7E5E4',
                textAlign: 'center',
              }}
            >
              <img
                src={qrCodeUrl}
                alt="Madhuvan UPI QR Code"
                style={{ width: '135px', height: '135px', display: 'block', borderRadius: '8px' }}
              />
              <span style={{ fontSize: '0.7rem', color: '#78716C', marginTop: '4px', display: 'block', fontWeight: 600 }}>
                Scan with any UPI App
              </span>
            </div>

            {/* UPI ID & Bank Details */}
            <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#78716C', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Business UPI ID:
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    backgroundColor: '#FAF7F2',
                    border: '1px solid #E7E5E4',
                  }}
                >
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.95rem', color: '#1C1917' }}>
                    {BUSINESS_PAYMENT_DETAILS.upiId}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(BUSINESS_PAYMENT_DETAILS.upiId, 'UPI ID')}
                    style={{
                      background: copiedField === 'UPI ID' ? '#059669' : '#D97706',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {copiedField === 'UPI ID' ? <Check size={12} /> : <Copy size={12} />}
                    {copiedField === 'UPI ID' ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#78716C', fontWeight: 600, display: 'block', marginBottom: '2px' }}>
                  Beneficiary Name:
                </label>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1C1917' }}>
                  {BUSINESS_PAYMENT_DETAILS.upiName}
                </div>
              </div>

              {/* Bank Account Toggle */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowBankDetails(!showBankDetails)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#B45309',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: 0,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Building2 size={14} />
                  {showBankDetails ? 'Hide NEFT / Bank Account Details' : 'Or Pay via Direct Bank Transfer (NEFT / IMPS)'}
                </button>

                {showBankDetails && (
                  <div
                    style={{
                      marginTop: '0.5rem',
                      padding: '0.85rem',
                      borderRadius: '10px',
                      backgroundColor: '#FAF7F2',
                      border: '1px solid #E7E5E4',
                      fontSize: '0.8rem',
                      lineHeight: 1.6,
                      color: '#44403C',
                    }}
                  >
                    <div><strong>Bank:</strong> {BUSINESS_PAYMENT_DETAILS.bankName}</div>
                    <div><strong>Account Name:</strong> {BUSINESS_PAYMENT_DETAILS.accountName}</div>
                    <div className="flex items-center justify-between">
                      <span><strong>Account No:</strong> {BUSINESS_PAYMENT_DETAILS.accountNumber}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(BUSINESS_PAYMENT_DETAILS.accountNumber, 'Account Number')}
                        style={{ background: 'none', border: 'none', color: '#D97706', cursor: 'pointer', fontWeight: 700, fontSize: '0.75rem' }}
                      >
                        Copy
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span><strong>IFSC:</strong> {BUSINESS_PAYMENT_DETAILS.ifscCode}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(BUSINESS_PAYMENT_DETAILS.ifscCode, 'IFSC Code')}
                        style={{ background: 'none', border: 'none', color: '#D97706', cursor: 'pointer', fontWeight: 700, fontSize: '0.75rem' }}
                      >
                        Copy
                      </button>
                    </div>
                    <div><strong>Branch:</strong> {BUSINESS_PAYMENT_DETAILS.branch}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Step 2: Proof of Payment */}
          <div style={{ borderTop: '1px solid #FEF3C7', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <span style={{ fontWeight: 700, color: '#92400E', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Step 2: Enter Transaction Proof
            </span>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1C1917', display: 'block', marginBottom: '6px' }}>
                UPI Reference ID / UTR Number <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 408219485721 (12-digit number from UPI app)"
                value={utrNumber}
                onChange={(e) => {
                  setUtrNumber(e.target.value);
                  setFormError(null);
                }}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #D6D3D1',
                  fontSize: '0.92rem',
                  outline: 'none',
                }}
              />
              <span style={{ fontSize: '0.75rem', color: '#78716C', marginTop: '4px', display: 'block' }}>
                You will find this 12-digit reference number under transaction details in Google Pay, PhonePe, or Paytm.
              </span>
            </div>

            {/* Payment Screenshot (Optional but recommended) */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1C1917', display: 'block', marginBottom: '6px' }}>
                Upload Payment Screenshot <span style={{ fontSize: '0.75rem', color: '#78716C', fontWeight: 500 }}>(Optional, helps quick verification)</span>
              </label>

              {screenshotPreview ? (
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <img
                    src={screenshotPreview}
                    alt="Payment receipt preview"
                    style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #E7E5E4' }}
                  />
                  <button
                    type="button"
                    onClick={removeScreenshot}
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-6px',
                      backgroundColor: '#DC2626',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '50%',
                      width: '22px',
                      height: '22px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    title="Remove Screenshot"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    borderRadius: '10px',
                    border: '1.5px dashed #D6D3D1',
                    backgroundColor: '#FAF7F2',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    color: '#57534E',
                    fontWeight: 600,
                    width: 'fit-content',
                  }}
                >
                  <Upload size={16} color="#D97706" />
                  <span>Choose screenshot image (PNG, JPG)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotChange}
                    style={{ display: 'none' }}
                  />
                </label>
              )}
            </div>

            {/* Notice regarding verification */}
            <div
              style={{
                backgroundColor: '#FFFBEB',
                border: '1px solid #FDE68A',
                borderRadius: '10px',
                padding: '0.75rem 1rem',
                fontSize: '0.8rem',
                color: '#92400E',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
              }}
            >
              <AlertCircle size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <strong>Verification Policy:</strong> Your order will initially be marked as <strong>Payment Verification Pending</strong>. Our apiary accounts team matches your UTR with our bank statement within 15–30 minutes before packing your honey.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COD Helper Box */}
      {selectedMethod === 'cod' && (
        <div
          style={{
            backgroundColor: '#EFF6FF',
            borderRadius: '14px',
            border: '1px solid #BFDBFE',
            padding: '1.25rem',
            color: '#1E40AF',
            fontSize: '0.88rem',
            lineHeight: 1.6,
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: '4px' }}>
            💵 Zero Advance Payment Required
          </div>
          <div>
            Your pure honey jars will be dispatched directly to your address. You can hand over cash or scan the delivery executive's UPI QR code at your door.
          </div>
        </div>
      )}

      {/* Error Message */}
      {formError && (
        <div
          style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FCA5A5',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            color: '#B91C1C',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}
        >
          {formError}
        </div>
      )}

      {/* Submit / Action Buttons */}
      <div
        className="payment-action-buttons"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginTop: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <Button variant="ghost" type="button" onClick={onBack} disabled={isProcessing}>
          Back to Address
        </Button>

        <Button size="lg" type="submit" isLoading={isProcessing}>
          {selectedMethod === 'upi' ? 'I Have Paid & Place Order' : 'Confirm COD Order'}
        </Button>
      </div>

      <div className="flex items-center justify-center gap-2" style={{ color: '#78716C', fontSize: '0.8rem' }}>
        <ShieldCheck size={16} color="#059669" />
        <span>Direct apiary verified checkout • No third-party gateway charges</span>
      </div>

      <style>{`
        @media (max-width: 480px) {
          .payment-action-buttons {
            flex-direction: column-reverse !important;
            align-items: stretch !important;
          }
          .payment-action-buttons button {
            width: 100% !important;
          }
        }
      `}</style>
    </form>
  );
};
