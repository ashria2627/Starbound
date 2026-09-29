/**
 * MarsRoverGame.tsx
 * First-person Mars rover exploration game.
 * Requires: three, @react-three/fiber, @react-three/drei
 *   npm i @react-three/drei
 *
 * Drop this in src/components/simulation/. Swap in for (or alongside)
 * MissionSimulation3D — same "first-person rover on Mars" idea, but a
 * full game loop: day/night cycle, procedural terrain w/ craters,
 * mud + gas-vent hazards, and discovery achievements. Works with
 * touch (phone joystick + drag-look) and keyboard+mouse.
 */
import React, { useRef, useMemo, useState, useCallback, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

// ---------- Terrain generation (seeded value noise + craters) ----------

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(x: number, z: number): number {
  const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453123;
  return s - Math.floor(s);
}
function noise2D(x: number, z: number): number {
  const xi = Math.floor(x), zi = Math.floor(z);
  const xf = x - xi, zf = z - zi;
  const u = xf * xf * (3 - 2 * xf);
  const v = zf * zf * (3 - 2 * zf);
  const a = hash(xi, zi), b = hash(xi + 1, zi);
  const c = hash(xi, zi + 1), d = hash(xi + 1, zi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function fbm(x: number, z: number, octaves = 5): number {
  let total = 0, amp = 1, freq = 1, max = 0;
  for (let i = 0; i < octaves; i++) {
    total += noise2D(x * freq, z * freq) * amp;
    max += amp;
    amp *= 0.5;
    freq *= 2;
  }
  return total / max;
}

const TERRAIN_SIZE = 240;
const SEGMENTS = 160;
const SPAWN_CLEAR_RADIUS = 14;

const rng = mulberry32(1337);

const CRATERS = Array.from({ length: 7 }, () => ({
  x: (rng() - 0.5) * TERRAIN_SIZE * 0.85,
  z: (rng() - 0.5) * TERRAIN_SIZE * 0.85,
  r: 8 + rng() * 16,
  depth: 2 + rng() * 4,
})).filter((c) => Math.hypot(c.x, c.z) > SPAWN_CLEAR_RADIUS);

function craterOffset(x: number, z: number): number {
  let offset = 0;
  for (const c of CRATERS) {
    const d = Math.hypot(x - c.x, z - c.z);
    if (d < c.r) {
      const t = d / c.r;
      offset -= c.depth * (1 - t * t);
    }
  }
  return offset;
}

function getHeightAt(x: number, z: number): number {
  const base = fbm(x * 0.025, z * 0.025) * 7;
  const detail = fbm(x * 0.12, z * 0.12) * 0.8;
  return base + detail + craterOffset(x, z);
}

type Zone = { x: number; z: number; r: number };
type Discovery = { id: string; name: string; note: string; x: number; z: number };

function scatterZones(count: number, minR: number, maxR: number, seedOffset: number): Zone[] {
  const r2 = mulberry32(seedOffset);
  const zones: Zone[] = [];
  for (let i = 0; i < count; i++) {
    const x = (r2() - 0.5) * TERRAIN_SIZE * 0.9;
    const z = (r2() - 0.5) * TERRAIN_SIZE * 0.9;
    if (Math.hypot(x, z) < SPAWN_CLEAR_RADIUS) continue;
    zones.push({ x, z, r: minR + r2() * (maxR - minR) });
  }
  return zones;
}

const MUD_ZONES: Zone[] = scatterZones(9, 4, 9, 42);
const GAS_VENTS: Zone[] = scatterZones(6, 2, 4, 77);
const ROCKS: Zone[] = scatterZones(26, 0.8, 2.4, 9);

const DISCOVERIES: Discovery[] = [
  { id: 'water-ice', name: 'Water-Ice Deposit', note: 'Frozen water just under the regolith.', x: 40, z: -55 },
  { id: 'meteorite', name: 'Iron Meteorite', note: 'A fragment that fell long before you arrived.', x: -70, z: 30 },
  { id: 'crater-core', name: 'Ancient Crater Core', note: 'Exposed bedrock from a very old impact.', x: 60, z: 60 },
  { id: 'dry-riverbed', name: 'Dry Riverbed', note: 'Evidence Mars once had flowing water.', x: -30, z: -70 },
  { id: 'dune-field', name: 'Wind-Carved Dunes', note: 'Sand shaped by thousands of years of wind.', x: 90, z: 10 },
  { id: 'polar-frost', name: 'Morning Frost Patch', note: 'A thin layer of frost, gone by midday.', x: -95, z: -20 },
];

// ---------- Terrain mesh ----------

function TerrainMesh() {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(TERRAIN_SIZE, TERRAIN_SIZE, SEGMENTS, SEGMENTS);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const colors = new Float32Array(pos.count * 3);
    const rust = new THREE.Color('#8a3a1e');
    const dust = new THREE.Color('#c98c5c');
    const dark = new THREE.Color('#3d1f12');
    const mud = new THREE.Color('#2a1a12');

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const y = getHeightAt(x, z);
      pos.setY(i, y);

      let color = rust.clone();
      const t = THREE.MathUtils.clamp((y + 4) / 12, 0, 1);
      color.lerp(dust, t);
      if (y < -2) color.lerp(dark, THREE.MathUtils.clamp((-2 - y) / 4, 0, 0.6));
      for (const m of MUD_ZONES) {
        const d = Math.hypot(x - m.x, z - m.z);
        if (d < m.r) color.lerp(mud, 1 - d / m.r);
      }
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial vertexColors roughness={1} metalness={0} />
    </mesh>
  );
}

function Rocks() {
  return (
    <group>
      {ROCKS.map((r, i) => (
        <mesh
          key={i}
          position={[r.x, getHeightAt(r.x, r.z) + r.r * 0.4, r.z]}
          rotation={[rng() * Math.PI, rng() * Math.PI, rng() * Math.PI]}
          castShadow
          receiveShadow
        >
          <dodecahedronGeometry args={[r.r, 0]} />
          <meshStandardMaterial color="#5a3624" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

function GasVents() {
  const groups = useRef<THREE.Points[]>([]);
  useFrame((_, delta) => {
    groups.current.forEach((pts) => {
      if (!pts) return;
      const arr = (pts.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
      for (let i = 1; i < arr.length; i += 3) {
        arr[i] += delta * 1.2;
        if (arr[i] > 4) arr[i] = 0;
      }
      (pts.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    });
  });
  return (
    <group>
      {GAS_VENTS.map((v, i) => {
        const count = 40;
        const positions = new Float32Array(count * 3);
        for (let p = 0; p < count; p++) {
          const ang = rng() * Math.PI * 2;
          const rad = rng() * v.r;
          positions[p * 3] = Math.cos(ang) * rad;
          positions[p * 3 + 1] = rng() * 4;
          positions[p * 3 + 2] = Math.sin(ang) * rad;
        }
        return (
          <points
            key={i}
            ref={(el) => (groups.current[i] = el as THREE.Points)}
            position={[v.x, getHeightAt(v.x, v.z), v.z]}
          >
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            </bufferGeometry>
            <pointsMaterial color="#d7c98a" size={0.35} transparent opacity={0.55} depthWrite={false} />
          </points>
        );
      })}
    </group>
  );
}

function DiscoveryMarkers({ found }: { found: Set<string> }) {
  return (
    <group>
      {DISCOVERIES.filter((d) => !found.has(d.id)).map((d) => (
        <mesh key={d.id} position={[d.x, getHeightAt(d.x, d.z) + 0.6, d.z]}>
          <octahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial color="#7fd6e8" emissive="#2f8fa8" emissiveIntensity={1.2} />
        </mesh>
      ))}
    </group>
  );
}

// ---------- Day / night sky ----------

const CYCLE_SECONDS = 240; // full day+night loop

function SkyAndSun({ timeRef }: { timeRef: React.MutableRefObject<number> }) {
  const sunRef = useRef<THREE.DirectionalLight>(null);
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const { scene } = useThree();

  const dayColor = useMemo(() => new THREE.Color('#d98a5c'), []);
  const noonColor = useMemo(() => new THREE.Color('#e7c9a8'), []);
  const nightColor = useMemo(() => new THREE.Color('#0b0d12'), []);
  const tmpColor = useMemo(() => new THREE.Color(), []);

  useFrame((_, delta) => {
    timeRef.current = (timeRef.current + delta / CYCLE_SECONDS) % 1;
    const t = timeRef.current; // 0..1 over full day
    const sunAngle = t * Math.PI * 2 - Math.PI / 2;
    const sunHeight = Math.sin(sunAngle);
    const dayFactor = THREE.MathUtils.clamp(sunHeight + 0.15, 0, 1);

    if (sunRef.current) {
      sunRef.current.position.set(Math.cos(sunAngle) * 100, Math.max(sunHeight, -0.1) * 100 + 5, 40);
      sunRef.current.intensity = 0.15 + dayFactor * 1.6;
      tmpColor.copy(nightColor).lerp(dayColor, Math.min(dayFactor * 2, 1));
      tmpColor.lerp(noonColor, Math.max(dayFactor - 0.5, 0) * 2);
      sunRef.current.color.copy(tmpColor);
    }
    if (ambientRef.current) ambientRef.current.intensity = 0.12 + dayFactor * 0.55;

    tmpColor.copy(nightColor).lerp(dayColor, Math.min(dayFactor * 1.4, 1));
    scene.background = tmpColor.clone();
    if (scene.fog && scene.fog instanceof THREE.Fog) scene.fog.color = tmpColor.clone();
  });

  return (
    <>
      <ambientLight ref={ambientRef} />
      <directionalLight ref={sunRef} castShadow shadow-mapSize={[1024, 1024]} />
      <Stars radius={200} depth={60} count={3000} factor={4} fade speed={0.5} />
      <fog attach="fog" args={['#0b0d12', 20, 160]} />
    </>
  );
}

// ---------- Rover input + controller ----------

type Controls = {
  move: { x: number; y: number }; // -1..1 joystick vector (y forward)
  lookDelta: { yaw: number; pitch: number }; // accumulated, drained each frame
  keys: Set<string>;
};

type HazardState = 'none' | 'mud' | 'gas';

function RoverRig({
  controls,
  onHazard,
  onDiscover,
  onHeading,
}: {
  controls: React.MutableRefObject<Controls>;
  onHazard: (h: HazardState) => void;
  onDiscover: (id: string) => void;
  onHeading: (deg: number) => void;
}) {
  const { camera } = useThree();
  const pos = useRef(new THREE.Vector3(0, 0, 0));
  const yaw = useRef(0);
  const pitch = useRef(0);
  const stuckTimer = useRef(0);
  const foundRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    pos.current.set(0, getHeightAt(0, 0) + 1.4, 0);
  }, []);

  useFrame((_, delta) => {
    const c = controls.current;
    yaw.current -= c.lookDelta.yaw;
    pitch.current = THREE.MathUtils.clamp(pitch.current - c.lookDelta.pitch, -1.1, 1.1);
    c.lookDelta.yaw = 0;
    c.lookDelta.pitch = 0;

    let mx = c.move.x, mz = c.move.y;
    if (c.keys.has('w') || c.keys.has('arrowup')) mz += 1;
    if (c.keys.has('s') || c.keys.has('arrowdown')) mz -= 1;
    if (c.keys.has('a') || c.keys.has('arrowleft')) mx -= 1;
    if (c.keys.has('d') || c.keys.has('arrowright')) mx += 1;
    mx = THREE.MathUtils.clamp(mx, -1, 1);
    mz = THREE.MathUtils.clamp(mz, -1, 1);

    // Hazard check at current position
    let hazard: HazardState = 'none';
    let speedMul = 1;
    for (const m of MUD_ZONES) {
      if (Math.hypot(pos.current.x - m.x, pos.current.z - m.z) < m.r) {
        hazard = 'mud';
        speedMul = 0.28;
      }
    }
    for (const v of GAS_VENTS) {
      if (Math.hypot(pos.current.x - v.x, pos.current.z - v.z) < v.r) hazard = 'gas';
    }
    if (hazard === 'mud') {
      stuckTimer.current += delta;
      if (stuckTimer.current > 2.5) speedMul = 0.05; // briefly stuck
      if (stuckTimer.current > 4) stuckTimer.current = 0; // breaks free
    } else {
      stuckTimer.current = 0;
    }
    onHazard(hazard);

    const speed = 6 * speedMul;
    const forward = new THREE.Vector3(Math.sin(yaw.current), 0, Math.cos(yaw.current));
    const right = new THREE.Vector3(Math.cos(yaw.current), 0, -Math.sin(yaw.current));
    const move = forward.multiplyScalar(mz).add(right.multiplyScalar(mx));
    if (move.lengthSq() > 0) move.normalize().multiplyScalar(speed * delta);

    let nx = pos.current.x + move.x;
    let nz = pos.current.z + move.z;

    // Rock collision (simple push-out)
    for (const r of ROCKS) {
      const d = Math.hypot(nx - r.x, nz - r.z);
      const minD = r.r + 0.8;
      if (d < minD && d > 0.001) {
        const push = (minD - d) / d;
        nx += (nx - r.x) * push;
        nz += (nz - r.z) * push;
      }
    }

    const half = TERRAIN_SIZE / 2 - 2;
    nx = THREE.MathUtils.clamp(nx, -half, half);
    nz = THREE.MathUtils.clamp(nz, -half, half);
    pos.current.x = nx;
    pos.current.z = nz;
    pos.current.y = getHeightAt(nx, nz) + 1.4;

    camera.position.copy(pos.current);
    camera.rotation.set(pitch.current, yaw.current, 0, 'YXZ');

    onHeading(((yaw.current * 180) / Math.PI + 360) % 360);

    for (const d of DISCOVERIES) {
      if (foundRef.current.has(d.id)) continue;
      if (Math.hypot(pos.current.x - d.x, pos.current.z - d.z) < 3) {
        foundRef.current.add(d.id);
        onDiscover(d.id);
      }
    }
  });

  return null;
}

// ---------- HUD ----------

function Joystick({ onChange }: { onChange: (v: { x: number; y: number }) => void }) {
  const baseRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const touchId = useRef<number | null>(null);

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      const base = baseRef.current;
      if (!base) return;
      const rect = base.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      let dx = clientX - cx;
      let dy = clientY - cy;
      const max = rect.width / 2;
      const dist = Math.min(Math.hypot(dx, dy), max);
      const ang = Math.atan2(dy, dx);
      dx = Math.cos(ang) * dist;
      dy = Math.sin(ang) * dist;
      setKnob({ x: dx, y: dy });
      onChange({ x: dx / max, y: -dy / max });
    },
    [onChange]
  );

  return (
    <div
      ref={baseRef}
      className="absolute bottom-8 left-8 h-28 w-28 rounded-full border border-[#ece7dc]/30 bg-black/30 touch-none select-none"
      onPointerDown={(e) => {
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        touchId.current = e.pointerId;
        setActive(true);
        handleMove(e.clientX, e.clientY);
      }}
      onPointerMove={(e) => {
        if (touchId.current === e.pointerId) handleMove(e.clientX, e.clientY);
      }}
      onPointerUp={(e) => {
        if (touchId.current === e.pointerId) {
          touchId.current = null;
          setActive(false);
          setKnob({ x: 0, y: 0 });
          onChange({ x: 0, y: 0 });
        }
      }}
    >
      <div
        className="absolute h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c1440e]"
        style={{
          left: `calc(50% + ${knob.x}px)`,
          top: `calc(50% + ${knob.y}px)`,
          opacity: active ? 0.9 : 0.6,
        }}
      />
    </div>
  );
}

export default function MarsRoverGame() {
  const controls = useRef<Controls>({ move: { x: 0, y: 0 }, lookDelta: { yaw: 0, pitch: 0 }, keys: new Set() });
  const timeRef = useRef(0.3);
  const [hazard, setHazard] = useState<HazardState>('none');
  const [heading, setHeading] = useState(0);
  const [found, setFound] = useState<Set<string>>(new Set());
  const [toasts, setToasts] = useState<{ id: string; text: string }[]>([]);
  const lookTouchId = useRef<number | null>(null);
  const lastLook = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const down = (e: KeyboardEvent) => controls.current.keys.add(e.key.toLowerCase());
    const up = (e: KeyboardEvent) => controls.current.keys.delete(e.key.toLowerCase());
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  const handleDiscover = useCallback((id: string) => {
    const d = DISCOVERIES.find((x) => x.id === id);
    if (!d) return;
    setFound((prev) => new Set(prev).add(id));
    const toastId = `${id}-${Date.now()}`;
    setToasts((t) => [...t, { id: toastId, text: `Discovery unlocked: ${d.name}` }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== toastId)), 4000);
  }, []);

  const onLookPointerMove = (e: React.PointerEvent) => {
    if (lookTouchId.current !== e.pointerId) return;
    const dx = e.clientX - lastLook.current.x;
    const dy = e.clientY - lastLook.current.y;
    lastLook.current = { x: e.clientX, y: e.clientY };
    controls.current.lookDelta.yaw += dx * 0.004;
    controls.current.lookDelta.pitch += dy * 0.004;
  };

  return (
    <div className="relative h-full w-full bg-[#0b0d12]">
      <Canvas shadows camera={{ fov: 70, near: 0.1, far: 400 }}>
        <SkyAndSun timeRef={timeRef} />
        <TerrainMesh />
        <Rocks />
        <GasVents />
        <DiscoveryMarkers found={found} />
        <RoverRig
          controls={controls}
          onHazard={setHazard}
          onDiscover={handleDiscover}
          onHeading={setHeading}
        />
      </Canvas>

      {/* Full-screen drag-to-look layer (behind joystick, above canvas) */}
      <div
        className="absolute inset-0 touch-none"
        onPointerDown={(e) => {
          lookTouchId.current = e.pointerId;
          lastLook.current = { x: e.clientX, y: e.clientY };
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
        }}
        onPointerMove={onLookPointerMove}
        onPointerUp={(e) => {
          if (lookTouchId.current === e.pointerId) lookTouchId.current = null;
        }}
      />

      <Joystick onChange={(v) => (controls.current.move = v)} />

      {/* Telemetry bar */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3 font-mono text-xs text-[#ece7dc]">
        <span>HDG {Math.round(heading).toString().padStart(3, '0')}°</span>
        <span>{Math.round(timeRef.current * 24) % 24}:00 MARS TIME</span>
        <span>DISCOVERIES {found.size}/{DISCOVERIES.length}</span>
      </div>

      {hazard !== 'none' && (
        <div className="pointer-events-none absolute top-14 left-1/2 -translate-x-1/2 rounded bg-[#c1440e]/90 px-4 py-1.5 text-xs font-semibold text-white">
          {hazard === 'mud' ? '⚠ Losing traction — soft sand' : '⚠ Gas vent nearby — proceed carefully'}
        </div>
      )}

      <div className="pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
        {toasts.map((t) => (
          <div key={t.id} className="rounded bg-[#7fd6e8]/90 px-4 py-1.5 text-xs font-semibold text-[#0b0d12]">
            {t.text}
          </div>
        ))}
      </div>
    </div>
  );
}
