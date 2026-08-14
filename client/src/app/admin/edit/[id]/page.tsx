"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import React, { useCallback, useEffect, useRef, useState } from "react";
import EditCard from "@/components/admin/editCard";
import { Book } from "@/types/book";
import api from "@/lib/axios";
import { useParams } from "next/navigation";
import { toast } from "sonner";

const Edit = () => {
  const { id } = useParams<{ id: string }>();
  const [selectBook, setSelectBook] = useState<Book>({
    _id: "",
    title: "",
    author: "",
    publishedDate: "",
    publisher: "",
    description: "",
    genre: [],
    averageRating: 0,
    language: "",
    coverImg: "",
    status: "",
    borrowerId: "",
    reservedBy: [],
    totalLikes: 0,
  });

  const fetchBookById = async () => {
    try {
      const book = await api.get(`/getBookById/${id}`);
      setSelectBook(book?.data);
      // console.log(book)
    } catch (error: any) {
      toast.warning(error?.response?.data?.message, { position: "top-right" });
    }
  };

  useEffect(() => {
    fetchBookById();
  }, []);

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Edit Book</h1>
        </div>
      </header>

      <main className="mx-auto max-w-7xl gap-6 px-4 py-6 md:py-8">
        <EditCard book={selectBook} />
      </main>
    </>
  );
};

export default Edit;
