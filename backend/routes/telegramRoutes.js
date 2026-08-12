import express from "express";
import { authenticateTelegramUser } from "../controllers/telegramController.js";

const router = express.Router();

router.post("/telegram", authenticateTelegramUser); // Telegram Authentication

export default router;