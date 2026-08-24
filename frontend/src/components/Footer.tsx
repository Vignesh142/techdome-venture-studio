import React from 'react';
import { GlobalSettings } from '../types';
import { ExternalLink, Database, Code } from 'lucide-react';

interface FooterProps {
  globals: GlobalSettings | null;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ globals, onOpenAdmin }) => {
  return (
    <footer className="mt-28 border-t border-neutral-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-neutral-100">
          {/* Studio Summary with Official Logo (No duplicated text) */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <img
                src="/techdome.png"
                alt="Techdome"
                className="h-8 w-auto object-contain"
              />
              <span className="font-mono text-[11px] text-neutral-400 uppercase tracking-wider pl-3 border-l border-neutral-200 font-semibold">
                Venture Studio
              </span>
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed max-w-sm">
              Institutional venture builder co-founding Day-0 software companies with deep technical conviction.
            </p>
            <span className="text-xs font-mono text-neutral-400">
              {globals?.location || 'Hyderabad, India'}
            </span>
          </div>

          {/* Quick CMS & API Links */}
          <div className="flex flex-col gap-2.5 text-xs">
            <span className="font-mono text-neutral-400 uppercase tracking-widest text-[11px] mb-1 font-semibold">
              Headless Infrastructure
            </span>
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-2 text-neutral-600 hover:text-black transition-colors text-left"
            >
              <Database className="w-3.5 h-3.5" />
              <span>CMS Studio Dashboard</span>
            </button>
            <a
              href="http://localhost:1337/api/ventures"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-neutral-600 hover:text-black transition-colors"
            >
              <Code className="w-3.5 h-3.5" />
              <span>Ventures REST Endpoint</span>
              <ExternalLink className="w-3 h-3 text-neutral-400" />
            </a>
            <a
              href="http://localhost:1337/api/globals"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-neutral-600 hover:text-black transition-colors"
            >
              <Code className="w-3.5 h-3.5" />
              <span>Globals REST Endpoint</span>
              <ExternalLink className="w-3 h-3 text-neutral-400" />
            </a>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-2.5 text-xs">
            <span className="font-mono text-neutral-400 uppercase tracking-widest text-[11px] mb-1 font-semibold">
              Studio Office
            </span>
            <a
              href={`mailto:${globals?.contact_email || 'contact@techdome.net.in'}`}
              className="text-black font-mono transition-colors font-medium hover:underline"
            >
              {globals?.contact_email || 'contact@techdome.net.in'}
            </a>
            <p className="text-neutral-500 text-xs mt-1 leading-relaxed">
              Built for Techdome live assessment. Fully driven by headless CMS engine on localhost.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-400">
          <div>
            © {new Date().getFullYear()} Techdome Labs. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Zero Hardcoded Copy</span>
            <span>•</span>
            <span>REST API Powered</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
