# Quick Start Guide - Customer Support Ticket System

This guide will get you up and running in under 5 minutes for the demo.

## Prerequisites

- Node.js 18+ installed
- Two terminal windows

## Step-by-Step Setup

### 1. Install Dependencies (First Time Only)

**Terminal 1 - Backend:**
```bash
cd backend
npm install
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
```

### 2. Seed Demo Data (First Time Only)

**Terminal 1 - Backend:**
```bash
npm run seed
```

This creates demo users and sample tickets.

### 3. Start the Application

**Terminal 1 - Backend:**
```bash
npm run dev
```
Wait for: `Server running on http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
npm run dev
```
Wait for: `Local: http://localhost:5173/`

### 4. Open the Application

Open your browser to: **http://localhost:5173**

### 5. Login

Use these demo credentials:
- **Email:** `agent1@example.com`
- **Password:** `password123`

## Demo Flow (47 minutes)

### Part 1: Dashboard Overview (5 min)
1. After login, you'll see the Dashboard
2. Show metrics:
   - Total open tickets
   - Average resolution time
3. **NEW:** Show doughnut charts:
   - Tickets by Priority chart (visual breakdown with color coding)
   - Tickets by Category chart (visual breakdown with color coding)
   - Point out the total count in the center of each chart
   - Highlight the interactive legend showing counts

### Part 2: Ticket List & Filtering (10 min)
1. Click "Tickets" in the navigation
2. **NEW:** Demonstrate view toggle:
   - Show default grid view (cards)
   - Click list icon to switch to list view (table format)
   - Click grid icon to switch back
   - Explain: Grid view for visual browsing, List view for quick scanning
3. Show the ticket list with status badges
4. Demonstrate filtering:
   - Filter by Status (Open, In Progress, Resolved, Closed)
   - Filter by Priority (Critical, High, Medium, Low)
   - Filter by Category (Technical, Billing, General)
   - Filter by Date Range
5. Show "Clear Filters" functionality
6. **NEW:** Show that filters work in both grid and list views

### Part 3: Ticket Details (10 min)
1. Click on any ticket to view details
2. Show ticket information:
   - Title and description
   - Status, priority, and category badges
   - Customer information
   - Created and updated timestamps
3. Demonstrate status updates:
   - Change status from dropdown
   - Show system comment automatically added
4. Show comment thread:
   - Existing comments with timestamps
   - System comments (status changes) in gray

### Part 4: Adding Comments (5 min)
1. Scroll to comment form at bottom
2. Add a new comment
3. Show it appears in the thread immediately
4. Demonstrate validation (empty comment rejection)

### Part 5: Kanban Board (7 min)
1. Click "Kanban" in the navigation
2. Show the visual board layout:
   - Four status columns: Open, In Progress, Resolved, Closed
   - Tickets grouped by category within each column (Technical, Billing, General)
   - Tickets sorted by priority (Critical → High → Medium → Low)
3. Demonstrate drag-and-drop:
   - Drag a ticket from "Open" to "In Progress"
   - Show visual feedback during drag
   - Ticket moves to new column
   - System comment automatically created
4. Show category grouping:
   - Point out category icons (🔧 Technical, 💰 Billing, 📋 General)
   - Show how tickets are organized within each status column
5. Show priority sorting:
   - Point out that Critical tickets appear first
   - Then High, Medium, and Low priority tickets

### Part 6: Creating New Tickets (8 min)
1. Click "New Ticket" in navigation
2. Fill out the form:
   - Title (required, max 200 chars)
   - Description (required)
   - Category dropdown
   - Priority dropdown
   - Customer name (optional)
   - Customer email (required, validated)
3. Show form validation:
   - Try submitting with empty title
   - Try invalid email format
4. Create a valid ticket
5. Show automatic navigation to ticket detail page

### Part 7: Wrap-up (2 min)
1. Return to Dashboard
2. Show updated metrics reflecting new ticket
3. Highlight key features:
   - Real-time updates
   - Kanban board with drag-and-drop
   - Clean, intuitive interface
   - Comprehensive filtering
   - Full audit trail with comments

## Troubleshooting

### Backend won't start
- Check if port 3000 is already in use
- Verify Node.js version: `node --version` (should be 18+)
- Delete `backend/node_modules` and run `npm install` again

### Frontend won't start
- Check if port 5173 is already in use
- Verify Node.js version: `node --version` (should be 18+)
- Delete `frontend/node_modules` and run `npm install` again

### Can't login
- Make sure you ran `npm run seed` in the backend directory
- Check backend terminal for errors
- Verify backend is running on port 3000

### API errors
- Check that backend is running
- Check browser console for error messages
- Verify proxy configuration in `frontend/vite.config.ts`

### Database issues
- Delete `backend/data/tickets.db` file
- Run `npm run seed` again to recreate database

## Resetting Demo Data

To reset the database to initial demo state:

```bash
cd backend
rm -rf data/tickets.db
npm run seed
```

Then refresh the browser and login again.

## Key Features to Highlight

1. **Type Safety**: Full TypeScript implementation on both frontend and backend
2. **Modern Stack**: React 18, Vite, Express, SQLite
3. **Clean Architecture**: Separation of concerns with services, controllers, routes
4. **User Experience**: Intuitive UI with Tailwind CSS
5. **Real-time Updates**: Optimistic UI updates with server synchronization
6. **Comprehensive Filtering**: Multiple filter criteria with clear filters option
7. **Audit Trail**: System comments track all status changes
8. **Form Validation**: Client-side validation with helpful error messages
9. **Authentication**: Secure JWT-based authentication
10. **Responsive Design**: Works on desktop and mobile devices
11. **NEW: Visual Data Representation**: Doughnut charts for priority and category breakdowns
12. **NEW: Flexible Views**: Toggle between grid and list views for tickets

## Next Steps After Demo

- Review architecture documentation in `.kiro/steering/architecture-overview.md`
- Check coding standards in `.kiro/steering/` directory
- Explore API endpoints in `backend/src/routes/`
- Review React components in `frontend/src/components/`
- Read requirements and design docs in `.kiro/specs/`
