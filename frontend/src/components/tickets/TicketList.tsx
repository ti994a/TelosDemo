import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TicketFilters } from '../../types/ticket';
import { useTickets } from '../../hooks/useTickets';
import { TicketCard } from './TicketCard';
import { FilterBar } from './FilterBar';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { ErrorMessage } from '../shared/ErrorMessage';
import { EmptyState } from '../shared/EmptyState';

/**
 * Ticket list component that displays all tickets with filtering.
 * Fetches tickets from API and displays them in a grid layout.
 * Includes filter bar for status, priority, and category.
 * 
 * @example
 * ```tsx
 * <TicketList />
 * ```
 */
export function TicketList() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<TicketFilters>({});
  
  // Fetch tickets with current filters
  const { tickets, loading, error, refetch } = useTickets(filters);

  /**
   * Handles navigation to create new ticket page.
   */
  const handleCreateTicket = () => {
    navigate('/tickets/new');
  };

  /**
   * Handles clearing all filters.
   */
  const handleClearFilters = () => {
    setFilters({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
          <p className="mt-1 text-sm text-gray-600">
            View and manage customer support tickets
          </p>
        </div>
        <button
          onClick={handleCreateTicket}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Create Ticket
        </button>
      </div>

      {/* Filter bar */}
      <FilterBar filters={filters} onFiltersChange={setFilters} />

      {/* Loading state */}
      {loading && <LoadingSpinner message="Loading tickets..." />}

      {/* Error state */}
      {error && <ErrorMessage message={error} onRetry={refetch} />}

      {/* Empty state */}
      {!loading && !error && tickets.length === 0 && (
        <EmptyState
          title="No tickets found"
          message={
            Object.keys(filters).length > 0
              ? 'No tickets match your current filters. Try adjusting your search criteria.'
              : 'There are no tickets yet. Create your first ticket to get started.'
          }
          actionLabel={Object.keys(filters).length > 0 ? 'Clear Filters' : 'Create Ticket'}
          onAction={Object.keys(filters).length > 0 ? handleClearFilters : handleCreateTicket}
        />
      )}

      {/* Ticket grid */}
      {!loading && !error && tickets.length > 0 && (
        <div>
          {/* Results count */}
          <div className="mb-4 text-sm text-gray-600">
            Showing {tickets.length} {tickets.length === 1 ? 'ticket' : 'tickets'}
          </div>

          {/* Grid of ticket cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
