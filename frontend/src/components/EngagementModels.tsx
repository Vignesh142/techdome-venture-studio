import React from 'react';
import { EngagementModel } from '../types';
import { Check, ArrowRight, ShieldCheck, Zap, Handshake, Cpu, Sparkles } from 'lucide-react';

interface EngagementModelsProps {
  models?: EngagementModel[];
  onOpenBooking?: (modelTitle?: string) => void;
}

const defaultModels: EngagementModel[] = [
  {
    id: 1,
    title: "Venture Co-Founding",
    badge: "Equity & Shared Risk",
    timeline: "Day 0 → Series A",
    description: "For visionary founders seeking an institutional technical co-founder from Day 0.",
    features: [
      "Sweat equity co-building & technical co-founder role",
      "Day-0 system architecture & MVP production build",
      "Initial seed funding support & cap table formation",
      "Technical team recruitment & Series A investor network"
    ],
    cta: "Pitch Your Venture",
    featured: true
  },
  {
    id: 2,
    title: "Rapid 14-Day MVP Sprint",
    badge: "Fixed Timeline & Scope",
    timeline: "14-Day Sprint",
    description: "De-risk your product thesis with a clickable prototype, unit economics model, and feasibility blueprint in 2 weeks.",
    features: [
      "14-day rapid delivery guarantee",
      "Interactive clickable prototype & UX journey flows",
      "Technical architecture & cloud feasibility blueprint",
      "Unit economics model & investor pitch deck artifact"
    ],
    cta: "Book 14-Day Sprint",
    featured: false
  },
  {
    id: 3,
    title: "Enterprise AI & Cloud Foundry",
    badge: "Milestone Sprints",
    timeline: "1 – 3 Months",
    description: "For companies deploying custom AI agent pipelines, private LLMs, and zero-trust cloud infrastructure.",
    features: [
      "Custom private LLM & intelligent agent orchestration",
      "Multi-cloud zero-trust infrastructure & microservices",
      "SOC2 / HIPAA standard compliance architecture",
      "Full IP & source code ownership transfer"
    ],
    cta: "Deploy AI Foundry",
    featured: false
  },
  {
    id: 4,
    title: "Dedicated Engineering Pods",
    badge: "Monthly Retainer",
    timeline: "Quarterly Rolling",
    description: "For scaling companies needing elite senior full-stack engineers and fractional technical leadership.",
    features: [
      "Senior engineering pods (2-8 developers)",
      "Direct integration into existing agile sprint cycles",
      "Fractional CTO / Lead Architect oversight",
      "Flexible 3-month rolling sprint agreements"
    ],
    cta: "Hire an Engineering Pod",
    featured: false
  }
];

export const EngagementModels: React.FC<EngagementModelsProps> = ({ models = defaultModels }) => {
  const activeModels = models && models.length > 0 ? models : defaultModels;

  const getIcon = (title: string) => {
    if (title.includes('Co-Founding')) return Handshake;
    if (title.includes('14-Day') || title.includes('MVP')) return Zap;
    if (title.includes('AI') || title.includes('Cloud')) return Cpu;
    return ShieldCheck;
  };

  return (
    <section id="engagement" className="my-16 sm:my-24 scroll-mt-24">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-neutral-500 block mb-1.5">
          Partnership & Pricing Structures
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-black tracking-tight mb-3">
          Transparent Engagement Models
        </h2>
        <p className="text-xs sm:text-sm text-neutral-600 font-normal leading-relaxed">
          From Day-0 sweat equity co-founding to fixed-scope sprints and dedicated pods — choose the exact structure that fits your capital strategy and delivery timeline.
        </p>
      </div>

      {/* 4-Column Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {activeModels.map((model) => {
          const Icon = getIcon(model.title);
          const isFeatured = !!model.featured;

          return (
            <div
              key={model.id}
              className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 ${
                isFeatured
                  ? 'bg-black text-white shadow-xl border border-neutral-800'
                  : 'bg-white text-black border border-neutral-200 shadow-2xs card-clean'
              }`}
            >
              <div>
                {/* Header Row: Icon & Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isFeatured ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-black'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[10px] font-mono font-semibold uppercase px-2.5 py-0.5 rounded-full ${
                    isFeatured 
                      ? 'bg-neutral-800 text-neutral-100 border border-neutral-700' 
                      : 'bg-neutral-100 text-neutral-700 border border-neutral-200'
                  }`}>
                    {model.badge}
                  </span>
                </div>

                {/* Model Title (Explicit White for Featured, Black for Standard) */}
                <h3 className={`text-lg font-bold font-display tracking-tight mb-1 ${
                  isFeatured ? 'text-white' : 'text-black'
                }`}>
                  {model.title}
                </h3>

                {/* Timeline Subhead */}
                {model.timeline && (
                  <div className={`text-[11px] font-mono mb-2.5 ${
                    isFeatured ? 'text-neutral-300' : 'text-neutral-500'
                  }`}>
                    {model.timeline}
                  </div>
                )}

                {/* Description Body */}
                <p className={`text-xs leading-relaxed mb-5 font-normal ${
                  isFeatured ? 'text-neutral-200' : 'text-neutral-600'
                }`}>
                  {model.description}
                </p>

                {/* Features List */}
                <div className={`space-y-2.5 pt-4 border-t mb-6 ${
                  isFeatured ? 'border-neutral-800' : 'border-neutral-100'
                }`}>
                  {model.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs font-medium">
                      <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                        isFeatured ? 'text-emerald-400' : 'text-black'
                      }`} />
                      <span className={isFeatured ? 'text-neutral-100' : 'text-neutral-700'}>
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call to Action Button */}
              <a
                href="#contact"
                className={`w-full py-3 rounded-xl text-xs font-mono font-semibold transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm text-center cursor-pointer ${
                  isFeatured
                    ? 'bg-white text-black hover:bg-neutral-100 font-bold'
                    : 'bg-black text-white hover:bg-neutral-800'
                }`}
              >
                <span>{model.cta}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
};
