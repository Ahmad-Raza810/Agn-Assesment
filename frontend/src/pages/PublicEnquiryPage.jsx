import React from 'react';
import PublicHero from '../components/public/PublicHero';
import EnquiryForm from '../components/public/EnquiryForm';
import {
  Code2,
  Smartphone,
  Palette,
  Cloud,
  ShoppingBag,
  Cpu,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

const SERVICES_GRID = [
  {
    icon: Code2,
    title: 'Web Application Development',
    desc: 'Scalable, modern enterprise web apps built with Spring Boot, React, and cloud architectures.',
  },
  {
    icon: Smartphone,
    title: 'Mobile App Engineering',
    desc: 'High-performance native and cross-platform iOS & Android mobile applications.',
  },
  {
    icon: Palette,
    title: 'UI/UX & Product Design',
    desc: 'Human-centered interfaces, accessible design systems, and seamless conversion funnels.',
  },
  {
    icon: Cloud,
    title: 'Cloud & DevOps Automation',
    desc: 'Robust CI/CD pipelines, containerization, microservices, and Kubernetes orchestration.',
  },
  {
    icon: ShoppingBag,
    title: 'E-commerce Solutions',
    desc: 'Custom headless storefronts, secure checkout flows, and inventory integration.',
  },
  {
    icon: Cpu,
    title: 'Enterprise AI & Automation',
    desc: 'LLM agents, intelligent workflow automation, and custom predictive machine learning.',
  },
];

export default function PublicEnquiryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero & Public Form Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Hero */}
          <div className="lg:col-span-6 lg:sticky lg:top-24">
            <PublicHero />
          </div>

          {/* Right Column: Enquiry Form Card */}
          <div className="lg:col-span-6">
            <EnquiryForm />
          </div>
        </div>
      </section>

      {/* Services Showcase */}
      <section className="border-t border-slate-200/80 bg-slate-50/50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Core Capabilities
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Comprehensive Technology Services
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Select any service above when submitting your enquiry to get a dedicated specialist assigned to your project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES_GRID.map((service, idx) => {
              const Icon = service.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {service.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
