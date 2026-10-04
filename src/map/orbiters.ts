export type Anchor = 'mercury' | 'venus' | 'mars' | 'jupiter' | 'saturn';

export interface OrbiterItem {
  id: string;
  name: string;
  kind: 'Orbiter' | 'Flyby';
  target: string;
  last_contact:string;
  anchor: Anchor;
  sourceUrl: string;
  /** story id opened via onOpenStory; leave blank if no story yet */
  story: string;
}

const N = (id: string) => `https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=${id}`;

export const ORBITERS: OrbiterItem[] = [

  { id: 'viking-1-orbiter', name: 'Viking 1 Orbiter', last_contact:"17 August 1980", kind: 'Orbiter', target: 'Mars', anchor: 'mars', sourceUrl: N('1975-075A'), story:" " },
  { id: 'viking-2-orbiter', name: 'Viking 2 Orbiter', last_contact:"17 August 1980", kind: 'Orbiter', target: 'Mars', anchor: 'mars', sourceUrl: N('1975-083A'), story:" " },
  { id: 'mars-global-surveyor', name: 'Mars Global Surveyor',last_contact:"2 November 2006",  kind: 'Orbiter', target: 'Mars', anchor: 'mars', sourceUrl: N('1996-062A'), story:" " },
  { id: 'mariner-4', name: 'Mariner 4', kind: 'Flyby', last_contact:" 21 December 1967", target: 'Mars', anchor: 'mars', sourceUrl: N('1964-077A'), story:" " },
  { id: 'mariner-6', name: 'Mariner 6', kind: 'Flyby', last_contact:"Not specified", target: 'Heliocentric orbit after Mars flyby', anchor: 'mars', sourceUrl: N('1969-014A'), story:" " },
  { id: 'mariner-7', name: 'Mariner 7', kind: 'Flyby', last_contact:"Not specified", target: 'Heliocentric orbit after Mars flyby', anchor: 'mars', sourceUrl: N('1969-030A'), story:" " },
  { id: 'mariner-2', name: 'Mariner 2', kind: 'Flyby', last_contact:"January 1963 at 07:00 UT", target: 'Heliocentric orbit after Venus flyby', anchor: 'venus', sourceUrl: N('1962-041A'), story:" " },
  { id: 'mariner-5', name: 'Mariner 5', kind: 'Flyby',last_contact:"4 December 1967, temporarily regained on 14 October 1968",  target: 'Heliocentric Orbit Venus flyby', anchor: 'venus', sourceUrl: N('1967-060A'), story:" " },
  { id: 'mariner-10', name: 'Mariner 10', kind: 'Flyby', last_contact:"March 24, 1975", target: 'Mercury & Venus', anchor: 'mercury', sourceUrl: N('1973-085A'), story:" " },
  { id: 'pioneer-10', name: 'Pioneer 10', kind: 'Flyby',last_contact:"January 23, 2003",  target: 'Jupiter flyby, then deep space', anchor: 'jupiter', sourceUrl: N('1972-012A') , story:" "},
  { id: 'pioneer-11', name: 'Pioneer 11', kind: 'Flyby', last_contact:"1995", target: 'Jupiter & Saturn flybys, then deep space', anchor: 'saturn', sourceUrl: N('1973-019A') , story:" "},
];