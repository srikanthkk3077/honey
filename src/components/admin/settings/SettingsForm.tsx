import React, { useState, useEffect } from 'react';
import { Input } from '../../common/Input';
import { Button } from '../../common/Button';
import { useStore } from '../../../store/store';
import { APP_NAME, CONTACT_INFO, FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE, BUSINESS_PAYMENT_DETAILS } from '../../../utils/constants';
import { DeliveryZone, DeliveryConfig } from '../../../types/customer.types';
import { DEFAULT_DELIVERY_CONFIG, DEFAULT_DELIVERY_ZONES, fetchPincodeDetails } from '../../../utils/delivery';
import {
  Loader,
  QrCode,
  Truck,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Globe,
  Lock,
  Search,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const SettingsForm: React.FC = () => {
  const { settings, updateSettings, showToast } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // General Store Details
  const [storeName, setStoreName] = useState(settings?.storeName || APP_NAME);
  const [brandTagline, setBrandTagline] = useState(settings?.brandTagline || '100% Pure, Raw & Forest Harvested Honey');
  const [phone, setPhone] = useState(settings?.phone || CONTACT_INFO.phone);
  const [email, setEmail] = useState(settings?.email || CONTACT_INFO.email);
  const [address, setAddress] = useState(settings?.address || CONTACT_INFO.address);

  // Shipping Rates
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

  // Delivery & Serviceability Configuration
  const [deliveryMode, setDeliveryMode] = useState<'all_india' | 'restricted_pincodes'>(
    settings?.deliveryConfig?.serviceabilityMode || DEFAULT_DELIVERY_CONFIG.serviceabilityMode
  );
  const [defaultDeliveryDays, setDefaultDeliveryDays] = useState(
    settings?.deliveryConfig?.defaultDeliveryDays || DEFAULT_DELIVERY_CONFIG.defaultDeliveryDays
  );
  const [codAvailableDefault, setCodAvailableDefault] = useState(
    settings?.deliveryConfig?.codAvailableDefault ?? DEFAULT_DELIVERY_CONFIG.codAvailableDefault
  );
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>(
    settings?.deliveryConfig?.serviceablePincodes || DEFAULT_DELIVERY_ZONES
  );

  // New Zone Form inputs
  const [newPincode, setNewPincode] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newDeliveryDays, setNewDeliveryDays] = useState('2-3 business days');
  const [newIsCod, setNewIsCod] = useState(true);
  const [isLookingUpPin, setIsLookingUpPin] = useState(false);

  // Bulk add modal/input
  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const [bulkInput, setBulkInput] = useState('');
  const [bulkDays, setBulkDays] = useState('2-3 business days');
  const [zoneSearch, setZoneSearch] = useState('');

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

      if (settings.deliveryConfig) {
        const d = settings.deliveryConfig;
        if (d.serviceabilityMode) setDeliveryMode(d.serviceabilityMode);
        if (d.defaultDeliveryDays) setDefaultDeliveryDays(d.defaultDeliveryDays);
        if (d.codAvailableDefault !== undefined) setCodAvailableDefault(d.codAvailableDefault);
        if (Array.isArray(d.serviceablePincodes) && d.serviceablePincodes.length > 0) {
          setDeliveryZones(d.serviceablePincodes);
        }
      }
    }
  }, [settings]);

  // Live postal lookup when typing new pincode
  const handleNewPincodeChange = async (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 6);
    setNewPincode(clean);

    if (clean.length === 6) {
      setIsLookingUpPin(true);
      try {
        const details = await fetchPincodeDetails(clean);
        if (details) {
          if (!newCity) setNewCity(details.city);
          if (!newState) setNewState(details.state);
        }
      } finally {
        setIsLookingUpPin(false);
      }
    }
  };

  // Add single zone
  const handleAddZone = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newPincode.replace(/\D/g, '').slice(0, 6);
    if (clean.length !== 6) {
      alert('Please enter a valid 6-digit PIN code.');
      return;
    }

    if (deliveryZones.some((z) => z.pincode === clean)) {
      alert(`PIN code ${clean} already exists in your delivery areas.`);
      return;
    }

    const newZone: DeliveryZone = {
      pincode: clean,
      city: newCity.trim() || 'City Area',
      state: newState.trim() || 'State',
      deliveryDays: newDeliveryDays.trim() || '2-3 business days',
      isCodAvailable: newIsCod,
      isActive: true,
    };

    setDeliveryZones([newZone, ...deliveryZones]);
    setNewPincode('');
    setNewCity('');
    setNewState('');
    showToast(`Added PIN ${clean} to delivery zones!`, 'success');
  };

  // Toggle active/inactive
  const handleToggleZoneActive = (pincode: string) => {
    setDeliveryZones((prev) =>
      prev.map((z) => (z.pincode === pincode ? { ...z, isActive: !z.isActive } : z))
    );
  };

  // Delete a zone
  const handleDeleteZone = (pincode: string) => {
    if (window.confirm(`Are you sure you want to remove PIN code ${pincode} from delivery zones?`)) {
      setDeliveryZones((prev) => prev.filter((z) => z.pincode !== pincode));
      showToast(`Removed PIN ${pincode}`, 'info');
    }
  };

  // Bulk add pincodes
  const handleBulkAdd = () => {
    const rawMatches = bulkInput.match(/\b\d{6}\b/g);
    if (!rawMatches || rawMatches.length === 0) {
      alert('No 6-digit PIN codes found in the text. Please paste valid 6-digit postal codes.');
      return;
    }

    const uniquePins = Array.from(new Set(rawMatches));
    let addedCount = 0;
    const newZones = [...deliveryZones];

    uniquePins.forEach((pin) => {
      if (!newZones.some((z) => z.pincode === pin)) {
        newZones.push({
          pincode: pin,
          city: 'Service Hub',
          state: 'India',
          deliveryDays: bulkDays.trim() || '2-3 business days',
          isCodAvailable: true,
          isActive: true,
        });
        addedCount++;
      }
    });

    setDeliveryZones(newZones);
    setBulkInput('');
    setShowBulkAdd(false);
    showToast(`Successfully added ${addedCount} new delivery PIN codes!`, 'success');
  };

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
      deliveryConfig: {
        serviceabilityMode: deliveryMode,
        defaultDeliveryDays,
        codAvailableDefault,
        serviceablePincodes: deliveryZones,
      },
    };

    try {
      await updateSettings(payload);
      showToast('Store & delivery settings updated successfully!', 'success');
    } catch (err: any) {
      console.error('Settings update failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Filtered zones for list
  const filteredZones = deliveryZones.filter(
    (z) =>
      z.pincode.includes(zoneSearch.trim()) ||
      z.city.toLowerCase().includes(zoneSearch.toLowerCase().trim()) ||
      z.state.toLowerCase().includes(zoneSearch.toLowerCase().trim())
  );

  const activeZoneCount = deliveryZones.filter((z) => z.isActive !== false).length;

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <Loader size={36} color="#D97706" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }} />
        <p style={{ color: '#78716C' }}>Loading current store configuration…</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '850px' }}>
      {/* ─── 1. General Store Details ────────────────────────────────────────── */}
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

      {/* ─── 2. Delivery Coverage & Serviceable Pincodes ─────────────────────── */}
      <div style={{ backgroundColor: '#FFFFFF', padding: 'clamp(1rem, 3vw, 1.75rem)', borderRadius: '16px', border: '1.5px solid #FDE68A', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: '#FEF3C7', color: '#D97706' }}>
              <Truck size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.15rem', color: '#1C1917', margin: 0 }}>Delivery Serviceability & PIN Code Control</h4>
              <p style={{ color: '#78716C', fontSize: '0.82rem', margin: '2px 0 0 0' }}>
                Specify which locations Madhuvan ships to. Checkout validates matching PIN codes before order placement.
              </p>
            </div>
          </div>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, padding: '4px 10px', borderRadius: '8px', backgroundColor: '#ECFDF5', color: '#065F46', border: '1px solid #A7F3D0' }}>
            {activeZoneCount} Active Delivery Hubs
          </span>
        </div>

        {/* Serviceability Mode Selection Cards */}
        <div>
          <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#1C1917', marginBottom: '0.6rem' }}>
            Select Shipping Coverage Policy:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {/* Restricted Mode */}
            <div
              onClick={() => setDeliveryMode('restricted_pincodes')}
              style={{
                padding: '1rem 1.25rem',
                borderRadius: '12px',
                border: deliveryMode === 'restricted_pincodes' ? '2px solid #D97706' : '1px solid #E7E5E4',
                backgroundColor: deliveryMode === 'restricted_pincodes' ? '#FFFBEB' : '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Lock size={16} color={deliveryMode === 'restricted_pincodes' ? '#D97706' : '#78716C'} />
                <span style={{ fontWeight: 800, fontSize: '0.95rem', color: deliveryMode === 'restricted_pincodes' ? '#92400E' : '#1C1917' }}>
                  Restricted PIN Codes Only (Strict)
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#78716C', margin: 0, lineHeight: 1.4 }}>
                Deliver ONLY to the approved serviceable PIN codes listed below. Any other PIN code will be blocked at checkout.
              </p>
            </div>

            {/* All India Mode */}
            <div
              onClick={() => setDeliveryMode('all_india')}
              style={{
                padding: '1rem 1.25rem',
                borderRadius: '12px',
                border: deliveryMode === 'all_india' ? '2px solid #D97706' : '1px solid #E7E5E4',
                backgroundColor: deliveryMode === 'all_india' ? '#FFFBEB' : '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Globe size={16} color={deliveryMode === 'all_india' ? '#D97706' : '#78716C'} />
                <span style={{ fontWeight: 800, fontSize: '0.95rem', color: deliveryMode === 'all_india' ? '#92400E' : '#1C1917' }}>
                  All-India Open Delivery
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#78716C', margin: 0, lineHeight: 1.4 }}>
                Accept orders from all 19,000+ PIN codes across India. Below zones receive express delivery timelines.
              </p>
            </div>
          </div>
        </div>

        {/* Global Delivery Settings */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', backgroundColor: '#FAF7F2', padding: '1rem', borderRadius: '12px', border: '1px solid #E7E5E4' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
              Default Delivery Window:
            </label>
            <input
              type="text"
              value={defaultDeliveryDays}
              onChange={(e) => setDefaultDeliveryDays(e.target.value)}
              placeholder="e.g. 2-4 business days"
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #D6D3D1', fontSize: '0.88rem', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', paddingTop: '1.2rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem', color: '#44403C', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={codAvailableDefault}
                onChange={(e) => setCodAvailableDefault(e.target.checked)}
                style={{ width: '17px', height: '17px', accentColor: '#D97706' }}
              />
              <span>Cash on Delivery (COD) allowed by default</span>
            </label>
          </div>
        </div>

        {/* Add New Serviceable Area Form */}
        <div style={{ border: '1px solid #E7E5E4', borderRadius: '14px', padding: '1.25rem', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '8px' }}>
            <h5 style={{ fontSize: '0.95rem', color: '#1C1917', margin: 0, fontWeight: 700 }}>
              + Add New Serviceable PIN Code / City
            </h5>
            <button
              type="button"
              onClick={() => setShowBulkAdd(!showBulkAdd)}
              style={{
                background: 'none',
                border: '1px solid #D6D3D1',
                borderRadius: '8px',
                padding: '4px 10px',
                fontSize: '0.78rem',
                color: '#57534E',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              {showBulkAdd ? 'Hide Bulk Paste' : '📋 Quick Bulk Paste PINs'}
            </button>
          </div>

          {/* Bulk Paste Box */}
          {showBulkAdd && (
            <div style={{ backgroundColor: '#FAF7F2', padding: '1rem', borderRadius: '10px', marginBottom: '1rem', border: '1px solid #E7E5E4' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                Paste PIN codes separated by comma or new lines:
              </label>
              <textarea
                rows={3}
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                placeholder="e.g. 560001, 560034, 110001, 400001, 500081..."
                style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px', borderRadius: '8px', border: '1px solid #D6D3D1', fontSize: '0.85rem', fontFamily: 'monospace' }}
              />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.78rem', color: '#78716C' }}>Delivery Days:</span>
                  <input
                    type="text"
                    value={bulkDays}
                    onChange={(e) => setBulkDays(e.target.value)}
                    style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.8rem', width: '140px' }}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleBulkAdd}
                  style={{
                    backgroundColor: '#D97706',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px 14px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Import All Pincodes
                </button>
              </div>
            </div>
          )}

          {/* Single Add Inputs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#57534E', marginBottom: '3px' }}>
                PIN Code {isLookingUpPin && '…'}
              </label>
              <input
                type="text"
                maxLength={6}
                value={newPincode}
                onChange={(e) => handleNewPincodeChange(e.target.value)}
                placeholder="e.g. 560001"
                style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #D6D3D1', fontSize: '0.85rem', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#57534E', marginBottom: '3px' }}>
                City / Region
              </label>
              <input
                type="text"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                placeholder="e.g. Bengaluru"
                style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #D6D3D1', fontSize: '0.85rem', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#57534E', marginBottom: '3px' }}>
                State
              </label>
              <input
                type="text"
                value={newState}
                onChange={(e) => setNewState(e.target.value)}
                placeholder="e.g. Karnataka"
                style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #D6D3D1', fontSize: '0.85rem', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#57534E', marginBottom: '3px' }}>
                Delivery Days
              </label>
              <input
                type="text"
                value={newDeliveryDays}
                onChange={(e) => setNewDeliveryDays(e.target.value)}
                placeholder="1-2 business days"
                style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #D6D3D1', fontSize: '0.85rem', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '36px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#44403C', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                <input
                  type="checkbox"
                  checked={newIsCod}
                  onChange={(e) => setNewIsCod(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#D97706' }}
                />
                COD OK
              </label>
            </div>

            <div>
              <button
                type="button"
                onClick={handleAddZone}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  backgroundColor: '#D97706',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                }}
              >
                <Plus size={15} /> Add
              </button>
            </div>
          </div>
        </div>

        {/* Serviceable Pincodes List & Search */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1C1917' }}>
              Configured Delivery Zones ({filteredZones.length})
            </span>
            <div style={{ position: 'relative', width: '220px' }}>
              <Search size={14} color="#78716C" style={{ position: 'absolute', left: '10px', top: '10px' }} />
              <input
                type="text"
                value={zoneSearch}
                onChange={(e) => setZoneSearch(e.target.value)}
                placeholder="Search PIN, city, state…"
                style={{
                  width: '100%',
                  padding: '6px 10px 6px 30px',
                  borderRadius: '8px',
                  border: '1px solid #D6D3D1',
                  fontSize: '0.82rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div
            style={{
              maxHeight: '320px',
              overflowY: 'auto',
              border: '1px solid #E7E5E4',
              borderRadius: '12px',
              backgroundColor: '#FAFAF9',
            }}
          >
            {filteredZones.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#78716C', fontSize: '0.85rem' }}>
                No delivery zones match your search.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {filteredZones.map((zone) => (
                  <div
                    key={zone.pincode}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderBottom: '1px solid #E7E5E4',
                      backgroundColor: zone.isActive !== false ? '#FFFFFF' : '#F5F5F4',
                      opacity: zone.isActive !== false ? 1 : 0.6,
                      gap: '12px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '180px' }}>
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontWeight: 800,
                          fontSize: '0.9rem',
                          color: '#1C1917',
                          backgroundColor: '#FEF3C7',
                          padding: '3px 8px',
                          borderRadius: '6px',
                        }}
                      >
                        {zone.pincode}
                      </span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1C1917' }}>{zone.city}</div>
                        <div style={{ fontSize: '0.75rem', color: '#78716C' }}>{zone.state}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#57534E' }}>
                      <span>🚚 {zone.deliveryDays}</span>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontWeight: 700,
                          backgroundColor: zone.isCodAvailable ? '#ECFDF5' : '#FEF2F2',
                          color: zone.isCodAvailable ? '#065F46' : '#991B1B',
                        }}
                      >
                        {zone.isCodAvailable ? 'COD OK' : 'Prepaid'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#78716C', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={zone.isActive !== false}
                          onChange={() => handleToggleZoneActive(zone.pincode)}
                          style={{ accentColor: '#059669' }}
                        />
                        Active
                      </label>
                      <button
                        type="button"
                        onClick={() => handleDeleteZone(zone.pincode)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#EF4444',
                          cursor: 'pointer',
                          padding: '4px',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                        title="Delete zone"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── 3. Shipping & Fulfillment Rates ──────────────────────────────────── */}
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

      {/* ─── 4. Payment Configuration ────────────────────────────────────────── */}
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
          {isSaving ? 'Saving Store Settings…' : 'Save All Store Settings'}
        </Button>
      </div>
    </form>
  );
};

export default SettingsForm;
