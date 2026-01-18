import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket } from '../../types/ticket';
import { StatusBadge } from '../shared/StatusBadge';
import { PriorityBadge } from '../shared/PriorityBadge';
import { CategoryBadge } from '../shared/CategoryBadge';
import { formatRelativeTime } from '../../utils/formatters';

/**
 * Props for TicketListItem component.
 */
interface TicketListItemProps {
  ticket: Ticket;
}

/**
 * List item component for displaying a ticket in table/list format.
 * Shows ticket information in a horizontal row layout.
 * Clicking the row navigates to the ticket detail page.
 * 
 * @example
 * ```tsx
 * <TicketListItem ticket={ticket} />
 * ```
 */
export function TicketListItem({ ticket }: TicketListItemProps) {
  const navigate = useNavigate();

  /**
   * Handles row click to navigate to ticket detail page.
   */
  const handleClick = () => {
    navigate(`/tickets/${ticket.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left section: Title and ID */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {ticket.title}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              #{ticket.id.slice(0, 8)}
            </p>
          </div>

          {/* Middle section: Badges */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
            <CategoryBadge category={ticket.category} />
          </div>

          {/* Right section: Customer and Date */}
          <div className="flex items-center gap-6 flex-shrink-0 text-sm">
            <div className="hidden md:block min-w-[150px]">
              <p className="text-gray-900 truncate">
                {ticket.customerName || 'Unknown'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {ticket.customerEmail}
              </p>
            </div>
            <div className="text-right min-w-[100px]">
              <p className="text-gray-600 text-xs">
                {formatRelativeTime(ticket.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
