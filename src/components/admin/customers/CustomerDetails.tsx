import React from 'react';
import { Customer } from '../../../types/customer.types';
import { formatPrice } from '../../../utils/formatPrice';
import { User, Mail, Phone, MapPin, ShoppingBag, Calendar } from 'lucide-react';
import { Badge } from '../../common/Badge';

export const CustomerDetailsModalContent: React.FC<{ customer: Customer }> = ({ customer }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="flex items-center gap-4" style={{ paddingBottom: '1rem', borderBottom: '1px solid #E7E5E4' }}>
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#FEF3C7',
            color: '#92400E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: 800,
          }}
        >
          {customer.name.charAt(0)}
        </div>
        <div>
          <h3 style={{ fontSize: '1.25rem', color: '#1C1917', margin: 0 }}>{customer.name}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <Badge variant={customer.status === 'active' ? 'green' : 'gray'} size="sm">
              {customer.status}
            </Badge>
            <span style={{ fontSize: '0.8rem', color: '#78716C' }}>Joined {customer.joinedDate}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', fontSize: '0.9rem' }}>
        <div className="flex items-center gap-2" style={{ color: '#44403C' }}>
          <Mail size={16} color="#78716C" />
          <span>{customer.email}</span>
        </div>
        <div className="flex items-center gap-2" style={{ color: '#44403C' }}>
          <Phone size={16} color="#78716C" />
          <span>{customer.phone}</span>
        </div>
        <div className="flex items-center gap-2" style={{ color: '#44403C' }}>
          <MapPin size={16} color="#78716C" />
          <span>{customer.city}</span>
        </div>
        <div className="flex items-center gap-2" style={{ color: '#44403C' }}>
          <Calendar size={16} color="#78716C" />
          <span>Last order: {customer.lastOrderDate}</span>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem',
          backgroundColor: '#FAF7F2',
          padding: '1.25rem',
          borderRadius: '12px',
          border: '1px solid #E7E5E4',
        }}
      >
        <div>
          <div style={{ fontSize: '0.8rem', color: '#78716C' }}>Total Orders Placed</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1C1917' }}>{customer.totalOrders}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#78716C' }}>Total Spent to Date</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#059669' }}>{formatPrice(customer.totalSpent)}</div>
        </div>
      </div>
    </div>
  );
};
