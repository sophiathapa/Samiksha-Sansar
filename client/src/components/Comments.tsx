import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RootState } from "@/lib/redux/store";
import { timeDisplay } from "@/utils/time";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import axios from "axios";
import { Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { DropdownMenuGroup } from "./ui/dropdown-menu";
import { toast } from "sonner";

export type Review = {
  _id: string;
  bookId: string;
  parentId: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  comment: string;
  likedBy: string[];
  replyCount: number;
  createdAt: string;
  totalLikes: number;
};

interface CommentProps {
  review: Review;
  commentRef: (element: HTMLDivElement | null) => void;
  selectedCommentId: string;
  getComments: () => void;
  onReply: (id: string, username: string) => void;
}

export const Comment = ({ review, commentRef, selectedCommentId, getComments, onReply }: CommentProps) => {
  const user = useSelector((state: RootState) => state?.user);
  const { id: userId } = user;
  const [likeCount, setLikeCount] = useState<number>(review?.totalLikes);
  const [likedBy, setLikedBy] = useState<string[]>(review?.likedBy);
  const userComment: boolean = userId === review?.userId?._id;

  const handleCommentLike = async () => {
    try {
      const { data } = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/likeComment`, {
        reviewId: review?._id,
        userId,
      });
      setLikeCount(data?.totalLikes);
      setLikedBy(data?.likedBy);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCommentDelete = async () => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/deleteComment?commentId=${review?._id}&userId=${userId}`);
      getComments();
    } catch (error) {
      console.log(error);
    }
  };

    const handleCommentReport = async () => {
    try {

      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/reportComment?commentId=${review?._id}&userId=${userId}`);
      toast.success(data.message, { position: "top-right" });

    } catch (error) {
      console.log(error);
    }
  };

  const hanndleAction = () => {
    if (userComment) {
      handleCommentDelete();
    } else {
      handleCommentReport();
    }
  }

  return (
    <div className={`group bg-comment border ${selectedCommentId === review._id && "border-ring ring-ring/50 ring-[3px]"} rounded-md p-4 hover:bg-comment-hover transition-colors duration-200`} ref={commentRef}>
      <div className="flex items-start space-x-3">
        <Avatar className="h-10 w-10 ring-2 ring-primary/10">
          <AvatarImage alt={`${review?.userId?.firstName}'s avatar`} />
          <AvatarFallback className="bg-primary/10 text-primary font-medium">{review?.userId?.firstName[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <h4 className="text-sm text-comment-author">{review?.userId?.firstName + " " + review?.userId?.lastName}</h4>
              <span className="ml-2">{review.comment}</span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <MoreHorizontal className="h-4 w-4 hover:scale-120 transition-transform duration-200" />
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-20 sm:w-40 text-xs sm:text-sm bg-secondary mt-1 shadow-lg border border-gray-200 rounded-lg z-50" align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem className="flex justify-center hover:bg-card/50 rounded-md p-2"
                  onClick={hanndleAction}>{userComment? "Delete" : "Report"}</DropdownMenuItem>

                  <DropdownMenuSeparator className="my-1 border-black" />

                  <DropdownMenuItem className="flex justify-center hover:bg-card/50 rounded-md p-2">Cancel</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-[10px] text-muted-foreground">{timeDisplay(review.createdAt)}</span>
            <div className="flex items-center gap-0">
              <button
                className={`h-8 px-2 transition-transform duration-200
                 hover:scale-110
              `}
                onClick={handleCommentLike}
              >
                <Heart className={`h-3 w-3 mr-1 text-red-700 ${likedBy.includes(userId) ? "fill-red-700" : ""}`} />
              </button>
              {!(likeCount === 0) && <span className="text-[10px] font-medium">{likeCount}</span>}
            </div>

            <button className="flex items-center h-8 px-2 text-[10px] font-medium transition-colors hover:scale-110 duration-200" onClick={() => onReply(review._id, `${review.userId.firstName}${review.userId.lastName}`)}>
              <MessageCircle className="h-3 w-3 mr-1 text-[10px]" />
              Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
