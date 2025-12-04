"use client";
import BookDetailCard from "@/components/BookDetailCard";
import BooksGridWithPagination from "@/components/user/BooksGridWithPagination";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Popular = () => {
  const [selectBook, setSelectBook] = useState(null);
  const router = useRouter();

  const handleBookSelect = (book) => {
    setSelectBook(book);
  };
  return (
    <div>
      {selectBook === null ? (
        <>
          <div className="text-2xl md:text-2xl font-bold tracking-tight ml-10 mt-5">
            Popular Books
          </div>
          <BooksGridWithPagination
            query="popularBooks?"
            onBookSelect={handleBookSelect}
          />
        </>
      ) : (
        <BookDetailCard
          book={selectBook}
          onBack={() => {
            router.push("/user/books/popular");
            setSelectBook(null);
          }}
        />
      )}
    </div>
  );
};

export default Popular;
