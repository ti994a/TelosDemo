import { get, post, patch } from './client';
import { Ticket, TicketInput, TicketFilters, Comment } from '../types/ticket';

/**
 * API functions for ticket-related operations.
 */

/**
 * Fetches all tickets with optional filtering.
 * 
 * @param filters - Optional filters for status, priority, category, date range
 * @returns Array of tickets
 */
export async function getTickets(filters?: TicketFilters): Promise<Ticket[]> {
  // Build query string from filters
  const params = new URLSearchParams();
  
  if (filters?.status) {
    params.append('status', filters.status);
  }
  if (filters?.priority) {
    params.append('priority', filters.priority);
  }
  if (filters?.category) {
    params.append('category', filters.category);
  }
  if (filters?.startDate) {
    params.append('startDate', filters.startDate);
  }
  if (filters?.endDate) {
    params.append('endDate', filters.endDate);
  }

  const queryString = params.toString();
  const endpoint = queryString ? `/tickets?${queryString}` : '/tickets';

  return get<Ticket[]>(endpoint);
}

/**
 * Fetches a single ticket by ID with all comments.
 * 
 * @param ticketId - Ticket ID
 * @returns Ticket with comments
 */
export async function getTicketById(ticketId: string): Promise<Ticket> {
  return get<Ticket>(`/tickets/${ticketId}`);
}

/**
 * Creates a new ticket.
 * 
 * @param ticketData - Ticket input data
 * @returns Newly created ticket
 */
export async function createTicket(ticketData: TicketInput): Promise<Ticket> {
  return post<Ticket>('/tickets', ticketData);
}

/**
 * Updates the status of a ticket.
 * 
 * @param ticketId - Ticket ID
 * @param status - New status value
 * @returns Updated ticket
 */
export async function updateTicketStatus(
  ticketId: string,
  status: string
): Promise<Ticket> {
  return patch<Ticket>(`/tickets/${ticketId}/status`, { status });
}

/**
 * Adds a comment to a ticket.
 * 
 * @param ticketId - Ticket ID
 * @param content - Comment text
 * @returns Newly created comment
 */
export async function addComment(
  ticketId: string,
  content: string
): Promise<Comment> {
  return post<Comment>(`/tickets/${ticketId}/comments`, { content });
}
