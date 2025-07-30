import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  email: String,
  phoneNumber: String,
  password : String,
  role: {
    type: String,
    enum: ["user", "admin"],
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