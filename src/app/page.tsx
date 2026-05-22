'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ShieldCheck, Sun, Moon, Zap, Lock, DollarSign, Clock } from 'lucide-react';
import MetricCard from '@/components/MetricCard';
import PolicyManager from '@/components/PolicyManager';
import Playground from '@/components/Playground';
import LogsStream, { LogItem } from '@/components/LogsStream';
import AnalyticsChart from '@/components/AnalyticsChart';
import { PiiRedactorConfig } from '@/utils/piiRedactor';

// Seed log data — timestamps use static relative labels to avoid hydration mismatch.
// Live logs generated in useEffect/event handlers use real-time client timestamps.
function createSeedLogs(): LogItem[] {
  return [
    {
      id: 'init-1',
      timestamp: '1h ago',
      type: 'info',
        message: 'SafeGuard Proxy initialization completed successfully. Integrity checks passed.',
        details: 'Policies loaded: 5 | Vault: simulated secure storage | Environment: production'
    },
    {
      id: 'init-2',
      timestamp: '30m ago',
      type: 'redact',
      message: 'Intercepted Chatbot Prompt: scrubbed credit card payload (Visa token generated).',
      details: 'Redacted: 1 fields | Latency: 320ms | Saved: $2.50'
    },
    {
      id: 'init-3',
      timestamp: '10m ago',
      type: 'warn',
      message: 'API Gateway Shield Alert: blocked cleartext transfer of IPv4 address.',
      details: 'Redacted: 1 fields | Latency: 85ms | Saved: $2.50'
    }
  ];
}

export default function Dashboard() {
  // Theme state: dark mode default, switchable
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  // Compliance configuration state
  const [config, setConfig] = useState<PiiRedactorConfig>({
    redactEmails: true,
    redactPhones: true,
    redactCreditCards: true,
    redactIPs: true,
    redactNames: true
  });

  // Cumulative metrics & logs state
  const [stats, setStats] = useState({
    emailsCount: 4,
    phonesCount: 3,
    creditCardsCount: 2,
    ipsCount: 2,
    namesCount: 4,
    totalRedacted: 15
  });

  const [metrics, setMetrics] = useState({
    totalRequests: 87,
    avgLatencyMs: 240,
    complianceSavingsDollars: 37.50
  });

  // Start with empty logs to avoid hydration mismatch, then populate on mount
  const [logs, setLogs] = useState<LogItem[]>([]);

  // Types for run metrics and stats used by callbacks
  type RunMetrics = {
    latencyMs: number;
    rawTokens?: number;
    redactedTokens?: number;
    tokenSavingsPercent?: number;
    complianceSavingsDollars: number;
  };

  type RunStats = {
    emailsCount: number;
    phonesCount: number;
    creditCardsCount: number;
    ipsCount: number;
    namesCount: number;
    totalRedacted: number;
  };

  // Sync theme attribute to HTML tag and populate seed logs (client-side only).
  // Defer state updates to the next macrotask to avoid synchronous setState warnings
  useEffect(() => {
    const savedTheme = localStorage.getItem('safeguard-theme') as 'dark' | 'light' | null;
    const themeToApply = savedTheme ?? 'dark';
    document.documentElement.setAttribute('data-theme', themeToApply);

    // defer updates to avoid cascading renders inside effect body
    setTimeout(() => {
      if (savedTheme) setTheme(savedTheme);
      setLogs(createSeedLogs());
    }, 0);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('safeguard-theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  // Callback from the playground execution runs
  const handlePlaygroundCompleted = useCallback((runMetrics: RunMetrics, runStats: RunStats, logItem: LogItem) => {
    // Add log to list
    setLogs((prev) => [logItem, ...prev].slice(0, 30));

    // Update cumulative counts
    setStats((prev) => {
      const nextEmails = prev.emailsCount + runStats.emailsCount;
      const nextPhones = prev.phonesCount + runStats.phonesCount;
      const nextCards = prev.creditCardsCount + runStats.creditCardsCount;
      const nextIPs = prev.ipsCount + runStats.ipsCount;
      const nextNames = prev.namesCount + runStats.namesCount;
      const nextTotal = nextEmails + nextPhones + nextCards + nextIPs + nextNames;

      return {
        emailsCount: nextEmails,
        phonesCount: nextPhones,
        creditCardsCount: nextCards,
        ipsCount: nextIPs,
        namesCount: nextNames,
        totalRedacted: nextTotal
      };
    });

    // Update performance averages
    setMetrics((prev) => {
      const nextRequests = prev.totalRequests + 1;
      const nextLatency = Math.round((prev.avgLatencyMs * prev.totalRequests + runMetrics.latencyMs) / nextRequests);
      const nextSavings = prev.complianceSavingsDollars + runMetrics.complianceSavingsDollars;

      return {
        totalRequests: nextRequests,
        avgLatencyMs: nextLatency,
        complianceSavingsDollars: nextSavings
      };
    });
  }, []);

  // Callback to append live simulated traffic from backend
  const handleAddSimulatedLog = useCallback((logItem: LogItem, statsToIncrement: Partial<RunStats> & { totalRedacted?: number }) => {
    setLogs((prev) => [logItem, ...prev].slice(0, 30));
    
    // Increment logs stats if redact metrics matched
    if ((statsToIncrement.totalRedacted ?? 0) > 0) {
      setStats((prev) => {
        const nextEmails = prev.emailsCount + (statsToIncrement.emailsCount || 0);
        const nextPhones = prev.phonesCount + (statsToIncrement.phonesCount || 0);
        const nextCards = prev.creditCardsCount + (statsToIncrement.creditCardsCount || 0);
        const nextIPs = prev.ipsCount + (statsToIncrement.ipsCount || 0);
        const nextNames = prev.namesCount + (statsToIncrement.namesCount || 0);
        const nextTotal = nextEmails + nextPhones + nextCards + nextIPs + nextNames;

        return {
          emailsCount: nextEmails,
          phonesCount: nextPhones,
          creditCardsCount: nextCards,
          ipsCount: nextIPs,
          namesCount: nextNames,
          totalRedacted: nextTotal
        };
      });
    }

    // Increment request and audit metrics
    setMetrics((prev) => {
      const nextRequests = prev.totalRequests + 1;
      const nextLatency = Math.round(
        (prev.avgLatencyMs * prev.totalRequests + ((statsToIncrement.totalRedacted ?? 0) > 0 ? 290 : 130)) / nextRequests
      );
      const nextSavings = prev.complianceSavingsDollars + ((statsToIncrement.totalRedacted ?? 0) * 2.50);

      return {
        totalRequests: nextRequests,
        avgLatencyMs: nextLatency,
        complianceSavingsDollars: nextSavings
      };
    });
  }, []);

  return (
    <div className="app-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-title-container" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'var(--color-primary-glow)', border: '1px solid var(--color-primary)', width: '42px', height: '42px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1>SafeGuard Proxy</h1>
            <p>GDPR-Compliant LLM Security Proxy Gateway & Analytics Dashboard</p>
          </div>
        </div>

        <div className="header-controls">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <span className="active-dot"></span>
            <span>Gateway Proxy: Operational</span>
          </div>
          <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Metrics Row */}
      <section className="metrics-grid">
        <MetricCard
          title="Scrubbed Data Leak Threats"
          value={stats.totalRedacted}
          trend="+12%"
          trendType="up"
          icon={<Lock size={18} />}
          isGlow={true}
        />
        <MetricCard
          title="Total Audited Requests"
          value={metrics.totalRequests}
          trend="+8%"
          trendType="up"
          icon={<Zap size={18} />}
        />
        <MetricCard
          title="GDPR Audit Compliance Savings"
          value={`$${metrics.complianceSavingsDollars.toFixed(2)}`}
          trend="+$15.00"
          trendType="up"
          icon={<DollarSign size={18} />}
        />
        <MetricCard
          title="Gateway Latency"
          value={`${metrics.avgLatencyMs}ms`}
          trend="-15ms"
          trendType="down"
          icon={<Clock size={18} />}
        />
      </section>

      {/* Main Grid */}
      <main className="dashboard-grid">
        {/* Left Column - Policies & Charts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <PolicyManager config={config} onChange={setConfig} />
          <AnalyticsChart stats={stats} />
        </div>

        {/* Right Column - Playground & Logs */}
        <div className="right-column">
          <Playground config={config} onRunCompleted={handlePlaygroundCompleted} />
          <LogsStream logs={logs} onAddSimulatedLog={handleAddSimulatedLog} />
        </div>
      </main>
    </div>
  );
}
