import React from 'react';
import { IndianRupee, Clock, Truck, AlertTriangle } from 'lucide-react';
import { formatPrice } from '../../../utils/formatPrice';
import { TransactionStatsSummary } from '../../../types/transaction.types';

interface TransactionStatsProps {
  stats: TransactionStatsSummary;
  onFilterStatus?: (status: string) => void;
}

export const TransactionStats: React.FC<TransactionStatsProps> = ({ stats, onFilterStatus }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
      {/* Settled Revenue */}
      <div
        onClick={() => onFilterStatus?.('paid')}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '1.4rem 1.5rem',
          border: '1px solid #E7E5E4',
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          cursor: onFilterStatus ? 'pointer' : 'default',
          transition: 'all 0.2s',
        }}
      >
        <div>
          <div style={{ fontSize: '0.84rem', color: '#78716C', fontWeight: 600, marginBottom: '0.35rem' }}>
            Settled / Verified Revenue
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#065F46', lineHeight: 1.2, marginBottom: '0.4rem' }}>
            {formatPrice(stats.totalRevenue)}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600 }}>
            ✓ {stats.settledCount} Payments Verified
          </div>
        </div>
        <div
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            backgroundColor: '#ECFDF5',
            color: '#059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <IndianRupee size={22} />
        </div>
      </div>

      {/* Awaiting UTR Verification */}
      <div
        onClick={() => onFilterStatus?.('verification_pending')}
        style={{
          backgroundColor: stats.pendingVerificationCount > 0 ? '#FFFBEB' : '#FFFFFF',
          borderRadius: '16px',
          padding: '1.4rem 1.5rem',
          border: stats.pendingVerificationCount > 0 ? '1.5px solid #FCD34D' : '1px solid #E7E5E4',
          boxShadow: stats.pendingVerificationCount > 0 ? '0 4px 14px rgba(217, 119, 6, 0.12)' : '0 2px 10px rgba(0,0,0,0.02)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          cursor: onFilterStatus ? 'pointer' : 'default',
          transition: 'all 0.2s',
        }}
      >
        <div>
          <div style={{ fontSize: '0.84rem', color: stats.pendingVerificationCount > 0 ? '#92400E' : '#78716C', fontWeight: 700, marginBottom: '0.35rem' }}>
            Awaiting Verification
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: stats.pendingVerificationCount > 0 ? '#B45309' : '#1C1917', lineHeight: 1.2, marginBottom: '0.4rem' }}>
            {formatPrice(stats.pendingVerificationAmount)}
          </div>
          <div style={{ fontSize: '0.8rem', color: stats.pendingVerificationCount > 0 ? '#D97706' : '#78716C', fontWeight: 700 }}>
            ⏳ {stats.pendingVerificationCount} UPI Transfers Pending
          </div>
        </div>
        <div
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            backgroundColor: stats.pendingVerificationCount > 0 ? '#D97706' : '#FEF3C7',
            color: stats.pendingVerificationCount > 0 ? '#FFFFFF' : '#D97706',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Clock size={22} />
        </div>
      </div>

      {/* COD Pending Collection */}
      <div
        onClick={() => onFilterStatus?.('cod')}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '1.4rem 1.5rem',
          border: '1px solid #E7E5E4',
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          cursor: onFilterStatus ? 'pointer' : 'default',
          transition: 'all 0.2s',
        }}
      >
        <div>
          <div style={{ fontSize: '0.84rem', color: '#78716C', fontWeight: 600, marginBottom: '0.35rem' }}>
            COD In-Transit Collections
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#1E40AF', lineHeight: 1.2, marginBottom: '0.4rem' }}>
            {formatPrice(stats.codPendingAmount)}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#3B82F6', fontWeight: 600 }}>
            📦 {stats.codPendingCount} Orders to Collect
          </div>
        </div>
        <div
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            backgroundColor: '#EFF6FF',
            color: '#2563EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Truck size={22} />
        </div>
      </div>

      {/* Rejected / Disputed */}
      <div
        onClick={() => onFilterStatus?.('rejected')}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '1.4rem 1.5rem',
          border: '1px solid #E7E5E4',
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          cursor: onFilterStatus ? 'pointer' : 'default',
          transition: 'all 0.2s',
        }}
      >
        <div>
          <div style={{ fontSize: '0.84rem', color: '#78716C', fontWeight: 600, marginBottom: '0.35rem' }}>
            Rejected / Failed Volume
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: stats.rejectedCount > 0 ? '#DC2626' : '#78716C', lineHeight: 1.2, marginBottom: '0.4rem' }}>
            {formatPrice(stats.rejectedAmount)}
          </div>
          <div style={{ fontSize: '0.8rem', color: stats.rejectedCount > 0 ? '#EF4444' : '#78716C', fontWeight: 600 }}>
            ✕ {stats.rejectedCount} Disputed / Rejected
          </div>
        </div>
        <div
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            backgroundColor: '#FEF2F2',
            color: '#DC2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <AlertTriangle size={22} />
        </div>
      </div>
    </div>
  );
};
