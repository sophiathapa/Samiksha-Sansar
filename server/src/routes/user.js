import express from "express";
import {
  addBookToRead,
  getAllUsers,
  getSavedBooks,
  login,
  register,
} from "../controllers/user.js";

const router = express.Router();

router.get("/users", getAllUsers);
router.post("/register", register);
router.patch("/readingList", addBookToRead);
router.get("/savedBooks", getSavedBooks);
export default router;
