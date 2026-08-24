import React from 'react';
import { GlobalSettings } from '../types';

interface HeroProps {
  globals: GlobalSettings | null;
  loading?: boolean;
}

export const Hero: React.FC<HeroProps> = ({ globals, loading = false }) => {
  if (loading || !globals) {
    return (
      <section className="pt-20 pb-16 border-b border-neutral-200 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="h-4 w-32 bg-neutral-200 rounded mb-6"></div>
          <div className="h-16 w-3/4 bg-neutral-200 rounded mb-4"></div>
          <div className="h-6 w-1/2 bg-neutral-200 rounded mb-10"></div>
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-neutral-200">
            <div className="h-20 bg-neutral-200 rounded-2xl"></div>
            <div className="h-20 bg-neutral-200 rounded-2xl"></div>
            <div className="h-20 bg-neutral-200 rounded-2xl"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-20 pb-16 sm:pt-28 sm:pb-20 border-b border-neutral-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        {/* Eyebrow */}
        <div className="mb-6 flex items-center gap-3">
          <span className="w-2 h-2 bg-black rounded-full"></span>
          <span className="eyebrow-badge">{globals.hero_eyebrow}</span>
        </div>

        {/* Primary Editorial Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-black leading-[1.02] max-w-6xl mb-8 font-display">
          {globals.hero_headline}
        </h1>

        {/* Narrative Subhead */}
        <p className="text-lg sm:text-2xl text-neutral-600 font-light leading-relaxed max-w-4xl mb-14">
          {globals.hero_subline}
        </p>

        {/* Studio Metrics Row (CMS-Driven) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-neutral-100">
          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200/80 shadow-2xs">
            <span className="text-4xl sm:text-5xl font-bold font-display text-black tracking-tight">
              {globals.stats_metric_1_val}
            </span>
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest mt-2 block font-medium">
              {globals.stats_metric_1_label}
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200/80 shadow-2xs">
            <span className="text-4xl sm:text-5xl font-bold font-display text-black tracking-tight">
              {globals.stats_metric_2_val}
            </span>
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest mt-2 block font-medium">
              {globals.stats_metric_2_label}
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200/80 shadow-2xs">
            <span className="text-4xl sm:text-5xl font-bold font-display text-black tracking-tight">
              {globals.stats_metric_3_val}
            </span>
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest mt-2 block font-medium">
              {globals.stats_metric_3_label}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
