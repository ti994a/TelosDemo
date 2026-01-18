import { getDb } from '../database/db';
import { DashboardMetrics, TicketsByPriority, TicketsByCategory } from '../models/Dashboard';
import { TicketPriority, TicketCategory } from '../models/Ticket';

/**
 * Service layer for dashboard metrics calculation.
 * Aggregates ticket data to provide insights for support agents.
 */

/**
 * Calculates comprehensive dashboard metrics.
 * Includes open ticket count, groupings by priority and category,
 * and average resolution time.
 * 
 * @returns Dashboard metrics object with all calculated values
 */
export async function calculateMetrics(): Promise<DashboardMetrics> {
  const db = getDb();

  // Count total open tickets (status = 'Open')
  const openTicketsResult = await db.get(
    "SELECT COUNT(*) as count FROM tickets WHERE status = 'Open'"
  );
  const totalOpen = openTicketsResult?.count || 0;

  // Group tickets by priority
  const priorityRows = await db.all(
    'SELECT priority, COUNT(*) as count FROM tickets GROUP BY priority'
  );

  // Initialize priority counts (default to 0 for each priority)
  const byPriority: TicketsByPriority = {
    Low: 0,
    Medium: 0,
    High: 0,
    Critical: 0,
  };

  // Populate actual counts from database
  priorityRows.forEach((row) => {
    const priority = row.priority as TicketPriority;
    byPriority[priority] = row.count;
  });

  // Group tickets by category
  const categoryRows = await db.all(
    'SELECT category, COUNT(*) as count FROM tickets GROUP BY category'
  );

  // Initialize category counts (default to 0 for each category)
  const byCategory: TicketsByCategory = {
    Technical: 0,
    Billing: 0,
    General: 0,
  };

  // Populate actual counts from database
  categoryRows.forEach((row) => {
    const category = row.category as TicketCategory;
    byCategory[category] = row.count;
  });

  // Calculate average resolution time for resolved tickets
  // Only include tickets that have been resolved (have resolved_at timestamp)
  const averageResolutionTime = await calculateAverageResolutionTime();

  return {
    totalOpen,
    byPriority,
    byCategory,
    averageResolutionTime,
  };
}

/**
 * Calculates average resolution time in hours for resolved tickets.
 * Resolution time = time from ticket creation to resolution.
 * 
 * @returns Average resolution time in hours, or 0 if no resolved tickets
 */
async function calculateAverageResolutionTime(): Promise<number> {
  const db = getDb();

  // Get all resolved tickets with timestamps
  const resolvedTickets = await db.all(
    `SELECT created_at, resolved_at 
     FROM tickets 
     WHERE status = 'Resolved' AND resolved_at IS NOT NULL`
  );

  // Return 0 if no resolved tickets
  if (resolvedTickets.length === 0) {
    return 0;
  }

  // Calculate total resolution time in milliseconds
  let totalResolutionTime = 0;

  for (const ticket of resolvedTickets) {
    const createdAt = new Date(ticket.created_at).getTime();
    const resolvedAt = new Date(ticket.resolved_at).getTime();
    
    // Add the difference (resolution time) to total
    totalResolutionTime += resolvedAt - createdAt;
  }

  // Calculate average in milliseconds
  const avgMilliseconds = totalResolutionTime / resolvedTickets.length;

  // Convert milliseconds to hours
  // 1 hour = 1000ms * 60s * 60min
  const avgHours = avgMilliseconds / (1000 * 60 * 60);

  // Round to 2 decimal places
  return Math.round(avgHours * 100) / 100;
}
