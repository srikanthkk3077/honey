import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Customer } from '../../../types/customer.types';
import { customerApi } from '../../../services/customerApi';
import { CustomerTable } from '../../../components/admin/customers/CustomerTable';
import { Modal } from '../../../components/common/Modal';
import { CustomerDetailsModalContent } from '../../../components/admin/customers/CustomerDetails';
import { Input } from '../../../components/common/Input';
import { Search, Loader, RefreshCw, Users } from 'lucide-react';
import { useStore } from '../../../store/store';

export const Customers: React.FC = () => {
  const { showToast } = useStore();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCust, setSelectedCust] = useState<Customer | null>(null);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const loadCustomers = useCallback(async (isManual = false) => {
    if (isManual) setIsLoading(true);
    try {
      const result = await customerApi.getAll({ limit: 50 });
      // Map backend user shape to frontend Customer type
      const mapped: Customer[] = (result.customers || []).map((u: any) => ({
        id: u._id || u.id || '',
        name: u.name || '',
        email: u.email || '',
        phone: u.phone || '',
        city: u.city || u.address?.city || '',
        totalOrders: u.totalOrders || 0,
        totalSpent: u.totalSpent || 0,
        lastOrderDate: u.lastOrderDate || u.createdAt || '',
        status: (u.status || 'active') as 'active' | 'inactive',
        joinedDate: u.joinedDate || u.createdAt || '',
      }));
      setCustomers(mapped);
    } catch {
      if (isManual) {
        showToast('Could not load registered customers from server.', 'error');
      }
      setCustomers([]);
    } finally {
      if (isManual) setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    customerApi.getAll({ limit: 50 })
      .then((result) => {
        if (!isMounted) return;
        const mapped: Customer[] = (result.customers || []).map((u: any) => ({
          id: u._id || u.id || '',
          name: u.name || '',
          email: u.email || '',
          phone: u.phone || '',
          city: u.city || u.address?.city || '',
          totalOrders: u.totalOrders || 0,
          totalSpent: u.totalSpent || 0,
          lastOrderDate: u.lastOrderDate || u.createdAt || '',
          status: (u.status || 'active') as 'active' | 'inactive',
          joinedDate: u.joinedDate || u.createdAt || '',
        }));
        setCustomers(mapped);
      })
      .catch(() => {
        if (isMounted) setCustomers([]);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchChange = useCallback((val: string) => {
    setSearch(val);
    setCurrentPage(1);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        (c.name || '').toLowerCase().includes(q) ||
        (c.email || '').toLowerCase().includes(q) ||
        (c.phone || '').toLowerCase().includes(q) ||
        (c.city || '').toLowerCase().includes(q)
    );
  }, [customers, search]);

  // Pagination calculation
  const totalFiltered = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const validPage = Math.min(currentPage, totalPages);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedCustomers = useMemo(() => {
    return filtered.slice((validPage - 1) * pageSize, validPage * pageSize);
  }, [filtered, validPage, pageSize]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.25rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#FEF3C7',
                color: '#D97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Users size={18} />
            </div>
            <h1 style={{ fontSize: '1.85rem', color: '#1C1917', margin: 0 }}>
              Registered Patrons &amp; Customers
            </h1>
          </div>
          <p style={{ color: '#78716C', margin: 0, fontSize: '0.9rem' }}>
            View customer history, purchase lifetime value, and delivery destinations.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadCustomers(true)}
          disabled={isLoading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '9px 16px',
            borderRadius: '10px',
            border: '1px solid #E7E5E4',
            background: '#FFFFFF',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '0.88rem',
            color: '#1C1917',
            fontWeight: 700,
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
          }}
        >
          <RefreshCw size={15} style={{ animation: isLoading ? 'spin 1s linear infinite' : 'none' }} />
          <span>{isLoading ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {/* Search Toolbar */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          padding: '1rem 1.25rem',
          borderRadius: '14px',
          border: '1px solid #E7E5E4',
          maxWidth: '380px',
        }}
      >
        <Input
          placeholder="Search by name, email, phone, or city..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          leftIcon={<Search size={16} />}
        />
      </div>

      {isLoading && customers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3.5rem', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E7E5E4' }}>
          <Loader size={32} color="#D97706" style={{ animation: 'spin 1s linear infinite', margin: '0 auto' }} />
          <p style={{ color: '#78716C', marginTop: '0.75rem', fontSize: '0.9rem' }}>Loading registered customers…</p>
        </div>
      ) : (
        <CustomerTable
          customers={paginatedCustomers}
          onView={(c) => setSelectedCust(c)}
          isLoading={isLoading}
          pagination={{
            currentPage: validPage,
            totalPages,
            totalItems: totalFiltered,
            pageSize,
            onPageChange: setCurrentPage,
            onPageSizeChange: (size) => {
              setPageSize(size);
              setCurrentPage(1);
            },
            pageSizeOptions: [10, 20, 50],
          }}
        />
      )}

      {/* Customer Details Modal */}
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
