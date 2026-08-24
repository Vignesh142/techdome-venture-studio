import React, { useState, useEffect } from 'react';
import { Venture } from '../types';
import { StageBadge } from './StageBadge';
import { VentureVisual } from './VentureVisual';
import { ChevronLeft, ChevronRight, ArrowUpRight, Sparkles } from 'lucide-react';

interface FeaturedCarouselProps {
  ventures: Venture[];
  onSelectVenture: (slug: string) => void;
}

export const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ ventures, onSelectVenture }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAutoplay, setIsAutoplay] = useState<boolean>(true);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');

  // Filter published ventures
  const featuredList = ventures.filter(v => v.published !== false);

  const nextSlide = () => {
    setSlideDirection('next');
    setCurrentIndex((prev) => (prev + 1) % (featuredList.length || 1));
  };

  const prevSlide = () => {
    setSlideDirection('prev');
    setCurrentIndex((prev) => (prev - 1 + (featuredList.length || 1)) % (featuredList.length || 1));
  };

  // Autoplay timer
  useEffect(() => {
    if (!isAutoplay || featuredList.length <= 1) return;
    const interval = setInterval(nextSlide, 5500);
    return () => clearInterval(interval);
  }, [currentIndex, isAutoplay, featuredList.length]);

  if (featuredList.length === 0) return null;

  const current = featuredList[currentIndex];

  return (
    <section
      className="my-12 sm:my-16 select-none"
      onMouseEnter={() => setIsAutoplay(false)}
      onMouseLeave={() => setIsAutoplay(true)}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-black" />
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-neutral-500">
            Featured Studio Venture · 0{currentIndex + 1} / 0{featuredList.length}
          </span>
        </div>

        {/* Carousel Prev/Next Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevSlide}
            className="p-2.5 rounded-full border border-neutral-200 bg-white hover:bg-black hover:text-white hover:border-black text-black transition-all shadow-xs active:scale-90"
            title="Previous Featured Venture"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextSlide}
            className="p-2.5 rounded-full border border-neutral-200 bg-white hover:bg-black hover:text-white hover:border-black text-black transition-all shadow-xs active:scale-90"
            title="Next Featured Venture"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Featured Showcase Card with Smooth Hardware-Accelerated Slide Transition */}
      <div className="relative rounded-3xl bg-white border border-neutral-200 p-8 sm:p-12 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
        {/* Animated Slide Content keyed on current.id */}
        <div
          key={current.id}
          className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center transition-all duration-500 ease-out animate-in fade-in ${
            slideDirection === 'next' ? 'slide-in-from-right-8' : 'slide-in-from-left-8'
          }`}
        >
          {/* Left Column: Content & Metadata */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <StageBadge stage={current.stage} />
                <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest font-medium">
                  {current.tagline || 'Studio Incubation'}
                </span>
              </div>

              <h3 className="text-3xl sm:text-5xl font-bold font-display text-black tracking-tight mb-4">
                {current.name}
              </h3>

              <p className="text-base sm:text-xl text-neutral-600 font-light leading-relaxed mb-6">
                {current.one_liner}
              </p>
            </div>

            {/* Metrics Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-neutral-100 text-xs font-mono">
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase mb-0.5 font-medium">Traction</span>
                <span className="font-bold text-black text-sm">{current.metrics || 'Pre-Seed'}</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase mb-0.5 font-medium">Founding Year</span>
                <span className="font-bold text-black text-sm">{current.year || '2024'}</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-neutral-400 block text-[10px] uppercase mb-0.5 font-medium">Founders</span>
                <span className="font-bold text-black text-sm truncate block" title={current.founders}>
                  {current.founders || 'Techdome Studio'}
                </span>
              </div>
            </div>

            {/* Action CTA Button */}
            <div className="pt-4 flex items-center gap-4">
              <button
                onClick={() => onSelectVenture(current.slug)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-black hover:bg-neutral-800 text-white text-xs font-mono font-semibold transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Read Full Venture Thesis</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <span className="text-xs font-mono text-neutral-400">
                /ventures/{current.slug}
              </span>
            </div>
          </div>

          {/* Right Column: Square Image Visual (Real Image or Generative Blueprint) */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div
              onClick={() => onSelectVenture(current.slug)}
              className="w-full max-w-[360px] aspect-square rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.03] hover:rotate-[0.8deg]"
            >
              <VentureVisual
                symbol={current.image_symbol}
                pattern={current.accent_pattern}
                name={current.name}
                stage={current.stage}
                imageUrl={current.image_url}
              />
            </div>
          </div>
        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-neutral-100">
          {featuredList.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSlideDirection(idx > currentIndex ? 'next' : 'prev');
                setCurrentIndex(idx);
              }}
              className={`h-2 rounded-full transition-all duration-500 ${
                idx === currentIndex
                  ? 'w-8 bg-black'
                  : 'w-2 bg-neutral-200 hover:bg-neutral-400'
              }`}
              title={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
