import React, { useMemo, useState } from 'react';
import { ORBITERS } from './orbiters';
import type { Anchor, OrbiterItem } from './orbiters';

const C = 400;
const PLANETS: Record<Exclude<Anchor, 'moon' | 'deep'>, { r: number; pr: number; period: number; color: string; label: string }> = {
  mercury: { r: 75, pr: 5, period: 26, color: '#b7a99a', label: 'Mercury' },
  venus: { r: 125, pr: 8, period: 42, color: '#e8c98a', label: 'Venus' },
  mars: { r: 245, pr: 8, period: 95, color: '#c1440e', label: 'Mars' },
};
const EARTH = { r: 185, pr: 10, period: 62, moonOffset: 42, moonR: 4 };
const DEEP = { r: 335, period: 240 };

const FILTERS: { key: 'all' | Anchor; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'moon', label: 'Moon' },
  { key: 'mercury', label: 'Mercury' },
  { key: 'venus', label: 'Venus' },
  { key: 'mars', label: 'Mars' },
  { key: 'deep', label: 'Deep space' },
];

const kindColor = (k: OrbiterItem['kind']) => (k === 'Orbiter' ? '#7fd6e8' : '#f5b942');

function around(cx: number, cy: number, rr: number, i: number, n: number) {
  const a = (2 * Math.PI * i) / Math.max(n, 1) - Math.PI / 2;
  return { x: cx + rr * Math.cos(a), y: cy + rr * Math.sin(a) };
}

export default function OrbitersView() {
  const [filter, setFilter] = useState<'all' | Anchor>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [spin, setSpin] = useState(true);

  const groups = useMemo(() => {
    const g: Record<Anchor, OrbiterItem[]> = { moon: [], mars: [], venus: [], mercury: [], deep: [] };
    ORBITERS.forEach((o) => g[o.anchor].push(o));
    return g;
  }, []);
  const selected = ORBITERS.find((o) => o.id === selectedId) ?? null;
  const dim = (o: OrbiterItem) => (filter === 'all' || o.anchor === filter ? 1 : 0.15);

  const surprise = () => {
    const pool = ORBITERS.filter((o) => filter === 'all' || o.anchor === filter);
    if (pool.length) setSelectedId(pool[Math.floor(Math.random() * pool.length)].id);
  };

  const Dot = ({ o, x, y }: { o: OrbiterItem; x: number; y: number }) => {
    const isSel = o.id === selectedId;
    return (
      <g
        role="button"
        tabIndex={0}
        aria-label={`${o.name}, ${o.kind}, ${o.target}`}
        style={{ cursor: 'pointer', opacity: dim(o) }}
        onClick={() => setSelectedId(o.id)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setSelectedId(o.id);
          }
        }}
      >
        <circle cx={x} cy={y} r={9} fill="transparent" />
        {isSel && <circle cx={x} cy={y} r={8} fill="none" stroke="#ece7dc" strokeWidth={1.5} className="sb-pulse" />}
        <circle cx={x} cy={y} r={isSel ? 4.5 : 3.5} fill={kindColor(o.kind)} stroke="#0b0d12" strokeWidth={1} />
      </g>
    );
  };

  const spinStyle = (period: number): React.CSSProperties => ({
    animationDuration: `${period}s`,
    animationPlayState: spin ? undefined : 'paused',
  });

  const rings = [75, 125, 185, 245, 335];

  return (
    <div>
      <style>{`
        .sb-spin { transform-origin: ${C}px ${C}px; animation: sb-spin linear infinite; }
        @keyframes sb-spin { to { transform: rotate(360deg); } }
        .sb-orbit-svg:hover .sb-spin { animation-play-state: paused; }
        @keyframes sb-pulse { 0% { r: 7; opacity: 1; } 100% { r: 14; opacity: 0; } }
        .sb-pulse { animation: sb-pulse 1.4s ease-out infinite; }
        @media (prefers-reduced-motion: reduce) { .sb-spin, .sb-pulse { animation: none; } }
      `}</style>

      <p className="mb-4 max-w-2xl text-[#9aa0a6]">
        Explore spacecraft that flew past or orbited a world and were left behind. Tap a dot to meet one. Positions are illustrative: not to scale, not real locations.
      </p>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div role="group" aria-label="Filter by target" className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              aria-pressed={filter === f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#7fd6e8] ${
                filter === f.key ? 'border-[#c1440e] bg-[#c1440e] text-white' : 'border-white/20 text-[#ece7dc] hover:border-white/40'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={surprise}
          className="rounded-full border border-[#7fd6e8] px-3 py-1.5 text-xs font-medium text-[#7fd6e8] hover:bg-[#7fd6e8]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#7fd6e8]"
        >
          🎲 Surprise me
        </button>
        <button
          type="button"
          aria-pressed={spin}
          onClick={() => setSpin((v) => !v)}
          className="rounded-full border border-white/20 px-3 py-1.5 text-xs text-[#ece7dc] hover:border-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#7fd6e8]"
        >
          {spin ? '⏸ Pause orbits' : '▶ Spin orbits'}
        </button>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#0b0d12] p-2">
          <svg viewBox="0 0 800 800" className="sb-orbit-svg mx-auto block h-auto w-full max-w-[720px]" role="group" aria-label="Solar system of flyby and orbiter spacecraft">
            <defs>
              <radialGradient id="sb-sun">
                <stop offset="0%" stopColor="#fff2b0" />
                <stop offset="100%" stopColor="#f5a623" />
              </radialGradient>
            </defs>
            {rings.map((r) => (
              <circle key={r} cx={C} cy={C} r={r} fill="none" stroke="#ffffff" strokeOpacity={0.12} strokeDasharray="3 6" />
            ))}
            <circle cx={C} cy={C} r={20} fill="url(#sb-sun)" />
            <g fontSize={12} fill="#9aa0a6" textAnchor="middle">
              <text x={C} y={C - 75 - 8}>Mercury</text>
              <text x={C} y={C - 125 - 8}>Venus</text>
              <text x={C} y={C - 185 - 16}>Earth</text>
              <text x={C} y={C - 245 - 12}>Mars</text>
              <text x={C} y={C - 335 - 8}>Deep space</text>
            </g>

            {(['mercury', 'venus', 'mars'] as const).map((k) => {
              const p = PLANETS[k];
              const items = groups[k];
              const px = C + p.r;
              return (
                <g key={k} className="sb-spin" style={spinStyle(p.period)}>
                  <circle cx={px} cy={C} r={p.pr} fill={p.color} />
                  {items.map((o, i) => {
                    const pos = around(px, C, p.pr + 12, i, items.length);
                    return <Dot key={o.id} o={o} x={pos.x} y={pos.y} />;
                  })}
                </g>
              );
            })}

            <g className="sb-spin" style={spinStyle(EARTH.period)}>
              <circle cx={C + EARTH.r} cy={C} r={EARTH.pr} fill="#5aa9e6" />
              <circle cx={C + EARTH.r + EARTH.moonOffset} cy={C} r={EARTH.moonR} fill="#cfd3d8" />
              {groups.moon.map((o, i) => {
                const pos = around(C + EARTH.r + EARTH.moonOffset, C, 17, i, groups.moon.length);
                return <Dot key={o.id} o={o} x={pos.x} y={pos.y} />;
              })}
            </g>

            <g className="sb-spin" style={spinStyle(DEEP.period)}>
              {groups.deep.map((o, i) => {
                const a = (Math.PI * 2 * (i + 0.5)) / Math.max(groups.deep.length, 1) + 1;
                return <Dot key={o.id} o={o} x={C + DEEP.r * Math.cos(a)} y={C + DEEP.r * Math.sin(a)} />;
              })}
            </g>
          </svg>
          <p className="mt-2 flex flex-wrap justify-center gap-4 text-xs text-[#9aa0a6]">
            <span><span style={{ color: '#7fd6e8' }}>●</span> Orbiter</span>
            <span><span style={{ color: '#f5b942' }}>●</span> Flyby</span>
          </p>
        </div>

        <aside className="w-full shrink-0 lg:w-[320px]" aria-live="polite">
          {selected ? (
            <div className="rounded-xl border border-white/10 bg-[#11151f] p-4">
              <span className="rounded-full border border-white/20 px-2 py-0.5 text-[11px]" style={{ color: kindColor(selected.kind) }}>
                {selected.kind}
              </span>
              <h3 className="mt-2 font-serif text-2xl text-[#ece7dc]">{selected.name}</h3>
              <p className="mt-1 text-sm text-[#9aa0a6]">Target: {selected.target}</p>
              <a
                href={selected.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-sm text-[#7fd6e8] underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#7fd6e8]"
              >
                Read the NASA record (NSSDCA)
              </a>
            </div>
          ) : (
            <p className="rounded-xl border border-white/10 bg-[#11151f] p-4 text-sm text-[#9aa0a6]">
              Tap a glowing dot, or press “Surprise me”.
            </p>
          )}
          <ul className="mt-3 max-h-72 space-y-1 overflow-auto pr-1">
            {ORBITERS.filter((o) => filter === 'all' || o.anchor === filter).map((o) => (
              <li key={o.id}>
                <button
                  type="button"
                  aria-current={o.id === selectedId ? 'true' : undefined}
                  onClick={() => setSelectedId(o.id)}
                  className="w-full rounded-lg border border-white/10 bg-[#11151f] px-3 py-1.5 text-left text-sm text-[#ece7dc] hover:border-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#7fd6e8] aria-[current=true]:border-[#7fd6e8]"
                >
                  {o.name} <span className="text-xs text-[#9aa0a6]">· {o.target}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
