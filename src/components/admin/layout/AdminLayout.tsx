import React, { useState, useEffect, useRef } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AdminMobileMenu } from './AdminMobileMenu';
import api from '../../../services/api';

// ─── Global API Loading Bar ───────────────────────────────────────────────────
const AdminLoadingBar: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const activeRequests = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const start = () => {
      activeRequests.current += 1;
      if (activeRequests.current === 1) {
        setProgress(0);
        setVisible(true);
        // Animate to ~85% quickly, then slow down
        let p = 0;
        timerRef.current = setInterval(() => {
          p += p < 30 ? 8 : p < 60 ? 4 : p < 80 ? 1.5 : 0.3;
          if (p >= 85) { if (timerRef.current) clearInterval(timerRef.current); p = 85; }
          setProgress(p);
        }, 120);
      }
    };

    const finish = () => {
      activeRequests.current = Math.max(0, activeRequests.current - 1);
      if (activeRequests.current === 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        setProgress(100);
        setTimeout(() => { setVisible(false); setProgress(0); }, 400);
      }
    };

    const reqId  = api.interceptors.request.use((cfg) => { start(); return cfg; }, (e) => { finish(); return Promise.reject(e); });
    const resId  = api.interceptors.response.use((res) => { finish(); return res; }, (e) => { finish(); return Promise.reject(e); });

    return () => {
      api.interceptors.request.eject(reqId);
      api.interceptors.response.eject(resId);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (!visible && progress === 0) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999, height: '3px', background: 'transparent', pointerEvents: 'none' }}>
      <div
        style={{
          height: '100%',
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #D97706, #F59E0B, #FBBF24)',
          transition: progress === 100 ? 'width 0.15s ease, opacity 0.3s ease' : 'width 0.12s ease',
          opacity: progress === 100 ? 0 : 1,
          boxShadow: '0 0 8px rgba(217,119,6,0.6)',
          borderRadius: '0 2px 2px 0',
        }}
      />
    </div>
  );
};

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8F6F0' }}>
      {/* Global API loading bar */}
      <AdminLoadingBar />

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

