import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch liked books
const fetchLikedBooks = createAsyncThunk(
  "user/fetchLikedBooks",
  async (userId) => {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/userlikedbooks?userId=${userId}`
    );
    return data; // array of bookIds
  }
);

const fetchBorrowedBooks = createAsyncThunk(
  "user/fetchBorrowedBooks",
  async (userId) => {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/getBorrowedBooks?userId=${userId}`
    );
    return data; // array of bookIds
  }
);

export { fetchLikedBooks, fetchBorrowedBooks };
