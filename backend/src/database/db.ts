import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

// Global database instance
let db: Database | null = null;

/**
 * Initialize SQLite database connection.
 * Creates tables and indexes if they don't exist.
 * 
 * This function is idempotent - it can be called multiple times safely.
 * The database file will be created in the data/ directory.
 * 
 * @returns Promise resolving to the database instance
 */
export async function initDatabase(): Promise<Database> {
  // Return existing connection if already initialized
  if (db) {
    return db;
  }

  // Determine database path from environment or use default
  const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../data/tickets.db');
  
  // Ensure data directory exists
  const dataDir = path.dirname(dbPath);
  const fs = await import('fs/promises');
  await fs.mkdir(dataDir, { recursive: true });

  // Open database connection
  // sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE opens or creates the database
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  console.log(`Database connected: ${dbPath}`);

  // Create tables if they don't exist
  await createTables(db);

  return db;
}

/**
 * Creates all database tables and indexes.
 * Uses IF NOT EXISTS to make this operation idempotent.
 * 
 * @param database - The database instance
 */
async function createTables(database: Database): Promise<void> {
  // Create tickets table
  await database.exec(`
    CREATE TABLE IF NOT EXISTS tickets (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL CHECK(category IN ('Technical', 'Billing', 'General')),
      priority TEXT NOT NULL CHECK(priority IN ('Low', 'Medium', 'High', 'Critical')),
      status TEXT NOT NULL CHECK(status IN ('Open', 'In Progress', 'Resolved', 'Closed')),
      customer_email TEXT NOT NULL,
      customer_name TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      resolved_at TEXT
    );
  `);

  // Create comments table
  await database.exec(`
    CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      ticket_id TEXT NOT NULL,
      content TEXT NOT NULL,
      author_id TEXT NOT NULL,
      author_name TEXT NOT NULL,
      is_system INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
    );
  `);

  // Create users table
  await database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  // Create indexes for better query performance
  await createIndexes(database);

  console.log('Database tables created successfully');
}

/**
 * Creates indexes on frequently queried columns.
 * Indexes improve query performance for filtering and sorting.
 */
async function createIndexes(database: Database): Promise<void> {
  // Index on ticket status for filtering by status
  await database.exec(`
    CREATE INDEX IF NOT EXISTS idx_tickets_status 
    ON tickets(status);
  `);

  // Index on ticket creation date for sorting by date
  await database.exec(`
    CREATE INDEX IF NOT EXISTS idx_tickets_created_at 
    ON tickets(created_at);
  `);

  // Index on ticket priority for filtering by priority
  await database.exec(`
    CREATE INDEX IF NOT EXISTS idx_tickets_priority 
    ON tickets(priority);
  `);

  // Index on ticket category for filtering by category
  await database.exec(`
    CREATE INDEX IF NOT EXISTS idx_tickets_category 
    ON tickets(category);
  `);

  // Index on comments ticket_id for fetching comments by ticket
  await database.exec(`
    CREATE INDEX IF NOT EXISTS idx_comments_ticket_id 
    ON comments(ticket_id);
  `);

  // Index on users email for login lookups
  await database.exec(`
    CREATE INDEX IF NOT EXISTS idx_users_email 
    ON users(email);
  `);

  console.log('Database indexes created successfully');
}

/**
 * Get the database instance.
 * Throws an error if database hasn't been initialized.
 * 
 * @returns The database instance
 * @throws Error if database not initialized
 */
export function getDb(): Database {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

/**
 * Close the database connection.
 * Should be called when shutting down the application.
 */
export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.close();
    db = null;
    console.log('Database connection closed');
  }
}
