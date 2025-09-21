import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { time } from "console";
import { Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { date } from "yup";

export type Review = {
  _id: string;
  comment: string;
  createdAt: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
  };
};

interface CommentProps {
  review: Review;
}

export const Comment = ({ review }: CommentProps) => {
  const [time, setTime] = useState("");

  const timeDisplay = (pastTime: string) => {
    const now = new Date();
    const past = new Date(pastTime);
    const diffMs = now.getTime() - past.getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 12);

    if (seconds < 60) return `${seconds} seconds ago`;
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${weeks} weeks ago`;
    if (months < 12) return `${months} months ago`;
    return `${years} years ago`;
  };

  return (
    <div className="group bg-comment border border-comment-border rounded-lg p-4 hover:bg-comment-hover transition-colors duration-200">
      <div className="flex items-start space-x-3">
        <Avatar className="h-10 w-10 ring-2 ring-primary/10">
          <AvatarImage alt={`${review?.userId?.firstName}'s avatar`} />
          <AvatarFallback className="bg-primary/10 text-primary font-medium">
            {review?.userId?.firstName[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-semibold text-comment-author">
                {review?.userId?.firstName + " " + review?.userId?.lastName}
              </h4>
              <span className="text-xs text-comment-time">
                {timeDisplay(review.createdAt)}
              </span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8 p-0 text-comment-action hover:text-comment-action-hover"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-sm text-comment-content leading-relaxed mb-3">
            {review.comment}
          </p>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 px-2 text-xs font-medium transition-colors duration-200
                text-comment-action hover:text-comment-action-hover
              `}
            >
              <Heart className={`h-4 w-4 mr-1  fill-current`} />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs font-medium text-comment-action hover:text-comment-action-hover transition-colors duration-200"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              Reply
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
