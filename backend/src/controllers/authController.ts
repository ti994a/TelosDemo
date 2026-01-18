import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';
import { LoginCredentials } from '../models/User';
import { ValidationError } from '../utils/errors';

/**
 * Controller for authentication-related HTTP endpoints.
 * Handles user login, registration, and session management.
 */

/**
 * POST /api/auth/register
 * Registers a new support agent.
 * 
 * Request body should include:
 * - email: Agent's email address (required, must be unique)
 * - password: Password (required)
 * - name: Agent's display name (required)
 */
export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password, name } = req.body;

    // Validate required fields
    if (!email) {
      throw new ValidationError('Email is required', 'email');
    }
    if (!password) {
      throw new ValidationError('Password is required', 'password');
    }
    if (!name) {
      throw new ValidationError('Name is required', 'name');
    }

    // Register user through service layer
    const user = await authService.registerUser(email, password, name);

    // Return 201 Created status with user info (no password)
    res.status(201).json({
      success: true,
      data: user,
      message: 'User registered successfully',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/login
 * Authenticates a support agent and returns JWT token.
 * 
 * Request body should include:
 * - email: Agent's email address (required)
 * - password: Password (required)
 * 
 * Returns:
 * - token: JWT token for subsequent authenticated requests
 * - user: User information (id, email, name)
 */
export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const credentials: LoginCredentials = {
      email: req.body.email,
      password: req.body.password,
    };

    // Validate required fields
    if (!credentials.email) {
      throw new ValidationError('Email is required', 'email');
    }
    if (!credentials.password) {
      throw new ValidationError('Password is required', 'password');
    }

    // Authenticate user and generate token
    const loginResponse = await authService.login(credentials);

    res.json({
      success: true,
      data: loginResponse,
      message: 'Login successful',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/logout
 * Logs out the current user.
 * 
 * Note: With JWT tokens, logout is typically handled client-side
 * by removing the token from storage. This endpoint is provided
 * for consistency and can be extended for token blacklisting if needed.
 */
export async function logout(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // With JWT, logout is handled client-side by removing the token
    // This endpoint can be extended to implement token blacklisting
    // or other server-side logout logic if needed

    res.json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/auth/me
 * Gets the current authenticated user's information.
 * Requires authentication.
 */
export async function getCurrentUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // User info is attached by auth middleware
    if (!req.user) {
      throw new ValidationError('User authentication required');
    }

    // Fetch full user details from database
    const user = await authService.getUserById(req.user.id);

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}
