import Anthropic from "@anthropic-ai/sdk";
import { ANTHROPIC_API_KEY } from "../config/env.js";

const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
});

await anthropic.messages
  .stream({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    temperature: 0,
    messages: [{ role: "user", content: "Meaning of bajaj?" }],
  })
  .on("text", (text) => {
    console.log(text);
  });
