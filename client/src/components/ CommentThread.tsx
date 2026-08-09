import { Comment, Review } from "./Comments";

interface CommentThreadProps {
  comment: Review;
  allComments: Review[];
  onReply: (id: string, username: string) => void;
}

export const CommentThread = ({ comment, allComments, onReply }: CommentThreadProps) => {
  const replies = allComments.filter((item) => item.parentId === comment._id);

  return (
    <div>
      <Comment review={comment} onReply={onReply} />

      {replies.length > 0 && (
        <div className="ml-10 mt-2 border-l pl-4 space-y-3">
          {replies.map((reply) => (
            <CommentThread key={reply._id} comment={reply} allComments={allComments} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  );
};
