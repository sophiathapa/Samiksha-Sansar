import express from "express";
import {
  getAllUsers,
  getSavedBooks,
  login,
  register,
  removeSavedBooks,
  saveBook,
  getLikedBooks,
  logout,
  getMe,
} from "../controllers/user.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/users",protect, getAllUsers);
router.post("/register", register);
router.post("/login", login);
router.get("/user", getMe);
router.post("/logout", logout);
router.patch("/saveBook", protect, saveBook);
router.get("/getSavedBooks", protect, getSavedBooks);
router.patch("/removeSavedBook", protect, removeSavedBooks);
router.get("/getLikedBooks", protect, getLikedBooks);
export default router;
