import React from 'react';
import { useDashboard } from '../../hooks/useDashboard';
import { MetricCard } from './MetricCard';
import { DoughnutChart } from './DoughnutChart';
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

        {/* Tickets by priority - Doughnut Chart */}
        <div>
          <DoughnutChart
            title="Tickets by Priority"
            data={[
              { label: 'Critical', value: metrics.byPriority.Critical || 0, color: '#ef4444' },
              { label: 'High', value: metrics.byPriority.High || 0, color: '#f59e0b' },
              { label: 'Medium', value: metrics.byPriority.Medium || 0, color: '#3b82f6' },
              { label: 'Low', value: metrics.byPriority.Low || 0, color: '#9ca3af' },
            ]}
          />
        </div>

        {/* Tickets by category - Doughnut Chart */}
        <div>
          <DoughnutChart
            title="Tickets by Category"
            data={[
              { label: 'Technical', value: metrics.byCategory.Technical || 0, color: '#8b5cf6' },
              { label: 'Billing', value: metrics.byCategory.Billing || 0, color: '#10b981' },
              { label: 'General', value: metrics.byCategory.General || 0, color: '#3b82f6' },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
