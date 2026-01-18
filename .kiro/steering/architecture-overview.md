---
inclusion: always
---

# Architecture Overview

This document provides a high-level overview of the Customer Support Ticket System architecture, including system diagrams and component interactions.

## System Architecture

```mermaid
graph TB
    subgraph "Frontend - React + TypeScript"
        UI[User Interface]
        Components[React Components]
        Hooks[Custom Hooks]
        API_Client[API Client]
    end

    subgraph "Backend - Express + TypeScript"
        Routes[API Routes]
        Controllers[Controllers]
        Services[Business Logic]
        Middleware[Middleware]
    end

    subgraph "Data Layer"
        DB[(SQLite Database)]
    end

    UI --> Components
    Components --> Hooks
    Hooks --> API_Client
    API_Client -->|HTTP/JSON| Routes
    Routes --> Middleware
    Middleware --> Controllers
    Controllers --> Services
    Services --> DB

    style UI fill:#e1f5ff
    style Components fill:#e1f5ff
    style Routes fill:#fff4e1
    style Controllers fill:#fff4e1
    style Services fill:#fff4e1
    style DB fill:#e8f5e9
```

## Component Architecture

### Frontend Component Hierarchy

```mermaid
graph TD
    App[App Component]
    App --> Auth[Authentication]
    App --> Dashboard[Dashboard]
    App --> TicketList[Ticket List]
    App --> TicketDetail[Ticket Detail]
    
    Auth --> LoginForm[Login Form]
    
    Dashboard --> MetricCard[Metric Cards]
    Dashboard --> Charts[Charts]
    
    TicketList --> FilterBar[Filter Bar]
    TicketList --> TicketCard[Ticket Card]
    
    TicketDetail --> TicketHeader[Ticket Header]
    TicketDetail --> TicketInfo[Ticket Info]
    TicketDetail --> CommentThread[Comment Thread]
    
    CommentThread --> CommentCard[Comment Card]
    CommentThread --> CommentForm[Comment Form]

    style App fill:#4CAF50
    style Auth fill:#2196F3
    style Dashboard fill:#FF9800
    style TicketList fill:#9C27B0
    style TicketDetail fill:#F44336
```

## Data Flow

### Ticket Creation Flow

```mermaid
sequenceDiagram
    participant Customer
    participant UI as React UI
    participant API as Express API
    participant Service as Ticket Service
    participant DB as SQLite DB

    Customer->>UI: Fill ticket form
    Customer->>UI: Click "Submit"
    UI->>UI: Validate form data
    UI->>API: POST /api/tickets
    API->>API: Validate request
    API->>Service: createTicket(data)
    Service->>Service: Generate ID & timestamps
    Service->>DB: INSERT ticket
    DB-->>Service: Success
    Service-->>API: Return new ticket
    API-->>UI: 201 Created + ticket data
    UI-->>Customer: Show success message
    UI->>UI: Navigate to ticket detail
```

### Ticket Status Update Flow

```mermaid
sequenceDiagram
    participant Agent as Support Agent
    participant UI as React UI
    participant Auth as Auth Middleware
    participant API as Express API
    participant Service as Ticket Service
    participant DB as SQLite DB

    Agent->>UI: Select new status
    Agent->>UI: Click "Update Status"
    UI->>API: PATCH /api/tickets/:id/status<br/>(with JWT token)
    API->>Auth: Verify JWT token
    Auth-->>API: User authenticated
    API->>Service: updateTicketStatus(id, status, agentId)
    Service->>DB: UPDATE ticket status
    Service->>DB: INSERT system comment
    DB-->>Service: Success
    Service-->>API: Return updated ticket
    API-->>UI: 200 OK + ticket data
    UI-->>Agent: Show updated status
```

## API Endpoints

### RESTful API Structure

```
Authentication
├── POST   /api/auth/login          # Agent login
└── POST   /api/auth/logout         # Agent logout

Tickets
├── GET    /api/tickets             # Get all tickets (with filters)
├── GET    /api/tickets/:id         # Get single ticket
├── POST   /api/tickets             # Create new ticket
├── PATCH  /api/tickets/:id         # Update ticket
├── PATCH  /api/tickets/:id/status  # Update ticket status
└── POST   /api/tickets/:id/comments # Add comment

Dashboard
└── GET    /api/dashboard/metrics   # Get dashboard metrics
```

## Database Schema

```mermaid
erDiagram
    TICKETS ||--o{ COMMENTS : has
    USERS ||--o{ COMMENTS : writes
    
    TICKETS {
        string id PK
        string title
        string description
        string category
        string priority
        string status
        string customer_email
        string customer_name
        datetime created_at
        datetime updated_at
    }
    
    COMMENTS {
        string id PK
        string ticket_id FK
        string content
        string author_id FK
        string author_name
        boolean is_system
        datetime created_at
    }
    
    USERS {
        string id PK
        string email UK
        string name
        string password_hash
        datetime created_at
    }
```

## State Management

### Frontend State Architecture

```mermaid
graph LR
    subgraph "Component State"
        Local[Local State<br/>useState]
    end
    
    subgraph "Server State"
        API[API Data<br/>Custom Hooks]
        Cache[In-Memory Cache]
    end
    
    subgraph "Global State"
        Auth[Auth Context<br/>User Session]
    end
    
    Components[React Components]
    
    Components --> Local
    Components --> API
    Components --> Auth
    API --> Cache
    
    style Local fill:#e3f2fd
    style API fill:#fff3e0
    style Auth fill:#f3e5f5
```

## Authentication Flow

```mermaid
sequenceDiagram
    participant Agent
    participant UI
    participant API
    participant DB

    Agent->>UI: Enter credentials
    UI->>API: POST /api/auth/login
    API->>DB: Query user by email
    DB-->>API: User data
    API->>API: Verify password hash
    API->>API: Generate JWT token
    API-->>UI: Return token + user info
    UI->>UI: Store token in localStorage
    UI->>UI: Set auth context
    UI-->>Agent: Redirect to dashboard
    
    Note over UI,API: Subsequent requests include token
    
    UI->>API: GET /api/tickets<br/>(Authorization: Bearer token)
    API->>API: Verify JWT token
    API-->>UI: Return tickets
```

## Error Handling Flow

```mermaid
graph TD
    Request[HTTP Request]
    Route[Route Handler]
    Controller[Controller]
    Service[Service Layer]
    Error[Error Occurs]
    ErrorHandler[Error Handler Middleware]
    Response[Error Response]
    
    Request --> Route
    Route --> Controller
    Controller --> Service
    Service --> Error
    Error --> ErrorHandler
    ErrorHandler --> Response
    
    ErrorHandler --> Validation{Error Type?}
    Validation -->|ValidationError| Status400[400 Bad Request]
    Validation -->|NotFoundError| Status404[404 Not Found]
    Validation -->|UnauthorizedError| Status401[401 Unauthorized]
    Validation -->|Other| Status500[500 Internal Server Error]
    
    Status400 --> Response
    Status404 --> Response
    Status401 --> Response
    Status500 --> Response

    style Error fill:#ffcdd2
    style ErrorHandler fill:#fff9c4
    style Response fill:#c8e6c9
```

## Deployment Architecture

```mermaid
graph TB
    subgraph "Development Environment"
        DevFE[Frontend Dev Server<br/>Vite :5173]
        DevBE[Backend Dev Server<br/>Express :3000]
        DevDB[(SQLite DB<br/>File)]
    end
    
    subgraph "Production Environment"
        ProdFE[Static Frontend<br/>Served by Express]
        ProdBE[Express Server<br/>:3000]
        ProdDB[(SQLite DB<br/>File)]
    end
    
    DevFE -.->|API Calls| DevBE
    DevBE --> DevDB
    
    ProdBE --> ProdFE
    ProdBE --> ProdDB
    
    Browser[Web Browser] --> DevFE
    Browser2[Web Browser] --> ProdBE

    style DevFE fill:#e1f5ff
    style DevBE fill:#fff4e1
    style ProdFE fill:#e1f5ff
    style ProdBE fill:#fff4e1
```

## Technology Stack Summary

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite (fast dev server and build)
- **Styling**: Tailwind CSS (utility-first CSS)
- **HTTP Client**: Fetch API (native browser API)
- **Routing**: React Router (client-side routing)

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js (web server)
- **Database**: SQLite (embedded database)
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet (HTTP headers), CORS

### Development Tools
- **Package Manager**: npm or yarn
- **TypeScript Compiler**: tsc
- **Linting**: ESLint
- **Formatting**: Prettier

## Key Design Principles

1. **Separation of Concerns**: Clear boundaries between UI, business logic, and data access
2. **Type Safety**: TypeScript throughout for compile-time error detection
3. **RESTful API**: Standard HTTP methods and status codes
4. **Stateless Backend**: JWT tokens for authentication, no server-side sessions
5. **Component Composition**: Small, reusable React components
6. **Error Handling**: Centralized error handling with custom error types
7. **Code Comments**: Extensive documentation for new developers
8. **Consistent Patterns**: Established patterns for routes, controllers, and services
