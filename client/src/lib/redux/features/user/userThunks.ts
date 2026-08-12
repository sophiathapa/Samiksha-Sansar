import api from "@/lib/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch liked books
const fetchLikedBooks = createAsyncThunk("user/fetchLikedBooks", async (userId: string) => {
  const { data } = await api.get(`/getLikedBooks?all=no`);
  return data; // array of bookIds
});

const fetchBorrowedBooks = createAsyncThunk("user/fetchBorrowedBooks", async (userId: string) => {
  const { data } = await api.get(`/getBorrowedBooks?all=no`);
  return data; // array of bookIds
});

const fetchReservedBooks = createAsyncThunk("user/fetchReservedBooks", async (userId: string) => {
  const { data } = await api.get(`/getReservedBooks?all=no`);
  return data; // array of bookIds
});

const fetchSavedBooks = createAsyncThunk("user/fetchSavedBooks", async (userId: string) => {
  const { data } = await api.get(`/getSavedBooks?all=no`);
  return data; // array of bookIds
});

export { fetchLikedBooks, fetchBorrowedBooks, fetchReservedBooks, fetchSavedBooks };
