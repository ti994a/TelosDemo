import React from 'react';

/**
 * Props for LoadingSpinner component.
 */
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

/**
 * Loading spinner component with optional message.
 * Shows an animated spinner to indicate loading state.
 * 
 * @example
 * ```tsx
 * <LoadingSpinner />
 * <LoadingSpinner size="lg" message="Loading tickets..." />
 * ```
 */
export function LoadingSpinner({ size = 'md', message }: LoadingSpinnerProps) {
  // Map size to dimensions
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      {/* Animated spinner */}
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200 border-t-blue-600`}
        role="status"
        aria-label="Loading"
      />
      
      {/* Optional message */}
      {message && (
        <p className="mt-4 text-sm text-gray-600">{message}</p>
      )}
    </div>
  );
}
