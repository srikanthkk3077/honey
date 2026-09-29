import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
  iconBg?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon,
  iconBg = '#FEF3C7',
}) => {
  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        padding: '1.5rem',
        border: '1px solid #E7E5E4',
        boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <div style={{ fontSize: '0.85rem', color: '#78716C', fontWeight: 600, marginBottom: '0.35rem' }}>
          {title}
        </div>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1C1917', lineHeight: 1.2, marginBottom: '0.5rem' }}>
          {value}
        </div>
        {change && (
          <div
            className="flex items-center gap-1"
            style={{
              fontSize: '0.78rem',
              fontWeight: 600,
              color: isPositive ? '#059669' : '#DC2626',
            }}
          >
            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            <span>{change} vs last month</span>
          </div>
        )}
      </div>

      <div
        style={{
          width: '46px',
          height: '46px',
          borderRadius: '12px',
          backgroundColor: iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </div>
    </div>
  );
};
