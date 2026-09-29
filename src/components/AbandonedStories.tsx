import React, { Suspense, useEffect, useRef, useState,ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ImageIcon, ChevronUp, ChevronDown } from 'lucide-react';


interface BookPage {
  label: string;
  title: string;
  text: ReactNode;
  bullets?: ReactNode[];
  imageUrl: string;
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
  coverImageUrl: 'https://assets.science.nasa.gov/dynamicimage/assets/science/psd/mars/resources/detail_files/4/4067_pathfinder_PIA01551_modest-web.jpg?w=800&h=417&fit=clip&crop=faces%2Cfocalpoint',
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
      imageUrl: 'https://assets.science.nasa.gov/dynamicimage/assets/science/psd/mars/resources/detail_files/4/4067_pathfinder_PIA01551_modest-web.jpg?w=800&h=417&fit=clip&crop=faces%2Cfocalpoint',
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
      imageUrl: 'https://www.nasa.gov/wp-content/uploads/2021/12/mars_pathfinder_7_pathfinder_and_sojourner_on_mars.jpg',
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
      imageUrl: 'https://assets.science.nasa.gov/dynamicimage/assets/science/psd/mars/resources/detail_files/8/8648_PIA01133-full2.jpg?w=288&h=288&fit=clip&crop=faces%2Cfocalpoint',
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
      imageUrl: 'https://www.nasa.gov/wp-content/uploads/2021/12/mars_pathfinder_11_sojourner_apxs_on_yogi_rock_1997.jpg',
      modelUrl: '', 
    },
  ],
},
{
  id: 'spirit',
  name: 'Spirit',
  place: 'Mars',
  coverImageUrl: 'https://assets.science.nasa.gov/dynamicimage/assets/science/psd/solar/2023/07/rover2-1.jpg?w=1280&h=960&fit=crop&crop=faces%2Cfocalpoint',
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
      imageUrl: 'https://assets.science.nasa.gov/dynamicimage/assets/science/psd/solar/2023/07/rover2-1.jpg?w=1280&h=960&fit=crop&crop=faces%2Cfocalpoint',
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
      imageUrl: 'https://science.nasa.gov/wp-content/uploads/2024/03/mer-bythenumbers-infographic-feb2019.jpg?resize=1536,1120',
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
      imageUrl: 'https://science.nasa.gov/wp-content/uploads/2024/03/outofthisworldrecords-updated-2019-02.png?resize=1133,2000',
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
      imageUrl: 'https://science.nasa.gov/wp-content/uploads/2024/03/sol016-lander-pan-pia05117.jpg?resize=1536,1083',
   
    },
  ],
},
{
  id: 'opportunity',
  name: 'Opportunity',
  place: 'Mars',
  coverImageUrl: 'https://assets.science.nasa.gov/dynamicimage/assets/science/psd/solar/internal_resources/3447/solar_panels_on_rover_seen_from_above.jpeg?w=1238&h=968&fit=clip&crop=faces%2Cfocalpoint',
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
      imageUrl: 'https://assets.science.nasa.gov/dynamicimage/assets/science/psd/solar/internal_resources/3447/solar_panels_on_rover_seen_from_above.jpeg?w=1238&h=968&fit=clip&crop=faces%2Cfocalpoint',
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
      imageUrl: 'https://assets.science.nasa.gov/dynamicimage/assets/science/psd/solar/internal_resources/3451/rover_tracks_on_a_hillside_with_a_dust_devil_seen_in_the_distance.jpeg?w=1020&h=1024&fit=clip&crop=faces%2Cfocalpoint',
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
      imageUrl: 'https://assets.science.nasa.gov/dynamicimage/assets/science/psd/solar/internal_resources/3452/rover_casting_a_shadow.jpeg?w=1024&h=1024&fit=clip&crop=faces%2Cfocalpoint',
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
      imageUrl: 'https://assets.science.nasa.gov/dynamicimage/assets/science/cds/3d/resources/model/mars-exploration-rover---spirit-and-opportunity/Mars%20Exploration%20Rover%20-%20Spirit%20and%20Opportunity.png?w=1280&h=720&fit=clip&crop=faces%2Cfocalpoint',
      modelUrl: '',
    },
  ],
},
 {
  id: 'pioneer10',
  name: 'Pioneer 10',
  place: 'Deep Space',
  coverImageUrl: 'https://science.nasa.gov/wp-content/uploads/2023/04/jupiter_pioneer_10_art-jpg.webp?resize=1200,759',
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
      imageUrl: 'https://science.nasa.gov/wp-content/uploads/2023/04/jupiter_pioneer_10_art-jpg.webp?resize=1200,759',
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
      imageUrl: 'https://www.nasa.gov/wp-content/uploads/2023/12/arc-1974-ac73-9344orig.jpg?resize=2000,1333',
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
      imageUrl: 'https://assets.science.nasa.gov/dynamicimage/assets/science/psd/solar/internal_resources/5211/Pioneer_10_Ganymede-1.jpeg?w=800&h=600&fit=clip&crop=faces%2Cfocalpoint',
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
      imageUrl: '/models/Pioneer.glb',
      modelUrl: '', 
    },
  ],
},
 {
  id: 'pioneer11',
  name: 'Pioneer 11',
  place: 'Deep Space',
  coverImageUrl: 'https://assets.science.nasa.gov/dynamicimage/assets/science/psd/solar/2023/07/Pioneer11_1600.jpg?w=1280&h=720&fit=crop&crop=faces%2Cfocalpoint',
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
      imageUrl: 'https://assets.science.nasa.gov/dynamicimage/assets/science/psd/solar/2023/07/Pioneer11_1600.jpg?w=1280&h=720&fit=crop&crop=faces%2Cfocalpoint',
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
      imageUrl: 'https://assets.science.nasa.gov/dynamicimage/assets/science/psd/solar/internal_resources/730/Saturn_and_its_rings.jpeg?w=1200&h=857&fit=crop&crop=faces%2Cfocalpoint',
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
      imageUrl: 'https://assets.science.nasa.gov/dynamicimage/assets/science/psd/solar/internal_resources/2551/Fuzzy_color_image_of_Jupiter.jpeg?w=640&h=530&fit=clip&crop=faces%2Cfocalpoint',
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
      imageUrl: 'https://assets.science.nasa.gov/dynamicimage/assets/science/psd/solar/2023/06/ac73-9344_1280.jpg?w=1280&h=894&fit=clip&crop=faces%2Cfocalpoint',
      modelUrl: '', 
    },
  ],
},
  {
    id: 'juno',
    name: 'Juno',
    place: 'Jupiter',
    coverImageUrl: 'https://science.nasa.gov/wp-content/uploads/2023/08/567922main-junospacecraft0711-1.jpg',
    pages: [
      {
        label: 'Origin',
        title: 'A Solar-Powered Mission to Jupiter',
        text: `The mission’s many discoveries have changed our view of Jupiter’s atmosphere and interior, revolutionizing our understanding of the planet, and of the solar system’s formation.\n  Juno launched in 2011 and arrived at Jupiter in 2016, becoming the first solar-powered spacecraft to operate at such a great distance from the Sun.`,
        imageUrl: 'https://science.nasa.gov/wp-content/uploads/2023/08/567922main-junospacecraft0711-1.jpg',
      },
     {
  label: 'Goals',
  title: 'Look Beneath the Clouds',
  text: ` Because Jupiter preserved much of its original material, studying it helps scientists learn about the early solar system and how planets like Earth formed.\n• Main goal: Discover Jupiter’s origin and evolution.\n• Primary mission: Completed in 2021.\n• Studied: Jupiter’s interior, atmosphere, polar cyclones, auroras, and magnetic field.\n• Extended mission: Explores Jupiter’s faint rings and moons.`,
  imageUrl: 'https://assets.science.nasa.gov/dynamicimage/assets/science/cds/ciencia/sistema-solar/2026/e-pia25630-europa-ice-cutaway-crop.jpg?w=847&h=900&fit=crop&crop=faces%2Cfocalpoint',
},
      {
        label: 'Discoveries',
        title: 'What It Found',
        text: (<>
    Juno revealed Jupiter’s <strong>massive polar cyclones</strong> and mapped
    its <strong>powerful magnetic field</strong>.
  </>),
        bullets: [
  <>
    <strong>Atmosphere & Core:</strong> Belts and zones extend ~3,000 km deep,
    while Jupiter has a large, partially dissolved “fuzzy” core.
  </>,
  <>
    <strong>Storms & Weather:</strong> Juno revealed complex polar cyclones and
    found that the Great Red Spot extends ~320 km deep and is shrinking.
  </>,
  <>
    <strong>Magnetic Field & Moons:</strong> It discovered an extremely powerful
    magnetic field, intense auroras, volcanic activity on Io, and the drifting
    Great Blue Spot.
  </>,
],
        imageUrl: 'https://images-assets.nasa.gov/image/PIA24308/PIA24308~orig.jpg?w=1536&h=541&fit=crop&crop=faces%2Cfocalpoint',
      },
     {
  label: 'Now',
  title: 'A Planned Ending',
  text: (
    <>
      <strong>End of Mission:</strong> Juno continued exploring Jupiter, its
      rings, and moons through September 2025. Its orbit then naturally
      degraded, allowing Jupiter’s gravity to pull the spacecraft into its
      atmosphere. This protected Jupiter’s potentially habitable moons from
      accidental contamination by Earth microbes.
    </>
  ),
  imageUrl: '',
  modelUrl:'/models/Juno.glb',
},
    ],
  },
  {
  id: 'pioneer5',
  name: 'Pioneer 5',
  place: 'Solar Orbit',
  coverImageUrl: 'https://science.nasa.gov/wp-content/uploads/2023/07/pioneer-5.jpg',
  pages: [
    {
      label: 'Origin',
      title: 'A Pioneer Between Earth and Venus',
      text: `Pioneer 5 was launched on March 11, 1960, on a direct solar-orbit trajectory. Originally intended for a Venus encounter, the mission was changed to place the spacecraft into heliocentric orbit between Earth and Venus.`,
      imageUrl: 'https://science.nasa.gov/wp-content/uploads/2023/07/pioneer-5.jpg',
    },
    {
      label: 'Goals',
      title: 'Testing Deep Space Technology',
      text: `The mission was designed to demonstrate deep-space technologies and create the first map of the interplanetary magnetic field.\n• Objective: Demonstrate deep space technologies.\n• Orbit: Heliocentric orbit between Earth and Venus.\n• Instruments: Magnetometer, ionization chamber, Geiger-Mueller tube, micrometeoroid momentum spectrometer, photoelectric cell aspect indicator, and proportional counter telescope.\n• Technology: Pioneer 5 carried Telebit, the first digital telemetry system operationally used on a U.S. spacecraft.`,
      imageUrl: 'https://science.nasa.gov/wp-content/uploads/2023/07/pioneer-5.jpg',
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
      imageUrl: 'https://science.nasa.gov/wp-content/uploads/2023/07/pioneer-5.jpg',
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
      imageUrl: '',
    },
  ],
},
{
  id: 'lunarorbiter1',
  name: 'Lunar Orbiter 1',
  place: 'Moon',
  coverImageUrl: 'https://www.nasa.gov/wp-content/uploads/2023/04/lunar-orbiter-render.jpg?w=1024',
  pages: [
    {
      label: 'Origin',
      title: 'The First U.S. Orbiter of the Moon',
      text: `Lunar Orbiter 1 was launched on August 10, 1966, as the first U.S. spacecraft to orbit the Moon. It was designed primarily to photograph lunar areas that could serve as safe landing sites for the Surveyor and Apollo missions.`,
      imageUrl: 'https://www.nasa.gov/wp-content/uploads/2023/04/lunar-orbiter-render.jpg?w=1024',
    },
    {
      label: 'Goals',
      title: 'Finding Safe Landing Sites',
      text: `The spacecraft's main purpose was to obtain detailed photographs of potential Apollo landing sites.\n• Primary objective: Lunar orbit.\n• Main instrument: A 150-pound (68-kilogram) Eastman Kodak imaging system.\n• Camera: Wide- and narrow-angle lenses.\n• Additional instruments: Micrometeoroid detectors and radiation dosimeters.\n• Target: Potential Apollo and Surveyor landing areas.`,
      imageUrl: 'https://www.nasa.gov/wp-content/uploads/2023/04/lunar-orbiter-render.jpg?w=1024',
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
      imageUrl: 'https://www.nasa.gov/wp-content/uploads/2023/04/lunar-orbiter-render.jpg?w=1024',
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
      imageUrl: '',
    },
  ],
},
{
  id: 'mariner2',
  name: 'Mariner 2',
  place: 'Venus',
  coverImageUrl: 'https://assets.science.nasa.gov/dynamicimage/assets/science/psd/solar/2023/07/mariner_1_3_artist_impression-1280.jpg?crop=faces%2Cfocalpoint&fit=clip&h=900&w=1280',
  pages: [
    {
      label: 'Origin',
      title: 'The First Successful Planetary Mission',
      text: `Mariner 2 launched on August 27, 1962, becoming humanity's first successful planetary science mission. It traveled to Venus for the first successful close-up scientific study of another planet.`,
      imageUrl: 'https://assets.science.nasa.gov/dynamicimage/assets/science/psd/solar/2023/07/mariner_1_3_artist_impression-1280.jpg?crop=faces%2Cfocalpoint&fit=clip&h=900&w=1280',
    },
    {
      label: 'Goals',
      title: 'A Close Look at Venus',
      text: `Mariner 2 was designed to study Venus during a planetary flyby.\n• Objective: Venus flyby.\n• Power: Solar.\n• Mass: 449 pounds (203.6 kilograms).\n• Instruments: Microwave radiometer, infrared radiometer, fluxgate magnetometer, cosmic dust detector, solar plasma spectrometer, energetic particle detectors, and ionization chamber.\n• Important limitation: Mariner 2 carried no cameras.`,
      imageUrl: 'https://assets.science.nasa.gov/dynamicimage/assets/science/psd/solar/2023/07/mariner_1_3_artist_impression-1280.jpg?crop=faces%2Cfocalpoint&fit=clip&h=900&w=1280',
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
      ],
      imageUrl: 'https://assets.science.nasa.gov/dynamicimage/assets/science/psd/solar/2023/07/mariner_1_3_artist_impression-1280.jpg?crop=faces%2Cfocalpoint&fit=clip&h=900&w=1280',
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
      imageUrl: '',
    },
  ],
},
{
  id: 'mariner10',
  name: 'Mariner 10',
  place: 'Mercury',
  coverImageUrl: 'https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/07/mariner10.gif?crop=faces%2Cfocalpoint&fit=clip&h=480&w=640',
  pages: [
    {
      label: 'Origin',
      title: 'The Journey to Mercury',
      text: `Mariner 10 launched on November 3, 1973, becoming the first spacecraft sent to study Mercury. It also became the first mission to explore two planets during a single mission.`,
      imageUrl: 'https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/07/mariner10.gif?crop=faces%2Cfocalpoint&fit=clip&h=480&w=640',
    },
    {
      label: 'Goals',
      title: 'Exploring Mercury and Venus',
      text: `The primary goal of Mariner 10 was to study Mercury's atmosphere, surface, and physical characteristics.\n• Targets: Mercury and Venus.\n• Power: Solar.\n• Mass: 1,100 pounds (502.9 kilograms).\n• Instruments: Two telescopes/cameras, infrared radiometer, ultraviolet spectrometers, magnetometer, charged-particle telescope, and plasma analyzer.\n• Special technique: Venus gravity assist to reach Mercury.`,
      imageUrl: 'https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/07/mariner10.gif?crop=faces%2Cfocalpoint&fit=clip&h=480&w=640',
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
      imageUrl: 'https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/07/mariner10.gif?crop=faces%2Cfocalpoint&fit=clip&h=480&w=640',
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
      imageUrl: '',
    },
  ],
},
{
  id: 'apollo15',
  name: 'Apollo 15',
  place: 'Moon',
  coverImageUrl: 'https://images-assets.nasa.gov/image/S71-37963/S71-37963~large.jpg?crop=faces%2Cfocalpoint&fit=clip&h=1477&w=1920',
  pages: [
    {
      label: 'Origin',
      title: 'A New Kind of Moon Mission',
      text: `Apollo 15 was a lunar landing mission launched on July 26, 1971. It carried Commander David R. Scott, Command Module Pilot Alfred M. Worden, and Lunar Module Pilot James B. Irwin to the Moon.`,
      imageUrl: 'https://images-assets.nasa.gov/image/S71-37963/S71-37963~large.jpg?crop=faces%2Cfocalpoint&fit=clip&h=1477&w=1920',
    },
    {
      label: 'Goals',
      title: 'Exploring Hadley-Apennine',
      text: `Apollo 15 sent Scott and Irwin to explore the Moon's Hadley-Apennine region while Worden remained in lunar orbit in the Command and Service Modules.\n• Mission type: Lunar landing.\n• Landing region: Hadley-Apennine.\n• Crew: David R. Scott, James B. Irwin, Alfred M. Worden.\n• Major capability: First Apollo mission to use a lunar rover.\n• Mission duration: 12 days.`,
      imageUrl: 'https://images-assets.nasa.gov/image/S71-37963/S71-37963~large.jpg?crop=faces%2Cfocalpoint&fit=clip&h=1477&w=1920',
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
      imageUrl: 'https://images-assets.nasa.gov/image/S71-37963/S71-37963~large.jpg?crop=faces%2Cfocalpoint&fit=clip&h=1477&w=1920',
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
      imageUrl: '',
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
            <OrbitControls autoRotate autoRotateSpeed={1} enableZoom enablePan={false} />
          </Canvas>
        </ModelErrorBoundary>
      </div>
    );
  }

  if (page.imageUrl) {
    return (
      <img
        src={page.imageUrl}
        alt={page.title}
        
        className="h-full w-full rounded-4xl border border-white/10 object-cover object-center"
      />
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
  const [openBookId, setOpenBookId] = useState<string | null>(null);
  const openBook = BOOKS.find((b) => b.id === openBookId) ?? null;

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
          <BookCard key={book.id} book={book} onOpen={() => setOpenBookId(book.id)} />
        ))}
      </div>

      <AnimatePresence>
        {openBook && <BookModal book={openBook} onClose={() => setOpenBookId(null)} />}
      </AnimatePresence>
    </section>
  );
};