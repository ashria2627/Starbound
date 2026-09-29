import React from 'react';
import { ArrowRight, Compass, Radio, Sparkles, Rocket } from 'lucide-react';
import { FrontierId } from '../types';
import { FRONTIERS, BOT_MISSIONS } from '../data/missions';

interface FrontierPickerProps {
  onSelect: (frontier: FrontierId) => void;
  unlockedBadges: string[];
}

export const FrontierPicker: React.FC<FrontierPickerProps> = ({ onSelect, unlockedBadges }) => {
  const frontiers: FrontierId[] = ['moon', 'mars', 'deep'];
  const pickerIntro = "Three amazing worlds where our robot friends have ventured! Pick a frontier to meet the first bot sent, the greatest standout, and our latest explorers.";

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Editorial Header */}
      <div className="mb-10 max-w-2xl">
        <span className="rounded-full bg-cyan-500/10 border border-cyan-400/30 px-3 py-1 font-sans text-xs font-bold uppercase tracking-widest text-cyan-300">
          Step 01 · Pick Your World
        </span>
        <h2 className="mt-3 font-serif text-3xl font-normal tracking-tight text-[#ece7dc] sm:text-4xl text-balance">
          Choose a Frontier to Explore
        </h2>
        <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <p className="text-base text-[#ece7dc]/90 font-sans leading-relaxed">
            {pickerIntro}
          </p>
        </div>
      </div>

      {/* Three Large Clickable Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {frontiers.map((fId) => {
          const frontier = FRONTIERS[fId];
          const botsInFrontier = BOT_MISSIONS.filter((b) => b.frontierId === fId);
          const unlockedInFrontier = botsInFrontier.filter((b) =>
            unlockedBadges.includes(b.badge.id)
          ).length;

          // Unique visual themes per frontier as specified
          const isMoon = fId === 'moon';
          const isMars = fId === 'mars';
          const isDeep = fId === 'deep';

          return (
            <div
              key={fId}
              onClick={() => onSelect(fId)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelect(fId);
                }
              }}
              role="button"
              tabIndex={0}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 p-6 text-left transition-all duration-200 cursor-pointer shadow-xl hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                isMoon
                  ? 'border-cyan-400/40 bg-[#121724] hover:border-cyan-300 hover:bg-[#161f30] focus-visible:outline-cyan-400'
                  : isMars
                  ? 'border-amber-500/40 bg-[#1a1214] hover:border-amber-400 hover:bg-[#221518] focus-visible:outline-amber-500'
                  : 'border-indigo-500/40 bg-[#0d0f24] hover:border-indigo-400 hover:bg-[#121434] focus-visible:outline-indigo-400'
              }`}
            >
              {/* Background ambient graphic / subtle constellation */}
              <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 opacity-20 transition-opacity group-hover:opacity-40">
                {isMoon && (
                  <svg viewBox="0 0 100 100" className="h-full w-full fill-none stroke-cyan-400">
                    <circle cx="60" cy="40" r="30" strokeWidth="1.5" />
                    <circle cx="50" cy="35" r="8" strokeWidth="1" />
                    <circle cx="70" cy="50" r="6" strokeWidth="1" />
                  </svg>
                )}
                {isMars && (
                  <svg viewBox="0 0 100 100" className="h-full w-full fill-none stroke-amber-400">
                    <circle cx="60" cy="40" r="32" strokeWidth="1.5" />
                    <path d="M 35 40 Q 60 55 85 45" strokeWidth="1" />
                    <ellipse cx="60" cy="18" rx="10" ry="3" strokeWidth="1" />
                  </svg>
                )}
                {isDeep && (
                  <svg viewBox="0 0 100 100" className="h-full w-full fill-none stroke-indigo-400">
                    <circle cx="60" cy="40" r="4" fill="#818cf8" />
                    <circle cx="60" cy="40" r="16" strokeDasharray="3 3" strokeWidth="1" />
                    <circle cx="60" cy="40" r="28" strokeDasharray="4 4" strokeWidth="1" />
                    <line x1="30" y1="40" x2="90" y2="40" strokeWidth="0.75" />
                  </svg>
                )}
              </div>

              {/* Card Header & Unboxed metadata */}
              <div className="z-10">
                <div className="flex items-center justify-between text-xs font-sans">
                  <span className="font-bold text-amber-300 uppercase tracking-wider">{frontier.subtitle}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono rounded-full bg-white/10 px-2 py-0.5 text-xs text-white">
                      {unlockedInFrontier}/3 Explored
                    </span>
                  </div>
                </div>

                <h3
                  className={`mt-4 font-serif text-3xl font-normal transition-colors ${
                    isMoon
                      ? 'text-[#ece7dc] group-hover:text-cyan-200'
                      : isMars
                      ? 'text-[#ece7dc] group-hover:text-amber-300'
                      : 'text-[#ece7dc] group-hover:text-indigo-200'
                  }`}
                >
                  {frontier.name}
                </h3>

                {/* One-line description of why we send robots there */}
                <p className="mt-4 text-sm leading-relaxed text-[#ece7dc]/80 group-hover:text-[#ece7dc] transition-colors font-sans">
                  {frontier.summary}
                </p>
              </div>

              {/* Card Footer: Bot Preview Teasers & CTA */}
              <div className="z-10 mt-8 pt-4 border-t border-white/10">
                <div className="mb-4 space-y-1.5">
                  {botsInFrontier.map((bot) => (
                    <div
                      key={bot.id}
                      className="flex items-center justify-between text-xs font-sans text-[#ece7dc]/70"
                    >
                      <span className="truncate pr-2 font-medium">{bot.name}</span>
                      <span className="shrink-0 font-mono text-[11px] text-amber-300/90">{bot.launchYear.split(' ')[0]}</span>
                    </div>
                  ))}
                </div>

                <div
                  className={`flex items-center justify-between font-sans text-xs uppercase tracking-wider font-bold ${
                    isMoon
                      ? 'text-cyan-300 group-hover:text-white'
                      : isMars
                      ? 'text-amber-400 group-hover:text-amber-200'
                      : 'text-indigo-300 group-hover:text-white'
                  }`}
                >
                  <span>Meet These 3 Robots</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};