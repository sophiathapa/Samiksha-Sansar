import express from "express";
import { searchQuery } from "../controllers/bookAI.js";


const router = express.Router();

router.post("/bookAI",searchQuery );

export default router;