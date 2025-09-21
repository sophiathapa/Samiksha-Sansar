import { createSlice } from "@reduxjs/toolkit";
import {
  fetchBorrowedBooks,
  fetchLikedBooks,
  fetchReservedBooks,
} from "./userThunks";

export interface UserState {
  id: string;
  name: string;
  email: string;
  token: string;
  likedBooks: string[];
  borrowedBooks: string[];
  reservedBooks: string[];
}

const initialState: UserState = {
  id: "",
  name: "",
  email: "",
  token: "",
  likedBooks: [],
  borrowedBooks: [],
  reservedBooks: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.token = action.payload.token;
    },

    addLikedBook: (state, action) => {
      if (!state.likedBooks.includes(action.payload)) {
        state.likedBooks.push(action.payload);
      }
    },
    removeLikedBook: (state, action) => {
      state.likedBooks = state.likedBooks.filter((id) => id !== action.payload);
    },

    addBorrowedBook: (state, action) => {
      if (!state.borrowedBooks.includes(action.payload)) {
        state.borrowedBooks.push(action.payload);
      }
    },
    removeBorrowedBook: (state, action) => {
      state.borrowedBooks = state.borrowedBooks.filter(
        (id) => id !== action.payload
      );
    },

    addReserveBook: (state, action) => {
      if (!state.reservedBooks.includes(action.payload)) {
        state.reservedBooks.push(action.payload);
      }
    },
    removeReservedBook: (state, action) => {
      state.reservedBooks = state.reservedBooks.filter(
        (id) => id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLikedBooks.fulfilled, (state, action) => {
      state.likedBooks = action.payload;
    });
    builder.addCase(fetchBorrowedBooks.fulfilled, (state, action) => {
      state.borrowedBooks = action.payload;
    });
    builder.addCase(fetchReservedBooks.fulfilled, (state, action) => {
      state.reservedBooks = action.payload;
    });
  },
});

// Action creators are generated for each case reducer function
export const {
  setUser,
  addLikedBook,
  removeLikedBook,
  addBorrowedBook,
  removeBorrowedBook,
  addReserveBook,
  removeReservedBook,
} = userSlice.actions;

export default userSlice.reducer;
