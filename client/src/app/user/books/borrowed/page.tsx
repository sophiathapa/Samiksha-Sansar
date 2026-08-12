"use client";
import { SkeletonDemo } from "@/components/Skeleton";
import BookCard from "@/components/user/BookCard";
import api from "@/lib/axios";
import { RootState } from "@/lib/redux/store";
import { Book } from "@/types/book";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Borrowed = () => {
  const user = useSelector((state: RootState) => state.user);
  const { id: userId } = user;
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [selectBook, setSelectBook] = useState(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const fetchBorrowedBooks = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/getBorrowedBooks?all=yes`);
      setBorrowedBooks(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  return (
    <div className="flex flex-col gap-10">
      <div className="text-2xl md:text-2xl font-bold tracking-tight">Borrowed Books</div>
      <div>
        {borrowedBooks?.length === 0 && !loading ? (
          <div className="flex justify-center mt-30 text-base">No Borrowed Books</div>
        ) : (
          <>
            {!selectBook && (
              <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-3">
                {borrowedBooks.map((book: Book, id: number) => (
                  <BookCard
                    key={id}
                    book={book}
                    onClick={() => {
                      router.push(`/user/books/${book?._id}`);
                    }}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {loading && <SkeletonDemo />}
      </div>
    </div>
  );
};

export default Borrowed;
