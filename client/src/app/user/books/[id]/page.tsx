"use client";
import BookDetailCard from "@/components/BookDetailCard";
import api from "@/lib/axios";
import { Book } from "@/types/book";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const [selectBook, setSelectBook] = useState<Book | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const commentId: string = searchParams.get("commentId") || "";

  const fetchBookById = async () => {
    try {
      const book = await api.get(`/getBookById/${id}`);
      setSelectBook(book?.data);
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
