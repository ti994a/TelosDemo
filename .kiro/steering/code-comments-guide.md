---
inclusion: always
---

# Code Comments Guide

This document provides guidelines for writing helpful code comments, especially for developers new to React, TypeScript, and Express.

## When to Comment

### DO Comment:

1. **Complex Business Logic**
```typescript
// Calculate average resolution time in hours
// Only include tickets that have been resolved (have resolvedAt timestamp)
// Formula: (sum of resolution times) / number of resolved tickets
function calculateAverageResolutionTime(tickets: Ticket[]): number {
  const resolvedTickets = tickets.filter(t => t.status === 'Resolved' && t.resolvedAt);
  
  if (resolvedTickets.length === 0) {
    return 0;
  }
  
  const totalTime = resolvedTickets.reduce((sum, ticket) => {
    const resolutionTime = ticket.resolvedAt!.getTime() - ticket.createdAt.getTime();
    return sum + resolutionTime;
  }, 0);
  
  // Convert milliseconds to hours
  return totalTime / resolvedTickets.length / (1000 * 60 * 60);
}
```

2. **Non-Obvious Code**
```typescript
// Use optional chaining (?.) to safely access nested properties
// If ticket or ticket.customer is undefined, expression returns undefined
const customerName = ticket?.customer?.name ?? 'Unknown';

// Nullish coalescing (??) returns right side only if left is null/undefined
// Different from || which returns right side for any falsy value (0, '', false)
const priority = ticket.priority ?? 'Medium';
```

3. **Why, Not What**
```typescript
// ✅ Good - Explains WHY
// Debounce search to avoid excessive API calls while user is typing
const debouncedSearch = useMemo(
  () => debounce(handleSearch, 300),
  [handleSearch]
);

// ❌ Bad - Explains WHAT (obvious from code)
// Create a debounced version of handleSearch with 300ms delay
const debouncedSearch = useMemo(
  () => debounce(handleSearch, 300),
  [handleSearch]
);
```

4. **API Contracts and Interfaces**
```typescript
/**
 * Represents a support ticket in the system.
 * 
 * @property id - Unique identifier (UUID v4)
 * @property title - Brief description of the issue (max 200 chars)
 * @property description - Detailed explanation of the problem
 * @property status - Current state in the ticket lifecycle
 * @property priority - Urgency level for resolution
 * @property category - Type of issue (Technical, Billing, General)
 * @property createdAt - ISO 8601 timestamp when ticket was created
 * @property updatedAt - ISO 8601 timestamp of last modification
 */
export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  customerEmail: string;
  customerName?: string;
  createdAt: string;
  updatedAt: string;
}
```

5. **Workarounds and TODOs**
```typescript
// TODO: Replace with proper pagination once backend supports it
// Currently loading all tickets at once - will be slow with many tickets
const tickets = await api.getAllTickets();

// FIXME: This is a temporary workaround for Safari date parsing issue
// Safari doesn't support ISO 8601 dates without timezone
const date = new Date(ticket.createdAt + 'Z');

// HACK: Force re-render by updating key
// React doesn't detect changes in nested objects, so we need to force update
setRefreshKey(prev => prev + 1);
```

6. **React Hooks Dependencies**
```typescript
useEffect(() => {
  fetchTickets();
}, [fetchTickets]); // Re-run when fetchTickets function changes

// Empty dependency array means run once on mount
useEffect(() => {
  console.log('Component mounted');
}, []);

// No dependency array means run after every render (usually a mistake!)
useEffect(() => {
  console.log('This runs after EVERY render - probably not what you want!');
});
```

### DON'T Comment:

1. **Obvious Code**
```typescript
// ❌ Bad - Comment adds no value
// Set the title
setTitle(newTitle);

// ❌ Bad - Comment just repeats the code
// Loop through tickets
tickets.forEach(ticket => {
  // Process each ticket
  processTicket(ticket);
});
```

2. **Self-Explanatory Function Names**
```typescript
// ❌ Bad - Function name already explains what it does
// Validates the ticket form
function validateTicketForm() { }

// ✅ Good - No comment needed
function validateTicketForm() { }
```

## Comment Styles

### Single-Line Comments

```typescript
// Use for brief explanations on a single line
const maxRetries = 3; // Maximum number of retry attempts

// For longer explanations, use multiple single-line comments
// This approach is better than a multi-line comment because:
// 1. Easier to read in code reviews
// 2. Easier to edit individual lines
// 3. Consistent indentation
```

### Multi-Line Comments

```typescript
/*
 * Use for longer explanations that need multiple lines.
 * Each line should start with an asterisk for readability.
 * 
 * This style is good for:
 * - Algorithm explanations
 * - Complex business rules
 * - Temporary debugging notes
 */
```

### JSDoc Comments

```typescript
/**
 * Use JSDoc for functions, classes, and interfaces.
 * Provides structured documentation that IDEs can display.
 * 
 * @param ticketId - The unique identifier of the ticket
 * @param status - The new status to set
 * @returns The updated ticket object
 * @throws {NotFoundError} If ticket doesn't exist
 * @throws {ValidationError} If status is invalid
 * 
 * @example
 * ```typescript
 * const ticket = await updateTicketStatus('123', 'Resolved');
 * console.log(ticket.status); // 'Resolved'
 * ```
 */
async function updateTicketStatus(
  ticketId: string,
  status: TicketStatus
): Promise<Ticket> {
  // Implementation
}
```

## Educational Comments for New Developers

### Explaining TypeScript Features

```typescript
// Type assertion: Tell TypeScript we know this is a specific type
// Use sparingly - only when you know more than TypeScript does
const input = document.getElementById('title') as HTMLInputElement;

// Type guard: Function that narrows down a type
// TypeScript understands the type after this check
function isTicket(obj: any): obj is Ticket {
  return obj && typeof obj.id === 'string' && typeof obj.title === 'string';
}

// Generic type: Function that works with multiple types
// T is a placeholder for the actual type
function getFirstItem<T>(items: T[]): T | undefined {
  return items[0];
}
```

### Explaining React Patterns

```typescript
// Controlled component: React controls the input value
// Value comes from state, changes go through setState
function TicketForm() {
  const [title, setTitle] = useState('');
  
  return (
    <input
      value={title}                    // React controls the value
      onChange={e => setTitle(e.target.value)}  // Update state on change
    />
  );
}

// Lifting state up: Move state to common parent component
// Allows sibling components to share the same state
function TicketPage() {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  
  return (
    <>
      {/* Both children can access and modify selectedTicket */}
      <TicketList onSelect={setSelectedTicket} />
      <TicketDetail ticket={selectedTicket} />
    </>
  );
}
```

### Explaining Express Patterns

```typescript
// Middleware: Function that runs before route handler
// Can modify request/response or call next() to continue
function logRequest(req: Request, res: Response, next: NextFunction) {
  console.log(`${req.method} ${req.path}`);
  next(); // IMPORTANT: Call next() to continue to next middleware/route
}

// Route parameters: Extract values from URL path
// :id in route becomes req.params.id
router.get('/tickets/:id', (req, res) => {
  const ticketId = req.params.id; // Get ID from URL
  // GET /tickets/123 -> ticketId = '123'
});

// Query parameters: Extract values from URL query string
// ?status=Open becomes req.query.status
router.get('/tickets', (req, res) => {
  const status = req.query.status; // Get status from query
  // GET /tickets?status=Open -> status = 'Open'
});
```

### Explaining Async/Await

```typescript
// async/await: Modern way to handle asynchronous operations
// Makes async code look like synchronous code

// ❌ Old way with promises (harder to read)
function getTicket(id: string) {
  return fetch(`/api/tickets/${id}`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      return data;
    })
    .catch(error => {
      console.error(error);
      throw error;
    });
}

// ✅ New way with async/await (easier to read)
async function getTicket(id: string) {
  try {
    const response = await fetch(`/api/tickets/${id}`);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
```

## Section Comments

### Organize Long Files with Section Comments

```typescript
// ============================================================================
// Type Definitions
// ============================================================================

interface Ticket { }
interface Comment { }
type TicketStatus = 'Open' | 'Closed';

// ============================================================================
// Helper Functions
// ============================================================================

function formatDate(date: Date): string { }
function validateEmail(email: string): boolean { }

// ============================================================================
// Main Component
// ============================================================================

export function TicketList() { }

// ============================================================================
// Exports
// ============================================================================

export { Ticket, Comment, TicketStatus };
```

## Comment Maintenance

### Keep Comments Up to Date

```typescript
// ❌ Bad - Comment is outdated
// Returns array of tickets
function getTickets(): Promise<Ticket[]> {  // Now returns Promise!
  return fetch('/api/tickets').then(r => r.json());
}

// ✅ Good - Comment matches code
// Fetches tickets from API and returns a Promise
async function getTickets(): Promise<Ticket[]> {
  const response = await fetch('/api/tickets');
  return response.json();
}
```

### Remove Commented-Out Code

```typescript
// ❌ Bad - Commented-out code clutters the file
function processTicket(ticket: Ticket) {
  // const oldWay = ticket.status === 'Open';
  // if (oldWay) {
  //   return handleOldWay(ticket);
  // }
  
  return handleNewWay(ticket);
}

// ✅ Good - Remove old code (it's in git history if needed)
function processTicket(ticket: Ticket) {
  return handleNewWay(ticket);
}
```

## Special Comment Tags

Use these tags to mark important notes:

- `TODO:` - Something that needs to be done
- `FIXME:` - Something that's broken and needs fixing
- `HACK:` - A workaround that should be replaced
- `NOTE:` - Important information
- `OPTIMIZE:` - Code that could be more efficient
- `SECURITY:` - Security-related concern

```typescript
// TODO: Add pagination support
// FIXME: This breaks with empty arrays
// HACK: Temporary workaround for Safari bug
// NOTE: This must run before authentication
// OPTIMIZE: This could be cached
// SECURITY: Validate input to prevent XSS
```
