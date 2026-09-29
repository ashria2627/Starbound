import React from 'react';

interface KidsHomeProps {
  onPlay: () => void;
  onHearStory: () => void;
  onMeetParts: () => void;
  onDeepDive: () => void;
}

export const KidsHome: React.FC<KidsHomeProps> = ({ onPlay, onHearStory, onMeetParts, onDeepDive }) => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:py-20">
      <div className="text-center">
        <h1 className="font-serif text-3xl font-medium text-[#ece7dc] sm:text-5xl">
          Meet Oppy
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-[#9aa0a6] sm:text-base">
          A little rover who explored Mars for 15 years — way longer than
          anyone thought possible.
        </p>
      </div>

      {/* Oppy hero placeholder */}
      <div className="mx-auto mt-10 flex h-56 w-full max-w-md items-center justify-center rounded-3xl bg-[#1a1410] text-[#9aa0a6] sm:h-72">
        [ Oppy illustration / GLB viewer placeholder ]
      </div>

      <button
        className="mx-auto mt-6 block rounded-full bg-[#c1440e] px-8 py-3 text-base font-semibold text-white transition-transform hover:scale-105"
        onClick={onHearStory}
      >
        Hear Oppy's Story
      </button>

      {/* Action cards */}
      <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <button
          onClick={onPlay}
          className="rounded-2xl border border-white/10 bg-[#12151d] p-6 text-left transition-colors hover:border-[#c1440e]/50"
        >
          <div className="text-2xl">🚀</div>
          <div className="mt-3 font-semibold text-[#ece7dc]">Play &amp; Explore</div>
          <p className="mt-1 text-xs text-[#9aa0a6]">
            Drive a rover across Mars yourself.
          </p>
        </button>

        <button
          onClick={onMeetParts}
          className="rounded-2xl border border-white/10 bg-[#12151d] p-6 text-left transition-colors hover:border-[#7fd6e8]/50"
        >
          <div className="text-2xl">🧩</div>
          <div className="mt-3 font-semibold text-[#ece7dc]">Meet My Parts</div>
          <p className="mt-1 text-xs text-[#9aa0a6]">
            See what makes a rover tick.
          </p>
        </button>

        <button
          onClick={onDeepDive}
          className="rounded-2xl border border-white/10 bg-[#12151d] p-6 text-left transition-colors hover:border-[#ece7dc]/30"
        >
          <div className="text-2xl">🔬</div>
          <div className="mt-3 font-semibold text-[#ece7dc]">Grown-Up Mode</div>
          <p className="mt-1 text-xs text-[#9aa0a6]">
            Dig into the real mission details.
          </p>
        </button>
      </div>
    </div>
  );
};