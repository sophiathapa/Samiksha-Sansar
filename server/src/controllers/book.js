import { json } from "express"
import Book from "../models/book.js"

const addBook = async(req,res) =>{
  const book = await Book.findOne({
    title: req.body.title,
    publishedDate : req.body.publishedDate
  })

  if (book){
    res.status(401).json({message:"Book already exists"})
  }

  if (!req.file?.filename)
  {
     return res.status(400).json({ message: "Image is required" });
  }

  req.body.coverImg = req.file.filename
  req.body.genre = JSON.parse(req.body.genre)
  await Book.create(req.body)
  res.status(201).json("Book created")
}

const deleteBook = async(req,res)=>{
  await Book.deleteOne({_id : req.query.id})
  res.status(200).json("Book deleted")
}


export{ addBook,deleteBook}