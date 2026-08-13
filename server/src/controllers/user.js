import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/email.js";

const getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

const getUserProfile = async(req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findOne ({ _id : userId }).select("firstName middleName lastName email gender profileUrl country genreLiked language");
    if(!user) {
      return res.status(404).json({ message: "user not found" });
    }
    return res.status(200).json({ user: user });
  } catch(error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }

}

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

  return res.status(201).json({
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

  const token = jwt.sign({ id: user?._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const { password: _, ...userWithoutPassword } = user.toObject();

  return res.status(200).json({ message: "Login successful", user: userWithoutPassword, isLoggedIn: true });
};

const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "not found"});
    } else {
      return res.status(200).json({ user: req.user });
    }
  } catch(error) {
    console.log(error);
      return res.status(500).json({message: "Internal Server Error" });
  }
};
 
const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  return res.status(200).json({ message: "Logged out" });
};

const saveBook = async (req, res) => {
  const { bookId } = req.body;
  const userId = req.user?._id.toString();
  const user = await User.findOne({ _id: userId });
  const book = user.savedBooks.includes(bookId);
  if (!book) {
    await User.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        $push: { savedBooks: bookId },
      },
    );

    return res.status(201).json({ message: "Book saved" });
  } else return res.status(200).json({ message: "Book already saved" });
};

const getSavedBooks = async (req, res) => {
  try {
    const { all } = req.query;
    const userId = req.user?._id.toString();
    if (all === "yes") {
      const savedBooks = await User.findOne({ _id: userId }, { savedBooks: 1 }).populate("savedBooks");
      res.json(savedBooks);
    }

    if (all === "no") {
      const user = await User.findOne({ _id: userId });
      const savedBooks = user.savedBooks;
      res.json(savedBooks);
    }
  } catch (err) {
    console.error("Error fetching reserved books:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const removeSavedBooks = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user?._id.toString();
    const user = await User.findOne({ _id: userId });

    if (!user.savedBooks.includes(bookId)) {
      return res.json({ message: "Book of that id not saved" });
    }

    const newSavedBooks = user.savedBooks.filter((book) => book.toString() !== bookId);
    user.savedBooks = newSavedBooks;
    user.save();
    return res.json({ message: " Cancel Save" });
  } catch (err) {
    console.error("Error fetching reserved books:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getLikedBooks = async (req, res) => {
  try {
    const userId = req.user?._id.toString();

    if (all === "yes") {
      const LikedBooks = await User.findOne({ _id: userId }, { LikedBooks: 1 }).populate("LikedBooks");
      res.json(LikedBooks);
    }

    if (all === "no") {
      const user = await User.findOne({ _id: userId });
      const LikedBooks = user.LikedBooks;
      res.json(LikedBooks);
    }
  } catch (err) {
    console.error("Error fetching reserved books:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const editProfile = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "User not found" });
    }

    const protectedFields = ["password", "role", "email", "likedBooks", "_id", "savedBooks", "favouriteBooks"];

    const updates = {};
    for (const key of Object.keys(req.body)) {
      if (!protectedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    }

    if (updates.genreLiked !== undefined) {
      try {
        updates.genreLiked = JSON.parse(updates.genreLiked);
      } catch {
        return res.status(400).json({ message: "genreLiked must be valid JSON" });
      }
    }

    if (req.file?.path) {
      updates.profileUrl = req.file.path;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    return res.status(200).json({ message: "Profile updated", user: updatedUser });
  } catch (error) {
    console.error("editProfile error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { getAllUsers, getUserProfile, register, login, getMe, logout, saveBook, getSavedBooks, removeSavedBooks, getLikedBooks, editProfile };
