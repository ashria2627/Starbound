import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, AlertTriangle, Info, Check, Sparkles, Navigation, Zap } from 'lucide-react';
import { SimulationObstacle } from '../types';
import { SIMULATION_OBSTACLES } from '../data/missions';

interface RoverSimulationProps {
  onUnlockSimulationFact?: (factTitle: string) => void;
}

export const RoverSimulation: React.FC<RoverSimulationProps> = ({ onUnlockSimulationFact }) => {
  const [roverX, setRoverX] = useState<number>(40); // 0 to 1000 meters
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [activeObstacle, setActiveObstacle] = useState<SimulationObstacle | null>(null);
  const [visitedObstacleIds, setVisitedObstacleIds] = useState<string[]>([]);
  const [wheelRotation, setWheelRotation] = useState<number>(0);
  const [isDriving, setIsDriving] = useState(false);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        moveRover(12, 'right');
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        moveRover(-12, 'left');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [roverX]);

  const moveRover = (delta: number, dir: 'left' | 'right') => {
    setDirection(dir);
    setIsDriving(true);
    setWheelRotation((prev) => (prev + (dir === 'right' ? 24 : -24)) % 360);

    setRoverX((prev) => {
      const next = Math.max(20, Math.min(980, prev + delta));

      // Check proximity to obstacles (within 35 meters)
      const nearby = SIMULATION_OBSTACLES.find(
        (obs) => Math.abs(obs.xMeters - next) <= 32
      );

      if (nearby) {
        setActiveObstacle(nearby);
        if (!visitedObstacleIds.includes(nearby.id)) {
          setVisitedObstacleIds((v) => [...v, nearby.id]);
          if (onUnlockSimulationFact) {
            onUnlockSimulationFact(nearby.title);
          }
        }
      } else {
        // If walked away, clear active popup after a moment
        setActiveObstacle(null);
      }

      return next;
    });

    setTimeout(() => setIsDriving(false), 200);
  };

  const jumpToObstacle = (obs: SimulationObstacle) => {
    setRoverX(obs.xMeters);
    setActiveObstacle(obs);
    if (!visitedObstacleIds.includes(obs.id)) {
      setVisitedObstacleIds((v) => [...v, obs.id]);
      if (onUnlockSimulationFact) {
        onUnlockSimulationFact(obs.title);
      }
    }
  };

  const resetDrive = () => {
    setRoverX(40);
    setActiveObstacle(null);
    setWheelRotation(0);
  };

  // Convert roverX (20 - 980 meters) to SVG coordinate and viewport camera view
  const trackWidth = 1000;
  // Calculate relative Sol (Martian day) estimate
  const estimatedSol = Math.round(1 + (roverX / trackWidth) * 2200);
  // Solar array power calculation (high at start, dropping during dust patches)
  const isNearTroy = Math.abs(roverX - 380) <= 60;
  const solarWatts = isNearTroy ? 310 : Math.round(580 - (roverX / 1000) * 120);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Editorial Title & Kicker */}
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#c1440e]">
            Flagship 2D Surface Simulation
          </span>
          <h2 className="mt-2 font-serif text-3xl font-normal text-[#ece7dc] sm:text-4xl">
            Opportunity Rover: The Martian Traverse
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[#9aa0a6]">
            Pilot the Opportunity rover across the actual hazards of Meridiani Planum. Drive left and right with on-screen buttons or your keyboard arrow keys to examine real landmarks.
          </p>
        </div>

        {/* Telemetry Dashboard Box (Tabular numerals, unboxed) */}
        <div className="flex flex-wrap items-center gap-6 rounded-xl border border-[#c1440e]/30 bg-[#161011] p-4">
          <div>
            <span className="block font-mono text-[10px] uppercase text-[#9aa0a6]">
              Distance Traveled
            </span>
            <span className="font-mono text-2xl font-bold tabular-nums text-[#ece7dc]">
              {roverX} <span className="text-xs text-[#9aa0a6] font-normal">meters</span>
            </span>
          </div>

          <div className="border-l border-white/10 pl-4">
            <span className="block font-mono text-[10px] uppercase text-[#9aa0a6]">
              Simulated Sol
            </span>
            <span className="font-mono text-2xl font-bold tabular-nums text-[#ece7dc]">
              Sol {estimatedSol}
            </span>
          </div>

          <div className="border-l border-white/10 pl-4">
            <span className="block font-mono text-[10px] uppercase text-[#9aa0a6]">
              Solar Array
            </span>
            <span className="flex items-center gap-1 font-mono text-lg font-semibold tabular-nums text-[#ff8a65]">
              <Zap className="h-4 w-4" />
              {solarWatts} W-hr
            </span>
          </div>
        </div>
      </div>

      {/* Flagship 2D Mars Terrain Strip & Rover Canvas */}
      <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-[#0b0d14] via-[#1a0e0e] to-[#261009] shadow-2xl">
        {/* Background Sky & Distant Craters (Parallax SVG) */}
        <div className="relative h-[320px] w-full sm:h-[380px]">
          <svg
            viewBox="0 0 1000 380"
            preserveAspectRatio="none"
            className="h-full w-full select-none"
            aria-label="2D Mars surface terrain with Opportunity rover"
          >
            <defs>
              <linearGradient id="marsSky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0b0d14" />
                <stop offset="50%" stopColor="#1a0f12" />
                <stop offset="100%" stopColor="#3d160a" />
              </linearGradient>

              <linearGradient id="duneGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d97706" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#7c2d12" stopOpacity="0.9" />
              </linearGradient>

              <linearGradient id="bedrockGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c1440e" />
                <stop offset="30%" stopColor="#9a3412" />
                <stop offset="100%" stopColor="#451a03" />
              </linearGradient>

              <pattern id="dustTexture" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1" fill="#78350f" fillOpacity="0.4" />
                <circle cx="30" cy="25" r="1.5" fill="#451a03" fillOpacity="0.5" />
                <circle cx="20" cy="35" r="0.75" fill="#78350f" fillOpacity="0.3" />
              </pattern>
            </defs>

            {/* Distant Stars & Phobos */}
            <rect width="1000" height="260" fill="url(#marsSky)" />
            <circle cx="120" cy="40" r="1" fill="#ece7dc" opacity="0.6" />
            <circle cx="340" cy="65" r="1.2" fill="#ece7dc" opacity="0.5" />
            <circle cx="680" cy="30" r="1.5" fill="#ece7dc" opacity="0.7" />
            <circle cx="890" cy="50" r="1" fill="#ece7dc" opacity="0.4" />
            {/* Phobos moon */}
            <ellipse cx="820" cy="70" rx="4" ry="3" fill="#d1d5db" opacity="0.7" />

            {/* Distant Martian Crater Rim Mountain Silhouette */}
            <path
              d="M 0 230 Q 150 180 320 220 T 640 190 T 880 215 T 1000 200 L 1000 260 L 0 260 Z"
              fill="#2e1008"
              opacity="0.8"
            />
            <path
              d="M 0 245 Q 220 210 440 240 T 800 225 T 1000 235 L 1000 280 L 0 280 Z"
              fill="#431407"
              opacity="0.9"
            />

            {/* Midground Dunes */}
            <path
              d="M 0 270 Q 250 255 500 268 T 1000 260 L 1000 380 L 0 380 Z"
              fill="url(#bedrockGrad)"
            />

            {/* Bedrock surface texture overlay */}
            <rect y="270" width="1000" height="110" fill="url(#dustTexture)" />

            {/* WHEEL TRACK MARKS left behind by Opportunity */}
            <line
              x1="20"
              y1="288"
              x2={roverX}
              y2="288"
              stroke="#541c09"
              strokeWidth="2.5"
              strokeDasharray="4 2"
              opacity="0.85"
            />
            <line
              x1="20"
              y1="293"
              x2={roverX}
              y2="293"
              stroke="#541c09"
              strokeWidth="2"
              strokeDasharray="4 2"
              opacity="0.7"
            />

            {/* ======================================================== */}
            {/* STATIC OBSTACLES PLACED ON MARS TERRAIN */}
            {/* ======================================================== */}

            {/* 1. Eagle Crater Rim (~140m) */}
            <g transform="translate(140, 274)">
              {/* Crater depression shape */}
              <ellipse cx="0" cy="14" rx="34" ry="8" fill="#2d1007" />
              <ellipse cx="0" cy="12" rx="30" ry="5" fill="#1f0904" />
              {/* Rim rocks */}
              <circle cx="-25" cy="8" r="4" fill="#78350f" />
              <circle cx="24" cy="7" r="3.5" fill="#9a3412" />
              <circle cx="10" cy="14" r="2.5" fill="#541c09" />
              {/* Flag / Marker pin */}
              <line x1="0" y1="2" x2="0" y2="-28" stroke="#ece7dc" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.6" />
              <circle cx="0" cy="-28" r="4" fill="#9aa0a6" />
              <text x="0" y="-36" textAnchor="middle" fill="#ece7dc" className="font-mono text-[9px] font-semibold">
                Eagle Crater (140m)
              </text>
            </g>

            {/* 2. Soft Sand of "Troy" Dune (~380m) */}
            <g transform="translate(380, 268)">
              {/* Wavy ripples of powder sand */}
              <path
                d="M -45 18 Q -20 6 0 16 Q 25 8 45 20 L 40 28 L -40 28 Z"
                fill="url(#duneGrad)"
              />
              <path
                d="M -30 18 Q -10 11 10 17 Q 30 12 40 22"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1.5"
                opacity="0.7"
              />
              {/* Caution Marker */}
              <line x1="0" y1="8" x2="0" y2="-28" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.7" />
              <circle cx="0" cy="-28" r="4" fill="#f59e0b" />
              <text x="0" y="-36" textAnchor="middle" fill="#ffb703" className="font-mono text-[9px] font-semibold">
                Troy Sand Trap (380m)
              </text>
            </g>

            {/* 3. Heat Shield Meteorite (~660m) */}
            <g transform="translate(660, 276)">
              {/* Discarded heat shield fragment */}
              <path d="M -22 14 L -8 6 L 10 10 L -4 18 Z" fill="#4b5563" stroke="#9ca3af" strokeWidth="0.75" />
              {/* Iron-nickel meteorite rock */}
              <path
                d="M 6 12 Q 18 4 24 14 Q 28 22 18 20 Q 8 22 6 12 Z"
                fill="#18181b"
                stroke="#3f3f46"
                strokeWidth="1.2"
              />
              {/* Pits on meteorite */}
              <circle cx="14" cy="12" r="1.5" fill="#09090b" />
              <circle cx="20" cy="16" r="1.2" fill="#09090b" />
              {/* Marker pin */}
              <line x1="16" y1="6" x2="16" y2="-28" stroke="#ece7dc" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.6" />
              <circle cx="16" cy="-28" r="4" fill="#38bdf8" />
              <text x="16" y="-36" textAnchor="middle" fill="#ece7dc" className="font-mono text-[9px] font-semibold">
                Meteorite (660m)
              </text>
            </g>

            {/* 4. Victoria & Endeavour Rim Cliff (~920m) */}
            <g transform="translate(920, 260)">
              {/* Layered bedrock outcropping */}
              <path
                d="M -30 25 L -10 10 L 20 8 L 45 30 Z"
                fill="#78350f"
                stroke="#9a3412"
                strokeWidth="1.5"
              />
              <line x1="-15" y1="17" x2="25" y2="15" stroke="#fed7aa" strokeWidth="1" opacity="0.6" />
              <line x1="-5" y1="23" x2="35" y2="21" stroke="#fed7aa" strokeWidth="1" opacity="0.5" />
              {/* Marker pin */}
              <line x1="8" y1="8" x2="8" y2="-28" stroke="#ece7dc" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.6" />
              <circle cx="8" cy="-28" r="4" fill="#c1440e" />
              <text x="8" y="-36" textAnchor="middle" fill="#ece7dc" className="font-mono text-[9px] font-semibold">
                Endeavour Rim (920m)
              </text>
            </g>

            {/* ======================================================== */}
            {/* OPPORTUNITY ROVER SPRITE */}
            {/* ======================================================== */}
            <g
              transform={`translate(${roverX}, 278) scale(${direction === 'left' ? -0.85 : 0.85}, 0.85)`}
              className="transition-transform duration-100"
            >
              {/* Shadow on ground */}
              <ellipse cx="0" cy="18" rx="36" ry="6" fill="#1b0802" opacity="0.8" />

              {/* Rocker-Bogie Legs & Suspension Struts */}
              <path
                d="M -22 10 L -12 -2 L 12 -2 L 24 10"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M -2 -2 L 4 10"
                fill="none"
                stroke="#64748b"
                strokeWidth="2"
              />

              {/* Six Aluminum Rover Wheels with Tread Spikes */}
              {[-26, -14, 0, 14, 26].map((wx, idx) => (
                <g key={idx} transform={`translate(${wx}, 13)`}>
                  <circle r="6" fill="#1e293b" stroke="#cbd5e1" strokeWidth="1.5" />
                  {/* Rotating spoke marker */}
                  <line
                    x1="0"
                    y1="-5"
                    x2="0"
                    y2="5"
                    stroke="#94a3b8"
                    strokeWidth="1.2"
                    transform={`rotate(${wheelRotation})`}
                  />
                  <line
                    x1="-5"
                    y1="0"
                    x2="5"
                    y2="0"
                    stroke="#94a3b8"
                    strokeWidth="1.2"
                    transform={`rotate(${wheelRotation})`}
                  />
                  <circle r="2" fill="#0f172a" />
                </g>
              ))}

              {/* Rover Body Chassis (Warm Gold Thermal Blanket / Metal Box) */}
              <rect
                x="-24"
                y="-14"
                width="48"
                height="14"
                rx="2"
                fill="#eab308"
                stroke="#ca8a04"
                strokeWidth="1.2"
              />

              {/* Solar Panel Deck (Flat hexagon wing shape) */}
              <polygon
                points="-32,-14 32,-14 26,-19 -26,-19"
                fill="#1e1b4b"
                stroke="#38bdf8"
                strokeWidth="1"
              />
              {/* Solar cells lines */}
              <line x1="-18" y1="-19" x2="-22" y2="-14" stroke="#60a5fa" strokeWidth="0.8" />
              <line x1="0" y1="-19" x2="0" y2="-14" stroke="#60a5fa" strokeWidth="0.8" />
              <line x1="18" y1="-19" x2="22" y2="-14" stroke="#60a5fa" strokeWidth="0.8" />

              {/* High-Gain Dish Antenna (Rear) */}
              <g transform="translate(-16, -20)">
                <line x1="0" y1="0" x2="0" y2="-8" stroke="#cbd5e1" strokeWidth="1.5" />
                <ellipse cx="0" cy="-8" rx="6" ry="2.5" fill="#f8fafc" stroke="#64748b" strokeWidth="1" />
                <line x1="0" y1="-8" x2="0" y2="-12" stroke="#94a3b8" strokeWidth="1" />
              </g>

              {/* Camera Mast (Pancam "Neck" & "Head") */}
              <g transform="translate(14, -19)">
                <line x1="0" y1="0" x2="0" y2="-24" stroke="#cbd5e1" strokeWidth="2" />
                {/* Mast head / Stereo cameras */}
                <rect x="-5" y="-30" width="10" height="6" rx="1.5" fill="#334155" stroke="#f1f5f9" strokeWidth="1" />
                <circle cx="-2.5" cy="-27" r="1.5" fill="#0284c7" />
                <circle cx="2.5" cy="-27" r="1.5" fill="#0284c7" />
              </g>

              {/* Front Robotic Arm (IDD) folded */}
              <path
                d="M 22 -6 L 30 0 L 26 8"
                fill="none"
                stroke="#64748b"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>
          </svg>

          {/* Interactive Landmark Proximity Popup */}
          {activeObstacle && (
            <div className="absolute bottom-6 left-1/2 z-20 w-11/12 max-w-lg -translate-x-1/2 rounded-xl border border-[#c1440e] bg-[#0b0d14]/95 p-4 shadow-2xl backdrop-blur-md">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-[#ff8a65]" />
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#ff8a65]">
                    Historical Hazard Encountered
                  </span>
                </div>
                <span className="font-mono text-xs text-[#9aa0a6]">
                  {activeObstacle.historyDate}
                </span>
              </div>

              <h4 className="mt-1 font-serif text-lg font-medium text-[#ece7dc]">
                {activeObstacle.title}
              </h4>

              <p className="mt-2 text-xs leading-relaxed text-[#ece7dc]/90">
                {activeObstacle.fact}
              </p>

              <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2 font-mono text-[11px]">
                <span className="text-emerald-400 flex items-center gap-1">
                  <Check className="h-3.5 w-3.5" /> Telemetry Fact Logged
                </span>
                <span className="text-[#9aa0a6]">
                  At marker {activeObstacle.xMeters}m
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Rover Drive Controls & Navigation Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 bg-[#0e1118] p-4 sm:flex-row sm:px-6">
          {/* Quick jump to historical landmarks */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            <span className="text-[#9aa0a6] mr-1 hidden sm:inline">Jump to:</span>
            {SIMULATION_OBSTACLES.map((obs) => {
              const isVisited = visitedObstacleIds.includes(obs.id);
              const isSelected = activeObstacle?.id === obs.id;
              return (
                <button
                  key={obs.id}
                  onClick={() => jumpToObstacle(obs)}
                  className={`rounded-md px-2.5 py-1 transition-colors ${
                    isSelected
                      ? 'bg-[#c1440e] text-white font-semibold'
                      : isVisited
                      ? 'border border-[#c1440e]/40 bg-[#c1440e]/10 text-[#ff8a65]'
                      : 'border border-white/10 bg-white/5 text-[#9aa0a6] hover:text-[#ece7dc]'
                  }`}
                >
                  {obs.name.split(' ')[0]} ({obs.xMeters}m)
                </button>
              );
            })}
          </div>

          {/* Drive Arrow Buttons (Touch & Click friendly) */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => moveRover(-25, 'left')}
              className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-[#ece7dc] transition-all hover:bg-white/20 active:scale-95"
              aria-label="Drive rover backwards (left)"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Drive Left</span>
            </button>

            <button
              onClick={() => moveRover(25, 'right')}
              className="flex items-center gap-2 rounded-lg border border-[#c1440e]/80 bg-[#c1440e] px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-white shadow-lg transition-all hover:bg-[#a33709] active:scale-95"
              aria-label="Drive rover forward (right)"
            >
              <span>Drive Right</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={resetDrive}
              title="Reset position to landing site"
              className="rounded-lg border border-white/10 p-2.5 text-[#9aa0a6] hover:border-white/20 hover:text-[#ece7dc]"
              aria-label="Reset rover to start"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Keyboard helper footer */}
      <div className="mt-3 flex items-center justify-between text-xs font-mono text-[#9aa0a6]">
        <span>Use [← / →] arrow keys or [A / D] to steer Opportunity</span>
        <span>Explored {visitedObstacleIds.length} of {SIMULATION_OBSTACLES.length} Landmarks</span>
      </div>
    </section>
  );
};
