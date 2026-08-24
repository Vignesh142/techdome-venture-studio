import React from 'react';
import { Check, ArrowRight, ShieldCheck, Zap, Handshake } from 'lucide-react';

interface EngagementModelsProps {
  onOpenBooking: (tierName?: string) => void;
}

export const EngagementModels: React.FC<EngagementModelsProps> = ({ onOpenBooking }) => {
  const models = [
    {
      id: 1,
      title: "Venture Co-Founding",
      badge: "Equity & Shared Risk",
      description: "For visionary founders with a high-conviction market thesis seeking an institutional technical co-founder.",
      features: [
        "Sweat equity co-building",
        "Day-0 architecture & MVP build",
        "Initial seed funding support",
        "Technical leadership until Series A"
      ],
      cta: "Pitch Your Venture",
      icon: Handshake,
      featured: true
    },
    {
      id: 2,
      title: "Fixed-Scope Foundry Sprints",
      badge: "Fixed Timeline & Budget",
      description: "For startups and enterprises wanting a rapid MVP, AI prototype, or critical feature sprint delivered in weeks.",
      features: [
        "14 to 30-day delivery cycles",
        "Guaranteed milestone deliverables",
        "Full IP ownership transfer",
        "Comprehensive documentation"
      ],
      cta: "Book a Sprint",
      icon: Zap,
      featured: false
    },
    {
      id: 3,
      title: "Dedicated Engineering Pods",
      badge: "Monthly Retainer",
      description: "For scaling growth companies needing full-stack engineers and fractional technical leadership.",
      features: [
        "Senior engineering pods (2 to 8 devs)",
        "Direct sprint integration",
        "Fractional CTO oversight",
        "Flexible 3-month rolling agreements"
      ],
      cta: "Hire an Engineering Pod",
      icon: ShieldCheck,
      featured: false
    }
  ];

  return (
    <section id="engagement" className="my-16 sm:my-24">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="font-mono text-xs font-semibold uppercase tracking-widest text-neutral-500 block mb-2">
          Transparent Partnership Structures
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold font-display text-black tracking-tight mb-4">
          Flexible Engagement Models
        </h2>
        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
          Choose the partnership structure that matches your venture's stage, capital strategy, and delivery timeline.
        </p>
      </div>

      {/* 3-Column Models Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {models.map((model) => {
          const Icon = model.icon;
          return (
            <div
              key={model.id}
              className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                model.featured
                  ? 'bg-black text-white shadow-xl scale-[1.02] border border-black'
                  : 'bg-white text-black border border-neutral-200 shadow-2xs hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                    model.featured ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-black'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-mono font-semibold uppercase px-3 py-1 rounded-full ${
                    model.featured ? 'bg-neutral-800 text-white border border-neutral-700' : 'bg-neutral-100 text-neutral-700'
                  }`}>
                    {model.badge}
                  </span>
                </div>

                <h3 className="text-2xl font-bold font-display tracking-tight mb-2">
                  {model.title}
                </h3>
                <p className={`text-xs leading-relaxed mb-6 font-normal ${
                  model.featured ? 'text-neutral-300' : 'text-neutral-600'
                }`}>
                  {model.description}
                </p>

                {/* Features */}
                <div className={`space-y-3 pt-6 border-t mb-8 ${
                  model.featured ? 'border-neutral-800' : 'border-neutral-100'
                }`}>
                  {model.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs font-medium">
                      <Check className={`w-4 h-4 shrink-0 mt-0.5 ${
                        model.featured ? 'text-emerald-400' : 'text-black'
                      }`} />
                      <span className={model.featured ? 'text-neutral-200' : 'text-neutral-700'}>
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Button */}
              <button
                onClick={() => onOpenBooking(model.title)}
                className={`w-full py-3.5 rounded-2xl text-xs font-mono font-semibold transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm ${
                  model.featured
                    ? 'bg-white text-black hover:bg-neutral-100'
                    : 'bg-black text-white hover:bg-neutral-800'
                }`}
              >
                <span>{model.cta}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};
