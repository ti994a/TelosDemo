---
inclusion: always
---

# Express API Best Practices

This document outlines Express.js backend coding standards and best practices for the Customer Support Ticket System API.

## Project Structure

```
backend/
  src/
    routes/          # API route definitions
      tickets.ts
      auth.ts
      dashboard.ts
    controllers/     # Request handlers
      ticketController.ts
      authController.ts
    services/        # Business logic
      ticketService.ts
      authService.ts
    models/          # Data models and types
      Ticket.ts
      User.ts
    middleware/      # Custom middleware
      auth.ts
      errorHandler.ts
      validation.ts
    database/        # Database setup and queries
      db.ts
      queries.ts
    utils/           # Helper functions
      logger.ts
      validators.ts
    app.ts           # Express app setup
    server.ts        # Server entry point
```

## Express Application Setup

### Basic App Configuration

```typescript
import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

/**
 * Creates and configures the Express application.
 * Sets up middleware, routes, and error handling.
 */
export function createApp(): Express {
  const app = express();

  // Security middleware - adds various HTTP headers for security
  app.use(helmet());

  // CORS middleware - allows frontend to make requests to API
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  }));

  // Body parsing middleware - parses JSON request bodies
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Logging middleware - logs HTTP requests
  app.use(morgan('dev'));

  // API routes
  app.use('/api/tickets', ticketRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/dashboard', dashboardRoutes);

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Error handling middleware (must be last)
  app.use(errorHandler);

  return app;
}
```

## Route Organization

### RESTful Route Structure

```typescript
import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as ticketController from '../controllers/ticketController';

const router = Router();

/**
 * Ticket Routes
 * All routes require authentication
 */

// GET /api/tickets - Get all tickets (with optional filters)
router.get('/', authenticate, ticketController.getAllTickets);

// GET /api/tickets/:id - Get single ticket by ID
router.get('/:id', authenticate, ticketController.getTicketById);

// POST /api/tickets - Create new ticket
router.post('/', ticketController.createTicket);

// PATCH /api/tickets/:id - Update ticket (partial update)
router.patch('/:id', authenticate, ticketController.updateTicket);

// PATCH /api/tickets/:id/status - Update ticket status
router.patch('/:id/status', authenticate, ticketController.updateTicketStatus);

// POST /api/tickets/:id/comments - Add comment to ticket
router.post('/:id/comments', authenticate, ticketController.addComment);

export default router;
```

## Controllers

### Request Handler Pattern

```typescript
import { Request, Response, NextFunction } from 'express';
import * as ticketService from '../services/ticketService';
import { ValidationError, NotFoundError } from '../utils/errors';

/**
 * Get all tickets with optional filtering.
 * Query params: status, priority, category, startDate, endDate
 */
export async function getAllTickets(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Extract query parameters
    const filters = {
      status: req.query.status as string | undefined,
      priority: req.query.priority as string | undefined,
      category: req.query.category as string | undefined,
      startDate: req.query.startDate as string | undefined,
      endDate: req.query.endDate as string | undefined
    };

    // Call service layer to get tickets
    const tickets = await ticketService.getTickets(filters);

    // Send successful response
    res.json({
      success: true,
      data: tickets,
      count: tickets.length
    });
  } catch (error) {
    // Pass errors to error handling middleware
    next(error);
  }
}

/**
 * Get a single ticket by ID.
 */
export async function getTicketById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!id) {
      throw new ValidationError('Ticket ID is required');
    }

    const ticket = await ticketService.getTicketById(id);

    if (!ticket) {
      throw new NotFoundError(`Ticket with ID ${id} not found`);
    }

    res.json({
      success: true,
      data: ticket
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Create a new ticket.
 */
export async function createTicket(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const ticketData = req.body;

    // Validate required fields
    if (!ticketData.title?.trim()) {
      throw new ValidationError('Title is required');
    }
    if (!ticketData.description?.trim()) {
      throw new ValidationError('Description is required');
    }

    // Create ticket through service layer
    const newTicket = await ticketService.createTicket(ticketData);

    // Return 201 Created status
    res.status(201).json({
      success: true,
      data: newTicket,
      message: 'Ticket created successfully'
    });
  } catch (error) {
    next(error);
  }
}
```

## Service Layer

### Business Logic Separation

```typescript
import { db } from '../database/db';
import { Ticket, TicketInput, TicketFilters } from '../models/Ticket';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service layer for ticket-related business logic.
 * Separates business logic from HTTP request handling.
 */

/**
 * Retrieves tickets with optional filtering.
 */
export async function getTickets(filters: TicketFilters): Promise<Ticket[]> {
  let query = 'SELECT * FROM tickets WHERE 1=1';
  const params: any[] = [];

  // Build dynamic query based on filters
  if (filters.status) {
    query += ' AND status = ?';
    params.push(filters.status);
  }

  if (filters.priority) {
    query += ' AND priority = ?';
    params.push(filters.priority);
  }

  if (filters.category) {
    query += ' AND category = ?';
    params.push(filters.category);
  }

  if (filters.startDate) {
    query += ' AND created_at >= ?';
    params.push(filters.startDate);
  }

  if (filters.endDate) {
    query += ' AND created_at <= ?';
    params.push(filters.endDate);
  }

  // Order by newest first
  query += ' ORDER BY created_at DESC';

  const tickets = await db.all(query, params);
  return tickets.map(mapDbTicketToTicket);
}

/**
 * Retrieves a single ticket by ID.
 */
export async function getTicketById(id: string): Promise<Ticket | null> {
  const ticket = await db.get('SELECT * FROM tickets WHERE id = ?', [id]);
  
  if (!ticket) {
    return null;
  }

  // Fetch comments for this ticket
  const comments = await db.all(
    'SELECT * FROM comments WHERE ticket_id = ? ORDER BY created_at ASC',
    [id]
  );

  return {
    ...mapDbTicketToTicket(ticket),
    comments: comments.map(mapDbCommentToComment)
  };
}

/**
 * Creates a new ticket.
 */
export async function createTicket(input: TicketInput): Promise<Ticket> {
  const id = uuidv4();
  const now = new Date().toISOString();

  const ticket: Ticket = {
    id,
    title: input.title.trim(),
    description: input.description.trim(),
    category: input.category,
    priority: input.priority,
    status: 'Open',
    customerEmail: input.customerEmail,
    customerName: input.customerName,
    createdAt: now,
    updatedAt: now
  };

  // Insert into database
  await db.run(
    `INSERT INTO tickets (
      id, title, description, category, priority, status,
      customer_email, customer_name, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      ticket.id,
      ticket.title,
      ticket.description,
      ticket.category,
      ticket.priority,
      ticket.status,
      ticket.customerEmail,
      ticket.customerName,
      ticket.createdAt,
      ticket.updatedAt
    ]
  );

  return ticket;
}

/**
 * Updates ticket status and creates a system comment.
 */
export async function updateTicketStatus(
  id: string,
  newStatus: string,
  agentId: string
): Promise<Ticket> {
  const now = new Date().toISOString();

  // Update ticket status
  await db.run(
    'UPDATE tickets SET status = ?, updated_at = ? WHERE id = ?',
    [newStatus, now, id]
  );

  // Create system comment about status change
  await db.run(
    `INSERT INTO comments (
      id, ticket_id, content, author_id, author_name, is_system, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      uuidv4(),
      id,
      `Status changed to ${newStatus}`,
      agentId,
      'System',
      true,
      now
    ]
  );

  // Return updated ticket
  const ticket = await getTicketById(id);
  if (!ticket) {
    throw new Error('Ticket not found after update');
  }

  return ticket;
}

/**
 * Helper function to map database row to Ticket object.
 */
function mapDbTicketToTicket(row: any): Ticket {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    priority: row.priority,
    status: row.status,
    customerEmail: row.customer_email,
    customerName: row.customer_name,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
```

## Middleware

### Authentication Middleware

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../utils/errors';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
      };
    }
  }
}

/**
 * Authentication middleware.
 * Verifies JWT token and attaches user info to request.
 */
export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, secret) as any;

    // Attach user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError('Invalid token'));
    } else {
      next(error);
    }
  }
}
```

### Error Handling Middleware

```typescript
import { Request, Response, NextFunction } from 'express';
import { ValidationError, NotFoundError, UnauthorizedError } from '../utils/errors';

/**
 * Global error handling middleware.
 * Catches all errors and sends appropriate responses.
 * Must be registered last in middleware chain.
 */
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('Error:', error);

  // Handle specific error types
  if (error instanceof ValidationError) {
    res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: error.message
    });
    return;
  }

  if (error instanceof NotFoundError) {
    res.status(404).json({
      success: false,
      error: 'Not Found',
      message: error.message
    });
    return;
  }

  if (error instanceof UnauthorizedError) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: error.message
    });
    return;
  }

  // Default to 500 Internal Server Error
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : error.message
  });
}
```

## Database Operations

### SQLite Setup and Queries

```typescript
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

let db: Database | null = null;

/**
 * Initialize SQLite database connection.
 * Creates tables if they don't exist.
 */
export async function initDatabase(): Promise<Database> {
  if (db) {
    return db;
  }

  // Open database connection
  db = await open({
    filename: path.join(__dirname, '../../data/tickets.db'),
    driver: sqlite3.Database
  });

  // Create tables
  await db.exec(`
    CREATE TABLE IF NOT EXISTS tickets (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      priority TEXT NOT NULL,
      status TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_name TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      ticket_id TEXT NOT NULL,
      content TEXT NOT NULL,
      author_id TEXT NOT NULL,
      author_name TEXT NOT NULL,
      is_system BOOLEAN DEFAULT 0,
      created_at TEXT NOT NULL,
      FOREIGN KEY (ticket_id) REFERENCES tickets(id)
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
    CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at);
    CREATE INDEX IF NOT EXISTS idx_comments_ticket_id ON comments(ticket_id);
  `);

  console.log('Database initialized successfully');
  return db;
}

/**
 * Get database instance.
 */
export function getDb(): Database {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}
```

## API Response Format

### Consistent Response Structure

```typescript
// Success response
{
  "success": true,
  "data": { /* response data */ },
  "message": "Optional success message"
}

// Error response
{
  "success": false,
  "error": "Error Type",
  "message": "Error description"
}

// List response with metadata
{
  "success": true,
  "data": [ /* array of items */ ],
  "count": 42,
  "page": 1,
  "totalPages": 5
}
```
