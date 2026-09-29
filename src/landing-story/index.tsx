import React, { useState, useEffect } from 'react';
import { Page1SolarSystem } from './components/Page1SolarSystem';
import { Page2Sputnik } from './components/Page2Sputnik';
import { Page3ChooseDestination } from './components/Page3ChooseDestination';
import { Page4MarsPath } from './components/Page4MarsPath';
import { Page5MoonPath } from './components/Page5MoonPath';
import { Page6DeepSpacePath } from './components/Page6DeepSpacePath';
import { Page7Finale } from './components/Page7Finale';
import { StorybookStateMachine } from './components/StorybookStateMachine';
import { DestinationChoice } from './types';
import { setSoundEnabled, playBloop, playPageTurn } from './utils/sound';
import {
  setSpeechEnabled,
  setAutoSpeakEnabled,
  registerSpeechListener,
  stopSpeaking,
  CharacterVoice,
} from './utils/speech';

export interface StorybookProps {
  initialDestination?: DestinationChoice | null;
  onComplete?: () => void;
  className?: string;
}

export const LandingStory: React.FC<StorybookProps> = ({
  initialDestination = null,
  className = '',
}) => {
  const [selectedDestination, setSelectedDestination] = useState<DestinationChoice | null>(initialDestination);
  const [soundOn, setSoundOn] = useState<boolean>(false);
  const [autoSpeak, setAutoSpeak] = useState<boolean>(false);
  const [activeSpeaker, setActiveSpeaker] = useState<{ isSpeaking: boolean; character?: CharacterVoice }>({
    isSpeaking: false,
  });

  useEffect(() => {
    // Auto-narration and ambient/scene audio are OFF by default; manual
    // controls (ReadAloudButton, the sound toggle below) still work.
    setAutoSpeakEnabled(false);
    setSpeechEnabled(true);
    setSoundEnabled(false);
    const unregister = registerSpeechListener((isSpeaking, character) => {
      setActiveSpeaker({ isSpeaking, character });
    });
    return () => unregister();
  }, []);

  const handleSoundToggle = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    setSpeechEnabled(next);
    if (next) {
      playBloop(520);
    } else {
      stopSpeaking();
    }
  };

  const handleToggleAutoSpeak = () => {
    const next = !autoSpeak;
    setAutoSpeak(next);
    setAutoSpeakEnabled(next);
    if (!next) {
      stopSpeaking();
    } else {
      playBloop(640);
    }
  };

  const scrollToTop = () => {
    stopSpeaking();
    playPageTurn();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main
      className={`relative w-full min-h-screen bg-[#fff1dc] text-amber-900 selection:bg-orange-500 selection:text-white font-sans ${className}`}
    >
     
      <header className="fixed top-[6.75rem] left-3 right-3 z-40 flex items-center justify-between pointer-events-none">

        <div className="pointer-events-auto flex items-center gap-2">
           
          <button
            onClick={handleSoundToggle}
            className={`px-2.5 py-1 rounded-sm border text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
              soundOn
                ? 'bg-orange-950/80 border-orange-500/60 text-orange-300 hover:border-orange-400'
                : 'bg-slate-900/80 border-slate-700 text-slate-400'
            }`}
            title={soundOn ? 'Music and Voice are ON' : 'Audio is MUTED'}
          >
            <span>{soundOn ? '🔊' : '🔇'}</span>
            <span className="hidden sm:inline">{soundOn ? 'Audio ON' : 'Muted'}</span>
          </button>

      
          <button
            onClick={handleToggleAutoSpeak}
            className={`px-2.5 py-1 rounded-sm border text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
              autoSpeak
                ? 'bg-orange-800 border-orange-400 text-orange-200 hover:border-orange-300 shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                : 'bg-slate-900/80 border-slate-700 text-slate-400'
            }`}
            title={autoSpeak ? 'Auto-Voice is active! Characters read as you explore' : 'Auto-Voice is OFF. Tap to activate'}
          >
            <span>{autoSpeak ? '🗣️ Auto-Voice ON' : '🔇 Auto-Voice OFF'}</span>
          </button>
        </div>

        
        <div className="pointer-events-auto flex items-center gap-1">
          <StorybookStateMachine
            selectedDestination={selectedDestination}
            onSelectDestination={(dest) => setSelectedDestination(dest)}
            soundEnabled={soundOn}
            onToggleSound={handleSoundToggle}
            autoSpeak={autoSpeak}
            onToggleAutoSpeak={handleToggleAutoSpeak}
          />
        </div>
      </header>

  
      <Page1SolarSystem autoSpeak={autoSpeak} />
      <Page2Sputnik autoSpeak={autoSpeak} />

     
      <Page3ChooseDestination
        selectedDestination={selectedDestination}
        onSelectDestination={(dest) => setSelectedDestination(dest)}
      />

      {selectedDestination === 'mars' && (
        <Page4MarsPath
          key="mars"
          autoSpeak={autoSpeak}
          onSwitchDestination={(dest) => setSelectedDestination(dest)}
        />
      )}

      {selectedDestination === 'moon' && (
        <Page5MoonPath
          key="moon"
          autoSpeak={autoSpeak}
          onSwitchDestination={(dest) => setSelectedDestination(dest)}
        />
      )}

      {selectedDestination === 'deep_space' && (
        <Page6DeepSpacePath
          key="deep_space"
          
          onSwitchDestination={(dest) => setSelectedDestination(dest)}
        />
      )}

    
      <Page7Finale  onRestartStory={scrollToTop} />
    </main>
  );
};

export const OppyStory = LandingStory;
export default LandingStory;