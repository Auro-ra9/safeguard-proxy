import React, { useState, useEffect } from 'react';
import { Activity, Play, Pause, AlertCircle } from 'lucide-react';
import { LogItem, RunStats } from '@/types';

export interface LogsStreamProps {
  logs: LogItem[];
  onAddSimulatedLog: (logItem: LogItem, statsToIncrement: Partial<RunStats> & { totalRedacted?: number }) => void;
}

// Re-export LogItem for backward compatibility
export type { LogItem };

const MOCK_PROMPTS_TRAFFIC = [
  {
    type: 'redact' as const,
    message: "CRM Chatbot: Customer contact card uploaded containing user email: sarah.connor@gmail.com and phone: 555-0199.",
    details: "Redacted: 2 fields | Latency: 280ms | Saved: $5.00",
    inc: { emailsCount: 1, phonesCount: 1, totalRedacted: 2 }
  },
  {
    type: 'info' as const,
    message: "HR Bot: Querying policy documentation regarding work from home rules.",
    details: "Redacted: 0 fields | Latency: 120ms | Saved: $0.00",
    inc: { totalRedacted: 0 }
  },
  {
    type: 'redact' as const,
    message: "Finance Model: Credit card details processed for payment verify. CC: 4532 7182 9901 2413.",
    details: "Redacted: 1 fields | Latency: 310ms | Saved: $2.50",
    inc: { creditCardsCount: 1, totalRedacted: 1 }
  },
  {
    type: 'warn' as const,
    message: "System Alert: Server request blocked. Unwhitelisted access attempt from IP 192.168.1.18.",
    details: "Redacted: 1 fields | Latency: 90ms | Saved: $2.50",
    inc: { ipsCount: 1, totalRedacted: 1 }
  },
  {
    type: 'info' as const,
    message: "Marketing Assistant: Draft email newsletter copy feedback request.",
    details: "Redacted: 0 fields | Latency: 145ms | Saved: $0.00",
    inc: { totalRedacted: 0 }
  }
];

export default function LogsStream({ logs, onAddSimulatedLog }: LogsStreamProps) {
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      // Pick a random mock traffic log
      const idx = Math.floor(Math.random() * MOCK_PROMPTS_TRAFFIC.length);
      const chosen = MOCK_PROMPTS_TRAFFIC[idx];

      const newLog: LogItem = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        type: chosen.type,
        message: chosen.message,
        details: chosen.details
      };

      onAddSimulatedLog(newLog, chosen.inc);
    }, 4500);

    return () => clearInterval(interval);
  }, [isLive, onAddSimulatedLog]);

  return (
    <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '320px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h2 className="card-title" style={{ margin: 0 }}>
          <Activity size={18} style={{ color: 'var(--color-primary)' }} />
          Gateway Live Auditing Stream
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isLive && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--color-success)' }}>
              <span className="active-dot"></span>
              Live
            </span>
          )}
          <button
            className="btn btn-secondary"
            onClick={() => setIsLive(!isLive)}
            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            {isLive ? (
              <>
                <Pause size={10} />
                Pause
              </>
            ) : (
              <>
                <Play size={10} />
                Resume
              </>
            )}
          </button>
        </div>
      </div>

      <div className="logs-container">
        {logs.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', gap: '0.5rem', padding: '2rem 0' }}>
            <AlertCircle size={24} />
            Waiting for request streams...
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className={`log-item log-${log.type}`}>
              <div className="log-header">
                <span className={`log-type log-type-${log.type}`}>{log.type}</span>
                <span className="log-timestamp">{log.timestamp}</span>
              </div>
              <div className="log-message">{log.message}</div>
              <div className="log-details">{log.details}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
