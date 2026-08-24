import React from 'react';
import { Venture } from '../types';
import { Layers, Rocket, Trophy, CheckCircle2, ArrowRight, Sparkles, Activity } from 'lucide-react';

interface StageTrackerProps {
  ventures: Venture[];
  onSelectVenture: (slug: string) => void;
}

export const StageTracker: React.FC<StageTrackerProps> = ({ ventures, onSelectVenture }) => {
  const publishedVentures = ventures.filter(v => v.published !== false);

  const stages = [
    {
      id: 'Building',
      number: '01',
      title: 'Building & Incubation',
      badge: 'Day 0 → MVP',
      timeline: 'Months 0 – 3',
      icon: Layers,
      focus: 'Thesis Validation & Rapid Engineering',
      description: 'We validate the commercial market thesis, write core microservices architecture, and deploy a production-ready MVP.',
      milestones: [
        'Domain thesis & unit economics modeling',
        'Production MVP architecture & CI/CD deployment',
        'Co-founding sweat equity & cap table formation',
        'First 5 enterprise design partner pilots'
      ],
      ventures: publishedVentures.filter(v => v.stage === 'Building'),
      accentBg: 'bg-amber-500/10 text-amber-900 border-amber-200/60'
    },
    {
      id: 'Launched',
      number: '02',
      title: 'Market Scale & Growth',
      badge: 'Seed → Series A',
      timeline: 'Months 4 – 18',
      icon: Rocket,
      focus: 'Customer Acquisition & Infra Scaling',
      description: 'Scaling enterprise go-to-market, hardening cloud reliability, embedding dedicated engineering pods, and raising institutional rounds.',
      milestones: [
        'SOC2 Type II & zero-trust security hardening',
        'Embedded engineering pod scaling (4-12 devs)',
        'Enterprise sales motion & repeatable revenue',
        'Institutional VC syndicate & Series A readiness'
      ],
      ventures: publishedVentures.filter(v => v.stage === 'Launched'),
      accentBg: 'bg-emerald-500/10 text-emerald-900 border-emerald-200/60'
    },
    {
      id: 'Exited',
      number: '03',
      title: 'M&A & Liquidity',
      badge: 'Acquisition / IPO',
      timeline: 'Realization',
      icon: Trophy,
      focus: 'Institutional Liquidity & Transition',
      description: 'Executing strategic enterprise acquisitions, institutional buyouts, and realizing long-term equity returns for founders.',
      milestones: [
        'Strategic acquirer positioning & valuation',
        'Technical due diligence & IP transfer',
        'Executive team retention & integration',
        'Full founder equity liquidity event'
      ],
      ventures: publishedVentures.filter(v => v.stage === 'Exited'),
      accentBg: 'bg-blue-500/10 text-blue-900 border-blue-200/60'
    }
  ];

  return (
    <section id="pipeline" className="my-16 sm:my-24 scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-neutral-200 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Activity className="w-4 h-4 text-black" />
            <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-neutral-500">
              Venture Lifecycle Framework
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-black tracking-tight font-display">
            Studio Incubation & Scaling Pipeline
          </h2>
        </div>
        <p className="text-xs text-neutral-600 max-w-sm font-normal">
          How Techdome systematically de-risks, engineers, scales, and exits software companies from Day 0.
        </p>
      </div>

      {/* 3-Step Lifecycle Framework Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-7">
        {stages.map((stg) => {
          const Icon = stg.icon;
          return (
            <div
              key={stg.id}
              className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-7 shadow-2xs card-clean flex flex-col justify-between"
            >
              <div>
                {/* Stage Header & Phase Badge */}
                <div className="flex items-center justify-between gap-2 mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center shadow-2xs">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
                        Phase {stg.number} · {stg.timeline}
                      </span>
                      <h3 className="font-bold font-display text-lg text-black">
                        {stg.title}
                      </h3>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full border ${stg.accentBg}`}>
                    {stg.badge}
                  </span>
                </div>

                {/* Focus & Description */}
                <p className="text-xs text-neutral-600 font-normal leading-relaxed mb-5">
                  {stg.description}
                </p>

                {/* Key Stage Milestones / Gates */}
                <div className="space-y-2 pt-4 border-t border-neutral-100 mb-6">
                  <span className="text-[10px] font-mono uppercase text-neutral-400 font-semibold block mb-1">
                    Stage Deliverables & Gates
                  </span>
                  {stg.milestones.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-neutral-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-black shrink-0 mt-0.5" />
                      <span className="leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom: Active Cohort Summary (Clean compact tags, no duplicate bulky cards) */}
              <div className="pt-4 border-t border-neutral-100">
                <div className="flex items-center justify-between text-xs font-mono mb-2.5">
                  <span className="text-neutral-400 font-medium uppercase text-[10px]">Active In Cohort:</span>
                  <span className="font-bold text-black text-xs">
                    {stg.ventures.length} {stg.ventures.length === 1 ? 'Venture' : 'Ventures'}
                  </span>
                </div>

                {stg.ventures.length === 0 ? (
                  <div className="text-[11px] font-mono text-neutral-400 py-1.5 px-3 rounded-lg bg-neutral-50 border border-neutral-100 text-center">
                    Cohorts in pipeline evaluation
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {stg.ventures.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => onSelectVenture(v.slug)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-black hover:text-white text-neutral-800 text-xs font-mono font-medium transition-all group/pill cursor-pointer"
                        title={`View ${v.name} Case Study`}
                      >
                        <span>{v.name}</span>
                        <ArrowRight className="w-3 h-3 text-neutral-400 group-hover/pill:text-white" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
