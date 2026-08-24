import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface CmsErrorBannerProps {
  error: string;
  onRetry: () => void;
  isRetrying?: boolean;
}

export const CmsErrorBanner: React.FC<CmsErrorBannerProps> = ({ error, onRetry, isRetrying = false }) => {
  return (
    <div className="my-6 p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-md">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
        <div>
          <h4 className="text-sm font-semibold text-red-300">CMS Connection Notice</h4>
          <p className="text-xs text-red-300/80 mt-0.5">{error}</p>
        </div>
      </div>
      <button
        onClick={onRetry}
        disabled={isRetrying}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-xs font-semibold text-red-200 transition-colors shrink-0"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
        {isRetrying ? 'Reconnecting...' : 'Retry Connection'}
      </button>
    </div>
  );
};
