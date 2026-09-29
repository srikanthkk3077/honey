import React from 'react';

export const SalesChart: React.FC = () => {
  const data = [
    { month: 'Oct', revenue: 42000, jars: 84 },
    { month: 'Nov', revenue: 58000, jars: 112 },
    { month: 'Dec', revenue: 86000, jars: 174 },
    { month: 'Jan', revenue: 74000, jars: 152 },
    { month: 'Feb', revenue: 92000, jars: 198 },
    { month: 'Mar', revenue: 124000, jars: 260 },
  ];

  const maxRev = 140000;

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        padding: '1.5rem',
        border: '1px solid #E7E5E4',
      }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', color: '#1C1917', margin: 0 }}>Revenue & Harvest Trends</h3>
          <p style={{ fontSize: '0.8rem', color: '#78716C', margin: '4px 0 0 0' }}>Monthly sales in INR (Past 6 months)</p>
        </div>
        <div className="flex items-center gap-2">
          <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#D97706' }} />
          <span style={{ fontSize: '0.8rem', color: '#57534E' }}>Honey Jar Sales</span>
        </div>
      </div>

      {/* Bar Chart Visual */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', gap: '1rem', paddingTop: '1rem', borderBottom: '1px solid #E7E5E4' }}>
        {data.map((item) => {
          const heightPercent = (item.revenue / maxRev) * 100;
          return (
            <div key={item.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#D97706', marginBottom: '6px' }}>
                ₹{(item.revenue / 1000).toFixed(0)}k
              </div>
              <div
                style={{
                  width: '100%',
                  maxWidth: '38px',
                  height: `${heightPercent}%`,
                  background: 'linear-gradient(180deg, #F59E0B 0%, #D97706 100%)',
                  borderRadius: '6px 6px 0 0',
                  transition: 'height 0.4s ease',
                }}
              />
              <span style={{ fontSize: '0.78rem', color: '#78716C', marginTop: '8px' }}>{item.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
