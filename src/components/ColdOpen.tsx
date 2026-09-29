import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Rocket, ExternalLink } from 'lucide-react';

interface ColdOpenProps {
  onBegin: () => void;
  onSelectFrontierDirect?: (frontier: 'moon' | 'mars' | 'deep') => void;
  onReturnToKids?: () => void;
}

type PreviewPlanet = 'mars' | 'moon';

const WORLD_PREVIEWS: Record<
  PreviewPlanet,
  { name: string; icon: string; modelUrl: string; sketchfabUrl: string; creator: string }
> = {
  mars: {
    name: 'Mars',
    icon: '🔴',
    modelUrl: 'https://sketchfab.com/models/50bb6eb0d1104d43bf684d2b0f70de1d/embed?autostart=1&autospin=0.15',
    sketchfabUrl: 'https://sketchfab.com/3d-models/mars-insight-lander-and-volcanic-regions-50bb6eb0d1104d43bf684d2b0f70de1d',
    creator: 'Quanta Magazine',
  },
  moon: {
    name: 'Moon',
    icon: '🌕',
    modelUrl: 'https://sketchfab.com/models/870de693475d436c8e925ab0bcda4ca4/embed?autostart=1&autospin=0.15',
    sketchfabUrl: 'https://sketchfab.com/3d-models/moon-870de693475d436c8e925ab0bcda4ca4',
    creator: 'Mieke Roth',
  },
};

export const ColdOpen: React.FC<ColdOpenProps> = ({ onBegin, onSelectFrontierDirect, onReturnToKids }) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [previewPlanet, setPreviewPlanet] = useState<PreviewPlanet>('mars');
  const preview = WORLD_PREVIEWS[previewPlanet];

  const introText = "Across distant Moon craters, red dusty plains, and the starry void, brave robotic explorers are resting now after amazing adventures. Let's remember what they found!";

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] w-full flex-col items-center justify-between px-4 py-8 sm:px-6 md:py-12">
      {onReturnToKids && (
        <button
          onClick={onReturnToKids}
          className="absolute left-4 top-4 z-20 flex items-center gap-1.5 rounded-full border border-white/15 bg-[#0b0d12]/70 px-4 py-2 text-xs font-medium text-[#9aa0a6] backdrop-blur-sm transition-colors hover:border-[#7fd6e8]/50 hover:text-[#ece7dc] sm:left-6 sm:top-6"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Kids Mode</span>
        </button>
      )}

     
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="z-10 mx-auto max-w-3xl text-center"
      >
        <span className="rounded-full bg-cyan-500/10 px-3.5 py-1 font-sans text-xs font-bold uppercase tracking-widest text-cyan-300 border border-cyan-400/30 shadow-sm">
          Adventures of Solar System Pioneers
        </span>
        <h1 className="mt-4 font-serif text-4xl font-normal tracking-tight text-[#ece7dc] sm:text-5xl md:text-6xl text-balance">
          Starbound
        </h1>

        <span>A Tribute to Brave Robot Explorers</span>
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <p className="font-sans text-base text-[#ece7dc]/90 sm:text-lg max-w-2xl leading-relaxed">
            {introText}
          </p>
        </div>
      </motion.div>

      
      <div className="relative my-16 flex h-[580px] w-full  max-w-4xl items-center justify-center  sm:h-[440px]">
        <svg
          viewBox="0 0 1100 500"
          className="h-full w-full overflow-visible"
          aria-label="Cosmic map showing paths from Earth to the Moon, Mars, and Deep Space"
        >
          <defs>
            <radialGradient id="earthGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95" />
              <stop offset="70%" stopColor="#0284c7" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="marsGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff7043" stopOpacity="0.95" />
              <stop offset="70%" stopColor="#c1440e" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#c1440e" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#e5e7eb" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#9aa0a6" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#4b5563" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="deepTrailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#818cf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity="0.95" />
            </linearGradient>

            <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g className="text-[#ece7dc]">
            {[
              { cx: 80, cy: 90, r: 1 },
              { cx: 160, cy: 220, r: 1.5 },
              { cx: 280, cy: 60, r: 1.2 },
              { cx: 340, cy: 180, r: 0.8 },
              { cx: 490, cy: 70, r: 1.5 },
              { cx: 620, cy: 130, r: 1.2 },
              { cx: 780, cy: 80, r: 1.8 },
              { cx: 830, cy: 240, r: 1 },
              { cx: 690, cy: 420, r: 1.4 },
              { cx: 110, cy: 410, r: 1 },
              { cx: 530, cy: 380, r: 1.2 },
            ].map((star, i) => (
              <circle
                key={i}
                cx={star.cx}
                cy={star.cy}
                r={star.r}
                fill="currentColor"
                opacity={0.35 + (i % 3) * 0.2}
                className={`star-twinkle-${(i % 3) + 1}`}
              />
            ))}
          </g>

          <motion.path
            d="M 220 280 Q 280 180 390 170"
            fill="none"
            stroke="#9aa0a6"
            strokeWidth="2.5"
            strokeDasharray="5 5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.85 }}
            transition={{ duration: 2.2, ease: 'easeOut', delay: 0.2 }}
          />

          <motion.path
            d="M 220 280 C 340 370 560 390 690 310"
            fill="none"
            stroke="#c1440e"
            strokeWidth="3"
            strokeDasharray="6 4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.95 }}
            transition={{ duration: 2.6, ease: 'easeOut', delay: 0.5 }}
          />
          <motion.path
            d="M 220 280 C 350 210 580 140 880 70"
            fill="none"
            stroke="url(#deepTrailGrad)"
            strokeWidth="2.5"
            strokeDasharray="8 6"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.9 }}
            transition={{ duration: 3.2, ease: 'easeOut', delay: 0.8 }}
            filter="url(#glowFilter)"
          />

          <g transform="translate(220, 280)">
            <circle r="80" fill="#0369a1" fillOpacity="0.15" />
            <circle r="68" fill="url(#earthGlow)" filter="url(#glowFilter)" />
  
            <path
              d="M -16 -10 Q -8 -22 8 -16 Q 18 -10 12 10 Q -2 20 -14 12 Z"
              fill="#065f46"
              fillOpacity="0.65"
            />
            <path
              d="M -6 4 Q 4 0 10 12 Q 2 24 -8 18 Z"
              fill="#065f46"
              fillOpacity="0.55"
            />
            <path
              d="M -16 4 Q 34 0 40 22 Q 62 24 -28 28 Z"
              fill="#065f46"
              fillOpacity="0.55"
            />
            <circle r="68" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.8" />
            <text
              y="54"
              textAnchor="middle"
              className="fill-[#ece7dc] font-mono text-[19px] font-semibold tracking-wider"
            >
              EARTH
            </text>
            <text
              y="68"
              textAnchor="middle"
              className="fill-[#cce5ff] font-mono text-[16px]"
            >
              Origin
            </text>
          </g>

         
          <g
            transform="translate(390, 170)"
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => onSelectFrontierDirect && onSelectFrontierDirect('moon')}
            onMouseEnter={() => setHoveredNode('moon')}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <circle r="50" fill="#9aa0a6" fillOpacity="0.1" />
            <circle r="40" fill="url(#moonGlow)" />
            <circle cx="-10" cy="-4" r="3" fill="#6b7280" fillOpacity="0.5" />
            <circle cx="10" cy="-10" r="4" fill="#6b7280" fillOpacity="0.4" />
            <circle cx="2" cy="15" r="5" fill="#6b7280" fillOpacity="0.4" />
            <circle r="30" fill="none" stroke="#9aa0a6" strokeWidth="1" strokeOpacity="0.9" />
            <text
              y="36"
              textAnchor="middle"
              className="fill-[#ece7dc] font-mono text-[18px] font-semibold tracking-wider"
            >
              THE MOON
            </text>
            <text
              y="50"
              textAnchor="middle"
              className="fill-[#f3f8fd] font-mono text-[15px]"
            >
              384,400 km
            </text>
          </g>

          <g
            transform="translate(690, 310)"
            className="cursor-pointer transition-transform hover:scale-102"
            onClick={() => onSelectFrontierDirect && onSelectFrontierDirect('mars')}
            onMouseEnter={() => setHoveredNode('mars')}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <circle r="100" fill="#c1440e" fillOpacity="0.15" />
            <circle r="84" fill="url(#marsGlow)" filter="url(#glowFilter)" />
            <ellipse cx="0" cy="-22" rx="30" ry="16" fill="#ffffff" fillOpacity="0.8" />
            <path
              d="M -16 2 Q -4 14 12 6"
              fill="none"
              stroke="#7c2d12"
              strokeWidth="2"
              strokeOpacity="0.6"
            />
            <circle r="76" fill="none" stroke="#c1440e" strokeWidth="1" strokeOpacity="0.9" />
            <text
              y="44"
              textAnchor="middle"
              className="fill-[#ece7dc] font-mono text-[18px] font-semibold tracking-wider"
            >
              MARS
            </text>
            <text
              y="58"
              textAnchor="middle"
              className="fill-[#f5e1d9] font-mono text-[16px]"
            >
              225 Million km
            </text>
          </g>

          <g
            transform="translate(920, 75)"
            className="cursor-pointer transition-transform hover:scale-101"
            onClick={() => onSelectFrontierDirect && onSelectFrontierDirect('deep')}
            onMouseEnter={() => setHoveredNode('deep')}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <circle r="180" fill="#818cf8" fillOpacity="0.12" />
            <circle r="150" fill="#4338ca" fillOpacity="0.5" />
            <circle r="130" fill="#a5b4fc" filter="url(#glowFilter)" />
            <circle r="120" fill="none" stroke="#818cf8" strokeWidth="6" strokeDasharray="3 3" />
            <line x1="-100" y1="0" x2="100" y2="0" stroke="#818cf8" strokeWidth="0.8" strokeOpacity="0.9" />
            <line x1="0" y1="-100" x2="0" y2="100" stroke="#818cf8" strokeWidth="0.8" strokeOpacity="0.9" />
            <text
              x="-10"
              y="36"
              textAnchor="middle"
              className="fill-[#3e0852] font-mono text-[20px] font-semibold tracking-wider"
            >
              DEEP SPACE
            </text>
            <text
              x="-10"
              y="50"
              textAnchor="middle"
              className="fill-[#ffffff] font-mono text-[16px]"
            >
              Interstellar Void
            </text>
          </g>
        </svg>

        {hoveredNode && (
          <div className="pointer-events-none absolute bottom-4 rounded-md border border-white/10 bg-[#0b0d12]/95 px-3 py-1.5 font-mono text-xs text-[#ece7dc] shadow-lg">
            {hoveredNode === 'moon' && 'The Moon · Luna 9, Apollo Rover & Laser Mirrors'}
            {hoveredNode === 'mars' && 'Mars · Mars 3, Opportunity & Perseverance'}
            {hoveredNode === 'deep' && 'Deep Space · Pioneer 10, Voyager 1 & New Horizons'}
          </div>
        )}
      </div>

    
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="z-10 mb-16 w-full max-w-4xl"
      >
        <div className="mb-4 flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-cyan-300">
              Before You Begin
            </p>
            <h2 className="mt-1 font-serif text-2xl font-normal text-[#ece7dc] sm:text-3xl">
              Take a Closer Look
            </h2>
          </div>

          <div className="flex items-center gap-1.5 rounded-2xl border border-white/15 bg-white/5 p-1.5">
            {(Object.keys(WORLD_PREVIEWS) as PreviewPlanet[]).map((key) => (
              <button
                key={key}
                onClick={() => setPreviewPlanet(key)}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 font-sans text-xs font-bold transition-all ${
                  previewPlanet === key
                    ? 'bg-amber-400 text-black shadow-md scale-105'
                    : 'text-[#9aa0a6] hover:text-[#ece7dc]'
                }`}
              >
                <span>{WORLD_PREVIEWS[key].icon}</span>
                {WORLD_PREVIEWS[key].name}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl">
          <div className="relative h-[340px] w-full sm:h-[420px]">
            <iframe
              key={previewPlanet}
              title={preview.name}
              src={preview.modelUrl}
              className="absolute inset-0 h-full w-full"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; fullscreen; xr-spatial-tracking"
            />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between font-sans text-xs text-[#9aa0a6]">
          <span>3D model by {preview.creator} · drag to rotate</span>
          <a
            href={preview.sketchfabUrl}
            target="_blank"
            rel="nofollow noreferrer"
            className="flex items-center gap-1 font-medium text-[#1CAAD9] hover:underline"
          >
            View on Sketchfab <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
        className="z-10 flex flex-col items-center gap-6 text-center"
      >
        <p className="font-serif text-2xl italic tracking-wide text-amber-300 sm:text-3xl">
          "Still out there, still amazing!"
        </p>

        <button
          onClick={onBegin}
          className="group relative flex items-center gap-3 rounded-2xl border-2 border-amber-400 bg-gradient-to-r from-amber-500 to-orange-500 px-9 py-4 font-sans text-base font-bold text-white shadow-[0_0_40px_-5px_rgba(245,158,11,0.5)] transition-all hover:scale-105 hover:from-amber-400 hover:to-orange-400 cursor-pointer"
        >
          <Rocket className="h-5 w-5 fill-current" />
          <span>Start Exploring!</span>
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </button>

        <div className="flex flex-wrap justify-center items-center gap-2 font-sans text-xs text-[#ece7dc]/70">
          <span className="rounded-full bg-white/5 px-2.5 py-1">🌕 3 Worlds</span>
          <span aria-hidden="true">·</span>
          <span className="rounded-full bg-white/5 px-2.5 py-1">🤖 9 Hero Robots</span>
          <span aria-hidden="true">·</span>
          <span className="rounded-full bg-white/5 px-2.5 py-1">🎮 Real 3D Test Drives</span>
        </div>
      </motion.div>
    </section>
  );
};