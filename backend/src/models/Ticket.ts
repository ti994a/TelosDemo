/**
 * Ticket status values representing the lifecycle of a support ticket.
 * - Open: Newly created ticket awaiting assignment
 * - In Progress: Ticket is being actively worked on
 * - Resolved: Issue has been fixed, awaiting customer confirmation
 * - Closed: Ticket is complete and archived
 */
export type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';

/**
 * Ticket priority levels indicating urgency.
 * - Low: Can be addressed in normal workflow
 * - Medium: Should be addressed soon
 * - High: Requires prompt attention
 * - Critical: Requires immediate attention
 */
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical';

/**
 * Ticket category for classification.
 * - Technical: Technical issues, bugs, system problems
 * - Billing: Payment, invoicing, subscription issues
 * - General: General inquiries, feature requests, other
 */
export type TicketCategory = 'Technical' | 'Billing' | 'General';

/**
 * Complete ticket object as stored in the database and returned by API.
 * 
 * @property id - Unique identifier (UUID v4)
 * @property title - Brief description of the issue (max 200 chars recommended)
 * @property description - Detailed explanation of the problem
 * @property category - Type of issue (Technical, Billing, General)
 * @property priority - Urgency level (Low, Medium, High, Critical)
 * @property status - Current state in ticket lifecycle
 * @property customerEmail - Customer's contact email address
 * @property customerName - Customer's name (optional)
 * @property createdAt - ISO 8601 timestamp when ticket was created
 * @property updatedAt - ISO 8601 timestamp of last modification
 * @property resolvedAt - ISO 8601 timestamp when ticket was resolved (optional)
 * @property comments - Array of comments (only populated in detail view)
 */
export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  customerEmail: string;
  customerName?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  comments?: Comment[];
}

/**
 * Input data for creating a new ticket.
 * Omits system-generated fields (id, timestamps, status).
 */
export type TicketInput = Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'resolvedAt' | 'comments'>;

/**
 * Filters for querying tickets.
 * All fields are optional - omitted fields are not used in filtering.
 */
export interface TicketFilters {
  status?: string;
  priority?: string;
  category?: string;
  startDate?: string;  // ISO 8601 date string
  endDate?: string;    // ISO 8601 date string
}

/**
 * Comment on a ticket.
 * Can be from a support agent or system-generated.
 * 
 * @property id - Unique identifier (UUID v4)
 * @property ticketId - ID of the ticket this comment belongs to
 * @property content - Comment text content
 * @property authorId - ID of the user who created the comment
 * @property authorName - Display name of the comment author
 * @property isSystem - True if this is a system-generated comment (e.g., status changes)
 * @property createdAt - ISO 8601 timestamp when comment was created
 */
export interface Comment {
  id: string;
  ticketId: string;
  content: string;
  authorId: string;
  authorName: string;
  isSystem: boolean;
  createdAt: string;
}

/**
 * Input data for creating a new comment.
 * Omits system-generated fields.
 */
export type CommentInput = Omit<Comment, 'id' | 'createdAt'>;
