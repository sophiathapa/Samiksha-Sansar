import User from "../models/user.js";
import Notification from "../models/notifications.js";
import { createNotification } from "../service/notifications.js";

const createNotificationController = async (req, res) => {
  try {
    const notification = await createNotification(req.body);

    return res.status(201).json({ message: "Notification created" });
  } catch (error) {
    console.error(error);

    if (error.message === "Recipient user not found") {
      return res.status(404).json({ message: error.message });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getNotifications = async (req, res) => {
  try {
    const userId = req.user?._id.toString();
    const user = await User.exists({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const notifications = await Notification.find({ recipient: userId }).sort({ createdAt: -1 });
    return res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    notification.read = true;
    await notification.save();
    return res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const markAllNotificationAsRead = async (req, res) => {
  try {
    const userId = req.user?._id.toString();
    const user = await User.exists({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const notifications = await Notification.find({ recipient: userId }, { sort: { createdAt: -1 } });
    notifications.forEach(async (notification) => {
      notification.read = true;
      await notification.save();
    });
    return res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export { createNotification, getNotifications, markNotificationAsRead, markAllNotificationAsRead };
