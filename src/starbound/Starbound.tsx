import React, { useState, Suspense } from 'react';
import { GameProvider, useGame } from './state/GameContext';
import { FontLoader } from './ui/FontLoader';
import { LandingScreen } from './screens/LandingScreen';
import { MissionIntro } from './screens/MissionIntro';
import { MissionComplete } from './screens/MissionComplete';
import { FinalScreen } from './screens/FinalScreen';
import { MarsGameScene } from './three/MarsGameScene';
import { Hud } from './ui/Hud';
import { TouchControls, TouchInputState } from './ui/TouchControls';
import { DiscoveryCard } from './ui/DiscoveryCard';
import { DiscoveryJournal } from './ui/DiscoveryJournal';
import { THEME_COLORS } from './config';

// Loading fallback while Three.js initializes
const LoadingScreen: React.FC = () => (
  <div
    className="w-full h-full flex flex-col items-center justify-center p-6 text-center select-none font-['Plus_Jakarta_Sans']"
    style={{ backgroundColor: THEME_COLORS.bgRust }}
  >
    <div className="w-12 h-12 border-4 border-[#C44810] border-t-[#F2D9A4] rounded-full animate-spin mb-4" />
    <h2 className="text-xl font-bold font-['Fraunces'] text-[#EFE7D8]">
      Preparing Mars Orbit...
    </h2>
    <p className="text-xs text-[#F2D9A4]/70 mt-1">
      Polishing solar panels and calibrating rover cameras
    </p>
  </div>
);

const IDLE_TOUCH_INPUT: TouchInputState = {
  forward: false,
  backward: false,
  left: false,
  right: false,
};

// Inner Screen State Machine
const StarboundGameContent: React.FC = () => {
  const { state, dispatch, currentMission } = useGame();

  // Touch control inputs
  const [touchInput, setTouchInput] = useState<TouchInputState>(IDLE_TOUCH_INPUT);

  const handleTouchInput = (partial: Partial<TouchInputState>) => {
    setTouchInput((prev) => ({ ...prev, ...partial }));
  };

  const handleRockRover = (dir: 'forward' | 'backward') => {
    dispatch({ type: 'ROCK_ROVER', direction: dir });
  };

  const hasLanded = state.screen !== 'landing' && state.screen !== 'zooming';

  return (
    <div
      className="relative w-full h-full overflow-hidden select-none"
      style={{ backgroundColor: THEME_COLORS.bgRust }}
    >
      <Suspense fallback={<LoadingScreen />}>
        {/* Screen 1: Landing & Zooming */}
        {(state.screen === 'landing' || state.screen === 'zooming') && (
          <LandingScreen
            isZooming={state.screen === 'zooming'}
            onStart={() => dispatch({ type: 'START_GAME' })}
            onZoomComplete={() => dispatch({ type: 'FINISH_ZOOM' })}
          />
        )}

        {/* Real 3D Mars Surface Viewport - stays mounted during all Mars exploration screens */}
        {hasLanded && (
          <div className="absolute inset-0 z-0">
            <MarsGameScene
              touchInput={state.screen === 'playing' ? touchInput : IDLE_TOUCH_INPUT}
              onNearDiscoveryChange={(targetId) => {
                dispatch({ type: 'SET_NEAR_SCAN_TARGET', targetId });
                // Found discoveries pop up automatically during active gameplay
                if (
                  state.screen === 'playing' &&
                  targetId &&
                  !state.discoveredIds.includes(targetId)
                ) {
                  dispatch({ type: 'TRIGGER_SCAN', discoveryId: targetId });
                }
              }}
            />
          </div>
        )}

        {/* Screen 2: Mission Intro Overlay */}
        {state.screen === 'intro' && (
          <MissionIntro
            mission={currentMission}
            onStart={() => dispatch({ type: 'START_MISSION' })}
          />
        )}

        {/* Screen 3: Active Mars Gameplay */}
        {state.screen === 'playing' && (
          <>
            {/* Always visible HUD */}
            <Hud />

            {/* Big friendly Touch Controls for tablet/phone */}
            <TouchControls
              onInput={handleTouchInput}
              isStuckMission={currentMission.type === 'stuck'}
              onRock={handleRockRover}
            />

            {/* Discovery Card Modal if a discovery was scanned */}
            {state.activeDiscovery && (
              <DiscoveryCard
                discovery={state.activeDiscovery}
                onClose={() => dispatch({ type: 'CLOSE_DISCOVERY' })}
              />
            )}

            {/* Field Journal Modal */}
            {state.isJournalOpen && (
              <DiscoveryJournal
                discoveredIds={state.discoveredIds}
                onClose={() => dispatch({ type: 'CLOSE_JOURNAL' })}
              />
            )}
          </>
        )}

        {/* Screen 4: Mission Complete Celebration */}
        {state.screen === 'complete' && (
          <MissionComplete
            onNext={() => dispatch({ type: 'NEXT_MISSION' })}
          />
        )}

        {/* Screen 5: Gentle Touching Finale */}
        {state.screen === 'final' && (
          <FinalScreen
            onRestart={() => dispatch({ type: 'RESTART_GAME' })}
          />
        )}
      </Suspense>
    </div>
  );
};

export const Starbound: React.FC = () => {
  return (
    <div
      className="w-full h-[100dvh] overflow-hidden"
      style={{ backgroundColor: THEME_COLORS.bgRust }}
    >
      <FontLoader />
      <GameProvider>
        <StarboundGameContent />
      </GameProvider>
    </div>
  );
};

export default Starbound;
