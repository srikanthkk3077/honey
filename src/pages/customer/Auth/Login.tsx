import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../../store/store';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { Lock, Mail, ArrowRight, ShieldCheck, Loader } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isAuthLoading } = useStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    const success = await login(email, password);
    if (success) {
      navigate('/orders');
    }
  };

  return (
    <div style={{ padding: 'clamp(2.5rem, 5vw, 5rem) 0 clamp(3rem, 6vw, 6rem) 0', backgroundColor: '#FAF7F2' }}>
      <div className="container" style={{ maxWidth: '460px' }}>
        <div
          className="auth-card"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: 'clamp(1.25rem, 4vw, 2.5rem)',
            border: '1px solid #E7E5E4',
            boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #FEF3C7, #F59E0B)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
              }}
            >
              <img src="/icons/bee.svg" alt="Madhuvan" width="30" height="30" />
            </div>
            <h2 style={{ fontSize: '1.75rem', color: '#1C1917', marginBottom: '0.25rem' }}>
              Welcome Back
            </h2>
            <p style={{ color: '#78716C', fontSize: '0.9rem' }}>
              Sign in to manage honey orders and tracking
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Input
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. sharma@gmail.com"
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
              {isAuthLoading ? 'Signing In…' : 'Sign In to Account'}
            </Button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: '#78716C' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#D97706', fontWeight: 700 }}>
              Create Account
            </Link>
          </div>

          <div style={{ borderTop: '1px solid #E7E5E4', marginTop: '1.5rem', paddingTop: '1.25rem', textAlign: 'center' }}>
            <Link
              to="/admin/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#B45309',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              <ShieldCheck size={16} /> Apiary Master / Staff Login
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
};
