import React from 'react';
import { TicketFilters, TicketStatus, TicketPriority, TicketCategory } from '../../types/ticket';

/**
 * Props for FilterBar component.
 */
interface FilterBarProps {
  filters: TicketFilters;
  onFiltersChange: (filters: TicketFilters) => void;
}

/**
 * Filter bar component for filtering tickets.
 * Provides dropdowns for status, priority, and category filters.
 * Includes a clear filters button.
 * 
 * @example
 * ```tsx
 * const [filters, setFilters] = useState<TicketFilters>({});
 * <FilterBar filters={filters} onFiltersChange={setFilters} />
 * ```
 */
export function FilterBar({ filters, onFiltersChange }: FilterBarProps) {
  /**
   * Handles filter change for a specific field.
   */
  const handleFilterChange = (field: keyof TicketFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [field]: value || undefined, // Remove filter if empty string
    });
  };

  /**
   * Clears all filters.
   */
  const handleClearFilters = () => {
    onFiltersChange({});
  };

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some((value) => value !== undefined);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-wrap gap-4 items-end">
        {/* Status filter */}
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status-filter"
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {/* Priority filter */}
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="priority-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            id="priority-filter"
            value={filters.priority || ''}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        {/* Category filter */}
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category-filter"
            value={filters.category || ''}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">All Categories</option>
            <option value="Technical">Technical</option>
            <option value="Billing">Billing</option>
            <option value="General">General</option>
          </select>
        </div>

        {/* Clear filters button */}
        {hasActiveFilters && (
          <div>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
