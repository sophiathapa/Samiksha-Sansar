import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchBorrowedBooks, fetchLikedBooks } from "./userThunks";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    id: "",
    name: "",
    email: "",
    token: "",
    likedBooks: [],
    borrowedBooks: [],
    reservedBook: [],
  },
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

    reserveBook: (state, action) => {
      state.reservedBook.push(action.payload);
    },
    removeReservedBook: (state, action) => {
      state.reservedBook = state.reservedBook.filter(
        (id) => id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLikedBooks.fulfilled, (state, action) => {
      state.likedBooks = action.payload; // overwrite with API data
    });
    builder.addCase(fetchBorrowedBooks.fulfilled, (state, action) => {
      state.borrowedBooks = action.payload; // overwrite with API data
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
} = userSlice.actions;

export default userSlice.reducer;
