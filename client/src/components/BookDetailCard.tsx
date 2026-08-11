import { ArrowLeft, Bookmark, Building, Calendar, Globe, Star, Heart, User, MessageCircle, Loader2 } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addBorrowedBook, addLikedBook, addReserveBook, addSavedBook, removeBorrowedBook, removeLikedBook, removeReservedBook, removeSavedBook } from "@/lib/redux/features/user/userSlice";
import { Textarea } from "./ui/textarea";
import { Review } from "./Comments";
import { RootState } from "@/lib/redux/store";
import { toast } from "sonner";
import { Book } from "@/types/book";
import { CommentThread } from "./ CommentThread";

interface BookProps {
  book: Book;
  commentId: string;
  onBack: () => void;
}

const statusStyles: Record<string, string> = {
  available: "bg-green-100 text-green-800 border-green-200",
  unavailable: "bg-red-100 text-red-800 border-red-200",
};

const BookDetailCard = ({ book, commentId, onBack }: BookProps) => {
  const user = useSelector((state: RootState) => state.user);
  const [comment, setComment] = useState("");
  const { likedBooks, borrowedBooks, id: userId, reservedBooks, savedBooks } = user;
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [totalLikes, setTotalLikes] = useState(book?.totalLikes || 0);
  const [status, setStatus] = useState(book?.status || "");
  const dispatch = useDispatch();
  const [reservedBy, setReservedBy] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [replyTo, setReplyTo] = useState<{
    id: string;
    username: string;
  } | null>(null);
  const parentComments = reviews.filter((review: Review) => !review.parentId);
  const commentRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [selectedCommentId, setSelectedCommentId] = useState<string>("");

  const handleLike = async (bookId: string) => {
    try {
      if (!likedBooks?.includes(bookId)) {
        dispatch(addLikedBook(bookId));
        const { data } = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/like`, {
          bookId,
          userId,
        });
        setTotalLikes(data.totalLikes);
      } else {
        dispatch(removeLikedBook(bookId));
        const { data } = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/unlike`, {
          bookId,
          userId,
        });
        setTotalLikes(data.totalLikes);
      }
    } catch (error: any) {
      toast.warning(error?.response?.data?.message, { position: "top-right" });
    }
  };

  const handleAddToRead = async (bookId: string, userId: string) => {
    try {
      if (!savedBooks.includes(bookId)) {
        dispatch(addSavedBook(bookId));
        const { data } = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/saveBook`, {
          bookId,
          userId,
        });
        toast.success(data.message, { position: "top-right" });
      } else {
        dispatch(removeSavedBook(bookId));
        const { data } = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/removeSavedBook`, {
          bookId,
          userId,
        });
        toast.success(data.message, { position: "top-right" });
      }
    } catch (error: any) {
      toast.warning(error?.response?.data?.message, { position: "top-right" });
    }
  };

  const handleReview = async () => {
    const bookId = book?._id;
    if (!comment.trim()) {
      toast.warning("Enter Review", { position: "top-right" });
      return;
    }
    setSubmittingReview(true);
    try {
      if (replyTo?.id && replyTo?.username) {
        const filteredComment = comment.split(" ").slice(1).join(" ");
        if (!filteredComment.trim()) {
          toast.warning("Enter Review", { position: "top-right" });
          return;
        }
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/replyComment`, {
          userId,
          bookId: book?._id,
          parentId: replyTo?.id,
          comment: filteredComment,
        });
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/review`, {
          userId,
          bookId,
          comment,
        });
        toast.success("Review added", { position: "top-right" });
      }
      setComment("");
      setReplyTo(null);
      getComments();
    } catch (error: any) {
      toast.warning(error?.response?.data?.message, { position: "top-right" });
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleBookAction = async (e: React.MouseEvent<HTMLButtonElement>, bookId: string, userId: string) => {
    switch (e.currentTarget.textContent) {
      case "Borrow Now":
        try {
          dispatch(addBorrowedBook(bookId));
          dispatch(removeReservedBook(bookId));
          const { data } = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/borrowBook`, { bookId, userId });
          setStatus(data);
          toast.success("Book Borrowed", { position: "top-right" });
        } catch (error: any) {
          toast.warning(error?.response?.data?.message, { position: "top-right" });
        }
        break;

      case "Borrow Book":
        try {
          dispatch(addBorrowedBook(bookId));
          const { data } = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/borrowBook`, { bookId, userId });
          setStatus(data);
          toast.success("Book Borrowed", { position: "top-right" });
        } catch (error: any) {
          toast.warning(error?.response?.data?.message, { position: "top-right" });
        }
        break;

      case "Reserve Book":
        try {
          dispatch(addReserveBook(bookId));
          await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/reserveBook`, { bookId, userId });
          toast.success("Book Reserved", { position: "top-right" });
        } catch (error: any) {
          toast.warning(error?.response?.data?.message, { position: "top-right" });
        }
        break;

      case "Return Book":
        try {
          dispatch(removeBorrowedBook(bookId));
          const { data } = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/removeBorrowedBooks`, {
            bookId,
            userId,
          });
          setStatus(data);
          toast.success("Book returned", { position: "top-right" });
        } catch (error: any) {
          toast.warning(error?.response?.data?.message, { position: "top-right" });
        }
        break;

      case "Cancel Reserve":
        try {
          dispatch(removeReservedBook(bookId));
          await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/removeReservedBooks`, { bookId, userId });
          toast.success("Reservation cancelled", { position: "top-right" });
        } catch (error: any) {
          toast.warning(error?.response?.data?.message, { position: "top-right" });
        }
        break;
    }

    getBookStatus(bookId, userId);
  };

  const getButtonAction = (bookId: string, userId: string, borrowedBooks: string[], reservedBooks: string[]) => {
    const isBorrowed = borrowedBooks.includes(bookId);
    const isReserved = reservedBooks.includes(bookId);
    const isFirstInQueue = reservedBy[0] === userId;

    if (isBorrowed) return { primary: "Return Book" };

    if (status === "available" && !isReserved && reservedBy.length === 0) return { primary: "Borrow Book" };

    if ((status === "unavailable" || status === "available") && !isReserved) return { primary: "Reserve Book" };

    if (!isBorrowed && isReserved && isFirstInQueue) return { primary: "Borrow Now", secondary: "Cancel Reserve" };

    if ((status === "unavailable" || status === "available" ||  status === "reserved") && isReserved) return { primary: "Cancel Reserve" };
  };

  // Computed once per render instead of twice via inline calls
  const buttonAction = useMemo(() => getButtonAction(book?._id, userId, borrowedBooks, reservedBooks), [book?._id, userId, borrowedBooks, reservedBooks, status, reservedBy]);

  const getComments = async () => {
    setReviewsLoading(true);
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/reviews?bookId=${book?._id}`);
      setReviews(data);
    } catch (error: any) {
      toast.warning(error?.response?.data?.message, { position: "top-right" });
    } finally {
      setReviewsLoading(false);
    }
  };

  const getBookStatus = async (bookId: string, userId: string) => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/userBookStatus?bookId=${bookId}&userId=${userId}`);
      setStatus(data.status);
    } catch (error: any) {
      toast.warning(error?.response?.data?.message, { position: "top-right" });
    }
  };

  const getReservedBy = async (bookId: string) => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/getReservedBy?bookId=${bookId}`);
      setReservedBy(data);
    } catch (error: any) {
      toast.warning(error?.response?.data?.message, { position: "top-right" });
    }
  };

  useEffect(() => {
  if (!commentId) return;

  const commentElement = commentRefs.current.get(commentId);

  if (commentElement) {
    commentElement.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    setSelectedCommentId(commentId);
  }
}, [commentId, reviews]);

  useEffect(() => {
    getComments();
  }, []);

  useEffect(() => {
    getBookStatus(book?._id, userId);
    getReservedBy(book?._id);
  }, []);

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6 lg:p-10 max-w-6xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium w-fit hover:opacity-70 transition-opacity">
        <ArrowLeft className="w-5 h-5" />
        Back to Library
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Cover + actions */}
        <Card className="lg:col-span-1">
          <CardContent className="flex flex-col gap-4 justify-center items-center pt-6">
            <img className="w-48 h-48 sm:w-64 sm:h-74 lg:w-72 lg:h-82 rounded-md shadow-md object-cover" src={book?.coverImg} alt={book?.title} />

            <Badge className={`border ${statusStyles[status] ?? "bg-gray-100 text-gray-800 border-gray-200"} capitalize`}>{status}</Badge>

            <div className="flex gap-2 justify-center items-center">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{book?.averageRating ?? "—"}</span>
            </div>
          </CardContent>

          <CardFooter className="justify-center pb-6">
            <div className="flex justify-center items-center gap-8">
              <div className="flex flex-row items-center gap-3">
                <span className="text-sm text-muted-foreground">{totalLikes}</span>
                <button className="hover:scale-110 transition-transform" onClick={() => handleLike(book?._id)} aria-label="Like this book">
                  <Heart className={`w-5 h-5 ${likedBooks?.includes(book?._id) ? "fill-red-700 text-red-700" : "text-red-700"}`} />
                </button>
              </div>

              <button className="hover:scale-110 transition-transform" onClick={() => handleAddToRead(book?._id, userId)} aria-label="Save to reading list">
                <Bookmark className={`w-5 h-5 ${savedBooks.includes(book?._id) ? "text-red-700 fill-red-700" : "text-red-700"}`} />
              </button>
            </div>
          </CardFooter>
        </Card>

        {/* Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl leading-tight">{book?.title?.toUpperCase()}</CardTitle>
            <CardDescription className="flex gap-2 items-center">
              <User className="w-4 h-4 shrink-0" />
              {book?.author}
            </CardDescription>
          </CardHeader>

          <CardContent className="text-sm sm:text-base text-muted-foreground">{book?.description}</CardContent>

          <Separator />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5">
            <div className="flex flex-col gap-1">
              <h3 className="font-bold text-sm">Publication Details</h3>
              <div className="flex gap-2 items-center text-sm">
                <Building className="text-muted-foreground w-4 h-4 shrink-0" />
                <span className="text-muted-foreground">Publisher:</span>
                <span className="truncate">{book?.publisher}</span>
              </div>
              <div className="flex gap-2 items-center text-sm">
                <Calendar className="text-muted-foreground w-4 h-4 shrink-0" />
                <span className="text-muted-foreground">Published:</span>
                <span>{book?.publishedDate?.split("T")[0] || "—"}</span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="font-bold text-sm">Book Details</h3>
              <div className="flex gap-2 items-center text-sm">
                <Globe className="text-muted-foreground w-4 h-4 shrink-0" />
                <span className="text-muted-foreground">Language:</span>
                <span>{book?.language}</span>
              </div>
              <div className="flex gap-2">
                <Bookmark className="text-muted-foreground w-4 h-4 mt-1 shrink-0" />
                <div className="flex flex-wrap gap-1.5 mt-0.5">
                  {book?.genre?.map((val, idx) => (
                    <Badge key={idx} variant="outline" className="border-red-200 text-red-700">
                      {val}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex flex-wrap justify-center px-5 py-5 gap-3">
            <Button className="min-w-32" onClick={(e) => handleBookAction(e, book?._id, userId)}>
              {buttonAction?.primary}
            </Button>
            {buttonAction?.secondary && (
              <Button variant="secondary" className="min-w-32" onClick={(e) => handleBookAction(e, book?._id, userId)}>
                {buttonAction.secondary}
              </Button>
            )}
          </div>
        </Card>
      </div>

      {/* Reviews */}
      <Card className="mt-2">
        <CardHeader className="flex flex-row items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          <CardTitle className="text-lg">Reviews {!reviewsLoading && <span className="text-muted-foreground font-normal">({reviews.length})</span>}</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Textarea ref={textareaRef} value={comment} placeholder="Share your thoughts on this book..." className="min-h-24" onChange={(e) => setComment(e.target.value)} maxLength={500} />
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">{comment.length}/500</span>
              <Button onClick={handleReview} disabled={submittingReview || !comment.trim()} className="min-w-28">
                {submittingReview ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Posting...
                  </span>
                ) : (
                  "Add Review"
                )}
              </Button>
            </div>
          </div>

          <Separator />

          {reviewsLoading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded-md bg-muted animate-pulse" />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-1">
              <MessageCircle className="w-8 h-8 text-muted-foreground" />
              <p className="text-sm font-medium">No reviews yet</p>
              <p className="text-xs text-muted-foreground">Be the first to share what you thought.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
              {parentComments.map((comment: Review) => (
                <CommentThread
                  key={comment._id}
                  comment={comment}
                  getComments={getComments}
                  allComments={reviews}
                  commentRefs={commentRefs}
                  selectedCommentId={selectedCommentId}
                  onReply={(id, username) => {
                    setReplyTo({ id, username });
                    setComment(`@${username} `);
                    textareaRef.current?.focus();
                  }}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BookDetailCard;
