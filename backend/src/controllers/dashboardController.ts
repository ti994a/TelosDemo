import { Request, Response, NextFunction } from 'express';
import * as dashboardService from '../services/dashboardService';

/**
 * Controller for dashboard-related HTTP endpoints.
 * Provides aggregated metrics and statistics for support agents.
 */

/**
 * GET /api/dashboard/metrics
 * Retrieves comprehensive dashboard metrics.
 * Requires authentication.
 * 
 * Returns:
 * - totalOpen: Count of tickets with status 'Open'
 * - byPriority: Ticket counts grouped by priority (Low, Medium, High, Critical)
 * - byCategory: Ticket counts grouped by category (Technical, Billing, General)
 * - avgResolutionTime: Average time to resolve tickets in hours
 */
export async function getMetrics(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Calculate metrics through service layer
    const metrics = await dashboardService.calculateMetrics();

    res.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    next(error);
  }
}
