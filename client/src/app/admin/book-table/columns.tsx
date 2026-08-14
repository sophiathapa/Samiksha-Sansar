"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { type DataTableFeatures } from "./data-table-features";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogFooter, AlertDialogHeader, AlertDialogCancel, AlertDialogTrigger, AlertDialog } from "@/components/ui/alert-dialog";
import api from "@/lib/axios";
import { error } from "console";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Book = {
  _id: string;
  title: string;
  author: string;
  status: "available" | "unavailable" | "";
  averageRating: number;
};

// Use `accessor` for data columns and `display` for columns without one.
const columnHelper = createColumnHelper<DataTableFeatures, Book>();

export const columns = columnHelper.columns([
  columnHelper.accessor("title", {
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-1">
          Title
          <Button variant="link" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
  }),

  columnHelper.accessor("author", {
    header: "Author",
  }),

  columnHelper.accessor("status", {
    header: "Status",
  }),

  columnHelper.accessor("averageRating", {
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-1">
          Rating
          <Button variant="link" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
  }),

  columnHelper.display({
    id: "actions",
    cell: ({ row, table }) => {
      const router = useRouter();
      const book = row.original;
      const [open, setOpen] = useState(false);
      const handleDelete = async (bookId: string) => {
        try {
          await api.delete(`/book/${bookId}`);
          setOpen(false);
          (table.options.meta as { refetch: () => void })?.refetch();
        } catch (error) {
          console.log(error);
        }
      };

      return (
        <>
          <div className="flex items-center gap-5 z-0">
            <Eye className="w-5 h-5 hover:text-primary" onClick={() => router.push(`/admin/${book?._id}`)} />
            <Pencil className="w-5 h-5 hover:text-primary" onClick={() => router.push(`/admin/edit/${book?._id}`)} />
            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogTrigger>
                <Trash2 className="w-5 h-5 hover:text-primary cursor-pointer" />
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>

                  <AlertDialogDescription>This action cannot be undone. This will permanently delete book from system.</AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>

                  <AlertDialogAction onClick={() => handleDelete(book._id)}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </>
      );
    },
  }),
]);
