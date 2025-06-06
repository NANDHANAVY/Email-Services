// src/index.js
const express = require('express');
const EmailService = require('./EmailService');

const app = express();
app.use(express.json());

const emailService = new EmailService();

app.post('/send-email', async (req, res) => {
  const { messageId, to, subject, content } = req.body;

  try {
    const result = await emailService.sendEmail({ messageId, to, subject, content });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const PORT = 3001; // Port for the email service
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
