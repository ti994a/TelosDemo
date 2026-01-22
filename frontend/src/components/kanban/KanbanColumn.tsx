import React, { useState } from 'react';
import { Ticket, TicketStatus, TicketCategory } from '../../types/ticket';
import { CategoryGroup } from './CategoryGroup';

interface KanbanColumnProps {
  status: TicketStatus;
  tickets: Ticket[];
  onDrop: (ticketId: string, newStatus: TicketStatus) => void;
  onDragStart: (ticketId: string) => void;
}

/**
 * KanbanColumn component represents a single status column on the Kanban board.
 * Groups tickets by category and handles drag-and-drop operations.
 */
export function KanbanColumn({ status, tickets, onDrop, onDragStart }: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  // Status color mapping for column header
  const statusColors: Record<TicketStatus, string> = {
    Open: 'bg-blue-100 text-blue-800',
    'In Progress': 'bg-yellow-100 text-yellow-800',
    Resolved: 'bg-green-100 text-green-800',
    Closed: 'bg-gray-100 text-gray-800'
  };

  // Group tickets by category
  const ticketsByCategory: Record<TicketCategory, Ticket[]> = {
    Technical: tickets.filter(t => t.category === 'Technical'),
    Billing: tickets.filter(t => t.category === 'Billing'),
    General: tickets.filter(t => t.category === 'General')
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Required to allow drop
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    // Extract ticket ID from dataTransfer
    const ticketId = e.dataTransfer.getData('ticketId');
    if (ticketId) {
      onDrop(ticketId, status);
    }
  };

  return (
    <div
      className={`flex-1 min-w-[280px] bg-gray-50 rounded-lg p-4 ${
        isDragOver ? 'ring-2 ring-blue-500 bg-blue-50' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column header */}
      <div className="mb-4">
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${statusColors[status]}`}>
          {status}
          <span className="ml-2 text-xs">({tickets.length})</span>
        </div>
      </div>

      {/* Category groups */}
      <div className="space-y-2">
        {(['Technical', 'Billing', 'General'] as TicketCategory[]).map(category => (
          <CategoryGroup
            key={category}
            category={category}
            tickets={ticketsByCategory[category]}
            onDragStart={onDragStart}
          />
        ))}

        {/* Empty state */}
        {tickets.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            No tickets
          </div>
        )}
      </div>
    </div>
  );
}
