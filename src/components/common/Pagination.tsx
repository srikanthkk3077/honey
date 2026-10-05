import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  // Extended props for admin tables
  totalItems?: number;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  itemLabel?: string;
  compact?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  itemLabel = 'records',
  compact = false,
}) => {
  if (totalPages <= 1 && !totalItems) return null;

  const startItem = totalItems && pageSize ? (currentPage - 1) * pageSize + 1 : null;
  const endItem = totalItems && pageSize ? Math.min(currentPage * pageSize, totalItems) : null;

  // Smart page number list (max 7 slots)
  const getPageNumbers = (): (number | '...')[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | '...')[] = [1];
    if (currentPage > 3) pages.push('...');
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  };

  if (compact) {
    // Compact version for non-admin use (original style)
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '2.5rem' }}>
        <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}
          style={{ width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', border: '1px solid #D6D3D1', background: '#FFFFFF', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.4 : 1 }}>
          <ChevronLeft size={18} />
        </button>
        {getPageNumbers().map((p, idx) =>
          p === '...' ? (
            <span key={`dot-${idx}`} style={{ padding: '0 4px', color: '#A8A29E' }}>…</span>
          ) : (
            <button key={p} onClick={() => onPageChange(p as number)}
              style={{ width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', border: p === currentPage ? 'none' : '1px solid #D6D3D1', background: p === currentPage ? 'linear-gradient(135deg, #D97706, #B45309)' : '#FFFFFF', color: p === currentPage ? '#FFFFFF' : '#1C1917', fontWeight: p === currentPage ? 700 : 500, cursor: 'pointer' }}>
              {p}
            </button>
          )
        )}
        <button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}
          style={{ width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', border: '1px solid #D6D3D1', background: '#FFFFFF', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.4 : 1 }}>
          <ChevronRight size={18} />
        </button>
      </div>
    );
  }

  // Full admin table pagination bar
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', padding: '0.85rem 1.25rem', backgroundColor: '#FFFFFF', borderTop: '1px solid #F0EDE8' }}>
      {/* Left: count summary + page size selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
        {startItem !== null && endItem !== null && totalItems ? (
          <span style={{ fontSize: '0.83rem', color: '#78716C' }}>
            Showing <strong style={{ color: '#1C1917' }}>{startItem}–{endItem}</strong> of{' '}
            <strong style={{ color: '#1C1917' }}>{totalItems}</strong> {itemLabel}
          </span>
        ) : null}
        {onPageSizeChange && pageSize && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', color: '#78716C', whiteSpace: 'nowrap' }}>Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => { onPageSizeChange(Number(e.target.value)); onPageChange(1); }}
              style={{ padding: '4px 10px', borderRadius: '8px', border: '1px solid #E7E5E4', fontSize: '0.82rem', color: '#1C1917', backgroundColor: '#FFFFFF', outline: 'none', cursor: 'pointer', fontWeight: 600 }}
            >
              {pageSizeOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* Right: navigation buttons */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          {/* First */}
          <NavBtn disabled={currentPage === 1} onClick={() => onPageChange(1)} title="First page">
            <ChevronsLeft size={14} />
          </NavBtn>
          {/* Prev */}
          <NavBtn disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} title="Previous page">
            <ChevronLeft size={14} />
          </NavBtn>

          {/* Page numbers */}
          {getPageNumbers().map((p, idx) =>
            p === '...' ? (
              <span key={`dot-${idx}`} style={{ padding: '0 6px', color: '#A8A29E', fontSize: '0.84rem', lineHeight: '32px' }}>…</span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p as number)}
                style={{
                  minWidth: '32px',
                  height: '32px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  border: p === currentPage ? 'none' : '1px solid #E7E5E4',
                  background: p === currentPage ? '#D97706' : '#FFFFFF',
                  color: p === currentPage ? '#FFFFFF' : '#57534E',
                  fontWeight: p === currentPage ? 700 : 500,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  padding: '0 6px',
                }}
              >
                {p}
              </button>
            )
          )}

          {/* Next */}
          <NavBtn disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)} title="Next page">
            <ChevronRight size={14} />
          </NavBtn>
          {/* Last */}
          <NavBtn disabled={currentPage === totalPages} onClick={() => onPageChange(totalPages)} title="Last page">
            <ChevronsRight size={14} />
          </NavBtn>
        </div>
      )}
    </div>
  );
};

const NavBtn: React.FC<{ disabled: boolean; onClick: () => void; title: string; children: React.ReactNode }> = ({
  disabled, onClick, title, children,
}) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    title={title}
    style={{
      width: '32px',
      height: '32px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '8px',
      border: '1px solid #E7E5E4',
      background: '#FFFFFF',
      color: disabled ? '#D6D3D1' : '#57534E',
      cursor: disabled ? 'not-allowed' : 'pointer',
    }}
  >
    {children}
  </button>
);
