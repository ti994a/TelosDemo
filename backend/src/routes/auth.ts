import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as authController from '../controllers/authController';

/**
 * Authentication routes for the Customer Support Ticket System.
 * Handles user registration, login, and session management.
 */

const router = Router();

/**
 * POST /api/auth/register
 * Register a new support agent.
 * 
 * Request body:
 * - email: string (required, must be unique)
 * - password: string (required)
 * - name: string (required)
 */
router.post('/register', authController.register);

/**
 * POST /api/auth/login
 * Authenticate a support agent and receive JWT token.
 * 
 * Request body:
 * - email: string (required)
 * - password: string (required)
 * 
 * Response:
 * - token: JWT token for subsequent requests
 * - user: User information (id, email, name)
 */
router.post('/login', authController.login);

/**
 * POST /api/auth/logout
 * Logout the current user.
 * 
 * Note: With JWT, logout is primarily handled client-side
 * by removing the token from storage.
 */
router.post('/logout', authController.logout);

/**
 * GET /api/auth/me
 * Get current authenticated user's information.
 * Requires authentication.
 */
router.get('/me', authenticate, authController.getCurrentUser);

export default router;
