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

const addFavoriteBooks = async(req,res)=>{
  const {userId, bookId} = req.body
  const user = await User.findById(userId)
  if (!user){
    return res.json({message : "user doesnot exit"})
  }
  if (user.favouriteBooks.includes(bookId)){
    return res.status(400).json({ message: "Book already added to favorites" });
  }
  user.favouriteBooks.push( bookId)
  await user.save()
  return res.status(201).json({message : "Book added to favorites"})

}

export { getAllUsers, register, login,addFavoriteBooks };

