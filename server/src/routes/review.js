import express from "express";
import { addReview, deleteReview, getReviews, likeBook, likeComment, replyComment, reportComment, unlikeBook } from "../controllers/review.js";

const router = express.Router();

router.post("/review", addReview);
router.get("/reviews", getReviews);
router.patch("/like", likeBook);
router.patch("/unlike", unlikeBook);
router.post("/replyComment", replyComment);
router.patch("/likeComment", likeComment);
router.delete("/deleteComment", deleteReview);
router.get("/reportComment", reportComment);
export default router;