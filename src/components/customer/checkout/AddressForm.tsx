import React, { useState, useCallback, useEffect } from 'react';
import { ShippingAddress } from '../../../types/order.types';
import { Button } from '../../common/Button';
import { CheckCircle2, AlertCircle, User, Phone, Mail, MapPin, Building, Navigation, ExternalLink, Compass } from 'lucide-react';
import { useStore } from '../../../store/store';
import { checkPincodeServiceability, fetchPincodeDetails, generateGoogleMapsLink, PincodeCheckResult } from '../../../utils/delivery';

interface AddressFormProps {
  address: ShippingAddress;
  onChange: (updates: Partial<ShippingAddress>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

// ─── Validators ───────────────────────────────────────────────────────────────
const validators = {
  fullName: (v: string) => {
    if (!v.trim()) return 'Full name is required';
    if (v.trim().length < 2) return 'Name must be at least 2 characters';
    return '';
  },
  phone: (v: string) => {
    const d = v.replace(/\D/g, '');
    if (!v.trim()) return 'Phone number is required';
    if (d.length < 10) return 'Enter a valid 10-digit mobile number';
    if (!/^[6-9]\d{9}$/.test(d.slice(-10))) return 'Must start with 6, 7, 8 or 9';
    return '';
  },
  email: (v: string) => {
    if (!v.trim()) return 'Email address is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) return 'Enter a valid email (e.g. name@gmail.com)';
    return '';
  },
  addressLine1: (v: string) => {
    if (!v.trim()) return 'Street address is required';
    if (v.trim().length < 8) return 'Please enter your full street address';
    return '';
  },
  city: (v: string) => {
    if (!v.trim()) return 'City is required';
    return '';
  },
  state: (v: string) => {
    if (!v.trim()) return 'State is required';
    return '';
  },
  pincode: (v: string) => {
    const d = v.replace(/\D/g, '');
    if (!d) return 'PIN code is required';
    if (!/^\d{6}$/.test(d)) return 'PIN code must be exactly 6 digits';
    return '';
  },
};

type FK = keyof typeof validators;
const FIELDS: FK[] = ['fullName', 'phone', 'email', 'addressLine1', 'city', 'state', 'pincode'];

const inpStyle = (err: boolean, ok: boolean): React.CSSProperties => ({
  width: '100%',
  padding: '10px 13px',
  borderRadius: '10px',
  border: `1.5px solid ${err ? '#FCA5A5' : ok ? '#6EE7B7' : '#D1D5DB'}`,
  backgroundColor: err ? '#FFF5F5' : ok ? '#F0FDF4' : '#FFFFFF',
  fontSize: '0.92rem',
  outline: 'none',
  transition: 'border-color 0.2s, background-color 0.2s',
  boxSizing: 'border-box' as const,
  fontFamily: 'inherit',
  color: '#1C1917',
});

interface FProps {
  label: string;
  icon: React.ReactNode;
  error: string;
  show: boolean;
  valid: boolean;
  hint?: string;
  children: React.ReactNode;
}

const F: React.FC<FProps> = ({ label, icon, error, show, valid, hint, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
    <label
      style={{
        fontSize: '0.82rem',
        fontWeight: 700,
        color: show && error ? '#DC2626' : '#374151',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
      }}
    >
      {icon} {label} <span style={{ color: '#DC2626' }}>*</span>
      {valid && <CheckCircle2 size={13} color="#059669" style={{ marginLeft: 'auto' }} />}
    </label>
    {children}
    {show && error ? (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem', color: '#DC2626', animation: 'afd 0.15s ease' }}>
        <AlertCircle size={12} />
        {error}
      </div>
    ) : (
      hint && <span style={{ fontSize: '0.72rem', color: '#78716C' }}>{hint}</span>
    )}
  </div>
);

export const AddressForm: React.FC<AddressFormProps> = ({ address, onChange, onSubmit }) => {
  const { settings } = useStore();
  const [touched, setTouched] = useState<Partial<Record<FK, boolean>>>({});
  const [errors, setErrors] = useState<Partial<Record<FK, string>>>({});
  const [submitted, setSub] = useState(false);

  // Pincode serviceability state
  const [serviceability, setServiceability] = useState<PincodeCheckResult | null>(null);
  const [isLookingUpPin, setIsLookingUpPin] = useState(false);
  const [showCustomMapUrlInput, setShowCustomMapUrlInput] = useState(false);

  // Initialize with stored pincode from product page if address pincode is empty
  useEffect(() => {
    if (!address.pincode) {
      const savedPin = localStorage.getItem('madhuvan_customer_pincode');
      if (savedPin && savedPin.length === 6) {
        handlePincodeChange(savedPin);
      }
    } else if (address.pincode.length === 6) {
      const result = checkPincodeServiceability(address.pincode, settings?.deliveryConfig);
      setServiceability(result);
    }
  }, [settings?.deliveryConfig]);

  const touch = useCallback((f: FK, v: string) => {
    setTouched((p) => ({ ...p, [f]: true }));
    setErrors((p) => ({ ...p, [f]: validators[f](v) }));
  }, []);

  const change = (f: FK, v: string) => {
    onChange({ [f]: v } as Partial<ShippingAddress>);
    if (touched[f] || submitted) setErrors((p) => ({ ...p, [f]: validators[f](v) }));
  };

  // Handle live pincode validation & auto-complete city/state
  const handlePincodeChange = async (pinInput: string) => {
    const clean = pinInput.replace(/\D/g, '').slice(0, 6);
    change('pincode', clean);

    if (clean.length === 6) {
      setIsLookingUpPin(true);
      const res = checkPincodeServiceability(clean, settings?.deliveryConfig);
      setServiceability(res);

      try {
        const details = await fetchPincodeDetails(clean);
        if (details) {
          const updates: Partial<ShippingAddress> = { pincode: clean };
          if (!address.city || res.city) updates.city = details.city;
          if (!address.state || res.state) updates.state = details.state;
          onChange(updates);
        }
      } finally {
        setIsLookingUpPin(false);
      }
    } else {
      setServiceability(null);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSub(true);

    const errs: Partial<Record<FK, string>> = {};
    FIELDS.forEach((f) => {
      errs[f] = validators[f]((address as any)[f] ?? '');
    });

    // Check delivery serviceability
    const pinCheck = checkPincodeServiceability(address.pincode, settings?.deliveryConfig);
    if (!pinCheck.isServiceable) {
      errs.pincode = pinCheck.message || 'Delivery is not available to this PIN code.';
      setServiceability(pinCheck);
    }

    setErrors(errs);
    setTouched(Object.fromEntries(FIELDS.map((f) => [f, true])));

    if (Object.values(errs).some(Boolean) || !pinCheck.isServiceable) {
      return;
    }

    // Auto-generate Google Maps link if not provided
    const googleMapsLink = address.googleMapsLink?.trim() || generateGoogleMapsLink(address);
    onChange({ googleMapsLink });

    onSubmit(e);
  };

  const show = (f: FK) => !!(touched[f] || submitted);
  const err = (f: FK) => show(f) && !!errors[f];
  const ok = (f: FK) => show(f) && !errors[f] && !!((address as any)[f] as string)?.trim();

  const prog = FIELDS.filter((f) => !validators[f]((address as any)[f] ?? '')).length;
  const currentMapsUrl = address.googleMapsLink?.trim() || generateGoogleMapsLink(address);
  const isAddressReadyForMap = !!(address.addressLine1 && (address.city || address.pincode));

  return (
    <form onSubmit={submit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
      {/* Header */}
      <div>
        <h3 style={{ fontSize: '1.25rem', color: '#1C1917', margin: '0 0 0.5rem 0' }}>Where should we ship your honey?</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ flex: 1, height: '4px', background: '#E7E5E4', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${(prog / 7) * 100}%`,
                background: prog === 7 && serviceability?.isServiceable ? '#059669' : '#D97706',
                borderRadius: '4px',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
          <span style={{ fontSize: '0.72rem', color: '#78716C', fontWeight: 600, whiteSpace: 'nowrap' }}>
            {prog}/7 fields
          </span>
        </div>
      </div>

      {/* Name + Phone */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <F label="Full Name" icon={<User size={13} />} error={errors.fullName || ''} show={show('fullName')} valid={ok('fullName')}>
          <input
            type="text"
            value={address.fullName}
            placeholder="e.g. Radhika Sharma"
            style={inpStyle(err('fullName'), ok('fullName'))}
            onChange={(e) => change('fullName', e.target.value)}
            onBlur={() => touch('fullName', address.fullName)}
            autoComplete="name"
          />
        </F>
        <F label="Phone Number" icon={<Phone size={13} />} error={errors.phone || ''} show={show('phone')} valid={ok('phone')} hint="For courier delivery tracking updates">
          <input
            type="tel"
            value={address.phone}
            placeholder="+91 98765 43210"
            maxLength={13}
            style={inpStyle(err('phone'), ok('phone'))}
            onChange={(e) => change('phone', e.target.value)}
            onBlur={() => touch('phone', address.phone)}
            autoComplete="tel"
          />
        </F>
      </div>

      {/* Email */}
      <F label="Email Address" icon={<Mail size={13} />} error={errors.email || ''} show={show('email')} valid={ok('email')}>
        <input
          type="email"
          value={address.email}
          placeholder="radhika@example.com"
          style={inpStyle(err('email'), ok('email'))}
          onChange={(e) => change('email', e.target.value)}
          onBlur={() => touch('email', address.email)}
          autoComplete="email"
        />
      </F>

      {/* Street Address */}
      <F label="Street Address / House No. / Apartment" icon={<MapPin size={13} />} error={errors.addressLine1 || ''} show={show('addressLine1')} valid={ok('addressLine1')}>
        <input
          type="text"
          value={address.addressLine1}
          placeholder="Flat 304, Green Terrace Apartments, MG Road"
          style={inpStyle(err('addressLine1'), ok('addressLine1'))}
          onChange={(e) => change('addressLine1', e.target.value)}
          onBlur={() => touch('addressLine1', address.addressLine1)}
          autoComplete="street-address"
        />
      </F>

      {/* PIN Code + City + State */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
        <F
          label="PIN Code"
          icon={<Navigation size={13} />}
          error={errors.pincode || (serviceability && !serviceability.isServiceable ? serviceability.message : '')}
          show={show('pincode') || !!(serviceability && !serviceability.isServiceable)}
          valid={ok('pincode') && !!serviceability?.isServiceable}
          hint={isLookingUpPin ? 'Checking delivery coverage…' : 'Enter 6-digit postal code'}
        >
          <input
            type="text"
            inputMode="numeric"
            value={address.pincode}
            placeholder="560001"
            maxLength={6}
            style={inpStyle(
              err('pincode') || (!!serviceability && !serviceability.isServiceable),
              ok('pincode') && !!serviceability?.isServiceable
            )}
            onChange={(e) => handlePincodeChange(e.target.value)}
            onBlur={() => touch('pincode', address.pincode)}
            autoComplete="postal-code"
          />
        </F>

        <F label="City" icon={<Building size={13} />} error={errors.city || ''} show={show('city')} valid={ok('city')}>
          <input
            type="text"
            value={address.city}
            placeholder="e.g. Bengaluru"
            style={inpStyle(err('city'), ok('city'))}
            onChange={(e) => change('city', e.target.value)}
            onBlur={() => touch('city', address.city)}
            autoComplete="address-level2"
          />
        </F>

        <F label="State" icon={<Navigation size={13} />} error={errors.state || ''} show={show('state')} valid={ok('state')}>
          <input
            type="text"
            value={address.state}
            placeholder="e.g. Karnataka"
            style={inpStyle(err('state'), ok('state'))}
            onChange={(e) => change('state', e.target.value)}
            onBlur={() => touch('state', address.state)}
            autoComplete="address-level1"
          />
        </F>
      </div>

      {/* Serviceability Live Status Banner */}
      {serviceability && (
        <div
          style={{
            padding: '12px 14px',
            borderRadius: '12px',
            backgroundColor: serviceability.isServiceable ? '#F0FDF4' : '#FEF2F2',
            border: serviceability.isServiceable ? '1.5px solid #BBF7D0' : '1.5px solid #FECACA',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            animation: 'afd 0.2s ease',
          }}
        >
          {serviceability.isServiceable ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#065F46', fontWeight: 700, fontSize: '0.88rem' }}>
                <CheckCircle2 size={16} color="#059669" />
                <span>Serviceable Area: Delivery available to {serviceability.city || address.city || 'your area'}!</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.8rem', color: '#047857', paddingLeft: '24px', flexWrap: 'wrap' }}>
                <span>🚚 Estimated Transit: <strong>{serviceability.deliveryDays}</strong></span>
                <span>💵 COD: <strong>{serviceability.isCodAvailable ? 'Eligible' : 'Prepaid Only'}</strong></span>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#991B1B', fontWeight: 700, fontSize: '0.88rem' }}>
                <AlertCircle size={16} color="#DC2626" />
                <span>Delivery Not Available</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#B91C1C', paddingLeft: '24px' }}>
                {serviceability.message || `We do not currently deliver to PIN code ${address.pincode}. Please enter a serviceable delivery address.`}
              </div>
            </>
          )}
        </div>
      )}

      {/* Google Maps Conversion & Navigation Preview */}
      <div
        style={{
          padding: '12px 16px',
          borderRadius: '12px',
          backgroundColor: '#F8FAFC',
          border: '1.5px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: '#334155', fontWeight: 600 }}>
            <Compass size={16} color="#2563EB" />
            <span>Google Maps Courier Link:</span>
          </div>

          {isAddressReadyForMap && (
            <a
              href={currentMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#2563EB',
                textDecoration: 'none',
                background: '#EFF6FF',
                padding: '4px 10px',
                borderRadius: '6px',
                border: '1px solid #BFDBFE',
              }}
            >
              <MapPin size={13} />
              Open Pin in Google Maps <ExternalLink size={12} />
            </a>
          )}
        </div>

        <div style={{ fontSize: '0.76rem', color: '#64748B', lineHeight: 1.4 }}>
          {isAddressReadyForMap
            ? '✓ Madhuvan auto-converts your street address into a high-precision Google Maps link so delivery dispatch drivers can navigate directly to your door.'
            : 'Enter your street address and PIN code above to generate an instant Google Maps navigation link.'}
        </div>

        {/* Optional Custom Google Maps Link toggle */}
        <div style={{ marginTop: '2px' }}>
          {!showCustomMapUrlInput ? (
            <button
              type="button"
              onClick={() => setShowCustomMapUrlInput(true)}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                color: '#475569',
                fontSize: '0.76rem',
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              + Have a specific Google Maps link or Landmark pin? Click to paste it
            </button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
              <input
                type="url"
                value={address.googleMapsLink || ''}
                placeholder="e.g. https://maps.app.goo.gl/... or custom landmark link"
                onChange={(e) => onChange({ googleMapsLink: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.82rem',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                  boxSizing: 'border-box',
                }}
              />
              <span style={{ fontSize: '0.7rem', color: '#64748B' }}>
                Leave blank to automatically use your street address on Google Maps.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Submit */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
        <Button
          type="submit"
          size="lg"
          disabled={serviceability !== null && !serviceability.isServiceable}
        >
          Continue to Payment
        </Button>
      </div>

      <style>{`
        @keyframes afd { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:translateY(0); } }
        input:focus { box-shadow: 0 0 0 3px rgba(217,119,6,0.12) !important; border-color: #D97706 !important; }
      `}</style>
    </form>
  );
};
