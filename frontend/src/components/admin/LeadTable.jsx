import React from 'react';
import StatusBadge from '../common/StatusBadge';
import { TableSkeleton } from '../common/LoadingSkeleton';
import EmptyState from '../common/EmptyState';
import {
  Calendar,
  Clock,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Eye,
  MessageSquarePlus,
  Trash2,
  Mail,
  Phone,
  ArrowUpDown,
  AlertCircle,
  FileText,
} from 'lucide-react';

export default function LeadTable({
  leads,
  isLoading,
  page,
  totalPages,
  totalElements,
  onPageChange,
  onViewLead,
  onAddFollowUp,
  onQuickStatusChange,
  onDeleteLead,
  sortBy,
  sortDir,
  onSort,
}) {
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '—';
    try {
      const d = new Date(dateString);
      return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const getNextFollowUpMeta = (followUps) => {
    if (!followUps || followUps.length === 0) return null;
    // Find the latest follow up with a nextFollowUpDate
    const withDates = followUps.filter((f) => f.nextFollowUpDate);
    if (withDates.length === 0) return null;

    const latest = withDates[withDates.length - 1];
    const followUpDate = new Date(latest.nextFollowUpDate);
    const now = new Date();
    const isPast = followUpDate < now;
    const isToday =
      followUpDate.getDate() === now.getDate() &&
      followUpDate.getMonth() === now.getMonth() &&
      followUpDate.getFullYear() === now.getFullYear();

    return {
      date: latest.nextFollowUpDate,
      isPast,
      isToday,
      notePreview: latest.notes,
    };
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <TableSkeleton rows={6} />
      </div>
    );
  }

  if (!leads || leads.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <EmptyState
          title="No enquiries found"
          description="There are currently no enquiries matching your filter criteria."
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
      {/* Table responsive scroll area */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/75 border-b border-slate-200/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4 sm:px-6">Contact / Client</th>
              <th className="py-3.5 px-4">Service of Interest</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Next Follow-up</th>
              <th
                className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition select-none"
                onClick={() => onSort('createdAt')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Submitted</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((lead) => {
              const followUpMeta = getNextFollowUpMeta(lead.followUps);

              return (
                <tr
                  key={lead.id}
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  {/* Contact info */}
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs ring-1 ring-indigo-100 flex-shrink-0 mt-0.5">
                        {lead.name ? lead.name.charAt(0).toUpperCase() : '?'}
                      </div>
                      <div className="min-w-0">
                        <button
                          onClick={() => onViewLead(lead)}
                          className="font-bold text-slate-900 hover:text-indigo-600 transition text-left block truncate max-w-[200px]"
                        >
                          {lead.name}
                        </button>
                        <div className="flex flex-col gap-0.5 mt-0.5 text-xs text-slate-500">
                          <span className="flex items-center gap-1 truncate max-w-[200px]">
                            <Mail className="w-3 h-3 text-slate-400 flex-shrink-0" />
                            <a href={`mailto:${lead.email}`} className="hover:underline">
                              {lead.email}
                            </a>
                          </span>
                          {lead.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-400 flex-shrink-0" />
                              <a href={`tel:${lead.phone}`} className="hover:underline">
                                {lead.phone}
                              </a>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Service of Interest & preview */}
                  <td className="py-4 px-4">
                    <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200/60">
                      {lead.serviceOfInterest}
                    </span>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1 max-w-[220px]" title={lead.message}>
                      {lead.message}
                    </p>
                  </td>

                  {/* Status Dropdown / Badge */}
                  <td className="py-4 px-4">
                    <div className="relative inline-block">
                      <select
                        value={lead.status}
                        onChange={(e) => onQuickStatusChange(lead.id, e.target.value)}
                        className="text-xs font-semibold rounded-full px-2.5 py-1 border transition cursor-pointer appearance-none pr-6 focus:outline-none focus:ring-2 focus:ring-indigo-100 bg-white"
                        style={{
                          borderColor:
                            lead.status === 'NEW'
                              ? '#93c5fd'
                              : lead.status === 'CONTACTED'
                              ? '#c4b5fd'
                              : lead.status === 'FOLLOW_UP'
                              ? '#fcd34d'
                              : lead.status === 'CONVERTED'
                              ? '#86efac'
                              : '#fda4af',
                        }}
                      >
                        <option value="NEW">New</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="FOLLOW_UP">Follow-up</option>
                        <option value="CONVERTED">Converted</option>
                        <option value="LOST">Lost</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-slate-400">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </td>

                  {/* Follow-up status */}
                  <td className="py-4 px-4">
                    {followUpMeta ? (
                      <div>
                        <div
                          className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md ${
                            followUpMeta.isPast
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : followUpMeta.isToday
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          <span>
                            {followUpMeta.isPast
                              ? 'Overdue: '
                              : followUpMeta.isToday
                              ? 'Due Today: '
                              : 'Next: '}
                            {formatDate(followUpMeta.date)}
                          </span>
                        </div>
                        <span className="block text-[11px] text-slate-400 mt-0.5">
                          {lead.followUps.length} follow-up {lead.followUps.length === 1 ? 'note' : 'notes'}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">None scheduled</span>
                    )}
                  </td>

                  {/* Date Created */}
                  <td className="py-4 px-4 text-xs text-slate-500 whitespace-nowrap">
                    {formatDate(lead.createdAt)}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onViewLead(lead)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
                        title="View details & timeline"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onAddFollowUp(lead)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition"
                        title="Add follow-up note"
                      >
                        <MessageSquarePlus className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDeleteLead(lead)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Delete enquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="border-t border-slate-100 px-4 sm:px-6 py-3.5 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div>
          Showing page <span className="font-semibold text-slate-800">{page + 1}</span> of{' '}
          <span className="font-semibold text-slate-800">{totalPages || 1}</span> ({totalElements} total entries)
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 0}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>

          {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
            const pageNum = i;
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`w-7 h-7 rounded-lg font-medium transition ${
                  page === pageNum
                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {pageNum + 1}
              </button>
            );
          })}

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages - 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
