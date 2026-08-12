"use client";
import { SkeletonDemo } from "@/components/Skeleton";
import BookCard from "@/components/user/BookCard";
import api from "@/lib/axios";
import { RootState } from "@/lib/redux/store";
import { Book } from "@/types/book";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Saved = () => {
  const user = useSelector((state: RootState) => state.user);
  const { id: userId } = user;
  const [savedBooks, setSavedBooks] = useState([]);
  const [selectBook, setSelectBook] = useState(null);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const fetchSavedBooks = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/getSavedBooks?all=yes`);
      setSavedBooks(data.savedBooks);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedBooks();
  }, []);

  return (
    <div className="flex flex-col gap-10">
      <div className="text-2xl md:text-2xl font-bold tracking-tight">Saved Books</div>
      <div>
        {savedBooks.length === 0 && !loading ? (
          <div className="flex justify-center mt-30 text-base">No Saved Books</div>
        ) : (
          <>
            {!selectBook && (
              <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-3">
                {savedBooks.map((book: Book, id) => (
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

export default Saved;
