import express from "express";
import { chatController, templateController } from "../controller/index.js";

const router = express.Router();

router.use("/template", templateController);
router.use("/chat", chatController);

export default router;
