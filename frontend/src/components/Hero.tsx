import React from 'react';
import { GlobalSettings } from '../types';
import { ArrowRight, Calendar, Sparkles, Building2, Code2, TrendingUp, Zap } from 'lucide-react';

interface HeroProps {
  globals: GlobalSettings | null;
  loading: boolean;
}

export const Hero: React.FC<HeroProps> = ({ globals }) => {
  return (
    <section className="relative pt-6 sm:pt-12 pb-10 sm:pb-14 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full">
      {/* Top Tagline / Eyebrow */}
      <div className="flex items-center gap-2 mb-5">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-800 text-[11px] font-mono font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-black" />
          <span>{globals?.hero_eyebrow || 'VENTURE STUDIO · PRODUCT ENGINEERING FOUNDRY'}</span>
        </span>
      </div>

      {/* Main Display Headline */}
      <div className="max-w-4xl space-y-5">
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-display text-black tracking-tight leading-[1.2]">
          {globals?.hero_headline || 'We Co-Found & Engineer High-Conviction Software Ventures.'}
        </h1>

        <p className="text-sm sm:text-base text-neutral-600 font-normal leading-relaxed max-w-2xl">
          {globals?.hero_subline || 'Techdome acts as your institutional technical co-founder — deploying capital, modern AI architecture, and dedicated engineering pods to launch generation-defining software companies from Day 0.'}
        </p>

        {/* Action CTAs: Direct Page Navigation */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-mono font-semibold transition-all shadow-sm hover:scale-[1.01] active:scale-[0.98]"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Schedule Discovery Call</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>

          <a
            href="#services"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-neutral-100 border border-neutral-200 text-black text-xs font-mono font-medium transition-all shadow-2xs"
          >
            <span>Explore Practice Areas</span>
          </a>

          <a
            href="#portfolio"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-neutral-100 border border-neutral-200 text-black text-xs font-mono font-medium transition-all shadow-2xs"
          >
            <span>View Portfolio</span>
          </a>
        </div>
      </div>

      {/* 4 Realistic Studio Impact Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-10 sm:mt-12 pt-8 border-t border-neutral-200">
        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center gap-1.5 mb-1.5 text-neutral-400">
            <Building2 className="w-3.5 h-3.5 text-black" />
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Global Reach</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-display text-black mb-0.5">
            {globals?.stats_clients_val || '40+'}
          </div>
          <div className="text-[11px] text-neutral-500 font-medium truncate">
            {globals?.stats_clients_label || 'Global Enterprise Clients'}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center gap-1.5 mb-1.5 text-neutral-400">
            <Code2 className="w-3.5 h-3.5 text-black" />
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Track Record</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-display text-black mb-0.5">
            {globals?.stats_delivered_val || '150+'}
          </div>
          <div className="text-[11px] text-neutral-500 font-medium truncate">
            {globals?.stats_delivered_label || 'Software & AI Shipped'}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center gap-1.5 mb-1.5 text-neutral-400">
            <TrendingUp className="w-3.5 h-3.5 text-black" />
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Capital Secured</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-display text-black mb-0.5">
            {globals?.stats_capital_val || '$45M+'}
          </div>
          <div className="text-[11px] text-neutral-500 font-medium truncate">
            {globals?.stats_capital_label || 'Follow-on Capital Raised'}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center gap-1.5 mb-1.5 text-neutral-400">
            <Zap className="w-3.5 h-3.5 text-black" />
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Foundry Speed</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-display text-black mb-0.5">
            {globals?.stats_speed_val || '14 Days'}
          </div>
          <div className="text-[11px] text-neutral-500 font-medium truncate">
            {globals?.stats_speed_label || 'Rapid Prototype Sprint'}
          </div>
        </div>
      </div>
    </section>
  );
};
