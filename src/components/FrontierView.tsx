import React from 'react';
import { ArrowLeft, ArrowRight, Award, CheckCircle2, Play, Sparkles, BookOpen } from 'lucide-react';
import { FrontierId, BotMission } from '../types';
import { FRONTIERS, BOT_MISSIONS } from '../data/missions';

interface FrontierViewProps {
  frontierId: FrontierId;
  onBackToPicker: () => void;
  onSelectFrontier: (frontierId: FrontierId) => void;
  onSelectBot: (bot: BotMission) => void;
  onLaunchSimulation: (bot: BotMission) => void;
  unlockedBadges: string[];
}

export const FrontierView: React.FC<FrontierViewProps> = ({
  frontierId,
  onBackToPicker,
  onSelectFrontier,
  onSelectBot,
  onLaunchSimulation,
  unlockedBadges,
}) => {
  const frontier = FRONTIERS[frontierId];
  const bots = BOT_MISSIONS.filter((b) => b.frontierId === frontierId);

  const frontierTabs: { id: FrontierId; label: string }[] = [
    { id: 'moon', label: 'Moon' },
    { id: 'mars', label: 'Mars' },
    { id: 'deep', label: 'Deep Space' },
  ];

  const isMoon = frontierId === 'moon';
  const isMars = frontierId === 'mars';
  const isDeep = frontierId === 'deep';

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Top controls: Back to all frontiers + Frontier switcher tabs */}
      <div className="mb-8 flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center">
        <button
          onClick={onBackToPicker}
          className="inline-flex items-center gap-2 font-sans text-xs font-bold text-cyan-300 transition-colors hover:text-white cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>← Back to All Worlds</span>
        </button>

        {/* Frontier Switcher Tabs (functional buttons) */}
        <div className="flex items-center gap-1.5 rounded-2xl border border-white/15 bg-white/5 p-1.5 shadow-lg">
          {frontierTabs.map((tab) => {
            const isActive = tab.id === frontierId;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectFrontier(tab.id)}
                className={`px-4 py-2 font-sans text-xs font-bold transition-all rounded-xl cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-black shadow-md font-extrabold scale-105'
                    : 'text-[#9aa0a6] hover:text-[#ece7dc]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Frontier Headline Banner */}
      <div className="mb-10">
        <div className="flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-wider text-amber-300">
          <span>World Explorer</span>
          <span aria-hidden="true">·</span>
          <span>{frontier.subtitle}</span>
        </div>
        <h2 className="mt-2 font-serif text-3xl font-normal text-[#ece7dc] sm:text-5xl">
          {frontier.name}
        </h2>
        <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <p className="max-w-3xl text-base text-[#ece7dc]/90 sm:text-lg font-sans leading-relaxed">
            {frontier.summary}
          </p>
        </div>
      </div>

      {/* Three Bot Cards: First Ever Sent, The Standout, Most Recent / Still Active */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {bots.map((bot) => {
          const isUnlocked = unlockedBadges.includes(bot.badge.id);

          return (
            <div
              key={bot.id}
              className={`group relative flex flex-col justify-between rounded-3xl border-2 p-6 text-left transition-all duration-200 shadow-xl hover:scale-[1.02] ${
                isMoon
                  ? 'border-cyan-400/40 bg-[#121724] hover:border-cyan-300'
                  : isMars
                  ? 'border-amber-500/40 bg-[#191114] hover:border-amber-400'
                  : 'border-indigo-500/40 bg-[#0d0f22] hover:border-indigo-400'
              }`}
            >
              <div>
                {/* Category kicker */}
                <div className="flex items-center justify-between text-xs font-sans">
                  <span className="uppercase tracking-wider font-bold text-amber-300">
                    {bot.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-[#9aa0a6]">{bot.launchYear}</span>
                  </div>
                </div>

                {/* Bot Name */}
                <h3 className="mt-4 font-serif text-2xl font-normal text-[#ece7dc] group-hover:text-white transition-colors">
                  {bot.name}
                </h3>

                {/* Metadata */}
                <div className="mt-2 flex flex-wrap items-center gap-1.5 font-sans text-xs text-[#ece7dc]/70">
                  <span className="font-semibold text-amber-400">{bot.operator}</span>
                  <span aria-hidden="true">·</span>
                  <span>{bot.location}</span>
                </div>

                {/* Teaser */}
                <p className="mt-4 text-sm leading-relaxed text-[#ece7dc]/80 font-sans group-hover:text-[#ece7dc] transition-colors">
                  {bot.teaser}
                </p>

                {/* Points of interest count */}
                <div className="mt-4 flex items-center gap-1.5 font-sans text-xs font-semibold text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-400/20">
                  <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                  <span>{bot.simulationPOIs.length} Real Science Landmarks in 3D Simulator</span>
                </div>
              </div>

              {/* Status and Action footer */}
              <div className="mt-8 border-t border-white/10 pt-4">
                <div className="mb-4 flex items-center justify-between font-sans text-xs">
                  <span className="text-[#9aa0a6] font-bold">Status:</span>
                  <span className="text-right text-[#ece7dc] font-medium truncate max-w-[180px]">
                    {bot.status}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectBot(bot)}
                    className="inline-flex items-center gap-1 font-sans text-xs font-bold text-cyan-300 hover:text-white cursor-pointer px-2 py-1"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>Story & Badges</span>
                  </button>

                  <button
                    onClick={() => onLaunchSimulation(bot)}
                    className="flex items-center gap-1.5 rounded-2xl border-2 border-amber-400 bg-amber-500 px-4 py-2 font-sans text-xs font-bold text-black shadow-lg hover:scale-105 transition-transform cursor-pointer"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>3D POV</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};