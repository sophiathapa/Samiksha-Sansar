import Book from "../models/book.js";
import User from "../models/user.js";
import Review from "../models/review.js";

const addReview = async (req, res) => {
  const { userId, bookId, comment } = req.body;
  const user = await User.exists({ _id: userId });
  const book = await Book.exists({ _id: bookId });
  if (user === null) {
    return res.status(401).json({ message: "user not valid" });
  }
  if (book === null) {
    return res.status(401).json({ message: "book not valid" });
  }

  await Review.create({
    userId,
    bookId,
    comment,
    createdAt: new Date(),
  });
  return res.status(201).json({ message: "review added" });
};

const getReviews = async (req, res) => {
  const { bookId } = req.query;
  const book = await Book.exists({ _id: bookId });
  if (book === null) {
    return res.status(401).json({ message: "book not valid" });
  }
  const reviews = await Review.find({ bookId: bookId })
    .select("userId comment createdAt")
    .populate("userId", "firstName lastName");
  if (reviews === null) {
    return res.status(401).json({ message: "No Revies" });
  }

  return res.status(200).json(reviews);
};

const likeBook = async (req, res) => {
  const { bookId, userId } = req.body;

  const book = await Book.exists({ _id: bookId });
  const user = await User.exists({ _id: userId });
  if (book === null) {
    return res.status(401).json({ message: "book not valid" });
  }
  if (user === null) {
    return res.status(401).json({ message: "user not valid" });
  }

  const result = await Review.updateMany(
    { bookId, userId },
    { $set: { liked: true } }
  );

  if (result.matchedCount === 0) {
    const newReview = await Review.create({
      bookId,
      userId,
      liked: true,
    });
    return res
      .status(201)
      .json({ message: "Review created & liked", review: newReview });
  }

  return res
    .status(200)
    .json({ message: "Liked all existing reviews", result });
};

const unlikeBook = async (req, res) => {
  const { bookId, userId } = req.body;

  const book = await Book.exists({ _id: bookId });
  const user = await User.exists({ _id: userId });
  if (book === null) {
    return res.status(401).json({ message: "book not valid" });
  }
  if (user === null) {
    return res.status(401).json({ message: "user not valid" });
  }

  const result = await Review.updateMany(
    { bookId, userId },
    { $set: { liked: false } }
  );

  return res.status(200).json(result);
};

export { addReview, getReviews, likeBook, unlikeBook };
