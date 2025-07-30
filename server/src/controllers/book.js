import { json } from "express"
import Book from "../models/book.js"

const getAllBooks = async(req,res)=>{
  const books = await Book.find()
  res.json(books)
}

const getBook = async(req,res)=>{
  const book = await Book.findById(req.query.id)
  res.json(book)
}

const addBook = async(req,res)=>{
  await Book.create(req.body)
  res.json({message:"Book added to the database"})
}

const deleteBook = async(req,res)=>{
  await Book.findByIdAndDelete(req.query.id)
  res.json({message:"Book deleted from the database"})
}

export {getAllBooks,getBook,deleteBook,addBook}