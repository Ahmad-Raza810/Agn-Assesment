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
} from 'lucide-react';

const SERVICES_GRID = [
  {
    icon: Code2,
    title: 'Web Application Development',
    desc: 'Scalable, modern web apps built with Spring Boot, React, and cloud architectures.',
  },
  {
    icon: Smartphone,
    title: 'Mobile App Engineering',
    desc: 'High-performance native and cross-platform mobile applications.',
  },
  {
    icon: Palette,
    title: 'UI/UX & Product Design',
    desc: 'Human-centered interfaces, clear design systems, and seamless user experiences.',
  },
  {
    icon: Cloud,
    title: 'Cloud & DevOps Automation',
    desc: 'Robust CI/CD pipelines, containerization, microservices, and orchestration.',
  },
  {
    icon: ShoppingBag,
    title: 'E-commerce Solutions',
    desc: 'Custom storefronts, secure checkout flows, and payment integrations.',
  },
  {
    icon: Cpu,
    title: 'Enterprise AI & Automation',
    desc: 'Workflow automation, API integrations, and customized intelligent tools.',
  },
];

export default function PublicEnquiryPage() {
  return (
    <div className="min-h-screen bg-slate-50/50">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-6 lg:sticky lg:top-24">
            <PublicHero />
          </div>

          <div className="lg:col-span-6">
            <EnquiryForm />
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Technology Capabilities
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
              Available services you can select when submitting your enquiry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES_GRID.map((service, idx) => {
              const Icon = service.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-50/70 p-5 rounded-xl border border-slate-200 transition-colors hover:bg-slate-50"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-200/80 text-slate-700 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
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
