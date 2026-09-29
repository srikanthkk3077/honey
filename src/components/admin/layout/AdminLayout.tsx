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
        <main style={{ padding: '2rem', flex: 1 }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #desktop-admin-sidebar { display: none !important; }
          #admin-menu-toggle { display: block !important; }
        }
      `}</style>
    </div>
  );
};
