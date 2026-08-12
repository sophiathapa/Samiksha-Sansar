import { Comment, Review } from "./Comments";

interface CommentThreadProps {
  comment: Review;
  allComments: Review[];
  commentRefs: React.MutableRefObject<Map<string, HTMLDivElement>>;
  selectedCommentId: string;
  getComments: () => void;
  onReply: (id: string, username: string) => void;
}

export const CommentThread = ({ comment, allComments, commentRefs, selectedCommentId, getComments, onReply }: CommentThreadProps) => {
  const replies = allComments.filter((item) => item.parentId === comment._id);

  return (
    <div>
      <Comment
        review={comment}
        commentRef={(element) => {
          if (element) {
            commentRefs.current.set(comment._id, element);
          }
        }}
        selectedCommentId={selectedCommentId}
        getComments={getComments}
        onReply={onReply}
      />

      {replies.length > 0 && (
        <div className="ml-10 mt-2 border-l pl-4 space-y-3">
          {replies.map((reply) => (
            <CommentThread key={reply._id} comment={reply} allComments={allComments} commentRefs={commentRefs} selectedCommentId={selectedCommentId} getComments={getComments} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  );
};
