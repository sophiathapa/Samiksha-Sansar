import { getNotifications, markNotificationAsRead, markAllNotificationAsRead } from "../controllers/notifications.js";
import express from "express";

const router = express.Router();

router.get("/notifications", getNotifications);
router.patch("/notifications/:id/read", markNotificationAsRead);
router.patch("/notifications/readAll", markAllNotificationAsRead);
export default router;
