import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/email.js";

const getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

const register = async (req, res) => {
  const userExist = await User.exists({ email: req.body.email });
  if (userExist) {
    return res.status(400).json({ message: "Email already exist" });
  }
  // hashing the plainText password
  req.body.password = await bcrypt.hash(req.body.password, 10);

  await User.create(req.body);
  await sendEmail({
    to: req.body.email,
    subject: "Welcome to Book Club 🎉",
    text: `Hi ${req.body.firstName}, thanks for registering!`,
    html: `<h1>Hello ${req.body.firstName}</h1><p>Welcome to Book Club 🎉</p>`,
  });

  return res.json({
    message: "User registered successfully",
    user: req.body,
    isRegisteredIn: true,
  });
};

const login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ message: "Incorrect email" });
  }

  const IsMatched = await bcrypt.compare(req.body.password, user.password);
  if (!IsMatched) {
    return res.status(401).json({ message: "Invalid Password" });
  }

  const token = jwt.sign(
    { email: req.body.email, role: user.role },
    process.env.JWT_SECRET
  );
  return res
    .status(200)
    .json({ message: "Login successful", token, user: user, isLoggedIn: true });
};

const saveBook = async (req, res) => {
  const { bookId, userId } = req.body;
  const user = await User.findOne({ _id: userId });
  const book = user.savedBooks.includes(bookId);
  if (!book) {
    await User.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        $push: { savedBooks: bookId },
      }
    );

    return res.status(201).json({ message: "Book saved" });
  } else return res.status(200).json({ message: "Book already saved" });
};

const getSavedBooks = async (req, res) => {
  try {
    const { userId, all } = req.query;
    if (all === "yes") {
      const savedBooks = await User.findOne(
        { _id: userId },
        { savedBooks: 1 }
      ).populate("savedBooks");
      res.json(savedBooks);
    }

    if (all === "no") {
      const book = await User.findOne({ _id: userId });
      const savedBooks = book.savedBooks;
      res.json(savedBooks);
    }
  } catch (err) {
    console.error("Error fetching reserved books:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const removeSavedBooks = async (req, res) => {
  try {
    const { userId, bookId } = req.body;
    const user = await User.findOne({ _id: userId });

    if (!user.savedBooks.includes(bookId)) {
    return res.json({ message: "Book of that id not saved" });
    }
    
    const newSavedBooks = user.savedBooks.filter(
      (book) => book.toString() !== bookId
    );
    user.savedBooks = newSavedBooks;
    user.save();
    return res.json({ message: " Cancel Save" });

  } catch (err) {
    console.error("Error fetching reserved books:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export { getAllUsers, register, login, saveBook, getSavedBooks ,removeSavedBooks};
