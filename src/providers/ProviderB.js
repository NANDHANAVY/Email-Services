class ProviderB {
  constructor() {
    this.name = 'ProviderB';
  }

  async send({ to, subject, content }) {
    console.log(`[ProviderB] Sending email to ${to}`);

    // Dummy implementation
    const result = { status: 'sent', provider: 'ProviderB' };

    console.log(`[ProviderB] Email sent to ${to} successfully.`);
    return result;
  }
}

module.exports = ProviderB;
