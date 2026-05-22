import React, { useState } from 'react';
import { Terminal, Send, ArrowRight, Key, Sparkles, RefreshCw } from 'lucide-react';
import { PiiRedactorConfig } from '@/utils/piiRedactor';
import { ProxyResponse, RunMetrics, RunStats, LogItem } from '@/types';

interface PlaygroundProps {
  config: PiiRedactorConfig;
  onRunCompleted: (metrics: RunMetrics, stats: RunStats, logItem: LogItem) => void;
}

const SAMPLE_TEXTS = [
  "Hello, my name is John Doe. Please charge card 4111-2222-3333-4444 and send the billing receipt to john.doe@company.org. My current IP is 192.168.1.100.",
  "Hi, I am Sarah Connor. I need to register my phone 555-867-5309 to receive account alerts. Please make sure my record is updated.",
  "Warning: Server connection at 10.0.0.12 failed. If issues persist, email technical support at help@service.com or contact administrator Jane Smith."
];

export default function Playground({ config, onRunCompleted }: PlaygroundProps) {
  const [inputText, setInputText] = useState(SAMPLE_TEXTS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ProxyResponse | null>(null);

  const handleInsertSample = () => {
    const randomIndex = Math.floor(Math.random() * SAMPLE_TEXTS.length);
    setInputText(SAMPLE_TEXTS[randomIndex]);
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);

    try {
      const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, config })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data: ProxyResponse = await response.json();
      setResult(data);

      // Construct a log item to send to the parent dashboard logs
      const logItem: LogItem = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        type: data.stats.totalRedacted > 0 ? 'redact' : 'info',
        message: data.stats.totalRedacted > 0 
          ? `Intercepted Prompt: masked ${data.stats.totalRedacted} fields.`
          : `Processed Prompt: bypassed gateway safely.`,
        details: `Redacted: ${data.stats.totalRedacted} | Latency: ${data.metrics.latencyMs}ms | Saved: $${data.metrics.complianceSavingsDollars}`
      };

      onRunCompleted(data.metrics, data.stats, logItem);
    } catch (error) {
      console.error('Error running playground proxy:', error);
      alert('Failed to connect to gateway proxy.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="playground-header-actions">
        <h2 className="card-title" style={{ margin: 0 }}>
          <Terminal size={18} style={{ color: 'var(--color-accent)' }} />
          PII Gateway Playground
        </h2>
        <button className="btn btn-secondary" onClick={handleInsertSample} disabled={isLoading} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
          <Sparkles size={12} />
          Sample Prompt
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div className="playground-io-label">Raw Developer Prompt Input</div>
        <textarea
          className="input-area"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type or paste prompts containing emails, card details, IP addresses or names..."
          rows={3}
          disabled={isLoading}
          style={{ resize: 'none' }}
        />
      </div>

      <button className="btn btn-accent" onClick={handleSend} disabled={isLoading || !inputText.trim()} style={{ width: '100%' }}>
        {isLoading ? (
          <>
            <RefreshCw size={16} className="spinner" style={{ animation: 'spin 1.5s linear infinite' }} />
            Filtering payload in transit...
          </>
        ) : (
          <>
            <Send size={16} />
            Forward through SafeGuard Proxy
          </>
        )}
      </button>

      {/* Visual Result Panels */}
      {result && (
        <div className="playground-container" style={{ marginTop: '0.5rem', animation: 'slideIn 0.3s ease-out' }}>
          <div className="playground-row">
            {/* Left: What the LLM sees */}
            <div>
              <div className="playground-io-label" style={{ color: 'var(--color-primary)' }}>
                1. Sanitized Payload Dispatched to LLM
              </div>
              <div className="code-box" style={{ minHeight: '100px', borderColor: 'var(--color-primary-glow)' }}>
                {result.redactedText}
              </div>
            </div>
            
            {/* Right: The Secure Vault Ledger */}
            <div>
              <div className="playground-io-label" style={{ color: 'var(--color-accent)' }}>
                <Key size={12} />
                2. Encrypted Vault Key Mappings
              </div>
              <div style={{ maxHeight: '100px', overflowY: 'auto', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)' }}>
                {Object.keys(result.vault).length > 0 ? (
                  <table className="vault-table">
                    <thead>
                      <tr>
                        <th>Vault Token</th>
                        <th>Encrypted Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(result.vault).map(([token, val]: [string, string]) => (
                        <tr key={token}>
                          <td className="vault-token">{token}</td>
                          <td className="vault-value" style={{ wordBreak: 'break-all' }}>{val.substring(0, 16)}...</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={{ padding: '1.5rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Vault is empty (No PII matched)
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className="playground-io-label" style={{ margin: 0 }}>3. Mock Model Raw Reply (containing tokens)</div>
              <ArrowRight size={12} style={{ color: 'var(--text-muted)' }} />
              <div className="playground-io-label" style={{ color: 'var(--color-success)', margin: 0 }}>4. Decrypted Output Delivered to App</div>
            </div>
            <div className="code-box" style={{ color: 'var(--color-success)', minHeight: '80px', borderLeft: '3px solid var(--color-success)' }}>
              {result.mockLlmResponseRestored}
            </div>
          </div>
        </div>
      )}
      
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
