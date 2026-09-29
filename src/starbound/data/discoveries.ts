export interface SketchfabEmbedConfig {
  src: string;
  modelTitle: string;
  modelPage: string;
  authorName: string;
  authorPage: string;
  note?: string;
}

export interface DiscoveryPhoto {
  url: string;
  caption: string;
  credit: string;
}

export interface Discovery {
  id: string;
  title: string;
  badge: 'Real NASA discovery' | 'Simulated mission discovery';
  text: string;
  kidsText: string; // Simple 4-5 word sentences for Kids Version
  grownupText: string; // Detailed scientific overview for Grown-Up Version
  difficultiesFaced: string[]; // Real NASA engineering & environmental difficulties faced
  photos: DiscoveryPhoto[]; // Actual NASA discovery photos
  videoEmbedUrl: string; // Actual NASA / JPL mission video embed URL
  videoTitle: string;
  source: string;
  sketchfab?: SketchfabEmbedConfig;
}

export const DISCOVERIES: Discovery[] = [
  {
    id: 'martian-blueberries',
    title: 'Martian "Blueberries"',
    badge: 'Real NASA discovery',
    text: 'In 2004, Opportunity spotted millions of tiny grey pebbles shaped like blueberries! They are made of hematite, a mineral that usually forms in liquid water. This proved Mars was once wet and warm!',
    kidsText:
      'Tiny round rocks on Mars. Water made them long ago. Oppy found millions of them!',
    grownupText:
      'In February 2004 inside Eagle Crater at Meridiani Planum, Opportunity discovered thousands of millimeter-scale spherical concretions embedded in sulfate-rich sedimentary bedrock. Using its Microscopic Imager and Mössbauer Spectrometer, NASA confirmed the spherules were composed of crystalline gray hematite (Fe₂O₃) precipitated from acidic groundwater permeating porous rock.',
    difficultiesFaced: [
      'Extreme -90°C nighttime temperatures required hours of radioisotope heating before the robotic arm (IDD) actuators could safely move.',
      'Positioning the Mössbauer Spectrometer within millimeters of uneven rock without crashing the contact sensor plate under a 20-minute communication delay.',
      'Differentiating volcanic lapilli from aqueous concretions required grinding into solid rock with the Rock Abrasion Tool (RAT) for over 3 hours while conserving limited battery power.',
    ],
    photos: [
      {
        url: 'https://images-assets.nasa.gov/image/PIA05476/PIA05476~orig.jpg',
        caption: 'Microscopic Imager close-up showing spherical hematite concretions ("blueberries") 4–6 mm in diameter in Eagle Crater.',
        credit: 'NASA / JPL-Caltech / USGS',
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Martian_blueberries.jpg',
        caption: 'False-color Pancam image of hematite "blueberries" weathering out of Eagle Crater outcrop (Sol 28).',
        credit: 'NASA / JPL-Caltech / Cornell',
      },
    ],
    videoEmbedUrl: 'https://www.youtube.com/embed/1Ll-VHYxWXU',
    videoTitle: 'NASA JPL: Opportunity Rover — 15 Years of Martian Water Discoveries',
    source: 'NASA MER Opportunity · Meridiani Planum (2004)',
  },
  {
    id: 'insight-lander',
    title: 'InSight Lander',
    badge: 'Real NASA discovery',
    text: 'InSight is a robotic Mars lander designed to listen for "marsquakes" deep underground! Its sensitive instruments helped scientists map the rocky crust, mantle, and core of Mars.',
    kidsText:
      'InSight listens to Mars rumble. It feels quakes deep underground. Scientists learned how Mars formed!',
    grownupText:
      'Landing at Elysium Planitia in November 2018, NASA’s InSight (Interior Exploration using Seismic Investigations, Geodesy and Heat Transport) deployed the ultra-sensitive SEIS broadband seismometer directly onto the Martian surface. It detected over 1,300 marsquakes and meteoroid impacts, revealing a liquid iron-alloy core ~1,830 km in radius and a multi-layered crust.',
    difficultiesFaced: [
      'The HP³ "Mole" self-hammering heat probe bounced backward out of its hole because cohesive duricrust soil lacked the loose granular friction needed to absorb recoil.',
      'Engineers spent nearly two years commanding the robotic arm scoop to pin the Mole laterally against the hole wall—a delicate maneuver never intended before launch.',
      'Thick Martian dust coated InSight’s solar panels, forcing engineers to pour sand from the robotic scoop near the panels so wind vortices would sweep off the dust grains.',
    ],
    photos: [
      {
        url: 'https://images-assets.nasa.gov/image/PIA22876/PIA22876~medium.jpg',
        caption: 'InSight’s first complete selfie on Elysium Planitia showing its deployed solar arrays and deck instruments.',
        credit: 'NASA / JPL-Caltech',
      },
      {
        url: 'https://images-assets.nasa.gov/image/PIA23047/PIA23047~medium.jpg',
        caption: 'The Wind and Thermal Shield (WTS) placed over the SEIS seismometer to block thermal and wind noise.',
        credit: 'NASA / JPL-Caltech',
      },
    ],
    videoEmbedUrl: 'https://www.youtube.com/embed/LKLITDmm4NA',
    videoTitle: 'NASA JPL: InSight Lander — Listening to the Heartbeat of Mars',
    source: 'NASA JPL · InSight Mars Lander Mission',
    sketchfab: {
      src: 'https://sketchfab.com/models/d6b8096bdd594d408fb738bd9ef5cebe/embed?autostart=1&ui_infos=0&ui_controls=1&ui_stop=0&ui_watermark=0',
      modelTitle: 'NASA InSight Mars Lander',
      modelPage: 'https://sketchfab.com/3d-models/d6b8096bdd594d408fb738bd9ef5cebe',
      authorName: 'NASA / JPL-Caltech',
      authorPage: 'https://sketchfab.com/nasa',
    },
  },
  {
    id: 'purgatory-ripple',
    title: 'Dune Sand Ripple',
    badge: 'Real NASA discovery',
    text: 'In 2005, Opportunity got its wheels hub-deep in a soft windblown sand dune! Engineers on Earth practiced in a sandbox for five weeks and carefully inched Oppy free to keep exploring.',
    kidsText:
      'Oppy got stuck in sand. Helpers wiggled the wheels free. Soon Oppy drove away happy!',
    grownupText:
      'On Sol 446 (April 26, 2005), during a 90-meter blind drive across Meridiani Planum, Opportunity drove into a 30-cm-high transverse aeolian ridge subsequently named "Purgatory Dune." All six aluminum wheels sank up to their hubs in fine, low-bearing-strength basaltic and sulfate dust, reaching nearly 100% wheel slip.',
    difficultiesFaced: [
      'Blind dead-reckoning mode did not have visual odometry active, so the rover kept spinning its wheels for meters after forward progress had completely stalled.',
      'JPL engineers had to mix crushed walnut shells, play sand, and diatomaceous earth in a Pasadena testbed to replicate the exact cohesion and slip angle of Martian dust.',
      'It required 38 sols of nerve-wracking millimeter-by-millimeter backward wheel turns—driving 192 meters of wheel rotation just to move 1 meter onto firmer ground.',
    ],
    photos: [
      {
        url: 'https://images-assets.nasa.gov/image/PIA07997/PIA07997~orig.jpg',
        caption: 'Pancam look-back at the deep wheel ruts left in Purgatory Dune after Opportunity finally escaped on Sol 484.',
        credit: 'NASA / JPL-Caltech / Cornell',
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Opportunity_in_Purgatory_Dune.jpg',
        caption: 'Rear Hazard Camera (Hazcam) view showing Opportunity’s wheels buried hub-deep in Purgatory Dune.',
        credit: 'NASA / JPL-Caltech',
      },
    ],
    videoEmbedUrl: 'https://www.youtube.com/embed/tma2pt0k668',
    videoTitle: 'NASA JPL: Freeing Opportunity from Purgatory Dune',
    source: 'NASA JPL · Purgatory Dune Escape (Sol 446–484)',
  },
  {
    id: 'solar-sun-chase',
    title: 'Sunny Ridge Crest',
    badge: 'Real NASA discovery',
    text: 'During cold Martian winters, Oppy drove onto tilted northern hills called "Lily Pads" so its solar wings could face the low sun and stay warm and charged!',
    kidsText:
      'Mars winters get very cold. Oppy parked on sunny hills. Sunlight kept its batteries warm!',
    grownupText:
      'In the southern hemisphere of Mars, winter aphelion reduces solar irradiance while atmospheric dust blocks sunlight. To survive its fifth Martian winter (2011–2012) with heavily dust-coated solar arrays, Opportunity parked on a 15-degree north-facing outcrop named "Greeley Haven" on the rim of Endeavour Crater.',
    difficultiesFaced: [
      'Solar array output dropped below 280 watt-hours per sol (down from 900 Wh at landing), barely enough to keep the core electronics above their -40°C survival limit.',
      'A broken right-front steering actuator and an aging robotic arm shoulder joint heater forced engineers to park at a precise azimuth and tilt angle for 19 weeks without driving.',
      'Every single watt-hour had to be budgeted between survival heaters and radio Doppler tracking experiments.',
    ],
    photos: [
      {
        url: 'https://images-assets.nasa.gov/image/PIA15689/PIA15689~medium.jpg',
        caption: '360-degree Pancam winter panorama from Greeley Haven showing Opportunity’s dust-covered solar deck tilted north.',
        credit: 'NASA / JPL-Caltech / Cornell / ASU',
      },
    ],
    videoEmbedUrl: 'https://www.youtube.com/embed/wX73jH2vUVI',
    videoTitle: 'NASA JPL: Surviving Martian Winter at Greeley Haven',
    source: 'NASA MER Archive · Greeley Haven Winter Station',
  },
  {
    id: 'future-mars-base',
    title: 'Base Concept Site',
    badge: 'Simulated mission discovery',
    text: 'Everything rovers like Opportunity learn about Martian water, rocks, and weather helps engineers design future solar habitats and greenhouses for human explorers!',
    kidsText:
      'Rovers help future astronauts live. They find water and rocks. Humans will visit Mars someday!',
    grownupText:
      'Precursor surface missions like Opportunity, Curiosity, and Perseverance provide critical environmental datasets—groundwater mineral hydration, radiation flux, dust storm opacity, and regolith mechanics—required to engineer In-Situ Resource Utilization (ISRU) plants and pressurized human habitats on Mars.',
    difficultiesFaced: [
      'Martian regolith contains 0.5–1% toxic perchlorates (ClO₄⁻), requiring sealed airlocks and electrostatic dust mitigation before astronauts can enter habitats.',
      'Extracting breathable oxygen from the thin 95% CO₂ atmosphere (6 millibars—less than 1% of Earth sea-level pressure) requires high-temperature solid oxide electrolysis (tested by MOXIE).',
      'Unshielded galactic cosmic rays and solar particle events require 3D-printed regolith radiation shields or subsurface lava-tube siting.',
    ],
    photos: [
      {
        url: 'https://images-assets.nasa.gov/image/PIA20027/PIA20027~medium.jpg',
        caption: 'NASA Mars human exploration habitat and surface operations concept informed by rover geology datasets.',
        credit: 'NASA / JPL-Caltech',
      },
    ],
    videoEmbedUrl: 'https://www.youtube.com/embed/4czjS9h4Fpg',
    videoTitle: 'NASA: Building a Future Human Base on Mars',
    source: 'NASA Mars Architecture Strategy Office',
  },
  {
    id: 'oppy-perseverance-valley',
    title: 'Opportunity (Oppy)',
    badge: 'Real NASA discovery',
    text: 'Built for a 90-day mission, Opportunity explored Mars for almost 15 years and drove over 45 kilometers! It rests peacefully here in Perseverance Valley after a giant planet-wide dust storm in 2018.',
    kidsText:
      'Oppy drove for fifteen years! A big dust storm came. Now Oppy rests in peace.',
    grownupText:
      'Designed for a 90-sol warranty and a 1,000-meter range, Opportunity operated for 5,352 sols (nearly 15 Earth years) and holds the off-Earth marathon driving record of 45.16 kilometers. On June 10, 2018, while exploring Perseverance Valley on the western rim of Endeavour Crater, a planet-encircling dust storm silenced the rover.',
    difficultiesFaced: [
      'Atmospheric optical depth (tau) surged to an unprecedented τ = 10.8, blocking 99.995% of direct sunlight and plunging solar production to just 22 watt-hours.',
      'Without power to run its mission clock or survival heaters through the freezing night, Opportunity suffered a low-power fault and internal clock loss.',
      'NASA’s Deep Space Network transmitted over 1,000 recovery commands across 8 months before officially concluding the historic mission on February 13, 2019.',
    ],
    photos: [
      {
        url: 'https://images-assets.nasa.gov/image/PIA22518/PIA22518~medium.jpg',
        caption: 'Opportunity’s final full 360-degree panorama in Perseverance Valley just before the June 2018 global dust storm.',
        credit: 'NASA / JPL-Caltech / Cornell / ASU',
      },
      {
        url: 'https://images-assets.nasa.gov/image/PIA03240/PIA03240~medium.jpg',
        caption: 'Mars Exploration Rover Opportunity on the red plains of Mars.',
        credit: 'NASA / JPL-Caltech / Cornell',
      },
    ],
    videoEmbedUrl: 'https://www.youtube.com/embed/3b1DxICZbGc',
    videoTitle: 'NASA JPL: Goodnight Oppy — The End of an Historic Mars Mission',
    source: 'NASA Official Mission Conclusion · Feb 2019',
  },
];
