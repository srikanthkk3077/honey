import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../../store/store';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { Lock, Mail, User, Phone, ArrowRight } from 'lucide-react';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      register(name, email, phone, password);
      navigate('/');
    }
  };

  return (
    <div style={{ padding: '5rem 0 6rem 0', backgroundColor: '#FAF7F2' }}>
      <div className="container" style={{ maxWidth: '460px' }}>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '2.5rem',
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
              Create Account
            </h2>
            <p style={{ color: '#78716C', fontSize: '0.9rem' }}>
              Join the Madhuvan Organic Honey family
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Input
              label="Full Name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ananya Sen"
              leftIcon={<User size={16} />}
            />

            <Input
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ananya@example.com"
              leftIcon={<Mail size={16} />}
            />

            <Input
              label="Phone Number"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              leftIcon={<Phone size={16} />}
            />

            <Input
              label="Create Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              leftIcon={<Lock size={16} />}
            />

            <Button type="submit" size="lg" fullWidth rightIcon={<ArrowRight size={18} />}>
              Create My Account
            </Button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: '#78716C' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#D97706', fontWeight: 700 }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
