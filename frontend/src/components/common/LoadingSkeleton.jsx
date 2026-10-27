import React from 'react';

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="w-full divide-y divide-slate-100">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-6 py-4 animate-pulse">
          <div className="w-8 h-8 rounded-full bg-slate-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-200 rounded w-1/4" />
            <div className="h-3 bg-slate-100 rounded w-1/3" />
          </div>
          <div className="h-6 bg-slate-200 rounded-full w-24" />
          <div className="h-4 bg-slate-100 rounded w-20" />
          <div className="h-8 bg-slate-200 rounded-lg w-16" />
        </div>
      ))}
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm animate-pulse">
          <div className="flex items-center justify-between mb-3">
            <div className="h-4 bg-slate-200 rounded w-1/2" />
            <div className="w-10 h-10 rounded-xl bg-slate-200" />
          </div>
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-2" />
          <div className="h-3 bg-slate-100 rounded w-2/3" />
        </div>
      ))}
    </div>
  );
}
