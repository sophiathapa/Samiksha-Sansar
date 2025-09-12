import express from "express";
import { addReview, getReviews, likeBook, unlikeBook } from "../controllers/review.js";

const router = express.Router();

router.post("/review", addReview);
router.get("/reviews", getReviews);
router.patch("/like", likeBook);
router.patch("/unlike", unlikeBook);

export default router;