import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { gameReducer, initialGameState, GameState, GameAction } from './gameReducer';
import { MISSIONS } from '../data/missions';
import { solarAudio } from '../three/solarAudio';

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  currentMission: (typeof MISSIONS)[number];
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);

  // Sync audio controller state with Web Audio synthesizer
  useEffect(() => {
    solarAudio.setAudioSettings(state.ambientSoundEnabled, state.roverSoundEnabled);
  }, [state.ambientSoundEnabled, state.roverSoundEnabled]);

  // Start ambient space audio on first user interaction if enabled
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (state.ambientSoundEnabled) {
        solarAudio.startAmbientSpace();
      }
    };
    window.addEventListener('pointerdown', handleFirstInteraction, { passive: true });
    window.addEventListener('keydown', handleFirstInteraction, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [state.ambientSoundEnabled]);

  // Stop rover drive sound when leaving active gameplay screen
  useEffect(() => {
    if (state.screen !== 'playing') {
      solarAudio.stopRoverDrive();
      solarAudio.stopCharging();
    }
  }, [state.screen]);

  // Clean up all audio on unmount
  useEffect(() => {
    return () => {
      solarAudio.stopAmbientSpace();
      solarAudio.stopRoverDrive();
      solarAudio.stopCharging();
    };
  }, []);

  // Time tracker when game is playing
  useEffect(() => {
    if (state.screen !== 'playing') return;
    const timer = setInterval(() => {
      dispatch({ type: 'TICK_TIME' });
    }, 1000);
    return () => clearInterval(timer);
  }, [state.screen]);

  // Orbit helper robot: if idle or playing for > 18s without finding anything, offer a friendly hint
  useEffect(() => {
    if (state.screen !== 'playing') return;
    const hintTimer = setTimeout(() => {
      const mission = MISSIONS[state.currentMissionIndex];
      if (mission) {
        dispatch({ type: 'SHOW_HINT', message: mission.hint });
      }
    }, 18000);
    return () => clearTimeout(hintTimer);
  }, [state.screen, state.currentMissionIndex]);

  const currentMission = MISSIONS[state.currentMissionIndex] || MISSIONS[0];

  return (
    <GameContext.Provider value={{ state, dispatch, currentMission }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
