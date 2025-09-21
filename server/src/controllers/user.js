import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/email.js";
import Book from "../models/book.js";

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

const addBookToRead = async (req, res) => {
  const { bookId, userId } = req.body;
  const user = await User.findOne({_id: userId});
  const book = user.readingList.includes(bookId);
  if (!book) {
    await User.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        $push: { readingList: bookId },
      }
    );

    return res.status(201).json({ message: "Book added to reading list" });
  } else
    return res
      .status(200)
      .json({ message: "Book already added to reading list" });
};

export { getAllUsers, register, login, addBookToRead };
