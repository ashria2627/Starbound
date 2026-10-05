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

const BOOKS: BotBook[] = (() => {
  type StoryText = [string, string, string, string];

  type BookSeed = {
    id: string;
    name: string;
    place: string;
    cover: string;
    titles: string[];
    images?: string[];
    captions?: string | Array<string | null>;
    credit?: string;
    credits?: string[];
    modelUrl?: string;
    recordIds?: string[];
    sourceUrls: string[];
  };

  const asset = (path: string) =>
    path.startsWith("/") ||
    path.startsWith("public/") ||
    path.startsWith("assets/")
      ? path
      : `public/assets/objects/${path}`;

  const nasa = (mission: string) =>
    `https://science.nasa.gov/mission/${mission}/`;

  const labels = ["Origin", "Goals", "Discoveries", "Now"];

  const makeBook = (seed: BookSeed, stories: StoryText): BotBook => ({
    id: seed.id,
    name: seed.name,
    place: seed.place,
    coverImageUrl: asset(seed.cover),
    recordIds: seed.recordIds ?? [seed.id],
    sourceUrls: seed.sourceUrls,
    pages: stories.map((story, index) => {
      const title = seed.titles[index];

      return {
        label: labels[index],
        title,
        imageUrl: asset(seed.images?.[index] ?? seed.cover),
        caption:
          typeof seed.captions === "string"
            ? seed.captions
            : seed.captions?.[index] ?? title,
        credit: seed.credits?.[index] ?? seed.credit ?? "NASA",
        ...(index === 3 && seed.modelUrl !== undefined
          ? { modelUrl: seed.modelUrl }
          : {}),
        text: (
          <>
            {story}
            {"\n\n"}
            {seed.sourceUrls.map((url, sourceIndex) => (
              <React.Fragment key={url}>
                {sourceIndex > 0 && " · "}
                <a href={url} target="_blank" rel="noreferrer">
                  {url.includes("jpl.nasa.gov")
                    ? "NASA/JPL source"
                    : "NASA source"}
                  {sourceIndex > 0 ? ` ${sourceIndex + 1}` : ""}
                </a>
              </React.Fragment>
            ))}
          </>
        ),
      };
    }) as BotBook["pages"],
  });

  return [
    makeBook(
      {
        id: "sojourner",
        name: "Sojourner",
        place: "Mars",
        cover: "4067-pathfinder-PIA01551-modest-web-ae16d9b6.jpg",
        recordIds: ["sojourner-pathfinder"],
        titles: [
          "A Small Rover, A Big First",
          "Prove a New Way to Explore",
          "What It Found",
          "Resting at Ares Vallis",
        ],
        images: [
          "4067-pathfinder-PIA01551-modest-web-ae16d9b6.jpg",
          "mars-pathfinder-7-pathfinder-and-sojourner-on-ma-e3b04115.jpg",
          "8648-PIA01133-full2-d5306e90.jpg",
          "mars-pathfinder-11-sojourner-apxs-on-yogi-rock-1-53e0633a.jpg",
        ],
        captions: [
          "Sojourner rover on Mars",
          "Sojourner rover on Mars",
          "Martian terrain",
          "Resting at Ares Vallis",
        ],
        modelUrl: "",
        sourceUrls: [nasa("mars-pathfinder")],
      },
      [
        `On December 4, 1996, NASA launched Mars Pathfinder with a small rover folded inside it.

The rover was named Sojourner, after Sojourner Truth. On July 4, 1997, the spacecraft landed in Ares Vallis, using airbags to cushion its arrival.

When Pathfinder opened, Sojourner rolled onto the surface. It became the first rover to operate on Mars, giving scientists a way to investigate several rocks rather than only the ground beneath a stationary lander.`,

        `Sojourner was built to demonstrate that a small robot could drive on Mars, avoid obstacles, and collect useful science.

Its six wheels and cameras helped it travel between targets. An Alpha Proton X-ray Spectrometer measured chemical elements in rocks and soil, while solar panels supplied electricity.

The rover communicated through Pathfinder, which relayed its observations to Earth.

Its planned mission lasted only seven sols, or Martian days. Every successful drive helped engineers learn how future rovers could explore farther.`,

        `Sojourner examined rocks with names such as Yogi and Barnacle Bill, comparing their chemistry with nearby soil.

Together, the rover and Pathfinder revealed varied rocks and evidence that powerful ancient floods had shaped the landing region.

The mission also tested wheels, obstacle avoidance, and navigation on actual Martian ground.

These engineering results helped prepare the way for larger rovers. Sojourner's journey was small in distance, but it demonstrated a method of exploration that would become central to studying Mars.`,

        `Sojourner remains near Pathfinder in Ares Vallis.

Pathfinder's last communication reached Earth on September 27, 1997. Losing that connection also cut off Sojourner's route for sending information home.

The expedition had lasted almost three months, far beyond the rover's planned seven-sol mission. Its final movements and exact resting point remain uncertain because no later messages reached Earth.

Sojourner had no return vehicle. It stayed on Mars after helping show that a little rover could make a lasting contribution to exploring another world.`,
      ],
    ),

    makeBook(
      {
        id: "spirit",
        name: "Spirit",
        place: "Mars",
        cover: "rover2-1-df042d60.jpg",
        titles: [
          "One of Mars’ Twin Explorers",
          "Search for a Watery Past",
          "What It Found",
          "Resting on Mars",
        ],
        images: [
          "rover2-1-df042d60.jpg",
          "mer-bythenumbers-infographic-feb2019-4ce6ccc5.jpg",
          "outofthisworldrecords-updated-2019-02-b1fd4b22.png",
          "sol016-lander-pan-pia05117-cb29dbe7.jpg",
        ],
        captions: [
          null,
          "Spirit & Opportunity",
          "Comparison of distances traveled by lunar and Mars vehicles",
          "Spirit & Oppy on Mars",
        ],
        sourceUrls: [
          nasa("mer-spirit"),
          "https://www.jpl.nasa.gov/news/press_kits/MSLLanding.pdf",
          nasa("mars-exploration-rovers-spirit-and-opportunity/science-instruments"),
        ],
      },
      [
        `On June 10, 2003, NASA launched Spirit toward Mars. It was one of two Mars Exploration Rovers, alongside its twin, Opportunity.

Spirit landed in Gusev Crater on January 4, 2004, Universal Time. Scientists had chosen the site because its shape suggested that it might once have held a lake.

But the rover's first observations revealed a volcanic plain rather than the lake deposits scientists hoped to find. To investigate further, Spirit would have to leave its landing area and travel toward the Columbia Hills.`,

        `Spirit's main goal was to examine rocks and soil for evidence of past water activity, helping scientists understand whether ancient Mars had environments that could have supported life.

Its six wheels carried a solar-powered laboratory. Panoramic cameras surveyed the landscape, while a Microscopic Imager examined rock textures. An Alpha Particle X-ray Spectrometer measured chemical elements, and a Mössbauer Spectrometer identified iron-bearing minerals.

Its Rock Abrasion Tool ground through weathered rock surfaces to expose material underneath. A miniature thermal emission spectrometer studied minerals from a distance.

The mission was planned for 90 Martian days.

Spirit continued exploring for years.`,

        `In the Columbia Hills, Spirit found rocks and minerals that had been altered by water, revealing a wetter history than its landing site initially suggested.

One important discovery came from an unexpected problem. A broken wheel dragged through the soil, scraping away the surface and exposing silica-rich material. Scientists interpreted the deposit as evidence of ancient hot springs or steam vents.

Spirit also examined carbonate-bearing rock, providing evidence that some ancient water had been less acidic.

These discoveries did not prove that life had existed on Mars. They showed that the planet once had environments where conditions may have been suitable for it—and gave scientists specific places and processes to investigate.`,

        `After traveling about 7.7 kilometers, Spirit became stuck in soft soil at a location called Troy, near Home Plate in Gusev Crater, in 2009.

Controllers tried to free it, but the rover could not reach a position that would give its solar panels enough sunlight during the approaching Martian winter.

Its last communication reached Earth on March 22, 2010. NASA continued recovery attempts before ending them on May 25, 2011.

Today, Spirit remains at Troy.

It had been built for a 90-sol mission. Instead, it spent more than six years investigating Mars, climbing into the hills and finding evidence of water that had not been obvious where it landed.

Its journey ended in the soil, but the measurements it sent home remain part of how scientists understand ancient Mars.`,
      ],
    ),

    makeBook(
      {
        id: "opportunity",
        name: "Opportunity",
        place: "Mars",
        cover: "solar-panels-on-rover-seen-from-above-80d811d3.jpeg",
        titles: [
          "Spirit’s Twin",
          "Read the Rocks",
          "What It Found",
          "Silenced by a Global Storm",
        ],
        images: [
          "solar-panels-on-rover-seen-from-above-80d811d3.jpeg",
          "rover-tracks-on-a-hillside-with-a-dust-devil-see-1933e031.jpeg",
          "rover-casting-a-shadow-a2b3b17d.jpeg",
          "Mars-Exploration-Rover-Spirit-and-Opportunity-3767b584.png",
        ],
        captions: [
          null,
          "Martian Valley",
          "Alone on Mars",
          "Oppy 3D Structure",
        ],
        modelUrl: "",
        sourceUrls: [
          nasa("mer-opportunity"),
          nasa("mars-exploration-rovers-spirit-and-opportunity/science-highlights"),
          "https://www.jpl.nasa.gov/news/six-things-to-know-about-nasas-opportunity-mars-rover/",
        ],
      },
      [
        `On July 7, 2003, NASA launched a small robotic geologist toward Mars.

Its name was Opportunity.

Designed as one of NASA's Mars Exploration Rovers, Opportunity landed on January 24, 2004, in California time—January 25 in Universal Time. It arrived in Meridiani Planum, inside a small impact crater named Eagle Crater.

It was built for the harsh Martian environment, using solar panels for power, six wheels for mobility, onboard computers, cameras, antennas, and scientific instruments including a Microscopic Imager, APXS, Mössbauer Spectrometer, and Rock Abrasion Tool.`,

        `Opportunity's main goal was to investigate rocks and soil for evidence that liquid water had once existed on Mars.

Its cameras mapped the landscape, while its scientific instruments analyzed rocks and minerals. A miniature thermal emission spectrometer studied minerals from a distance. The Rock Abrasion Tool could grind away a rock's surface, exposing material that had not been weathered by the Martian environment.

The mission was planned to last only 90 Martian days.

But Opportunity kept moving.

It crossed plains, explored craters, climbed slopes, and sent thousands of images and scientific measurements back to Earth.`,

        `Inside Eagle Crater, Opportunity found small hematite-rich spheres nicknamed the “blueberries.” They provided evidence of water-related processes.

It also became the first rover to identify and characterize sedimentary rocks on another planet. Sulfate-rich rocks and sedimentary textures showed that water had affected the landscape.

In 2006, it reached Victoria Crater, about 800 meters wide, and studied its exposed layers.

Later, at Endeavour Crater, Opportunity found clay minerals associated with relatively neutral-pH water. These pointed to an ancient environment that may have been more favorable for life.

The rover had found evidence of habitable conditions, not proof that life had existed.`,

        `Opportunity was supposed to work for 90 sols.

Instead, it survived for almost 15 years, traveling 45.16 kilometers—28.06 miles—across Mars and investigating more than 100 craters.

In June 2018, a planet-wide dust storm blocked sunlight from reaching its solar panels. Its last communication reached Earth on June 10.

NASA continued listening and attempting to restore contact, but Opportunity never responded. On February 13, 2019, the mission officially ended.

Today, it remains in Perseverance Valley on the western rim of Endeavour Crater.

Its wheels are still, but its discoveries remain: years of evidence that water had shaped another world.

It was built for 90 sols. It worked for nearly 15 years.

Silent, but not forgotten.`,
      ],
    ),

    makeBook(
      {
        id: "pioneer10",
        name: "Pioneer 10",
        place: "Deep Space",
        cover: "jupiter-pioneer-10-art-jpg-20ff5cb4.webp",
        recordIds: ["pioneer-10"],
        titles: [
          "First Beyond the Asteroid Belt",
          "Explore Jupiter",
          "What It Found",
          "Drifting Into Deep Space",
        ],
        images: [
          "jupiter-pioneer-10-art-jpg-20ff5cb4.webp",
          "arc-1974-ac73-9344orig-3d3ee44b.jpg",
          "Pioneer-10-Ganymede-1-6213fc43.jpeg",
          "pioneer-nasa-629e121e.jpg",
        ],
        captions: [null, null, "Photo  of Jupiter taked by Pioneer 10", null],
        modelUrl: "",
        sourceUrls: [nasa("pioneer-10")],
      },
      [
        `Pioneer 10 launched on March 2, 1972, heading toward Jupiter.

Before reaching the planet, it had to cross the asteroid belt, a region no spacecraft had yet traveled through. Engineers needed to find out whether small particles there posed a serious danger.

Pioneer 10 crossed successfully and reached Jupiter in December 1973.

It became the first spacecraft to investigate the giant planet up close, beginning an era of exploration beyond the inner solar system.`,

        `Pioneer 10 was built to study Jupiter and measure conditions along its route.

Radioisotope generators supplied electricity far from strong sunlight. An imaging photopolarimeter produced pictures and measured reflected light, while a magnetometer investigated magnetic fields.

Charged-particle instruments and dust detectors measured radiation and particles. The spacecraft spun to remain stable and used a large antenna to send observations home.

Its measurements would help scientists understand Jupiter and help engineers prepare later spacecraft for the planet's challenging surroundings.`,

        `Pioneer 10 returned the first close observations of Jupiter, including pictures of the planet and its moons.

It measured Jupiter's enormous magnetic environment and intense radiation belts, revealing hazards that could not be seen in ordinary photographs.

Its safe asteroid-belt crossing also demonstrated that the route was usable.

The mission did more than introduce a distant planet. It supplied practical information that helped later explorers plan their encounters and protect their equipment against Jupiter's radiation.`,

        `Jupiter's gravity placed Pioneer 10 on an escape trajectory, sending it outward rather than into a permanent orbit around the planet.

Over time, its generators produced less electricity. Its final weak signal reached Earth on January 23, 2003.

The spacecraft is now silent and continuing away from the planetary region, carrying its engraved plaque. Its exact present position is not measured by an active mission.

Pioneer 10 never had a return journey planned. It kept traveling after helping open the route that other outer-planet missions would follow.`,
      ],
    ),

    makeBook(
      {
        id: "pioneer11",
        name: "Pioneer 11",
        place: "Deep Space",
        cover: "Pioneer11-1600-fb0b5cbf.jpg",
        recordIds: ["pioneer-11"],
        titles: [
          "Pioneer 10’s Sister",
          "Reach the Ringed Planet",
          "What It Found",
          "Lost Contact",
        ],
        images: [
          "Pioneer11-1600-fb0b5cbf.jpg",
          "Saturn-and-its-rings-d4abdfbb.jpeg",
          "Fuzzy-color-image-of-Jupiter-b2622095.jpeg",
          "ac73-9344-1280-ad97a78e.jpg",
        ],
        captions: [null, null, "Photo of Jupiter taken by Pioneer 11", null],
        modelUrl: "",
        sourceUrls: [nasa("pioneer-11")],
      },
      [
        `Pioneer 11 launched on April 6, 1973, following Pioneer 10 toward Jupiter.

Its journey would continue farther. A close encounter with Jupiter in December 1974 redirected the spacecraft toward Saturn.

In September 1979, it became the first spacecraft to visit the ringed planet.

Before Voyager arrived, Pioneer 11 investigated Saturn's surroundings and tested a route through a region that scientists had previously observed only from Earth.`,

        `Radioisotope generators powered Pioneer 11 far from the Sun.

Its imaging photopolarimeter produced pictures and measured reflected light. Magnetic-field, radiation, plasma, and dust instruments investigated the environment.

Scientists wanted to compare Jupiter and Saturn, study their moons and rings, and determine what hazards later spacecraft might encounter.

Jupiter's gravity assist was essential to reaching Saturn. The mission combined planetary science with the practical task of preparing a safer route for the explorers that would follow.`,

        `At Jupiter, Pioneer 11 returned views of the polar regions and studied the magnetic environment's response to the solar wind.

At Saturn, it detected the planet's magnetic field, discovered the narrow F ring, and reported a previously unknown satellite.

Measurements of rings and surrounding particles helped Voyager planners assess the region ahead.

Pioneer 11's brief visits could not answer every question, but they supplied the first close evidence about Saturn and valuable comparisons between the two giant planets.`,

        `After Saturn, Pioneer 11 continued on a trajectory leading out of the solar system.

Declining electrical power eventually limited its ability to maneuver and keep its antenna directed toward Earth.

Routine operations ended on September 30, 1995. A few minutes of engineering data arrived on November 24, before contact ended as Earth moved outside the antenna's view.

Pioneer 11 now travels silently outward with its plaque. Its precise current position is not actively tracked.

Its signals stopped, but the first encounter with Saturn had already changed what future explorers knew about their destination.`,
      ],
    ),

    makeBook(
      {
        id: "viking-1",
        name: "Viking 1",
        place: "Mars",
        cover: "viking_lander_model.gif",
        recordIds: ["viking-1-lander"],
        titles: [
          "The First Successful Landing on Mars",
          "Search Mars From Orbit and the Surface",
          "A Complex and Unexpected Mars",
          "Silent on the Martian Surface",
        ],
        images: [
          "viking_lander_model.gif",
          "viking.jpg",
          "nowv1.jpg",
          "viking-1.webp",
        ],
        captions: [null, null, null, "Launch of Viking 1"],
        credits: ["NSSDCA", "NASA", "NASA", "NASA"],
        sourceUrls: [nasa("viking")],
      },
      [
        `Viking 1 launched on August 20, 1975, carrying an orbiter and a lander toward Mars.

The orbiter arrived in June 1976 and photographed possible landing areas. On July 20, the lander touched down in Chryse Planitia and transmitted pictures from the surface.

It began a sustained investigation of a world previously studied mainly from a distance.

While its partner circled overhead, Viking 1 could observe weather and examine soil directly on the ground.`,

        `The orbiter mapped Mars and measured temperatures and atmospheric water vapor.

The lander carried two cameras, a sampler arm, weather sensors, a gas chromatograph–mass spectrometer, and an X-ray fluorescence spectrometer. Three biology experiments investigated whether the soil showed evidence of life.

Radioisotope generators supplied electricity, and the orbiter helped relay data.

A seismometer was also carried, but failed to deploy properly.

Viking 1's mission was to study Mars's surface and environment while testing one of exploration's most important questions: could evidence of life be found there?`,

        `Viking 1 photographed a cold, rocky landscape and recorded changing winds, temperatures, and pressure.

Its soil measurements identified sulfur-rich material and elements including silicon, iron, and calcium.

The biology experiments produced surprising reactions, but the organic-chemistry experiment detected no organic compounds. The results did not establish clear evidence of life.

The two Viking orbiters also documented ancient channels and floods, returning 52,663 images and mapping about 97 percent of Mars at roughly 300-meter resolution.`,

        `Viking 1's lander remains in Chryse Planitia.

A faulty command disrupted communication in November 1982, and attempts to recover it failed. NASA records November 11 as its final transmission and November 13 as the mission-end date.

Its orbiter had already been shut down on August 7, 1980, as attitude-control fuel ran low.

The lander stayed on the surface; the orbiter was left in Mars orbit.

Their working lives ended separately, but their photographs, weather observations, and soil experiments remain part of the scientific record of Mars.`,
      ],
    ),

    makeBook(
      {
        id: "mariner2",
        name: "Mariner 2",
        place: "Venus",
        cover: "mariner02.gif",
        recordIds: ["mariner-2"],
        titles: [
          "The First Successful Planetary Mission",
          "A Close Look at Venus",
          "A Hot and Hostile Venus",
          "A Silent Traveler",
        ],
        images: [
          "mariner02.gif",
          "p-1-90824865-60-years-ago-the-mariner-2-gave-us--ebaab001.jpg",
          "Two-men-displaying-a-25-foot-printout-of-all-the-3a4541c3.jpeg",
          "mariner-1-3-artist-impression-1280-90a53565.jpg",
        ],
        sourceUrls: [nasa("mariner-2")],
      },
      [
        `Mariner 2 launched on August 27, 1962, only weeks after Mariner 1's failed launch.

Its destination was Venus, whose bright clouds concealed the conditions below. Scientists had competing ideas about what kind of world lay beneath them.

On December 14, Mariner 2 passed the planet.

It became the first spacecraft to complete a successful scientific encounter with another planet, bringing measurements from close to a destination that telescopes alone could not fully explain.`,

        `Mariner 2 carried microwave and infrared radiometers to measure energy coming from Venus.

A magnetometer searched for magnetic fields. Solar-plasma, energetic-particle, and dust detectors studied interplanetary space. Solar panels and a battery supplied electricity.

It carried no camera.

The mission was designed to investigate Venus's atmosphere and heat while testing navigation and communication across deep space.

Its instruments had to gather useful evidence during a brief flyby, then transmit those measurements across the distance to Earth.`,

        `Mariner 2's measurements showed that Venus was extremely hot, challenging ideas of a mild environment beneath its clouds.

The spacecraft detected no planetary magnetic field at its flyby distance and measured the solar wind between planets.

These observations demonstrated how instruments traveling near a world could test ideas that remained uncertain from Earth.

Later missions would describe Venus in greater detail, but Mariner 2 had provided the first successful close scientific encounter and helped establish the planet's harsh character.`,

        `Mariner 2 continued into orbit around the Sun after passing Venus.

It had not been built to land or brake into Venus orbit. Its last signal reached Earth on January 3, 1963.

The spacecraft is now inactive on its solar trajectory. No active mission measures its exact present position.

Its journey lasted only a few months, but it established something that later exploration depended on: a spacecraft could reach another planet, investigate it, and send useful science home.`,
      ],
    ),

    makeBook(
      {
        id: "mariner10",
        name: "Mariner 10",
        place: "Mercury",
        cover: "mariner10-a3ef4a7a.gif",
        recordIds: ["mariner-10"],
        titles: [
          "The Journey to Mercury",
          "Exploring Mercury and Venus",
          "Revealing Mercury",
          "The Final Signal",
        ],
        images: [
          "mariner10-a3ef4a7a.gif",
          "Mariner-10-e787934b.jpeg",
          "earth-and-moon-in-space-39e167a4.jpeg",
          "mariner-10-1280x1280-2-77b331a8.jpg",
        ],
        sourceUrls: [nasa("mariner-10")],
      },
      [
        `Mariner 10 launched on November 3, 1973, on a journey to Venus and Mercury.

In February 1974, it used Venus's gravity to redirect its path toward Mercury. Its first Mercury encounter followed on March 29.

The route brought the spacecraft back for two more visits.

For a planet that had never received a spacecraft encounter, these repeated flybys provided a remarkable beginning: several opportunities to photograph the surface and investigate its surroundings.`,

        `Mariner 10 carried television cameras, infrared and ultraviolet instruments, a magnetometer, and plasma and particle instruments.

These investigated terrain, temperatures, thin surrounding gases, and magnetic conditions. Solar panels supplied power.

The mission also demonstrated a gravity assist, using a planet's gravity to change a spacecraft's direction and speed while reducing the work required from onboard fuel.

Its journey therefore tested a navigation technique as well as investigating two planets—a technique that would help make later solar-system missions possible.`,

        `Mariner 10 photographed roughly 45 percent of Mercury across its encounters, revealing a heavily cratered surface.

It discovered an unexpected magnetic field and studied Mercury's extremely thin atmosphere, more accurately called an exosphere.

At Venus, its observations revealed cloud patterns.

The successful gravity assist also showed that one planetary encounter could help a spacecraft reach another destination.

Mercury still had unseen regions, but Mariner 10's measurements provided the first close foundation for understanding the planet and planning later exploration.`,

        `After its third Mercury flyby in March 1975, Mariner 10 exhausted its attitude-control gas.

Without that supply, it could no longer point reliably. Controllers switched off its transmitter on March 24.

It remained in orbit around the Sun, rather than Mercury, and no active mission tracks its exact present position.

The spacecraft's working life ended with a practical limitation, but its three encounters had already supplied a planetary portrait, an unexpected magnetic discovery, and a navigation method that future missions could use.`,
      ],
    ),

    makeBook(
      {
        id: "apollo15",
        name: "Apollo 15",
        place: "Moon",
        cover: "apollo_15_cm.jpg",
        recordIds: ["apollo-15"],
        titles: [
          "A New Kind of Moon Mission",
          "Exploring Hadley-Apennine",
          "Exploring the Moon on Wheels",
          "A Mission That Came Home",
        ],
        images: [
          "apollo_15_cm.jpg",
          "as17_147_22526.jpg",
          "apollo_15_lm.jpg",
          "S71-37963-large-66ce2d79.jpg",
        ],
        sourceUrls: [
          "https://www.nasa.gov/missions/apollo/apollo-15-mission-details/",
          "https://science.nasa.gov/solar-system/moon/genesis-rock/",
        ],
      },
      [
        `Apollo 15 launched on July 26, 1971, carrying David Scott, James Irwin, and Alfred Worden.

It was the first Apollo landing mission equipped for a longer stay and wider exploration with a lunar rover.

Scott and Irwin landed Falcon at Hadley-Apennine on July 30, while Worden investigated the Moon from orbit.

The mountain-front landscape and Hadley Rille offered geological targets that the rover would help the astronauts reach during their limited time on the surface.`,

        `Falcon carried supplies, geological tools, the folding Lunar Roving Vehicle, and an Apollo Lunar Surface Experiments Package.

Scott and Irwin would collect samples, examine landforms, and deploy instruments, including seismic and heat-flow equipment.

Worden used cameras and scientific instruments in the command and service modules to study the Moon from orbit.

The rover extended the crew's routes and conserved time and energy.

Apollo 15 combined close fieldwork, long-term surface experiments, and orbital observations into one broader investigation of lunar history.`,

        `The astronauts traveled about 27.9 kilometers and collected roughly 77 kilograms of samples.

Among them was the Genesis Rock, an anorthosite that helped scientists investigate the Moon's early crust.

Observations of Hadley Rille and nearby terrain added evidence about volcanic and geological history.

The surface experiments continued after the crew departed, while orbital measurements covered regions beyond their routes.

Apollo 15's discoveries came from connecting field observations with samples scientists could examine directly back on Earth.`,

        `The crew returned to Earth on August 7, 1971, after a twelve-day mission.

Their command module came home. The entire spacecraft was not abandoned on the Moon.

Falcon's descent stage, the rover, and deployed equipment remain at Hadley-Apennine because they were not required for the return journey.

The ascent stage returned the astronauts to orbit and was later deliberately impacted on the Moon.

The crew's visit ended, but the samples and instrument records continued supporting research long after the expedition came home.`,
      ],
    ),

    makeBook(
      {
        id: "viking-2",
        name: "Viking 2",
        place: "Mars",
        cover: "viking-1.webp",
        recordIds: ["viking-2-lander"],
        titles: [
          "Viking 1's Twin on Mars",
          "Study Mars and Search for Life",
          "A Different Face of Mars",
          "A Long-Quiet Lander",
        ],
        images: [
          "viking-1.webp",
          "sagan_viking.jpg",
          "mars.jpg",
          "viking_lander_model.gif",
        ],
        sourceUrls: [nasa("viking")],
      },
      [
        `Viking 2 launched in September 1975, carrying another orbiter-and-lander team toward Mars.

It entered orbit in August 1976. On September 3, its lander touched down in Utopia Planitia, far from Viking 1's landing site.

A second location gave scientists an important comparison.

They could investigate whether the conditions seen by Viking 1 represented Mars more widely, or whether another part of the planet would reveal a different environment.`,

        `The orbiter used cameras, an infrared thermal mapper, and a water-vapor detector to survey Mars and support the landing.

The lander carried two cameras, a sampler arm, weather sensors, a seismometer, a gas chromatograph–mass spectrometer, and an X-ray fluorescence spectrometer.

Three biology experiments investigated the soil for evidence of life. Radioisotope generators supplied electricity.

The mission was designed to compare both Viking sites, document the environment, and connect close surface observations with a broader view from orbit.`,

        `Viking 2 photographed a rocky plain and seasonal frost, monitored the weather, and measured the soil's chemistry and behavior.

Its biology experiments produced puzzling reactions, but did not establish that life existed.

The orbiters mapped Mars and photographed its moons, widening the investigation beyond the landers' fixed locations.

Comparing the two surface sites helped scientists study environmental differences.

Viking 2's contribution was a second detailed record of Mars, showing why one landing could never fully describe an entire planet.`,

        `Viking 2's lander remains in Utopia Planitia.

Its batteries failed, and operations ended on April 11, 1980. It had no means of driving away or returning to Earth.

The orbiter had stopped operating earlier, on July 25, 1978, after a propulsion-system leak depleted its attitude-control gas. It was left in Mars orbit.

The partners therefore had different endings.

Their radios are silent, but the weather records, frost observations, images, and soil experiments remain available for scientists investigating the world they visited.`,
      ],
    ),

    makeBook(
      {
        id: "mars-global-surveyor",
        name: "Mars Global Surveyor",
        place: "Mars",
        cover: "mgs_768.jpg",
        titles: [
          "Mapping Mars From Orbit",
          "Survey the Entire Planet",
          "Evidence of Water and a Changing Mars",
          "A Decade of Mars Exploration",
        ],
        images: [
          "mgs_768.jpg",
          "mars2.jpg",
          "mars-dust-storms-global-pia03170.webp",
          "ZyIw1.jpg",
        ],
        sourceUrls: [
          nasa("mars-global-surveyor"),
          "https://www.jpl.nasa.gov/news/report-reveals-likely-causes-of-mars-spacecraft-loss/",
        ],
      },
      [
        `Mars Global Surveyor launched on November 7, 1996, to restore a global mapping effort interrupted by the loss of Mars Observer.

It reached Mars in September 1997, then repeatedly passed through the upper atmosphere to reshape its orbit through aerobraking.

By 1999, it was ready for systematic surveying.

Unlike a brief flyby, its orbital mission could examine the same regions repeatedly, giving scientists a way to investigate both the planet's geology and changes occurring over time.`,

        `Its camera studied landforms, while a laser altimeter measured heights for a global topographic map.

A thermal emission spectrometer investigated minerals and temperatures. A magnetometer and electron reflectometer studied magnetic properties, and radio science examined gravity and the atmosphere.

A relay antenna passed information between surface missions and Earth.

The mission was built to investigate Mars as a whole and support future exploration. Its measurements could help select landing sites, explain local geology, and connect rover discoveries with their wider setting.`,

        `Mars Global Surveyor produced a detailed global height map and found strongly magnetized ancient crust.

Its identification of hematite deposits helped guide Opportunity's landing-site selection.

Images documented gullies, layered deposits, dust storms, and changing polar regions, adding questions about water and climate.

The spacecraft also scouted landing sites and relayed rover data.

Its discoveries were useful beyond its own mission: later explorers could use its maps to choose destinations and interpret what they found on the ground.`,

        `Its last communication reached Earth on November 2, 2006.

A review linked the loss to earlier computer-memory and commanding errors that led to an unsafe orientation, an overheated battery, and depleted power.

Recovery attempts were unsuccessful.

Mars Global Surveyor is silent, last known in Mars orbit. Its exact present position is not actively measured.

The loss ended a long-running observer, but did not erase its work. Its maps and archived images remain useful to scientists studying Mars and planning where future exploration should go.`,
      ],
    ),

    makeBook(
      {
        id: "mars-pathfinder",
        name: "Mars Pathfinder",
        place: "Mars",
        cover: "marspath1.gif",
        recordIds: ["sojourner-pathfinder"],
        titles: [
          "The Mission That Sent Sojourner to Mars",
          "Prove a New Way to Explore Mars",
          "Evidence of a Warmer, Wetter Mars",
          "Resting at Ares Vallis",
        ],
        images: [
          "marspath1.gif",
          "marspath3.gif",
          "marspsite.gif",
          "marsrover.gif",
        ],
        sourceUrls: [nasa("mars-pathfinder")],
      },
      [
        `Mars Pathfinder launched on December 4, 1996, carrying the Sojourner rover.

On July 4, 1997, it reached Ares Vallis. A parachute slowed its descent, rockets reduced its speed, and airbags cushioned the final bounces.

Once the spacecraft settled, its petals opened and revealed the rover.

Pathfinder would remain stationary, providing power for its own instruments and a radio connection for Sojourner.

The landing began a mission that tested a new way to reach Mars and explore with a mobile partner.`,

        `Pathfinder was designed to demonstrate a relatively inexpensive landing system while collecting science and supporting a rover.

Its stereo camera surveyed the terrain. An atmospheric and meteorology package measured conditions during descent and on the surface.

Solar panels powered the lander, and its radio relayed Sojourner's observations to Earth.

The mission depended on teamwork: Pathfinder observed the wider scene and maintained communication, while Sojourner investigated individual rocks that a stationary lander could not reach.`,

        `Pathfinder returned more than 16,500 images and extensive weather observations. Sojourner added hundreds of close views and chemical measurements.

Together, they revealed differences among rocks and evidence that powerful ancient floods had shaped the region.

The mission also demonstrated that airbag landing and rover support could work on Mars.

That engineering success helped prepare later missions, including Spirit and Opportunity.

Pathfinder's contribution was both scientific and practical: it investigated a landing site while testing how the next explorers could reach their own.`,

        `The lander, named the Carl Sagan Memorial Station, remains in Ares Vallis with Sojourner nearby.

Its final data transmission reached Earth on September 27, 1997. Later attempts to communicate failed, leaving the precise cause uncertain.

Pathfinder had no return rocket and remained where its airbags had delivered it.

Its radio no longer relays the rover's findings.

The mission ended after demonstrating a landing approach and a working rover partnership that would influence much longer journeys across Mars.`,
      ],
    ),

    makeBook(
      {
        id: "phoenix",
        name: "Phoenix",
        place: "Mars",
        cover: "phoenix_lander.jpg",
        titles: [
          "Digging Into the Martian Arctic",
          "Search for Water and Habitability",
          "Water Ice Beneath the Surface",
          "A Lander Frozen in the Arctic",
        ],
        images: [
          "phoenix_lander.jpg",
          "phoenix_3352.jpg",
          "phoenix_440.gif",
          "sunPhoenix.jpg",
        ],
        sourceUrls: [nasa("mars-phoenix")],
      },
      [
        `Phoenix launched on August 4, 2007, reusing hardware developed for an earlier canceled Mars mission.

On May 25, 2008, it landed in Vastitas Borealis on the northern arctic plains.

It had no wheels. Instead, Phoenix would investigate one location with a robotic arm and onboard laboratories.

Scientists expected ice close beneath the surface.

The lander's mission would depend on what it could dig up, measure, and send home during a working season in the Martian north.`,

        `Phoenix's robotic arm dug trenches and delivered samples to the Thermal and Evolved Gas Analyzer, which heated material in small ovens and examined released gases.

The Microscopy, Electrochemistry and Conductivity Analyzer investigated soil through methods including wet chemistry.

Stereo and arm cameras documented the work, while a weather station monitored the atmosphere. Solar panels supplied power.

The mission studied water's history and the environment's potential habitability, connecting buried material with conditions at the surface and in the sky.`,

        `Phoenix exposed bright material that disappeared after exposure, consistent with ice turning directly into vapor.

Heating a sample then confirmed water ice.

Its soil tests detected perchlorate, and its weather observations revealed snow falling from clouds.

These findings linked buried ice with an active polar environment and supplied important evidence about water and chemistry.

They did not demonstrate living organisms.

Phoenix showed that a stationary lander could investigate several parts of Mars's water story without traveling beyond the reach of its arm.`,

        `Phoenix remains on Mars's northern plains.

Shortening days and worsening weather reduced its solar power. Its last signal reached Earth on November 2, 2008.

The lander was not designed to survive the severe winter indefinitely, and it had no means of leaving the surface.

Later orbital images showed damage consistent with winter conditions.

Its season of digging ended, but it had confirmed water ice and investigated the soil above it—findings that helped scientists understand a region where much of Mars's water remains frozen.`,
      ],
    ),

    makeBook(
      {
        id: "apollo-15-lrv",
        name: "Apollo 15 LRV",
        place: "Moon",
        cover: "as17_147_22526.jpg",
        titles: [
          "A Rover Built for the Moon",
          "Explore Beyond Walking Distance",
          "A New Way to Explore the Moon",
          "Still Parked on the Moon",
        ],
        images: [
          "as17_147_22526.jpg",
          "as17_146_22367.jpg",
          "lrv_deployment_art.jpg",
          "as15_88_11901.jpg",
        ],
        sourceUrls: [
          "https://www.nasa.gov/missions/apollo/apollo-15-mission-details/",
          "https://science.nasa.gov/solar-system/moon/genesis-rock/",
        ],
      },
      [
        `The Apollo 15 Lunar Roving Vehicle traveled to the Moon folded against Falcon's descent stage.

In July 1971, David Scott and James Irwin deployed it at Hadley-Apennine.

It became the first car driven on the Moon.

Earlier astronauts had walked between targets. The rover allowed this crew to reach more distant outcrops and carry equipment and samples along the way.

Its mission would last only as long as the astronauts' surface visit, but it would greatly extend what they could investigate.`,

        `Four independently driven wheels, electric motors, and batteries carried two astronauts over rough ground.

Navigation equipment helped the crew track their route. A television camera and communications equipment linked their work with Earth.

The vehicle carried tools and samples, extending geological traverses while conserving time and energy.

It was driven by astronauts, not designed as an independent robotic explorer.

Its scientific role was to make more places accessible during a short expedition, allowing the crew to connect observations across a wider landscape.`,

        `The rover covered about 27.9 kilometers during Apollo 15's moonwalks.

It helped Scott and Irwin examine Hadley Rille, mountain-front terrain, and different rock exposures. It also supported the return of roughly 77 kilograms of samples to Falcon.

Those samples included the Genesis Rock, which helped investigate the early lunar crust.

The astronauts and their instruments made the discoveries.

The rover enabled them by carrying the crew farther and making it possible to visit more geological targets within their available time.`,

        `The rover remains parked near Apollo 15's landing area at Hadley-Apennine.

The astronauts left it on August 2, 1971, when Falcon's ascent stage carried them back toward lunar orbit.

There was no room or requirement to bring it home.

It carried no independent long-term scientific instruments, so its exploration ended when its drivers departed.

The vehicle stayed on the Moon, while the samples it helped collect went to Earth.

Its short driving career had expanded what one human expedition could learn.`,
      ],
    ),

    makeBook(
      {
        id: "insight",
        name: "InSight",
        place: "Mars",
        cover: "insight.jpg",
        titles: [
          "Listening to the Heart of Mars",
          "Look Beneath the Surface",
          "The Sounds and Secrets of Mars",
          "Silent Beneath the Martian Sky",
        ],
        images: [
          "insight.jpg",
          "38686_Mars-InSight-Solar-Panels-Open-pia196641.jpg",
          "D000M1436_724026330EDR_F0000_0817M_.jpg",
          "SsGBxVZMFznSQXkiNeeoyM.jpg",
        ],
        sourceUrls: [
          nasa("insight"),
          "https://www.jpl.nasa.gov/news/nasa-retires-insight-mars-lander-mission-after-years-of-science/",
        ],
      },
      [
        `InSight launched on May 5, 2018, and landed in Elysium Planitia on November 26.

Its landing area was chosen for safety and suitability for placing instruments on the ground.

The mission would stay in one location.

While rovers investigated visible rocks and landscapes, InSight would study the layers beneath them.

Its robotic arm placed instruments beside the lander, beginning an investigation of Mars's interior through vibrations, radio measurements, and the behavior of the ground.`,

        `The SEIS seismometer detected marsquakes. Radio tracking through the RISE experiment measured the planet's wobble to investigate its interior.

A heat-flow probe called HP3 was designed to burrow into the soil and measure heat escaping from below.

Cameras, a robotic arm, weather sensors, and a magnetometer supported the experiments. Solar arrays provided electricity.

The mission was built to investigate how Mars and other rocky planets formed, using measurements from one quiet surface site to study structures hidden beneath an entire planet.`,

        `InSight detected more than 1,300 marsquakes.

Their vibrations helped scientists estimate the structure of the crust, mantle, and core. Some signals could be linked to fresh meteorite impacts.

Radio observations added information about the core and rotation.

The heat-flow probe did not reach its planned depth because the soil failed to provide the expected friction.

The mission therefore produced major interior discoveries alongside an incomplete experiment.

Its results showed how much could be learned beneath Mars's surface—and how unfamiliar soil could limit a planned investigation.`,

        `Dust gradually covered InSight's solar panels, reducing the electricity available to operate its instruments and communicate.

Its final message reached Earth on December 15, 2022. NASA declared the mission over on December 21 after unsuccessful contact attempts.

The lander remains in Elysium Planitia with its instruments beside it. It has no wheels or return vehicle.

InSight no longer records new marsquakes, but its archived signals continue supporting research.

A mission that never drove across Mars still gave scientists a new way to investigate the planet below its surface.`,
      ],
    ),

    makeBook(
      {
        id: "mariner-4",
        name: "Mariner 4",
        place: "Mars",
        cover: "mariner04.gif",
        titles: [
          "The First Close-Up Look at Mars",
          "See Mars Up Close",
          "A Cratered, Unexpected Mars",
          "Drifting Through Solar Orbit",
        ],
        images: [
          "mariner04.gif",
          "m04_1_2a.jpg",
          "38754_Mars-Mariner-4-first-tv-image-color-next-to-black-and-white.jpg",
          "6805_Mariner-4-animation-spacecraft-engine-burn-full2.jpg",
        ],
        sourceUrls: [nasa("mariner-4")],
      },
      [
        `Mariner 4 launched on November 28, 1964, carrying a camera toward Mars.

Its encounter on July 14–15, 1965, would provide the first close photographs of the planet's surface.

As the picture data arrived, engineers created a hand-colored preview from the numbers while waiting for computer processing.

Mars had inspired centuries of speculation.

Now a spacecraft could supply direct observations, replacing some of those distant guesses with images of actual ground on another planet.`,

        `Mariner 4 carried a television camera and tape recorder to capture and store images during the flyby.

A magnetometer, plasma and energetic-particle detectors, and a cosmic-dust detector measured the environment.

Changes in its radio signal as Mars passed between the spacecraft and Earth investigated the atmosphere. Solar panels provided electricity.

The mission combined photography, environmental measurements, and deep-space communication.

Because it would only pass Mars, its instruments had to collect their most important planetary observations during a brief encounter.`,

        `Mariner 4 returned 21 complete pictures and part of a twenty-second, showing a heavily cratered landscape.

Radio measurements revealed a thin atmosphere, and the spacecraft detected no strong global magnetic field.

Its images covered only a small part of Mars, so they could not describe the whole planet.

Even with that limitation, the mission transformed the starting point for later exploration.

Future spacecraft could investigate questions based on close observations rather than imagined canals or assumptions that Mars resembled Earth.`,

        `Mariner 4 continued into solar orbit after passing Mars.

Following extended observations and later dust encounters, its supply of pointing gas ran low. Communication ended on December 21, 1967.

The spacecraft is inactive and presumed to remain in orbit around the Sun. No active tracking supplies its exact current position.

It was never intended to stop at Mars.

Its flyby was over, but the photographs had already reached Earth, providing a first close view that later explorers would expand into a much more complete planetary story.`,
      ],
    ),

    makeBook(
      {
        id: "mariner-6",
        name: "Mariner 6",
        place: "Mars",
        cover: "mariner06-07.gif",
        titles: [
          "A Closer Look at Mars",
          "Study Mars From a Close Flyby",
          "A Heavily Cratered Mars",
          "A Silent Flyby Pioneer",
        ],
        images: [
          "mariner06-07.gif",
          "Mariner_6_7_solar_orbit.png",
          "jupitrtbym7.png",
          "mariner_1_3_artist_impression-1280.jpg",
        ],
        captions: [
          null,
          null,
          "Mariner 7 far encounter color composite, created using Red, Green and Blue filter images",
          null,
        ],
        credits: ["NASA", "NASA", "Wikipedia", "NASA"],
        sourceUrls: [nasa("mariner-6")],
      },
      [
        `Mariner 6 launched on February 25, 1969, as the first of two spacecraft sent to revisit Mars after Mariner 4.

Its twin, Mariner 7, would approach a few days behind.

On July 31, Mariner 6 passed close to Mars's equatorial region.

The encounter gave its instruments only a short time to examine the planet, but the paired mission offered something valuable: observations from one spacecraft could help guide the second before it arrived.`,

        `Two television cameras collected broad and close views.

Infrared and ultraviolet spectrometers studied the surface and atmosphere, while an infrared radiometer measured temperatures.

A radio-occultation experiment used changes in the spacecraft's radio signal to investigate atmospheric conditions. Solar panels powered the instruments.

The mission was designed to assess Mars's environment and help prepare future explorers.

Its cameras showed the terrain, while other measurements added evidence about temperature and atmospheric composition beyond what an ordinary picture could reveal.`,

        `Mariner 6 photographed heavily cratered and chaotic terrain, expanding the small region seen by Mariner 4.

Spectral and temperature observations supported a carbon-dioxide-rich atmosphere and frozen carbon dioxide in the south polar cap.

The southern findings were useful enough that controllers adjusted Mariner 7's upcoming observations.

The spacecraft therefore contributed both its own measurements and a better plan for its twin.

The paired encounters demonstrated how information already arriving at Earth could improve a mission that was still approaching its destination.`,

        `Mariner 6 continued into orbit around the Sun after its flyby.

NASA's mission history reports data being received until mid-1971, though a precise final-contact date is not established here.

The spacecraft is now silent and presumed to remain on its solar trajectory.

Its mission included no landing or maneuver to enter Mars orbit.

The brief encounter had ended as planned, leaving scientists with more terrain, atmospheric measurements, and experience to build on when later spacecraft could investigate Mars for much longer.`,
      ],
    ),

    makeBook(
      {
        id: "mariner-7",
        name: "Mariner 7",
        place: "Mars",
        cover: "Mariner_7_lift-off.jpg",
        titles: [
          "The Second Eye on Mars",
          "Build on Mariner 6",
          "Mars From the Southern Hemisphere",
          "Beyond Mars",
        ],
        images: [
          "Mariner_7_lift-off.jpg",
          "Mars_full_disk_approach_view_from_Mariner_7.jpg",
          "jupitrtbym7.png",
          "mariner_1_3_artist_impression-1280.jpg",
        ],
        captions: [
          null,
          null,
          "Mariner 7 far encounter color composite, created using Red, Green and Blue filter images",
          null,
        ],
        credits: ["NASA", "NASA", "Wikipedia", "NASA"],
        sourceUrls: [nasa("mariner-7")],
      },
      [
        `Mariner 7 launched on March 27, 1969, following Mariner 6 toward Mars.

Days before its encounter, communication faltered. Controllers recovered a faint signal and switched antennas, preserving the mission's chance to collect science.

They also revised its observing plan using results from Mariner 6.

On August 5, the spacecraft passed Mars with increased attention to the southern polar region.

A difficult approach had become a successful opportunity to investigate areas its twin had helped identify as important.`,

        `Mariner 7 carried two television cameras, infrared and ultraviolet spectrometers, an infrared radiometer, and a radio-occultation experiment.

Solar panels supplied electricity.

These instruments investigated terrain, atmospheric composition, and temperatures.

Its observations would complement Mariner 6's equatorial views with measurements farther south, allowing comparisons between different regions.

The revised plan made the paired mission especially useful: one spacecraft's findings could influence where and how the next spacecraft looked, even though both encounters lasted only a short time.`,

        `Mariner 7 returned 126 images, including cratered terrain, the south polar region, and the broad Hellas basin.

Some images captured the irregular shape of Phobos.

Atmospheric and temperature observations complemented Mariner 6's results, strengthening the picture of a cold world with a thin carbon-dioxide atmosphere.

The recovered encounter showed the importance of work on Earth as well as instruments in space.

Without the team's response to the communication problem, this additional scientific view of Mars might never have reached home.`,

        `After passing Mars, Mariner 7 continued into orbit around the Sun.

NASA's mission history reports receiving data until mid-1971. An exact final-transmission date is not established here.

The spacecraft is silent and presumed to remain on its solar trajectory, without active tracking of its precise present position.

It had never been intended to stop at Mars.

Its successful flyby remains a mission that almost lost its opportunity, recovered in time, and added important images and measurements to humanity's early close investigation of the planet.`,
      ],
    ),

    makeBook(
      {
        id: "mariner-9",
        name: "Mariner 9",
        place: "Mars",
        cover: "mariner09.jpg",
        titles: [
          "The First Spacecraft to Orbit Another Planet",
          "Map Mars From Orbit",
          "A Completely Different Mars",
          "Still Circling Mars",
        ],
        images: [
          "mariner09.jpg",
          "mariner-1971.webp",
          "Underside+boxart.webp",
          "mariner_1_3_artist_impression-1280.jpg",
        ],
        sourceUrls: [nasa("mariner-9")],
      },
      [
        `Mariner 9 launched on May 30, 1971, and reached Mars on November 14.

It became the first spacecraft to orbit another planet.

Its first view was disappointing: a huge dust storm concealed much of the surface.

Unlike a flyby spacecraft, Mariner 9 could wait.

When the atmosphere cleared, its cameras began revealing landforms that earlier brief encounters had missed. The ability to remain at Mars would turn an obscured arrival into a major transformation of scientists' understanding.`,

        `Wide- and narrow-angle television cameras mapped the surface.

Infrared and ultraviolet spectrometers investigated temperatures and atmospheric properties, while radio measurements supplied information about the atmosphere and gravity.

Solar arrays powered repeated observations.

The mission aimed to map most of Mars, monitor changes, and photograph Phobos and Deimos.

Its orbital route provided repeated opportunities rather than one passing view.

That was especially important when the planet's weather delayed the photography: Mariner 9 could begin its detailed survey after the dust cleared.`,

        `Mariner 9 revealed giant volcanoes, including Olympus Mons, and the canyon system named Valles Marineris.

It photographed channels that raised new questions about ancient water.

The spacecraft returned 7,329 images, mapped about 85 percent of Mars, and photographed both moons.

Its discoveries showed a planet far more varied than the cratered landscapes visible in earlier images.

The resulting maps helped guide later orbiters and landers toward questions about volcanism, geology, and the processes that had shaped Mars over time.`,

        `Mariner 9's final contact came on October 27, 1972, when its nitrogen supply for pointing was exhausted.

It was left inactive in Mars orbit.

NASA's historical account predicted a possible impact around 2020, but that prediction is not confirmation that an impact occurred. These sources do not establish its exact current location or whether it remains in orbit.

Its present status is therefore uncertain beyond being inactive.

What is certain is its scientific record: thousands of images that changed how Mars was understood and where later explorers would look.`,
      ],
    ),

    makeBook(
      {
        id: "pioneer5",
        name: "Pioneer 5",
        place: "Solar Orbit",
        cover: "Ready-for-Orbit-0b706a30.jpeg",
        recordIds: ["pioneer-5"],
        titles: [
          "A Pioneer Between Earth and Venus",
          "Testing Deep Space Technology",
          "Mapping the Space Between Planets",
          "Still Circling the Sun",
        ],
        images: [
          "Ready-for-Orbit-0b706a30.jpeg",
          "Pioneer-5-main-6d90f78c.jpg",
          "pioneer-5-7de36f84-b7b8-4396-ad04-e3364832dd1-re-73fbd6b5.jpeg",
          "element115-final-pass-385cd01f.jpg",
        ],
        captions: [null, "Pioneer 5 close up", null, null],
        sourceUrls: [nasa("pioneer-5")],
      },
      [
        `Pioneer 5 launched on March 11, 1960, during the early years of deep-space exploration.

An earlier plan for a Venus encounter had changed into a journey around the Sun between Earth's and Venus's orbits.

Its mission would investigate interplanetary space rather than land on a world.

At a time when communicating across such distances remained a major challenge, the small spacecraft would measure its surroundings and test whether useful information could reliably reach Earth from far away.`,

        `A magnetometer investigated magnetic fields.

An ionization chamber, Geiger-Müller tube, and proportional counter telescope measured radiation. A micrometeoroid instrument watched for particles, and an aspect sensor helped establish orientation.

Solar cells supplied electricity.

The Telebit digital telemetry system sent instrument readings home.

Pioneer 5 was built to investigate the environment between planets and test deep-space communication. Its observations would only be useful if the spacecraft could successfully transmit them across an increasing distance.`,

        `Pioneer 5 confirmed a weak magnetic field in interplanetary space and collected radiation observations.

Its communication system demonstrated that digital measurements could reach Earth from millions of kilometers away.

These results helped scientists treat the space between planets as an environment to investigate, rather than simply a gap to cross.

The mission also supplied engineering experience for later spacecraft.

Longer journeys and more complex instruments would depend on the kind of reliable distant communication that this early explorer helped demonstrate.`,

        `Controllers last contacted Pioneer 5 on June 26, 1960, when it was about 36.4 million kilometers from Earth.

It was already in solar orbit and had no return or planetary-landing mission.

NASA describes it as a derelict spacecraft circling the Sun. Its exact present position is not continuously tracked.

Its working life was brief compared with later missions.

Still, the measurements and communication experience it supplied became part of the preparation for spacecraft that would travel much farther and remain connected for much longer.`,
      ],
    ),

    makeBook(
      {
        id: "lunarorbiter1",
        name: "Lunar Orbiter 1",
        place: "Moon",
        cover: "lunar-orbiter-render-93cde28b.jpg",
        recordIds: ["lunar-orbiter-1"],
        titles: [
          "The First U.S. Orbiter of the Moon",
          "Finding Safe Landing Sites",
          "A New View of the Moon",
          "Its Final Orbit",
        ],
        images: [
          "lunar-orbiter-render-93cde28b.jpg",
          "lunar-orbiter-1-launch-2-spacecraft-2-0d2d5f38.jpg",
          "1272-lunar-orbiter-moon-jf-35b484c0.jpg",
          "1-lunar-orbiter-spacecraft-in-moon-orbit-detlev--5ed48b51.jpg",
        ],
        sourceUrls: [nasa("lunar-orbiter-1")],
      },
      [
        `Lunar Orbiter 1 launched on August 10, 1966, to inspect the Moon before Apollo astronauts arrived.

It entered lunar orbit on August 14, becoming the first U.S. spacecraft to do so.

Its photographs would help planners examine candidate landing areas more closely than Earth-based views allowed.

The mission had a practical purpose: identify terrain where a crew could descend safely.

Before astronauts could explore the ground, this robotic scout would help determine where their journey should begin.`,

        `Its photographic system used wide- and narrow-angle lenses to expose film.

The spacecraft developed the film onboard, scanned it, and transmitted the pictures by radio.

Solar panels supplied electricity, and an engine established lunar orbit.

Radiation and micrometeoroid detectors investigated hazards, while radio tracking helped measure gravity.

The mission combined landing-site photography with environmental and navigation information, giving Apollo planners both a closer view of the surface and experience operating a spacecraft around the Moon.`,

        `Lunar Orbiter 1 photographed possible landing regions and provided terrain detail unavailable from Earth.

It also took the first photograph of Earth from the vicinity of the Moon, showing our planet above the lunar horizon.

Engineering problems limited some high-resolution results, but the mission demonstrated that an orbiting camera could produce useful landing maps.

Its observations helped prepare subsequent lunar exploration while supplying an unfamiliar view of home from the destination astronauts hoped to visit.`,

        `Controllers deliberately sent Lunar Orbiter 1 into the Moon's far side on October 29, 1966.

Its pointing gas was running low and other systems were deteriorating. Ending the mission also prevented radio interference with Lunar Orbiter 2.

The impact destroyed the spacecraft.

Its final area is historically estimated rather than an identified intact wreck.

The photographs had already reached Earth, where they could continue helping planners.

The scout's flight ended at the Moon, but its work remained part of preparing the journeys that followed.`,
      ],
    ),

    makeBook(
      {
        id: "lunarorbiter2",
        name: "Lunar Orbiter 2",
        place: "Moon",
        cover: "lunar_orbiter_render.jpg",
        recordIds: ["lunar-orbiter-2"],
        titles: [
          "Mapping the Moon for Apollo",
          "Searching for Safe Landing Sites",
          "Revealing the Lunar Surface",
          "Its Final Impact",
        ],
        images: [
          "lunar_orbiter_render.jpg",
          "public/assets/objects/images (3).jpeg",
          "Disc-copernicus crater.jpg",
          "Disc-copernicus crater.jpg",
        ],
        captions: [
          null,
          null,
          "Disc-copernicus crater on the Lunar Surface",
          "Disc-copernicus crater on the Lunar Surface",
        ],
        sourceUrls: [nasa("lunar-orbiter-2")],
      },
      [
        `Lunar Orbiter 2 launched on November 6, 1966, following the first spacecraft's useful survey.

It entered lunar orbit on November 10, then lowered its closest passes for detailed photography.

The mission concentrated on candidate landing regions across the equatorial near side.

Apollo planners needed more than a broad view of the Moon.

They needed evidence about specific places a crew might reach, including the terrain and hazards that could determine whether a landing area was suitable.`,

        `Like Lunar Orbiter 1, it carried a dual-lens film camera, onboard film processing, and a scanner for radio transmission.

Solar panels powered the spacecraft.

Radiation and micrometeoroid instruments investigated the environment, while tracking measured lunar gravity.

Its photography assignment included thirteen primary and seventeen secondary candidate sites.

The mission connected geological reconnaissance with Apollo's engineering needs, showing both what the ground looked like and how gravitational forces could affect spacecraft approaching and orbiting the Moon.`,

        `Lunar Orbiter 2 photographed landing areas, crater terrain, and Ranger 8's impact region.

An oblique photograph of Copernicus Crater revealed its depth particularly clearly.

After photography, changes to the spacecraft's orbit enabled tracking over a wider region, improving gravity knowledge.

The pictures helped assess hazards on the surface. The tracking helped describe forces acting on spacecraft above it.

Both kinds of evidence were useful in preparing Apollo, where a successful journey depended on navigation as well as choosing safe ground.`,

        `Lunar Orbiter 2 was deliberately impacted on the Moon's far side on October 11, 1967.

Its attitude-control gas was almost exhausted, and the controlled ending prevented interference with later missions.

The spacecraft was destroyed and no longer remained in orbit.

NASA's historical record gives an approximate impact area, not a modern identification of its debris.

Its photographic mission was finished, but the images and gravity measurements remained available.

They became part of the evidence that helped turn Apollo's proposed destinations into carefully studied landing sites.`,
      ],
    ),

    makeBook(
      {
        id: "lunarorbiter3",
        name: "Lunar Orbiter 3",
        place: "Moon",
        cover: "lunar_orbiter_render.jpg",
        recordIds: ["lunar-orbiter-3"],
        titles: [
          "A Closer Look at the Moon",
          "Finding and Studying Landing Sites",
          "Detailed Views of the Moon",
          "Its Final Orbit",
        ],
        images: [
          "lunar_orbiter_render.jpg",
          "lunar_orbiter_program_14_lo_3_launch.jpg",
          "tsiolkovsky crater.jpg",
          "public/assets/objects/tsiolkovsky crater.jpg",
        ],
        captions: [
          null,
          "lunar orbiter program 14 lo 3 launch",
          "Tsiolkovsky crater of the Moon",
          null,
        ],
        sourceUrls: [nasa("lunar-orbiter-3")],
      },
      [
        `Lunar Orbiter 3 launched on February 5, 1967, after earlier missions had identified promising Apollo landing regions.

It entered lunar orbit on February 8.

Its task was to inspect and confirm candidate sites rather than begin an entirely new search.

Repeated and overlapping photographs could reveal terrain shape that a single image might conceal.

The mission would help planners make more confident choices about destinations for Surveyor landers and the astronauts who would eventually follow them.`,

        `A dual-lens photographic system exposed and developed film inside the spacecraft, then scanned it for transmission to Earth.

Solar panels, a main engine, and pointing thrusters supported the mission.

Radiation and micrometeoroid instruments measured the environment, and radio tracking investigated gravity.

Overlapping images were intended to help assess surface relief and landing hazards.

The spacecraft was built to reduce uncertainty about the route and destination of later lunar missions, using repeated views rather than relying on one photograph of each area.`,

        `A film-readout malfunction prevented some pictures from reaching Earth, but Lunar Orbiter 3 still completed its site-confirmation objectives.

Its photographs joined those from the first two missions in selecting preliminary Apollo landing sites, including regions later visited by Apollo 11 and Apollo 12.

Tracking also tested an orbit resembling Apollo's.

Its main contribution was practical confidence: better knowledge of landing terrain and orbital behavior.

These results helped prepare a human expedition whose safety depended on careful robotic reconnaissance.`,

        `Controllers sent Lunar Orbiter 3 into the Moon on October 9, 1967, after completing its photography and tracking work.

The spacecraft was destroyed near the western lunar limb.

These records provide only an approximate historical impact location.

The controlled ending retired an orbiter no longer needed for its assignment.

Its maps and tracking information had already reached Earth.

The machine did not survive, but the knowledge it supplied continued helping determine where future spacecraft could go and how they could reach those destinations.`,
      ],
    ),

    makeBook(
      {
        id: "lunarorbiter4",
        name: "Lunar Orbiter 4",
        place: "Moon",
        cover: "lunar_orbiter_render.jpg",
        recordIds: ["lunar-orbiter-4"],
        titles: [
          "Mapping Almost the Entire Moon",
          "A Global Survey of the Moon",
          "A New Map of the Moon",
          "Its Final Descent",
        ],
        images: [
          "lunar_orbiter_render.jpg",
          "lunar_orbiter_program_17_lo_4_launch.jpg",
          "Mare_Orientale.jpg",
          "Mare_Orientale.jpg",
        ],
        captions: [
          null,
          "lunar orbiter program 17 lo 4 launch",
          "Mare Orientale of the Moon",
          "Mare Orientale of the Moon",
        ],
        sourceUrls: [nasa("lunar-orbiter-4")],
      },
      [
        `Lunar Orbiter 4 launched on May 4, 1967, with a broader assignment than the earlier landing-site scouts.

It entered a nearly polar orbit on May 8, allowing it to photograph regions farther north and south.

The mission would survey lunar geography and geology rather than concentrate only on possible landing patches.

A camera-door problem threatened the photography, but controllers found a way to continue.

The spacecraft could now help scientists examine major landforms within the wider landscape around them.`,

        `Its dual-lens film system developed and scanned photographs onboard before transmitting them to Earth.

Solar panels, an engine, and pointing equipment supported the near-polar route.

Radiation and micrometeoroid measurements investigated the environment, while tracking supplied gravity information.

The mission was designed to build connected photographic coverage of the Moon.

Seeing craters, basins, and mountains together could help scientists investigate their relationships and geological history, rather than treating each feature as an isolated object in a photograph.`,

        `Lunar Orbiter 4 photographed about 99 percent of the near side and substantial parts of the far side, including views of the south polar region.

Its broad images showed relationships among craters, basins, and mountain systems such as Mare Orientale.

Camera and readout problems limited some results.

Even so, the survey became an important foundation for lunar mapping.

The mission helped scientists interpret individual features in their surroundings, giving them a wider view of processes that had shaped the Moon's surface.`,

        `Contact was lost on July 17, 1967, before a controlled retirement could be completed.

The spacecraft's orbit then decayed under the Moon's uneven gravity.

NASA's mission history gives October 6 as the impact date, while the supplied archive-derived record presumes impact by late October.

The supported conclusion is that the spacecraft was destroyed on the Moon. Its precise impact location was not identified.

Its ending remained less certain than planned, but much of the photographic survey had already reached Earth and continued serving lunar science.`,
      ],
    ),

    makeBook(
      {
        id: "lunarorbiter5",
        name: "Lunar Orbiter 5",
        place: "Moon",
        cover: "lunar_orbiter_render.jpg",
        recordIds: ["lunar-orbiter-5"],
        titles: [
          "The Final Lunar Orbiter",
          "Completing the Lunar Survey",
          "Completing the Picture of the Moon",
          "The Final Impact",
        ],
        images: [
          "lunar_orbiter_render.jpg",
          "lunar_orbiter_program_20_lo_5_launch.jpg",
          "OIP.jpg",
          "OIP.jpg",
        ],
        captions: [
          null,
          null,
          "First Image of Farside of the Moon",
          "First Image of Farside of the Moon",
        ],
        sourceUrls: [nasa("lunar-orbiter-5")],
      },
      [
        `Lunar Orbiter 5 launched on August 1, 1967, as the final spacecraft in the series preparing the way for Apollo.

It entered a near-polar orbit on August 5 and began photography two days later.

Earlier missions had surveyed landing regions and much of the wider surface.

This last scout would fill gaps, revisit important sites, and photograph areas of the far side that had been missed.

Its mission was to help complete a much more comprehensive photographic record of the Moon.`,

        `Wide- and narrow-angle lenses exposed film that was developed onboard and scanned into signals for Earth.

Solar arrays powered the spacecraft.

Radiation and micrometeoroid instruments investigated hazards, while radio tracking refined gravity knowledge.

The photographic goals included additional Apollo and Surveyor sites, scientifically interesting regions, and missing far-side coverage.

The mission combined useful maps with operational experience, helping later explorers understand both the terrain they might visit and the orbital environment they would travel through.`,

        `Lunar Orbiter 5 filled major gaps in far-side photography and added detailed views of candidate landing and science sites.

Together, the five Lunar Orbiters photographed almost the entire Moon.

Tracking improved predictions of how lunar gravity would alter spacecraft orbits. The mission also photographed Earth from a distance.

The series provided more than surface images.

It left Apollo planners with a near-global photographic record and experience operating spacecraft around the Moon, both essential to preparing the next stage of exploration.`,

        `After its photography, environmental measurements, and tracking work, Lunar Orbiter 5 was commanded to impact the Moon on January 31, 1968.

It was destroyed on the near side rather than left as an uncontrolled active radio source in orbit.

Its historical impact position is approximate.

The controlled ending closed the Lunar Orbiter series.

The spacecraft had been sent to inspect destinations for other explorers. Its photographs remained on Earth, where the work of all five scouts continued helping the missions that would arrive after them.`,
      ],
    ),

    makeBook(
      {
        id: "grail-a",
        name: "GRAIL",
        place: "Moon",
        cover: "public/assets/objects/grail.jpg",
        titles: [
          "Listening to the Moon’s Gravity",
          "Mapping the Moon from Within",
          "Seeing Inside the Moon",
          "Its Final Descent",
        ],
        images: ["grail.jpg", "grail.jpg", "grail_2.jpg", "grail_2.jpg"],
        sourceUrls: [nasa("grail")],
      },
      [
        `GRAIL-A and GRAIL-B launched together on September 10, 2011.

Students later named them Ebb and Flow.

The spacecraft entered lunar orbit around the turn of the year and began flying in formation.

Their mission depended on measuring small changes in the distance between them.

The Moon's gravity would slightly alter their motion over different regions.

By recording those changes, the pair could investigate hidden structures beneath a surface that cameras alone could not fully explain.`,

        `Each spacecraft carried a Lunar Gravity Ranging System to measure their separation precisely.

As denser or lighter regions pulled differently on the pair, the distance between them changed.

Solar panels supplied power, and MoonKAM cameras allowed students to request lunar images.

The main scientific goals were to map gravity, study the crust and interior, and investigate the effects of impacts and geological processes.

Two spacecraft working together could turn subtle changes in motion into evidence about material below the visible surface.`,

        `Ebb and Flow produced an exceptionally detailed lunar gravity map.

It revealed a crust heavily fractured by impacts and thinner than earlier estimates had suggested.

The map helped explain mass concentrations, or mascons, that affect lunar orbits. It also exposed buried structures associated with the Moon's history.

These were discoveries made through careful measurement of motion.

The mission gave researchers a way to investigate the interior without directly sampling those hidden layers, adding a new perspective to the Moon's geological record.`,

        `Ebb and Flow were deliberately impacted into a mountain near the lunar north pole on December 17, 2012.

Their mapping and extended mission were complete, and remaining fuel was low.

The controlled ending kept the spacecraft away from historic landing sites.

Both were destroyed, leaving impact sites rather than intact orbiters. The area was named in honor of Sally Ride, who supported the mission's student imaging program.

Their flight ended, but the gravity map remained available for scientists investigating the Moon's hidden structure.`,
      ],
    ),

    makeBook(
      {
        id: "ladee",
        name: "LADEE",
        place: "Moon",
        cover: "ladee.jpg",
        titles: [
          "Exploring the Moon’s Thin Atmosphere",
          "Studying the Lunar Atmosphere",
          "A Closer Look at the Lunar Exosphere",
          "Its Final Impact",
        ],
        images: [
          "ladee.jpg",
          "201309060009HQ~large.jpg",
          "ladee-lunar-orbit.png",
          "201309060009HQ~large.jpg",
        ],
        sourceUrls: [
          nasa("ladee"),
          nasa("ladee/ladee-science-and-instruments"),
        ],
      },
      [
        `LADEE launched from Virginia's Wallops site in September 2013—September 6 locally and September 7 in Universal Time.

The Lunar Atmosphere and Dust Environment Explorer would investigate the Moon's extremely thin atmosphere and surrounding dust.

It entered lunar orbit in October, then flew low enough to sample conditions near the surface.

The Moon lacked a thick atmosphere like Earth's, but that did not mean there was nothing to measure.

LADEE was built to investigate the faint gases and particles that remained.`,

        `A neutral mass spectrometer identified gas particles.

An ultraviolet and visible spectrometer studied light from gases and dust, while the Lunar Dust Experiment detected small grains.

The spacecraft also carried a laser communications demonstration. Solar power supported its low-altitude mission.

Scientists wanted to investigate changes in the exosphere and whether dust could explain historical observations of light near the horizon.

The instruments were designed to measure an environment too sparse for ordinary experience, connecting small signals with physical processes around the Moon.`,

        `LADEE revealed a persistent dust cloud generated by meteoroid impacts and identified neon in the lunar exosphere.

Its observations helped connect atmospheric changes with sunlight, the solar wind, and incoming material.

The laser experiment demonstrated high-rate communication between the Moon and Earth.

These results improved understanding of the Moon's tenuous surroundings and processes that also affect other airless bodies.

The mission showed that even a world without a thick atmosphere had a changing environment that careful instruments could investigate.`,

        `LADEE completed its science mission and an extension before ending in a planned impact on April 18, 2014, Universal Time.

Lowering the orbit allowed measurements closer to the surface, but lunar gravity would eventually bring the spacecraft down.

Its impact crater was later identified near Sundman V on the far side.

The spacecraft was destroyed, leaving debris on the Moon.

Its close observations had already reached Earth, providing a detailed record of dust and gases that would otherwise have remained much harder to study.`,
      ],
    ),

    makeBook(
      {
        id: "mariner5",
        name: "Mariner 5",
        place: "Venus",
        cover: "mariner05.gif",
        recordIds: ["mariner-5"],
        titles: [
          "A Close Encounter with Venus",
          "Revealing Venus from Space",
          "A Hot, Dense World",
          "The Mission Continues in Silence",
        ],
        images: [
          "mariner05.gif",
          "KSC-67PC-0184.jpg",
          "KSC-67PC-0184.jpg",
          "mariner05.gif",
        ],
        captions: [null, "Launch of Mariner 5", "Launch of Mariner 5", null],
        sourceUrls: [nasa("mariner-5")],
      },
      [
        `Mariner 5 began as a backup for Mariner 4's Mars mission.

Engineers later modified it for a different destination: Venus.

It launched on June 14, 1967, and passed the cloud-covered planet on October 19.

The spacecraft carried no camera. Instead, its instruments would investigate the atmosphere and surrounding space through measurements.

Hardware originally prepared for one planetary journey had been given another, helping scientists examine conditions hidden beneath Venus's bright appearance from Earth.`,

        `Its key experiment followed changes in a radio signal as Venus's atmosphere bent and weakened it.

Those changes revealed atmospheric properties.

An ultraviolet photometer, magnetometer, solar-plasma probe, and radiation detector added measurements. Solar panels provided power.

The mission investigated temperature, pressure, charged particles, and the interaction between Venus and the solar wind.

Without photographs, its scientific record would come from instrument readings.

The mission demonstrated that a planet's conditions could be investigated through signals and particles, not only pictures.`,

        `Radio observations showed a dense, hot atmosphere, while other instruments investigated its outer layers.

Mariner 5 detected no Earth-like planetary magnetic field, but showed how the ionosphere could deflect the solar wind.

Scientists compared these measurements with results from the Soviet Venera 4 probe.

The combined evidence helped correct earlier interpretations of Venus.

Mariner 5's contribution was a more reliable description of a difficult planet, showing how measurements from different missions could strengthen understanding when examined together.`,

        `Venus's gravity changed Mariner 5's path, and the spacecraft continued into solar orbit.

Contact was lost on December 4, 1967.

Controllers briefly detected it again on October 14, 1968, but received no additional telemetry. Attempts ended on November 5.

It is now silent and presumed to remain in orbit around the Sun, without an exact actively tracked position.

Its planetary encounter was brief, but the atmospheric measurements remained useful after the spacecraft stopped answering, helping establish the harsh conditions behind Venus's clouds.`,
      ],
    ),

    makeBook(
      {
        id: "surveyor1",
        name: "Surveyor 1",
        place: "Moon",
        cover: "surveyor_beach.jpg",
        recordIds: ["surveyor-1"],
        titles: [
          "The First U.S. Soft Landing",
          "Proving the Moon Could Be Landed On",
          "The Moon Up Close",
          "Its Final Silence",
        ],
        images: [
          "surveyor_beach.jpg",
          "images (5).jpeg",
          "public/assets/objects/surv1_lro_thumb.png",
          "images (4).jpeg",
        ],
        sourceUrls: [nasa("surveyor-1")],
      },
      [
        `Surveyor 1 launched on May 30, 1966, to test a task essential to Apollo: land safely on the Moon and continue operating.

On June 2, its radar, braking rocket, and small descent engines brought it to rest in Oceanus Procellarum.

It became the first U.S. spacecraft to complete a successful lunar soft landing.

Before astronauts depended on their own landing equipment, this robotic mission supplied a working example of a controlled arrival and a view of the ground beneath it.`,

        `A television camera photographed nearby terrain and the spacecraft's landing gear.

Engineering sensors measured temperature, structural conditions, and descent performance. Solar panels and batteries supplied electricity.

The mission investigated whether the surface could support a spacecraft and tested radar-guided landing technology.

Surveyor 1 carried neither the scooping arm nor the chemical-analysis instrument used on some later Surveyors.

Its central tools were images and engineering data, helping assess both the landing procedure and the ground on which a future lunar module would have to stand.`,

        `Surveyor 1 returned more than 11,000 images.

They showed nearby terrain and how its footpads rested on the surface.

The photographs and engineering measurements demonstrated that lunar ground could support a landed spacecraft.

The controlled descent was itself an important result.

Apollo planners now had evidence from an actual soft landing rather than only designs and calculations.

The mission helped reduce uncertainty about the final stage of a lunar journey, where successful navigation had to become a safe arrival on unfamiliar ground.`,

        `Surveyor 1 remains in Oceanus Procellarum.

Its picture-taking mission ended in July 1966 as power declined around lunar sunset. Engineers continued occasional checks until January 7, 1967.

It had no ascent vehicle and was always intended to stay on the Moon.

The lander is inactive today.

Its photographs and engineering results had already helped prepare Apollo, leaving the spacecraft as part of the physical record of how robotic missions tested a destination before astronauts could explore it.`,
      ],
    ),

    makeBook(
      {
        id: "surveyor3",
        name: "Surveyor 3",
        place: "Moon",
        cover: "surveyor_nasm.jpg",
        recordIds: ["surveyor-3"],
        titles: [
          "Testing the Lunar Soil",
          "Digging Into the Moon",
          "Soil Strong Enough to Land",
          "Visited by Apollo 12",
        ],
        images: [
          "surveyor_nasm.jpg",
          "as12-48-7134_1280.jpg",
          "as12-48-7134_1280.jpg",
          "detail_as12-48-7121_orig.jpg",
        ],
        sourceUrls: [nasa("surveyor-3")],
      },
      [
        `Surveyor 3 launched on April 17, 1967, carrying the Surveyor program's first surface-sampling arm.

It reached Oceanus Procellarum on April 20, Universal Time.

Reflective rocks confused the landing radar, causing two bounces before the spacecraft settled.

Despite the difficult arrival, its instruments could operate.

The lander would dig into lunar soil and test its behavior. Two years later, Apollo 12 astronauts would visit the same spacecraft, giving its mission an unusual second chapter.`,

        `Its television camera observed the terrain and the work of a soil-mechanics surface sampler.

The scoop dug trenches, pressed on the ground, and moved material to investigate its physical properties.

Solar panels and batteries powered the experiments.

The mission tested a soft landing and assessed whether the surface could support Apollo's larger lunar module.

Surveyor 3 could examine the ground through contact as well as images, linking direct soil tests with the engineering questions that mattered to future human landings.`,

        `Surveyor 3 transmitted 6,326 pictures and performed trenching, bearing, and impact tests.

Its observations supported the conclusion that lunar ground could hold an Apollo lander.

In November 1969, Apollo 12 astronauts visited and returned selected parts, including its television camera.

Researchers could then examine hardware after prolonged exposure to the Moon.

The mission had helped prepare a human visit, and that visit produced further evidence about the lunar environment—this time through pieces of the robotic explorer itself brought back to Earth.`,

        `Most of Surveyor 3 remains in its crater in Oceanus Procellarum, near Apollo 12's landing site.

Its final contact was on May 4, 1967. It never recovered useful operations after the lunar night.

Apollo 12 removed only selected parts, leaving the rest of the structure behind.

The lander had no return engine.

Some of its hardware came home for study, while most stayed beside the soil it had tested.

That uncommon ending connected a robotic mission with a later human expedition at the same place.`,
      ],
    ),

    makeBook(
      {
        id: "surveyor5",
        name: "Surveyor 5",
        place: "Moon",
        cover: "first chemistry set on moon.jpg",
        recordIds: ["surveyor-5"],
        titles: [
          "Analyzing the Moon’s Chemistry",
          "What Is the Moon Made Of?",
          "Reading the Lunar Soil",
          "Its Final Transmission",
        ],
        images: [
          "first chemistry set on moon.jpg",
          "su5_67_h_1340.gif",
          "surveyor_beach.jpg",
          "as12-48-7134_1280.jpg",
        ],
        captions: [
          null,
          "Surveyor 5 image of the footpad resting in the lunar soil",
          null,
          null,
        ],
        sourceUrls: [nasa("surveyor-5")],
      },
      [
        `Surveyor 5 launched on September 8, 1967, carrying equipment to investigate lunar soil chemistry.

A helium leak threatened its descent, but engineers adjusted the landing sequence.

On September 11, it reached Mare Tranquillitatis safely.

Earlier Surveyors had demonstrated landing and soil-mechanics tests. This mission would add another question: what elements made up the ground?

Its safe arrival allowed a small chemical-analysis instrument to begin examining material on another world's surface directly.`,

        `An alpha-scattering instrument replaced the scoop used on Surveyor 3.

It sent particles toward the soil and analyzed returning signals to estimate elemental composition.

A television camera documented the site, while a magnet on a footpad investigated magnetic properties. Solar panels supplied energy.

The mission combined Apollo landing preparation with the first direct chemical analysis of another world's surface.

It would connect the soil's appearance with its composition, helping scientists investigate what the ground was made of rather than only how it looked.`,

        `Surveyor 5 found soil with a composition resembling basalt, a volcanic rock familiar on Earth.

Its camera returned thousands of images.

A brief engine-firing experiment investigated how exhaust disturbed the surface, adding evidence relevant to landing conditions.

Together, these results linked chemistry, appearance, and the behavior of lunar soil.

The mission demonstrated that a robotic lander could conduct meaningful chemical analysis at its destination, supplying information that ordinary photographs could not provide and helping prepare later lunar investigations.`,

        `Surveyor 5 remains on the slope of a small crater in Mare Tranquillitatis.

It worked during several lunar daylight periods before communication ended in December 1967.

NASA's mission overview and the supplied archive record differ by a day on the exact final-contact date, so December is the supported common point.

The spacecraft had no ascent or return system.

Its laboratory stopped operating where it had first tested the soil, while the measurements remained available as part of the early direct scientific investigation of the Moon.`,
      ],
    ),

    makeBook(
      {
        id: "surveyor6",
        name: "Surveyor 6",
        place: "Moon",
        cover: "webp.webp",
        recordIds: ["surveyor-6"],
        titles: [
          "A Lander That Moved",
          "Studying the Moon from the Ground",
          "The First Lunar Hop",
          "Its Final Contact",
        ],
        images: [
          "webp.webp",
          "surveyor_beach.jpg",
          "images (7).jpeg",
          "images (7).jpeg",
        ],
        sourceUrls: [nasa("surveyor-6")],
      },
      [
        `Surveyor 6 launched on November 7, 1967, and landed in Sinus Medii on November 10.

It began with photography and chemical analysis similar to Surveyor 5.

Then the mission added an unusual maneuver.

On November 17, the spacecraft fired its engines, rose from the surface, and landed a short distance away.

The move allowed it to inspect its original footpad marks and view the same terrain from another position, turning a stationary landing into a brief experiment in movement.`,

        `A television camera, alpha-scattering instrument, and footpad magnet investigated terrain, elemental composition, and magnetic material.

Solar panels and batteries supplied power.

The mission provided further evidence about Apollo landing conditions and compared the soil with earlier sites.

Its planned hop let scientists inspect disturbed ground and use paired views to investigate terrain shape.

The spacecraft did not need to travel far.

A small change of position could supply useful observations that were unavailable while it stood only at its first touchdown point.`,

        `Surveyor 6 transmitted 29,952 images and about thirty hours of chemical-analysis data, finding a basalt-like surface.

Its hop rose roughly three meters and moved about two and a half meters.

This was the first powered takeoff from the Moon.

Images of the original landing marks helped investigate soil properties, while paired views added information about terrain shape.

The brief maneuver demonstrated that even a short movement could turn a previously observed patch of ground into a useful new scientific comparison.`,

        `Surveyor 6 remains near its second touchdown point in Sinus Medii.

Controllers placed it in hibernation for the lunar night in November 1967.

Contact briefly returned on December 14, but no useful new data were received.

The hop was a local experiment, not a means of leaving the Moon. The spacecraft had no return mission.

Its final position is therefore close to its first.

The short distance it traveled was enough to produce new observations and a milestone in lunar exploration before operations ended.`,
      ],
    ),

    makeBook(
      {
        id: "surveyor7",
        name: "Surveyor 7",
        place: "Moon",
        cover: "surveyor_beach.jpg",
        recordIds: ["surveyor-7"],
        titles: [
          "The Scientific Surveyor",
          "Exploring the Lunar Highlands",
          "A Different Side of the Moon",
          "The Final Surveyor",
        ],
        images: [
          "surveyor_beach.jpg",
          "surveyor_7_landing_site.png",
          "surveyortycho.gif",
          "Tycho crater.jpg",
        ],
        captions: [
          null,
          "surveyor_7_landing_site",
          "Tycho Crater panaroma",
          "Tycho Crater",
        ],
        sourceUrls: [nasa("surveyor-7")],
      },
      [
        `Surveyor 7 launched on January 7, 1968, as the final spacecraft in the original Surveyor series.

Earlier missions had answered many questions about potential Apollo landing areas.

This lander would explore a different environment.

On January 10, it reached the southern highlands near Tycho Crater.

The mission would compare highland material with the darker mare plains studied by earlier Surveyors, extending the program from landing preparation toward a broader scientific investigation of differences across the Moon.`,

        `Surveyor 7 carried a television camera, alpha-scattering instrument, and soil sampler.

Footpad magnets, mirrors, and engineering sensors added observations. Solar panels powered the lander.

When the chemistry instrument failed to lower fully, the sampler helped push it into position and later moved it among targets.

The mission investigated surface structure and composition in a highland setting.

Its combination of imaging, soil manipulation, and chemical analysis gave scientists several ways to examine material different from that encountered by the earlier Surveyor missions.`,

        `Surveyor 7 returned more than 21,000 images and about a hundred hours of chemical measurements across two lunar days.

Its scoop dug trenches and moved rocks.

The highland material contained less iron-group material than the mare soils measured previously, supporting an important difference between lunar regions.

The lander also detected laser beams sent from Earth.

These observations extended the Surveyor record beyond the dark plains and demonstrated another connection between an instrument on the Moon and researchers investigating it from home.`,

        `Surveyor 7 remains on the ejecta blanket north of Tycho, the material thrown outward when the crater formed.

Operations ended on February 21, 1968, after work during two lunar daylight periods.

It had no ascent vehicle and was always intended to remain on the Moon.

Its landing marked the final site explored by the original Surveyor series.

The spacecraft is inactive, but its photographs and soil measurements preserved a highland comparison that helped scientists understand why the Moon's different regions could not be treated as one uniform surface.`,
      ],
    ),

    makeBook(
      {
        id: "ranger7",
        name: "Ranger 7",
        place: "Moon",
        cover: "ranger.gif",
        recordIds: ["ranger-7"],
        titles: [
          "The First Successful Close-Up",
          "Seeing the Moon Before Impact",
          "The Moon in Unprecedented Detail",
          "Its Final Descent",
        ],
        images: [
          "ranger.gif",
          "ra7_b001.gif",
          "ranger7pn199.gif",
          "ra7_b100.gif",
        ],
        captions: [
          null,
          "the first picture of the Moon by a U.S. spacecraft, on 31 July 1964",
          "Images by ranger 7 before impact",
          "Ranger 7 B-camera image of Guericke crater",
        ],
        sourceUrls: [nasa("ranger-7")],
      },
      [
        `Ranger 7 launched on July 28, 1964, after a difficult sequence of earlier Ranger missions.

Its destination was the Moon, but it was not designed for a gentle landing.

On July 31, its cameras operated successfully as the spacecraft approached the ground.

The final minutes would provide its most valuable observations.

While Apollo was still being prepared, Ranger 7 could reveal surface details that Earth-based telescopes could not resolve, helping scientists examine the terrain future landers would encounter.`,

        `Six television cameras, arranged in two independent channels, photographed the approaching surface at different scales.

Solar panels, batteries, transmitters, and antennas kept the images flowing to Earth.

Ranger 7 carried no landing legs or soft-landing system.

Its mission was to impact the Moon.

The approach allowed increasingly detailed photographs, but left limited time to transmit them.

The spacecraft was built to use that one-way trajectory for reconnaissance, trading survival for close views that could help later missions land safely.`,

        `In roughly seventeen minutes, Ranger 7 returned 4,308 photographs.

Small craters and surface textures became visible at scales unavailable to telescopes on Earth. The final images reached about half-meter resolution.

They showed that relatively smooth mare terrain could offer suitable Apollo landing regions while also revealing hazards that required careful selection.

The successful camera system supplied both scientific observations and practical planning evidence.

Its brief final sequence helped bridge the difference between studying the Moon from a distance and preparing to reach its surface.`,

        `Ranger 7 struck Mare Cognitum on July 31, 1964.

The name means Sea That Has Become Known, reflecting the knowledge supplied by the mission's photographs.

The spacecraft was destroyed, leaving debris rather than an intact lander.

This was its planned ending, not an unsuccessful attempt at a soft landing.

Its closest images had already reached Earth before the transmission stopped.

The machine's last minutes became part of the preparation for later explorers whose own missions would depend on surviving their arrival.`,
      ],
    ),

    makeBook(
      {
        id: "ranger8",
        name: "Ranger 8",
        place: "Moon",
        cover: "ranger.gif",
        recordIds: ["ranger-8"],
        titles: [
          "Searching for Apollo Landing Ground",
          "Photographing Mare Tranquillitatis",
          "A Safer Landing Site",
          "Its Final Impact",
        ],
        images: [
          "ranger.gif",
          "ra8_a030.gif",
          "ra8_b045.gif",
          "ra8_b001.gif",
        ],
        captions: [
          null,
          "Ritter and Sabine craters on the Moon",
          "Ranger 8 image of the Mare Tranquillitatis (Sea of Tranquillity) ",
          "Ptolemaeus and Alphonsus craters on the Moon",
        ],
        sourceUrls: [nasa("ranger-8")],
      },
      [
        `Ranger 8 launched on February 17, 1965, following Ranger 7's successful photographic mission.

Its target was Mare Tranquillitatis, the Sea of Tranquility.

Apollo planners needed a closer record of terrain in that region.

During the final approach on February 20, its cameras photographed the surface as the spacecraft moved toward impact.

It would not stay on the Moon as an intact lander.

Instead, its mission was to send useful close-up observations before the planned collision ended its flight.`,

        `Six television cameras used two channels to return broad views and finer details.

Solar panels and batteries powered the spacecraft and radio equipment.

It carried no soft-landing system.

Scientists wanted photographs that connected large lunar features with smaller hazards, helping evaluate terrain for future crewed exploration.

The images would become increasingly detailed as the spacecraft descended.

Ranger 8's design therefore depended on a carefully navigated impact trajectory, using the final approach to collect observations that safer later landings would need.`,

        `Ranger 8 transmitted 7,137 photographs before impact.

Its cameras began operating earlier than Ranger 7's, allowing broad views to be compared with Earth-based observations before the closer images arrived.

The sequence documented craters and surface details important to Apollo planning.

Alongside the other successful Rangers, it helped connect distant telescopic maps with the terrain a landing spacecraft would actually encounter.

Its results supplied another region of close observations, broadening the evidence available when planners considered where future astronauts could go.`,

        `Ranger 8 impacted Mare Tranquillitatis on February 20, 1965, and was destroyed.

Its site is different from Apollo 11's later landing location, although both are in the Sea of Tranquility.

The spacecraft remains as debris because its mission required an impact trajectory.

Transmissions stopped when the cameras and radio equipment reached the ground.

The photographs had already reached Earth.

Its short encounter helped prepare later missions that would enter the same broad region with equipment designed to land gently and continue working afterward.`,
      ],
    ),

    makeBook(
      {
        id: "ranger9",
        name: "Ranger 9",
        place: "Moon",
        cover: "ranger.gif",
        recordIds: ["ranger-9"],
        titles: [
          "The Final Ranger",
          "Looking Into Alphonsus Crater",
          "A Final Look at the Lunar Highlands",
          "Its Final Image",
        ],
        images: [
          "ranger.gif",
          "ra9_a060.gif",
          "ra9_b001.gif",
          "ra9_p012.gif",
        ],
        captions: [
          null,
          " The upraised area at lower center is the central peak of Alphonsus crater floor",
          "Ptolemaeus, Alphonsus, and Albategnius craters on the Moon",
          "Final two images taken by Ranger 9 before impact",
        ],
        sourceUrls: [nasa("ranger-9")],
      },
      [
        `Ranger 9 launched on March 21, 1965, for the final flight of the Ranger program.

Its target was Alphonsus Crater, selected for geological interest rather than simply flat landing terrain.

On March 24, the spacecraft approached with cameras directed along its flight path.

Television coverage based on the incoming pictures let people on Earth watch the surface grow closer.

The mission would end at impact, but first it would provide another detailed record of a lunar landscape.`,

        `Six television cameras in two independent channels returned pictures at different scales.

Solar panels and batteries supplied electricity, while radio equipment transmitted the sequence home.

The mission investigated crater terrain and improved understanding of lunar geology.

Like Rangers 7 and 8, it had no equipment for a soft landing.

The spacecraft was designed to photograph continuously during its final approach.

Its instruments had to capture and transmit the useful observations while the same trajectory carried them toward the collision that would end the mission.`,

        `Ranger 9 returned 5,814 pictures, revealing details inside and around Alphonsus as the view narrowed toward the impact point.

Television presentations made the encounter accessible beyond the scientific team.

Together, the three successful Rangers provided close views of contrasting landscapes and experience in precise navigation and imaging.

Their results helped prepare later lunar science and engineering.

Ranger 9's final sequence added crater observations to that record while allowing the public to follow an encounter unfolding through images sent directly from near the Moon.`,

        `Ranger 9 struck inside Alphonsus Crater on March 24, 1965.

The spacecraft was destroyed, and transmissions ended at the surface.

Its remains are debris at an impact site, not an operating or intact lander.

The collision was planned.

Its final pictures were possible because the spacecraft continued approaching the ground rather than attempting to remain above it.

The Ranger program ended with another successful photographic encounter, leaving images that scientists and engineers could use in preparing the next stages of lunar exploration.`,
      ],
    ),

    makeBook(
      {
        id: "viking-1-orbiter",
        name: "Viking 1 Orbiter",
        place: "Mars",
        cover: "viking-1-lander.jpg",
        titles: [
          "The Partner That Stayed Overhead",
          "The Work It Was Built to Do",
          "What Its Journey Made Possible",
          "Where Its Story Ended",
        ],
        captions: "Viking 1 Orbiter",
        sourceUrls: [nasa("viking")],
      },
      [
        `Viking 1 Orbiter launched on August 20, 1975, carrying its lander toward Mars.

It entered orbit on June 19, 1976, then photographed the surface to help choose a safer landing site.

After the lander reached Chryse Planitia, the orbiter continued working above it.

The two spacecraft provided different perspectives.

The lander investigated one location directly, while the orbiter surveyed much larger regions and helped scientists connect the surface observations with a wider understanding of Mars.`,

        `Two television cameras mapped terrain and examined possible landing areas.

An infrared thermal mapper measured surface temperatures, and an atmospheric water detector measured water vapor. Solar arrays supplied power.

The orbiter also relayed the lander's observations to Earth.

Its mission combined global science with support for a surface explorer.

It had to deliver its partner, assist communication, and investigate regions far beyond the lander's reach, using repeated orbits to watch both enduring landforms and changing atmospheric conditions.`,

        `Viking 1 Orbiter photographed landforms associated with ancient flowing water and surveyed large parts of Mars.

It documented clouds, dust, and polar changes. Temperature and water-vapor observations helped investigate climate and seasonal cycles.

Close photographs of Phobos added information about a Martian moon.

Together with Viking 2 Orbiter, it produced a detailed planetary record useful for later geological research and landing-site decisions.

Its repeated observations showed how an orbiting mission could investigate change rather than provide only a single passing view.`,

        `Viking 1 Orbiter was shut down on August 7, 1980, after more than four years at Mars and 1,488 orbits.

Its attitude-control gas was running out, making reliable pointing increasingly difficult.

Controllers raised its orbit before retirement.

It is silent, last known in orbit around Mars. These sources do not provide a live current position.

Its lander continued longer and had a separate ending.

The orbiter's work remained in the mission archive, preserving both its own global observations and the surface findings it had helped send home.`,
      ],
    ),

    makeBook(
      {
        id: "viking-2-orbiter",
        name: "Viking 2 Orbiter",
        place: "Mars",
        cover: "viking-1-lander.jpg",
        titles: [
          "A Second Watch Over Mars",
          "The Work It Was Built to Do",
          "What Its Journey Made Possible",
          "Where Its Story Ended",
        ],
        captions: "Viking 2 Orbiter",
        sourceUrls: [nasa("viking")],
      },
      [
        `Viking 2 Orbiter launched with its lander in September 1975 and entered Mars orbit on August 7, 1976.

It surveyed the planet while the team prepared the lander's arrival in Utopia Planitia.

On September 3, the lander descended, but the orbiter's mission continued.

Its repeated passes would help compare different regions and observe Mars beyond the fixed landing sites.

The partnership linked local soil and weather measurements with a much larger view of the planet.`,

        `Two television cameras photographed terrain.

An infrared thermal mapper measured surface temperatures, while an atmospheric water detector followed water vapor.

Solar panels powered the spacecraft, and radio equipment relayed its lander's data.

The mission mapped Mars, supported a safe landing, and supplied context for surface observations.

Later orbital adjustments improved opportunities to observe Deimos.

Its route was therefore part of the scientific planning, placing instruments where they could investigate both the planet and its smaller moon more effectively.`,

        `Viking 2 Orbiter added photographs and measurements to Viking's extensive mapping of Mars.

They documented varied geology, weather, and seasonal changes.

Close views of Deimos improved knowledge of the smaller Martian moon.

Working with Viking 1 Orbiter, it demonstrated the value of repeated observations over a single flyby.

Its relay work also made the lander's results part of a coordinated investigation.

The mission connected what was happening at one surface location with patterns and processes across a much larger world.`,

        `A propulsion-system leak depleted Viking 2 Orbiter's attitude-control gas.

Controllers left it in a higher orbit, and operations ended on July 25, 1978.

It is silent, last known orbiting Mars, with no actively measured present position in these sources.

The lander continued operating until April 1980.

Although they had traveled together, the partners had different working lifetimes.

The orbiter's photographs, environmental measurements, and relay contribution remained available after its own mission ended, supporting later study of the planet it could no longer observe.`,
      ],
    ),

    makeBook(
      {
        id: "deep-space-1",
        name: "Deep Space 1",
        place: "Mars",
        cover: "nm_ds_1.gif",
        titles: [
          "A Test Flight With a Comet Ahead",
          "The Work It Was Built to Do",
          "What Its Journey Made Possible",
          "Where Its Story Ended",
        ],
        captions: "Deep Space 1",
        sourceUrls: [nasa("deep-space-1")],
      },
      [
        `Deep Space 1 launched on October 24, 1998, mainly to test technology for future missions.

It traveled in solar orbit, using an ion engine and experimenting with navigation that relied less on constant instructions from Earth.

Its mission later included encounters with asteroid Braille and comet Borrelly.

A spacecraft designed to evaluate new engineering ideas would also become a scientific explorer.

Its journey showed how a technology demonstration could develop into something more when the equipment and mission could continue working.`,

        `Deep Space 1 tested twelve technologies, including ion propulsion, autonomous optical navigation, a solar-power concentrator, and compact instruments.

The ion engine accelerated charged xenon particles, producing small thrust over long periods.

A combined camera and imaging spectrometer investigated targets, while a compact plasma instrument sampled the environment.

The tests were intended to reduce uncertainty for later missions.

Rather than relying only on laboratory results, engineers could study how these systems performed during an actual journey through deep space.`,

        `Ion propulsion and onboard navigation demonstrated capabilities useful for later exploration.

The Braille flyby returned measurements, but navigation difficulties limited the hoped-for close photography.

After recovery from a star-tracker failure, Deep Space 1 encountered Borrelly in September 2001 and photographed its dark, elongated nucleus.

The comet observations added valuable science to the engineering mission.

Its record included imperfect encounters and successful recovery, showing both what the new technology could accomplish and the difficulties future mission teams would need to understand.`,

        `Controllers retired Deep Space 1 on December 18, 2001, after its extended mission, with pointing fuel running low.

The ion engine was switched off and normal operations ended by command.

A radio receiver remained on in case future contact was desired, but an attempt in March 2002 failed.

The spacecraft remains inactive on its solar trajectory, without an actively measured exact position.

Its own journey ended after the asteroid and comet encounters.

The technologies it tested helped prepare possibilities for explorers whose missions were still ahead.`,
      ],
    ),

    makeBook(
      {
        id: "mars-observer",
        name: "Mars Observer",
        place: "Mars",
        cover: "mars_observer.jpg",
        titles: [
          "The Mapmaker That Never Began Its Map",
          "The Work It Was Built to Do",
          "What Its Journey Made Possible",
          "Where Its Story Ended",
        ],
        captions: "Mars Observer",
        sourceUrls: [nasa("mars-observer")],
      },
      [
        `Mars Observer launched on September 25, 1992, carrying instruments for a detailed global investigation of Mars.

Scientists had awaited an orbital survey of this kind since Viking.

The spacecraft spent almost a year traveling toward its destination.

Then, in August 1993, only days before planned orbit insertion, communication stopped.

The team attempted to recover contact, but the mapping mission never began.

Mars Observer's story became one of a long approach, an unexplained final interruption, and scientific plans that would have to continue through other spacecraft.`,

        `A camera, laser altimeter, and thermal emission spectrometer would map landforms, heights, and minerals.

A pressure-modulator infrared radiometer would study the atmosphere. A magnetometer and electron reflectometer would investigate magnetic properties, and a gamma-ray spectrometer would measure composition.

Radio science would examine gravity and the atmosphere, while a relay receiver supported future surface work.

Solar arrays supplied power.

The instruments were designed to work together in Mars orbit, producing a global survey that a fixed lander or brief flyby could not provide.`,

        `Mars Observer returned none of its planned orbital mapping of Mars.

Cruise observations included a gamma-ray burst, but that was not the intended planetary survey.

The loss left its main scientific questions unanswered.

Its instrument designs nevertheless continued influencing later missions. Versions flew on other spacecraft, including Mars Global Surveyor.

The mission's planned science therefore had another opportunity, even though the original spacecraft never completed it.

Its legacy included useful engineering and instrument ideas carried forward, rather than discoveries from a Mars mapping campaign that had not begun.`,

        `Contact was lost shortly before orbit insertion in August 1993.

NASA accounts use August 21 for loss of contact and August 22 for mission end.

Investigators considered a propulsion-system rupture the most likely cause, but direct final telemetry did not settle the failure.

Its later trajectory and exact present location remain unknown.

It cannot confidently be described as orbiting Mars or circling the Sun.

The uncertainty is part of its ending: a spacecraft carried instruments nearly to their destination, but never sent back the maps those instruments had been built to make.`,
      ],
    ),

    makeBook(
      {
        id: "apollo-10-snoopy",
        name: "Apollo 10 Snoopy ascent stage",
        place: "Solar Orbit",
        cover: "apollo10_cm_as10_27_3873.jpg",
        titles: [
          "The Rehearsal That Went Around the Sun",
          "The Work It Was Built to Do",
          "What Its Journey Made Possible",
          "Where Its Story Ended",
        ],
        captions: "Apollo 10 Snoopy ascent stage",
        sourceUrls: [
          "https://www.nasa.gov/missions/apollo/apollo-10-mission-details/",
        ],
      },
      [
        `Snoopy launched with Apollo 10 on May 18, 1969.

John Young remained in the command module Charlie Brown, while Thomas Stafford and Eugene Cernan took the lunar module toward the Moon.

They approached to roughly fifteen kilometers above the surface, then returned to orbit.

There was no landing.

The mission rehearsed much of the flight that Apollo 11 would need to complete, testing the lunar module and its procedures close to the destination without putting a crew on the ground.`,

        `The lunar module carried descent and ascent engines, landing radar, guidance equipment, life-support systems, and radios.

Its lower stage supported the approach. The ascent stage contained the cabin and engine needed for the climb back.

The mission tested navigation, descent procedures, and rendezvous with Charlie Brown.

Snoopy had to demonstrate that the crew could separate, maneuver near the Moon, and return safely to the command module.

These were operational tests in the real lunar environment, where the next mission would depend on the same kinds of equipment and procedures.`,

        `Apollo 10 returned measurements and photographs that helped prepare Apollo 11.

Stafford and Cernan practiced the lunar-module flight sequence and rendezvous, while the team checked navigation and communication.

No lunar samples were collected because the crew did not land.

The principal achievement was engineering knowledge.

The rehearsal reduced uncertainty about systems and procedures needed for a human landing.

Snoopy's contribution was therefore not a surface discovery, but a successful demonstration of much of the journey that would soon carry another crew to the ground and back.`,

        `After the astronauts returned to Charlie Brown, Snoopy's ascent stage was separated and sent into orbit around the Sun in May 1969.

It was no longer needed for the crew's return.

NASA confirms this solar-orbit disposal, but the sources do not establish its exact present position or final-transmission time.

The ascent stage is inactive and distinct from the descent stage, which followed a different trajectory.

It never landed on the Moon.

Its completed rehearsal helped prepare a historic landing, while the empty stage continued on a journey without its crew.`,
      ],
    ),

    makeBook(
      {
        id: "cassini",
        name: "Cassini",
        place: "Saturn",
        cover: "1-pia18410-cassini-titan-crop.webp",
        titles: [
          "A Long Journey to the Ringed Planet",
          "The Work It Was Built to Do",
          "What Its Journey Made Possible",
          "Where Its Story Ended",
        ],
        captions: "Cassini",
        credit: "NASA/JPL",
        sourceUrls: [
          nasa("cassini"),
          "https://www.nasa.gov/news-release/cassini-finds-global-ocean-in-saturns-moon-enceladus/",
          nasa("cassini/the-journey/timeline"),
        ],
      },
      [
        `Cassini launched on October 15, 1997, carrying the European Huygens probe.

Gravity assists helped the pair reach Saturn, where Cassini entered orbit in 2004.

The spacecraft would spend thirteen years investigating the planet, rings, and moons rather than making a brief flyby.

In 2005, it delivered Huygens to Titan.

Cassini then continued its own orbital exploration, returning repeatedly to destinations where new observations could change the next set of questions scientists wanted to investigate.`,

        `Radioisotope generators powered Cassini far from the Sun.

Cameras, radar, and infrared and ultraviolet instruments studied Saturn, its rings, and its moons.

A magnetometer, plasma instruments, dust analyzer, and mass spectrometer investigated particles and the environment. Radio science helped probe interiors.

Huygens studied Titan during descent and on the surface.

The mission combined many kinds of measurements across one planetary system.

Repeated encounters let scientists compare changes over time and investigate new clues much more thoroughly than a single passing visit could allow.`,

        `Cassini discovered water-rich plumes from Enceladus and supplied evidence for a global ocean beneath its ice.

At Titan, it revealed lakes and seas of liquid methane and ethane.

It also recorded storms, complex ring structures, and interactions among moons and rings.

These findings made ocean worlds important to questions about habitability, without proving that life existed there.

The mission's repeated observations transformed Saturn's system into a detailed scientific record, one that researchers could continue investigating after the spacecraft itself was gone.`,

        `As fuel ran low, controllers directed Cassini into Saturn's atmosphere on September 15, 2017.

It transmitted measurements during the plunge until it could no longer point its antenna at Earth.

Heat and pressure then destroyed it.

There is no intact wreck on a solid Saturnian surface.

The ending was deliberate, protecting Titan and Enceladus from a possible future collision and contamination by a spacecraft no longer under control.

Cassini's final act preserved the worlds it had helped make scientifically important. Its thirteen-year investigation ended, but the discoveries and archived observations remained.`,
      ],
    ),

    makeBook(
      {
        id: "surveyor-2",
        name: "Surveyor 2",
        place: "Moon",
        cover: "surveyor-3.gif",
        titles: [
          "A Landing Lost to a Tumble",
          "The Work It Was Built to Do",
          "What Its Journey Made Possible",
          "Where Its Story Ended",
        ],
        captions: "Surveyor 2",
        credit: "NSSDCA",
        sourceUrls: [nasa("surveyor-2")],
      },
      [
        `Surveyor 2 launched on September 20, 1966, hoping to repeat Surveyor 1's successful soft landing.

Its destination was near Sinus Medii.

During a course correction, one of its three small engines failed to fire. The uneven thrust sent the spacecraft into a tumble.

Controllers attempted to regain control, but the planned landing was no longer achievable.

A mission designed to continue operating on the lunar ground had lost the stable flight needed to reach that ground safely.`,

        `Surveyor 2 carried a television camera, descent radar, a braking rocket, small vernier engines, and engineering sensors.

Solar panels and batteries would support observations after landing.

The mission was intended to demonstrate another controlled arrival and return pictures and engineering information useful to Apollo.

The propulsion system had to guide the spacecraft accurately through correction and descent.

When the engines did not work together, the instruments could no longer be delivered under the conditions their planned surface mission required.`,

        `Surveyor 2 returned no lunar surface photographs or soil observations.

Its failure did not establish discoveries about the intended landing area.

Instead, flight behavior and recovery attempts became part of the Surveyor program's engineering experience.

The mission demonstrated the consequences of losing reliable propulsion and orientation during a critical maneuver.

Other Surveyors continued the effort to prepare for Apollo.

Surveyor 2's instruments show what scientists and engineers hoped to accomplish, while its failed approach explains why those particular observations never became part of the lunar record.`,

        `Contact ended on September 22, 1966, and Surveyor 2 impacted the Moon on September 23.

Its remains are believed to lie southeast of Copernicus, but an identified wreck is not established in these records.

The location is a historical estimate rather than a confirmed debris site.

The failed course correction had prevented a controlled descent.

Surveyor 2 was destroyed before its planned surface work began.

Its loss remained part of the preparation for later missions, which would need to solve the same challenge of turning a journey to the Moon into a safe landing.`,
      ],
    ),

    makeBook(
      {
        id: "surveyor-4",
        name: "Surveyor 4",
        place: "Moon",
        cover: "surveyor-3.gif",
        titles: [
          "Silence in the Final Descent",
          "The Work It Was Built to Do",
          "What Its Journey Made Possible",
          "Where Its Story Ended",
        ],
        captions: "Surveyor 4",
        credit: "NSSDCA",
        sourceUrls: [nasa("surveyor-4")],
      },
      [
        `Surveyor 4 launched on July 14, 1967, heading toward Sinus Medii near the center of the Moon's visible face.

Surveyor 3 had already demonstrated how a robotic scoop could test lunar soil.

The new lander would continue that investigation.

Its journey appeared successful until July 17, when signals stopped during the final minutes of descent.

The team never received confirmation of a safe landing, and the surface mission that its instruments had been prepared to conduct never began.`,

        `A television camera would photograph the ground, while a surface sampler would dig and test soil.

A magnet in the sampler would investigate iron-bearing material.

Radar, a braking rocket, and vernier engines controlled the planned descent. Solar panels and batteries would support surface operations.

The mission combined a further soft-landing demonstration with evidence about ground Apollo astronauts might encounter.

Its instruments depended on successful arrival.

The loss of communication before touchdown left the spacecraft's final descent, rather than the lunar soil, as the unresolved subject of investigation.`,

        `Surveyor 4 returned no surface pictures or soil measurements.

Its carried instruments do not establish that the intended observations were completed.

The failure added an unresolved descent loss to the Surveyor program's engineering record.

It produced no observed scientific discovery at the planned site.

That distinction is important to its story.

The camera and sampler represented real scientific questions, but no successful surface investigation reached Earth. Later spacecraft would have to continue the work Surveyor 4 had been sent to do.`,

        `Signals stopped around 02:03 Universal Time on July 17, 1967, about two and a half minutes before landing.

NASA suspected a braking-rocket explosion, but the cause was not conclusively established.

Its impact location remains unknown. Sinus Medii was the target, not a confirmed wreck site.

The spacecraft is presumed destroyed on the Moon.

There was no later contact to clarify the ending.

Surveyor 4 reached the final part of its journey, then left an uncertainty that the available measurements could not resolve.`,
      ],
    ),

    makeBook(
      {
        id: "lunar-prospector",
        name: "Lunar Prospector",
        place: "Moon",
        cover: "assets/objects/lunarprosp.gif",
        titles: [
          "Searching the Moon Without a Camera",
          "The Work It Was Built to Do",
          "What Its Journey Made Possible",
          "Where Its Story Ended",
        ],
        captions: "Lunar Prospector",
        credit: "NSSDCA",
        sourceUrls: [nasa("lunar-prospector")],
      },
      [
        `Lunar Prospector launched in January 1998—January 6 in Florida and January 7 in Universal Time.

It entered a polar orbit to investigate composition, magnetic fields, gravity, and possible hidden resources.

The small spinning spacecraft did not depend on a photographic tour.

Its instruments would measure signals that could reveal properties difficult to see directly.

The cold, shadowed poles were especially important, because material hidden there could change how scientists understood the Moon and where future missions should investigate.`,

        `Gamma-ray, neutron, and alpha-particle spectrometers studied particles associated with the surface and environment.

A magnetometer and electron reflectometer investigated magnetic fields. Radio tracking measured gravity, and solar cells supplied power.

The mission mapped elements, searched for evidence of polar ice, and studied magnetic and gravitational properties.

These were indirect measurements rather than direct samples.

Scientists would interpret the recorded signals and compare different regions, building a global picture through repeated passes over a Moon rotating beneath the spacecraft's polar route.`,

        `Neutron measurements detected extra hydrogen near both poles, consistent with water ice mixed into the ground.

This was evidence for ice, not a direct sample or photograph of it.

Lunar Prospector also mapped elements, localized magnetic fields, and gravity, improving knowledge of composition and interior structure.

The polar findings gave later missions strong reasons to investigate permanently shadowed regions.

Its measurements helped identify promising questions and destinations, showing that a spacecraft could reveal important clues even without relying on ordinary surface photography.`,

        `On July 31, 1999, controllers deliberately impacted Lunar Prospector into a permanently shadowed area of Shoemaker Crater near the south pole.

Observers hoped the collision might release detectable water, but no water-vapor signal was found.

The spacecraft was destroyed, leaving debris in the approximate impact region.

Its mapping mission was complete, and the collision was an additional experiment.

The last test did not produce the hoped-for detection.

Its earlier measurements still supplied important polar evidence, helping make the Moon's shadowed regions a continuing destination for scientific investigation.`,
      ],
    ),

    makeBook(
      {
        id: "mars-polar-lander",
        name: "Mars Polar Lander",
        place: "Mars",
        cover: "assets/objects/mars_polar_lander.jpg",
        titles: [
          "A Polar Arrival Without an Answer",
          "The Work It Was Built to Do",
          "What Its Journey Made Possible",
          "Where Its Story Ended",
        ],
        captions: "Mars Polar Lander",
        credit: "NSSDCA",
        sourceUrls: [
          nasa("mars-polar-lander-deep-space-2"),
          "https://llis.nasa.gov/lesson/938",
        ],
      },
      [
        `Mars Polar Lander launched on January 3, 1999, bound for the edge of Mars's south polar cap.

It carried two small Deep Space 2 probes.

The region's layers of ice and dust could preserve evidence of climate history, making it an important scientific destination.

The spacecraft reached Mars on December 3.

After atmospheric entry began, controllers waited for a surface signal.

None arrived.

The journey had brought the mission to Mars, but not to the successful landing needed for its polar investigation.`,

        `A robotic arm would dig and deliver soil to a thermal and evolved-gas analyzer.

Heating samples would reveal released gases.

Cameras would document the terrain and digging. A meteorology package would measure weather, and a microphone was intended to record sounds.

Solar panels would supply electricity.

The two Deep Space 2 penetrators tested another approach to subsurface investigation.

Together, the instruments were designed to study polar material and environmental conditions, connecting local measurements with larger questions about Mars's water and climate history.`,

        `The lander and both small probes returned no planned surface science.

They did not confirm ice or supply the intended polar climate record.

Investigations instead identified weaknesses in testing and touchdown-sensing software.

Those findings became engineering lessons for later projects, especially the need to check complete landing sequences.

The mission's carried instruments explain its scientific purpose, but no completed surface discoveries can be attributed to them.

Its loss left the polar questions unanswered while giving later teams information about failures they needed to prevent.`,

        `The final communication came before atmospheric entry on December 3, 1999.

Investigators judged that signals from deploying landing legs probably caused a false touchdown indication, shutting the engines off too early.

Without descent telemetry, that explanation could not be proved directly.

The lander is presumed destroyed near its intended south-polar region, but its crash site remains unconfirmed.

Contact efforts ended in January 2000.

Mars Polar Lander's story therefore ends with a likely cause, an uncertain location, and scientific work that never had the opportunity to begin.`,
      ],
    ),

    makeBook(
      {
        id: "apollo-11-descent-stage",
        name: "Apollo 11 descent stage",
        place: "Moon",
        cover: "apollo-11-descent-stage.jpg",
        titles: [
          "Eagle's Foundation at Tranquility Base",
          "The Work It Was Built to Do",
          "What Its Journey Made Possible",
          "Where Its Story Ended",
        ],
        captions: "Apollo 11 descent stage",
        credit: "NASA (image via NSSDCA)",
        sourceUrls: ["https://www.nasa.gov/mission/apollo-11/"],
      },
      [
        `Eagle's descent stage launched with Apollo 11 on July 16, 1969.

It formed the lower half of the lunar module carrying Neil Armstrong and Buzz Aldrin, while Michael Collins remained in orbit.

On July 20, its engine guided the crew toward Mare Tranquillitatis.

When the landing legs touched the ground, the stage became the base for the first human visit to the Moon.

Its successful arrival allowed the astronauts to begin the surface exploration their mission had come to accomplish.`,

        `The stage carried the descent engine, propellant, landing gear, and storage bays for tools and scientific equipment.

Its cargo included the early surface experiment package, a passive seismometer and dust detector, plus a separate laser reflector.

It had to land the crew safely and support their work.

After the moonwalk, the upper stage would launch from it.

The lower structure was designed for arrival and as a departure platform, not for a return to Earth or an independent long-term science mission.`,

        `Armstrong and Aldrin collected about 21.55 kilograms of samples, giving scientists lunar material to examine directly on Earth.

The seismometer began recording lunar vibrations.

The laser reflector enabled measurements of the Earth–Moon distance.

The descent stage made these investigations possible by delivering the people and equipment.

It was not the instrument making those observations.

Its contribution was essential but practical: a safe landing created the opportunity for sample collection, deployed experiments, and direct human examination of the surface.`,

        `On July 21, 1969, Eagle's ascent stage carried Armstrong and Aldrin back toward Collins.

The descent stage remained at Tranquility Base because only the upper stage was needed to depart.

It is inactive on the Moon, near the deployed equipment and footprints.

The liftoff marks the stages' separation, not a final transmission from a long-running descent-stage mission.

The crew returned home.

The structure that had brought them safely down stayed behind, preserving part of the landing that opened human exploration of the lunar surface.`,
      ],
    ),

    makeBook(
      {
        id: "apollo-12-descent-stage",
        name: "Apollo 12 descent stage",
        place: "Moon",
        cover: "apollo-12-descent-stage.jpg",
        titles: [
          "Intrepid Beside an Earlier Explorer",
          "The Work It Was Built to Do",
          "What Its Journey Made Possible",
          "Where Its Story Ended",
        ],
        captions: "Apollo 12 descent stage",
        credit: "NASA (image via NSSDCA)",
        sourceUrls: ["https://www.nasa.gov/mission/apollo-12/"],
      },
      [
        `Intrepid's descent stage launched with Apollo 12 on November 14, 1969.

On November 19, it carried Pete Conrad and Alan Bean into Oceanus Procellarum while Richard Gordon remained in lunar orbit.

The landing placed them near Surveyor 3, a robotic visitor already standing on the Moon.

That precision made a special investigation possible.

The crew could visit the earlier spacecraft, collect samples nearby, and return selected hardware for scientists to examine after its exposure to the lunar environment.`,

        `The descent engine, propellant tanks, and landing gear controlled and supported the arrival.

Equipment bays carried geological tools and the Apollo Lunar Surface Experiments Package.

The package included a seismometer, magnetometer, solar-wind instrument, ion detectors, a thin-atmosphere gauge, and a dust detector.

The lower stage delivered the crew and cargo, then provided the platform for the ascent stage's departure.

Its role connected a short human expedition with experiments designed to remain operating after the astronauts returned to Earth.`,

        `Conrad and Bean collected about 34 kilograms of samples and returned roughly ten kilograms of selected Surveyor 3 parts, including its camera.

The samples supported lunar geology research.

The returned hardware allowed study of exposure effects on equipment left on the Moon.

Their ALSEP station continued measuring after the crew departed.

Intrepid's descent stage enabled both the immediate fieldwork and the longer investigation by delivering the expedition safely to a place where a human mission could revisit a robotic one.`,

        `The descent stage remains in Oceanus Procellarum near Surveyor Crater.

On November 20, 1969, Intrepid's ascent stage carried the astronauts back to orbit, leaving the lower structure as designed.

It had no independent means of returning to Earth.

The nearby ALSEP operated separately and had its own later shutdown.

The crew left with rocks and pieces of Surveyor 3.

Intrepid's lower half stayed at the site that had made those investigations possible, beside the landscape where two different kinds of lunar exploration met.`,
      ],
    ),

    makeBook(
      {
        id: "apollo-14-descent-stage",
        name: "Apollo 14 descent stage",
        place: "Moon",
        cover: "apollo-14-descent-stage.jpg",
        titles: [
          "Antares Returns to Fra Mauro",
          "The Work It Was Built to Do",
          "What Its Journey Made Possible",
          "Where Its Story Ended",
        ],
        captions: "Apollo 14 descent stage",
        credit: "NASA (image via NSSDCA)",
        sourceUrls: [
          "https://www.nasa.gov/missions/apollo/apollo-14-mission-details/",
        ],
      },
      [
        `Antares launched with Apollo 14 on January 31, 1971.

Alan Shepard and Edgar Mitchell would explore Fra Mauro while Stuart Roosa remained in orbit.

The region had been Apollo 13's intended destination.

After engineers worked around an abort-switch problem, Antares landed on February 5.

Its descent stage delivered the astronauts to terrain where impact-fragmented rocks could preserve evidence of major events in lunar history.

The successful arrival gave the postponed scientific investigation another chance.`,

        `The lower stage carried the descent engine, propellant, landing gear, and equipment bays.

Its cargo included geological tools, a wheeled handcart, and an Apollo Lunar Surface Experiments Package.

Passive and active seismic equipment, charged-particle and ion detectors, an atmosphere gauge, and a dust detector supported the investigation.

The stage's mission was to land the crew and cargo, support the surface stay, and provide the ascent stage's launch platform.

Its heavy landing structure would remain because it was not needed for the return journey.`,

        `Shepard and Mitchell collected about 42 kilograms of rocks and soil, including breccias formed from fragments joined after impacts.

Observations near Cone Crater helped investigate material associated with the Imbrium basin.

Deployed experiments examined ground structure, moonquakes, and the lunar environment.

The samples and instruments supplied the evidence.

Antares's descent stage enabled that science by transporting the expedition safely.

Its role was not to operate as a laboratory after abandonment, but to make the crew's fieldwork and the instruments' later measurements possible.`,

        `On February 6, 1971, Antares's ascent stage returned Shepard and Mitchell to lunar orbit.

The descent stage stayed in Fra Mauro, where its landing task was complete.

It remains inactive on the surface.

The nearby ALSEP station and separate laser reflector were distinct equipment with different working lives.

The astronauts' departure therefore did not end all science at the site.

The crew returned with samples, while the stage remained where it had delivered them—part of the physical record of a mission that finally reached its long-planned destination.`,
      ],
    ),

    makeBook(
      {
        id: "apollo-15-descent-stage",
        name: "Apollo 15 descent stage",
        place: "Moon",
        cover: "apollo-15-descent-stage.jpg",
        titles: [
          "Falcon Brings a Rover to the Mountains",
          "The Work It Was Built to Do",
          "What Its Journey Made Possible",
          "Where Its Story Ended",
        ],
        captions: "Apollo 15 descent stage",
        credit: "NASA (image via NSSDCA)",
        sourceUrls: [
          "https://www.nasa.gov/missions/apollo/apollo-15-mission-details/",
        ],
      },
      [
        `Falcon's descent stage launched with Apollo 15 on July 26, 1971.

Four days later, it carried David Scott and James Irwin to Hadley-Apennine while Alfred Worden worked in orbit.

This lunar module supported a longer stay and more equipment than earlier landings.

A rover traveled folded against the stage.

The crew would be able to reach more distant targets, connecting observations across the mountain-front landscape and Hadley Rille rather than remaining close to the landing site.`,

        `Falcon's lower stage carried the descent engine, fuel, landing legs, supplies, tools, and Lunar Roving Vehicle.

Its science cargo included an ALSEP station with seismic, magnetic, solar-wind, ion, dust, and heat-flow experiments.

The larger mission also used orbital instruments.

The stage had to deliver that equipment and support the crew's stay, then act as a platform for the upper stage's departure.

It brought together mobile human exploration and fixed experiments intended to keep measuring after the astronauts left.`,

        `The rover helped Scott and Irwin travel about 27.9 kilometers, examine Hadley Rille, and collect about 77 kilograms of samples.

The Genesis Rock supplied material from the early lunar crust.

Other rocks and observations added evidence about volcanic history.

Deployed instruments continued measuring afterward.

These were discoveries made by the crew, samples, and equipment Falcon had delivered.

The descent stage's successful landing allowed a larger and longer scientific expedition, but the abandoned landing engine itself did not continue making independent observations.`,

        `Falcon's ascent stage departed on August 2, 1971.

Its descent stage remains inactive at Hadley-Apennine, with the rover and deployed instruments nearby.

Only the cabin and ascent equipment were needed to return Scott and Irwin to Worden.

The crew came home; the heavy landing structure stayed.

That was how the mission was designed.

Its lower stage remains at the starting point of Apollo's first rover expedition, after helping deliver the equipment that let the astronauts explore farther and leave scientific instruments working behind them.`,
      ],
    ),

    makeBook(
      {
        id: "apollo-16-descent-stage",
        name: "Apollo 16 descent stage",
        place: "Moon",
        cover: "apollo-16-descent-stage.jpg",
        titles: [
          "Orion Arrives in the Highlands",
          "The Work It Was Built to Do",
          "What Its Journey Made Possible",
          "Where Its Story Ended",
        ],
        captions: "Apollo 16 descent stage",
        credit: "NASA (image via NSSDCA)",
        sourceUrls: [
          "https://www.nasa.gov/missions/apollo/apollo-16-mission-details/",
        ],
      },
      [
        `Orion launched with Apollo 16 on April 16, 1972.

John Young and Charles Duke were bound for the Descartes highlands, while Ken Mattingly conducted work in orbit.

A spacecraft problem delayed the landing while controllers checked the situation.

Orion touched down on April 21 in Universal Time—April 20 in the United States.

Its descent stage brought the crew to highland terrain different from earlier mare sites, creating an opportunity to test ideas about the region's geological origins.`,

        `The stage's descent engine, propellant tanks, and four legs delivered and supported the lunar module.

Equipment bays carried a rover, geological tools, and ALSEP instruments, including passive and active seismic equipment, a magnetometer, and a heat-flow experiment.

A separate ultraviolet camera broadened observations.

Orion supported a longer surface expedition before becoming the launch base for the ascent stage.

The landing structure's job was to bring the crew and instruments safely to the highlands, where the expedition could begin investigating the landscape directly.`,

        `Young and Duke collected about 96 kilograms of samples.

Many were impact-formed breccias, changing interpretations that had emphasized volcanic origins for the area.

Seismic and magnetic observations added information about the environment.

The heat-flow experiment did not operate because its cable was broken during setup.

The record therefore included both important discoveries and an incomplete experiment.

Orion had delivered the opportunity for science, but not every instrument achieved its plan. The rocks and working equipment still supplied evidence that changed scientists' understanding of the highlands.`,

        `Orion's ascent stage left on April 24, 1972, Universal Time.

The descent stage remained at the Descartes landing site.

Its heavy landing engine and legs had no return system. The astronauts, samples, and cabin went back to orbit without them.

The separately deployed ALSEP continued on its own and later ended operations in 1977.

The lower stage is now inactive where the crew began its exploration.

Its lasting role was the arrival it enabled: a highland expedition whose returned rocks would challenge earlier explanations of the landscape.`,
      ],
    ),

    makeBook(
      {
        id: "apollo-17-descent-stage",
        name: "Apollo 17 descent stage",
        place: "Moon",
        cover: "apollo-17-descent-stage.jpg",
        titles: [
          "Challenger in the Last Apollo Valley",
          "The Work It Was Built to Do",
          "What Its Journey Made Possible",
          "Where Its Story Ended",
        ],
        captions: "Apollo 17 descent stage",
        credit: "NASA (image via NSSDCA)",
        sourceUrls: [
          "https://www.nasa.gov/missions/apollo/apollo-17-mission-details/",
        ],
      },
      [
        `Challenger launched with Apollo 17 on December 7, 1972.

Eugene Cernan and geologist Harrison Schmitt landed in Taurus-Littrow on December 11, while Ronald Evans investigated the Moon from orbit.

This was Apollo's final lunar landing.

The valley offered mountain material and younger volcanic deposits for comparison.

Challenger's descent stage delivered the rover, supplies, and scientific equipment that would help the crew make the most of their surface visit and leave experiments ready to continue afterward.`,

        `The lower stage carried the landing engine, propellant, legs, rover, and equipment bays.

Its ALSEP cargo included heat-flow equipment, seismic profiling instruments, an atmospheric mass spectrometer, an ejecta-and-meteorite experiment, and a surface gravimeter.

Geological tools supported sample collection.

The stage sustained an extended stay, then served as the platform for the astronauts' launch back to Evans.

Its cargo supported two timescales: the crew's brief fieldwork and a station designed to keep investigating the valley after the last Apollo astronauts departed.`,

        `The crew returned about 110 kilograms of samples.

Orange soil contained tiny glass beads formed during ancient volcanic eruptions.

Field observations connected valley deposits with the surrounding mountains.

Surface experiments investigated heat, shallow structure, and the lunar environment.

The gravimeter did not achieve its intended gravity experiment because of a design problem.

Challenger's descent stage made this work possible by delivering the expedition.

The scientific record included successful observations, returned samples, and documented limits that researchers needed to understand when using the measurements.`,

        `Challenger's ascent stage lifted off on December 14, 1972.

The descent stage remained in Taurus-Littrow with the rover and other hardware nearby.

Its engine-and-leg structure was no longer needed for the trip home.

The ascent stage was later deliberately impacted elsewhere; the lower stage is the portion that stayed at the landing site.

The crew departed with samples from Apollo's final surface expedition.

Challenger's foundation remained inactive at the place where those observations began, while the returned material continued helping scientists investigate lunar history.`,
      ],
    ),

    makeBook(
      {
        id: "apollo-12-alsep",
        name: "Apollo 12 ALSEP station",
        place: "Moon",
        cover: "apollo12_lunar_module.jpg",
        titles: [
          "A Station That Outlasted Its Visitors",
          "The Work It Was Built to Do",
          "What Its Journey Made Possible",
          "Where Its Story Ended",
        ],
        captions: "Apollo 12 ALSEP station",
        credit: "NSSDCA",
        sourceUrls: [
          "https://www.nasa.gov/mission/apollo-12/",
          "https://pds.nasa.gov/ds-view/pds/viewContext.jsp?identifier=urn%3Anasa%3Apds%3Acontext%3Ainstrument_host%3Aspacecraft.a12a",
        ],
      },
      [
        `Pete Conrad and Alan Bean deployed Apollo 12's ALSEP near their Oceanus Procellarum landing site in November 1969.

Cables linked the instruments to a central station, which began operating on November 19.

The crew left the next day.

This first full Apollo Lunar Surface Experiments Package was designed to remain working after their visit.

It would extend the expedition into a long-term investigation, recording events and environmental changes that a few days of human observation could not capture.`,

        `A SNAP-27 radioisotope generator converted heat into electricity, allowing operation without depending on daylight.

A passive seismometer measured vibrations. A magnetometer studied magnetic fields, and a solar-wind spectrometer investigated particles from the Sun.

Ion detectors, a cold-cathode gauge, and a dust detector examined the sparse lunar environment.

The central station distributed power and transmitted measurements.

The installation was built to investigate the Moon over time, connecting several experiments at one location after the astronauts were no longer there to operate them directly.`,

        `The seismometer recorded moonquakes and impacts, helping scientists investigate the lunar interior.

As later Apollo stations joined the network, comparing signals across sites made the observations more useful.

Particle and magnetic measurements documented the Moon's response to the Sun and Earth's magnetic surroundings.

Its main contribution was a sustained record.

Events could be recorded months or years after the astronauts' departure, allowing researchers to investigate changes that the short human visit would have missed and compare measurements from different lunar environments.`,

        `The station remains near Apollo 12's landing area, separate from Intrepid's descent stage.

NASA ended ALSEP scientific operations on September 30, 1977, after years of service and the end of funded support.

The instruments were switched off. Carrier signals continued for a time, but those were not additional scientific measurements.

The equipment stayed where the crew had deployed it.

Its active investigation ended, while the archived observations remained available.

The astronauts had visited briefly; the station continued for years, leaving a scientific record that outlasted both working lives.`,
      ],
    ),

    makeBook(
      {
        id: "apollo-14-alsep",
        name: "Apollo 14 ALSEP station",
        place: "Moon",
        cover: "apollo_14_lm.jpg",
        titles: [
          "A Second Listening Post",
          "The Work It Was Built to Do",
          "What Its Journey Made Possible",
          "Where Its Story Ended",
        ],
        captions: "Apollo 14 ALSEP station",
        credit: "NSSDCA",
        sourceUrls: [
          "https://www.nasa.gov/missions/apollo/apollo-14-mission-details/",
          "https://pds.nasa.gov/ds-view/pds/viewContext.jsp?identifier=urn%3Anasa%3Apds%3Acontext%3Ainstrument_host%3Aspacecraft.a14a",
        ],
      },
      [
        `Alan Shepard and Edgar Mitchell deployed Apollo 14's ALSEP near Antares in Fra Mauro on February 5, 1971.

Setting up the instruments was part of their first moonwalk.

The station added a second long-term observing site to the program begun by Apollo 12.

The astronauts would examine rocks and return home, but their equipment would remain.

Its mission was to continue measuring the location after the crew's visit ended, helping turn separate landing sites into a wider scientific network.`,

        `A central station and SNAP-27 generator provided communication and power.

A passive seismometer recorded natural vibrations, while an active seismic experiment used known signals to investigate shallow layers.

Charged-particle and suprathermal-ion instruments measured the space environment. A cold-cathode gauge and dust detector investigated the tenuous surroundings.

A nearby laser reflector was separate from the powered station.

The package combined local ground measurements with environmental observations, extending the crew's work through instruments that could transmit data without a person remaining beside them.`,

        `Seismic measurements investigated local shallow structure and, when compared with other stations, the deeper lunar interior.

Particle observations examined material from the Sun and changes as the Moon traveled through Earth's magnetic environment.

Years of measurements supplied evidence unavailable during a short visit.

Researchers could compare events across sites and return to the archived records later.

Apollo 14's ALSEP therefore contributed both a location and a timespan, adding a continuing scientific presence at Fra Mauro after the astronauts had completed their own expedition.`,

        `The hardware remains near the Fra Mauro landing site.

Power-related problems affected its later years, and NASA ended ALSEP scientific operations on September 30, 1977.

The shutdown ended the funded scientific program; it was not an attempt to recover the equipment.

The separate laser reflector was not switched off. It requires no onboard electricity to reflect light from Earth.

The powered station stopped collecting science, but its records remained.

The installation had extended a brief human expedition into years of measurements that researchers could continue studying after transmission ended.`,
      ],
    ),

    makeBook(
      {
        id: "apollo-15-alsep",
        name: "Apollo 15 ALSEP station",
        place: "Moon",
        cover: "apollo_15_lm.jpg",
        titles: [
          "Listening Beside Hadley's Mountains",
          "The Work It Was Built to Do",
          "What Its Journey Made Possible",
          "Where Its Story Ended",
        ],
        captions: "Apollo 15 ALSEP station",
        credit: "NSSDCA",
        sourceUrls: [
          "https://www.nasa.gov/missions/apollo/apollo-15-mission-details/",
          "https://pds.nasa.gov/ds-view/pds/viewContext.jsp?identifier=urn%3Anasa%3Apds%3Acontext%3Ainstrument_host%3Aspacecraft.a15a",
        ],
      },
      [
        `David Scott and James Irwin deployed Apollo 15's ALSEP at Hadley-Apennine in July 1971.

The central station began operating on July 31.

Their rover allowed exploration across the landscape, but these instruments were designed to stay in one carefully arranged area.

After Falcon carried the astronauts away, the station remained.

It would investigate the site over a much longer period, recording the Moon's vibrations, temperatures, magnetic conditions, and surrounding particles beyond the crew's short surface visit.`,

        `A SNAP-27 radioisotope generator powered the station.

Its instruments included a passive seismometer, surface magnetometer, solar-wind spectrometer, suprathermal-ion detector, cold-cathode gauge, and dust detector.

Heat-flow probes in drilled holes measured temperatures beneath the surface.

A separate laser reflector supported Earth–Moon distance measurements.

The package investigated internal structure, escaping heat, and the space environment.

Its tools supplied complementary evidence, allowing scientists to compare this mountain-front site with other stations rather than rely on measurements from one part of the Moon alone.`,

        `The seismic station strengthened the network used to compare moonquakes and impacts across Apollo sites.

Heat-flow observations helped estimate energy escaping from the lunar interior.

Particle and magnetic measurements investigated interactions between the Moon and its surroundings.

The record allowed comparisons between Hadley-Apennine and other landing areas.

It also extended the investigation long after the crew's three-day visit.

The station's discoveries came partly from repetition: measurements over time could reveal events and changes that a brief expedition was not able to observe directly.`,

        `The station remains near Apollo 15's landing site, deployed separately from Falcon.

NASA ended its scientific operations with the other ALSEPs on September 30, 1977, after extended service.

The equipment was never designed to return to Earth.

Its separate laser reflector was not disabled by the powered station's shutdown.

The radioed scientific investigation ended, but the measurements already transmitted remained in the archive.

The astronauts' surface journey lasted days, while their station worked for years—leaving evidence scientists could continue examining after both parts of the mission were complete.`,
      ],
    ),

    makeBook(
      {
        id: "apollo-16-alsep",
        name: "Apollo 16 ALSEP station",
        place: "Moon",
        cover: "apollo_16_lm.jpg",
        titles: [
          "A Highland Station With a Broken Cable",
          "The Work It Was Built to Do",
          "What Its Journey Made Possible",
          "Where Its Story Ended",
        ],
        captions: "Apollo 16 ALSEP station",
        credit: "NASA (image via NSSDCA)",
        sourceUrls: [
          "https://www.nasa.gov/missions/apollo/apollo-16-mission-details/",
          "https://pds.nasa.gov/ds-view/pds/viewContext.jsp?identifier=urn%3Anasa%3Apds%3Acontext%3Ainstrument_host%3Aspacecraft.a16a",
        ],
      },
      [
        `John Young and Charles Duke deployed Apollo 16's ALSEP near Orion in the Descartes highlands on April 21, 1972.

The central station began operating that day, adding another site to the lunar scientific network.

A deployment mishap damaged one part of the plan: the heat-flow experiment's cable was broken.

The remaining instruments could still operate.

The station began its long-term investigation with useful tools in place and one intended measurement that could no longer be made.`,

        `The central station used a SNAP-27 radioisotope generator and transmitted data to Earth.

A passive seismometer measured natural vibrations. An active seismic experiment used known signals to study shallow ground.

A surface magnetometer investigated the local magnetic field.

The heat-flow experiment was intended to measure subsurface temperatures, but its broken cable prevented operation.

The package studied a highland environment from one fixed location.

Its mission continued through the working instruments, while the damaged experiment remained a clear limitation in the information it could supply.`,

        `Apollo 16's working instruments returned seismic and magnetic measurements from terrain unlike the earlier mare sites.

Comparing seismic signals across the Apollo network helped investigate the crust and deeper interior.

The active seismic experiment studied near-surface layers.

The damaged heat-flow experiment produced none of its intended measurements.

That missing result is part of the scientific record.

The station added valuable observations, but not every question could be answered. Understanding both its successful measurements and its limits helped researchers assess what the installation had actually established.`,

        `The station remains in the Descartes highlands, with its central station roughly a hundred meters from Orion.

NASA ended scientific operations on September 30, 1977, alongside the other ALSEPs.

Its heat-flow equipment had already been inactive since deployment.

The installation stayed because it was designed as permanent surface equipment, while the crew and samples returned to Earth.

Its working instruments eventually stopped transmitting too.

The observations they had supplied remained available, preserving another location in the network that helped scientists investigate the Moon beneath its surface.`,
      ],
    ),

    makeBook(
      {
        id: "apollo-17-alsep",
        name: "Apollo 17 ALSEP station",
        place: "Moon",
        cover: "apollo_17_lm.jpg",
        titles: [
          "The Last Apollo Watch",
          "The Work It Was Built to Do",
          "What Its Journey Made Possible",
          "Where Its Story Ended",
        ],
        captions: "Apollo 17 ALSEP station",
        credit: "NASA (image via NSSDCA)",
        sourceUrls: [
          "https://www.nasa.gov/missions/apollo/apollo-17-mission-details/",
          "https://pds.nasa.gov/ds-view/pds/viewContext.jsp?identifier=urn%3Anasa%3Apds%3Acontext%3Ainstrument_host%3Aspacecraft.a17a",
        ],
      },
      [
        `Eugene Cernan and Harrison Schmitt deployed Apollo 17's ALSEP in Taurus-Littrow during December 1972.

Its central station began operating on December 12.

This final Apollo installation carried a different selection of instruments from earlier stations.

When the astronauts departed on December 14, the package remained ready to continue.

Apollo's human visits were ending, but observations at the final landing site would go on.

The station would investigate the valley through measurements that did not depend on another crew returning.`,

        `A SNAP-27 generator supplied electricity.

Heat-flow probes measured subsurface temperatures, and seismic profiling equipment recorded waves from planned sources.

A mass spectrometer investigated the extremely thin lunar atmosphere.

An ejecta-and-meteorite experiment watched for particles, while a surface gravimeter was intended to make precise gravity measurements.

The central station shared power and communication among the instruments.

The package was designed to extend the expedition into a continuing investigation of heat, shallow structure, and the environment at the place where Apollo's final landing crew had worked.`,

        `Heat-flow and seismic observations added information about the valley's thermal properties and shallow structure.

The atmospheric experiment investigated gases near the surface.

Some instruments faced important limitations.

A design error prevented the gravimeter from making its intended gravity measurements, and the particle instrument's response complicated interpretation.

The records therefore included successful observations and documented problems.

Later researchers could evaluate both.

Apollo 17's ALSEP supplied evidence rather than a perfect set of answers, making careful interpretation of each instrument's performance part of the science it enabled.`,

        `The station remains in Taurus-Littrow near Challenger's descent stage.

It was deployed separately, not mounted on the lander.

NASA ended its scientific operations on September 30, 1977, after several years of work.

The generator and instruments stayed because no return mission was planned for them.

The crew's departure had not ended the station's investigation; the later program shutdown did.

The final Apollo installation became inactive, but its archived measurements preserved years of observations from a valley the astronauts had visited for only a short time.`,
      ],
    ),

    makeBook(
      {
        id: "grail-b",
        name: "GRAIL-B (Flow)",
        place: "Moon",
        cover: "grail_2.jpg",
        titles: [
          "Flow, the Other Half of a Lunar Laboratory",
          "The Work It Was Built to Do",
          "What Its Journey Made Possible",
          "Where Its Story Ended",
        ],
        captions: "GRAIL-B (Flow)",
        credit:
          "NASA (GRAIL spacecraft illustration; attribution awaiting owner review)",
        sourceUrls: [nasa("grail")],
      },
      [
        `GRAIL-B launched alongside GRAIL-A on September 10, 2011.

Students later named the spacecraft Flow and Ebb.

Flow entered lunar orbit around New Year 2012, following its companion, and the pair began flying in formation.

Its mission depended on their changing separation.

Different regions of the Moon pulled on the spacecraft differently.

Measuring those small changes would let scientists investigate hidden structure, making Flow's partnership with Ebb central to the scientific purpose of its journey.`,

        `Flow's Lunar Gravity Ranging System exchanged precise signals with Ebb to measure changes in distance.

Variations in lunar gravity altered their motion over different regions.

Solar arrays supplied electricity, and MoonKAM allowed students to participate in surface imaging.

The mission investigated the crust, impact basins, and forces that disturb lunar orbits.

Flow was built as half of a paired gravity experiment.

Its most important scientific measurement required its companion, turning their formation flight into a method for examining material neither spacecraft could directly see.`,

        `Together, Flow and Ebb produced a detailed lunar gravity map.

It revealed a heavily fractured crust and buried structures, refined estimates of crustal thickness, and helped explain mass concentrations associated with large basins.

These were shared results.

Neither spacecraft alone could make the same measurement of changing separation.

The mission demonstrated how motion could reveal interior structure.

Its map added evidence about the Moon's geological history and supplied researchers with a way to investigate below the visible surface without directly sampling those layers.`,

        `Flow and Ebb completed their extended mission with deliberate impacts near the lunar north pole on December 17, 2012.

Flow struck shortly after Ebb.

Both were destroyed, leaving separate sites near the same mountain in the area named for Sally Ride.

Remaining fuel was low, so controllers planned the final trajectories away from historic landing locations.

The paired experiment ended with the spacecraft's destruction.

Their shared gravity map remained available, allowing scientists to continue investigating the interior after the two machines that had measured it stopped flying.`,
      ],
    ),
  ];
})();

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
    // Let the current page consume the wheel while its scrollbar can still move.
    // Only turn the page once that scrollbar is already at the requested edge.
    if (innerCanScroll(e.target, dir)) return;
    if (wheelLockRef.current || Math.abs(e.deltaY) < 8) return;

    wheelLockRef.current = true;
    goTo(pageIndex + dir);
    window.setTimeout(() => {
      wheelLockRef.current = false;
    }, 400);
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
              transition={{ duration: 0.25, ease: 'easeOut' }}
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