import React from 'react';
import { Calendar, ArrowRight, Sparkles, Shield } from 'lucide-react';

interface ClientCtaSectionProps {
  onOpenBooking: () => void;
}

export const ClientCtaSection: React.FC<ClientCtaSectionProps> = ({ onOpenBooking }) => {
  return (
    <section className="my-20 sm:my-28 relative rounded-3xl bg-black text-white p-8 sm:p-14 overflow-hidden border border-black shadow-2xl">
      {/* Background Architectural Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-neutral-800 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="relative z-10 max-w-3xl space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800 text-neutral-300 text-[11px] font-mono font-semibold uppercase tracking-widest border border-neutral-700">
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span>Co-Found & Build With Us</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-bold font-display text-white tracking-tight leading-tight">
          Have an Ambitious Software Venture in Mind?
        </h2>

        <p className="text-sm sm:text-base text-neutral-400 font-normal leading-relaxed max-w-2xl">
          Whether you're looking for an institutional technical co-founder to co-build from Day 0 or need a senior engineering pod to ship a mission-critical AI system, let's schedule a discovery call.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <button
            onClick={onOpenBooking}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white hover:bg-neutral-100 text-black text-xs font-mono font-bold transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          >
            <Calendar className="w-4 h-4" />
            <span>Schedule Discovery Call</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-mono text-neutral-400">
            <Shield className="w-4 h-4 text-neutral-500" />
            <span>Guaranteed 24-Hour Partner Response</span>
          </div>
        </div>
      </div>
    </section>
  );
};
