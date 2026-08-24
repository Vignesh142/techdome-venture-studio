import React, { useEffect, useState } from 'react';
import { Venture } from '../types';
import { cmsClient } from '../api/cmsClient';
import { StageBadge } from '../components/StageBadge';
import { VentureVisual } from '../components/VentureVisual';
import { ArrowLeft, ExternalLink, Edit3, Calendar, Users, Activity, Sparkles } from 'lucide-react';

interface VentureDetailPageProps {
  slug: string;
  onBack: () => void;
  onOpenAdmin: () => void;
}

export const VentureDetailPage: React.FC<VentureDetailPageProps> = ({ slug, onBack, onOpenAdmin }) => {
  const [venture, setVenture] = useState<Venture | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchVenture = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await cmsClient.getVentureBySlug(slug);
        if (isMounted) setVenture(data);
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load venture detail');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchVenture();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-20 animate-pulse bg-[#FAFAFA]">
        <div className="h-4 w-28 bg-neutral-200 rounded mb-8"></div>
        <div className="h-14 w-2/3 bg-neutral-200 rounded mb-4"></div>
        <div className="h-6 w-1/3 bg-neutral-200 rounded mb-10"></div>
        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="h-24 bg-neutral-200 rounded-2xl"></div>
          <div className="h-24 bg-neutral-200 rounded-2xl"></div>
          <div className="h-24 bg-neutral-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (error || !venture) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-24 text-center bg-[#FAFAFA]">
        <h2 className="text-3xl font-bold text-black mb-4 font-display">Venture Not Found</h2>
        <p className="text-neutral-500 font-mono text-sm mb-8">{error || `No venture matching "${slug}"`}</p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black text-white text-xs font-mono hover:bg-neutral-800 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all ventures</span>
        </button>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-[#FAFAFA] text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-20">
        {/* Back button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-mono text-neutral-500 hover:text-black transition-colors mb-12 group font-semibold"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to all ventures</span>
        </button>

        {/* Venture Top Grid: Metadata Left, Square Brand Graphic / Real Image Right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-14 pb-14 border-b border-neutral-200 items-center bg-white p-8 sm:p-12 rounded-3xl border shadow-2xs">
          <div className="md:col-span-8 flex flex-col justify-center">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
                {venture.tagline || 'Studio Incubation'}
              </span>
              <div className="flex items-center gap-3">
                <StageBadge stage={venture.stage} />
                <button
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-xs font-mono text-black transition-colors font-medium"
                  title="Edit this venture in CMS Admin"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit in CMS</span>
                </button>
              </div>
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-black mb-6 font-display">
              {venture.name}
            </h1>

            <p className="text-xl sm:text-2xl text-neutral-600 font-light leading-relaxed max-w-3xl">
              {venture.one_liner}
            </p>
          </div>

          <div className="md:col-span-4 flex items-center justify-center">
            <div className="w-full max-w-[320px] aspect-square rounded-3xl overflow-hidden shadow-lg">
              <VentureVisual
                symbol={venture.image_symbol}
                pattern={venture.accent_pattern}
                name={venture.name}
                stage={venture.stage}
                imageUrl={venture.image_url}
              />
            </div>
          </div>
        </div>

        {/* Key Facts / Studio Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-8 rounded-3xl bg-white border border-neutral-200 mb-16 shadow-2xs">
          <div className="flex flex-col">
            <span className="text-xs font-mono text-neutral-400 uppercase flex items-center gap-1.5 mb-1.5">
              <Activity className="w-3.5 h-3.5 text-black" /> Traction
            </span>
            <span className="text-lg font-bold text-black font-mono">
              {venture.metrics || 'Pre-Seed'}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs font-mono text-neutral-400 uppercase flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-black" /> Stage
            </span>
            <span className="text-lg font-bold text-black font-mono">
              {venture.stage}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs font-mono text-neutral-400 uppercase flex items-center gap-1.5 mb-1.5">
              <Calendar className="w-3.5 h-3.5 text-black" /> Year
            </span>
            <span className="text-lg font-bold text-black font-mono">
              {venture.year || '2024'}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs font-mono text-neutral-400 uppercase flex items-center gap-1.5 mb-1.5">
              <Users className="w-3.5 h-3.5 text-black" /> Founders
            </span>
            <span className="text-base font-bold text-black truncate" title={venture.founders}>
              {venture.founders || 'Techdome Studio'}
            </span>
          </div>
        </div>

        {/* Editorial Studio Thesis & Description */}
        <section className="mb-16 max-w-5xl bg-white p-8 sm:p-12 rounded-3xl border border-neutral-200 shadow-2xs">
          <h3 className="text-xs font-mono text-neutral-400 uppercase tracking-widest mb-6 font-semibold">
            Market Thesis & Architecture
          </h3>
          <div className="text-neutral-700 text-lg sm:text-xl leading-relaxed whitespace-pre-line font-light space-y-6">
            {venture.description}
          </div>
        </section>

        {/* Bottom CTA / External Link */}
        <div className="pt-10 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-mono text-neutral-400 block mb-1">Slug Route Identifier</span>
            <code className="text-xs font-mono text-black bg-white px-3 py-1.5 rounded-lg border border-neutral-200 shadow-2xs">
              /ventures/{venture.slug}
            </code>
          </div>

          {venture.website_url && (
            <a
              href={venture.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-black text-white hover:bg-neutral-800 text-xs font-semibold font-mono transition-all shadow-sm"
            >
              <span>Visit Platform</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
};
