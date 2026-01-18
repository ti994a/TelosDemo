import { initDatabase, getDb } from '../database/db';
import * as authService from '../services/authService';
import * as ticketService from '../services/ticketService';
import * as commentService from '../services/commentService';
import { TicketInput, TicketStatus } from '../models/Ticket';

/**
 * Seed script to populate database with demo data.
 * Creates sample users, tickets, and comments for demonstration purposes.
 */

/**
 * Creates demo support agents.
 */
async function createDemoUsers() {
  console.log('Creating demo users...');

  const users = [
    {
      email: 'agent1@example.com',
      password: 'password123',
      name: 'Alice Johnson',
    },
    {
      email: 'agent2@example.com',
      password: 'password123',
      name: 'Bob Smith',
    },
    {
      email: 'admin@example.com',
      password: 'admin123',
      name: 'Admin User',
    },
  ];

  const createdUsers = [];

  for (const userData of users) {
    try {
      const user = await authService.registerUser(
        userData.email,
        userData.password,
        userData.name
      );
      createdUsers.push(user);
      console.log(`  ✓ Created user: ${user.email}`);
    } catch (error) {
      console.log(`  - User ${userData.email} already exists`);
    }
  }

  return createdUsers;
}

/**
 * Creates demo tickets with various statuses, priorities, and categories.
 */
async function createDemoTickets() {
  console.log('Creating demo tickets...');

  const tickets: TicketInput[] = [
    {
      title: 'Cannot login to my account',
      description:
        'I have been trying to login for the past hour but keep getting an "Invalid credentials" error. I am sure my password is correct.',
      category: 'Technical',
      priority: 'High',
      customerEmail: 'customer1@example.com',
      customerName: 'John Doe',
    },
    {
      title: 'Billing discrepancy on last invoice',
      description:
        'My last invoice shows a charge of $150 but I was expecting $100 based on my plan. Can you please review this?',
      category: 'Billing',
      priority: 'Medium',
      customerEmail: 'customer2@example.com',
      customerName: 'Jane Smith',
    },
    {
      title: 'Feature request: Dark mode',
      description:
        'It would be great if the application had a dark mode option. My eyes get tired using the bright interface at night.',
      category: 'General',
      priority: 'Low',
      customerEmail: 'customer3@example.com',
      customerName: 'Mike Wilson',
    },
    {
      title: 'Critical: Data loss after update',
      description:
        'After the latest update, all my saved data has disappeared. This is urgent as I need this data for my business operations.',
      category: 'Technical',
      priority: 'Critical',
      customerEmail: 'customer4@example.com',
      customerName: 'Sarah Brown',
    },
    {
      title: 'How do I export my data?',
      description:
        'I need to export all my data to a CSV file. I cannot find this option in the settings. Can you guide me?',
      category: 'General',
      priority: 'Low',
      customerEmail: 'customer5@example.com',
      customerName: 'Tom Anderson',
    },
    {
      title: 'Payment method not updating',
      description:
        'I am trying to update my credit card information but the form keeps showing an error. I have tried multiple times.',
      category: 'Billing',
      priority: 'High',
      customerEmail: 'customer6@example.com',
      customerName: 'Emily Davis',
    },
    {
      title: 'Mobile app crashes on startup',
      description:
        'The mobile app crashes immediately after I open it. I have tried reinstalling but the problem persists. Using iPhone 13 with iOS 17.',
      category: 'Technical',
      priority: 'High',
      customerEmail: 'customer7@example.com',
      customerName: 'David Lee',
    },
    {
      title: 'Question about enterprise plan',
      description:
        'I am interested in upgrading to the enterprise plan. Can you provide more details about the features and pricing?',
      category: 'General',
      priority: 'Medium',
      customerEmail: 'customer8@example.com',
      customerName: 'Lisa Martinez',
    },
  ];

  const createdTickets = [];

  for (const ticketData of tickets) {
    const ticket = await ticketService.createTicket(ticketData);
    createdTickets.push(ticket);
    console.log(`  ✓ Created ticket: ${ticket.title}`);
  }

  return createdTickets;
}

/**
 * Updates some tickets to different statuses and adds comments.
 */
async function updateTicketsAndAddComments(tickets: any[], users: any[]) {
  console.log('Updating ticket statuses and adding comments...');

  const db = getDb();

  // Update first ticket to "In Progress" with comments
  if (tickets[0] && users[0]) {
    await ticketService.updateTicketStatus(tickets[0].id, 'In Progress', users[0].id);
    await commentService.addComment(
      tickets[0].id,
      'I have looked into this issue. It appears your account was temporarily locked due to multiple failed login attempts. I have unlocked it for you.',
      users[0].id,
      users[0].name
    );
    await commentService.addComment(
      tickets[0].id,
      'Please try logging in again and let me know if you still face any issues.',
      users[0].id,
      users[0].name
    );
    console.log(`  ✓ Updated ticket: ${tickets[0].title}`);
  }

  // Update second ticket to "Resolved"
  if (tickets[1] && users[1]) {
    await ticketService.updateTicketStatus(tickets[1].id, 'In Progress', users[1].id);
    await commentService.addComment(
      tickets[1].id,
      'I have reviewed your invoice. The extra $50 charge was for the premium support add-on that was activated last month.',
      users[1].id,
      users[1].name
    );
    await ticketService.updateTicketStatus(tickets[1].id, 'Resolved', users[1].id);
    
    // Set resolved_at timestamp manually for metrics calculation
    const now = new Date().toISOString();
    await db.run('UPDATE tickets SET resolved_at = ? WHERE id = ?', [now, tickets[1].id]);
    
    console.log(`  ✓ Updated ticket: ${tickets[1].title}`);
  }

  // Update fourth ticket (critical) to "In Progress"
  if (tickets[3] && users[0]) {
    await ticketService.updateTicketStatus(tickets[3].id, 'In Progress', users[0].id);
    await commentService.addComment(
      tickets[3].id,
      'This is a critical issue. Our engineering team is investigating the data loss. We will update you within the next hour.',
      users[0].id,
      users[0].name
    );
    console.log(`  ✓ Updated ticket: ${tickets[3].title}`);
  }

  // Update sixth ticket to "Resolved"
  if (tickets[5] && users[1]) {
    await ticketService.updateTicketStatus(tickets[5].id, 'In Progress', users[1].id);
    await commentService.addComment(
      tickets[5].id,
      'The issue was caused by a browser caching problem. Please clear your browser cache and try again.',
      users[1].id,
      users[1].name
    );
    await ticketService.updateTicketStatus(tickets[5].id, 'Resolved', users[1].id);
    
    // Set resolved_at timestamp
    const now = new Date().toISOString();
    await db.run('UPDATE tickets SET resolved_at = ? WHERE id = ?', [now, tickets[5].id]);
    
    console.log(`  ✓ Updated ticket: ${tickets[5].title}`);
  }

  // Add comment to seventh ticket
  if (tickets[6] && users[0]) {
    await ticketService.updateTicketStatus(tickets[6].id, 'In Progress', users[0].id);
    await commentService.addComment(
      tickets[6].id,
      'Thank you for reporting this. We have identified the issue and are working on a fix. A new version will be released tomorrow.',
      users[0].id,
      users[0].name
    );
    console.log(`  ✓ Updated ticket: ${tickets[6].title}`);
  }
}

/**
 * Main seed function.
 */
async function seed() {
  try {
    console.log('Starting database seed...\n');

    // Initialize database
    await initDatabase();

    // Create demo data
    const users = await createDemoUsers();
    console.log('');

    const tickets = await createDemoTickets();
    console.log('');

    await updateTicketsAndAddComments(tickets, users);
    console.log('');

    console.log('✅ Database seeded successfully!');
    console.log('\nDemo credentials:');
    console.log('  Email: agent1@example.com');
    console.log('  Password: password123');
    console.log('\n  Email: admin@example.com');
    console.log('  Password: admin123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  seed();
}

export { seed };
