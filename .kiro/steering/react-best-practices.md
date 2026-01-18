---
inclusion: always
---

# React Best Practices

This document outlines React coding standards and best practices for building the Customer Support Ticket System frontend.

## Component Structure

### Functional Components with TypeScript

```typescript
// ✅ Good - Typed functional component with props interface
interface TicketCardProps {
  ticket: Ticket;
  onStatusChange: (ticketId: string, newStatus: TicketStatus) => void;
  onSelect: (ticketId: string) => void;
}

export function TicketCard({ ticket, onStatusChange, onSelect }: TicketCardProps) {
  return (
    <div className="ticket-card" onClick={() => onSelect(ticket.id)}>
      <h3>{ticket.title}</h3>
      <StatusBadge status={ticket.status} />
      <PriorityBadge priority={ticket.priority} />
    </div>
  );
}
```

### Component File Organization

```
src/
  components/
    TicketCard/
      TicketCard.tsx          # Main component
      TicketCard.test.tsx     # Tests
      index.ts                # Export
    TicketList/
      TicketList.tsx
      TicketList.test.tsx
      index.ts
```

## Hooks Best Practices

### useState for Local Component State

```typescript
function TicketForm() {
  // ✅ Good - Separate state for each field
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TicketCategory>('General');
  const [priority, setPriority] = useState<TicketPriority>('Medium');

  // ❌ Bad - Single object state (harder to update)
  // const [formData, setFormData] = useState({ title: '', description: '' });
}
```

### useEffect for Side Effects

```typescript
function TicketDetail({ ticketId }: { ticketId: string }) {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch ticket data when ticketId changes
    let cancelled = false; // Prevent state updates if component unmounts

    async function fetchTicket() {
      try {
        setLoading(true);
        const data = await api.getTicket(ticketId);
        
        // Only update state if component is still mounted
        if (!cancelled) {
          setTicket(data);
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to fetch ticket:', error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchTicket();

    // Cleanup function to prevent memory leaks
    return () => {
      cancelled = true;
    };
  }, [ticketId]); // Re-run when ticketId changes

  if (loading) return <LoadingSpinner />;
  if (!ticket) return <ErrorMessage message="Ticket not found" />;

  return <div>{/* Render ticket details */}</div>;
}
```

### Custom Hooks for Reusable Logic

```typescript
/**
 * Custom hook for fetching and managing ticket data.
 * Handles loading states, errors, and automatic refetching.
 */
function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getTickets();
      setTickets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return { tickets, loading, error, refetch: fetchTickets };
}

// Usage in component
function TicketList() {
  const { tickets, loading, error, refetch } = useTickets();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <button onClick={refetch}>Refresh</button>
      {tickets.map(ticket => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}
```

## Event Handling

### Properly Typed Event Handlers

```typescript
function TicketForm() {
  // ✅ Good - Properly typed event handlers
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent page reload
    
    // Validate and submit form
    if (!title.trim()) {
      alert('Title is required');
      return;
    }
    
    submitTicket({ title, description, category, priority });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={handleTitleChange}
        placeholder="Ticket title"
      />
      {/* More form fields */}
    </form>
  );
}
```

## Conditional Rendering

### Use Logical AND for Simple Conditions

```typescript
function TicketList({ tickets }: { tickets: Ticket[] }) {
  return (
    <div>
      {/* Show message only if no tickets */}
      {tickets.length === 0 && (
        <p>No tickets found. Create your first ticket!</p>
      )}
      
      {/* Render tickets if they exist */}
      {tickets.length > 0 && (
        <ul>
          {tickets.map(ticket => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </ul>
      )}
    </div>
  );
}
```

### Use Ternary for If-Else Conditions

```typescript
function StatusBadge({ status }: { status: TicketStatus }) {
  return (
    <span className={status === 'Open' ? 'badge-open' : 'badge-closed'}>
      {status}
    </span>
  );
}
```

## Lists and Keys

### Always Use Unique Keys

```typescript
function CommentList({ comments }: { comments: Comment[] }) {
  return (
    <div>
      {/* ✅ Good - Using unique ID as key */}
      {comments.map(comment => (
        <CommentCard key={comment.id} comment={comment} />
      ))}

      {/* ❌ Bad - Using array index as key (causes issues when list changes) */}
      {/* {comments.map((comment, index) => (
        <CommentCard key={index} comment={comment} />
      ))} */}
    </div>
  );
}
```

## Performance Optimization

### Use React.memo for Expensive Components

```typescript
/**
 * Memoized component that only re-renders when props change.
 * Useful for components that render frequently but props rarely change.
 */
export const TicketCard = React.memo(function TicketCard({ 
  ticket, 
  onSelect 
}: TicketCardProps) {
  return (
    <div onClick={() => onSelect(ticket.id)}>
      <h3>{ticket.title}</h3>
      <p>{ticket.description}</p>
    </div>
  );
});
```

### Use useCallback for Event Handlers Passed to Children

```typescript
function TicketList() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  // ✅ Good - Memoized callback prevents child re-renders
  const handleTicketSelect = useCallback((ticketId: string) => {
    console.log('Selected ticket:', ticketId);
    // Navigate to ticket detail page
  }, []); // Empty deps - function never changes

  return (
    <div>
      {tickets.map(ticket => (
        <TicketCard 
          key={ticket.id} 
          ticket={ticket} 
          onSelect={handleTicketSelect} 
        />
      ))}
    </div>
  );
}
```

### Use useMemo for Expensive Calculations

```typescript
function Dashboard({ tickets }: { tickets: Ticket[] }) {
  // ✅ Good - Memoize expensive calculation
  const metrics = useMemo(() => {
    return {
      totalOpen: tickets.filter(t => t.status === 'Open').length,
      byPriority: groupBy(tickets, 'priority'),
      byCategory: groupBy(tickets, 'category'),
      avgResolutionTime: calculateAverageResolutionTime(tickets)
    };
  }, [tickets]); // Only recalculate when tickets change

  return (
    <div>
      <MetricCard label="Open Tickets" value={metrics.totalOpen} />
      {/* More metrics */}
    </div>
  );
}
```

## Error Boundaries

### Create Error Boundary Component

```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * Error boundary component that catches JavaScript errors in child components.
 * Displays fallback UI instead of crashing the entire app.
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-container">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage
function App() {
  return (
    <ErrorBoundary>
      <TicketSystem />
    </ErrorBoundary>
  );
}
```

## Component Composition

### Keep Components Small and Focused

```typescript
// ✅ Good - Small, focused components
function TicketHeader({ ticket }: { ticket: Ticket }) {
  return (
    <div className="ticket-header">
      <h2>{ticket.title}</h2>
      <TicketMetadata ticket={ticket} />
    </div>
  );
}

function TicketMetadata({ ticket }: { ticket: Ticket }) {
  return (
    <div className="ticket-metadata">
      <StatusBadge status={ticket.status} />
      <PriorityBadge priority={ticket.priority} />
      <CategoryBadge category={ticket.category} />
      <DateDisplay date={ticket.createdAt} />
    </div>
  );
}

function TicketDetail({ ticket }: { ticket: Ticket }) {
  return (
    <div className="ticket-detail">
      <TicketHeader ticket={ticket} />
      <TicketDescription description={ticket.description} />
      <CommentThread ticketId={ticket.id} />
    </div>
  );
}
```

## Accessibility

### Use Semantic HTML and ARIA Attributes

```typescript
function TicketForm() {
  return (
    <form onSubmit={handleSubmit} aria-label="Create support ticket">
      {/* Use label elements for form inputs */}
      <label htmlFor="ticket-title">
        Title
        <input
          id="ticket-title"
          type="text"
          value={title}
          onChange={handleTitleChange}
          required
          aria-required="true"
        />
      </label>

      {/* Use semantic button elements */}
      <button type="submit" aria-label="Submit ticket">
        Create Ticket
      </button>
    </form>
  );
}
```
