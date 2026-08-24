import React, { useState } from 'react';
import { cmsClient } from '../api/cmsClient';
import { CheckCircle2, Loader2, Send, Calendar, ShieldCheck, Clock, Lock } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    project_type: 'Venture Co-Founding',
    budget_range: '$50k - $150k',
    timeline: 'Immediate (Within 30 Days)',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setErrorMessage('Please provide your full name and work email address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await cmsClient.submitInquiry(formData);
      setIsSubmitted(true);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="my-16 sm:my-28 scroll-mt-20 max-w-4xl mx-auto w-full">
      {/* Section Header: Clean, Simple, Focused */}
      <div className="text-center mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs font-mono font-semibold uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5 text-black" />
          <span>Direct Partner Consultation</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold font-display text-black tracking-tight">
          Schedule a Discovery Call
        </h2>

        <p className="text-sm sm:text-base text-neutral-600 font-normal max-w-xl mx-auto leading-relaxed">
          Tell us about your venture concept, software roadmap, or team scaling goals. A Techdome partner will review and connect within 24 hours.
        </p>
      </div>

      {/* Main Open Form */}
      {isSubmitted ? (
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-neutral-200 text-center space-y-5 shadow-xs animate-in fade-in duration-300">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold font-display text-black">
            Discovery Request Received!
          </h3>
          <p className="text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
            Thank you, <strong className="text-black">{formData.name}</strong>. We have received your project details for <strong className="text-black">{formData.project_type}</strong>. A partner will reach out at <strong className="text-black">{formData.email}</strong> within 24 hours to schedule our discovery session.
          </p>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                name: '',
                email: '',
                company: '',
                project_type: 'Venture Co-Founding',
                budget_range: '$50k - $150k',
                timeline: 'Immediate (Within 30 Days)',
                message: '',
              });
            }}
            className="px-6 py-2.5 rounded-xl bg-black text-white text-xs font-mono font-semibold hover:bg-neutral-800 transition-colors"
          >
            Submit Another Request
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-10 lg:p-12 shadow-xs space-y-6">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-mono text-red-600">
              {errorMessage}
            </div>
          )}

          {/* Row 1: Name & Work Email (Spacious & Comfortable) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-mono font-semibold text-neutral-700 mb-2">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Sarah Jenkins"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm font-sans text-black focus:ring-2 focus:ring-black focus:border-black focus:outline-none bg-neutral-50/50 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-neutral-700 mb-2">
                Work Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="sarah@company.com"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm font-sans text-black focus:ring-2 focus:ring-black focus:border-black focus:outline-none bg-neutral-50/50 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Row 2: Company, Practice Area & Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-mono font-semibold text-neutral-700 mb-2">
                Company / Startup Name
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. Acme Health / Stealth"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm font-sans text-black focus:ring-2 focus:ring-black focus:border-black focus:outline-none bg-neutral-50/50 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-neutral-700 mb-2">
                Engagement Model *
              </label>
              <select
                value={formData.project_type}
                onChange={(e) => setFormData({ ...formData, project_type: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-xs font-mono text-black bg-white focus:ring-2 focus:ring-black focus:border-black focus:outline-none transition-all font-medium"
              >
                <option value="Venture Co-Founding">Venture Co-Founding (Day 0 to Scale)</option>
                <option value="Enterprise AI & Cloud">Enterprise AI & Cloud Foundry</option>
                <option value="Dedicated Engineering Pod">Dedicated Engineering Pods</option>
                <option value="Rapid 14-Day MVP">Rapid 14-Day MVP Sprint</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-neutral-700 mb-2">
                Estimated Budget Tier
              </label>
              <select
                value={formData.budget_range}
                onChange={(e) => setFormData({ ...formData, budget_range: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-xs font-mono text-black bg-white focus:ring-2 focus:ring-black focus:border-black focus:outline-none transition-all font-medium"
              >
                <option value="< $25k">&lt; $25,000 (Sprint / Advisory)</option>
                <option value="$25k - $50k">$25,000 - $50,000 (MVP Foundry)</option>
                <option value="$50k - $150k">$50,000 - $150,000 (Dedicated Pod)</option>
                <option value="$150k+">$150,000+ (Institutional Co-Founding)</option>
              </select>
            </div>
          </div>

          {/* Row 3: Target Timeline */}
          <div>
            <label className="block text-xs font-mono font-semibold text-neutral-700 mb-2">
              Target Start Timeline
            </label>
            <select
              value={formData.timeline}
              onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-xs font-mono text-black bg-white focus:ring-2 focus:ring-black focus:border-black focus:outline-none transition-all font-medium"
            >
              <option value="Immediate (Within 30 Days)">Immediate (Within 30 Days)</option>
              <option value="1 - 3 Months">1 - 3 Months</option>
              <option value="Flexible / Exploring Feasibility">Flexible / Exploring Feasibility</option>
            </select>
          </div>

          {/* Row 4: Project Scope & Goals */}
          <div>
            <label className="block text-xs font-mono font-semibold text-neutral-700 mb-2">
              Project Overview & What You Are Looking to Build
            </label>
            <textarea
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Briefly describe your venture concept, technical challenge, architecture requirements, or team scaling goals..."
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm font-sans text-black focus:ring-2 focus:ring-black focus:border-black focus:outline-none bg-neutral-50/50 focus:bg-white transition-all leading-relaxed"
            />
          </div>

          {/* Action Button & Trust Indicators */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-100">
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-500">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-black" />
                <span>NDA Protected</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-black" />
                <span>24h Response</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-black" />
                <span>Technical Partner Review</span>
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-mono font-bold transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Submitting Request...</span>
                </>
              ) : (
                <>
                  <span>Submit Discovery Request</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </section>
  );
};
