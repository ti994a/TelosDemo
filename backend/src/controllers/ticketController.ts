import { Request, Response, NextFunction } from 'express';
import * as ticketService from '../services/ticketService';
import * as commentService from '../services/commentService';
import { TicketInput, TicketFilters } from '../models/Ticket';
import { validateTicketInput } from '../utils/validators';
import { ValidationError } from '../utils/errors';

/**
 * Controller for ticket-related HTTP endpoints.
 * Handles request parsing, validation, and response formatting.
 * Business logic is delegated to the service layer.
 */

/**
 * GET /api/tickets
 * Retrieves all tickets with optional filtering.
 * 
 * Query parameters:
 * - status: Filter by ticket status (Open, In Progress, Resolved, Closed)
 * - priority: Filter by priority (Low, Medium, High, Critical)
 * - category: Filter by category (Technical, Billing, General)
 * - startDate: Filter tickets created after this date (ISO 8601)
 * - endDate: Filter tickets created before this date (ISO 8601)
 */
export async function getAllTickets(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Extract query parameters for filtering
    const filters: TicketFilters = {
      status: req.query.status as string | undefined,
      priority: req.query.priority as string | undefined,
      category: req.query.category as string | undefined,
      startDate: req.query.startDate as string | undefined,
      endDate: req.query.endDate as string | undefined,
    };

    // Fetch tickets from service layer
    const tickets = await ticketService.getTickets(filters);

    // Send successful response
    res.json({
      success: true,
      data: tickets,
      count: tickets.length,
    });
  } catch (error) {
    // Pass errors to error handling middleware
    next(error);
  }
}

/**
 * GET /api/tickets/:id
 * Retrieves a single ticket by ID with all comments.
 */
export async function getTicketById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    // Validate ID is provided
    if (!id) {
      throw new ValidationError('Ticket ID is required');
    }

    // Fetch ticket from service layer
    const ticket = await ticketService.getTicketById(id);

    res.json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/tickets
 * Creates a new support ticket.
 * 
 * Request body should include:
 * - title: Ticket title (required)
 * - description: Detailed description (required)
 * - category: Technical, Billing, or General (required)
 * - priority: Low, Medium, High, or Critical (required)
 * - customerEmail: Customer's email address (required)
 * - customerName: Customer's name (optional)
 */
export async function createTicket(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const ticketData: TicketInput = req.body;

    // Validate ticket input (throws ValidationError if invalid)
    validateTicketInput(ticketData);

    // Create ticket through service layer
    const newTicket = await ticketService.createTicket(ticketData);

    // Return 201 Created status with new ticket
    res.status(201).json({
      success: true,
      data: newTicket,
      message: 'Ticket created successfully',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/tickets/:id/status
 * Updates the status of a ticket.
 * Requires authentication (agent must be logged in).
 * 
 * Request body should include:
 * - status: New status value (Open, In Progress, Resolved, Closed)
 */
export async function updateTicketStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate inputs
    if (!id) {
      throw new ValidationError('Ticket ID is required');
    }
    if (!status) {
      throw new ValidationError('Status is required', 'status');
    }

    // Get authenticated user info (set by auth middleware)
    const agentId = req.user?.id || 'system';

    // Update ticket status through service layer
    const updatedTicket = await ticketService.updateTicketStatus(id, status, agentId);

    res.json({
      success: true,
      data: updatedTicket,
      message: `Ticket status updated to ${status}`,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/tickets/:id/comments
 * Adds a comment to a ticket.
 * Requires authentication (agent must be logged in).
 * 
 * Request body should include:
 * - content: Comment text (required)
 */
export async function addComment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id: ticketId } = req.params;
    const { content } = req.body;

    // Validate inputs
    if (!ticketId) {
      throw new ValidationError('Ticket ID is required');
    }
    if (!content) {
      throw new ValidationError('Comment content is required', 'content');
    }

    // Get authenticated user info (set by auth middleware)
    if (!req.user) {
      throw new ValidationError('User authentication required');
    }

    const { id: authorId, name: authorName } = req.user;

    // Add comment through service layer
    const newComment = await commentService.addComment(
      ticketId,
      content,
      authorId,
      authorName
    );

    // Return 201 Created status with new comment
    res.status(201).json({
      success: true,
      data: newComment,
      message: 'Comment added successfully',
    });
  } catch (error) {
    next(error);
  }
}
