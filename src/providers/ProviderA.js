class ProviderA {
  constructor() {
    this.name = 'ProviderA';
  }

  async send({ to, subject, content }) {
    console.log(`[ProviderA] Sending email to ${to}`);

    // Dummy implementation
    const result = { status: 'sent', provider: 'ProviderA' };

    console.log(`[ProviderA] Email sent to ${to} successfully.`);
    return result;
  }
}

module.exports = ProviderA;
