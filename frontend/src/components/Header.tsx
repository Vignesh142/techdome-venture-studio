import React, { useState } from 'react';
import { LayoutDashboard, Calendar, Menu, X, ArrowUpRight } from 'lucide-react';

interface HeaderProps {
  onNavigateHome: () => void;
  onOpenAdmin: () => void;
  onOpenBooking: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigateHome,
  onOpenAdmin,
  onOpenBooking,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  return (
    <header className="sticky top-0 z-40 w-full studio-glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 h-18 sm:h-20 flex items-center justify-between">
        {/* Official Brand Logo Wordmark */}
        <div 
          onClick={onNavigateHome}
          className="flex items-center gap-3 cursor-pointer group select-none"
          role="button"
          tabIndex={0}
        >
          <img
            src="/techdome.png"
            alt="Techdome"
            className="h-7 sm:h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <span className="hidden sm:inline-block font-mono text-[10px] text-neutral-400 uppercase tracking-widest pl-3 border-l border-neutral-300 font-semibold">
            Venture Studio
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-mono text-neutral-600 font-medium">
          <a href="#services" className="hover:text-black transition-colors">Practice Areas</a>
          <a href="#portfolio" className="hover:text-black transition-colors">Ventures & Portfolio</a>
          <a href="#engagement" className="hover:text-black transition-colors">Engagement Models</a>
          <a href="#pipeline" className="hover:text-black transition-colors">Pipeline</a>
        </nav>

        {/* Right Action CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          {/* CMS Admin Studio Button */}
          <button
            onClick={onOpenAdmin}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-black text-xs font-semibold font-mono transition-all"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>CMS Studio</span>
          </button>

          {/* Primary Lead Conversion CTA: Book a Call */}
          <button
            onClick={onOpenBooking}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-semibold font-mono transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Schedule Discovery Call</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={onOpenBooking}
            className="px-3 py-1.5 rounded-lg bg-black text-white text-[11px] font-mono font-semibold"
          >
            Book Call
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl border border-neutral-200 text-black"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-neutral-200 px-6 py-5 space-y-4 animate-in slide-in-from-top-4">
          <nav className="flex flex-col space-y-3 text-xs font-mono">
            <a 
              href="#services" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-neutral-700 hover:text-black py-1 flex items-center justify-between"
            >
              <span>Practice Areas</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
            </a>
            <a 
              href="#portfolio" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-neutral-700 hover:text-black py-1 flex items-center justify-between"
            >
              <span>Ventures & Portfolio</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
            </a>
            <a 
              href="#engagement" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-neutral-700 hover:text-black py-1 flex items-center justify-between"
            >
              <span>Engagement Models</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
            </a>
            <a 
              href="#pipeline" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-neutral-700 hover:text-black py-1 flex items-center justify-between"
            >
              <span>Stage Tracker</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
            </a>
          </nav>

          <div className="pt-4 border-t border-neutral-100 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-3 rounded-xl bg-black text-white text-xs font-mono font-semibold flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule Discovery Call</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full py-2.5 rounded-xl border border-neutral-200 text-black text-xs font-mono font-semibold flex items-center justify-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Open CMS Studio (/admin)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
