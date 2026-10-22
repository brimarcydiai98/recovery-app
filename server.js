require("dotenv").config();
const OpenAI = require("openai");
const { createApp } = require("./app");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const app = createApp({ openai });
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Recovery app is running at http://localhost:${port}`);
});

