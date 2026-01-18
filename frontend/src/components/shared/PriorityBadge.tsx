import React from 'react';
import { TicketPriority } from '../../types/ticket';

/**
 * Props for PriorityBadge component.
 */
interface PriorityBadgeProps {
  priority: TicketPriority;
}

/**
 * Badge component for displaying ticket priority with color coding.
 * Uses Tailwind CSS classes defined in tailwind.config.js.
 * 
 * Color scheme:
 * - Low: Green
 * - Medium: Yellow
 * - High: Orange
 * - Critical: Red
 * 
 * @example
 * ```tsx
 * <PriorityBadge priority="Low" />
 * <PriorityBadge priority="Critical" />
 * ```
 */
export function PriorityBadge({ priority }: PriorityBadgeProps) {
  // Map priority to Tailwind CSS classes
  const priorityClasses: Record<TicketPriority, string> = {
    Low: 'bg-priority-low text-white',
    Medium: 'bg-priority-medium text-gray-900',
    High: 'bg-priority-high text-white',
    Critical: 'bg-priority-critical text-white',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityClasses[priority]}`}
    >
      {priority}
    </span>
  );
}
