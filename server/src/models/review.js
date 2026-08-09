import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },

    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Review", default: null, index: true },

    comment: { type: String, trim: true, required: true },

    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    totalLikes: { type: Number, default: 0 },

    replyCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

ReviewSchema.index({ bookId: 1, parentId: 1, createdAt: -1 }); // fast "top-level reviews for this book, newest first"

const Review = mongoose.model("Review", ReviewSchema);
export default Review;
