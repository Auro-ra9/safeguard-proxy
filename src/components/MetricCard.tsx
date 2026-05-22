import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  trend: string;
  trendType: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  isGlow?: boolean;
}

export default function MetricCard({
  title,
  value,
  trend,
  trendType,
  icon,
  isGlow = false
}: MetricCardProps) {
  return (
    <div className={`glass-card ${isGlow ? 'accent-glow' : ''}`} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          {title}
        </span>
        <div style={{ color: isGlow ? 'var(--color-accent)' : 'var(--color-primary)', display: 'flex', alignItems: 'center' }}>
          {icon}
        </div>
      </div>
      
      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.25rem 0' }}>
        {value}
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem' }}>
        <span
          style={{
            color:
              trendType === 'up'
                ? 'var(--color-success)'
                : trendType === 'down'
                ? 'var(--color-danger)'
                : 'var(--text-secondary)',
            fontWeight: 700
          }}
        >
          {trendType === 'up' ? '▲' : trendType === 'down' ? '▼' : '●'} {trend}
        </span>
        <span style={{ color: 'var(--text-muted)' }}>vs last 24h</span>
      </div>
    </div>
  );
}
