import React from 'react';
import { Venture } from '../types';
import { StageBadge } from './StageBadge';
import { VentureVisual } from './VentureVisual';
import { ArrowUpRight } from 'lucide-react';

interface VentureCardProps {
  venture: Venture;
  onSelect: (slug: string) => void;
}

export const VentureCard: React.FC<VentureCardProps> = ({ venture, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(venture.slug)}
      className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-7 shadow-2xs hover:shadow-xl hover:border-black/60 transition-all duration-300 flex flex-col justify-between cursor-pointer group hover:-translate-y-1.5"
    >
      <div>
        {/* Visual Asset (Real Image or SVG Blueprint) */}
        <div className="w-full aspect-[16/10] rounded-2xl overflow-hidden mb-6 bg-neutral-100 shadow-2xs group-hover:scale-[1.01] transition-transform duration-300">
          <VentureVisual
            symbol={venture.image_symbol}
            pattern={venture.accent_pattern}
            name={venture.name}
            stage={venture.stage}
            imageUrl={venture.image_url}
          />
        </div>

        {/* Header Metadata: Stage & Founding Year */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <StageBadge stage={venture.stage} />
          <span className="text-[11px] font-mono text-neutral-400 font-medium">
            Est. {venture.year || '2024'}
          </span>
        </div>

        {/* Full Name & Tagline (No truncation bugs) */}
        <h3 className="text-xl sm:text-2xl font-bold font-display text-black tracking-tight mb-1 group-hover:text-neutral-700 transition-colors">
          {venture.name}
        </h3>

        {venture.tagline && (
          <div className="text-xs font-mono text-neutral-500 mb-3 font-medium">
            {venture.tagline}
          </div>
        )}

        {/* One-Liner Description */}
        <p className="text-xs sm:text-sm text-neutral-600 font-normal leading-relaxed mb-6">
          {venture.one_liner}
        </p>

        {/* Tech Stack Pills */}
        {venture.tech_stack && venture.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {venture.tech_stack.map((tech, idx) => (
              <span
                key={idx}
                className="text-[10px] font-mono bg-neutral-100 text-neutral-700 px-2.5 py-0.5 rounded-md font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Metrics & CTA */}
      <div className="pt-4 border-t border-neutral-100 flex items-center justify-between gap-3 text-xs font-mono">
        <div className="min-w-0">
          <span className="text-[10px] text-neutral-400 block uppercase font-medium">Traction</span>
          <span className="font-bold text-black text-xs truncate block" title={venture.metrics}>
            {venture.metrics || 'Pre-Seed'}
          </span>
        </div>

        <div className="inline-flex items-center gap-1 text-xs font-semibold text-black group-hover:translate-x-0.5 transition-transform">
          <span>Read Thesis</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
