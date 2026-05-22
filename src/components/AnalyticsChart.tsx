import React from 'react';
import { BarChart3 } from 'lucide-react';

interface AnalyticsChartProps {
  stats: {
    emailsCount: number;
    phonesCount: number;
    creditCardsCount: number;
    ipsCount: number;
    namesCount: number;
  };
}

export default function AnalyticsChart({ stats }: AnalyticsChartProps) {
  const { emailsCount, phonesCount, creditCardsCount, ipsCount, namesCount } = stats;
  
  // Calculate relative sizes for the bar chart
  const categories = [
    { label: 'Emails', count: emailsCount, color: 'var(--color-primary)' },
    { label: 'Cards', count: creditCardsCount, color: 'var(--color-accent)' },
    { label: 'Phones', count: phonesCount, color: 'var(--color-success)' },
    { label: 'IPs', count: ipsCount, color: 'var(--color-warning)' },
    { label: 'Names', count: namesCount, color: 'var(--color-danger)' }
  ];

  const maxVal = Math.max(...categories.map(c => c.count), 1);

  // Mock historical throughput data for the Area Chart (6 intervals)
  const areaPoints = [
    { label: '10s', val: 5 },
    { label: '8s', val: 12 },
    { label: '6s', val: 8 },
    { label: '4s', val: 18 },
    { label: '2s', val: 14 },
    { label: 'Now', val: 24 }
  ];
  
  const maxAreaVal = Math.max(...areaPoints.map(p => p.val), 30);
  const chartHeight = 80;
  const chartWidth = 240;

  // Generate SVG path coordinates for the Area Chart
  const pointsStr = areaPoints
    .map((p, i) => {
      const x = (i / (areaPoints.length - 1)) * chartWidth;
      const y = chartHeight - (p.val / maxAreaVal) * chartHeight;
      return `${x},${y}`;
    })
    .join(' ');

  const fillPointsStr = `0,${chartHeight} ${pointsStr} ${chartWidth},${chartHeight}`;

  return (
    <div className="glass-card" style={{ height: 'fit-content' }}>
      <h2 className="card-title">
        <BarChart3 size={18} style={{ color: 'var(--color-primary)' }} />
        Security Analytics
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Gateway Throughput Area Chart */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: 600 }}>Gateway Throughput</span>
            <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>Avg: 14.5 req/s</span>
          </div>

          <div style={{ position: 'relative', height: '90px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--card-border)', padding: '5px', overflow: 'hidden' }}>
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} width="100%" height="100%" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1={chartHeight * 0.25} x2={chartWidth} y2={chartHeight * 0.25} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="0" y1={chartHeight * 0.5} x2={chartWidth} y2={chartHeight * 0.5} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="0" y1={chartHeight * 0.75} x2={chartWidth} y2={chartHeight * 0.75} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

              {/* Gradient Area */}
              <polygon points={fillPointsStr} fill="url(#areaGradient)" />

              {/* Area Path line */}
              <polyline
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="2.5"
                points={pointsStr}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Glowing Dots */}
              {areaPoints.map((p, i) => {
                const x = (i / (areaPoints.length - 1)) * chartWidth;
                const y = chartHeight - (p.val / maxAreaVal) * chartHeight;
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r={i === areaPoints.length - 1 ? 4 : 2}
                    fill={i === areaPoints.length - 1 ? 'var(--bg-primary)' : 'var(--color-accent)'}
                    stroke="var(--color-accent)"
                    strokeWidth={i === areaPoints.length - 1 ? 2.5 : 1}
                  />
                );
              })}
            </svg>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.25rem', padding: '0 2px' }}>
            {areaPoints.map((p, i) => (
              <span key={i}>{p.label}</span>
            ))}
          </div>
        </div>

        {/* PII Distribution Bar Chart */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            <span style={{ fontWeight: 600 }}>Redacted PII Types</span>
            <span style={{ fontWeight: 700 }}>Total scrubbed</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {categories.map((c) => {
              const pct = (c.count / maxVal) * 100;
              return (
                <div key={c.label} style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{c.label}</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{c.count}</span>
                  </div>
                  
                  {/* Visual Bar Track */}
                  <div style={{ height: '6px', background: 'var(--bg-secondary)', borderRadius: '3px', border: '1px solid var(--card-border)', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${pct}%`,
                        background: c.color,
                        borderRadius: '3px',
                        transition: 'width 0.5s ease-out',
                        boxShadow: `0 0 10px ${c.color}66`
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
