"use client";
import CategoryFilter from "@/components/user/CategoryFilter";
import BookCard, { Book } from "@/components/user/BookCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
} from "lucide-react";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";


const UserPage = () => {
  const [books, setBooks] = useState([]);
  const [genre, setGenre] = useState("All");
  const count = useSelector((state)=>state.counter.value)

  const fetchBook = async () => {
    const fetchedBooks = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/books`
    );
    setBooks(fetchedBooks.data);
  };

  useEffect(() => {
    fetchBook();
  }, []);

  return (
    <>
      <div className="min-h-screen bg-app-gradient">
        <div className="mx-auto max-w-7xl grid grid-cols-12 gap-6 px-4 py-6 md:py-8">
          {/* Main content */}
          <main className="col-span-12">
            <header className="flex items-center gap-4 rounded-2xl bg-card p-3 md:p-4 shadow-sm">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search name of the book or author…"
                  className="pl-9"
                  aria-label="Search books"
                />
              </div>
              <Avatar>
                <AvatarFallback>K</AvatarFallback>
              </Avatar>
            </header>

            <div className="mt-4 md:mt-6">
              <CategoryFilter genre={genre} setGenre={setGenre} />
            </div>

            {/* Popular Bestsellers */}
            <section className="mt-6 md:mt-8" aria-labelledby="popular-heading">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-4">
                 <h3>
                  Redux value: {count}
                 </h3>
                
                  <h1
                    id="popular-heading"
                    className="text-2xl md:text-3xl font-bold tracking-tight"
                  >
                    Popular Bestsellers
                  </h1>
                  <p className="mt-2 text-muted-foreground">
                    We picked up the most popular books for you, based on your
                    taste. Check it.
                  </p>
                  <div className="mt-4">
                    <Button variant="hero">View full list</Button>
                  </div>
                </div>
                <div className="lg:col-span-8">
                  <div className="shelf">
                    <div className="flex items-start gap-4 md:gap-6 overflow-x-auto">
                      {books.map((b, i) => (
                        <BookCard key={i} book={b} featured />
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
                Check this list of books, picked up by the website and choose
                something new!
              </p>
              <div className="mt-4 shelf">
                <div className="flex items-start gap-4 md:gap-6 overflow-x-auto">
                  {books.map((b, i) => (
                    <BookCard key={i} book={b} />
                  ))}
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
};

export default UserPage;
