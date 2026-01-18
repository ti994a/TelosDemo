import { get } from './client';
import { DashboardMetrics } from '../types/ticket';

/**
 * API functions for dashboard operations.
 */

/**
 * Fetches dashboard metrics.
 * 
 * @returns Dashboard metrics including ticket counts and averages
 */
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  return get<DashboardMetrics>('/dashboard/metrics');
}
