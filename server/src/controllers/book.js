import { json } from "express";
import Book from "../models/book.js";

const addBook = async (req, res) => {
  const book = await Book.findOne({
    title: req.body.title,
    publishedDate: req.body.publishedDate,
  });

  if (book) {
    res.status(401).json({ message: "Book already exists" });
  }

  if (!req.file?.filename) {
    return res.status(400).json({ message: "Image is required" });
  }

  req.body.coverImg = req.file.filename;
  req.body.genre = JSON.parse(req.body.genre);
  await Book.create(req.body);
  res.status(201).json("Book created");
};

const getAllBook = async (req, res) => {
  const books = await Book.find();
  res.status(200).json(books);
};

const deleteBook = async (req, res) => {
  await Book.deleteOne({ _id: req.query.id });
  res.status(200).json("Book deleted");
};

const searchBook = async (req, res) => {
  const { search } = req.query;
  const searchedBooks = await Book.find({
    $or: [
      { title: { $regex: `${search}`, $options: "i" } },
      { author: { $regex: `${search}`, $options: "i" } },
    ],
  });

  if (!searchedBooks) {
    return res.status(401).json({ message: "Not found" });
  }
  return res.status(200).json(searchedBooks);
};

const getBookByGenre = async (req, res) => {
  const { genre } = req.query;

  const book = await Book.find({
    genre: genre,
  });

  res.json(book);
};

const editBook = async (req, res) => {
  const { id } = req.query;
  req.body.coverImg = req.file?.filename;
  req.body.genre = JSON.parse(req.body.genre);
  await Book.findByIdAndUpdate(id, { $set: req.body }, { $new: true });

  if (!req.query.id) {
    return res.status(401).json(" Book with that id not found");
  }

  return res.status(200).json("Book updated");
};

export {
  addBook,
  deleteBook,
  getAllBook,
  searchBook,
  getBookByGenre,
  editBook,
};
