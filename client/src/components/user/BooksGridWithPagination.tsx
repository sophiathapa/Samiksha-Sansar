"use client";
import React, { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import BookCard from "./BookCard";
import axios from "axios";

interface BooksGridWithPaginationProps {
  query: string;
}

const BooksGridWithPagination = ({ query }: BooksGridWithPaginationProps) => {
  const [selectBook, setSelectBook] = useState(null);
  const [page, setPage] = useState<number>(1);

  const [books, setBooks] = useState([]);
  const [totalPages, setTotalPages] = useState<number>();
  const [currentPage, setCurrentPage] = useState<number>();

  const fetchBook = async () => {
    const fetchedBooks = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/${query}page=${page}&limit=15`
    );
    setBooks(fetchedBooks.data.books);
    setTotalPages(fetchedBooks.data.totalPages);
    setCurrentPage(fetchedBooks.data.currentPage);
  };

  useEffect(() => {
    fetchBook();
  }, [page, query]);

  return (
    <>
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-3 p-10">
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
      <Pagination>
        <PaginationContent>
          {currentPage !== 1 && (
            <>
              <PaginationItem>
                <PaginationLink onClick={(e) => setPage(1)}>«</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink onClick={(e) => setPage(page - 1)}>
                  ←
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          {currentPage - 2 > 0 && (
            <PaginationItem>
              <PaginationLink onClick={() => setPage(currentPage - 2)}>
                {currentPage - 2}
              </PaginationLink>
            </PaginationItem>
          )}

          {currentPage - 1 > 0 && (
            <PaginationItem>
              <PaginationLink onClick={() => setPage(currentPage - 1)}>
                {currentPage - 1}
              </PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationLink onClick={() => setPage(currentPage)} isActive>
              {currentPage}
            </PaginationLink>
          </PaginationItem>

          {currentPage + 1 <= totalPages && (
            <PaginationItem>
              <PaginationLink onClick={() => setPage(currentPage + 1)}>
                {currentPage + 1}
              </PaginationLink>
            </PaginationItem>
          )}

          {currentPage + 2 <= totalPages && (
            <PaginationItem>
              <PaginationLink onClick={() => setPage(currentPage + 2)}>
                {currentPage + 2}
              </PaginationLink>
            </PaginationItem>
          )}

          {currentPage !== totalPages && (
            <>
              <PaginationItem>
                <PaginationLink onClick={(e) => setPage(currentPage + 1)}>
                  →
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink onClick={() => setPage(totalPages)}>
                  »
                </PaginationLink>
              </PaginationItem>
            </>
          )}
        </PaginationContent>
      </Pagination>
    </>
  );
};

export default BooksGridWithPagination;
