import Book from "../models/book.js";
import User from "../models/user.js";

const addBook = async (req, res) => {
  const book = await Book.findOne({
    title: req.body.title,
    publishedDate: req.body.publishedDate,
  });

  if (book) {
    res.status(401).json({ message: "Book already exists" });
  }

  if (!req.file?.filename) {
    return res.status(400).json({ message: "Image is required" });
  }

  req.body.coverImg = req.file.filename;
  req.body.genre = JSON.parse(req.body.genre);
  await Book.create(req.body);
  res.status(201).json("Book created");
};

const getAllBook = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;

  const skip = (page - 1) * limit;

  const books = await Book.find().skip(skip).limit(limit);

  const total = await Book.countDocuments();

  res.json({
    books,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  });
};

const getFeaturedBook = async (req, res) => {
  const books = await Book.find({ featured: true });
  res.status(200).json(books);
};

const getPopularBook = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;

  const skip = (page - 1) * limit;

  const books = await Book.find({ popular: true }).skip(skip).limit(limit);

  const total = await Book.countDocuments({ popular: true });

  res.json({
    books,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  });
};

const getBookByGenre = async (req, res) => {
  const { genre } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;

  const skip = (page - 1) * limit;

  const books = await Book.find({ genre: genre }).skip(skip).limit(limit);

  const total = await Book.countDocuments({ genre: genre });

  res.json({
    books,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  });
};
const getNewBook = async (req, res) => {
  const books = await Book.find().sort({ createdAt: -1 }).limit(8);
  res.status(200).json(books);
};

const deleteBook = async (req, res) => {
  await Book.deleteOne({ _id: req.query.id });
  res.status(200).json("Book deleted");
};

const searchBook = async (req, res) => {
  const { search } = req.query;
  const searchedBooks = await Book.find({
    $or: [
      { title: { $regex: `${search}`, $options: "i" } },
      { author: { $regex: `${search}`, $options: "i" } },
    ],
  });

  if (!searchedBooks) {
    return res.status(401).json({ message: "Not found" });
  }
  return res.status(200).json(searchedBooks);
};

const editBook = async (req, res) => {
  const { id } = req.query;
  req.body.coverImg = req.file?.filename;
  req.body.genre = JSON.parse(req.body.genre);
  await Book.findByIdAndUpdate(id, { $set: req.body }, { $new: true });

  if (!req.query.id) {
    return res.status(401).json(" Book with that id not found");
  }

  return res.status(200).json("Book updated");
};

const getImageName = async (req, res) => {
  const { title } = req.query;
  const book = await Book.findOne({ title: title });
  if (!book) {
    return res.status(401).json({ message: "no book in that name" });
  }
  return res.status(200).json(book.coverImg);
};

const borrowBook = async (req, res) => {
  const { userId, bookId } = req.body;
  const user = await User.exists({ _id: userId });
  if (!user) {
    return res.status(401).json({ message: "invalid user" });
  }
  const book = await Book.findOne({ _id: bookId, borrowerId: null });

  if (book.reservedBy.includes(userId)) {
    book.reservedBy = book.reservedBy.filter(
      (user) => user.toString() !== userId
    );
  }
  book.borrowerId = userId;
  book.status = "unavailable";
  book.save();

  if (!book) {
    return res.status(401).json({ message: "book not found" });
  }
  return res.status(201).json(book.status);
};

const reserveBook = async (req, res) => {
  const { userId, bookId } = req.body;
  const user = await User.exists({ _id: userId });
  if (!user) {
    return res.status(401).json({ message: "invalid user" });
  }

  const book = await Book.findOneAndUpdate(
    { _id: bookId },
    {
      $push: { reservedBy: userId },
    },
    { new: true }
  );
  if (!book) {
    return res.status(401).json({ message: "book not found" });
  }
  return res.status(201).json(book.status);
};

const getBorrowedBook = async (req, res) => {
  try {
    const { userId, all } = req.query;
    if (all === "no") {
      const books = await Book.find({ borrowerId: userId }, { _id: 1 });
      const borrowedBooks = books.map((book) => book._id.toString());
      return res.json(borrowedBooks);
    }

    if (all === "yes") {
      const books = await Book.find({ borrowerId: userId });
      return res.json(books);
    }
  } catch (err) {
    console.error("Error fetching reserved books:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getReservedBooks = async (req, res) => {
  try {
    const { userId, all } = req.query;
    if (all === "no") {
      const reservedBooks = await Book.find(
        { reservedBy: userId },
        { _id: 1 }
      ).lean();

      const reservedBooksById = reservedBooks.map((book) =>
        book._id.toString()
      );

      return res.json(reservedBooksById);
    }

    if (all === "yes") {
      const reservedBooks = await Book.find({ reservedBy: userId }).lean();
      return res.json(reservedBooks);
    }
  } catch (err) {
    console.error("Error fetching reserved books:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const removeBorrowedId = async (req, res) => {
  try {
    const { userId, bookId } = req.body;
    const book = await Book.findOneAndUpdate(
      { _id: bookId, borrowerId: userId },
      { $unset: { borrowerId: "" }, $set: { status: "available" } },
      { new: true }
    );

    return res.status(200).json(book?.status);
  } catch (err) {
    console.error("Error fetching reserved books:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const removeReservedBook = async (req, res) => {
  try {
    const { userId, bookId } = req.body;
    const book = await Book.findOne({ _id: bookId });

    if (book.reservedBy.includes(userId)) {
      const newReservedBy = book.reservedBy.filter(
        (user) => user.toString() !== userId
      );
      book.reservedBy = newReservedBy;
      book.save();
    }

    return res.json({ message: "cancel reserve" });
  } catch (err) {
    console.error("Error fetching reserved books:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getUserBookStatus = async (req, res) => {
  try {
    const { userId, bookId } = req.query;
    const book = await Book.findOne({ _id: bookId });
    if (book.borrowerId?.toString() === userId) {
      return res.json({ status: "borrowed" });
    }

    if (book.reservedBy?.includes(userId)) {
      return res.json({ status: "reserved" });
    }
    if (!book.borrowerId) {
      return res.json({ status: "available" });
    }

    return res.json({ status: "unavailable" });
  } catch (err) {
    console.error("Error fetching reserved books:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getReservedBy = async (req, res) => {
  const { bookId } = req.query;
  const book = await Book.findOne({ _id: bookId });

  const reservedUsers = book.reservedBy?.map((user) => user.toString());
  res.json(reservedUsers);
};

export {
  addBook,
  deleteBook,
  getAllBook,
  searchBook,
  getBookByGenre,
  editBook,
  getFeaturedBook,
  getImageName,
  borrowBook,
  reserveBook,
  getBorrowedBook,
  getReservedBooks,
  removeBorrowedId,
  removeReservedBook,
  getUserBookStatus,
  getReservedBy,
  getNewBook,
  getPopularBook,
};
