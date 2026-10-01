import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../../../store/store';
import orderApi from '../../../services/orderApi';
import { Order } from '../../../types/order.types';
import { Transaction, TransactionStatsSummary } from '../../../types/transaction.types';
import { TransactionStats } from '../../../components/admin/transactions/TransactionStats';
import { TransactionTable } from '../../../components/admin/transactions/TransactionTable';
import { TransactionDetailsModal } from '../../../components/admin/transactions/TransactionDetailsModal';
import { Modal } from '../../../components/common/Modal';
import { Input } from '../../../components/common/Input';
import {
  Search,
  RefreshCw,
  Download,
  Filter,
  Receipt,
  X,
  ArrowUpDown,
  Calendar,
} from 'lucide-react';

export const Transactions: React.FC = () => {
  const { verifyPayment, rejectPayment, showToast } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);

  // Filters & Sorting state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'amount_high' | 'amount_low'>('newest');

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const result = await orderApi.getAll({ limit: 300 });
      setOrders(result.orders);
    } catch {
      showToast('Could not refresh transaction records from server', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Transform Orders to Transactions
  const transactions: Transaction[] = useMemo(() => {
    return orders.map((order) => {
      const isUpi = order.paymentMethod === 'upi';
      const isCod = order.paymentMethod === 'cod';

      let displayTxId = order.utrNumber;
      if (!displayTxId) {
        if (isCod) {
          displayTxId = `COD-${order.orderNumber}`;
        } else {
          displayTxId = `TXN-${order.id.slice(-8).toUpperCase()}`;
        }
      }

      return {
        id: order.id,
        transactionId: displayTxId,
        orderId: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        amount: order.total,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        utrNumber: order.utrNumber,
        paymentScreenshot: order.paymentScreenshot,
        paymentVerifiedAt: order.paymentVerifiedAt,
        paymentRejectedReason: order.paymentRejectedReason,
        createdAt: order.createdAt,
        itemsCount: order.items ? order.items.reduce((s, i) => s + i.quantity, 0) : 0,
        shippingCity: order.shippingAddress?.city || '',
        shippingState: order.shippingAddress?.state || '',
        order,
      };
    });
  }, [orders]);

  // Calculate Metrics
  const stats: TransactionStatsSummary = useMemo(() => {
    let totalRevenue = 0;
    let settledCount = 0;
    let pendingVerificationCount = 0;
    let pendingVerificationAmount = 0;
    let codPendingCount = 0;
    let codPendingAmount = 0;
    let rejectedCount = 0;
    let rejectedAmount = 0;

    transactions.forEach((tx) => {
      if (tx.paymentStatus === 'paid') {
        totalRevenue += tx.amount;
        settledCount++;
      } else if (tx.paymentStatus === 'verification_pending') {
        pendingVerificationCount++;
        pendingVerificationAmount += tx.amount;
      } else if (tx.paymentStatus === 'rejected') {
        rejectedCount++;
        rejectedAmount += tx.amount;
      }

      if (tx.paymentMethod === 'cod' && tx.paymentStatus !== 'paid') {
        codPendingCount++;
        codPendingAmount += tx.amount;
      }
    });

    return {
      totalRevenue,
      settledCount,
      pendingVerificationCount,
      pendingVerificationAmount,
      codPendingCount,
      codPendingAmount,
      rejectedCount,
      rejectedAmount,
    };
  }, [transactions]);

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        // Status filter
        if (statusFilter === 'paid' && tx.paymentStatus !== 'paid') return false;
        if (statusFilter === 'verification_pending' && tx.paymentStatus !== 'verification_pending') return false;
        if (statusFilter === 'cod' && (tx.paymentMethod !== 'cod' || tx.paymentStatus === 'paid')) return false;
        if (statusFilter === 'rejected' && tx.paymentStatus !== 'rejected') return false;

        // Payment Method filter
        if (methodFilter !== 'all' && tx.paymentMethod !== methodFilter) return false;

        // Date filter
        if (dateFilter !== 'all') {
          const txDate = new Date(tx.createdAt).getTime();
          const now = Date.now();
          if (dateFilter === 'today') {
            const startOfToday = new Date().setHours(0, 0, 0, 0);
            if (txDate < startOfToday) return false;
          } else if (dateFilter === '7days') {
            if (now - txDate > 7 * 24 * 60 * 60 * 1000) return false;
          } else if (dateFilter === '30days') {
            if (now - txDate > 30 * 24 * 60 * 60 * 1000) return false;
          }
        }

        // Search filter
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchTxId = tx.transactionId.toLowerCase().includes(q);
          const matchOrder = tx.orderNumber.toLowerCase().includes(q);
          const matchName = tx.customerName.toLowerCase().includes(q);
          const matchEmail = tx.customerEmail.toLowerCase().includes(q);
          const matchPhone = tx.customerPhone.toLowerCase().includes(q);
          const matchUtr = tx.utrNumber ? tx.utrNumber.toLowerCase().includes(q) : false;
          return matchTxId || matchOrder || matchName || matchEmail || matchPhone || matchUtr;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === 'amount_high') {
          return b.amount - a.amount;
        }
        if (sortBy === 'amount_low') {
          return a.amount - b.amount;
        }
        return 0;
      });
  }, [transactions, statusFilter, methodFilter, dateFilter, search, sortBy]);

  // Handle Verify & Settle
  const handleVerifyPayment = async (orderId: string) => {
    try {
      await verifyPayment(orderId);
      showToast('Payment verified and settled successfully', 'success');
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, paymentStatus: 'paid', paymentVerifiedAt: new Date().toISOString() }
            : o
        )
      );
      if (selectedTx && selectedTx.orderId === orderId) {
        setSelectedTx({
          ...selectedTx,
          paymentStatus: 'paid',
          paymentVerifiedAt: new Date().toISOString(),
        });
      }
    } catch {
      showToast('Failed to verify payment. Please try again.', 'error');
    }
  };

  // Handle Reject Payment
  const handleRejectPayment = async (orderId: string, reason: string) => {
    try {
      await rejectPayment(orderId, reason);
      showToast('Payment marked as rejected', 'info');
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, paymentStatus: 'rejected', paymentRejectedReason: reason }
            : o
        )
      );
      if (selectedTx && selectedTx.orderId === orderId) {
        setSelectedTx({
          ...selectedTx,
          paymentStatus: 'rejected',
          paymentRejectedReason: reason,
        });
      }
    } catch {
      showToast('Failed to reject payment.', 'error');
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) {
      showToast('No transactions to export', 'info');
      return;
    }

    const headers = [
      'Transaction ID',
      'Order Number',
      'Date & Time',
      'Customer Name',
      'Email',
      'Phone',
      'Payment Method',
      'Amount (INR)',
      'Payment Status',
      'UTR Reference',
      'Verified At',
      'Rejection Reason',
      'City',
      'State',
    ];

    const rows = filteredTransactions.map((tx) => [
      `"${tx.transactionId}"`,
      `"${tx.orderNumber}"`,
      `"${new Date(tx.createdAt).toISOString()}"`,
      `"${tx.customerName.replace(/"/g, '""')}"`,
      `"${tx.customerEmail}"`,
      `"${tx.customerPhone}"`,
      `"${tx.paymentMethod.toUpperCase()}"`,
      tx.amount,
      `"${tx.paymentStatus.toUpperCase()}"`,
      `"${tx.utrNumber || ''}"`,
      `"${tx.paymentVerifiedAt || ''}"`,
      `"${(tx.paymentRejectedReason || '').replace(/"/g, '""')}"`,
      `"${tx.shippingCity}"`,
      `"${tx.shippingState}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Madhuvan_Transactions_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Transaction ledger downloaded successfully', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Banner & Header */}
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
              <Receipt size={18} />
            </div>
            <h1 style={{ fontSize: '1.85rem', color: '#1C1917', margin: 0 }}>
              Payment Transactions &amp; Audit Ledger
            </h1>
          </div>
          <p style={{ color: '#78716C', margin: 0, fontSize: '0.9rem' }}>
            Comprehensive audit log of all online UPI receipts, bank transfers, cards, and COD collections.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleExportCSV}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: '10px',
              border: '1px solid #E7E5E4',
              background: '#FFFFFF',
              cursor: 'pointer',
              fontSize: '0.88rem',
              color: '#1C1917',
              fontWeight: 700,
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            }}
          >
            <Download size={16} color="#D97706" />
            <span>Export CSV Ledger</span>
          </button>

          <button
            type="button"
            onClick={loadOrders}
            disabled={isLoading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: '10px',
              border: 'none',
              background: '#D97706',
              color: '#FFFFFF',
              cursor: 'pointer',
              fontSize: '0.88rem',
              fontWeight: 700,
              boxShadow: '0 2px 8px rgba(217, 119, 6, 0.25)',
            }}
          >
            <RefreshCw size={15} style={{ animation: isLoading ? 'spin 1s linear infinite' : 'none' }} />
            <span>{isLoading ? 'Syncing...' : 'Sync Transactions'}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <TransactionStats stats={stats} onFilterStatus={(st) => setStatusFilter(st)} />

      {/* Filter Toolbar */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E7E5E4',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
        }}
      >
        {/* Search Bar & Dropdowns Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ flex: '1 1 280px', minWidth: '240px', maxWidth: '420px' }}>
            <Input
              placeholder="Search by UTR, Txn ID, Order #, Customer, Phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search size={16} />}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Payment Channel */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.82rem', color: '#78716C', fontWeight: 600 }}>Channel:</span>
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                style={{
                  padding: '7px 12px',
                  borderRadius: '8px',
                  border: '1px solid #E7E5E4',
                  fontSize: '0.84rem',
                  color: '#1C1917',
                  backgroundColor: '#FFFFFF',
                  outline: 'none',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <option value="all">All Methods</option>
                <option value="upi">⚡ Direct UPI</option>
                <option value="cod">💵 Cash on Delivery</option>
                <option value="card">💳 Card</option>
                <option value="netbanking">🏦 Net Banking</option>
              </select>
            </div>

            {/* Date Range */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.82rem', color: '#78716C', fontWeight: 600 }}>Period:</span>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                style={{
                  padding: '7px 12px',
                  borderRadius: '8px',
                  border: '1px solid #E7E5E4',
                  fontSize: '0.84rem',
                  color: '#1C1917',
                  backgroundColor: '#FFFFFF',
                  outline: 'none',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
              </select>
            </div>

            {/* Sort Order */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.82rem', color: '#78716C', fontWeight: 600 }}>Sort:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                style={{
                  padding: '7px 12px',
                  borderRadius: '8px',
                  border: '1px solid #E7E5E4',
                  fontSize: '0.84rem',
                  color: '#1C1917',
                  backgroundColor: '#FFFFFF',
                  outline: 'none',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="amount_high">Highest Amount</option>
                <option value="amount_low">Lowest Amount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', borderTop: '1px solid #F5F1E9', paddingTop: '0.75rem' }}>
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: statusFilter === 'all' ? 700 : 600,
              border: statusFilter === 'all' ? '1px solid #D97706' : '1px solid #E7E5E4',
              background: statusFilter === 'all' ? '#FEF3C7' : '#FFFFFF',
              color: statusFilter === 'all' ? '#92400E' : '#57534E',
              cursor: 'pointer',
            }}
          >
            All Transactions ({transactions.length})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('verification_pending')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 800,
              border: statusFilter === 'verification_pending' ? '2px solid #D97706' : '1px solid #FCD34D',
              background: statusFilter === 'verification_pending' ? '#D97706' : '#FFFBEB',
              color: statusFilter === 'verification_pending' ? '#FFFFFF' : '#B45309',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>⏳ Awaiting Verification</span>
            <span
              style={{
                backgroundColor: statusFilter === 'verification_pending' ? '#FFFFFF' : '#D97706',
                color: statusFilter === 'verification_pending' ? '#D97706' : '#FFFFFF',
                fontSize: '0.72rem',
                padding: '1px 6px',
                borderRadius: '10px',
                fontWeight: 800,
              }}
            >
              {stats.pendingVerificationCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('paid')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: statusFilter === 'paid' ? 700 : 600,
              border: statusFilter === 'paid' ? '1px solid #059669' : '1px solid #E7E5E4',
              background: statusFilter === 'paid' ? '#ECFDF5' : '#FFFFFF',
              color: statusFilter === 'paid' ? '#065F46' : '#57534E',
              cursor: 'pointer',
            }}
          >
            ✓ Paid &amp; Settled ({stats.settledCount})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('cod')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: statusFilter === 'cod' ? 700 : 600,
              border: statusFilter === 'cod' ? '1px solid #2563EB' : '1px solid #E7E5E4',
              background: statusFilter === 'cod' ? '#EFF6FF' : '#FFFFFF',
              color: statusFilter === 'cod' ? '#1E40AF' : '#57534E',
              cursor: 'pointer',
            }}
          >
            💵 COD Pending ({stats.codPendingCount})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('rejected')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: statusFilter === 'rejected' ? 700 : 600,
              border: statusFilter === 'rejected' ? '1px solid #DC2626' : '1px solid #E7E5E4',
              background: statusFilter === 'rejected' ? '#FEF2F2' : '#FFFFFF',
              color: statusFilter === 'rejected' ? '#991B1B' : '#57534E',
              cursor: 'pointer',
            }}
          >
            ✕ Disputed / Rejected ({stats.rejectedCount})
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <TransactionTable
        transactions={filteredTransactions}
        onViewTransaction={(tx) => setSelectedTx(tx)}
        onQuickVerify={(tx) => handleVerifyPayment(tx.orderId || tx.id)}
        onViewScreenshot={(url) => setScreenshotUrl(url)}
      />

      {/* Transaction Details Modal */}
      <Modal
        isOpen={!!selectedTx}
        onClose={() => setSelectedTx(null)}
        title="Transaction Audit &amp; Settlement Record"
        maxWidth="680px"
      >
        {selectedTx && (
          <TransactionDetailsModal
            transaction={selectedTx}
            onVerify={handleVerifyPayment}
            onReject={handleRejectPayment}
            onClose={() => setSelectedTx(null)}
            onViewScreenshot={(url) => setScreenshotUrl(url)}
          />
        )}
      </Modal>

      {/* Full-size Payment Proof Lightbox Modal */}
      <Modal
        isOpen={!!screenshotUrl}
        onClose={() => setScreenshotUrl(null)}
        title="Bank Transfer Payment Proof / Receipt"
        maxWidth="700px"
      >
        {screenshotUrl && (
          <div style={{ textAlign: 'center', padding: '0.5rem' }}>
            <img
              src={screenshotUrl}
              alt="Payment Slip Proof"
              style={{
                maxWidth: '100%',
                maxHeight: '70vh',
                borderRadius: '12px',
                border: '1px solid #E7E5E4',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                objectFit: 'contain',
              }}
            />
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <a
                href={screenshotUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  background: '#D97706',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                }}
              >
                Open in Full Window
              </a>
              <button
                type="button"
                onClick={() => setScreenshotUrl(null)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  background: '#F5F5F4',
                  border: '1px solid #D6D3D1',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
