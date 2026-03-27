# recovery-app

A simple Node.js + Express web app for an AI peer support chat focused on recovery and self-improvement.

## Features
- Clean, simple chat interface
- Text input + send button
- Chat history for user and AI messages
- `POST /chat` backend endpoint
- OpenAI-powered supportive replies

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env file and add your key:
   ```bash
   cp .env.example .env
   ```
3. Put your OpenAI API key in `.env`:
   ```env
   OPENAI_API_KEY=your_real_key
   ```
4. Start the app:
   ```bash
   npm start
   ```
5. Open `http://localhost:3000`

## API
### `POST /chat`
Request body:
```json
{ "message": "I had a rough day and feel discouraged." }
```

Response body:
```json
{ "reply": "I hear you..." }
```
