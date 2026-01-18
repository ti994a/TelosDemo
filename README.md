# Customer Support Ticket System

A full-stack web application for managing customer support tickets, built with React, TypeScript, Express, and SQLite.

## Features

- Submit new support tickets with title, description, category, priority, and customer contact information
- Ticket list view with status indicators (Open, In Progress, Resolved, Closed)
- Ticket detail page with full information and comment thread
- Status update workflow for support agents
- Add comments/notes to tickets with timestamps
- Dashboard showing ticket metrics (total open, by priority, by category, average resolution time)
- Basic authentication for support agents
- Search and filter tickets by status, priority, category, and date range

## Technology Stack

### Frontend
- React 18 with TypeScript
- Vite (build tool and dev server)
- Tailwind CSS (styling)
- React Router (routing)

### Backend
- Node.js with Express and TypeScript
- SQLite (database)
- JWT (authentication)
- bcrypt (password hashing)

## Project Structure

```
.
├── backend/              # Express API server
│   ├── src/
│   │   ├── routes/      # API route definitions
│   │   ├── controllers/ # Request handlers
│   │   ├── services/    # Business logic
│   │   ├── models/      # Data models and types
│   │   ├── middleware/  # Custom middleware
│   │   ├── database/    # Database setup and queries
│   │   └── utils/       # Helper functions
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/            # React application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── api/         # API client
│   │   ├── types/       # TypeScript types
│   │   ├── context/     # React context (auth, etc.)
│   │   ├── hooks/       # Custom React hooks
│   │   └── utils/       # Helper functions
│   ├── package.json
│   └── tsconfig.json
│
└── .kiro/              # Kiro spec and steering documents
    ├── specs/          # Feature specifications
    └── steering/       # Coding standards and best practices
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository** (or navigate to the project directory)

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables:**
   ```bash
   cd ../backend
   cp .env.example .env
   # Edit .env file with your configuration
   ```

### Seeding Demo Data

To populate the database with demo data for testing:

```bash
cd backend
npm run seed
```

This creates:
- 2 demo users (support agents)
- 15 sample tickets with various statuses, priorities, and categories
- Comments on tickets

**Demo Login Credentials:**
- Email: `agent1@example.com` / Password: `password123`
- Email: `agent2@example.com` / Password: `password123`

### Development

1. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   ```
   The API will be available at `http://localhost:3000`

2. **Start the frontend dev server** (in a new terminal):
   ```bash
   cd frontend
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

3. **Open your browser** and navigate to `http://localhost:5173`

### Building for Production

1. **Build the backend:**
   ```bash
   cd backend
   npm run build
   ```

2. **Build the frontend:**
   ```bash
   cd frontend
   npm run build
   ```

3. **Start the production server:**
   ```bash
   cd backend
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Agent login
- `POST /api/auth/logout` - Agent logout

### Tickets
- `GET /api/tickets` - Get all tickets (with optional filters)
- `GET /api/tickets/:id` - Get single ticket by ID
- `POST /api/tickets` - Create new ticket
- `PATCH /api/tickets/:id/status` - Update ticket status
- `POST /api/tickets/:id/comments` - Add comment to ticket

### Dashboard
- `GET /api/dashboard/metrics` - Get dashboard metrics

## Development Guidelines

This project follows strict coding standards and best practices. Please refer to the steering documents in `.kiro/steering/` for:

- TypeScript best practices
- React best practices
- Express API best practices
- Code comments guide
- Architecture overview

## Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## License

MIT
