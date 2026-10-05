import React from 'react';
import { Customer } from '../../../types/customer.types';
import { formatPrice } from '../../../utils/formatPrice';
import { Badge } from '../../common/Badge';
import { Eye, Users } from 'lucide-react';
import { Pagination } from '../../common/Pagination';

interface CustomerTableProps {
  customers: Customer[];
  onView: (customer: Customer) => void;
  isLoading?: boolean;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
    pageSizeOptions?: number[];
  };
}

export const CustomerTable: React.FC<CustomerTableProps> = React.memo(({
  customers,
  onView,
  isLoading = false,
  pagination,
}) => {
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
            {customers.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '3.5rem 1.5rem', textAlign: 'center', color: '#78716C' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <Users size={40} color="#A8A29E" strokeWidth={1.5} />
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1C1917' }}>
                      No registered customers found
                    </div>
                    <div style={{ fontSize: '0.85rem' }}>
                      Customers who register and place orders will appear here.
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid #F5F1E9' }}>
                  <td style={{ padding: '1rem', fontWeight: 700, color: '#1C1917' }}>
                    {c.name || 'Customer'}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontSize: '0.85rem', color: '#1C1917' }}>{c.email}</div>
                    <div style={{ fontSize: '0.78rem', color: '#78716C' }}>{c.phone}</div>
                  </td>
                  <td style={{ padding: '1rem', color: '#57534E' }}>
                    {c.city || '—'}
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>
                    {c.totalOrders} {c.totalOrders === 1 ? 'order' : 'orders'}
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
                        background: '#FEF3C7',
                        border: 'none',
                        color: '#92400E',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Eye size={14} /> Profile
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && pagination.totalItems > 0 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          pageSize={pagination.pageSize}
          onPageChange={pagination.onPageChange}
          onPageSizeChange={pagination.onPageSizeChange}
          pageSizeOptions={pagination.pageSizeOptions || [10, 20, 50]}
          itemLabel="customers"
        />
      )}
    </div>
  );
});
