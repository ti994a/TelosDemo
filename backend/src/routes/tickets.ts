import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as ticketController from '../controllers/ticketController';

/**
 * Ticket routes for the Customer Support Ticket System.
 * Defines RESTful endpoints for ticket management.
 */

const router = Router();

/**
 * GET /api/tickets
 * Get all tickets with optional filtering.
 * Query params: status, priority, category, startDate, endDate
 * Requires authentication.
 */
router.get('/', authenticate, ticketController.getAllTickets);

/**
 * GET /api/tickets/:id
 * Get a single ticket by ID with all comments.
 * Requires authentication.
 */
router.get('/:id', authenticate, ticketController.getTicketById);

/**
 * POST /api/tickets
 * Create a new support ticket.
 * No authentication required (customers can submit tickets).
 * 
 * Request body:
 * - title: string (required)
 * - description: string (required)
 * - category: 'Technical' | 'Billing' | 'General' (required)
 * - priority: 'Low' | 'Medium' | 'High' | 'Critical' (required)
 * - customerEmail: string (required)
 * - customerName: string (optional)
 */
router.post('/', ticketController.createTicket);

/**
 * PATCH /api/tickets/:id/status
 * Update the status of a ticket.
 * Requires authentication (only agents can update status).
 * 
 * Request body:
 * - status: 'Open' | 'In Progress' | 'Resolved' | 'Closed' (required)
 */
router.patch('/:id/status', authenticate, ticketController.updateTicketStatus);

/**
 * POST /api/tickets/:id/comments
 * Add a comment to a ticket.
 * Requires authentication (only agents can comment).
 * 
 * Request body:
 * - content: string (required)
 */
router.post('/:id/comments', authenticate, ticketController.addComment);

export default router;
