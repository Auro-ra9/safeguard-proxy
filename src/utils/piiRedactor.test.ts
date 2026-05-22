import { redactPII, restorePII, encryptValue, decryptValue, PiiRedactorConfig } from './piiRedactor';

describe('SafeGuard Proxy PII Redactor Test Suite', () => {
  const defaultConfig: PiiRedactorConfig = {
    redactEmails: true,
    redactPhones: true,
    redactCreditCards: true,
    redactIPs: true,
    redactNames: true
  };

  describe('Cryptographic Vault Simulation', () => {
    test('should encrypt and decrypt a string correctly', () => {
      const rawText = 'Secret data 123!';
      const encrypted = encryptValue(rawText);
      expect(encrypted).not.toBe(rawText);
      
      const decrypted = decryptValue(encrypted);
      expect(decrypted).toBe(rawText);
    });
  });

  describe('PII Detection and Redaction', () => {
    test('should redact emails', () => {
      const input = 'Send invoice to john.doe@company.org or support@service.com';
      const result = redactPII(input, defaultConfig);

      expect(result.redactedText).toContain('[REDACTED_EMAIL_1]');
      expect(result.redactedText).toContain('[REDACTED_EMAIL_2]');
      expect(result.redactedText).not.toContain('john.doe@company.org');
      expect(result.redactedText).not.toContain('support@service.com');
      expect(result.stats.emailsCount).toBe(2);
      expect(result.stats.totalRedacted).toBe(2);
    });

    test('should redact phone numbers', () => {
      const input = 'Call me at 555-867-5309 or +1 (800) 555-0199 for help.';
      const result = redactPII(input, defaultConfig);

      expect(result.redactedText).toContain('[REDACTED_PHONE_1]');
      expect(result.redactedText).toContain('[REDACTED_PHONE_2]');
      expect(result.stats.phonesCount).toBe(2);
    });

    test('should redact credit card numbers', () => {
      const input = 'My Visa number is 4111-2222-3333-4444 and my code is 123.';
      const result = redactPII(input, defaultConfig);

      expect(result.redactedText).toContain('[REDACTED_CARD_1]');
      expect(result.redactedText).not.toContain('4111-2222-3333-4444');
      expect(result.stats.creditCardsCount).toBe(1);
    });

    test('should redact IP addresses', () => {
      const input = 'Gateway access logs from 192.168.1.1 and backup server at 10.0.0.254';
      const result = redactPII(input, defaultConfig);

      expect(result.redactedText).toContain('[REDACTED_IP_1]');
      expect(result.redactedText).toContain('[REDACTED_IP_2]');
      expect(result.stats.ipsCount).toBe(2);
    });

    test('should redact names', () => {
      const input = 'Welcome back John Doe! Also, meet Ashna Ahammed.';
      const result = redactPII(input, defaultConfig);

      expect(result.redactedText).toContain('[REDACTED_NAME_1]');
      expect(result.redactedText).toContain('[REDACTED_NAME_2]');
      expect(result.stats.namesCount).toBe(2);
    });

    test('should redact names by heuristic introduction', () => {
      const input = 'Hello, my name is Marcus. I am attending with Sarah Connor.';
      const result = redactPII(input, defaultConfig);

      expect(result.redactedText).toContain('[REDACTED_NAME_1]');
      expect(result.redactedText).toContain('[REDACTED_NAME_2]');
      expect(result.stats.namesCount).toBe(2);
    });
  });

  describe('Policy Configuration Controls', () => {
    test('should bypass email redaction if config sets it to false', () => {
      const input = 'Email john@doe.com or call 555-555-5555';
      const customConfig: PiiRedactorConfig = {
        ...defaultConfig,
        redactEmails: false
      };
      
      const result = redactPII(input, customConfig);
      expect(result.redactedText).toContain('john@doe.com');
      expect(result.redactedText).not.toContain('[REDACTED_EMAIL_1]');
      expect(result.redactedText).toContain('[REDACTED_PHONE_1]');
      expect(result.stats.emailsCount).toBe(0);
      expect(result.stats.phonesCount).toBe(1);
    });
  });

  describe('Data Restoration (Roundtrip)', () => {
    test('should restore redacted tokens back to original values', () => {
      const originalText = 'Call Alice Smith at 206-555-0125 or write to alice.smith@outlook.com.';
      const redactResult = redactPII(originalText, defaultConfig);
      
      expect(redactResult.redactedText).toContain('[REDACTED_NAME_1]');
      expect(redactResult.redactedText).toContain('[REDACTED_PHONE_1]');
      expect(redactResult.redactedText).toContain('[REDACTED_EMAIL_1]');

      const restoredText = restorePII(redactResult.redactedText, redactResult.vault);
      expect(restoredText).toBe(originalText);
    });
  });
});
