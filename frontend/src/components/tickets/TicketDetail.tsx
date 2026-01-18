import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTicket } from '../../hooks/useTicket';
import { updateTicketStatus } from '../../api/tickets';
import { TicketStatus } from '../../types/ticket';
import { StatusBadge } from '../shared/StatusBadge';
import { PriorityBadge } from '../shared/PriorityBadge';
import { CategoryBadge } from '../shared/CategoryBadge';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { ErrorMessage } from '../shared/ErrorMessage';
import { CommentThread } from './CommentThread';
import { formatDate } from '../../utils/formatters';

/**
 * Ticket detail component that displays full ticket information.
 * Shows ticket header, description, status selector, and comment thread.
 * 
 * @example
 * ```tsx
 * <Route path="/tickets/:id" element={<TicketDetail />} />
 * ```
 */
export function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { ticket, loading, error, refetch } = useTicket(id!);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  /**
   * Handles status change.
   */
  const handleStatusChange = async (newStatus: TicketStatus) => {
    if (!ticket || isUpdatingStatus) return;

    try {
      setIsUpdatingStatus(true);
      await updateTicketStatus(ticket.id, newStatus);
      // Refetch ticket to get updated data
      await refetch();
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update ticket status. Please try again.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  /**
   * Handles back button click.
   */
  const handleBack = () => {
    navigate('/tickets');
  };

  // Loading state
  if (loading) {
    return <LoadingSpinner message="Loading ticket..." />;
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage message={error} onRetry={refetch} />
      </div>
    );
  }

  // Not found state
  if (!ticket) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage message="Ticket not found" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <button
        onClick={handleBack}
        className="mb-4 text-sm text-gray-600 hover:text-gray-900 flex items-center"
      >
        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to tickets
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{ticket.title}</h1>
                <p className="text-sm text-gray-500">Ticket #{ticket.id.slice(0, 8)}</p>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
              <CategoryBadge category={ticket.category} />
            </div>

            {/* Description */}
            <div className="prose max-w-none">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
              <p className="text-gray-900 whitespace-pre-wrap">{ticket.description}</p>
            </div>
          </div>

          {/* Comment thread */}
          <CommentThread ticket={ticket} onCommentAdded={refetch} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status selector */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Update Status</h3>
            <select
              value={ticket.status}
              onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
              disabled={isUpdatingStatus}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:opacity-50"
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Ticket info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Ticket Information</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-xs text-gray-500">Customer</dt>
                <dd className="text-sm text-gray-900 mt-1">
                  {ticket.customerName || 'N/A'}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Email</dt>
                <dd className="text-sm text-gray-900 mt-1">{ticket.customerEmail}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Created</dt>
                <dd className="text-sm text-gray-900 mt-1">{formatDate(ticket.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Last Updated</dt>
                <dd className="text-sm text-gray-900 mt-1">{formatDate(ticket.updatedAt)}</dd>
              </div>
              {ticket.resolvedAt && (
                <div>
                  <dt className="text-xs text-gray-500">Resolved</dt>
                  <dd className="text-sm text-gray-900 mt-1">{formatDate(ticket.resolvedAt)}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
