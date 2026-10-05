import React, { useState } from 'react';
import { Transaction } from '../../../types/transaction.types';
import { formatPrice } from '../../../utils/formatPrice';
import { Eye, Copy, Check, CheckCircle2, XCircle, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { Pagination } from '../../common/Pagination';

interface TransactionTableProps {
  transactions: Transaction[];
  onViewTransaction: (transaction: Transaction) => void;
  onQuickVerify?: (transaction: Transaction) => void;
  onViewScreenshot?: (url: string) => void;
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

// ─── Skeleton shimmer row ─────────────────────────────────────────────────────
const SkeletonRow: React.FC = () => (
  <tr style={{ borderBottom: '1px solid #F5F1E9' }}>
    {[130, 80, 140, 90, 80, 110, 80, 110].map((w, i) => (
      <td key={i} style={{ padding: '1rem' }}>
        <div
          style={{
            height: '14px',
            width: `${w}px`,
            maxWidth: '100%',
            borderRadius: '6px',
            background: 'linear-gradient(90deg,#F5F1E9 25%,#EDE9E0 50%,#F5F1E9 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.4s infinite',
          }}
        />
        {i === 2 && (
          <div
            style={{
              height: '10px',
              width: '90px',
              borderRadius: '4px',
              background: 'linear-gradient(90deg,#F5F1E9 25%,#EDE9E0 50%,#F5F1E9 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.4s infinite',
              marginTop: '5px',
            }}
          />
        )}
      </td>
    ))}
  </tr>
);

const formatDate = (dateStr?: string | Date) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return isNaN(d.getTime())
    ? '—'
    : d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
};

export const TransactionTable: React.FC<TransactionTableProps> = React.memo(({
  transactions,
  onViewTransaction,
  onQuickVerify,
  onViewScreenshot,
  isLoading = false,
  pagination,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, text: string, id: string) => {
    e.stopPropagation();
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isLoading && transactions.length === 0) {
    return (
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E7E5E4',
          padding: '3.5rem 1.5rem',
          textAlign: 'center',
          color: '#78716C',
        }}
      >
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🧾</div>
        <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1C1917', marginBottom: '0.25rem' }}>
          No Transactions Found
        </div>
        <div style={{ fontSize: '0.88rem' }}>
          There are no transaction records matching your current filter criteria.
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E7E5E4', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
      <div className="table-responsive" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid #E7E5E4', color: '#57534E' }}>
              <th style={{ padding: '1rem 1.25rem', fontWeight: 700 }}>Transaction / UTR Ref</th>
              <th style={{ padding: '1rem', fontWeight: 700 }}>Order #</th>
              <th style={{ padding: '1rem', fontWeight: 700 }}>Customer</th>
              <th style={{ padding: '1rem', fontWeight: 700 }}>Channel</th>
              <th style={{ padding: '1rem', fontWeight: 700 }}>Amount</th>
              <th style={{ padding: '1rem', fontWeight: 700 }}>Status</th>
              <th style={{ padding: '1rem', fontWeight: 700 }}>Proof Slip</th>
              <th style={{ padding: '1rem 1.25rem', fontWeight: 700, textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && transactions.length === 0 ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : (
              transactions.map((tx) => {
              const isUpi = tx.paymentMethod === 'upi';
              const isPaid = tx.paymentStatus === 'paid';
              const isPending = tx.paymentStatus === 'verification_pending';
              const isRejected = tx.paymentStatus === 'rejected';
              const isCod = tx.paymentMethod === 'cod';

              return (
                <tr
                  key={tx.id}
                  style={{
                    borderBottom: '1px solid #F5F1E9',
                    transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FAF8F5')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  {/* Transaction / Ref ID */}
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          color: isPending ? '#B45309' : '#1C1917',
                        }}
                      >
                        {tx.transactionId}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleCopy(e, tx.transactionId, tx.id)}
                        title="Copy Transaction ID"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: copiedId === tx.id ? '#059669' : '#A8A29E',
                          cursor: 'pointer',
                          padding: '2px',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {copiedId === tx.id ? <Check size={13} /> : <Copy size={13} />}
                      </button>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#78716C', marginTop: '2px' }}>
                      {formatDate(tx.createdAt)}
                    </div>
                  </td>

                  {/* Linked Order */}
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 700, color: '#D97706' }}>{tx.orderNumber}</div>
                    <div style={{ fontSize: '0.75rem', color: '#78716C' }}>
                      {tx.itemsCount} {tx.itemsCount === 1 ? 'jar' : 'jars'}
                    </div>
                  </td>

                  {/* Customer */}
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 600, color: '#1C1917' }}>{tx.customerName || 'Customer'}</div>
                    <div style={{ fontSize: '0.76rem', color: '#78716C' }}>
                      {tx.customerPhone || tx.customerEmail || '—'}
                    </div>
                  </td>

                  {/* Method / Channel */}
                  <td style={{ padding: '1rem' }}>
                    {isUpi && (
                      <span
                        style={{
                          fontSize: '0.74rem',
                          fontWeight: 800,
                          color: '#92400E',
                          backgroundColor: '#FEF3C7',
                          border: '1px solid #FDE68A',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          display: 'inline-block',
                        }}
                      >
                        ⚡ UPI DIRECT
                      </span>
                    )}
                    {isCod && (
                      <span
                        style={{
                          fontSize: '0.74rem',
                          fontWeight: 800,
                          color: '#1E40AF',
                          backgroundColor: '#EFF6FF',
                          border: '1px solid #BFDBFE',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          display: 'inline-block',
                        }}
                      >
                        💵 COD
                      </span>
                    )}
                    {!isUpi && !isCod && (
                      <span
                        style={{
                          fontSize: '0.74rem',
                          fontWeight: 800,
                          color: '#4B5563',
                          backgroundColor: '#F3F4F6',
                          border: '1px solid #E5E7EB',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          display: 'inline-block',
                          textTransform: 'uppercase',
                        }}
                      >
                        💳 {tx.paymentMethod}
                      </span>
                    )}
                  </td>

                  {/* Amount */}
                  <td style={{ padding: '1rem', fontWeight: 800, fontSize: '0.96rem', color: '#1C1917' }}>
                    {formatPrice(tx.amount)}
                  </td>

                  {/* Status Badge */}
                  <td style={{ padding: '1rem' }}>
                    {isPaid && (
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: '#065F46',
                          backgroundColor: '#ECFDF5',
                          border: '1px solid #A7F3D0',
                          padding: '3px 9px',
                          borderRadius: '8px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <CheckCircle2 size={13} /> Paid &amp; Settled
                      </span>
                    )}
                    {isPending && (
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          color: '#92400E',
                          backgroundColor: '#FFFBEB',
                          border: '1.5px solid #FCD34D',
                          padding: '3px 9px',
                          borderRadius: '8px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          animation: 'pulse 2s infinite',
                        }}
                      >
                        ⏳ Verify UTR
                      </span>
                    )}
                    {isRejected && (
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: '#991B1B',
                          backgroundColor: '#FEF2F2',
                          border: '1px solid #FECACA',
                          padding: '3px 9px',
                          borderRadius: '8px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <XCircle size={13} /> Rejected
                      </span>
                    )}
                    {isCod && !isPaid && (
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: '#1E40AF',
                          backgroundColor: '#EFF6FF',
                          border: '1px solid #BFDBFE',
                          padding: '3px 9px',
                          borderRadius: '8px',
                        }}
                      >
                        Collect on Delivery
                      </span>
                    )}
                  </td>

                  {/* Proof Attachment */}
                  <td style={{ padding: '1rem' }}>
                    {tx.paymentScreenshot ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewScreenshot?.(tx.paymentScreenshot!);
                        }}
                        style={{
                          background: '#FFFFFF',
                          border: '1px solid #E7E5E4',
                          borderRadius: '8px',
                          padding: '3px 8px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '0.75rem',
                          color: '#92400E',
                          fontWeight: 700,
                        }}
                      >
                        <img
                          src={tx.paymentScreenshot}
                          alt="Slip"
                          style={{ width: '18px', height: '18px', borderRadius: '3px', objectFit: 'cover' }}
                        />
                        <span>View Slip</span>
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.74rem', color: '#A8A29E' }}>—</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      {isPending && onQuickVerify && (
                        <button
                          type="button"
                          onClick={() => onQuickVerify(tx)}
                          style={{
                            padding: '5px 10px',
                            borderRadius: '8px',
                            background: '#059669',
                            color: '#FFFFFF',
                            border: 'none',
                            fontWeight: 700,
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                          }}
                        >
                          <CheckCircle2 size={13} /> Settle
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onViewTransaction(tx)}
                        style={{
                          padding: '5px 10px',
                          borderRadius: '8px',
                          background: '#FEF3C7',
                          color: '#92400E',
                          border: 'none',
                          fontWeight: 600,
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                        }}
                      >
                        <Eye size={13} /> Details
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
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
          pageSizeOptions={pagination.pageSizeOptions || [10, 20, 50, 100]}
          itemLabel="transactions"
        />
      )}

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
});
