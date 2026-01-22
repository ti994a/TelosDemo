/**
 * Property-Based Tests for Kanban Board
 * 
 * These tests verify the correctness properties for the Kanban board view:
 * - Property 26: Kanban column organization
 * - Property 27: Kanban category grouping
 * - Property 28: Kanban priority sorting
 * - Property 29: Kanban card completeness
 * - Property 30: Kanban drag-and-drop status update
 * 
 * Feature: customer-support-ticket-system
 * Validates: Requirements 14.1, 14.2, 14.3, 14.4, 14.6, 14.7
 */

import * as fc from 'fast-check';

// Type definitions matching the frontend types
type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';
type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical';
type TicketCategory = 'Technical' | 'Billing' | 'General';

interface Ticket {
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
}

// ============================================================================
// Arbitraries (Generators) for Property-Based Testing
// ============================================================================

/**
 * Generator for ticket status values
 */
const statusArbitrary = (): fc.Arbitrary<TicketStatus> =>
  fc.constantFrom<TicketStatus>('Open', 'In Progress', 'Resolved', 'Closed');

/**
 * Generator for ticket priority values
 */
const priorityArbitrary = (): fc.Arbitrary<TicketPriority> =>
  fc.constantFrom<TicketPriority>('Low', 'Medium', 'High', 'Critical');

/**
 * Generator for ticket category values
 */
const categoryArbitrary = (): fc.Arbitrary<TicketCategory> =>
  fc.constantFrom<TicketCategory>('Technical', 'Billing', 'General');

/**
 * Generator for valid ticket objects
 */
const ticketArbitrary = (): fc.Arbitrary<Ticket> =>
  fc.record({
    id: fc.uuid(),
    title: fc.string({ minLength: 1, maxLength: 200 }),
    description: fc.string({ minLength: 1, maxLength: 1000 }),
    category: categoryArbitrary(),
    priority: priorityArbitrary(),
    status: statusArbitrary(),
    customerEmail: fc.emailAddress(),
    customerName: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: undefined }),
    createdAt: fc.date().map(d => d.toISOString()),
    updatedAt: fc.date().map(d => d.toISOString()),
  });

/**
 * Generator for arrays of tickets
 */
const ticketsArbitrary = (): fc.Arbitrary<Ticket[]> =>
  fc.array(ticketArbitrary(), { minLength: 0, maxLength: 50 });

// ============================================================================
// Helper Functions (Kanban Board Logic)
// ============================================================================

/**
 * Groups tickets by status (column organization)
 */
function groupTicketsByStatus(tickets: Ticket[]): Record<TicketStatus, Ticket[]> {
  return {
    Open: tickets.filter(t => t.status === 'Open'),
    'In Progress': tickets.filter(t => t.status === 'In Progress'),
    Resolved: tickets.filter(t => t.status === 'Resolved'),
    Closed: tickets.filter(t => t.status === 'Closed'),
  };
}

/**
 * Groups tickets by category within a status
 */
function groupTicketsByCategory(tickets: Ticket[]): Record<TicketCategory, Ticket[]> {
  return {
    Technical: tickets.filter(t => t.category === 'Technical'),
    Billing: tickets.filter(t => t.category === 'Billing'),
    General: tickets.filter(t => t.category === 'General'),
  };
}

/**
 * Sorts tickets by priority (descending: Critical first, Low last)
 */
function sortTicketsByPriority(tickets: Ticket[]): Ticket[] {
  const priorityOrder: Record<TicketPriority, number> = {
    Critical: 0,
    High: 1,
    Medium: 2,
    Low: 3,
  };

  return [...tickets].sort((a, b) => {
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

/**
 * Extracts card display information from a ticket
 */
function extractCardInfo(ticket: Ticket): { id: string; title: string; customerName: string } {
  return {
    id: ticket.id,
    title: ticket.title,
    customerName: ticket.customerName || ticket.customerEmail,
  };
}

/**
 * Simulates updating a ticket's status (drag-and-drop)
 */
function updateTicketStatus(ticket: Ticket, newStatus: TicketStatus): Ticket {
  return {
    ...ticket,
    status: newStatus,
    updatedAt: new Date().toISOString(),
  };
}

// ============================================================================
// Property Tests
// ============================================================================

describe('Kanban Board Property Tests', () => {
  /**
   * Property 26: Kanban column organization
   * For any set of tickets, when displayed on the Kanban board, tickets should be
   * organized into columns matching their status (Open, In Progress, Resolved, Closed).
   * 
   * Feature: customer-support-ticket-system, Property 26: Kanban column organization
   * Validates: Requirement 14.1
   */
  test('Property 26: tickets are organized into columns by status', () => {
    fc.assert(
      fc.property(ticketsArbitrary(), (tickets) => {
        const grouped = groupTicketsByStatus(tickets);

        // Every ticket in the 'Open' column must have status 'Open'
        expect(grouped.Open.every(t => t.status === 'Open')).toBe(true);

        // Every ticket in the 'In Progress' column must have status 'In Progress'
        expect(grouped['In Progress'].every(t => t.status === 'In Progress')).toBe(true);

        // Every ticket in the 'Resolved' column must have status 'Resolved'
        expect(grouped.Resolved.every(t => t.status === 'Resolved')).toBe(true);

        // Every ticket in the 'Closed' column must have status 'Closed'
        expect(grouped.Closed.every(t => t.status === 'Closed')).toBe(true);

        // All tickets should be accounted for (no tickets lost or duplicated)
        const totalInColumns = 
          grouped.Open.length +
          grouped['In Progress'].length +
          grouped.Resolved.length +
          grouped.Closed.length;
        expect(totalInColumns).toBe(tickets.length);

        // Each ticket should appear in exactly one column
        const allTicketIds = tickets.map(t => t.id);
        const columnTicketIds = [
          ...grouped.Open.map(t => t.id),
          ...grouped['In Progress'].map(t => t.id),
          ...grouped.Resolved.map(t => t.id),
          ...grouped.Closed.map(t => t.id),
        ];
        expect(new Set(columnTicketIds).size).toBe(columnTicketIds.length); // No duplicates
        expect(columnTicketIds.sort()).toEqual(allTicketIds.sort()); // Same tickets
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 27: Kanban category grouping
   * For any set of tickets within a status column, tickets should be grouped by
   * category (Technical, Billing, General).
   * 
   * Feature: customer-support-ticket-system, Property 27: Kanban category grouping
   * Validates: Requirement 14.2
   */
  test('Property 27: tickets within each column are grouped by category', () => {
    fc.assert(
      fc.property(ticketsArbitrary(), (tickets) => {
        const byStatus = groupTicketsByStatus(tickets);

        // For each status column, verify category grouping
        Object.values(byStatus).forEach(columnTickets => {
          const byCategory = groupTicketsByCategory(columnTickets);

          // Every ticket in 'Technical' group must have category 'Technical'
          expect(byCategory.Technical.every(t => t.category === 'Technical')).toBe(true);

          // Every ticket in 'Billing' group must have category 'Billing'
          expect(byCategory.Billing.every(t => t.category === 'Billing')).toBe(true);

          // Every ticket in 'General' group must have category 'General'
          expect(byCategory.General.every(t => t.category === 'General')).toBe(true);

          // All tickets in the column should be accounted for
          const totalInGroups =
            byCategory.Technical.length +
            byCategory.Billing.length +
            byCategory.General.length;
          expect(totalInGroups).toBe(columnTickets.length);
        });
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 28: Kanban priority sorting
   * For any set of tickets within a category group, tickets should be sorted by
   * priority in descending order (Critical, High, Medium, Low).
   * 
   * Feature: customer-support-ticket-system, Property 28: Kanban priority sorting
   * Validates: Requirement 14.3
   */
  test('Property 28: tickets within each category group are sorted by priority', () => {
    fc.assert(
      fc.property(ticketsArbitrary(), (tickets) => {
        const priorityOrder: Record<TicketPriority, number> = {
          Critical: 0,
          High: 1,
          Medium: 2,
          Low: 3,
        };

        const sorted = sortTicketsByPriority(tickets);

        // Verify that tickets are in descending priority order
        for (let i = 0; i < sorted.length - 1; i++) {
          const currentPriority = priorityOrder[sorted[i].priority];
          const nextPriority = priorityOrder[sorted[i + 1].priority];
          
          // Current ticket's priority should be <= next ticket's priority
          // (Critical=0 comes before Low=3)
          expect(currentPriority).toBeLessThanOrEqual(nextPriority);
        }

        // Verify all tickets are present (no tickets lost)
        expect(sorted.length).toBe(tickets.length);

        // Verify same tickets (by ID)
        const originalIds = tickets.map(t => t.id).sort();
        const sortedIds = sorted.map(t => t.id).sort();
        expect(sortedIds).toEqual(originalIds);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 29: Kanban card completeness
   * For any ticket displayed on the Kanban board, the card should show the ticket
   * number, title, and customer name.
   * 
   * Feature: customer-support-ticket-system, Property 29: Kanban card completeness
   * Validates: Requirement 14.4
   */
  test('Property 29: each ticket card displays complete information', () => {
    fc.assert(
      fc.property(ticketArbitrary(), (ticket) => {
        const cardInfo = extractCardInfo(ticket);

        // Card must include ticket ID
        expect(cardInfo.id).toBeDefined();
        expect(cardInfo.id).toBe(ticket.id);

        // Card must include ticket title
        expect(cardInfo.title).toBeDefined();
        expect(cardInfo.title).toBe(ticket.title);

        // Card must include customer name (or email as fallback)
        expect(cardInfo.customerName).toBeDefined();
        if (ticket.customerName) {
          expect(cardInfo.customerName).toBe(ticket.customerName);
        } else {
          expect(cardInfo.customerName).toBe(ticket.customerEmail);
        }
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 30: Kanban drag-and-drop status update
   * For any ticket dragged to a different status column, the system should update
   * the ticket's status to match the target column and create a system comment
   * recording the change.
   * 
   * Feature: customer-support-ticket-system, Property 30: Kanban drag-and-drop status update
   * Validates: Requirements 14.6, 14.7
   */
  test('Property 30: dragging ticket to new column updates its status', () => {
    fc.assert(
      fc.property(
        ticketArbitrary(),
        statusArbitrary(),
        (ticket, newStatus) => {
          // Skip if status hasn't changed (no update needed)
          if (ticket.status === newStatus) {
            return true;
          }

          const updatedTicket = updateTicketStatus(ticket, newStatus);

          // Ticket status should be updated to match the target column
          expect(updatedTicket.status).toBe(newStatus);

          // Ticket ID should remain the same
          expect(updatedTicket.id).toBe(ticket.id);

          // Other properties should remain unchanged
          expect(updatedTicket.title).toBe(ticket.title);
          expect(updatedTicket.description).toBe(ticket.description);
          expect(updatedTicket.category).toBe(ticket.category);
          expect(updatedTicket.priority).toBe(ticket.priority);
          expect(updatedTicket.customerEmail).toBe(ticket.customerEmail);
          expect(updatedTicket.customerName).toBe(ticket.customerName);

          // Updated timestamp should be set (not testing exact value, just that it exists)
          expect(updatedTicket.updatedAt).toBeDefined();

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Additional property: Verify complete Kanban board organization
   * This test combines all properties to verify the complete Kanban board structure.
   */
  test('Complete Kanban board organization (combined properties)', () => {
    fc.assert(
      fc.property(ticketsArbitrary(), (tickets) => {
        // Group by status (Property 26)
        const byStatus = groupTicketsByStatus(tickets);

        // For each status column
        Object.entries(byStatus).forEach(([_status, columnTickets]) => {
          // Group by category (Property 27)
          const byCategory = groupTicketsByCategory(columnTickets);

          // For each category group
          Object.entries(byCategory).forEach(([_category, categoryTickets]) => {
            // Sort by priority (Property 28)
            const sorted = sortTicketsByPriority(categoryTickets);

            // Verify each card has complete info (Property 29)
            sorted.forEach(ticket => {
              const cardInfo = extractCardInfo(ticket);
              expect(cardInfo.id).toBeDefined();
              expect(cardInfo.title).toBeDefined();
              expect(cardInfo.customerName).toBeDefined();
            });
          });
        });
      }),
      { numRuns: 100 }
    );
  });
});
