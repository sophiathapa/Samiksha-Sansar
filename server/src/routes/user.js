import express from "express";
import {
  addBookToRead,
  getAllUsers,
  login,
  register,
} from "../controllers/user.js";

const router = express.Router();

router.get("/users", getAllUsers);
router.post("/register", register);
router.post("/login", login);
router.patch("/readingList", addBookToRead);
export default router;
