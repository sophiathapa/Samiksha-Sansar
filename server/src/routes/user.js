import express from "express";
import {
  getAllUsers,
  getSavedBooks,
  login,
  register,
  removeSavedBooks,
  saveBook,
} from "../controllers/user.js";

const router = express.Router();

router.get("/users", getAllUsers);
router.post("/register", register);
router.post("/login", login);
router.patch("/saveBook", saveBook);
router.get("/getSavedBooks", getSavedBooks);
router.patch("/removeSavedBook", removeSavedBooks);
export default router;
