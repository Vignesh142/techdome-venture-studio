import React from 'react';
import { StageFilter, Venture } from '../types';

interface StageFilterBarProps {
  currentFilter: StageFilter;
  onFilterChange: (filter: StageFilter) => void;
  ventures: Venture[];
}

export const StageFilterBar: React.FC<StageFilterBarProps> = ({
  currentFilter,
  onFilterChange,
  ventures,
}) => {
  const counts = {
    All: ventures.length,
    Launched: ventures.filter(v => v.stage === 'Launched').length,
    Building: ventures.filter(v => v.stage === 'Building').length,
    Exited: ventures.filter(v => v.stage === 'Exited').length,
  };

  const filters: StageFilter[] = ['All', 'Launched', 'Building', 'Exited'];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
      {filters.map((filter) => {
        const isActive = currentFilter === filter;
        return (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono transition-all duration-200 ${
              isActive
                ? 'bg-black text-white font-semibold shadow-xs'
                : 'bg-white text-neutral-600 hover:text-black hover:bg-neutral-50 border border-neutral-200'
            }`}
          >
            <span>{filter}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              isActive ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-600 font-semibold'
            }`}>
              {counts[filter]}
            </span>
          </button>
        );
      })}
    </div>
  );
};
