import React from 'react';
import { Rocket, Cpu, Users, Zap, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface StudioServicesProps {
  onOpenBooking: (serviceName?: string) => void;
}

export const StudioServices: React.FC<StudioServicesProps> = ({ onOpenBooking }) => {
  const services = [
    {
      id: 1,
      title: "Venture Co-Founding",
      tagline: "Day-0 to Series A Co-Building",
      description: "We partner with ambitious domain experts as institutional technical co-founders. We write production code, invest engineering sweat equity, and help recruit your core team.",
      deliverables: ["Full-Stack Architecture", "Production MVP", "Capital Network", "GTM Strategy"],
      icon: Rocket,
      highlight: "High Conviction"
    },
    {
      id: 2,
      title: "Enterprise AI & Cloud Foundry",
      tagline: "LLMs, Agents & Resilient Distributed Systems",
      description: "We architect private AI pipelines, fine-tuned domain models, intelligent autonomous agents, and zero-trust cloud foundations tailored for strict enterprise compliance.",
      deliverables: ["Custom AI Agent Pipelines", "Private LLM Hosting", "Multi-Cloud Infra", "SOC2 / HIPAA Standard"],
      icon: Cpu,
      highlight: "Enterprise Scale"
    },
    {
      id: 3,
      title: "Dedicated Engineering Pods",
      tagline: "High-Velocity Embedded Teams",
      description: "Scale your product roadmap rapidly with cross-functional pods of elite senior full-stack engineers, cloud architects, and product designers embedded directly into your sprint cycles.",
      deliverables: ["Fractional CTO / Lead", "Senior Full-Stack Engineers", "Continuous CI/CD", "Agile Velocity"],
      icon: Users,
      highlight: "Immediate Scale"
    },
    {
      id: 4,
      title: "Rapid 14-Day MVP Discovery",
      tagline: "De-Risk Market Demand in 2 Weeks",
      description: "A fast-paced discovery sprint designed to validate your customer thesis, engineer clickable prototypes, and stress-test unit economics before writing heavy code.",
      deliverables: ["Interactive Clickable Prototype", "Technical Blueprint", "Unit Economics Model", "De-Risked Roadmap"],
      icon: Zap,
      highlight: "2-Week Sprint"
    }
  ];

  return (
    <section id="services" className="my-16 sm:my-24">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-neutral-200 mb-10">
        <div>
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-neutral-500 block mb-2">
            Studio Capabilities & Practice Areas
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-black tracking-tight">
            How We Build For Clients & Founders
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-neutral-600 max-w-md font-normal leading-relaxed">
          Whether you need a full institutional technical co-founder or a dedicated engineering pod, we provide production-grade software execution.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <div
              key={service.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-2xs hover:shadow-md hover:border-black/50 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Top Badge & Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors duration-300 shadow-2xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold uppercase px-3 py-1 rounded-full bg-neutral-100 text-neutral-700">
                    {service.highlight}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold font-display text-black mb-1">
                  {service.title}
                </h3>
                <div className="text-xs font-mono text-neutral-500 mb-4 font-medium">
                  {service.tagline}
                </div>

                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal mb-6">
                  {service.description}
                </p>

                {/* Deliverables List */}
                <div className="space-y-2 pt-4 border-t border-neutral-100 mb-6">
                  <span className="text-[10px] font-mono uppercase text-neutral-400 font-semibold block mb-1">
                    Key Deliverables
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {service.deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-neutral-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-black shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onOpenBooking(service.title)}
                className="w-full py-3 rounded-2xl bg-neutral-50 hover:bg-black hover:text-white text-black text-xs font-mono font-semibold transition-all flex items-center justify-center gap-2 border border-neutral-200/80 group-hover:border-black"
              >
                <span>Engage on {service.title}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};
