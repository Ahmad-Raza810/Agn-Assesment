import React from 'react';
import { Layers, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <span className="font-bold text-slate-800 text-sm">LeadFlow Solutions</span>
          <span className="text-slate-400 text-xs">| Website Enquiry & Lead Management System</span>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            JWT Secured
          </span>
          <span>Spring Boot + React.js</span>
          <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
