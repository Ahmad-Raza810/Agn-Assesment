import React, { useState } from 'react';
import Modal from '../common/Modal';
import { leadService } from '../../services/leadService';
import { useToast } from '../../context/ToastContext';
import { Calendar, MessageSquare, Clock, PlusCircle } from 'lucide-react';

export default function AddFollowUpModal({ isOpen, onClose, lead, onFollowUpAdded }) {
  const { success, error: toastError } = useToast();
  const [notes, setNotes] = useState('');
  const [nextFollowUpDate, setNextFollowUpDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!notes.trim()) {
      setError('Please enter follow-up notes');
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
      success('Follow-up record added successfully!');
      setNotes('');
      setNextFollowUpDate('');
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
            <span className="font-semibold text-indigo-600">{lead.status}</span>
          </div>
        </div>

        {/* Follow-up Notes */}
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
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
              }`}
            />
          </div>
          {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}
        </div>

        {/* Next Follow-up Date */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Next Follow-up Date & Time <span className="text-slate-400 font-normal lowercase">(optional)</span>
          </label>
          <div className="relative">
            <input
              type="datetime-local"
              value={nextFollowUpDate}
              onChange={(e) => setNextFollowUpDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Setting a date will flag this enquiry in the pending follow-ups dashboard.
          </p>
        </div>

        {/* Action buttons */}
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
            className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-200 transition flex items-center gap-2 disabled:opacity-50"
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
                <span>Save Follow-up</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
