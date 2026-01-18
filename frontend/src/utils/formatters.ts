/**
 * Utility functions for formatting data for display.
 */

/**
 * Formats an ISO 8601 date string to a human-readable format.
 * 
 * @param isoString - ISO 8601 date string
 * @returns Formatted date string (e.g., "Jan 15, 2024 at 3:45 PM")
 */
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Formats a date to show relative time (e.g., "2 hours ago", "3 days ago").
 * 
 * @param isoString - ISO 8601 date string
 * @returns Relative time string
 */
export function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  // Convert to different units
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSeconds < 60) {
    return 'just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  } else {
    // For older dates, show full date
    return formatDate(isoString);
  }
}

/**
 * Formats resolution time in hours to a human-readable string.
 * 
 * @param hours - Resolution time in hours
 * @returns Formatted string (e.g., "2.5 hours", "3 days")
 */
export function formatResolutionTime(hours: number): string {
  if (hours === 0) {
    return 'N/A';
  }
  
  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
  } else if (hours < 24) {
    return `${hours.toFixed(1)} ${hours === 1 ? 'hour' : 'hours'}`;
  } else {
    const days = (hours / 24).toFixed(1);
    return `${days} ${days === '1.0' ? 'day' : 'days'}`;
  }
}
