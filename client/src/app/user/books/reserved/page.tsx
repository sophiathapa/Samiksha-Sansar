"use client";
import { SkeletonDemo } from "@/components/Skeleton";
import BookCard from "@/components/user/BookCard";
import { RootState } from "@/lib/redux/store";
import { Book } from "@/types/book";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Reserved = () => {
  const user = useSelector((state: RootState) => state.user);
  const { id: userId } = user;
  const [reservedBooks, setReservedBooks] = useState([]);
  const [selectBook, setSelectBook] = useState(null);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const fetchReservedBooks = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/getReservedBooks?userId=${userId}&all=yes`
      );
      setReservedBooks(data);
    } catch(error) {
        console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservedBooks();
  }, []);

  return (
      <div className="flex flex-col gap-10">
        <div className="text-2xl md:text-2xl font-bold tracking-tight">
          Reserved Books
        </div>
        <div>
          {reservedBooks?.length === 0 && !loading  ? (
            <div className="flex justify-center mt-30 text-base">No Reserved Books</div>
          ) : (
            <>
              {!selectBook && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-3">
                  {reservedBooks.map((book:Book, id) => (
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

export default Reserved;
