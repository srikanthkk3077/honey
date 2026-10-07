import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminLayout as BaseAdminLayout } from '../components/admin/layout/AdminLayout';
import { useStore } from '../store/store';
import { PageLoader } from '../components/common/PageLoader';
import { X, AlertCircle, CheckCircle2, Info } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { toasts, removeToast } = useStore();

  return (
    <BaseAdminLayout>
      <Suspense fallback={<PageLoader message="Loading admin console..." />}>
        <Outlet />
      </Suspense>

      {/* Floating Global Toasts */}
      <div className="toast-container" style={{ zIndex: 99999 }}>
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flex: 1, minWidth: 0 }}>
              {toast.type === 'error' && (
                <AlertCircle size={18} style={{ color: '#FCA5A5', flexShrink: 0, marginTop: '2px' }} />
              )}
              {toast.type === 'success' && (
                <CheckCircle2 size={18} style={{ color: '#6EE7B7', flexShrink: 0, marginTop: '2px' }} />
              )}
              {toast.type === 'info' && (
                <Info size={18} style={{ color: '#FCD34D', flexShrink: 0, marginTop: '2px' }} />
              )}
              <span style={{ fontSize: '0.88rem', lineHeight: '1.4', wordBreak: 'break-word' }}>
                {toast.message}
              </span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.7)',
                cursor: 'pointer',
                padding: '2px',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
              }}
              title="Close notification"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </BaseAdminLayout>
  );
};
