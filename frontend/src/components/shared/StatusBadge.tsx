import React from 'react';
import { TicketStatus } from '../../types/ticket';

/**
 * Props for StatusBadge component.
 */
interface StatusBadgeProps {
  status: TicketStatus;
}

/**
 * Badge component for displaying ticket status with color coding.
 * Uses Tailwind CSS classes defined in tailwind.config.js.
 * 
 * Color scheme:
 * - Open: Blue
 * - In Progress: Yellow
 * - Resolved: Green
 * - Closed: Gray
 * 
 * @example
 * ```tsx
 * <StatusBadge status="Open" />
 * <StatusBadge status="Resolved" />
 * ```
 */
export function StatusBadge({ status }: StatusBadgeProps) {
  // Map status to Tailwind CSS classes
  const statusClasses: Record<TicketStatus, string> = {
    Open: 'bg-status-open text-white',
    'In Progress': 'bg-status-in-progress text-gray-900',
    Resolved: 'bg-status-resolved text-white',
    Closed: 'bg-status-closed text-white',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status]}`}
    >
      {status}
    </span>
  );
}
