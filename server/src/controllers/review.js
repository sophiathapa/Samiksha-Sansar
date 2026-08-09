import Book from "../models/book.js";
import User from "../models/user.js";
import Review from "../models/review.js";

const addReview = async (req, res) => {
  try {
    const { userId, bookId, comment } = req.body;

    // validate user and book
    const user = await User.exists({ _id: userId });
    const book = await Book.exists({ _id: bookId });

    if (!user) return res.status(401).json({ message: "User not valid" });
    if (!book) return res.status(401).json({ message: "Book not valid" });

    const review = await Review.create({
      userId,
      bookId,
      comment,
    });
    return res.status(201).json({ message: "Review added successfully", review });
  } catch (err) {
    cosnole.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getReviews = async (req, res) => {
  const { bookId } = req.query;
  const book = await Book.exists({ _id: bookId });
  if (!book) {
    return res.status(404).json({ message: "book not found" });
  }
  const reviews = await Review.find({ bookId: bookId }).populate("userId", "firstName lastName");
  if (reviews === null) {
    return res.status(401).json({ message: "No Reviews" });
  }

  return res.status(200).json(reviews);
};

const likeBook = async (req, res) => {
  try {
    const { bookId, userId } = req.body;
    const book = await Book.findOne({ _id: bookId });
    const user = await User.exists({ _id: userId });
    if (!book) {
      return res.status(401).json({ message: "book not valid" });
    }
    if (!user) {
      return res.status(401).json({ message: "user not valid" });
    }

    await User.updateOne({ _id: userId }, { $addToSet: { likedBooks: bookId } });
    book.totalLikes++;
    await book.save();
    return res.status(200).json({ message: "Book liked successfully", totalLikes: book.totalLikes });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const unlikeBook = async (req, res) => {
  try {
    const { bookId, userId } = req.body;

    const book = await Book.findOne({ _id: bookId });
    const user = await User.exists({ _id: userId });
    if (!book) {
      return res.status(401).json({ message: "book not valid" });
    }
    if (!user) {
      return res.status(401).json({ message: "user not valid" });
    }
    await User.updateOne({ _id: userId }, { $pull: { likedBooks: bookId } });
    book.totalLikes--;
    await book.save();
    return res.status(200).json({ message: "Book unliked successfully", totalLikes: book.totalLikes });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const replyComment = async (req, res) => {
  try {
    const { userId, bookId, comment, parentId } = req.body;

    // validate user and book
    const user = await User.exists({ _id: userId });
    const book = await Book.exists({ _id: bookId });

    if (!user) return res.status(401).json({ message: "User not valid" });
    if (!book) return res.status(401).json({ message: "Book not valid" });
    if (!parentId) return res.status(401).json({ message: "Parent review not valid" });

    const review = await Review.create({
      userId,
      bookId,
      parentId,
      comment,
    });
    return res.status(201).json({ message: "Reply Comment added successfully", review });
  } catch (err) {
    cosnole.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const likeComment = async (req, res) => {
  try {
    const { reviewId, userId } = req.body;

    const [reviewExists, userExists] = await Promise.all([Review.exists({ _id: reviewId }), User.exists({ _id: userId })]);

    if (!reviewExists) return res.status(404).json({ message: "review not found" });
    if (!userExists) return res.status(404).json({ message: "user not found" });

    const review = await Review.findById(reviewId).select("likedBy");
    const alreadyLiked = review.likedBy.includes(userId);

    const updated = await Review.findOneAndUpdate({ _id: reviewId }, alreadyLiked ? { $pull: { likedBy: userId }, $inc: { totalLikes: -1 } } : { $addToSet: { likedBy: userId }, $inc: { totalLikes: 1 } }, { new: true });

    return res.status(200).json({
      message: alreadyLiked ? "Like removed" : "Review liked successfully",
      totalLikes: updated.totalLikes,
      likedBy: updated.likedBy,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const unlikeComment = async (req, res) => {
  try {
    const { reviewId, userId } = req.body;

    const review = await Review.exists({ _id: reviewId });
    const user = await User.exists({ _id: userId });

    if (!review) return res.status(404).json({ message: "review not found" });

    if (!user) return res.status(404).json({ message: "user not found" });

    const reply = await Review.findOneAndUpdate({ _id: reviewId }, { $pull: { likedBy: userId } });

    reply.totalLikes--;
    await reply.save();
    return res.status(201).json({ message: "Reply Comment added successfully", totalLikes: reply?.totalLikes, likedBy: reply?.likedBy });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export { addReview, getReviews, likeBook, unlikeBook, replyComment, likeComment, unlikeComment };
