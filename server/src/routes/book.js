import express from "express";
import { addBook, deleteBook } from "../controllers/book.js";
import multer from 'multer'

const router = express.Router()

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + Math.round(Math.random())
    cb(null, uniqueSuffix + file.originalname)
  }
})

const upload = multer({ storage: storage })

router.post('/book', upload.single('coverImg'),addBook)
router.delete('/book',deleteBook)

export default router