import React, { useState } from 'react';
import { useStore } from '../../../store/store';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { Search, CheckCircle, Package, Truck, Home } from 'lucide-react';
import { formatPrice } from '../../../utils/formatPrice';
import { Order } from '../../../types/order.types';

export const TrackOrder: React.FC = () => {
  const { orders } = useStore();
  const [query, setQuery] = useState('');
  const [matchedOrder, setMatchedOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const clean = query.trim().toLowerCase();
    const found = orders.find(
      (o) =>
        o.orderNumber.toLowerCase() === clean ||
        o.trackingNumber?.toLowerCase() === clean ||
        o.customerPhone.includes(clean)
    );
    setMatchedOrder(found || null);
  };

  return (
    <div style={{ padding: '4rem 0 6rem 0', backgroundColor: '#FAF7F2' }}>
      <div className="container" style={{ maxWidth: '680px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Live Dispatch Radar
          </span>
          <h1 style={{ fontSize: '2.25rem', color: '#1C1917', margin: '6px 0 0.5rem 0' }}>
            Track Your Honey Consignment
          </h1>
          <p style={{ color: '#78716C' }}>
            Enter your Madhuvan order number (e.g. MDH-8821) or courier AWB number
          </p>
        </div>

        {/* Search input card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '2rem',
            border: '1px solid #E7E5E4',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            marginBottom: '2rem',
          }}
        >
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '240px' }}>
              <Input
                placeholder="Enter Order # or Tracking Code..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                leftIcon={<Search size={16} />}
              />
            </div>
            <Button type="submit" size="md">
              Locate Package
            </Button>
          </form>
        </div>

        {/* Results */}
        {searched && (
          <div>
            {matchedOrder ? (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px',
                  padding: '2rem',
                  border: '1px solid #E7E5E4',
                  boxShadow: '0 6px 25px rgba(0,0,0,0.04)',
                }}
              >
                <div className="flex items-center justify-between" style={{ borderBottom: '1px solid #E7E5E4', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#1C1917' }}>
                      Order {matchedOrder.orderNumber}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#78716C' }}>
                      Carrier: Delhivery Express • {matchedOrder.trackingNumber}
                    </div>
                  </div>
                  <div style={{ fontWeight: 800, color: '#D97706', fontSize: '1.15rem' }}>
                    {formatPrice(matchedOrder.total)}
                  </div>
                </div>

                {/* Timeline progress */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', margin: '2rem 0' }}>
                  <div className="flex items-start gap-3">
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#059669', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <CheckCircle size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#1C1917' }}>Order Placed & Jar Selected</div>
                      <div style={{ fontSize: '0.8rem', color: '#78716C' }}>Apiary harvest team assigned batch</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#059669', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Package size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#1C1917' }}>Packed with Eco Thermal Cushioning</div>
                      <div style={{ fontSize: '0.8rem', color: '#78716C' }}>Sealed with virgin beeswax stamp</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: matchedOrder.orderStatus === 'shipped' || matchedOrder.orderStatus === 'delivered' ? '#059669' : '#E7E5E4', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Truck size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#1C1917' }}>In Transit with Express Courier</div>
                      <div style={{ fontSize: '0.8rem', color: '#78716C' }}>Air transit toward {matchedOrder.shippingAddress.city}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: matchedOrder.orderStatus === 'delivered' ? '#059669' : '#E7E5E4', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Home size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#1C1917' }}>Delivered to Doorstep</div>
                      <div style={{ fontSize: '0.8rem', color: '#78716C' }}>Ready to enjoy raw & unfiltered</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', backgroundColor: '#FFFFFF', padding: '2.5rem', borderRadius: '20px', border: '1px solid #E7E5E4' }}>
                <p style={{ color: '#DC2626', fontWeight: 600 }}>No active consignment matches "{query}".</p>
                <p style={{ color: '#78716C', fontSize: '0.88rem' }}>Please verify the order ID or try logging in to view your orders.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
