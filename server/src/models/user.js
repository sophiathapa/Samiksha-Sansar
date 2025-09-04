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
  favouriteBooks :  [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
    }],

  savedBooks : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
    }],
});

const User = mongoose.model("User", userSchema);

export default User;
