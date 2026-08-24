import React from 'react';
import { Calendar, ArrowUpRight } from 'lucide-react';

interface FloatingCtaProps {
  onOpenBooking: () => void;
}

export const FloatingCta: React.FC<FloatingCtaProps> = ({ onOpenBooking }) => {
  return (
    <aside 
      aria-label="Floating discovery call action"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 animate-in fade-in slide-in-from-bottom-6 duration-500"
    >
      <button
        onClick={onOpenBooking}
        className="flex items-center gap-3 px-4 sm:px-5 py-3 rounded-full bg-black text-white shadow-2xl border border-neutral-800 hover:bg-neutral-900 transition-all duration-300 hover:scale-105 active:scale-95 group"
        title="Schedule Discovery Call with a Techdome Partner"
      >
        {/* Pulsing Availability Dot */}
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-mono text-neutral-400 uppercase hidden md:inline">
            Active Sprint
          </span>
        </div>

        <div className="h-3.5 w-px bg-neutral-700 hidden md:block" />

        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-white" />
          <span className="text-xs font-mono font-bold tracking-tight">
            Schedule Discovery Call
          </span>
        </div>

        <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
          <ArrowUpRight className="w-3.5 h-3.5" />
        </div>
      </button>
    </aside>
  );
};
