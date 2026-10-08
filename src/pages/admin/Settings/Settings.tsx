import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { SettingsForm } from '../../../components/admin/settings/SettingsForm';

export const Settings: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '1.85rem', color: '#1C1917', margin: '0 0 0.25rem 0' }}>
            Apiary Store Settings
          </h1>
          <p style={{ color: '#78716C', margin: 0, fontSize: '0.9rem' }}>
            Configure general store details, shipping rates, and notification endpoints.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <Link
            to="/admin/sliders"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#FEF3C7',
              color: '#92400E',
              border: '1px solid #FCD34D',
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '0.88rem',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            <Sparkles size={16} color="#D97706" />
            <span>Customize Hero & Shop Banner</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      <SettingsForm />
    </div>
  );
};

export default Settings;
