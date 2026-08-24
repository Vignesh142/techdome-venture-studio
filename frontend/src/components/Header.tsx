import React, { useEffect, useState } from 'react';
import { cmsClient } from '../api/cmsClient';
import { RefreshCw, LayoutDashboard } from 'lucide-react';

interface HeaderProps {
  onNavigateHome: () => void;
  onOpenAdmin: () => void;
  onRefreshData?: () => void;
  isRefreshing?: boolean;
  isAdminView?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigateHome,
  onOpenAdmin,
  onRefreshData,
  isRefreshing = false,
  isAdminView = false,
}) => {
  const [cmsOnline, setCmsOnline] = useState<boolean | null>(null);

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
    <header className="sticky top-0 z-50 w-full studio-glass backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
        {/* Official Brand Logo (Clean, no duplicated text) */}
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

        {/* Center / Right status & CMS links */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Live CMS Status Indicator */}
          <div 
            className={`hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono border transition-colors ${
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
            <span className="tracking-tight font-medium">
              {cmsOnline === true ? 'CMS LIVE · 1337' : cmsOnline === false ? 'CMS OFFLINE' : 'CHECKING'}
            </span>
          </div>

          {/* Quick Refresh Button */}
          {onRefreshData && !isAdminView && (
            <button
              onClick={onRefreshData}
              disabled={isRefreshing}
              className="p-2.5 rounded-xl bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-700 hover:text-black transition-all text-xs font-mono flex items-center gap-1.5 shadow-2xs"
              title="Refresh live data from CMS"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-black' : ''}`} />
              <span className="hidden sm:inline">Sync CMS</span>
            </button>
          )}

          {/* CMS Admin Studio Button */}
          <button
            onClick={onOpenAdmin}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-semibold font-mono transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>CMS Studio</span>
          </button>
        </div>
      </div>
    </header>
  );
};
