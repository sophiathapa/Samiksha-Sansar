"use client";
import BookDetailCard from "@/components/user/BookDetailCard";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import BooksGridWithPagination from "@/components/user/BooksGridWithPagination";
import CategoryFilter from "@/components/user/CategoryFilter";
import api from "@/lib/axios";
import { Book } from "@/types/book";
import axios from "axios";
import { CircleX, Loader2, Search } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

const SEARCH_DEBOUNCE_MS = 500;

const Home = () => {
  const [search, setSearch] = useState("");
  const [searchBooks, setSearchBooks] = useState<Book[] | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [genre, setGenre] = useState("All");
  const [selectBook, setSelectBook] = useState<Book | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const handleSelectBook = useCallback((book: Book) => {
    setSelectBook(book);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  const clearSearch = useCallback(() => {
    setSearch("");
    setSearchBooks(null);
    abortControllerRef.current?.abort();
  }, []);

  useEffect(() => {
    const trimmed = search.trim();

    if (!trimmed) {
      setSearchBooks(null);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const timer = setTimeout(async () => {
      // Cancel any in-flight request before firing a new one
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const { data } = await api.get(`/books/search`, {
          params: { search: trimmed },
          signal: controller.signal,
        });
        setSearchBooks(data);
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error("Book search failed:", err);
          setSearchBooks([]);
        }
      } finally {
        setIsSearching(false);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  const isDropdownOpen = Boolean(search) && !selectBook;

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Books</h1>
        </div>
      </header>

      <div className="min-h-screen bg-app-gradient">
        <div className="mx-auto max-w-7xl grid grid-cols-12 gap-6 px-4 py-6 md:py-8">
          {/* Main content */}
          <main className="relative col-span-12">
            {isDropdownOpen && <div className="absolute w-full h-full z-20 bg-background/60 backdrop-blur-sm transition-opacity" onClick={clearSearch} aria-hidden="true" />}

            {!selectBook && (
              <header className="relative flex z-30 items-center gap-4 rounded-2xl bg-card p-3 md:p-4 shadow-sm">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search name of the book or author…" className="pl-9" aria-label="Search books" value={search} onChange={handleSearchChange} />
                  {isSearching && <Loader2 className="absolute right-9 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />}
                  {search && (
                    <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Clear search">
                      <CircleX className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </header>
            )}

            {isDropdownOpen && (
              <div className="absolute z-30 flex flex-col p-6 mt-2 rounded-2xl bg-card w-full shadow-lg max-h-96 overflow-y-auto">
                {isSearching && !searchBooks ? (
                  <div className="p-2 text-muted-foreground">Searching…</div>
                ) : searchBooks && searchBooks.length > 0 ? (
                  searchBooks.map((book: Book) => (
                    <div className="p-2 hover:bg-primary/50 rounded-2xl cursor-pointer" key={book._id ?? book.title} onClick={() => setSelectBook(book)}>
                      <div>{book?.title}</div>
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-muted-foreground">No book with that title/author</div>
                )}
              </div>
            )}

            {!selectBook && (
              <>
                <div className="mt-4 md:mt-6 mb-5">
                  <CategoryFilter genre={genre} setGenre={setGenre} />
                </div>
                {genre === "All" ? <BooksGridWithPagination query="books?" onBookSelect={handleSelectBook} /> : <BooksGridWithPagination query={`books/genre?genre=${genre}&`} onBookSelect={handleSelectBook} />}
              </>
            )}

            {selectBook && (
              <BookDetailCard
                book={selectBook}
                onBack={() => {
                  setSelectBook(null);
                  setSearch("");
                }}
              />
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default Home;
