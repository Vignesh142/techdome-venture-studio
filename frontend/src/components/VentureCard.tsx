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
      className="bg-white rounded-2xl border border-neutral-200 p-5 sm:p-6 shadow-2xs card-clean flex flex-col justify-between cursor-pointer group"
    >
      <div>
        {/* Visual Asset */}
        <div className="w-full aspect-[16/10] rounded-xl overflow-hidden mb-4 bg-neutral-100 shadow-2xs">
          <VentureVisual
            symbol={venture.image_symbol}
            pattern={venture.accent_pattern}
            name={venture.name}
            stage={venture.stage}
            imageUrl={venture.image_url}
          />
        </div>

        {/* Stage & Year */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <StageBadge stage={venture.stage} />
          <span className="text-[11px] font-mono text-neutral-400 font-medium">
            Est. {venture.year || '2024'}
          </span>
        </div>

        {/* Full Venture Name (No cutoff) */}
        <h3 className="text-lg sm:text-xl font-bold font-display text-black tracking-tight mb-1 group-hover:text-neutral-700 transition-colors">
          {venture.name}
        </h3>

        {venture.tagline && (
          <div className="text-xs font-mono text-neutral-500 mb-2.5 font-medium line-clamp-1">
            {venture.tagline}
          </div>
        )}

        {/* One-liner */}
        <p className="text-xs text-neutral-600 font-normal leading-relaxed mb-4 line-clamp-3">
          {venture.one_liner}
        </p>

        {/* Tech Stack */}
        {venture.tech_stack && venture.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {venture.tech_stack.slice(0, 4).map((tech, idx) => (
              <span
                key={idx}
                className="text-[10px] font-mono bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Traction & Action */}
      <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2 text-xs font-mono">
        <div className="min-w-0">
          <span className="text-[10px] text-neutral-400 block uppercase font-medium">Traction</span>
          <span className="font-bold text-black text-xs truncate block" title={venture.metrics}>
            {venture.metrics || 'Pre-Seed'}
          </span>
        </div>

        <div className="inline-flex items-center gap-1 text-xs font-semibold text-black group-hover:translate-x-0.5 transition-transform shrink-0">
          <span>View Thesis</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
