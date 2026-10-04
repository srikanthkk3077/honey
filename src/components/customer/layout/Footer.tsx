import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Phone, Mail, MapPin } from 'lucide-react';
import { APP_NAME, CONTACT_INFO, SOCIAL_LINKS } from '../../../utils/constants';
import { getWhatsAppUrl } from '../../../utils/whatsapp';

/* ── tiny X/Twitter SVG since lucide doesn't ship it ── */
const XIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

/* ── WhatsApp SVG ── */
const WAIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.301-.15-1.782-.879-2.058-.98-.276-.1-.477-.15-.678.15-.201.3-.778.98-.954 1.18-.176.2-.352.226-.653.075-.301-.15-1.272-.469-2.423-1.496-.895-.798-1.5-1.784-1.676-2.085-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.201-.3.301-.501.101-.201.05-.377-.025-.527-.075-.151-.678-1.633-.929-2.234-.244-.585-.493-.506-.678-.515-.176-.008-.377-.01-.578-.01-.201 0-.527.075-.803.376-.276.301-1.054 1.03-1.054 2.511s1.079 2.911 1.23 3.112c.15.2 2.124 3.243 5.146 4.548.719.311 1.28.497 1.718.636.722.23 1.378.197 1.898.12.579-.087 1.782-.728 2.033-1.431.251-.703.251-1.305.176-1.431-.076-.126-.276-.201-.577-.351zm-5.467 7.428h-.005c-1.815 0-3.595-.488-5.152-1.412l-.37-.22-3.83 1.004 1.022-3.733-.241-.384c-1.016-1.617-1.554-3.487-1.554-5.405 0-5.617 4.57-10.187 10.191-10.187 2.722 0 5.281 1.06 7.206 2.986 1.924 1.926 2.983 4.486 2.982 7.21 0 5.619-4.57 10.19-10.189 10.19zm8.675-18.865c-2.318-2.321-5.4-3.598-8.68-3.598-6.764 0-12.267 5.503-12.267 12.269 0 2.163.565 4.27 1.637 6.129l-1.74 6.357 6.505-1.706c1.796.979 3.817 1.496 5.865 1.497h.005c6.764 0 12.268-5.504 12.268-12.27 0-3.279-1.277-6.358-3.593-8.678z" />
  </svg>
);

/* ── simple modal for policies ── */
type PolicyKey = 'privacy' | 'terms' | 'refund' | 'shipping';
const POLICIES: Record<PolicyKey, { title: string; body: string }> = {
  privacy: {
    title: 'Privacy Policy',
    body: 'We collect only the information needed to process and deliver your order — name, shipping address, phone, and email. Your data is never sold or shared with third-party marketers. All payments are protected by 256-bit SSL encryption. To request data deletion write to ' + CONTACT_INFO.email + '.',
  },
  terms: {
    title: 'Terms of Service',
    body: 'By purchasing from Madhuvan Honey you acknowledge that raw unheated honey naturally crystallises over time — this is a sign of purity, not spoilage. All prices are in INR inclusive of applicable GST. We reserve the right to update product availability without prior notice.',
  },
  refund: {
    title: 'Refund & Returns',
    body: 'We guarantee every jar. If your delivery arrives damaged, share a photo via WhatsApp (' + CONTACT_INFO.whatsapp + ') within 48 hours for a free replacement or full refund. Opened jars cannot be physically returned per FSSAI food-safety norms, but quality concerns are always resolved.',
  },
  shipping: {
    title: 'Shipping Policy',
    body: 'Orders placed before 2 PM IST are dispatched within 24–48 hours. Estimated delivery: Metro — 2–4 days; Rest of India — 4–6 days. Free shipping on orders above ₹999. A live tracking link is sent by SMS & WhatsApp once your parcel is scanned.',
  },
};

export const Footer: React.FC = () => {
  const [policy, setPolicy] = useState<PolicyKey | null>(null);
  const info = policy ? POLICIES[policy] : null;

  return (
    <>
      {/* ════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════ */}
      <footer style={{
        background: '#FBF6EC',
        borderTop: '1px solid #EDE3CE',
        fontFamily: 'inherit',
      }}>

        {/* ── top golden divider line ── */}
        <div style={{
          height: '3px',
          background: 'linear-gradient(90deg, transparent, #D97706 30%, #F59E0B 50%, #D97706 70%, transparent)',
        }} />

        {/* ── main content ── */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '3.5rem 1.5rem 2.5rem',
          display: 'grid',
          gridTemplateColumns: '1.6fr 1fr 1fr 1fr',
          gap: '2.5rem',
        }}
          className="footer-main-grid"
        >

          {/* COL 1 — Brand */}
          <div>
            {/* Logo wordmark */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #FEF3C7, #F59E0B)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 3px 10px rgba(217,119,6,0.3)',
                flexShrink: 0,
              }}>
                <img src="/icons/bee.svg" alt="bee" width="22" height="22" />
              </div>
              <div>
                <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#1C1917', letterSpacing: '0.06em' }}>
                  MADHUVAN
                </div>
                <div style={{ fontSize: '0.6rem', color: '#D97706', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                  Raw Honey
                </div>
              </div>
            </div>

            <p style={{
              fontSize: '0.84rem', color: '#78716C', lineHeight: 1.7,
              marginBottom: '1.4rem', maxWidth: '260px',
            }}>
              Pure, unheated nectar harvested by tribal Mowals from the forests of Jim Corbett &amp; Sunderbans.
            </p>

            {/* Contact micro-list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', marginBottom: '1.4rem' }}>
              <a href={`tel:${CONTACT_INFO.phone.replace(/\s+/g,'')}`}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#57534E', fontSize: '0.83rem', textDecoration: 'none' }}>
                <Phone size={13} color="#D97706" />
                {CONTACT_INFO.phone}
              </a>
              <a href={`mailto:${CONTACT_INFO.email}`}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#57534E', fontSize: '0.83rem', textDecoration: 'none' }}>
                <Mail size={13} color="#D97706" />
                {CONTACT_INFO.email}
              </a>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#78716C', fontSize: '0.82rem' }}>
                <MapPin size={13} color="#D97706" />
                Jim Corbett &amp; Sunderbans, India
              </div>
            </div>

            {/* Social row */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { href: SOCIAL_LINKS.instagram, label: 'Instagram', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg> },
                { href: getWhatsAppUrl(CONTACT_INFO.whatsapp, 'Hello Madhuvan Honey!'), label: 'WhatsApp', icon: <WAIcon /> },
                { href: SOCIAL_LINKS.youtube,   label: 'YouTube',   icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor"/></svg> },
                { href: SOCIAL_LINKS.twitter,   label: 'X',         icon: <XIcon /> },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{
                    width: '34px', height: '34px', borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: '#FFF7E6',
                    border: '1px solid #EDE3CE',
                    color: '#A8956A',
                    textDecoration: 'none',
                    transition: 'all 0.18s',
                  }}
                  onMouseOver={e => {
                    (e.currentTarget as HTMLElement).style.background = '#F59E0B';
                    (e.currentTarget as HTMLElement).style.color = '#fff';
                    (e.currentTarget as HTMLElement).style.borderColor = '#F59E0B';
                  }}
                  onMouseOut={e => {
                    (e.currentTarget as HTMLElement).style.background = '#FFF7E6';
                    (e.currentTarget as HTMLElement).style.color = '#A8956A';
                    (e.currentTarget as HTMLElement).style.borderColor = '#EDE3CE';
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* COL 2 — Shop */}
          <NavCol title="Shop">
            <NavItem to="/shop">All Honeys</NavItem>
            <NavItem to="/shop?category=wild-forest-honey">Ajwain Honey</NavItem>
            <NavItem to="/shop?category=single-flora">Tulasi Honey</NavItem>
            <NavItem to="/shop?category=ayurvedic-infused">Sunflower Honey</NavItem>
            <NavItem to="/shop?category=honeycomb-gourmet">Multifloral Honey</NavItem>
          </NavCol>

          {/* COL 3 — Company */}
          <NavCol title="Company">
            <NavItem to="/about">About Purity</NavItem>
            <NavItem to="/story">Our Story</NavItem>
            <NavItem to="/blog">Journal</NavItem>
            <NavItem to="/videos">Apiary Videos</NavItem>
            <NavItem to="/contact">Contact Us</NavItem>
          </NavCol>

          {/* COL 4 — Support */}
          <NavCol title="Support">
            <NavItem to="/track-order">Track Order</NavItem>
            <NavItem to="/orders">My Orders</NavItem>
            <PolicyBtn onClick={() => setPolicy('shipping')}>Shipping Info</PolicyBtn>
            <PolicyBtn onClick={() => setPolicy('refund')}>Refund Policy</PolicyBtn>
            <PolicyBtn onClick={() => setPolicy('privacy')}>Privacy Policy</PolicyBtn>
          </NavCol>

        </div>

        {/* ── bottom bar ── */}
        <div style={{ borderTop: '1px solid #EDE3CE' }}>
          <div style={{
            maxWidth: '1200px', margin: '0 auto',
            padding: '1.1rem 1.5rem',
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', flexWrap: 'wrap',
            gap: '0.75rem',
          }}>
            <span style={{ fontSize: '0.78rem', color: '#A8A29E' }}>
              © {new Date().getFullYear()} <strong style={{ color: '#78716C' }}>{APP_NAME}</strong>. All rights reserved.
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
              {(['privacy', 'terms', 'refund', 'shipping'] as PolicyKey[]).map(k => (
                <button key={k} type="button"
                  onClick={() => setPolicy(k)}
                  style={{
                    background: 'none', border: 'none', padding: 0,
                    fontSize: '0.78rem', color: '#A8A29E', cursor: 'pointer',
                    transition: 'color 0.15s',
                  }}
                  onMouseOver={e => (e.currentTarget.style.color = '#D97706')}
                  onMouseOut={e => (e.currentTarget.style.color = '#A8A29E')}
                >
                  {POLICIES[k].title}
                </button>
              ))}
              <Link to="/admin/login" style={{
                fontSize: '0.78rem', color: '#D97706', fontWeight: 700,
                textDecoration: 'none', padding: '3px 9px',
                background: 'rgba(217,119,6,0.08)',
                border: '1px solid rgba(217,119,6,0.22)',
                borderRadius: '6px', transition: 'background 0.15s',
              }}>
                Staff
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Policy Modal ── */}
      {info && (
        <div
          onClick={() => setPolicy(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(15, 10, 5, 0.55)',
            backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1.25rem',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#FFFFFF', borderRadius: '18px',
              maxWidth: '520px', width: '100%',
              padding: '2rem', position: 'relative',
              boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
              border: '1px solid #F0E8D8',
            }}
          >
            {/* amber top accent */}
            <div style={{
              position: 'absolute', top: 0, left: '2rem', right: '2rem',
              height: '3px', borderRadius: '0 0 3px 3px',
              background: 'linear-gradient(90deg, #F59E0B, #D97706)',
            }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1C1917', margin: 0 }}>
                {info.title}
              </h3>
              <button
                onClick={() => setPolicy(null)}
                style={{
                  background: '#F5F5F4', border: 'none', borderRadius: '50%',
                  width: '32px', height: '32px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#6B7280',
                }}
              >
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: '0.9rem', color: '#57534E', lineHeight: 1.7, margin: 0 }}>
              {info.body}
            </p>

            <button
              onClick={() => setPolicy(null)}
              style={{
                marginTop: '1.5rem', float: 'right',
                background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                color: '#fff', border: 'none', borderRadius: '10px',
                padding: '8px 20px', fontWeight: 700, fontSize: '0.875rem',
                cursor: 'pointer', boxShadow: '0 3px 10px rgba(217,119,6,0.3)',
              }}
            >
              Got It
            </button>
          </div>
        </div>
      )}

      {/* responsive grid override */}
      <style>{`
        @media (max-width: 900px) {
          .footer-main-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 540px) {
          .footer-main-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
};

/* ── small helper components ── */
const NavCol: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h4 style={{
      fontSize: '0.72rem', fontWeight: 800, color: '#B45309',
      textTransform: 'uppercase', letterSpacing: '0.14em',
      marginBottom: '1.1rem',
    }}>
      {title}
    </h4>
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
      {children}
    </ul>
  </div>
);

const NavItem: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <li>
    <Link
      to={to}
      style={{ fontSize: '0.86rem', color: '#57534E', textDecoration: 'none', transition: 'color 0.15s' }}
      onMouseOver={e => (e.currentTarget.style.color = '#D97706')}
      onMouseOut={e => (e.currentTarget.style.color = '#57534E')}
    >
      {children}
    </Link>
  </li>
);

const PolicyBtn: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <li>
    <button
      type="button"
      onClick={onClick}
      style={{
        background: 'none', border: 'none', padding: 0, cursor: 'pointer',
        fontSize: '0.86rem', color: '#57534E', textAlign: 'left',
        font: 'inherit', transition: 'color 0.15s',
      }}
      onMouseOver={e => (e.currentTarget.style.color = '#D97706')}
      onMouseOut={e => (e.currentTarget.style.color = '#57534E')}
    >
      {children}
    </button>
  </li>
);
