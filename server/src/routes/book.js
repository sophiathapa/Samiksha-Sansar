import express from "express";
import {
  addBook,
  deleteBook,
  getAllBook,
  getBookByGenre,
  searchBook,
  editBook,
  getFeaturedBook,
  getImageName,
  borrowBook,
  reserveBook,
  getBorrowedBook,
  getReservedBooks,
  removeBorrowedId,
  removeReservedBook,
  getUserBookStatus,
  getReservedBy,
  getNewBook,
  getPopularBook,
  fetchBookWithoutPagination,
  getBookById
} from "../controllers/book.js";
import { upload } from "../middleware/multer.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = express.Router();

router.post("/book",protect,  restrictTo("admin"), upload.single("coverImg"), addBook);
router.get("/books", protect, getAllBook);
router.get("/getBookById/:id", protect, getBookById)
router.get("/allBooks", protect, fetchBookWithoutPagination);
router.get("/newBooks", getNewBook);
router.get("/popularBooks", getPopularBook);
router.get("/featuredbooks", getFeaturedBook);
router.get("/books/search", protect, searchBook);
router.get("/books/genre", protect, getBookByGenre);
router.delete("/book", protect, restrictTo("admin"), deleteBook);
router.get("/getImageName", getImageName);
router.patch("/book/edit/:id", protect, restrictTo("admin"), upload.single("coverImg"), editBook);
router.patch("/borrowBook", protect, borrowBook);
router.patch("/reserveBook", protect, reserveBook);
router.get("/getBorrowedBooks", protect, getBorrowedBook);
router.get("/getReservedBooks", protect, getReservedBooks);
router.patch("/removeBorrowedBooks", protect,removeBorrowedId);
router.patch("/removeReservedBooks", protect, removeReservedBook);
router.get("/userBookStatus", protect, getUserBookStatus);
router.get("/getReservedBy", protect, getReservedBy);

export default router;
