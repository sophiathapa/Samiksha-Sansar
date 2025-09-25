"use client";
import CategoryFilter from "@/components/user/CategoryFilter";
import BookCard, { Book } from "@/components/user/BookCard";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import BookDetailCard from "@/components/BookDetailCard";

import { persistor, RootState, useAppDispatch } from "@/lib/redux/store";
import { useRouter } from "next/navigation";
import {
  fetchBorrowedBooks,
  fetchLikedBooks,
  fetchReservedBooks,
} from "@/lib/redux/features/user/userThunks";
import { setUser } from "@/lib/redux/features/user/userSlice";

const UserPage = () => {
  const [books, setBooks] = useState([]);
  const [genre, setGenre] = useState("All");
  const user = useSelector((state: RootState) => state.user);
  const { id: userId, borrowedBooks } = user;
  const [bookByGenre, setBookByGenre] = useState([]);
  const [selectBook, setSelectBook] = useState(null);

  const [searchBooks, setSearchBooks] = useState([]);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const fetchBook = async () => {
    const fetchedBooks = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/books`
    );
    setBooks(fetchedBooks.data);
  };

  const fetchBookByGenre = async () => {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/books/genre?genre=${genre}`
    );
    setBookByGenre(data);
  };

  useEffect(() => {
    fetchBook();
  }, []);

  useEffect(() => {
    fetchBookByGenre();
  }, [genre]);

  useEffect(() => {
    if (userId) {
      dispatch(fetchLikedBooks(userId));
      dispatch(fetchBorrowedBooks(userId));
      dispatch(fetchReservedBooks(userId));
    }
  }, [userId, dispatch]);

  return (
    <>
      {/* Main content */}
      <main className="col-span-12 px-7 py-4">
        {searchBooks && (
          <div className=" flex gap-5 mt-5">
            {searchBooks.map((book, id) => {
              return (
                <BookCard
                  key={id}
                  book={book}
                  onClick={() => {
                    setSelectBook(book);
                  }}
                />
              );
            })}
          </div>
        )}

        {!selectBook ? (
          <>
            <CategoryFilter genre={genre} setGenre={setGenre} />

            {genre === "All" ? (
              <>
                {/* Popular Bestsellers */}
                <section
                  className="mt-6 md:mt-8"
                  aria-labelledby="popular-heading"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-4">
                      <h1
                        id="popular-heading"
                        className="text-2xl md:text-3xl font-bold tracking-tight"
                      >
                        Popular Bestsellers
                      </h1>
                      <p className="mt-2 text-muted-foreground">
                        We picked up the most popular books for you, based on
                        your taste. Check it.
                      </p>
                      <div className="mt-4">
                        <Button variant="hero">View full list</Button>
                      </div>
                    </div>
                    <div className="lg:col-span-8">
                      <div className="shelf">
                        <div className="flex items-start gap-4 md:gap-6 overflow-x-auto">
                          {books.map((b, i) => (
                            <BookCard
                              key={i}
                              book={b}
                              featured
                              onClick={() => {
                                setSelectBook(b);
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Can be interesting */}
                <section
                  className="mt-8 md:mt-10"
                  aria-labelledby="interesting-heading"
                >
                  <h2
                    id="interesting-heading"
                    className="text-xl md:text-2xl font-bold tracking-tight"
                  >
                    Can be interesting
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    Check this list of books, picked up by the website and
                    choose something new!
                  </p>
                  <div className="mt-4 shelf">
                    <div className="flex items-start gap-4 md:gap-6 overflow-x-auto">
                      {books.map((b, i) => (
                        <BookCard
                          key={i}
                          book={b}
                          onClick={() => {
                            setSelectBook(b);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </section>
              </>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4 md:gap-3 mt-10">
                {bookByGenre.map((b, i) => (
                  <BookCard
                    key={i}
                    book={b}
                    onClick={() => {
                      setSelectBook(b);
                    }}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <BookDetailCard
            book={selectBook}
            onBack={() => {
              fetchBook();
              setSelectBook(null);
            }}
          />
        )}
      </main>
    </>
  );
};

export default UserPage;
