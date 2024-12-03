import env from "dotenv";
env.config();

const requiredENV = ["ANTHROPIC_API_KEY", "PORT"];
requiredENV.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing env variables: ${key}`);
  }
});

export const ANTHROPIC_API_KEY = process.env.CLAUDE_API_KEY;
export const PORT = process.env.PORT;
