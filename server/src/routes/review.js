import express from "express";
import { addReview, deleteReview, getReviews, likeBook, likeComment, replyComment, reportComment, unlikeBook } from "../controllers/review.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/review", protect, addReview);
router.get("/reviews", protect, getReviews);
router.patch("/like", protect, likeBook);
router.patch("/unlike", protect, unlikeBook);
router.post("/replyComment", protect, replyComment);
router.patch("/likeComment", protect, likeComment);
router.delete("/deleteComment", protect, deleteReview);
router.get("/reportComment", protect, reportComment);
export default router;