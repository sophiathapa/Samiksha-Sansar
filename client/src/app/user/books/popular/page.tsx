"use client";
import BooksGridWithPagination from "@/components/user/BooksGridWithPagination";
import { Book } from "@/types/book";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Popular = () => {
  const [selectBook, setSelectBook] = useState<Book|null>(null);
  const router = useRouter();

  const handleBookSelect = (book: Book) => {
    router.push(`/user/books/${book?._id}`);
  };

  return (
    <div>
      {!selectBook && (
        <>
          <div className="text-2xl md:text-2xl font-bold tracking-tight ml-10 mt-5">
            Popular Books
          </div>
          <BooksGridWithPagination
            query="popularBooks?"
            onBookSelect={handleBookSelect}
          />
        </>
      )}
    </div>
  );
};

export default Popular;
