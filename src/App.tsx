/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar, AppView } from './components/Navbar';
import { KidsNavbar } from './components/KidsNavbar';
import { EntryScreen } from './components/EntryScreen';
import { KidsHome } from './components/KidsHome';
import { LandingStory as OppyStory } from './landing-story';
import { Recovery } from './components/Recovery';
import { ColdOpen } from './components/ColdOpen';
import { FrontierPicker } from './components/FrontierPicker';
import { FrontierView } from './components/FrontierView';
import { BotDetailPanel } from './components/BotDetailPanel';
import { ExplorationConsole } from './components/ExplorationConsole';
import { RoverAnatomy } from './components/RoverAnatomy';
import { MeetMyParts } from './components/MeetMyParts';
import Starbound from './starbound';
import { FrontierId, BotMission } from './types';
import { BOT_MISSIONS } from './data/missions';
import { AbandonedStories } from './components/AbandonedStories';
import { Mars } from './components/Mars';
import MarsRoverGame from './components/simulation/MarsRoverGame';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('entry');
  const [selectedFrontier, setSelectedFrontier] = useState<FrontierId | null>(null);
  const [selectedBot, setSelectedBot] = useState<BotMission | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);

  // Kids Mode is the default experience; persisted across sessions
  const [mode, setMode] = useState<'kids' | 'adult'>(() => {
    try {
      const saved = localStorage.getItem('abnf_mode');
      return saved === 'adult' ? 'adult' : 'kids';
    } catch {
      return 'kids';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('abnf_mode', mode);
    } catch {
      // storage fallback
    }
  }, [mode]);

  // Active bot for 3D First-Person Simulation (defaults to Opportunity, can switch to any of the 9 bots)
  const [simulationBot, setSimulationBot] = useState<BotMission>(() => {
    return BOT_MISSIONS.find((b) => b.id === 'opportunity') || BOT_MISSIONS[0];
  });

  // Unlocked badges (persisted across session)
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('abnf_unlocked_badges');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Unlocked 3D simulation POIs (persisted across session)
  const [unlockedPoiIds, setUnlockedPoiIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('abnf_unlocked_pois');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('abnf_unlocked_badges', JSON.stringify(unlockedBadges));
    } catch {
      // storage fallback
    }
  }, [unlockedBadges]);

  useEffect(() => {
    try {
      localStorage.setItem('abnf_unlocked_pois', JSON.stringify(unlockedPoiIds));
    } catch {
      // storage fallback
    }
  }, [unlockedPoiIds]);

  const handleUnlockBadge = (badgeId: string) => {
    setUnlockedBadges((prev) => {
      if (prev.includes(badgeId)) return prev;
      return [...prev, badgeId];
    });
  };

  const handleDiscoveryUnlocked = (poiId: string, botId: string) => {
    setUnlockedPoiIds((prev) => {
      if (prev.includes(poiId)) return prev;
      return [...prev, poiId];
    });

    // Also automatically unlock the bot's badge if reached
    const targetBot = BOT_MISSIONS.find((b) => b.id === botId);
    if (targetBot) {
      handleUnlockBadge(targetBot.badge.id);
    }
  };

  const handleOpenBot = (bot: BotMission) => {
    setSelectedBot(bot);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
  };

  const handleLaunchSimulationForBot = (bot: BotMission) => {
    setSimulationBot(bot);
    setCurrentView('simulation');
    setIsDetailOpen(false);
  };

  const handleFrontierSelect = (frontierId: FrontierId) => {
    setSelectedFrontier(frontierId);
    setCurrentView('frontiers');
  };

  const handleToggleMode = () => {
    if (mode === 'adult') {
      setMode('kids');
      setCurrentView('oppy-story');
    } else {
      setMode('adult');
      setCurrentView('coldopen');
    }
  };

  const totalBadges = BOT_MISSIONS.length;

  const isChromeless =
    currentView === 'simulation' ||
    currentView === 'rover-game' ||
    currentView === 'kids-game' ||
    currentView === 'entry';

  return (
    <div className={`flex min-h-screen flex-col selection:text-white ${
       mode === 'kids'? 'bg-[#fbe4b8] text-[#4a2413] selection:bg-[#c1440e]/20' : 'bg-[#0b0d12] text-[#ece7dc] selection:bg-[#c1440e]/30'
 }`}>

      {!isChromeless && mode === 'kids' && (
        <KidsNavbar
         
            onPlay={() => setCurrentView('kids-game')}
           onMeetParts={() => setCurrentView('meetmyparts')}
           onGrownUp={handleToggleMode}
           onLogoClick={() => setCurrentView('oppy-story')}

        />
      )}

      {!isChromeless && mode === 'adult' && (
        <Navbar
          currentView={currentView}
          onNavigate={(view) => {
            if (view === 'frontiers' && !selectedFrontier) {
              setSelectedFrontier('mars');
            }
            setCurrentView(view);
          }}
          unlockedBadgeCount={unlockedBadges.length}
          totalBadges={totalBadges}
          onSwitchToKids={handleToggleMode}
        />
      )}

      
      <main className="flex-1">
        {currentView === 'entry' && (
          <EntryScreen
            onStart={() => {
              setMode('kids');
              setCurrentView('oppy-story');
            }}
          />
        )}
         {currentView === 'kids-game' && (
  <div className="relative">
    <Starbound />
    <button
     onClick={() => setCurrentView(mode === 'adult' ? 'coldopen' : 'oppy-story')}
      className="fixed left-3 top-3 z-[60] rounded-full bg-[#fbe4b8] px-4 py-2 text-sm font-semibold text-[#4a2413] shadow"
    >
      ← Back
    </button>
  </div>
)}


        {currentView === 'kids-home' && (
          <KidsHome
             onPlay={() => setCurrentView('kids-game')}
              onHearStory={() => setCurrentView('oppy-story')}
            onMeetParts={() => setCurrentView('meetmyparts')}
           onDeepDive={handleToggleMode}
          />
        )}
        {currentView === 'oppy-story' && (
         <OppyStory onComplete={() => setCurrentView('kids-home')} />
        )}

        {currentView === 'coldopen' && (
          <ColdOpen
            onBegin={() => {
              setSelectedFrontier(null);
              setCurrentView('frontiers');
            }}
            onSelectFrontierDirect={(fId) => {
              setSelectedFrontier(fId);
              setCurrentView('frontiers');
            }}
            onReturnToKids={handleToggleMode}
          />
        )}

        {currentView === 'frontiers' && !selectedFrontier && (
          <FrontierPicker
            onSelect={handleFrontierSelect}
            unlockedBadges={unlockedBadges}
          />
        )}

        {currentView === 'frontiers' && selectedFrontier && (
          <FrontierView
            frontierId={selectedFrontier}
            onBackToPicker={() => setSelectedFrontier(null)}
            onSelectFrontier={(fId) => setSelectedFrontier(fId)}
            onSelectBot={handleOpenBot}
            onLaunchSimulation={handleLaunchSimulationForBot}
            unlockedBadges={unlockedBadges}
          />
        )}

        {currentView === 'celestial' && <Mars />}

       {currentView === 'simulation' && (
  <ExplorationConsole onExit={() => setCurrentView('frontiers')} />
)}

        {currentView === 'rover-game' && (
          <div className="h-[calc(100vh-4rem)]">
            <MarsRoverGame />
          </div>
        )}

    

        {currentView === 'anatomy' && <RoverAnatomy />}
        {currentView === 'recovery' && <Recovery />}
        {currentView === 'meetmyparts' && <MeetMyParts />}

       
        {currentView === 'abandoned-stories' && <AbandonedStories />}
      </main>

      <BotDetailPanel
        bot={selectedBot}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        onUnlockBadge={handleUnlockBadge}
        isBadgeAlreadyUnlocked={selectedBot ? unlockedBadges.includes(selectedBot.badge.id) : false}
        onEnterSimulation={handleLaunchSimulationForBot}
      />


      {!isChromeless && currentView !== 'kids-home' && (
        <footer className="border-t border-white/10 bg-[#0c101a] py-8 text-center text-xs font-sans text-[#9aa0a6]">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
            <div className="flex items-center gap-2">
              <span className="font-serif text-sm text-[#ece7dc] font-medium">Starbound</span>
              <span aria-hidden="true">·</span>
              <span>A Tribute to Brave Robot Explorers · Still Out There, Still Amazing!</span>
            </div>
            <div className="flex items-center gap-3">
              <span>NASA JPL & International Science Archive</span>
              <span>·</span>
              <button
                onClick={() => setCurrentView('live-archive')}
                className="text-amber-400 font-semibold hover:underline cursor-pointer"
              >
                Active Telemetry Console
              </button>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}