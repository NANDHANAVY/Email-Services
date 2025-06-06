// tests/emailService.test.js

const EmailService = require('../src/EmailService');

jest.setTimeout(20000); // Increase timeout for retries

describe('EmailService', () => {
  let emailService;

  beforeEach(() => {
    emailService = new EmailService();
  });

  test('should send email successfully', async () => {
    const res = await emailService.sendEmail({
      messageId: 'msg1',
      to: 'test@example.com',
      subject: 'Hello',
      content: 'Test email',
    });
    expect(res.status).toBe('success');
    expect(['ProviderA', 'ProviderB']).toContain(res.provider);
    expect(res.retries).toBeGreaterThanOrEqual(0);
  });

  test('should prevent duplicate messageId sends (idempotency)', async () => {
    const msgId = 'msg2';
    const firstSend = await emailService.sendEmail({
      messageId: msgId,
      to: 'test@example.com',
      subject: 'Hello',
      content: 'Test email',
    });
    expect(firstSend.status).toBe('success');

    const secondSend = await emailService.sendEmail({
      messageId: msgId,
      to: 'test@example.com',
      subject: 'Hello',
      content: 'Test email',
    });
    expect(secondSend.status).toBe('skipped');
    expect(secondSend.reason).toBe('Duplicate messageId');
  });

  test('should enforce rate limiting', async () => {
    const promises = [];

    // Send max allowed emails
    for (let i = 0; i < emailService.maxEmailsPerWindow; i++) {
      promises.push(
        emailService.sendEmail({
          messageId: `rate${i}`,
          to: 'test@example.com',
          subject: 'Rate limit test',
          content: 'Testing',
        })
      );
    }

    await Promise.all(promises);

    // Next send should throw rate limit error
    await expect(
      emailService.sendEmail({
        messageId: 'rate-exceed',
        to: 'test@example.com',
        subject: 'Rate limit exceed',
        content: 'Testing',
      })
    ).rejects.toThrow('Rate limit exceeded');
  });
});
