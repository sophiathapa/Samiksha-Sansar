import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
  rating: { type: Number, min: 1, max: 5 },
  comment: { type: String, trim: true },
  createdAt: { type: Date },
  liked: { type: Boolean, default: false },
});

const Review = mongoose.model("Review", ReviewSchema);
export default Review;
