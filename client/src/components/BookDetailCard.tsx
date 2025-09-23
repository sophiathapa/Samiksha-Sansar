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
  removeBorrowedBook,
  removeLikedBook,
  removeReservedBook,
} from "@/lib/redux/features/user/userSlice";
import { Textarea } from "./ui/textarea";
import { Comment } from "./Comments";
import { RootState } from "@/lib/redux/store";

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
  const { likedBooks, borrowedBooks, id: userId, reservedBooks } = user;
  const [reviews, setReviews] = useState([]);
  const [totalLikes, setTotalLikes] = useState(book.totalLikes || 0);
  const [status, setStatus] = useState(book.status || "");
  const dispatch = useDispatch();

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
      alert(error?.response?.data?.message);
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

      alert("Review added");
      setComment("");
    } catch (error: any) {
      alert(error?.response?.data?.message);
    }
  };

  const handleBookAction = async (
    bookStatus: string,
    bookId: string,
    userId: string
  ) => {
    if (bookStatus === "available" && !borrowedBooks.includes(bookId)) {
      try {
        dispatch(addBorrowedBook(bookId));
        const { data } = await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/borrowBook`,
          { bookId, userId }
        );
        setStatus(data);
        alert("Book Borrowed");
      } catch (error: any) {
        alert(error?.response?.data?.message);
      }
    } else if (bookStatus === "unavailable" && borrowedBooks.includes(bookId)) {
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
        alert("cancel borrow");
      } catch (error: any) {
        alert(error?.response?.data?.message);
      }
    } else if (bookStatus === "unavailable" && !reservedBooks.includes(bookId)) {
      try {
        dispatch(addReserveBook(bookId));
        await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/reserveBook`, {
          bookId,
          userId,
        });
        alert("Book Reserved");
      } catch (error: any) {
        alert(error?.response?.data?.message);
      }
    } else if (bookStatus === "unavailable" && reservedBooks.includes(bookId)) {
      try {
        dispatch(removeReservedBook(bookId));
        await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/removeReservedBooks`,
          { bookId, userId }
        );

        alert(" cancel reserve");
      } catch (error: any) {
        alert(error?.response?.data?.message);
      }
    } else {
      alert("already reserved");
    }
  };

  const handleAddToRead = async (bookId: string, userId: string) => {
    try {
      const { data } = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/readingList`,
        {
          bookId,
          userId,
        }
      );
      alert(data.message);
    } catch (error: any) {
      alert(error?.response?.data?.message);
    }
  };

  const getComments = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews?bookId=${book._id}`
      );
      setReviews(data);
    } catch (error: any) {
      alert(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getComments();
  }, [comment]);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center">
        <button onClick={onBack}>
          <div className="flex justify-center items-center gap-2">
            <ArrowLeft className="w-6 h-6" />
            Back to Library
          </div>
        </button>
      </div>
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
              <div className=" flex items-center justify-center gap-5">
                <Button
                  className="bg-[oklch(0.97_0.02_85)] hover:bg-[oklch(0.97_0.02_85)] border-none shadow-none hover:scale-150 transition-transform duration-200 ease-in-out"
                  onClick={() => {
                    handleLike(book._id);
                  }}
                >
                  <Heart
                    className={`w-25 h-25 ${
                      likedBooks?.includes(book._id)
                        ? "fill-red-700 text-red-700"
                        : "text-red-700"
                    }`}
                  />
                </Button>
                <span>{totalLikes}</span>
              </div>

              <Button className="bg-[oklch(0.97 0.02 85)] shadow-none border-none pointer-events-none">
                <Share2 className="w-25 h-25 text-red-700 " />
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
            <div className="flex gap-5 px-5">
              <Button
                onClick={() => handleBookAction(status, book._id, userId)}
              >
                {borrowedBooks.includes(book._id)
                  ? "Cancel Borrow"
                  : status === "unavailable" && !reservedBooks?.includes(book._id)
                  ?"Reserve Book" 
                  : status === "available" && !borrowedBooks.includes(book._id)
                  ? "Borrow Book"
                  :  "Already Reserved"}
              </Button>
              <Button onClick={() => handleAddToRead(book._id, userId)}>
                Add to Reading List
              </Button>
            </div>
          </Card>
        </div>
      </div>
      <div className="flex flex-col">
        <Textarea
          value={comment}
          placeholder="write review"
          className="h-30 mb-5"
          onChange={(e) => setComment(e.target.value)}
        />
        <Button onClick={(e) => handleReview()}>Add Review</Button>
      </div>

      <div>
        {reviews && (
          <div className="space-y-4">
            {reviews.map((review, id) => (
              <Comment key={id} review={review} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetailCard;
