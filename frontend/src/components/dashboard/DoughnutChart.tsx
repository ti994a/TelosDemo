import React, { useEffect, useRef } from 'react';

/**
 * Props for DoughnutChart component.
 */
interface DoughnutChartProps {
  data: { label: string; value: number; color: string }[];
  title?: string;
}

/**
 * Doughnut chart component using Canvas API.
 * Displays data in a circular chart with a hollow center.
 * 
 * @example
 * ```tsx
 * <DoughnutChart
 *   data={[
 *     { label: 'Critical', value: 5, color: '#ef4444' },
 *     { label: 'High', value: 10, color: '#f59e0b' }
 *   ]}
 *   title="Tickets by Priority"
 * />
 * ```
 */
export function DoughnutChart({ data, title }: DoughnutChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate total
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    // If no data, show empty state
    if (total === 0) {
      ctx.fillStyle = '#e5e7eb';
      ctx.beginPath();
      ctx.arc(150, 150, 80, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(150, 150, 50, 0, 2 * Math.PI);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      
      ctx.fillStyle = '#9ca3af';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('No data', 150, 150);
      return;
    }

    // Draw doughnut chart
    const centerX = 150;
    const centerY = 150;
    const outerRadius = 80;
    const innerRadius = 50;
    let currentAngle = -Math.PI / 2; // Start at top

    data.forEach((item) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI;

      // Draw slice
      ctx.fillStyle = item.color;
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, currentAngle, currentAngle + sliceAngle);
      ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
      ctx.closePath();
      ctx.fill();

      currentAngle += sliceAngle;
    });

    // Draw center circle (white background)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
    ctx.fill();

    // Draw total in center
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(total.toString(), centerX, centerY - 10);
    
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px sans-serif';
    ctx.fillText('Total', centerX, centerY + 10);
  }, [data]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      
      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* Canvas for chart */}
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          className="flex-shrink-0"
        />

        {/* Legend */}
        <div className="flex-1 space-y-3 w-full">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-700">{item.label}</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
