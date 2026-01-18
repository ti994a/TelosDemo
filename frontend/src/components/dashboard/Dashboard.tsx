import React from 'react';
import { useDashboard } from '../../hooks/useDashboard';
import { MetricCard } from './MetricCard';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { ErrorMessage } from '../shared/ErrorMessage';
import { formatResolutionTime } from '../../utils/formatters';

/**
 * Dashboard component displays key metrics about support tickets.
 * Shows total open tickets, tickets by priority, tickets by category,
 * and average resolution time.
 * 
 * @example
 * ```tsx
 * <Route path="/dashboard" element={<Dashboard />} />
 * ```
 */
export function Dashboard() {
  const { metrics, loading, error, refetch } = useDashboard();

  // Loading state
  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage message={error} onRetry={refetch} />
      </div>
    );
  }

  // No metrics (shouldn't happen, but handle gracefully)
  if (!metrics) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage message="No metrics available" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Overview of support ticket metrics and statistics
        </p>
      </div>

      {/* Metrics grid */}
      <div className="space-y-8">
        {/* Total open tickets */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              label="Total Open Tickets"
              value={metrics.totalOpen}
              color="blue"
            />
            <MetricCard
              label="Average Resolution Time"
              value={formatResolutionTime(metrics.averageResolutionTime)}
              color="green"
            />
          </div>
        </div>

        {/* Tickets by priority */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tickets by Priority</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              label="Critical Priority"
              value={metrics.byPriority.Critical || 0}
              color="red"
            />
            <MetricCard
              label="High Priority"
              value={metrics.byPriority.High || 0}
              color="yellow"
            />
            <MetricCard
              label="Medium Priority"
              value={metrics.byPriority.Medium || 0}
              color="blue"
            />
            <MetricCard
              label="Low Priority"
              value={metrics.byPriority.Low || 0}
              color="gray"
            />
          </div>
        </div>

        {/* Tickets by category */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tickets by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard
              label="Technical Issues"
              value={metrics.byCategory.Technical || 0}
              color="purple"
            />
            <MetricCard
              label="Billing Issues"
              value={metrics.byCategory.Billing || 0}
              color="green"
            />
            <MetricCard
              label="General Inquiries"
              value={metrics.byCategory.General || 0}
              color="blue"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
