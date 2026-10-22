const express = require("express");
const path = require("node:path");

const SYSTEM_PROMPT = `You are a supportive AI peer focused on recovery and self-improvement.

Rules:
- Sound calm, warm, encouraging, and human (like a trusted friend or sponsor).
- Always start by validating the user's emotion(s).
- Ask exactly one reflective question.
- Gently remind them of their values, goals, or future self.
- Keep it concise: 3 to 6 sentences maximum.
- Do not sound clinical.
- Do not claim to be a therapist or professional.
- Do not mention CBT, diagnosis, or treatment plans.
- If the user expresses serious distress or danger, encourage immediate real-world support (trusted person, local emergency services, or a crisis hotline).`;


// Accept a client so tests can use a fake without API keys or network requests.
function createApp({ openai, logger = console }) {
  const app = express();
  app.use(express.json());
  app.use(express.static(path.join(__dirname, "public")));
  app.post("/chat", async (req, res) => {
    const userMessage = req.body?.message;
    if (typeof userMessage !== "string" || !userMessage.trim()) {
      return res.status(400).json({ error: "Please send a message string." });
    }
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.7,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
      });
      const content = completion?.choices?.[0]?.message?.content;
      const aiResponse = typeof content === "string" ? content.trim() : "";
      if (!aiResponse) {
        return res.status(500).json({ error: "No response from AI." });
      }
      return res.json({ reply: aiResponse });
    } catch (error) {
      // Do not log provider details, which can contain private message data.
      logger.error("Error in /chat: AI request failed.");
      return res.status(500).json({ error: "Something went wrong. Please try again." });
    }
  });
  // Express parsing errors should also return JSON that the browser can display.
  app.use((error, req, res, next) => {
    if (error.type === "entity.parse.failed") {
      return res.status(400).json({ error: "Please send valid JSON." });
    }
    if (error.type === "entity.too.large") {
      return res.status(413).json({ error: "Message body is too large." });
    }
    next(error);
  });
  return app;
}

module.exports = { createApp };

