import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../../store/store';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { ShieldCheck, Lock, Mail, ArrowRight, ArrowLeft, Loader } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { adminLogin, isAuthLoading } = useStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    const success = await adminLogin(email, password);
    if (success) {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#181511',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem clamp(0.75rem, 3vw, 1.5rem)',
      }}
    >
      <div
        className="admin-login-card"
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: 'clamp(1.25rem, 4vw, 2.5rem)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #FEF3C7, #F59E0B)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
              boxShadow: '0 8px 20px rgba(245, 158, 11, 0.3)',
            }}
          >
            <ShieldCheck size={32} color="#78350F" />
          </div>
          <h2 style={{ fontSize: '1.65rem', color: '#1C1917', margin: '0 0 0.25rem 0' }}>
            Apiary Admin Portal
          </h2>
          <p style={{ color: '#78716C', fontSize: '0.88rem' }}>
            Authorized apiary management &amp; fulfillment console
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Input
            label="Admin Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@madhuvanhoney.com"
            leftIcon={<Mail size={16} />}
          />

          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            leftIcon={<Lock size={16} />}
          />

          <Button
            type="submit"
            size="lg"
            fullWidth
            rightIcon={isAuthLoading ? <Loader size={18} className="spin" /> : <ArrowRight size={18} />}
            disabled={isAuthLoading}
          >
            {isAuthLoading ? 'Signing In…' : 'Sign In to Admin'}
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', borderTop: '1px solid #E7E5E4', paddingTop: '1.25rem' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#78716C',
              fontSize: '0.85rem',
            }}
          >
            <ArrowLeft size={14} /> Return to Public Storefront
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
};
