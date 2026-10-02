import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './map.css';
import type { ObjectBody, VerifiedObject } from '../types/objects';
import { PENDING_OBJECT_COUNT, verifiedFor } from './objects';
import { detectBasemap, buildStyle, webglAvailable } from './basemap';
import type { BasemapInfo } from './basemap';
import { filterByYear, sortByYear, yearBounds } from './timeline';
import { ObjectPanel } from './ObjectPanel';
import OrbitersView from './OrbitersView';
import { T, useLang, useT } from '../i18n';
import strings from '../i18n/strings.json';

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mq) return;
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

interface Props {
  onOpenStory?: (storyId: string) => void;
}

export default function MapView({ onOpenStory }: Props) {
  const t = useT();
  const [lang, setLang] = useLang();
  const reducedMotion = usePrefersReducedMotion();
  const [view, setView] = useState<'landers' | 'orbiters'>('landers');
  const [body, setBody] = useState<ObjectBody>('moon');
  const [year, setYear] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [basemap, setBasemap] = useState<BasemapInfo['kind'] | null>(null);
  const webgl = useMemo(() => webglAvailable(), []);

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<{ id: string; el: HTMLButtonElement; marker: maplibregl.Marker }[]>([]);
  const openerRef = useRef<Element | null>(null);

  const all = useMemo(() => verifiedFor(body), [body]);
  const bounds = useMemo(() => yearBounds(all), [all]);
  const visible = useMemo(() => sortByYear(filterByYear(all, year)), [all, year]);
  const selected = useMemo(() => visible.find((o) => o.id === selectedId) ?? null, [visible, selectedId]);

  // Switching body resets the scrubber and the panel.
  useEffect(() => {
    setYear(null);
    setSelectedId(null);
  }, [body]);

  // Map lifecycle: one map per body.
  useEffect(() => {
    if (!webgl) return;
    let cancelled = false;
    let map: maplibregl.Map | null = null;
    setReady(false);
    setBasemap(null);

    (async () => {
      const info = await detectBasemap(body);
      if (cancelled || !containerRef.current) return;
      setBasemap(info.kind);
      map = new maplibregl.Map({
        container: containerRef.current,
        style: buildStyle(body, info),
        center: [0, 0],
        zoom: 0.8,
        minZoom: 0,
        maxZoom: 9,
        renderWorldCopies: false,
        attributionControl: { compact: true },
      });
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-left');
      map.on('error', (e: maplibregl.ErrorEvent) => console.warn('[map]', e.error?.message ?? e));
      map.once('load', () => {
        if (cancelled) return;
        mapRef.current = map;
        setReady(true);
      });
    })();

    return () => {
      cancelled = true;
      markersRef.current.forEach((m) => m.marker.remove());
      markersRef.current = [];
      mapRef.current = null;
      map?.remove();
    };
  }, [body, webgl]);

  const select = useCallback((o: VerifiedObject) => {
    openerRef.current = document.activeElement;
    setSelectedId(o.id);
    const map = mapRef.current;
    if (map) {
      map.easeTo({ center: [o.lon, o.lat], zoom: Math.max(map.getZoom(), 2.5), duration: reducedMotion ? 0 : 600 });
    }
  }, [reducedMotion]);

  const close = useCallback(() => {
    const id = selectedId;
    setSelectedId(null);
    requestAnimationFrame(() => {
      const opener = openerRef.current as HTMLElement | null;
      if (opener && document.contains(opener)) opener.focus();
      else if (id) document.querySelector<HTMLElement>(`button[data-object-id="${id}"]`)?.focus();
    });
  }, [selectedId]);

  // Markers: real buttons, only for verified objects inside the timeline window.
  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;
    markersRef.current.forEach((m) => m.marker.remove());
    markersRef.current = visible.map((o) => {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'sb-marker';
      el.dataset.body = o.body;
      el.dataset.objectId = o.id;
      el.addEventListener('click', () => select(o));
      const marker = new maplibregl.Marker({ element: el }).setLngLat([o.lon, o.lat]).addTo(map);
      el.setAttribute('aria-label', `${o.name}, ${o.mission}, ${o.left_behind}`);
      return { id: o.id, el, marker };
    });
  }, [ready, visible, select]);

  useEffect(() => {
    markersRef.current.forEach(({ id, el }) => {
      if (id === selectedId) el.setAttribute('aria-current', 'true');
      else el.removeAttribute('aria-current');
    });
  }, [selectedId, ready, visible]);

  // If the timeline hides the selected object, close its panel.
  useEffect(() => {
    if (selectedId && !selected) setSelectedId(null);
  }, [selectedId, selected]);

  useEffect(() => {
    if (view === 'landers') requestAnimationFrame(() => mapRef.current?.resize());
  }, [view]);

  const sliderValue = year ?? bounds?.max ?? 0;

  return (
    <section lang={lang} aria-labelledby="map-title" className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6 max-w-2xl">
        <h2 id="map-title" className="font-serif text-3xl text-[#ece7dc] sm:text-4xl">
          <T k="map.title" />
        </h2>
        <p className="mt-2 text-[#9aa0a6]"><T k="map.intro" /></p>
      </header>

      <div role="group" aria-label={t('lang.label')} className="mb-4 flex items-center gap-2">
        {(['en', 'bn'] as const).map((l) => (
          <button
            key={l}
            type="button"
            lang={l}
            aria-pressed={lang === l}
            onClick={() => setLang(l)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7fd6e8] ${
              lang === l ? 'border-[#7fd6e8] text-[#ece7dc]' : 'border-white/20 text-[#9aa0a6] hover:border-white/40'
            }`}
          >
            {l === 'en' ? strings.en['lang.en'] : strings.bn['lang.bn']}
          </button>
        ))}
      </div>

      <div role="group" aria-label="Map section" className="mb-4 flex flex-wrap gap-2">
        {([['landers', 'Landers & rovers'], ['orbiters', 'Flybys & orbiters']] as const).map(([v, label]) => (
          <button
            key={v}
            type="button"
            aria-pressed={view === v}
            onClick={() => setView(v)}
            className={`rounded-lg border px-4 py-2 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#7fd6e8] ${
              view === v ? 'border-[#7fd6e8] bg-[#7fd6e8]/10 text-[#ece7dc]' : 'border-white/20 text-[#9aa0a6] hover:border-white/40'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className={view === 'landers' ? '' : 'hidden'}>
      <div role="group" aria-label={t('map.body')} className="mb-4 flex flex-wrap items-center gap-2">
        {(['moon', 'mars'] as const).map((b) => (
          <button
            key={b}
            type="button"
            aria-pressed={body === b}
            onClick={() => setBody(b)}
            className={`rounded-full border px-4 py-2 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7fd6e8] ${
              body === b ? 'border-[#c1440e] bg-[#c1440e] text-white' : 'border-white/20 text-[#ece7dc] hover:border-white/40'
            }`}
          >
            <T k={b === 'moon' ? 'map.moon' : 'map.mars'} />
          </button>
        ))}
      </div>

      {visible.length > 0 && (
        <div className="mb-4">
          <label htmlFor="map-object" className="mr-2 text-sm text-[#ece7dc]">Spacecraft</label>
          <select
            id="map-object"
            value={selectedId ?? ''}
            onChange={(e) => {
              const o = visible.find((v) => v.id === e.target.value);
              if (o) select(o);
              else setSelectedId(null);
            }}
            className="w-full rounded-lg border border-white/20 bg-[#11151f] px-3 py-2 text-sm text-[#ece7dc] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#7fd6e8] sm:w-auto sm:min-w-[280px]"
          >
            <option value="">Choose a spacecraft…</option>
            {visible.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name} ({o.left_behind})
              </option>
            ))}
          </select>
        </div>
      )}

      {bounds && (
        <div className="mb-4 rounded-xl border border-white/10 bg-[#11151f] p-3 sm:p-4">
          <label htmlFor="map-year" className="text-sm text-[#ece7dc]">
            <T k="map.timeline" />: <T k="map.upTo" /> <output htmlFor="map-year">{sliderValue}</output>
          </label>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <input
              id="map-year"
              type="range"
              min={bounds.min}
              max={bounds.max}
              step={1}
              value={sliderValue}
              onChange={(e) => setYear(Number(e.target.value))}
              className="min-w-0 flex-1 accent-[#c1440e]"
            />
            <button
              type="button"
              onClick={() => setYear(null)}
              className="rounded-full border border-white/20 px-3 py-1.5 text-xs text-[#ece7dc] hover:border-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#7fd6e8]"
            >
              <T k="map.showAll" />
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div className="min-w-0">
          {webgl ? (
            <div
              ref={containerRef}
              role="region"
              aria-label={t('map.mapLabel')}
              className="sb-map h-[75vh] min-h-[400px] w-full overflow-hidden rounded-xl border border-white/10"
            />
          ) : (
            <p role="status" className="rounded-xl border border-white/10 bg-[#11151f] p-4 text-sm text-[#9aa0a6]">
              <T k="map.noWebgl" />
            </p>
          )}
          {webgl && basemap === 'none' && <p className="mt-2 text-xs text-[#9aa0a6]"><T k="map.noBasemap" /></p>}
        </div>

        <div className="min-w-0">
          {selected ? (
            <ObjectPanel object={selected} onClose={close} onOpenStory={(id) => onOpenStory?.(id)} />
          ) : (
            <p className="rounded-xl border border-white/10 bg-[#11151f] p-4 text-sm text-[#9aa0a6]">
              <T k={all.length === 0 ? 'map.none' : visible.length === 0 ? 'map.noneForYear' : 'map.intro'} />
            </p>
          )}
        </div>
      </div>

      <section aria-labelledby="map-list-title" className="mt-6">
        <h3 id="map-list-title" className="font-serif text-xl text-[#ece7dc]">
          <T k="map.list" />
        </h3>
        <p role="status" className="mt-1 text-xs text-[#9aa0a6]">
          {visible.length} / {all.length}
          {PENDING_OBJECT_COUNT > 0 ? ` · ${PENDING_OBJECT_COUNT} ${t('map.pending')}` : ''}
        </p>
        {visible.length > 0 && (
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {visible.map((o) => (
              <li key={o.id}>
                <button
                  type="button"
                  data-object-id={o.id}
                  aria-current={o.id === selectedId ? 'true' : undefined}
                  onClick={() => select(o)}
                  className="w-full rounded-lg border border-white/10 bg-[#11151f] px-3 py-2 text-left text-sm text-[#ece7dc] hover:border-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#7fd6e8] aria-[current=true]:border-[#7fd6e8]"
                >
                  <span className="block font-medium">{o.name}</span>
                  <span className="block text-xs text-[#9aa0a6]">
                    {o.mission} · {o.left_behind}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
      </div>

      {view === 'orbiters' && <OrbitersView />}
    </section>
  );
}
