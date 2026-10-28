import React from 'react';
import {
  Inbox,
  Clock,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  XCircle,
  TrendingUp,
} from 'lucide-react';

export default function DashboardStats({
  summary,
  selectedStatus,
  onSelectStatus,
  isLoading,
}) {
  if (isLoading || !summary) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-2xl border border-slate-200 animate-pulse h-32"
          >
            <div className="h-4 bg-slate-200 rounded w-1/3 mb-3"></div>
            <div className="h-8 bg-slate-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-slate-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const {
    totalEnquiries = 0,
    newLeads = 0,
    contactedLeads = 0,
    followUpLeads = 0,
    convertedLeads = 0,
    lostLeads = 0,
  } = summary;

  const conversionRate = totalEnquiries > 0 ? ((convertedLeads / totalEnquiries) * 100).toFixed(1) : 0;

  const mainCards = [
    {
      id: 'ALL',
      title: 'Total Enquiries',
      value: totalEnquiries,
      subtext: 'All visitor enquiries received',
      icon: Inbox,
      iconBg: 'bg-slate-100 text-slate-800',
      activeBorder: selectedStatus === 'ALL' ? 'border-slate-800 ring-2 ring-slate-200' : 'border-slate-200',
    },
    {
      id: 'NEW',
      title: 'New Leads',
      value: newLeads,
      subtext: 'Pending initial contact',
      icon: Sparkles,
      iconBg: 'bg-blue-50 text-blue-700',
      activeBorder: selectedStatus === 'NEW' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200',
    },
    {
      id: 'FOLLOW_UP',
      title: 'In Follow-up',
      value: followUpLeads,
      subtext: 'Active pipeline discussions',
      icon: Clock,
      iconBg: 'bg-amber-50 text-amber-700',
      activeBorder: selectedStatus === 'FOLLOW_UP' ? 'border-amber-500 ring-2 ring-amber-100' : 'border-slate-200',
    },
    {
      id: 'CONVERTED',
      title: 'Converted Leads',
      value: convertedLeads,
      subtext: `${conversionRate}% conversion rate`,
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50 text-emerald-600',
      activeBorder: selectedStatus === 'CONVERTED' ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-200',
      trend: `${conversionRate}%`,
    },
  ];

  const secondaryPills = [
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
      id: 'FOLLOW_UP',
      label: 'In Follow-up',
      count: followUpLeads,
      color: 'text-amber-800 bg-amber-50 hover:bg-amber-100 border-amber-300',
      icon: Clock,
    },
    {
      id: 'CONVERTED',
      label: 'Converted',
      count: convertedLeads,
      color: 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200',
      icon: CheckCircle2,
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
    <div className="mb-6">
      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {mainCards.map((card) => {
          const Icon = card.icon;
          const isSelected = selectedStatus === card.id;

          return (
            <div
              key={card.id}
              onClick={() => onSelectStatus(card.id)}
              className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer shadow-xs hover:shadow-sm ${
                card.activeBorder
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.iconBg}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {card.value}
                </span>
                {card.trend && (
                  <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                    <TrendingUp className="w-3 h-3 mr-0.5" />
                    {card.trend}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-500 mt-1 truncate">{card.subtext}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 pl-1">
          Quick Status Filter:
        </span>

        <button
          onClick={() => onSelectStatus('ALL')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
            selectedStatus === 'ALL'
              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span>All Statuses</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              selectedStatus === 'ALL' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {totalEnquiries}
          </span>
        </button>

        {secondaryPills.map((pill) => {
          const PillIcon = pill.icon;
          const isSelected = selectedStatus === pill.id;

          return (
            <button
              key={pill.id}
              onClick={() => onSelectStatus(pill.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                pill.color
              } ${isSelected ? 'ring-2 ring-slate-700 font-bold' : ''}`}
            >
              <PillIcon className="w-3.5 h-3.5" />
              <span>{pill.label}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-white/80 text-slate-700 text-[10px] font-bold">
                {pill.count}
              </span>
            </button>
          );
        })}

        {selectedStatus !== 'ALL' && (
          <button
            onClick={() => onSelectStatus('ALL')}
            className="ml-auto text-xs font-medium text-slate-500 hover:text-slate-900 underline"
          >
            Clear status filter
          </button>
        )}
      </div>
    </div>
  );
}
