import React, { useState } from 'react';
import { Send, CheckCircle2, Loader } from 'lucide-react';
import { Button } from '../../common/Button';
import { contactApi } from '../../../services/customerApi';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitting(true);
    try {
      await contactApi.subscribeNewsletter(email.trim());
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      style={{
        padding: '5rem 0',
        background: 'linear-gradient(135deg, #1C1917 0%, #292524 100%)',
        color: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <div
          style={{
            maxWidth: '680px',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '9999px',
              color: '#FBBF24',
              fontSize: '0.82rem',
              fontWeight: 600,
              marginBottom: '1.25rem',
            }}
          >
            🍯 Madhuvan Apiary Club
          </div>

          <h2
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 2.5rem)',
              color: '#FFFFFF',
              marginBottom: '1rem',
            }}
          >
            Get 10% Off Your First Harvest Jar
          </h2>

          <p
            style={{
              fontSize: '1.02rem',
              color: '#A8A29E',
              lineHeight: 1.6,
              marginBottom: '2rem',
            }}
          >
            Receive seasonal wildflower harvest notices, Ayurvedic recipes, and exclusive reserve batches before public release.
          </p>

          {submitted ? (
            <div
              style={{
                backgroundColor: 'rgba(5, 150, 105, 0.2)',
                border: '1px solid #059669',
                borderRadius: '16px',
                padding: '1.5rem',
                color: '#D1FAE5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
              }}
            >
              <CheckCircle2 size={24} color="#10B981" />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#FFFFFF' }}>You are on the reserve list!</div>
                <div style={{ fontSize: '0.88rem' }}>Use code <strong>MADHUVAN10</strong> at checkout for 10% off.</div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  flex: '1 1 240px',
                  minWidth: 0,
                  maxWidth: '100%',
                  padding: '0.85rem 1.25rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  color: '#FFFFFF',
                  fontSize: '0.95rem',
                  outline: 'none',
                }}
              />
              <Button type="submit" size="lg" rightIcon={<Send size={16} />} style={{ flex: '1 1 auto' }}>
                Claim 10% Off
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
