import React from 'react';
import { SectionTitle } from '../../common/SectionTitle';
import { Check, X } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const comparisons = [
    {
      feature: 'Thermal Treatment',
      madhuvan: 'Unheated (under 40°C), retains 100% live enzymes & diastase',
      commercial: 'Flash heated (70°C+) destroying healthy beneficial enzymes',
    },
    {
      feature: 'Filtration Method',
      madhuvan: 'Single cotton mesh gravity pass keeping natural bee pollen',
      commercial: 'Ultra-pressurized micro-filter stripping out all bee pollen',
    },
    {
      feature: 'Purity & Syrups',
      madhuvan: 'Zero C3/C4 sugars, zero inverted rice or high-fructose corn syrup',
      commercial: 'Frequently adulterated with undetectable industrial syrups',
    },
    {
      feature: 'Hive Harvesting',
      madhuvan: 'Sustainable, non-destructive ethical tribal harvesting',
      commercial: 'Factory bee farms with chemical antibiotics and pesticides',
    },
    {
      feature: 'Glass vs Plastic',
      madhuvan: 'Packed in premium inert food-grade glass jars',
      commercial: 'Packed in cheap BPA leaching plastic squeeze bottles',
    },
  ];

  return (
    <section style={{ padding: '5.5rem 0', backgroundColor: '#FAF7F2' }}>
      <div className="container">
        <SectionTitle
          subtitle="Real Honey vs Store-Bought"
          title="Why Conscious Families Choose Madhuvan"
          description="Most honey found in supermarkets is heated, ultra-filtered sugar syrup. Here is how authentic forest honey makes a world of difference."
        />

        {/* Desktop / Tablet Table View */}
        <div
          className="why-choose-desktop-table"
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid #E7E5E4',
            boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
            overflow: 'hidden',
          }}
        >
          <div className="table-responsive">
            <div style={{ minWidth: '640px' }}>
              {/* Table Header */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 2fr 2fr',
                  background: '#181511',
                  color: '#FFFFFF',
                  padding: '1.25rem 1.5rem',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                }}
              >
                <div>Standard</div>
                <div style={{ color: '#FBBF24', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Madhuvan Forest Honey</span>
                </div>
                <div style={{ color: '#A8A29E' }}>Commercial Supermarket Honey</div>
              </div>

              {/* Rows */}
              {comparisons.map((row, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 2fr 2fr',
                    padding: '1.25rem 1.5rem',
                    borderBottom: idx !== comparisons.length - 1 ? '1px solid #F5F1E9' : 'none',
                    backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FCFBF9',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
                  <div style={{ fontWeight: 700, color: '#1C1917', fontSize: '0.9rem' }}>
                    {row.feature}
                  </div>
                  <div style={{ color: '#065F46', fontSize: '0.88rem', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span style={{ color: '#059669', marginTop: '2px', flexShrink: 0 }}><Check size={18} /></span>
                    <span>{row.madhuvan}</span>
                  </div>
                  <div style={{ color: '#78716C', fontSize: '0.88rem', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span style={{ color: '#DC2626', marginTop: '2px', flexShrink: 0 }}><X size={18} /></span>
                    <span>{row.commercial}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Card View (renders under 640px) */}
        <div className="why-choose-mobile-cards" style={{ display: 'none', flexDirection: 'column', gap: '1rem' }}>
          {comparisons.map((row, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '1.25rem',
                border: '1px solid #E7E5E4',
                boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#1C1917', marginBottom: '0.75rem', borderBottom: '1px solid #F5F1E9', paddingBottom: '0.5rem' }}>
                {row.feature}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ backgroundColor: '#ECFDF5', padding: '0.75rem', borderRadius: '10px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ color: '#059669', marginTop: '2px', flexShrink: 0 }}><Check size={18} /></span>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#065F46', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Madhuvan Honey</div>
                    <div style={{ color: '#064E3B', fontSize: '0.85rem', marginTop: '2px', lineHeight: 1.4 }}>{row.madhuvan}</div>
                  </div>
                </div>

                <div style={{ backgroundColor: '#FEF2F2', padding: '0.75rem', borderRadius: '10px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ color: '#DC2626', marginTop: '2px', flexShrink: 0 }}><X size={18} /></span>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#991B1B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Commercial Honey</div>
                    <div style={{ color: '#7F1D1D', fontSize: '0.85rem', marginTop: '2px', lineHeight: 1.4 }}>{row.commercial}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <style>{`
          @media (max-width: 640px) {
            .why-choose-desktop-table { display: none !important; }
            .why-choose-mobile-cards { display: flex !important; }
          }
        `}</style>
      </div>
    </section>
  );
};
