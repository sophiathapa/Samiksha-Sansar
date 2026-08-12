"use client";
import BookDetailCard from "@/components/user/BookDetailCard";
import api from "@/lib/axios";
import { Book } from "@/types/book";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const [selectBook, setSelectBook] = useState<Book | null>(null);
  const router = useRouter();

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
          onBack={() => {
            setSelectBook(null);
            router.back();
          }}
        />
      </div>
    )
  );
}
