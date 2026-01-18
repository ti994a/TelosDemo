import React from 'react';

/**
 * Props for ErrorMessage component.
 */
interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

/**
 * Error message component for displaying error states.
 * Shows an error icon, message, and optional retry button.
 * 
 * @example
 * ```tsx
 * <ErrorMessage message="Failed to load tickets" />
 * <ErrorMessage message="Network error" onRetry={refetch} />
 * ```
 */
export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      {/* Error icon */}
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
        <svg
          className="h-6 w-6 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      {/* Error message */}
      <h3 className="mt-4 text-lg font-medium text-gray-900">Error</h3>
      <p className="mt-2 text-sm text-gray-600 text-center max-w-md">{message}</p>

      {/* Optional retry button */}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
