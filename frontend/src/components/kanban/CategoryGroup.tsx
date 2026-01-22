import React from 'react';
import { Ticket, TicketCategory } from '../../types/ticket';
import { KanbanCard } from './KanbanCard';

interface CategoryGroupProps {
  category: TicketCategory;
  tickets: Ticket[];
  onDragStart: (ticketId: string) => void;
}

/**
 * CategoryGroup component groups tickets by category within a status column.
 * Tickets are sorted by priority (Critical → High → Medium → Low).
 */
export function CategoryGroup({ category, tickets, onDragStart }: CategoryGroupProps) {
  // Category icon and color mapping
  const categoryConfig: Record<TicketCategory, { icon: string; color: string }> = {
    Technical: { icon: '🔧', color: 'text-purple-600' },
    Billing: { icon: '💰', color: 'text-green-600' },
    General: { icon: '📋', color: 'text-blue-600' }
  };

  // Priority order for sorting (Critical = 0, High = 1, Medium = 2, Low = 3)
  const priorityOrder: Record<string, number> = {
    Critical: 0,
    High: 1,
    Medium: 2,
    Low: 3
  };

  // Sort tickets by priority (descending: Critical first, Low last)
  const sortedTickets = [...tickets].sort((a, b) => {
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  if (sortedTickets.length === 0) {
    return null; // Don't render empty category groups
  }

  const config = categoryConfig[category];

  return (
    <div className="mb-4">
      {/* Category header */}
      <div className="flex items-center gap-2 mb-2 px-2">
        <span className="text-lg">{config.icon}</span>
        <span className={`text-sm font-semibold ${config.color}`}>
          {category}
        </span>
        <span className="text-xs text-gray-500">
          ({sortedTickets.length})
        </span>
      </div>

      {/* Ticket cards */}
      <div>
        {sortedTickets.map(ticket => (
          <KanbanCard
            key={ticket.id}
            ticket={ticket}
            onDragStart={onDragStart}
          />
        ))}
      </div>
    </div>
  );
}
