"use client";
import React, { useEffect, useState } from "react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import BookCard from "./BookCard";
import { Book } from "@/types/book";
import api from "@/lib/axios";

interface BooksGridWithPaginationProps {
  query: string;
  onBookSelect: (book: Book) => void;
}

const BooksGridWithPagination = ({ query, onBookSelect }: BooksGridWithPaginationProps) => {
  const [page, setPage] = useState<number>(1);
  const [books, setBooks] = useState([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const fetchBook = async () => {
    const fetchedBooks = await api.get(`/${query}page=${page}&limit=15`);
    setBooks(fetchedBooks.data.books);
    setTotalPages(fetchedBooks.data.totalPages);
    setCurrentPage(fetchedBooks.data.currentPage);
  };

  useEffect(() => {
    setPage(1);
  }, [query]);

  useEffect(() => {
    fetchBook();
  }, [page, query]);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-15 py-10">
        {books.map((b, i) => (
          <BookCard
            key={i}
            book={b}
            onClick={() => {
              onBookSelect(b);
            }}
          />
        ))}
      </div>
      {books.length > 0 && (
        <Pagination className="mt-auto">
          <PaginationContent>
            {currentPage !== 1 && (
              <>
                <PaginationItem>
                  <PaginationLink onClick={(e) => setPage(1)}>«</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink onClick={(e) => setPage(page - 1)}>←</PaginationLink>
                </PaginationItem>
              </>
            )}

            {currentPage - 2 > 0 && (
              <PaginationItem>
                <PaginationLink onClick={() => setPage(currentPage - 2)}>{currentPage - 2}</PaginationLink>
              </PaginationItem>
            )}

            {currentPage - 1 > 0 && (
              <PaginationItem>
                <PaginationLink onClick={() => setPage(currentPage - 1)}>{currentPage - 1}</PaginationLink>
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationLink onClick={() => setPage(currentPage)} isActive>
                {currentPage}
              </PaginationLink>
            </PaginationItem>

            {currentPage + 1 <= totalPages && (
              <PaginationItem>
                <PaginationLink onClick={() => setPage(currentPage + 1)}>{currentPage + 1}</PaginationLink>
              </PaginationItem>
            )}

            {currentPage + 2 <= totalPages && (
              <PaginationItem>
                <PaginationLink onClick={() => setPage(currentPage + 2)}>{currentPage + 2}</PaginationLink>
              </PaginationItem>
            )}

            {currentPage !== totalPages && (
              <>
                <PaginationItem>
                  <PaginationLink onClick={(e) => setPage(currentPage + 1)}>→</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink onClick={() => setPage(totalPages)}>»</PaginationLink>
                </PaginationItem>
              </>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default BooksGridWithPagination;
