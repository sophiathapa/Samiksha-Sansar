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
  fetchSavedBooks,
} from "@/lib/redux/features/user/userThunks";
import BooksGridWithPagination from "@/components/user/BooksGridWithPagination";

const UserPage = () => {
  const [books, setBooks] = useState([]);
  const [newBooks, setNewBooks] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [genre, setGenre] = useState("");
  const user = useSelector((state: RootState) => state.user);
  const { id: userId, savedBooks } = user;
  const [selectBook, setSelectBook] = useState(null);

  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleSelectBook = (book) =>{
    setSelectBook(book);
  }

  const fetchBook = async () => {
    const fetchedBooks = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/allBooks`
    );
    setBooks(fetchedBooks.data);
  };

  const fetchNewBook = async () => {
    const fetchedNewBooks = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/newBooks`
    );
    setNewBooks(fetchedNewBooks.data);
  };

  const fetchPopularBook = async () => {
    const popularBooks = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/popularBooks`
    );
    setPopularBooks(popularBooks.data.books);
  };

  useEffect(() => {
    fetchBook();
    fetchNewBook();
    fetchPopularBook();
  }, []);

  useEffect(() => {
    if (userId) {
      dispatch(fetchLikedBooks(userId));
      dispatch(fetchBorrowedBooks(userId));
      dispatch(fetchReservedBooks(userId));
      dispatch(fetchSavedBooks(userId));
    }
  }, [userId, dispatch]);

  return (
    <>
      {/* Main content */}
      <main className="col-span-12 px-7 py-4">
        {!selectBook ? (
          <>
            <CategoryFilter genre={genre} setGenre={setGenre} />

            {genre === "" ? (
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
                        <Button
                          variant="hero"
                          onClick={() => router.push("books/popular")}
                        >
                          View full list
                        </Button>
                      </div>
                    </div>
                    <div className="lg:col-span-8">
                      <div className="shelf">
                        <div className="flex items-start gap-4 md:gap-6 overflow-x-auto">
                          {popularBooks.map((b, i) => (
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
                    New Arrivals
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    Explore Fresh Arrivals and Find Your Next Great Read.
                  </p>
                  <div className="mt-4 shelf">
                    <div className="flex items-start gap-4 md:gap-6 overflow-x-auto">
                      {newBooks.map((b, i) => (
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
            ) : genre === "All" ? (
              <BooksGridWithPagination query="books?" onBookSelect={handleSelectBook}  />
            ) : (
              <BooksGridWithPagination query={`books/genre?genre=${genre}&`} onBookSelect={handleSelectBook} />
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
