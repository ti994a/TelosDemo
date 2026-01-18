/**
 * User (support agent) in the system.
 * 
 * @property id - Unique identifier (UUID v4)
 * @property email - Unique email address for login
 * @property name - Display name of the user
 * @property passwordHash - Bcrypt hashed password (never sent to client)
 * @property createdAt - ISO 8601 timestamp when user was created
 */
export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
}

/**
 * User data without sensitive information.
 * Safe to send to client.
 */
export type UserPublic = Omit<User, 'passwordHash'>;

/**
 * Login credentials provided by user.
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * JWT token payload.
 * Contains user information embedded in the token.
 */
export interface TokenPayload {
  id: string;
  email: string;
  name: string;
}

/**
 * Response returned after successful login.
 */
export interface LoginResponse {
  token: string;
  user: UserPublic;
}
