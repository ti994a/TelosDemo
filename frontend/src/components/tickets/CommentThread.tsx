import React from 'react';
import { Ticket } from '../../types/ticket';
import { addComment } from '../../api/tickets';
import { CommentCard } from './CommentCard';
import { CommentForm } from './CommentForm';
import { EmptyState } from '../shared/EmptyState';

interface CommentThreadProps {
  ticket: Ticket;
  onCommentAdded: () => void;
}

/**
 * CommentThread component displays all comments for a ticket
 * and provides a form to add new comments.
 * Comments are displayed in chronological order (oldest first).
 * 
 * @example
 * ```tsx
 * <CommentThread ticket={ticket} onCommentAdded={refetch} />
 * ```
 */
export function CommentThread({ ticket, onCommentAdded }: CommentThreadProps) {
  /**
   * Handles adding a new comment.
   * Calls API and triggers parent refresh on success.
   */
  const handleAddComment = async (content: string) => {
    await addComment(ticket.id, content);
    // Trigger parent component to refetch ticket data
    onCommentAdded();
  };

  // Get comments array (may be undefined if ticket was fetched without comments)
  const comments = ticket.comments || [];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Comments ({comments.length})
      </h2>

      {/* Comments list */}
      <div className="space-y-4 mb-6">
        {comments.length === 0 ? (
          <EmptyState
            message="No comments yet"
            description="Be the first to add a comment to this ticket"
          />
        ) : (
          // Display comments in chronological order (oldest first)
          comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))
        )}
      </div>

      {/* Comment form */}
      <div className="border-t border-gray-200 pt-6">
        <CommentForm onSubmit={handleAddComment} />
      </div>
    </div>
  );
}
