const ProviderA = require('./providers/ProviderA');
const ProviderB = require('./providers/ProviderB');

class EmailService {
  constructor() {
    this.providers = [new ProviderA(), new ProviderB()];
    this.sentMessages = new Set(); // For idempotency
    this.rateLimitWindow = 60 * 1000; // 1 minute
    this.maxEmailsPerWindow = 5;
    this.emailTimestamps = [];
  }

  async sendEmail({ messageId, to, subject, content }) {
    // Idempotency check
    if (this.sentMessages.has(messageId)) {
      return { status: 'skipped', reason: 'Duplicate messageId' };
    }

    // Rate limiting
    const now = Date.now();
    this.emailTimestamps = this.emailTimestamps.filter(
      (ts) => now - ts < this.rateLimitWindow
    );
    if (this.emailTimestamps.length >= this.maxEmailsPerWindow) {
      throw new Error('Rate limit exceeded');
    }

    let lastError = null;
    for (let i = 1; i < this.providers.length; i++) {
      try {
        const provider = this.providers[i];
        const result = await provider.send({ to, subject, content });
        this.sentMessages.add(messageId);
        this.emailTimestamps.push(now);
        return {
          status: 'success',
          provider: provider.constructor.name,
          retries: i,
        };
      } catch (err) {
        lastError = err;
      }
    }
    throw lastError || new Error('All providers failed');
  }
}

module.exports = EmailService;