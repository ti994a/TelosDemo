import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import ticketRoutes from './routes/tickets';
import authRoutes from './routes/auth';
import dashboardRoutes from './routes/dashboard';
import { errorHandler } from './middleware/errorHandler';

/**
 * Creates and configures the Express application.
 * Sets up middleware, routes, and error handling.
 * 
 * @returns Configured Express app instance
 */
export function createApp(): Express {
  const app = express();

  // Security middleware - adds various HTTP headers for security
  app.use(helmet());

  // CORS middleware - allows frontend to make requests to API
  // In production, restrict origin to your frontend domain
  app.use(
    cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true,
    })
  );

  // Body parsing middleware - parses JSON request bodies
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Logging middleware - logs HTTP requests in development
  if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
  }

  // Health check endpoint - useful for monitoring and load balancers
  app.get('/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // API routes
  app.use('/api/tickets', ticketRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/dashboard', dashboardRoutes);

  // 404 handler for undefined routes
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `Route ${req.method} ${req.path} not found`,
    });
  });

  // Error handling middleware - MUST be registered last
  app.use(errorHandler);

  return app;
}
