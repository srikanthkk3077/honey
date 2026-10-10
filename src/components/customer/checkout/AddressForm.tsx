import React, { useState, useCallback, useEffect } from 'react';
import { ShippingAddress } from '../../../types/order.types';
import { Button } from '../../common/Button';
import { CheckCircle2, AlertCircle, User, Phone, Mail, MapPin, Building, Navigation, ExternalLink, Compass, Crosshair, Loader, X } from 'lucide-react';
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
    if (!v.trim()) return 'Flat, House no. or Building name is required';
    if (v.trim().length < 2) return 'Please enter your flat or house number';
    return '';
  },
  addressLine2: (v: string) => {
    if (!v.trim()) return 'Street, Road, Area or Locality is required';
    if (v.trim().length < 3) return 'Please enter your street or area';
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
const FIELDS: FK[] = ['fullName', 'phone', 'email', 'addressLine1', 'addressLine2', 'city', 'state', 'pincode'];

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
  const [isLocating, setIsLocating] = useState(false);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  const [autoDetectedInfo, setAutoDetectedInfo] = useState<{
    area: string;
    city: string;
    state: string;
    pincode: string;
  } | null>(null);

  const handleDetectLocation = () => {
    if (!('geolocation' in navigator)) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationMessage(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const freshMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}&z=17`;

        const updates: Partial<ShippingAddress> = {
          latitude,
          longitude,
          googleMapsLink: freshMapsUrl,
          isCustomMapLink: true,
        };

        let detectedStreet = '';
        let detectedCity = '';
        let detectedState = '';
        let detectedPin = '';

        // Reverse geocoding via OpenStreetMap Nominatim
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          if (res.ok) {
            const data = await res.json();
            const addr = data?.address || {};

            // 1. Street / Road / Area / Locality
            const streetParts = [
              addr.road || addr.street || addr.pedestrian || '',
              addr.neighbourhood || addr.suburb || addr.residential || addr.locality || addr.subdivision || '',
            ].filter(Boolean);

            detectedStreet = streetParts.join(', ');
            if (!detectedStreet && data?.display_name) {
              detectedStreet = data.display_name.split(',').slice(0, 2).map((s: string) => s.trim()).join(', ');
            }

            // 2. City
            detectedCity = addr.city || addr.town || addr.district || addr.county || addr.village || addr.city_district || '';

            // 3. State
            detectedState = addr.state || '';

            // 4. PIN Code
            if (addr.postcode) {
              const clean = addr.postcode.replace(/\D/g, '').slice(0, 6);
              if (clean.length === 6) {
                detectedPin = clean;
              }
            }

            if (detectedStreet) updates.addressLine2 = detectedStreet;
            if (detectedCity) updates.city = detectedCity;
            if (detectedState) updates.state = detectedState;
            if (detectedPin) {
              updates.pincode = detectedPin;
              handlePincodeChange(detectedPin);
            }
          }
        } catch {
          // reverse geocoding fallback
        }

        onChange(updates);
        setAutoDetectedInfo({
          area: detectedStreet,
          city: detectedCity || address.city,
          state: detectedState || address.state,
          pincode: detectedPin || address.pincode,
        });
        setLocationMessage(`Exact doorstep pin locked (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
        setIsLocating(false);

        // Auto-focus House / Flat input so user can seamlessly type building details
        setTimeout(() => {
          const houseInput = document.getElementById('address-house-input');
          if (houseInput) houseInput.focus();
        }, 120);
      },
      (err) => {
        setIsLocating(false);
        let msg = 'Could not access GPS location.';
        if (err.code === 1) msg = 'Location permission was denied. Please allow location access in your browser.';
        else if (err.code === 2) msg = 'Location unavailable. Please check your device GPS/network.';
        else if (err.code === 3) msg = 'Location request timed out.';
        alert(msg);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  const handleClearGps = () => {
    const freshLink = generateGoogleMapsLink(
      { ...address, latitude: undefined, longitude: undefined, isCustomMapLink: false },
      { forceRefresh: true }
    );
    onChange({
      latitude: undefined,
      longitude: undefined,
      isCustomMapLink: false,
      googleMapsLink: freshLink,
    });
    setLocationMessage(null);
    setAutoDetectedInfo(null);
  };

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

    // Auto-generate Google Maps link dynamically if not custom-locked
    const finalMapsLink = generateGoogleMapsLink(address, { forceRefresh: !address.isCustomMapLink });
    onChange({ googleMapsLink: finalMapsLink });

    onSubmit(e);
  };

  const show = (f: FK) => !!(touched[f] || submitted);
  const err = (f: FK) => show(f) && !!errors[f];
  const ok = (f: FK) => show(f) && !errors[f] && !!((address as any)[f] as string)?.trim();

  const prog = FIELDS.filter((f) => !validators[f]((address as any)[f] ?? '')).length;
  const currentMapsUrl = generateGoogleMapsLink(address, { forceRefresh: !address.isCustomMapLink });
  const hasGps = typeof address.latitude === 'number' && typeof address.longitude === 'number';
  const isAddressReadyForMap = hasGps || !!(address.addressLine1 && (address.city || address.pincode));

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
                width: `${(prog / FIELDS.length) * 100}%`,
                background: prog === FIELDS.length && serviceability?.isServiceable ? '#059669' : '#D97706',
                borderRadius: '4px',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
          <span style={{ fontSize: '0.72rem', color: '#78716C', fontWeight: 600, whiteSpace: 'nowrap' }}>
            {prog}/{FIELDS.length} fields
          </span>
        </div>
      </div>

      {/* Zomato / Swiggy Style Auto-Detect Bar */}
      <div
        style={{
          padding: '12px 16px',
          borderRadius: '12px',
          backgroundColor: '#FFFBEB',
          border: '1.5px solid #FDE68A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#FEF3C7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#D97706',
              flexShrink: 0,
            }}
          >
            <Crosshair size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#92400E' }}>
              Auto-Detect Delivery Location
            </div>
            <div style={{ fontSize: '0.74rem', color: '#B45309' }}>
              Click to auto-fill Street, Area, City, and PIN code via GPS
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDetectLocation}
          disabled={isLocating}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: '#FFFFFF',
            backgroundColor: '#D97706',
            border: 'none',
            padding: '8px 14px',
            borderRadius: '8px',
            cursor: isLocating ? 'wait' : 'pointer',
            boxShadow: '0 2px 4px rgba(217,119,6,0.2)',
            transition: 'all 0.15s ease',
          }}
        >
          {isLocating ? <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Crosshair size={14} />}
          {isLocating ? 'Detecting Location...' : hasGps ? '📍 Update GPS Location' : '📍 Use Current Location'}
        </button>
      </div>

      {/* Auto-detected notification banner */}
      {autoDetectedInfo && (
        <div
          style={{
            padding: '12px 14px',
            borderRadius: '10px',
            backgroundColor: '#ECFDF5',
            border: '1.5px solid #A7F3D0',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            animation: 'afd 0.25s ease',
          }}
        >
          <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#065F46' }}>
              Location Auto-Detected via GPS:
            </div>
            <div style={{ fontSize: '0.8rem', color: '#047857', marginTop: '2px' }}>
              {autoDetectedInfo.area ? `${autoDetectedInfo.area}, ` : ''}{autoDetectedInfo.city}, {autoDetectedInfo.state} - <strong>{autoDetectedInfo.pincode}</strong>
            </div>
            <div style={{ fontSize: '0.76rem', color: '#059669', marginTop: '4px', fontWeight: 600 }}>
              👇 Now enter your <strong>Flat / House / Building Name</strong> below to complete your address.
            </div>
          </div>
        </div>
      )}

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
            placeholder="+91 7780514383"
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

      {/* House / Flat / Floor / Building Name (Manual Entry) */}
      <F
        label="Flat / House No. / Building / Floor"
        icon={<Building size={13} />}
        error={errors.addressLine1 || ''}
        show={show('addressLine1')}
        valid={ok('addressLine1')}
        hint="Enter your door/flat number, apartment name, or house details"
      >
        <input
          id="address-house-input"
          type="text"
          value={address.addressLine1}
          placeholder="e.g. Flat 304, Green Terrace Apartments"
          style={inpStyle(err('addressLine1'), ok('addressLine1'))}
          onChange={(e) => change('addressLine1', e.target.value)}
          onBlur={() => touch('addressLine1', address.addressLine1)}
          autoComplete="address-line1"
        />
      </F>

      {/* Street / Road / Area / Locality (Auto-filled via GPS or Manual) */}
      <F
        label="Street / Road / Area / Locality"
        icon={<MapPin size={13} />}
        error={errors.addressLine2 || ''}
        show={show('addressLine2')}
        valid={ok('addressLine2')}
        hint="Auto-filled via GPS or entered manually (e.g. MG Road, Indiranagar)"
      >
        <input
          type="text"
          value={address.addressLine2 || ''}
          placeholder="e.g. MG Road, Indiranagar or Jubilee Hills Road No. 12"
          style={inpStyle(err('addressLine2'), ok('addressLine2'))}
          onChange={(e) => change('addressLine2', e.target.value)}
          onBlur={() => touch('addressLine2', address.addressLine2 || '')}
          autoComplete="address-line2"
        />
      </F>

      {/* Nearby Landmark (Optional) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <label
          style={{
            fontSize: '0.82rem',
            fontWeight: 700,
            color: '#374151',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <Compass size={13} /> Nearby Landmark <span style={{ fontSize: '0.74rem', color: '#9CA3AF', fontWeight: 500 }}>(Optional)</span>
        </label>
        <input
          type="text"
          value={address.landmark || ''}
          placeholder="e.g. Near Apollo Hospital, Opposite Metro Pillar 42"
          style={inpStyle(false, !!address.landmark?.trim())}
          onChange={(e) => onChange({ landmark: e.target.value })}
        />
        <span style={{ fontSize: '0.72rem', color: '#78716C' }}>
          Helps our courier delivery partner locate your doorstep faster
        </span>
      </div>

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

      {/* Google Maps Conversion, GPS Doorstep Pin & Navigation Preview */}
      <div
        style={{
          padding: '14px 16px',
          borderRadius: '12px',
          backgroundColor: '#F8FAFC',
          border: '1.5px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: '#1E293B', fontWeight: 700 }}>
            <Compass size={17} color="#2563EB" />
            <span>Doorstep Courier Navigation (Google Maps):</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* GPS Detection Button */}
            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={isLocating}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#047857',
                backgroundColor: '#ECFDF5',
                border: '1px solid #A7F3D0',
                padding: '5px 11px',
                borderRadius: '8px',
                cursor: isLocating ? 'wait' : 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {isLocating ? <Loader size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Crosshair size={13} />}
              {isLocating ? 'Detecting GPS...' : hasGps ? 'Update GPS Pin' : '📍 Auto-Detect GPS Pin'}
            </button>

            {isAddressReadyForMap && (
              <a
                href={currentMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#2563EB',
                  textDecoration: 'none',
                  background: '#EFF6FF',
                  padding: '5px 11px',
                  borderRadius: '8px',
                  border: '1px solid #BFDBFE',
                }}
              >
                <MapPin size={13} />
                Open Pin in Google Maps <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>

        {/* GPS Active Badge */}
        {hasGps && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#F0FDF4',
              border: '1px solid #BBF7D0',
              borderRadius: '8px',
              padding: '6px 10px',
              fontSize: '0.76rem',
              color: '#166534',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={13} color="#16A34A" />
              <span>
                <strong>Exact GPS Pin Locked:</strong> {address.latitude?.toFixed(4)}, {address.longitude?.toFixed(4)}
              </span>
            </div>
            <button
              type="button"
              onClick={handleClearGps}
              title="Remove GPS Pin and revert to text address"
              style={{
                background: 'none',
                border: 'none',
                color: '#65A30D',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
                fontSize: '0.72rem',
                textDecoration: 'underline',
              }}
            >
              <X size={12} /> Clear GPS
            </button>
          </div>
        )}

        <div style={{ fontSize: '0.76rem', color: '#64748B', lineHeight: 1.4 }}>
          {hasGps
            ? '✓ Your exact doorstep GPS coordinates will be attached to this order for turn-by-turn delivery navigation.'
            : isAddressReadyForMap
            ? '✓ Cleaned and converted automatically for Google Maps. Click "Open Pin in Google Maps" to preview the destination.'
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
                onChange={(e) => {
                  const val = e.target.value;
                  onChange({
                    googleMapsLink: val,
                    isCustomMapLink: !!val.trim(),
                  });
                }}
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
