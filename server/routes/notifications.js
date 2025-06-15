import express from "express";
import { sendSMS, sendWhatsApp, getNotifiedUsers, getTwilioConfig } from "../controllers/notifications.js";

const router = express.Router();

router.post("/sms", sendSMS);
router.post("/whatsapp", sendWhatsApp);
router.get("/users", getNotifiedUsers);
router.get("/twilio-config", getTwilioConfig);

export default router;