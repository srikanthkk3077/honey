import React, { useState } from 'react';
import { SectionTitle } from '../../../components/common/SectionTitle';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Loader } from 'lucide-react';
import { CONTACT_INFO } from '../../../utils/constants';
import { contactApi } from '../../../services/customerApi';
import { useStore } from '../../../store/store';
import { WhatsAppIcon } from '../../../components/common/WhatsAppIcon';
import { getWhatsAppUrl } from '../../../utils/whatsapp';

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

                <div className="flex items-start gap-3">
                  <Phone size={20} color="#F59E0B" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>Phone / WhatsApp</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
                      <a
                        href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, '')}`}
                        style={{ color: '#D6D3D1', fontSize: '0.9rem', textDecoration: 'none' }}
                        title="Click to call"
                      >
                        {CONTACT_INFO.phone}
                      </a>
                      <a
                        href={getWhatsAppUrl(
                          CONTACT_INFO.whatsapp,
                          'Hello Madhuvan Honey! I am contacting you regarding your pure raw forest honey.'
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          backgroundColor: '#25D366',
                          color: '#FFFFFF',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          textDecoration: 'none',
                          boxShadow: '0 2px 8px rgba(37, 211, 102, 0.35)',
                          transition: 'transform 0.15s ease, filter 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.filter = 'brightness(1.1)';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.filter = 'brightness(1)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <WhatsAppIcon size={14} color="#FFFFFF" />
                        <span>Chat on WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail size={20} color="#F59E0B" style={{ flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 700, color: '#FFFFFF' }}>Direct Email</div>
                    <a
                      href={`mailto:${CONTACT_INFO.email}`}
                      style={{ color: '#A8A29E', fontSize: '0.85rem', wordBreak: 'break-all', textDecoration: 'none' }}
                    >
                      {CONTACT_INFO.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick WhatsApp helper card - Interactive link to WhatsApp */}
            <a
              href={getWhatsAppUrl(
                CONTACT_INFO.whatsapp,
                'Hello Master Beekeeper at Madhuvan Honey! 🍯 I would like advice on selecting raw forest honey.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-contact-cta"
              style={{
                backgroundColor: '#ECFDF5',
                padding: '1.25rem 1.5rem',
                borderRadius: '18px',
                border: '1.5px solid #A7F3D0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.12)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 211, 102, 0.25)';
                e.currentTarget.style.borderColor = '#25D366';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(16, 185, 129, 0.12)';
                e.currentTarget.style.borderColor = '#A7F3D0';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: '#25D366',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(37, 211, 102, 0.35)',
                  }}
                >
                  <WhatsAppIcon size={26} color="#FFFFFF" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#065F46', fontSize: '0.96rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>Need Immediate Honey Advice?</span>
                    <span style={{ fontSize: '0.7rem', backgroundColor: '#D1FAE5', color: '#047857', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                      Live
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#047857', marginTop: '2px' }}>
                    Our master beekeeper is available on WhatsApp Mon - Sat, 9am - 7pm IST.
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#25D366',
                  color: '#FFFFFF',
                  padding: '8px 14px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 2px 8px rgba(37, 211, 102, 0.3)',
                  flexShrink: 0,
                }}
              >
                <WhatsAppIcon size={16} color="#FFFFFF" />
                <span>Chat Now ↗</span>
              </div>
            </a>
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
                <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid #E7E5E4' }}>
                  <a
                    href={getWhatsAppUrl(CONTACT_INFO.whatsapp, 'Hello Madhuvan Honey! I just submitted an inquiry on your website and would love to connect on WhatsApp.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '12px',
                      backgroundColor: '#25D366',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      textDecoration: 'none',
                      boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
                    }}
                  >
                    <WhatsAppIcon size={18} color="#FFFFFF" />
                    <span>Follow Up on WhatsApp Now</span>
                  </a>
                </div>
                <Button size="md" style={{ marginTop: '1rem', width: '100%' }} variant="outline" onClick={() => setSubmitted(false)}>
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

                {/* Direct WhatsApp Alternative Button */}
                <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0.75rem 0' }}>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#E7E5E4' }} />
                    <span style={{ fontSize: '0.78rem', color: '#A8A29E', fontWeight: 600, textTransform: 'uppercase' }}>or quick reply</span>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#E7E5E4' }} />
                  </div>

                  <a
                    href={getWhatsAppUrl(
                      CONTACT_INFO.whatsapp,
                      form.message
                        ? `Hi Madhuvan Honey! My name is ${form.name || 'a customer'}. I have a query: ${form.message}`
                        : 'Hi Madhuvan Honey! I would like to chat about your pure raw honey products.'
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '0.75rem 1rem',
                      borderRadius: '12px',
                      backgroundColor: '#F0FDF4',
                      border: '1.5px solid #86EFAC',
                      color: '#15803D',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      width: '100%',
                      boxSizing: 'border-box',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#25D366';
                      e.currentTarget.style.borderColor = '#25D366';
                      e.currentTarget.style.color = '#FFFFFF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#F0FDF4';
                      e.currentTarget.style.borderColor = '#86EFAC';
                      e.currentTarget.style.color = '#15803D';
                    }}
                  >
                    <WhatsAppIcon size={20} color="currentColor" />
                    <span>Instant Chat on WhatsApp (+91 7780514383)</span>
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
