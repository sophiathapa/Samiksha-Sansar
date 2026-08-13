import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    middleName: {
      type: String,
      trim: true,
      default: "",
    },

    profileUrl: {
      type: String,
      default: "",
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "Other",
    },

    country: {
      type: String,
      trim: true,
      default: "",
    },

    language: {
      type: String,
      trim: true,
      default: "",
    },

    genreLiked: [
      {
        type: String,
        trim: true,
      },
    ],

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    favouriteBooks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Book",
      },
    ],

    savedBooks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Book",
      },
    ],

    likedBooks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
