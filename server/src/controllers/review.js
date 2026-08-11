import Book from "../models/book.js";
import User from "../models/user.js";
import Review from "../models/review.js";
import { io } from "../index.js";
import { createNotification } from "./notifications.js";

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

    const [user, book, review] = await Promise.all([
      User.findById(userId).select("firstName lastName"),
      Book.exists({ _id: bookId }), 
      Review.findOne({ _id: parentId }), 
    ]);

    if (!user) return res.status(401).json({ message: "User not found" });
    if (!book) return res.status(401).json({ message: "Book not found" });
    if (!review) return res.status(401).json({ message: "Parent review not found" });

    const newReview = await Review.create({
      userId,
      bookId,
      parentId,
      comment,
    });
    const recipient = review?.userId.toString();
    const senderName = user?.firstName.concat(" ", user?.lastName);

    if (userId !== recipient) {
      const notification = await createNotification({
          recipient: recipient,
          sender: userId,
          type: "comment-reply",
          bookId: bookId,
          commentId: newReview?._id,
          message: `${senderName} replied your comment.`,
          read: false,
        });
  
      io.to(`user:${recipient}`).emit("notification", notification);
    }

    return res.status(201).json({ message: "Reply Comment added successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const likeComment = async (req, res) => {
  try {
    const { reviewId, userId } = req.body;
    const [reviewExists, user] = await Promise.all([
      Review.exists({ _id: reviewId }), 
      User.findById(userId).select("firstName lastName")
    ]);

    if (!reviewExists) return res.status(404).json({ message: "review not found" });
    if (!user) return res.status(404).json({ message: "user not found" });

    const review = await Review.findById(reviewId).select("likedBy");
    const alreadyLiked = review.likedBy.includes(userId);
    const senderName = user?.firstName.concat(" ", user?.lastName);

    const updated = await Review.findOneAndUpdate({ _id: reviewId }, alreadyLiked ? { $pull: { likedBy: userId }, $inc: { totalLikes: -1 } } : { $addToSet: { likedBy: userId }, $inc: { totalLikes: 1 } }, { new: true });

    const recipient = updated?.userId.toString()

    if (!alreadyLiked && (userId !== recipient)) {
      const notification = await createNotification({
        recipient: recipient,
        sender: userId,
        type: "comment-like",
        bookId: updated?.bookId,
        commentId: reviewId,
        message: `${senderName} liked your comment.`,
        read: false,
      });

      // 2. push in real-time IF they're connected
      io.to(`user:${recipient}`).emit("notification", notification);
    }

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

import mongoose from "mongoose";

const deleteReview = async (req, res) => {
  try {
    const { commentId, userId } = req.query;
    // const userId = req.user?._id; 

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: "Invalid review id" });
    }

    // Only fetch the fields we actually need
    const review = await Review.findById(commentId).select(
      "userId parentId bookId rating"
    );

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    // Find all descendant replies (multi-level) via graphLookup
    const descendants = await Review.aggregate([
      { $match: { _id: review._id } },
      {
        $graphLookup: {
          from: "reviews",
          startWith: "$_id",
          connectFromField: "_id",
          connectToField: "parentId",
          as: "descendants",
        },
      },
      { $project: { "descendants._id": 1 } },
    ]);

    const idsToDelete = [
      review._id,
      ...(descendants[0]?.descendants.map((d) => d._id) ?? []),
    ];

    await Review.deleteMany({ _id: { $in: idsToDelete } });

    return res.status(200).json({
      message: "Review deleted",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const reportComment = async(req,res) => {
  try {
    const {userId, commentId} = req.query;
    const [user, review] = await Promise.all([
      User.exists({ _id:userId }),
      Review.exists({ _id:commentId }),
    ])
  
    if(!userId) {
      return res.status(404).json({ message: "User not found" });
    }
    if(!userId) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message:"Comment reported" })

  } catch(error)
  {
     console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


export { addReview, getReviews, likeBook, unlikeBook, replyComment, likeComment, deleteReview, reportComment };
