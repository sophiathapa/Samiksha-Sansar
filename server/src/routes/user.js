import express from "express";
import { addUser, deleteUser, getAllUsers, getUser } from "../controllers/user.js";
const router = express.Router()

router.get("/users",getAllUsers);
router.post('/add',addUser);
router.get('/put',getUser)
router.delete('/delete',deleteUser)

export default router