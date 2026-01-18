import React from 'react';
import { Comment } from '../../types/ticket';
import { formatDate } from '../../utils/formatters';

interface CommentCardProps {
  comment: Comment;
}

/**
 * CommentCard component displays a single comment.
 * System comments (status changes) are visually distinguished from user comments.
 * 
 * @example
 * ```tsx
 * <CommentCard comment={comment} />
 * ```
 */
export function CommentCard({ comment }: CommentCardProps) {
  // System comments have different styling (gray background, italic text)
  const isSystem = comment.isSystem;

  return (
    <div
      className={`p-4 rounded-lg ${
        isSystem
          ? 'bg-gray-50 border border-gray-200'
          : 'bg-white border border-gray-200'
      }`}
    >
      {/* Comment header with author and timestamp */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {/* Author avatar placeholder */}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              isSystem
                ? 'bg-gray-300 text-gray-700'
                : 'bg-blue-500 text-white'
            }`}
          >
            {comment.authorName.charAt(0).toUpperCase()}
          </div>
          
          {/* Author name */}
          <span
            className={`text-sm font-medium ${
              isSystem ? 'text-gray-600' : 'text-gray-900'
            }`}
          >
            {comment.authorName}
            {isSystem && <span className="ml-1 text-xs">(System)</span>}
          </span>
        </div>

        {/* Timestamp */}
        <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
      </div>

      {/* Comment content */}
      <p
        className={`text-sm whitespace-pre-wrap ${
          isSystem ? 'text-gray-600 italic' : 'text-gray-900'
        }`}
      >
        {comment.content}
      </p>
    </div>
  );
}
