import { createApp } from './app';
import { initDatabase } from './database/db';

/**
 * Server entry point for the Customer Support Ticket System.
 * Initializes database and starts the Express server.
 */

const PORT = process.env.PORT || 3000;

/**
 * Starts the server.
 * Initializes database connection before starting HTTP server.
 */
async function startServer() {
  try {
    // Initialize database and create tables
    console.log('Initializing database...');
    await initDatabase();
    console.log('Database initialized successfully');

    // Create Express app
    const app = createApp();

    // Start listening for requests
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(`API base URL: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
startServer();
