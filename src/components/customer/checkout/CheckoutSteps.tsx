import React from 'react';
import { Check } from 'lucide-react';

interface CheckoutStepsProps {
  currentStep: number; // 1: Address, 2: Payment, 3: Completed
}

export const CheckoutSteps: React.FC<CheckoutStepsProps> = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'Delivery Address' },
    { number: 2, label: 'Payment Method' },
    { number: 3, label: 'Order Confirmation' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        marginBottom: '3rem',
      }}
    >
      {steps.map((step, idx) => {
        const isCompleted = currentStep > step.number;
        const isCurrent = currentStep === step.number;

        return (
          <React.Fragment key={step.number}>
            <div className="flex items-center gap-2">
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  backgroundColor: isCompleted ? '#059669' : isCurrent ? '#D97706' : '#E7E5E4',
                  color: isCompleted || isCurrent ? '#FFFFFF' : '#78716C',
                  transition: 'all 0.2s',
                }}
              >
                {isCompleted ? <Check size={16} /> : step.number}
              </div>
              <span
                style={{
                  fontSize: '0.9rem',
                  fontWeight: isCurrent ? 700 : 500,
                  color: isCurrent ? '#1C1917' : '#78716C',
                }}
              >
                {step.label}
              </span>
            </div>

            {idx < steps.length - 1 && (
              <div
                style={{
                  width: '40px',
                  height: '2px',
                  backgroundColor: currentStep > step.number ? '#059669' : '#E7E5E4',
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
