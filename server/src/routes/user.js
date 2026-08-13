import express from "express";
import {
  getAllUsers,
  getUserProfile,
  getSavedBooks,
  login,
  register,
  removeSavedBooks,
  saveBook,
  getLikedBooks,
  logout,
  getMe,
  editProfile,
} from "../controllers/user.js";
import { protect } from "../middleware/auth.js";
import { uploadProfile } from "../middleware/multer.js";

const router = express.Router();

router.get("/users",protect, getAllUsers);
router.get("/userProfile",protect, getUserProfile);
router.patch("/userProfile",protect, uploadProfile.single("profileUrl"), editProfile);
router.post("/register", register);
router.post("/login", login);
router.get("/user", getMe);
router.post("/logout", logout);
router.patch("/saveBook", protect, saveBook);
router.get("/getSavedBooks", protect, getSavedBooks);
router.patch("/removeSavedBook", protect, removeSavedBooks);
router.get("/getLikedBooks", protect, getLikedBooks);
export default router;
