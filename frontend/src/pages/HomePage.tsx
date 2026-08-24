import React, { useState } from 'react';
import { Venture, GlobalSettings, StageFilter } from '../types';
import { Hero } from '../components/Hero';
import { FeaturedCarousel } from '../components/FeaturedCarousel';
import { VentureCard } from '../components/VentureCard';
import { StageFilterBar } from '../components/StageFilterBar';
import { StageTracker } from '../components/StageTracker';
import { StudioPillars } from '../components/StudioPillars';
import { CmsErrorBanner } from '../components/CmsErrorBanner';
import { Layers, ArrowRight } from 'lucide-react';

interface HomePageProps {
  globals: GlobalSettings | null;
  ventures: Venture[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onSelectVenture: (slug: string) => void;
  onOpenAdmin: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  globals,
  ventures,
  loading,
  error,
  onRetry,
  onSelectVenture,
  onOpenAdmin,
}) => {
  const [currentFilter, setCurrentFilter] = useState<StageFilter>('All');

  const filteredVentures = currentFilter === 'All'
    ? ventures
    : ventures.filter(v => v.stage === currentFilter);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-black relative overflow-hidden">
      {/* Background Architectural Linear Gradient & Subtle Grid Texture */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #000 1px, transparent 1px),
            linear-gradient(to bottom, #000 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-b from-neutral-200/40 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Dynamic CMS Hero */}
      <Hero globals={globals} loading={loading} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full pt-10 sm:pt-12 relative z-10">
        {/* Error notice if CMS is offline */}
        {error && (
          <CmsErrorBanner error={error} onRetry={onRetry} isRetrying={loading} />
        )}

        {/* 1. Featured Ventures Showcase Carousel */}
        {!loading && ventures.length > 0 && (
          <FeaturedCarousel
            ventures={ventures}
            onSelectVenture={onSelectVenture}
          />
        )}

        {/* 2. All Ventures Portfolio Index Header & Stage Filters */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-neutral-200 mb-10 pt-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-4 h-4 text-black" />
              <span className="eyebrow-badge">PORTFOLIO INDEX</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-black tracking-tight font-display">
              All Studio Ventures
            </h2>
          </div>

          <StageFilterBar
            currentFilter={currentFilter}
            onFilterChange={setCurrentFilter}
            ventures={ventures}
          />
        </div>

        {/* Ventures Grid with 3D Rotate & Hover Micro-Animations */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-3xl bg-white border border-neutral-200 animate-pulse p-6"></div>
            ))}
          </div>
        ) : filteredVentures.length === 0 ? (
          <div className="text-center py-24 border border-neutral-200 rounded-3xl bg-white">
            <p className="text-neutral-500 font-mono text-sm mb-4">No ventures found for filter "{currentFilter}"</p>
            <button
              onClick={() => setCurrentFilter('All')}
              className="text-xs font-mono text-black font-semibold underline underline-offset-4"
            >
              Reset to all ventures
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVentures.map((venture) => (
              <VentureCard
                key={venture.id}
                venture={venture}
                onSelect={onSelectVenture}
              />
            ))}
          </div>
        )}

        {/* 3. Studio Stage Lifecycle Pipeline Tracker */}
        {!loading && (
          <StageTracker
            ventures={ventures}
            onSelectVenture={onSelectVenture}
          />
        )}

        {/* 4. Studio Operating Model Pillars (How We Build) */}
        <StudioPillars />

        {/* 5. Dynamic CMS Studio Manifesto */}
        {globals?.manifesto_quote && (
          <section className="my-20 sm:my-28 p-10 sm:p-14 rounded-3xl border border-neutral-200 bg-white shadow-xs relative overflow-hidden">
            <div className="relative z-10">
              <span className="eyebrow-badge mb-4 block">
                {globals.manifesto_headline || 'STUDIO METHODOLOGY'}
              </span>
              <blockquote className="text-2xl sm:text-4xl font-light text-black leading-relaxed max-w-5xl mb-8 font-display">
                "{globals.manifesto_quote}"
              </blockquote>
              <div className="flex items-center gap-4">
                <button
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-black hover:text-neutral-600 transition-colors"
                >
                  <span>Edit this quote in CMS Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
