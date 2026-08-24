import React from 'react';
import { Venture } from '../types';
import { Layers, Rocket, Trophy, ArrowRight, Shield, Activity, Network, Cpu, Database } from 'lucide-react';

interface StageTrackerProps {
  ventures: Venture[];
  onSelectVenture: (slug: string) => void;
}

export const StageTracker: React.FC<StageTrackerProps> = ({ ventures, onSelectVenture }) => {
  const publishedVentures = ventures.filter(v => v.published !== false);

  const stages = [
    {
      id: 'Building',
      title: 'Building',
      phase: 'Phase 01 · Incubation',
      icon: Layers,
      desc: 'Thesis validation, technical prototyping, and founding team assembly.',
      ventures: publishedVentures.filter(v => v.stage === 'Building'),
      badgeColor: 'bg-neutral-100 text-neutral-800 border-neutral-300',
      headerBg: 'bg-white',
    },
    {
      id: 'Launched',
      title: 'Launched',
      phase: 'Phase 02 · Market Scale',
      icon: Rocket,
      desc: 'Production rollout, enterprise customer adoption, and Series A readiness.',
      ventures: publishedVentures.filter(v => v.stage === 'Launched'),
      badgeColor: 'bg-black text-white border-black',
      headerBg: 'bg-white',
    },
    {
      id: 'Exited',
      title: 'Exited',
      phase: 'Phase 03 · M&A / Liquidity',
      icon: Trophy,
      desc: 'Strategic acquisition, institutional M&A, and full venture realization.',
      ventures: publishedVentures.filter(v => v.stage === 'Exited'),
      badgeColor: 'bg-neutral-200 text-neutral-900 border-neutral-400',
      headerBg: 'bg-white',
    },
  ];

  return (
    <section className="my-20 sm:my-28">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-neutral-200 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-black"></span>
            <span className="eyebrow-badge">VENTURE LIFECYCLE TRACKER</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-black tracking-tight font-display">
            Studio Stage Pipeline
          </h2>
        </div>
        <p className="text-xs font-mono text-neutral-500 max-w-md text-left sm:text-right">
          Real-time tracking of ventures moving from Day-0 technical incubation to institutional exit.
        </p>
      </div>

      {/* 3-Column Pipeline Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {stages.map((stg) => {
          const Icon = stg.icon;
          return (
            <div
              key={stg.id}
              className="rounded-3xl bg-white border border-neutral-200 p-6 sm:p-8 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all duration-300"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-mono font-bold uppercase px-3 py-1 rounded-full border ${stg.badgeColor}`}>
                    {stg.phase}
                  </span>
                  <span className="text-xs font-mono text-neutral-400 font-bold">
                    {stg.ventures.length} {stg.ventures.length === 1 ? 'Venture' : 'Ventures'}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center shadow-xs">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-xl font-bold text-black font-display tracking-tight">
                    {stg.title}
                  </h3>
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed mb-6 font-light">
                  {stg.desc}
                </p>

                {/* Ventures in this stage */}
                <div className="space-y-3 pt-4 border-t border-neutral-100">
                  {stg.ventures.length === 0 ? (
                    <div className="py-6 text-center text-xs font-mono text-neutral-400 bg-neutral-50 rounded-2xl border border-neutral-100 border-dashed">
                      No active ventures in {stg.title} stage
                    </div>
                  ) : (
                    stg.ventures.map((v) => (
                      <div
                        key={v.id}
                        onClick={() => onSelectVenture(v.slug)}
                        className="p-4 rounded-2xl bg-neutral-50 hover:bg-neutral-100/90 border border-neutral-200/80 transition-all cursor-pointer group flex items-center justify-between gap-3 hover:-translate-y-0.5"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center shrink-0">
                            {v.image_symbol === 'shield' && <Shield className="w-4 h-4" />}
                            {v.image_symbol === 'network' && <Network className="w-4 h-4" />}
                            {v.image_symbol === 'activity' && <Activity className="w-4 h-4" />}
                            {v.image_symbol === 'cpu' && <Cpu className="w-4 h-4" />}
                            {v.image_symbol === 'database' && <Database className="w-4 h-4" />}
                            {(!v.image_symbol || !['shield', 'network', 'activity', 'cpu', 'database'].includes(v.image_symbol)) && (
                              <Layers className="w-4 h-4" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-sm text-black block truncate group-hover:text-neutral-700 transition-colors">
                              {v.name}
                            </span>
                            <span className="text-[11px] font-mono text-neutral-500 truncate block">
                              {v.metrics || 'Pre-Seed'}
                            </span>
                          </div>
                        </div>

                        <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-black group-hover:translate-x-1 transition-all shrink-0" />
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Progress Line */}
              <div className="mt-8 pt-4 border-t border-neutral-100 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                <span>Pipeline Status</span>
                <span className="font-semibold text-black">Active Monitoring</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
