import React from 'react';
import { Shield, Mail, Phone, CreditCard, Network, User } from 'lucide-react';
import { PiiRedactorConfig } from '@/utils/piiRedactor';

interface PolicyManagerProps {
  config: PiiRedactorConfig;
  onChange: (newConfig: PiiRedactorConfig) => void;
}

export default function PolicyManager({ config, onChange }: PolicyManagerProps) {
  const handleToggle = (key: keyof PiiRedactorConfig) => {
    onChange({
      ...config,
      [key]: !config[key]
    });
  };

  return (
    <div className="glass-card" style={{ height: 'fit-content' }}>
      <h2 className="card-title">
        <Shield size={18} style={{ color: 'var(--color-primary)' }} />
        Active Shield Policies
      </h2>
      
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
        Select which data classes the gateway should redact in request streams.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {/* Toggle Email */}
        <div className="switch-group">
          <div className="switch-label">
            <span className="switch-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Mail size={14} style={{ color: 'var(--text-secondary)' }} />
              Email Addresses
            </span>
            <span className="switch-desc">Mask SMTP destinations</span>
          </div>
          <label className="switch-input">
            <input
              type="checkbox"
              checked={config.redactEmails}
              onChange={() => handleToggle('redactEmails')}
            />
            <span className="slider"></span>
          </label>
        </div>

        {/* Toggle Phones */}
        <div className="switch-group">
          <div className="switch-label">
            <span className="switch-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Phone size={14} style={{ color: 'var(--text-secondary)' }} />
              Phone Numbers
            </span>
            <span className="switch-desc">Redact contact digits</span>
          </div>
          <label className="switch-input">
            <input
              type="checkbox"
              checked={config.redactPhones}
              onChange={() => handleToggle('redactPhones')}
            />
            <span className="slider"></span>
          </label>
        </div>

        {/* Toggle Credit Cards */}
        <div className="switch-group">
          <div className="switch-label">
            <span className="switch-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CreditCard size={14} style={{ color: 'var(--text-secondary)' }} />
              Payment Credentials
            </span>
            <span className="switch-desc">Mask credit card numbers</span>
          </div>
          <label className="switch-input">
            <input
              type="checkbox"
              checked={config.redactCreditCards}
              onChange={() => handleToggle('redactCreditCards')}
            />
            <span className="slider"></span>
          </label>
        </div>

        {/* Toggle IPs */}
        <div className="switch-group">
          <div className="switch-label">
            <span className="switch-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Network size={14} style={{ color: 'var(--text-secondary)' }} />
              IP Addresses
            </span>
            <span className="switch-desc">Scrub network locations</span>
          </div>
          <label className="switch-input">
            <input
              type="checkbox"
              checked={config.redactIPs}
              onChange={() => handleToggle('redactIPs')}
            />
            <span className="slider"></span>
          </label>
        </div>

        {/* Toggle Names */}
        <div className="switch-group">
          <div className="switch-label">
            <span className="switch-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={14} style={{ color: 'var(--text-secondary)' }} />
              User Identifiers
            </span>
            <span className="switch-desc">Mask names and identities</span>
          </div>
          <label className="switch-input">
            <input
              type="checkbox"
              checked={config.redactNames}
              onChange={() => handleToggle('redactNames')}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </div>
  );
}
