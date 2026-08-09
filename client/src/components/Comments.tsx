import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RootState } from "@/lib/redux/store";
import { timeDisplay } from "@/utils/time";
import axios from "axios";
import { Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";

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
  onReply: (id: string, username: string) => void;
}

export const Comment = ({ review, onReply }: CommentProps) => {
  const user = useSelector((state: RootState) => state.user);
  const { id: userId } = user;
  const [likeCount, setLikeCount] = useState<number>(review?.totalLikes);
  const [likedBy, setLikedBy] = useState<string[]>(review?.likedBy);

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

  return (
    <div className="group bg-comment border border-comment-border rounded-lg p-4 hover:bg-comment-hover transition-colors duration-200">
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

            <button className="hover:scale-100 transition-transform duration-200 h-8 w-8 p-0 ">
              <MoreHorizontal className="h-4 w-4" />
            </button>
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
