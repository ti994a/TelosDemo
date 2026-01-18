import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as dashboardController from '../controllers/dashboardController';

/**
 * Dashboard routes for the Customer Support Ticket System.
 * Provides aggregated metrics and statistics.
 */

const router = Router();

/**
 * GET /api/dashboard/metrics
 * Get comprehensive dashboard metrics.
 * Requires authentication.
 * 
 * Response:
 * - totalOpen: Count of open tickets
 * - byPriority: Ticket counts by priority (Low, Medium, High, Critical)
 * - byCategory: Ticket counts by category (Technical, Billing, General)
 * - avgResolutionTime: Average resolution time in hours
 */
router.get('/metrics', authenticate, dashboardController.getMetrics);

export default router;
