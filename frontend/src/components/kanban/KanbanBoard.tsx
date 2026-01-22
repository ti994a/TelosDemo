import React, { useState, useEffect } from 'react';
import { Ticket, TicketStatus } from '../../types/ticket';
import { KanbanColumn } from './KanbanColumn';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { ErrorMessage } from '../shared/ErrorMessage';
import * as api from '../../api/tickets';

/**
 * KanbanBoard component displays tickets organized by status columns.
 * Supports drag-and-drop to update ticket status.
 */
export function KanbanBoard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draggedTicketId, setDraggedTicketId] = useState<string | null>(null);

  // Fetch all tickets on mount
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
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
  };

  const handleDragStart = (ticketId: string) => {
    setDraggedTicketId(ticketId);
  };

  const handleDrop = async (ticketId: string, newStatus: TicketStatus) => {
    // Find the ticket being moved
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    // Don't update if status hasn't changed
    if (ticket.status === newStatus) {
      setDraggedTicketId(null);
      return;
    }

    try {
      // Optimistic update - update UI immediately
      setTickets(prevTickets =>
        prevTickets.map(t =>
          t.id === ticketId ? { ...t, status: newStatus } : t
        )
      );

      // Call API to update status
      await api.updateTicketStatus(ticketId, newStatus);

      // Refetch tickets to get system comment and updated timestamp
      await fetchTickets();
    } catch (err) {
      // Revert optimistic update on error
      setError(err instanceof Error ? err.message : 'Failed to update ticket status');
      await fetchTickets(); // Refetch to restore correct state
    } finally {
      setDraggedTicketId(null);
    }
  };

  // Group tickets by status
  const ticketsByStatus: Record<TicketStatus, Ticket[]> = {
    Open: tickets.filter(t => t.status === 'Open'),
    'In Progress': tickets.filter(t => t.status === 'In Progress'),
    Resolved: tickets.filter(t => t.status === 'Resolved'),
    Closed: tickets.filter(t => t.status === 'Closed')
  };

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
        <button
          onClick={fetchTickets}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Kanban Board</h1>
        <p className="mt-2 text-sm text-gray-600">
          Drag and drop tickets to update their status
        </p>
      </div>

      {/* Kanban columns */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {(['Open', 'In Progress', 'Resolved', 'Closed'] as TicketStatus[]).map(status => (
          <KanbanColumn
            key={status}
            status={status}
            tickets={ticketsByStatus[status]}
            onDrop={handleDrop}
            onDragStart={handleDragStart}
          />
        ))}
      </div>

      {/* Empty state */}
      {tickets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No tickets found</p>
          <p className="text-gray-400 text-sm mt-2">
            Create a new ticket to get started
          </p>
        </div>
      )}
    </div>
  );
}
