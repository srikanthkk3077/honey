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

  const handlePlaceOrder = async (details?: { utrNumber?: string; paymentScreenshot?: string }) => {
    setIsProcessing(true);

    try {
      const order = await placeOrder(address, paymentMethod, details);
      setCompletedOrder(order);
      setCurrentStep(3);
    } catch (err) {
      console.error('Order placement failed:', err);
    } finally {
      setIsProcessing(false);
    }

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
            className="checkout-confirmation-card"
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
                backgroundColor: completedOrder.paymentMethod === 'upi' ? '#FEF3C7' : '#ECFDF5',
                color: completedOrder.paymentMethod === 'upi' ? '#D97706' : '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto',
              }}
            >
              <CheckCircle2 size={42} />
            </div>

            <h2 style={{ fontSize: '2rem', color: '#1C1917', marginBottom: '0.5rem' }}>
              {completedOrder.paymentMethod === 'upi' ? 'Order Placed — Verifying Payment!' : 'Order Placed Successfully!'}
            </h2>
            <p style={{ color: '#57534E', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Thank you, <strong>{completedOrder.customerName}</strong>! Your pure raw honey consignment has been booked under <strong>{completedOrder.orderNumber}</strong>.
            </p>

            {/* UPI Verification Pending Box */}
            {completedOrder.paymentMethod === 'upi' && (
              <div
                style={{
                  backgroundColor: '#FFFBEB',
                  borderRadius: '16px',
                  border: '1.5px solid #FDE68A',
                  padding: '1.25rem',
                  textAlign: 'left',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#92400E', fontWeight: 700, fontSize: '0.95rem', marginBottom: '4px' }}>
                  <span>⏳ Payment Verification in Progress</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#78716C', lineHeight: 1.5 }}>
                  We received your transaction reference <strong>(UTR: {completedOrder.utrNumber})</strong>. Our accounts team verifies bank credits every 15–30 minutes. Once confirmed, your dispatch radar will activate immediately.
                </div>
              </div>
            )}

            {/* COD Confirmation Box */}
            {completedOrder.paymentMethod === 'cod' && (
              <div
                style={{
                  backgroundColor: '#EFF6FF',
                  borderRadius: '16px',
                  border: '1.5px solid #BFDBFE',
                  padding: '1.25rem',
                  textAlign: 'left',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ color: '#1E40AF', fontWeight: 700, fontSize: '0.95rem', marginBottom: '4px' }}>
                  💵 Cash on Delivery Confirmed
                </div>
                <div style={{ fontSize: '0.85rem', color: '#3B82F6', lineHeight: 1.5 }}>
                  No advance payment needed. Please keep <strong>{formatPrice(completedOrder.total)}</strong> ready in cash or UPI QR when the courier arrives at your doorstep.
                </div>
              </div>
            )}

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
                <span style={{ color: '#78716C' }}>Payment Mode:</span>
                <span style={{ fontWeight: 700, textTransform: 'uppercase', color: '#1C1917' }}>
                  {completedOrder.paymentMethod === 'upi' ? 'Direct UPI / Bank Transfer' : 'Cash on Delivery'}
                </span>
              </div>
              {completedOrder.utrNumber && (
                <div className="flex items-center justify-between">
                  <span style={{ color: '#78716C' }}>UTR Reference:</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#D97706' }}>{completedOrder.utrNumber}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span style={{ color: '#78716C' }}>Payment Status:</span>
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    padding: '3px 10px',
                    borderRadius: '8px',
                    backgroundColor: completedOrder.paymentStatus === 'paid' ? '#ECFDF5' : (completedOrder.paymentStatus === 'verification_pending' ? '#FEF3C7' : '#EFF6FF'),
                    color: completedOrder.paymentStatus === 'paid' ? '#065F46' : (completedOrder.paymentStatus === 'verification_pending' ? '#92400E' : '#1E40AF'),
                  }}
                >
                  {completedOrder.paymentStatus === 'paid' ? '✓ Paid' : (completedOrder.paymentStatus === 'verification_pending' ? '⏳ Verification Pending' : '💵 Pay on Delivery')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: '#78716C' }}>Order Total:</span>
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
            className="checkout-form-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
              gap: '2.5rem',
              alignItems: 'start',
            }}
          >
            {/* Left Column: Form */}
            <div
              className="checkout-form-card"
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
            <div className="checkout-summary-col" style={{ position: 'sticky', top: '90px' }}>
              <OrderSummary />
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .checkout-confirmation-card,
          .checkout-form-card {
            padding: 1.25rem !important;
            border-radius: 18px !important;
          }
          .checkout-form-grid {
            gap: 1.5rem !important;
          }
          .checkout-summary-col {
            position: static !important;
          }
        }
      `}</style>
    </div>
  );
};
