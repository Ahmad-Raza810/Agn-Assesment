import React, { useState } from 'react';
import { leadService } from '../../services/leadService';
import { useToast } from '../../context/ToastContext';
import { Send, CheckCircle2, AlertCircle, ArrowRight, Sparkles, Building, Mail, Phone, MessageSquare, Briefcase } from 'lucide-react';

const SERVICES = [
  'Web Development',
  'Mobile App Development',
  'UI/UX Design',
  'Cloud Architecture & DevOps',
  'E-commerce Solution',
  'Enterprise AI Integration',
  'Custom Software Development',
];

export default function EnquiryForm() {
  const { success, error: toastError } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceOfInterest: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLead, setSubmittedLead] = useState(null);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Name must be 100 characters or fewer';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email address';
    } else if (formData.email.length > 150) {
      newErrors.email = 'Email must be 150 characters or fewer';
    }

    if (formData.phone && formData.phone.length > 20) {
      newErrors.phone = 'Phone number must be 20 characters or fewer';
    }

    if (!formData.serviceOfInterest) {
      newErrors.serviceOfInterest = 'Please select a service of interest';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please provide brief details about your enquiry';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await leadService.submitEnquiry(formData);
      // The backend returns { message: "enquiry submitted successfully.", data: { ... }, status: 201 }
      const enquiryResult = response.data || response;
      setSubmittedLead(enquiryResult);
      success('Thank you! Your enquiry has been submitted. Our team will contact you shortly.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        serviceOfInterest: '',
        message: '',
      });
      setErrors({});
    } catch (err) {
      console.error('Enquiry submission error:', err);
      const serverMsg =
        err.response?.data?.message ||
        err.response?.data?.errors?.email ||
        'Failed to submit enquiry. Please try again.';
      toastError(serverMsg);
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedLead(null);
  };

  if (submittedLead) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 text-center animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-inner">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
          Enquiry Received
        </span>
        <h3 className="text-2xl font-bold text-slate-900 mt-3">We have received your request!</h3>
        <p className="text-slate-600 text-sm mt-2 max-w-md mx-auto">
          Thank you, <span className="font-semibold text-slate-900">{submittedLead.name}</span>. Our specialist will review your requirement for{' '}
          <span className="font-semibold text-indigo-600">{submittedLead.serviceOfInterest}</span> and get back to you at{' '}
          <span className="font-medium text-slate-800">{submittedLead.email}</span>.
        </p>

        <div className="bg-slate-50 rounded-2xl p-4 my-6 max-w-sm mx-auto text-left border border-slate-100 text-xs text-slate-600 space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-400">Reference ID:</span>
            <span className="font-mono font-semibold text-slate-800">#{submittedLead.id || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Status:</span>
            <span className="font-semibold text-blue-600">New / Pending Review</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Expected Response:</span>
            <span className="font-medium text-slate-700">Within 24 business hours</span>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 transition"
        >
          <span>Submit Another Enquiry</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Get in Touch</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Request a Proposal
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Tell us about your project requirements and our team will get back to you within 24 hours.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Building className="w-4 h-4" />
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. John Smith"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                errors.name
                  ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/20'
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100 bg-slate-50/40 focus:bg-white'
              }`}
            />
          </div>
          {errors.name && <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">{errors.name}</p>}
        </div>

        {/* Contact Info (Grid: Email & Phone) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@company.com"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                  errors.email
                    ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100 bg-slate-50/40 focus:bg-white'
                }`}
              />
            </div>
            {errors.email && <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Phone Number <span className="text-slate-400 font-normal lowercase">(optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                  errors.phone
                    ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100 bg-slate-50/40 focus:bg-white'
                }`}
              />
            </div>
            {errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>}
          </div>
        </div>

        {/* Service of Interest */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Service of Interest <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Briefcase className="w-4 h-4" />
            </div>
            <select
              name="serviceOfInterest"
              value={formData.serviceOfInterest}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 appearance-none bg-white ${
                errors.serviceOfInterest
                  ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/20'
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100 bg-slate-50/40 focus:bg-white'
              }`}
            >
              <option value="">-- Select a Service --</option>
              {SERVICES.map((srv) => (
                <option key={srv} value={srv}>
                  {srv}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {errors.serviceOfInterest && (
            <p className="text-xs text-rose-600 mt-1">{errors.serviceOfInterest}</p>
          )}
        </div>

        {/* Message */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Enquiry Details & Requirements <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3.5 pointer-events-none text-slate-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <textarea
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us about your project goals, timelines, budget, or specific deliverables..."
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                errors.message
                  ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/20'
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100 bg-slate-50/40 focus:bg-white'
              }`}
            />
          </div>
          {errors.message && <p className="text-xs text-rose-600 mt-1">{errors.message}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-100 transition shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>Submitting Your Enquiry...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit Enquiry</span>
            </>
          )}
        </button>

        <p className="text-[11px] text-center text-slate-400">
          We respect your privacy. Your information is securely handled and will never be shared.
        </p>
      </form>
    </div>
  );
}
