"use client";
import BookDetailCard from "@/components/user/BookDetailCard";
import api from "@/lib/axios";
import { addBorrowedBook, addReserveBook } from "@/lib/redux/features/user/userSlice";
import { RootState } from "@/lib/redux/store";
import { Book } from "@/types/book";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export default function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const user = useSelector((state: RootState) => state.user);
  const { id: userId } = user;
  const [selectBook, setSelectBook] = useState<Book | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const commentId: string = searchParams.get("commentId") || "";
  const dispatch = useDispatch();

  const fetchBookById = async () => {
    try {
      const { data } = await api.get(`/getBookById/${id}`);
      setSelectBook(data);
      if (userId === data?.borrowerId) {
        dispatch(addBorrowedBook(id));
      }
      if (data?.reservedBy.includes(userId)) {
        dispatch(addReserveBook(id));
      }
    } catch (error: any) {
      toast.warning(error?.response?.data?.message, { position: "top-right" });
    }
  };

  useEffect(() => {
    fetchBookById();
  }, []);

  return (
    selectBook && (
      <div>
        <BookDetailCard
          book={selectBook}
          commentId={commentId}
          onBack={() => {
            setSelectBook(null);
            router.back();
          }}
        />
      </div>
    )
  );
}
