# Customer Support Ticket System

**A Telos Corporation Security Demonstration**

A full-stack web application for managing customer support tickets, built with React, TypeScript, Express, and SQLite. This system demonstrates security best practices aligned with NIST SP 800-53 standards for organizations serving government and regulated industries.

[![Tests](https://img.shields.io/badge/tests-24%2F24%20passing-brightgreen)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)]()
[![React](https://img.shields.io/badge/React-18-blue)]()
[![Express](https://img.shields.io/badge/Express-4.18-green)]()
[![Security](https://img.shields.io/badge/NIST%20SP%20800--53-Aligned-orange)]()

## 🎯 Overview

This system provides a complete solution for managing customer support tickets with a modern, intuitive interface. Built with type safety and security best practices in mind, it demonstrates Telos Corporation's commitment to secure software development for government and regulated industries.

**About Telos Corporation:**
Telos Corporation (NASDAQ: TLS) is a leading provider of information technology and cybersecurity solutions headquartered in Ashburn, Virginia. Telos serves the Department of Defense, intelligence community, state and local governments, and highly regulated commercial organizations throughout the United States.

### Key Features

- **Ticket Management**: Complete lifecycle from creation to resolution
- **Real-time Updates**: Instant status changes with audit trail
- **Kanban Board View**: Visual workflow management with drag-and-drop status updates
- **Visual Analytics**: Dashboard with doughnut charts for data visualization
- **Flexible Views**: Toggle between grid and list views for tickets
- **Advanced Filtering**: Filter by status, priority, category, and date range
- **Comment System**: Full conversation thread with system-generated comments
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **Security Controls**: NIST SP 800-53 aligned implementation
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Security Features

This application demonstrates implementation of key NIST SP 800-53 security controls:

- **AC-2/AC-3**: Account management and access enforcement with JWT tokens
- **SC-12/SC-13**: Cryptographic protection with bcrypt and secure key management
- **AU-2/AU-3**: Audit logging of security-relevant events
- **SI-10**: Comprehensive input validation and sanitization
- **AC-12**: Session management with automatic token expiration

See the [Security Implementation](#-security-implementation) section for detailed information.

## 📸 Screenshots

### Dashboard with Visual Analytics
- Total open tickets and average resolution time metrics
- Interactive doughnut charts for priority and category breakdowns
- Color-coded segments with legends

### Kanban Board View
- Four status columns: Open, In Progress, Resolved, Closed
- Tickets grouped by category within each column
- Drag-and-drop to change ticket status
- Priority-based color coding and sorting

### Ticket List with View Toggle
- Grid view: Card-based layout for visual browsing
- List view: Compact table format for quick scanning
- Comprehensive filtering options

### Ticket Detail
- Full ticket information with status badges
- Complete comment thread with timestamps
- Status update workflow with system comments

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** and npm
- **Git** (for cloning)
- **Two terminal windows** (for running backend and frontend)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd customer-support-ticket-system
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Seed demo data**
   ```bash
   cd ../backend
   npm run seed
   ```
   
   This creates:
   - 3 demo support agents
   - 16 sample tickets with various statuses
   - Comments on tickets

### Running the Application

1. **Start the backend** (Terminal 1)
   ```bash
   cd backend
   npm run dev
   ```
   Wait for: `Server running on http://localhost:3000`

2. **Start the frontend** (Terminal 2)
   ```bash
   cd frontend
   npm run dev
   ```
   Wait for: `Local: http://localhost:5173/`

3. **Open your browser**
   ```
   http://localhost:5173
   ```

4. **Login with demo credentials**
   - Email: `agent1@example.com`
   - Password: `password123`

## 🧪 Testing

### Run All Tests

```bash
./tests/run-all-tests.sh
```

This runs the complete test suite:
- ✅ Backend API integration tests (13 tests)
- ✅ Frontend integration tests (4 tests)
- ✅ UI enhancement tests (7 tests)
- ✅ Dashboard verification tests

**Current Status: 24/24 tests passing** ✓

### Individual Test Suites

```bash
# Backend API tests only
./tests/test-api.sh

# Frontend integration tests only
./tests/test-frontend.sh

# UI enhancement tests only
./tests/test-ui-enhancements.sh

# Dashboard verification only
./tests/verify-dashboard.sh
```

## 🔒 Security Implementation

This application demonstrates implementation of NIST SP 800-53 security controls, suitable for organizations serving government and regulated industries.

### Implemented Security Controls

#### Authentication and Authorization (AC-2, AC-3)
- **Account Management**: User accounts with unique email constraints
- **Password Security**: Bcrypt hashing with salt (10 rounds)
- **Access Control**: JWT-based authentication with 8-hour token expiration
- **Protected Routes**: Middleware enforces authentication on all protected endpoints

#### Data Encryption (SC-12, SC-13)
- **Password Hashing**: Bcrypt with automatic salt generation
- **Token Security**: JWT tokens signed with HS256 algorithm
- **Key Management**: JWT secret stored in environment variables
- **TLS Ready**: Application designed for HTTPS deployment

#### Audit Logging (AU-2, AU-3)
- **HTTP Logging**: Morgan middleware logs all requests
- **Authentication Events**: Login attempts logged with outcome
- **Status Changes**: System comments track all ticket status updates
- **Timestamps**: All audit events include ISO 8601 timestamps

#### Input Validation (SI-10)
- **Field Validation**: Title, description, email format validation
- **Enum Validation**: Status, priority, category validated against allowed values
- **SQL Injection Prevention**: Parameterized queries throughout
- **XSS Prevention**: React automatic escaping of user content

#### Session Management (AC-12)
- **Token Expiration**: JWT tokens expire after 8 hours
- **Logout Handling**: Client-side token clearing on logout
- **Expired Token Rejection**: Middleware validates token expiration

### Security Middleware

- **Helmet.js**: Sets security HTTP headers (X-Frame-Options, CSP, etc.)
- **CORS**: Configured for frontend origin with credentials support
- **Body Parser**: Request size limits to prevent DoS attacks

### Security Best Practices

1. **No Hardcoded Secrets**: All sensitive values in environment variables
2. **Type Safety**: TypeScript prevents many common vulnerabilities
3. **Error Handling**: Centralized error handling without information leakage
4. **Consistent Validation**: Input validation at multiple layers
5. **Audit Trail**: System comments provide change history

### Production Security Recommendations

For production deployment, consider these enhancements:

- **TLS/HTTPS**: Deploy behind reverse proxy with TLS 1.2+
- **Account Lockout**: Implement after N failed login attempts
- **Password Policy**: Add complexity requirements and expiration
- **MFA**: Add multi-factor authentication support
- **Rate Limiting**: Implement request rate limiting
- **CSRF Protection**: Add CSRF tokens for state-changing operations
- **Database Encryption**: Use SQLCipher or encrypted filesystem
- **Structured Logging**: Implement centralized audit log system
- **Token Revocation**: Add server-side token blacklist
- **Session Monitoring**: Track and limit concurrent sessions

See `.kiro/specs/customer-support-ticket-system/design.md` for detailed security implementation documentation.

## 🏗️ Technology Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **HTML5 Canvas** - For doughnut charts (no external dependencies)

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe JavaScript
- **SQLite** - Embedded database
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **tsx** - TypeScript execution for Node.js

## 📁 Project Structure

```
customer-support-ticket-system/
├── backend/                    # Express API server
│   ├── src/
│   │   ├── routes/            # API route definitions
│   │   ├── controllers/       # Request handlers
│   │   ├── services/          # Business logic
│   │   ├── models/            # Data models and types
│   │   ├── middleware/        # Custom middleware (auth, errors)
│   │   ├── database/          # Database setup and queries
│   │   └── utils/             # Helper functions
│   ├── data/                  # SQLite database file
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # React application
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── auth/         # Login form
│   │   │   ├── dashboard/    # Dashboard and charts
│   │   │   ├── tickets/      # Ticket list and detail
│   │   │   └── shared/       # Reusable components
│   │   ├── api/              # API client
│   │   ├── context/          # React context (auth)
│   │   ├── hooks/            # Custom React hooks
│   │   ├── types/            # TypeScript types
│   │   └── utils/            # Helper functions
│   ├── package.json
│   └── tsconfig.json
│
├── tests/                      # Test suite
│   ├── run-all-tests.sh       # Main test runner
│   ├── test-api.sh            # Backend API tests
│   ├── test-frontend.sh       # Frontend integration tests
│   ├── test-ui-enhancements.sh # UI enhancement tests
│   └── verify-dashboard.sh    # Dashboard verification
│
├── .kiro/                      # Kiro specifications
│   ├── specs/                 # Feature specifications
│   │   └── customer-support-ticket-system/
│   │       ├── requirements.md # 8 functional requirements
│   │       ├── design.md      # 25 correctness properties
│   │       └── tasks.md       # 25 implementation tasks
│   └── steering/              # Best practices guides
│       ├── typescript-best-practices.md
│       ├── react-best-practices.md
│       ├── express-api-best-practices.md
│       ├── architecture-overview.md
│       ├── code-comments-guide.md
│       └── documentation-maintenance.md
│
├── README.md                   # This file
├── QUICKSTART.md              # Quick demo guide
└── GIT-COMMIT-MESSAGES.md     # Git commit templates
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Agent login
- `POST /api/auth/logout` - Agent logout
- `GET /api/auth/me` - Get current user

### Tickets
- `GET /api/tickets` - Get all tickets (with optional filters)
- `GET /api/tickets/:id` - Get single ticket by ID
- `POST /api/tickets` - Create new ticket
- `PATCH /api/tickets/:id/status` - Update ticket status
- `POST /api/tickets/:id/comments` - Add comment to ticket

### Dashboard
- `GET /api/dashboard/metrics` - Get dashboard metrics

### Query Parameters for Filtering
```
GET /api/tickets?status=Open&priority=High&category=Technical&startDate=2024-01-01&endDate=2024-12-31
```

## 📊 Database Schema

### Tables

**tickets**
- `id` (TEXT, PRIMARY KEY) - UUID
- `title` (TEXT, NOT NULL)
- `description` (TEXT, NOT NULL)
- `category` (TEXT, NOT NULL) - Technical, Billing, General
- `priority` (TEXT, NOT NULL) - Critical, High, Medium, Low
- `status` (TEXT, NOT NULL) - Open, In Progress, Resolved, Closed
- `customer_email` (TEXT, NOT NULL)
- `customer_name` (TEXT)
- `created_at` (TEXT, NOT NULL) - ISO 8601
- `updated_at` (TEXT, NOT NULL) - ISO 8601

**comments**
- `id` (TEXT, PRIMARY KEY) - UUID
- `ticket_id` (TEXT, FOREIGN KEY)
- `content` (TEXT, NOT NULL)
- `author_id` (TEXT, NOT NULL)
- `author_name` (TEXT, NOT NULL)
- `is_system` (BOOLEAN) - System-generated comment
- `created_at` (TEXT, NOT NULL) - ISO 8601

**users**
- `id` (TEXT, PRIMARY KEY) - UUID
- `email` (TEXT, UNIQUE, NOT NULL)
- `name` (TEXT, NOT NULL)
- `password_hash` (TEXT, NOT NULL)
- `created_at` (TEXT, NOT NULL) - ISO 8601

## 🎨 UI Features

### Kanban Board
- **Four Status Columns**: Open, In Progress, Resolved, Closed
- **Category Grouping**: Tickets organized by Technical, Billing, General within each column
- **Priority Sorting**: Tickets sorted by priority (Critical → High → Medium → Low) within categories
- **Drag-and-Drop**: Intuitive status updates by dragging tickets between columns
- **Visual Feedback**: Color-coded priority borders and drag-over highlighting
- **Click Navigation**: Click ticket number or title to view details

### Dashboard Charts
- **Doughnut Charts**: Visual representation using HTML5 Canvas
- **Priority Breakdown**: Critical, High, Medium, Low with color coding
- **Category Breakdown**: Technical, Billing, General with color coding
- **Interactive Legends**: Click to view individual counts
- **Responsive Design**: Adapts to mobile and desktop

### View Toggle
- **Grid View**: Card-based layout with rich information
- **List View**: Compact table format for quick scanning
- **Persistent State**: View preference maintained during session
- **Filter Compatibility**: Both views work with all filters

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Protected Routes**: Frontend route guards
- **CORS Configuration**: Controlled cross-origin requests
- **Helmet.js**: Security headers
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: Parameterized queries

## 🛠️ Development

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=3000
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

### Building for Production

1. **Build backend**
   ```bash
   cd backend
   npm run build
   ```

2. **Build frontend**
   ```bash
   cd frontend
   npm run build
   ```

3. **Start production server**
   ```bash
   cd backend
   npm start
   ```

### Code Quality

```bash
# Lint backend
cd backend
npm run lint

# Lint frontend
cd frontend
npm run lint

# Format code
npm run format
```

## 📚 Documentation

### Demo Credentials

**Support Agent 1:**
- Email: `agent1@example.com`
- Password: `password123`
- Name: Alice Johnson

**Support Agent 2:**
- Email: `agent2@example.com`
- Password: `password123`
- Name: Bob Smith

**Admin:**
- Email: `admin@example.com`
- Password: `admin123`
- Name: Admin User

### For Developers

- **Architecture Overview**: `.kiro/steering/architecture-overview.md`
- **TypeScript Best Practices**: `.kiro/steering/typescript-best-practices.md`
- **React Best Practices**: `.kiro/steering/react-best-practices.md`
- **Express API Best Practices**: `.kiro/steering/express-api-best-practices.md`
- **Code Comments Guide**: `.kiro/steering/code-comments-guide.md`
- **Documentation Maintenance**: `.kiro/steering/documentation-maintenance.md`

### For Product/Demo

- **Quick Start Guide**: `QUICKSTART.md`
- **Requirements**: `.kiro/specs/customer-support-ticket-system/requirements.md`
- **Design Document**: `.kiro/specs/customer-support-ticket-system/design.md`
- **Implementation Tasks**: `.kiro/specs/customer-support-ticket-system/tasks.md`

## 🐛 Troubleshooting

### Backend won't start
- Check if port 3000 is in use: `lsof -ti:3000 | xargs kill -9`
- Verify Node.js version: `node --version` (should be 18+)
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

### Frontend won't start
- Check if port 5173 is in use: `lsof -ti:5173 | xargs kill -9`
- Verify Node.js version: `node --version` (should be 18+)
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

### Can't login
- Ensure backend is running on port 3000
- Verify database was seeded: `cd backend && npm run seed`
- Check backend terminal for errors

### Database issues
- Reset database: `cd backend && rm -rf data/tickets.db && npm run seed`
- Check file permissions on `data/` directory

### Tests failing
- Ensure both backend and frontend are running
- Verify database is seeded
- Check that ports 3000 and 5173 are accessible
- Review individual test output for specific errors

## 🤝 Contributing

This project follows strict coding standards. Before contributing:

1. Read the steering documents in `.kiro/steering/`
2. Follow TypeScript, React, and Express best practices
3. Add comprehensive comments for complex code
4. Write tests for new features
5. Update documentation when making changes
6. Run `./tests/run-all-tests.sh` before committing

## 📝 License

MIT License - See LICENSE file for details

## 🎯 Demo Credentials

For testing and demonstration purposes:

**Support Agents:**
- Email: `agent1@example.com` / Password: `password123`
- Email: `agent2@example.com` / Password: `password123`
- Email: `agent3@example.com` / Password: `password123`

**Sample Data:**
- 16 tickets with various statuses, priorities, and categories
- Comments on multiple tickets
- System-generated status change comments

## 📞 Support

For questions or issues:
1. Check the troubleshooting section above
2. Review documentation in `.kiro/` directory
3. Check test output for specific error messages
4. Review architecture diagrams in steering documents

## 🎉 Acknowledgments

Built with modern web technologies and best practices:
- React team for the excellent UI library
- Express.js team for the robust web framework
- TypeScript team for type safety
- Tailwind CSS team for the utility-first CSS framework
- SQLite team for the embedded database

---

**Status**: ✅ Production Ready | **Tests**: 24/24 Passing | **Version**: 1.0.0

For a quick demo, see [QUICKSTART.md](QUICKSTART.md)
