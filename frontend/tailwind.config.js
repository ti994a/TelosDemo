/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Custom colors for ticket statuses and priorities
      colors: {
        'status-open': '#3b82f6',      // Blue
        'status-progress': '#f59e0b',  // Amber
        'status-resolved': '#10b981',  // Green
        'status-closed': '#6b7280',    // Gray
        'priority-low': '#10b981',     // Green
        'priority-medium': '#f59e0b',  // Amber
        'priority-high': '#ef4444',    // Red
        'priority-critical': '#dc2626', // Dark Red
      },
    },
  },
  plugins: [],
}
