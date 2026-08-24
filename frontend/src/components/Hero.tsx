import React from 'react';
import { GlobalSettings } from '../types';
import { ArrowRight, Calendar, Sparkles, Building2, Code2, TrendingUp, Zap } from 'lucide-react';

interface HeroProps {
  globals: GlobalSettings | null;
  loading: boolean;
  onOpenBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ globals, loading, onOpenBooking }) => {
  return (
    <section className="relative pt-8 sm:pt-14 pb-12 sm:pb-16 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full">
      {/* Top Tagline / Eyebrow */}
      <div className="flex items-center gap-2 mb-6">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-black text-[11px] font-mono font-semibold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{globals?.hero_eyebrow || 'VENTURE STUDIO · PRODUCT ENGINEERING FOUNDRY'}</span>
        </span>
      </div>

      {/* Main Display Headline */}
      <div className="max-w-5xl space-y-6">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-display text-black tracking-tight leading-[1.15]">
          {globals?.hero_headline || 'We Co-Found & Engineer High-Conviction Software Ventures.'}
        </h1>

        <p className="text-sm sm:text-lg text-neutral-600 font-normal leading-relaxed max-w-3xl">
          {globals?.hero_subline || 'Techdome acts as your institutional technical co-founder — deploying capital, modern AI architecture, and dedicated engineering pods to launch generation-defining software companies from Day 0.'}
        </p>

        {/* Action CTAs: Dual Conversion Funnel */}
        <div className="pt-3 flex flex-wrap items-center gap-3 sm:gap-4">
          <button
            onClick={onOpenBooking}
            className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 rounded-2xl bg-black hover:bg-neutral-800 text-white text-xs font-mono font-bold transition-all shadow-md hover:scale-[1.02] active:scale-[0.98]"
          >
            <Calendar className="w-4 h-4" />
            <span>Schedule Discovery Call</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="#services"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-neutral-100 border border-neutral-200 text-black text-xs font-mono font-semibold transition-all shadow-2xs"
          >
            <span>Explore Services</span>
          </a>

          <a
            href="#portfolio"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-neutral-100 border border-neutral-200 text-black text-xs font-mono font-semibold transition-all shadow-2xs"
          >
            <span>View Portfolio</span>
          </a>
        </div>
      </div>

      {/* 4 Realistic Studio Impact Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-12 sm:mt-16 pt-8 border-t border-neutral-200">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center gap-2 mb-2 text-neutral-400">
            <Building2 className="w-4 h-4 text-black" />
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Global Reach</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-display text-black mb-0.5">
            {globals?.stats_clients_val || '40+'}
          </div>
          <div className="text-xs text-neutral-500 font-medium">
            {globals?.stats_clients_label || 'Global Enterprise Clients'}
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center gap-2 mb-2 text-neutral-400">
            <Code2 className="w-4 h-4 text-black" />
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Delivery Track Record</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-display text-black mb-0.5">
            {globals?.stats_delivered_val || '150+'}
          </div>
          <div className="text-xs text-neutral-500 font-medium">
            {globals?.stats_delivered_label || 'Software & AI Systems Shipped'}
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center gap-2 mb-2 text-neutral-400">
            <TrendingUp className="w-4 h-4 text-black" />
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Capital Acceleration</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-display text-black mb-0.5">
            {globals?.stats_capital_val || '$45M+'}
          </div>
          <div className="text-xs text-neutral-500 font-medium">
            {globals?.stats_capital_label || 'Follow-on Capital Raised'}
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center gap-2 mb-2 text-neutral-400">
            <Zap className="w-4 h-4 text-black" />
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Velocity Foundry</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-display text-black mb-0.5">
            {globals?.stats_speed_val || '14 Days'}
          </div>
          <div className="text-xs text-neutral-500 font-medium">
            {globals?.stats_speed_label || 'Rapid MVP Prototype Sprint'}
          </div>
        </div>
      </div>
    </section>
  );
};
