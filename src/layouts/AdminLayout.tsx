import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminLayout as BaseAdminLayout } from '../components/admin/layout/AdminLayout';
import { useStore } from '../store/store';
import { X } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { toasts, removeToast } = useStore();

  return (
    <BaseAdminLayout>
      <Outlet />

      {/* Floating Global Toasts */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', padding: 0 }}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </BaseAdminLayout>
  );
};
