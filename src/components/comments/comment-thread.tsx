import { getInitials, timeAgo } from "@/lib/utils";
import { MarkdownRenderer } from "@/components/shared/markdown-renderer";

interface Comment {
  id: string;
  body: string;
  createdAt: Date;
  author: {
    name: string;
    role: string;
  };
}

interface CommentThreadProps {
  comments: Comment[];
}

export function CommentThread({ comments }: CommentThreadProps) {
  if (comments.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
        No comments yet. Start the discussion below.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium">
              {getInitials(comment.author.name)}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium">{comment.author.name}</span>
              <span className="text-xs text-gray-400 capitalize">{comment.author.role}</span>
              <span className="text-xs text-gray-400">·</span>
              <span className="text-xs text-gray-400">{timeAgo(comment.createdAt)}</span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-sm">
              <MarkdownRenderer content={comment.body} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
