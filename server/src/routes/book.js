import express from "express";
import {
  addBook,
  deleteBook,
  getAllBook,
  getBookByGenre,
  searchBook,
  editBook,
  getFeaturedBook,
} from "../controllers/book.js";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + Math.round(Math.random());
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/book", upload.single("coverImg"), addBook);
router.get("/books", getAllBook);
router.get("/featuredbooks", getFeaturedBook);
router.get("/books/search", searchBook);
router.get("/books/genre", getBookByGenre);
router.delete("/book", deleteBook);
router.put("/book/edit", upload.single("coverImg"), editBook);

export default router;
