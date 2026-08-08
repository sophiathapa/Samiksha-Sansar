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
import upload from "../middleware/multer.js";

const router = express.Router();

router.post("/book", upload.single("coverImg"), addBook);
router.get("/books", getAllBook);
router.get("/getBookById/:id", getBookById)
router.get("/allBooks", fetchBookWithoutPagination);
router.get("/newBooks", getNewBook);
router.get("/popularBooks", getPopularBook);
router.get("/featuredbooks", getFeaturedBook);
router.get("/books/search", searchBook);
router.get("/books/genre", getBookByGenre);
router.delete("/book", deleteBook);
router.get("/getImageName", getImageName);
router.put("/book/edit", upload.single("coverImg"), editBook);
router.patch("/borrowBook", borrowBook);
router.patch("/reserveBook", reserveBook);
router.get("/getBorrowedBooks", getBorrowedBook);
router.get("/getReservedBooks", getReservedBooks);
router.patch("/removeBorrowedBooks",removeBorrowedId);
router.patch("/removeReservedBooks", removeReservedBook);
router.get("/userBookStatus", getUserBookStatus);
router.get("/getReservedBy", getReservedBy);

export default router;
