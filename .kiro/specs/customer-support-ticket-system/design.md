# Design Document

## Overview

The Customer Support Ticket System is a full-stack web application built with React, TypeScript, Express, and SQLite. The system enables customers to submit support requests and allows support agents to manage, track, and resolve tickets through an intuitive web interface.

The application follows a client-server architecture with a React frontend communicating with an Express REST API backend. Data is persisted in a SQLite database, providing a zero-configuration solution suitable for demos and small-to-medium deployments.

## Architecture

### High-Level Architecture

The system consists of three main layers:

1. **Presentation Layer (Frontend)**
   - React 18 with TypeScript
   - Vite for development and building
   - Tailwind CSS for styling
   - React Router for client-side routing

2. **Application Layer (Backend)**
   - Node.js with Express and TypeScript
   - RESTful API design
   - JWT-based authentication
   - Middleware for auth, validation, and error handling

3. **Data Layer**
   - SQLite embedded database
   - Simple schema with three main tables: tickets, comments, users
   - No ORM - direct SQL queries for simplicity

### Communication Flow

```
Browser → React App → HTTP/JSON → Express API → SQLite Database
```

All communication between frontend and backend uses JSON over HTTP. The frontend makes RESTful API calls using the Fetch API, and the backend responds with JSON payloads following a consistent structure.

## Components and Interfaces

### Frontend Components

#### Core Components

1. **App Component**
   - Root component managing routing and global state
   - Provides authentication context to child components
   - Handles route protection for authenticated pages

2. **Authentication Components**
   - `LoginForm`: Handles agent login with email/password
   - `AuthContext`: Provides authentication state and methods throughout the app

3. **Dashboard Components**
   - `Dashboard`: Main dashboard view showing metrics
   - `MetricCard`: Reusable card component for displaying individual metrics (deprecated in favor of charts)
   - `DoughnutChart`: Canvas-based doughnut chart for visual data representation
   - Displays: total open tickets, tickets by priority (doughnut chart), tickets by category (doughnut chart), average resolution time

4. **Ticket List Components**
   - `TicketList`: Main list view with filtering capabilities and view toggle (grid/list)
   - `TicketCard`: Individual ticket card showing summary information (grid view)
   - `TicketListItem`: Individual ticket row showing summary information (list view)
   - `FilterBar`: Filter controls for status, priority, category, and date range

5. **Ticket Detail Components**
   - `TicketDetail`: Full ticket information page
   - `TicketHeader`: Displays ticket title and metadata
   - `StatusSelector`: Dropdown for changing ticket status
   - `CommentThread`: Displays all comments in chronological order
   - `CommentForm`: Form for adding new comments

6. **Ticket Creation Components**
   - `TicketForm`: Form for customers to submit new tickets
   - Includes validation for required fields

#### Shared Components

- `LoadingSpinner`: Loading indicator
- `ErrorMessage`: Error display component
- `StatusBadge`: Visual indicator for ticket status
- `PriorityBadge`: Visual indicator for ticket priority
- `CategoryBadge`: Visual indicator for ticket category

### UI Enhancements

#### Dashboard Visualizations

The dashboard uses HTML5 Canvas API to render interactive doughnut charts:

1. **DoughnutChart Component**
   - Renders data as circular chart with hollow center
   - Displays total count in center
   - Interactive legend showing individual values
   - Color-coded segments for easy identification
   - Empty state handling when no data exists

2. **Priority Breakdown Chart**
   - Critical: Red (#ef4444)
   - High: Orange (#f59e0b)
   - Medium: Blue (#3b82f6)
   - Low: Gray (#6b7280)

3. **Category Breakdown Chart**
   - Technical: Purple (#8b5cf6)
   - Billing: Green (#10b981)
   - General: Blue (#3b82f6)

#### Ticket List View Options

The ticket list supports two view modes:

1. **Grid View (Default)**
   - Card-based layout using `TicketCard` component
   - Shows ticket title, badges, customer info, and date
   - Responsive grid that adapts to screen size
   - Hover effects for better interactivity

2. **List View**
   - Table-based layout using `TicketListItem` component
   - Horizontal row format with aligned columns
   - Shows: title, ID, status, priority, category, customer, date
   - More compact for viewing many tickets at once
   - Better for scanning and comparing tickets

3. **View Toggle**
   - Icon buttons in top-right corner of ticket list
   - Grid icon (squares) for card view
   - List icon (lines) for table view
   - Persists user preference during session

### Backend Components

#### API Routes

1. **Authentication Routes** (`/api/auth`)
   - `POST /login`: Agent login
   - `POST /logout`: Agent logout

2. **Ticket Routes** (`/api/tickets`)
   - `GET /`: Get all tickets with optional filters
   - `GET /:id`: Get single ticket by ID
   - `POST /`: Create new ticket
   - `PATCH /:id`: Update ticket fields
   - `PATCH /:id/status`: Update ticket status
   - `POST /:id/comments`: Add comment to ticket

3. **Dashboard Routes** (`/api/dashboard`)
   - `GET /metrics`: Get dashboard metrics

#### Controllers

Controllers handle HTTP requests and responses:

- `authController`: Handles login/logout logic
- `ticketController`: Handles all ticket-related operations
- `dashboardController`: Calculates and returns metrics

#### Services

Services contain business logic:

- `authService`: User authentication and JWT generation
- `ticketService`: Ticket CRUD operations, filtering, status updates
- `commentService`: Comment creation and retrieval
- `dashboardService`: Metric calculations

#### Middleware

- `authenticate`: Verifies JWT tokens and attaches user info to requests
- `errorHandler`: Centralized error handling with appropriate HTTP status codes
- `validateRequest`: Request validation middleware

### API Interfaces

#### Request/Response Formats

**Register Agent Request (Development Only):**
```typescript
POST /api/auth/register
{
  "email": "agent@example.com",
  "password": "password123",
  "name": "Agent Name"
}
```

**Register Agent Response:**
```typescript
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "email": "agent@example.com",
    "name": "Agent Name",
    "createdAt": "2024-01-15T10:00:00.000Z"
  },
  "message": "User registered successfully"
}
```

**Login Request:**
```typescript
POST /api/auth/login
{
  "email": "agent@example.com",
  "password": "password123"
}
```

**Login Response:**
```typescript
{
  "success": true,
  "data": {
    "token": "jwt-token-string",
    "user": {
      "id": "user-uuid",
      "email": "agent@example.com",
      "name": "Agent Name"
    }
  }
}
```

**Create Ticket Request:**
```typescript
POST /api/tickets
{
  "title": "Cannot login to account",
  "description": "I've tried resetting my password but still can't access my account",
  "category": "Technical",
  "priority": "High",
  "customerEmail": "customer@example.com",
  "customerName": "John Doe"
}
```

**Create Ticket Response:**
```typescript
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Cannot login to account",
    "description": "I've tried resetting my password...",
    "category": "Technical",
    "priority": "High",
    "status": "Open",
    "customerEmail": "customer@example.com",
    "customerName": "John Doe",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Ticket created successfully"
}
```

**Get Tickets with Filters:**
```typescript
GET /api/tickets?status=Open&priority=High&category=Technical

{
  "success": true,
  "data": [
    { /* ticket object */ },
    { /* ticket object */ }
  ],
  "count": 2
}
```

**Update Ticket Status:**
```typescript
PATCH /api/tickets/:id/status
{
  "status": "In Progress"
}

{
  "success": true,
  "data": {
    /* updated ticket object with new status */
  }
}
```

**Add Comment:**
```typescript
POST /api/tickets/:id/comments
{
  "content": "I've investigated the issue and found the root cause."
}

{
  "success": true,
  "data": {
    "id": "comment-uuid",
    "ticketId": "ticket-uuid",
    "content": "I've investigated the issue...",
    "authorId": "agent-uuid",
    "authorName": "Agent Smith",
    "isSystem": false,
    "createdAt": "2024-01-15T11:00:00.000Z"
  }
}
```

**Error Response:**
```typescript
{
  "success": false,
  "error": "Validation Error",
  "message": "Title is required"
}
```

## Data Models

### Ticket Model

```typescript
interface Ticket {
  id: string;                    // UUID v4
  title: string;                 // Max 200 characters
  description: string;           // Detailed problem description
  category: TicketCategory;      // 'Technical' | 'Billing' | 'General'
  priority: TicketPriority;      // 'Low' | 'Medium' | 'High' | 'Critical'
  status: TicketStatus;          // 'Open' | 'In Progress' | 'Resolved' | 'Closed'
  customerEmail: string;         // Customer contact email
  customerName?: string;         // Optional customer name
  createdAt: string;             // ISO 8601 timestamp
  updatedAt: string;             // ISO 8601 timestamp
  resolvedAt?: string;           // ISO 8601 timestamp when resolved
  comments?: Comment[];          // Array of comments (populated on detail view)
}

type TicketCategory = 'Technical' | 'Billing' | 'General';
type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical';
type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';
```

### Comment Model

```typescript
interface Comment {
  id: string;                    // UUID v4
  ticketId: string;              // Foreign key to ticket
  content: string;               // Comment text
  authorId: string;              // User ID of comment author
  authorName: string;            // Display name of author
  isSystem: boolean;             // True for system-generated comments
  createdAt: string;             // ISO 8601 timestamp
}
```

### User Model

```typescript
interface User {
  id: string;                    // UUID v4
  email: string;                 // Unique email address
  name: string;                  // Display name
  passwordHash: string;          // Bcrypt hashed password
  createdAt: string;             // ISO 8601 timestamp
}
```

### Dashboard Metrics Model

```typescript
interface DashboardMetrics {
  totalOpen: number;                           // Count of open tickets
  byPriority: Record<TicketPriority, number>;  // Ticket counts by priority
  byCategory: Record<TicketCategory, number>;  // Ticket counts by category
  averageResolutionTime: number;               // Average time in hours
}
```

### Doughnut Chart Data Model

```typescript
interface DoughnutChartData {
  label: string;   // Display label for the segment
  value: number;   // Numeric value for the segment
  color: string;   // Hex color code for the segment
}
```

### Database Schema

**tickets table:**
```sql
CREATE TABLE tickets (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT NOT NULL,
  status TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  resolved_at TEXT
);

CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_created_at ON tickets(created_at);
CREATE INDEX idx_tickets_priority ON tickets(priority);
CREATE INDEX idx_tickets_category ON tickets(category);
```

**comments table:**
```sql
CREATE TABLE comments (
  id TEXT PRIMARY KEY,
  ticket_id TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  is_system INTEGER DEFAULT 0,
  created_at TEXT NOT NULL,
  FOREIGN KEY (ticket_id) REFERENCES tickets(id)
);

CREATE INDEX idx_comments_ticket_id ON comments(ticket_id);
```

**users table:**
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX idx_users_email ON users(email);
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, I've identified several areas where properties can be consolidated:

- **Display properties (2.1, 3.1, 3.4, 5.4)**: These all test that rendered output contains required fields. Can be combined into properties that verify complete information display.
- **Input validation properties (1.2, 1.3, 1.6, 1.7, 4.2, 5.2)**: All test rejection of invalid inputs. Can be grouped by validation type.
- **Filtering properties (8.1, 8.2, 8.3, 8.4)**: All test single-filter behavior. Property 8.5 (multiple filters) is more comprehensive and subsumes these.
- **Metric calculation properties (6.1, 6.2, 6.3)**: All test counting. Can be combined into a single property about correct metric calculation.

### Ticket Creation Properties

**Property 1: Valid ticket creation**
*For any* valid ticket input (non-empty title and description, valid category, valid priority, valid email), creating a ticket should result in a new ticket with status "Open", a unique ID, timestamps, and all provided fields preserved.
**Validates: Requirements 1.1, 1.4, 1.5**

**Property 2: Empty title rejection**
*For any* string composed entirely of whitespace characters, attempting to create a ticket with that title should be rejected with a validation error.
**Validates: Requirements 1.2**

**Property 3: Empty description rejection**
*For any* string composed entirely of whitespace characters, attempting to create a ticket with that description should be rejected with a validation error.
**Validates: Requirements 1.3**

**Property 4: Category validation**
*For any* string that is not one of the valid categories (Technical, Billing, General), attempting to create a ticket with that category should be rejected with a validation error.
**Validates: Requirements 1.6**

**Property 5: Priority validation**
*For any* string that is not one of the valid priorities (Low, Medium, High, Critical), attempting to create a ticket with that priority should be rejected with a validation error.
**Validates: Requirements 1.7**

**Property 6: Unique ticket IDs**
*For any* set of created tickets, all ticket IDs should be unique (no duplicates).
**Validates: Requirements 1.4**

### Ticket Display Properties

**Property 7: Ticket list completeness**
*For any* ticket in the system, when displayed in the ticket list, the rendered output should contain the ticket's title, status, priority, category, and submission date.
**Validates: Requirements 2.1, 2.2**

**Property 8: Ticket list ordering**
*For any* set of tickets, when displayed in the ticket list, tickets should be ordered by creation date with the newest ticket first.
**Validates: Requirements 2.3**

**Property 9: Ticket detail completeness**
*For any* ticket, when displayed in the detail view, the rendered output should contain the ticket's ID, title, description, category, priority, status, customer email, customer name (if provided), and submission timestamp.
**Validates: Requirements 3.1, 3.4**

**Property 10: Comment display ordering**
*For any* ticket with multiple comments, when displayed in the detail view, comments should be ordered chronologically (oldest first) with each comment showing content, author name, and timestamp.
**Validates: Requirements 3.2, 5.4**

### Ticket Status Update Properties

**Property 11: Status update success**
*For any* existing ticket and any valid status value (Open, In Progress, Resolved, Closed), updating the ticket's status should change the status, update the timestamp, and create a system comment recording the change.
**Validates: Requirements 4.1, 4.3**

**Property 12: Status validation**
*For any* string that is not one of the valid statuses (Open, In Progress, Resolved, Closed), attempting to update a ticket with that status should be rejected with a validation error.
**Validates: Requirements 4.2**

**Property 13: Non-existent ticket error**
*For any* ticket ID that does not exist in the system, attempting to update that ticket should return a not found error.
**Validates: Requirements 4.4**

### Comment Properties

**Property 14: Comment creation**
*For any* existing ticket and any non-empty comment text, adding the comment should save it with the current timestamp, author information, and make it immediately visible in the ticket's comment thread.
**Validates: Requirements 5.1, 5.3**

**Property 15: Empty comment rejection**
*For any* string composed entirely of whitespace characters, attempting to add that as a comment should be rejected with a validation error.
**Validates: Requirements 5.2**

### Dashboard Metrics Properties

**Property 16: Open ticket count accuracy**
*For any* set of tickets in the system, the dashboard should display the correct count of tickets with status "Open".
**Validates: Requirements 6.1**

**Property 17: Priority grouping accuracy**
*For any* set of tickets in the system, the dashboard should display correct counts for each priority level (Low, Medium, High, Critical), with the sum equaling the total number of tickets.
**Validates: Requirements 6.2**

**Property 18: Category grouping accuracy**
*For any* set of tickets in the system, the dashboard should display correct counts for each category (Technical, Billing, General), with the sum equaling the total number of tickets.
**Validates: Requirements 6.3**

**Property 19: Average resolution time calculation**
*For any* set of resolved tickets with known creation and resolution timestamps, the dashboard should calculate the average resolution time correctly (sum of resolution times divided by number of resolved tickets, in hours).
**Validates: Requirements 6.4**

### Authentication Properties

**Property 20: Valid authentication**
*For any* registered user with correct email and password, authentication should succeed and return a valid JWT token that grants access to protected resources.
**Validates: Requirements 7.1**

**Property 21: Invalid authentication rejection**
*For any* authentication attempt with incorrect email or password, authentication should fail and return an unauthorized error.
**Validates: Requirements 7.2**

**Property 22: Protected resource authorization**
*For any* request to a protected resource without a valid JWT token, the system should reject the request with an unauthorized error.
**Validates: Requirements 7.3**

**Property 23: Logout token invalidation**
*For any* authenticated user, after logging out, their JWT token should no longer grant access to protected resources.
**Validates: Requirements 7.4**

### Filtering Properties

**Property 24: Combined filter accuracy**
*For any* set of tickets and any combination of filters (status, priority, category, date range), the system should return only tickets that match ALL specified filter criteria.
**Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5**

**Property 25: Filter reset completeness**
*For any* set of tickets, when all filters are cleared, the system should return all tickets in the system.
**Validates: Requirements 8.7**

## Error Handling

### Error Types

The system defines custom error classes for different error scenarios:

1. **ValidationError** (400 Bad Request)
   - Thrown when input validation fails
   - Examples: empty title, invalid category, invalid priority
   - Response includes field name and validation message

2. **NotFoundError** (404 Not Found)
   - Thrown when requested resource doesn't exist
   - Examples: ticket ID not found, user not found
   - Response includes resource type and ID

3. **UnauthorizedError** (401 Unauthorized)
   - Thrown when authentication fails or token is invalid
   - Examples: invalid credentials, expired token, missing token
   - Response includes authentication error message

4. **InternalServerError** (500 Internal Server Error)
   - Thrown for unexpected errors
   - Examples: database errors, unexpected exceptions
   - Response includes generic error message (detailed message only in development)

### Error Handling Strategy

**Frontend Error Handling:**
- API client catches all HTTP errors and extracts error messages
- Components display user-friendly error messages
- Form validation provides immediate feedback before submission
- Loading states prevent duplicate submissions
- Error boundaries catch React component errors

**Backend Error Handling:**
- Centralized error handler middleware processes all errors
- Errors are logged with stack traces for debugging
- Consistent error response format across all endpoints
- Input validation occurs before business logic execution
- Database errors are caught and converted to appropriate error types

### Error Response Format

All error responses follow this structure:

```typescript
{
  "success": false,
  "error": "Error Type",
  "message": "Human-readable error description"
}
```

## Testing Strategy

### Dual Testing Approach

The system will use both unit tests and property-based tests to ensure comprehensive coverage:

**Unit Tests:**
- Test specific examples and edge cases
- Test error conditions and boundary values
- Test integration between components
- Focus on concrete scenarios that demonstrate correct behavior

**Property-Based Tests:**
- Test universal properties across many randomly generated inputs
- Verify correctness properties hold for all valid inputs
- Each property test runs minimum 100 iterations
- Tests are tagged with references to design properties

### Property-Based Testing Configuration

**Testing Library:** We will use **fast-check** for TypeScript property-based testing.

**Test Configuration:**
- Minimum 100 iterations per property test
- Each test tagged with: `Feature: customer-support-ticket-system, Property N: [property description]`
- Tests organized alongside implementation files
- Generators for: tickets, comments, users, filters, dates

**Example Property Test Structure:**

```typescript
import fc from 'fast-check';

// Feature: customer-support-ticket-system, Property 1: Valid ticket creation
test('creating ticket with valid input produces ticket with Open status', () => {
  fc.assert(
    fc.property(
      validTicketInputArbitrary(),
      (input) => {
        const ticket = createTicket(input);
        expect(ticket.status).toBe('Open');
        expect(ticket.id).toBeDefined();
        expect(ticket.title).toBe(input.title.trim());
      }
    ),
    { numRuns: 100 }
  );
});
```

### Test Coverage Goals

- All correctness properties implemented as property-based tests
- Edge cases (empty lists, empty comments, no resolved tickets) covered by unit tests
- Integration tests for API endpoints
- Authentication flow tested end-to-end
- Database operations tested with in-memory SQLite

### Testing Tools

- **Jest**: Test runner and assertion library
- **fast-check**: Property-based testing library
- **React Testing Library**: Component testing
- **Supertest**: API endpoint testing
- **MSW (Mock Service Worker)**: API mocking for frontend tests


## Security Implementation

This section documents how the Customer Support Ticket System implements NIST SP 800-53 security controls, demonstrating security best practices for organizations serving government and regulated industries.

### Authentication and Authorization (NIST AC-2, AC-3)

**Current Implementation:**

1. **Account Management (AC-2)**
   - User accounts stored in `users` table with unique email constraint
   - Password hashing using bcrypt with work factor 10 (configurable)
   - Account creation via `/api/auth/register` endpoint (development only)
   - No account lockout mechanism (recommended for production)
   - No password complexity requirements (recommended for production)

2. **Access Enforcement (AC-3)**
   - JWT-based authentication implemented in `backend/src/middleware/auth.ts`
   - Protected routes require valid JWT token in Authorization header
   - Token includes user claims: id, email, name
   - Token expiration set to 8 hours (configurable via JWT_EXPIRES_IN)
   - Frontend stores token in localStorage and includes in API requests
   - AuthContext provides authentication state throughout React app

**Implementation Files:**
- `backend/src/services/authService.ts` - Authentication logic, JWT generation
- `backend/src/middleware/auth.ts` - JWT verification middleware
- `backend/src/controllers/authController.ts` - Login/logout handlers
- `frontend/src/context/AuthContext.tsx` - Frontend authentication state
- `frontend/src/api/client.ts` - Automatic token inclusion in requests

**Compliance Status:** ✅ Implemented
- AC-2: User accounts managed, passwords hashed with bcrypt
- AC-3: JWT tokens enforce authorization on protected endpoints

**Production Recommendations:**
- Implement account lockout after N failed login attempts
- Add password complexity requirements (length, character types)
- Implement password expiration and rotation policies
- Add multi-factor authentication (MFA) support
- Implement role-based access control (RBAC) for different user types

### Data Encryption (NIST SC-12, SC-13)

**Current Implementation:**

1. **Cryptographic Key Management (SC-12)**
   - JWT secret key stored in environment variable `JWT_SECRET`
   - Default secret provided for demo purposes (must be changed for production)
   - Bcrypt salt automatically generated per password (built-in to bcrypt)
   - No key rotation mechanism (recommended for production)

2. **Cryptographic Protection (SC-13)**
   - Passwords hashed using bcrypt with salt (10 rounds)
   - JWT tokens signed using HS256 algorithm
   - HTTPS/TLS encryption expected in production deployment
   - Environment variables used for sensitive configuration
   - No encryption at rest for database (SQLite file unencrypted)

**Implementation Files:**
- `backend/src/services/authService.ts` - Password hashing with bcrypt
- `backend/src/utils/jwt.ts` - JWT token generation and verification
- `backend/.env.example` - Environment variable template
- `backend/src/app.ts` - Security middleware configuration (helmet)

**Compliance Status:** ⚠️ Partially Implemented
- SC-12: JWT secret configurable, bcrypt salt automatic
- SC-13: Passwords hashed, JWT signed, but no TLS enforcement in code

**Production Recommendations:**
- Enforce HTTPS/TLS 1.2+ at reverse proxy or load balancer level
- Implement database encryption at rest (SQLCipher or encrypted filesystem)
- Use stronger JWT secret (minimum 256 bits, cryptographically random)
- Implement key rotation for JWT secrets
- Add Content Security Policy (CSP) headers
- Enable HSTS (HTTP Strict Transport Security)

### Audit Logging (NIST AU-2, AU-3)

**Current Implementation:**

1. **Event Logging (AU-2)**
   - HTTP request logging via Morgan middleware (development mode)
   - Authentication attempts logged to console
   - Ticket status changes recorded as system comments in database
   - No structured audit log table or file
   - No log retention policy

2. **Audit Record Content (AU-3)**
   - System comments include: timestamp, agent ID, status change
   - HTTP logs include: method, path, status code, response time
   - Authentication logs include: email, success/failure
   - Missing: source IP, session ID, detailed event types

**Implementation Files:**
- `backend/src/app.ts` - Morgan HTTP logging middleware
- `backend/src/services/authService.ts` - Authentication logging
- `backend/src/services/ticketService.ts` - Status change system comments
- `backend/src/database/db.ts` - Database query logging (development)

**Compliance Status:** ⚠️ Partially Implemented
- AU-2: Basic logging present but not comprehensive
- AU-3: Some audit information captured but incomplete

**Production Recommendations:**
- Create dedicated `audit_logs` table with structured schema
- Log all security-relevant events: authentication, authorization failures, data access, modifications
- Include in audit records: timestamp, event type, user ID, source IP, session ID, outcome, affected resources
- Implement log rotation and retention policies
- Send logs to centralized logging system (e.g., ELK stack, Splunk)
- Protect audit logs from unauthorized modification
- Implement log monitoring and alerting for suspicious activities

### Input Validation (NIST SI-10)

**Current Implementation:**

1. **Information Input Validation (SI-10)**
   - Title and description validated for non-empty content
   - Email format validation using regex pattern
   - Enumerated values (status, priority, category) validated against allowed sets
   - Request body structure validated in controllers
   - SQL injection prevented via parameterized queries (sqlite library)
   - XSS prevention via React's automatic escaping
   - No explicit input sanitization library

**Implementation Files:**
- `backend/src/controllers/ticketController.ts` - Input validation in controllers
- `backend/src/services/ticketService.ts` - Business logic validation
- `backend/src/utils/validators.ts` - Validation helper functions
- `backend/src/database/db.ts` - Parameterized SQL queries
- Frontend components - React automatic XSS prevention

**Compliance Status:** ✅ Implemented
- SI-10: Input validation present at multiple layers

**Production Recommendations:**
- Add explicit input sanitization library (e.g., DOMPurify for HTML, validator.js)
- Implement request rate limiting to prevent abuse
- Add input length limits for all text fields
- Validate file uploads if file attachment feature added
- Implement CSRF protection for state-changing operations
- Add request size limits to prevent DoS attacks
- Validate and sanitize data from external sources

### Session Management (NIST AC-12)

**Current Implementation:**

1. **Session Termination (AC-12)**
   - JWT tokens have 8-hour expiration (configurable)
   - Expired tokens rejected by authentication middleware
   - Logout clears token from localStorage (client-side only)
   - No server-side token revocation mechanism
   - No token refresh mechanism
   - No idle timeout (token valid until expiration regardless of activity)

**Implementation Files:**
- `backend/src/middleware/auth.ts` - Token expiration validation
- `backend/src/services/authService.ts` - Token generation with expiration
- `frontend/src/context/AuthContext.tsx` - Logout token clearing
- `frontend/src/api/client.ts` - Token expiration handling

**Compliance Status:** ⚠️ Partially Implemented
- AC-12: Token expiration implemented but no server-side revocation

**Production Recommendations:**
- Implement token revocation list (blacklist) or use short-lived tokens with refresh tokens
- Add idle timeout detection (track last activity, invalidate after N minutes)
- Implement token refresh mechanism for better user experience
- Store active sessions in database or Redis for server-side management
- Implement concurrent session limits per user
- Add "logout all devices" functionality
- Implement secure session ID generation and management
- Add session activity logging

### Security Middleware and Headers

**Current Implementation:**

The application uses several security middleware packages:

1. **Helmet.js** - Sets security-related HTTP headers
   - X-DNS-Prefetch-Control
   - X-Frame-Options (prevents clickjacking)
   - X-Content-Type-Options (prevents MIME sniffing)
   - X-XSS-Protection
   - Referrer-Policy
   - Content-Security-Policy (default policy)

2. **CORS** - Cross-Origin Resource Sharing configuration
   - Configured to allow frontend origin (http://localhost:5173)
   - Credentials enabled for cookie/auth header support
   - Should be restricted to production domain in deployment

3. **Express JSON Parser** - Request body parsing
   - Automatic JSON parsing with size limits
   - Prevents large payload attacks

**Implementation Files:**
- `backend/src/app.ts` - Security middleware configuration

**Compliance Status:** ✅ Implemented
- Basic security headers configured
- CORS properly configured for development

**Production Recommendations:**
- Customize Content-Security-Policy for application needs
- Add rate limiting middleware (e.g., express-rate-limit)
- Implement request validation middleware
- Add compression middleware for performance
- Configure CORS for production domain only
- Add security.txt file for vulnerability disclosure

### Security Testing

**Recommended Security Tests:**

1. **Authentication Tests**
   - Test password hashing (verify bcrypt used)
   - Test JWT token generation and validation
   - Test expired token rejection
   - Test invalid token rejection
   - Test missing token rejection

2. **Authorization Tests**
   - Test protected endpoint access without token
   - Test protected endpoint access with valid token
   - Test token tampering detection

3. **Input Validation Tests**
   - Test SQL injection attempts (should be prevented)
   - Test XSS attempts (should be escaped)
   - Test invalid enum values (should be rejected)
   - Test empty/whitespace inputs (should be rejected)
   - Test oversized inputs (should be rejected)

4. **Session Management Tests**
   - Test token expiration
   - Test logout token clearing
   - Test concurrent session handling

### Security Compliance Summary

| NIST Control | Requirement | Implementation Status | Production Ready |
|--------------|-------------|----------------------|------------------|
| AC-2 | Account Management | ✅ Implemented | ⚠️ Needs enhancements |
| AC-3 | Access Enforcement | ✅ Implemented | ✅ Yes |
| SC-12 | Cryptographic Key Management | ⚠️ Partial | ❌ Needs key rotation |
| SC-13 | Cryptographic Protection | ⚠️ Partial | ❌ Needs TLS enforcement |
| AU-2 | Event Logging | ⚠️ Partial | ❌ Needs structured logging |
| AU-3 | Audit Record Content | ⚠️ Partial | ❌ Needs complete audit data |
| SI-10 | Input Validation | ✅ Implemented | ⚠️ Needs sanitization library |
| AC-12 | Session Termination | ⚠️ Partial | ❌ Needs server-side revocation |

**Overall Security Posture:**
- **Demo Environment:** ✅ Adequate - Basic security controls in place
- **Production Environment:** ⚠️ Requires enhancements - See recommendations above
