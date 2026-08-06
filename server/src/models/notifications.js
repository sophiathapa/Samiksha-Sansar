import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: ["book-available", "comment-reply"],
    },
    message: String,
    read: {
      type: Boolean,
      default: false,
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);