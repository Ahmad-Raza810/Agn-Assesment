import React from 'react';
import { Search, X, Filter, RotateCcw } from 'lucide-react';

const SERVICES = [
  'All Services',
  'Web Development',
  'Mobile App Development',
  'UI/UX Design',
  'Cloud Architecture & DevOps',
  'E-commerce Solution',
  'Enterprise AI Integration',
  'Custom Software Development',
];

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'NEW', label: 'New' },
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'FOLLOW_UP', label: 'Follow-up' },
  { value: 'CONVERTED', label: 'Converted' },
  { value: 'LOST', label: 'Lost' },
];

export default function LeadFilters({
  searchTerm,
  onSearchChange,
  selectedService,
  onServiceChange,
  selectedStatus,
  onStatusChange,
  onResetFilters,
  totalResults,
}) {
  const hasActiveFilters =
    searchTerm.trim() !== '' ||
    (selectedService !== 'All Services' && selectedService !== '') ||
    selectedStatus !== 'ALL';

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs mb-6 space-y-4">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search enquiries by contact name..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Service selector */}
        <div className="min-w-[190px]">
          <select
            value={selectedService}
            onChange={(e) => onServiceChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition"
          >
            {SERVICES.map((srv) => (
              <option key={srv} value={srv}>
                {srv}
              </option>
            ))}
          </select>
        </div>

        {/* Status selector */}
        <div className="min-w-[160px]">
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition"
          >
            {STATUS_OPTIONS.map((st) => (
              <option key={st.value} value={st.value}>
                {st.label}
              </option>
            ))}
          </select>
        </div>

        {/* Reset filters button */}
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition"
            title="Reset all search filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Filter summary chip bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>
            Showing <strong className="text-slate-800">{totalResults ?? 0}</strong> enquiries
            {hasActiveFilters && ' matching current filters'}
          </span>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center gap-2">
            {searchTerm && (
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                Name: "{searchTerm}"
              </span>
            )}
            {selectedService && selectedService !== 'All Services' && (
              <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-medium">
                Service: {selectedService}
              </span>
            )}
            {selectedStatus && selectedStatus !== 'ALL' && (
              <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[11px] font-medium">
                Status: {selectedStatus}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
