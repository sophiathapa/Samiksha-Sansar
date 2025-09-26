import {
  ArrowLeft,
  Bookmark,
  Building,
  Calendar,
  Globe,
  Heart,
  Share2,
  Star,
  User,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  addBorrowedBook,
  addLikedBook,
  addReserveBook,
  addSavedBook,
  removeBorrowedBook,
  removeLikedBook,
  removeReservedBook,
  removeSavedBook,
} from "@/lib/redux/features/user/userSlice";
import { Textarea } from "./ui/textarea";
import { Comment } from "./Comments";
import { RootState } from "@/lib/redux/store";
import { toast } from "sonner";

export type Book = {
  title: string;
  author: string;
  publishedDate: string;
  publisher: string;
  description: string;
  genre: string[];
  averageRating: number;
  language: string;
  coverImg: string;
  totalLikes: number;
  _id: string;
  status: string;
  borrowerId: {};
  reservedBy: string[];
};

interface BookProps {
  book: Book;
  onBack: () => void;
}

const BookDetailCard = ({ book, onBack }: BookProps) => {
  const user = useSelector((state: RootState) => state.user);
  const [comment, setComment] = useState("");
  const {
    likedBooks,
    borrowedBooks,
    id: userId,
    reservedBooks,
    savedBooks,
  } = user;
  const [reviews, setReviews] = useState([]);
  const [totalLikes, setTotalLikes] = useState(book.totalLikes || 0);
  const [status, setStatus] = useState(book.status || "");
  const dispatch = useDispatch();
  const [reservedBy, setReservedBy] = useState([]);

  const handleLike = async (bookId: string) => {
    try {
      if (!likedBooks?.includes(bookId)) {
        dispatch(addLikedBook(bookId));
        const { data } = await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/like`,
          {
            bookId: bookId,
            userId: userId,
          }
        );

        setTotalLikes(data.totalLikes);
      } else {
        dispatch(removeLikedBook(bookId));
        const { data } = await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/unlike`,
          {
            bookId: bookId,
            userId: userId,
          }
        );
        setTotalLikes(data.totalLikes);
      }
    } catch (error: any) {
      toast(error?.response?.data?.message);
    }
  };



  const handleAddToRead = async (bookId: string, userId: string) => {
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

  const handleReview = async () => {
    const bookId = book._id;

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/review`, {
        userId,
        bookId,
        comment,
      });

      toast("Review added");
      setComment("");
    } catch (error: any) {
      toast(error?.response?.data?.message);
    }
  };

  const handleBookAction = async (e, bookId: string, userId: string) => {
    switch (e.currentTarget.textContent) {
      case "Borrow Now":
        try {
          dispatch(addBorrowedBook(bookId));

          dispatch(removeReservedBook(bookId));

          const { data } = await axios.patch(
            `${process.env.NEXT_PUBLIC_API_URL}/borrowBook`,
            { bookId, userId }
          );
          setStatus(data);
          toast("Book Borrowed");
        } catch (error: any) {
          toast(error?.response?.data?.message);
        }

        break;

      case "Borrow Book":
        try {
          dispatch(addBorrowedBook(bookId));
          const { data } = await axios.patch(
            `${process.env.NEXT_PUBLIC_API_URL}/borrowBook`,
            { bookId, userId }
          );
          setStatus(data);
          toast("Book Borrowed");
        } catch (error: any) {
          toast(error?.response?.data?.message);
        }

        break;

      case "Reserve Book":
        try {
          dispatch(addReserveBook(bookId));
          await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/reserveBook`, {
            bookId,
            userId,
          });
          toast("Book Reserved", {
            position: "top-right",
            action: {
              label: "Undo",
              onClick: () => console.log("Undo"),
            },
          });
        } catch (error: any) {
          toast(error?.response?.data?.message);
        }

        break;

      case "Return Book":
        try {
          dispatch(removeBorrowedBook(bookId));

          const { data } = await axios.patch(
            `${process.env.NEXT_PUBLIC_API_URL}/removeBorrowedBooks`,
            {
              bookId: bookId,
              userId: userId,
            }
          );
          setStatus(data);
          toast("cancel borrow");
        } catch (error: any) {
          toast(error?.response?.data?.message);
        }

        break;

      case "Cancel Reserve":
        try {
          dispatch(removeReservedBook(bookId));
          await axios.patch(
            `${process.env.NEXT_PUBLIC_API_URL}/removeReservedBooks`,
            { bookId, userId }
          );

          toast(" cancel reserve");
        } catch (error: any) {
          toast(error?.response?.data?.message);
        }

        break;
    }

    getBookStatus(bookId, userId);
  };

  const getButtonText = (
    bookId: string,
    userId: string,
    borrowedBooks: string[],
    reservedBooks: string[]
  ) => {
    const isBorrowed = borrowedBooks.includes(bookId);
    const isReserved = reservedBooks.includes(bookId);
    const status = book.status; // or computed user-specific status

    if (isBorrowed) return "Return Book";

    if (
      status === "available" &&
      !isBorrowed &&
      !isReserved &&
      reservedBy.length === 0
    )
      return "Borrow Book";

    if ((status === "unavailable" || status === "available") && !isReserved)
      return "Reserve Book";

    if (status === "available" && isReserved && reservedBy[0] === userId)
      return "Borrow Now";

    if ((status === "unavailable" || status === "available") && isReserved)
      return "Cancel Reserve";

    return "Unavailable"; // fallback
  };



  const getComments = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews?bookId=${book._id}`
      );
      setReviews(data);
    } catch (error: any) {
      toast(error?.response?.data?.message);
    }
  };

  const getBookStatus = async (bookId: string, userId: string) => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/userBookStatus?bookId=${bookId}&userId=${userId}`
      );
      setStatus(data.status);
    } catch (error: any) {
      toast(error?.response?.data?.message);
    }
  };

  const getReservedBy = async (bookId: string) => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/getReservedBy?bookId=${bookId}`
      );
      setReservedBy(data);
    } catch (error: any) {
      toast(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getComments();
  }, [comment]);

  useEffect(() => {
    getBookStatus(book._id, userId);
    getReservedBy(book._id);
  }, []);

  return (
    <div className="flex flex-col gap-5 p-10">
      <div className="flex items-center">
        <button onClick={onBack}>
          <div className="flex justify-center items-center gap-2">
            <ArrowLeft className="w-6 h-6" />
            Back to Library
          </div>
        </button>
      </div>
      <div className="px-25 py-10">
        <div className=" grid grid-cols-3 gap-5">
          <Card>
            <CardContent className="flex flex-col gap-4 justify-center items-center">
              <img
                className="w-80 h-80 rounded-md shadow-md"
                src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${book.coverImg}`}
                alt={book.title}
              />

              <Badge className="bg-green-200 text-black">{status}</Badge>
              <div className="flex gap-2 justify-center items-center">
                <Star className="fill-yellow-400 text-yellow-400" />
                <span>{book.averageRating}</span>
              </div>
            </CardContent>
            <CardFooter className="items-center justify-center">
              <div className="grid grid-cols-2 gap-10">
                <div className=" flex items-center justify-center gap-2">
                  <Button
                    className="bg-[oklch(0.97 0.02 85)] hover:bg-[oklch(0.97 0.02 85)] border-none shadow-none hover:scale-150 transition-transform duration-200 ease-in-out px-0"
                    onClick={() => {
                      handleLike(book._id);
                    }}
                  >
                    <Heart
                      className={`w-40 h-40 ${
                        likedBooks?.includes(book._id)
                          ? "fill-red-700 text-red-700"
                          : "text-red-700"
                      }`}
                    />
                  </Button>
                  <span>{totalLikes}</span>
                </div>

                <Button
                  className="bg-[oklch(0.97 0.02 85)] hover:bg-[oklch(0.97 0.02 85)] hover:scale-150 transition-transform duration-200 ease-in-out shadow-none border-none "
                  onClick={() => handleAddToRead(book._id, userId)}
                >
                  <Bookmark
                    className={`w-60 h-60 ${
                      savedBooks.includes(book._id)
                        ? " text-red-700 fill-red-700"
                        : "text-red-700 "
                    }`}
                  />
                </Button>
              </div>
            </CardFooter>
          </Card>

          <div className="col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  {book.title.toUpperCase()}
                </CardTitle>
                <CardDescription className="flex gap-2 items-center">
                  <User className="w-4 h-4" />
                  {book.author}
                </CardDescription>
              </CardHeader>
              <CardContent>{book.description}</CardContent>
              <Separator />
              <div className="grid grid-cols-2 gap-4 p-5">
                <div className="flex flex-col">
                  <h3 className="font-bold">Publication Details</h3>
                  <div className="flex gap-2 items-center">
                    <Building className="text-muted-foreground w-4 h-4" />
                    <span className="text-muted-foreground">Publisher:</span>
                    <span>{book.publisher}</span>
                  </div>
                  <div className="flex gap-2 items-center ">
                    <Calendar className="text-muted-foreground w-4 h-4" />
                    <span className="text-muted-foreground">Published:</span>
                    <span>{book.publishedDate?.split("T")[0] || ""}</span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <h3 className="font-bold">Book Details</h3>
                  <div className="flex gap-2 items-center">
                    <Globe className="text-muted-foreground w-4 h-4" />
                    <span className="text-muted-foreground">Language:</span>
                    <span>{book.language}</span>
                  </div>
                  <div className="flex gap-2 ">
                    <Bookmark className="text-muted-foreground w-4 h-4 mt-1 " />
                    <div className="grid grid-cols-[auto_1fr] gap-2 ">
                      <span className="text-muted-foreground ">Genre:</span>
                      <div className="flex gap-1 flex-wrap mt-1">
                        {book.genre.map((val, idx) => (
                          <Badge key={idx} className="bg-red-700">
                            {val}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="flex justify-center px-5">
                <Button onClick={(e) => handleBookAction(e, book._id, userId)}>
                  {getButtonText(
                    book._id,
                    userId,
                    borrowedBooks,
                    reservedBooks
                  )}
                </Button>
              </div>
            </Card>
          </div>
        </div>
        <div className="flex flex-col mt-10">
          <Textarea
            value={comment}
            placeholder="write review"
            className="h-30 mb-5"
            onChange={(e) => setComment(e.target.value)}
          />
          <Button onClick={(e) => handleReview()}>Add Review</Button>
        </div>

        <div className="mt-10">
          {reviews && (
            <div className="space-y-4">
              {reviews.map((review, id) => (
                <Comment key={id} review={review} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetailCard;
