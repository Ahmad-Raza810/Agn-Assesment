import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function PublicHero() {
  return (
    <div className="py-4 sm:py-8">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
        Connect with our engineering team for your next project.
      </h1>

      <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
        Share your project requirements, scope, and technical objectives. Our team will review your enquiry and provide a structured proposal.
      </p>

      <div className="mt-6 space-y-2.5">
        {[
          'Direct consultation with senior technical architects',
          'Detailed milestone and requirement scoping',
          'Modern, reliable, and secure implementations',
        ].map((item, index) => (
          <div key={index} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
