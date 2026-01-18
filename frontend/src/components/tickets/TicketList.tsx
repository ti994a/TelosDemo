import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TicketFilters } from '../../types/ticket';
import { useTickets } from '../../hooks/useTickets';
import { TicketCard } from './TicketCard';
import { TicketListItem } from './TicketListItem';
import { FilterBar } from './FilterBar';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { ErrorMessage } from '../shared/ErrorMessage';
import { EmptyState } from '../shared/EmptyState';

/**
 * View mode for ticket list display.
 */
type ViewMode = 'grid' | 'list';

/**
 * Ticket list component that displays all tickets with filtering.
 * Fetches tickets from API and displays them in grid or list layout.
 * Includes filter bar for status, priority, and category.
 * Includes view toggle for switching between grid and list views.
 * 
 * @example
 * ```tsx
 * <TicketList />
 * ```
 */
export function TicketList() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<TicketFilters>({});
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  
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
        <div className="flex items-center gap-3">
          {/* View toggle buttons */}
          <div className="flex items-center bg-gray-100 rounded-md p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              aria-label="Grid view"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              aria-label="List view"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
          
          <button
            onClick={handleCreateTicket}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create Ticket
          </button>
        </div>
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

      {/* Ticket display */}
      {!loading && !error && tickets.length > 0 && (
        <div>
          {/* Results count */}
          <div className="mb-4 text-sm text-gray-600">
            Showing {tickets.length} {tickets.length === 1 ? 'ticket' : 'tickets'}
          </div>

          {/* Grid view */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          )}

          {/* List view */}
          {viewMode === 'list' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Table header */}
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
                <div className="flex items-center justify-between gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex-1">Title</div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span>Status</span>
                    <span>Priority</span>
                    <span>Category</span>
                  </div>
                  <div className="flex items-center gap-6 flex-shrink-0">
                    <span className="hidden md:block min-w-[150px]">Customer</span>
                    <span className="min-w-[100px] text-right">Created</span>
                  </div>
                </div>
              </div>
              
              {/* Table rows */}
              {tickets.map((ticket) => (
                <TicketListItem key={ticket.id} ticket={ticket} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
