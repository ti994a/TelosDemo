import { useState, useEffect, useCallback } from 'react';
import { Ticket, TicketFilters } from '../types/ticket';
import * as ticketsApi from '../api/tickets';
import { ApiError } from '../api/client';

/**
 * Custom hook for fetching and managing tickets.
 * Handles loading states, errors, and automatic refetching.
 * 
 * @param filters - Optional filters for tickets
 * @returns Tickets data, loading state, error, and refetch function
 * 
 * @example
 * ```tsx
 * function TicketList() {
 *   const { tickets, loading, error, refetch } = useTickets();
 *   
 *   if (loading) return <LoadingSpinner />;
 *   if (error) return <ErrorMessage message={error} />;
 *   
 *   return <div>{tickets.map(ticket => <TicketCard ticket={ticket} />)}</div>;
 * }
 * ```
 */
export function useTickets(filters?: TicketFilters) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize fetch function to prevent unnecessary re-renders
  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ticketsApi.getTickets(filters);
      setTickets(data);
    } catch (err) {
      const errorMessage =
        err instanceof ApiError ? err.message : 'Failed to fetch tickets';
      setError(errorMessage);
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]); // Re-create function when filters change

  // Fetch tickets on mount and when filters change
  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return {
    tickets,
    loading,
    error,
    refetch: fetchTickets, // Expose refetch function for manual refresh
  };
}
