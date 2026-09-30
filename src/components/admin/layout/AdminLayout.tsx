import React, { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AdminMobileMenu } from './AdminMobileMenu';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8F6F0' }}>
      <div id="desktop-admin-sidebar">
        <AdminSidebar />
      </div>

      <AdminMobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AdminHeader onMobileToggle={() => setMobileMenuOpen(true)} />
        <main className="admin-main-content" style={{ padding: 'clamp(1rem, 2.5vw, 2rem)', flex: 1, minWidth: 0 }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #desktop-admin-sidebar { display: none !important; }
          #admin-menu-toggle { display: block !important; }
        }
        @media (max-width: 640px) {
          .admin-main-content {
            padding: 1rem 0.75rem !important;
          }
        }
      `}</style>
    </div>
  );
};
