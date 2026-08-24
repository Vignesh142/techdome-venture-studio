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
    <article
      onClick={() => onSelect(venture.slug)}
      className="group cursor-pointer rounded-3xl bg-white border border-neutral-200 p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-2 hover:rotate-[0.6deg] hover:border-black hover:shadow-xl"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(venture.slug);
        }
      }}
    >
      <div>
        {/* Square Brand Graphic / Real Image Visual */}
        <div className="mb-6">
          <VentureVisual
            symbol={venture.image_symbol}
            pattern={venture.accent_pattern}
            name={venture.name}
            stage={venture.stage}
            imageUrl={venture.image_url}
          />
        </div>

        {/* Top meta row: Category & Stage */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider truncate font-medium">
            {venture.tagline || 'Studio Incubation'}
          </span>
          <StageBadge stage={venture.stage} />
        </div>

        {/* Venture Name & Arrow */}
        <div className="flex items-baseline justify-between gap-2 mb-3">
          <h3 className="text-2xl font-bold font-display text-black tracking-tight group-hover:text-neutral-700 transition-colors">
            {venture.name}
          </h3>
          <ArrowUpRight className="w-5 h-5 text-neutral-400 group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
        </div>

        {/* Sharp One-Liner */}
        <p className="text-sm text-neutral-600 font-light leading-relaxed mb-6 line-clamp-2">
          {venture.one_liner}
        </p>
      </div>

      {/* Footer Meta: Traction metric & Year */}
      <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-mono">
        <span className="text-black font-semibold">
          {venture.metrics || 'Pre-Seed'}
        </span>
        <span className="text-neutral-400">
          Est. {venture.year || '2024'}
        </span>
      </div>
    </article>
  );
};
