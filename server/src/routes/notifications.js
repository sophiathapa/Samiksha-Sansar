import { getNotifications, markNotificationAsRead, markAllNotificationAsRead } from "../controllers/notifications.js";
import express from "express";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/notifications", protect, getNotifications);
router.patch("/notifications/:id/read", protect, markNotificationAsRead);
router.patch("/notifications/readAll", protect, markAllNotificationAsRead);
export default router;
