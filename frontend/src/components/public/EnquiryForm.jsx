import React, { useState } from 'react';
import { leadService } from '../../services/leadService';
import { useToast } from '../../context/ToastContext';
import { Send, CheckCircle2, ArrowRight, Building, Mail, Phone, MessageSquare, Briefcase } from 'lucide-react';

const SERVICES = [
  'Web Development',
  'Mobile App Development',
  'UI/UX Design',
  'Cloud Architecture & DevOps',
  'E-commerce Solution',
  'Enterprise AI Integration',
  'Custom Software Development',
  'Other',
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
    } else if (formData.message.trim().length < 20) {
      newErrors.message = 'Message must be at least 20 characters';
    } else if (formData.message.length > 2000) {
      newErrors.message = 'Message must be 2000 characters or fewer';
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
      const enquiryResult = response.data || response;
      setSubmittedLead(enquiryResult);
      success('Enquiry submitted successfully.');
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
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center mx-auto mb-3 border border-slate-200">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Thank you!</h3>
        <p className="text-slate-600 text-sm mt-1">
          Your enquiry has been submitted successfully.
        </p>
        <button
          onClick={handleReset}
          className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition"
        >
          <span>Submit Another Enquiry</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Submit Enquiry
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Tell us about your requirements and we will connect with you shortly.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
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
              className={`w-full pl-10 pr-4 py-2 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                errors.name
                  ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/20'
                  : 'border-slate-200 focus:border-slate-500 focus:ring-slate-100 bg-slate-50/40 focus:bg-white'
              }`}
            />
          </div>
          {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
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
                className={`w-full pl-10 pr-4 py-2 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                  errors.email
                    ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-slate-200 focus:border-slate-500 focus:ring-slate-100 bg-slate-50/40 focus:bg-white'
                }`}
              />
            </div>
            {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
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
                className={`w-full pl-10 pr-4 py-2 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                  errors.phone
                    ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-slate-200 focus:border-slate-500 focus:ring-slate-100 bg-slate-50/40 focus:bg-white'
                }`}
              />
            </div>
            {errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
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
              className={`w-full pl-10 pr-4 py-2 rounded-xl border text-sm transition focus:outline-none focus:ring-2 appearance-none bg-white ${
                errors.serviceOfInterest
                  ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/20'
                  : 'border-slate-200 focus:border-slate-500 focus:ring-slate-100 bg-slate-50/40 focus:bg-white'
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

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
            Enquiry Details & Requirements <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3.5 pointer-events-none text-slate-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <textarea
              name="message"
              rows={4}
              maxLength={2000}
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us about your project goals, timelines, or specific requirements..."
              className={`w-full pl-10 pr-4 py-2 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                errors.message
                  ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/20'
                  : 'border-slate-200 focus:border-slate-500 focus:ring-slate-100 bg-slate-50/40 focus:bg-white'
              }`}
            />
          </div>
          <div className="flex items-center justify-between mt-1">
            <div>
              {errors.message && (
                <p className="text-xs text-rose-600 flex items-center gap-1">{errors.message}</p>
              )}
              {!errors.message && formData.message.length < 20 && formData.message.length > 0 && (
                <p className="text-xs text-amber-600">
                  {20 - formData.message.length} more characters needed
                </p>
              )}
            </div>
            <span
              className={`text-[11px] font-medium tabular-nums flex-shrink-0 ml-2 ${
                formData.message.length > 1900
                  ? 'text-rose-500'
                  : formData.message.length > 1600
                  ? 'text-amber-500'
                  : 'text-slate-400'
              }`}
            >
              {formData.message.length} / 2000
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-6 rounded-xl font-medium text-white bg-slate-900 hover:bg-slate-800 focus:ring-4 focus:ring-slate-200 transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer text-sm"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit Enquiry</span>
            </>
          )}
        </button>

        <p className="text-[11px] text-center text-slate-400">
          Your information is securely handled and will not be shared.
        </p>
      </form>
    </div>
  );
}
