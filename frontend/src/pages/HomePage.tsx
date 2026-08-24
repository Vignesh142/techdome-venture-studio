import React, { useState } from 'react';
import { Venture, GlobalSettings, StageFilter } from '../types';
import { Hero } from '../components/Hero';
import { StudioServices } from '../components/StudioServices';
import { VentureCard } from '../components/VentureCard';
import { StageFilterBar } from '../components/StageFilterBar';
import { StageTracker } from '../components/StageTracker';
import { EngagementModels } from '../components/EngagementModels';
import { ClientCtaSection } from '../components/ClientCtaSection';
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
  onOpenBooking: (serviceName?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  globals,
  ventures,
  loading,
  error,
  onRetry,
  onSelectVenture,
  onOpenAdmin,
  onOpenBooking,
}) => {
  const [currentFilter, setCurrentFilter] = useState<StageFilter>('All');

  const filteredVentures = currentFilter === 'All'
    ? ventures
    : ventures.filter(v => v.stage === currentFilter);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-black relative overflow-hidden">
      {/* Background Architectural Grid Texture */}
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

      {/* 1. Dynamic Business-Oriented Hero with Dual CTAs & 4 Clear Stats */}
      <Hero
        globals={globals}
        loading={loading}
        onOpenBooking={() => onOpenBooking()}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full relative z-10">
        {/* Error banner if CMS offline */}
        {error && (
          <CmsErrorBanner error={error} onRetry={onRetry} isRetrying={loading} />
        )}

        {/* 2. Studio Practice Areas & Capabilities (How We Build) */}
        <StudioServices onOpenBooking={onOpenBooking} />

        {/* 3. All Ventures Portfolio Index & Filter Bar */}
        <section id="portfolio" className="my-16 sm:my-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-neutral-200 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Layers className="w-4 h-4 text-black" />
                <span className="font-mono text-xs font-semibold uppercase tracking-widest text-neutral-500">
                  Incubation Track Record
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-black tracking-tight font-display">
                Co-Founded Ventures & Case Studies
              </h2>
            </div>

            <StageFilterBar
              currentFilter={currentFilter}
              onFilterChange={setCurrentFilter}
              ventures={ventures}
            />
          </div>

          {/* Portfolio Grid with Zero Truncation Bugs */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredVentures.map((venture) => (
                <VentureCard
                  key={venture.id}
                  venture={venture}
                  onSelect={onSelectVenture}
                />
              ))}
            </div>
          )}
        </section>

        {/* 4. Studio Stage Lifecycle Pipeline Tracker */}
        {!loading && (
          <div id="pipeline">
            <StageTracker
              ventures={ventures}
              onSelectVenture={onSelectVenture}
            />
          </div>
        )}

        {/* 5. Transparent Engagement Models */}
        <EngagementModels onOpenBooking={onOpenBooking} />

        {/* 6. Dynamic CMS Studio Manifesto */}
        {globals?.manifesto_quote && (
          <section className="my-16 sm:my-24 p-8 sm:p-14 rounded-3xl border border-neutral-200 bg-white shadow-2xs relative overflow-hidden">
            <div className="relative z-10">
              <span className="font-mono text-xs font-semibold uppercase tracking-widest text-neutral-500 block mb-4">
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
                  <span>Edit this statement in CMS Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* 7. Bottom High-Impact Client Conversion Banner */}
        <ClientCtaSection onOpenBooking={() => onOpenBooking()} />
      </main>
    </div>
  );
};
