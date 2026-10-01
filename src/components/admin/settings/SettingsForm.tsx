import React, { useState, useEffect } from 'react';
import { Input } from '../../common/Input';
import { Button } from '../../common/Button';
import { useStore } from '../../../store/store';
import { APP_NAME, CONTACT_INFO, FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE, BUSINESS_PAYMENT_DETAILS } from '../../../utils/constants';
import { settingsApi } from '../../../services/customerApi';
import { Loader, QrCode, Building2, Check, RefreshCw } from 'lucide-react';

export const SettingsForm: React.FC = () => {
  const { settings, updateSettings } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // General Store Details
  const [storeName, setStoreName] = useState(settings?.storeName || APP_NAME);
  const [brandTagline, setBrandTagline] = useState(settings?.brandTagline || '100% Pure, Raw & Forest Harvested Honey');
  const [phone, setPhone] = useState(settings?.phone || CONTACT_INFO.phone);
  const [email, setEmail] = useState(settings?.email || CONTACT_INFO.email);
  const [address, setAddress] = useState(settings?.address || CONTACT_INFO.address);

  // Shipping
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(String(settings?.freeShippingThreshold ?? FREE_SHIPPING_THRESHOLD));
  const [shippingFee, setShippingFee] = useState(String(settings?.shippingFee ?? STANDARD_SHIPPING_FEE));

  // Payment Configuration
  const [upiId, setUpiId] = useState(settings?.paymentConfig?.upiId || BUSINESS_PAYMENT_DETAILS.upiId);
  const [accountHolderName, setAccountHolderName] = useState(settings?.paymentConfig?.accountHolderName || BUSINESS_PAYMENT_DETAILS.accountName);
  const [accountNumber, setAccountNumber] = useState(settings?.paymentConfig?.accountNumber || BUSINESS_PAYMENT_DETAILS.accountNumber);
  const [ifscCode, setIfscCode] = useState(settings?.paymentConfig?.ifscCode || BUSINESS_PAYMENT_DETAILS.ifscCode);
  const [bankName, setBankName] = useState(settings?.paymentConfig?.bankName || BUSINESS_PAYMENT_DETAILS.bankName);
  const [isUpiActive, setIsUpiActive] = useState(settings?.paymentConfig?.isUpiActive ?? true);
  const [isBankTransferActive, setIsBankTransferActive] = useState(settings?.paymentConfig?.isBankTransferActive ?? true);
  const [isCodActive, setIsCodActive] = useState(settings?.paymentConfig?.isCodActive ?? true);

  // Populate from settings when available
  useEffect(() => {
    if (settings) {
      if (settings.storeName) setStoreName(settings.storeName);
      if (settings.brandTagline) setBrandTagline(settings.brandTagline);
      if (settings.phone) setPhone(settings.phone);
      if (settings.email) setEmail(settings.email);
      if (settings.address) setAddress(settings.address);
      if (settings.freeShippingThreshold !== undefined) setFreeShippingThreshold(String(settings.freeShippingThreshold));
      if (settings.shippingFee !== undefined) setShippingFee(String(settings.shippingFee));

      if (settings.paymentConfig) {
        const p = settings.paymentConfig;
        if (p.upiId) setUpiId(p.upiId);
        if (p.accountHolderName) setAccountHolderName(p.accountHolderName);
        if (p.accountNumber) setAccountNumber(p.accountNumber);
        if (p.ifscCode) setIfscCode(p.ifscCode);
        if (p.bankName) setBankName(p.bankName);
        if (p.isUpiActive !== undefined) setIsUpiActive(p.isUpiActive);
        if (p.isBankTransferActive !== undefined) setIsBankTransferActive(p.isBankTransferActive);
        if (p.isCodActive !== undefined) setIsCodActive(p.isCodActive);
      }
    }
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const payload = {
      storeName,
      brandTagline,
      phone,
      email,
      address,
      freeShippingThreshold: Number(freeShippingThreshold) || 999,
      shippingFee: Number(shippingFee) || 79,
      paymentConfig: {
        upiId,
        accountHolderName,
        accountNumber,
        ifscCode,
        bankName,
        isUpiActive,
        isBankTransferActive,
        isCodActive,
      },
    };

    try {
      await updateSettings(payload);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <Loader size={36} color="#D97706" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }} />
        <p style={{ color: '#78716C' }}>Loading current store configuration…</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '780px' }}>
      {/* General Store Details */}
      <div style={{ backgroundColor: '#FFFFFF', padding: 'clamp(1rem, 3vw, 1.75rem)', borderRadius: '16px', border: '1px solid #E7E5E4', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h4 style={{ fontSize: '1.1rem', color: '#1C1917', margin: 0 }}>General Store Details</h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '1rem' }}>
          <Input
            label="Store Display Name"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
          />
          <Input
            label="Brand Tagline"
            value={brandTagline}
            onChange={(e) => setBrandTagline(e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem' }}>
          <Input
            label="Support Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input
            label="Support Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#44403C', marginBottom: '0.35rem' }}>
            Registered Apiary Headquarters Address
          </label>
          <textarea
            rows={2}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={{ width: '100%', boxSizing: 'border-box', padding: '0.65rem 0.95rem', borderRadius: '10px', border: '1px solid #D6D3D1', outline: 'none', fontFamily: 'inherit' }}
          />
        </div>
      </div>

      {/* Shipping & Fulfillment Rates */}
      <div style={{ backgroundColor: '#FFFFFF', padding: 'clamp(1rem, 3vw, 1.75rem)', borderRadius: '16px', border: '1px solid #E7E5E4', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h4 style={{ fontSize: '1.1rem', color: '#1C1917', margin: 0 }}>Shipping & Fulfillment Rates</h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem' }}>
          <Input
            label="Free Shipping Minimum Order (₹)"
            type="number"
            value={freeShippingThreshold}
            onChange={(e) => setFreeShippingThreshold(e.target.value)}
          />
          <Input
            label="Standard Shipping Fee (₹)"
            type="number"
            value={shippingFee}
            onChange={(e) => setShippingFee(e.target.value)}
          />
        </div>
      </div>

      {/* Payment Configuration */}
      <div style={{ backgroundColor: '#FFFFFF', padding: 'clamp(1rem, 3vw, 1.75rem)', borderRadius: '16px', border: '1px solid #E7E5E4', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className="flex items-center gap-2">
          <QrCode size={20} color="#D97706" />
          <h4 style={{ fontSize: '1.1rem', color: '#1C1917', margin: 0 }}>UPI & Bank Transfer Settlement</h4>
        </div>
        <p style={{ color: '#78716C', fontSize: '0.85rem', margin: 0 }}>
          Configure your business UPI ID and bank account details where customer payments are deposited during checkout.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '1rem' }}>
          <Input
            label="Business UPI ID (VPA)"
            placeholder="e.g. madhuvanhoney@upi"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
          />
          <Input
            label="Account Beneficiary Name"
            placeholder="e.g. Madhuvan Apiaries"
            value={accountHolderName}
            onChange={(e) => setAccountHolderName(e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem' }}>
          <Input
            label="Bank Account Number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
          />
          <Input
            label="IFSC Code"
            value={ifscCode}
            onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
          />
          <Input
            label="Bank Name"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
          />
        </div>

        {/* Payment Gateways Toggle */}
        <div style={{ borderTop: '1px solid #F5F1E9', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1C1917' }}>Active Checkout Payment Channels</div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem', color: '#44403C' }}>
            <input
              type="checkbox"
              checked={isUpiActive}
              onChange={(e) => setIsUpiActive(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#D97706' }}
            />
            <span>Enable Direct UPI (QR Code & Deep Link)</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem', color: '#44403C' }}>
            <input
              type="checkbox"
              checked={isBankTransferActive}
              onChange={(e) => setIsBankTransferActive(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#D97706' }}
            />
            <span>Enable NEFT / RTGS / IMPS Direct Bank Wire</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem', color: '#44403C' }}>
            <input
              type="checkbox"
              checked={isCodActive}
              onChange={(e) => setIsCodActive(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#D97706' }}
            />
            <span>Enable Cash on Delivery (COD)</span>
          </label>
        </div>
      </div>

      <div>
        <Button type="submit" size="lg" disabled={isSaving} rightIcon={isSaving ? <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> : undefined}>
          {isSaving ? 'Saving…' : 'Save All Store Settings'}
        </Button>
      </div>
    </form>
  );
};

export default SettingsForm;
