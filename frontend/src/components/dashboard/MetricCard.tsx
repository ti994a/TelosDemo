import React from 'react';

interface MetricCardProps {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray';
}

/**
 * MetricCard component displays a single metric with label and value.
 * Supports different colors for visual distinction.
 * 
 * @example
 * ```tsx
 * <MetricCard 
 *   label="Open Tickets" 
 *   value={42} 
 *   color="blue"
 * />
 * ```
 */
export function MetricCard({ label, value, icon, color = 'blue' }: MetricCardProps) {
  // Color mapping for background and text
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    gray: 'bg-gray-50 text-gray-700 border-gray-200'
  };

  return (
    <div className={`rounded-lg border p-6 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {/* Label */}
          <p className="text-sm font-medium opacity-80">{label}</p>
          
          {/* Value */}
          <p className="mt-2 text-3xl font-bold">{value}</p>
        </div>
        
        {/* Optional icon */}
        {icon && (
          <div className="ml-4 opacity-60">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
