import React, { useState } from 'react';
import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';
import { leadService } from '../../services/leadService';
import { useToast } from '../../context/ToastContext';
import {
  Mail,
  Phone,
  Calendar,
  Clock,
  MessageSquare,
  Sparkles,
  PlusCircle,
  Tag,
  CheckCircle2,
  AlertCircle,
  Building,
} from 'lucide-react';

const STATUS_OPTIONS = ['NEW', 'CONTACTED', 'FOLLOW_UP', 'CONVERTED', 'LOST'];

export default function LeadDetailModal({
  isOpen,
  onClose,
  lead,
  onStatusUpdated,
  onOpenAddFollowUp,
}) {
  const { success, error: toastError } = useToast();
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  if (!lead) return null;

  const handleStatusChange = async (newStatus) => {
    if (newStatus === lead.status) return;
    setIsUpdatingStatus(true);
    try {
      const updated = await leadService.updateLeadStatus(lead.id, newStatus);
      success(`Status updated to ${newStatus}`);
      onStatusUpdated(updated);
    } catch (err) {
      console.error('Update status error:', err);
      toastError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Enquiry & Lead Details"
      subtitle={`Enquiry ID: #${lead.id}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Header summary & status quick change */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-indigo-100">
              {lead.name ? lead.name.charAt(0).toUpperCase() : 'L'}
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">{lead.name}</h4>
              <p className="text-xs text-slate-500">Submitted on {formatDate(lead.createdAt)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Status:</span>
            <select
              value={lead.status}
              disabled={isUpdatingStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="text-xs font-semibold rounded-xl px-3 py-1.5 border border-slate-200 bg-white shadow-xs focus:ring-2 focus:ring-indigo-100 cursor-pointer disabled:opacity-50"
            >
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Contact info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl border border-slate-100 bg-white flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-slate-400 font-medium block">Email Address</span>
              <a href={`mailto:${lead.email}`} className="font-semibold text-slate-800 hover:text-indigo-600 truncate block">
                {lead.email}
              </a>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-100 bg-white flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-slate-400 font-medium block">Phone Number</span>
              <span className="font-semibold text-slate-800 truncate block">
                {lead.phone || 'Not provided'}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-100 bg-white flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Building className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-slate-400 font-medium block">Service of Interest</span>
              <span className="font-semibold text-indigo-700 truncate block">
                {lead.serviceOfInterest}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-100 bg-white flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-slate-400 font-medium block">Last Updated</span>
              <span className="font-semibold text-slate-800 truncate block">
                {formatDate(lead.updatedAt || lead.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Enquiry Message */}
        <div>
          <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
            <span>Enquiry Message</span>
          </h5>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
            {lead.message || 'No message provided.'}
          </div>
        </div>

        {/* Follow-up History & Timeline */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Follow-up History & Notes ({lead.followUps?.length || 0})</span>
            </h5>
            <button
              onClick={() => onOpenAddFollowUp(lead)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Follow-up Note</span>
            </button>
          </div>

          {lead.followUps && lead.followUps.length > 0 ? (
            <div className="space-y-3 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-slate-200">
              {lead.followUps.map((fu, idx) => (
                <div key={fu.id || idx} className="relative pl-9 group">
                  {/* Timeline bullet dot */}
                  <div className="absolute left-2.5 top-2 w-3 h-3 rounded-full bg-indigo-600 border-2 border-white shadow-xs" />

                  <div className="p-3.5 rounded-xl border border-slate-100 bg-white shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                      <span className="text-xs font-bold text-slate-900">
                        Follow-up #{idx + 1}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {formatDate(fu.createdAt)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed mb-2 whitespace-pre-wrap">
                      {fu.notes}
                    </p>

                    {fu.nextFollowUpDate && (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-semibold">
                        <Calendar className="w-3 h-3 text-amber-600" />
                        <span>Next scheduled: {formatDate(fu.nextFollowUpDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 px-4 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
              <p className="text-xs text-slate-500">No follow-up notes logged yet for this enquiry.</p>
              <button
                onClick={() => onOpenAddFollowUp(lead)}
                className="mt-2 text-xs font-semibold text-indigo-600 hover:underline"
              >
                Log the first follow-up note &rarr;
              </button>
            </div>
          )}
        </div>

        {/* Modal Close */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
