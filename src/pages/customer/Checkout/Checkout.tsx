import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../../store/store';
import { ShippingAddress, PaymentMethodType, Order } from '../../../types/order.types';
import { CheckoutSteps } from '../../../components/customer/checkout/CheckoutSteps';
import { AddressForm } from '../../../components/customer/checkout/AddressForm';
import { PaymentMethod } from '../../../components/customer/checkout/PaymentMethod';
import { OrderSummary } from '../../../components/customer/checkout/OrderSummary';
import { EmptyCart } from '../../../components/customer/cart/EmptyCart';
import { CheckCircle2, PackageCheck, ArrowRight, Truck, MapPin } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import confetti from 'canvas-confetti';
import { formatPrice } from '../../../utils/formatPrice';

export const Checkout: React.FC = () => {
  const { cart, placeOrder, user } = useStore();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const [address, setAddress] = useState<ShippingAddress>({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    addressLine1: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
    country: 'India',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('upi');

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.fullName || !address.email || !address.phone || !address.addressLine1 || !address.city || !address.pincode) {
      alert('Please fill out all required shipping address fields.');
      return;
    }
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    // Simulate payment transaction delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const order = placeOrder(address, paymentMethod);
    setCompletedOrder(order);
    setCurrentStep(3);
    setIsProcessing(false);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D97706', '#F59E0B', '#059669', '#FEF3C7'],
      });
    } catch (e) {
      // safe fallback
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (cart.length === 0 && currentStep !== 3) {
    return (
      <div style={{ padding: '4rem 0 6rem 0', backgroundColor: '#FAF7F2' }}>
        <div className="container">
          <EmptyCart />
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '3.5rem 0 6rem 0', backgroundColor: '#FAF7F2' }}>
      <div className="container">
        <CheckoutSteps currentStep={currentStep} />

        {currentStep === 3 && completedOrder ? (
          /* Order Confirmation Screen */
          <div
            style={{
              maxWidth: '680px',
              margin: '0 auto',
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '3rem',
              border: '1px solid #E7E5E4',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                backgroundColor: '#ECFDF5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto',
              }}
            >
              <CheckCircle2 size={42} />
            </div>

            <h2 style={{ fontSize: '2rem', color: '#1C1917', marginBottom: '0.5rem' }}>
              Order Placed Successfully!
            </h2>
            <p style={{ color: '#57534E', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Thank you, <strong>{completedOrder.customerName}</strong>! Your pure raw honey jar(s) are being carefully packed at our apiary with tamper-evident beeswax seal.
            </p>

            {/* Order Card Details */}
            <div
              style={{
                backgroundColor: '#FAF7F2',
                borderRadius: '16px',
                padding: '1.5rem',
                border: '1px solid #E7E5E4',
                textAlign: 'left',
                marginBottom: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <div className="flex items-center justify-between" style={{ borderBottom: '1px solid #E7E5E4', paddingBottom: '0.75rem' }}>
                <span style={{ color: '#78716C' }}>Order Reference:</span>
                <span style={{ fontWeight: 800, color: '#1C1917', fontSize: '1.05rem' }}>{completedOrder.orderNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: '#78716C' }}>Estimated Dispatch:</span>
                <span style={{ fontWeight: 600, color: '#059669' }}>Within 24 Hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: '#78716C' }}>Payment Mode:</span>
                <span style={{ textTransform: 'uppercase', fontWeight: 600 }}>{completedOrder.paymentMethod}</span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: '#78716C' }}>Amount Paid:</span>
                <span style={{ fontWeight: 800, color: '#D97706', fontSize: '1.15rem' }}>{formatPrice(completedOrder.total)}</span>
              </div>
              <div style={{ borderTop: '1px solid #E7E5E4', paddingTop: '0.75rem', fontSize: '0.85rem', color: '#57534E' }}>
                <div className="flex items-start gap-2">
                  <MapPin size={16} color="#D97706" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>Shipping to: {completedOrder.shippingAddress.addressLine1}, {completedOrder.shippingAddress.city}, {completedOrder.shippingAddress.state} - {completedOrder.shippingAddress.pincode}</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link to="/orders">
                <Button variant="outline" size="lg" leftIcon={<Truck size={18} />}>
                  Track Order Status
                </Button>
              </Link>
              <Link to="/shop">
                <Button size="lg" rightIcon={<ArrowRight size={18} />}>
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          /* Checkout Steps 1 & 2 */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3rem',
              alignItems: 'start',
            }}
          >
            {/* Left Column: Form */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                padding: '2.5rem',
                border: '1px solid #E7E5E4',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              }}
            >
              {currentStep === 1 && (
                <AddressForm
                  address={address}
                  onChange={(updates) => setAddress((prev) => ({ ...prev, ...updates }))}
                  onSubmit={handleAddressSubmit}
                />
              )}

              {currentStep === 2 && (
                <PaymentMethod
                  selectedMethod={paymentMethod}
                  onSelect={setPaymentMethod}
                  onSubmit={handlePlaceOrder}
                  onBack={() => setCurrentStep(1)}
                  isProcessing={isProcessing}
                />
              )}
            </div>

            {/* Right Column: Order Summary Preview */}
            <div style={{ position: 'sticky', top: '90px' }}>
              <OrderSummary />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
