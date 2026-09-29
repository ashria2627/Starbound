import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { OrbitCharacter } from './illustrations/OrbitCharacter';
import { SputnikIllustration } from './illustrations/SputnikIllustration';
import { SojournerIllustration } from './illustrations/SojournerIllustration';
import { RoverIllustration } from './illustrations/RoverIllustration';
import { ApolloIllustration } from './illustrations/ApolloIllustration';
import { LunaIllustration } from './illustrations/LunaIllustration';
import { PioneerIllustration } from './illustrations/PioneerIllustration';
import { VoyagerIllustration } from './illustrations/VoyagerIllustration';

/**
 * Space Journey — a scroll-driven interactive storybook.
 *
 * Drop this file in as src/components/OppyStory.tsx, and drop the sibling
 * `illustrations/` folder in next to it (src/components/illustrations/).
 * Same export name/props as before, so nothing else needs to change.
 *
 * Design notes:
 * - Pages turn as you scroll (framer-motion scroll progress per spread) —
 *   there is exactly ONE button in the whole story: the destination choice.
 * - Once a destination is chosen, the other two paths are never rendered —
 *   not hidden with CSS, just not in the tree.
 * - No audio/voice/sound anywhere, including in the character illustrations
 *   (their original click-sound effects have been stripped).
 * - No credits, bylines, or "commissioned by" line anywhere.
 */

type Path = 'mars' | 'moon' | 'deep-space';

interface OppyStoryProps {
  onFinish?: () => void;
}

// ---------------------------------------------------------------------------
// Scroll-driven "page" wrapper
// ---------------------------------------------------------------------------
const Spread: React.FC<{
  id?: string;
  bg: string;
  children: React.ReactNode;
  wide?: boolean;
}> = ({ id, bg, children, wide }) => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [40, 0, 0, -30]);
  const rotateX = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [8, 0, 0, -6]);

  return (
    <section
      id={id}
      ref={ref}
      className={`relative flex min-h-screen w-full items-center justify-center overflow-hidden px-6 py-24 sm:px-10 sm:py-32 ${bg}`}
      style={{ perspective: 1200 }}
    >
      <motion.div
        style={{ opacity, y, rotateX, transformStyle: 'preserve-3d' }}
        className={`relative z-10 mx-auto w-full ${wide ? 'max-w-4xl' : 'max-w-2xl'}`}
      >
        {children}
      </motion.div>
    </section>
  );
};

// Background art per world ----------------------------------------------------
const BG = {
  prologue: 'bg-[radial-gradient(ellipse_at_center,#1a1440_0%,#0b0d12_70%)]',
  earth: 'bg-gradient-to-b from-[#0b1a2e] via-[#0e2942] to-[#123a5c]',
  choose: 'bg-gradient-to-b from-[#12213a] to-[#0b0d12]',
  mars: 'bg-gradient-to-b from-[#3a1508] via-[#5c2410] to-[#2a0f06]',
  marsDark: 'bg-gradient-to-b from-[#2a1006] via-[#1c0a04] to-[#0b0503]',
  moon: 'bg-gradient-to-b from-[#1c1f26] via-[#2b2f38] to-[#14161b]',
  deep: 'bg-[radial-gradient(ellipse_at_top,#241a4d_0%,#0a0714_60%)]',
  finale: 'bg-gradient-to-b from-[#0b0d12] via-[#131a2b] to-[#0b0d12]',
};

// Small reusable bits ---------------------------------------------------------

const Kicker: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-block rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-[#f5c9a8]">
    {children}
  </span>
);

const Title: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="mt-4 font-serif text-3xl font-medium tracking-tight text-[#ece7dc] sm:text-5xl">
    {children}
  </h2>
);

const Narration: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="mt-5 whitespace-pre-line text-base leading-relaxed text-[#ece7dc]/90 sm:text-lg">
    {children}
  </p>
);

const Speech: React.FC<{ speaker: string; children: React.ReactNode }> = ({ speaker, children }) => (
  <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6">
    <div className="text-sm font-semibold text-[#7fd6e8]">{speaker}</div>
    <p className="mt-2 whitespace-pre-line text-base leading-relaxed text-[#ece7dc]/95 sm:text-lg">
      {children}
    </p>
  </div>
);

const FactTag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mt-4 flex items-start gap-2 rounded-xl bg-[#c1440e]/10 px-4 py-3">
    <span className="mt-0.5 text-sm">🔎</span>
    <p className="font-mono text-xs leading-relaxed text-[#f5c9a8] sm:text-sm">{children}</p>
  </div>
);

// Centers a character illustration above the text of a spread
const CharacterStage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mb-2 flex flex-wrap items-end justify-center gap-6">{children}</div>
);

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export const OppyStory: React.FC<OppyStoryProps> = ({ onFinish }) => {
  const [path, setPath] = useState<Path | null>(null);
  const pathStartRef = useRef<HTMLDivElement>(null);

  const choosePath = (p: Path) => {
    setPath(p);
    setTimeout(() => {
      pathStartRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  return (
    <div className="w-full bg-[#0b0d12]">
      {/* ---------------- Scene 1 — A Very Big Place ---------------- */}
      <Spread bg={BG.prologue}>
        <CharacterStage>
          <OrbitCharacter mood="gentle" size="lg" />
        </CharacterStage>
        <Kicker>Prologue</Kicker>
        <Title>A Very Big Place</Title>
        <Narration>
          Have you ever wondered just how BIG space really is?{'\n\n'}
          There are planets, moons, stars, asteroids… and so many places we
          haven't even reached yet. For a very long time, people wondered what
          was hiding out there.{'\n\n'}
          So they built something amazing — little explorers that could travel
          where humans couldn't. Some went to planets. Some visited moons. And
          some traveled farther than anyone had ever gone before.{'\n\n'}
          They took pictures. They measured rocks, dust, weather, and
          mysterious things we couldn't see from Earth.{'\n\n'}
          Today, we're going to meet some of them. Keep scrolling — their
          stories start now.
        </Narration>
      </Spread>

      {/* ---------------- Scene 2 — The First Little Messenger ---------------- */}
      <Spread bg={BG.earth}>
        <CharacterStage>
          <OrbitCharacter mood="curious" size="sm" />
          <SputnikIllustration />
        </CharacterStage>
        <Kicker>1957 · Chapter 1</Kicker>
        <Title>The First Little Messenger</Title>
        <Narration>
          Imagine Earth in 1957. Humans had never placed an artificial
          satellite into orbit before. Then, on October 4th, something
          incredible happened: the Soviet Union launched Sputnik 1 — the first
          artificial satellite to orbit Earth.{'\n\n'}
          It wasn't big. It was a shiny metal sphere, about the size of a beach
          ball. But suddenly, something made by humans was circling our
          planet.
        </Narration>
        <FactTag>
          NASA records Sputnik 1 as the first human-made object to enter Earth
          orbit, on October 4, 1957.
        </FactTag>
        <Speech speaker="Sputnik">
          Beep… beep… beep! I didn't have eyes or wheels like the explorers
          you'll meet later. I sent radio signals back to Earth. Scientists
          listened to those signals and learned how radio waves traveled
          through Earth's atmosphere — and used my orbit to learn more about
          the atmosphere around Earth. I was small… but I helped open the door
          to space.
        </Speech>
        <Narration>And that was only the beginning.</Narration>
      </Spread>

      {/* ---------------- Scene 3 — The Only Choice ---------------- */}
      <Spread bg={BG.choose} wide>
        <div className="text-center">
          <CharacterStage>
            <OrbitCharacter mood="curious" size="md" />
          </CharacterStage>
          <Kicker>Chapter 2 · The Journey Begins</Kicker>
          <Title>Where Should We Go?</Title>
          <Narration>
            You've met our first space messenger. Now it's your turn.
          </Narration>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <button
            onClick={() => choosePath('mars')}
            className="group rounded-3xl border-2 border-orange-400/40 bg-orange-950/30 p-6 text-center transition-all hover:scale-[1.03] hover:border-orange-400"
          >
            <div className="text-4xl">🔴</div>
            <div className="mt-3 font-serif text-xl text-[#ece7dc]">Mars</div>
            <p className="mt-1 text-xs text-[#ece7dc]/70">
              Tiny Sojourner, twin rovers Spirit &amp; Opportunity, and ancient
              water.
            </p>
          </button>

          <button
            onClick={() => choosePath('moon')}
            className="group rounded-3xl border-2 border-slate-400/40 bg-slate-800/30 p-6 text-center transition-all hover:scale-[1.03] hover:border-slate-300"
          >
            <div className="text-4xl">🌕</div>
            <div className="mt-3 font-serif text-xl text-[#ece7dc]">The Moon</div>
            <p className="mt-1 text-xs text-[#ece7dc]/70">
              Luna 1's happy accident, a lunar car, and a telescope on another
              world.
            </p>
          </button>

          <button
            onClick={() => choosePath('deep-space')}
            className="group rounded-3xl border-2 border-indigo-400/40 bg-indigo-950/40 p-6 text-center transition-all hover:scale-[1.03] hover:border-indigo-300"
          >
            <div className="text-4xl">🌌</div>
            <div className="mt-3 font-serif text-xl text-[#ece7dc]">Deep Space</div>
            <p className="mt-1 text-xs text-[#ece7dc]/70">
              Pioneer 10 &amp; 11, Voyager 1, and a golden record among the
              stars.
            </p>
          </button>
        </div>
      </Spread>

      {/* ---------------- Anchor + branch: only the chosen path renders below ---------------- */}
      <div ref={pathStartRef} />

      {path === 'mars' && (
        <>
          <Spread bg={BG.mars}>
            <Kicker>Path · Mars</Kicker>
            <Title>The Red Planet</Title>
            <Narration>
              Mars looks dry and dusty today, but scientists have found clues
              that Mars was very different long ago. And to learn its
              secrets, NASA sent some very brave little explorers.
            </Narration>
          </Spread>

          <Spread bg={BG.mars}>
            <CharacterStage>
              <SojournerIllustration />
            </CharacterStage>
            <Kicker>1997</Kicker>
            <Title>Sojourner</Title>
            <Narration>
              She was tiny — about the size of a microwave. She arrived on
              Mars in 1997 with the Mars Pathfinder mission, and became the
              first wheeled vehicle to operate on another planet.
            </Narration>
            <FactTag>
              NASA confirms Sojourner explored Mars for 83 days, despite being
              designed for a seven-day mission.
            </FactTag>
            <Speech speaker="Sojourner">
              I rolled across the Martian rocks and soil! I took pictures and
              studied the rocks and the atmosphere around me. I was only
              supposed to explore for a few days… but I kept going for 83
              days. Mars is full of surprises!
            </Speech>
          </Spread>

          <Spread bg={BG.mars}>
            <CharacterStage>
              <RoverIllustration name="Spirit" size="sm" />
              <RoverIllustration name="Oppy" size="sm" />
            </CharacterStage>
            <Kicker>2004</Kicker>
            <Title>Spirit &amp; Opportunity</Title>
            <Narration>
              A few years later, two more explorers arrived — twin rovers,
              built to last 90 days each.
            </Narration>
            <Speech speaker="Spirit">
              I climbed hills and studied rocks that told stories about
              Mars's fiery volcanic past. Every ridge had something new to
              learn.
            </Speech>
            <Speech speaker="Opportunity">
              I found something really exciting. Rocks on Mars showed signs
              that liquid water had once been there. That meant Mars wasn't
              always the cold, dry world we see today.
            </Speech>
            <FactTag>
              NASA documents Opportunity's evidence for ancient wet conditions
              on Mars.
            </FactTag>
          </Spread>

          <Spread bg={BG.marsDark}>
            <CharacterStage>
              <RoverIllustration name="Oppy" size="sm" variant="resting" />
            </CharacterStage>
            <Kicker>2018 · The Quiet Goodbye</Kicker>
            <Title>The Last Picture</Title>
            <Narration>
              Opportunity kept exploring for almost 15 years. But eventually,
              Mars gave her a very difficult challenge: a planet-wide dust
              storm covered her part of Mars. Opportunity ran on sunlight —
              and the dust blocked the sun from reaching her solar panels.
            </Narration>
            <FactTag>
              NASA confirms Opportunity's final communication was received on
              June 10, 2018, during that planet-wide dust storm.
            </FactTag>
            <Narration>
              Her last picture wasn't bright or clear. It was mostly darkness.
              But that little picture was enough to remind everyone:
              Opportunity had been there. She had explored. She had
              discovered. And she had helped us understand Mars.{'\n\n'}
              And explorers don't really disappear. What they discover
              becomes the starting point for the explorers who come next.
              Sojourner helped make Spirit and Opportunity possible. Spirit
              and Opportunity helped pave the way for Curiosity and
              Perseverance. The story keeps going.
            </Narration>
          </Spread>
        </>
      )}

      {path === 'moon' && (
        <>
          <Spread bg={BG.moon}>
            <Kicker>Path · The Moon</Kicker>
            <Title>Earth's Closest Neighbor</Title>
            <Narration>
              Let's go somewhere much closer to home — a huge, cratered world
              we can see from our own backyard.
            </Narration>
          </Spread>

          <Spread bg={BG.moon}>
            <CharacterStage>
              <LunaIllustration />
            </CharacterStage>
            <Kicker>1959</Kicker>
            <Title>Luna 1 — The Explorer That Missed</Title>
            <Narration>
              Our first Moon explorer has a funny story. She was supposed to
              hit the Moon… but she missed! Instead, Luna 1 became the first
              spacecraft to leave Earth's immediate neighborhood and enter
              interplanetary space — and along the way, she detected
              something scientists had been searching for: the solar wind, a
              stream of particles flowing from the Sun.
            </Narration>
            <FactTag>
              NASA documents Luna 1 as the first spacecraft to leave
              geocentric orbit, and its detection of solar-wind particles.
            </FactTag>
          </Spread>

          <Spread bg={BG.moon}>
            <CharacterStage>
              <ApolloIllustration />
            </CharacterStage>
            <Kicker>1971</Kicker>
            <Title>Apollo 15 — The Moon Has a Car!</Title>
            <Narration>
              Humans finally began exploring the Moon on foot — and
              eventually, they brought a car. Apollo 15 was the first Apollo
              mission to use the Lunar Roving Vehicle. Astronauts drove
              across the Moon, collected rocks, and studied the mountains and
              valleys around them.
            </Narration>
            <FactTag>
              NASA confirms Apollo 15 returned more than 80 kg of lunar
              samples — including the Genesis Rock, a piece of primordial
              lunar crust about 4 billion years old.
            </FactTag>
          </Spread>

          <Spread bg={BG.moon}>
            <CharacterStage>
              <ApolloIllustration />
            </CharacterStage>
            <Kicker>1972</Kicker>
            <Title>Apollo 16 — Looking Into Space From the Moon</Title>
            <Narration>
              The astronauts didn't just look at the Moon — they used the
              Moon to look back into space. John Young used a telescope from
              the lunar surface to observe star clouds, nebulae, and Earth's
              outer atmosphere.
            </Narration>
            <FactTag>
              NASA confirms this was the first telescope used for astronomical
              observations from the surface of another world.
            </FactTag>
          </Spread>

          <Spread bg={BG.moon}>
            <CharacterStage>
              <ApolloIllustration />
            </CharacterStage>
            <Kicker>1972</Kicker>
            <Title>Apollo 17 — One Last Moon Adventure</Title>
            <Narration>
              Gene Cernan and Harrison Schmitt explored the Taurus-Littrow
              valley and brought home huge amounts of lunar rock and soil —
              including orange volcanic material that told scientists about
              ancient volcanic activity on the Moon.{'\n\n'}
              The astronauts left the Moon, but they didn't leave
              empty-handed. They brought pieces of another world home. And
              scientists are still studying those rocks today.
            </Narration>
            <FactTag>
              NASA notes Apollo missions returned 2,196 samples totaling about
              382 kg, still used to study the Moon's history.
            </FactTag>
          </Spread>
        </>
      )}

      {path === 'deep-space' && (
        <>
          <Spread bg={BG.deep}>
            <Kicker>Path · Deep Space</Kicker>
            <Title>Leaving the Planets Behind</Title>
            <Narration>
              This time we're going really far. Earth becomes tiny behind us.
              Welcome to deep space.
            </Narration>
          </Spread>

          <Spread bg={BG.deep}>
            <CharacterStage>
              <PioneerIllustration />
            </CharacterStage>
            <Kicker>1972</Kicker>
            <Title>Pioneer 10 — The Trailblazer</Title>
            <Narration>
              In 1972, Pioneer 10 began a journey farther than any spacecraft
              had gone before. She became the first spacecraft to travel
              through the main asteroid belt, and the first to fly past
              Jupiter — then continued on a path that could carry her out
              toward interstellar space.
            </Narration>
            <FactTag>
              NASA documents Pioneer 10's launch on March 2, 1972, and both of
              these milestones.
            </FactTag>
          </Spread>

          <Spread bg={BG.deep}>
            <CharacterStage>
              <PioneerIllustration />
            </CharacterStage>
            <Kicker>1973</Kicker>
            <Title>Pioneer 11 &amp; the Golden Plaque</Title>
            <Narration>
              Her twin, Pioneer 11, followed the trail and became the first
              spacecraft to get a close look at Saturn. Both Pioneers also
              carried something unusual: a plaque with a picture of humans, a
              map of our Solar System, and clues about where we came from.
            </Narration>
            <FactTag>
              NASA confirms both plaques were designed to help identify
              Earth's location, in case either spacecraft was ever found.
            </FactTag>
          </Spread>

          <Spread bg={BG.deep}>
            <CharacterStage>
              <VoyagerIllustration />
            </CharacterStage>
            <Kicker>1977 → 2012</Kicker>
            <Title>Voyager 1 — The Traveller Who Kept Going</Title>
            <Narration>
              Voyager 1 visited Jupiter and Saturn, discovering new moons and
              a thin ring around Jupiter. Then it kept going. In 2012,
              Voyager 1 crossed into interstellar space — becoming the first
              human-made object to reach that enormous space between the
              stars.
            </Narration>
            <FactTag>
              NASA identifies Voyager 1 as the first human-made object to
              reach interstellar space, and the most distant human-made
              object.
            </FactTag>
          </Spread>

          <Spread bg={BG.deep}>
            <CharacterStage>
              <VoyagerIllustration />
            </CharacterStage>
            <Kicker>The Golden Record</Kicker>
            <Title>"Hello, This Is Who We Are"</Title>
            <Narration>
              Voyager carried something more special than its instruments: a
              golden record filled with sounds, pictures, and greetings from
              people around our planet. It was like saying hello to the
              universe.{'\n\n'}
              Voyager is still traveling — farther and farther away, carrying
              a tiny piece of Earth into the darkness between the stars.
            </Narration>
            <FactTag>
              NASA confirms the Golden Record contains 115 images, natural
              sounds, music from many cultures, and greetings in 55 languages.
            </FactTag>
          </Spread>
        </>
      )}

      {/* ---------------- Finale — same for every path ---------------- */}
      {path && (
        <Spread bg={BG.finale}>
          <CharacterStage>
            <OrbitCharacter mood="happy" size="lg" />
          </CharacterStage>
          <Kicker>Finale</Kicker>
          <Title>They Are Still Part of Our Story</Title>
          <Narration>
            Space isn't just about planets and stars. It's about questions.
            What's over there? What is Mars really like? How did the Moon
            form? What is beyond our Solar System?{'\n\n'}
            And every time humans asked a question, we built an explorer to
            go looking for the answer.{'\n\n'}
            Some explorers became silent. Some are still traveling. Some left
            their footprints on another world. Some carried their discoveries
            all the way back home. But every one of them left something
            behind: a little more knowledge about our universe.
          </Narration>
          <p className="mt-6 font-serif text-xl italic text-amber-200 sm:text-2xl">
            And who knows? Maybe one day, you'll be the one asking the next
            big question.
          </p>

          {onFinish && (
            <button
              onClick={onFinish}
              className="mt-10 rounded-full bg-[#c1440e] px-8 py-3 text-sm font-semibold text-white transition-transform hover:scale-105"
            >
              Close the Book
            </button>
          )}
        </Spread>
      )}
    </div>
  );
};

export default OppyStory;