import { NextRequest, NextResponse } from 'next/server';
import { redactPII, restorePII, PiiRedactorConfig } from '@/utils/piiRedactor';

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await req.json();
    const { text, config } = body as { text: string; config: PiiRedactorConfig };

    if (typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Invalid prompt. "text" must be a string.' },
        { status: 400 }
      );
    }

    // 1. Execute PII Redaction
    const redactResult = redactPII(text, config);
    
    // 2. Simulate API Gateway latency (between 250ms and 500ms)
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 250 + 250));

    // 3. Generate a highly contextual mock LLM completion based on the redacted text
    let mockLlmResponseRedacted = '';

    // Custom responses based on the redacted tokens found
    const hasName = redactResult.stats.namesCount > 0;
    const hasEmail = redactResult.stats.emailsCount > 0;
    const hasCard = redactResult.stats.creditCardsCount > 0;
    const hasIP = redactResult.stats.ipsCount > 0;

    if (hasCard) {
      mockLlmResponseRedacted = `[GATEWAY SHIELD ALERT] Transaction processed. Acknowledged charge request for card [REDACTED_CARD_1]. For security, the raw number has been scrubbed and tokenized in transit. Reference ID: TXN-${Math.floor(Math.random() * 90000 + 10000)}.`;
    } else if (hasName && hasEmail) {
      mockLlmResponseRedacted = `Hello [REDACTED_NAME_1], thank you for reaching out. I have updated your account profile and verified your contact email [REDACTED_EMAIL_1]. You will receive a secure confirmation link shortly.`;
    } else if (hasEmail) {
      mockLlmResponseRedacted = `I have received the contact request. I will initiate a secure communication stream to [REDACTED_EMAIL_1] and attach the project documentation requested.`;
    } else if (hasName) {
      mockLlmResponseRedacted = `Greetings [REDACTED_NAME_1]! It is a pleasure to assist you today. I have registered your inquiry in our internal CRM and assigned a senior developer to review it.`;
    } else if (hasIP) {
      mockLlmResponseRedacted = `Connection route established. Node [REDACTED_IP_1] has been successfully whitelisted. Gateway firewall settings have been updated to log all subsequent traffic.`;
    } else {
      // General prompt response
      mockLlmResponseRedacted = `Processed prompt safely. The inputs contained no sensitive PII data leaks. Summary: "${redactResult.redactedText.substring(0, 60)}${redactResult.redactedText.length > 60 ? '...' : ''}" has been successfully forwarded to the model layer.`;
    }

    // 4. Restore original values for the client view
    const mockLlmResponseRestored = restorePII(mockLlmResponseRedacted, redactResult.vault);

    const latency = Date.now() - startTime;

    // 5. Calculate simulated cost optimization savings
    // Masking values compresses inputs, and protecting security leaks prevents compliance fines.
    // Let's model a mock "Compliance Savings" and "Token Optimization"
    const rawTokens = Math.ceil(text.length / 4);
    const redactedTokens = Math.ceil(redactResult.redactedText.length / 4);
    const tokenSavingsPercent = Math.max(0, Math.round(((rawTokens - redactedTokens) / rawTokens) * 100));
    
    // Simulate monetary compliance saving
    const complianceSavingsDollars = redactResult.stats.totalRedacted * 2.5;

    return NextResponse.json({
      originalText: redactResult.originalText,
      redactedText: redactResult.redactedText,
      vault: redactResult.vault,
      mockLlmResponseRedacted,
      mockLlmResponseRestored,
      stats: redactResult.stats,
      metrics: {
        latencyMs: latency,
        rawTokens,
        redactedTokens,
        tokenSavingsPercent,
        complianceSavingsDollars
      }
    });

  } catch (error) {
    console.error('SafeGuard Gateway Error:', error);
    return NextResponse.json(
      { error: 'Internal gateway error processing payload.' },
      { status: 500 }
    );
  }
}
