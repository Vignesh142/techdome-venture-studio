import React, { useState, useRef } from 'react';
import { Venture, GlobalSettings, StudioService, EngagementModel, StageFilter } from '../types';
import { Hero } from '../components/Hero';
import { StudioServices } from '../components/StudioServices';
import { VentureCard } from '../components/VentureCard';
import { StageFilterBar } from '../components/StageFilterBar';
import { StageTracker } from '../components/StageTracker';
import { EngagementModels } from '../components/EngagementModels';
import { ContactSection } from '../components/ContactSection';
import { CmsErrorBanner } from '../components/CmsErrorBanner';
import { Layers, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface HomePageProps {
  globals: GlobalSettings | null;
  ventures: Venture[];
  services?: StudioService[];
  models?: EngagementModel[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onSelectVenture: (slug: string) => void;
  onOpenAdmin: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  globals,
  ventures,
  services,
  models,
  loading,
  error,
  onRetry,
  onSelectVenture,
  onOpenAdmin,
}) => {
  const [currentFilter, setCurrentFilter] = useState<StageFilter>('All');
  const venturesScrollRef = useRef<HTMLDivElement>(null);

  const scrollVentures = (direction: 'left' | 'right') => {
    if (venturesScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = venturesScrollRef.current;
      const scrollAmount = clientWidth * 0.8;

      if (direction === 'right') {
        if (scrollLeft + clientWidth >= scrollWidth - 25) {
          venturesScrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          venturesScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      } else {
        if (scrollLeft <= 25) {
          venturesScrollRef.current.scrollTo({ left: scrollWidth, behavior: 'smooth' });
        } else {
          venturesScrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }
      }
    }
  };

  const filteredVentures = currentFilter === 'All'
    ? ventures
    : ventures.filter(v => v.stage === currentFilter);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-[#111111] relative overflow-hidden">
      {/* 1. Sleek Architectural Top Background Grid Pattern (Radial Faded) */}
      <div 
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-[850px] opacity-[0.045] pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #000000 1px, transparent 1px),
            linear-gradient(to bottom, #000000 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)'
        }}
      />

      {/* Subtle Top Ambient Gradient Glow */}
      <div className="absolute top-0 right-1/4 w-[550px] h-[550px] bg-gradient-to-b from-neutral-200/50 via-transparent to-transparent rounded-full blur-3xl pointer-events-none z-0" />

      {/* 2. Dynamic Hero */}
      <Hero
        globals={globals}
        loading={loading}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full relative z-10">
        {/* Error banner if CMS offline */}
        {error && (
          <CmsErrorBanner error={error} onRetry={onRetry} isRetrying={loading} />
        )}

        {/* 3. Practice Areas (Side-Scrolling Carousel backed by CMS) */}
        <StudioServices services={services} />

        {/* 4. Portfolio Ventures (Side-Scrolling Carousel with Loop-Back Support) */}
        <section id="portfolio" className="my-14 sm:my-20 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-neutral-200 mb-8">
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Layers className="w-4 h-4 text-black" />
                <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-neutral-500">
                  Incubation Track Record
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-black tracking-tight font-display">
                Co-Founded Ventures & Case Studies
              </h2>
            </div>

            {/* Stage Filter */}
            <StageFilterBar
              currentFilter={currentFilter}
              onFilterChange={setCurrentFilter}
              ventures={ventures}
            />
          </div>

          {/* Carousel Track Container with Side-End Floating Buttons */}
          {loading ? (
            <div className="flex gap-5 overflow-hidden">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-full sm:w-[calc(50%-12px)] min-w-[85vw] sm:min-w-[360px] h-80 rounded-2xl bg-white border border-neutral-200 animate-pulse p-5 shrink-0"></div>
              ))}
            </div>
          ) : filteredVentures.length === 0 ? (
            <div className="text-center py-16 border border-neutral-200 rounded-2xl bg-white">
              <p className="text-neutral-500 font-mono text-xs mb-3">No ventures found for filter "{currentFilter}"</p>
              <button
                onClick={() => setCurrentFilter('All')}
                className="text-xs font-mono text-black font-semibold underline underline-offset-4"
              >
                Reset to all ventures
              </button>
            </div>
          ) : (
            <div className="relative group">
              {/* Left End Floating Nav Button */}
              <button
                onClick={() => scrollVentures('left')}
                className="absolute -left-2 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-white/95 backdrop-blur-md border border-neutral-300 shadow-xl hover:bg-black hover:text-white hover:border-black transition-all flex items-center justify-center opacity-80 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-110 active:scale-95 text-black cursor-pointer"
                title="Scroll Left (Loops to end)"
                aria-label="Previous Venture"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Right End Floating Nav Button */}
              <button
                onClick={() => scrollVentures('right')}
                className="absolute -right-2 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-white/95 backdrop-blur-md border border-neutral-300 shadow-xl hover:bg-black hover:text-white hover:border-black transition-all flex items-center justify-center opacity-80 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-110 active:scale-95 text-black cursor-pointer"
                title="Scroll Right (Loops to start)"
                aria-label="Next Venture"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Horizontal Sliding Track for Ventures */}
              <div
                ref={venturesScrollRef}
                className="flex gap-5 sm:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4 pt-1 px-1"
                style={{ scrollSnapType: 'x mandatory' }}
              >
                {filteredVentures.map((venture) => (
                  <div
                    key={venture.id}
                    className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] min-w-[85vw] sm:min-w-[340px] lg:min-w-[360px] snap-center shrink-0"
                  >
                    <VentureCard
                      venture={venture}
                      onSelect={onSelectVenture}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 5. Stage Lifecycle Pipeline Tracker */}
        {!loading && (
          <div id="pipeline">
            <StageTracker
              ventures={ventures}
              onSelectVenture={onSelectVenture}
            />
          </div>
        )}

        {/* 6. Transparent Engagement Models (backed by CMS) */}
        <EngagementModels models={models} />

        {/* 7. Studio Methodology Statement */}
        {globals?.manifesto_quote && (
          <section className="my-14 sm:my-20 p-6 sm:p-10 rounded-3xl border border-neutral-200 bg-white shadow-2xs relative overflow-hidden">
            <div className="relative z-10">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-neutral-500 block mb-3">
                {globals.manifesto_headline || 'STUDIO METHODOLOGY'}
              </span>
              <blockquote className="text-xl sm:text-2xl font-light text-black leading-relaxed max-w-4xl mb-6 font-display">
                "{globals.manifesto_quote}"
              </blockquote>
              <div className="flex items-center gap-4">
                <button
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-black hover:text-neutral-600 transition-colors"
                >
                  <span>Edit in CMS Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* 8. Dedicated Open Discovery Call & Lead Capture Section at the Bottom */}
        <ContactSection />
      </main>
    </div>
  );
};
