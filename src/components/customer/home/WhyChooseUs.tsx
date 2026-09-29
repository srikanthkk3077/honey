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

        <div
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
                <span style={{ color: '#059669', marginTop: '2px' }}><Check size={18} /></span>
                <span>{row.madhuvan}</span>
              </div>
              <div style={{ color: '#78716C', fontSize: '0.88rem', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ color: '#DC2626', marginTop: '2px' }}><X size={18} /></span>
                <span>{row.commercial}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
