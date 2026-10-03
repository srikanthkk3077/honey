import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Mail, Phone, MapPin, Leaf, Star, ArrowRight, Share2, MessageCircle, PlayCircle } from 'lucide-react';
import { APP_NAME, CONTACT_INFO } from '../../../utils/constants';
import { WhatsAppIcon } from '../../common/WhatsAppIcon';
import { getWhatsAppUrl } from '../../../utils/whatsapp';

const FooterLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <li>
    <Link
      to={to}
      style={{ color: '#A8A29E', fontSize: '0.88rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '5px', transition: 'color 0.18s' }}
      onMouseOver={e => (e.currentTarget.style.color = '#FCD34D')}
      onMouseOut={e => (e.currentTarget.style.color = '#A8A29E')}
    >
      <ArrowRight size={11} style={{ opacity: 0.5 }} />
      {children}
    </Link>
  </li>
);

export const Footer: React.FC = () => {
  return (
    <footer style={{ backgroundColor: '#0F0B07', color: '#E7E5E4', marginTop: 'auto', position: 'relative', overflow: 'hidden' }}>

      {/* Decorative honeycomb background */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.035,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpath d='M28 66L0 50V18L28 2l28 16v32L28 66zm0 6l28 16v-8L28 64 0 80v8l28-16z' fill='%23F59E0B'/%3E%3C/svg%3E")`,
        backgroundSize: '56px 100px',
      }} />

      {/* Amber top border */}
      <div style={{ height: '3px', background: 'linear-gradient(90deg, transparent 0%, #F59E0B 30%, #D97706 70%, transparent 100%)' }} />

      {/* Trust Strip */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(245,158,11,0.04)' }}>
        <div className="container" style={{ padding: '1.5rem 1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem' }}>
            {[
              { icon: <ShieldCheck size={20} />, label: '100% Raw & Unheated', sub: 'Zero processing, live enzymes intact', color: '#F59E0B' },
              { icon: <Heart size={20} />, label: 'Ethical Bee Stewardship', sub: 'Bees keep 50% surplus nectar', color: '#F59E0B' },
              { icon: <Star size={20} fill="#F59E0B" />, label: 'Direct from Apiaries', sub: 'Fair trade with tribal Mowals', color: '#F59E0B' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
                  background: `rgba(${item.color === '#10B981' ? '16,185,129' : '245,158,11'},0.12)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color,
                }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#FFF', fontSize: '0.88rem', lineHeight: 1.2 }}>{item.label}</div>
                  <div style={{ fontSize: '0.75rem', color: '#78716C', marginTop: '2px' }}>{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="container" style={{ padding: 'clamp(2.5rem,5vw,4rem) 1rem 2.5rem', position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(min(100%,260px),1.5fr) repeat(3, minmax(min(100%,140px),1fr))',
          gap: '3rem', marginBottom: '3rem',
        }}>

          {/* Col 1: Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.1rem' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '13px',
                background: 'linear-gradient(135deg, #FEF3C7, #F59E0B)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(245,158,11,0.35)',
              }}>
                <img src="/icons/bee.svg" alt="Bee" width="26" height="26" />
              </div>
              <div>
                <div style={{ fontWeight: 900, fontSize: '1.2rem', color: '#FFFFFF', letterSpacing: '0.08em', lineHeight: 1 }}>MADHUVAN</div>
                <div style={{ fontSize: '0.62rem', color: '#D97706', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Raw Forest Honey</div>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#78716C', lineHeight: 1.7, marginBottom: '1.5rem', maxWidth: '280px' }}>
              Pristine wild nectar from Jim Corbett & Sunderbans Reserves â€” cold-extracted, unpasteurised, direct to your doorstep.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.84rem' }}>
              <a href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, '')}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#A8A29E', textDecoration: 'none' }}
                onMouseOver={e => (e.currentTarget.style.color = '#FCD34D')}
                onMouseOut={e => (e.currentTarget.style.color = '#A8A29E')}
              >
                <Phone size={14} color="#F59E0B" />{CONTACT_INFO.phone}
              </a>
              <a href={getWhatsAppUrl(CONTACT_INFO.whatsapp, 'Hello Madhuvan Honey! I would like to inquire about your raw honey.')}
                target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#25D366', textDecoration: 'none', fontWeight: 600 }}
              >
                <WhatsAppIcon size={14} color="#25D366" />WhatsApp: {CONTACT_INFO.whatsapp}
              </a>
              <a href={`mailto:${CONTACT_INFO.email}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#A8A29E', textDecoration: 'none' }}
                onMouseOver={e => (e.currentTarget.style.color = '#FCD34D')}
                onMouseOut={e => (e.currentTarget.style.color = '#A8A29E')}
              >
                <Mail size={14} color="#F59E0B" />{CONTACT_INFO.email}
              </a>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#78716C', fontSize: '0.82rem' }}>
                <MapPin size={14} color="#F59E0B" />Jim Corbett & Sunderbans, India
              </div>
            </div>

            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem' }}>
              {[
                { icon: <Share2 size={16} />, href: '#', label: 'Instagram' },
                { icon: <MessageCircle size={16} />, href: '#', label: 'Facebook' },
                { icon: <PlayCircle size={16} />, href: '#', label: 'YouTube' },
              ].map(s => (
                <a key={s.label} href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer"
                  style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#A8A29E', textDecoration: 'none', transition: 'all 0.2s',
                  }}
                  onMouseOver={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(245,158,11,0.18)';
                    (e.currentTarget as HTMLElement).style.color = '#F59E0B';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,158,11,0.4)';
                  }}
                  onMouseOut={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
                    (e.currentTarget as HTMLElement).style.color = '#A8A29E';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)';
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Collection */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '0.85rem', fontWeight: 800, marginBottom: '1.25rem', letterSpacing: '0.08em', textTransform: 'uppercase', paddingBottom: '0.6rem', borderBottom: '2px solid rgba(245,158,11,0.22)' }}>
              Honey Collection
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <FooterLink to="/shop?category=wild-forest-honey">Sundarbans Wild Forest</FooterLink>
              <FooterLink to="/shop?category=single-flora">Kashmir White Acacia</FooterLink>
              <FooterLink to="/shop?category=single-flora">Organic Jamun Blossom</FooterLink>
              <FooterLink to="/shop?category=ayurvedic-infused">Vedic Holy Tulsi Infusion</FooterLink>
              <FooterLink to="/shop?category=honeycomb-gourmet">Virgin Raw Honeycomb</FooterLink>
              <FooterLink to="/shop?category=honeycomb-gourmet">Mustard Creamed Honey</FooterLink>
            </ul>
          </div>

          {/* Col 3: Know Your Honey */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '0.85rem', fontWeight: 800, marginBottom: '1.25rem', letterSpacing: '0.08em', textTransform: 'uppercase', paddingBottom: '0.6rem', borderBottom: '2px solid rgba(245,158,11,0.22)' }}>
              Know Your Honey
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <FooterLink to="/story">Meet the Tribal Mowals</FooterLink>
              <FooterLink to="/about">How to Test Raw Honey</FooterLink>
              <FooterLink to="/about">Ayurvedic Benefits</FooterLink>
              <FooterLink to="/blog">Healthy Honey Recipes</FooterLink>
              <FooterLink to="/orders">Track Your Parcel</FooterLink>
              <FooterLink to="/contact">Bulk & Corporate Gifting</FooterLink>
            </ul>
          </div>

          {/* Col 4: Our Promise */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '0.85rem', fontWeight: 800, marginBottom: '1.25rem', letterSpacing: '0.08em', textTransform: 'uppercase', paddingBottom: '0.6rem', borderBottom: '2px solid rgba(245,158,11,0.22)' }}>
              Our Promise
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {[
                { e: 'ðŸ§ª', t: 'Batch NMR test reports on request' },
                { e: 'â„ï¸', t: 'Cold-extracted, never heated' },
                { e: 'ðŸ', t: 'Bee-friendly harvesting only' },
                { e: 'ðŸ“¦', t: 'Ships in 48 hrs, glass-packed' },
                { e: 'ðŸŒ¿', t: 'No preservatives or additives' },
              ].map(item => (
                <div key={item.e} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ fontSize: '0.95rem', flexShrink: 0 }}>{item.e}</span>
                  <span style={{ fontSize: '0.82rem', color: '#78716C', lineHeight: 1.5 }}>{item.t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          paddingTop: '1.75rem', borderTop: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center',
          justifyContent: 'space-between', gap: '1rem',
        }}>
          <div style={{ fontSize: '0.8rem', color: '#57534E' }}>
            Â© {new Date().getFullYear()} <strong style={{ color: '#78716C' }}>{APP_NAME} Private Limited</strong>. All rights reserved. Sustainably sourced in India. ðŸ¯
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Privacy Policy', to: '/about' },
              { label: 'Terms of Service', to: '/about' },
              { label: 'Refund Policy', to: '/about' },
            ].map(link => (
              <Link key={link.label} to={link.to}
                style={{ color: '#57534E', fontSize: '0.8rem', textDecoration: 'none', transition: 'color 0.18s' }}
                onMouseOver={e => (e.currentTarget.style.color = '#A8A29E')}
                onMouseOut={e => (e.currentTarget.style.color = '#57534E')}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/admin/login"
              style={{
                color: '#D97706', fontWeight: 700, fontSize: '0.8rem', textDecoration: 'none',
                background: 'rgba(217,119,6,0.1)', padding: '4px 10px', borderRadius: '6px',
                border: '1px solid rgba(217,119,6,0.25)', transition: 'all 0.18s',
              }}
              onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(217,119,6,0.2)'; }}
              onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(217,119,6,0.1)'; }}
            >
              Staff Portal
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
};
