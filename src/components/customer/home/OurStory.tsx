import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, HeartHandshake, TreePine } from 'lucide-react';
import { Button } from '../../common/Button';

export const OurStory: React.FC = () => {
  return (
    <section style={{ padding: '6rem 0', backgroundColor: '#FFFFFF' }}>
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            alignItems: 'center',
            gap: '3rem',
          }}
        >
          {/* Images Grid */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                border: '4px solid #FFFFFF',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80"
                alt="Beekeeper holding wooden honeycomb frame"
                style={{ width: '100%', height: '340px', objectFit: 'cover' }}
              />
            </div>

            {/* Small floating badge */}
            <div
              style={{
                position: 'absolute',
                bottom: '-15px',
                right: '15px',
                background: '#181511',
                color: '#FFFFFF',
                borderRadius: '16px',
                padding: '1rem',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                maxWidth: '220px',
                border: '1px solid rgba(245, 158, 11, 0.4)',
              }}
            >
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FBBF24', fontFamily: 'var(--font-serif)' }}>
                100%
              </div>
              <div style={{ fontSize: '0.8rem', color: '#E7E5E4' }}>
                Ethical forest harvesting with indigenous Mowal communities.
              </div>
            </div>
          </div>

          {/* Text Story */}
          <div>
            <span
              style={{
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#D97706',
                display: 'block',
                marginBottom: '0.5rem',
              }}
            >
              Our Roots & Mission
            </span>

            <h2
              style={{
                fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                lineHeight: 1.2,
                color: '#1C1917',
                marginBottom: '1.5rem',
              }}
            >
              Protecting the Bees. Restoring Living Food.
            </h2>

            <p style={{ fontSize: '1.02rem', color: '#57534E', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              Madhuvan was born out of a simple realization: real honey should not be pasteurized into a sugary syrup. It should be an aromatic elixir carrying the wild medicinal vitality of native flora.
            </p>

            <p style={{ fontSize: '0.95rem', color: '#78716C', lineHeight: 1.7, marginBottom: '2rem' }}>
              We work directly with traditional tribal forest harvesters and nomadic Himalayan beekeepers. We pay over 40% above market rates to ensure that forest trees remain standing, wild hives flourish without smoke harm, and you receive uncompromised golden nectar.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
              <div className="flex items-center gap-3">
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <TreePine size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1C1917' }}>Zero Pesticides</div>
                  <div style={{ fontSize: '0.78rem', color: '#78716C' }}>Deep forest forage</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <HeartHandshake size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1C1917' }}>Fair Trade</div>
                  <div style={{ fontSize: '0.78rem', color: '#78716C' }}>Empowering tribal Mowals</div>
                </div>
              </div>
            </div>

            <Link to="/story">
              <Button size="md" rightIcon={<ArrowRight size={18} />}>
                Read Our Complete Story
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
