"use client";
import CategoryFilter from "@/components/user/CategoryFilter";
import BookCard from "@/components/user/BookCard";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import BooksGridWithPagination from "@/components/user/BooksGridWithPagination";
import { Book } from "@/types/book";

const UserPage = () => {
  const [newBooks, setNewBooks] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [genre, setGenre] = useState("");
  const router = useRouter();

  const handleSelectBook = (book: Book) => {
    router.push(`/user/books/${book._id}`);
  };

  const fetchNewBook = async () => {
    const fetchedNewBooks = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/newBooks`);
    setNewBooks(fetchedNewBooks.data);
  };

  const fetchPopularBook = async () => {
    const popularBooks = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/popularBooks`);
    setPopularBooks(popularBooks.data.books);
  };

  useEffect(() => {
    fetchNewBook();
    fetchPopularBook();
  }, []);

  return (
    <>
      {/* Main content */}
      <main className="col-span-12 px-7 py-4">
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
                            handleSelectBook(b);
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
                        handleSelectBook(b);
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
      </main>
    </>
  );
};

export default UserPage;
