import React from 'react';
import { SettingsForm } from '../../../components/admin/settings/SettingsForm';

export const Settings: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.85rem', color: '#1C1917', margin: '0 0 0.25rem 0' }}>
          Apiary Store Settings
        </h1>
        <p style={{ color: '#78716C', margin: 0, fontSize: '0.9rem' }}>
          Configure general store details, shipping rates, and notification endpoints.
        </p>
      </div>

      <SettingsForm />
    </div>
  );
};
