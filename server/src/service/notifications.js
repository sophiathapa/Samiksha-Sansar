import Notification from "../models/notifications.js";
import User from "../models/user.js";

const createNotification = async (data) => {
    const user = await User.exists({ _id: data.recipient });

    if (!user) {
        throw new Error("Recipient user not found");
    }

    const notification = new Notification({
        ...data,
    });

    return await notification.save();
};

export { createNotification };