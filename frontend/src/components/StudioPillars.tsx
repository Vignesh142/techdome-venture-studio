import React from 'react';
import { ShieldCheck, Cpu, Target, Lock, Sparkles, Terminal, Code2, ArrowUpRight } from 'lucide-react';

export const StudioPillars: React.FC = () => {
  const pillars = [
    {
      icon: Terminal,
      title: 'Day-0 Technical Incubation',
      desc: 'We do not wait for pitch decks. We pair with exceptional founding engineers on Day 0 to write the core architecture and build working software from scratch.',
      badge: 'Architecture',
    },
    {
      icon: Cpu,
      title: 'Proprietary AI & Cloud Foundry',
      desc: 'Our in-house foundry accelerates development with hardened distributed microservices, vector data engines, and autonomous agent frameworks.',
      badge: 'Systems',
    },
    {
      icon: Target,
      title: 'Enterprise Go-To-Market Engine',
      desc: 'Direct design-partner introductions with Fortune 500 security leaders and cloud architects, shortening sales cycles from months to days.',
      badge: 'Distribution',
    },
    {
      icon: Lock,
      title: 'Institutional Grade Security',
      desc: 'Enterprise compliance (SOC2 Type II, ISO27001, HIPAA) baked into the foundational codebase before the first public customer onboarding.',
      badge: 'Compliance',
    },
  ];

  return (
    <section className="my-20 sm:my-28 bg-white border border-neutral-200 rounded-3xl p-8 sm:p-14 shadow-sm relative overflow-hidden">
      {/* Background Subtle Gradient & Grid Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-neutral-100/70 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-neutral-100 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-black" />
              <span className="eyebrow-badge">STUDIO OPERATING MODEL</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-black tracking-tight font-display">
              How We Build Generational Software
            </h2>
          </div>
          <p className="text-xs font-mono text-neutral-500 max-w-md text-left sm:text-right">
            High-conviction venture engineering paired with institutional capital and enterprise distribution.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-neutral-50/80 hover:bg-neutral-100/80 border border-neutral-200/80 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xs"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl bg-black text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold uppercase px-2.5 py-1 rounded-full bg-white border border-neutral-200 text-neutral-600">
                    {pillar.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-black font-display tracking-tight mb-3 group-hover:text-neutral-700 transition-colors">
                  {pillar.title}
                </h3>

                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
