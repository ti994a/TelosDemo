import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../database/db';
import { Comment } from '../models/Ticket';
import { validateCommentContent } from '../utils/validators';
import { NotFoundError } from '../utils/errors';

/**
 * Service layer for comment-related business logic.
 */

/**
 * Adds a new comment to a ticket.
 * Validates content and creates comment with timestamp and author info.
 * 
 * @param ticketId - ID of the ticket to comment on
 * @param content - Comment text content
 * @param authorId - ID of the user creating the comment
 * @param authorName - Display name of the comment author
 * @returns The newly created comment
 * @throws {ValidationError} If content is empty or only whitespace
 * @throws {NotFoundError} If ticket doesn't exist
 */
export async function addComment(
  ticketId: string,
  content: string,
  authorId: string,
  authorName: string
): Promise<Comment> {
  // Validate comment content (must not be empty)
  const validatedContent = validateCommentContent(content);

  const db = getDb();

  // Check if ticket exists
  const ticket = await db.get('SELECT id FROM tickets WHERE id = ?', [ticketId]);
  if (!ticket) {
    throw new NotFoundError(`Ticket with ID ${ticketId} not found`, ticketId);
  }

  const id = uuidv4();
  const now = new Date().toISOString();

  const comment: Comment = {
    id,
    ticketId,
    content: validatedContent,
    authorId,
    authorName,
    isSystem: false, // User comments are not system-generated
    createdAt: now,
  };

  // Insert comment into database
  await db.run(
    `INSERT INTO comments (
      id, ticket_id, content, author_id, author_name, is_system, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      comment.id,
      comment.ticketId,
      comment.content,
      comment.authorId,
      comment.authorName,
      comment.isSystem ? 1 : 0,
      comment.createdAt,
    ]
  );

  return comment;
}

/**
 * Retrieves all comments for a ticket, ordered chronologically.
 * 
 * @param ticketId - ID of the ticket
 * @returns Array of comments ordered by creation date (oldest first)
 */
export async function getCommentsByTicketId(ticketId: string): Promise<Comment[]> {
  const db = getDb();

  const rows = await db.all(
    'SELECT * FROM comments WHERE ticket_id = ? ORDER BY created_at ASC',
    [ticketId]
  );

  return rows.map(mapDbRowToComment);
}

/**
 * Helper function to map database row to Comment object.
 * Converts snake_case column names to camelCase property names.
 * 
 * @param row - Database row
 * @returns Comment object
 */
function mapDbRowToComment(row: any): Comment {
  return {
    id: row.id,
    ticketId: row.ticket_id,
    content: row.content,
    authorId: row.author_id,
    authorName: row.author_name,
    isSystem: Boolean(row.is_system),
    createdAt: row.created_at,
  };
}
