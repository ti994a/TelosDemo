import { useState, useEffect, useCallback } from 'react';
import { Ticket } from '../types/ticket';
import * as ticketsApi from '../api/tickets';
import { ApiError } from '../api/client';

/**
 * Custom hook for fetching a single ticket by ID.
 * Handles loading states, errors, and automatic refetching.
 * 
 * @param ticketId - Ticket ID to fetch
 * @returns Ticket data, loading state, error, and refetch function
 * 
 * @example
 * ```tsx
 * function TicketDetail({ ticketId }: { ticketId: string }) {
 *   const { ticket, loading, error, refetch } = useTicket(ticketId);
 *   
 *   if (loading) return <LoadingSpinner />;
 *   if (error) return <ErrorMessage message={error} />;
 *   if (!ticket) return <div>Ticket not found</div>;
 *   
 *   return <div>{ticket.title}</div>;
 * }
 * ```
 */
export function useTicket(ticketId: string) {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize fetch function
  const fetchTicket = useCallback(async () => {
    if (!ticketId) {
      setError('Ticket ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await ticketsApi.getTicketById(ticketId);
      setTicket(data);
    } catch (err) {
      const errorMessage =
        err instanceof ApiError ? err.message : 'Failed to fetch ticket';
      setError(errorMessage);
      console.error('Error fetching ticket:', err);
    } finally {
      setLoading(false);
    }
  }, [ticketId]); // Re-create function when ticketId changes

  // Fetch ticket on mount and when ticketId changes
  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  return {
    ticket,
    loading,
    error,
    refetch: fetchTicket, // Expose refetch function for manual refresh
  };
}
