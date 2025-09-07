import express from "express";
import {
  addFavoriteBooks,
  getAllUsers,
  login,
  register,
  removeFavoriteBooks,
} from "../controllers/user.js";
const router = express.Router();

router.get("/users", getAllUsers);
router.post("/register", register);
router.post("/login", login);
router.patch("/favorite", addFavoriteBooks);
router.patch("/removefavorite", removeFavoriteBooks);

export default router;
