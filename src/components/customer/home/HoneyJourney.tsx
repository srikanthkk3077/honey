import React from 'react';
import { SectionTitle } from '../../common/SectionTitle';
import { Flower2, HeartHandshake, Filter, ShieldCheck } from 'lucide-react';

export const HoneyJourney: React.FC = () => {
  const steps = [
    {
      step: '01',
      icon: <Flower2 size={28} color="#D97706" />,
      title: 'Wild Flora Foraging',
      desc: 'Indigenous bees forage on untouched blossoms across deep biodiversity zones — from Sundarbans mangroves to Kashmir valleys.'
    },
    {
      step: '02',
      icon: <HeartHandshake size={28} color="#059669" />,
      title: 'Cruelty-Free Harvest',
      desc: 'Traditional Mowals follow Vedic ahimsa principles. Over 50% of the honeycomb is preserved so colonies continue to thrive uninterrupted.'
    },
    {
      step: '03',
      icon: <Filter size={28} color="#3B82F6" />,
      title: 'Raw Gravity Straining',
      desc: 'Zero thermal processing or pressure filtration. Only simple multi-layer cotton mesh is used to remove comb specks while keeping live bee pollen intact.'
    },
    {
      step: '04',
      icon: <ShieldCheck size={28} color="#9333EA" />,
      title: 'NMR Batch Certified',
      desc: 'Every batch is sent to certified labs to verify 100% purity, zero corn/rice syrup, and high diastase enzyme retention.'
    }
  ];

  return (
    <section style={{ padding: '5.5rem 0', backgroundColor: '#FFFFFF', borderTop: '1px solid #E7E5E4' }}>
      <div className="container">
        <SectionTitle
          subtitle="Our Transparent Process"
          title="From Wild Blossom to Your Table"
          description="We uphold traditional, sustainable beekeeping that respects nature and preserves every drop of living nutrition."
        />

        <div className="grid grid-4 gap-6" style={{ position: 'relative' }}>
          {steps.map((item, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#FAF7F2',
                padding: '2rem 1.5rem',
                borderRadius: '20px',
                border: '1px solid #E7E5E4',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-6px)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <div>
                <div className="flex items-center justify-between" style={{ marginBottom: '1.25rem' }}>
                  <div
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '16px',
                      background: '#FFFFFF',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.5rem',
                      fontWeight: 800,
                      color: 'rgba(217, 119, 6, 0.35)',
                    }}
                  >
                    {item.step}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', color: '#1C1917', marginBottom: '0.6rem' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#57534E', lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
