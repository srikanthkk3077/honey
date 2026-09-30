import React from 'react';
import { PaymentMethodType } from '../../../types/order.types';
import { QrCode, CreditCard, Banknote, Building2, ShieldCheck } from 'lucide-react';
import { Button } from '../../common/Button';

interface PaymentMethodProps {
  selectedMethod: PaymentMethodType;
  onSelect: (method: PaymentMethodType) => void;
  onSubmit: () => void;
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
  const options: { id: PaymentMethodType; title: string; subtitle: string; icon: React.ReactNode }[] = [
    {
      id: 'upi',
      title: 'Instant UPI / QR',
      subtitle: 'Google Pay, PhonePe, Paytm, BHIM or any UPI App',
      icon: <QrCode size={24} color="#D97706" />,
    },
    {
      id: 'card',
      title: 'Credit / Debit Card',
      subtitle: 'Visa, Mastercard, RuPay with 256-bit SSL encryption',
      icon: <CreditCard size={24} color="#059669" />,
    },
    {
      id: 'cod',
      title: 'Cash on Delivery (COD)',
      subtitle: 'Pay cash or UPI at your doorstep upon delivery',
      icon: <Banknote size={24} color="#2563EB" />,
    },
    {
      id: 'netbanking',
      title: 'Net Banking',
      subtitle: 'All major Indian banks supported',
      icon: <Building2 size={24} color="#7C3AED" />,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h3 style={{ fontSize: '1.25rem', color: '#1C1917', marginBottom: '0.25rem' }}>
        Select Payment Method
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {options.map((opt) => (
          <label
            key={opt.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.25rem',
              borderRadius: '16px',
              border: selectedMethod === opt.id ? '2px solid #D97706' : '1px solid #E7E5E4',
              backgroundColor: selectedMethod === opt.id ? '#FFFBEB' : '#FFFFFF',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="paymentMethod"
                checked={selectedMethod === opt.id}
                onChange={() => onSelect(opt.id)}
                style={{ accentColor: '#D97706', width: '18px', height: '18px' }}
              />
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: '#F5F5F4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {opt.icon}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1C1917' }}>{opt.title}</div>
                <div style={{ fontSize: '0.8rem', color: '#78716C' }}>{opt.subtitle}</div>
              </div>
            </div>
          </label>
        ))}
      </div>

      <div className="payment-action-buttons" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
        <Button variant="ghost" onClick={onBack} disabled={isProcessing}>
          Back to Address
        </Button>
        <Button size="lg" onClick={onSubmit} isLoading={isProcessing}>
          Complete & Place Order
        </Button>
      </div>

      <div className="flex items-center justify-center gap-2" style={{ color: '#78716C', fontSize: '0.8rem' }}>
        <ShieldCheck size={16} color="#059669" />
        <span>Bank-grade 256-bit encrypted checkout</span>
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
    </div>
  );
};
