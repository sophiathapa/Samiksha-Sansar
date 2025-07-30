import express from "express";
import { addBook, deleteBook, getAllBooks, getBook } from "../controllers/book.js";

const router = express.Router()

router.get('/books',getAllBooks)
router.get('/book',getBook)
router.post('/addbook',addBook)
router.delete('/deletebook',deleteBook)

export default router