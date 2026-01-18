import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket } from '../../types/ticket';
import { StatusBadge } from '../shared/StatusBadge';
import { PriorityBadge } from '../shared/PriorityBadge';
import { CategoryBadge } from '../shared/CategoryBadge';
import { formatRelativeTime } from '../../utils/formatters';

/**
 * Props for TicketCard component.
 */
interface TicketCardProps {
  ticket: Ticket;
}

/**
 * Card component for displaying a ticket summary.
 * Shows title, status, priority, category, and creation date.
 * Clicking the card navigates to the ticket detail page.
 * 
 * @example
 * ```tsx
 * <TicketCard ticket={ticket} />
 * ```
 */
export function TicketCard({ ticket }: TicketCardProps) {
  const navigate = useNavigate();

  /**
   * Handles card click to navigate to ticket detail page.
   */
  const handleClick = () => {
    navigate(`/tickets/${ticket.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
    >
      {/* Header with badges */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-gray-900 truncate">
            {ticket.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Ticket #{ticket.id.slice(0, 8)}
          </p>
        </div>
      </div>

      {/* Description preview */}
      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
        {ticket.description}
      </p>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-3">
        <StatusBadge status={ticket.status} />
        <PriorityBadge priority={ticket.priority} />
        <CategoryBadge category={ticket.category} />
      </div>

      {/* Footer with customer and date */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className="truncate">
          {ticket.customerName || ticket.customerEmail}
        </span>
        <span className="flex-shrink-0 ml-2">
          {formatRelativeTime(ticket.createdAt)}
        </span>
      </div>
    </div>
  );
}
