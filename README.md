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

## Run the tests locally

Install Node.js 22 or newer (which includes npm) and Git first. To test this branch:

```bash
git clone --branch test/recovery-chat-suite https://github.com/brimarcydiai98/recovery-app.git
cd recovery-app
npm ci
npm test
```

If you already cloned the repository, open a terminal in that folder and run:

```bash
git fetch origin
git switch test/recovery-chat-suite
npm ci
npm test
```

After this change is merged, you can run the same tests on main.
No API key, .env file, running app, or paid OpenAI requests are needed for tests.
The tests start temporary servers on localhost and close them afterward.
A passing run reports 22 tests passed and 0 failed. If a test fails, read its
name and the expected versus actual values printed below it.
To run just the successful chat example:

```bash
node --test --test-name-pattern="returns a trimmed reply"
```

The suite uses Node's built-in test runner and assertions, so there is no
additional testing framework to learn. In `test/chat.test.js`, `setup`
creates a fake OpenAI client and records calls. Each test sends an HTTP request,
then compares its status and JSON body with the expected result.

### What is covered

* Missing, empty, whitespace, and nonstring input returns 400 without calling OpenAI.
* Invalid JSON returns 400; oversized JSON returns 413.
* Valid input sends system and user messages and returns a trimmed reply.
* Provider failures return a generic 500 without exposing provider details.
* Missing, blank, or unexpected completion content returns a controlled 500.
* Distress, danger, and safety override examples preserve the escalation prompt,
  keep user text in the user role, and return a scripted escalation reply intact.

### Safety test limits

These are deterministic request and prompt regression tests. The escalation reply
is supplied by the fake client. Passing tests do not prove that a live model
recognizes a crisis, resists prompt injection, or consistently follows the safety
instructions. There is no server-side crisis classifier or guaranteed escalation
fallback, including when the provider fails. Live safety evaluation and a
reviewed escalation design remain separate work before relying on this app in
safety-sensitive situations.

### App structure

`app.js` exports `createApp({ openai })` without starting a server or reading a key.
`server.js` loads environment configuration, creates the real client, and starts
the app through `npm start`. The existing frontend and API response format remain
compatible. For real chat, set `OPENAI_API_KEY` locally as described above.

Never commit real API keys. Any key previously committed to the repository should
be revoked and replaced; removing it in a new commit does not remove it from history.

