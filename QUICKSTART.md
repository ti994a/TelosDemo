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

## Demo Flow (50 minutes)

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

### Part 2: Kanban Board View (7 min)
1. Click "Kanban Board" in the navigation menu
2. Show the four status columns:
   - Open
   - In Progress
   - Resolved
   - Closed
3. Explain the organization:
   - Tickets grouped by category (Technical, Billing, General) within each column
   - Within each category, sorted by priority (Critical → High → Medium → Low)
   - Color-coded borders indicate priority level
4. Demonstrate drag-and-drop:
   - Drag a ticket from "Open" to "In Progress"
   - Show the visual feedback during drag (opacity change, border highlighting)
   - Explain that the status updates automatically on the backend
   - Point out the system comment that will be created
5. Click on a ticket number or title to navigate to detail view
6. Return to Kanban board to show the updated layout

### Part 2.5: Kanban Board Filtering (5 min)
1. Show the filter dropdowns above the Kanban board:
   - Priority filter dropdown on the left
   - Customer filter dropdown on the right
2. Demonstrate priority filtering:
   - Select "Critical" from priority dropdown
   - Show that only Critical priority tickets are displayed across all columns
   - Point out that category grouping and priority sorting are maintained
   - Select "High" to show different results
3. Demonstrate customer filtering:
   - Select "All" in priority filter to reset
   - Select a specific customer email from customer dropdown
   - Show that only tickets from that customer are displayed
   - Explain that the dropdown is populated with unique customer emails from all tickets
4. Demonstrate combined filtering:
   - Select "High" priority AND a specific customer
   - Show that both filters work together (AND logic)
   - Explain: "Show me all High priority tickets from this customer"
5. Demonstrate filter reset:
   - Select "All" in both dropdowns
   - Show that all tickets are displayed again
6. Show empty state handling:
   - Select a filter combination that has no matches
   - Point out the empty column styling
   - Explain that the board structure is maintained even when empty

### Part 3: Ticket List & Filtering (10 min)
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

### Part 4: Ticket Details (8 min)
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

### Part 5: Adding Comments (5 min)
1. Scroll to comment form at bottom
2. Add a new comment
3. Show it appears in the thread immediately
4. Demonstrate validation (empty comment rejection)

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
   - Clean, intuitive interface
   - Kanban board for visual workflow management
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
11. **Visual Data Representation**: Doughnut charts for priority and category breakdowns
12. **Flexible Views**: Toggle between grid and list views for tickets
13. **Kanban Board**: Drag-and-drop workflow management with visual organization
14. **Kanban Filtering**: Filter Kanban board by priority and customer with combined filtering support

## Next Steps After Demo

- Review architecture documentation in `.kiro/steering/architecture-overview.md`
- Check coding standards in `.kiro/steering/` directory
- Explore API endpoints in `backend/src/routes/`
- Review React components in `frontend/src/components/`
- Read requirements and design docs in `.kiro/specs/`
