import React, { useState } from 'react';
import { cmsClient } from '../api/cmsClient';
import { X, CheckCircle2, Loader2, Calendar, Send, Sparkles, Building2, Mail, User, DollarSign, Clock } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
  onSuccess?: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  defaultService,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    project_type: defaultService || 'Venture Co-Founding',
    budget_range: '$50k - $150k',
    timeline: 'Immediate (Within 30 Days)',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setErrorMessage('Please provide your name and work email.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await cmsClient.submitInquiry(formData);
      setIsSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
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
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-neutral-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center font-bold shadow-xs">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block mb-0.5 font-semibold">
                Client & Founder Consultation
              </span>
              <h3 className="font-display font-bold text-xl text-black">
                Schedule a Discovery Call
              </h3>
            </div>
          </div>

          <button
            onClick={resetAndClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {isSubmitted ? (
          <div className="p-8 sm:p-12 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto animate-in zoom-in-50 duration-300">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h4 className="text-2xl font-bold font-display text-black">
                Consultation Request Received!
              </h4>
              <p className="text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-black">{formData.name}</strong>. A Techdome Partner will review your project scope and reach out at <strong className="text-black">{formData.email}</strong> within 24 hours to coordinate our discovery session.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-left text-xs font-mono text-neutral-600 max-w-md mx-auto space-y-1">
              <div><strong className="text-black">Engagement Model:</strong> {formData.project_type}</div>
              <div><strong className="text-black">Estimated Timeline:</strong> {formData.timeline}</div>
              <div><strong className="text-black">Budget Tier:</strong> {formData.budget_range}</div>
            </div>

            <button
              onClick={resetAndClose}
              className="px-8 py-3 rounded-2xl bg-black text-white text-xs font-mono font-semibold hover:bg-neutral-800 transition-all shadow-sm"
            >
              Done / Return to Site
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 bg-[#FAFAFA]">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-mono text-red-600">
                {errorMessage}
              </div>
            )}

            {/* Row 1: Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-semibold text-neutral-700 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Your Full Name *</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-sans text-black focus:ring-2 focus:ring-black focus:outline-none bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-neutral-700 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Work Email Address *</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="sarah@company.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-sans text-black focus:ring-2 focus:ring-black focus:outline-none bg-white transition-all"
                />
              </div>
            </div>

            {/* Row 2: Company & Service */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-semibold text-neutral-700 mb-1.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Company or Startup Name</span>
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g. Acme Health / Stealth"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-sans text-black focus:ring-2 focus:ring-black focus:outline-none bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-neutral-700 mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Engagement Objective *</span>
                </label>
                <select
                  value={formData.project_type}
                  onChange={(e) => setFormData({ ...formData, project_type: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono text-black focus:ring-2 focus:ring-black focus:outline-none bg-white transition-all"
                >
                  <option value="Venture Co-Founding">Venture Co-Founding (Day 0 to Scale)</option>
                  <option value="Enterprise AI & Cloud">Enterprise AI & Cloud Foundry</option>
                  <option value="Dedicated Engineering Pod">Dedicated Engineering Pods</option>
                  <option value="Rapid 14-Day MVP">Rapid 14-Day MVP Discovery Sprint</option>
                </select>
              </div>
            </div>

            {/* Row 3: Budget & Timeline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-semibold text-neutral-700 mb-1.5 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Estimated Capital / Budget</span>
                </label>
                <select
                  value={formData.budget_range}
                  onChange={(e) => setFormData({ ...formData, budget_range: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono text-black focus:ring-2 focus:ring-black focus:outline-none bg-white transition-all"
                >
                  <option value="< $25k">&lt; $25,000 (Advisory / Sprint)</option>
                  <option value="$25k - $50k">$25,000 - $50,000 (MVP Foundry)</option>
                  <option value="$50k - $150k">$50,000 - $150,000 (Dedicated Pod / Co-Build)</option>
                  <option value="$150k+">$150,000+ (Institutional Co-Founding)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-neutral-700 mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Target Start Timeline</span>
                </label>
                <select
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono text-black focus:ring-2 focus:ring-black focus:outline-none bg-white transition-all"
                >
                  <option value="Immediate (Within 30 Days)">Immediate (Within 30 Days)</option>
                  <option value="1 - 3 Months">1 - 3 Months</option>
                  <option value="Flexible / Exploring">Flexible / Exploring Feasibility</option>
                </select>
              </div>
            </div>

            {/* Row 4: Message */}
            <div>
              <label className="block text-xs font-mono font-semibold text-neutral-700 mb-1.5">
                Project Overview & What You're Looking to Build
              </label>
              <textarea
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Briefly describe your venture concept, technical challenge, or team scaling requirements..."
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-sans text-black focus:ring-2 focus:ring-black focus:outline-none bg-white transition-all leading-relaxed"
              />
            </div>

            {/* Submit Bar */}
            <div className="pt-3 flex items-center justify-between">
              <span className="text-[11px] font-mono text-neutral-400 hidden sm:inline">
                Zero spam. Direct partner consultation.
              </span>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="px-4 py-2.5 rounded-xl border border-neutral-200 text-neutral-600 text-xs font-mono font-medium hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-mono font-semibold transition-all shadow-sm flex items-center gap-2 disabled:opacity-70 active:scale-95"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Sending Request...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Discovery Request</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
