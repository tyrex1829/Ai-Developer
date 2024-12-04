import express from "express";
import { chatController, templateController } from "../controller/index.js";

const router = express.Router();

router.post("/template", templateController);
router.get("/chat", chatController);

export default router;
