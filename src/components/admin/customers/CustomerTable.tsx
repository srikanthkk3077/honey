import React from 'react';
import { Customer } from '../../../types/customer.types';
import { formatPrice } from '../../../utils/formatPrice';
import { Badge } from '../../common/Badge';
import { Eye } from 'lucide-react';

interface CustomerTableProps {
  customers: Customer[];
  onView: (customer: Customer) => void;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({ customers, onView }) => {
  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E7E5E4', overflow: 'hidden' }}>
      <div className="table-responsive" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid #E7E5E4', color: '#57534E' }}>
              <th style={{ padding: '1rem' }}>Customer</th>
              <th style={{ padding: '1rem' }}>Contact</th>
              <th style={{ padding: '1rem' }}>Location</th>
              <th style={{ padding: '1rem' }}>Orders</th>
              <th style={{ padding: '1rem' }}>Total Spent</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid #F5F1E9' }}>
                <td style={{ padding: '1rem', fontWeight: 700, color: '#1C1917' }}>
                  {c.name}
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontSize: '0.85rem', color: '#1C1917' }}>{c.email}</div>
                  <div style={{ fontSize: '0.78rem', color: '#78716C' }}>{c.phone}</div>
                </td>
                <td style={{ padding: '1rem', color: '#57534E' }}>
                  {c.city}
                </td>
                <td style={{ padding: '1rem', fontWeight: 600 }}>
                  {c.totalOrders}
                </td>
                <td style={{ padding: '1rem', fontWeight: 700, color: '#059669' }}>
                  {formatPrice(c.totalSpent)}
                </td>
                <td style={{ padding: '1rem' }}>
                  <Badge variant={c.status === 'active' ? 'green' : 'gray'} size="sm">
                    {c.status}
                  </Badge>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <button
                    onClick={() => onView(c)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      background: '#F5F5F4',
                      border: 'none',
                      color: '#44403C',
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Eye size={14} /> Profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
