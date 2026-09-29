import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../../store/store';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { ShieldCheck, Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { ADMIN_CREDENTIALS } from '../../../utils/constants';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState(ADMIN_CREDENTIALS.email);
  const [password, setPassword] = useState(ADMIN_CREDENTIALS.password);
  const { adminLogin } = useStore();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = adminLogin(email, password);
    if (success) {
      navigate('/admin/dashboard');
    }
  };

  const handleQuickDemo = () => {
    setEmail(ADMIN_CREDENTIALS.email);
    setPassword(ADMIN_CREDENTIALS.password);
    adminLogin(ADMIN_CREDENTIALS.email, ADMIN_CREDENTIALS.password);
    navigate('/admin/dashboard');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#181511',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: '2.5rem',
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
            Authorized apiary management & fulfillment console
          </p>
        </div>

        {/* Demo Credentials Notice */}
        <div
          style={{
            backgroundColor: '#FFFBEB',
            border: '1px solid #FDE68A',
            borderRadius: '12px',
            padding: '0.85rem 1rem',
            marginBottom: '1.5rem',
            fontSize: '0.82rem',
            color: '#92400E',
          }}
        >
          <div><strong>Demo Admin Credentials:</strong></div>
          <div>User: <code>{ADMIN_CREDENTIALS.email}</code></div>
          <div>Pass: <code>{ADMIN_CREDENTIALS.password}</code></div>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Input
            label="Admin Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail size={16} />}
          />

          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock size={16} />}
          />

          <Button type="submit" size="lg" fullWidth rightIcon={<ArrowRight size={18} />}>
            Sign In to Admin
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="md"
            fullWidth
            onClick={handleQuickDemo}
          >
            1-Click Demo Login
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
    </div>
  );
};
