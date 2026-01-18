import { TicketStatus, TicketPriority, TicketCategory, TicketInput } from '../models/Ticket';
import { ValidationError } from './errors';

/**
 * Valid ticket status values.
 */
const VALID_STATUSES: TicketStatus[] = ['Open', 'In Progress', 'Resolved', 'Closed'];

/**
 * Valid ticket priority values.
 */
const VALID_PRIORITIES: TicketPriority[] = ['Low', 'Medium', 'High', 'Critical'];

/**
 * Valid ticket category values.
 */
const VALID_CATEGORIES: TicketCategory[] = ['Technical', 'Billing', 'General'];

/**
 * Type guard to check if a string is a valid TicketStatus.
 * TypeScript will narrow the type after this check.
 * 
 * @param value - String to check
 * @returns True if value is a valid TicketStatus
 */
export function isTicketStatus(value: string): value is TicketStatus {
  return VALID_STATUSES.includes(value as TicketStatus);
}

/**
 * Type guard to check if a string is a valid TicketPriority.
 * 
 * @param value - String to check
 * @returns True if value is a valid TicketPriority
 */
export function isTicketPriority(value: string): value is TicketPriority {
  return VALID_PRIORITIES.includes(value as TicketPriority);
}

/**
 * Type guard to check if a string is a valid TicketCategory.
 * 
 * @param value - String to check
 * @returns True if value is a valid TicketCategory
 */
export function isTicketCategory(value: string): value is TicketCategory {
  return VALID_CATEGORIES.includes(value as TicketCategory);
}

/**
 * Validates a ticket status value.
 * 
 * @param status - Status string to validate
 * @returns The validated status
 * @throws {ValidationError} If status is invalid
 */
export function validateTicketStatus(status: string): TicketStatus {
  if (!isTicketStatus(status)) {
    throw new ValidationError(
      `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
      'status'
    );
  }
  return status;
}

/**
 * Validates a ticket priority value.
 * 
 * @param priority - Priority string to validate
 * @returns The validated priority
 * @throws {ValidationError} If priority is invalid
 */
export function validateTicketPriority(priority: string): TicketPriority {
  if (!isTicketPriority(priority)) {
    throw new ValidationError(
      `Invalid priority. Must be one of: ${VALID_PRIORITIES.join(', ')}`,
      'priority'
    );
  }
  return priority;
}

/**
 * Validates a ticket category value.
 * 
 * @param category - Category string to validate
 * @returns The validated category
 * @throws {ValidationError} If category is invalid
 */
export function validateTicketCategory(category: string): TicketCategory {
  if (!isTicketCategory(category)) {
    throw new ValidationError(
      `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`,
      'category'
    );
  }
  return category;
}

/**
 * Validates that a string is not empty or only whitespace.
 * Trims the string and checks if it has content.
 * 
 * @param value - String to validate
 * @param fieldName - Name of the field for error messages
 * @returns The trimmed string
 * @throws {ValidationError} If string is empty or only whitespace
 */
export function validateNonEmptyString(value: string, fieldName: string): string {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    throw new ValidationError(`${fieldName} cannot be empty`, fieldName);
  }
  return trimmed;
}

/**
 * Validates an email address format.
 * Uses a simple regex pattern for basic email validation.
 * 
 * @param email - Email string to validate
 * @returns The validated email
 * @throws {ValidationError} If email format is invalid
 */
export function validateEmail(email: string): string {
  const trimmed = email.trim();
  
  // Basic email regex pattern
  // Matches: user@domain.com, user.name@domain.co.uk, etc.
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(trimmed)) {
    throw new ValidationError('Invalid email format', 'customerEmail');
  }
  
  return trimmed;
}

/**
 * Validates complete ticket input data.
 * Checks all required fields and validates their formats.
 * 
 * @param input - Ticket input data to validate
 * @throws {ValidationError} If any validation fails
 */
export function validateTicketInput(input: TicketInput): void {
  // Validate title (required, non-empty)
  validateNonEmptyString(input.title, 'title');
  
  // Validate description (required, non-empty)
  validateNonEmptyString(input.description, 'description');
  
  // Validate category (required, must be valid enum value)
  validateTicketCategory(input.category);
  
  // Validate priority (required, must be valid enum value)
  validateTicketPriority(input.priority);
  
  // Validate customer email (required, must be valid email format)
  validateEmail(input.customerEmail);
  
  // Customer name is optional, but if provided, should not be empty
  if (input.customerName !== undefined && input.customerName !== null) {
    validateNonEmptyString(input.customerName, 'customerName');
  }
}

/**
 * Validates comment content.
 * 
 * @param content - Comment text to validate
 * @returns The trimmed content
 * @throws {ValidationError} If content is empty or only whitespace
 */
export function validateCommentContent(content: string): string {
  return validateNonEmptyString(content, 'content');
}
