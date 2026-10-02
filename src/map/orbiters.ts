export type Anchor = 'moon' | 'mars' | 'venus' | 'mercury' | 'deep';

export interface OrbiterItem {
  id: string;
  name: string;
  kind: 'Orbiter' | 'Flyby';
  target: string;
  anchor: Anchor;
  sourceUrl: string;
}

const N = (id: string) => `https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=${id}`;

/** Only entries whose NSSDCA link was supplied and confirmed. No coordinates: these have no fixed location. */
export const ORBITERS: OrbiterItem[] = [
  { id: 'lunar-orbiter-1', name: 'Lunar Orbiter 1', kind: 'Orbiter', target: 'Moon', anchor: 'moon', sourceUrl: N('1966-073A') },
  { id: 'lunar-orbiter-2', name: 'Lunar Orbiter 2', kind: 'Orbiter', target: 'Moon', anchor: 'moon', sourceUrl: N('1966-100A') },
  { id: 'lunar-orbiter-3', name: 'Lunar Orbiter 3', kind: 'Orbiter', target: 'Moon', anchor: 'moon', sourceUrl: N('1967-008A') },
  { id: 'lunar-orbiter-4', name: 'Lunar Orbiter 4', kind: 'Orbiter', target: 'Moon', anchor: 'moon', sourceUrl: N('1967-041A') },
  { id: 'lunar-orbiter-5', name: 'Lunar Orbiter 5', kind: 'Orbiter', target: 'Moon', anchor: 'moon', sourceUrl: N('1967-075A') },
  { id: 'grail-a', name: 'GRAIL A', kind: 'Orbiter', target: 'Moon', anchor: 'moon', sourceUrl: N('2011-046A') },
  { id: 'ladee', name: 'LADEE', kind: 'Orbiter', target: 'Moon', anchor: 'moon', sourceUrl: N('2013-047A') },
  { id: 'viking-1-orbiter', name: 'Viking 1 Orbiter', kind: 'Orbiter', target: 'Mars', anchor: 'mars', sourceUrl: N('1975-075A') },
  { id: 'viking-2-orbiter', name: 'Viking 2 Orbiter', kind: 'Orbiter', target: 'Mars', anchor: 'mars', sourceUrl: N('1975-083A') },
  { id: 'mars-global-surveyor', name: 'Mars Global Surveyor', kind: 'Orbiter', target: 'Mars', anchor: 'mars', sourceUrl: N('1996-062A') },
  { id: 'mariner-4', name: 'Mariner 4', kind: 'Flyby', target: 'Mars', anchor: 'mars', sourceUrl: N('1964-077A') },
  { id: 'mariner-6', name: 'Mariner 6', kind: 'Flyby', target: 'Mars', anchor: 'mars', sourceUrl: N('1969-014A') },
  { id: 'mariner-7', name: 'Mariner 7', kind: 'Flyby', target: 'Mars', anchor: 'mars', sourceUrl: N('1969-030A') },
  { id: 'mariner-2', name: 'Mariner 2', kind: 'Flyby', target: 'Venus', anchor: 'venus', sourceUrl: N('1962-041A') },
  { id: 'mariner-5', name: 'Mariner 5', kind: 'Flyby', target: 'Venus', anchor: 'venus', sourceUrl: N('1967-060A') },
  { id: 'mariner-10', name: 'Mariner 10', kind: 'Flyby', target: 'Mercury & Venus', anchor: 'mercury', sourceUrl: N('1973-085A') },
  { id: 'pioneer-10', name: 'Pioneer 10', kind: 'Flyby', target: 'Deep space', anchor: 'deep', sourceUrl: N('1972-012A') },
  { id: 'pioneer-11', name: 'Pioneer 11', kind: 'Flyby', target: 'Deep space', anchor: 'deep', sourceUrl: N('1973-019A') },
];
