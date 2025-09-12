import mongoose, { Schema } from "mongoose";

const bookSchema = new Schema({
  title: String,
  author: String,
  publishedDate: Date,
  publisher: String,
  description: String,
  genre: [String],
  averageRating: Number,
  language: String,
  coverImg: String,
  totalLikes: { type: Number, default: 0 },
  
});

const Book = mongoose.model("Book", bookSchema);
export default Book;
