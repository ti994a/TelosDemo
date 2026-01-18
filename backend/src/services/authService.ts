import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../database/db';
import { User, UserPublic, LoginCredentials, LoginResponse, TokenPayload } from '../models/User';
import { validateEmail, validateNonEmptyString } from '../utils/validators';
import { UnauthorizedError, ValidationError } from '../utils/errors';

/**
 * Service layer for authentication and user management.
 */

// Number of salt rounds for bcrypt hashing (higher = more secure but slower)
const SALT_ROUNDS = 10;

// JWT secret key - should be stored in environment variable in production
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// JWT token expiration time (24 hours)
const TOKEN_EXPIRATION = '24h';

/**
 * Registers a new user (support agent) in the system.
 * Hashes password using bcrypt before storing.
 * 
 * @param email - User's email address (must be unique)
 * @param password - Plain text password (will be hashed)
 * @param name - User's display name
 * @returns Public user information (without password hash)
 * @throws {ValidationError} If email or name is invalid
 * @throws {Error} If email already exists
 */
export async function registerUser(
  email: string,
  password: string,
  name: string
): Promise<UserPublic> {
  // Validate inputs
  const validatedEmail = validateEmail(email);
  const validatedName = validateNonEmptyString(name, 'name');
  const validatedPassword = validateNonEmptyString(password, 'password');

  const db = getDb();

  // Check if user already exists
  const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [validatedEmail]);
  if (existingUser) {
    throw new ValidationError('Email already registered', 'email');
  }

  // Hash password using bcrypt
  const passwordHash = await bcrypt.hash(validatedPassword, SALT_ROUNDS);

  const id = uuidv4();
  const now = new Date().toISOString();

  // Insert user into database
  await db.run(
    `INSERT INTO users (id, email, name, password_hash, created_at)
     VALUES (?, ?, ?, ?, ?)`,
    [id, validatedEmail, validatedName, passwordHash, now]
  );

  // Return public user info (no password hash)
  return {
    id,
    email: validatedEmail,
    name: validatedName,
    createdAt: now,
  };
}

/**
 * Authenticates a user and generates a JWT token.
 * Verifies email and password, then creates a token for session management.
 * 
 * @param credentials - Email and password
 * @returns Login response with JWT token and user info
 * @throws {UnauthorizedError} If credentials are invalid
 * @throws {ValidationError} If email format is invalid
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  // Validate email format
  const validatedEmail = validateEmail(credentials.email);

  const db = getDb();

  // Fetch user from database
  const user = await db.get(
    'SELECT id, email, name, password_hash, created_at FROM users WHERE email = ?',
    [validatedEmail]
  );

  if (!user) {
    // Don't reveal whether email exists (security best practice)
    throw new UnauthorizedError('Invalid email or password');
  }

  // Verify password using bcrypt
  const passwordMatch = await bcrypt.compare(credentials.password, user.password_hash);

  if (!passwordMatch) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Create JWT token payload
  const tokenPayload: TokenPayload = {
    id: user.id,
    email: user.email,
    name: user.name,
  };

  // Generate JWT token
  const token = jwt.sign(tokenPayload, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRATION,
  });

  // Return token and user info
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.created_at,
    },
  };
}

/**
 * Verifies a JWT token and returns the decoded payload.
 * Used by authentication middleware to validate requests.
 * 
 * @param token - JWT token string
 * @returns Decoded token payload with user info
 * @throws {UnauthorizedError} If token is invalid or expired
 */
export function verifyToken(token: string): TokenPayload {
  try {
    // Verify and decode JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Invalid token');
    }
    throw new UnauthorizedError('Token verification failed');
  }
}

/**
 * Gets a user by ID.
 * Used to fetch current user information.
 * 
 * @param userId - User ID
 * @returns Public user information
 * @throws {Error} If user not found
 */
export async function getUserById(userId: string): Promise<UserPublic> {
  const db = getDb();

  const user = await db.get(
    'SELECT id, email, name, created_at FROM users WHERE id = ?',
    [userId]
  );

  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.created_at,
  };
}
