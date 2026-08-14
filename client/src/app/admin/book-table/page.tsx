"use client";
import api from "@/lib/axios";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useEffect, useState } from "react";
import { Book } from "@/types/book";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { PaginationState } from "@tanstack/react-table";

export default function DemoPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0, // 0-based for tanstack
    pageSize: 15,
  });

  const getBooks = async () => {
    const { data } = await api.get(`/books?page=${pagination.pageIndex + 1}&limit=${pagination.pageSize}`);
    setBooks(data?.books);
    setPageCount(data?.totalPages);
  };

  useEffect(() => {
    getBooks();
  }, [pagination.pageIndex, pagination.pageSize]);

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Manage Book</h1>
        </div>
      </header>
      <div className="p-5 md:p-10">
        <DataTable
          columns={columns}
          data={books}
          pagination={pagination}
          onPaginationChange={setPagination}
          pageCount={pageCount}
          onRefetch={getBooks}
        />
      </div>
    </>
  );
}
