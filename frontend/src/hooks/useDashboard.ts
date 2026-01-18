import { useState, useEffect, useCallback } from 'react';
import { DashboardMetrics } from '../types/ticket';
import * as dashboardApi from '../api/dashboard';
import { ApiError } from '../api/client';

/**
 * Custom hook for fetching dashboard metrics.
 * Handles loading states, errors, and automatic refetching.
 * 
 * @returns Dashboard metrics, loading state, error, and refetch function
 * 
 * @example
 * ```tsx
 * function Dashboard() {
 *   const { metrics, loading, error, refetch } = useDashboard();
 *   
 *   if (loading) return <LoadingSpinner />;
 *   if (error) return <ErrorMessage message={error} />;
 *   
 *   return <div>Open Tickets: {metrics.totalOpen}</div>;
 * }
 * ```
 */
export function useDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize fetch function
  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardApi.getDashboardMetrics();
      setMetrics(data);
    } catch (err) {
      const errorMessage =
        err instanceof ApiError ? err.message : 'Failed to fetch dashboard metrics';
      setError(errorMessage);
      console.error('Error fetching dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies, function never changes

  // Fetch metrics on mount
  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    metrics,
    loading,
    error,
    refetch: fetchMetrics, // Expose refetch function for manual refresh
  };
}
