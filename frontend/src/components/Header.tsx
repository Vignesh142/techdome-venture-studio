import React, { useEffect, useState } from 'react';
import { cmsClient } from '../api/cmsClient';
import { RefreshCw, LayoutDashboard, Calendar, Menu, X } from 'lucide-react';

interface HeaderProps {
  onNavigateHome: () => void;
  onOpenAdmin: () => void;
  onOpenBooking: () => void;
  onRefreshData?: () => void;
  isRefreshing?: boolean;
  isAdminView?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigateHome,
  onOpenAdmin,
  onOpenBooking,
  onRefreshData,
  isRefreshing = false,
  isAdminView = false,
}) => {
  const [cmsOnline, setCmsOnline] = useState<boolean | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const checkCms = async () => {
      try {
        await cmsClient.checkHealth();
        if (isMounted) setCmsOnline(true);
      } catch {
        if (isMounted) setCmsOnline(false);
      }
    };
    checkCms();
    const interval = setInterval(checkCms, 10000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-xl border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
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
            className="h-8 sm:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <span className="hidden sm:inline-block font-mono text-[10px] text-neutral-400 uppercase tracking-widest pl-3 border-l border-neutral-300 font-semibold">
            Venture Studio
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-mono text-neutral-600 font-medium">
          <a href="#services" className="hover:text-black transition-colors">Services</a>
          <a href="#portfolio" className="hover:text-black transition-colors">Ventures</a>
          <a href="#engagement" className="hover:text-black transition-colors">Engagement</a>
          <a href="#pipeline" className="hover:text-black transition-colors">Pipeline</a>
        </nav>

        {/* Right Action CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Live CMS Status Indicator */}
          <div 
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono border transition-colors ${
              cmsOnline === true 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200/80' 
                : cmsOnline === false 
                ? 'bg-red-50 text-red-700 border-red-200' 
                : 'bg-neutral-100 text-neutral-600 border-neutral-200'
            }`}
            title={cmsOnline ? "CMS Server connected on localhost:1337" : "CMS Server offline"}
          >
            <span className={`w-2 h-2 rounded-full ${
              cmsOnline === true 
                ? 'bg-emerald-500 animate-pulse' 
                : cmsOnline === false 
                ? 'bg-red-500' 
                : 'bg-neutral-400'
            }`} />
            <span className="tracking-tight font-medium text-[11px]">
              {cmsOnline === true ? 'CMS LIVE' : 'CMS OFFLINE'}
            </span>
          </div>

          {/* Sync Button */}
          {onRefreshData && !isAdminView && (
            <button
              onClick={onRefreshData}
              disabled={isRefreshing}
              className="p-2 rounded-xl bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-700 hover:text-black transition-all text-xs font-mono shadow-2xs"
              title="Sync CMS Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-black' : ''}`} />
            </button>
          )}

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
            <span>Book a Call</span>
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
              className="text-neutral-700 hover:text-black py-1"
            >
              Services & Capabilities
            </a>
            <a 
              href="#portfolio" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-neutral-700 hover:text-black py-1"
            >
              Ventures Portfolio
            </a>
            <a 
              href="#engagement" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-neutral-700 hover:text-black py-1"
            >
              Engagement Models
            </a>
            <a 
              href="#pipeline" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-neutral-700 hover:text-black py-1"
            >
              Stage Tracker
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
