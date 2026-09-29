import React from 'react';
import { SectionTitle } from '../../common/SectionTitle';
import { INITIAL_TESTIMONIALS } from '../../../data/testimonials';
import { Star, Quote } from 'lucide-react';

export const Testimonials: React.FC = () => {
  return (
    <section style={{ padding: '5.5rem 0', backgroundColor: '#FAF7F2' }}>
      <div className="container">
        <SectionTitle
          subtitle="Customer Experiences"
          title="Loved by Doctors, Chefs & Families"
          description="Hear what patrons across India say about experiencing real, unprocessed raw honey."
        />

        <div className="grid grid-3 gap-6">
          {INITIAL_TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="card"
              style={{
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backgroundColor: '#FFFFFF',
              }}
            >
              <div>
                <div className="flex items-center justify-between" style={{ marginBottom: '1.25rem' }}>
                  <div className="flex items-center gap-1" style={{ color: '#F59E0B' }}>
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="#F59E0B" />
                    ))}
                  </div>
                  <Quote size={28} color="#FEF3C7" />
                </div>

                <p style={{ fontSize: '0.95rem', color: '#44403C', lineHeight: 1.65, fontStyle: 'italic', marginBottom: '1.5rem' }}>
                  "{item.comment}"
                </p>
              </div>

              <div>
                <div style={{ fontSize: '0.78rem', color: '#D97706', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  Bought: {item.productMentioned}
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1C1917' }}>{item.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#78716C' }}>{item.role} • {item.location}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
