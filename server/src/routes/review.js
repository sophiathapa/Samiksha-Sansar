import express from "express";
import { addReview, getReviews, likeBook, likeComment, replyComment, unlikeBook, unlikeComment } from "../controllers/review.js";

const router = express.Router();

router.post("/review", addReview);
router.get("/reviews", getReviews);
router.patch("/like", likeBook);
router.patch("/unlike", unlikeBook);
router.post("/replyComment", replyComment);
router.patch("/likeComment", likeComment);
router.patch("/unlikeComment", unlikeComment);
export default router;