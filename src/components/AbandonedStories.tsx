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
  pages: [BookPage, BookPage, BookPage, BookPage]; 
}

const BOOKS: BotBook[] = [
 {
  id: 'sojourner',
  name: 'Sojourner',
  place: 'Mars',
  coverImageUrl: '/assets/objects/4067-pathfinder-PIA01551-modest-web-ae16d9b6.jpg',
  pages: [
    {
      label: 'Origin',
      title: 'A Small Rover, A Big First',
      text: (
        <>
          NASA’s <strong>Sojourner rover</strong> landed on Mars on
          <strong> July 4, 1997</strong>, as part of the Mars Pathfinder
          mission. It became the <strong>first wheeled vehicle</strong> to
          operate on another planet.
        </>
      ),
      imageUrl: '/assets/objects/4067-pathfinder-PIA01551-modest-web-ae16d9b6.jpg',
      caption: "Sojourner rover on Mars",
      credit: "NASA",
    },
    {
      label: 'Goals',
      title: 'Prove a New Way to Explore',
      text: (
        <>
          Sojourner was primarily a <strong>technology demonstration</strong>,
          testing whether a small, low-cost, semi-autonomous rover could
          operate successfully on Mars while being commanded from Earth.
        </>
      ),
      imageUrl: '/assets/objects/mars-pathfinder-7-pathfinder-and-sojourner-on-ma-e3b04115.jpg',
      caption: "Sojourner rover on Mars",
      credit: "NASA",
    },
    {
      label: 'Discoveries',
      title: 'What It Found',
      text: (
        <>
          Sojourner examined Martian rocks and soil around the Pathfinder
          landing site, helping scientists study the planet’s composition and
          geological history.
        </>
      ),
      bullets: [
        <>
          <strong>First rover:</strong> First wheeled vehicle to operate on
          another planet.
        </>,
        <>
          <strong>Rock analysis:</strong> Examined rocks and soil using its
          scientific instruments.
        </>,
        <>
          <strong>Martian terrain:</strong> Demonstrated that a small rover
          could successfully navigate the Martian surface.
        </>,
      ],
      imageUrl: '/assets/objects/8648-PIA01133-full2-d5306e90.jpg',
      caption: "Martian terrain",
      credit: "NASA",
    },
    {
      label: 'Now',
      title: 'Resting at Ares Vallis',
      text: (
        <>
          Sojourner operated for about <strong>83 sols</strong>, far beyond its
          planned seven-sol mission. Contact was lost after the Pathfinder
          lander stopped communicating in September 1997, leaving Sojourner
          on the surface of Mars.
        </>
      ),
      imageUrl: '/assets/objects/mars-pathfinder-11-sojourner-apxs-on-yogi-rock-1-53e0633a.jpg',
      caption: "Resting at Ares Vallis",
      credit: "NASA",
      modelUrl: '', 
    },
  ],
},
{
  id: 'spirit',
  name: 'Spirit',
  place: 'Mars',
  coverImageUrl: '/assets/objects/rover2-1-df042d60.jpg',
  pages: [
    {
      label: 'Origin',
      title: 'One of Mars’ Twin Explorers',
      text: (
        <>
          NASA’s <strong>Spirit rover</strong> launched on June 10, 2003 and
          landed on Mars on January 3, 2004. It was one of NASA’s twin Mars
          Exploration Rovers, sent to investigate the history of water and
          climate on the Red Planet.
        </>
      ),
      imageUrl: '/assets/objects/rover2-1-df042d60.jpg',
      caption: "One of Mars’ Twin Explorers",
      credit: "NASA",
    },
    {
      label: 'Goals',
      title: 'Search for a Watery Past',
      text: (
        <>
          Spirit was sent to study Martian rocks and soil and look for
          <strong> evidence of past water activity</strong>. It explored
          Gusev Crater, a location scientists suspected had once been affected
          by water.
        </>
      ),
      imageUrl: '/assets/objects/mer-bythenumbers-infographic-feb2019-4ce6ccc5.jpg',
      caption: "Spirit & Opportunity",
      credit: "NASA",
    },
    {
      label: 'Discoveries',
      title: 'What It Found',
      text: (
        <>
          Spirit found evidence that ancient Mars had environments involving
          <strong> liquid water and hot springs</strong>, helping scientists
          understand that Mars was once warmer and wetter.
        </>
      ),
      bullets: [
        <>
          <strong>Ancient water:</strong> Found evidence of past water activity
          on Mars.
        </>,
        <>
          <strong>Hot springs:</strong> Found silica-rich deposits associated
          with ancient hot-water environments.
        </>,
        <>
          <strong>Martian journey:</strong> Traveled about 7.7 km across Mars.
        </>,
      ],
      imageUrl: '/assets/objects/outofthisworldrecords-updated-2019-02-b1fd4b22.png',
      caption: "Spirit Won Marathon",
      credit: "NASA",
    },
    {
      label: 'Now',
      title: 'Resting on Mars',
      text: (
        <>
          Spirit became stuck in soft soil in 2009 and could no longer move.
          NASA officially ended efforts to contact the rover on
          <strong> May 25, 2011</strong>, after more than six years of
          exploration.
        </>
      ),
      imageUrl: '/assets/objects/sol016-lander-pan-pia05117-cb29dbe7.jpg',
      caption: "Spirit & Oppy on Mars",
      credit: "NASA",
   
    },
  ],
},
{
  id: 'opportunity',
  name: 'Opportunity',
  place: 'Mars',
  coverImageUrl: '/assets/objects/solar-panels-on-rover-seen-from-above-80d811d3.jpeg',
  pages: [
    {
      label: 'Origin',
      title: 'Spirit’s Twin',
      text: (
        <>
          NASA’s <strong>Opportunity rover</strong> launched on July 7, 2003
          and landed on Mars on January 24, 2004. It was Spirit’s twin and was
          sent to investigate the Martian surface for evidence of past water.
        </>
      ),
      imageUrl: '/assets/objects/solar-panels-on-rover-seen-from-above-80d811d3.jpeg',
      caption: "Spirit’s Twin",
      credit: "NASA",
    },
    {
      label: 'Goals',
      title: 'Read the Rocks',
      text: (
        <>
          Opportunity explored Martian rocks and soil to understand the
          planet’s geological history and determine whether
          <strong> liquid water had once existed</strong> on its surface.
        </>
      ),
      imageUrl: '/assets/objects/rover-tracks-on-a-hillside-with-a-dust-devil-see-1933e031.jpeg',
      caption: "Martian Valley",
      credit: "NASA",
    },
    {
      label: 'Discoveries',
      title: 'What It Found',
      text: (
        <>
          Opportunity discovered geological evidence showing that
          <strong> liquid water once existed on ancient Mars</strong>, helping
          scientists investigate whether Mars could once have supported
          microbial life.
        </>
      ),
      bullets: [
        <>
          <strong>Water:</strong> Found evidence of ancient liquid water.
        </>,
        <>
          <strong>Long journey:</strong> Traveled 45.16 km across Mars.
        </>,
        <>
          <strong>Crater explorer:</strong> Studied more than 100 impact
          craters during its mission.
        </>,
      ],
      imageUrl: '/assets/objects/rover-casting-a-shadow-a2b3b17d.jpeg',
      caption: "Alone on Mars",
      credit: "NASA",
    },
    {
      label: 'Now',
      title: 'Silenced by a Global Storm',
      text: (
        <>
          Opportunity operated for almost <strong>15 years</strong>, far beyond
          its original 90-Martian-day mission. A planet-wide dust storm in
          2018 blocked sunlight from reaching its solar panels, and NASA
          declared the mission complete on February 13, 2019.
        </>
      ),
      imageUrl: '/assets/objects/Mars-Exploration-Rover-Spirit-and-Opportunity-3767b584.png',
      caption: "Oppy 3D Structure",
      credit: "NASA",
      modelUrl: '',
    },
  ],
},
 {
  id: 'pioneer10',
  name: 'Pioneer 10',
  place: 'Deep Space',
  coverImageUrl: '/assets/objects/jupiter-pioneer-10-art-jpg-20ff5cb4.webp',
  pages: [
    {
      label: 'Origin',
      title: 'First Beyond the Asteroid Belt',
      text: (
        <>
          Pioneer 10 launched on <strong>March 2, 1972</strong> as NASA’s first
          mission to the outer planets. It was designed to travel through the
          asteroid belt and make the first close encounter with Jupiter.
        </>
      ),
      imageUrl: '/assets/objects/jupiter-pioneer-10-art-jpg-20ff5cb4.webp',
      caption: "First Beyond the Asteroid Belt",
      credit: "NASA",
    },
    {
      label: 'Goals',
      title: 'Explore Jupiter',
      text: (
        <>
          Pioneer 10 was designed to study interplanetary space beyond Mars
          and perform the first close-up investigation of
          <strong> Jupiter and its magnetosphere</strong>, while testing
          whether spacecraft could safely cross the asteroid belt.
        </>
      ),
      imageUrl: '/assets/objects/arc-1974-ac73-9344orig-3d3ee44b.jpg',
      caption: "Explore Jupiter",
      credit: "NASA",
    },
    {
      label: 'Discoveries',
      title: 'What It Found',
      text: (
        <>
          Pioneer 10 successfully crossed the asteroid belt and became the
          <strong> first spacecraft to fly past Jupiter</strong>, returning
          close-up images and measurements of the giant planet and its
          environment.
        </>
      ),
      bullets: [
        <>
          <strong>First beyond Mars:</strong> First spacecraft to fly beyond
          Mars.
        </>,
        <>
          <strong>Asteroid belt:</strong> First spacecraft to cross the main
          asteroid belt.
        </>,
        <>
          <strong>Jupiter:</strong> First spacecraft to fly past Jupiter.
        </>,
      ],
      imageUrl: '/assets/objects/Pioneer-10-Ganymede-1-6213fc43.jpeg',
      caption: "Photo  of Jupiter taked by Pioneer 10",
      credit: "NASA",
    },
    {
      label: 'Now',
      title: 'Drifting Into Deep Space',
      text: (
        <>
          Pioneer 10 sent its last signal to Earth in
          <strong> January 2003</strong>, more than 30 years after launch. It
          continues on a trajectory carrying it away from the solar system,
          with a small plaque carrying a message from humanity.
        </>
      ),
      imageUrl: '/assets/objects/pioneer-nasa-629e121e.jpg',
      caption: "Drifting Into Deep Space",
      credit: "NASA",
      modelUrl: '', 
    },
  ],
},
 {
  id: 'pioneer11',
  name: 'Pioneer 11',
  place: 'Deep Space',
  coverImageUrl: '/assets/objects/Pioneer11-1600-fb0b5cbf.jpg',
  pages: [
    {
      label: 'Origin',
      title: 'Pioneer 10’s Sister',
      text: (
        <>
          Pioneer 11 launched on <strong>April 6, 1973</strong>. Like Pioneer
          10, it first traveled toward Jupiter, where the planet’s gravity
          helped redirect it toward Saturn.
        </>
      ),
      imageUrl: '/assets/objects/Pioneer11-1600-fb0b5cbf.jpg',
      caption: "Pioneer 10’s Sister",
      credit: "NASA",
    },
    {
      label: 'Goals',
      title: 'Reach the Ringed Planet',
      text: (
        <>
          Pioneer 11 was designed to study Jupiter and then make the first
          close flyby of <strong>Saturn</strong>, investigating its atmosphere,
          rings, magnetic environment, and moons.
        </>
      ),
      imageUrl: '/assets/objects/Saturn-and-its-rings-d4abdfbb.jpeg',
      caption: "Reach the Ringed Planet",
      credit: "NASA",
    },
    {
      label: 'Discoveries',
      title: 'What It Found',
      text: (
        <>
          Pioneer 11 became the <strong>first spacecraft to fly past Saturn</strong>,
          returning close-up observations of the planet and its rings while
          also improving scientists’ understanding of Jupiter.
        </>
      ),
      bullets: [
        <>
          <strong>First Saturn flyby:</strong> First spacecraft to visit Saturn
          up close.
        </>,
        <>
          <strong>Jupiter:</strong> Returned the first images of Jupiter’s
          polar regions.
        </>,
        <>
          <strong>Saturn:</strong> Provided important observations of Saturn’s
          rings and magnetic environment.
        </>,
      ],
      imageUrl: '/assets/objects/Fuzzy-color-image-of-Jupiter-b2622095.jpeg',
      caption: "Photo of Jupiter taken by Pioneer 11",
      credit: "NASA",
    },
    {
      label: 'Now',
      title: 'Lost Contact',
      text: (
        <>
          NASA made its last contact with Pioneer 11 on
          <strong> September 30, 1995</strong>. The spacecraft is now on a
          trajectory that will carry it out of the solar system, still
          carrying its message from humanity.
        </>
      ),
      imageUrl: '/assets/objects/ac73-9344-1280-ad97a78e.jpg',
      caption: "Lost Contact",
      credit: "NASA",
      modelUrl: '', 
    },
  ],
},
  {
  id: 'viking-1',
  name: 'Viking 1',
  place: 'Mars',
  coverImageUrl: '/assets/objects/viking_lander_model.gif',
  pages: [
    {
      label: 'Origin',
      title: 'The First Successful Landing on Mars',
      text: `NASA's Viking 1 made the first truly successful landing on Mars on July 20, 1976. The mission combined an orbiter and a lander to study Mars from space and from its surface.

The Viking orbiters photographed and mapped Mars while the lander studied the atmosphere, soil, weather, and the possibility of life. Together, the two Viking missions returned 52,663 images and mapped about 97 percent of Mars at a resolution of about 300 meters.`,
      imageUrl: '/assets/objects/viking_lander_model.gif',
      caption: "The First Successful Landing on Mars",
      credit: "NSSDC",
    },
    {
      label: 'Goals',
      title: 'Search Mars From Orbit and the Surface',
      text: `The Viking mission was designed to investigate Mars in unprecedented detail and search for evidence of life.

• Main goal: Study the Martian surface and atmosphere and search for signs of life.
• Orbiter: Image and map the Martian surface, study atmospheric water vapor, and perform thermal mapping.
• Lander: Analyze soil, weather, atmosphere, and biological activity.
• Communications: Use the orbiter as a communications relay between the lander and Earth.
• Landing site: Chryse Planitia.`,
      imageUrl: '/assets/objects/Line_drawing_of_Viking_Orbiter-1.jpeg',
      caption: "Search Mars From Orbit and the Surface",
      credit: "NASA",
    },
    {
      label: 'Discoveries',
      title: 'A Complex and Unexpected Mars',
      text: (
        <>
          Viking 1 transformed our understanding of Mars and performed some of
          the first detailed experiments on Martian soil.
        </>
      ),
      bullets: [
        <>
          <strong>Martian Geology & Soil:</strong> Viking found soil rich in
          sulfur and containing significant amounts of silicon, iron, calcium,
          and other elements.
        </>,
        <>
          <strong>The Biology Controversy:</strong> Viking's biological
          experiments produced some results that appeared consistent with
          metabolism, but the absence of detected organic compounds in the
          GCMS experiment made the evidence inconclusive.
        </>,
        <>
          <strong>Atmosphere & Weather:</strong> The lander measured Martian
          temperature, pressure, and winds while studying the composition and
          structure of the atmosphere.
        </>,
        <>
          <strong>Water & Ancient Mars:</strong> Viking observations helped
          reveal evidence of ancient river channels and flooding, showing that
          Mars had experienced a wetter past.
        </>,
      ],
      imageUrl: '/assets/objects/nowv1.jpg',
      caption: "A Complex and Unexpected Mars",
      credit: "NASA",
    },
    {
      label: 'Now',
      title: 'Silent on the Martian Surface',
      text: (
        <>
          <strong>End of Mission:</strong> The Viking 1 orbiter was shut down
          on August 7, 1980 after running out of attitude-control propellant.
          The lander continued operating until November 11, 1982, when a faulty
          command interrupted communications. Attempts to recover contact were
          unsuccessful.
          <br /><br />
          The Viking 1 lander remains at its landing site in Chryse Planitia,
          while the orbiter remains in the history of Mars exploration as one
          of the mission's major scientific successes.
        </>
      ),
      imageUrl: '/assets/objects/viking-1.webp',
      caption: "Launch of Viking 1",
      credit: "NASA",
    },
  ],
},



{
  id: 'mariner2',
  name: 'Mariner 2',
  place: 'Venus',
  coverImageUrl: '/assets/objects/mariner-1-3-artist-impression-1280-90a53565.jpg',
  pages: [
    {
      label: 'Origin',
      title: 'The First Successful Planetary Mission',
      text: `Mariner 2 launched on August 27, 1962, becoming humanity's first successful planetary science mission. It traveled to Venus for the first successful close-up scientific study of another planet.`,
      imageUrl: '/assets/objects/mariner-1-3-artist-impression-1280-90a53565.jpg',
      caption: "The First Successful Planetary Mission",
      credit: "NASA",
    },
    {
      label: 'Goals',
      title: 'A Close Look at Venus',
      text: `Mariner 2 was designed to study Venus during a planetary flyby.\n• Objective: Venus flyby.\n• Power: Solar.\n• Mass: 449 pounds (203.6 kilograms).\n• Instruments: Microwave radiometer, infrared radiometer, fluxgate magnetometer, cosmic dust detector, solar plasma spectrometer, energetic particle detectors, and ionization chamber.\n• Important limitation: Mariner 2 carried no cameras.`,
      imageUrl: '/assets/objects/p-1-90824865-60-years-ago-the-mariner-2-gave-us--ebaab001.jpg',
      caption: "A Close Look at Venus",
      credit: "NASA",
    },
    {
      label: 'Discoveries',
      title: 'A Hot and Hostile Venus',
      text: (
        <>
          Mariner 2's instruments revealed that Venus was far hotter than
          scientists had expected, providing the first close-up scientific data
          about another planet.
        </>
      ),
      bullets: [
        <>
          <strong>Temperature:</strong> Measurements indicated temperatures from
          421°F (216°C) on the dark side to 459°F (237°C) on the dayside.
        </>,
        <>
          <strong>Atmosphere:</strong> The spacecraft detected a dense cloud
          layer extending roughly 35 to 50 miles (56 to 80 kilometers) above
          the surface.
        </>,
        <>
          <strong>Magnetic Field:</strong> Mariner 2 detected no discernable
          planetary magnetic field.
        </>,
        <>
          <strong>Firsts:</strong> It became the first successful planetary
          science mission and the first spacecraft to conduct a successful
          close-up study of another planet.
        </>,
        <>
        Mariner 2 carried no cameras, but returned plenty of unexpected data from its scan of Venus.NASA/JPL-Caltech
        </>
      ],
      imageUrl: '/assets/objects/Two-men-displaying-a-25-foot-printout-of-all-the-3a4541c3.jpeg',
      caption: "A Hot and Hostile Venus",
      credit: "NASA",
    },
    {
      label: 'Now',
      title: 'A Silent Traveler',
      text: (
        <>
          <strong>End of Mission:</strong> NASA maintained contact with Mariner 2
          until January 3, 1963, when the spacecraft was 53.9 million miles
          (86.7 million kilometers) from Earth. It then continued into
          heliocentric orbit.
        </>
      ),
      imageUrl: '/assets/objects/imagesmariner2artists-concept-browse-22f69a3a.jpg',
      caption: "A Silent Traveler",
      credit: "NASA",
    },
  ],
},
{
  id: 'mariner10',
  name: 'Mariner 10',
  place: 'Mercury',
  coverImageUrl: '/assets/objects/mariner10-a3ef4a7a.gif',
  pages: [
    {
      label: 'Origin',
      title: 'The Journey to Mercury',
      text: `Mariner 10 launched on November 3, 1973, becoming the first spacecraft sent to study Mercury. It also became the first mission to explore two planets during a single mission.`,
      imageUrl: '/assets/objects/mariner10-a3ef4a7a.gif',
      caption: "The Journey to Mercury",
      credit: "NASA",
    },
    {
      label: 'Goals',
      title: 'Exploring Mercury and Venus',
      text: `The primary goal of Mariner 10 was to study Mercury's atmosphere, surface, and physical characteristics.\n• Targets: Mercury and Venus.\n• Power: Solar.\n• Mass: 1,100 pounds (502.9 kilograms).\n• Instruments: Two telescopes/cameras, infrared radiometer, ultraviolet spectrometers, magnetometer, charged-particle telescope, and plasma analyzer.\n• Special technique: Venus gravity assist to reach Mercury.`,
      imageUrl: '/assets/objects/Mariner-10-e787934b.jpeg',
      caption: "Exploring Mercury and Venus",
      credit: "NASA",
    },
    {
      label: 'Discoveries',
      title: 'Revealing Mercury',
      text: (
        <>
          Mariner 10 made the first close study of Mercury and revealed a
          heavily cratered world with a weak magnetic field.
        </>
      ),
      bullets: [
        <>
          <strong>Venus:</strong> Mariner 10 returned 4,165 photographs of Venus
          during its February 1974 encounter.
        </>,
        <>
          <strong>Mercury:</strong> The spacecraft discovered a weak magnetic
          field and measured extreme surface temperatures.
        </>,
        <>
          <strong>Three Flybys:</strong> Mariner 10 flew past Mercury three times,
          in March and September 1974 and March 1975.
        </>,
        <>
          <strong>Surface:</strong> More than 2,700 Mercury photographs covered
          nearly half of the planet's surface, including the enormous Caloris
          basin.
        </>,
      ],
      imageUrl: '/assets/objects/earth-and-moon-in-space-39e167a4.jpeg',
      caption: "Revealing Mercury",
      credit: "NASA",
    },
    {
      label: 'Now',
      title: 'The Final Signal',
      text: (
        <>
          <strong>End of Mission:</strong> Mariner 10's last contact came on
          March 24, 1975, after the spacecraft exhausted its supply of gas used
          for attitude control.
        </>
      ),
      imageUrl: '/assets/objects/mariner-10-1280x1280-2-77b331a8.jpg',
      caption: "The Final Signal",
      credit: "NASA",
    },
  ],
},
{
  id: 'apollo15',
  name: 'Apollo 15',
  place: 'Moon',
  coverImageUrl: '/assets/objects/apollo_15_cm.jpg',
  pages: [
    {
      label: 'Origin',
      title: 'A New Kind of Moon Mission',
      text: `Apollo 15 was a lunar landing mission launched on July 26, 1971. It carried Commander David R. Scott, Command Module Pilot Alfred M. Worden, and Lunar Module Pilot James B. Irwin to the Moon.`,
      imageUrl: '/assets/objects/apollo_15_cm.jpg',
      caption: "A New Kind of Moon Mission",
      credit: "NASA",
    },
    {
      label: 'Goals',
      title: 'Exploring Hadley-Apennine',
      text: `Apollo 15 sent Scott and Irwin to explore the Moon's Hadley-Apennine region while Worden remained in lunar orbit in the Command and Service Modules.\n• Mission type: Lunar landing.\n• Landing region: Hadley-Apennine.\n• Crew: David R. Scott, James B. Irwin, Alfred M. Worden.\n• Major capability: First Apollo mission to use a lunar rover.\n• Mission duration: 12 days.`,
      imageUrl: '/assets/objects/as17_147_22526.jpg',
      caption: "Exploring Hadley-Apennine",
      credit: "NASA",
    },
    {
      label: 'Discoveries',
      title: 'Exploring the Moon on Wheels',
      text: (
        <>
          Apollo 15 expanded lunar surface exploration with the
          <strong> Lunar Roving Vehicle</strong>, allowing the astronauts to
          explore the Hadley-Apennine region.
        </>
      ),
      bullets: [
        <>
          <strong>Lunar Rover:</strong> Apollo 15 was the first lunar landing
          mission to use a lunar rover.
        </>,
        <>
          <strong>Hadley-Apennine:</strong> Scott and Irwin explored the region
          on the lunar surface while Worden operated from lunar orbit.
        </>,
        <>
          <strong>Hadley Rille:</strong> NASA's page documents Scott working
          beside the Lunar Roving Vehicle at the edge of Hadley Rille.
        </>,
        <>
          <strong>Mountain Terrain:</strong> Hadley Delta rises approximately
          4,000 meters (13,124 feet) above the surrounding plain.
        </>,
      ],
      imageUrl: '/assets/objects/apollo_15_lm.jpg',
      caption: "Exploring the Moon on Wheels",
      credit: "NASA",
    },
    {
      label: 'Now',
      title: 'A Mission That Came Home',
      text: (
        <>
          <strong>End of Mission:</strong> Apollo 15 ended with splashdown in the
          Pacific Ocean on August 7, 1971, after a 12-day Moon landing mission.
          Unlike the robotic spacecraft in this collection, Apollo 15's crew
          returned to Earth.
        </>
      ),
      imageUrl: '/assets/objects/S71-37963-large-66ce2d79.jpg',
      caption: "A Mission That Came Home",
      credit: "NASA",
    },
  ],
},

{
  id: 'viking-2',
  name: 'Viking 2',
  place: 'Mars',
  coverImageUrl: '/assets/objects/viking-1.webp',
  pages: [
    {
      label: 'Origin',
      title: "Viking 1's Twin on Mars",
      text: `Viking 2 was the second NASA Viking spacecraft to reach Mars. Like Viking 1, it consisted of an orbiter and a lander designed to study Mars from orbit and from the surface.

Viking 2 entered orbit around Mars on August 7, 1976. Its lander touched down safely on September 3, 1976, about 4,000 miles (6,460 kilometers) from the Viking 1 landing site.`,
      imageUrl: '/assets/objects/viking-1.webp',
      caption: "Viking 1's Twin on Mars",
      credit: "NASA",
    },
    {
      label: 'Goals',
      title: 'Study Mars and Search for Life',
      text: `Viking 2 shared the major scientific objectives of the Viking program.

• Main goal: Orbit and land on Mars.
• Study: Martian geology, soil, atmosphere, weather, and surface features.
• Biology: Search for evidence of microbial activity in Martian soil.
• Orbiter: Photograph and map Mars and study atmospheric and thermal properties.
• Lander: Analyze soil samples and measure environmental conditions.
• Communications: Relay information from the lander back to Earth.`,
      imageUrl: '/assets/objects/sagan_viking.jpg',
      caption: "Study Mars and Search for Life",
      credit: "NASA",
    },
    {
      label: 'Discoveries',
      title: 'A Different Face of Mars',
      text: (
        <>
          Viking 2 landed in Utopia Planitia, providing scientists with a
          second location from which to study the Martian environment.
        </>
      ),
      bullets: [
        <>
          <strong>Martian Soil:</strong> Soil samples produced biological
          experiment results similar to Viking 1, but scientists could not
          conclusively determine whether life had ever existed there.
        </>,
        <>
          <strong>Surface Environment:</strong> Viking 2 returned detailed
          images showing a rockier and flatter landscape than Viking 1's
          landing site.
        </>,
        <>
          <strong>Atmosphere & Weather:</strong> The lander measured
          temperature, pressure, and wind while studying the Martian
          atmosphere.
        </>,
        <>
          <strong>Mars From Orbit:</strong> The Viking 2 orbiter contributed to
          the enormous global dataset that mapped about 97 percent of Mars and
          returned tens of thousands of images.
        </>,
      ],
      imageUrl: '/assets/objects/mars.jpg',
      caption: "A Different Face of Mars",
      credit: "NASA",
    },
    {
      label: 'Now',
      title: 'A Long-Quiet Lander',
      text: (
        <>
          <strong>End of Mission:</strong> The Viking 2 orbiter stopped
          operating on July 24, 1978 after a series of leaks. The lander
          continued transmitting scientific data until April 12, 1980.
          <br /><br />
          The Viking 2 lander remains at its Utopia Planitia landing site,
          later named the Gerald Soffen Memorial Station.
        </>
      ),
      imageUrl: '/assets/objects/viking_lander_model.gif',
      caption: "A Long-Quiet Lander",
      credit: "NASA",
    },
  ],
},

{
  id: 'mars-global-surveyor',
  name: 'Mars Global Surveyor',
  place: 'Mars',
  coverImageUrl: '/assets/objects/mgs_768.jpg',
  pages: [
    {
      label: 'Origin',
      title: 'Mapping Mars From Orbit',
      text: `Mars Global Surveyor was launched on November 7, 1996 and entered orbit around Mars on September 12, 1997.

The spacecraft spent nearly a decade orbiting Mars and became one of the most productive Mars orbiters of its era. It studied the planet from the ionosphere down through the atmosphere and surface and even investigated aspects of its interior.`,
      imageUrl: '/assets/objects/mgs_768.jpg',
      caption: "Mapping Mars From Orbit",
      credit: "NASA",
    },
    {
      label: 'Goals',
      title: 'Survey the Entire Planet',
      text: `Mars Global Surveyor was designed as a global mapping and science mission.

• Main goal: Study the entire Martian surface, atmosphere, and interior.
• Map: Determine Mars' global topography, shape, and gravity.
• Geology: Study surface features and geological processes.
• Minerals: Determine the composition and distribution of rocks, minerals, and ice.
• Weather: Monitor atmospheric conditions and seasonal changes.
• Magnetism: Study Mars' magnetic field and ancient crustal magnetic signatures.
• Support: Identify potential landing sites and relay data for other Mars missions.`,
      imageUrl: '/assets/objects/mars2.jpg',
      caption: "Survey the Entire Planet",
      credit: "NASA",
    },
    {
      label: 'Discoveries',
      title: 'Evidence of Water and a Changing Mars',
      text: (
        <>
          Mars Global Surveyor produced major evidence that water had played a
          significant role in Mars' history and may still have influenced the
          surface.
        </>
      ),
      bullets: [
        <>
          <strong>Ancient Water:</strong> MGS observations revealed geological
          features such as ancient channels and sedimentary deposits associated
          with persistent water in Mars' past.
        </>,
        <>
          <strong>Recent Water Activity:</strong> Repeated imaging revealed
          changes in some Martian gullies that suggested water-related activity
          could have occurred relatively recently.
        </>,
        <>
          <strong>Global Topography:</strong> The Mars Orbiter Laser Altimeter
          created an extremely detailed global topographic map of Mars.
        </>,
        <>
          <strong>Magnetic Mars:</strong> MGS discovered strong crustal
          magnetic signatures, providing evidence that ancient Mars once had a
          global magnetic field.
        </>,
      ],
      imageUrl: '/assets/objects/mars-dust-storms-global-pia03170.webp',
      caption: "Evidence of Water and a Changing Mars",
      credit: "NASA",
    },
    {
      label: 'Now',
      title: 'A Decade of Mars Exploration',
      text: (
        <>
          <strong>End of Mission:</strong> Mars Global Surveyor continued
          returning data until November 2006. A series of events associated
          with a computer error, likely involving a battery failure, caused the
          spacecraft to stop communicating.
          <br /><br />
          Before going silent, MGS had transformed Mars exploration by mapping
          the planet in detail and supporting later missions through landing
          site imaging and communications.
        </>
      ),
      imageUrl: '/assets/objects/ZyIw1.jpg',
      caption: "A Decade of Mars Exploration",
      credit: "NASA",
    },
  ],
},

{
  id: 'mars-pathfinder',
  name: 'Mars Pathfinder',
  place: 'Mars',
  coverImageUrl: '/assets/objects/marspath1.gif',
  pages: [
    {
      label: 'Origin',
      title: 'The Mission That Sent Sojourner to Mars',
      text: `Mars Pathfinder launched on December 4, 1996 and successfully landed on Mars on July 4, 1997.

The mission demonstrated a new way to land safely on Mars and delivered Sojourner, the first-ever robotic rover to operate on the Martian surface. Pathfinder landed at Ares Vallis using a parachute and a giant airbag system.`,
      imageUrl: '/assets/objects/marspath1.gif',
      caption: "The Mission That Sent Sojourner to Mars",
      credit: "NASA",
    },
    {
      label: 'Goals',
      title: 'Prove a New Way to Explore Mars',
      text: `Mars Pathfinder was primarily a technology demonstration mission, while also carrying scientific instruments.

• Main goal: Demonstrate a low-cost method for landing on Mars.
• Landing technology: Use parachutes and airbags to survive the final impact.
• Rover: Deploy and operate Sojourner on the Martian surface.
• Science: Study Martian rocks, soil, atmosphere, and weather.
• Engineering: Demonstrate technologies that could support future Mars landers and rovers.`,
      imageUrl: '/assets/objects/marspath3.gif',
      caption: "Prove a New Way to Explore Mars",
      credit: "NASA",
    },
    {
      label: 'Discoveries',
      title: 'Evidence of a Warmer, Wetter Mars',
      text: (
        <>
          Pathfinder showed that Mars had once been very different from the
          cold, dry planet seen at the surface today.
        </>
      ),
      bullets: [
        <>
          <strong>Running Water:</strong> Rounded pebbles and possible
          conglomerate rocks suggested that liquid water once flowed across the
          Ares Vallis region.
        </>,
        <>
          <strong>Ancient Climate:</strong> Geological evidence supported a
          warmer and wetter early Mars with liquid water at the surface.
        </>,
        <>
          <strong>Dust Devils:</strong> Pathfinder observed and measured dust
          devils and studied their role in transporting dust through the
          atmosphere.
        </>,
        <>
          <strong>Atmospheric Science:</strong> The mission measured winds,
          pressure, temperature, and atmospheric behavior while observing water
          ice clouds.
        </>,
      ],
      imageUrl: '/assets/objects/marspsite.gif',
      caption: "Evidence of a Warmer, Wetter Mars",
      credit: "NASA",
    },
    {
      label: 'Now',
      title: 'Resting at Ares Vallis',
      text: (
        <>
          <strong>End of Mission:</strong> Mars Pathfinder's final data
          transmission occurred on September 27, 1997. Communication was
          eventually lost after the spacecraft's main battery was depleted and
          attempts to reestablish contact failed.
          <br /><br />
          Pathfinder and Sojourner remain at the Ares Vallis landing site,
          where they became an important milestone in the development of modern
          Mars rovers.
        </>
      ),
      imageUrl: '/assets/objects/marsrover.gif',
      caption: "Resting at Ares Vallis",
      credit: "NASA",
    },
  ],
},

{
  id: 'phoenix',
  name: 'Phoenix',
  place: 'Mars',
  coverImageUrl: '/assets/objects/phoenix_lander.jpg',
  pages: [
    {
      label: 'Origin',
      title: 'Digging Into the Martian Arctic',
      text: `NASA's Phoenix Mars Lander launched on August 4, 2007 and successfully landed in the northern plains of Mars on May 25, 2008.

Phoenix was the first successful stationary soft-lander on Mars since Viking 2. It landed in Vastitas Borealis, a cold region of the Martian arctic, where scientists expected to find water ice beneath the surface.`,
      imageUrl: '/assets/objects/phoenix_lander.jpg',
      caption: "Digging Into the Martian Arctic",
      credit: "NASA",
    },
    {
      label: 'Goals',
      title: 'Search for Water and Habitability',
      text: `Phoenix was designed to investigate the Martian arctic and study the history of water on Mars.

• Main goal: Search for evidence of past or present microbial habitability.
• Water: Search for water ice beneath the Martian surface.
• Soil: Analyze the chemical and physical properties of Martian soil.
• Chemistry: Search for complex organic molecules and other chemicals.
• Environment: Study the Martian atmosphere and weather near the polar region.
• Technology: Use a robotic arm to dig trenches and deliver samples to onboard laboratories.`,
      imageUrl: '/assets/objects/phoenix_3352.jpg',
      caption: "Search for Water and Habitability",
      credit: "NASA",
    },
    {
      label: 'Discoveries',
      title: 'Water Ice Beneath the Surface',
      text: (
        <>
          Phoenix directly sampled the Martian arctic and confirmed that
          water ice exists beneath the surface.
        </>
      ),
      bullets: [
        <>
          <strong>Water Ice:</strong> Phoenix dug into an ice-rich layer and
          confirmed the presence of water ice in the Martian subsurface.
        </>,
        <>
          <strong>Perchlorates:</strong> The lander detected perchlorate salts
          in Martian soil, chemicals that can affect how scientists interpret
          organic compounds on Mars.
        </>,
        <>
          <strong>Soil Chemistry:</strong> Phoenix found Martian soil to be
          alkaline and identified salts including sodium, magnesium, chloride,
          and potassium.
        </>,
        <>
          <strong>Arctic Weather:</strong> Phoenix returned regular weather
          observations and studied the atmosphere above the northern plains.
        </>,
      ],
      imageUrl: '/assets/objects/phoenix_440.gif',
      caption: "Water Ice Beneath the Surface",
      credit: "NASA",
    },
    {
      label: 'Now',
      title: 'A Lander Frozen in the Arctic',
      text: (
        <>
          <strong>End of Mission:</strong> Phoenix completed its original
          three-month mission and continued operating through the Martian
          summer. Communication was lost as autumn approached and sunlight
          decreased, leaving the spacecraft unable to maintain sufficient power.
          <br /><br />
          The mission officially ended on November 2, 2008. Phoenix remains at
          its landing site in the northern plains of Mars.
        </>
      ),
      imageUrl: '/assets/objects/sunPhoenix.jpg',
      caption: "A Lander Frozen in the Arctic",
      credit: "NASA",
    },
  ],
},
{
  id: 'apollo-15-lrv',
  name: 'Apollo 15 LRV',
  place: 'Moon',
  coverImageUrl: '/assets/objects/as17_147_22526.jpg',
  pages: [
    {
      label: 'Origin',
      title: 'A Rover Built for the Moon',
      text: `The Lunar Roving Vehicle (LRV) was developed by NASA to allow Apollo astronauts to travel much farther across the lunar surface than they could on foot.

Apollo 15 was the first mission to use the LRV. Astronauts David Scott and James Irwin drove it across the Hadley–Apennine region of the Moon in July and August 1971.

The battery-powered rover was lightweight, foldable, and designed specifically for the harsh lunar environment.`,
      imageUrl: '/assets/objects/as17_147_22526.jpg',
      caption: "A Rover Built for the Moon",
      credit: "NASA",
    },
    {
      label: 'Goals',
      title: 'Explore Beyond Walking Distance',
      text: `The LRV was designed to greatly expand the area astronauts could explore during their limited time on the lunar surface.

• Main goal: Transport astronauts and equipment across the lunar surface.
• Exploration: Reach geological features that were too far to visit on foot.
• Science: Carry tools, cameras, and scientific equipment.
• Navigation: Allow astronauts to travel efficiently across uneven lunar terrain.
• Range: Explore several kilometers away from the Lunar Module while remaining within operational limits.`,
      imageUrl: '/assets/objects/as17_146_22367.jpg',
      caption: "Explore Beyond Walking Distance",
      credit: "NASA",
    },
    {
      label: 'Discoveries',
      title: 'A New Way to Explore the Moon',
      text: (
        <>
          Apollo 15's LRV allowed astronauts to investigate the Hadley–Apennine
          region in much greater detail and collect geological samples from
          locations that would otherwise have been difficult to reach.
        </>
      ),
      bullets: [
        <>
          <strong>Hadley Rille:</strong> The rover helped astronauts reach and
          investigate the edge of the enormous Hadley Rille, a deep
          sinuous channel near the landing site.
        </>,
        <>
          <strong>Mountain Geology:</strong> The crew explored the Apennine
          mountains and collected samples that helped scientists study the
          Moon's geological history.
        </>,
        <>
          <strong>Lunar Samples:</strong> Apollo 15 astronauts collected about
          77 kilograms of lunar material, including the famous Genesis Rock.
        </>,
        <>
          <strong>Extended Exploration:</strong> The LRV allowed the astronauts
          to travel much farther from the Lunar Module than previous Apollo
          crews could safely walk.
        </>,
      ],
      imageUrl: '/assets/objects/lrv_deployment_art.jpg',
      caption: "A New Way to Explore the Moon",
      credit: "NASA",
    },
    {
      label: 'Now',
      title: 'Still Parked on the Moon',
      text: (
        <>
          <strong>End of Mission:</strong> After Apollo 15's astronauts
          completed their surface operations, they left the Lunar Roving
          Vehicle at the Hadley–Apennine landing site.
          <br /><br />
          The LRV was never designed to return to Earth. It remains exactly
          where the astronauts parked it in 1971, making it one of the
          intentionally abandoned human-made vehicles on the Moon.
          <br /><br />
          Its location has been photographed from lunar orbit by NASA's Lunar
          Reconnaissance Orbiter.
        </>
      ),
      imageUrl: '/assets/objects/as15_88_11901.jpg',
      caption: "Still Parked on the Moon",
      credit: "NASA",
    },
  ],
},
{
  id: 'insight',
  name: 'InSight',
  place: 'Mars',
  coverImageUrl: '/assets/objects/insight.jpg',
  pages: [
    {
      label: 'Origin',
      title: 'Listening to the Heart of Mars',
      text: `NASA's InSight lander launched on May 5, 2018 and landed on Mars on November 26, 2018.

Unlike rovers designed mainly to explore the surface, InSight was built to study the deep interior of Mars. It investigated the planet's crust, mantle, and core to understand how rocky planets formed and evolved.`,
      imageUrl: '/assets/objects/insight.jpg',
      caption: "Listening to the Heart of Mars",
      credit: "NASA",
    },
    {
      label: 'Goals',
      title: 'Look Beneath the Surface',
      text: `InSight was designed to study the internal structure and evolution of Mars.

• Main goal: Understand the formation and evolution of rocky planets.
• Seismology: Detect and study marsquakes.
• Heat flow: Measure heat escaping from the planet's interior.
• Interior: Determine the structure of Mars from its crust to its core.
• Rotation: Use precision radio tracking to study the planet's internal structure.
• Surface environment: Monitor weather and magnetic conditions around the lander.`,
      imageUrl: '/assets/objects/38686_Mars-InSight-Solar-Panels-Open-pia196641.jpg',
      caption: "Look Beneath the Surface",
      credit: "NASA",
    },
    {
      label: 'Discoveries',
      title: 'The Sounds and Secrets of Mars',
      text: (
        <>
          InSight gave scientists their first detailed measurements of the
          interior of another rocky planet.
        </>
      ),
      bullets: [
        <>
          <strong>Marsquakes:</strong> InSight detected thousands of seismic
          events, revealing that Mars is still geologically active.
        </>,
        <>
          <strong>Planetary Interior:</strong> Seismic waves allowed scientists
          to determine important properties of Mars' crust, mantle, and core.
        </>,
        <>
          <strong>Liquid Core:</strong> InSight's seismic measurements provided
          evidence that Mars has a large liquid iron-rich core.
        </>,
        <>
          <strong>Magnetic Field:</strong> Its magnetometer detected unusually
          strong magnetic fields near the landing site, helping scientists
          investigate Mars' ancient magnetic history.
        </>,
      ],
      imageUrl: '/assets/objects/D000M1436_724026330EDR_F0000_0817M_.jpg',
      caption: "The Sounds and Secrets of Mars",
      credit: "NASA",
    },
    {
      label: 'Now',
      title: 'Silent Beneath the Martian Sky',
      text: (
        <>
          <strong>End of Mission:</strong> InSight's mission ended after its
          solar panels became covered with dust and the spacecraft could no
          longer generate enough electrical power.
          <br /><br />
          NASA received InSight's final communication on December 15, 2022.
          The stationary lander remains on the surface of Mars in Elysium
          Planitia.
        </>
      ),
      imageUrl: '/assets/objects/SsGBxVZMFznSQXkiNeeoyM.jpg',
      caption: "Silent Beneath the Martian Sky",
      credit: "NASA",
    },
  ],
},
{
  id: 'mariner-4',
  name: 'Mariner 4',
  place: 'Mars',
  coverImageUrl: '/assets/objects/mariner04.gif',
  pages: [
    {
      label: 'Origin',
      title: 'The First Close-Up Look at Mars',
      text: `Mariner 4 launched on November 28, 1964 and became the first spacecraft to successfully fly past Mars.

On July 14, 1965, it passed close to Mars and captured the first close-up photographs of another planet. The spacecraft transformed humanity's understanding of Mars.`,
      imageUrl: '/assets/objects/mariner04.gif',
      caption: "The First Close-Up Look at Mars",
      credit: "NASA",
    },
    {
      label: 'Goals',
      title: 'See Mars Up Close',
      text: `Mariner 4 was designed to perform the first close scientific investigation of Mars from space.

• Main goal: Study Mars during a close flyby.
• Imaging: Photograph the Martian surface.
• Atmosphere: Measure atmospheric pressure and density.
• Surface: Investigate the physical appearance of Mars.
• Space environment: Measure radiation, cosmic particles, magnetic fields, and solar plasma.`,
      imageUrl: '/assets/objects/m04_1_2a.jpg',
      caption: "See Mars Up Close",
      credit: "NASA",
    },
    {
      label: 'Discoveries',
      title: 'A Cratered, Unexpected Mars',
      text: (
        <>
          Mariner 4 completely changed the scientific picture of Mars by
          showing that its surface was far more cratered and Moon-like than
          many scientists had expected.
        </>
      ),
      bullets: [
        <>
          <strong>First Close-Up Images:</strong> Mariner 4 transmitted 22
          photographs of Mars, including 21 complete images.
        </>,
        <>
          <strong>Cratered Surface:</strong> The images revealed a heavily
          cratered, desert-like landscape.
        </>,
        <>
          <strong>Thin Atmosphere:</strong> Radio occultation measurements
          provided information about the density of Mars' atmosphere.
        </>,
        <>
          <strong>Planetary Science Milestone:</strong> Its observations
          dramatically changed ideas about the possibility of life on the
          Martian surface.
        </>,
      ],
      imageUrl: '/assets/objects/38754_Mars-Mariner-4-first-tv-image-color-next-to-black-and-white.jpg',
      caption: "A Cratered, Unexpected Mars",
      credit: "NASA",
    },
    {
      label: 'Now',
      title: 'Drifting Through Solar Orbit',
      text: (
        <>
          <strong>End of Mission:</strong> After its Mars flyby, Mariner 4
          continued into heliocentric orbit and continued making measurements
          of the solar environment.
          <br /><br />
          All spacecraft operations ended on December 20, 1967 after more than
          three years in space.
          <br /><br />
          Mariner 4 is now an inactive spacecraft orbiting the Sun.
        </>
      ),
      imageUrl: '/assets/objects/6805_Mariner-4-animation-spacecraft-engine-burn-full2.jpg',
      caption: "Drifting Through Solar Orbit",
      credit: "NASA",
    },
  ],
},

{
  id: 'mariner-6',
  name: 'Mariner 6',
  place: 'Mars',
  coverImageUrl: '/assets/objects/mariner06-07.gif',
  pages: [
    {
      label: 'Origin',
      title: 'A Closer Look at Mars',
      text: `Mariner 6 launched on February 25, 1969 as part of a pair of Mars flyby missions with Mariner 7.

It flew past Mars on July 31, 1969, passing within about 2,132 miles (3,430 kilometers) of the planet's surface.`,
      imageUrl: '/assets/objects/mariner06-07.gif',
      caption: "A Closer Look at Mars",
      credit: "NASA",
    },
    {
      label: 'Goals',
      title: 'Study Mars From a Close Flyby',
      text: `Mariner 6 was designed to investigate Mars at much higher resolution than its predecessor, Mariner 4.

• Main goal: Study the Martian surface and atmosphere.
• Imaging: Photograph Mars during close and distant encounters.
• Atmosphere: Measure atmospheric composition and pressure.
• Surface: Study the geology and physical characteristics of Mars.
• Technology: Provide experience and scientific data for the Mariner 7 encounter.`,
      imageUrl: '/assets/objects/Mariner_6_7_solar_orbit.png',
      caption: "Study Mars From a Close Flyby",
      credit: "NASA",
    },
    {
      label: 'Discoveries',
      title: 'A Heavily Cratered Mars',
      text: (
        <>
          Mariner 6 provided a much broader view of Mars than Mariner 4 and
          revealed important information about its atmosphere and surface.
        </>
      ),
      bullets: [
        <>
          <strong>Surface Images:</strong> The spacecraft returned 24
          near-encounter photographs showing a chaotic and heavily cratered
          landscape.
        </>,
        <>
          <strong>Atmospheric Pressure:</strong> Radio occultation
          measurements helped determine that Mars' atmospheric pressure was
          extremely low compared with Earth's.
        </>,
        <>
          <strong>Polar Region:</strong> Observations helped scientists study
          Mars' southern polar region and seasonal features.
        </>,
        <>
          <strong>Global Context:</strong> Far-encounter images provided much
          broader coverage of Mars than Mariner 4.
        </>,
      ],
      imageUrl: '/assets/objects/jupitrtbym7.png',
      caption: "Mariner 7 far encounter color composite, created using Red, Green and Blue filter images",
      credit: "Wikipedia",
    },
    {
      label: 'Now',
      title: 'A Silent Flyby Pioneer',
      text: (
        <>
          <strong>End of Mission:</strong> After its successful Mars flyby,
          Mariner 6 continued onward into solar orbit.
          <br /><br />
          The spacecraft is no longer operational and remains an inactive
          spacecraft in heliocentric orbit.
        </>
      ),
      imageUrl: '/assets/objects/mariner_1_3_artist_impression-1280.jpg',
      caption: "A Silent Flyby Pioneer",
      credit: "NASA",
    },
  ],
},

{
  id: 'mariner-7',
  name: 'Mariner 7',
  place: 'Mars',
  coverImageUrl: '/assets/objects/Mariner_7_lift-off.jpg',
  pages: [
    {
      label: 'Origin',
      title: 'The Second Eye on Mars',
      text: `Mariner 7 launched on March 27, 1969 and followed its twin, Mariner 6, to Mars.

It reached Mars only five days after Mariner 6 and passed within about 2,130 miles (3,430 kilometers) of the planet on August 5, 1969.`,
      imageUrl: '/assets/objects/Mariner_7_lift-off.jpg',
      caption: "The Second Eye on Mars",
      credit: "NASA",
    },
    {
      label: 'Goals',
      title: 'Build on Mariner 6',
      text: `Mariner 7 had objectives similar to Mariner 6, but its position and timing allowed scientists to investigate additional regions of Mars.

• Main goal: Study Mars during a close flyby.
• Imaging: Photograph the surface at high resolution.
• Atmosphere: Study the Martian atmosphere using radio occultation.
• Surface: Investigate geological features and dark regions.
• Follow-up: Use observations from Mariner 6 to improve the Mariner 7 encounter.`,
      imageUrl: '/assets/objects/Mars_full_disk_approach_view_from_Mariner_7.jpg',
      caption: "Build on Mariner 6",
      credit: "NASA",
    },
    {
      label: 'Discoveries',
      title: 'Mars From the Southern Hemisphere',
      text: (
        <>
          Mariner 7 expanded the observations made by Mariner 6 and captured
          important images of Mars' southern hemisphere and its moon Phobos.
        </>
      ),
      bullets: [
        <>
          <strong>High-Resolution Images:</strong> Mariner 7 recorded 93
          far-encounter and 33 near-encounter images.
        </>,
        <>
          <strong>Hellas Basin:</strong> Images showed that the center of the
          huge Hellas basin appeared remarkably free of craters.
        </>,
        <>
          <strong>Phobos:</strong> Mariner 7 captured an image of Mars'
          irregularly shaped moon, Phobos.
        </>,
        <>
          <strong>Atmospheric Measurements:</strong> Radio occultation
          experiments helped determine the low surface pressure of Mars.
        </>,
      ],
     imageUrl: '/assets/objects/jupitrtbym7.png',
      caption: "Mariner 7 far encounter color composite, created using Red, Green and Blue filter images",
      credit: "Wikipedia",
    },
    {
      label: 'Now',
      title: 'Beyond Mars',
      text: (
        <>
          <strong>End of Mission:</strong> After completing its Mars flyby,
          Mariner 7 continued into heliocentric orbit.
          <br /><br />
          The spacecraft is now inactive and continues its journey around the
          Sun.
        </>
      ),
      imageUrl: '/assets/objects/mariner_1_3_artist_impression-1280.jpg',
      caption: "Beyond Mars",
      credit: "NASA",
    },
  ],
},

{
  id: 'mariner-9',
  name: 'Mariner 9',
  place: 'Mars',
  coverImageUrl: '/assets/objects/mariner09.jpg',
  pages: [
    {
      label: 'Origin',
      title: 'The First Spacecraft to Orbit Another Planet',
      text: `Mariner 9 launched on May 30, 1971 and arrived at Mars on November 13, 1971.

It became the first spacecraft ever to enter orbit around another planet, beating the Soviet Mars 2 spacecraft to Mars by several weeks.`,
      imageUrl: '/assets/objects/mariner09.jpg',
      caption: "The First Spacecraft to Orbit Another Planet",
      credit: "NASA",
    },
    {
      label: 'Goals',
      title: 'Map Mars From Orbit',
      text: `Mariner 9 inherited the combined scientific objectives of the Mariner 8 and Mariner 9 mission after Mariner 8 failed to reach orbit.

• Main goal: Map the Martian surface from orbit.
• Surface: Study geological features and surface changes.
• Atmosphere: Observe atmospheric conditions and seasonal changes.
• Moons: Photograph Phobos and Deimos.
• Mapping: Create a much more complete picture of Mars than previous flyby missions.
• Planetary science: Investigate volcanoes, canyons, polar regions, and other major surface features.`,
      imageUrl: '/assets/objects/mariner-1971.webp',
      caption: "Map Mars From Orbit",
      credit: "NASA",
    },
    {
      label: 'Discoveries',
      title: 'A Completely Different Mars',
      text: (
        <>
          Mariner 9 transformed Mars from a seemingly simple cratered world
          into a planet with enormous volcanoes, canyons, weather systems, and
          complex geological history.
        </>
      ),
      bullets: [
        <>
          <strong>Olympus Mons:</strong> Mariner 9 revealed the enormous
          Martian volcano, later recognized as the largest volcano in the
          solar system.
        </>,
        <>
          <strong>Valles Marineris:</strong> It photographed the enormous
          canyon system that stretches thousands of kilometers across Mars.
        </>,
        <>
          <strong>Phobos & Deimos:</strong> It returned the first detailed
          images of Mars' two moons.
        </>,
        <>
          <strong>Water-Shaped Features:</strong> Mariner 9 revealed channels
          and canyon structures that provided evidence of a much more complex
          and wetter geological history.
        </>,
      ],
      imageUrl: '/assets/objects/Underside+boxart.webp',
      caption: "A Completely Different Mars",
      credit: "NASA",
    },
    {
      label: 'Now',
      title: 'Still Circling Mars',
      text: (
        <>
          <strong>End of Mission:</strong> Mariner 9 continued operating until
          October 1972. Last contact occurred on October 27, 1972, when the
          spacecraft exhausted its attitude-control nitrogen.
          <br /><br />
          Unlike Mariner 4, 6, and 7, Mariner 9 did not continue into solar
          orbit. It remained in orbit around Mars and is expected to eventually
          impact the planet.
        </>
      ),
      imageUrl: '/assets/objects/mariner_1_3_artist_impression-1280.jpg',
      caption: "Still Circling Mars",
      credit: "NASA",
    },
  ],
},
  {
  id: 'pioneer5',
  name: 'Pioneer 5',
  place: 'Solar Orbit',
  coverImageUrl: '/assets/objects/Ready-for-Orbit-0b706a30.jpeg',
  pages: [
    {
      label: 'Origin',
      title: 'A Pioneer Between Earth and Venus',
      text: `Pioneer 5 was launched on March 11, 1960, on a direct solar-orbit trajectory. Originally intended for a Venus encounter, the mission was changed to place the spacecraft into heliocentric orbit between Earth and Venus.`,
      imageUrl: '/assets/objects/Ready-for-Orbit-0b706a30.jpeg',
      caption: "A Pioneer Between Earth and Venus",
      credit: "NASA",
    },
    {
      label: 'Goals',
      title: 'Testing Deep Space Technology',
      text: `The mission was designed to demonstrate deep-space technologies and create the first map of the interplanetary magnetic field.\n• Objective: Demonstrate deep space technologies.\n• Orbit: Heliocentric orbit between Earth and Venus.\n• Instruments: Magnetometer, ionization chamber, Geiger-Mueller tube, micrometeoroid momentum spectrometer, photoelectric cell aspect indicator, and proportional counter telescope.\n• Technology: Pioneer 5 carried Telebit, the first digital telemetry system operationally used on a U.S. spacecraft.`,
      imageUrl: '/assets/objects/Pioneer-5-main-6d90f78c.jpg',
      caption: "Pioneer 5 close up",
      credit: "NASA",
    },
    {
      label: 'Discoveries',
      title: 'Mapping the Space Between Planets',
      text: (
        <>
          Pioneer 5 helped reveal the conditions of interplanetary space and
          confirmed the existence of a <strong>weak interplanetary magnetic field</strong>.
        </>
      ),
      bullets: [
        <>
          <strong>Magnetic Field:</strong> The spacecraft confirmed the existence
          of a previously conjectured weak interplanetary magnetic field.
        </>,
        <>
          <strong>Deep-Space Communication:</strong> Controllers maintained
          contact until June 26, 1960, when Pioneer 5 was 22.6 million miles
          (36.4 million kilometers) from Earth.
        </>,
        <>
          <strong>Telemetry:</strong> Telebit transmitted information at rates
          ranging from 1 to 64 bits per second.
        </>,
      ],
      imageUrl: '/assets/objects/pioneer-5-7de36f84-b7b8-4396-ad04-e3364832dd1-re-73fbd6b5.jpeg',
      caption: "Mapping the Space Between Planets",
      credit: "NASA",
    },
    {
      label: 'Now',
      title: 'Still Circling the Sun',
      text: (
        <>
          <strong>End of Mission:</strong> NASA lost contact with Pioneer 5 on
          June 26, 1960. NASA states that the spacecraft remains a
          <strong> derelict spacecraft circling the Sun</strong>.
        </>
      ),
      imageUrl: '/assets/objects/element115-final-pass-385cd01f.jpg',
      caption: "Still Circling the Sun",
      credit: "NASA",
    },
  ],
},
{
  id: 'lunarorbiter1',
  name: 'Lunar Orbiter 1',
  place: 'Moon',
  coverImageUrl: '/assets/objects/lunar-orbiter-render-93cde28b.jpg',
  pages: [
    {
      label: 'Origin',
      title: 'The First U.S. Orbiter of the Moon',
      text: `Lunar Orbiter 1 was launched on August 10, 1966, as the first U.S. spacecraft to orbit the Moon. It was designed primarily to photograph lunar areas that could serve as safe landing sites for the Surveyor and Apollo missions.`,
      imageUrl: '/assets/objects/lunar-orbiter-render-93cde28b.jpg',
      caption: "The First U.S. Orbiter of the Moon",
      credit: "NASA",
    },
    {
      label: 'Goals',
      title: 'Finding Safe Landing Sites',
      text: `The spacecraft's main purpose was to obtain detailed photographs of potential Apollo landing sites.\n• Primary objective: Lunar orbit.\n• Main instrument: A 150-pound (68-kilogram) Eastman Kodak imaging system.\n• Camera: Wide- and narrow-angle lenses.\n• Additional instruments: Micrometeoroid detectors and radiation dosimeters.\n• Target: Potential Apollo and Surveyor landing areas.`,
      imageUrl: '/assets/objects/lunar-orbiter-1-launch-2-spacecraft-2-0d2d5f38.jpg',
      caption: "Finding Safe Landing Sites",
      credit: "NASA",
    },
    {
      label: 'Discoveries',
      title: 'A New View of the Moon',
      text: (
        <>
          Lunar Orbiter 1 photographed potential landing sites and returned the
          <strong> first picture of Earth taken from the vicinity of the Moon</strong>.
        </>
      ),
      bullets: [
        <>
          <strong>First Orbit:</strong> It became the first U.S. spacecraft to
          orbit the Moon on August 14, 1966.
        </>,
        <>
          <strong>Landing Sites:</strong> It photographed nine potential Apollo
          landing sites and additional areas on the far side of the Moon.
        </>,
        <>
          <strong>Earthrise Image:</strong> On August 23, 1966, it captured the
          first picture of Earth from the vicinity of the Moon.
        </>,
        <>
          <strong>Photography:</strong> NASA's page states that the spacecraft
          produced 413 high- and moderate-resolution photographs covering large
          areas of the lunar surface.
        </>,
      ],
      imageUrl: '/assets/objects/1272-lunar-orbiter-moon-jf-35b484c0.jpg',
      caption: "A New View of the Moon",
      credit: "NASA",
    },
    {
      label: 'Now',
      title: 'Its Final Orbit',
      text: (
        <>
          <strong>End of Mission:</strong> After its condition deteriorated,
          ground controllers commanded Lunar Orbiter 1 to crash onto the Moon
          on October 29, 1966, during its 577th orbit. The impact occurred at
          6°42′ north latitude and 162° east longitude.
        </>
      ),
      imageUrl: '/assets/objects/1-lunar-orbiter-spacecraft-in-moon-orbit-detlev--5ed48b51.jpg',
      caption: "Its Final Orbit",
      credit: "NASA",
    },
  ],
},
{
  id: 'lunarorbiter2',
  name: 'Lunar Orbiter 2',
  place: 'Moon',
  coverImageUrl: '/assets/objects/lunar_orbiter_render.jpg',
  pages: [
    {
      label: 'Origin',
      title: 'Mapping the Moon for Apollo',
      text: `Lunar Orbiter 2 was launched on November 6, 1966, as the second U.S. spacecraft to orbit the Moon. It was designed to photograph potential landing sites for the Apollo and Surveyor missions while also studying the lunar environment.`,
      imageUrl: '/assets/objects/lunar_orbiter_render.jpg',
      caption: "Mapping the Moon for Apollo",
      credit: "NASA",
    },
    {
      label: 'Goals',
      title: 'Searching for Safe Landing Sites',
      text: `The spacecraft's main purpose was to photograph potential Apollo and Surveyor landing areas in greater detail.\n• Primary objective: Lunar orbit and photography.\n• Main instrument: Lunar photographic system with high- and medium-resolution cameras.\n• Additional instruments: Selenodesy experiment, meteoroid detectors, and cesium iodide radiation dosimeters.\n• Target: Potential Apollo and Surveyor landing areas.`,
      imageUrl: 'public/assets/objects/images (3).jpeg',
      caption: "Searching for Safe Landing Sites",
      credit: "NASA",
    },
    {
      label: 'Discoveries',
      title: 'Revealing the Lunar Surface',
      text: (
        <>
          Lunar Orbiter 2 returned detailed photographs of the Moon that helped
          scientists and mission planners study potential landing areas and
          lunar surface features.
        </>
      ),
      bullets: [
        <>
          <strong>Landing Sites:</strong> It photographed potential Apollo and
          Surveyor landing sites in detail.
        </>,
        <>
          <strong>Lunar Terrain:</strong> Its photographs revealed detailed
          views of craters, mountains, and other lunar surface features.
        </>,
        <>
          <strong>Oblique Photography:</strong> It produced striking oblique
          photographs that provided new views of the Moon's topography.
        </>,
        <>
          <strong>Scientific Data:</strong> Its instruments also collected
          information about the Moon's gravitational field, radiation
          environment, and meteoroid impacts.
        </>,
      ],
      imageUrl: '/assets/objects/Disc-copernicus crater.jpg',
      caption: "Disc-copernicus crater on the Lunar Surface",
      credit: "NASA",
    },
    {
      label: 'Now',
      title: 'Its Final Impact',
      text: (
        <>
          <strong>End of Mission:</strong> Lunar Orbiter 2 was eventually
          commanded to impact the Moon on October 11, 1967. NASA records place
          the impact at approximately 3.0° north latitude and 119.1° east
          longitude.
        </>
      ),
      imageUrl: '/assets/objects/Disc-copernicus crater.jpg',
      caption: "Disc-copernicus crater on the Lunar Surface",
      credit: "NASA",
    },
  ],
},

{
  id: 'lunarorbiter3',
  name: 'Lunar Orbiter 3',
  place: 'Moon',
  coverImageUrl: '/assets/objects/lunar_orbiter_render.jpg',
  pages: [
    {
      label: 'Origin',
      title: 'A Closer Look at the Moon',
      text: `Lunar Orbiter 3 was launched on February 5, 1967, as the third spacecraft in NASA's Lunar Orbiter series. Its primary mission was to photograph potential Apollo and Surveyor landing sites and gather additional scientific information about the Moon.`,
      imageUrl: '/assets/objects/lunar_orbiter_render.jpg',
      caption: "A Closer Look at the Moon",
      credit: "NASA",
    },
    {
      label: 'Goals',
      title: 'Finding and Studying Landing Sites',
      text: `Lunar Orbiter 3 combined detailed photography with measurements of the lunar environment.\n• Primary objective: Photograph potential Apollo and Surveyor landing sites.\n• Imaging: High- and medium-resolution lunar photography.\n• Additional instruments: Selenodesy, meteoroid detectors, and cesium iodide dosimeters.\n• Target: Lunar surface features and candidate landing areas.`,
      imageUrl: '/assets/objects/lunar_orbiter_program_14_lo_3_launch.jpg',
      caption: "lunar orbiter program 14 lo 3 launch",
      credit: "NASA",
    },
    {
      label: 'Discoveries',
      title: 'Detailed Views of the Moon',
      text: (
        <>
          Lunar Orbiter 3 returned hundreds of high- and medium-resolution
          photographs, including important views of lunar landing sites and
          features on both the near and far sides of the Moon.
        </>
      ),
      bullets: [
        <>
          <strong>Surveyor 1:</strong> It photographed the Surveyor 1 landing
          site, helping confirm the spacecraft's location on the lunar surface.
        </>,
        <>
          <strong>Apollo 14 Area:</strong> It photographed the future Apollo 14
          landing area, including the region around Cone crater.
        </>,
        <>
          <strong>Far Side:</strong> It returned detailed views of the lunar
          far side, including Tsiolkovsky crater.
        </>,
        <>
          <strong>Photography:</strong> NASA's archive contains Lunar Orbiter 3
          photographic data and experiments covering lunar photography,
          selenodesy, meteoroids, and radiation.
        </>,
      ],
      imageUrl: '/assets/objects/tsiolkovsky crater.jpg',
      caption: "Tsiolkovsky crater of the Moon",
      credit: "NASA",
    },
    {
      label: 'Now',
      title: 'Its Final Orbit',
      text: (
        <>
          <strong>End of Mission:</strong> After completing its mission,
          Lunar Orbiter 3 was used for tracking purposes until it was commanded
          to impact the Moon on October 9, 1967. NASA records place the impact
          at approximately 14.3° north latitude and 92.7° west longitude.
        </>
      ),
      imageUrl: 'public/assets/objects/tsiolkovsky crater.jpg',
      caption: "Its Final Orbit",
      credit: "NASA",
    },
  ],
},

{
  id: 'lunarorbiter4',
  name: 'Lunar Orbiter 4',
  place: 'Moon',
  coverImageUrl: '/assets/objects/lunar_orbiter_render.jpg',
  pages: [
    {
      label: 'Origin',
      title: 'Mapping Almost the Entire Moon',
      text: `Lunar Orbiter 4 was launched on May 4, 1967, as the fourth spacecraft in NASA's Lunar Orbiter program. Unlike the earlier missions, which focused heavily on landing-site selection, Lunar Orbiter 4 was designed primarily to photograph and map the Moon on a much broader scale.`,
      imageUrl: '/assets/objects/lunar_orbiter_render.jpg',
      caption: "Mapping Almost the Entire Moon",
      credit: "NASA",
    },
    {
      label: 'Goals',
      title: 'A Global Survey of the Moon',
      text: `The mission expanded NASA's photographic coverage of the lunar surface.\n• Primary objective: Broad lunar mapping and photography.\n• Imaging: High- and medium-resolution cameras.\n• Coverage: Extensive imaging of the lunar near side and selected far-side regions.\n• Additional instruments: Selenodesy, meteoroid detectors, and radiation dosimeters.`,
      imageUrl: '/assets/objects/lunar_orbiter_program_17_lo_4_launch.jpg',
      caption: "lunar orbiter program 17 lo 4 launch",
      credit: "NASA",
    },
    {
      label: 'Discoveries',
      title: 'A New Map of the Moon',
      text: (
        <>
          Lunar Orbiter 4 greatly expanded knowledge of the Moon's surface,
          photographing large areas that had not previously been mapped in
          comparable detail.
        </>
      ),
      bullets: [
        <>
          <strong>Near-Side Coverage:</strong> It photographed approximately
          99 percent of the Moon's near side.
        </>,
        <>
          <strong>South Pole:</strong> It provided some of the first detailed
          photographic views of the lunar south polar region.
        </>,
        <>
          <strong>Far Side:</strong> It also photographed important areas of
          the previously less-explored lunar far side.
        </>,
        <>
          <strong>Surface Features:</strong> Its images captured features such
          as Mare Orientale, Aristarchus crater, and Vallis Schröteri.
        </>,
      ],
      imageUrl: '/assets/objects/Mare_Orientale.jpg',
      caption: "Mare Orientale of the Moon",
      credit: "NASA",
    },
    {
      label: 'Now',
      title: 'Its Final Descent',
      text: (
        <>
          <strong>End of Mission:</strong> Lunar Orbiter 4 remained in lunar
          orbit after its photographic mission. Its orbit eventually decayed,
          and the spacecraft impacted the Moon in 1967.
        </>
      ),
       imageUrl: '/assets/objects/Mare_Orientale.jpg',
      caption: "Mare Orientale of the Moon",
      credit: "NASA",
    },
  ],
},

{
  id: 'lunarorbiter5',
  name: 'Lunar Orbiter 5',
  place: 'Moon',
  coverImageUrl: '/assets/objects/lunar_orbiter_render.jpg',
  pages: [
    {
      label: 'Origin',
      title: 'The Final Lunar Orbiter',
      text: `Lunar Orbiter 5 was launched on August 1, 1967, as the fifth and final spacecraft of NASA's Lunar Orbiter program. It was designed to complete photographic coverage of the Moon, including previously unphotographed areas of the far side.`,
      imageUrl: '/assets/objects/lunar_orbiter_render.jpg',
      caption: "The Final Lunar Orbiter",
      credit: "NASA",
    },
    {
      label: 'Goals',
      title: 'Completing the Lunar Survey',
      text: `The final Lunar Orbiter mission focused on completing lunar photographic coverage while continuing scientific measurements.\n• Primary objective: Photograph previously uncovered lunar regions.\n• Secondary objective: Additional Apollo and Surveyor landing-site photography.\n• Additional instruments: Selenodesy, meteoroid detectors, and cesium iodide radiation dosimeters.\n• Operational role: Tracking and orbit-determination support.`,
      imageUrl: '/assets/objects/lunar_orbiter_program_20_lo_5_launch.jpg',
      caption: "Completing the Lunar Survey",
      credit: "NASA",
    },
    {
      label: 'Discoveries',
      title: 'Completing the Picture of the Moon',
      text: (
        <>
          Lunar Orbiter 5 completed the photographic work of the Lunar Orbiter
          program and brought the combined coverage of the five spacecraft to
          more than 99 percent of the Moon's surface.
        </>
      ),
      bullets: [
        <>
          <strong>Photographic Coverage:</strong> It returned 633 high-resolution
          and 211 medium-resolution frames, with resolution down to about 2
          meters.
        </>,
        <>
          <strong>Global Survey:</strong> Its images increased the combined
          Lunar Orbiter photographic coverage to better than 99 percent of the
          Moon.
        </>,
        <>
          <strong>Far Side:</strong> It photographed previously uncovered areas
          of the lunar far side.
        </>,
        <>
          <strong>Science:</strong> Its instruments collected data on lunar
          gravity, radiation, and micrometeoroid impacts.
        </>,
      ],
      imageUrl: '/assets/objects/OIP.jpg',
      caption: "First Image of Farside of the Moon",
      credit: "NASA",
    },
    {
      label: 'Now',
      title: 'The Final Impact',
      text: (
        <>
          <strong>End of Mission:</strong> After completing its photographic
          mission, Lunar Orbiter 5 continued to provide tracking and scientific
          data. It was commanded to impact the Moon on January 31, 1968, at
          approximately 2.79° south latitude and 83.04° west longitude.
        </>
      ),
      imageUrl: '/assets/objects/OIP.jpg',
       caption: "First Image of Farside of the Moon",
      credit: "NASA",
    },
  ],
},
{
  id: 'grail-a',
  name: 'GRAIL',
  place: 'Moon',
  coverImageUrl: 'public/assets/objects/grail.jpg',
  pages: [
    {
      label: 'Origin',
      title: 'Listening to the Moon’s Gravity',
      text: `GRAIL-A was launched on September 10, 2011, as one of two spacecraft in NASA's Gravity Recovery and Interior Laboratory mission. Working together with GRAIL-B, it was designed to create a highly accurate map of the Moon's gravitational field and reveal the structure of its interior.`,
      imageUrl: '/assets/objects/grail.jpg',
      caption: "Listening to the Moon’s Gravity",
      credit: "NASA",
    },
    {
      label: 'Goals',
      title: 'Mapping the Moon from Within',
      text: `GRAIL-A and GRAIL-B flew in formation around the Moon and precisely measured the distance between them.\n• Primary objective: Map the Moon's gravity field.\n• Main measurement: Changes in the distance between the two spacecraft.\n• Science target: Lunar interior structure and composition.\n• Additional goal: Improve understanding of the Moon's thermal evolution and geological history.`,
      imageUrl: '/assets/objects/grail.jpg',
      caption: "Mapping the Moon from Within",
      credit: "NASA",
    },
    {
      label: 'Discoveries',
      title: 'Seeing Inside the Moon',
      text: (
        <>
          GRAIL created the highest-resolution gravitational map of any
          planetary body, revealing important details about the Moon's crust
          and interior.
        </>
      ),
      bullets: [
        <>
          <strong>Gravity Map:</strong> The mission produced an extremely
          detailed map of variations in the Moon's gravitational field.
        </>,
        <>
          <strong>Hidden Structures:</strong> Gravity measurements revealed
          buried geological structures, including ancient impact features.
        </>,
        <>
          <strong>Crust:</strong> GRAIL measurements helped scientists
          determine that the Moon's crust is more fractured and less uniform
          than previously thought.
        </>,
        <>
          <strong>Interior:</strong> The data provided new information about
          the Moon's internal structure and thermal evolution.
        </>,
      ],
      imageUrl: '/assets/objects/grail_2.jpg',
      caption: "Seeing Inside the Moon",
      credit: "NASA",
    },
    {
      label: 'Now',
      title: 'Its Final Descent',
      text: (
        <>
          <strong>End of Mission:</strong> GRAIL-A was deliberately directed
          into the Moon after completing its scientific mission. It impacted
          on December 17, 2012, at approximately 75.6088° north latitude and
          26.5940° west longitude.
        </>
      ),
      imageUrl: '/assets/objects/grail_2.jpg',
      caption: "Its Final Descent",
      credit: "NASA",
    },
  ],
},

{
  id: 'ladee',
  name: 'LADEE',
  place: 'Moon',
  coverImageUrl: '/assets/objects/ladee.jpg',
  pages: [
    {
      label: 'Origin',
      title: 'Exploring the Moon’s Thin Atmosphere',
      text: `The Lunar Atmosphere and Dust Environment Explorer, or LADEE, was launched on September 6, 2013. It was designed to study the extremely thin atmosphere surrounding the Moon and investigate the lunar dust environment.`,
      imageUrl: '/assets/objects/ladee.jpg',
      caption: "Exploring the Moon’s Thin Atmosphere",
      credit: "NASA",
    },
    {
      label: 'Goals',
      title: 'Studying the Lunar Atmosphere',
      text: `LADEE investigated the Moon's tenuous atmosphere and the mysterious dust that can exist above its surface.\n• Primary objective: Study the lunar exosphere.\n• Dust investigation: Search for and characterize lunar dust.\n• Instruments: Ultraviolet/visible spectrometer, neutral mass spectrometer, and lunar dust experiment.\n• Technology: Demonstrate high-speed laser communications from lunar orbit.`,
      imageUrl: '/assets/objects/201309060009HQ~large.jpg',
      caption: "Studying the Lunar Atmosphere",
      credit: "NASA",
    },
    {
      label: 'Discoveries',
      title: 'A Closer Look at the Lunar Exosphere',
      text: (
        <>
          LADEE provided detailed measurements of the Moon's extremely thin
          atmosphere and helped scientists understand how material moves
          around the lunar surface.
        </>
      ),
      bullets: [
        <>
          <strong>Exosphere:</strong> LADEE identified and measured several
          components of the Moon's tenuous atmosphere.
        </>,
        <>
          <strong>Dust:</strong> The mission investigated whether dust is
          naturally lofted above the lunar surface.
        </>,
        <>
          <strong>Atmospheric Processes:</strong> Its measurements helped
          scientists understand how the lunar exosphere interacts with the
          surface and space environment.
        </>,
        <>
          <strong>Laser Communications:</strong> LADEE successfully
          demonstrated high-speed laser communication from lunar orbit,
          establishing a new way to transmit large amounts of data from space.
        </>,
      ],
      imageUrl: '/assets/objects/ladee-lunar-orbit.png',
      caption: "A Closer Look at the Lunar Exosphere",
      credit: "NASA",
    },
    {
      label: 'Now',
      title: 'Its Final Impact',
      text: (
        <>
          <strong>End of Mission:</strong> After completing its scientific and
          technology demonstrations, LADEE was deliberately directed to impact
          the Moon. It struck the lunar surface on April 18, 2014, at
          approximately 11.8494° north latitude and 93.2494° west longitude.
        </>
      ),
      imageUrl: '/assets/objects/201309060009HQ~large.jpg',
      caption: "Its Final Impact",
      credit: "NASA",
    },
  ],
},

{
  id: 'mariner5',
  name: 'Mariner 5',
  place: 'Venus',
  coverImageUrl: '/assets/objects/mariner05.gif',
  pages: [
    {
      label: 'Origin',
      title: 'A Close Encounter with Venus',
      text: `Mariner 5 was launched on June 14, 1967, as NASA's fifth Mariner spacecraft. Originally built as a backup for Mariner 4, it was modified for a mission to Venus and became the second successful U.S. spacecraft to visit the planet.`,
      imageUrl: '/assets/objects/mariner05.gif',
      caption: "A Close Encounter with Venus",
      credit: "NASA",
    },
    {
      label: 'Goals',
      title: 'Revealing Venus from Space',
      text: `Mariner 5 was designed to study Venus during a close flyby and investigate the planet's atmosphere, surface environment, and magnetic surroundings.\n• Primary objective: Venus flyby.\n• Atmospheric studies: Measure temperature, pressure, and atmospheric composition.\n• Science: Study Venus's magnetic field, charged particles, and solar wind interaction.\n• Radio occultation: Use changes in radio signals to investigate the Venusian atmosphere.`,
      imageUrl: '/assets/objects/KSC-67PC-0184.jpg',
      caption: "Launch of Mariner 5",
      credit: "NASA",
    },
    {
      label: 'Discoveries',
      title: 'A Hot, Dense World',
      text: (
        <>
          Mariner 5 provided some of the first detailed measurements of Venus's
          atmosphere and environment, revealing a world far hotter and denser
          than Earth.
        </>
      ),
      bullets: [
        <>
          <strong>Atmosphere:</strong> Radio occultation measurements provided
          information about Venus's atmospheric pressure, density, and
          temperature.
        </>,
        <>
          <strong>Temperature:</strong> Measurements confirmed the extremely
          high temperatures near the Venusian surface.
        </>,
        <>
          <strong>Magnetic Environment:</strong> The spacecraft studied
          Venus's magnetic field and its interaction with the solar wind.
        </>,
        <>
          <strong>Radio Science:</strong> The mission demonstrated how radio
          signals passing through an atmosphere can reveal its physical
          properties.
        </>,
      ],
      imageUrl: '/assets/objects/KSC-67PC-0184.jpg',
      caption: "Launch of Mariner 5",
      credit: "NASA",
    },
    {
      label: 'Now',
      title: 'The Mission Continues in Silence',
      text: (
        <>
          <strong>End of Mission:</strong> Mariner 5 completed its Venus
          encounter on October 19, 1967. The spacecraft continued transmitting
          scientific data after the flyby, but contact was eventually lost in
          November 1967. It remains in a heliocentric orbit around the Sun.
        </>
      ),
      imageUrl: '/assets/objects/mariner05.gif',
      caption: "The Mission Continues in Silence",
      credit: "NASA",
    },
  ],
},
{
  id: 'surveyor1',
  name: 'Surveyor 1',
  place: 'Moon',
  coverImageUrl: '/assets/objects/surveyor_beach.jpg',
  pages: [
    {
      label: 'Origin',
      title: 'The First U.S. Soft Landing',
      text: `Surveyor 1 was launched on May 30, 1966, as the first spacecraft in NASA's Surveyor program. It successfully made the first true soft landing by a U.S. spacecraft on the Moon and demonstrated the technology needed for future human lunar landings.`,
      imageUrl: '/assets/objects/surveyor_beach.jpg',
      caption: "The First U.S. Soft Landing",
      credit: "NASA",
    },
    {
      label: 'Goals',
      title: 'Proving the Moon Could Be Landed On',
      text: `Surveyor 1 was designed to test a controlled soft landing and examine the lunar surface at close range.\n• Primary objective: Demonstrate a soft landing on the Moon.\n• Main instrument: Television camera.\n• Surface study: Photograph the lunar terrain and landing site.\n• Engineering goal: Determine whether the lunar surface could safely support future crewed spacecraft.`,
      imageUrl: '/assets/objects/images (5).jpeg',
      caption: "Proving the Moon Could Be Landed On",
      credit: "NASA",
    },
    {
      label: 'Discoveries',
      title: 'The Moon Up Close',
      text: (
        <>
          Surveyor 1 provided the first detailed, close-range views of the
          lunar surface from a U.S. spacecraft sitting on the Moon.
        </>
      ),
      bullets: [
        <>
          <strong>First U.S. Soft Landing:</strong> It successfully landed in
          Oceanus Procellarum on June 2, 1966.
        </>,
        <>
          <strong>Surface Images:</strong> It returned more than 11,000
          photographs, including the first color photographs taken from the
          lunar surface by a U.S. spacecraft.
        </>,
        <>
          <strong>Landing Site:</strong> Its cameras examined the terrain and
          its own footpads to help characterize the lunar soil.
        </>,
        <>
          <strong>Engineering:</strong> The successful mission demonstrated
          that a spacecraft could land, communicate, and operate on the Moon's
          surface.
        </>,
      ],
      imageUrl: 'public/assets/objects/surv1_lro_thumb.png',
      caption: "The Moon Up Close",
      credit: "NASA",
    },
    {
      label: 'Now',
      title: 'Its Final Silence',
      text: (
        <>
          <strong>End of Mission:</strong> Surveyor 1 completed its primary
          mission on July 14, 1966. After surviving its first lunar night,
          it briefly resumed operations, but intermittent contact finally
          ended on January 7, 1967.
        </>
      ),
      imageUrl: '/assets/objects/images (4).jpeg',
      caption: "Its Final Silence",
      credit: "NASA",
    },
  ],
},

{
  id: 'surveyor3',
  name: 'Surveyor 3',
  place: 'Moon',
  coverImageUrl: '/assets/objects/surveyor_nasm.jpg',
  pages: [
    {
      label: 'Origin',
      title: 'Testing the Lunar Soil',
      text: `Surveyor 3 was launched on April 17, 1967, as the third successful Surveyor mission. It expanded the program beyond imaging by carrying a surface sampler capable of digging into and mechanically testing the lunar soil.`,
      imageUrl: '/assets/objects/surveyor_nasm.jpg',
      caption: "Testing the Lunar Soil",
      credit: "NASA",
    },
    {
      label: 'Goals',
      title: 'Digging Into the Moon',
      text: `Surveyor 3 was designed to study the lunar surface in greater detail and test whether lunar soil could support future crewed landings.\n• Primary objective: Soft landing and surface investigation.\n• Main instrument: Television camera.\n• Surface sampler: Dig trenches and perform bearing and impact tests.\n• Target: Oceanus Procellarum and its lunar soil.`,
      imageUrl: '/assets/objects/as12-48-7134_1280.jpg',
      caption: "Digging Into the Moon",
      credit: "NASA",
    },
    {
      label: 'Discoveries',
      title: 'Soil Strong Enough to Land',
      text: (
        <>
          Surveyor 3's experiments showed that the lunar surface had enough
          strength to support the Apollo Lunar Module.
        </>
      ),
      bullets: [
        <>
          <strong>Surface Images:</strong> It transmitted 6,326 television
          pictures of its surroundings.
        </>,
        <>
          <strong>Soil Sampling:</strong> Its scoop dug four trenches and
          performed bearing and impact tests on lunar soil.
        </>,
        <>
          <strong>Soil Properties:</strong> Scientists found the lunar soil
          had a consistency similar to wet sand, with sufficient bearing
          strength to support an Apollo Lunar Module.
        </>,
        <>
          <strong>Apollo 12:</strong> More than two years later, Apollo 12
          astronauts landed nearby and recovered parts of Surveyor 3 for
          examination on Earth.
        </>,
      ],
      imageUrl: '/assets/objects/as12-48-7134_1280.jpg',
      caption: "Soil Strong Enough to Land",
      credit: "NASA",
    },
    {
      label: 'Now',
      title: 'Visited by Apollo 12',
      text: (
        <>
          <strong>End of Mission:</strong> Surveyor 3's last contact with
          Earth was on May 4, 1967, shortly after lunar night began. The
          inactive lander remained on the Moon until Apollo 12 astronauts
          visited it in November 1969 and recovered several components.
        </>
      ),
      imageUrl: '/assets/objects/detail_as12-48-7121_orig.jpg',
      caption: "Visited by Apollo 12",
      credit: "NASA",
    },
  ],
},

{
  id: 'surveyor5',
  name: 'Surveyor 5',
  place: 'Moon',
  coverImageUrl: '/assets/objects/first chemistry set on moon.jpg',
  pages: [
    {
      label: 'Origin',
      title: 'Analyzing the Moon’s Chemistry',
      text: `Surveyor 5 was launched on September 8, 1967, and landed in Mare Tranquillitatis on September 11. It introduced an important new capability to the Surveyor program: direct chemical analysis of lunar material.`,
      imageUrl: '/assets/objects/first chemistry set on moon.jpg',
      caption: "Analyzing the Moon’s Chemistry",
      credit: "NASA",
    },
    {
      label: 'Goals',
      title: 'What Is the Moon Made Of?',
      text: `Surveyor 5 combined surface imaging with instruments designed to study the physical and chemical properties of lunar material.\n• Primary objective: Soft landing and lunar surface investigation.\n• Main instrument: Television camera.\n• Chemical analysis: Alpha-scattering instrument.\n• Additional experiment: Magnet on a footpad to investigate magnetic material in the soil.`,
      imageUrl: '/assets/objects/su5_67_h_1340.gif',
      caption: "Surveyor 5 image of the footpad resting in the lunar soil",
      credit: "NASA",
    },
    {
      label: 'Discoveries',
      title: 'Reading the Lunar Soil',
      text: (
        <>
          Surveyor 5 directly measured the composition and physical properties
          of lunar material in Mare Tranquillitatis.
        </>
      ),
      bullets: [
        <>
          <strong>Chemical Composition:</strong> The alpha-scattering
          instrument found lunar soil containing more than half oxygen along
          with significant amounts of silicon and aluminum.
        </>,
        <>
          <strong>Photography:</strong> Surveyor 5 transmitted a total of
          20,018 pictures of the lunar surface.
        </>,
        <>
          <strong>Magnetic Material:</strong> A magnet attached to a footpad
          helped investigate magnetic material in the lunar soil.
        </>,
        <>
          <strong>Engine Test:</strong> Controllers briefly fired the main
          engine to study the effects of disturbing the lunar surface.
        </>,
      ],
      imageUrl: '/assets/objects/surveyor_beach.jpg',
      caption: "Reading the Lunar Soil",
      credit: "NASA",
    },
    {
      label: 'Now',
      title: 'Its Final Transmission',
      text: (
        <>
          <strong>End of Mission:</strong> Surveyor 5 survived several lunar
          days and continued returning photographs after its initial mission.
          Contact with the spacecraft was finally lost on December 16, 1967.
        </>
      ),
      imageUrl: '/assets/objects/as12-48-7134_1280.jpg',
      caption: "Its Final Transmission",
      credit: "NASA",
    },
  ],
},

{
  id: 'surveyor6',
  name: 'Surveyor 6',
  place: 'Moon',
  coverImageUrl: '/assets/objects/webp.webp',
  pages: [
    {
      label: 'Origin',
      title: 'A Lander That Moved',
      text: `Surveyor 6 was launched on November 7, 1967, and landed in Sinus Medii on November 10. It continued the Surveyor program's work of evaluating lunar landing sites while demonstrating that a spacecraft could reposition itself after landing.`,
      imageUrl: '/assets/objects/webp.webp',
      caption: "A Lander That Moved",
      credit: "NASA",
    },
    {
      label: 'Goals',
      title: 'Studying the Moon from the Ground',
      text: `Surveyor 6 was designed to photograph and analyze the lunar surface while continuing investigations relevant to future Apollo landings.\n• Primary objective: Lunar soft landing and surface investigation.\n• Main instrument: Television camera.\n• Chemical analysis: Alpha-scattering instrument.\n• Additional experiment: Footpad magnet for studying magnetic material.\n• Mobility test: Demonstrate a controlled movement after landing.`,
      imageUrl: '/assets/objects/surveyor_beach.jpg',
      caption: "Studying the Moon from the Ground",
      credit: "NASA",
    },
    {
      label: 'Discoveries',
      title: 'The First Lunar Hop',
      text: (
        <>
          Surveyor 6 became the first spacecraft to launch itself from the
          surface of another world, allowing scientists to compare the terrain
          from two nearby positions.
        </>
      ),
      bullets: [
        <>
          <strong>Surface Chemistry:</strong> Its alpha-scattering instrument
          collected about 30 hours of data on the chemical composition of the
          lunar surface.
        </>,
        <>
          <strong>Nearly 30,000 Images:</strong> It returned approximately
          30,000 photographs of the lunar surface and its surroundings.
        </>,
        <>
          <strong>Lunar Hop:</strong> On November 17, 1967, its thrusters fired
          for 2.5 seconds, lifting the spacecraft about 10 feet and moving it
          roughly 8 feet west.
        </>,
        <>
          <strong>Soil Mechanics:</strong> Cameras examined the original
          landing area and footprints to study the mechanical properties of
          the lunar soil.
        </>,
      ],
      imageUrl: '/assets/objects/images (7).jpeg',
      caption: "The First Lunar Hop",
      credit: "NASA",
    },
    {
      label: 'Now',
      title: 'Its Final Contact',
      text: (
        <>
          <strong>End of Mission:</strong> Surveyor 6 entered hibernation
          during the lunar night after November 26, 1967. Controllers briefly
          regained contact on December 14, but primary operations had already
          ended and the mission was terminated that day.
        </>
      ),
      imageUrl: '/assets/objects/images (7).jpeg',
      caption: "Its Final Contact",
      credit: "NASA",
    },
  ],
},

{
  id: 'surveyor7',
  name: 'Surveyor 7',
  place: 'Moon',
  coverImageUrl: '/assets/objects/surveyor_beach.jpg',
  pages: [
    {
      label: 'Origin',
      title: 'The Scientific Surveyor',
      text: `Surveyor 7 was launched on January 7, 1968, as the final successful Surveyor mission. By this point, earlier Surveyors had already demonstrated that lunar landing sites could support future Apollo missions, so Surveyor 7 was sent to the scientifically different highland region near Tycho crater.`,
      imageUrl: '/assets/objects/surveyor_beach.jpg',
      caption: "The Scientific Surveyor",
      credit: "NASA",
    },
    {
      label: 'Goals',
      title: 'Exploring the Lunar Highlands',
      text: `Surveyor 7 carried the most extensive scientific instrument set of the original Surveyor series.\n• Primary objective: Scientific study of the lunar highlands.\n• Imaging: Television camera and stereoscopic imaging equipment.\n• Surface study: Soil mechanics surface sampler.\n• Chemistry: Alpha-scattering surface analyzer.\n• Additional studies: Magnetic material, dust, and Earth-Moon laser ranging.`,
      imageUrl: '/assets/objects/surveyor_7_landing_site.png',
      caption: "surveyor_7_landing_site",
      credit: "NASA",
    },
    {
      label: 'Discoveries',
      title: 'A Different Side of the Moon',
      text: (
        <>
          Surveyor 7 explored lunar highlands rather than the flatter maria,
          revealing a scientifically different environment near Tycho crater.
        </>
      ),
      bullets: [
        <>
          <strong>Highlands:</strong> It was the only Surveyor to land in the
          lunar highland region, near the outer rim of Tycho crater.
        </>,
        <>
          <strong>Soil Chemistry:</strong> Its alpha-scattering instrument
          analyzed lunar material at several locations and found lower iron
          concentrations than at maria landing sites.
        </>,
        <>
          <strong>Soil Mechanics:</strong> The surface sampler dug trenches
          and performed at least 16 bearing tests.
        </>,
        <>
          <strong>Photography:</strong> It returned approximately 21,274
          photographs during its two lunar days of operation.
        </>,
      ],
      imageUrl: '/assets/objects/surveyortycho.gif',
      caption: "Tycho Crater panaroma",
      credit: "NASA",
    },
    {
      label: 'Now',
      title: 'The Final Surveyor',
      text: (
        <>
          <strong>End of Mission:</strong> Surveyor 7 survived its first lunar
          night and resumed operations during a second lunar day. Operations
          continued until February 21, 1968, marking the end of the original
          Surveyor program.
        </>
      ),
         imageUrl: '/assets/objects/Tycho crater.jpg',
      caption: "Tycho Crater",
      credit: "NASA",
    },
  ],
},
{
  id: 'ranger7',
  name: 'Ranger 7',
  place: 'Moon',
  coverImageUrl: '/assets/objects/ranger.gif',
  pages: [
    {
      label: 'Origin',
      title: 'The First Successful Close-Up',
      text: `Ranger 7 was launched on July 28, 1964, as the first completely successful mission of NASA's Ranger program. It was designed to photograph the Moon at close range during its final descent before deliberately impacting the lunar surface.`,
      imageUrl: '/assets/objects/ranger.gif',
      caption: "The First Successful Close-Up",
      credit: "NASA",
    },
    {
      label: 'Goals',
      title: 'Seeing the Moon Before Impact',
      text: `Ranger 7 was built to obtain high-resolution photographs of the lunar surface immediately before impact.\n• Primary objective: Lunar photography.\n• Imaging system: Six television vidicon cameras.\n• Camera system: Two independent channels containing wide- and narrow-angle cameras.\n• Target: Mare Cognitum and surrounding lunar terrain.\n• Purpose: Improve lunar surface knowledge and support Apollo landing-site planning.`,
      imageUrl: '/assets/objects/ra7_b001.gif',
      caption: "the first picture of the Moon by a U.S. spacecraft, on 31 July 1964",
      credit: "NASA",
    },
    {
      label: 'Discoveries',
      title: 'The Moon in Unprecedented Detail',
      text: (
        <>
          Ranger 7 transformed knowledge of the lunar surface by returning
          thousands of close-up photographs during its final minutes of flight.
        </>
      ),
      bullets: [
        <>
          <strong>First Success:</strong> Ranger 7 became the first U.S.
          spacecraft to successfully transmit close-up photographs of the
          Moon before impact.
        </>,
        <>
          <strong>Photography:</strong> It returned 4,316 photographs during
          its final descent.
        </>,
        <>
          <strong>Resolution:</strong> The final images reached approximately
          0.5-meter resolution.
        </>,
        <>
          <strong>Apollo Planning:</strong> The photographs greatly reduced
          uncertainty about the lunar surface and helped support future
          Apollo landing-site selection.
        </>,
      ],
      imageUrl: '/assets/objects/ranger7pn199.gif',
      caption: "Images by ranger 7 before impact",
      credit: "NASA",
    },
    {
      label: 'Now',
      title: 'Its Final Descent',
      text: (
        <>
          <strong>End of Mission:</strong> Ranger 7 impacted the Moon on
          July 31, 1964, at 13:25:49 UT. NASA's NSSDCA gives the impact
          location as approximately 10.70° south latitude and 339.33° east
          longitude in Mare Cognitum.
        </>
      ),
      imageUrl: '/assets/objects/ra7_b100.gif',
      caption: "Ranger 7 B-camera image of Guericke crater",
      credit: "NASA",
    },
  ],
},

{
  id: 'ranger8',
  name: 'Ranger 8',
  place: 'Moon',
  coverImageUrl: '/assets/objects/ranger.gif',
  pages: [
    {
      label: 'Origin',
      title: 'Searching for Apollo Landing Ground',
      text: `Ranger 8 was launched on February 17, 1965, as the eighth spacecraft in NASA's Ranger program. Following Ranger 7's success, it was sent toward the Moon to photograph another region considered important for future Apollo landings.`,
      imageUrl: '/assets/objects/ranger.gif',
      caption: "Searching for Apollo Landing Ground",
      credit: "NASA",
    },
    {
      label: 'Goals',
      title: 'Photographing Mare Tranquillitatis',
      text: `Ranger 8 was designed to photograph the lunar surface during its final approach and impact.\n• Primary objective: High-resolution lunar photography.\n• Imaging system: Six television vidicon cameras.\n• Camera system: Two independent channels with wide- and narrow-angle cameras.\n• Target: Mare Tranquillitatis, the Sea of Tranquility.\n• Purpose: Characterize terrain relevant to future Apollo landing missions.`,
      imageUrl: '/assets/objects/ra8_a030.gif',
      caption: "Ritter and Sabine craters on the Moon",
      credit: "NASA",
    },
    {
      label: 'Discoveries',
      title: 'A Safer Landing Site',
      text: (
        <>
          Ranger 8 produced thousands of detailed images of Mare Tranquillitatis,
          providing important information about the terrain later chosen for
          the first human landing on the Moon.
        </>
      ),
      bullets: [
        <>
          <strong>Photography:</strong> Ranger 8 returned thousands of
          high-resolution photographs during its final descent.
        </>,
        <>
          <strong>Landing Site:</strong> Its target region was Mare
          Tranquillitatis, an area later selected as the Apollo 11 landing
          site.
        </>,
        <>
          <strong>Surface Study:</strong> The images revealed craters,
          ridges, and other terrain features at increasingly close range.
        </>,
        <>
          <strong>Apollo:</strong> The mission helped demonstrate that the
          lunar maria contained terrain suitable for crewed landing operations.
        </>,
      ],
      imageUrl: '/assets/objects/ra8_b045.gif',
      caption: "Ranger 8 image of the Mare Tranquillitatis (Sea of Tranquillity) ",
      credit: "NASA",
    },
    {
      label: 'Now',
      title: 'Its Final Impact',
      text: (
        <>
          <strong>End of Mission:</strong> Ranger 8 impacted the Moon on
          February 20, 1965, at 09:57:37 UT. NASA's NSSDCA lists the impact
          at approximately 2.71° north latitude and 24.81° east longitude
          in Mare Tranquillitatis.
        </>
      ),
      imageUrl: '/assets/objects/ra8_b001.gif',
      caption: "Ptolemaeus and Alphonsus craters on the Moon",
      credit: "NASA",
    },
  ],
},

{
  id: 'ranger9',
  name: 'Ranger 9',
  place: 'Moon',
  coverImageUrl: '/assets/objects/ranger.gif',
  pages: [
    {
      label: 'Origin',
      title: 'The Final Ranger',
      text: `Ranger 9 was launched on March 21, 1965, as the final spacecraft of NASA's Ranger program. Unlike Rangers 7 and 8, which targeted relatively smooth lunar maria, Ranger 9 was sent to the geologically interesting Alphonsus crater in the lunar highlands.`,
      imageUrl: '/assets/objects/ranger.gif',
      caption: "The Final Ranger",
      credit: "NASA",
    },
    {
      label: 'Goals',
      title: 'Looking Into Alphonsus Crater',
      text: `Ranger 9 was designed to photograph the lunar highlands and investigate the scientifically interesting Alphonsus crater during its final descent.\n• Primary objective: High-resolution lunar photography.\n• Imaging system: Six television cameras.\n• Target: Alphonsus crater.\n• Scientific interest: Investigate a region suspected of possible relatively recent volcanic activity.\n• Public demonstration: Transmit images that could be viewed in near real time on television.`,
      imageUrl: '/assets/objects/ra9_a060.gif',
      caption: " The upraised area at lower center is the central peak of Alphonsus crater floor",
      credit: "NASA",
    },
    {
      label: 'Discoveries',
      title: 'A Final Look at the Lunar Highlands',
      text: (
        <>
          Ranger 9 provided an exceptionally detailed final view of Alphonsus
          crater and became the last successful lunar impact mission of the
          Ranger program.
        </>
      ),
      bullets: [
        <>
          <strong>Photography:</strong> It transmitted 5,814 photographs
          during its final descent.
        </>,
        <>
          <strong>Alphonsus:</strong> The images provided detailed views of
          the crater floor, central peak, and surrounding terrain.
        </>,
        <>
          <strong>Live Television:</strong> Many of its images were converted
          for near-real-time television viewing, allowing millions of people
          to watch the spacecraft approach the Moon.
        </>,
        <>
          <strong>Final Ranger:</strong> Ranger 9 completed the successful
          Ranger series of lunar photographic impact missions.
        </>,
      ],
      imageUrl: '/assets/objects/ra9_b001.gif',
      caption: "Ptolemaeus, Alphonsus, and Albategnius craters on the Moon",
      credit: "NASA",
    },
    {
      label: 'Now',
      title: 'Its Final Image',
      text: (
        <>
          <strong>End of Mission:</strong> Ranger 9 impacted the Moon on
          March 24, 1965, at 14:08:20 UT inside Alphonsus crater. NASA lists
          the impact at approximately 12.91° south latitude and 357.62° east
          longitude.
        </>
      ),
      imageUrl: '/assets/objects/ra9_p012.gif',
      caption: "Final two images taken by Ranger 9 before impact",
      credit: "NASA",
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


const BookCard: React.FC<{ book: BotBook; onOpen: () => void }> = ({ book, onOpen }) => (
  <motion.button
    onClick={onOpen}
    whileHover={{ y: -6 }}
    className="group relative flex aspect-[3/4] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#12151c] text-left shadow-lg transition"
  >
    <div className="relative flex-1 overflow-hidden bg-[#0b0d12]">
      {book.coverImageUrl ? (
        <img
          src={book.coverImageUrl}
          alt={book.name}
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <span className="text-5xl">🛰️</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
    </div>
    <div className="absolute bottom-0 left-0 right-0 p-4">
      <p className="font-mono text-[10px] uppercase tracking-wide text-[#c1440e]">{book.place}</p>
      <h3 className="font-serif text-xl text-[#ece7dc]">{book.name}</h3>
      <p className="mt-1 text-xs text-[#9aa0a6]">Open the book →</p>
    </div>
  </motion.button>
);


const BookModal: React.FC<{ book: BotBook; onClose: () => void }> = ({ book, onClose }) => {
  const [pageIndex, setPageIndex] = useState(0);
  const wheelLockRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);
  const touchLockRef = useRef(false);
  const page = book.pages[pageIndex];

  const goTo = (i: number) => {
    setPageIndex(Math.max(0, Math.min(book.pages.length - 1, i)));
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') goTo(pageIndex + 1);
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') goTo(pageIndex - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pageIndex, onClose]);

  const handleWheel = (e: React.WheelEvent) => {
    if (wheelLockRef.current) return;
    if (Math.abs(e.deltaY) < 20) return;
    wheelLockRef.current = true;
    if (e.deltaY > 0) goTo(pageIndex + 1);
    else goTo(pageIndex - 1);
    setTimeout(() => {
      wheelLockRef.current = false;
    }, 550);
  };

  const SWIPE_THRESHOLD = 45;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchLockRef.current || touchStartYRef.current === null) return;
    const deltaY = touchStartYRef.current - e.changedTouches[0].clientY;
    touchStartYRef.current = null;
    if (Math.abs(deltaY) < SWIPE_THRESHOLD) return;

    touchLockRef.current = true;
    if (deltaY > 0) goTo(pageIndex + 1);
    else goTo(pageIndex - 1);
    setTimeout(() => {
      touchLockRef.current = false;
    }, 550);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <button
        onClick={onClose}
        className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-[#ece7dc] hover:bg-white/20"
        aria-label="Close book"
      >
        <X className="h-5 w-5" />
      </button>

      
      <div className="absolute left-5 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-3 sm:flex">
        {book.pages.map((p, i) => (
          <button
            key={p.label}
            onClick={() => goTo(i)}
            className={`flex items-center gap-2 text-xs font-mono uppercase tracking-wide transition ${
              i === pageIndex ? 'text-[#c1440e]' : 'text-[#6b7280] hover:text-[#9aa0a6]'
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${i === pageIndex ? 'bg-[#c1440e]' : 'bg-[#6b7280]'}`}
            />
            {p.label}
          </button>
        ))}
      </div>

      <div className="relative flex h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#12151c] shadow-2xl">
      
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 sm:px-10">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wide text-[#9aa0a6]">{book.place}</p>
            <h2 className="font-serif text-2xl text-[#ece7dc]">{book.name}</h2>
          </div>
          <span className="font-mono text-xs text-[#6b7280]">
            {pageIndex + 1} / {book.pages.length}
          </span>
        </div>

     
        <div className="relative flex-1 overflow-hidden" style={{ perspective: 1400 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={page.label}
              initial={{ opacity: 0, rotateX: 8, y: 24 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              exit={{ opacity: 0, rotateX: -8, y: -24 }}
              transition={{ duration: 0.45, ease: 'easeInOut' }}
              className="grid h-full grid-cols-1 gap-6 overflow-y-auto p-6 sm:grid-cols-2 sm:p-10"
              style={{ transformOrigin: 'top center' }}
            >
              <div className="min-h-[260px]">
                <PageMedia page={page} />
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-[#c1440e]">{page.label}</p>
                <h3 className="mt-1 font-serif text-3xl font-normal text-[#ece7dc]">{page.title}</h3>
                <p className="mt-4 whitespace-pre-line leading-relaxed text-[#ece7dc]/85">
  {page.text}
</p>
                {page.bullets && (
                  <ul className="mt-4 space-y-2">
                    {page.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#ece7dc]/80">
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
            onClick={() => goTo(pageIndex - 1)}
            disabled={pageIndex === 0}
            className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-[#9aa0a6] disabled:opacity-30 hover:text-[#ece7dc]"
          >
            <ChevronUp className="h-4 w-4" /> Prev
          </button>
          <span className="font-mono text-[10px] text-[#6b7280]">scroll or swipe to turn pages</span>
          <button
            onClick={() => goTo(pageIndex + 1)}
            disabled={pageIndex === book.pages.length - 1}
            className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-[#9aa0a6] disabled:opacity-30 hover:text-[#ece7dc]"
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
  const openBook = BOOKS.find((b) => b.id === openBookId) ?? null;

  // Keep the URL (/stories#opportunity) and the open book in sync, so links and Back work.
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

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 max-w-2xl">
        <h2 className="font-serif text-3xl font-normal text-[#ece7dc] sm:text-4xl">
          Resting, But Not Forgotten
        </h2>
        <p className="mt-2 text-[#9aa0a6]">
          Open a book to read each explorer's story — where it began, what it set out to do,
          what it found, and where it rests today.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
        {BOOKS.map((book) => (
          <BookCard key={book.id} book={book} onOpen={() => openById(book.id)} />
        ))}
      </div>

      <AnimatePresence>
        {openBook && <BookModal book={openBook} onClose={() => openById(null)} />}
      </AnimatePresence>
    </section>
  );
};