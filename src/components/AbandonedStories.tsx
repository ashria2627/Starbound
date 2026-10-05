import React, { Suspense, useEffect, useRef, useState,ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ImageIcon, ChevronUp, ChevronDown } from 'lucide-react';
import { prefersReducedMotion } from '../a11y';


interface BookPage {
  label: string;
  title: string;
  text: ReactNode;
  bullets?: ReactNode[];
  imageUrl: string;
  caption: string;
  credit: string;
  modelUrl?: string;
}

interface BotBook {
  id: string;
  name: string;
  place: string;
  coverImageUrl?: string;
  recordIds?: string[];
  sourceUrls?: string[];
  pages: [BookPage, BookPage, BookPage, BookPage]; 
}

// Stories use the supplied object/orbiter records, checked against NASA and JPL.
// Existing image assignments are retained; new volumes reuse their supplied record's image.
const BOOKS: BotBook[] = [
  {
    id: "sojourner",
    name: "Sojourner",
    place: "Mars",
    coverImageUrl: "/assets/objects/4067-pathfinder-PIA01551-modest-web-ae16d9b6.jpg",
    recordIds: ["sojourner-pathfinder"],
    sourceUrls: ["https://science.nasa.gov/mission/mars-pathfinder/"],
    pages: [
      {
        label: "Origin",
        title: "A Small Rover, A Big First",
        imageUrl: "/assets/objects/4067-pathfinder-PIA01551-modest-web-ae16d9b6.jpg",
        caption: "Sojourner rover on Mars",
        credit: "NASA",
        text: (<>{"On December 4, 1996, a rover small enough to fit on a desk left Earth tucked inside Mars Pathfinder. NASA named it Sojourner after Sojourner Truth. On July 4, 1997, airbags cushioned its arrival at Ares Vallis. When the lander opened and the six-wheeled robot rolled down its ramp, Mars exploration gained something new: a machine that could travel from rock to rock."}{"\n\n"}<a href="https://science.nasa.gov/mission/mars-pathfinder/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Goals",
        title: "Prove a New Way to Explore",
        imageUrl: "/assets/objects/mars-pathfinder-7-pathfinder-and-sojourner-on-ma-e3b04115.jpg",
        caption: "Sojourner rover on Mars",
        credit: "NASA",
        text: (<>{"Sojourner had to prove that a small rover could drive on Mars, avoid obstacles and send useful science home. Its cameras helped it navigate, while an alpha proton X-ray spectrometer identified chemical elements in rocks and soil. Solar panels supplied electricity. The rover talked to Pathfinder, which passed its messages to Earth; this partnership was as important as the wheels."}{"\n\n"}<a href="https://science.nasa.gov/mission/mars-pathfinder/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Discoveries",
        title: "What It Found",
        imageUrl: "/assets/objects/8648-PIA01133-full2-d5306e90.jpg",
        caption: "Martian terrain",
        credit: "NASA",
        text: (<>{"During its travels, Sojourner examined rocks such as Yogi and Barnacle Bill, comparing their chemistry with nearby soil. Together, the rover and lander found varied rocks and signs that powerful floods had shaped the landing area. Sojourner also showed engineers how wheels and navigation behaved on real Martian ground. Its short journey helped make the much larger rovers that followed possible."}{"\n\n"}<a href="https://science.nasa.gov/mission/mars-pathfinder/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Now",
        title: "Resting at Ares Vallis",
        imageUrl: "/assets/objects/mars-pathfinder-11-sojourner-apxs-on-yogi-rock-1-53e0633a.jpg",
        caption: "Resting at Ares Vallis",
        credit: "NASA",
        modelUrl: "",
        text: (<>{"Sojourner remains near Pathfinder in Ares Vallis. Pathfinder last communicated on September 27, 1997, cutting off the rover's route to Earth. The mission had lasted almost three months, well beyond Sojourner's planned seven sols, or Martian days. Because no later rover messages reached Earth, its final movements and exact resting point are uncertain. It had no vehicle waiting to bring it home."}{"\n\n"}<a href="https://science.nasa.gov/mission/mars-pathfinder/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
    ],
  },
  {
    id: "spirit",
    name: "Spirit",
    place: "Mars",
    coverImageUrl: "/assets/objects/rover2-1-df042d60.jpg",
    recordIds: ["spirit"],
    sourceUrls: ["https://science.nasa.gov/mission/mer-spirit/","https://www.jpl.nasa.gov/news/press_kits/MSLLanding.pdf","https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/science-instruments/"],
    pages: [
      {
        label: "Origin",
        title: "One of Mars’ Twin Explorers",
        imageUrl: "/assets/objects/rover2-1-df042d60.jpg",
        caption: "One of Mars’ Twin Explorers",
        credit: "NASA",
        text: (<>{"Spirit left Earth on June 10, 2003, with a question hidden in its destination: had Gusev Crater once held a lake? It landed in January 2004, arriving on January 3 in California and January 4 in Universal Time. Its first surroundings were a rocky volcanic plain. The water story was harder to find than expected, so the rover began a journey toward the Columbia Hills."}{"\n\n"}<a href="https://science.nasa.gov/mission/mer-spirit/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://www.jpl.nasa.gov/news/press_kits/MSLLanding.pdf" target="_blank" rel="noreferrer">NASA/JPL source 2</a>{" · "}<a href="https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/science-instruments/" target="_blank" rel="noreferrer">NASA source 3</a></>),
      },
      {
        label: "Goals",
        title: "Search for a Watery Past",
        imageUrl: "/assets/objects/mer-bythenumbers-infographic-feb2019-4ce6ccc5.jpg",
        caption: "Spirit & Opportunity",
        credit: "NASA",
        text: (<>{"NASA built Spirit as a robotic field geologist for a planned 90-sol expedition. Panoramic and navigation cameras surveyed the route; a microscopic imager examined rock textures. Its arm carried instruments that measured chemical elements and iron-bearing minerals, and a rock abrasion tool ground through weathered surfaces. A thermal emission spectrometer studied minerals from a distance. Solar panels powered this traveling laboratory."}{"\n\n"}<a href="https://science.nasa.gov/mission/mer-spirit/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://www.jpl.nasa.gov/news/press_kits/MSLLanding.pdf" target="_blank" rel="noreferrer">NASA/JPL source 2</a>{" · "}<a href="https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/science-instruments/" target="_blank" rel="noreferrer">NASA source 3</a></>),
      },
      {
        label: "Discoveries",
        title: "What It Found",
        imageUrl: "/assets/objects/outofthisworldrecords-updated-2019-02-b1fd4b22.png",
        caption: "Comparison of distances traveled by lunar and Mars vehicles",
        credit: "NASA",
        text: (<>{"In the Columbia Hills, Spirit found rocks altered by water and minerals that preserved clues to wetter conditions. Later, a broken wheel scraped away soil and exposed a deposit rich in silica. That unexpected find pointed to ancient hot springs or steam vents. Carbonate-bearing rock added evidence for less acidic water. These discoveries identified environments worth investigating for past habitability, without proving that life had lived there."}{"\n\n"}<a href="https://science.nasa.gov/mission/mer-spirit/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://www.jpl.nasa.gov/news/press_kits/MSLLanding.pdf" target="_blank" rel="noreferrer">NASA/JPL source 2</a>{" · "}<a href="https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/science-instruments/" target="_blank" rel="noreferrer">NASA source 3</a></>),
      },
      {
        label: "Now",
        title: "Resting on Mars",
        imageUrl: "/assets/objects/sol016-lander-pan-pia05117-cb29dbe7.jpg",
        caption: "Spirit & Oppy on Mars",
        credit: "NASA",
        text: (<>{"After driving about 7.7 kilometers, Spirit became stuck in soft ground at a place called Troy in 2009, near Home Plate in Gusev Crater. It could not reach a good position to collect winter sunlight. Its last message arrived on March 22, 2010; NASA ended recovery efforts on May 25, 2011. The silent rover remains at Troy, where its expedition finally stopped."}{"\n\n"}<a href="https://science.nasa.gov/mission/mer-spirit/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://www.jpl.nasa.gov/news/press_kits/MSLLanding.pdf" target="_blank" rel="noreferrer">NASA/JPL source 2</a>{" · "}<a href="https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/science-instruments/" target="_blank" rel="noreferrer">NASA source 3</a></>),
      },
    ],
  },
  {
    id: "opportunity",
    name: "Opportunity",
    place: "Mars",
    coverImageUrl: "/assets/objects/solar-panels-on-rover-seen-from-above-80d811d3.jpeg",
    recordIds: ["opportunity"],
    sourceUrls: ["https://science.nasa.gov/mission/mer-opportunity/","https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/science-highlights/"],
    pages: [
      {
        label: "Origin",
        title: "Spirit’s Twin",
        imageUrl: "/assets/objects/solar-panels-on-rover-seen-from-above-80d811d3.jpeg",
        caption: "Spirit’s Twin",
        credit: "NASA",
        text: (<>{"Opportunity launched on July 7, 2003, following its twin Spirit toward Mars. In January 2004 it bounced to a stop inside tiny Eagle Crater in Meridiani Planum: January 24 in California, January 25 in Universal Time. Exposed layers of rock were already within reach. What was supposed to be a 90-sol visit would become almost fifteen years of reading Mars one outcrop at a time."}{"\n\n"}<a href="https://science.nasa.gov/mission/mer-opportunity/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/science-highlights/" target="_blank" rel="noreferrer">NASA source 2</a></>),
      },
      {
        label: "Goals",
        title: "Read the Rocks",
        imageUrl: "/assets/objects/rover-tracks-on-a-hillside-with-a-dust-devil-see-1933e031.jpeg",
        caption: "Martian Valley",
        credit: "NASA",
        text: (<>{"Opportunity's assignment was to find out how water had changed Martian rocks and whether ancient conditions might have supported life. Its panoramic cameras and thermal emission spectrometer surveyed targets. A microscopic imager, alpha particle X-ray spectrometer and Mössbauer spectrometer studied textures, chemistry and iron minerals. A rock abrasion tool uncovered fresh surfaces. Solar panels powered the rover as its six wheels carried this laboratory onward."}{"\n\n"}<a href="https://science.nasa.gov/mission/mer-opportunity/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/science-highlights/" target="_blank" rel="noreferrer">NASA source 2</a></>),
      },
      {
        label: "Discoveries",
        title: "What It Found",
        imageUrl: "/assets/objects/rover-casting-a-shadow-a2b3b17d.jpeg",
        caption: "Alone on Mars",
        credit: "NASA",
        text: (<>{"Near its landing site, Opportunity found sulfate-rich rocks, small hematite spheres nicknamed blueberries, and sedimentary textures showing that water had affected the ground. At Endeavour Crater, later observations revealed clay-bearing material associated with less acidic water. Its route crossed more than 100 craters and covered 45.16 kilometers. The rover showed that ancient Mars held different watery environments at different times, rather than one simple planet-wide story."}{"\n\n"}<a href="https://science.nasa.gov/mission/mer-opportunity/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/science-highlights/" target="_blank" rel="noreferrer">NASA source 2</a></>),
      },
      {
        label: "Now",
        title: "Silenced by a Global Storm",
        imageUrl: "/assets/objects/Mars-Exploration-Rover-Spirit-and-Opportunity-3767b584.png",
        caption: "Oppy 3D Structure",
        credit: "NASA",
        modelUrl: "",
        text: (<>{"Opportunity rests in Perseverance Valley on the western rim of Endeavour Crater. A global dust storm darkened the sky and deprived its solar panels of light; its last communication came on June 10, 2018. Controllers kept trying to recover it, but NASA declared the mission complete on February 13, 2019. Its wheels stopped there because the rover never recovered enough working power to answer."}{"\n\n"}<a href="https://science.nasa.gov/mission/mer-opportunity/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/science-highlights/" target="_blank" rel="noreferrer">NASA source 2</a></>),
      },
    ],
  },
  {
    id: "pioneer10",
    name: "Pioneer 10",
    place: "Deep Space",
    coverImageUrl: "/assets/objects/jupiter-pioneer-10-art-jpg-20ff5cb4.webp",
    recordIds: ["pioneer-10"],
    sourceUrls: ["https://science.nasa.gov/mission/pioneer-10/"],
    pages: [
      {
        label: "Origin",
        title: "First Beyond the Asteroid Belt",
        imageUrl: "/assets/objects/jupiter-pioneer-10-art-jpg-20ff5cb4.webp",
        caption: "First Beyond the Asteroid Belt",
        credit: "NASA",
        text: (<>{"On March 2, 1972, Pioneer 10 set off toward a region no spacecraft had explored up close. Beyond Mars lay the asteroid belt, and beyond that waited Jupiter. Engineers did not yet know how dangerous the belt would be for a spacecraft. Pioneer 10 crossed it successfully, then reached Jupiter in December 1973, opening a route that other outer-planet explorers would follow."}{"\n\n"}<a href="https://science.nasa.gov/mission/pioneer-10/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Goals",
        title: "Explore Jupiter",
        imageUrl: "/assets/objects/arc-1974-ac73-9344orig-3d3ee44b.jpg",
        caption: "Explore Jupiter",
        credit: "NASA",
        text: (<>{"Its mission was to inspect Jupiter and measure the space along the way. Radioisotope generators made electricity from heat, keeping it working far from strong sunlight. An imaging photopolarimeter built up pictures and measured reflected light. A magnetometer, charged-particle instruments and dust detectors examined magnetic fields, radiation and small particles. Its antenna sent the observations home while the spacecraft spun to remain stable."}{"\n\n"}<a href="https://science.nasa.gov/mission/pioneer-10/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Discoveries",
        title: "What It Found",
        imageUrl: "/assets/objects/Pioneer-10-Ganymede-1-6213fc43.jpeg",
        caption: "Photo  of Jupiter taked by Pioneer 10",
        credit: "NASA",
        text: (<>{"Pioneer 10 returned humanity's first close observations of Jupiter, revealing its enormous magnetic environment and intense radiation belts. Pictures showed the giant planet and its moons in new detail. Crossing the asteroid belt demonstrated that the route was usable. The radiation measurements helped planners prepare later missions for a world whose invisible hazards could be as challenging as its size."}{"\n\n"}<a href="https://science.nasa.gov/mission/pioneer-10/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Now",
        title: "Drifting Into Deep Space",
        imageUrl: "/assets/objects/pioneer-nasa-629e121e.jpg",
        caption: "Drifting Into Deep Space",
        credit: "NASA",
        modelUrl: "",
        text: (<>{"Jupiter's gravity sent Pioneer 10 onto an escape trajectory, so it kept traveling outward instead of entering a permanent orbit around the planet. Its generators gradually produced less electricity, and its last weak signal reached Earth on January 23, 2003. It is now silent and continuing away from the planetary region, carrying its engraved plaque. Its exact present position is not measured by an active mission."}{"\n\n"}<a href="https://science.nasa.gov/mission/pioneer-10/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
    ],
  },
  {
    id: "pioneer11",
    name: "Pioneer 11",
    place: "Deep Space",
    coverImageUrl: "/assets/objects/Pioneer11-1600-fb0b5cbf.jpg",
    recordIds: ["pioneer-11"],
    sourceUrls: ["https://science.nasa.gov/mission/pioneer-11/"],
    pages: [
      {
        label: "Origin",
        title: "Pioneer 10’s Sister",
        imageUrl: "/assets/objects/Pioneer11-1600-fb0b5cbf.jpg",
        caption: "Pioneer 10’s Sister",
        credit: "NASA",
        text: (<>{"Pioneer 11 launched on April 6, 1973, following Pioneer 10 toward Jupiter. Its journey would take a different turn: a close Jupiter encounter in December 1974 redirected it toward Saturn. In September 1979, it became the first spacecraft to visit the ringed planet. Before Voyager arrived, this small spinning explorer had already tested a path through Saturn's surroundings."}{"\n\n"}<a href="https://science.nasa.gov/mission/pioneer-11/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Goals",
        title: "Reach the Ringed Planet",
        imageUrl: "/assets/objects/Saturn-and-its-rings-d4abdfbb.jpeg",
        caption: "Reach the Ringed Planet",
        credit: "NASA",
        text: (<>{"Radioisotope generators powered Pioneer 11 where sunlight was weak. Its imaging photopolarimeter measured light and built pictures, while magnetic-field, radiation, plasma and dust instruments studied the environment. Scientists wanted to compare Jupiter and Saturn, investigate their moons and rings, and learn whether the region around Saturn was safe for later flybys. Its Jupiter encounter also provided the gravity assist needed to reach Saturn."}{"\n\n"}<a href="https://science.nasa.gov/mission/pioneer-11/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Discoveries",
        title: "What It Found",
        imageUrl: "/assets/objects/Fuzzy-color-image-of-Jupiter-b2622095.jpeg",
        caption: "Photo of Jupiter taken by Pioneer 11",
        credit: "NASA",
        text: (<>{"It sent the first views of Jupiter's polar regions and studied how the giant planet's magnetic environment responded to the solar wind. At Saturn, it detected the planet's magnetic field, discovered the narrow F ring and reported a previously unknown satellite. Measurements of the rings and surrounding particles gave Voyager planners valuable warning about the terrain ahead. Pioneer 11 turned a distant ringed point of light into a place spacecraft could investigate."}{"\n\n"}<a href="https://science.nasa.gov/mission/pioneer-11/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Now",
        title: "Lost Contact",
        imageUrl: "/assets/objects/ac73-9344-1280-ad97a78e.jpg",
        caption: "Lost Contact",
        credit: "NASA",
        modelUrl: "",
        text: (<>{"After Saturn, Pioneer 11 continued along a trajectory leading out of the solar system. As electrical power declined, it could no longer maneuver reliably to keep its antenna aimed at Earth. Routine operations ended on September 30, 1995. A few minutes of engineering data arrived on November 24, then contact ended as Earth moved out of the antenna's view. It now travels silently outward with its plaque, without a precisely tracked live location."}{"\n\n"}<a href="https://science.nasa.gov/mission/pioneer-11/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
    ],
  },
  {
    id: "viking-1",
    name: "Viking 1",
    place: "Mars",
    coverImageUrl: "/assets/objects/viking_lander_model.gif",
    recordIds: ["viking-1-lander"],
    sourceUrls: ["https://science.nasa.gov/mission/viking/"],
    pages: [
      {
        label: "Origin",
        title: "The First Successful Landing on Mars",
        imageUrl: "/assets/objects/viking_lander_model.gif",
        caption: "The First Successful Landing on Mars",
        credit: "NSSDCA",
        text: (<>{"Viking 1 launched on August 20, 1975, carrying two partners: an orbiter and a lander. The orbiter reached Mars in June 1976 and helped inspect possible landing places. On July 20, the lander settled in Chryse Planitia and sent pictures from the ground. Its arrival began a long watch over a landscape that people had previously known mainly through telescopes and passing spacecraft."}{"\n\n"}<a href="https://science.nasa.gov/mission/viking/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Goals",
        title: "Search Mars From Orbit and the Surface",
        imageUrl: "/assets/objects/Line_drawing_of_Viking_Orbiter-1.jpeg",
        caption: "Search Mars From Orbit and the Surface",
        credit: "NASA",
        text: (<>{"The partners divided the work. The orbiter photographed Mars and measured surface temperatures and atmospheric water vapor. The lander used a sampler arm, two cameras, weather sensors, a gas chromatograph–mass spectrometer, an X-ray fluorescence spectrometer and three biology experiments to investigate soil and search for evidence of life. Its seismometer failed to deploy properly. Radioisotope generators supplied electricity, and the orbiter helped relay messages."}{"\n\n"}<a href="https://science.nasa.gov/mission/viking/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Discoveries",
        title: "A Complex and Unexpected Mars",
        imageUrl: "/assets/objects/nowv1.jpg",
        caption: "A Complex and Unexpected Mars",
        credit: "NASA",
        text: (<>{"The lander revealed a cold, rocky world with a thin atmosphere and recorded changing winds, temperatures and pressure. It found sulfur-rich soil and measured elements including silicon, iron and calcium. The biology tests produced surprising reactions, but the organic-chemistry experiment did not detect organic compounds, and the results established no clear evidence of life. The Viking orbiters revealed ancient channels and floods, returning 52,663 images and mapping about 97 percent of Mars at roughly 300-meter resolution."}{"\n\n"}<a href="https://science.nasa.gov/mission/viking/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Now",
        title: "Silent on the Martian Surface",
        imageUrl: "/assets/objects/viking-1.webp",
        caption: "Launch of Viking 1",
        credit: "NASA",
        text: (<>{"The lander remains silent in Chryse Planitia. A faulty command disrupted communication in November 1982, and recovery attempts failed. NASA's overview gives November 11 as its final transmission and November 13 as the mission-end date. Its orbiter had already been shut down on August 7, 1980, after attitude-control fuel ran low. These were separate endings: the lander stayed on the surface; the orbiter was left in Mars orbit."}{"\n\n"}<a href="https://science.nasa.gov/mission/viking/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
    ],
  },
  {
    id: "mariner2",
    name: "Mariner 2",
    place: "Venus",
    coverImageUrl: "/assets/objects/mariner02.gif",
    recordIds: ["mariner-2"],
    sourceUrls: ["https://science.nasa.gov/mission/mariner-2/"],
    pages: [
      {
        label: "Origin",
        title: "The First Successful Planetary Mission",
        imageUrl: "/assets/objects/mariner02.gif",
        caption: "The First Successful Planetary Mission",
        credit: "NASA",
        text: (<>{"Mariner 2 left Earth on August 27, 1962, just weeks after Mariner 1's failed launch. Venus was hidden under bright clouds, and scientists disagreed about the world beneath them. After a long journey and a course correction, the probe passed Venus on December 14. It became the first spacecraft to complete a successful scientific encounter with another planet."}{"\n\n"}<a href="https://science.nasa.gov/mission/mariner-2/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Goals",
        title: "A Close Look at Venus",
        imageUrl: "/assets/objects/p-1-90824865-60-years-ago-the-mariner-2-gave-us--ebaab001.jpg",
        caption: "A Close Look at Venus",
        credit: "NASA",
        text: (<>{"It carried microwave and infrared radiometers to measure energy from Venus, rather than a camera to take pictures. A magnetometer looked for magnetic fields; solar-plasma, energetic-particle and dust detectors studied space along the route. Solar panels and a battery supplied electricity. The mission had to test deep-space navigation and communication while investigating the planet's atmosphere and the heat hidden beneath its clouds."}{"\n\n"}<a href="https://science.nasa.gov/mission/mariner-2/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Discoveries",
        title: "A Hot and Hostile Venus",
        imageUrl: "/assets/objects/Two-men-displaying-a-25-foot-printout-of-all-the-3a4541c3.jpeg",
        caption: "A Hot and Hostile Venus",
        credit: "NASA",
        text: (<>{"Its measurements showed that Venus was extremely hot, challenging hopes for a mild world beneath the clouds. It found no detectable planetary magnetic field at its flyby distance and measured the solar wind between planets. This was a new way to investigate a world: instruments traveling near it could test ideas that telescopes alone could not settle. Later missions would refine the conditions that Mariner 2 first revealed."}{"\n\n"}<a href="https://science.nasa.gov/mission/mariner-2/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Now",
        title: "A Silent Traveler",
        imageUrl: "/assets/objects/mariner-1-3-artist-impression-1280-90a53565.jpg",
        caption: "A Silent Traveler",
        credit: "NASA",
        text: (<>{"After the encounter, Mariner 2 continued into an orbit around the Sun; it had not been built to brake into Venus orbit or land. Its last signal reached Earth on January 3, 1963. It is now inactive, following its solar trajectory. The historical orbit describes its destination after the flyby, but there is no active mission measuring its exact present position."}{"\n\n"}<a href="https://science.nasa.gov/mission/mariner-2/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
    ],
  },
  {
    id: "mariner10",
    name: "Mariner 10",
    place: "Mercury",
    coverImageUrl: "/assets/objects/mariner10-a3ef4a7a.gif",
    recordIds: ["mariner-10"],
    sourceUrls: ["https://science.nasa.gov/mission/mariner-10/"],
    pages: [
      {
        label: "Origin",
        title: "The Journey to Mercury",
        imageUrl: "/assets/objects/mariner10-a3ef4a7a.gif",
        caption: "The Journey to Mercury",
        credit: "NASA",
        text: (<>{"Mariner 10 launched on November 3, 1973, aiming for two worlds on one journey. In February 1974, it flew past Venus and used the planet's gravity to redirect its path toward Mercury. On March 29 it reached that little-known planet. The route brought it back for two more Mercury encounters, making this a story of repeated visits rather than one passing glance."}{"\n\n"}<a href="https://science.nasa.gov/mission/mariner-10/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Goals",
        title: "Exploring Mercury and Venus",
        imageUrl: "/assets/objects/Mariner-10-e787934b.jpeg",
        caption: "Exploring Mercury and Venus",
        credit: "NASA",
        text: (<>{"Its television cameras would map visible terrain, while infrared and ultraviolet instruments investigated temperatures and the thin gas around Mercury. A magnetometer and plasma and particle instruments examined the magnetic environment. Solar panels supplied electricity. The mission also tested a powerful navigation technique: a gravity assist, in which a planet changes a spacecraft's speed and direction without using the same amount of onboard fuel."}{"\n\n"}<a href="https://science.nasa.gov/mission/mariner-10/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Discoveries",
        title: "Revealing Mercury",
        imageUrl: "/assets/objects/earth-and-moon-in-space-39e167a4.jpeg",
        caption: "Revealing Mercury",
        credit: "NASA",
        text: (<>{"Mariner 10 revealed Mercury's cratered surface and photographed roughly 45 percent of the planet across its encounters. It discovered an unexpected magnetic field and investigated Mercury's extremely thin atmosphere, more accurately called an exosphere. Its Venus observations revealed cloud patterns. The mission proved that a gravity assist could connect planetary destinations, helping make later, more ambitious journeys through the solar system practical."}{"\n\n"}<a href="https://science.nasa.gov/mission/mariner-10/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Now",
        title: "The Final Signal",
        imageUrl: "/assets/objects/mariner-10-1280x1280-2-77b331a8.jpg",
        caption: "The Final Signal",
        credit: "NASA",
        text: (<>{"After its third Mercury flyby in March 1975, its attitude-control gas was exhausted. Without that gas, it could no longer keep pointing reliably, so controllers switched off its transmitter on March 24. Mariner 10 was left in an orbit around the Sun, rather than around Mercury. It is silent, and its exact present position is not tracked by an active mission."}{"\n\n"}<a href="https://science.nasa.gov/mission/mariner-10/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
    ],
  },
  {
    id: "apollo15",
    name: "Apollo 15",
    place: "Moon",
    coverImageUrl: "/assets/objects/apollo_15_cm.jpg",
    recordIds: ["apollo-15"],
    sourceUrls: ["https://www.nasa.gov/missions/apollo/apollo-15-mission-details/","https://science.nasa.gov/solar-system/moon/genesis-rock/"],
    pages: [
      {
        label: "Origin",
        title: "A New Kind of Moon Mission",
        imageUrl: "/assets/objects/apollo_15_cm.jpg",
        caption: "A New Kind of Moon Mission",
        credit: "NASA",
        text: (<>{"Apollo 15 launched on July 26, 1971, with David Scott, James Irwin and Alfred Worden. It was the first Apollo landing mission equipped for longer stays and wider exploration with a lunar rover. Scott and Irwin landed the lunar module Falcon at Hadley-Apennine on July 30 while Worden worked in orbit. A mountain front and a winding rille now lay within reach of a crew on wheels."}{"\n\n"}<a href="https://www.nasa.gov/missions/apollo/apollo-15-mission-details/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://science.nasa.gov/solar-system/moon/genesis-rock/" target="_blank" rel="noreferrer">NASA source 2</a></>),
      },
      {
        label: "Goals",
        title: "Exploring Hadley-Apennine",
        imageUrl: "/assets/objects/as17_147_22526.jpg",
        caption: "Exploring Hadley-Apennine",
        credit: "NASA",
        text: (<>{"Falcon carried the crew, supplies, the folding Lunar Roving Vehicle and an Apollo Lunar Surface Experiments Package. Scott and Irwin would investigate rocks, collect samples and deploy instruments, including seismometers and a heat-flow experiment. Worden used cameras and scientific instruments in the command and service modules to study the Moon from orbit. The rover let the surface team connect observations across a much wider landscape."}{"\n\n"}<a href="https://www.nasa.gov/missions/apollo/apollo-15-mission-details/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://science.nasa.gov/solar-system/moon/genesis-rock/" target="_blank" rel="noreferrer">NASA source 2</a></>),
      },
      {
        label: "Discoveries",
        title: "Exploring the Moon on Wheels",
        imageUrl: "/assets/objects/apollo_15_lm.jpg",
        caption: "Exploring the Moon on Wheels",
        credit: "NASA",
        text: (<>{"The astronauts traveled about 27.9 kilometers and collected roughly 77 kilograms of samples. Among them was the Genesis Rock, an anorthosite that helped investigate the Moon's early crust. Observations at Hadley Rille and nearby terrain added clues to volcanic and geological history. The surface experiments continued after the crew left, while orbital measurements broadened the expedition beyond the ground they could personally visit."}{"\n\n"}<a href="https://www.nasa.gov/missions/apollo/apollo-15-mission-details/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://science.nasa.gov/solar-system/moon/genesis-rock/" target="_blank" rel="noreferrer">NASA source 2</a></>),
      },
      {
        label: "Now",
        title: "A Mission That Came Home",
        imageUrl: "/assets/objects/S71-37963-large-66ce2d79.jpg",
        caption: "A Mission That Came Home",
        credit: "NASA",
        text: (<>{"The crew returned to Earth on August 7, 1971, after a twelve-day mission. Their command module came home, so the entire spacecraft should not be described as abandoned on the Moon. Falcon's descent stage, the rover and deployed equipment remain at Hadley-Apennine because they were not needed for the return journey. The ascent stage carried the astronauts back to orbit and was later deliberately impacted on the Moon."}{"\n\n"}<a href="https://www.nasa.gov/missions/apollo/apollo-15-mission-details/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://science.nasa.gov/solar-system/moon/genesis-rock/" target="_blank" rel="noreferrer">NASA source 2</a></>),
      },
    ],
  },
  {
    id: "viking-2",
    name: "Viking 2",
    place: "Mars",
    coverImageUrl: "/assets/objects/viking-1.webp",
    recordIds: ["viking-2-lander"],
    sourceUrls: ["https://science.nasa.gov/mission/viking/"],
    pages: [
      {
        label: "Origin",
        title: "Viking 1's Twin on Mars",
        imageUrl: "/assets/objects/viking-1.webp",
        caption: "Viking 1's Twin on Mars",
        credit: "NASA",
        text: (<>{"Viking 2 launched in September 1975, following Viking 1 with another orbiter-and-lander team. It entered Mars orbit in August 1976. On September 3, its lander reached Utopia Planitia, far from Viking 1's site. By watching a second landscape, the mission could test whether the first landing had shown a typical part of Mars or only one chapter of a much larger story."}{"\n\n"}<a href="https://science.nasa.gov/mission/viking/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Goals",
        title: "Study Mars and Search for Life",
        imageUrl: "/assets/objects/sagan_viking.jpg",
        caption: "Study Mars and Search for Life",
        credit: "NASA",
        text: (<>{"The orbiter used cameras, an infrared thermal mapper and a water-vapor detector to study Mars and support the landing. On the ground, two cameras, a sampler arm, weather sensors, a seismometer, a gas chromatograph–mass spectrometer, an X-ray fluorescence spectrometer and three biology experiments investigated the surroundings. Radioisotope generators powered the lander. Scientists wanted to compare both sites and search for evidence of life while documenting the planet's surface and atmosphere."}{"\n\n"}<a href="https://science.nasa.gov/mission/viking/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Discoveries",
        title: "A Different Face of Mars",
        imageUrl: "/assets/objects/mars.jpg",
        caption: "A Different Face of Mars",
        credit: "NASA",
        text: (<>{"Viking 2 photographed a rocky plain and seasonal frost, recorded weather, and measured the chemistry and behavior of the soil. Like Viking 1, its biology experiments produced puzzling reactions without establishing that life existed. The orbiters' maps and images of Mars and its moons widened the surface observations into a planetary picture. Comparing both sites helped scientists understand how varied Martian environments could be."}{"\n\n"}<a href="https://science.nasa.gov/mission/viking/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Now",
        title: "A Long-Quiet Lander",
        imageUrl: "/assets/objects/viking_lander_model.gif",
        caption: "A Long-Quiet Lander",
        credit: "NASA",
        text: (<>{"The lander still stands in Utopia Planitia. It stopped operating on April 11, 1980, after its batteries failed; a fixed lander had no way to leave. The orbiter's mission had ended earlier, on July 25, 1978, after a propulsion-system leak depleted attitude-control gas. It was left in orbit around Mars. The orbiter and lander should not be given the same last-contact date."}{"\n\n"}<a href="https://science.nasa.gov/mission/viking/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
    ],
  },
  {
    id: "mars-global-surveyor",
    name: "Mars Global Surveyor",
    place: "Mars",
    coverImageUrl: "/assets/objects/mgs_768.jpg",
    recordIds: ["mars-global-surveyor"],
    sourceUrls: ["https://science.nasa.gov/mission/mars-global-surveyor/","https://www.jpl.nasa.gov/news/report-reveals-likely-causes-of-mars-spacecraft-loss/"],
    pages: [
      {
        label: "Origin",
        title: "Mapping Mars From Orbit",
        imageUrl: "/assets/objects/mgs_768.jpg",
        caption: "Mapping Mars From Orbit",
        credit: "NASA",
        text: (<>{"Mars Global Surveyor launched on November 7, 1996, to rebuild the global mapping effort after Mars Observer was lost. It reached Mars in September 1997, then used repeated passes through the upper atmosphere to reshape its orbit, a technique called aerobraking. By 1999 it was ready to survey the planet systematically. Instead of one brief encounter, it would watch Mars change over years."}{"\n\n"}<a href="https://science.nasa.gov/mission/mars-global-surveyor/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://www.jpl.nasa.gov/news/report-reveals-likely-causes-of-mars-spacecraft-loss/" target="_blank" rel="noreferrer">NASA/JPL source 2</a></>),
      },
      {
        label: "Goals",
        title: "Survey the Entire Planet",
        imageUrl: "/assets/objects/mars2.jpg",
        caption: "Survey the Entire Planet",
        credit: "NASA",
        text: (<>{"Its camera examined landforms, and a laser altimeter measured heights to turn pictures into a topographic map. A thermal emission spectrometer identified minerals and temperatures; a magnetometer and electron reflectometer investigated magnetic properties. Radio science explored gravity and the atmosphere. A relay antenna connected surface missions with Earth. The goal was to study Mars as a whole and help future explorers land safely."}{"\n\n"}<a href="https://science.nasa.gov/mission/mars-global-surveyor/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://www.jpl.nasa.gov/news/report-reveals-likely-causes-of-mars-spacecraft-loss/" target="_blank" rel="noreferrer">NASA/JPL source 2</a></>),
      },
      {
        label: "Discoveries",
        title: "Evidence of Water and a Changing Mars",
        imageUrl: "/assets/objects/mars-dust-storms-global-pia03170.webp",
        caption: "Evidence of Water and a Changing Mars",
        credit: "NASA",
        text: (<>{"Its measurements produced a detailed global height map and revealed strongly magnetized ancient crust. It identified hematite deposits that helped guide Opportunity's landing-site selection. Images documented gullies, layered terrain, dust storms and changing polar regions, giving scientists new questions about water and climate. It also scouted landing sites and relayed rover data. These observations remain useful long after the spacecraft itself stopped working."}{"\n\n"}<a href="https://science.nasa.gov/mission/mars-global-surveyor/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://www.jpl.nasa.gov/news/report-reveals-likely-causes-of-mars-spacecraft-loss/" target="_blank" rel="noreferrer">NASA/JPL source 2</a></>),
      },
      {
        label: "Now",
        title: "A Decade of Mars Exploration",
        imageUrl: "/assets/objects/ZyIw1.jpg",
        caption: "A Decade of Mars Exploration",
        credit: "NASA",
        text: (<>{"Its final communication came on November 2, 2006. A review linked the loss to earlier computer-memory and commanding errors that led to an unsafe orientation, an overheated battery and depleted power. Controllers could not recover it. It was last known in Mars orbit and is no longer communicating; no precise present location is claimed. Its last signal and the later mission-end date describe different events."}{"\n\n"}<a href="https://science.nasa.gov/mission/mars-global-surveyor/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://www.jpl.nasa.gov/news/report-reveals-likely-causes-of-mars-spacecraft-loss/" target="_blank" rel="noreferrer">NASA/JPL source 2</a></>),
      },
    ],
  },
  {
    id: "mars-pathfinder",
    name: "Mars Pathfinder",
    place: "Mars",
    coverImageUrl: "/assets/objects/marspath1.gif",
    recordIds: ["sojourner-pathfinder"],
    sourceUrls: ["https://science.nasa.gov/mission/mars-pathfinder/"],
    pages: [
      {
        label: "Origin",
        title: "The Mission That Sent Sojourner to Mars",
        imageUrl: "/assets/objects/marspath1.gif",
        caption: "The Mission That Sent Sojourner to Mars",
        credit: "NASA",
        text: (<>{"Mars Pathfinder launched on December 4, 1996, with Sojourner folded inside. On July 4, 1997, it reached Ares Vallis and tried a new landing method: a parachute slowed the descent, rockets helped reduce speed, and airbags cushioned the final bounces. Once it settled, its petals opened to reveal the rover. The lander became the stationary home base for a new kind of Mars expedition."}{"\n\n"}<a href="https://science.nasa.gov/mission/mars-pathfinder/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Goals",
        title: "Prove a New Way to Explore Mars",
        imageUrl: "/assets/objects/marspath3.gif",
        caption: "Prove a New Way to Explore Mars",
        credit: "NASA",
        text: (<>{"Pathfinder was built to demonstrate a relatively inexpensive landing system and support a rover while collecting real science. Its stereo camera surveyed the terrain, and its atmospheric and meteorology package measured conditions during descent and on the ground. Solar power kept the station running. The lander's radio link relayed Sojourner's rock and soil measurements to Earth, turning two small machines into a coordinated science team."}{"\n\n"}<a href="https://science.nasa.gov/mission/mars-pathfinder/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Discoveries",
        title: "Evidence of a Warmer, Wetter Mars",
        imageUrl: "/assets/objects/marspsite.gif",
        caption: "Evidence of a Warmer, Wetter Mars",
        credit: "NASA",
        text: (<>{"The lander returned more than 16,500 images and extensive weather observations; Sojourner added hundreds of close views and chemical analyses. Their pictures and measurements suggested that water had shaped the region in powerful ancient floods and revealed differences among rocks. Pathfinder also proved that its airbags and rover-support system could work on Mars. That engineering success helped prepare the way for Spirit and Opportunity."}{"\n\n"}<a href="https://science.nasa.gov/mission/mars-pathfinder/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Now",
        title: "Resting at Ares Vallis",
        imageUrl: "/assets/objects/marsrover.gif",
        caption: "Resting at Ares Vallis",
        credit: "NASA",
        text: (<>{"The lander, named the Carl Sagan Memorial Station, remains in Ares Vallis with Sojourner nearby. Its final data transmission reached Earth on September 27, 1997. Later contact attempts failed, so the precise failure was not directly established. With no return rocket and no working link to Earth, the station stayed where its airbags had delivered it. Its mission ended, but its landing approach continued to influence exploration."}{"\n\n"}<a href="https://science.nasa.gov/mission/mars-pathfinder/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
    ],
  },
  {
    id: "phoenix",
    name: "Phoenix",
    place: "Mars",
    coverImageUrl: "/assets/objects/phoenix_lander.jpg",
    recordIds: ["phoenix"],
    sourceUrls: ["https://science.nasa.gov/mission/mars-phoenix/"],
    pages: [
      {
        label: "Origin",
        title: "Digging Into the Martian Arctic",
        imageUrl: "/assets/objects/phoenix_lander.jpg",
        caption: "Digging Into the Martian Arctic",
        credit: "NASA",
        text: (<>{"Phoenix launched on August 4, 2007, carrying a name that suited its history: it reused hardware developed for an earlier canceled Mars mission. On May 25, 2008, it landed on the northern arctic plains, in Vastitas Borealis. Unlike a rover, it would explore one place carefully. Under the patterned ground lay the target its arm had come to reach: ice close to the surface."}{"\n\n"}<a href="https://science.nasa.gov/mission/mars-phoenix/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Goals",
        title: "Search for Water and Habitability",
        imageUrl: "/assets/objects/phoenix_3352.jpg",
        caption: "Search for Water and Habitability",
        credit: "NASA",
        text: (<>{"Its robotic arm dug trenches and delivered samples to tiny ovens in the Thermal and Evolved Gas Analyzer. The Microscopy, Electrochemistry and Conductivity Analyzer examined soil in other ways, including wet chemistry. Stereo and arm cameras showed the site, while a weather station watched the atmosphere. Solar panels powered the work. Phoenix sought the history of water and clues to whether this polar environment could support life."}{"\n\n"}<a href="https://science.nasa.gov/mission/mars-phoenix/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Discoveries",
        title: "Water Ice Beneath the Surface",
        imageUrl: "/assets/objects/phoenix_440.gif",
        caption: "Water Ice Beneath the Surface",
        credit: "NASA",
        text: (<>{"When Phoenix dug through the soil, it exposed bright material that disappeared after exposure, consistent with ice turning directly into vapor. Heating a sample then confirmed water ice. Soil tests also detected perchlorate, and weather observations revealed snow falling from clouds. These findings connected the buried ice with an active polar environment. They supplied evidence about water and chemistry, without demonstrating that Mars had living organisms."}{"\n\n"}<a href="https://science.nasa.gov/mission/mars-phoenix/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Now",
        title: "A Lander Frozen in the Arctic",
        imageUrl: "/assets/objects/sunPhoenix.jpg",
        caption: "A Lander Frozen in the Arctic",
        credit: "NASA",
        text: (<>{"Phoenix remains at its landing site on the northern plains. Its last signal arrived on November 2, 2008, as shorter days and worsening weather reduced solar power. It was never designed to leave Mars or survive the severe winter indefinitely. Later orbital images showed damage consistent with winter conditions. The seasonal change ended the work of a lander that had spent its summer uncovering the frozen ground."}{"\n\n"}<a href="https://science.nasa.gov/mission/mars-phoenix/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
    ],
  },
  {
    id: "apollo-15-lrv",
    name: "Apollo 15 LRV",
    place: "Moon",
    coverImageUrl: "/assets/objects/as17_147_22526.jpg",
    recordIds: ["apollo-15-lrv"],
    sourceUrls: ["https://www.nasa.gov/missions/apollo/apollo-15-mission-details/","https://science.nasa.gov/solar-system/moon/genesis-rock/"],
    pages: [
      {
        label: "Origin",
        title: "A Rover Built for the Moon",
        imageUrl: "/assets/objects/as17_147_22526.jpg",
        caption: "A Rover Built for the Moon",
        credit: "NASA",
        text: (<>{"The Apollo 15 Lunar Roving Vehicle traveled to the Moon folded against Falcon's descent stage. In July 1971, David Scott and James Irwin unfolded it at Hadley-Apennine, turning a compact package into the first car driven on the Moon. For astronauts who previously had to walk between every target, the little rover changed the scale of an expedition. Distant outcrops became destinations they could reach and study."}{"\n\n"}<a href="https://www.nasa.gov/missions/apollo/apollo-15-mission-details/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://science.nasa.gov/solar-system/moon/genesis-rock/" target="_blank" rel="noreferrer">NASA source 2</a></>),
      },
      {
        label: "Goals",
        title: "Explore Beyond Walking Distance",
        imageUrl: "/assets/objects/as17_146_22367.jpg",
        caption: "Explore Beyond Walking Distance",
        credit: "NASA",
        text: (<>{"Its four independently driven wheels, electric motors and batteries carried two astronauts, tools and samples over rough ground. Navigation equipment helped them keep track of their route. A television camera and communications equipment linked the expedition with Earth. It was a crew-driven exploration vehicle, built to extend geological traverses and conserve the astronauts' limited time and energy, rather than a robot with its own long-term science mission."}{"\n\n"}<a href="https://www.nasa.gov/missions/apollo/apollo-15-mission-details/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://science.nasa.gov/solar-system/moon/genesis-rock/" target="_blank" rel="noreferrer">NASA source 2</a></>),
      },
      {
        label: "Discoveries",
        title: "A New Way to Explore the Moon",
        imageUrl: "/assets/objects/lrv_deployment_art.jpg",
        caption: "A New Way to Explore the Moon",
        credit: "NASA",
        text: (<>{"Across Apollo 15's moonwalks, the rover covered about 27.9 kilometers. It helped the crew examine Hadley Rille, mountain-front terrain and different rock exposures, and bring roughly 77 kilograms of samples back to Falcon. Those samples included the Genesis Rock, a clue to the early lunar crust. The discoveries belonged to the astronauts and their instruments; the rover enabled them by making more places accessible."}{"\n\n"}<a href="https://www.nasa.gov/missions/apollo/apollo-15-mission-details/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://science.nasa.gov/solar-system/moon/genesis-rock/" target="_blank" rel="noreferrer">NASA source 2</a></>),
      },
      {
        label: "Now",
        title: "Still Parked on the Moon",
        imageUrl: "/assets/objects/as15_88_11901.jpg",
        caption: "Still Parked on the Moon",
        credit: "NASA",
        text: (<>{"The rover remains parked near Apollo 15's landing area at Hadley-Apennine. The astronauts left it on August 2, 1971, when Falcon's ascent stage lifted them back toward lunar orbit. There was no room or need to bring the vehicle home. It stopped being an exploration tool when its drivers departed, and it carried no independent long-term scientific instruments to keep working afterward."}{"\n\n"}<a href="https://www.nasa.gov/missions/apollo/apollo-15-mission-details/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://science.nasa.gov/solar-system/moon/genesis-rock/" target="_blank" rel="noreferrer">NASA source 2</a></>),
      },
    ],
  },
  {
    id: "insight",
    name: "InSight",
    place: "Mars",
    coverImageUrl: "/assets/objects/insight.jpg",
    recordIds: ["insight"],
    sourceUrls: ["https://science.nasa.gov/mission/insight/","https://www.jpl.nasa.gov/news/nasa-retires-insight-mars-lander-mission-after-years-of-science/"],
    pages: [
      {
        label: "Origin",
        title: "Listening to the Heart of Mars",
        imageUrl: "/assets/objects/insight.jpg",
        caption: "Listening to the Heart of Mars",
        credit: "NASA",
        text: (<>{"InSight launched on May 5, 2018, and landed in Elysium Planitia on November 26. Its destination looked quieter than a dramatic canyon or mountain, which was useful: the lander needed a safe, smooth place to listen. Instead of driving across Mars, it placed instruments beside itself and began investigating the hidden layers beneath the surface."}{"\n\n"}<a href="https://science.nasa.gov/mission/insight/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://www.jpl.nasa.gov/news/nasa-retires-insight-mars-lander-mission-after-years-of-science/" target="_blank" rel="noreferrer">NASA/JPL source 2</a></>),
      },
      {
        label: "Goals",
        title: "Look Beneath the Surface",
        imageUrl: "/assets/objects/38686_Mars-InSight-Solar-Panels-Open-pia196641.jpg",
        caption: "Look Beneath the Surface",
        credit: "NASA",
        text: (<>{"A sensitive seismometer, SEIS, listened for marsquakes. Radio tracking through the RISE experiment measured the planet's wobble to investigate its interior. A heat-flow probe called HP3 was meant to burrow into the soil and measure escaping heat. Cameras, a robotic arm, weather sensors and a magnetometer supported the measurements. Solar arrays powered this effort to learn how Mars and other rocky planets formed."}{"\n\n"}<a href="https://science.nasa.gov/mission/insight/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://www.jpl.nasa.gov/news/nasa-retires-insight-mars-lander-mission-after-years-of-science/" target="_blank" rel="noreferrer">NASA/JPL source 2</a></>),
      },
      {
        label: "Discoveries",
        title: "The Sounds and Secrets of Mars",
        imageUrl: "/assets/objects/D000M1436_724026330EDR_F0000_0817M_.jpg",
        caption: "The Sounds and Secrets of Mars",
        credit: "NASA",
        text: (<>{"InSight detected more than 1,300 marsquakes. Their vibrations helped scientists estimate the structure of the crust, mantle and core, and some signals could be connected to fresh meteorite impacts. Radio observations added information about the core and rotation. Not everything worked: the heat probe could not reach its planned depth because the soil did not provide the expected friction. Its successes and limits both improved knowledge of Mars."}{"\n\n"}<a href="https://science.nasa.gov/mission/insight/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://www.jpl.nasa.gov/news/nasa-retires-insight-mars-lander-mission-after-years-of-science/" target="_blank" rel="noreferrer">NASA/JPL source 2</a></>),
      },
      {
        label: "Now",
        title: "Silent Beneath the Martian Sky",
        imageUrl: "/assets/objects/SsGBxVZMFznSQXkiNeeoyM.jpg",
        caption: "Silent Beneath the Martian Sky",
        credit: "NASA",
        text: (<>{"InSight remains in Elysium Planitia, with its instruments beside the lander. Dust gradually covered its solar panels and reduced the electricity available. Its last communication was on December 15, 2022; NASA declared the mission over on December 21 after unsuccessful contact attempts. It had no wheels or return vehicle. The quiet site chosen for listening became the resting place of a lander whose archived signals are still being studied."}{"\n\n"}<a href="https://science.nasa.gov/mission/insight/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://www.jpl.nasa.gov/news/nasa-retires-insight-mars-lander-mission-after-years-of-science/" target="_blank" rel="noreferrer">NASA/JPL source 2</a></>),
      },
    ],
  },
  {
    id: "mariner-4",
    name: "Mariner 4",
    place: "Mars",
    coverImageUrl: "/assets/objects/mariner04.gif",
    recordIds: ["mariner-4"],
    sourceUrls: ["https://science.nasa.gov/mission/mariner-4/"],
    pages: [
      {
        label: "Origin",
        title: "The First Close-Up Look at Mars",
        imageUrl: "/assets/objects/mariner04.gif",
        caption: "The First Close-Up Look at Mars",
        credit: "NASA",
        text: (<>{"Mariner 4 launched on November 28, 1964, carrying a camera toward a planet people had imagined for centuries. On July 14–15, 1965, it flew past Mars. As the first close pictures began arriving, engineers turned image numbers into a hand-colored preview while waiting for computer processing. The encounter replaced distant guesses with a narrow but remarkable first look at another planet's ground."}{"\n\n"}<a href="https://science.nasa.gov/mission/mariner-4/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Goals",
        title: "See Mars Up Close",
        imageUrl: "/assets/objects/m04_1_2a.jpg",
        caption: "See Mars Up Close",
        credit: "NASA",
        text: (<>{"A television camera and tape recorder would capture and store the passing view. A magnetometer, plasma and energetic-particle detectors, and a cosmic-dust detector examined the surroundings. Its radio signal would probe the atmosphere as Mars passed between the spacecraft and Earth. Solar panels supplied power. The goal was to photograph Mars and measure its environment while demonstrating reliable communication across interplanetary distances."}{"\n\n"}<a href="https://science.nasa.gov/mission/mariner-4/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Discoveries",
        title: "A Cratered, Unexpected Mars",
        imageUrl: "/assets/objects/38754_Mars-Mariner-4-first-tv-image-color-next-to-black-and-white.jpg",
        caption: "A Cratered, Unexpected Mars",
        credit: "NASA",
        text: (<>{"Mariner 4 returned 21 complete pictures and part of a twenty-second, showing a heavily cratered landscape. Radio measurements revealed a thin atmosphere, and the probe detected no strong global magnetic field. Its pictures covered only a small portion of Mars, so they could not tell the whole planet's story. They nevertheless gave later missions real observations to build on instead of imagined canals and Earth-like scenery."}{"\n\n"}<a href="https://science.nasa.gov/mission/mariner-4/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Now",
        title: "Drifting Through Solar Orbit",
        imageUrl: "/assets/objects/6805_Mariner-4-animation-spacecraft-engine-burn-full2.jpg",
        caption: "Drifting Through Solar Orbit",
        credit: "NASA",
        text: (<>{"Mariner 4 passed Mars rather than stopping there and continued in solar orbit. After extended observations and later dust encounters, its supply of pointing gas ran low. Communication ended on December 21, 1967. It is now an inactive spacecraft presumed to remain in orbit around the Sun. Its historical trajectory is known, but its exact present position is not supplied by active tracking."}{"\n\n"}<a href="https://science.nasa.gov/mission/mariner-4/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
    ],
  },
  {
    id: "mariner-6",
    name: "Mariner 6",
    place: "Mars",
    coverImageUrl: "/assets/objects/mariner06-07.gif",
    recordIds: ["mariner-6"],
    sourceUrls: ["https://science.nasa.gov/mission/mariner-6/"],
    pages: [
      {
        label: "Origin",
        title: "A Closer Look at Mars",
        imageUrl: "/assets/objects/mariner06-07.gif",
        caption: "A Closer Look at Mars",
        credit: "NASA",
        text: (<>{"Mariner 6 launched on February 25, 1969, as the first of a pair sent to revisit Mars after Mariner 4. Its twin, Mariner 7, would follow a different route a few days behind. On July 31, Mariner 6 passed close to the equatorial region. The spacecraft had little time near the planet, so its instruments followed a carefully arranged sequence as the surface swept below."}{"\n\n"}<a href="https://science.nasa.gov/mission/mariner-6/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Goals",
        title: "Study Mars From a Close Flyby",
        imageUrl: "/assets/objects/Mariner_6_7_solar_orbit.png",
        caption: "Study Mars From a Close Flyby",
        credit: "NASA",
        text: (<>{"Two television cameras took both broad and close views. Infrared and ultraviolet spectrometers studied radiation to learn about the surface and atmosphere, while an infrared radiometer measured temperatures. A radio-occultation experiment used changes in the radio signal to investigate atmospheric conditions. Solar panels powered the probe. Its observations would help scientists assess Mars's environment and plan later missions that could stay longer."}{"\n\n"}<a href="https://science.nasa.gov/mission/mariner-6/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Discoveries",
        title: "A Heavily Cratered Mars",
        imageUrl: "/assets/objects/jupitrtbym7.png",
        caption: "Mariner 7 far encounter color composite, created using Red, Green and Blue filter images",
        credit: "Wikipedia",
        text: (<>{"Its pictures showed heavily cratered and chaotic terrain, expanding the small area seen by Mariner 4. Spectral and temperature measurements supported a carbon-dioxide-rich atmosphere and frozen carbon dioxide in the south polar cap. The southern observations were interesting enough that controllers adjusted Mariner 7's upcoming work. The two missions showed how an early encounter could guide the next spacecraft while it was still approaching."}{"\n\n"}<a href="https://science.nasa.gov/mission/mariner-6/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Now",
        title: "A Silent Flyby Pioneer",
        imageUrl: "/assets/objects/mariner_1_3_artist_impression-1280.jpg",
        caption: "A Silent Flyby Pioneer",
        credit: "NASA",
        text: (<>{"Mariner 6 continued into solar orbit after the flyby. NASA's mission history says data were received until mid-1971, although the supplied orbiter file does not give a precise last-contact date. It is no longer communicating and is presumed to remain on its orbit around the Sun. It stayed there because its mission was a flyby, with no landing or orbit-insertion maneuver at Mars."}{"\n\n"}<a href="https://science.nasa.gov/mission/mariner-6/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
    ],
  },
  {
    id: "mariner-7",
    name: "Mariner 7",
    place: "Mars",
    coverImageUrl: "/assets/objects/Mariner_7_lift-off.jpg",
    recordIds: ["mariner-7"],
    sourceUrls: ["https://science.nasa.gov/mission/mariner-7/"],
    pages: [
      {
        label: "Origin",
        title: "The Second Eye on Mars",
        imageUrl: "/assets/objects/Mariner_7_lift-off.jpg",
        caption: "The Second Eye on Mars",
        credit: "NASA",
        text: (<>{"Mariner 7 launched on March 27, 1969, following Mariner 6 toward Mars. Days before the encounter, its communication faltered, but controllers recovered a faint signal and switched antennas. They also adjusted the observing plan using pictures already returned by its twin. On August 5, it passed Mars, carrying a revised assignment that paid special attention to the southern polar region."}{"\n\n"}<a href="https://science.nasa.gov/mission/mariner-7/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Goals",
        title: "Build on Mariner 6",
        imageUrl: "/assets/objects/Mars_full_disk_approach_view_from_Mariner_7.jpg",
        caption: "Build on Mariner 6",
        credit: "NASA",
        text: (<>{"Like Mariner 6, it carried two television cameras, infrared and ultraviolet spectrometers, an infrared radiometer and a radio-occultation experiment. These instruments examined terrain, atmospheric composition and temperatures. Solar panels powered the spacecraft. The goal was to complement its twin's equatorial observations with views farther south, giving scientists two sets of measurements from different parts of Mars within a few days."}{"\n\n"}<a href="https://science.nasa.gov/mission/mariner-7/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Discoveries",
        title: "Mars From the Southern Hemisphere",
        imageUrl: "/assets/objects/jupitrtbym7.png",
        caption: "Mariner 7 far encounter color composite, created using Red, Green and Blue filter images",
        credit: "Wikipedia",
        text: (<>{"Mariner 7 returned 126 images, including views of cratered terrain, the south polar region and the broad Hellas basin. Some pictures also captured the irregular shape of Phobos. Its atmosphere and temperature measurements complemented Mariner 6's, strengthening the picture of a cold world with a thin carbon-dioxide atmosphere. The recovered encounter showed how quick work on Earth could rescue a spacecraft's chance to gather science."}{"\n\n"}<a href="https://science.nasa.gov/mission/mariner-7/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Now",
        title: "Beyond Mars",
        imageUrl: "/assets/objects/mariner_1_3_artist_impression-1280.jpg",
        caption: "Beyond Mars",
        credit: "NASA",
        text: (<>{"After passing Mars, Mariner 7 continued in an orbit around the Sun. NASA's mission history reports receiving data until mid-1971; an exact final transmission date is not established in the supplied record. It is now silent and presumed to remain on that solar trajectory. It was never intended to stop at Mars, and no active mission tracks its exact current location."}{"\n\n"}<a href="https://science.nasa.gov/mission/mariner-7/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
    ],
  },
  {
    id: "mariner-9",
    name: "Mariner 9",
    place: "Mars",
    coverImageUrl: "/assets/objects/mariner09.jpg",
    recordIds: ["mariner-9"],
    sourceUrls: ["https://science.nasa.gov/mission/mariner-9/"],
    pages: [
      {
        label: "Origin",
        title: "The First Spacecraft to Orbit Another Planet",
        imageUrl: "/assets/objects/mariner09.jpg",
        caption: "The First Spacecraft to Orbit Another Planet",
        credit: "NASA",
        text: (<>{"Mariner 9 launched on May 30, 1971, and reached Mars on November 14. It became the first spacecraft to orbit another planet, only to find its destination hidden by a huge dust storm. A flyby would have had to leave with that disappointing view. Mariner 9 could wait, and when the dust cleared it began revealing a Mars far more varied than earlier pictures suggested."}{"\n\n"}<a href="https://science.nasa.gov/mission/mariner-9/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Goals",
        title: "Map Mars From Orbit",
        imageUrl: "/assets/objects/mariner-1971.webp",
        caption: "Map Mars From Orbit",
        credit: "NASA",
        text: (<>{"Its wide- and narrow-angle television cameras were designed to map the surface, while infrared and ultraviolet spectrometers examined temperatures and atmospheric properties. Radio measurements added information about the atmosphere and gravity. Solar arrays powered repeated observations. It aimed to map most of Mars, watch changes over time and photograph Phobos and Deimos, taking advantage of the repeated visits that an orbit made possible."}{"\n\n"}<a href="https://science.nasa.gov/mission/mariner-9/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Discoveries",
        title: "A Completely Different Mars",
        imageUrl: "/assets/objects/Underside+boxart.webp",
        caption: "A Completely Different Mars",
        credit: "NASA",
        text: (<>{"Mariner 9 revealed giant volcanoes including Olympus Mons, the canyon system named Valles Marineris, and channels that raised new questions about ancient water. It returned 7,329 images and mapped about 85 percent of the planet, also photographing both moons. Those observations transformed Mars from a seemingly uniform cratered world into a planet with a complex geological history, guiding later orbiters and landers."}{"\n\n"}<a href="https://science.nasa.gov/mission/mariner-9/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Now",
        title: "Still Circling Mars",
        imageUrl: "/assets/objects/mariner_1_3_artist_impression-1280.jpg",
        caption: "Still Circling Mars",
        credit: "NASA",
        text: (<>{"Its final contact came on October 27, 1972, when its nitrogen supply for pointing was exhausted. It was left inactive in Mars orbit. NASA's historical account predicted a possible impact around 2020, but a prediction is not an observed event, and the supplied sources do not confirm a present orbit or impact. Its exact current location and whether it has reached the surface remain unconfirmed here."}{"\n\n"}<a href="https://science.nasa.gov/mission/mariner-9/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
    ],
  },
  {
    id: "pioneer5",
    name: "Pioneer 5",
    place: "Solar Orbit",
    coverImageUrl: "/assets/objects/Ready-for-Orbit-0b706a30.jpeg",
    recordIds: ["pioneer-5"],
    sourceUrls: ["https://science.nasa.gov/mission/pioneer-5/"],
    pages: [
      {
        label: "Origin",
        title: "A Pioneer Between Earth and Venus",
        imageUrl: "/assets/objects/Ready-for-Orbit-0b706a30.jpeg",
        caption: "A Pioneer Between Earth and Venus",
        credit: "NASA",
        text: (<>{"Pioneer 5 launched on March 11, 1960, when communicating far beyond Earth was still a new challenge. An earlier plan for a Venus encounter had changed into a journey around the Sun between Earth's and Venus's orbits. This small explorer would investigate the space connecting planets. Its destination was not a landing place, but a route along which it could measure an unfamiliar environment."}{"\n\n"}<a href="https://science.nasa.gov/mission/pioneer-5/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Goals",
        title: "Testing Deep Space Technology",
        imageUrl: "/assets/objects/Pioneer-5-main-6d90f78c.jpg",
        caption: "Pioneer 5 close up",
        credit: "NASA",
        text: (<>{"A magnetometer measured magnetic fields, while an ionization chamber, Geiger-Müller tube and proportional counter telescope investigated radiation. A micrometeoroid instrument watched for small particles, and an aspect sensor helped establish orientation. Solar cells supplied power. Its Telebit digital telemetry system sent instrument readings back to Earth, testing how a spacecraft could share useful measurements across growing interplanetary distances."}{"\n\n"}<a href="https://science.nasa.gov/mission/pioneer-5/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Discoveries",
        title: "Mapping the Space Between Planets",
        imageUrl: "/assets/objects/pioneer-5-7de36f84-b7b8-4396-ad04-e3364832dd1-re-73fbd6b5.jpeg",
        caption: "Mapping the Space Between Planets",
        credit: "NASA",
        text: (<>{"Pioneer 5 confirmed a weak magnetic field in interplanetary space and collected radiation observations. Its communication system also demonstrated that digital measurements could reach Earth from millions of kilometers away. Those achievements helped turn the space between planets into a subject of measurement rather than an empty gap. They provided experience needed for future missions with longer journeys and more demanding communications."}{"\n\n"}<a href="https://science.nasa.gov/mission/pioneer-5/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Now",
        title: "Still Circling the Sun",
        imageUrl: "/assets/objects/element115-final-pass-385cd01f.jpg",
        caption: "Still Circling the Sun",
        credit: "NASA",
        text: (<>{"Controllers last contacted Pioneer 5 on June 26, 1960, when it was about 36.4 million kilometers from Earth. It was already following a solar orbit and had no return or planetary-landing mission. NASA describes it as a derelict spacecraft circling the Sun. It is inactive today; the old mission record does not provide a continuously tracked, exact present position."}{"\n\n"}<a href="https://science.nasa.gov/mission/pioneer-5/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
    ],
  },
  {
    id: "lunarorbiter1",
    name: "Lunar Orbiter 1",
    place: "Moon",
    coverImageUrl: "/assets/objects/lunar-orbiter-render-93cde28b.jpg",
    recordIds: ["lunar-orbiter-1"],
    sourceUrls: ["https://science.nasa.gov/mission/lunar-orbiter-1/"],
    pages: [
      {
        label: "Origin",
        title: "The First U.S. Orbiter of the Moon",
        imageUrl: "/assets/objects/lunar-orbiter-render-93cde28b.jpg",
        caption: "The First U.S. Orbiter of the Moon",
        credit: "NASA",
        text: (<>{"Lunar Orbiter 1 launched on August 10, 1966, to scout the Moon before Apollo crews arrived. It entered lunar orbit on August 14, becoming the first U.S. spacecraft to do so. From above, it could investigate more terrain than a lander could reach. Its first assignment was practical: find places where astronauts might safely descend, then explore."}{"\n\n"}<a href="https://science.nasa.gov/mission/lunar-orbiter-1/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Goals",
        title: "Finding Safe Landing Sites",
        imageUrl: "/assets/objects/lunar-orbiter-1-launch-2-spacecraft-2-0d2d5f38.jpg",
        caption: "Finding Safe Landing Sites",
        credit: "NASA",
        text: (<>{"A photographic system with wide- and narrow-angle lenses exposed film, developed it onboard, scanned it and sent the images to Earth by radio. Solar panels supplied electricity, and an engine established lunar orbit. Radiation and micrometeoroid detectors measured hazards, while radio tracking helped investigate gravity. It was designed to survey candidate Apollo sites and support the navigation of future lunar explorers."}{"\n\n"}<a href="https://science.nasa.gov/mission/lunar-orbiter-1/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Discoveries",
        title: "A New View of the Moon",
        imageUrl: "/assets/objects/1272-lunar-orbiter-moon-jf-35b484c0.jpg",
        caption: "A New View of the Moon",
        credit: "NASA",
        text: (<>{"Its photographs covered possible landing regions and gave planners views of terrain much finer than those available from Earth. It also took the first photograph of Earth from the vicinity of the Moon, placing our own world above the lunar horizon. Engineering problems reduced some high-resolution results, but the mission demonstrated that an orbiting photographic scout could provide maps for the next stage of exploration."}{"\n\n"}<a href="https://science.nasa.gov/mission/lunar-orbiter-1/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Now",
        title: "Its Final Orbit",
        imageUrl: "/assets/objects/1-lunar-orbiter-spacecraft-in-moon-orbit-detlev--5ed48b51.jpg",
        caption: "Its Final Orbit",
        credit: "NASA",
        text: (<>{"Controllers deliberately sent Lunar Orbiter 1 into the far side of the Moon on October 29, 1966. Its supply of pointing gas was low and other systems were deteriorating; ending the mission also avoided radio interference with Lunar Orbiter 2. It was destroyed at impact. Its final area is historically estimated, rather than an identified intact spacecraft, and its photographs survived safely on Earth."}{"\n\n"}<a href="https://science.nasa.gov/mission/lunar-orbiter-1/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
    ],
  },
  {
    id: "lunarorbiter2",
    name: "Lunar Orbiter 2",
    place: "Moon",
    coverImageUrl: "/assets/objects/lunar_orbiter_render.jpg",
    recordIds: ["lunar-orbiter-2"],
    sourceUrls: ["https://science.nasa.gov/mission/lunar-orbiter-2/"],
    pages: [
      {
        label: "Origin",
        title: "Mapping the Moon for Apollo",
        imageUrl: "/assets/objects/lunar_orbiter_render.jpg",
        caption: "Mapping the Moon for Apollo",
        credit: "NASA",
        text: (<>{"Lunar Orbiter 2 launched on November 6, 1966, while its predecessor's photographs were already helping Apollo planners. It entered lunar orbit on November 10, then lowered its closest passes for detailed photography. This time the mission concentrated on candidate landing regions across the Moon's equatorial near side. Repeated orbits would let it build a more dependable view of the ground."}{"\n\n"}<a href="https://science.nasa.gov/mission/lunar-orbiter-2/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Goals",
        title: "Searching for Safe Landing Sites",
        imageUrl: "public/assets/objects/images (3).jpeg",
        caption: "Searching for Safe Landing Sites",
        credit: "NASA",
        text: (<>{"Like Lunar Orbiter 1, it carried a film camera with wide- and narrow-angle lenses, an onboard film processor and a scanner for radio transmission. Solar panels powered the system. Radiation and micrometeoroid instruments measured the environment, while tracking revealed the Moon's gravitational influence. Its assignment included thirteen primary and seventeen secondary candidate sites, linking geological reconnaissance with Apollo's need for a safe arrival."}{"\n\n"}<a href="https://science.nasa.gov/mission/lunar-orbiter-2/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Discoveries",
        title: "Revealing the Lunar Surface",
        imageUrl: "/assets/objects/Disc-copernicus crater.jpg",
        caption: "Disc-copernicus crater on the Lunar Surface",
        credit: "NASA",
        text: (<>{"Its images showed landing areas, crater terrain and the region of Ranger 8's impact. A striking oblique photograph of Copernicus Crater made the landscape's depth unusually clear. After photography, changes to its orbit allowed tracking over a wider region to improve gravity knowledge. Those pictures and measurements helped planners understand both the hazards on the ground and the forces acting on approaching spacecraft."}{"\n\n"}<a href="https://science.nasa.gov/mission/lunar-orbiter-2/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Now",
        title: "Its Final Impact",
        imageUrl: "/assets/objects/Disc-copernicus crater.jpg",
        caption: "Disc-copernicus crater on the Lunar Surface",
        credit: "NASA",
        text: (<>{"Lunar Orbiter 2 was deliberately impacted on the Moon's far side on October 11, 1967. Its attitude-control gas was nearly gone, and the controlled ending prevented interference with later missions. It was destroyed and is no longer in orbit. NASA's historical record supplies an approximate impact area; that is not the same as a modern photograph locating every piece of its debris."}{"\n\n"}<a href="https://science.nasa.gov/mission/lunar-orbiter-2/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
    ],
  },
  {
    id: "lunarorbiter3",
    name: "Lunar Orbiter 3",
    place: "Moon",
    coverImageUrl: "/assets/objects/lunar_orbiter_render.jpg",
    recordIds: ["lunar-orbiter-3"],
    sourceUrls: ["https://science.nasa.gov/mission/lunar-orbiter-3/"],
    pages: [
      {
        label: "Origin",
        title: "A Closer Look at the Moon",
        imageUrl: "/assets/objects/lunar_orbiter_render.jpg",
        caption: "A Closer Look at the Moon",
        credit: "NASA",
        text: (<>{"Lunar Orbiter 3 launched on February 5, 1967, after the first two scouts had identified promising regions for Apollo. It entered lunar orbit on February 8. Its task was more focused than an initial search: inspect and confirm candidate sites. Photographing areas from successive orbits could reveal the shape of terrain that looked deceptively simple in a single flat image."}{"\n\n"}<a href="https://science.nasa.gov/mission/lunar-orbiter-3/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Goals",
        title: "Finding and Studying Landing Sites",
        imageUrl: "/assets/objects/lunar_orbiter_program_14_lo_3_launch.jpg",
        caption: "lunar orbiter program 14 lo 3 launch",
        credit: "NASA",
        text: (<>{"A dual-lens photographic system exposed and developed film inside the spacecraft, then scanned it for transmission to Earth. Solar panels, a main engine and pointing thrusters supported the work. Micrometeoroid and radiation instruments measured the environment, and radio tracking improved knowledge of gravity. The planned repeated views and overlapping photographs would help check terrain for Surveyor and Apollo landings."}{"\n\n"}<a href="https://science.nasa.gov/mission/lunar-orbiter-3/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Discoveries",
        title: "Detailed Views of the Moon",
        imageUrl: "/assets/objects/tsiolkovsky crater.jpg",
        caption: "Tsiolkovsky crater of the Moon",
        credit: "NASA",
        text: (<>{"Despite a film-readout malfunction that prevented some pictures from reaching Earth, Lunar Orbiter 3 completed its site-confirmation objectives. Its photographs joined those from the first two orbiters in the selection of preliminary Apollo landing sites, including regions later visited by Apollo 11 and Apollo 12. Tracking also tested an orbit resembling Apollo's. The mission's contribution was confidence in routes and destinations, rather than a single dramatic discovery."}{"\n\n"}<a href="https://science.nasa.gov/mission/lunar-orbiter-3/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Now",
        title: "Its Final Orbit",
        imageUrl: "public/assets/objects/tsiolkovsky crater.jpg",
        caption: "Its Final Orbit",
        credit: "NASA",
        text: (<>{"Controllers sent Lunar Orbiter 3 into the Moon on October 9, 1967, after its photography and tracking work. It was destroyed near the western lunar limb, with only an approximate historical impact location available in these records. The controlled ending retired a spacecraft no longer needed in orbit. Its useful legacy remained in the maps, gravity information and landing-site decisions transmitted before impact."}{"\n\n"}<a href="https://science.nasa.gov/mission/lunar-orbiter-3/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
    ],
  },
  {
    id: "lunarorbiter4",
    name: "Lunar Orbiter 4",
    place: "Moon",
    coverImageUrl: "/assets/objects/lunar_orbiter_render.jpg",
    recordIds: ["lunar-orbiter-4"],
    sourceUrls: ["https://science.nasa.gov/mission/lunar-orbiter-4/"],
    pages: [
      {
        label: "Origin",
        title: "Mapping Almost the Entire Moon",
        imageUrl: "/assets/objects/lunar_orbiter_render.jpg",
        caption: "Mapping Almost the Entire Moon",
        credit: "NASA",
        text: (<>{"Lunar Orbiter 4 launched on May 4, 1967, after earlier scouts had already photographed candidate Apollo sites. Its new task was a broad scientific survey. Entering a nearly polar lunar orbit on May 8 allowed it to pass over regions farther north and south. A problem with a camera door threatened the photography, but controllers found a way to keep the mission working."}{"\n\n"}<a href="https://science.nasa.gov/mission/lunar-orbiter-4/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Goals",
        title: "A Global Survey of the Moon",
        imageUrl: "/assets/objects/lunar_orbiter_program_17_lo_4_launch.jpg",
        caption: "lunar orbiter program 17 lo 4 launch",
        credit: "NASA",
        text: (<>{"Its dual-lens film system developed and scanned photographs inside the spacecraft, then radioed them home. Solar panels, an engine and pointing equipment supported the near-polar route. Radiation and micrometeoroid measurements recorded the lunar environment; tracking helped investigate gravity. Rather than concentrating only on landing patches, Lunar Orbiter 4 was meant to give scientists connected coverage for studying the Moon's geography and geological history."}{"\n\n"}<a href="https://science.nasa.gov/mission/lunar-orbiter-4/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Discoveries",
        title: "A New Map of the Moon",
        imageUrl: "/assets/objects/Mare_Orientale.jpg",
        caption: "Mare Orientale of the Moon",
        credit: "NASA",
        text: (<>{"It photographed about 99 percent of the near side and substantial parts of the far side, including views of the south polar region. Broad pictures revealed relationships among craters, basins and mountain systems such as Mare Orientale. Camera and readout troubles limited some results, but the returned survey became an important foundation for lunar mapping. It helped scientists examine features in their wider setting."}{"\n\n"}<a href="https://science.nasa.gov/mission/lunar-orbiter-4/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Now",
        title: "Its Final Descent",
        imageUrl: "/assets/objects/Mare_Orientale.jpg",
        caption: "Mare Orientale of the Moon",
        credit: "NASA",
        text: (<>{"Contact was lost on July 17, 1967, before a controlled retirement could be carried out. Its orbit then decayed under the Moon's uneven gravity. NASA's mission history gives October 6 as the impact date, while the supplied archive-derived record only presumes impact by late October. The supported conclusion is that it is destroyed on the Moon; its precise impact place was not identified."}{"\n\n"}<a href="https://science.nasa.gov/mission/lunar-orbiter-4/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
    ],
  },
  {
    id: "lunarorbiter5",
    name: "Lunar Orbiter 5",
    place: "Moon",
    coverImageUrl: "/assets/objects/lunar_orbiter_render.jpg",
    recordIds: ["lunar-orbiter-5"],
    sourceUrls: ["https://science.nasa.gov/mission/lunar-orbiter-5/"],
    pages: [
      {
        label: "Origin",
        title: "The Final Lunar Orbiter",
        imageUrl: "/assets/objects/lunar_orbiter_render.jpg",
        caption: "The Final Lunar Orbiter",
        credit: "NASA",
        text: (<>{"Lunar Orbiter 5 launched on August 1, 1967, as the final spacecraft in a series that was helping turn Apollo's plans into workable destinations. It entered a near-polar orbit on August 5 and began photography two days later. Earlier orbiters had opened the survey. This last scout would fill gaps, revisit valuable sites and complete a much broader photographic portrait of the Moon."}{"\n\n"}<a href="https://science.nasa.gov/mission/lunar-orbiter-5/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Goals",
        title: "Completing the Lunar Survey",
        imageUrl: "/assets/objects/lunar_orbiter_program_20_lo_5_launch.jpg",
        caption: "Completing the Lunar Survey",
        credit: "NASA",
        text: (<>{"A photographic system used wide- and narrow-angle lenses, developed film onboard and scanned it into signals for Earth. Solar arrays powered the spacecraft. Radiation and micrometeoroid instruments watched for hazards, and radio tracking refined gravity knowledge. Its goals included additional Apollo and Surveyor site photographs, scientifically interesting regions and areas of the far side that previous missions had missed."}{"\n\n"}<a href="https://science.nasa.gov/mission/lunar-orbiter-5/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Discoveries",
        title: "Completing the Picture of the Moon",
        imageUrl: "/assets/objects/OIP.jpg",
        caption: "First Image of Farside of the Moon",
        credit: "NASA",
        text: (<>{"Its photographs filled major gaps in far-side coverage and added detailed views of candidate landing and science sites. Together, the five Lunar Orbiters photographed almost the whole Moon. Tracking improved predictions of how lunar gravity would change spacecraft orbits, and an Earth photograph offered another distant view of home. The series left Apollo with both maps of the surface and experience operating spacecraft nearby."}{"\n\n"}<a href="https://science.nasa.gov/mission/lunar-orbiter-5/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Now",
        title: "The Final Impact",
        imageUrl: "/assets/objects/OIP.jpg",
        caption: "First Image of Farside of the Moon",
        credit: "NASA",
        text: (<>{"After its photographic, environmental and tracking work, Lunar Orbiter 5 was commanded to impact the Moon on January 31, 1968. It was destroyed on the near side rather than remaining an uncontrolled active radio source in orbit. Its historical impact location is approximate. The spacecraft's one-way ending closed the Lunar Orbiter series, while the photographs continued serving the missions that followed."}{"\n\n"}<a href="https://science.nasa.gov/mission/lunar-orbiter-5/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
    ],
  },
  {
    id: "grail-a",
    name: "GRAIL",
    place: "Moon",
    coverImageUrl: "public/assets/objects/grail.jpg",
    recordIds: ["grail-a"],
    sourceUrls: ["https://science.nasa.gov/mission/grail/"],
    pages: [
      {
        label: "Origin",
        title: "Listening to the Moon’s Gravity",
        imageUrl: "/assets/objects/grail.jpg",
        caption: "Listening to the Moon’s Gravity",
        credit: "NASA",
        text: (<>{"On September 10, 2011, two small spacecraft launched together to investigate a Moon people thought they knew. GRAIL-A and GRAIL-B later received the names Ebb and Flow from students. They arrived in lunar orbit around the turn of the year and began flying in formation. Their story depended on staying connected: tiny changes in the distance between them would reveal features hidden under the surface."}{"\n\n"}<a href="https://science.nasa.gov/mission/grail/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Goals",
        title: "Mapping the Moon from Within",
        imageUrl: "/assets/objects/grail.jpg",
        caption: "Mapping the Moon from Within",
        credit: "NASA",
        text: (<>{"Each carried a Lunar Gravity Ranging System to measure the separation between the two spacecraft very precisely. As denser or lighter regions tugged differently on them, that separation changed. Solar panels supplied power, and MoonKAM cameras let students request lunar pictures. The mission was to map gravity, investigate the crust and interior, and understand how impacts and geological processes had shaped the Moon."}{"\n\n"}<a href="https://science.nasa.gov/mission/grail/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Discoveries",
        title: "Seeing Inside the Moon",
        imageUrl: "/assets/objects/grail_2.jpg",
        caption: "Seeing Inside the Moon",
        credit: "NASA",
        text: (<>{"The pair produced an exceptionally detailed gravity map, revealing a crust fractured by impacts and thinner than earlier estimates suggested. The map helped explain mass concentrations, or mascons, that affect lunar orbits, and exposed buried structures associated with the Moon's history. This was science made from motion: by measuring how two spacecraft moved, researchers could investigate rock they could not directly see."}{"\n\n"}<a href="https://science.nasa.gov/mission/grail/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Now",
        title: "Its Final Descent",
        imageUrl: "/assets/objects/grail_2.jpg",
        caption: "Its Final Descent",
        credit: "NASA",
        text: (<>{"Ebb and Flow were deliberately sent into a mountain near the Moon's north pole on December 17, 2012, after their mapping work and extended mission. Both were destroyed, leaving impact sites rather than intact orbiters. Fuel was running low, and the controlled ending kept their final descent away from historic landing sites. The impact area was named in honor of Sally Ride, who supported the mission's student imaging program."}{"\n\n"}<a href="https://science.nasa.gov/mission/grail/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
    ],
  },
  {
    id: "ladee",
    name: "LADEE",
    place: "Moon",
    coverImageUrl: "/assets/objects/ladee.jpg",
    recordIds: ["ladee"],
    sourceUrls: ["https://science.nasa.gov/mission/ladee/","https://science.nasa.gov/mission/ladee/ladee-science-and-instruments/"],
    pages: [
      {
        label: "Origin",
        title: "Exploring the Moon’s Thin Atmosphere",
        imageUrl: "/assets/objects/ladee.jpg",
        caption: "Exploring the Moon’s Thin Atmosphere",
        credit: "NASA",
        text: (<>{"LADEE left Virginia's Wallops launch site in September 2013, on September 6 locally and September 7 in Universal Time. Its destination was a Moon with an almost impossibly thin atmosphere. The Lunar Atmosphere and Dust Environment Explorer entered lunar orbit in October, then flew low enough to sample conditions close to the ground. It came to study an environment too sparse for an astronaut to feel."}{"\n\n"}<a href="https://science.nasa.gov/mission/ladee/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://science.nasa.gov/mission/ladee/ladee-science-and-instruments/" target="_blank" rel="noreferrer">NASA source 2</a></>),
      },
      {
        label: "Goals",
        title: "Studying the Lunar Atmosphere",
        imageUrl: "/assets/objects/201309060009HQ~large.jpg",
        caption: "Studying the Lunar Atmosphere",
        credit: "NASA",
        text: (<>{"A neutral mass spectrometer identified gas particles, an ultraviolet and visible spectrometer studied faint light from gases and dust, and a lunar dust experiment detected small grains. The spacecraft also carried a laser communications demonstration. Solar power supported its low-altitude orbit. Scientists wanted to learn how the exosphere changed and whether dust near the Moon could explain old observations of light near the horizon."}{"\n\n"}<a href="https://science.nasa.gov/mission/ladee/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://science.nasa.gov/mission/ladee/ladee-science-and-instruments/" target="_blank" rel="noreferrer">NASA source 2</a></>),
      },
      {
        label: "Discoveries",
        title: "A Closer Look at the Lunar Exosphere",
        imageUrl: "/assets/objects/ladee-lunar-orbit.png",
        caption: "A Closer Look at the Lunar Exosphere",
        credit: "NASA",
        text: (<>{"LADEE's measurements revealed a persistent cloud of dust generated by meteoroid impacts and identified neon in the lunar exosphere. They helped scientists connect atmospheric changes with sunlight, the solar wind and incoming material. Its laser experiment demonstrated high-rate communication between the Moon and Earth. These results made the Moon's tenuous surroundings measurable in detail and helped explain processes on other airless bodies."}{"\n\n"}<a href="https://science.nasa.gov/mission/ladee/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://science.nasa.gov/mission/ladee/ladee-science-and-instruments/" target="_blank" rel="noreferrer">NASA source 2</a></>),
      },
      {
        label: "Now",
        title: "Its Final Impact",
        imageUrl: "/assets/objects/201309060009HQ~large.jpg",
        caption: "Its Final Impact",
        credit: "NASA",
        text: (<>{"LADEE completed its science mission and an extension before ending in a planned impact on April 18, 2014, Universal Time. Lowering its orbit allowed observations closer to the surface, but lunar gravity would eventually bring it down. Its impact crater was later identified near Sundman V on the far side. It is destroyed, with debris on the Moon rather than a spacecraft still circling it."}{"\n\n"}<a href="https://science.nasa.gov/mission/ladee/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://science.nasa.gov/mission/ladee/ladee-science-and-instruments/" target="_blank" rel="noreferrer">NASA source 2</a></>),
      },
    ],
  },
  {
    id: "mariner5",
    name: "Mariner 5",
    place: "Venus",
    coverImageUrl: "/assets/objects/mariner05.gif",
    recordIds: ["mariner-5"],
    sourceUrls: ["https://science.nasa.gov/mission/mariner-5/"],
    pages: [
      {
        label: "Origin",
        title: "A Close Encounter with Venus",
        imageUrl: "/assets/objects/mariner05.gif",
        caption: "A Close Encounter with Venus",
        credit: "NASA",
        text: (<>{"Mariner 5 began as a backup for Mariner 4's Mars mission. Engineers then gave it a new destination, modifying it to investigate Venus. It launched on June 14, 1967, and passed the cloud-covered planet on October 19. A spacecraft once kept ready for someone else's journey now had an encounter of its own, designed to look more closely at Venus's atmosphere."}{"\n\n"}<a href="https://science.nasa.gov/mission/mariner-5/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Goals",
        title: "Revealing Venus from Space",
        imageUrl: "/assets/objects/KSC-67PC-0184.jpg",
        caption: "Launch of Mariner 5",
        credit: "NASA",
        text: (<>{"The key experiment followed its radio signal as Venus's atmosphere bent and weakened it, revealing atmospheric properties. An ultraviolet photometer, magnetometer, solar-plasma probe and radiation detector added other measurements. Solar panels provided power. It carried no camera: the mission was about pressure, temperature, charged particles and the interaction between Venus and the solar wind, rather than a photographic tour."}{"\n\n"}<a href="https://science.nasa.gov/mission/mariner-5/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Discoveries",
        title: "A Hot, Dense World",
        imageUrl: "/assets/objects/KSC-67PC-0184.jpg",
        caption: "Launch of Mariner 5",
        credit: "NASA",
        text: (<>{"Radio observations showed a very dense, hot atmosphere, and other instruments investigated its outer layers. Mariner 5 found no Earth-like planetary magnetic field, but showed how the ionosphere could deflect the solar wind. Scientists compared its results with those from the Soviet Venera 4 probe. Together, those observations helped correct earlier interpretations of Venus and sharpened the picture of a difficult world beneath the clouds."}{"\n\n"}<a href="https://science.nasa.gov/mission/mariner-5/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Now",
        title: "The Mission Continues in Silence",
        imageUrl: "/assets/objects/mariner05.gif",
        caption: "The Mission Continues in Silence",
        credit: "NASA",
        text: (<>{"Venus's gravity changed its path, and Mariner 5 continued in solar orbit. Contact was lost on December 4, 1967. Controllers briefly detected it again on October 14, 1968, but received no additional telemetry, and stopped trying on November 5. It is now silent, presumed to remain on its orbit around the Sun. No exact live position is available."}{"\n\n"}<a href="https://science.nasa.gov/mission/mariner-5/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
    ],
  },
  {
    id: "surveyor1",
    name: "Surveyor 1",
    place: "Moon",
    coverImageUrl: "/assets/objects/surveyor_beach.jpg",
    recordIds: ["surveyor-1"],
    sourceUrls: ["https://science.nasa.gov/mission/surveyor-1/"],
    pages: [
      {
        label: "Origin",
        title: "The First U.S. Soft Landing",
        imageUrl: "/assets/objects/surveyor_beach.jpg",
        caption: "The First U.S. Soft Landing",
        credit: "NASA",
        text: (<>{"Surveyor 1 launched on May 30, 1966, with an engineering challenge crucial to Apollo: land gently on the Moon and keep working. On June 2, its radar, braking rocket and small descent engines brought it to rest in Oceanus Procellarum. It became the first U.S. spacecraft to make a successful soft landing there. Before astronauts could trust their landing systems, a robot had tested the final journey."}{"\n\n"}<a href="https://science.nasa.gov/mission/surveyor-1/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Goals",
        title: "Proving the Moon Could Be Landed On",
        imageUrl: "/assets/objects/images (5).jpeg",
        caption: "Proving the Moon Could Be Landed On",
        credit: "NASA",
        text: (<>{"Its television camera would show the ground and the spacecraft's own landing gear. Engineering sensors measured temperatures, structural conditions and descent performance. Solar panels and batteries powered the station. Scientists and engineers wanted to understand the surface's ability to support a spacecraft and verify radar-guided landing technology. Surveyor 1 did not carry the scooping arm or chemical-analysis instrument found on some later Surveyors."}{"\n\n"}<a href="https://science.nasa.gov/mission/surveyor-1/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Discoveries",
        title: "The Moon Up Close",
        imageUrl: "public/assets/objects/surv1_lro_thumb.png",
        caption: "The Moon Up Close",
        credit: "NASA",
        text: (<>{"It returned more than 11,000 images, showing nearby terrain and how its footpads sat on the surface. The pictures and engineering measurements demonstrated that the ground could bear a landed spacecraft, helping prepare Apollo's crews and planners. Its controlled descent was itself an important result. Surveyor 1 made a lunar landing into a tested procedure rather than only a design on paper."}{"\n\n"}<a href="https://science.nasa.gov/mission/surveyor-1/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Now",
        title: "Its Final Silence",
        imageUrl: "/assets/objects/images (4).jpeg",
        caption: "Its Final Silence",
        credit: "NASA",
        text: (<>{"It remains at its Oceanus Procellarum landing site. Its picture-taking mission ended in July 1966 after power declined around lunar sunset, but engineers continued occasional checks until January 7, 1967. A stationary lander with no ascent vehicle, it was always intended to stay on the Moon. It is now inactive, a surviving piece of the preparation that came before Apollo."}{"\n\n"}<a href="https://science.nasa.gov/mission/surveyor-1/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
    ],
  },
  {
    id: "surveyor3",
    name: "Surveyor 3",
    place: "Moon",
    coverImageUrl: "/assets/objects/surveyor_nasm.jpg",
    recordIds: ["surveyor-3"],
    sourceUrls: ["https://science.nasa.gov/mission/surveyor-3/"],
    pages: [
      {
        label: "Origin",
        title: "Testing the Lunar Soil",
        imageUrl: "/assets/objects/surveyor_nasm.jpg",
        caption: "Testing the Lunar Soil",
        credit: "NASA",
        text: (<>{"Surveyor 3 launched on April 17, 1967, carrying the Surveyor program's first surface-sampling arm. It reached Oceanus Procellarum on April 20 in Universal Time. Reflective rocks confused its landing radar, and the spacecraft bounced twice before settling. Despite that awkward arrival, it was ready to put a scoop into lunar ground. Two years later, astronauts would walk over to examine the same machine."}{"\n\n"}<a href="https://science.nasa.gov/mission/surveyor-3/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Goals",
        title: "Digging Into the Moon",
        imageUrl: "/assets/objects/as12-48-7134_1280.jpg",
        caption: "Digging Into the Moon",
        credit: "NASA",
        text: (<>{"Its television camera watched the landscape and the scoop's work. The soil-mechanics surface sampler dug trenches, pressed on the ground and moved material so scientists could judge how it behaved. Solar power and batteries supported the experiments. The aim was to test a soft landing and determine whether the surface would support Apollo's much larger lunar module, linking engineering safety with direct observations of soil."}{"\n\n"}<a href="https://science.nasa.gov/mission/surveyor-3/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Discoveries",
        title: "Soil Strong Enough to Land",
        imageUrl: "/assets/objects/as12-48-7134_1280.jpg",
        caption: "Soil Strong Enough to Land",
        credit: "NASA",
        text: (<>{"Surveyor 3 sent 6,326 pictures and performed trenching, bearing and impact tests. Its observations supported the conclusion that lunar ground could hold an Apollo lander. In November 1969, Apollo 12 astronauts visited it and returned parts, including its television camera, for study on Earth. That unusual follow-up gave researchers a chance to examine hardware after prolonged exposure to the lunar environment."}{"\n\n"}<a href="https://science.nasa.gov/mission/surveyor-3/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Now",
        title: "Visited by Apollo 12",
        imageUrl: "/assets/objects/detail_as12-48-7121_orig.jpg",
        caption: "Visited by Apollo 12",
        credit: "NASA",
        text: (<>{"Most of Surveyor 3 remains in its crater in Oceanus Procellarum, near Apollo 12's landing site. Its final contact was on May 4, 1967, and it never recovered useful operations after the lunar night. Apollo 12 removed only selected parts; the rest stayed behind. With no return engine, its one-way landing became a permanent location for the spacecraft's remaining structure."}{"\n\n"}<a href="https://science.nasa.gov/mission/surveyor-3/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
    ],
  },
  {
    id: "surveyor5",
    name: "Surveyor 5",
    place: "Moon",
    coverImageUrl: "/assets/objects/first chemistry set on moon.jpg",
    recordIds: ["surveyor-5"],
    sourceUrls: ["https://science.nasa.gov/mission/surveyor-5/"],
    pages: [
      {
        label: "Origin",
        title: "Analyzing the Moon’s Chemistry",
        imageUrl: "/assets/objects/first chemistry set on moon.jpg",
        caption: "Analyzing the Moon’s Chemistry",
        credit: "NASA",
        text: (<>{"Surveyor 5 launched on September 8, 1967, carrying a small chemical laboratory toward the Moon. A helium leak threatened its descent, but engineers adjusted the landing sequence. On September 11, it reached Mare Tranquillitatis safely. Its new instrument would ask a question pictures could not answer: what chemical elements made up the soil beneath this lander's feet?"}{"\n\n"}<a href="https://science.nasa.gov/mission/surveyor-5/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Goals",
        title: "What Is the Moon Made Of?",
        imageUrl: "/assets/objects/su5_67_h_1340.gif",
        caption: "Surveyor 5 image of the footpad resting in the lunar soil",
        credit: "NASA",
        text: (<>{"An alpha-scattering instrument replaced the scoop used on Surveyor 3. It sent particles toward the soil and measured the returning signals to estimate elemental composition. A television camera recorded the scene, and a magnet on a footpad tested magnetic properties. Solar panels supplied energy. The mission combined Apollo landing preparation with the first direct chemical analysis of another world's surface."}{"\n\n"}<a href="https://science.nasa.gov/mission/surveyor-5/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Discoveries",
        title: "Reading the Lunar Soil",
        imageUrl: "/assets/objects/surveyor_beach.jpg",
        caption: "Reading the Lunar Soil",
        credit: "NASA",
        text: (<>{"The instrument found soil with a composition resembling basalt, the volcanic rock familiar from Earth. The camera returned thousands of pictures, and a brief engine-firing test examined how exhaust disturbed the ground. These observations connected appearance with chemistry and helped assess landing conditions. Surveyor 5 showed that a robotic lander could do more than photograph a destination: it could test what the ground was made of."}{"\n\n"}<a href="https://science.nasa.gov/mission/surveyor-5/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Now",
        title: "Its Final Transmission",
        imageUrl: "/assets/objects/as12-48-7134_1280.jpg",
        caption: "Its Final Transmission",
        credit: "NASA",
        text: (<>{"Surveyor 5 remains at its Mare Tranquillitatis landing site, on the slope of a small crater. It operated during several lunar daylight periods before communication ended in December 1967. NASA's mission overview and the supplied archive record differ by a day on the final-contact date, so December 1967 is the supported common point here. Its landing was one-way, with no system to lift it back toward Earth."}{"\n\n"}<a href="https://science.nasa.gov/mission/surveyor-5/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
    ],
  },
  {
    id: "surveyor6",
    name: "Surveyor 6",
    place: "Moon",
    coverImageUrl: "/assets/objects/webp.webp",
    recordIds: ["surveyor-6"],
    sourceUrls: ["https://science.nasa.gov/mission/surveyor-6/"],
    pages: [
      {
        label: "Origin",
        title: "A Lander That Moved",
        imageUrl: "/assets/objects/webp.webp",
        caption: "A Lander That Moved",
        credit: "NASA",
        text: (<>{"Surveyor 6 launched on November 7, 1967, and landed in Sinus Medii on November 10. Its first assignment resembled Surveyor 5's: photograph the ground and analyze its chemistry. Then controllers gave it an unusual instruction. On November 17, it fired its engines, rose above the surface and landed a short distance away, allowing the camera to look back at its own footprints."}{"\n\n"}<a href="https://science.nasa.gov/mission/surveyor-6/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Goals",
        title: "Studying the Moon from the Ground",
        imageUrl: "/assets/objects/surveyor_beach.jpg",
        caption: "Studying the Moon from the Ground",
        credit: "NASA",
        text: (<>{"A television camera, alpha-scattering instrument and footpad magnet studied terrain, elemental composition and magnetic material. Solar panels and batteries supplied electricity. Engineers wanted another demonstration of safe landing conditions for Apollo, while scientists compared the soil with earlier sites. The planned hop also let the spacecraft observe the same ground from a new angle and inspect how its landing gear had disturbed it."}{"\n\n"}<a href="https://science.nasa.gov/mission/surveyor-6/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Discoveries",
        title: "The First Lunar Hop",
        imageUrl: "/assets/objects/images (7).jpeg",
        caption: "The First Lunar Hop",
        credit: "NASA",
        text: (<>{"It sent 29,952 images and about thirty hours of chemical-analysis data, finding a basalt-like surface. Its hop rose roughly three meters and moved it about two and a half meters, marking the first powered takeoff from the Moon. Pictures of the original footpad marks and paired views helped reveal the soil's mechanical properties and the terrain's shape. Even a short move created new opportunities for measurement."}{"\n\n"}<a href="https://science.nasa.gov/mission/surveyor-6/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Now",
        title: "Its Final Contact",
        imageUrl: "/assets/objects/images (7).jpeg",
        caption: "Its Final Contact",
        credit: "NASA",
        text: (<>{"Surveyor 6 remains near its second touchdown point in Sinus Medii. Controllers placed it in hibernation for the lunar night in November 1967. They briefly regained contact on December 14, but received no useful new data. The hop was only a local experiment, not an escape from the Moon. The lander had no return mission, and its final touchdown became its permanent resting place."}{"\n\n"}<a href="https://science.nasa.gov/mission/surveyor-6/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
    ],
  },
  {
    id: "surveyor7",
    name: "Surveyor 7",
    place: "Moon",
    coverImageUrl: "/assets/objects/surveyor_beach.jpg",
    recordIds: ["surveyor-7"],
    sourceUrls: ["https://science.nasa.gov/mission/surveyor-7/"],
    pages: [
      {
        label: "Origin",
        title: "The Scientific Surveyor",
        imageUrl: "/assets/objects/surveyor_beach.jpg",
        caption: "The Scientific Surveyor",
        credit: "NASA",
        text: (<>{"Surveyor 7 launched on January 7, 1968, as the last spacecraft in the original Surveyor series. Earlier landers had already answered many questions about safe Apollo sites, so this mission could explore a different landscape. On January 10, it landed near Tycho Crater in the southern highlands. It would compare this rugged region with the darker plains sampled by previous Surveyors."}{"\n\n"}<a href="https://science.nasa.gov/mission/surveyor-7/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Goals",
        title: "Exploring the Lunar Highlands",
        imageUrl: "/assets/objects/surveyor_7_landing_site.png",
        caption: "surveyor_7_landing_site",
        credit: "NASA",
        text: (<>{"Its television camera, alpha-scattering instrument and soil sampler worked together to examine surface structure and chemistry. Footpad magnets, mirrors and engineering sensors added other observations. Solar panels powered the station. When the chemistry instrument failed to lower fully, the sampler helped push it into position and later moved it among targets. The goal was broader lunar science, rather than checking only an early Apollo landing area."}{"\n\n"}<a href="https://science.nasa.gov/mission/surveyor-7/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Discoveries",
        title: "A Different Side of the Moon",
        imageUrl: "/assets/objects/surveyortycho.gif",
        caption: "Tycho Crater panaroma",
        credit: "NASA",
        text: (<>{"Surveyor 7 returned more than 21,000 pictures and about a hundred hours of chemical measurements across two lunar days. Its scoop dug trenches and moved rocks. Highland material contained less iron-group material than the mare soils measured earlier, supporting an important distinction between lunar regions. The lander also detected laser beams sent from Earth, demonstrating another way to connect a lunar instrument with researchers at home."}{"\n\n"}<a href="https://science.nasa.gov/mission/surveyor-7/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Now",
        title: "The Final Surveyor",
        imageUrl: "/assets/objects/Tycho crater.jpg",
        caption: "Tycho Crater",
        credit: "NASA",
        text: (<>{"Surveyor 7 remains on the ejecta blanket north of Tycho, material thrown outward when the crater formed. Operations ended on February 21, 1968, after work during two lunar daylight periods. Like the other Surveyors, it had no ascent vehicle, so completing its measurements did not mean leaving the Moon. It is inactive at the place where the series finished its exploration."}{"\n\n"}<a href="https://science.nasa.gov/mission/surveyor-7/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
    ],
  },
  {
    id: "ranger7",
    name: "Ranger 7",
    place: "Moon",
    coverImageUrl: "/assets/objects/ranger.gif",
    recordIds: ["ranger-7"],
    sourceUrls: ["https://science.nasa.gov/mission/ranger-7/"],
    pages: [
      {
        label: "Origin",
        title: "The First Successful Close-Up",
        imageUrl: "/assets/objects/ranger.gif",
        caption: "The First Successful Close-Up",
        credit: "NASA",
        text: (<>{"Ranger 7 launched on July 28, 1964, after a difficult series of earlier Ranger missions. This time, the spacecraft's cameras worked as it approached the Moon. On July 31, the ground grew larger in its view, and pictures kept arriving until impact. Its last minutes gave scientists the close details they needed while plans for human lunar landings were still taking shape."}{"\n\n"}<a href="https://science.nasa.gov/mission/ranger-7/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Goals",
        title: "Seeing the Moon Before Impact",
        imageUrl: "/assets/objects/ra7_b001.gif",
        caption: "the first picture of the Moon by a U.S. spacecraft, on 31 July 1964",
        credit: "NASA",
        text: (<>{"Six television cameras, arranged in two independent channels, photographed the approaching surface at different scales. Solar panels, batteries, radio transmitters and antennas kept the images flowing to Earth. Ranger 7 had no landing legs or soft-landing system: it was built to hit the Moon. The mission would trade the spacecraft itself for a sequence of increasingly detailed pictures of potential landing terrain."}{"\n\n"}<a href="https://science.nasa.gov/mission/ranger-7/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Discoveries",
        title: "The Moon in Unprecedented Detail",
        imageUrl: "/assets/objects/ranger7pn199.gif",
        caption: "Images by ranger 7 before impact",
        credit: "NASA",
        text: (<>{"In roughly seventeen minutes, Ranger 7 sent 4,308 photographs. Small craters and surface textures became visible at scales telescopes on Earth could not resolve; the final images reached about half-meter resolution. The pictures showed that relatively smooth mare regions could offer suitable places for Apollo landings, while also revealing hazards requiring careful selection. Its successful camera system turned a planned impact into useful scientific reconnaissance."}{"\n\n"}<a href="https://science.nasa.gov/mission/ranger-7/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Now",
        title: "Its Final Descent",
        imageUrl: "/assets/objects/ra7_b100.gif",
        caption: "Ranger 7 B-camera image of Guericke crater",
        credit: "NASA",
        text: (<>{"Ranger 7 struck Mare Cognitum on July 31, 1964. The name means Sea That Has Become Known, reflecting the new knowledge provided by its pictures. It was destroyed at impact, leaving debris rather than an intact lander. This was the intended ending: the probe had to continue toward the ground to return its closest views, and it carried no equipment to stop safely."}{"\n\n"}<a href="https://science.nasa.gov/mission/ranger-7/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
    ],
  },
  {
    id: "ranger8",
    name: "Ranger 8",
    place: "Moon",
    coverImageUrl: "/assets/objects/ranger.gif",
    recordIds: ["ranger-8"],
    sourceUrls: ["https://science.nasa.gov/mission/ranger-8/"],
    pages: [
      {
        label: "Origin",
        title: "Searching for Apollo Landing Ground",
        imageUrl: "/assets/objects/ranger.gif",
        caption: "Searching for Apollo Landing Ground",
        credit: "NASA",
        text: (<>{"Ranger 8 launched on February 17, 1965, following the success of Ranger 7. Its destination was Mare Tranquillitatis, the Sea of Tranquility, a region Apollo planners wanted to understand. During its final approach on February 20, its cameras watched the surface expand beneath it. This second successful Ranger encounter would add a new stretch of lunar terrain to the close-up record."}{"\n\n"}<a href="https://science.nasa.gov/mission/ranger-8/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Goals",
        title: "Photographing Mare Tranquillitatis",
        imageUrl: "/assets/objects/ra8_a030.gif",
        caption: "Ritter and Sabine craters on the Moon",
        credit: "NASA",
        text: (<>{"Six television cameras used two channels to send broad views and finer details during the descent. Solar panels and batteries powered the spacecraft and its radio equipment. It was an impact probe, with no brakes for a soft landing. Scientists wanted pictures that connected large features with small hazards, helping them judge whether the mare terrain could support future crewed exploration."}{"\n\n"}<a href="https://science.nasa.gov/mission/ranger-8/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Discoveries",
        title: "A Safer Landing Site",
        imageUrl: "/assets/objects/ra8_b045.gif",
        caption: "Ranger 8 image of the Mare Tranquillitatis (Sea of Tranquillity) ",
        credit: "NASA",
        text: (<>{"Ranger 8 returned 7,137 photographs before impact. Its cameras began earlier than Ranger 7's so that the wider images could be compared with Earth-based observations before the closer views arrived. The sequence documented craters and surface details in a region important to Apollo planning. Alongside the other successful Rangers, it helped bridge the gap between distant telescopic maps and the ground astronauts would eventually encounter."}{"\n\n"}<a href="https://science.nasa.gov/mission/ranger-8/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Now",
        title: "Its Final Impact",
        imageUrl: "/assets/objects/ra8_b001.gif",
        caption: "Ptolemaeus and Alphonsus craters on the Moon",
        credit: "NASA",
        text: (<>{"It hit Mare Tranquillitatis on February 20, 1965, and was destroyed. Its impact site is a different location from Apollo 11's later landing, even though both are in the Sea of Tranquility. The spacecraft remains as debris because its mission required an impact trajectory. Its radio fell silent when the cameras and transmitting equipment reached the ground."}{"\n\n"}<a href="https://science.nasa.gov/mission/ranger-8/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
    ],
  },
  {
    id: "ranger9",
    name: "Ranger 9",
    place: "Moon",
    coverImageUrl: "/assets/objects/ranger.gif",
    recordIds: ["ranger-9"],
    sourceUrls: ["https://science.nasa.gov/mission/ranger-9/"],
    pages: [
      {
        label: "Origin",
        title: "The Final Ranger",
        imageUrl: "/assets/objects/ranger.gif",
        caption: "The Final Ranger",
        credit: "NASA",
        text: (<>{"Ranger 9 launched on March 21, 1965, for the final flight of the Ranger program. Its target was Alphonsus Crater, chosen for geological interest rather than simply as a flat landing area. On March 24, the spacecraft approached with its cameras pointed along the flight direction. People on Earth could watch the lunar surface draw closer through television coverage based on its incoming pictures."}{"\n\n"}<a href="https://science.nasa.gov/mission/ranger-9/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Goals",
        title: "Looking Into Alphonsus Crater",
        imageUrl: "/assets/objects/ra9_a060.gif",
        caption: " The upraised area at lower center is the central peak of Alphonsus crater floor",
        credit: "NASA",
        text: (<>{"Six television cameras in two independent channels sent images at different scales. Solar panels and batteries supplied electricity, while radio equipment transmitted the sequence home. Scientists wanted to inspect crater terrain and improve understanding of lunar geology. Like Rangers 7 and 8, Ranger 9 had no soft-landing equipment. The design depended on photographing continuously during a final, one-way approach."}{"\n\n"}<a href="https://science.nasa.gov/mission/ranger-9/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Discoveries",
        title: "A Final Look at the Lunar Highlands",
        imageUrl: "/assets/objects/ra9_b001.gif",
        caption: "Ptolemaeus, Alphonsus, and Albategnius craters on the Moon",
        credit: "NASA",
        text: (<>{"It returned 5,814 pictures, showing details inside and around Alphonsus as the view narrowed toward the impact point. Television presentations made the encounter accessible to people beyond the science team. Together, the three successful Rangers provided close views of contrasting lunar landscapes and experience in precise navigation and imaging. Their photographs helped prepare the scientific and engineering work that later lunar missions would extend."}{"\n\n"}<a href="https://science.nasa.gov/mission/ranger-9/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Now",
        title: "Its Final Image",
        imageUrl: "/assets/objects/ra9_p012.gif",
        caption: "Final two images taken by Ranger 9 before impact",
        credit: "NASA",
        text: (<>{"Ranger 9 impacted inside Alphonsus Crater on March 24, 1965. The spacecraft was destroyed, ending its transmissions at the surface. It is represented today by its impact site and debris, not by an operating vehicle. Its final picture was possible only because the probe continued toward the Moon; the planned collision completed the same mission that produced the close-up views."}{"\n\n"}<a href="https://science.nasa.gov/mission/ranger-9/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
    ],
  },
  {
    id: "viking-1-orbiter",
    name: "Viking 1 Orbiter",
    place: "Mars",
    coverImageUrl: "/assets/objects/viking-1-lander.jpg",
    recordIds: ["viking-1-orbiter"],
    sourceUrls: ["https://science.nasa.gov/mission/viking/"],
    pages: [
      {
        label: "Origin",
        title: "The Partner That Stayed Overhead",
        imageUrl: "/assets/objects/viking-1-lander.jpg",
        caption: "Viking 1 Orbiter",
        credit: "NASA",
        text: (<>{"Viking 1 Orbiter left Earth on August 20, 1975, carrying a lander that depended on its journey. It entered Mars orbit on June 19, 1976. Before releasing its partner, it photographed the ground to help choose a safer landing site. Once the lander reached Chryse Planitia, the orbiter continued circling Mars, connecting a view from above with the new observations below."}{"\n\n"}<a href="https://science.nasa.gov/mission/viking/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Goals",
        title: "The Work It Was Built to Do",
        imageUrl: "/assets/objects/viking-1-lander.jpg",
        caption: "Viking 1 Orbiter",
        credit: "NASA",
        text: (<>{"Two television cameras mapped terrain and inspected possible landing sites. An infrared thermal mapper measured surface temperatures, and an atmospheric water detector measured water vapor. Solar arrays supplied electricity. The spacecraft also relayed the lander's data to Earth. Its goals combined global science with a supporting role: deliver the lander, help it communicate and place its small patch of ground in a larger Martian setting."}{"\n\n"}<a href="https://science.nasa.gov/mission/viking/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Discoveries",
        title: "What Its Journey Made Possible",
        imageUrl: "/assets/objects/viking-1-lander.jpg",
        caption: "Viking 1 Orbiter",
        credit: "NASA",
        text: (<>{"Its images revealed landforms associated with ancient flowing water, surveyed large parts of Mars and documented changing clouds, dust and polar regions. Thermal and water-vapor observations helped scientists investigate climate and seasonal cycles. Close photographs of Phobos added a moon to the story. Together with Viking 2 Orbiter, it created a detailed planetary record that supported later landing-site choices and studies of Martian geology."}{"\n\n"}<a href="https://science.nasa.gov/mission/viking/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Now",
        title: "Where Its Story Ended",
        imageUrl: "/assets/objects/viking-1-lander.jpg",
        caption: "Viking 1 Orbiter",
        credit: "NASA",
        text: (<>{"Viking 1 Orbiter was shut down on August 7, 1980, after more than four years at Mars and 1,488 orbits. Its attitude-control gas was running out, making reliable pointing impossible. Controllers raised its orbit before retirement. It was last known in orbit around Mars and is no longer communicating. The sources do not provide a live present position; its lander's later ending was a separate event."}{"\n\n"}<a href="https://science.nasa.gov/mission/viking/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
    ],
  },
  {
    id: "viking-2-orbiter",
    name: "Viking 2 Orbiter",
    place: "Mars",
    coverImageUrl: "/assets/objects/viking-1-lander.jpg",
    recordIds: ["viking-2-orbiter"],
    sourceUrls: ["https://science.nasa.gov/mission/viking/"],
    pages: [
      {
        label: "Origin",
        title: "A Second Watch Over Mars",
        imageUrl: "/assets/objects/viking-1-lander.jpg",
        caption: "Viking 2 Orbiter",
        credit: "NASA",
        text: (<>{"Viking 2 Orbiter launched with its lander in September 1975 and entered Mars orbit on August 7, 1976. It surveyed the planet while the team prepared its partner's landing at Utopia Planitia. On September 3, the lander descended, but the orbiter's work continued overhead. Its repeated passes would help compare different regions and observe Mars beyond the two landing sites."}{"\n\n"}<a href="https://science.nasa.gov/mission/viking/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Goals",
        title: "The Work It Was Built to Do",
        imageUrl: "/assets/objects/viking-1-lander.jpg",
        caption: "Viking 2 Orbiter",
        credit: "NASA",
        text: (<>{"Two television cameras photographed terrain, an infrared thermal mapper measured temperatures, and an atmospheric water detector followed water vapor. Solar panels supplied power, while radio equipment relayed information from the Viking 2 lander. The mission was to map and study Mars, support a safe landing and help interpret surface measurements. Later orbital adjustments also brought the spacecraft into better positions for observing Deimos."}{"\n\n"}<a href="https://science.nasa.gov/mission/viking/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Discoveries",
        title: "What Its Journey Made Possible",
        imageUrl: "/assets/objects/viking-1-lander.jpg",
        caption: "Viking 2 Orbiter",
        credit: "NASA",
        text: (<>{"Its photographs and measurements added to Viking's extensive mapping of Mars, revealing varied geology, weather and seasonal changes. Close views of Deimos improved knowledge of the smaller Martian moon. With Viking 1 Orbiter, it showed how a planet could be studied through repeated observations rather than only a flyby. Its relay work also made the lander's findings part of a coordinated mission."}{"\n\n"}<a href="https://science.nasa.gov/mission/viking/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Now",
        title: "Where Its Story Ended",
        imageUrl: "/assets/objects/viking-1-lander.jpg",
        caption: "Viking 2 Orbiter",
        credit: "NASA",
        text: (<>{"A propulsion-system leak depleted its attitude-control gas, ending reliable pointing. Controllers left it in a higher orbit, and operations ended on July 25, 1978. It is silent, last known orbiting Mars, with no actively measured present position in these sources. Its lander continued until April 1980. The two spacecraft therefore have different life spans, even though they traveled to Mars as one mission."}{"\n\n"}<a href="https://science.nasa.gov/mission/viking/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
    ],
  },
  {
    id: "deep-space-1",
    name: "Deep Space 1",
    place: "Mars",
    coverImageUrl: "/assets/objects/nm_ds_1.gif",
    recordIds: ["deep-space-1"],
    sourceUrls: ["https://science.nasa.gov/mission/deep-space-1/"],
    pages: [
      {
        label: "Origin",
        title: "A Test Flight With a Comet Ahead",
        imageUrl: "/assets/objects/nm_ds_1.gif",
        caption: "Deep Space 1",
        credit: "NASA",
        text: (<>{"Deep Space 1 launched on October 24, 1998, as a spacecraft built to try ideas that future explorers might need. Its main destination was a successful test, rather than a particular planet. In solar orbit, it would use a gentle ion engine and navigate with unusual independence. Its journey later added encounters with asteroid Braille and comet Borrelly, turning an engineering experiment into a scientific adventure."}{"\n\n"}<a href="https://science.nasa.gov/mission/deep-space-1/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Goals",
        title: "The Work It Was Built to Do",
        imageUrl: "/assets/objects/nm_ds_1.gif",
        caption: "Deep Space 1",
        credit: "NASA",
        text: (<>{"It tested twelve technologies, including ion propulsion, autonomous optical navigation, a solar-power concentrator and compact scientific instruments. The ion engine accelerated charged xenon particles, producing a small thrust that could work for a long time. A combined camera and imaging spectrometer studied targets; a compact plasma instrument sampled the environment. These trials would let later missions use new technology with less uncertainty."}{"\n\n"}<a href="https://science.nasa.gov/mission/deep-space-1/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Discoveries",
        title: "What Its Journey Made Possible",
        imageUrl: "/assets/objects/nm_ds_1.gif",
        caption: "Deep Space 1",
        credit: "NASA",
        text: (<>{"Ion propulsion and onboard navigation demonstrated capabilities that helped prepare later deep-space exploration. The Braille flyby returned useful measurements but disappointed in close photography because of navigation difficulties. After recovery from a star-tracker failure, Deep Space 1 successfully encountered Borrelly in September 2001 and photographed its dark, elongated nucleus. The comet observations made a mission built for technology testing a valuable scientific explorer too."}{"\n\n"}<a href="https://science.nasa.gov/mission/deep-space-1/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Now",
        title: "Where Its Story Ended",
        imageUrl: "/assets/objects/nm_ds_1.gif",
        caption: "Deep Space 1",
        credit: "NASA",
        text: (<>{"Controllers retired Deep Space 1 on December 18, 2001, after its extended mission, with pointing fuel running low. Its ion engine was turned off and normal operations ended by command. A radio receiver remained on in case future contact was wanted, but an attempt in March 2002 failed. It remains inactive on its solar trajectory after the asteroid and comet journey. No active mission provides its exact present position."}{"\n\n"}<a href="https://science.nasa.gov/mission/deep-space-1/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
    ],
  },
  {
    id: "mars-observer",
    name: "Mars Observer",
    place: "Mars",
    coverImageUrl: "/assets/objects/mars_observer.jpg",
    recordIds: ["mars-observer"],
    sourceUrls: ["https://science.nasa.gov/mission/mars-observer/"],
    pages: [
      {
        label: "Origin",
        title: "The Mapmaker That Never Began Its Map",
        imageUrl: "/assets/objects/mars_observer.jpg",
        caption: "Mars Observer",
        credit: "NASA",
        text: (<>{"Mars Observer launched on September 25, 1992, carrying a suite of instruments meant to transform maps of Mars. It spent almost a year crossing space toward an orbital survey that scientists had awaited since Viking. In August 1993, only days before the planned arrival in orbit, its messages stopped. The long journey had reached Mars's neighborhood, but the mapping chapter never began."}{"\n\n"}<a href="https://science.nasa.gov/mission/mars-observer/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Goals",
        title: "The Work It Was Built to Do",
        imageUrl: "/assets/objects/mars_observer.jpg",
        caption: "Mars Observer",
        credit: "NASA",
        text: (<>{"A camera, laser altimeter and thermal emission spectrometer would map landforms, heights and minerals. A pressure-modulator infrared radiometer would study the atmosphere, while a magnetometer and electron reflectometer investigated magnetic properties. A gamma-ray spectrometer examined composition; radio science explored gravity and the atmosphere, and a relay receiver supported future surface work. Solar arrays powered the spacecraft designed for a global orbital investigation."}{"\n\n"}<a href="https://science.nasa.gov/mission/mars-observer/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Discoveries",
        title: "What Its Journey Made Possible",
        imageUrl: "/assets/objects/mars_observer.jpg",
        caption: "Mars Observer",
        credit: "NASA",
        text: (<>{"It returned none of the planned orbital mapping of Mars. Cruise observations did include a gamma-ray burst, but they should not be confused with the promised Mars survey. The instrument designs were not simply lost with the spacecraft: versions later flew on other missions, including Mars Global Surveyor. Its unfinished project helped shape the next attempts to obtain the maps and measurements scientists still needed."}{"\n\n"}<a href="https://science.nasa.gov/mission/mars-observer/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Now",
        title: "Where Its Story Ended",
        imageUrl: "/assets/objects/mars_observer.jpg",
        caption: "Mars Observer",
        credit: "NASA",
        text: (<>{"Contact was lost shortly before orbit insertion in August 1993. NASA accounts differ between August 21 for the loss of contact and August 22 for mission end. Investigators considered a propulsion-system rupture the most likely explanation, but no direct final telemetry settled the failure. Its subsequent trajectory and exact present location remain unknown. It should not be described as definitely orbiting Mars or definitely circling the Sun."}{"\n\n"}<a href="https://science.nasa.gov/mission/mars-observer/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
    ],
  },
  {
    id: "apollo-10-snoopy",
    name: "Apollo 10 Snoopy ascent stage",
    place: "Solar Orbit",
    coverImageUrl: "/assets/objects/apollo10_cm_as10_27_3873.jpg",
    recordIds: ["apollo-10-snoopy"],
    sourceUrls: ["https://www.nasa.gov/missions/apollo/apollo-10-mission-details/"],
    pages: [
      {
        label: "Origin",
        title: "The Rehearsal That Went Around the Sun",
        imageUrl: "/assets/objects/apollo10_cm_as10_27_3873.jpg",
        caption: "Apollo 10 Snoopy ascent stage",
        credit: "NASA",
        text: (<>{"Snoopy traveled with Apollo 10 after launch on May 18, 1969. While John Young remained in the command module Charlie Brown, Thomas Stafford and Eugene Cernan flew the lunar module down toward the Moon. They approached to roughly fifteen kilometers above the surface, then returned to orbit. This was the rehearsal that tested much of a lunar landing without actually setting down."}{"\n\n"}<a href="https://www.nasa.gov/missions/apollo/apollo-10-mission-details/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Goals",
        title: "The Work It Was Built to Do",
        imageUrl: "/assets/objects/apollo10_cm_as10_27_3873.jpg",
        caption: "Apollo 10 Snoopy ascent stage",
        credit: "NASA",
        text: (<>{"The lunar module carried descent and ascent engines, landing radar, guidance equipment, life-support systems and radios. Its descent stage supported the approach; the ascent stage held the cabin and the engine for the climb back. The mission tested navigation, descent procedures and rendezvous with the command module. Snoopy had to show that the crew could separate, maneuver near the Moon and find their way back together."}{"\n\n"}<a href="https://www.nasa.gov/missions/apollo/apollo-10-mission-details/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Discoveries",
        title: "What Its Journey Made Possible",
        imageUrl: "/assets/objects/apollo10_cm_as10_27_3873.jpg",
        caption: "Apollo 10 Snoopy ascent stage",
        credit: "NASA",
        text: (<>{"Apollo 10 gathered operational measurements and photographs that helped prepare Apollo 11's landing. Stafford and Cernan practiced the lunar-module flight sequence and rendezvous, while the team checked navigation and communication in the real lunar environment. The main achievement was engineering knowledge and reduced uncertainty for the next crew, rather than a surface discovery. No lunar samples were collected because nobody landed."}{"\n\n"}<a href="https://www.nasa.gov/missions/apollo/apollo-10-mission-details/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Now",
        title: "Where Its Story Ended",
        imageUrl: "/assets/objects/apollo10_cm_as10_27_3873.jpg",
        caption: "Apollo 10 Snoopy ascent stage",
        credit: "NASA",
        text: (<>{"After the astronauts returned to Charlie Brown, Snoopy's ascent stage was separated and sent into orbit around the Sun in May 1969. It was no longer needed to bring the crew home. NASA confirms the solar-orbit disposal, but the sources do not establish an exact present position or final transmission time. The ascent stage is inactive; it is distinct from the descent stage, which was left on a different trajectory."}{"\n\n"}<a href="https://www.nasa.gov/missions/apollo/apollo-10-mission-details/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
    ],
  },
  {
    id: "cassini",
    name: "Cassini",
    place: "Saturn",
    coverImageUrl: "/assets/objects/1-pia18410-cassini-titan-crop.webp",
    recordIds: ["cassini"],
    sourceUrls: ["https://science.nasa.gov/mission/cassini/","https://www.nasa.gov/news-release/cassini-finds-global-ocean-in-saturns-moon-enceladus/","https://science.nasa.gov/mission/cassini/the-journey/timeline/"],
    pages: [
      {
        label: "Origin",
        title: "A Long Journey to the Ringed Planet",
        imageUrl: "/assets/objects/1-pia18410-cassini-titan-crop.webp",
        caption: "Cassini",
        credit: "NASA/JPL",
        text: (<>{"Cassini launched on October 15, 1997, with the European Huygens probe attached. Gravity assists helped the pair reach Saturn, where Cassini entered orbit in 2004. Instead of a quick flyby, it would return to rings and moons again and again. In 2005 it delivered Huygens to Titan, then continued an exploration that would last thirteen years at the ringed planet."}{"\n\n"}<a href="https://science.nasa.gov/mission/cassini/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://www.nasa.gov/news-release/cassini-finds-global-ocean-in-saturns-moon-enceladus/" target="_blank" rel="noreferrer">NASA source 2</a>{" · "}<a href="https://science.nasa.gov/mission/cassini/the-journey/timeline/" target="_blank" rel="noreferrer">NASA source 3</a></>),
      },
      {
        label: "Goals",
        title: "The Work It Was Built to Do",
        imageUrl: "/assets/objects/1-pia18410-cassini-titan-crop.webp",
        caption: "Cassini",
        credit: "NASA/JPL",
        text: (<>{"Radioisotope generators powered Cassini far from the Sun. Cameras, radar and infrared and ultraviolet instruments examined Saturn, the rings and moons. A magnetometer, plasma instruments, a dust analyzer and a mass spectrometer investigated particles and the surrounding environment; radio science helped probe interiors. It was built to study the whole Saturn system, while Huygens investigated Titan during descent and on the surface."}{"\n\n"}<a href="https://science.nasa.gov/mission/cassini/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://www.nasa.gov/news-release/cassini-finds-global-ocean-in-saturns-moon-enceladus/" target="_blank" rel="noreferrer">NASA source 2</a>{" · "}<a href="https://science.nasa.gov/mission/cassini/the-journey/timeline/" target="_blank" rel="noreferrer">NASA source 3</a></>),
      },
      {
        label: "Discoveries",
        title: "What Its Journey Made Possible",
        imageUrl: "/assets/objects/1-pia18410-cassini-titan-crop.webp",
        caption: "Cassini",
        credit: "NASA/JPL",
        text: (<>{"Cassini discovered water-rich plumes from Enceladus and supplied evidence for a global ocean beneath its ice. At Titan it revealed lakes and seas of liquid methane and ethane. Repeated observations also showed storms, complex ring structures and interactions among moons and rings. These discoveries made ocean worlds central to questions about habitability, while the archived observations keep enabling research beyond the spacecraft's lifetime."}{"\n\n"}<a href="https://science.nasa.gov/mission/cassini/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://www.nasa.gov/news-release/cassini-finds-global-ocean-in-saturns-moon-enceladus/" target="_blank" rel="noreferrer">NASA source 2</a>{" · "}<a href="https://science.nasa.gov/mission/cassini/the-journey/timeline/" target="_blank" rel="noreferrer">NASA source 3</a></>),
      },
      {
        label: "Now",
        title: "Where Its Story Ended",
        imageUrl: "/assets/objects/1-pia18410-cassini-titan-crop.webp",
        caption: "Cassini",
        credit: "NASA/JPL",
        text: (<>{"As fuel ran low, controllers directed Cassini into Saturn's atmosphere on September 15, 2017. It sent measurements during the plunge until it could no longer point its antenna at Earth. Heat and pressure destroyed it, leaving no solid-surface wreck. This deliberate ending protected Titan and Enceladus from a possible future accidental collision and contamination by a spacecraft no longer under control."}{"\n\n"}<a href="https://science.nasa.gov/mission/cassini/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://www.nasa.gov/news-release/cassini-finds-global-ocean-in-saturns-moon-enceladus/" target="_blank" rel="noreferrer">NASA source 2</a>{" · "}<a href="https://science.nasa.gov/mission/cassini/the-journey/timeline/" target="_blank" rel="noreferrer">NASA source 3</a></>),
      },
    ],
  },
  {
    id: "surveyor-2",
    name: "Surveyor 2",
    place: "Moon",
    coverImageUrl: "/assets/objects/surveyor-3.gif",
    recordIds: ["surveyor-2"],
    sourceUrls: ["https://science.nasa.gov/mission/surveyor-2/"],
    pages: [
      {
        label: "Origin",
        title: "A Landing Lost to a Tumble",
        imageUrl: "/assets/objects/surveyor-3.gif",
        caption: "Surveyor 2",
        credit: "NSSDCA",
        text: (<>{"Surveyor 2 launched on September 20, 1966, hoping to repeat Surveyor 1's successful soft landing. Its intended destination was near Sinus Medii. During a course correction, however, one of its three small engines failed to fire. The uneven thrust sent the spacecraft into a tumble. Controllers tried to regain control, but the mission's planned gentle arrival was slipping out of reach."}{"\n\n"}<a href="https://science.nasa.gov/mission/surveyor-2/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Goals",
        title: "The Work It Was Built to Do",
        imageUrl: "/assets/objects/surveyor-3.gif",
        caption: "Surveyor 2",
        credit: "NSSDCA",
        text: (<>{"The lander carried a television camera, descent radar, a braking rocket, small vernier engines and engineering sensors. Solar panels and batteries would power observations after touchdown. It was built to demonstrate another controlled lunar landing and return pictures and engineering information for Apollo. The spacecraft depended on its thrusters working together to guide the descent, a requirement its failed correction could no longer meet."}{"\n\n"}<a href="https://science.nasa.gov/mission/surveyor-2/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Discoveries",
        title: "What Its Journey Made Possible",
        imageUrl: "/assets/objects/surveyor-3.gif",
        caption: "Surveyor 2",
        credit: "NSSDCA",
        text: (<>{"Surveyor 2 never returned lunar surface photographs or soil observations. Its failure therefore should not be presented as a discovery about the Moon. Instead, the lost mission became part of the engineering experience of the Surveyor program: flight behavior and attempted recovery exposed the importance of reliable propulsion and orientation. Other Surveyors would continue the effort to prepare the surface for human exploration."}{"\n\n"}<a href="https://science.nasa.gov/mission/surveyor-2/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Now",
        title: "Where Its Story Ended",
        imageUrl: "/assets/objects/surveyor-3.gif",
        caption: "Surveyor 2",
        credit: "NSSDCA",
        text: (<>{"Contact ended on September 22, 1966, and the spacecraft impacted the Moon on September 23. Its remains are believed to be in the region southeast of Copernicus, but an identified wreck is not established in these records. The failed correction prevented a controlled descent. Surveyor 2 is destroyed and silent; the approximate map position describes a historical estimate, rather than a confirmed location of debris."}{"\n\n"}<a href="https://science.nasa.gov/mission/surveyor-2/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
    ],
  },
  {
    id: "surveyor-4",
    name: "Surveyor 4",
    place: "Moon",
    coverImageUrl: "/assets/objects/surveyor-3.gif",
    recordIds: ["surveyor-4"],
    sourceUrls: ["https://science.nasa.gov/mission/surveyor-4/"],
    pages: [
      {
        label: "Origin",
        title: "Silence in the Final Descent",
        imageUrl: "/assets/objects/surveyor-3.gif",
        caption: "Surveyor 4",
        credit: "NSSDCA",
        text: (<>{"Surveyor 4 launched on July 14, 1967, heading toward Sinus Medii near the center of the Moon's visible face. Surveyor 3 had already shown how a robotic scoop could test lunar soil, and this new lander was to continue that work. Its journey appeared to go well until July 17, when radio signals abruptly stopped during the last minutes of descent."}{"\n\n"}<a href="https://science.nasa.gov/mission/surveyor-4/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Goals",
        title: "The Work It Was Built to Do",
        imageUrl: "/assets/objects/surveyor-3.gif",
        caption: "Surveyor 4",
        credit: "NSSDCA",
        text: (<>{"A television camera would photograph the ground, and a surface sampler would dig and test soil. A magnet in the sampler could investigate iron-bearing material. Radar, a braking rocket and vernier engines were designed to control the landing; solar panels and batteries would support surface work. The mission sought both engineering proof of a soft landing and more evidence about ground that Apollo astronauts might encounter."}{"\n\n"}<a href="https://science.nasa.gov/mission/surveyor-4/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Discoveries",
        title: "What Its Journey Made Possible",
        imageUrl: "/assets/objects/surveyor-3.gif",
        caption: "Surveyor 4",
        credit: "NSSDCA",
        text: (<>{"It returned no surface pictures or soil measurements because communication failed before touchdown. There was no observed scientific discovery at the landing site. The loss instead added an unresolved descent failure to the Surveyor program's engineering record. The instruments show what the mission was supposed to investigate, but their presence onboard is not evidence that those planned observations were completed."}{"\n\n"}<a href="https://science.nasa.gov/mission/surveyor-4/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Now",
        title: "Where Its Story Ended",
        imageUrl: "/assets/objects/surveyor-3.gif",
        caption: "Surveyor 4",
        credit: "NSSDCA",
        text: (<>{"Signals stopped around 02:03 Universal Time on July 17, 1967, roughly two and a half minutes before landing. NASA suspected a braking-rocket explosion, but the cause was not conclusively established. Its actual impact location is unknown; Sinus Medii was the target, not a confirmed wreck site. Surveyor 4 is presumed destroyed on the Moon, with no successful contact after its final descent."}{"\n\n"}<a href="https://science.nasa.gov/mission/surveyor-4/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
    ],
  },
  {
    id: "lunar-prospector",
    name: "Lunar Prospector",
    place: "Moon",
    coverImageUrl: "assets/objects/lunarprosp.gif",
    recordIds: ["lunar-prospector"],
    sourceUrls: ["https://science.nasa.gov/mission/lunar-prospector/"],
    pages: [
      {
        label: "Origin",
        title: "Searching the Moon Without a Camera",
        imageUrl: "assets/objects/lunarprosp.gif",
        caption: "Lunar Prospector",
        credit: "NSSDCA",
        text: (<>{"Lunar Prospector launched in January 1998—January 6 in Florida and January 7 in Universal Time—to inspect the Moon without a camera-led tour. It entered a polar orbit and began measuring signals that could reveal composition and hidden resources. Each pass crossed new ground as the Moon rotated below. The small spinning spacecraft would search especially carefully near the cold, shadowed poles."}{"\n\n"}<a href="https://science.nasa.gov/mission/lunar-prospector/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Goals",
        title: "The Work It Was Built to Do",
        imageUrl: "assets/objects/lunarprosp.gif",
        caption: "Lunar Prospector",
        credit: "NSSDCA",
        text: (<>{"Gamma-ray, neutron and alpha-particle spectrometers measured particles associated with the surface and its environment. A magnetometer and electron reflectometer investigated magnetic fields, while radio tracking measured gravity. Solar cells supplied power. The mission aimed to map surface elements, look for evidence of polar ice, and investigate the Moon's gravity and magnetic properties, turning indirect signals into a global picture."}{"\n\n"}<a href="https://science.nasa.gov/mission/lunar-prospector/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Discoveries",
        title: "What Its Journey Made Possible",
        imageUrl: "assets/objects/lunarprosp.gif",
        caption: "Lunar Prospector",
        credit: "NSSDCA",
        text: (<>{"Neutron observations detected extra hydrogen near both poles, consistent with water ice mixed into the ground. This was evidence for ice, rather than a photograph or direct sample of it. The mission also mapped elements, localized magnetic fields and gravity, improving understanding of lunar composition and interior structure. Its findings gave later explorers strong reasons to investigate the shadowed polar regions more closely."}{"\n\n"}<a href="https://science.nasa.gov/mission/lunar-prospector/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Now",
        title: "Where Its Story Ended",
        imageUrl: "assets/objects/lunarprosp.gif",
        caption: "Lunar Prospector",
        credit: "NSSDCA",
        text: (<>{"On July 31, 1999, controllers deliberately sent Lunar Prospector into a permanently shadowed area of Shoemaker Crater near the south pole. Observers hoped the impact might release detectable water, but no water-vapor signal was found. The spacecraft was destroyed, with debris in the approximate impact region. Its mapping mission was complete, and the final collision was an additional experiment, not an accidental unexplained loss."}{"\n\n"}<a href="https://science.nasa.gov/mission/lunar-prospector/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
    ],
  },
  {
    id: "mars-polar-lander",
    name: "Mars Polar Lander",
    place: "Mars",
    coverImageUrl: "assets/objects/mars_polar_lander.jpg",
    recordIds: ["mars-polar-lander"],
    sourceUrls: ["https://science.nasa.gov/mission/mars-polar-lander-deep-space-2/","https://llis.nasa.gov/lesson/938"],
    pages: [
      {
        label: "Origin",
        title: "A Polar Arrival Without an Answer",
        imageUrl: "assets/objects/mars_polar_lander.jpg",
        caption: "Mars Polar Lander",
        credit: "NSSDCA",
        text: (<>{"Mars Polar Lander launched on January 3, 1999, bound for the edge of the planet's south polar cap. It carried two small Deep Space 2 probes and was meant to investigate a region where layers of ice and dust could preserve climate history. On December 3, it reached Mars. After the planned entry sequence began, controllers waited for the surface signal that never arrived."}{"\n\n"}<a href="https://science.nasa.gov/mission/mars-polar-lander-deep-space-2/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://llis.nasa.gov/lesson/938" target="_blank" rel="noreferrer">NASA source 2</a></>),
      },
      {
        label: "Goals",
        title: "The Work It Was Built to Do",
        imageUrl: "assets/objects/mars_polar_lander.jpg",
        caption: "Mars Polar Lander",
        credit: "NSSDCA",
        text: (<>{"A robotic arm would dig and deliver soil to a thermal and evolved-gas analyzer, which would heat samples and examine released gases. Cameras would document the terrain and digging. A meteorology package would study weather, and a microphone was intended to record sounds. Solar panels would power the lander. The accompanying Deep Space 2 penetrators tested a different way to investigate below the surface."}{"\n\n"}<a href="https://science.nasa.gov/mission/mars-polar-lander-deep-space-2/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://llis.nasa.gov/lesson/938" target="_blank" rel="noreferrer">NASA source 2</a></>),
      },
      {
        label: "Discoveries",
        title: "What Its Journey Made Possible",
        imageUrl: "assets/objects/mars_polar_lander.jpg",
        caption: "Mars Polar Lander",
        credit: "NSSDCA",
        text: (<>{"The lander and the two small probes returned no planned surface science. They did not confirm ice or provide the intended polar climate record. Investigations of the loss identified weaknesses in testing and touchdown-sensing software, giving later projects lessons about checking complete landing sequences. Its scientific instruments explain the questions it was built to answer, while its failed arrival explains why those answers had to wait."}{"\n\n"}<a href="https://science.nasa.gov/mission/mars-polar-lander-deep-space-2/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://llis.nasa.gov/lesson/938" target="_blank" rel="noreferrer">NASA source 2</a></>),
      },
      {
        label: "Now",
        title: "Where Its Story Ended",
        imageUrl: "assets/objects/mars_polar_lander.jpg",
        caption: "Mars Polar Lander",
        credit: "NSSDCA",
        text: (<>{"The final communication came before atmospheric entry on December 3, 1999. Investigators judged that signals from deploying the landing legs probably caused a false touchdown indication, shutting the engines off too early. Without descent telemetry, that scenario could not be proved directly. The lander is presumed destroyed near its intended south-polar landing region, but its crash site remains unconfirmed. Contact efforts ended in January 2000."}{"\n\n"}<a href="https://science.nasa.gov/mission/mars-polar-lander-deep-space-2/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://llis.nasa.gov/lesson/938" target="_blank" rel="noreferrer">NASA source 2</a></>),
      },
    ],
  },
  {
    id: "apollo-11-descent-stage",
    name: "Apollo 11 descent stage",
    place: "Moon",
    coverImageUrl: "/assets/objects/apollo-11-descent-stage.jpg",
    recordIds: ["apollo-11-descent-stage"],
    sourceUrls: ["https://www.nasa.gov/mission/apollo-11/"],
    pages: [
      {
        label: "Origin",
        title: "Eagle's Foundation at Tranquility Base",
        imageUrl: "/assets/objects/apollo-11-descent-stage.jpg",
        caption: "Apollo 11 descent stage",
        credit: "NASA (image via NSSDCA)",
        text: (<>{"Eagle's descent stage launched with Apollo 11 on July 16, 1969. It was the lower half of the lunar module carrying Neil Armstrong and Buzz Aldrin, while Michael Collins would remain in orbit. On July 20, its engine helped guide the crew to Mare Tranquillitatis. When its four legs touched the ground, the stage became the foundation of the first human visit to the Moon."}{"\n\n"}<a href="https://www.nasa.gov/mission/apollo-11/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Goals",
        title: "The Work It Was Built to Do",
        imageUrl: "/assets/objects/apollo-11-descent-stage.jpg",
        caption: "Apollo 11 descent stage",
        credit: "NASA (image via NSSDCA)",
        text: (<>{"The descent stage carried the braking engine, propellant, landing gear and storage bays for tools and scientific equipment. It had to bring the crew down safely and support their work on the ground. Its cargo included the early surface experiment package, a passive seismometer and dust detector, plus a separate laser reflector. After the moonwalk, it would serve as the launch platform for Eagle's ascent stage."}{"\n\n"}<a href="https://www.nasa.gov/mission/apollo-11/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Discoveries",
        title: "What Its Journey Made Possible",
        imageUrl: "/assets/objects/apollo-11-descent-stage.jpg",
        caption: "Apollo 11 descent stage",
        credit: "NASA (image via NSSDCA)",
        text: (<>{"The astronauts collected about 21.55 kilograms of lunar samples, giving scientists material to examine directly on Earth. The seismometer began recording lunar vibrations, while the laser reflector let researchers measure the Earth–Moon distance. The descent stage enabled these investigations by delivering the people and equipment; it was not itself an independent laboratory after they left. Its safe landing made all of that surface work possible."}{"\n\n"}<a href="https://www.nasa.gov/mission/apollo-11/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Now",
        title: "Where Its Story Ended",
        imageUrl: "/assets/objects/apollo-11-descent-stage.jpg",
        caption: "Apollo 11 descent stage",
        credit: "NASA (image via NSSDCA)",
        text: (<>{"On July 21, 1969, Eagle's ascent stage lifted Armstrong and Aldrin back toward Collins. The descent stage stayed at Tranquility Base because its landing job was finished and only the upper stage was needed for departure. It remains inactive on the Moon, near the deployed equipment and footprints. The ascent-stage liftoff marks the separation, not a final radio message from a long-running descent-stage mission."}{"\n\n"}<a href="https://www.nasa.gov/mission/apollo-11/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
    ],
  },
  {
    id: "apollo-12-descent-stage",
    name: "Apollo 12 descent stage",
    place: "Moon",
    coverImageUrl: "/assets/objects/apollo-12-descent-stage.jpg",
    recordIds: ["apollo-12-descent-stage"],
    sourceUrls: ["https://www.nasa.gov/mission/apollo-12/"],
    pages: [
      {
        label: "Origin",
        title: "Intrepid Beside an Earlier Explorer",
        imageUrl: "/assets/objects/apollo-12-descent-stage.jpg",
        caption: "Apollo 12 descent stage",
        credit: "NASA (image via NSSDCA)",
        text: (<>{"Intrepid's descent stage traveled with Apollo 12 after launch on November 14, 1969. On November 19, it brought Pete Conrad and Alan Bean into Oceanus Procellarum near Surveyor 3, while Richard Gordon remained in lunar orbit. This landing tested precision as well as courage: reaching an earlier robotic spacecraft would let the crew investigate a machine that had already spent years on the Moon."}{"\n\n"}<a href="https://www.nasa.gov/mission/apollo-12/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Goals",
        title: "The Work It Was Built to Do",
        imageUrl: "/assets/objects/apollo-12-descent-stage.jpg",
        caption: "Apollo 12 descent stage",
        credit: "NASA (image via NSSDCA)",
        text: (<>{"Its engine, propellant tanks and landing gear supported the descent, while storage bays carried geological tools and the Apollo Lunar Surface Experiments Package. That package included a seismometer, magnetometer, solar-wind instrument, ion detectors, a thin-atmosphere gauge and dust detector. The stage delivered the crew's equipment and provided a stable base. Later, the upper stage would launch from it to return the astronauts to lunar orbit."}{"\n\n"}<a href="https://www.nasa.gov/mission/apollo-12/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Discoveries",
        title: "What Its Journey Made Possible",
        imageUrl: "/assets/objects/apollo-12-descent-stage.jpg",
        caption: "Apollo 12 descent stage",
        credit: "NASA (image via NSSDCA)",
        text: (<>{"Conrad and Bean collected about 34 kilograms of samples and brought back roughly ten kilograms of selected Surveyor 3 parts, including its camera. The samples helped scientists study lunar rocks, and the returned hardware showed the effects of exposure on the Moon. Their ALSEP station continued measuring the environment after departure. Intrepid's descent stage enabled both the short human expedition and the instruments' much longer watch."}{"\n\n"}<a href="https://www.nasa.gov/mission/apollo-12/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Now",
        title: "Where Its Story Ended",
        imageUrl: "/assets/objects/apollo-12-descent-stage.jpg",
        caption: "Apollo 12 descent stage",
        credit: "NASA (image via NSSDCA)",
        text: (<>{"It remains at Apollo 12's landing site in Oceanus Procellarum, close to Surveyor Crater. On November 20, 1969, the ascent stage lifted the astronauts away, leaving the lower stage behind as designed. It had no independent means of returning to Earth. The nearby ALSEP operated separately, so its later shutdown date should not be confused with the descent stage's departure role."}{"\n\n"}<a href="https://www.nasa.gov/mission/apollo-12/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
    ],
  },
  {
    id: "apollo-14-descent-stage",
    name: "Apollo 14 descent stage",
    place: "Moon",
    coverImageUrl: "/assets/objects/apollo-14-descent-stage.jpg",
    recordIds: ["apollo-14-descent-stage"],
    sourceUrls: ["https://www.nasa.gov/missions/apollo/apollo-14-mission-details/"],
    pages: [
      {
        label: "Origin",
        title: "Antares Returns to Fra Mauro",
        imageUrl: "/assets/objects/apollo-14-descent-stage.jpg",
        caption: "Apollo 14 descent stage",
        credit: "NASA (image via NSSDCA)",
        text: (<>{"Antares launched with Apollo 14 on January 31, 1971, carrying Alan Shepard and Edgar Mitchell toward Fra Mauro while Stuart Roosa would stay in orbit. The region had been Apollo 13's intended destination. After engineers worked around an abort-switch problem, Antares landed on February 5. Its descent stage brought the crew to terrain where broken rocks could preserve the history of a huge lunar impact."}{"\n\n"}<a href="https://www.nasa.gov/missions/apollo/apollo-14-mission-details/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Goals",
        title: "The Work It Was Built to Do",
        imageUrl: "/assets/objects/apollo-14-descent-stage.jpg",
        caption: "Apollo 14 descent stage",
        credit: "NASA (image via NSSDCA)",
        text: (<>{"The lower stage held the descent engine, propellant, landing gear and equipment bays. It carried tools, a wheeled handcart for transporting equipment and the Apollo Lunar Surface Experiments Package. Passive and active seismic instruments, charged-particle and ion detectors, an atmosphere gauge and dust detector supported the surface science. Its purpose was to land the crew and cargo safely, then act as the ascent stage's launch platform."}{"\n\n"}<a href="https://www.nasa.gov/missions/apollo/apollo-14-mission-details/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Discoveries",
        title: "What Its Journey Made Possible",
        imageUrl: "/assets/objects/apollo-14-descent-stage.jpg",
        caption: "Apollo 14 descent stage",
        credit: "NASA (image via NSSDCA)",
        text: (<>{"The crew collected about 42 kilograms of rocks and soil, including breccias—rocks made from fragments joined after impacts. Their observations near Cone Crater helped investigate material associated with the Imbrium basin. The deployed experiments measured ground structure, moonquakes and the lunar environment. Antares made those investigations possible by delivering the expedition, while the instruments and returned samples supplied the scientific evidence."}{"\n\n"}<a href="https://www.nasa.gov/missions/apollo/apollo-14-mission-details/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Now",
        title: "Where Its Story Ended",
        imageUrl: "/assets/objects/apollo-14-descent-stage.jpg",
        caption: "Apollo 14 descent stage",
        credit: "NASA (image via NSSDCA)",
        text: (<>{"On February 6, 1971, the upper stage carried Shepard and Mitchell back to lunar orbit. Antares's descent stage stayed in the Fra Mauro region, where its landing task was complete. It remains inactive on the surface. The ALSEP station and separate laser reflector were deployed nearby, but they were distinct pieces of equipment with different working lives; leaving the landing stage did not end all science at the site."}{"\n\n"}<a href="https://www.nasa.gov/missions/apollo/apollo-14-mission-details/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
    ],
  },
  {
    id: "apollo-15-descent-stage",
    name: "Apollo 15 descent stage",
    place: "Moon",
    coverImageUrl: "/assets/objects/apollo-15-descent-stage.jpg",
    recordIds: ["apollo-15-descent-stage"],
    sourceUrls: ["https://www.nasa.gov/missions/apollo/apollo-15-mission-details/"],
    pages: [
      {
        label: "Origin",
        title: "Falcon Brings a Rover to the Mountains",
        imageUrl: "/assets/objects/apollo-15-descent-stage.jpg",
        caption: "Apollo 15 descent stage",
        credit: "NASA (image via NSSDCA)",
        text: (<>{"Falcon's descent stage left Earth with Apollo 15 on July 26, 1971. Four days later, it carried David Scott and James Irwin down toward the Hadley-Apennine landscape while Alfred Worden remained in orbit. This lunar module supported a longer stay and more equipment than the earlier landings. Folded against it was the rover that would turn distant geological targets into places the crew could visit."}{"\n\n"}<a href="https://www.nasa.gov/missions/apollo/apollo-15-mission-details/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Goals",
        title: "The Work It Was Built to Do",
        imageUrl: "/assets/objects/apollo-15-descent-stage.jpg",
        caption: "Apollo 15 descent stage",
        credit: "NASA (image via NSSDCA)",
        text: (<>{"It carried the descent engine, fuel, landing legs, supplies, tools and the Lunar Roving Vehicle. The science cargo included an ALSEP station with seismic, magnetic, solar-wind, ion, dust and heat-flow experiments. The larger mission combined surface exploration with orbital instruments. Falcon's lower stage had to deliver that cargo and support the crew's stay, then provide the platform from which the upper stage would depart."}{"\n\n"}<a href="https://www.nasa.gov/missions/apollo/apollo-15-mission-details/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Discoveries",
        title: "What Its Journey Made Possible",
        imageUrl: "/assets/objects/apollo-15-descent-stage.jpg",
        caption: "Apollo 15 descent stage",
        credit: "NASA (image via NSSDCA)",
        text: (<>{"The rover helped Scott and Irwin travel about 27.9 kilometers, examine Hadley Rille and collect about 77 kilograms of samples. The Genesis Rock provided material from the early lunar crust, while other rocks and observations helped investigate volcanic history. Deployed instruments continued to measure the site after the expedition. These were discoveries enabled by the lander's cargo and crew, rather than measurements made by an abandoned descent engine."}{"\n\n"}<a href="https://www.nasa.gov/missions/apollo/apollo-15-mission-details/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Now",
        title: "Where Its Story Ended",
        imageUrl: "/assets/objects/apollo-15-descent-stage.jpg",
        caption: "Apollo 15 descent stage",
        credit: "NASA (image via NSSDCA)",
        text: (<>{"Falcon's ascent stage lifted off on August 2, 1971, leaving the lower stage at Hadley-Apennine. The descent stage remains inactive at the landing site, with the rover and deployed instruments nearby. It stayed because only the cabin and ascent equipment were needed to return Scott and Irwin to Worden. The crew came home; the landing structure had completed a job that required it to remain on the Moon."}{"\n\n"}<a href="https://www.nasa.gov/missions/apollo/apollo-15-mission-details/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
    ],
  },
  {
    id: "apollo-16-descent-stage",
    name: "Apollo 16 descent stage",
    place: "Moon",
    coverImageUrl: "/assets/objects/apollo-16-descent-stage.jpg",
    recordIds: ["apollo-16-descent-stage"],
    sourceUrls: ["https://www.nasa.gov/missions/apollo/apollo-16-mission-details/"],
    pages: [
      {
        label: "Origin",
        title: "Orion Arrives in the Highlands",
        imageUrl: "/assets/objects/apollo-16-descent-stage.jpg",
        caption: "Apollo 16 descent stage",
        credit: "NASA (image via NSSDCA)",
        text: (<>{"Orion launched with Apollo 16 on April 16, 1972, carrying John Young and Charles Duke toward the Descartes highlands. Ken Mattingly would conduct work in orbit. After a delay while controllers checked a spacecraft problem, Orion landed on April 21 in Universal Time, April 20 in the United States. The descent stage placed the crew in a highland landscape different from earlier mare landing regions."}{"\n\n"}<a href="https://www.nasa.gov/missions/apollo/apollo-16-mission-details/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Goals",
        title: "The Work It Was Built to Do",
        imageUrl: "/assets/objects/apollo-16-descent-stage.jpg",
        caption: "Apollo 16 descent stage",
        credit: "NASA (image via NSSDCA)",
        text: (<>{"Its descent engine, propellant tanks and four legs delivered and supported the lunar module. Equipment bays carried a rover, geological tools and an ALSEP package with passive and active seismic instruments, a magnetometer and a heat-flow experiment. A separate ultraviolet camera broadened the mission's observations. The stage supported a longer exploration stay before providing the base for the astronauts' launch back to orbit."}{"\n\n"}<a href="https://www.nasa.gov/missions/apollo/apollo-16-mission-details/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Discoveries",
        title: "What Its Journey Made Possible",
        imageUrl: "/assets/objects/apollo-16-descent-stage.jpg",
        caption: "Apollo 16 descent stage",
        credit: "NASA (image via NSSDCA)",
        text: (<>{"Young and Duke explored the highlands and returned about 96 kilograms of samples. Many rocks were breccias formed by impacts, changing interpretations that had emphasized volcanic origins for the area. Seismic and magnetic instruments added environmental observations. The heat-flow experiment could not operate after its cable was broken during setup. That limit belongs in the story alongside the successful geological work Orion made possible."}{"\n\n"}<a href="https://www.nasa.gov/missions/apollo/apollo-16-mission-details/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Now",
        title: "Where Its Story Ended",
        imageUrl: "/assets/objects/apollo-16-descent-stage.jpg",
        caption: "Apollo 16 descent stage",
        credit: "NASA (image via NSSDCA)",
        text: (<>{"The ascent stage departed on April 24, 1972, Universal Time, leaving Orion's lower stage at the Descartes landing site. It remains inactive on the Moon because no return system was provided for that heavy structure. The crew, samples and cabin went upward; the landing engine and legs stayed behind. The separately deployed ALSEP later had its own operational ending in 1977."}{"\n\n"}<a href="https://www.nasa.gov/missions/apollo/apollo-16-mission-details/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
    ],
  },
  {
    id: "apollo-17-descent-stage",
    name: "Apollo 17 descent stage",
    place: "Moon",
    coverImageUrl: "/assets/objects/apollo-17-descent-stage.jpg",
    recordIds: ["apollo-17-descent-stage"],
    sourceUrls: ["https://www.nasa.gov/missions/apollo/apollo-17-mission-details/"],
    pages: [
      {
        label: "Origin",
        title: "Challenger in the Last Apollo Valley",
        imageUrl: "/assets/objects/apollo-17-descent-stage.jpg",
        caption: "Apollo 17 descent stage",
        credit: "NASA (image via NSSDCA)",
        text: (<>{"Challenger traveled with Apollo 17 after launch on December 7, 1972. Eugene Cernan and geologist Harrison Schmitt rode it down to Taurus-Littrow on December 11, while Ronald Evans worked in orbit. This was Apollo's final lunar landing. The descent stage brought a rover, supplies and scientific equipment into a valley where mountain material and younger volcanic deposits could be studied together."}{"\n\n"}<a href="https://www.nasa.gov/missions/apollo/apollo-17-mission-details/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Goals",
        title: "The Work It Was Built to Do",
        imageUrl: "/assets/objects/apollo-17-descent-stage.jpg",
        caption: "Apollo 17 descent stage",
        credit: "NASA (image via NSSDCA)",
        text: (<>{"The lower stage carried the landing engine, propellant, legs, rover and equipment bays. Its ALSEP cargo included a heat-flow experiment, seismic profiling equipment, an atmospheric mass spectrometer, an ejecta-and-meteorite experiment and a surface gravimeter. Geological tools supported sample collection. Challenger was built to sustain an extended visit and then serve as the launch base for the cabin that would take the astronauts back to Evans."}{"\n\n"}<a href="https://www.nasa.gov/missions/apollo/apollo-17-mission-details/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Discoveries",
        title: "What Its Journey Made Possible",
        imageUrl: "/assets/objects/apollo-17-descent-stage.jpg",
        caption: "Apollo 17 descent stage",
        credit: "NASA (image via NSSDCA)",
        text: (<>{"The crew returned about 110 kilograms of samples, including orange soil whose tiny glass beads recorded ancient volcanic eruptions. Their field observations connected valley deposits with the surrounding mountains. Surface experiments investigated heat, shallow structure and the lunar environment; the gravimeter did not achieve its intended gravity experiment because of a design problem. The descent stage enabled this work by delivering the crew and their equipment."}{"\n\n"}<a href="https://www.nasa.gov/missions/apollo/apollo-17-mission-details/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Now",
        title: "Where Its Story Ended",
        imageUrl: "/assets/objects/apollo-17-descent-stage.jpg",
        caption: "Apollo 17 descent stage",
        credit: "NASA (image via NSSDCA)",
        text: (<>{"Challenger's upper stage lifted off on December 14, 1972, leaving the descent stage in Taurus-Littrow. It remains inactive at the final Apollo landing site, with the rover and other hardware nearby. Its heavy engine-and-leg structure was not needed for the journey home. The ascent stage was later deliberately impacted separately; the lower stage is the portion that stayed where the astronauts had lived and worked."}{"\n\n"}<a href="https://www.nasa.gov/missions/apollo/apollo-17-mission-details/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
    ],
  },
  {
    id: "apollo-12-alsep",
    name: "Apollo 12 ALSEP station",
    place: "Moon",
    coverImageUrl: "/assets/objects/apollo12_lunar_module.jpg",
    recordIds: ["apollo-12-alsep"],
    sourceUrls: ["https://www.nasa.gov/mission/apollo-12/","https://pds.nasa.gov/ds-view/pds/viewContext.jsp?identifier=urn%3Anasa%3Apds%3Acontext%3Ainstrument_host%3Aspacecraft.a12a"],
    pages: [
      {
        label: "Origin",
        title: "A Station That Outlasted Its Visitors",
        imageUrl: "/assets/objects/apollo12_lunar_module.jpg",
        caption: "Apollo 12 ALSEP station",
        credit: "NSSDCA",
        text: (<>{"In November 1969, Pete Conrad and Alan Bean carried Apollo 12's ALSEP out of Intrepid and arranged it near their Oceanus Procellarum landing site. Cables connected the instruments to a central station. They activated it on November 19, then left for Earth the next day. The crew's visit was brief, but this first full Apollo Lunar Surface Experiments Package was built to keep observing after their footprints stopped."}{"\n\n"}<a href="https://www.nasa.gov/mission/apollo-12/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://pds.nasa.gov/ds-view/pds/viewContext.jsp?identifier=urn%3Anasa%3Apds%3Acontext%3Ainstrument_host%3Aspacecraft.a12a" target="_blank" rel="noreferrer">NASA source 2</a></>),
      },
      {
        label: "Goals",
        title: "The Work It Was Built to Do",
        imageUrl: "/assets/objects/apollo12_lunar_module.jpg",
        caption: "Apollo 12 ALSEP station",
        credit: "NSSDCA",
        text: (<>{"A SNAP-27 radioisotope generator converted heat into electricity, letting the station work without relying on daylight. Its passive seismometer listened for vibrations; a magnetometer measured magnetic fields, and a solar-wind spectrometer investigated particles from the Sun. Ion detectors, a cold-cathode gauge and a dust detector examined the sparse lunar environment. The central station distributed power and radioed measurements to Earth."}{"\n\n"}<a href="https://www.nasa.gov/mission/apollo-12/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://pds.nasa.gov/ds-view/pds/viewContext.jsp?identifier=urn%3Anasa%3Apds%3Acontext%3Ainstrument_host%3Aspacecraft.a12a" target="_blank" rel="noreferrer">NASA source 2</a></>),
      },
      {
        label: "Discoveries",
        title: "What Its Journey Made Possible",
        imageUrl: "/assets/objects/apollo12_lunar_module.jpg",
        caption: "Apollo 12 ALSEP station",
        credit: "NSSDCA",
        text: (<>{"The seismometer recorded moonquakes and impacts, helping scientists investigate the Moon's interior. As later Apollo stations joined it, comparisons among sites made a more useful seismic network. Particle and magnetic measurements documented how the lunar environment responded to the Sun and Earth's magnetic surroundings. Its contribution was a long record, allowing researchers to study events and changes that a short astronaut visit would miss."}{"\n\n"}<a href="https://www.nasa.gov/mission/apollo-12/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://pds.nasa.gov/ds-view/pds/viewContext.jsp?identifier=urn%3Anasa%3Apds%3Acontext%3Ainstrument_host%3Aspacecraft.a12a" target="_blank" rel="noreferrer">NASA source 2</a></>),
      },
      {
        label: "Now",
        title: "Where Its Story Ended",
        imageUrl: "/assets/objects/apollo12_lunar_module.jpg",
        caption: "Apollo 12 ALSEP station",
        credit: "NSSDCA",
        text: (<>{"The station remains near the Apollo 12 landing area, separate from Intrepid's descent stage. NASA ended ALSEP scientific operations on September 30, 1977, after years of service and the end of funded support. Instruments were switched off; carrier signals continued for a time, which is different from receiving science measurements. Its archived observations remain useful, while the hardware itself stayed where the astronauts had deployed it."}{"\n\n"}<a href="https://www.nasa.gov/mission/apollo-12/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://pds.nasa.gov/ds-view/pds/viewContext.jsp?identifier=urn%3Anasa%3Apds%3Acontext%3Ainstrument_host%3Aspacecraft.a12a" target="_blank" rel="noreferrer">NASA source 2</a></>),
      },
    ],
  },
  {
    id: "apollo-14-alsep",
    name: "Apollo 14 ALSEP station",
    place: "Moon",
    coverImageUrl: "/assets/objects/apollo_14_lm.jpg",
    recordIds: ["apollo-14-alsep"],
    sourceUrls: ["https://www.nasa.gov/missions/apollo/apollo-14-mission-details/","https://pds.nasa.gov/ds-view/pds/viewContext.jsp?identifier=urn%3Anasa%3Apds%3Acontext%3Ainstrument_host%3Aspacecraft.a14a"],
    pages: [
      {
        label: "Origin",
        title: "A Second Listening Post",
        imageUrl: "/assets/objects/apollo_14_lm.jpg",
        caption: "Apollo 14 ALSEP station",
        credit: "NSSDCA",
        text: (<>{"Alan Shepard and Edgar Mitchell set up Apollo 14's ALSEP near Antares in the Fra Mauro region on February 5, 1971. Unpacking and connecting instruments was part of the first moonwalk, before they traveled farther to inspect rocks. Once the astronauts left, the station would remain. It added a second long-term observing site to the effort begun by Apollo 12."}{"\n\n"}<a href="https://www.nasa.gov/missions/apollo/apollo-14-mission-details/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://pds.nasa.gov/ds-view/pds/viewContext.jsp?identifier=urn%3Anasa%3Apds%3Acontext%3Ainstrument_host%3Aspacecraft.a14a" target="_blank" rel="noreferrer">NASA source 2</a></>),
      },
      {
        label: "Goals",
        title: "The Work It Was Built to Do",
        imageUrl: "/assets/objects/apollo_14_lm.jpg",
        caption: "Apollo 14 ALSEP station",
        credit: "NSSDCA",
        text: (<>{"A central station and SNAP-27 generator supplied communication and electrical power. A passive seismometer listened for natural events; an active seismic experiment used known signals to probe shallow layers. Charged-particle and suprathermal-ion instruments investigated the space environment, while a cold-cathode gauge and dust detector watched the tenuous surroundings. A nearby laser reflector was a separate experiment, rather than a powered ALSEP instrument."}{"\n\n"}<a href="https://www.nasa.gov/missions/apollo/apollo-14-mission-details/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://pds.nasa.gov/ds-view/pds/viewContext.jsp?identifier=urn%3Anasa%3Apds%3Acontext%3Ainstrument_host%3Aspacecraft.a14a" target="_blank" rel="noreferrer">NASA source 2</a></>),
      },
      {
        label: "Discoveries",
        title: "What Its Journey Made Possible",
        imageUrl: "/assets/objects/apollo_14_lm.jpg",
        caption: "Apollo 14 ALSEP station",
        credit: "NSSDCA",
        text: (<>{"Seismic observations helped reveal both local shallow structure and the Moon's deeper interior when compared with other stations. Particle measurements investigated material from the Sun and changes as the Moon passed through Earth's magnetic environment. Years of observations extended the crew's short visit into a record of events across time. Later researchers could return to those measurements even after the station had stopped sending science."}{"\n\n"}<a href="https://www.nasa.gov/missions/apollo/apollo-14-mission-details/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://pds.nasa.gov/ds-view/pds/viewContext.jsp?identifier=urn%3Anasa%3Apds%3Acontext%3Ainstrument_host%3Aspacecraft.a14a" target="_blank" rel="noreferrer">NASA source 2</a></>),
      },
      {
        label: "Now",
        title: "Where Its Story Ended",
        imageUrl: "/assets/objects/apollo_14_lm.jpg",
        caption: "Apollo 14 ALSEP station",
        credit: "NSSDCA",
        text: (<>{"The hardware remains near the Fra Mauro landing site. The station experienced power-related problems during its later years, and NASA ended the ALSEP program's scientific operations on September 30, 1977. This was a funded-program shutdown, rather than an effort to retrieve the equipment. The separate passive laser reflector was not switched off with the station; it needs no onboard electrical power to reflect light sent from Earth."}{"\n\n"}<a href="https://www.nasa.gov/missions/apollo/apollo-14-mission-details/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://pds.nasa.gov/ds-view/pds/viewContext.jsp?identifier=urn%3Anasa%3Apds%3Acontext%3Ainstrument_host%3Aspacecraft.a14a" target="_blank" rel="noreferrer">NASA source 2</a></>),
      },
    ],
  },
  {
    id: "apollo-15-alsep",
    name: "Apollo 15 ALSEP station",
    place: "Moon",
    coverImageUrl: "/assets/objects/apollo_15_lm.jpg",
    recordIds: ["apollo-15-alsep"],
    sourceUrls: ["https://www.nasa.gov/missions/apollo/apollo-15-mission-details/","https://pds.nasa.gov/ds-view/pds/viewContext.jsp?identifier=urn%3Anasa%3Apds%3Acontext%3Ainstrument_host%3Aspacecraft.a15a"],
    pages: [
      {
        label: "Origin",
        title: "Listening Beside Hadley's Mountains",
        imageUrl: "/assets/objects/apollo_15_lm.jpg",
        caption: "Apollo 15 ALSEP station",
        credit: "NSSDCA",
        text: (<>{"David Scott and James Irwin deployed Apollo 15's ALSEP at Hadley-Apennine in July 1971. While their rover let them move across the landscape, these instruments were meant to stay in one carefully arranged area. The central station began operating on July 31. After Falcon carried the astronauts away, the cables, generator and sensors remained as a continuing observer of their lunar destination."}{"\n\n"}<a href="https://www.nasa.gov/missions/apollo/apollo-15-mission-details/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://pds.nasa.gov/ds-view/pds/viewContext.jsp?identifier=urn%3Anasa%3Apds%3Acontext%3Ainstrument_host%3Aspacecraft.a15a" target="_blank" rel="noreferrer">NASA source 2</a></>),
      },
      {
        label: "Goals",
        title: "The Work It Was Built to Do",
        imageUrl: "/assets/objects/apollo_15_lm.jpg",
        caption: "Apollo 15 ALSEP station",
        credit: "NSSDCA",
        text: (<>{"A SNAP-27 radioisotope generator powered the central station and instruments. The package included a passive seismometer, surface magnetometer, solar-wind spectrometer, suprathermal-ion detector, cold-cathode gauge and dust detector. A heat-flow experiment used probes in drilled holes to measure temperatures below the surface. Together, the instruments investigated lunar structure, internal heat and the environment, while a separate laser reflector supported distance measurements from Earth."}{"\n\n"}<a href="https://www.nasa.gov/missions/apollo/apollo-15-mission-details/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://pds.nasa.gov/ds-view/pds/viewContext.jsp?identifier=urn%3Anasa%3Apds%3Acontext%3Ainstrument_host%3Aspacecraft.a15a" target="_blank" rel="noreferrer">NASA source 2</a></>),
      },
      {
        label: "Discoveries",
        title: "What Its Journey Made Possible",
        imageUrl: "/assets/objects/apollo_15_lm.jpg",
        caption: "Apollo 15 ALSEP station",
        credit: "NSSDCA",
        text: (<>{"The seismic station strengthened the network that compared moonquakes and impacts across Apollo sites. Heat-flow observations helped scientists estimate energy escaping from the lunar interior. Particle and magnetic measurements added to understanding of the interaction between the Moon and its space environment. The results let researchers compare a mountain-front landing area with other sites and continue investigating changes long after the crew's three-day visit."}{"\n\n"}<a href="https://www.nasa.gov/missions/apollo/apollo-15-mission-details/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://pds.nasa.gov/ds-view/pds/viewContext.jsp?identifier=urn%3Anasa%3Apds%3Acontext%3Ainstrument_host%3Aspacecraft.a15a" target="_blank" rel="noreferrer">NASA source 2</a></>),
      },
      {
        label: "Now",
        title: "Where Its Story Ended",
        imageUrl: "/assets/objects/apollo_15_lm.jpg",
        caption: "Apollo 15 ALSEP station",
        credit: "NSSDCA",
        text: (<>{"The station remains near Apollo 15's landing site, deployed separately from Falcon. NASA ended its scientific operations with the other ALSEPs on September 30, 1977, after extended service. The equipment was never designed to return to Earth. Its nearby laser reflector was separate from the powered instruments and was not disabled by the ALSEP shutdown. The measurements already sent home remain part of the lunar science archive."}{"\n\n"}<a href="https://www.nasa.gov/missions/apollo/apollo-15-mission-details/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://pds.nasa.gov/ds-view/pds/viewContext.jsp?identifier=urn%3Anasa%3Apds%3Acontext%3Ainstrument_host%3Aspacecraft.a15a" target="_blank" rel="noreferrer">NASA source 2</a></>),
      },
    ],
  },
  {
    id: "apollo-16-alsep",
    name: "Apollo 16 ALSEP station",
    place: "Moon",
    coverImageUrl: "/assets/objects/apollo_16_lm.jpg",
    recordIds: ["apollo-16-alsep"],
    sourceUrls: ["https://www.nasa.gov/missions/apollo/apollo-16-mission-details/","https://pds.nasa.gov/ds-view/pds/viewContext.jsp?identifier=urn%3Anasa%3Apds%3Acontext%3Ainstrument_host%3Aspacecraft.a16a"],
    pages: [
      {
        label: "Origin",
        title: "A Highland Station With a Broken Cable",
        imageUrl: "/assets/objects/apollo_16_lm.jpg",
        caption: "Apollo 16 ALSEP station",
        credit: "NASA (image via NSSDCA)",
        text: (<>{"On April 21, 1972, John Young and Charles Duke set up Apollo 16's ALSEP near Orion in the Descartes highlands. The central station began operating that day, adding another location to the lunar observing network. A mishap interrupted part of the plan: a cable to the heat-flow experiment was broken during deployment. The rest of the station could still begin its long watch."}{"\n\n"}<a href="https://www.nasa.gov/missions/apollo/apollo-16-mission-details/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://pds.nasa.gov/ds-view/pds/viewContext.jsp?identifier=urn%3Anasa%3Apds%3Acontext%3Ainstrument_host%3Aspacecraft.a16a" target="_blank" rel="noreferrer">NASA source 2</a></>),
      },
      {
        label: "Goals",
        title: "The Work It Was Built to Do",
        imageUrl: "/assets/objects/apollo_16_lm.jpg",
        caption: "Apollo 16 ALSEP station",
        credit: "NASA (image via NSSDCA)",
        text: (<>{"The central station used electricity from a SNAP-27 radioisotope generator and communicated with Earth. A passive seismometer recorded natural vibrations, while an active seismic experiment investigated shallow ground using known signals. A lunar surface magnetometer measured the local field. The intended heat-flow experiment would have measured subsurface temperatures, but its broken cable prevented it from working. The package investigated the highlands from one fixed site."}{"\n\n"}<a href="https://www.nasa.gov/missions/apollo/apollo-16-mission-details/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://pds.nasa.gov/ds-view/pds/viewContext.jsp?identifier=urn%3Anasa%3Apds%3Acontext%3Ainstrument_host%3Aspacecraft.a16a" target="_blank" rel="noreferrer">NASA source 2</a></>),
      },
      {
        label: "Discoveries",
        title: "What Its Journey Made Possible",
        imageUrl: "/assets/objects/apollo_16_lm.jpg",
        caption: "Apollo 16 ALSEP station",
        credit: "NASA (image via NSSDCA)",
        text: (<>{"Its working instruments contributed seismic and magnetic observations from terrain unlike the earlier mare sites. Comparing seismic signals among the Apollo stations helped scientists study the crust and deeper interior, while the active experiment examined near-surface layers. The mission returned no intended heat-flow measurements from this damaged experiment. That missing result is important: carrying an instrument to the Moon did not guarantee every planned question was answered."}{"\n\n"}<a href="https://www.nasa.gov/missions/apollo/apollo-16-mission-details/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://pds.nasa.gov/ds-view/pds/viewContext.jsp?identifier=urn%3Anasa%3Apds%3Acontext%3Ainstrument_host%3Aspacecraft.a16a" target="_blank" rel="noreferrer">NASA source 2</a></>),
      },
      {
        label: "Now",
        title: "Where Its Story Ended",
        imageUrl: "/assets/objects/apollo_16_lm.jpg",
        caption: "Apollo 16 ALSEP station",
        credit: "NASA (image via NSSDCA)",
        text: (<>{"The station remains in the Descartes highlands near Apollo 16's landing site, with the central station roughly a hundred meters from Orion. NASA ended its scientific operations on September 30, 1977, along with the other ALSEPs. Its heat-flow equipment had already been inactive since setup. The station stayed because it was deployed as a permanent surface installation, while the crew and samples returned to Earth."}{"\n\n"}<a href="https://www.nasa.gov/missions/apollo/apollo-16-mission-details/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://pds.nasa.gov/ds-view/pds/viewContext.jsp?identifier=urn%3Anasa%3Apds%3Acontext%3Ainstrument_host%3Aspacecraft.a16a" target="_blank" rel="noreferrer">NASA source 2</a></>),
      },
    ],
  },
  {
    id: "apollo-17-alsep",
    name: "Apollo 17 ALSEP station",
    place: "Moon",
    coverImageUrl: "/assets/objects/apollo_17_lm.jpg",
    recordIds: ["apollo-17-alsep"],
    sourceUrls: ["https://www.nasa.gov/missions/apollo/apollo-17-mission-details/","https://pds.nasa.gov/ds-view/pds/viewContext.jsp?identifier=urn%3Anasa%3Apds%3Acontext%3Ainstrument_host%3Aspacecraft.a17a"],
    pages: [
      {
        label: "Origin",
        title: "The Last Apollo Watch",
        imageUrl: "/assets/objects/apollo_17_lm.jpg",
        caption: "Apollo 17 ALSEP station",
        credit: "NASA (image via NSSDCA)",
        text: (<>{"Eugene Cernan and Harrison Schmitt deployed Apollo 17's ALSEP in Taurus-Littrow during their December 1972 expedition. The central station began operating on December 12. This final Apollo installation carried a different set of instruments from the earlier seismic stations. When the astronauts left on December 14, it was ready to continue investigating a valley that no crew would revisit during the Apollo program."}{"\n\n"}<a href="https://www.nasa.gov/missions/apollo/apollo-17-mission-details/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://pds.nasa.gov/ds-view/pds/viewContext.jsp?identifier=urn%3Anasa%3Apds%3Acontext%3Ainstrument_host%3Aspacecraft.a17a" target="_blank" rel="noreferrer">NASA source 2</a></>),
      },
      {
        label: "Goals",
        title: "The Work It Was Built to Do",
        imageUrl: "/assets/objects/apollo_17_lm.jpg",
        caption: "Apollo 17 ALSEP station",
        credit: "NASA (image via NSSDCA)",
        text: (<>{"A SNAP-27 generator powered the central station. Heat-flow probes investigated subsurface temperatures, and seismic profiling equipment measured waves from planned sources. A mass spectrometer examined the extremely thin lunar atmosphere. An ejecta-and-meteorite experiment watched for particles, and a surface gravimeter was intended for precise gravity measurements. These instruments shared power and communication through the station, extending the expedition beyond the crew's stay."}{"\n\n"}<a href="https://www.nasa.gov/missions/apollo/apollo-17-mission-details/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://pds.nasa.gov/ds-view/pds/viewContext.jsp?identifier=urn%3Anasa%3Apds%3Acontext%3Ainstrument_host%3Aspacecraft.a17a" target="_blank" rel="noreferrer">NASA source 2</a></>),
      },
      {
        label: "Discoveries",
        title: "What Its Journey Made Possible",
        imageUrl: "/assets/objects/apollo_17_lm.jpg",
        caption: "Apollo 17 ALSEP station",
        credit: "NASA (image via NSSDCA)",
        text: (<>{"Heat-flow and seismic observations added information about the valley's thermal properties and shallow structure. The atmospheric experiment investigated gases near the surface. Other experiments faced limits: the gravimeter failed to carry out its intended gravity measurements because of a design error, and the particle instrument's interpretation was complicated by its response. The returned records and documented problems let later researchers assess what each experiment actually measured."}{"\n\n"}<a href="https://www.nasa.gov/missions/apollo/apollo-17-mission-details/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://pds.nasa.gov/ds-view/pds/viewContext.jsp?identifier=urn%3Anasa%3Apds%3Acontext%3Ainstrument_host%3Aspacecraft.a17a" target="_blank" rel="noreferrer">NASA source 2</a></>),
      },
      {
        label: "Now",
        title: "Where Its Story Ended",
        imageUrl: "/assets/objects/apollo_17_lm.jpg",
        caption: "Apollo 17 ALSEP station",
        credit: "NASA (image via NSSDCA)",
        text: (<>{"The station remains near Challenger's descent stage in Taurus-Littrow, deployed separately rather than mounted on the lander. NASA ended its scientific operations on September 30, 1977, after several years of service. The generator and instruments were left in place because no return mission was planned for them. Apollo 17's departing crew did not end the station's work; the later program shutdown did."}{"\n\n"}<a href="https://www.nasa.gov/missions/apollo/apollo-17-mission-details/" target="_blank" rel="noreferrer">NASA source</a>{" · "}<a href="https://pds.nasa.gov/ds-view/pds/viewContext.jsp?identifier=urn%3Anasa%3Apds%3Acontext%3Ainstrument_host%3Aspacecraft.a17a" target="_blank" rel="noreferrer">NASA source 2</a></>),
      },
    ],
  },
  {
    id: "grail-b",
    name: "GRAIL-B (Flow)",
    place: "Moon",
    coverImageUrl: "/assets/objects/grail_2.jpg",
    recordIds: ["grail-b"],
    sourceUrls: ["https://science.nasa.gov/mission/grail/"],
    pages: [
      {
        label: "Origin",
        title: "Flow, the Other Half of a Lunar Laboratory",
        imageUrl: "/assets/objects/grail_2.jpg",
        caption: "GRAIL-B (Flow)",
        credit: "NASA (GRAIL spacecraft illustration; attribution awaiting owner review)",
        text: (<>{"GRAIL-B launched beside GRAIL-A on September 10, 2011. Students later named the pair Flow and Ebb. Flow entered lunar orbit around New Year 2012, after its companion, and the two began following one another around the Moon. Flow's journey was inseparable from its partner's: the changing distance between the pair was the measurement that would reveal the Moon's hidden structure."}{"\n\n"}<a href="https://science.nasa.gov/mission/grail/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Goals",
        title: "The Work It Was Built to Do",
        imageUrl: "/assets/objects/grail_2.jpg",
        caption: "GRAIL-B (Flow)",
        credit: "NASA (GRAIL spacecraft illustration; attribution awaiting owner review)",
        text: (<>{"Its Lunar Gravity Ranging System exchanged precise signals with Ebb to measure small changes in separation. Variations in gravity changed each spacecraft's motion as it crossed different regions. Solar arrays supplied electricity, and MoonKAM let students participate in imaging the surface. Flow was built to work as half of a paired gravity laboratory, investigating the crust, impact basins and the forces that disturb lunar orbits."}{"\n\n"}<a href="https://science.nasa.gov/mission/grail/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Discoveries",
        title: "What Its Journey Made Possible",
        imageUrl: "/assets/objects/grail_2.jpg",
        caption: "GRAIL-B (Flow)",
        credit: "NASA (GRAIL spacecraft illustration; attribution awaiting owner review)",
        text: (<>{"Together, Flow and Ebb produced a detailed lunar gravity map that revealed a heavily fractured crust and buried structures. Their observations helped refine estimates of crustal thickness and explain mass concentrations associated with large basins. These were joint results: neither spacecraft alone could make the same separation measurement. The mission gave researchers a way to study the interior through the motions of two orbiting machines."}{"\n\n"}<a href="https://science.nasa.gov/mission/grail/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
      {
        label: "Now",
        title: "Where Its Story Ended",
        imageUrl: "/assets/objects/grail_2.jpg",
        caption: "GRAIL-B (Flow)",
        credit: "NASA (GRAIL spacecraft illustration; attribution awaiting owner review)",
        text: (<>{"Flow and Ebb completed their extended mission with deliberate impacts near the lunar north pole on December 17, 2012. Flow struck shortly after its companion. Both were destroyed, leaving separate impact sites near the same mountain, in the area named for Sally Ride. Low remaining fuel made continued control uncertain, so their trajectories were planned to end away from historic landing locations."}{"\n\n"}<a href="https://science.nasa.gov/mission/grail/" target="_blank" rel="noreferrer">NASA source</a></>),
      },
    ],
  },
];


class ModelErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

function GLTFModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1.2} />;
}

const PageMedia: React.FC<{ page: BookPage }> = ({ page }) => {
  if (page.modelUrl) {
    return (
      <div className="h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0b0d12]">
        <ModelErrorBoundary>
          <Canvas camera={{ position: [2.5, 1.5, 2.5], fov: 45 }}>
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 5, 5]} intensity={1.3} />
            <Suspense fallback={null}>
              <GLTFModel url={page.modelUrl} />
            </Suspense>
            <OrbitControls autoRotate={!prefersReducedMotion()} autoRotateSpeed={1} enableZoom enablePan={false} />
          </Canvas>
        </ModelErrorBoundary>
      </div>
    );
  }

  if (page.imageUrl) {
    return (
      <figure className="flex h-full w-full min-h-0 flex-col">
        <img
          src={page.imageUrl}
          alt={page.title}
          className="min-h-0 flex-1 w-full rounded-4xl border border-white/10 object-cover object-center"
        />
        <figcaption className="mt-1.5 flex items-center justify-between gap-2 px-1 text-[12px] leading-tight text-[#979899]">
          <span className="truncate">{page.caption}</span>
          <span className="shrink-0">{page.credit}</span>
        </figcaption>
      </figure>
    );
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/15 bg-white/[0.03]">
      <ImageIcon className="h-6 w-6 text-[#6b7280]" />
      <span className="font-mono text-[10px] uppercase tracking-wide text-[#6b7280]">
        Photo or 3D model coming soon
      </span>
    </div>
  );
};

const SPINE_WIDTHS = [44, 52, 40, 60, 48];
const SPINE_HEIGHTS = ['78%', '90%', '70%', '96%', '84%'];
const COVER_WIDTH = 190;

const BookCard: React.FC<{
  book: BotBook;
  onOpen: () => void;
  onEnter: () => void;
  onLeave: () => void;
  index: number;
}> = ({ book, onOpen, onEnter, onLeave, index }) => {
  const [hovered, setHovered] = useState(false);
  const spineWidth = SPINE_WIDTHS[index % SPINE_WIDTHS.length];
  const spineHeight = SPINE_HEIGHTS[index % SPINE_HEIGHTS.length];

  const enter = () => {
    setHovered(true);
    onEnter();
  };
  const leave = () => {
    setHovered(false);
    onLeave();
  };

  return (
    <motion.button
      type="button"
      layout="position"
      onClick={onOpen}
      onHoverStart={enter}
      onHoverEnd={leave}
      onFocus={enter}
      onBlur={leave}
      aria-label={`Open ${book.name} story`}
      initial={{ opacity: 0, y: 40 }}
      animate={{
        opacity: 1,
        y: hovered ? -10 : 0,
        width: hovered ? COVER_WIDTH : spineWidth,
        height: hovered ? '96%' : spineHeight,
        rotateY: 0,
        scale: 1,
        boxShadow: hovered
          ? '0 34px 46px -14px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.12)'
          : '4px 8px 18px rgba(0,0,0,0.6)',
      }}
      transition={{
        opacity: { duration: 0.5, delay: Math.min(index * 0.04, 1) },
        y: { type: 'spring', stiffness: 240, damping: 24 },
        width: { type: 'spring', stiffness: 240, damping: 26 },
        height: { type: 'spring', stiffness: 240, damping: 26 },
        rotateY: { type: 'spring', stiffness: 200, damping: 22 },
        scale: { type: 'spring', stiffness: 200, damping: 22 },
        boxShadow: { duration: 0.3 },
      }}
      style={{ transformOrigin: 'bottom center' }}
      className="relative shrink-0 self-end overflow-hidden rounded-[3px] border border-white/10 bg-neutral-900 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
    >
      {/* Spine view: what you see while the book is resting on the shelf. */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: hovered ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {book.coverImageUrl ? (
          <img src={book.coverImageUrl} alt="" draggable={false} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-neutral-800" />
        )}
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-y-0 left-0 w-[2px] bg-black/50" />
        <div className="absolute inset-y-0 right-0 w-[2px] bg-white/30" />
        <div className="relative flex h-full flex-col items-center justify-between px-1 py-3">
          <span
            className="font-serif text-xs font-medium uppercase tracking-[0.12em] text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)] sm:text-[13px]"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            {book.name}
          </span>
          <span className="h-px w-3 bg-white/80" />
          <span
            className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)] sm:text-[11px]"
            style={{ writingMode: 'vertical-rl' }}
          >
            {book.place}
          </span>
        </div>
      </motion.div>

      {/* Front view: the cover that comes forward on hover. */}
      <motion.div
        className="absolute inset-0 flex flex-col"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3, delay: hovered ? 0.08 : 0 }}
      >
        {book.coverImageUrl ? (
          <img src={book.coverImageUrl} alt={book.name} draggable={false} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-neutral-800" />
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-3 pb-3 pt-14">
          <p className="font-serif text-xl leading-tight text-white">{book.name}</p>
          <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.14em] text-white/75">{book.place}</p>
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/60 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
      </motion.div>
    </motion.button>
  );
};

const BookModal: React.FC<{ book: BotBook; onClose: () => void }> = ({ book, onClose }) => {
  const [pageIndex, setPageIndex] = useState(0);
  const wheelLockRef = useRef(false);
  const pageScrollRef = useRef<HTMLDivElement | null>(null);
  const wheelGestureRef = useRef({ lastAt: -Infinity, direction: 0, usedForReading: false });
  const touchLockRef = useRef(false);
  const touchStartRef = useRef<{ y: number; target: EventTarget | null; canScrollUp: boolean; canScrollDown: boolean } | null>(null);
  const page = book.pages[pageIndex];

  const goTo = (i: number) => {
    setPageIndex(Math.max(0, Math.min(book.pages.length - 1, i)));
  };

  // Lock background scroll while the story is open.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goTo(pageIndex + 1);
      if (e.key === 'ArrowLeft') goTo(pageIndex - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pageIndex, onClose]);

  // True when a scrollable element under the pointer can still move in `dir`.
  // In that case the gesture belongs to that element (a section, slider or the
  // page text), and the page must not change yet.
  const innerCanScroll = (target: EventTarget | null, dir: number) => {
    // Check the whole story even when the pointer is over its header, controls or backdrop.
    const story = pageScrollRef.current;
    if (story && story.scrollHeight > story.clientHeight + 1) {
      const atTop = story.scrollTop <= 1;
      const atBottom = story.scrollHeight - story.clientHeight - story.scrollTop <= 1;
      if (dir > 0 ? !atBottom : !atTop) return true;
    }
    let node = target instanceof Element ? target : null;
    while (node && node !== document.body) {
      const overflowY = window.getComputedStyle(node).overflowY;
      if ((overflowY === 'auto' || overflowY === 'scroll') && node.scrollHeight > node.clientHeight + 1) {
        const atTop = node.scrollTop <= 0;
        const atBottom = Math.ceil(node.scrollTop + node.clientHeight) >= node.scrollHeight - 1;
        if (dir > 0 ? !atBottom : !atTop) return true;
      }
      node = node.parentElement;
    }
    return false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!e.deltaY || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    const dir = Math.sign(e.deltaY);
    const now = performance.now();
    const gesture = wheelGestureRef.current;
    // A pause or a change of direction starts a new gesture. Momentum from
    // scrolling to an edge still belongs to reading, not to turning the page.
    if (now - gesture.lastAt > 220 || gesture.direction !== dir) {
      gesture.usedForReading = false;
    }
    gesture.lastAt = now;
    gesture.direction = dir;
    if (innerCanScroll(e.target, dir)) {
      gesture.usedForReading = true;
      return;
    }
    if (gesture.usedForReading || wheelLockRef.current || Math.abs(e.deltaY) < 20) return;

    gesture.usedForReading = true;
    wheelLockRef.current = true;
    goTo(pageIndex + dir);
    window.setTimeout(() => {
      wheelLockRef.current = false;
    }, 600);
  };

  const SWIPE_THRESHOLD = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    // Capture both edges before the browser scrolls during this swipe.
    touchStartRef.current = {
      y: touch.clientY,
      target: e.target,
      canScrollUp: innerCanScroll(e.target, -1),
      canScrollDown: innerCanScroll(e.target, 1),
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start || touchLockRef.current) return;

    const touch = e.changedTouches[0];
    if (!touch) return;
    const deltaY = start.y - touch.clientY;
    if (Math.abs(deltaY) < SWIPE_THRESHOLD) return;
    const dir = Math.sign(deltaY);
    if (dir > 0 ? start.canScrollDown : start.canScrollUp) return;
    if (innerCanScroll(start.target, dir)) return;

    touchLockRef.current = true;
    goTo(pageIndex + dir);
    window.setTimeout(() => {
      touchLockRef.current = false;
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-3 sm:p-6 xl:px-36"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-[#ece7dc] hover:bg-white/20 sm:right-5 sm:top-5"
        aria-label="Close book"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="absolute left-5 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-3 xl:flex">
        {book.pages.map((p, i) => (
          <button
            type="button"
            key={p.label}
            onClick={() => goTo(i)}
            className={`flex items-center gap-2 font-mono text-xs uppercase tracking-wide transition ${
              i === pageIndex ? 'text-[#c1440e]' : 'text-[#6b7280] hover:text-[#9aa0a6]'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${i === pageIndex ? 'bg-[#c1440e]' : 'bg-[#6b7280]'}`} />
            {p.label}
          </button>
        ))}
      </div>

      <div className="relative flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#12151c] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 sm:px-12 sm:py-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-[#9aa0a6]">{book.place}</p>
            <h2 className="font-serif text-3xl text-[#ece7dc] sm:text-4xl">{book.name}</h2>
          </div>
          <span className="font-mono text-sm text-[#6b7280]">
            {pageIndex + 1} / {book.pages.length}
          </span>
        </div>

        <div className="relative flex min-h-0 flex-1 overflow-hidden" style={{ perspective: 1400 }}>
          <AnimatePresence mode="wait">
            <motion.div
              ref={pageScrollRef}
              key={page.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="grid h-full w-full grid-cols-1 content-start gap-8 overflow-y-auto overscroll-contain p-6 sm:grid-cols-2 sm:gap-12 sm:p-12"
            >
              <div className="h-56 sm:h-auto sm:min-h-[320px]">
                <PageMedia page={page} />
              </div>
              <div>
                <p className="font-mono text-sm uppercase tracking-wider text-[#c1440e]">{page.label}</p>
                <h3 className="mt-1 font-serif text-3xl font-normal leading-tight text-[#ece7dc] sm:text-4xl">
                  {page.title}
                </h3>
                <div className="mt-4 whitespace-pre-line text-base leading-relaxed text-[#ece7dc]/85">
                  {page.text}
                </div>
                {page.bullets && (
                  <ul className="mt-5 space-y-3">
                    {page.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-base text-[#ece7dc]/80">
                        <span className="mt-0.5 text-[#c1440e]">✦</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-4 border-t border-white/10 py-3">
          <button
            type="button"
            onClick={() => goTo(pageIndex - 1)}
            disabled={pageIndex === 0}
            className="flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium text-[#9aa0a6] hover:text-[#ece7dc] disabled:opacity-30"
          >
            <ChevronUp className="h-4 w-4" /> Prev
          </button>
          <span className="hidden font-mono text-xs text-[#6b7280] sm:block">
            scroll the text, then keep scrolling to turn pages
          </span>
          <button
            type="button"
            onClick={() => goTo(pageIndex + 1)}
            disabled={pageIndex === book.pages.length - 1}
            className="flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium text-[#9aa0a6] hover:text-[#ece7dc] disabled:opacity-30"
          >
            Next <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export const AbandonedStories: React.FC = () => {
  const idFromHash = () => {
    const id = decodeURIComponent(window.location.hash.replace(/^#/, ''));
    return BOOKS.some((b) => b.id === id) ? id : null;
  };

  const [openBookId, setOpenBookId] = useState<string | null>(idFromHash);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const openBook = BOOKS.find((b) => b.id === openBookId) ?? null;
  const hoveredBook = BOOKS.find((b) => b.id === hoveredId) ?? null;

  const shelfRef = useRef<HTMLDivElement | null>(null);
  const autoScrollPaused = useRef(false);
  const resumeTimer = useRef<number | null>(null);

  const openById = (id: string | null) => {
    setOpenBookId(id);
    const url = window.location.pathname + window.location.search + (id ? `#${id}` : '');
    window.history.pushState(null, '', url);
  };

  useEffect(() => {
    const sync = () => setOpenBookId(idFromHash());
    window.addEventListener('hashchange', sync);
    window.addEventListener('popstate', sync);
    return () => {
      window.removeEventListener('hashchange', sync);
      window.removeEventListener('popstate', sync);
    };
  }, []);

  const loopRef = useRef(0);
  const openRef = useRef(false);
  openRef.current = !!openBook;

  const pauseAutoScroll = () => {
    if (resumeTimer.current !== null) window.clearTimeout(resumeTimer.current);
    autoScrollPaused.current = true;
  };

  const resumeAutoScroll = () => {
    if (resumeTimer.current !== null) window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => {
      autoScrollPaused.current = false;
      resumeTimer.current = null;
    }, 700);
  };

  const pos = useRef(0);
  const vel = useRef(0);
  const drag = useRef({ active: false, lastX: 0, lastT: 0, moved: 0 });

  useEffect(() => {
    const shelf = shelfRef.current;
    if (!shelf) return;

    const measure = () => {
      const a = shelf.children[0] as HTMLElement | undefined;
      const b = shelf.children[BOOKS.length] as HTMLElement | undefined;
      if (!a || !b) return;
      const first = loopRef.current === 0;
      loopRef.current = b.offsetLeft - a.offsetLeft;
      if (first) pos.current = loopRef.current;
    };
    measure();
    window.addEventListener('resize', measure);

    // Wheel adds momentum instead of jumping.
    const onWheel = (e: WheelEvent) => {
      // Only a genuinely horizontal gesture moves the shelf; vertical wheel is left to the page.
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) * 2 || Math.abs(e.deltaX) < 4) return;
      e.preventDefault();
      vel.current += e.deltaX * 0.0075;
    };
    shelf.addEventListener('wheel', onWheel, { passive: false });

    let frame = 0;
    let last = performance.now();
    let auto = 0;
    const tick = (now: number) => {
      const dt = Math.min(now - last, 40);
      last = now;
      const w = loopRef.current;
      if (w && !drag.current.active) {
        const idle = autoScrollPaused.current || openRef.current || prefersReducedMotion();
        auto += ((idle ? 0 : 0.02) - auto) * Math.min(1, dt * 0.004);
        vel.current *= Math.pow(0.92, dt / 16);
        if (Math.abs(vel.current) < 0.001) vel.current = 0;
        pos.current += (vel.current + auto) * dt;
      }
      if (w) {
        while (pos.current >= 2 * w) pos.current -= w;
        while (pos.current < w) pos.current += w;
        shelf.scrollLeft = pos.current;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', measure);
      shelf.removeEventListener('wheel', onWheel);
    };
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    drag.current = { active: true, lastX: e.clientX, lastT: performance.now(), moved: 0 };
    vel.current = 0;
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.active) return;
    const now = performance.now();
    const dx = d.lastX - e.clientX;
    d.moved += Math.abs(dx);
    if (d.moved > 6 && !e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    pos.current += dx;
    const dt = Math.max(1, now - d.lastT);
    vel.current = vel.current * 0.6 + (dx / dt) * 0.4;
    d.lastX = e.clientX;
    d.lastT = now;
  };
  const endDrag = () => {
    if (performance.now() - drag.current.lastT > 80) vel.current = 0;
    drag.current.active = false;
  };

  return (
    <section className="relative w-full overflow-hidden bg-black py-6 text-white sm:py-8">
      <div className="mx-auto max-w-5xl px-5 text-center sm:px-8">
        <div className="mb-2 font-mono text-xs uppercase tracking-[0.28em] text-white/50">
          Resting, but not forgotten
        </div>
        <h2 className="font-serif text-[40px] font-medium leading-[0.92] tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl">
          Abandoned Stories
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/55 sm:text-base">
          A visual archive of explorers that changed what we know about other worlds. Hover a volume to read its
          title, then click to open its story.
        </p>
      </div>

      {/* Spotlight: shows the full name and tagline of the hovered volume. */}
      <div className="relative z-20 mx-auto mt-6 flex h-[110px] max-w-4xl items-center justify-center px-5 text-center sm:h-[124px]">
        <AnimatePresence mode="wait">
          {hoveredBook ? (
            <motion.div
              key={hoveredBook.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#c1440e] sm:text-sm">
                {hoveredBook.place}
              </p>
              <h3 className="mt-1 font-serif text-4xl text-white sm:text-5xl">{hoveredBook.name}</h3>
              <p className="mt-1 text-base text-white/70 sm:text-lg">{hoveredBook.pages[0].title}</p>
            </motion.div>
          ) : (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-mono text-xs uppercase tracking-[0.2em] text-white/45 sm:text-sm"
            >
              {BOOKS.length} volumes · hover to read the title · click to open
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="relative">
        <div
          ref={shelfRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={(e) => {
            if (drag.current.moved > 6) {
              e.stopPropagation();
              e.preventDefault();
              drag.current.moved = 0;
            }
          }}
          onMouseEnter={pauseAutoScroll}
          onMouseLeave={resumeAutoScroll}
          onTouchStart={pauseAutoScroll}
          onTouchEnd={resumeAutoScroll}
          className="relative z-10 flex h-[300px] w-full items-end gap-2.5 cursor-grab select-none overflow-hidden touch-pan-y active:cursor-grabbing px-6 pb-5 sm:h-[380px] sm:px-10 lg:h-[440px]"
        >
          {[0, 1, 2].flatMap((c) => BOOKS.map((book, index) => ({ book, index, c }))).map(({ book, index, c }) => (
            <BookCard
              key={`${book.id}-${c}`}
              book={book}
              index={index}
              onOpen={() => openById(book.id)}
              onEnter={() => {
                setHoveredId(book.id);
                pauseAutoScroll();
              }}
              onLeave={() => {
                setHoveredId(null);
                resumeAutoScroll();
              }}
            />
          ))}
        </div>

        <div className="pointer-events-none absolute bottom-5 left-0 right-0 z-20 h-px bg-white/15" />
      </div>

      <div className="mx-auto mt-2 flex max-w-5xl items-center justify-between px-5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/35 sm:px-8 sm:text-xs">
        <span>{BOOKS.length} volumes</span>
        <span className="hidden sm:block">drag or swipe</span>
        <span>click to open</span>
      </div>

      <AnimatePresence>
        {openBook && <BookModal book={openBook} onClose={() => openById(null)} />}
      </AnimatePresence>
    </section>
  );
};