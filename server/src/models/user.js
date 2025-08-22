import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  // ratedBooks: [
  //   {
  //     bookId: String,
  //     rating: Number,
  //   },
  // ],
  // favoriteGenres: [String],
});

const User = mongoose.model("User", userSchema);

export default User;
