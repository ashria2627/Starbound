import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Check,
  X,
  Layers,
  Compass,
  Film,
  Image as ImageIcon,
  Navigation,
  Gamepad2,
} from 'lucide-react';
import { BotMission, SimulationPOI } from '../../types';
import { BOT_MISSIONS } from '../../data/missions';
import { getRealTerrainForBot, LandingSiteTerrainData } from './realTerrainData';
import { ReadAloudButton } from '../ReadAloudButton';
import { playChimeSound, triggerCelebrationConfetti } from '../../utils/speechAudio';

interface MissionSimulation3DProps {
  currentBot: BotMission;
  onSelectBot: (bot: BotMission) => void;
  onCloseSimulation: () => void;
  onDiscoveryUnlocked: (poiId: string, botId: string) => void;
  unlockedPoiIds: string[];
}

// -----------------------------------------------------------------------------
// 3D Scene Controller & Camera Mover (Mouse/Touch Drag Yaw & Pitch)
// -----------------------------------------------------------------------------
interface VehicleControllerProps {
  envType: 'mars' | 'moon' | 'deep_space';
  pois: SimulationPOI[];
  terrainData: LandingSiteTerrainData | null;
  lookRotationRef: React.MutableRefObject<{ yaw: number; pitch: number }>;
  onPositionUpdate: (pos: { x: number; z: number; speed: number; heading: number }) => void;
  onReachPOI: (poi: SimulationPOI) => void;
  moveState: { forward: boolean; backward: boolean; left: boolean; right: boolean };
  resetTrigger: number;
  targetAutonavPoi: SimulationPOI | null;
  onCancelAutonav: () => void;
  explorerMode: boolean;
  obstacles: { x: number; z: number; scale: number; rot: number }[];
  sandTraps: { x: number; z: number; radius: number }[];
  onStuckChange: (message: string | null) => void;
}

function VehicleController({
  envType,
  pois,
  terrainData,
  lookRotationRef,
  onPositionUpdate,
  onReachPOI,
  moveState,
  resetTrigger,
  targetAutonavPoi,
  onCancelAutonav,
  explorerMode,
  obstacles,
  sandTraps,
  onStuckChange,
}: VehicleControllerProps) {
  const vehicleRef = useRef<THREE.Group>(null);
  const posRef = useRef(new THREE.Vector3(0, envType === 'deep_space' ? 0 : 1.2, 0));
  const speedRef = useRef(0);
  const distanceRef = useRef(0);
  const lastNearPoiRef = useRef<string | null>(null);
  const stuckRef = useRef(false);
  const escapeProgressRef = useRef(0);
  const lastMoveDirRef = useRef<'forward' | 'backward' | null>(null);
  const collisionCooldownRef = useRef(0);

  // Reset when user clicks reset or bot changes
  useEffect(() => {
    posRef.current.set(0, envType === 'deep_space' ? 0 : 1.2, 0);
    lookRotationRef.current.yaw = 0;
    lookRotationRef.current.pitch = 0;
    speedRef.current = 0;
    distanceRef.current = 0;
    lastNearPoiRef.current = null;
  }, [resetTrigger, envType, lookRotationRef]);

  // Cancel autonav when user presses directional controls
  useEffect(() => {
    if (moveState.forward || moveState.backward || moveState.left || moveState.right) {
      if (targetAutonavPoi) {
        onCancelAutonav();
      }
    }
  }, [moveState, targetAutonavPoi, onCancelAutonav]);

  useFrame((state, delta) => {
    const maxSpeed = envType === 'deep_space' ? 14 : 7;
    const accel = envType === 'deep_space' ? 12 : 8;
    const friction = envType === 'deep_space' ? 0.985 : 0.92;
    const turnRate = envType === 'deep_space' ? 1.8 : 1.5;

    // Autonavigation towards a selected point of interest (Simple Kid Mode feature)
    if (targetAutonavPoi) {
      const dx = targetAutonavPoi.position[0] - posRef.current.x;
      const dz = targetAutonavPoi.position[2] - posRef.current.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist < Math.max(3.5, targetAutonavPoi.radius)) {
        onReachPOI(targetAutonavPoi);
        onCancelAutonav();
        speedRef.current = 0;
      } else {
        const desiredYaw = Math.atan2(-dx, -dz);
        let diff = desiredYaw - lookRotationRef.current.yaw;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;

        lookRotationRef.current.yaw += Math.max(-2.2 * delta, Math.min(2.2 * delta, diff * 3.5 * delta));
        speedRef.current = Math.min(maxSpeed * 0.75, speedRef.current + accel * delta);
      }
    } else {
      // Manual Keyboard / D-Pad Turn adjustments to horizontal yaw
      if (moveState.left) {
        lookRotationRef.current.yaw += turnRate * delta;
      }
      if (moveState.right) {
        lookRotationRef.current.yaw -= turnRate * delta;
      }

      // Accelerate
      if (moveState.forward) {
        speedRef.current = Math.min(maxSpeed, speedRef.current + accel * delta);
      } else if (moveState.backward) {
        speedRef.current = Math.max(-maxSpeed * 0.5, speedRef.current - accel * delta);
      } else {
        speedRef.current *= friction;
      }
    }

    if (Math.abs(speedRef.current) < 0.01) speedRef.current = 0;

    const currentYaw = lookRotationRef.current.yaw;
    const currentPitch = lookRotationRef.current.pitch; // full 360° look, always active

    // Move forward in current yaw direction
    const forwardX = -Math.sin(currentYaw) * speedRef.current * delta;
    const forwardZ = -Math.cos(currentYaw) * speedRef.current * delta;

    posRef.current.x += forwardX;
    posRef.current.z += forwardZ;

    // ---- ROCK COLLISION: bump the rover back if it drives into a boulder ----
    if (collisionCooldownRef.current > 0) collisionCooldownRef.current -= delta;
    if (envType !== 'deep_space') {
      for (const rock of obstacles) {
        const rockRadius = rock.scale * 1.1; // approx boulder footprint
        const dx = posRef.current.x - rock.x;
        const dz = posRef.current.z - rock.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        const minDist = rockRadius + 0.9; // + rover half-width
        if (dist < minDist && dist > 0.0001) {
          // Push the rover back out along the collision normal
          const pushX = (dx / dist) * (minDist - dist);
          const pushZ = (dz / dist) * (minDist - dist);
          posRef.current.x += pushX;
          posRef.current.z += pushZ;
          speedRef.current *= -0.25; // bounce back a little, like hitting real rock
          if (collisionCooldownRef.current <= 0) {
            collisionCooldownRef.current = 0.6;
            playChimeSound('discovery'); // TODO: swap for a dedicated "thud" SFX if you add one
          }
          break;
        }
      }
    }

    // ---- SOFT SAND TRAPS: rovers like Spirit really did get bogged down ----
    let inTrapNow = false;
    for (const trap of sandTraps) {
      const dx = posRef.current.x - trap.x;
      const dz = posRef.current.z - trap.z;
      if (Math.sqrt(dx * dx + dz * dz) < trap.radius) {
        inTrapNow = true;
        break;
      }
    }

    if (inTrapNow) {
      // Heavily dampen speed — wheels are spinning in soft sand
      speedRef.current *= 0.55;
      if (!stuckRef.current) {
        stuckRef.current = true;
        escapeProgressRef.current = 0;
        onStuckChange("Uh oh — soft sand! Push forward and backward to rock free, just like a real rover.");
      }
      // Rocking mechanic: alternating forward/backward builds escape progress
      const dir: 'forward' | 'backward' | null = moveState.forward
        ? 'forward'
        : moveState.backward
        ? 'backward'
        : null;
      if (dir && dir !== lastMoveDirRef.current) {
        escapeProgressRef.current += 1;
        lastMoveDirRef.current = dir;
      }
      if (escapeProgressRef.current >= 4) {
        stuckRef.current = false;
        onStuckChange(null);
        speedRef.current = (moveState.forward ? 1 : -1) * maxSpeed * 0.6; // pop free
      }
    } else if (stuckRef.current) {
      stuckRef.current = false;
      onStuckChange(null);
    }

    // Keep within world bounds
    posRef.current.x = Math.max(-80, Math.min(80, posRef.current.x));
    posRef.current.z = Math.max(-125, Math.min(15, posRef.current.z));

    const movedStep = Math.sqrt(forwardX * forwardX + forwardZ * forwardZ);
    distanceRef.current += movedStep;

    // Sample real elevation from MOLA/LOLA heightmap grid
    let groundElevation = 0;
    if (envType !== 'deep_space' && terrainData) {
      // Map x (-80 to 80) and z (-125 to 15) to UV (0 to 1) on the plane
      const normU = (posRef.current.x + 90) / 180;
      const normV = (posRef.current.z + 130) / 160;
      groundElevation = terrainData.sampleElevation(normU, normV);
    }

    const eyeHeight = envType === 'deep_space' ? 0 : 1.3;
    posRef.current.y = THREE.MathUtils.lerp(
      posRef.current.y,
      groundElevation + eyeHeight,
      0.15
    );

    // Subtle rover cockpit vibration when driving
    const bob = Math.sin(state.clock.elapsedTime * 8) * (speedRef.current > 0.5 ? 0.03 : 0.005);

    // Apply position to Three.js camera
    state.camera.position.x = posRef.current.x;
    state.camera.position.y = posRef.current.y;
    state.camera.position.z = posRef.current.z;

    // Calculate look target vector from drag yaw and pitch (clamped)
    const cosPitch = Math.cos(currentPitch);
    const lookDirX = -Math.sin(currentYaw) * cosPitch;
    const lookDirY = Math.sin(currentPitch);
    const lookDirZ = -Math.cos(currentYaw) * cosPitch;

    const targetX = posRef.current.x + lookDirX * 10;
    const targetY = posRef.current.y + lookDirY * 10 + bob;
    const targetZ = posRef.current.z + lookDirZ * 10;
    state.camera.lookAt(targetX, targetY, targetZ);

    // Sync vehicle model in front of camera for deep space probes
    if (vehicleRef.current) {
      vehicleRef.current.position.set(
        posRef.current.x - Math.sin(currentYaw) * 3,
        posRef.current.y - 0.7 + bob,
        posRef.current.z - Math.cos(currentYaw) * 3
      );
      vehicleRef.current.rotation.y = currentYaw + Math.PI;
    }

    // Telemetry updates
    const degHeading = Math.round((((currentYaw * 180) / Math.PI) % 360 + 360) % 360);
    onPositionUpdate({
      x: posRef.current.x,
      z: posRef.current.z,
      speed: Math.abs(speedRef.current * 3.6), // km/h
      heading: degHeading,
    });

    // POI proximity detection
    let foundNearby = false;
    for (const poi of pois) {
      const dx = posRef.current.x - poi.position[0];
      const dz = posRef.current.z - poi.position[2];
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist <= poi.radius) {
        foundNearby = true;
        if (lastNearPoiRef.current !== poi.id) {
          lastNearPoiRef.current = poi.id;
          onReachPOI(poi);
        }
        break;
      }
    }
    if (!foundNearby) {
      lastNearPoiRef.current = null;
    }
  });

  return (
    <>
      {envType === 'deep_space' && (
        <group ref={vehicleRef}>
          {/* Probe Body */}
          <mesh>
            <cylinderGeometry args={[0.5, 0.4, 0.8, 8]} />
            <meshStandardMaterial color="#c084fc" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Radio Dish */}
          <mesh position={[0, 0.5, 0.3]} rotation={[0.4, 0, 0]}>
            <coneGeometry args={[1.1, 0.35, 16, 1, true]} />
            <meshStandardMaterial color="#f1f5f9" side={THREE.DoubleSide} />
          </mesh>
          {/* RTG Power Boom */}
          <mesh position={[-1.2, -0.2, -0.4]} rotation={[0, 0, 0.5]}>
            <cylinderGeometry args={[0.08, 0.08, 1.8, 6]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          <mesh position={[-1.9, -0.4, -0.4]}>
            <boxGeometry args={[0.4, 0.4, 0.4]} />
            <meshStandardMaterial color="#ef4444" emissive="#7f1d1d" emissiveIntensity={0.6} />
          </mesh>
          {/* Science Boom & Gold Plaque / Record */}
          <mesh position={[1.1, -0.1, -0.2]}>
            <cylinderGeometry args={[0.05, 0.05, 1.5, 6]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
          <mesh position={[1.6, -0.1, -0.2]} rotation={[0, 1.5, 0]}>
            <cylinderGeometry args={[0.35, 0.35, 0.02, 16]} />
            <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      )}
    </>
  );
}

// -----------------------------------------------------------------------------
// Real Terrain & Environment (NASA MOLA / LOLA Data)
// -----------------------------------------------------------------------------
interface Environment3DProps {
  botId: string;
  envType: 'mars' | 'moon' | 'deep_space';
  fogColor: string;
  terrainData: LandingSiteTerrainData | null;
  obstacles: { x: number; z: number; scale: number; rot: number }[];
  sandTraps: { x: number; z: number; radius: number }[];
}

function Environment3D({ envType, fogColor, terrainData, obstacles, sandTraps }: Environment3DProps) {
  const boulders = obstacles;

  return (
    <>
      <ambientLight intensity={envType === 'deep_space' ? 0.35 : envType === 'moon' ? 0.5 : 0.95} />
      <directionalLight
        position={[40, 60, 20]}
        intensity={envType === 'moon' ? 1.8 : envType === 'mars' ? 2.1 : 1.4}
        color={envType === 'mars' ? '#fff4e0' : '#ffffff'}
      />
      {/* Soft warm fill light for Mars daytime, avoids harsh shadows reading as "night" */}
      {envType === 'mars' && <hemisphereLight args={['#ffd9a8', '#c1440e', 0.55]} />}
      <fog attach="fog" args={[fogColor, 20, envType === 'deep_space' ? 140 : 110]} />

      {/* Starfield — only visible in Deep Space. A daytime Mars/Moon sky (lit by
          the Sun) would not show stars, so rendering them there is what made
          the scene read as "night." */}
      {envType === 'deep_space' && (
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      )}

      {/* Moon Sky: Earth hanging in the sky */}
      {envType === 'moon' && (
        <mesh position={[25, 45, -70]}>
          <sphereGeometry args={[4.5, 32, 32]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={0.25}
            roughness={0.6}
          />
        </mesh>
      )}

      {/* Mars Sky: Distant Phobos & Rust Haze */}
      {envType === 'mars' && (
        <mesh position={[-30, 40, -85]}>
          <sphereGeometry args={[1.5, 16, 16]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.9} />
        </mesh>
      )}

      {/* REAL TERRAIN for Mars & Moon: Displaced with actual NASA MOLA/LOLA data */}
      {envType !== 'deep_space' && terrainData && (
        <group>
          {/* Main terrain mesh displaced by real elevation heightmap */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -50]} receiveShadow>
            <planeGeometry args={[180, 160, 128, 128]} />
            <meshStandardMaterial
              map={terrainData.surfaceTexture}
              displacementMap={terrainData.heightmapTexture}
              displacementScale={terrainData.displacementScale}
              displacementBias={terrainData.displacementBias}
              roughness={0.92}
              metalness={0.05}
            />
          </mesh>

          {/* Visible soft-sand hazard patches — darker, slightly sunken circles */}
          {sandTraps.map((trap, idx) => {
            const u = (trap.x + 90) / 180;
            const v = (trap.z + 130) / 160;
            const y = terrainData.sampleElevation(u, v);
            return (
              <mesh key={`trap-${idx}`} rotation={[-Math.PI / 2, 0, 0]} position={[trap.x, y + 0.02, trap.z]}>
                <circleGeometry args={[trap.radius, 24]} />
                <meshStandardMaterial color="#5c3a1e" roughness={1} transparent opacity={0.55} />
              </mesh>
            );
          })}

          {/* Boulders / Rock outcrops scattered across real landscape */}
          {boulders.map((b, idx) => {
            const u = (b.x + 90) / 180;
            const v = (b.z + 130) / 160;
            const y = terrainData.sampleElevation(u, v);
            return (
              <mesh
                key={idx}
                position={[b.x, y + b.scale * 0.35, b.z]}
                rotation={[b.rot, b.rot * 1.5, 0]}
                scale={[b.scale, b.scale * 0.8, b.scale]}
              >
                <dodecahedronGeometry args={[1, 0]} />
                <meshStandardMaterial
                  color={envType === 'mars' ? '#7c2d12' : '#475569'}
                  roughness={0.88}
                />
              </mesh>
            );
          })}
        </group>
      )}

      {/* Floating asteroids for Deep Space (No terrain, starfield drifting scene as required) */}
      {envType === 'deep_space' && (
        <group>
          {boulders.map((b, idx) => (
            <mesh
              key={idx}
              position={[b.x, (idx % 10) - 5, b.z]}
              rotation={[b.rot, b.rot, b.rot]}
              scale={[b.scale * 1.5, b.scale * 1.2, b.scale * 1.4]}
            >
              <dodecahedronGeometry args={[1, 0]} />
              <meshStandardMaterial color="#334155" roughness={0.9} />
            </mesh>
          ))}
        </group>
      )}
    </>
  );
}

// -----------------------------------------------------------------------------
// 3D POI Beacons with Pulsing Pillars
// -----------------------------------------------------------------------------
interface POIBeaconsProps {
  pois: SimulationPOI[];
  unlockedPoiIds: string[];
  terrainData: LandingSiteTerrainData | null;
}

function POIBeacons({ pois, unlockedPoiIds, terrainData }: POIBeaconsProps) {
  return (
    <group>
      {pois.map((poi) => {
        const isUnlocked = unlockedPoiIds.includes(poi.id);
        const u = (poi.position[0] + 90) / 180;
        const v = (poi.position[2] + 130) / 160;
        const groundY = terrainData ? terrainData.sampleElevation(u, v) : poi.position[1];

        return (
          <group key={poi.id} position={[poi.position[0], groundY, poi.position[2]]}>
            {/* Ground ring marker */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]}>
              <ringGeometry args={[poi.radius * 0.7, poi.radius, 32]} />
              <meshBasicMaterial
                color={isUnlocked ? '#4ade80' : poi.beaconColor}
                side={THREE.DoubleSide}
                transparent
                opacity={0.65}
              />
            </mesh>

            {/* Glowing vertical beacon beam */}
            <mesh position={[0, 10, 0]}>
              <cylinderGeometry args={[0.15, 0.4, 20, 8]} />
              <meshBasicMaterial
                color={isUnlocked ? '#4ade80' : poi.beaconColor}
                transparent
                opacity={0.35}
              />
            </mesh>

            {/* Core Floating Orb */}
            <mesh position={[0, 2.5, 0]}>
              <sphereGeometry args={[0.7, 16, 16]} />
              <meshBasicMaterial color={isUnlocked ? '#86efac' : poi.beaconColor} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// -----------------------------------------------------------------------------
// MAIN COMPONENT: Truly Fullscreen, Mobile-Safe Simulation with Drag-to-Look
// -----------------------------------------------------------------------------
export const MissionSimulation3D: React.FC<MissionSimulation3DProps> = ({
  currentBot,
  onSelectBot,
  onCloseSimulation,
  onDiscoveryUnlocked,
  unlockedPoiIds,
}) => {
  const [telemetry, setTelemetry] = useState({ x: 0, z: 0, speed: 0, heading: 0 });
  const [activeDiscovery, setActiveDiscovery] = useState<SimulationPOI | null>(null);
  const [resetCount, setResetCount] = useState(0);
  const [explorerMode, setExplorerMode] = useState<boolean>(false);
  const [targetAutonavPoi, setTargetAutonavPoi] = useState<SimulationPOI | null>(null);
  const [stuckMessage, setStuckMessage] = useState<string | null>(null);

  // Shared obstacle list — generated once per bot so the rendered rocks and the
  // collision physics agree on exactly where each rock is.
  const obstacles = useMemo(() => {
    const envType = currentBot.simulationEnv.type;
    const count = envType === 'deep_space' ? 40 : 55;
    const list: { x: number; z: number; scale: number; rot: number }[] = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 140;
      const z = -Math.random() * 120 - 5;
      const scale = 0.4 + Math.random() * (envType === 'deep_space' ? 1.6 : 1.3);
      list.push({ x, z, scale, rot: Math.random() * Math.PI });
    }
    return list;
  }, [currentBot.id]);

  // "Soft sand" hazard zones — a nod to real hazards rovers like Spirit and
  // Opportunity actually got bogged down in. A few fixed trap zones per bot.
  const sandTraps = useMemo(() => {
    if (currentBot.simulationEnv.type === 'deep_space') return [];
    // Deterministic-ish placement seeded from the bot id so traps don't shift on re-render.
    let seed = 0;
    for (const ch of currentBot.id) seed += ch.charCodeAt(0);
    const rand = (n: number) => ((Math.sin(seed * (n + 1)) + 1) / 2);
    return [
      { x: -20 + rand(1) * 40, z: -40 - rand(2) * 40, radius: 6 },
      { x: -30 + rand(3) * 60, z: -80 - rand(4) * 30, radius: 7 },
    ];
  }, [currentBot.id, currentBot.simulationEnv.type]);

  // First-person camera look orientation (yaw and pitch in radians)
  const lookRotationRef = useRef<{ yaw: number; pitch: number }>({ yaw: 0, pitch: 0 });

  // Mouse & Touch drag look tracking
  const activeLookPointerIdRef = useRef<number | null>(null);
  const isDraggingLookRef = useRef<boolean>(false);
  const lastPointerCoordRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Directional button refs for reliable non-passive touch prevention
  const upRef = useRef<HTMLButtonElement>(null);
  const downRef = useRef<HTMLButtonElement>(null);
  const leftRef = useRef<HTMLButtonElement>(null);
  const rightRef = useRef<HTMLButtonElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Movement input states
  const [keys, setKeys] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  // Real NASA MOLA/LOLA Terrain Data for this bot
  const terrainData = useMemo(() => {
    return getRealTerrainForBot(currentBot.id);
  }, [currentBot.id]);

  // Prevent default browser overscroll and bouncing while simulation is open
  useEffect(() => {
    document.body.classList.add('simulation-active');
    const originalOverscroll = document.body.style.overscrollBehavior;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overscrollBehavior = 'none';
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.classList.remove('simulation-active');
      document.body.style.overscrollBehavior = originalOverscroll;
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Explicitly disable scroll-wheel zoom on container to enforce mouse-drag look-around
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const disableWheelZoom = (e: WheelEvent) => {
      e.preventDefault();
    };

    container.addEventListener('wheel', disableWheelZoom, { passive: false });
    return () => {
      container.removeEventListener('wheel', disableWheelZoom);
    };
  }, []);

  // Bind directional touch handlers with event.preventDefault() and event.stopPropagation()
  // to ensure driving and dragging to look around never cancel or intercept each other
  useEffect(() => {
    const bindTouchHandlers = (
      btn: HTMLButtonElement | null,
      direction: 'forward' | 'backward' | 'left' | 'right'
    ) => {
      if (!btn) return () => {};

      const onTouchStart = (e: TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setKeys((k) => ({ ...k, [direction]: true }));
      };

      const onTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
      };

      const onTouchEnd = (e: TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setKeys((k) => ({ ...k, [direction]: false }));
      };

      btn.addEventListener('touchstart', onTouchStart, { passive: false });
      btn.addEventListener('touchmove', onTouchMove, { passive: false });
      btn.addEventListener('touchend', onTouchEnd, { passive: false });
      btn.addEventListener('touchcancel', onTouchEnd, { passive: false });

      return () => {
        btn.removeEventListener('touchstart', onTouchStart);
        btn.removeEventListener('touchmove', onTouchMove);
        btn.removeEventListener('touchend', onTouchEnd);
        btn.removeEventListener('touchcancel', onTouchEnd);
      };
    };

    const cleanUp = bindTouchHandlers(upRef.current, 'forward');
    const cleanDown = bindTouchHandlers(downRef.current, 'backward');
    const cleanLeft = bindTouchHandlers(leftRef.current, 'left');
    const cleanRight = bindTouchHandlers(rightRef.current, 'right');

    return () => {
      cleanUp();
      cleanDown();
      cleanLeft();
      cleanRight();
    };
  }, []);

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        setKeys((k) => ({ ...k, forward: true }));
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        setKeys((k) => ({ ...k, backward: true }));
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        setKeys((k) => ({ ...k, left: true }));
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        setKeys((k) => ({ ...k, right: true }));
      } else if (e.code === 'Escape') {
        if (activeDiscovery) {
          setActiveDiscovery(null);
        } else {
          onCloseSimulation();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        setKeys((k) => ({ ...k, forward: false }));
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        setKeys((k) => ({ ...k, backward: false }));
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        setKeys((k) => ({ ...k, left: false }));
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        setKeys((k) => ({ ...k, right: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeDiscovery, onCloseSimulation]);

  // Mouse & Touch Drag Look Handler — always active, independent of movement.
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Ignore interactive UI controls (buttons, selects, D-Pad)
    if (
      (e.target as HTMLElement).closest(
        'button, select, input, a, [role="button"], .interactive-control'
      )
    ) {
      return;
    }

    // Only allow single-pointer drag-to-look at a time
    if (activeLookPointerIdRef.current !== null) {
      return;
    }

    activeLookPointerIdRef.current = e.pointerId;
    isDraggingLookRef.current = true;
    lastPointerCoordRef.current = { x: e.clientX, y: e.clientY };

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingLookRef.current || activeLookPointerIdRef.current !== e.pointerId) {
      return;
    }

    const deltaX = e.clientX - lastPointerCoordRef.current.x;
    const deltaY = e.clientY - lastPointerCoordRef.current.y;
    lastPointerCoordRef.current = { x: e.clientX, y: e.clientY };

    const sensitivity = 0.0035;

    // Yaw: Dragging cursor right (deltaX > 0) rotates look direction right
    lookRotationRef.current.yaw -= deltaX * sensitivity;

    // Pitch: Dragging cursor up (deltaY < 0) tilts look up (pitch increases)
    // Pitch is strictly clamped between -1.25 rad (-71.6°) and +1.25 rad (+71.6°)
    // so the camera cannot flip upside down
    const nextPitch = lookRotationRef.current.pitch - deltaY * sensitivity;
    lookRotationRef.current.pitch = Math.max(-1.25, Math.min(1.25, nextPitch));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activeLookPointerIdRef.current === e.pointerId) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
      activeLookPointerIdRef.current = null;
      isDraggingLookRef.current = false;
    }
  };

  const handleReachPOI = (poi: SimulationPOI) => {
    setActiveDiscovery(poi);
    onDiscoveryUnlocked(poi.id, currentBot.id);
    playChimeSound('discovery');
    triggerCelebrationConfetti();
  };

  const handleResetPosition = () => {
    setResetCount((c) => c + 1);
    lookRotationRef.current.yaw = 0;
    lookRotationRef.current.pitch = 0;
    setActiveDiscovery(null);
    setTargetAutonavPoi(null);
  };

  const env = currentBot.simulationEnv;

  // Hard override: guarantee a bright DAYTIME sky for Mars & Moon regardless of
  // whatever skyColor/fogColor missions.ts happens to define — this makes the
  // day/night look independent of that file entirely.
  const resolvedSkyColor =
    env.type === 'mars' ? '#f2c9a0' : env.type === 'moon' ? '#cdd6e0' : env.skyColor;
  const resolvedFogColor =
    env.type === 'mars' ? '#e8b585' : env.type === 'moon' ? '#b8c2cc' : env.fogColor;

  // Distance calculation relative to starting origin (in meters)
  const distanceTravelled = Math.round(
    Math.sqrt(telemetry.x * telemetry.x + telemetry.z * telemetry.z) * 12
  );

  return (
    <div
      ref={canvasContainerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100dvh',
        touchAction: 'none',
      }}
      className="fixed inset-0 z-50 w-screen h-[100dvh] overflow-hidden bg-[#0b0d12] font-sans touch-none select-none cursor-grab active:cursor-grabbing"
    >
      {/* 3D WebGL Canvas (Truly Fullscreen) */}
      <Canvas
        camera={{
          position: [0, env.type === 'deep_space' ? 0 : 1.2, 0],
          fov: 65,
          near: 0.1,
          far: 220,
        }}
        className="h-full w-full touch-none"
        style={{ touchAction: 'none' }}
      >
        <color attach="background" args={[resolvedSkyColor]} />
        <Environment3D
          botId={currentBot.id}
          envType={env.type}
          fogColor={resolvedFogColor}
          terrainData={terrainData}
          obstacles={obstacles}
          sandTraps={sandTraps}
        />
        <VehicleController
          envType={env.type}
          pois={currentBot.simulationPOIs}
          terrainData={terrainData}
          lookRotationRef={lookRotationRef}
          onPositionUpdate={setTelemetry}
          onReachPOI={handleReachPOI}
          moveState={keys}
          resetTrigger={resetCount}
          targetAutonavPoi={targetAutonavPoi}
          onCancelAutonav={() => setTargetAutonavPoi(null)}
          explorerMode={explorerMode}
          obstacles={obstacles}
          sandTraps={sandTraps}
          onStuckChange={setStuckMessage}
        />
        <POIBeacons
          pois={currentBot.simulationPOIs}
          unlockedPoiIds={unlockedPoiIds}
          terrainData={terrainData}
        />
      </Canvas>

      {/* Cockpit / HUD Overlay Glass Gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />

      {/* Autonav Banner when cruising to a landmark */}
      {targetAutonavPoi && (
        <div className="fixed top-[calc(4.8rem+env(safe-area-inset-top,0px))] left-1/2 -translate-x-1/2 z-40 flex items-center gap-2.5 rounded-full border-2 border-amber-400 bg-[#0e111a]/95 px-4 py-2 font-sans text-xs font-bold text-amber-300 shadow-2xl backdrop-blur-md">
          <Navigation className="h-4 w-4 animate-spin text-amber-300" />
          <span>Auto-driving to {targetAutonavPoi.landmarkLabel}...</span>
          <button
            onClick={() => setTargetAutonavPoi(null)}
            className="ml-1 rounded-full bg-amber-400/30 px-2.5 py-0.5 text-xs text-white hover:bg-amber-400/50 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Top HUD Bar (Safe-Area Aware for Notches/Tablets) */}
      <div className="fixed top-0 left-0 right-0 z-40 flex flex-wrap items-center justify-between gap-3 p-4 pt-[max(0.75rem,env(safe-area-inset-top,0px))] pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] pointer-events-none">
        {/* Left: Mission Indicator & Bot Selector */}
        <div className="pointer-events-auto interactive-control flex items-center gap-2 sm:gap-3 rounded-2xl border border-white/10 bg-[#0b0d12]/90 p-2 shadow-xl backdrop-blur-md">
          <button
            onClick={onCloseSimulation}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-1.5 font-sans text-xs font-semibold text-[#9aa0a6] hover:border-white/20 hover:text-[#ece7dc] cursor-pointer"
            title="Exit simulation to archive view"
          >
            <X className="h-3.5 w-3.5" />
            <span>Exit 3D</span>
          </button>

          <div className="hidden sm:block h-4 w-px bg-white/10" />

          {/* Quick Bot Switcher Dropdown */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline font-sans text-xs text-[#9aa0a6]">Mission:</span>
            <select
              value={currentBot.id}
              onChange={(e) => {
                const found = BOT_MISSIONS.find((b) => b.id === e.target.value);
                if (found) {
                  onSelectBot(found);
                  setResetCount((c) => c + 1);
                  setActiveDiscovery(null);
                  setTargetAutonavPoi(null);
                }
              }}
              className="rounded-xl border border-white/15 bg-black/70 px-2.5 py-1 font-sans text-xs text-[#ece7dc] focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              {BOT_MISSIONS.map((bot) => (
                <option key={bot.id} value={bot.id} className="bg-[#12151e] text-[#ece7dc]">
                  [{bot.frontierId.toUpperCase()}] {bot.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Explorer Mode Toggle, Topography Badge & Reset Origin */}
        <div className="pointer-events-auto interactive-control flex items-center gap-2">
          {/* Explorer Mode Toggle Switch */}
          <button
            onClick={() => setExplorerMode(!explorerMode)}
            title="Switch between Easy Kid Controls and Explorer Look-Around Mode"
            className={`flex items-center gap-2 rounded-2xl border-2 px-3 py-1.5 font-sans text-xs font-bold transition-all shadow-xl cursor-pointer ${
              explorerMode
                ? 'border-amber-400 bg-amber-500/20 text-amber-300 ring-2 ring-amber-400/40'
                : 'border-cyan-400/70 bg-cyan-500/20 text-cyan-200 hover:border-cyan-300 hover:text-white'
            }`}
          >
            {explorerMode ? (
              <>
                <Compass className="h-4 w-4 text-amber-300" />
                <span>Explorer Mode: ON</span>
              </>
            ) : (
              <>
                <Gamepad2 className="h-4 w-4 text-cyan-300" />
                <span>Kid Controls: Easy</span>
              </>
            )}
          </button>

          {terrainData && (
            <div className="hidden lg:flex items-center gap-1.5 rounded-2xl border border-white/10 bg-[#0b0d12]/90 px-3 py-1.5 font-sans text-xs text-[#ece7dc] backdrop-blur-md shadow-xl">
              <Layers className="h-3.5 w-3.5 text-[#ff8a65]" />
              <span className="truncate max-w-[200px]" title={terrainData.elevationDataSource}>
                {terrainData.elevationDataSource.split(' ')[1] || 'NASA'} Elevation
              </span>
            </div>
          )}

          <button
            onClick={handleResetPosition}
            title="Reset position to origin"
            className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-[#0b0d12]/90 px-3 py-1.5 font-sans text-xs text-[#9aa0a6] backdrop-blur-md shadow-xl hover:text-[#ece7dc] cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Live Monospace Telemetry Dashboard (Safe-Area Aware) */}
      <div className="pointer-events-none fixed top-[calc(4.5rem+env(safe-area-inset-top,0px))] right-[max(1rem,env(safe-area-inset-right,0px))] z-30 flex flex-col gap-1.5 sm:gap-2 rounded-xl border border-white/10 bg-[#0b0d12]/90 p-3 sm:p-3.5 font-mono text-xs shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-1.5">
          <span className="text-[10px] uppercase text-[#9aa0a6]">Vehicle</span>
          <span className="font-semibold text-[#ece7dc] text-[11px] truncate max-w-[130px]">
            {env.vehicleName.split(' ')[0]}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-[#9aa0a6]">Distance:</span>
          <span className="font-bold tabular-nums text-[#ece7dc]">
            {distanceTravelled} m
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-[#9aa0a6]">Speed:</span>
          <span className="font-bold tabular-nums text-emerald-400">
            {telemetry.speed.toFixed(1)} km/h
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-[#9aa0a6]">Heading:</span>
          <span className="font-bold tabular-nums text-[#ff8a65]">
            {telemetry.heading}°{' '}
            {telemetry.heading > 315 || telemetry.heading <= 45
              ? 'N'
              : telemetry.heading <= 135
              ? 'E'
              : telemetry.heading <= 225
              ? 'S'
              : 'W'}
          </span>
        </div>

        {terrainData && (
          <div className="border-t border-white/10 pt-1.5 text-[10px] text-[#9aa0a6] hidden sm:block">
            <span className="text-[#ff8a65]">Site: </span>
            <span className="text-[#ece7dc] truncate block max-w-[140px]">
              {terrainData.locationName.split('(')[0]}
            </span>
          </div>
        )}
      </div>

      {/* On-screen Directional Touch Controls (Fixed to Bottom, Safe-Area Padded, Large Kid-Friendly Touch Targets) */}
      <div
        style={{ touchAction: 'none' }}
        className="interactive-control fixed bottom-[max(1.25rem,env(safe-area-inset-bottom,0px))] left-[max(1.25rem,env(safe-area-inset-left,0px))] z-40 touch-none select-none flex flex-col items-center gap-2"
        onPointerDown={(e) => e.stopPropagation()}
        onPointerMove={(e) => e.stopPropagation()}
        onPointerUp={(e) => e.stopPropagation()}
      >
        {/* Forward Button */}
        <button
          ref={upRef}
          style={{ touchAction: 'none' }}
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={() => setKeys((k) => ({ ...k, forward: true }))}
          onMouseUp={() => setKeys((k) => ({ ...k, forward: false }))}
          onMouseLeave={() => setKeys((k) => ({ ...k, forward: false }))}
          className={`interactive-control h-16 w-16 sm:h-20 sm:w-20 rounded-2xl border-2 flex flex-col items-center justify-center transition-all select-none shadow-2xl cursor-pointer ${
            keys.forward
              ? 'bg-amber-500 border-amber-300 text-white scale-95 ring-4 ring-amber-400/50'
              : 'bg-[#0f172a]/90 border-cyan-400/40 text-cyan-200 active:bg-amber-500 active:text-white'
          }`}
          aria-label="Drive Forward"
        >
          <ArrowUp className="h-7 w-7 stroke-[3]" />
          <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">Drive</span>
        </button>

        {/* Left, Backward, Right Buttons */}
        <div className="flex items-center gap-2" style={{ touchAction: 'none' }}>
          <button
            ref={leftRef}
            style={{ touchAction: 'none' }}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={() => setKeys((k) => ({ ...k, left: true }))}
            onMouseUp={() => setKeys((k) => ({ ...k, left: false }))}
            onMouseLeave={() => setKeys((k) => ({ ...k, left: false }))}
            className={`interactive-control h-16 w-16 sm:h-20 sm:w-20 rounded-2xl border-2 flex flex-col items-center justify-center transition-all select-none shadow-2xl cursor-pointer ${
              keys.left
                ? 'bg-amber-500 border-amber-300 text-white scale-95 ring-4 ring-amber-400/50'
                : 'bg-[#0f172a]/90 border-cyan-400/40 text-cyan-200 active:bg-amber-500 active:text-white'
            }`}
            aria-label="Turn Left"
          >
            <ArrowLeft className="h-6 w-6 stroke-[3]" />
            <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">Left</span>
          </button>

          <button
            ref={downRef}
            style={{ touchAction: 'none' }}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={() => setKeys((k) => ({ ...k, backward: true }))}
            onMouseUp={() => setKeys((k) => ({ ...k, backward: false }))}
            onMouseLeave={() => setKeys((k) => ({ ...k, backward: false }))}
            className={`interactive-control h-16 w-16 sm:h-20 sm:w-20 rounded-2xl border-2 flex flex-col items-center justify-center transition-all select-none shadow-2xl cursor-pointer ${
              keys.backward
                ? 'bg-amber-500 border-amber-300 text-white scale-95 ring-4 ring-amber-400/50'
                : 'bg-[#0f172a]/90 border-cyan-400/40 text-cyan-200 active:bg-amber-500 active:text-white'
            }`}
            aria-label="Drive Backward"
          >
            <ArrowDown className="h-6 w-6 stroke-[3]" />
            <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">Back</span>
          </button>

          <button
            ref={rightRef}
            style={{ touchAction: 'none' }}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={() => setKeys((k) => ({ ...k, right: true }))}
            onMouseUp={() => setKeys((k) => ({ ...k, right: false }))}
            onMouseLeave={() => setKeys((k) => ({ ...k, right: false }))}
            className={`interactive-control h-16 w-16 sm:h-20 sm:w-20 rounded-2xl border-2 flex flex-col items-center justify-center transition-all select-none shadow-2xl cursor-pointer ${
              keys.right
                ? 'bg-amber-500 border-amber-300 text-white scale-95 ring-4 ring-amber-400/50'
                : 'bg-[#0f172a]/90 border-cyan-400/40 text-cyan-200 active:bg-amber-500 active:text-white'
            }`}
            aria-label="Turn Right"
          >
            <ArrowRight className="h-6 w-6 stroke-[3]" />
            <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">Right</span>
          </button>
        </div>
      </div>

      {/* Target POI Waypoints strip in bottom right (Safe-Area Aware, Single-Tap Drive or Inspect) */}
      <div className="interactive-control fixed bottom-[max(1.25rem,env(safe-area-inset-bottom,0px))] right-[max(1.25rem,env(safe-area-inset-right,0px))] z-30 flex flex-wrap items-center gap-2 max-w-[280px] sm:max-w-none justify-end">
        {currentBot.simulationPOIs.map((poi) => {
          const isReached = unlockedPoiIds.includes(poi.id);
          const isTargeted = targetAutonavPoi?.id === poi.id;

          return (
            <button
              key={poi.id}
              onClick={() => {
                if (isReached) {
                  setActiveDiscovery(poi);
                } else {
                  // Single-tap "move to point" navigation
                  setTargetAutonavPoi(poi);
                }
              }}
              className={`interactive-control cursor-pointer rounded-2xl border-2 px-3.5 py-2 font-sans text-xs font-bold backdrop-blur-md transition-all flex items-center gap-2 shadow-xl ${
                isTargeted
                  ? 'border-amber-400 bg-amber-500/30 text-amber-200 ring-2 ring-amber-400/50 scale-105'
                  : isReached
                  ? 'border-emerald-500/50 bg-emerald-950/80 text-emerald-300 hover:bg-emerald-900/90'
                  : 'border-white/15 bg-black/80 text-[#ece7dc] hover:border-amber-400 hover:bg-amber-500/20'
              }`}
            >
              <div
                className="h-3 w-3 rounded-full shrink-0"
                style={{ backgroundColor: isReached ? '#22c55e' : poi.beaconColor }}
              />
              <span className="truncate max-w-[130px] sm:max-w-[160px]">{poi.landmarkLabel}</span>
              {isReached ? (
                <Check className="h-4 w-4 text-emerald-400" />
              ) : (
                <span className="text-[10px] uppercase text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded-full">
                  Tap to Go
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Soft-sand hazard banner — appears while the rover is stuck */}
      <AnimatePresence>
        {stuckMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pointer-events-none fixed left-1/2 top-24 z-30 -translate-x-1/2 rounded-xl border border-amber-400/50 bg-amber-950/90 px-5 py-3 text-center font-mono text-sm text-amber-200 shadow-xl"
          >
            🏜️ {stuckMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Framer Motion Overlay when POI is reached: Real Image/Video Media Support */}
      <AnimatePresence>
        {activeDiscovery && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="interactive-control fixed bottom-[max(7rem,calc(env(safe-area-inset-bottom,0px)+6rem))] left-1/2 z-50 w-[92vw] max-w-xl sm:max-w-2xl max-h-[80dvh] overflow-y-auto -translate-x-1/2 rounded-3xl border-2 border-amber-400 bg-[#0e111a]/95 p-5 sm:p-7 shadow-[0_0_60px_-10px_rgba(245,158,11,0.5)] backdrop-blur-xl"
            style={{
              borderColor: activeDiscovery.beaconColor || '#f59e0b',
            }}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-3">
              <div>
                <div className="flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-wider text-amber-300">
                  <Sparkles className="h-4 w-4" style={{ color: activeDiscovery.beaconColor }} />
                  <span>🎉 Landmark Reached!</span>
                  <span>·</span>
                  <span className="text-white">{activeDiscovery.landmarkLabel}</span>
                </div>
                <h3 className="mt-1 font-serif text-2xl sm:text-3xl font-normal text-[#ece7dc]">
                  {activeDiscovery.title || activeDiscovery.scienceTitle}
                </h3>
              </div>
              <button
                onClick={() => setActiveDiscovery(null)}
                className="rounded-xl p-2 text-[#9aa0a6] hover:bg-white/10 hover:text-white cursor-pointer"
                aria-label="Close discovery overlay"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Read Aloud button in Discovery Popup */}
            <div className="mt-3 flex items-center justify-end">
              <ReadAloudButton
                text={`${activeDiscovery.title || activeDiscovery.scienceTitle}. ${activeDiscovery.description || activeDiscovery.scientificDiscovery}`}
                label="Read Discovery Aloud"
                size="sm"
              />
            </div>

            {/* Media Container: Conditionally rendered when mediaUrl is present */}
            {activeDiscovery.mediaUrl && (
              <div className="mt-4 overflow-hidden rounded-xl border border-white/15 bg-black/60 shadow-inner">
                {activeDiscovery.mediaType === 'video' ? (
                  <video
                    src={activeDiscovery.mediaUrl}
                    controls
                    playsInline
                    className="max-h-52 sm:max-h-60 w-full object-cover"
                  />
                ) : (
                  <div className="relative group">
                    <img
                      src={activeDiscovery.mediaUrl}
                      alt={activeDiscovery.title || activeDiscovery.scienceTitle}
                      className="max-h-52 sm:max-h-60 w-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        // Fallback gracefully if image fails to load
                        const parent = (e.currentTarget as HTMLElement).closest('.media-wrapper');
                        if (parent) {
                          (parent as HTMLElement).style.display = 'none';
                        }
                      }}
                    />
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-black/75 px-2 py-0.5 font-mono text-[10px] text-white/90 backdrop-blur-sm border border-white/10">
                      <ImageIcon className="h-3 w-3 text-cyan-400" />
                      <span>Verified Archival Photographic Record</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Scientific Description Body */}
            <div className="mt-4">
              <p className="font-serif text-sm sm:text-base leading-relaxed text-[#ece7dc]">
                {activeDiscovery.description || activeDiscovery.scientificDiscovery}
              </p>
            </div>

            {/* Footer */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3 text-xs">
              <span className="font-mono text-[11px] text-emerald-400 flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5" />
                <span>Discovery Logged to Permanent Wall</span>
              </span>
              <button
                onClick={() => setActiveDiscovery(null)}
                className="rounded-lg border border-white/20 bg-white/10 px-3.5 py-1.5 font-mono text-xs text-white hover:bg-white/20 transition-colors"
              >
                Continue Mission
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};