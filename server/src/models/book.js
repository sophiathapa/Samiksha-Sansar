import mongoose, { Schema } from "mongoose";

const bookSchema = new Schema({
  title: String,
  author: String,
  publishedDate: Date,
  publisher: String,
  description: String,
  genre: [String],
  averageRating: Number,
  featured : Boolean,
  language: String,
  coverImg: String,
  totalLikes: { type: Number, default: 0 },
  status : {
    type: String,
    enum: ["available","unavailable"],
    default: "available",
  },
  borrowerId: { type: Schema.Types.ObjectId, ref: "User" },
  reservedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  
},
{ timestamps: true });

const Book = mongoose.model("Book", bookSchema);
export default Book;
