import React from 'react';
import { TicketCategory } from '../../types/ticket';

/**
 * Props for CategoryBadge component.
 */
interface CategoryBadgeProps {
  category: TicketCategory;
}

/**
 * Badge component for displaying ticket category with color coding.
 * 
 * Color scheme:
 * - Technical: Purple
 * - Billing: Blue
 * - General: Gray
 * 
 * @example
 * ```tsx
 * <CategoryBadge category="Technical" />
 * <CategoryBadge category="Billing" />
 * ```
 */
export function CategoryBadge({ category }: CategoryBadgeProps) {
  // Map category to Tailwind CSS classes
  const categoryClasses: Record<TicketCategory, string> = {
    Technical: 'bg-purple-100 text-purple-800',
    Billing: 'bg-blue-100 text-blue-800',
    General: 'bg-gray-100 text-gray-800',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryClasses[category]}`}
    >
      {category}
    </span>
  );
}
