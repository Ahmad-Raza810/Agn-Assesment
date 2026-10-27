import React from 'react';
import { Sparkles, PhoneCall, CalendarClock, CheckCircle, XCircle } from 'lucide-react';

const STATUS_CONFIG = {
  NEW: {
    label: 'New',
    bg: 'bg-blue-50 text-blue-700 border-blue-200/80',
    dot: 'bg-blue-500',
    icon: Sparkles,
  },
  CONTACTED: {
    label: 'Contacted',
    bg: 'bg-purple-50 text-purple-700 border-purple-200/80',
    dot: 'bg-purple-500',
    icon: PhoneCall,
  },
  FOLLOW_UP: {
    label: 'Follow-up',
    bg: 'bg-amber-50 text-amber-800 border-amber-200/80',
    dot: 'bg-amber-500',
    icon: CalendarClock,
  },
  CONVERTED: {
    label: 'Converted',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    dot: 'bg-emerald-500',
    icon: CheckCircle,
  },
  LOST: {
    label: 'Lost',
    bg: 'bg-rose-50 text-rose-700 border-rose-200/80',
    dot: 'bg-rose-500',
    icon: XCircle,
  },
};

export default function StatusBadge({ status, size = 'sm', showIcon = true }) {
  const config = STATUS_CONFIG[status] || {
    label: status || 'Unknown',
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
    icon: Sparkles,
  };

  const Icon = config.icon;
  const isXs = size === 'xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-full transition-colors ${config.bg} ${
        isXs ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs tracking-wide'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {showIcon && <Icon className="w-3 h-3" />}
      <span>{config.label}</span>
    </span>
  );
}
