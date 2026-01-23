import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../../api/tickets';
import { Ticket, TicketStatus, TicketCategory, TicketPriority } from '../../types/ticket';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { ErrorMessage } from '../shared/ErrorMessage';
import { PriorityBadge } from '../shared/PriorityBadge';
import { CategoryBadge } from '../shared/CategoryBadge';

/**
 * Kanban Board Component
 * 
 * Displays tickets in a Kanban board layout with columns for each status.
 * Tickets are grouped by category and sorted by priority within each category.
 * Supports drag-and-drop to change ticket status.
 */

// Define the status columns in order
const STATUS_COLUMNS: TicketStatus[] = ['Open', 'In Progress', 'Resolved', 'Closed'];

// Priority order for sorting (highest to lowest)
const PRIORITY_ORDER: Record<TicketPriority, number> = {
  'Critical': 4,
  'High': 3,
  'Medium': 2,
  'Low': 1
};

// Category order for grouping
const CATEGORY_ORDER: TicketCategory[] = ['Technical', 'Billing', 'General'];

interface GroupedTickets {
  [category: string]: Ticket[];
}

/**
 * Groups tickets by category and sorts by priority (descending)
 */
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

export function KanbanBoard() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draggedTicket, setDraggedTicket] = useState<Ticket | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TicketStatus | null>(null);
  
  // Filter state
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | 'All'>('All');
  const [customerFilter, setCustomerFilter] = useState<string>('All');

  // Fetch all tickets on component mount
  useEffect(() => {
    fetchTickets();
  }, []);

  async function fetchTickets() {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getTickets();
      setTickets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  }

  /**
   * Extract unique customer emails from all tickets for filter dropdown.
   * Returns sorted array of unique emails.
   */
  const uniqueCustomers = React.useMemo(() => {
    const emails = new Set<string>();
    tickets.forEach(ticket => {
      if (ticket.customerEmail) {
        emails.add(ticket.customerEmail);
      }
    });
    return Array.from(emails).sort();
  }, [tickets]);

  /**
   * Apply filters to tickets.
   * Filters work together with AND logic:
   * - If priority filter is set, only show tickets with that priority
   * - If customer filter is set, only show tickets from that customer
   * - Both filters can be active simultaneously
   */
  const filteredTickets = React.useMemo(() => {
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
  }, [tickets, priorityFilter, customerFilter]);

  /**
   * Handle priority filter change.
   * Resets to 'All' if same value selected, otherwise sets new filter.
   */
  function handlePriorityFilterChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value as TicketPriority | 'All';
    setPriorityFilter(value);
  }

  /**
   * Handle customer filter change.
   * Resets to 'All' if same value selected, otherwise sets new filter.
   */
  function handleCustomerFilterChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setCustomerFilter(e.target.value);
  }

  // Handle drag start
  function handleDragStart(ticket: Ticket) {
    setDraggedTicket(ticket);
  }

  // Handle drag over column
  function handleDragOver(e: React.DragEvent, status: TicketStatus) {
    e.preventDefault(); // Allow drop
    setDragOverColumn(status);
  }

  // Handle drag leave column
  function handleDragLeave() {
    setDragOverColumn(null);
  }

  // Handle drop on column
  async function handleDrop(e: React.DragEvent, newStatus: TicketStatus) {
    e.preventDefault();
    setDragOverColumn(null);

    if (!draggedTicket || draggedTicket.status === newStatus) {
      setDraggedTicket(null);
      return;
    }

    try {
      // Update ticket status via API
      await api.updateTicketStatus(draggedTicket.id, newStatus);
      
      // Update local state
      setTickets(prevTickets =>
        prevTickets.map(ticket =>
          ticket.id === draggedTicket.id
            ? { ...ticket, status: newStatus }
            : ticket
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update ticket status');
    } finally {
      setDraggedTicket(null);
    }
  }

  // Handle ticket click - navigate to detail page
  function handleTicketClick(ticketId: string) {
    navigate(`/tickets/${ticketId}`);
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Kanban Board</h1>
        <p className="mt-2 text-sm text-gray-600">
          Drag and drop tickets to change their status
        </p>
      </div>

      {/* Filter bar */}
      <div className="mb-6 flex flex-wrap gap-4 items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        {/* Priority filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="priority-filter" className="text-sm font-medium text-gray-700">
            Priority:
          </label>
          <select
            id="priority-filter"
            value={priorityFilter}
            onChange={handlePriorityFilterChange}
            className="block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Customer filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="customer-filter" className="text-sm font-medium text-gray-700">
            Customer:
          </label>
          <select
            id="customer-filter"
            value={customerFilter}
            onChange={handleCustomerFilterChange}
            className="block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm max-w-xs"
          >
            <option value="All">All Customers</option>
            {uniqueCustomers.map(email => (
              <option key={email} value={email}>
                {email}
              </option>
            ))}
          </select>
        </div>

        {/* Active filter indicator */}
        {(priorityFilter !== 'All' || customerFilter !== 'All') && (
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-gray-600">
              Showing {filteredTickets.length} of {tickets.length} tickets
            </span>
            <button
              onClick={() => {
                setPriorityFilter('All');
                setCustomerFilter('All');
              }}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Kanban board */}
      <div className="grid grid-cols-4 gap-6">
        {STATUS_COLUMNS.map(status => {
          const columnTickets = filteredTickets.filter(t => t.status === status);
          const groupedTickets = groupAndSortTickets(columnTickets);
          const isDragOver = dragOverColumn === status;

          return (
            <div
              key={status}
              className={`flex flex-col bg-gray-50 rounded-lg p-4 min-h-[600px] border-r-2 border-gray-300 last:border-r-0 ${
                isDragOver ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onDragOver={(e) => handleDragOver(e, status)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, status)}
            >
              {/* Column header */}
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900 uppercase tracking-wide">
                  {status}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {columnTickets.length} {columnTickets.length === 1 ? 'ticket' : 'tickets'}
                </p>
              </div>

              {/* Tickets grouped by category */}
              <div className="space-y-4 flex-1">
                {columnTickets.length === 0 ? (
                  <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                    {priorityFilter !== 'All' || customerFilter !== 'All' 
                      ? 'No tickets match filters'
                      : 'No tickets'}
                  </div>
                ) : (
                  CATEGORY_ORDER.map(category => {
                    const categoryTickets = groupedTickets[category];
                    
                    if (categoryTickets.length === 0) {
                      return null;
                    }

                    return (
                      <div key={category} className="space-y-2">
                        {/* Category label */}
                        <div className="flex items-center">
                          <CategoryBadge category={category} />
                        </div>

                        {/* Tickets in this category */}
                        {categoryTickets.map(ticket => (
                          <div
                            key={ticket.id}
                            draggable
                            onDragStart={() => handleDragStart(ticket)}
                            className="bg-white rounded-lg shadow-sm border-2 border-gray-400 p-3 cursor-move hover:shadow-md hover:border-gray-500 transition-all"
                          >
                            {/* Ticket number and priority */}
                            <div className="flex items-center justify-between mb-2">
                              <button
                                onClick={() => handleTicketClick(ticket.id)}
                                className="text-sm font-mono text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                #{ticket.id.slice(0, 8)}
                              </button>
                              <PriorityBadge priority={ticket.priority} />
                            </div>

                            {/* Ticket title */}
                            <button
                              onClick={() => handleTicketClick(ticket.id)}
                              className="text-sm font-medium text-gray-900 hover:text-blue-600 text-left w-full mb-2 line-clamp-2"
                            >
                              {ticket.title}
                            </button>

                            {/* Customer name */}
                            {ticket.customerName && (
                              <p className="text-xs text-gray-500">
                                {ticket.customerName}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
