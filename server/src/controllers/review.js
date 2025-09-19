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

    // find all reviews by this user for this book
    const reviews = await Review.find({ userId, bookId }).sort({
      createdAt: 1,
    });

    let result;

    if (reviews.length === 0) {
      // 1. No review exists → create new
      result = await Review.create({
        userId,
        bookId,
        comment,
        createdAt: new Date(),
      });
    } else {
      // there are existing reviews
      const reviewWithoutComment = reviews.find((r) => !r.comment);

      if (reviewWithoutComment) {
        // 2. Update the first review that has no comment
        reviewWithoutComment.comment = comment;
        reviewWithoutComment.createdAt = new Date();
        result = await reviewWithoutComment.save();
      } else {
        const like = reviews[0].liked;
        // 3. All existing reviews have comments → create new review
        result = await Review.create({
          userId,
          bookId,
          comment,
          createdAt: new Date(),
          liked: like,
        });
      }
    }

    return res.status(201).json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getReviews = async (req, res) => {
  const { bookId } = req.query;
  const book = await Book.findOne({ _id: bookId });
  if (book === null) {
    return res.status(401).json({ message: "book not valid" });
  }
  const reviews = await Review.find({ bookId: bookId })
    .select("userId comment createdAt")
    .populate("userId", "firstName lastName");
  if (reviews === null) {
    return res.status(401).json({ message: "No Reviews" });
  }

  return res.status(200).json(reviews);
};

const likeBook = async (req, res) => {
  const { bookId, userId } = req.body;

  const book = await Book.findOne({ _id: bookId });
  const user = await User.exists({ _id: userId });
  if (book === null) {
    return res.status(401).json({ message: "book not valid" });
  }
  if (user === null) {
    return res.status(401).json({ message: "user not valid" });
  }

  const result = await Review.updateMany(
    { bookId, userId },
    { $set: { liked: true } },
    { upsert: true }
  );

  const totalLikes = await Review.aggregate([
    { $match: { bookId: book._id, liked: true } },
    { $group: { _id: "$userId" } },
    { $count: "total" },
  ]);

  book.totalLikes = totalLikes[0] ? totalLikes[0].total : 0;
  await book.save();

  return res
    .status(200)
    .json(book);
};

const unlikeBook = async (req, res) => {
  const { bookId, userId } = req.body;

  const book = await Book.findOne({ _id: bookId });
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

  const totalLikes = await Review.aggregate([
    { $match: { bookId: book._id, liked: true } },
    { $group: { _id: "$userId" } },
    { $count: "total" },
  ]);

  book.totalLikes = totalLikes[0] ? totalLikes[0].total : 0;
  await book.save();

  return res.status(200).json( book);
};

const userlikedbooks = async (req,res)=>{
  const {userId} = req.query;
  const user = await User.exists({_id : userId})
  if(!user){
    return res.status(401).json({message: "User ivalid"})
  }
  const likedReviews = await Review.find({userId: userId, liked: 'true'})
  const likedBookIds = [...new Set(likedReviews.map(review => review.bookId.toString()))];    //have unique bookId in array
  return res.status(200).json(likedBookIds)
}

export { addReview, getReviews, likeBook, unlikeBook, userlikedbooks};
