import React, { useState } from 'react';
import { Customer } from '../../../types/customer.types';
import { INITIAL_CUSTOMERS } from '../../../services/customerApi';
import { CustomerTable } from '../../../components/admin/customers/CustomerTable';
import { Modal } from '../../../components/common/Modal';
import { CustomerDetailsModalContent } from '../../../components/admin/customers/CustomerDetails';
import { Input } from '../../../components/common/Input';
import { Search } from 'lucide-react';

export const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [selectedCust, setSelectedCust] = useState<Customer | null>(null);
  const [search, setSearch] = useState('');

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
          Registered Patrons & Customers
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

      <CustomerTable
        customers={filtered}
        onView={(c) => setSelectedCust(c)}
      />

      <Modal
        isOpen={!!selectedCust}
        onClose={() => setSelectedCust(null)}
        title="Customer Profile & Lifetime Value"
      >
        {selectedCust && <CustomerDetailsModalContent customer={selectedCust} />}
      </Modal>
    </div>
  );
};
