import express from "express";
import { 
  getUserNotificationSettings, 
  updateUserNotificationSettings,
  getNotifiedUsers,
  getUser,
  getAllUsers
} from "../controllers/users.js";

const router = express.Router();

router.get("/:id", getUser);
router.get("/", getAllUsers);
router.get("/:id/notifications", getUserNotificationSettings);
router.patch("/:id/notifications", updateUserNotificationSettings);
router.get("/notified", getNotifiedUsers);

export default router;
