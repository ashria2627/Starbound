import React from 'react';

interface KidsGameSimulationProps {
  onExit: () => void;
}

export const Game: React.FC<KidsGameSimulationProps> = ({ onExit }) => {
  return (
    <div className="relative flex h-[calc(100vh-5rem)] w-full flex-col items-center justify-center bg-[#0b0d12] text-center">
      {/* Placeholder for the actual game canvas/engine */}
      <div className="flex h-64 w-full max-w-lg items-center justify-center rounded-3xl bg-[#12151d] text-[#9aa0a6]">
        [ Game simulation goes here ]
      </div>

      <p className="mt-6 max-w-sm text-sm text-[#9aa0a6]">
        This is a placeholder page for the new Play &amp; Explore game.
      </p>

      <button
        onClick={onExit}
        className="mt-8 rounded-full border border-white/20 px-6 py-2.5 text-sm font-medium text-[#9aa0a6] transition-colors hover:border-[#ece7dc]/50 hover:text-[#ece7dc]"
      >
        Back
      </button>
    </div>
  );
};