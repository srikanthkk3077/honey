import React, { useState } from 'react';
import { SectionTitle } from '../../../components/common/SectionTitle';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Loader } from 'lucide-react';
import { CONTACT_INFO } from '../../../utils/constants';
import { contactApi } from '../../../services/customerApi';
import { useStore } from '../../../store/store';

export const Contact: React.FC = () => {
  const { showToast } = useStore();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Question',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await contactApi.submit(form);
      setSubmitted(true);
    } catch {
      showToast('Message could not be sent. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: 'clamp(2rem, 4vw, 3.5rem) 0 5rem 0', backgroundColor: '#FAF7F2' }}>
      <div className="container">
        <SectionTitle
          subtitle="Get in Touch"
          title="Connect with Madhuvan Apiaries"
          description="Have questions about raw honey crystallization, bulk corporate gifting, or ethical harvesting? We would love to chat."
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: 'clamp(1.5rem, 3vw, 3rem)',
            alignItems: 'start',
          }}
        >
          {/* Info Side */}
          <div>
            <div
              className="contact-info-card"
              style={{
                backgroundColor: '#181511',
                color: '#FFFFFF',
                padding: 'clamp(1.25rem, 3.5vw, 2.5rem)',
                borderRadius: '24px',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                marginBottom: '1.5rem',
              }}
            >
              <h3 style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.4rem)', color: '#FFFFFF', marginBottom: '1.25rem' }}>
                Apiary Headquarters & Honey House
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.95rem' }}>
                <div className="flex items-start gap-3">
                  <MapPin size={20} color="#F59E0B" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 700, color: '#FFFFFF' }}>Madhuvan Reserve Apiary</div>
                    <div style={{ color: '#A8A29E', fontSize: '0.85rem', wordBreak: 'break-word' }}>{CONTACT_INFO.address}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone size={20} color="#F59E0B" style={{ flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 700, color: '#FFFFFF' }}>Phone / WhatsApp</div>
                    <div style={{ color: '#A8A29E', fontSize: '0.85rem' }}>{CONTACT_INFO.phone}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail size={20} color="#F59E0B" style={{ flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 700, color: '#FFFFFF' }}>Direct Email</div>
                    <div style={{ color: '#A8A29E', fontSize: '0.85rem', wordBreak: 'break-all' }}>{CONTACT_INFO.email}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick WhatsApp helper card */}
            <div style={{ backgroundColor: '#ECFDF5', padding: '1.25rem', borderRadius: '18px', border: '1px solid #A7F3D0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#059669', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MessageSquare size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#065F46', fontSize: '0.95rem' }}>Need Immediate Honey Advice?</div>
                <div style={{ fontSize: '0.82rem', color: '#047857' }}>Our master beekeeper is available on WhatsApp Mon - Sat, 9am - 7pm IST.</div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div
            className="contact-form-card"
            style={{
              backgroundColor: '#FFFFFF',
              padding: 'clamp(1.25rem, 3.5vw, 2.5rem)',
              borderRadius: '24px',
              border: '1px solid #E7E5E4',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            }}
          >
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <CheckCircle2 size={48} color="#059669" style={{ margin: '0 auto 1rem auto' }} />
                <h3 style={{ fontSize: '1.4rem', color: '#1C1917', marginBottom: '0.5rem' }}>Message Dispatched!</h3>
                <p style={{ color: '#57534E', lineHeight: 1.6 }}>
                  Thank you for reaching out. An apiary representative will review your message and reply via email within 24 hours.
                </p>
                <Button size="md" style={{ marginTop: '1.5rem' }} onClick={() => setSubmitted(false)}>
                  Send Another Inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h3 style={{ fontSize: '1.25rem', color: '#1C1917', margin: 0 }}>Send a Message</h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '1rem' }}>
                  <Input
                    label="Full Name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Siddharth Rao"
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 7780514383"
                  />
                </div>

                <Input
                  label="Email Address"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="siddharth@example.com"
                />

                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#44403C', marginBottom: '0.35rem' }}>
                    Reason for Contact
                  </label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '0.65rem 0.95rem', borderRadius: '10px', border: '1px solid #D6D3D1', outline: 'none', background: '#FFFFFF' }}
                  >
                    <option value="General Question">General Product Question</option>
                    <option value="Bulk Order">Bulk / Corporate Gifting (20+ Jars)</option>
                    {/* <option value="Batch Lab Report">Request Batch NMR Report</option> */}
                    <option value="Apiary Visit">Apiary Educational Tour</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#44403C', marginBottom: '0.35rem' }}>
                    Message Details
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="How can we assist you with our raw honey harvests?"
                    style={{ width: '100%', boxSizing: 'border-box', padding: '0.65rem 0.95rem', borderRadius: '10px', border: '1px solid #D6D3D1', outline: 'none', fontFamily: 'inherit' }}
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  rightIcon={isSubmitting ? <Loader size={16} className="spin" /> : <Send size={16} />}
                  disabled={isSubmitting}
                  style={{ width: '100%' }}
                >
                  {isSubmitting ? 'Sending…' : 'Send Inquiry to Apiary'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
