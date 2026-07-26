"use client";
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

  const fetchReservedBooks = async () => {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/getReservedBooks?userId=${userId}&all=yes`
    );
    setReservedBooks(data);
  };

  useEffect(() => {
    fetchReservedBooks();
  }, []);

  return (
    <main className="col-span-12 px-7 py-4">
      <div>
        {reservedBooks?.length !== 0 ? (
          <>
            {!selectBook && (
              <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4 md:gap-3 mt-10">
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
        ) : (
          <div>No Reserved Books</div>
        )}
      </div>
    </main>
  );
};

export default Reserved;
