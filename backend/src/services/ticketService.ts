import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../database/db';
import { Ticket, TicketInput, TicketFilters, Comment } from '../models/Ticket';
import { validateTicketInput, validateTicketStatus } from '../utils/validators';
import { NotFoundError } from '../utils/errors';

/**
 * Service layer for ticket-related business logic.
 * Separates business logic from HTTP request handling.
 */

/**
 * Creates a new ticket in the system.
 * Generates ID and timestamps, validates input, and inserts into database.
 * 
 * @param input - Ticket data from user
 * @returns The newly created ticket
 * @throws {ValidationError} If input validation fails
 */
export async function createTicket(input: TicketInput): Promise<Ticket> {
  // Validate all input fields
  validateTicketInput(input);

  const db = getDb();
  const id = uuidv4();
  const now = new Date().toISOString();

  const ticket: Ticket = {
    id,
    title: input.title.trim(),
    description: input.description.trim(),
    category: input.category,
    priority: input.priority,
    status: 'Open', // All new tickets start as Open
    customerEmail: input.customerEmail.trim(),
    customerName: input.customerName?.trim(),
    createdAt: now,
    updatedAt: now,
  };

  // Insert ticket into database
  await db.run(
    `INSERT INTO tickets (
      id, title, description, category, priority, status,
      customer_email, customer_name, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      ticket.id,
      ticket.title,
      ticket.description,
      ticket.category,
      ticket.priority,
      ticket.status,
      ticket.customerEmail,
      ticket.customerName || null,
      ticket.createdAt,
      ticket.updatedAt,
    ]
  );

  return ticket;
}

/**
 * Retrieves tickets with optional filtering.
 * Builds dynamic SQL query based on provided filters.
 * 
 * @param filters - Optional filters for status, priority, category, date range
 * @returns Array of tickets matching the filters
 */
export async function getTickets(filters: TicketFilters = {}): Promise<Ticket[]> {
  const db = getDb();
  
  // Start with base query
  let query = 'SELECT * FROM tickets WHERE 1=1';
  const params: any[] = [];

  // Add filters dynamically based on what's provided
  if (filters.status) {
    query += ' AND status = ?';
    params.push(filters.status);
  }

  if (filters.priority) {
    query += ' AND priority = ?';
    params.push(filters.priority);
  }

  if (filters.category) {
    query += ' AND category = ?';
    params.push(filters.category);
  }

  if (filters.startDate) {
    query += ' AND created_at >= ?';
    params.push(filters.startDate);
  }

  if (filters.endDate) {
    query += ' AND created_at <= ?';
    params.push(filters.endDate);
  }

  // Order by newest first
  query += ' ORDER BY created_at DESC';

  const rows = await db.all(query, params);
  return rows.map(mapDbRowToTicket);
}

/**
 * Retrieves a single ticket by ID with all its comments.
 * 
 * @param id - Ticket ID
 * @returns The ticket with comments, or null if not found
 */
export async function getTicketById(id: string): Promise<Ticket | null> {
  const db = getDb();

  // Fetch ticket
  const ticketRow = await db.get('SELECT * FROM tickets WHERE id = ?', [id]);

  if (!ticketRow) {
    return null;
  }

  // Fetch comments for this ticket, ordered chronologically
  const commentRows = await db.all(
    'SELECT * FROM comments WHERE ticket_id = ? ORDER BY created_at ASC',
    [id]
  );

  const ticket = mapDbRowToTicket(ticketRow);
  ticket.comments = commentRows.map(mapDbRowToComment);

  return ticket;
}

/**
 * Updates a ticket's status and creates a system comment recording the change.
 * Also updates the resolved_at timestamp if status is changed to Resolved.
 * 
 * @param id - Ticket ID
 * @param newStatus - New status value
 * @param agentId - ID of the agent making the change
 * @returns The updated ticket
 * @throws {ValidationError} If status is invalid
 * @throws {NotFoundError} If ticket doesn't exist
 */
export async function updateTicketStatus(
  id: string,
  newStatus: string,
  agentId: string
): Promise<Ticket> {
  // Validate status value
  const validatedStatus = validateTicketStatus(newStatus);

  const db = getDb();
  const now = new Date().toISOString();

  // Check if ticket exists
  const existing = await db.get('SELECT id FROM tickets WHERE id = ?', [id]);
  if (!existing) {
    throw new NotFoundError(`Ticket with ID ${id} not found`, id);
  }

  // Update ticket status and timestamps
  // If status is Resolved, set resolved_at timestamp
  if (validatedStatus === 'Resolved') {
    await db.run(
      'UPDATE tickets SET status = ?, updated_at = ?, resolved_at = ? WHERE id = ?',
      [validatedStatus, now, now, id]
    );
  } else {
    await db.run(
      'UPDATE tickets SET status = ?, updated_at = ? WHERE id = ?',
      [validatedStatus, now, id]
    );
  }

  // Create system comment recording the status change
  await db.run(
    `INSERT INTO comments (
      id, ticket_id, content, author_id, author_name, is_system, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      uuidv4(),
      id,
      `Status changed to ${validatedStatus}`,
      agentId,
      'System',
      1, // is_system = true
      now,
    ]
  );

  // Return updated ticket
  const ticket = await getTicketById(id);
  if (!ticket) {
    throw new Error('Ticket not found after update');
  }

  return ticket;
}

/**
 * Helper function to map database row to Ticket object.
 * Converts snake_case column names to camelCase property names.
 * 
 * @param row - Database row
 * @returns Ticket object
 */
function mapDbRowToTicket(row: any): Ticket {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    priority: row.priority,
    status: row.status,
    customerEmail: row.customer_email,
    customerName: row.customer_name || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    resolvedAt: row.resolved_at || undefined,
  };
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
