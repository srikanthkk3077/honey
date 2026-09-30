import React, { useState, useEffect } from 'react';
import { Customer } from '../../../types/customer.types';
import { customerApi } from '../../../services/customerApi';
import { CustomerTable } from '../../../components/admin/customers/CustomerTable';
import { Modal } from '../../../components/common/Modal';
import { CustomerDetailsModalContent } from '../../../components/admin/customers/CustomerDetails';
import { Input } from '../../../components/common/Input';
import { Search, Loader } from 'lucide-react';

export const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCust, setSelectedCust] = useState<Customer | null>(null);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const result = await customerApi.getAll({ limit: 200 });
        // Map backend user shape to frontend Customer type
        const mapped: Customer[] = (result.customers || []).map((u: any) => ({
          id: u._id || u.id || '',
          name: u.name || '',
          email: u.email || '',
          phone: u.phone || '',
          city: u.address?.city || '',
          totalOrders: u.totalOrders || 0,
          totalSpent: u.totalSpent || 0,
          lastOrderDate: u.lastOrderDate || u.createdAt || '',
          status: (u.status || 'active') as 'active' | 'inactive',
          joinedDate: u.createdAt || '',
        }));
        setCustomers(mapped);
      } catch {
        // Backend may not have customers endpoint yet; show empty state
        setCustomers([]);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.85rem', color: '#1C1917', margin: '0 0 0.25rem 0' }}>
          Registered Patrons &amp; Customers
        </h1>
        <p style={{ color: '#78716C', margin: 0, fontSize: '0.9rem' }}>
          View customer history, purchase lifetime value, and delivery destinations.
        </p>
      </div>

      <div
        style={{
          backgroundColor: '#FFFFFF',
          padding: '1rem 1.25rem',
          borderRadius: '14px',
          border: '1px solid #E7E5E4',
          maxWidth: '350px',
        }}
      >
        <Input
          placeholder="Search by name, email, or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search size={16} />}
        />
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <Loader size={32} color="#D97706" style={{ animation: 'spin 1s linear infinite', margin: '0 auto' }} />
          <p style={{ color: '#78716C', marginTop: '0.75rem' }}>Loading customers…</p>
        </div>
      ) : (
        <CustomerTable customers={filtered} onView={(c) => setSelectedCust(c)} />
      )}

      <Modal
        isOpen={!!selectedCust}
        onClose={() => setSelectedCust(null)}
        title="Customer Profile &amp; Lifetime Value"
      >
        {selectedCust && <CustomerDetailsModalContent customer={selectedCust} />}
      </Modal>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};
