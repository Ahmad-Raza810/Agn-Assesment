import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, ShieldCheck, Zap, Star, Users, LayoutDashboard } from 'lucide-react';

export default function PublicHero() {
  return (
    <div className="py-6 sm:py-12">
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-xs font-semibold text-indigo-700 mb-6">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Accepting New Client Enquiries for 2026</span>
      </div>

      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
        Grow your enterprise with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600">tailored tech solutions</span>.
      </h1>

      <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
        From high-performance web and mobile platforms to cloud automation and custom enterprise software. Submit an enquiry and our tech architects will craft the optimal roadmap.
      </p>

      {/* Feature bullets */}
      <div className="mt-8 space-y-3">
        {[
          'Direct consultation with senior engineering leaders',
          'Accurate project scoping and transparent milestone estimates',
          'Enterprise-grade security and robust modern architecture',
        ].map((item, index) => (
          <div key={index} className="flex items-center gap-3 text-sm text-slate-700 font-medium">
            <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-3.5 h-3.5" />
            </div>
            <span>{item}</span>
          </div>
        ))}
      </div>

      {/* Stats counter strip */}
      <div className="grid grid-cols-3 gap-4 pt-10 mt-10 border-t border-slate-200/80">
        <div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">99.4%</div>
          <div className="text-xs text-slate-500 font-medium mt-0.5">SLA Adherence</div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600">&lt; 24h</div>
          <div className="text-xs text-slate-500 font-medium mt-0.5">First Response</div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">350+</div>
          <div className="text-xs text-slate-500 font-medium mt-0.5">Clients Served</div>
        </div>
      </div>

      {/* Admin shortcut badge */}
      <div className="mt-8 pt-4">
        <Link
          to="/admin/leads"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-3.5 py-2 rounded-xl transition border border-slate-200"
        >
          <LayoutDashboard className="w-3.5 h-3.5 text-indigo-600" />
          <span>CRM Representative? Open Lead Management Dashboard &rarr;</span>
        </Link>
      </div>
    </div>
  );
}
