import express from "express";
import { addFavoriteBooks, getAllUsers, login, register } from "../controllers/user.js";
const router = express.Router();

router.get("/users", getAllUsers);
router.post("/register", register);
router.post("/login", login);
router.post("/favorite",addFavoriteBooks)

export default router;
