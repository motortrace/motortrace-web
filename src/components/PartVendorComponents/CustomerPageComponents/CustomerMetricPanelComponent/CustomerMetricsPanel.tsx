
import React from 'react';
import './CustomerMetricsPanel.scss';

const metrics = [
  { label: 'New Customers', value: '1,250', change: '+15%', changeType: 'positive' },
  { label: 'Returning Customers', value: '850', change: '-5%', changeType: 'negative' },
  { label: 'Inactive Customers', value: '320', change: '+12%', changeType: 'negative' },
];

const CustomerMetricsPanel: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', height: '100%', justifyContent: 'space-between' }}>
    {metrics.map((m) => (
      <div
        key={m.label}
        style={{
          background: '#fff',
          border: '1px solid #f0f0f0',
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)',
          minWidth: 180,
          padding: '20px 18px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 8,
          flex: 1,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 14, color: '#374151', fontWeight: 600 }}>{m.label}</span>
            <span style={{
              fontSize: 13,
              fontWeight: 600,
              color: m.changeType === 'positive' ? '#059669' : '#dc2626',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              marginTop: 2
            }}>
              {m.changeType === 'positive' ? <span style={{ fontSize: 15 }}>↑</span> : <span style={{ fontSize: 15 }}>↓</span>}
              {m.change}
            </span>
          </div>
          <span style={{ fontWeight: 700, fontSize: 26, color: '#111827', marginLeft: 8 }}>{m.value}</span>
        </div>
      </div>
    ))}
  </div>
);

export default CustomerMetricsPanel;
