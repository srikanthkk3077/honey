import React, { useState } from 'react';
import { Input } from '../../common/Input';
import { Button } from '../../common/Button';
import { useStore } from '../../../store/store';
import { APP_NAME, CONTACT_INFO, FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE } from '../../../utils/constants';

export const SettingsForm: React.FC = () => {
  const { showToast } = useStore();
  const [storeName, setStoreName] = useState(APP_NAME);
  const [phone, setPhone] = useState(CONTACT_INFO.phone);
  const [email, setEmail] = useState(CONTACT_INFO.email);
  const [address, setAddress] = useState(CONTACT_INFO.address);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(String(FREE_SHIPPING_THRESHOLD));
  const [shippingFee, setShippingFee] = useState(String(STANDARD_SHIPPING_FEE));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Store settings updated successfully!', 'success');
  };

  return (
    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '700px' }}>
      <div style={{ backgroundColor: '#FFFFFF', padding: '1.75rem', borderRadius: '16px', border: '1px solid #E7E5E4', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h4 style={{ fontSize: '1.1rem', color: '#1C1917', margin: 0 }}>General Store Details</h4>

        <Input
          label="Store Display Name"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
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
            style={{ width: '100%', padding: '0.65rem 0.95rem', borderRadius: '10px', border: '1px solid #D6D3D1', outline: 'none', fontFamily: 'inherit' }}
          />
        </div>
      </div>

      <div style={{ backgroundColor: '#FFFFFF', padding: '1.75rem', borderRadius: '16px', border: '1px solid #E7E5E4', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h4 style={{ fontSize: '1.1rem', color: '#1C1917', margin: 0 }}>Shipping & Fulfillment Rates</h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
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

      <div>
        <Button type="submit" size="lg">
          Save All Store Settings
        </Button>
      </div>
    </form>
  );
};
