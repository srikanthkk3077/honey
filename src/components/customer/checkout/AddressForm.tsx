import React from 'react';
import { ShippingAddress } from '../../../types/order.types';
import { Input } from '../../common/Input';
import { Button } from '../../common/Button';

interface AddressFormProps {
  address: ShippingAddress;
  onChange: (updates: Partial<ShippingAddress>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const AddressForm: React.FC<AddressFormProps> = ({ address, onChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <h3 style={{ fontSize: '1.25rem', color: '#1C1917', marginBottom: '0.5rem' }}>
        Where should we ship your honey?
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        <Input
          label="Full Name"
          required
          value={address.fullName}
          onChange={(e) => onChange({ fullName: e.target.value })}
          placeholder="e.g. Radhika Sharma"
        />

        <Input
          label="Phone Number"
          required
          type="tel"
          value={address.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
          placeholder="+91 98765 43210"
          helperText="For courier delivery tracking updates"
        />
      </div>

      <Input
        label="Email Address"
        required
        type="email"
        value={address.email}
        onChange={(e) => onChange({ email: e.target.value })}
        placeholder="radhika@example.com"
      />

      <Input
        label="Street Address / House No. / Apartment"
        required
        value={address.addressLine1}
        onChange={(e) => onChange({ addressLine1: e.target.value })}
        placeholder="Flat 304, Green Terrace Apartments, MG Road"
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        <Input
          label="City"
          required
          value={address.city}
          onChange={(e) => onChange({ city: e.target.value })}
          placeholder="e.g. Bengaluru"
        />

        <Input
          label="State"
          required
          value={address.state}
          onChange={(e) => onChange({ state: e.target.value })}
          placeholder="e.g. Karnataka"
        />

        <Input
          label="PIN Code"
          required
          value={address.pincode}
          onChange={(e) => onChange({ pincode: e.target.value })}
          placeholder="560001"
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <Button type="submit" size="lg">
          Continue to Payment
        </Button>
      </div>
    </form>
  );
};
