import React, { useState } from 'react';
import { Transaction } from '../../../types/transaction.types';
import { formatPrice } from '../../../utils/formatPrice';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  ExternalLink,
  MapPin,
  Phone,
  Mail,
  Receipt,
  ShieldCheck,
  AlertTriangle,
  Package,
} from 'lucide-react';
import { Button } from '../../common/Button';

interface TransactionDetailsModalProps {
  transaction: Transaction;
  onVerify: (id: string) => Promise<void>;
  onReject: (id: string, reason: string) => Promise<void>;
  onClose: () => void;
  onViewScreenshot: (url: string) => void;
}

export const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({
  transaction,
  onVerify,
  onReject,
  onClose,
  onViewScreenshot,
}) => {
  const [copiedUtr, setCopiedUtr] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState('Payment could not be matched in bank records');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUtr(true);
    setTimeout(() => setCopiedUtr(false), 2000);
  };

  const handleVerifyClick = async () => {
    setIsProcessing(true);
    try {
      await onVerify(transaction.orderId || transaction.id);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectClick = async () => {
    if (!rejectReason.trim()) return;
    setIsProcessing(true);
    try {
      await onReject(transaction.orderId || transaction.id, rejectReason.trim());
      setShowRejectForm(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const isUpi = transaction.paymentMethod === 'upi';
  const isCod = transaction.paymentMethod === 'cod';
  const isPaid = transaction.paymentStatus === 'paid';
  const isPending = transaction.paymentStatus === 'verification_pending';
  const isRejected = transaction.paymentStatus === 'rejected';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: '#1C1917' }}>
      {/* Header Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid #E7E5E4',
        }}
      >
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#78716C', letterSpacing: '0.05em' }}>
            Transaction Ledger Record
          </div>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '2px 0 0 0', color: '#1C1917' }}>
            {transaction.transactionId}
          </h3>
          <div style={{ fontSize: '0.82rem', color: '#78716C', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} />
            Recorded on {new Date(transaction.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
          </div>
        </div>

        <div>
          {isPaid && (
            <span style={{ fontSize: '0.85rem', fontWeight: 800, padding: '6px 14px', borderRadius: '10px', background: '#ECFDF5', color: '#065F46', border: '1px solid #A7F3D0', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} /> SETTLED &amp; VERIFIED
            </span>
          )}
          {isPending && (
            <span style={{ fontSize: '0.85rem', fontWeight: 800, padding: '6px 14px', borderRadius: '10px', background: '#FEF3C7', color: '#92400E', border: '1.5px solid #FCD34D', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              ⏳ AWAITING VERIFICATION
            </span>
          )}
          {isRejected && (
            <span style={{ fontSize: '0.85rem', fontWeight: 800, padding: '6px 14px', borderRadius: '10px', background: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <XCircle size={16} /> TRANSACTION REJECTED
            </span>
          )}
          {isCod && !isPaid && (
            <span style={{ fontSize: '0.85rem', fontWeight: 800, padding: '6px 14px', borderRadius: '10px', background: '#EFF6FF', color: '#1E40AF', border: '1px solid #BFDBFE' }}>
              💵 COD PENDING COLLECTION
            </span>
          )}
        </div>
      </div>

      {/* Financial Summary Card */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '1rem',
          backgroundColor: '#FAF7F2',
          padding: '1.25rem',
          borderRadius: '14px',
          border: '1px solid #E7E5E4',
        }}
      >
        <div>
          <div style={{ fontSize: '0.75rem', color: '#78716C', fontWeight: 600 }}>Total Amount</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#D97706' }}>
            {formatPrice(transaction.amount)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#78716C', fontWeight: 600 }}>Payment Method</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1C1917', textTransform: 'uppercase', marginTop: '4px' }}>
            {transaction.paymentMethod === 'upi' ? '⚡ Direct UPI / Bank' : transaction.paymentMethod === 'cod' ? '💵 Cash on Delivery' : transaction.paymentMethod}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#78716C', fontWeight: 600 }}>Linked Order</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1C1917', marginTop: '4px' }}>
            {transaction.orderNumber}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#78716C', fontWeight: 600 }}>Fulfillment</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1C1917', textTransform: 'capitalize', marginTop: '4px' }}>
            {transaction.orderStatus}
          </div>
        </div>
      </div>

      {/* UPI / Proof Audit Box (if UPI) */}
      {isUpi && (
        <div
          style={{
            backgroundColor: isPending ? '#FFFBEB' : '#FFFFFF',
            borderRadius: '14px',
            border: isPending ? '1.5px solid #FCD34D' : '1px solid #E7E5E4',
            padding: '1.25rem',
          }}
        >
          <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#92400E', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={18} /> Bank Reference &amp; Proof Verification
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', backgroundColor: '#FFFFFF', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E7E5E4' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#78716C', display: 'block' }}>Customer Submitted UTR / Ref Number</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '1.15rem', color: '#1C1917' }}>
                  {transaction.utrNumber || 'No UTR specified'}
                </span>
              </div>
              {transaction.utrNumber && (
                <button
                  type="button"
                  onClick={() => handleCopy(transaction.utrNumber!)}
                  style={{
                    backgroundColor: copiedUtr ? '#059669' : '#FEF3C7',
                    color: copiedUtr ? '#FFFFFF' : '#92400E',
                    border: '1px solid #FDE68A',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {copiedUtr ? <Check size={14} /> : <Copy size={14} />}
                  {copiedUtr ? 'Copied' : 'Copy UTR'}
                </button>
              )}
            </div>

            {/* Receipt Proof Screenshot */}
            {transaction.paymentScreenshot ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#FFFFFF',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #E7E5E4',
                  flexWrap: 'wrap',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={transaction.paymentScreenshot}
                    alt="Payment Slip"
                    style={{ width: '54px', height: '54px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #E7E5E4', cursor: 'pointer' }}
                    onClick={() => onViewScreenshot(transaction.paymentScreenshot!)}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1C1917' }}>Payment Slip Screenshot Attached</div>
                    <div style={{ fontSize: '0.78rem', color: '#78716C' }}>Click thumbnail to view full resolution</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onViewScreenshot(transaction.paymentScreenshot!)}
                  style={{
                    backgroundColor: '#F5F5F4',
                    border: '1px solid #D6D3D1',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <ExternalLink size={14} /> View Proof
                </button>
              </div>
            ) : (
              <div style={{ fontSize: '0.82rem', color: '#78716C', fontStyle: 'italic', padding: '4px' }}>
                No screenshot uploaded. Verified using bank statement UTR matching.
              </div>
            )}

            {transaction.paymentVerifiedAt && (
              <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600 }}>
                ✓ Admin Verified on: {new Date(transaction.paymentVerifiedAt).toLocaleString('en-IN')}
              </div>
            )}
            {transaction.paymentRejectedReason && (
              <div style={{ fontSize: '0.82rem', color: '#DC2626', backgroundColor: '#FEF2F2', padding: '8px 12px', borderRadius: '8px', border: '1px solid #FECACA' }}>
                <strong>Rejection Reason:</strong> {transaction.paymentRejectedReason}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Customer & Payer Information */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #E7E5E4',
          padding: '1.25rem',
        }}
      >
        <div>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#78716C', marginBottom: '0.5rem' }}>
            Customer &amp; Payer
          </div>
          <div style={{ fontWeight: 700, fontSize: '0.98rem', color: '#1C1917' }}>{transaction.customerName}</div>
          <div style={{ fontSize: '0.85rem', color: '#57534E', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
            <Mail size={14} /> {transaction.customerEmail}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#57534E', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
            <Phone size={14} /> {transaction.customerPhone}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#78716C', marginBottom: '0.5rem' }}>
            Delivery Destination
          </div>
          <div style={{ fontSize: '0.85rem', color: '#57534E', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
            <MapPin size={16} style={{ flexShrink: 0, marginTop: '2px', color: '#D97706' }} />
            <div>
              {transaction.order?.shippingAddress ? (
                <>
                  <div>{transaction.order.shippingAddress.addressLine1}</div>
                  {transaction.order.shippingAddress.addressLine2 && <div>{transaction.order.shippingAddress.addressLine2}</div>}
                  <div>
                    {transaction.order.shippingAddress.city}, {transaction.order.shippingAddress.state} - {transaction.order.shippingAddress.pincode}
                  </div>
                </>
              ) : (
                <div>{transaction.shippingCity}, {transaction.shippingState}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Purchased Items Table */}
      {transaction.order?.items && transaction.order.items.length > 0 && (
        <div style={{ border: '1px solid #E7E5E4', borderRadius: '14px', overflow: 'hidden' }}>
          <div style={{ backgroundColor: '#FAF7F2', padding: '10px 14px', borderBottom: '1px solid #E7E5E4', fontWeight: 700, fontSize: '0.85rem', color: '#57534E', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Package size={16} /> Billed Honey Items ({transaction.order.items.length})
          </div>
          <div style={{ padding: '8px 14px' }}>
            {transaction.order.items.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: idx === transaction.order.items.length - 1 ? 'none' : '1px solid #F5F1E9',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {item.image && (
                    <img src={item.image} alt={item.productName} style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }} />
                  )}
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#1C1917' }}>{item.productName}</div>
                    <div style={{ fontSize: '0.76rem', color: '#78716C' }}>Size: {item.size} × {item.quantity}</div>
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1C1917' }}>
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Controls for Admin */}
      <div style={{ borderTop: '1px solid #E7E5E4', paddingTop: '1.25rem' }}>
        {showRejectForm ? (
          <div style={{ backgroundColor: '#FEF2F2', padding: '1rem', borderRadius: '12px', border: '1px solid #FECACA' }}>
            <div style={{ fontWeight: 700, color: '#991B1B', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              Specify Rejection Reason for Customer:
            </div>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={2}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #F87171',
                fontSize: '0.88rem',
                outline: 'none',
                marginBottom: '0.75rem',
              }}
            />
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowRejectForm(false)}
                style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #D6D3D1', background: '#FFFFFF', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleRejectClick}
                style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', background: '#DC2626', color: '#FFFFFF', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}
              >
                {isProcessing ? 'Rejecting...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #D6D3D1', background: '#FFFFFF', color: '#57534E', fontWeight: 600, cursor: 'pointer' }}
            >
              Close
            </button>

            <div style={{ display: 'flex', gap: '10px' }}>
              {!isPaid && !isRejected && (
                <button
                  type="button"
                  onClick={() => setShowRejectForm(true)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    border: '1px solid #FECACA',
                    backgroundColor: '#FEF2F2',
                    color: '#DC2626',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.88rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <XCircle size={16} /> Reject Payment
                </button>
              )}

              {!isPaid && (
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleVerifyClick}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: '#059669',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.88rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 8px rgba(5, 150, 105, 0.25)',
                  }}
                >
                  <CheckCircle2 size={16} /> {isProcessing ? 'Verifying...' : 'Verify & Mark Paid'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
