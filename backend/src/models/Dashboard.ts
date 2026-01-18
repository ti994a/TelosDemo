import { TicketPriority, TicketCategory } from './Ticket';

/**
 * Dashboard metrics showing ticket statistics.
 * 
 * @property totalOpen - Count of tickets with status "Open"
 * @property byPriority - Ticket counts grouped by priority level
 * @property byCategory - Ticket counts grouped by category
 * @property averageResolutionTime - Average time to resolve tickets in hours
 */
export interface DashboardMetrics {
  totalOpen: number;
  byPriority: Record<TicketPriority, number>;
  byCategory: Record<TicketCategory, number>;
  averageResolutionTime: number;
}
