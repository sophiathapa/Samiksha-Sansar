"use client";
import { Bookmark } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { addSavedBook, removeSavedBook } from "@/lib/redux/features/user/userSlice";

export type Book = {
  title: string;
  author: string;
  coverImg: string;
  _id: string;
};

interface BookCardProps {
  book: Book;
  featured?: boolean;
  onClick?: () => void;
}

const BookCard = ({ book, featured, onClick }: BookCardProps) => {
  const user = useSelector((state: RootState) => state.user);
  const { id: userId ,savedBooks} = user;
  const dispatch = useDispatch();

  const handleSaveBook = async (bookId: string, userId: string) => {
    try {
       if(!savedBooks.includes(bookId)){
              dispatch(addSavedBook(bookId));
              const { data } = await axios.patch(
                `${process.env.NEXT_PUBLIC_API_URL}/saveBook`,
                {
                  bookId,
                  userId,
                }
              );
              toast(data.message);
            }
            else{
      
              dispatch(removeSavedBook(bookId));
              const { data } = await axios.patch(
                `${process.env.NEXT_PUBLIC_API_URL}/removeSavedBook`,
                {
                  bookId,
                  userId,
                }
              );
              toast(data.message);
            }
      
    } catch (error: any) {
      toast(error?.response?.data?.message);
    }
  };

  return (
    <article
      className={`relative ${featured ? "w-44 md:w-56" : "w-32 md:w-36"}`}
      onClick={onClick}
    >
      <Card
        className="overflow-hidden border-0 shadow-md transform transition duration-200 ease-in-out
        hover:scale-105
        active:scale-110"
      >
        <img
          src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${book.coverImg}`}
          alt={`${book.title} book cover by ${book.author}`}
          loading="lazy"
          className={`block w-full object-cover ${
            featured ? "h-64 md:h-80" : "h-44 md:h-52"
          }`}
        />
      </Card>
      <div className="mt-2">
        <h3 className="text-sm font-semibold truncate" title={book.title}>
          {book.title}
        </h3>
        <p className="text-xs text-muted-foreground truncate">{book.author}</p>
      </div>
      <div className="absolute top-2 right-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60"
              onClick={() => handleSaveBook(book._id, userId)}
              aria-label={`Bookmark ${book.title}`}
            >
              <Bookmark className={`w-4 h-4 ${
                      savedBooks.includes(book._id)
                        ? " text-red-700 fill-red-700"
                        : "text-red-700 "
                    }`} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Save</TooltipContent>
        </Tooltip>
      </div>
    </article>
  );
};

export default BookCard;
