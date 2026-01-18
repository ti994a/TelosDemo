/**
 * TypeScript type definitions for the Customer Support Ticket System.
 * These types match the backend API response structure.
 */

// Ticket status values
export type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';

// Ticket priority levels
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical';

// Ticket categories
export type TicketCategory = 'Technical' | 'Billing' | 'General';

/**
 * Represents a comment on a ticket.
 */
export interface Comment {
  id: string;
  ticketId: string;
  content: string;
  authorId: string;
  authorName: string;
  isSystem: boolean; // True for system-generated comments (e.g., status changes)
  createdAt: string; // ISO 8601 timestamp
}

/**
 * Represents a support ticket.
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
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
  resolvedAt?: string; // ISO 8601 timestamp (only set when status is 'Resolved')
  comments?: Comment[]; // Included when fetching single ticket
}

/**
 * Input data for creating a new ticket.
 */
export interface TicketInput {
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  customerEmail: string;
  customerName?: string;
}

/**
 * Filters for querying tickets.
 */
export interface TicketFilters {
  status?: TicketStatus;
  priority?: TicketPriority;
  category?: TicketCategory;
  startDate?: string; // ISO 8601 date
  endDate?: string; // ISO 8601 date
}

/**
 * Dashboard metrics data.
 */
export interface DashboardMetrics {
  totalOpen: number;
  byPriority: {
    Low: number;
    Medium: number;
    High: number;
    Critical: number;
  };
  byCategory: {
    Technical: number;
    Billing: number;
    General: number;
  };
  averageResolutionTime: number; // In hours
}
