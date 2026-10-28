import React from 'react';
import {
  Inbox,
  Clock,
  CheckCircle2,
  Sparkles,
  PhoneCall,
  CalendarClock,
  XCircle,
  TrendingUp,
  AlertCircle,
  Bell,
  AlertTriangle,
} from 'lucide-react';

export default function DashboardStats({ summary, selectedStatus, onSelectStatus, isLoading }) {
  if (isLoading || !summary) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-1/2 mb-3" />
            <div className="h-7 bg-slate-200 rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  const {
    totalEnquiries = 0,
    pendingFollowUps = 0,
    convertedLeads = 0,
    newLeads = 0,
    contactedLeads = 0,
    followUpLeads = 0,
    lostLeads = 0,
    overdueFollowUps = 0,
    dueTodayFollowUps = 0,
    unscheduledFollowUps = 0,
  } = summary;

  const conversionRate = totalEnquiries > 0 ? ((convertedLeads / totalEnquiries) * 100).toFixed(1) : 0;

  const mainCards = [
    {
      id: 'ALL',
      title: 'Total Enquiries',
      value: totalEnquiries,
      subtext: 'All website enquiries received',
      icon: Inbox,
      iconBg: 'bg-indigo-50 text-indigo-600',
      borderHover: 'hover:border-indigo-300',
      activeBorder: selectedStatus === 'ALL' ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-slate-200',
    },
    {
      id: 'DUE_TODAY',
      title: 'Due Today',
      value: dueTodayFollowUps,
      subtext: 'Follow-ups scheduled today',
      icon: Bell,
      iconBg: 'bg-amber-100 text-amber-700',
      borderHover: 'hover:border-amber-300',
      activeBorder: selectedStatus === 'DUE_TODAY' ? 'border-amber-500 ring-2 ring-amber-100' : 'border-slate-200',
      badge: dueTodayFollowUps > 0 ? 'Action Today' : null,
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'OVERDUE',
      title: 'Overdue Follow-ups',
      value: overdueFollowUps,
      subtext: 'Past follow-up date',
      icon: AlertCircle,
      iconBg: overdueFollowUps > 0 ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500',
      borderHover: 'hover:border-rose-300',
      activeBorder: selectedStatus === 'OVERDUE' ? 'border-rose-500 ring-2 ring-rose-100' : 'border-slate-200',
      badge: overdueFollowUps > 0 ? `${overdueFollowUps} Overdue` : null,
      badgeColor: 'bg-rose-100 text-rose-700',
    },
    {
      id: 'CONVERTED',
      title: 'Converted Leads',
      value: convertedLeads,
      subtext: `${conversionRate}% conversion rate (reminders closed)`,
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50 text-emerald-600',
      borderHover: 'hover:border-emerald-300',
      activeBorder: selectedStatus === 'CONVERTED' ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-200',
      trend: `${conversionRate}%`,
    },
  ];

  const secondaryPills = [
    {
      id: 'PENDING_FOLLOWUP',
      label: 'All Active Follow-ups',
      count: pendingFollowUps,
      color: 'text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border-indigo-200',
      icon: Clock,
    },
    {
      id: 'UNSCHEDULED',
      label: 'Unscheduled',
      count: unscheduledFollowUps,
      color: 'text-amber-900 bg-amber-50 hover:bg-amber-100 border-amber-300',
      icon: AlertTriangle,
    },
    {
      id: 'NEW',
      label: 'New Leads',
      count: newLeads,
      color: 'text-blue-700 bg-blue-50 hover:bg-blue-100 border-blue-200',
      icon: Sparkles,
    },
    {
      id: 'CONTACTED',
      label: 'Contacted',
      count: contactedLeads,
      color: 'text-purple-700 bg-purple-50 hover:bg-purple-100 border-purple-200',
      icon: PhoneCall,
    },
    {
      id: 'LOST',
      label: 'Lost / Closed',
      count: lostLeads,
      color: 'text-slate-700 bg-slate-100 hover:bg-slate-200 border-slate-200',
      icon: XCircle,
    },
  ];

  return (
    <div className="mb-8">
      {/* 4 Primary KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mainCards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.id}
              onClick={() => onSelectStatus(card.id)}
              className={`text-left bg-white p-5 rounded-2xl border transition-all shadow-xs cursor-pointer group ${card.activeBorder} ${card.borderHover}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition group-hover:scale-105 ${card.iconBg}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {card.value}
                </span>
                {card.badge && (
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${card.badgeColor}`}>
                    {card.badge}
                  </span>
                )}
                {card.trend && (
                  <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <TrendingUp className="w-3 h-3" />
                    {card.trend}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-400 mt-2 truncate">{card.subtext}</p>
            </button>
          );
        })}
      </div>

      {/* Secondary Quick-Filter Follow-up Funnel Bar */}
      <div className="flex flex-wrap items-center gap-2 mt-4 pt-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">
          Quick Filters:
        </span>
        {secondaryPills.map((pill) => {
          const Icon = pill.icon;
          return (
            <button
              key={pill.id}
              onClick={() => onSelectStatus(pill.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${pill.color} ${
                selectedStatus === pill.id ? 'ring-2 ring-indigo-500 font-bold shadow-xs' : ''
              }`}
            >
              {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
              <span>{pill.label}</span>
              <span className="px-1.5 py-0.2 bg-white/70 rounded-md text-[11px] font-mono">
                {pill.count}
              </span>
            </button>
          );
        })}

        {selectedStatus !== 'ALL' && (
          <button
            onClick={() => onSelectStatus('ALL')}
            className="ml-auto text-xs font-medium text-slate-500 hover:text-indigo-600 underline"
          >
            Clear filter ({selectedStatus})
          </button>
        )}
      </div>
    </div>
  );
}
