import React, { useRef } from 'react';
import { StudioService } from '../types';
import { Rocket, Cpu, Users, Zap, ArrowUpRight, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

interface StudioServicesProps {
  services?: StudioService[];
}

const defaultServices: StudioService[] = [
  {
    id: 1,
    title: "Venture Co-Founding",
    slug: "venture-co-founding",
    tagline: "Day-0 to Series A Co-Building",
    description: "We partner with ambitious domain experts as institutional technical co-founders. We write production code, invest engineering sweat equity, and help recruit your core team.",
    deliverables: ["Full-Stack Architecture", "Production MVP", "Capital Network", "GTM Strategy"],
    icon: "rocket",
    highlight: "High Conviction"
  },
  {
    id: 2,
    title: "Enterprise AI & Cloud Foundry",
    slug: "enterprise-ai-cloud",
    tagline: "LLMs, Agents & Distributed Systems",
    description: "We architect private AI pipelines, fine-tuned domain models, intelligent autonomous agents, and zero-trust cloud foundations tailored for strict enterprise compliance.",
    deliverables: ["Custom AI Agent Pipelines", "Private LLM Hosting", "Multi-Cloud Infra", "SOC2 / HIPAA Standard"],
    icon: "cpu",
    highlight: "Enterprise Scale"
  },
  {
    id: 3,
    title: "Dedicated Engineering Pods",
    slug: "dedicated-engineering-pods",
    tagline: "High-Velocity Embedded Teams",
    description: "Scale your product roadmap rapidly with cross-functional pods of elite senior full-stack engineers, cloud architects, and product designers embedded directly into your sprint cycles.",
    deliverables: ["Fractional CTO / Lead", "Senior Full-Stack Engineers", "Continuous CI/CD", "Agile Velocity"],
    icon: "users",
    highlight: "Immediate Scale"
  },
  {
    id: 4,
    title: "Rapid 14-Day MVP Discovery",
    slug: "rapid-mvp-discovery",
    tagline: "De-Risk Market Demand in 2 Weeks",
    description: "A fast-paced discovery sprint designed to validate your customer thesis, engineer clickable prototypes, and stress-test unit economics before writing heavy code.",
    deliverables: ["Interactive Clickable Prototype", "Technical Blueprint", "Unit Economics Model", "De-Risked Roadmap"],
    icon: "zap",
    highlight: "2-Week Sprint"
  }
];

export const StudioServices: React.FC<StudioServicesProps> = ({ services = defaultServices }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeServices = services && services.length > 0 ? services : defaultServices;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.85;

      if (direction === 'right') {
        if (scrollLeft + clientWidth >= scrollWidth - 25) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      } else {
        if (scrollLeft <= 25) {
          scrollRef.current.scrollTo({ left: scrollWidth, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }
      }
    }
  };

  const getIcon = (iconName: string) => {
    if (iconName === 'cpu') return Cpu;
    if (iconName === 'users') return Users;
    if (iconName === 'zap') return Zap;
    return Rocket;
  };

  return (
    <section id="services" className="my-14 sm:my-20 scroll-mt-24">
      {/* Clean Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-neutral-200 mb-8">
        <div>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-neutral-500 block mb-1.5">
            Practice Areas
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-black tracking-tight">
            How We Build For Clients & Founders
          </h2>
        </div>
      </div>

      {/* Relative Carousel Container with Side-End Hover Buttons */}
      <div className="relative group">
        {/* Left End Floating Nav Button */}
        <button
          onClick={() => scroll('left')}
          className="absolute -left-2 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-white/95 backdrop-blur-md border border-neutral-300 shadow-xl hover:bg-black hover:text-white hover:border-black transition-all flex items-center justify-center opacity-80 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-110 active:scale-95 text-black"
          title="Scroll Left (Loops to end)"
          aria-label="Previous Practice"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Right End Floating Nav Button */}
        <button
          onClick={() => scroll('right')}
          className="absolute -right-2 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-white/95 backdrop-blur-md border border-neutral-300 shadow-xl hover:bg-black hover:text-white hover:border-black transition-all flex items-center justify-center opacity-80 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-110 active:scale-95 text-black"
          title="Scroll Right (Loops to start)"
          aria-label="Next Practice"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Horizontal Sliding Track */}
        <div
          ref={scrollRef}
          className="flex gap-5 sm:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4 pt-1 px-1"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {activeServices.map((service) => {
            const Icon = getIcon(service.icon);
            return (
              <div
                key={service.id}
                className="w-full sm:w-[calc(50%-12px)] min-w-[85vw] sm:min-w-[calc(50%-12px)] snap-center shrink-0 bg-white rounded-2xl p-6 sm:p-7 border border-neutral-200 shadow-2xs card-clean flex flex-col justify-between group/card"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-neutral-100 text-black flex items-center justify-center group-hover/card:bg-black group-hover/card:text-white transition-colors duration-200 shadow-2xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-semibold uppercase px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
                      {service.highlight || 'Practice Area'}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold font-display text-black mb-1">
                    {service.title}
                  </h3>
                  <div className="text-xs font-mono text-neutral-500 mb-3 font-medium">
                    {service.tagline}
                  </div>

                  <p className="text-xs text-neutral-600 leading-relaxed font-normal mb-5">
                    {service.description}
                  </p>

                  <div className="space-y-1.5 pt-3 border-t border-neutral-100 mb-5">
                    <span className="text-[10px] font-mono uppercase text-neutral-400 font-semibold block mb-1">
                      Key Deliverables
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {service.deliverables.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-xs text-neutral-700 font-medium">
                          <CheckCircle2 className="w-3 h-3 text-black shrink-0" />
                          <span className="truncate">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <a
                  href="#contact"
                  className="w-full py-2.5 rounded-xl bg-neutral-50 hover:bg-black hover:text-white text-black text-xs font-mono font-semibold transition-all flex items-center justify-center gap-2 border border-neutral-200/80 group-hover/card:border-black text-center"
                >
                  <span>Engage on {service.title}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
