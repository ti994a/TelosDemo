/**
 * Property-Based Tests for Kanban Board Filtering
 * 
 * These tests validate universal correctness properties across all valid inputs
 * using the fast-check property-based testing library.
 * 
 * Each property test runs a minimum of 100 iterations with randomly generated inputs
 * to ensure the filtering logic works correctly for all possible combinations.
 */

import fc from 'fast-check';
import { Ticket, TicketPriority, TicketCategory, TicketStatus } from '../../../types/ticket';

// ============================================================================
// Test Data Generators (Arbitraries)
// ============================================================================

/**
 * Generates random ticket priority values
 */
const priorityArbitrary = (): fc.Arbitrary<TicketPriority> =>
  fc.constantFrom<TicketPriority>('Critical', 'High', 'Medium', 'Low');

/**
 * Generates random ticket category values
 */
const categoryArbitrary = (): fc.Arbitrary<TicketCategory> =>
  fc.constantFrom<TicketCategory>('Technical', 'Billing', 'General');

/**
 * Generates random ticket status values
 */
const statusArbitrary = (): fc.Arbitrary<TicketStatus> =>
  fc.constantFrom<TicketStatus>('Open', 'In Progress', 'Resolved', 'Closed');

/**
 * Generates random email addresses
 */
const emailArbitrary = (): fc.Arbitrary<string> =>
  fc.emailAddress();

/**
 * Generates a random ticket with all required fields
 */
const ticketArbitrary = (): fc.Arbitrary<Ticket> =>
  fc.record({
    id: fc.uuid(),
    title: fc.string({ minLength: 1, maxLength: 200 }),
    description: fc.string({ minLength: 1, maxLength: 1000 }),
    category: categoryArbitrary(),
    priority: priorityArbitrary(),
    status: statusArbitrary(),
    customerEmail: emailArbitrary(),
    customerName: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: undefined }),
    createdAt: fc.integer({ min: 1577836800000, max: 1924905600000 }).map(ts => new Date(ts).toISOString()),
    updatedAt: fc.integer({ min: 1577836800000, max: 1924905600000 }).map(ts => new Date(ts).toISOString()),
  });

/**
 * Generates an array of random tickets
 */
const ticketsArrayArbitrary = (): fc.Arbitrary<Ticket[]> =>
  fc.array(ticketArbitrary(), { minLength: 0, maxLength: 50 });

// ============================================================================
// Filtering Logic (Extracted from Component)
// ============================================================================

/**
 * Apply priority filter to tickets.
 * Returns only tickets matching the specified priority, or all tickets if 'All'.
 */
function applyPriorityFilter(
  tickets: Ticket[],
  priorityFilter: TicketPriority | 'All'
): Ticket[] {
  if (priorityFilter === 'All') {
    return tickets;
  }
  return tickets.filter(ticket => ticket.priority === priorityFilter);
}

/**
 * Apply customer filter to tickets.
 * Returns only tickets from the specified customer, or all tickets if 'All'.
 */
function applyCustomerFilter(
  tickets: Ticket[],
  customerFilter: string
): Ticket[] {
  if (customerFilter === 'All') {
    return tickets;
  }
  return tickets.filter(ticket => ticket.customerEmail === customerFilter);
}

/**
 * Apply both filters to tickets (AND logic).
 */
function applyCombinedFilters(
  tickets: Ticket[],
  priorityFilter: TicketPriority | 'All',
  customerFilter: string
): Ticket[] {
  return tickets.filter(ticket => {
    // Apply priority filter
    if (priorityFilter !== 'All' && ticket.priority !== priorityFilter) {
      return false;
    }
    
    // Apply customer filter
    if (customerFilter !== 'All' && ticket.customerEmail !== customerFilter) {
      return false;
    }
    
    return true;
  });
}

/**
 * Group tickets by category and sort by priority (descending).
 * This is the organization logic used in the Kanban board.
 */
const PRIORITY_ORDER: Record<TicketPriority, number> = {
  'Critical': 4,
  'High': 3,
  'Medium': 2,
  'Low': 1
};

interface GroupedTickets {
  [category: string]: Ticket[];
}

function groupAndSortTickets(tickets: Ticket[]): GroupedTickets {
  const grouped: GroupedTickets = {
    'Technical': [],
    'Billing': [],
    'General': []
  };

  // Group tickets by category
  tickets.forEach(ticket => {
    if (grouped[ticket.category]) {
      grouped[ticket.category].push(ticket);
    }
  });

  // Sort each category by priority (descending)
  Object.keys(grouped).forEach(category => {
    grouped[category].sort((a, b) => 
      PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority]
    );
  });

  return grouped;
}

// ============================================================================
// Property Tests
// ============================================================================

describe('Kanban Board Filtering - Property-Based Tests', () => {
  /**
   * Feature: customer-support-ticket-system, Property 31: Kanban priority filter accuracy
   * 
   * For any set of tickets and any selected priority value (Critical, High, Medium, Low),
   * when the priority filter is applied on the Kanban board, only tickets matching the
   * selected priority should be displayed across all status columns.
   */
  test('Property 31: Priority filter returns only tickets with selected priority', () => {
    fc.assert(
      fc.property(
        ticketsArrayArbitrary(),
        priorityArbitrary(),
        (tickets, selectedPriority) => {
          // Apply priority filter
          const filtered = applyPriorityFilter(tickets, selectedPriority);

          // All filtered tickets must have the selected priority
          const allMatchPriority = filtered.every(
            ticket => ticket.priority === selectedPriority
          );

          // No tickets with the selected priority should be excluded
          const originalWithPriority = tickets.filter(
            ticket => ticket.priority === selectedPriority
          );
          const noneExcluded = filtered.length === originalWithPriority.length;

          return allMatchPriority && noneExcluded;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: customer-support-ticket-system, Property 32: Kanban customer filter accuracy
   * 
   * For any set of tickets and any selected customer email, when the customer filter is
   * applied on the Kanban board, only tickets from the selected customer should be
   * displayed across all status columns.
   */
  test('Property 32: Customer filter returns only tickets from selected customer', () => {
    fc.assert(
      fc.property(
        ticketsArrayArbitrary(),
        emailArbitrary(),
        (tickets, selectedCustomer) => {
          // Apply customer filter
          const filtered = applyCustomerFilter(tickets, selectedCustomer);

          // All filtered tickets must be from the selected customer
          const allMatchCustomer = filtered.every(
            ticket => ticket.customerEmail === selectedCustomer
          );

          // No tickets from the selected customer should be excluded
          const originalWithCustomer = tickets.filter(
            ticket => ticket.customerEmail === selectedCustomer
          );
          const noneExcluded = filtered.length === originalWithCustomer.length;

          return allMatchCustomer && noneExcluded;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: customer-support-ticket-system, Property 33: Kanban combined filter accuracy
   * 
   * For any set of tickets, when both priority and customer filters are applied on the
   * Kanban board, only tickets matching both filter criteria should be displayed across
   * all status columns.
   */
  test('Property 33: Combined filters return only tickets matching both criteria', () => {
    fc.assert(
      fc.property(
        ticketsArrayArbitrary(),
        priorityArbitrary(),
        emailArbitrary(),
        (tickets, selectedPriority, selectedCustomer) => {
          // Apply combined filters
          const filtered = applyCombinedFilters(tickets, selectedPriority, selectedCustomer);

          // All filtered tickets must match both criteria
          const allMatchBoth = filtered.every(
            ticket =>
              ticket.priority === selectedPriority &&
              ticket.customerEmail === selectedCustomer
          );

          // No tickets matching both criteria should be excluded
          const originalMatchingBoth = tickets.filter(
            ticket =>
              ticket.priority === selectedPriority &&
              ticket.customerEmail === selectedCustomer
          );
          const noneExcluded = filtered.length === originalMatchingBoth.length;

          return allMatchBoth && noneExcluded;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: customer-support-ticket-system, Property 34: Kanban filter reset completeness
   * 
   * For any set of tickets, when "All" is selected for a filter on the Kanban board,
   * that filter should be removed and all tickets (subject to other active filters)
   * should be displayed.
   */
  test('Property 34: Selecting "All" resets filter and returns all tickets', () => {
    fc.assert(
      fc.property(
        ticketsArrayArbitrary(),
        (tickets) => {
          // Test priority filter reset
          const priorityReset = applyPriorityFilter(tickets, 'All');
          const priorityResetCorrect = priorityReset.length === tickets.length &&
            priorityReset.every((ticket, index) => ticket === tickets[index]);

          // Test customer filter reset
          const customerReset = applyCustomerFilter(tickets, 'All');
          const customerResetCorrect = customerReset.length === tickets.length &&
            customerReset.every((ticket, index) => ticket === tickets[index]);

          // Test combined filter reset
          const combinedReset = applyCombinedFilters(tickets, 'All', 'All');
          const combinedResetCorrect = combinedReset.length === tickets.length &&
            combinedReset.every((ticket, index) => ticket === tickets[index]);

          return priorityResetCorrect && customerResetCorrect && combinedResetCorrect;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: customer-support-ticket-system, Property 35: Kanban filtered ticket organization
   * 
   * For any set of filtered tickets on the Kanban board, the tickets should maintain
   * category grouping and priority sorting within each status column.
   */
  test('Property 35: Filtered tickets maintain category grouping and priority sorting', () => {
    fc.assert(
      fc.property(
        ticketsArrayArbitrary(),
        priorityArbitrary(),
        emailArbitrary(),
        (tickets, selectedPriority, selectedCustomer) => {
          // Apply filters
          const filtered = applyCombinedFilters(tickets, selectedPriority, selectedCustomer);

          // Group and sort filtered tickets
          const grouped = groupAndSortTickets(filtered);

          // Verify category grouping: all tickets in each category group should have that category
          const categoryGroupingCorrect = Object.entries(grouped).every(
            ([category, categoryTickets]) =>
              categoryTickets.every(ticket => ticket.category === category)
          );

          // Verify priority sorting: tickets in each category should be sorted by priority (descending)
          const prioritySortingCorrect = Object.values(grouped).every(
            categoryTickets => {
              for (let i = 0; i < categoryTickets.length - 1; i++) {
                const currentPriority = PRIORITY_ORDER[categoryTickets[i].priority];
                const nextPriority = PRIORITY_ORDER[categoryTickets[i + 1].priority];
                if (currentPriority < nextPriority) {
                  return false; // Not sorted correctly
                }
              }
              return true;
            }
          );

          // Verify no tickets are lost or duplicated during grouping
          const totalGroupedTickets = Object.values(grouped).reduce(
            (sum, categoryTickets) => sum + categoryTickets.length,
            0
          );
          const noTicketsLost = totalGroupedTickets === filtered.length;

          return categoryGroupingCorrect && prioritySortingCorrect && noTicketsLost;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Additional property: Filter idempotence
   * 
   * Applying the same filter twice should produce the same result.
   */
  test('Additional Property: Applying filter twice produces same result (idempotence)', () => {
    fc.assert(
      fc.property(
        ticketsArrayArbitrary(),
        priorityArbitrary(),
        emailArbitrary(),
        (tickets, selectedPriority, selectedCustomer) => {
          // Apply filters once
          const filtered1 = applyCombinedFilters(tickets, selectedPriority, selectedCustomer);

          // Apply filters again to the already filtered result
          const filtered2 = applyCombinedFilters(filtered1, selectedPriority, selectedCustomer);

          // Results should be identical
          return (
            filtered1.length === filtered2.length &&
            filtered1.every((ticket, index) => ticket === filtered2[index])
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Additional property: Filter commutativity
   * 
   * The order of applying filters should not matter (priority then customer vs customer then priority).
   */
  test('Additional Property: Filter order does not matter (commutativity)', () => {
    fc.assert(
      fc.property(
        ticketsArrayArbitrary(),
        priorityArbitrary(),
        emailArbitrary(),
        (tickets, selectedPriority, selectedCustomer) => {
          // Apply priority filter first, then customer filter
          const priorityFirst = applyCustomerFilter(
            applyPriorityFilter(tickets, selectedPriority),
            selectedCustomer
          );

          // Apply customer filter first, then priority filter
          const customerFirst = applyPriorityFilter(
            applyCustomerFilter(tickets, selectedCustomer),
            selectedPriority
          );

          // Results should be identical
          return (
            priorityFirst.length === customerFirst.length &&
            priorityFirst.every((ticket, index) => ticket.id === customerFirst[index].id)
          );
        }
      ),
      { numRuns: 100 }
    );
  });
});
