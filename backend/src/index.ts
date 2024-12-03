import express from "express";
import mainRouter from "./routes/mainRoute.js";
import { PORT } from "./config/env.js";

const app = express();
const port = PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the server",
  });
});

app.use("/api", mainRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
