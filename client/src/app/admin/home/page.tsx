"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import BookCard from "@/components/user/BookCard";
import CategoryFilter from "@/components/user/CategoryFilter";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import axios from "axios";
import { Search } from "lucide-react";
import Head from "next/head";
import React, { useActionState, useEffect, useState } from "react";

const Home = () => {
  const [books, setBooks] = useState([]);

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
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Books</h1>
        </div>
      </header>

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

            <div className="mt-4 md:mt-6 mb-5">
              <CategoryFilter />
            </div>

            {/* Popular Bestsellers */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {books.map((b, i) => (
                <BookCard key={i} book={b} featured />
              ))}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Home;
