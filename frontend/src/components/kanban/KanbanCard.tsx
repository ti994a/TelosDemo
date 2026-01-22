import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket } from '../../types/ticket';

interface KanbanCardProps {
  ticket: Ticket;
  onDragStart: (ticketId: string) => void;
}

/**
 * KanbanCard component displays a single ticket as a draggable card.
 * Shows ticket number, title, and customer name with priority color indicator.
 */
export function KanbanCard({ ticket, onDragStart }: KanbanCardProps) {
  const navigate = useNavigate();

  // Priority color mapping for left border
  const priorityColors: Record<string, string> = {
    Critical: 'border-l-red-500',
    High: 'border-l-orange-500',
    Medium: 'border-l-blue-500',
    Low: 'border-l-gray-400'
  };

  const handleDragStart = (e: React.DragEvent) => {
    // Store ticket ID in dataTransfer for drop handler
    e.dataTransfer.setData('ticketId', ticket.id);
    e.dataTransfer.effectAllowed = 'move';
    onDragStart(ticket.id);
  };

  const handleClick = () => {
    // Navigate to ticket detail view
    navigate(`/tickets/${ticket.id}`);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={handleClick}
      className={`bg-white rounded-lg shadow-sm border-l-4 ${priorityColors[ticket.priority]} p-3 mb-2 cursor-pointer hover:shadow-md transition-shadow`}
    >
      {/* Ticket number */}
      <div className="text-xs text-gray-500 font-mono mb-1">
        #{ticket.id.substring(0, 8)}
      </div>

      {/* Ticket title */}
      <div className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
        {ticket.title}
      </div>

      {/* Customer name */}
      <div className="text-xs text-gray-600">
        {ticket.customerName || ticket.customerEmail}
      </div>
    </div>
  );
}
