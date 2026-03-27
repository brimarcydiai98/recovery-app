// Load environment variables from .env into process.env
require("dotenv").config();

const express = require("express");
const OpenAI = require("openai");

const app = express();
const port = process.env.PORT || 3000;

// Parse incoming JSON bodies
app.use(express.json());

// Serve frontend files from /public
app.use(express.static("public"));

// Create the OpenAI client once and reuse it
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Friendly system instructions that shape the assistant's tone and behavior
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

// POST /chat receives a message and returns an AI response
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body?.message;

    // Basic input validation keeps the endpoint beginner-friendly and safe
    if (!userMessage || typeof userMessage !== "string") {
      return res.status(400).json({ error: "Please send a message string." });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
    });

    const aiResponse = completion.choices?.[0]?.message?.content?.trim();

    if (!aiResponse) {
      return res.status(500).json({ error: "No response from AI." });
    }

    return res.json({ reply: aiResponse });
  } catch (error) {
    console.error("Error in /chat:", error.message);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

app.listen(port, () => {
  console.log(`Recovery app is running at http://localhost:${port}`);
});
