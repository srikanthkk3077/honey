import React from 'react';
import { SectionTitle } from '../../../components/common/SectionTitle';
import { ShieldCheck, Award, HeartHandshake, CheckCircle2, Droplets, Sparkles, FileText } from 'lucide-react';

export const About: React.FC = () => {
  const purityTests = [
    {
      title: '1. The Water Dispersion Test',
      desc: 'Pure raw honey does not dissolve readily in cold water; it settles in thick lumps at the bottom. Adulterated sugar syrup immediately dissolves and clouds the glass.',
    },
    {
      title: '2. The Thumb / Surface Tension Test',
      desc: 'Put a drop of raw honey on your thumbnail. True raw honey stays intact in a bead due to natural viscosity; diluted syrup spills and spreads instantly.',
    },
    {
      title: '3. The Flame / Cotton Wick Test',
      desc: 'Dip a clean cotton wick in pure honey and light it. Because raw unheated honey contains under 18% natural moisture, the wick burns steadily without sputtering.',
    },
    {
      title: '4. The Hexagonal Memory Test',
      desc: 'Swirl raw honey in a plate with shallow cool water. The liquid naturally forms microscopic hexagonal honeycomb geometry on the surface.',
    },
  ];

  return (
    <div style={{ padding: '3.5rem 0 6rem 0', backgroundColor: '#FAF7F2' }}>
      <div className="container">
        {/* Hero */}
        <div style={{ maxWidth: '820px', margin: '0 auto 4.5rem auto', textAlign: 'center' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            The Gold Standard of Purity
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', color: '#1C1917', margin: '8px 0 1rem 0' }}>
            Unheated. Unfiltered. Living Honey.
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#57534E', lineHeight: 1.7 }}>
            Madhuvan was founded with a non-negotiable principle: never heat or adulterate the work of bees. We guarantee that every drop you receive has zero added syrup, zero pasteurization, and 100% biological vitality.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-3 gap-6" style={{ marginBottom: '5rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', padding: '2.25rem', borderRadius: '20px', border: '1px solid #E7E5E4' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Droplets size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#1C1917', marginBottom: '0.5rem' }}>Cold Harvested (&lt;40°C)</h3>
            <p style={{ color: '#57534E', fontSize: '0.92rem', lineHeight: 1.6 }}>
              Commercial brands boil honey at 70°C+ to speed bottling, destroying heat-sensitive diastase and invertase enzymes. Madhuvan keeps raw extraction temperatures equal to hive warmth.
            </p>
          </div>
          <div style={{ backgroundColor: '#FFFFFF', padding: '2.25rem', borderRadius: '20px', border: '1px solid #E7E5E4' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <HeartHandshake size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#1C1917', marginBottom: '0.5rem' }}>Ahimsa Bee Welfare</h3>
            <p style={{ color: '#57534E', fontSize: '0.92rem', lineHeight: 1.6 }}>
              We practice compassionate harvest. Only the excess outer combs are collected, leaving the brood and winter reserves untouched so colonies grow year after year.
            </p>
          </div>
        </div>

        {/* DIY Purity Tests */}
        <div className="about-tests-card" style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '3rem', border: '1px solid #E7E5E4', marginBottom: '4rem' }}>
          <SectionTitle
            subtitle="At-Home Authenticity"
            title="4 Simple DIY Tests to Verify Raw Honey"
            description="You don't need a laboratory to prove pure honey. Try these traditional tests on your Madhuvan jar at home."
          />

          <div className="grid grid-2 gap-6">
            {purityTests.map((t, idx) => (
              <div key={idx} style={{ padding: '1.25rem', backgroundColor: '#FAF7F2', borderRadius: '16px', border: '1px solid #E7E5E4' }}>
                <h4 style={{ fontSize: '1.05rem', color: '#1C1917', marginBottom: '0.5rem' }}>{t.title}</h4>
                <p style={{ fontSize: '0.88rem', color: '#57534E', lineHeight: 1.6 }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Certificate banner */}
        <div
          className="about-cert-banner"
          style={{
            backgroundColor: '#181511',
            color: '#FFFFFF',
            borderRadius: '24px',
            padding: '3rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '2rem',
          }}
        >
          {/* <div>
            <div className="flex items-center gap-2" style={{ color: '#FBBF24', fontWeight: 700, marginBottom: '0.5rem' }}>
              <FileText size={20} />
              <span>Independent Lab Reports</span>
            </div>
            <h3 style={{ fontSize: '1.75rem', color: '#FFFFFF', margin: '4px 0 0.5rem 0' }}>
              Want your batch NMR certificate?
            </h3>
            <p style={{ color: '#A8A29E', maxWidth: '520px', lineHeight: 1.6 }}>
              Every jar has a batch barcode on the bottom. Contact our laboratory verification desk anytime to inspect the spectrometry report for your jar.
            </p>
          </div> */}

          <a
            href="mailto:quality@madhuvanhoney.com?subject=Batch NMR Certificate Request"
            className="about-cert-btn"
            style={{
              padding: '0.85rem 1.75rem',
              backgroundColor: '#D97706',
              color: '#FFFFFF',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '0.95rem',
              display: 'inline-block',
              textAlign: 'center',
            }}
          >
            Request Batch NMR
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .about-tests-card,
          .about-cert-banner {
            padding: 1.5rem !important;
            border-radius: 18px !important;
          }
          .about-cert-btn {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};
