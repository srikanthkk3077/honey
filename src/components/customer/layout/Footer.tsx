import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Mail, Phone, MapPin, Award, CheckCircle } from 'lucide-react';
import { APP_NAME, BRAND_TAGLINE, CONTACT_INFO } from '../../../utils/constants';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        backgroundColor: '#181511',
        color: '#E7E5E4',
        paddingTop: '4rem',
        paddingBottom: '2rem',
        borderTop: '3px solid #D97706',
        marginTop: 'auto',
      }}
    >
      <div className="container">
        {/* Trust Badges Bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
            paddingBottom: '3rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '3.5rem',
          }}
        >
          <div className="flex items-center gap-3">
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B' }}>
              <ShieldCheck size={26} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.95rem' }}>100% Raw & Unheated</div>
              <div style={{ fontSize: '0.8rem', color: '#A8A29E' }}>Zero processing, live enzymes intact</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(5, 150, 105, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
              <Award size={26} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.95rem' }}>NMR Lab Tested</div>
              <div style={{ fontSize: '0.8rem', color: '#A8A29E' }}>Zero added sugar or C3/C4 corn syrup</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B' }}>
              <Heart size={26} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.95rem' }}>Ethical Bee Stewardship</div>
              <div style={{ fontSize: '0.8rem', color: '#A8A29E' }}>Bees keep 50% surplus nectar</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60A5FA' }}>
              <CheckCircle size={26} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.95rem' }}>Direct from Apiaries</div>
              <div style={{ fontSize: '0.8rem', color: '#A8A29E' }}>Fair trade with tribal Mowals</div>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem',
          }}
        >
          {/* Col 1: Brand Info */}
          <div>
            <div className="flex items-center gap-2" style={{ marginBottom: '1rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #FEF3C7, #F59E0B)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img src="/icons/bee.svg" alt="Madhuvan Honey" width="24" height="24" />
              </div>
              <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 800, fontSize: '1.35rem', color: '#FFFFFF' }}>
                MADHUVAN
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#A8A29E', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              {BRAND_TAGLINE}. We bring pristine wild nectar directly from native Indian forests and high-altitude Himalayan ranges into your home.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: '#D6D3D1' }}>
              <div className="flex items-center gap-2">
                <MapPin size={16} color="#F59E0B" />
                <span>Jim Corbett & Sunderbans Reserves, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} color="#F59E0B" />
                <span>{CONTACT_INFO.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} color="#F59E0B" />
                <span>{CONTACT_INFO.email}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Shop Varieties */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.05rem', marginBottom: '1.2rem', position: 'relative' }}>
              Pure Honey Collection
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem' }}>
              <li>
                <Link to="/shop?category=wild-forest-honey" style={{ color: '#A8A29E' }}>Sundarbans Wild Forest Honey</Link>
              </li>
              <li>
                <Link to="/shop?category=single-flora" style={{ color: '#A8A29E' }}>Kashmir White Acacia Honey</Link>
              </li>
              <li>
                <Link to="/shop?category=single-flora" style={{ color: '#A8A29E' }}>Organic Jamun Blossom Honey</Link>
              </li>
              <li>
                <Link to="/shop?category=ayurvedic-infused" style={{ color: '#A8A29E' }}>Vedic Holy Tulsi Infusion</Link>
              </li>
              <li>
                <Link to="/shop?category=honeycomb-gourmet" style={{ color: '#A8A29E' }}>100% Virgin Raw Honeycomb</Link>
              </li>
              <li>
                <Link to="/shop?category=honeycomb-gourmet" style={{ color: '#A8A29E' }}>Mustard Creamed Honey</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Company & Story */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.05rem', marginBottom: '1.2rem' }}>
              Know Your Honey
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem' }}>
              <li>
                <Link to="/story" style={{ color: '#A8A29E' }}>Meet the Tribal Mowals</Link>
              </li>
              <li>
                <Link to="/about" style={{ color: '#A8A29E' }}>How to Test Real Raw Honey</Link>
              </li>
              <li>
                <Link to="/about" style={{ color: '#A8A29E' }}>Ayurvedic Benefits of Raw Honey</Link>
              </li>
              <li>
                <Link to="/blog" style={{ color: '#A8A29E' }}>Healthy Honey Recipes</Link>
              </li>
              <li>
                <Link to="/orders" style={{ color: '#A8A29E' }}>Track Your Parcel</Link>
              </li>
              <li>
                <Link to="/contact" style={{ color: '#A8A29E' }}>Bulk & Corporate Gifting</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Admin & Certification */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.05rem', marginBottom: '1.2rem' }}>
              Madhuvan Assurance
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#A8A29E', marginBottom: '1rem', lineHeight: 1.5 }}>
              Batch test certificates available on request. Unpasteurized, never micro-filtered.
            </p>
            <div
              style={{
                padding: '1rem',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                marginBottom: '1rem',
              }}
            >
              <div style={{ fontSize: '0.78rem', color: '#F59E0B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                Portal Access
              </div>
              <div style={{ fontSize: '0.82rem', color: '#D6D3D1', marginBottom: '0.5rem' }}>
                Apiary managers & store administrators:
              </div>
              <Link
                to="/admin/login"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#FBBF24',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textDecoration: 'underline',
                }}
              >
                <ShieldCheck size={14} /> Open Admin Console
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div
          style={{
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.85rem',
            color: '#78716C',
          }}
        >
          <div>
            © {new Date().getFullYear()} {APP_NAME} Private Limited. All rights reserved. Sourced sustainably in India.
          </div>
          <div className="flex items-center gap-4">
            <Link to="/about" style={{ color: '#78716C' }}>Privacy Policy</Link>
            <span>•</span>
            <Link to="/about" style={{ color: '#78716C' }}>Terms of Service</Link>
            <span>•</span>
            <Link to="/admin/login" style={{ color: '#D97706', fontWeight: 600 }}>Staff Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
