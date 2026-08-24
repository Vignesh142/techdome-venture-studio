import React from 'react';
import { VentureStage } from '../types';

interface StageBadgeProps {
  stage: VentureStage;
  className?: string;
}

export const StageBadge: React.FC<StageBadgeProps> = ({ stage, className = '' }) => {
  const getBadgeStyle = () => {
    switch (stage) {
      case 'Launched':
        return {
          container: 'bg-white text-neutral-950 border-white font-semibold',
          dot: 'bg-neutral-950',
          label: 'Launched',
        };
      case 'Building':
        return {
          container: 'bg-neutral-900 text-neutral-200 border-neutral-700',
          dot: 'bg-white animate-pulse',
          label: 'Building',
        };
      case 'Exited':
        return {
          container: 'bg-transparent text-neutral-400 border-neutral-800 border-dashed',
          dot: 'bg-neutral-500',
          label: 'Exited',
        };
      default:
        return {
          container: 'bg-neutral-900 text-neutral-400 border-neutral-800',
          dot: 'bg-neutral-600',
          label: stage,
        };
    }
  };

  const style = getBadgeStyle();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono tracking-wider uppercase border transition-all ${style.container} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
      <span>{style.label}</span>
    </span>
  );
};
