import React, { useState } from 'react';
import { Shield, Network, Activity, Cpu, Database, Layers, CheckCircle2 } from 'lucide-react';
import { VentureStage } from '../types';

interface VentureVisualProps {
  symbol?: string;
  pattern?: string;
  name: string;
  stage: VentureStage;
  imageUrl?: string;
}

export const VentureVisual: React.FC<VentureVisualProps> = ({
  symbol = 'shield',
  name,
  stage,
  imageUrl,
}) => {
  const [imageError, setImageError] = useState<boolean>(false);

  const getSymbolIcon = () => {
    switch (symbol) {
      case 'shield':
        return <Shield className="w-9 h-9 text-white" strokeWidth={1.5} />;
      case 'network':
        return <Network className="w-9 h-9 text-white" strokeWidth={1.5} />;
      case 'activity':
        return <Activity className="w-9 h-9 text-white" strokeWidth={1.5} />;
      case 'cpu':
        return <Cpu className="w-9 h-9 text-white" strokeWidth={1.5} />;
      case 'database':
        return <Database className="w-9 h-9 text-white" strokeWidth={1.5} />;
      default:
        return <Layers className="w-9 h-9 text-white" strokeWidth={1.5} />;
    }
  };

  // If real image is provided and hasn't errored
  if (imageUrl && !imageError) {
    return (
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 select-none group shadow-sm">
        {/* Real Product/Tech Image with subtle dark gradient overlay */}
        <img
          src={imageUrl}
          alt={name}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover group-hover:scale-108 group-hover:rotate-[0.5deg] transition-all duration-700 ease-out brightness-[0.9] contrast-[1.05]"
        />

        {/* Gradient Vignette for readable overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-mono text-white font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{stage}</span>
          </div>
          <span className="font-mono text-[10px] text-white/70 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md">
            SYS-0{name.length % 9 + 1}
          </span>
        </div>

        {/* Bottom Metadata */}
        <div className="absolute bottom-4 inset-x-4 flex items-center justify-between z-10 text-white text-xs font-mono">
          <span className="font-bold truncate text-white drop-shadow-sm">
            {name}
          </span>
          <span className="text-white/70 text-[10px]">
            v1.4
          </span>
        </div>
      </div>
    );
  }

  // Generative SVG Fallback Blueprint
  return (
    <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-neutral-950 via-neutral-900 to-black border border-neutral-800 flex flex-col justify-between p-6 select-none group shadow-inner">
      {/* Background Architectural Grid Lines */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Subtle Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.08)_0%,_transparent_70%)] pointer-events-none" />

      {/* Top Bar: Brand System ID & Live Pulse */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">
            {stage} · BUILD
          </span>
        </div>
        <span className="font-mono text-[10px] text-neutral-600">
          SYS-0{name.length % 9 + 1}
        </span>
      </div>

      {/* Center: Dynamic Animated Graphic / Product Emblem */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-24 h-24 rounded-full border border-neutral-700/60 animate-ping opacity-25" style={{ animationDuration: '4s' }} />
          <div className="absolute w-28 h-28 rounded-full border border-dashed border-neutral-700/80 animate-spin" style={{ animationDuration: '24s' }} />
          <div className="w-16 h-16 rounded-2xl bg-neutral-900/90 border border-neutral-700 flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            {getSymbolIcon()}
          </div>
        </div>

        {/* Live Status Pill */}
        <div className="mt-4 px-3 py-1 rounded-full bg-neutral-900/90 border border-neutral-800 text-[10px] font-mono text-neutral-300 flex items-center gap-1.5 shadow-sm">
          <CheckCircle2 className="w-3 h-3 text-white" />
          <span>Core Engine Active</span>
        </div>
      </div>

      {/* Bottom Technical Telemetry Bar */}
      <div className="relative z-10 flex items-center justify-between pt-3 border-t border-neutral-800/80 font-mono text-[10px] text-neutral-500">
        <span className="truncate max-w-[140px] text-neutral-400 font-medium">
          {name}
        </span>
        <span className="text-neutral-500">
          v1.4.0
        </span>
      </div>
    </div>
  );
};
