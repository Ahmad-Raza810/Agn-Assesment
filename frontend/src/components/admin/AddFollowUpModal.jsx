import React, { useState } from 'react';
import Modal from '../common/Modal';
import { leadService } from '../../services/leadService';
import { useToast } from '../../context/ToastContext';
import { Calendar, MessageSquare, Clock, PlusCircle, AlertTriangle, AlertCircle, Sparkles } from 'lucide-react';

export default function AddFollowUpModal({ isOpen, onClose, lead, onFollowUpAdded }) {
  const { success, error: toastError, warning } = useToast();
  const [notes, setNotes] = useState('');
  const [nextFollowUpDate, setNextFollowUpDate] = useState('');
  const [allowPastDate, setAllowPastDate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isPastDate = nextFollowUpDate ? new Date(nextFollowUpDate) < new Date() : false;

  const handleQuickPreset = (offsetHours, offsetDays = 0) => {
    const target = new Date();
    if (offsetDays > 0) target.setDate(target.getDate() + offsetDays);
    if (offsetHours > 0) target.setHours(target.getHours() + offsetHours);
    else target.setHours(10, 0, 0, 0);

    const year = target.getFullYear();
    const month = String(target.getMonth() + 1).padStart(2, '0');
    const day = String(target.getDate()).padStart(2, '0');
    const hours = String(target.getHours()).padStart(2, '0');
    const minutes = String(target.getMinutes()).padStart(2, '0');
    setNextFollowUpDate(`${year}-${month}-${day}T${hours}:${minutes}`);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!notes.trim()) {
      setError('Please enter follow-up notes');
      return;
    }

    if (!nextFollowUpDate) {
      setError('Next follow-up date is required.');
      return;
    }

    if (isPastDate && !allowPastDate) {
      setError('Selected date is in the past. Check the confirmation box below to save as an Overdue follow-up.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      const payload = {
        notes: notes.trim(),
        nextFollowUpDate: nextFollowUpDate ? nextFollowUpDate : null,
      };

      const updatedLead = await leadService.addFollowUp(lead.id, payload);
      
      if (isPastDate) {
        warning('Follow-up recorded and immediately flagged as OVERDUE.');
      } else if (lead.status !== 'FOLLOW_UP') {
        success('Follow-up added and lead status advanced to Follow-up!');
      } else {
        success('Follow-up record added successfully!');
      }

      setNotes('');
      setNextFollowUpDate('');
      setAllowPastDate(false);
      onFollowUpAdded(updatedLead);
      onClose();
    } catch (err) {
      console.error('Add follow-up error:', err);
      const msg = err.response?.data?.message || 'Failed to add follow-up record';
      toastError(msg);
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!lead) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Follow-up Note"
      subtitle={`Logging interaction for ${lead.name} (${lead.email})`}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Lead Context Pill */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <div>
            <span className="text-slate-400">Service: </span>
            <span className="font-semibold text-slate-800">{lead.serviceOfInterest}</span>
          </div>
          <div>
            <span className="text-slate-400">Current Status: </span>
            <span className="font-semibold text-slate-800">{lead.status}</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Follow-up Notes <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Called client to discuss requirement details. Sent proposal quotation via email..."
              className={`w-full p-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                error
                  ? 'border-rose-300 focus:ring-rose-100 bg-rose-50/20'
                  : 'border-slate-200 focus:border-slate-400 focus:ring-slate-100'
              }`}
            />
          </div>
          {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}
        </div>

        {/* Next Follow-up Date */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Next Follow-up Date & Time <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-slate-400">Quick presets:</span>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            <button
              type="button"
              onClick={() => handleQuickPreset(2)}
              className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-slate-800 text-slate-600 transition"
            >
              Today (+2h)
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset(0, 1)}
              className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-slate-800 text-slate-600 transition"
            >
              Tomorrow
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset(0, 3)}
              className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-slate-800 text-slate-600 transition"
            >
              In 3 Days
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset(0, 7)}
              className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-slate-800 text-slate-600 transition"
            >
              Next Week
            </button>
          </div>

          <div className="relative">
            <input
              type="datetime-local"
              value={nextFollowUpDate}
              onChange={(e) => {
                setNextFollowUpDate(e.target.value);
                if (error) setError('');
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                isPastDate
                  ? 'border-amber-300 bg-amber-50/30 focus:border-amber-500 focus:ring-amber-100'
                  : 'border-slate-200 focus:border-slate-400 focus:ring-slate-100'
              }`}
            />
          </div>

          {isPastDate && (
            <div className="mt-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
              <div className="flex items-start gap-2 text-xs text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Past date selected: </span>
                  <span>The date you selected is in the past. Saving this will record it as an <strong>Overdue Follow-up</strong>.</span>
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs font-semibold text-amber-950 cursor-pointer pt-1 border-t border-amber-200/60">
                <input
                  type="checkbox"
                  checked={allowPastDate}
                  onChange={(e) => setAllowPastDate(e.target.checked)}
                  className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                />
                <span>Allow recording as an overdue follow-up</span>
              </label>
            </div>
          )}

          {!nextFollowUpDate && (
            <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
              <span>⚠</span>
              <span>Follow-up date is required.</span>
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-5 py-2 text-sm font-semibold text-white rounded-xl shadow-sm transition flex items-center gap-2 disabled:opacity-50 ${
              isPastDate
                ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-200'
                : 'bg-slate-900 hover:bg-slate-800 shadow-sm'
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>{isPastDate ? 'Save Overdue Follow-up' : 'Save Follow-up'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
