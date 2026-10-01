import React, { useState, useCallback } from 'react';
import { ShippingAddress } from '../../../types/order.types';
import { Button } from '../../common/Button';
import { CheckCircle2, AlertCircle, User, Phone, Mail, MapPin, Building, Navigation } from 'lucide-react';

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
  width: '100%', padding: '10px 13px', borderRadius: '10px',
  border: `1.5px solid ${err ? '#FCA5A5' : ok ? '#6EE7B7' : '#D1D5DB'}`,
  backgroundColor: err ? '#FFF5F5' : ok ? '#F0FDF4' : '#FFFFFF',
  fontSize: '0.92rem', outline: 'none', transition: 'border-color 0.2s, background-color 0.2s',
  boxSizing: 'border-box' as const, fontFamily: 'inherit', color: '#1C1917',
});

interface FProps { label: string; icon: React.ReactNode; error: string; show: boolean; valid: boolean; hint?: string; children: React.ReactNode; }
const F: React.FC<FProps> = ({ label, icon, error, show, valid, hint, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: show && error ? '#DC2626' : '#374151', display: 'flex', alignItems: 'center', gap: '5px' }}>
      {icon} {label} <span style={{ color: '#DC2626' }}>*</span>
      {valid && <CheckCircle2 size={13} color="#059669" style={{ marginLeft: 'auto' }} />}
    </label>
    {children}
    {show && error
      ? <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem', color: '#DC2626', animation: 'afd 0.15s ease' }}><AlertCircle size={12} />{error}</div>
      : hint && <span style={{ fontSize: '0.72rem', color: '#78716C' }}>{hint}</span>
    }
  </div>
);

export const AddressForm: React.FC<AddressFormProps> = ({ address, onChange, onSubmit }) => {
  const [touched, setTouched] = useState<Partial<Record<FK, boolean>>>({});
  const [errors,  setErrors]  = useState<Partial<Record<FK, string>>>({});
  const [submitted, setSub]   = useState(false);

  const touch = useCallback((f: FK, v: string) => {
    setTouched((p) => ({ ...p, [f]: true }));
    setErrors((p)  => ({ ...p, [f]: validators[f](v) }));
  }, []);

  const change = (f: FK, v: string) => {
    onChange({ [f]: v } as Partial<ShippingAddress>);
    if (touched[f] || submitted) setErrors((p) => ({ ...p, [f]: validators[f](v) }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSub(true);
    const errs: Partial<Record<FK, string>> = {};
    FIELDS.forEach((f) => { errs[f] = validators[f]((address as any)[f] ?? ''); });
    setErrors(errs);
    setTouched(Object.fromEntries(FIELDS.map((f) => [f, true])));
    if (Object.values(errs).some(Boolean)) return;
    onSubmit(e);
  };

  const show = (f: FK) => !!(touched[f] || submitted);
  const err  = (f: FK) => show(f) && !!errors[f];
  const ok   = (f: FK) => show(f) && !errors[f] && !!((address as any)[f] as string)?.trim();

  const prog = FIELDS.filter((f) => !validators[f]((address as any)[f] ?? '')).length;

  return (
    <form onSubmit={submit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
      {/* Header */}
      <div>
        <h3 style={{ fontSize: '1.25rem', color: '#1C1917', margin: '0 0 0.5rem 0' }}>Where should we ship your honey?</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ flex: 1, height: '4px', background: '#E7E5E4', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(prog / 7) * 100}%`, background: prog === 7 ? '#059669' : '#D97706', borderRadius: '4px', transition: 'width 0.3s ease' }} />
          </div>
          <span style={{ fontSize: '0.72rem', color: '#78716C', fontWeight: 600, whiteSpace: 'nowrap' }}>{prog}/7 fields</span>
        </div>
      </div>

      {/* Name + Phone */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <F label="Full Name" icon={<User size={13} />} error={errors.fullName || ''} show={show('fullName')} valid={ok('fullName')}>
          <input type="text" value={address.fullName} placeholder="e.g. Radhika Sharma"
            style={inpStyle(err('fullName'), ok('fullName'))}
            onChange={(e) => change('fullName', e.target.value)}
            onBlur={() => touch('fullName', address.fullName)} autoComplete="name" />
        </F>
        <F label="Phone Number" icon={<Phone size={13} />} error={errors.phone || ''} show={show('phone')} valid={ok('phone')} hint="For courier delivery tracking updates">
          <input type="tel" value={address.phone} placeholder="+91 98765 43210" maxLength={13}
            style={inpStyle(err('phone'), ok('phone'))}
            onChange={(e) => change('phone', e.target.value)}
            onBlur={() => touch('phone', address.phone)} autoComplete="tel" />
        </F>
      </div>

      {/* Email */}
      <F label="Email Address" icon={<Mail size={13} />} error={errors.email || ''} show={show('email')} valid={ok('email')}>
        <input type="email" value={address.email} placeholder="radhika@example.com"
          style={inpStyle(err('email'), ok('email'))}
          onChange={(e) => change('email', e.target.value)}
          onBlur={() => touch('email', address.email)} autoComplete="email" />
      </F>

      {/* Address */}
      <F label="Street Address / House No. / Apartment" icon={<MapPin size={13} />} error={errors.addressLine1 || ''} show={show('addressLine1')} valid={ok('addressLine1')}>
        <input type="text" value={address.addressLine1} placeholder="Flat 304, Green Terrace Apartments, MG Road"
          style={inpStyle(err('addressLine1'), ok('addressLine1'))}
          onChange={(e) => change('addressLine1', e.target.value)}
          onBlur={() => touch('addressLine1', address.addressLine1)} autoComplete="street-address" />
      </F>

      {/* City + State + PIN */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
        <F label="City" icon={<Building size={13} />} error={errors.city || ''} show={show('city')} valid={ok('city')}>
          <input type="text" value={address.city} placeholder="e.g. Bengaluru"
            style={inpStyle(err('city'), ok('city'))}
            onChange={(e) => change('city', e.target.value)}
            onBlur={() => touch('city', address.city)} autoComplete="address-level2" />
        </F>
        <F label="State" icon={<Navigation size={13} />} error={errors.state || ''} show={show('state')} valid={ok('state')}>
          <input type="text" value={address.state} placeholder="e.g. Karnataka"
            style={inpStyle(err('state'), ok('state'))}
            onChange={(e) => change('state', e.target.value)}
            onBlur={() => touch('state', address.state)} autoComplete="address-level1" />
        </F>
        <F label="PIN Code" icon={<Navigation size={13} />} error={errors.pincode || ''} show={show('pincode')} valid={ok('pincode')}>
          <input type="text" inputMode="numeric" value={address.pincode} placeholder="560001" maxLength={6}
            style={inpStyle(err('pincode'), ok('pincode'))}
            onChange={(e) => change('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
            onBlur={() => touch('pincode', address.pincode)} autoComplete="postal-code" />
        </F>
      </div>

      {/* Submit */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
        <Button type="submit" size="lg">Continue to Payment</Button>
      </div>

      <style>{`
        @keyframes afd { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:translateY(0); } }
        input:focus { box-shadow: 0 0 0 3px rgba(217,119,6,0.12) !important; border-color: #D97706 !important; }
      `}</style>
    </form>
  );
};


