import React from 'react';
import { Check } from 'lucide-react';

interface CheckoutStepsProps {
  currentStep: number; // 1: Address, 2: Payment, 3: Completed
}

export const CheckoutSteps: React.FC<CheckoutStepsProps> = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'Delivery Address', shortLabel: 'Address' },
    { number: 2, label: 'Payment Method', shortLabel: 'Payment' },
    { number: 3, label: 'Order Confirmation', shortLabel: 'Confirm' },
  ];

  return (
    <div
      className="checkout-steps-bar"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        marginBottom: '3rem',
        width: '100%',
        maxWidth: '100%',
        overflowX: 'auto',
      }}
    >
      {steps.map((step, idx) => {
        const isCompleted = currentStep > step.number;
        const isCurrent = currentStep === step.number;

        return (
          <React.Fragment key={step.number}>
            <div className="flex items-center gap-2" style={{ flexShrink: 0 }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  backgroundColor: isCompleted ? '#059669' : isCurrent ? '#D97706' : '#E7E5E4',
                  color: isCompleted || isCurrent ? '#FFFFFF' : '#78716C',
                  transition: 'all 0.2s',
                  flexShrink: 0,
                }}
              >
                {isCompleted ? <Check size={16} /> : step.number}
              </div>
              <span
                className="step-full-label"
                style={{
                  fontSize: '0.88rem',
                  fontWeight: isCurrent ? 700 : 500,
                  color: isCurrent ? '#1C1917' : '#78716C',
                }}
              >
                {step.label}
              </span>
              <span
                className="step-short-label"
                style={{
                  display: 'none',
                  fontSize: '0.82rem',
                  fontWeight: isCurrent ? 700 : 500,
                  color: isCurrent ? '#1C1917' : '#78716C',
                }}
              >
                {step.shortLabel}
              </span>
            </div>

            {idx < steps.length - 1 && (
              <div
                className="step-connector-line"
                style={{
                  width: '36px',
                  height: '2px',
                  backgroundColor: currentStep > step.number ? '#059669' : '#E7E5E4',
                  flexShrink: 0,
                }}
              />
            )}
          </React.Fragment>
        );
      })}

      <style>{`
        @media (max-width: 640px) {
          .checkout-steps-bar {
            gap: 0.65rem !important;
            margin-bottom: 2rem !important;
          }
          .step-full-label {
            display: none !important;
          }
          .step-short-label {
            display: inline !important;
          }
          .step-connector-line {
            width: 18px !important;
          }
        }
      `}</style>
    </div>
  );
};
