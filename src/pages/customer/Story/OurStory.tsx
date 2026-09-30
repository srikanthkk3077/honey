import React from 'react';
import { SectionTitle } from '../../../components/common/SectionTitle';
import { TreePine, Heart, Users, ShieldCheck, Sun } from 'lucide-react';

export const OurStory: React.FC = () => {
  return (
    <div style={{ padding: '3.5rem 0 6rem 0', backgroundColor: '#FAF7F2' }}>
      <div className="container">
        {/* Story Intro */}
        <div style={{ maxWidth: '800px', margin: '0 auto 4rem auto', textAlign: 'center' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            The Legend of Madhuvan
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', color: '#1C1917', margin: '8px 0 1rem 0' }}>
            Where Wild Nectar Meets Timeless Stewardship
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#57534E', lineHeight: 1.7 }}>
            In ancient Vedic tradition, <em>Madhuvan</em> was the mythical sanctuary forest dripping with sweet blossom nectar. Today, Madhuvan is our pledge to defend India's wild pollinator ecosystems and restore honest, living food.
          </p>
        </div>

        {/* Feature Image Banner */}
        <div
          className="story-banner-card"
          style={{
            borderRadius: '28px',
            overflow: 'hidden',
            boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
            marginBottom: '4rem',
            position: 'relative',
            maxHeight: '440px',
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=1400&q=80"
            alt="Apiary hives surrounded by mountains and wildflowers"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            className="story-banner-overlay"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(24, 21, 17, 0.75) 0%, transparent 60%)',
              display: 'flex',
              alignItems: 'flex-end',
              padding: '2.5rem',
            }}
          >
            <div style={{ color: '#FFFFFF' }}>
              <div style={{ fontSize: 'clamp(1.15rem, 3vw, 1.4rem)', fontWeight: 800, fontFamily: 'var(--font-serif)' }}>
                Protected Wild Flora Biomes
              </div>
              <p style={{ margin: '4px 0 0 0', color: '#E7E5E4', fontSize: '0.9rem' }}>
                Himalayan pine valleys, Uttarakhand foothills, and pristine mangrove reserves.
              </p>
            </div>
          </div>
        </div>

        {/* Narrative Sections */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '3rem', marginBottom: '4rem' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', color: '#1C1917', marginBottom: '1rem' }}>
              The Courage of the Mowals
            </h2>
            <p style={{ color: '#57534E', lineHeight: 1.7, marginBottom: '1rem', fontSize: '0.95rem' }}>
              Every spring, the indigenous honey hunters (Mowals) of Bengal navigate tidal mangrove rivers to forage wild Apis dorsata honey. This ancient trade requires deep forest reverence and instinct.
            </p>
            <p style={{ color: '#57534E', lineHeight: 1.7, fontSize: '0.95rem' }}>
              Historically, middlemen paid Mowals meager prices while blending their pure wild nectar with cheap corn syrup. Madhuvan eliminated all intermediaries, paying collectors directly and providing safety gear and colony preservation training.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: '1.75rem', color: '#1C1917', marginBottom: '1rem' }}>
              Nomadic Himalayan Beekeepers
            </h2>
            <p style={{ color: '#57534E', lineHeight: 1.7, marginBottom: '1rem', fontSize: '0.95rem' }}>
              Across Kashmir and Himachal, our partner beekeepers migrate with their bee colonies following nature’s flower calendar. In May they follow Black Locust acacia blooms; in July, high-altitude wildflower meadows.
            </p>
            <p style={{ color: '#57534E', lineHeight: 1.7, fontSize: '0.95rem' }}>
              By following seasonal migrations without artificial sugar-feeding, our bees produce the authentic single-flora honey varieties that connoisseurs and herbalists cherish.
            </p>
          </div>
        </div>

        {/* Impact numbers */}
        <div
          className="story-impact-grid"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '3rem',
            border: '1px solid #E7E5E4',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))',
            gap: '2rem',
            textAlign: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#D97706', fontFamily: 'var(--font-serif)' }}>
              180+
            </div>
            <div style={{ fontWeight: 600, color: '#1C1917', marginTop: '4px' }}>Tribal Families Supported</div>
            <div style={{ fontSize: '0.8rem', color: '#78716C' }}>Direct fair-trade livelihood</div>
          </div>

          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#059669', fontFamily: 'var(--font-serif)' }}>
              100%
            </div>
            <div style={{ fontWeight: 600, color: '#1C1917', marginTop: '4px' }}>Cruelty-Free Ahimsa</div>
            <div style={{ fontSize: '0.8rem', color: '#78716C' }}>50% honey kept for hives</div>
          </div>

          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#2563EB', fontFamily: 'var(--font-serif)' }}>
              0 PPM
            </div>
            <div style={{ fontWeight: 600, color: '#1C1917', marginTop: '4px' }}>Zero Antibiotics</div>
            <div style={{ fontSize: '0.8rem', color: '#78716C' }}>Clean mountain air & flora</div>
          </div>

          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#7C3AED', fontFamily: 'var(--font-serif)' }}>
              4
            </div>
            <div style={{ fontWeight: 600, color: '#1C1917', marginTop: '4px' }}>Biospheres Protected</div>
            <div style={{ fontSize: '0.8rem', color: '#78716C' }}>Sundarbans, Kashmir, Corbett, Kullu</div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .story-banner-overlay {
            padding: 1.25rem !important;
          }
          .story-impact-grid {
            padding: 1.5rem 1rem !important;
            border-radius: 18px !important;
            gap: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
};
