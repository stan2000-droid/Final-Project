import express from "express";
import { handleDetectionWebhook } from "../controllers/webhook.js";

const router = express.Router();

// Endpoint to receive detection webhooks from the Flask backend
router.post("/detection", handleDetectionWebhook);

export default router;
