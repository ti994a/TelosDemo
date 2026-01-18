---
inclusion: always
---

# TypeScript Best Practices

This document outlines TypeScript coding standards and best practices for the Customer Support Ticket System.

## Type Safety Principles

### Always Use Explicit Types for Public APIs

```typescript
// ✅ Good - Explicit return type
export function createTicket(data: TicketInput): Ticket {
  return {
    id: generateId(),
    ...data,
    status: 'Open',
    createdAt: new Date()
  };
}

// ❌ Bad - Implicit return type
export function createTicket(data: TicketInput) {
  return {
    id: generateId(),
    ...data,
    status: 'Open',
    createdAt: new Date()
  };
}
```

### Use Interfaces for Object Shapes

```typescript
// ✅ Good - Clear interface definition
interface Ticket {
  id: string;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  customerEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

// Use type aliases for unions and primitives
type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';
type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical';
type TicketCategory = 'Technical' | 'Billing' | 'General';
```

### Avoid `any` - Use `unknown` When Type is Truly Unknown

```typescript
// ❌ Bad - Using any
function processData(data: any) {
  return data.value;
}

// ✅ Good - Using unknown with type guards
function processData(data: unknown): string {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return String(data.value);
  }
  throw new Error('Invalid data format');
}
```

## Naming Conventions

### Use PascalCase for Types and Interfaces

```typescript
interface TicketComment {
  id: string;
  content: string;
  authorId: string;
  createdAt: Date;
}

type ApiResponse<T> = {
  data: T;
  error?: string;
};
```

### Use camelCase for Variables and Functions

```typescript
const ticketList: Ticket[] = [];
const maxRetries = 3;

function calculateAverageResolutionTime(tickets: Ticket[]): number {
  // Implementation
}
```

### Use UPPER_SNAKE_CASE for Constants

```typescript
const MAX_TICKET_TITLE_LENGTH = 200;
const DEFAULT_PAGE_SIZE = 20;
const API_BASE_URL = '/api/v1';
```

## Error Handling

### Create Custom Error Types

```typescript
// Define custom error classes
export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string, public resourceId?: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

// Use in functions
function getTicketById(id: string): Ticket {
  const ticket = ticketStore.get(id);
  if (!ticket) {
    throw new NotFoundError(`Ticket not found`, id);
  }
  return ticket;
}
```

## Async/Await Best Practices

### Always Handle Promise Rejections

```typescript
// ✅ Good - Proper error handling
async function fetchTickets(): Promise<Ticket[]> {
  try {
    const response = await fetch('/api/tickets');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch tickets:', error);
    throw error; // Re-throw or handle appropriately
  }
}
```

## Type Guards for Runtime Safety

```typescript
// Create type guard functions
function isTicketStatus(value: string): value is TicketStatus {
  return ['Open', 'In Progress', 'Resolved', 'Closed'].includes(value);
}

// Use in validation
function validateTicketStatus(status: string): TicketStatus {
  if (!isTicketStatus(status)) {
    throw new ValidationError(`Invalid status: ${status}`);
  }
  return status;
}
```

## Utility Types

### Use Built-in Utility Types

```typescript
// Partial - Make all properties optional
type TicketUpdate = Partial<Ticket>;

// Pick - Select specific properties
type TicketSummary = Pick<Ticket, 'id' | 'title' | 'status' | 'priority'>;

// Omit - Exclude specific properties
type TicketInput = Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>;

// Record - Create object type with specific keys
type TicketsByStatus = Record<TicketStatus, Ticket[]>;
```

## Comments and Documentation

### Use JSDoc for Public APIs

```typescript
/**
 * Creates a new support ticket in the system.
 * 
 * @param input - The ticket data including title, description, category, priority, and customer info
 * @returns The newly created ticket with generated ID and timestamps
 * @throws {ValidationError} If required fields are missing or invalid
 * 
 * @example
 * ```typescript
 * const ticket = createTicket({
 *   title: 'Login issue',
 *   description: 'Cannot access my account',
 *   category: 'Technical',
 *   priority: 'High',
 *   customerEmail: 'user@example.com'
 * });
 * ```
 */
export function createTicket(input: TicketInput): Ticket {
  // Implementation
}
```

### Add Inline Comments for Complex Logic

```typescript
function calculateAverageResolutionTime(tickets: Ticket[]): number {
  // Filter only resolved tickets that have both created and resolved timestamps
  const resolvedTickets = tickets.filter(
    t => t.status === 'Resolved' && t.resolvedAt
  );

  if (resolvedTickets.length === 0) {
    return 0; // No resolved tickets, return 0
  }

  // Calculate total resolution time in milliseconds
  const totalTime = resolvedTickets.reduce((sum, ticket) => {
    const resolutionTime = ticket.resolvedAt!.getTime() - ticket.createdAt.getTime();
    return sum + resolutionTime;
  }, 0);

  // Convert to hours and return average
  return totalTime / resolvedTickets.length / (1000 * 60 * 60);
}
```

## Strict Mode Configuration

Ensure `tsconfig.json` has strict mode enabled:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  }
}
```
