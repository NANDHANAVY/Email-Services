# Email Service

A simple Node.js backend service for sending emails with retry, fallback, idempotency, and rate limiting.

## Features

- **Multiple Providers:** Supports multiple email providers with automatic fallback.
- **Retry & Fallback:** If one provider fails, tries the next.
- **Idempotency:** Prevents duplicate emails using `messageId`.
- **Rate Limiting:** Limits the number of emails sent per minute.

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

## 🏗️ Tech Stack

- **Node.js** – Backend JavaScript runtime
- **Express.js** – REST API framework
- **Jest** – Unit testing framework
- **Nodemon** – Development auto-reload tool
- **JavaScript (ES6+)** – Modern JS features (classes, async/await)

### Installation

```bash
npm install
```

### Running the Service

Start the server in development mode (auto-reload):

```bash
npm run dev
```

Or in production mode:

```bash
npm start
```

The service will run on [http://localhost:3001](http://localhost:3001) by default.

## API

### `POST /send-email`

Send an email.

#### Request Body

```json
{
  "messageId": "unique-id",
  "to": "recipient@example.com",
  "subject": "Email Subject",
  "content": "Email body content"
}
```

#### Response

- **Success:**
  ```json
  {
    "status": "success",
    "provider": "ProviderA",
    "retries": 0
  }
  ```
- **Duplicate messageId:**
  ```json
  {
    "status": "skipped",
    "reason": "Duplicate messageId"
  }
  ```
- **Rate limit exceeded:**
  ```json
  {
    "error": "Rate limit exceeded"
  }
  ```

## Project Structure

```
email-service/
├── src/
│   ├── index.js
│   ├── EmailService.js
│   └── providers/
│       ├── ProviderA.js
│       └── ProviderB.js
├── package.json
└── README.md
```

## Testing

To run tests (if available):

```bash
npm test
```

---

**Note:**  
This project uses dummy providers. Integrate with real email APIs for production use.

