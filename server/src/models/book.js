import mongoose, { Schema } from "mongoose";

const bookSchema = new Schema({
  title: String,
  aurthor: String,
  publishedDate: Date,
  publisher: String,
  description: String,
  genre: [String],
  averageRating: Number,
  language: String,
  coverImg: String,
  totalCounts: Number,
});

const Book = mongoose.model("Book", bookSchema);
export default Book;
