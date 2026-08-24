import React, { useEffect, useState } from 'react';
import { Venture } from '../types';
import { cmsClient } from '../api/cmsClient';
import { StageBadge } from '../components/StageBadge';
import { VentureVisual } from '../components/VentureVisual';
import {
  ArrowLeft,
  ExternalLink,
  Edit3,
  Calendar,
  Users,
  Activity,
  Layers,
  Code2,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Rocket
} from 'lucide-react';

interface VentureDetailPageProps {
  slug: string;
  onBack: () => void;
  onOpenAdmin: () => void;
  onOpenBooking: () => void;
}

export const VentureDetailPage: React.FC<VentureDetailPageProps> = ({
  slug,
  onBack,
  onOpenAdmin,
  onOpenBooking
}) => {
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-16 animate-pulse bg-[#FAFAFA] space-y-6">
        <div className="h-4 w-36 bg-neutral-200 rounded"></div>
        <div className="h-12 w-2/3 bg-neutral-200 rounded-xl"></div>
        <div className="h-6 w-full max-w-2xl bg-neutral-200 rounded"></div>
        <div className="h-80 w-full bg-neutral-200 rounded-3xl"></div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="h-24 bg-neutral-200 rounded-2xl"></div>
          <div className="h-24 bg-neutral-200 rounded-2xl"></div>
          <div className="h-24 bg-neutral-200 rounded-2xl"></div>
          <div className="h-24 bg-neutral-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (error || !venture) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-24 text-center bg-[#FAFAFA]">
        <div className="w-14 h-14 rounded-2xl bg-neutral-100 text-neutral-500 flex items-center justify-center mx-auto mb-4">
          <Layers className="w-7 h-7" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-black mb-2 font-display">Venture Case Study Not Found</h2>
        <p className="text-neutral-500 font-mono text-xs mb-8">{error || `No active case study matching slug "/ventures/${slug}"`}</p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-black text-white text-xs font-mono font-semibold hover:bg-neutral-800 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </button>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-[#FAFAFA] text-[#111111] pb-24">
      {/* Top Breadcrumb Header */}
      <div className="border-b border-neutral-200 bg-white sticky top-0 z-30 studio-glass">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 h-14 sm:h-16 flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-neutral-600 hover:text-black transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Ventures</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline font-mono text-[11px] text-neutral-400 bg-neutral-100 px-2.5 py-1 rounded-md">
              /ventures/{venture.slug}
            </span>

            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-black text-xs font-mono font-semibold transition-colors"
              title="Edit in CMS Admin Studio"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit in CMS</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-10 sm:pt-14 space-y-12">
        {/* 1. Header Overview & Title */}
        <div className="space-y-4 max-w-4xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest font-semibold">
              {venture.tagline || 'Techdome Studio Co-Founding'}
            </span>
            <span className="text-neutral-300">•</span>
            <StageBadge stage={venture.stage} />
            <span className="text-neutral-300">•</span>
            <span className="text-xs font-mono text-neutral-400 font-medium">
              Est. {venture.year || '2024'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-black font-display leading-[1.15]">
            {venture.name}
          </h1>

          <p className="text-base sm:text-xl text-neutral-600 font-normal leading-relaxed">
            {venture.one_liner}
          </p>
        </div>

        {/* 2. High-Impact Visual Showcase */}
        <div className="w-full aspect-[16/9] sm:aspect-[21/9] rounded-3xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-sm relative group">
          <VentureVisual
            symbol={venture.image_symbol}
            pattern={venture.accent_pattern}
            name={venture.name}
            stage={venture.stage}
            imageUrl={venture.image_url}
          />
        </div>

        {/* 3. Structured Key Metadata Cards (4-Column Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-2xs">
          {/* Traction & Capital */}
          <div className="space-y-1.5 p-3 rounded-2xl bg-neutral-50/70 border border-neutral-100">
            <span className="text-[10px] font-mono uppercase text-neutral-400 font-semibold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-black" />
              <span>Capital & Traction</span>
            </span>
            <div className="text-sm font-bold text-black font-mono leading-snug break-words">
              {venture.metrics || 'Pre-Seed / Studio Incubation'}
            </div>
          </div>

          {/* Incubation Stage */}
          <div className="space-y-1.5 p-3 rounded-2xl bg-neutral-50/70 border border-neutral-100">
            <span className="text-[10px] font-mono uppercase text-neutral-400 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span>Incubation Stage</span>
            </span>
            <div className="text-sm font-bold text-black font-display">
              {venture.stage} Lifecycle
            </div>
          </div>

          {/* Founding Team */}
          <div className="space-y-1.5 p-3 rounded-2xl bg-neutral-50/70 border border-neutral-100">
            <span className="text-[10px] font-mono uppercase text-neutral-400 font-semibold flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-black" />
              <span>Founders & Partners</span>
            </span>
            <div className="text-sm font-semibold text-black leading-snug break-words">
              {venture.founders || 'Techdome Venture Studio'}
            </div>
          </div>

          {/* Timeline / Year */}
          <div className="space-y-1.5 p-3 rounded-2xl bg-neutral-50/70 border border-neutral-100">
            <span className="text-[10px] font-mono uppercase text-neutral-400 font-semibold flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-black" />
              <span>Incubation Year</span>
            </span>
            <div className="text-sm font-bold text-black font-mono">
              {venture.year || '2024'} Cohort
            </div>
          </div>
        </div>

        {/* 4. Production Tech Stack Section */}
        {venture.tech_stack && venture.tech_stack.length > 0 && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-2xs space-y-3.5">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-black tracking-wider pb-2 border-b border-neutral-100">
              <Code2 className="w-4 h-4 text-black" />
              <span>Production Architecture & Engineering Stack</span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {venture.tech_stack.map((tech, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-black text-xs font-mono font-medium transition-colors border border-neutral-200/80"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
                  <span>{tech}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 5. Editorial Thesis & Deep Dive Case Study */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Case Study Text Column */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-10 rounded-3xl border border-neutral-200 shadow-2xs space-y-6">
            <div className="pb-4 border-b border-neutral-100">
              <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest font-semibold block mb-1">
                Deep Dive Case Study
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-black">
                Market Thesis & Architectural Blueprint
              </h2>
            </div>

            <div className="text-neutral-700 text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal space-y-4">
              {venture.description}
            </div>

            {/* Studio Deliverables Badges */}
            <div className="pt-6 border-t border-neutral-100 space-y-3">
              <span className="text-[11px] font-mono uppercase text-neutral-400 font-semibold block">
                Techdome Co-Building Milestones Delivered
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  "Day-0 System Architecture & Microservices",
                  "Production-Ready MVP Shipped in 60 Days",
                  "Enterprise Security, SOC2 & Cloud Foundry",
                  "Dedicated Full-Stack Engineering Pod Scaling"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-medium text-neutral-800 bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                    <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Quick Actions & Live Link */}
          <div className="lg:col-span-4 space-y-6">
            {/* Live Link Card */}
            {venture.website_url && (
              <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-2xs space-y-4">
                <div className="flex items-center gap-2.5">
                  <Rocket className="w-5 h-5 text-black" />
                  <h3 className="font-bold font-display text-base text-black">
                    Live Venture Platform
                  </h3>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                  Explore the live production deployment co-engineered by Techdome Venture Studio.
                </p>
                <a
                  href={venture.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-mono font-semibold transition-all flex items-center justify-center gap-2 shadow-sm text-center"
                >
                  <span>Visit {venture.name}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {/* Co-Build With Us Card */}
            <div className="bg-neutral-900 text-white p-6 rounded-3xl shadow-md space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-neutral-400 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-white" />
                <span>Foundry Co-Building</span>
              </div>
              <h3 className="text-lg font-bold font-display leading-snug">
                Have an Ambitious Venture Idea?
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed font-normal">
                Partner with Techdome as your institutional technical co-founder. We engineer from Day 0 and invest sweat equity.
              </p>
              <button
                onClick={onOpenBooking}
                className="w-full py-3 rounded-xl bg-white hover:bg-neutral-100 text-black text-xs font-mono font-bold transition-all text-center shadow-sm cursor-pointer active:scale-95"
              >
                Schedule Discovery Call →
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
