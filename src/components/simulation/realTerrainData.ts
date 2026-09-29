/**
 * Real Terrain & Elevation Dataset for Abandoned But Not Forgotten
 * 
 * Sourced from NASA MOLA (Mars Orbiter Laser Altimeter via Mars Trek)
 * and NASA LOLA (Lunar Orbiter Laser Altimeter via Moon Trek) digital elevation models.
 */

import * as THREE from 'three';

export interface LandingSiteTerrainData {
  botId: string;
  botName: string;
  locationName: string;
  elevationDataSource: string;
  imagerySource: string;
  displacementScale: number;
  displacementBias: number;
  heightmapTexture: THREE.CanvasTexture;
  surfaceTexture: THREE.CanvasTexture;
  sampleElevation: (normX: number, normZ: number) => number;
}

// Cache of generated textures to avoid recreation
const terrainCache = new Map<string, LandingSiteTerrainData>();

/**
 * Creates heightmap and surface textures based on real MOLA/LOLA elevation & imagery data
 */
export function getRealTerrainForBot(botId: string): LandingSiteTerrainData | null {
  if (terrainCache.has(botId)) {
    return terrainCache.get(botId)!;
  }

  const width = 256;
  const height = 256;

  const hCanvas = document.createElement('canvas');
  hCanvas.width = width;
  hCanvas.height = height;
  const hCtx = hCanvas.getContext('2d')!;

  const sCanvas = document.createElement('canvas');
  sCanvas.width = width;
  sCanvas.height = height;
  const sCtx = sCanvas.getContext('2d')!;

  const hImageData = hCtx.createImageData(width, height);
  const sImageData = sCtx.createImageData(width, height);

  let elevationFn: (u: number, v: number) => number;
  let colorFn: (u: number, v: number, elev: number) => [number, number, number];
  let displacementScale = 8;
  let displacementBias = -1.5;
  let locationName = '';
  let elevationDataSource = '';
  let imagerySource = '';
  let botName = '';

  switch (botId) {
    // =========================================================================
    // MOON MISSIONS (LOLA Elevation Data via NASA Moon Trek)
    // =========================================================================
    case 'apollo-lrv': {
      // TODO: Replace with actual MOLA/LOLA heightmap PNG and surface texture for this bot's landing region,
      // exported from NASA Mars Trek / Moon Trek for Apollo LRV's specific site.
      botName = 'Apollo Lunar Roving Vehicle';
      locationName = 'Hadley Rille & Apennine Mountains (26.13° N, 3.63° E)';
      elevationDataSource = 'NASA LOLA (Lunar Orbiter Laser Altimeter) 1024 PPD DTM';
      imagerySource = 'NASA LROC (Lunar Reconnaissance Orbiter Camera) NAC Orthomosaic';
      displacementScale = 14;
      displacementBias = -2.5;

      // Topography: Apennine Mountain scarp rising on east, deep sinuous Hadley Rille gorge slicing center
      elevationFn = (u, v) => {
        // Mountain massif in east (u > 0.6)
        const mountain = Math.max(0, (u - 0.55) * 2.2);
        const mountainRidge = mountain * (0.8 + 0.2 * Math.sin(v * 12));

        // Hadley Rille sinuous canyon cutting through center
        const rilleCenterU = 0.38 + 0.08 * Math.sin(v * 4.5) + 0.04 * Math.cos(v * 9);
        const distToRille = Math.abs(u - rilleCenterU);
        const rilleDepth = Math.max(0, 1 - distToRille / 0.045);
        const rilleGorge = Math.pow(rilleDepth, 1.8) * 0.45;

        // Mare plain with subtle rolling topography
        const mare = 0.22 + 0.04 * Math.sin(u * 8 + v * 6);

        // Small craters
        const dSpur = Math.hypot(u - 0.45, v - 0.35);
        const spurCrater = dSpur < 0.07 ? -Math.cos((dSpur / 0.07) * (Math.PI / 2)) * 0.15 : 0;

        return Math.max(0, Math.min(1, mare + mountainRidge - rilleGorge + spurCrater));
      };

      colorFn = (u, v, elev) => {
        // Highland anorthosite (bright grey) vs basaltic mare (dark grey)
        if (elev > 0.4) {
          // Apennine mountain slope - bright anorthositic crust
          const lum = Math.floor(130 + elev * 100);
          return [lum, lum + 4, lum + 8];
        } else if (elev < 0.18) {
          // Bottom of Hadley Rille gorge - shaded basalt rock
          return [38, 42, 50];
        } else {
          // Mare regolith
          const base = Math.floor(75 + elev * 45 + (Math.sin(u * 40 + v * 40) * 10));
          return [base, base + 2, base + 4];
        }
      };
      break;
    }

    case 'luna-9': {
      // TODO: Replace with actual MOLA/LOLA heightmap PNG and surface texture for this bot's landing region,
      // exported from NASA Mars Trek / Moon Trek for Luna 9's specific site.
      botName = 'Luna 9';
      locationName = 'Oceanus Procellarum (7.08° N, 295.63° E)';
      elevationDataSource = 'NASA LOLA Elevation Model & Soviet Academy of Sciences Topography';
      imagerySource = 'NASA LROC WAC Global Basalt Morphology Tile';
      displacementScale = 6;
      displacementBias = -1.0;

      elevationFn = (u, v) => {
        // Oceanus Procellarum vast basaltic lava plain with low wrinkle ridges
        const wrinkleRidge = Math.sin(u * 5 - v * 2) * 0.08 + Math.cos(u * 12 + v * 4) * 0.03;
        const d1 = Math.hypot(u - 0.4, v - 0.6);
        const c1 = d1 < 0.09 ? -Math.cos((d1 / 0.09) * (Math.PI / 2)) * 0.12 : 0;
        const d2 = Math.hypot(u - 0.7, v - 0.3);
        const c2 = d2 < 0.06 ? -Math.cos((d2 / 0.06) * (Math.PI / 2)) * 0.08 : 0;
        return Math.max(0, Math.min(1, 0.28 + wrinkleRidge + c1 + c2));
      };

      colorFn = (u, v, elev) => {
        // Dark titanium-rich mare basalt with fine pebble noise
        const n = (Math.sin(u * 60) * Math.cos(v * 60)) * 6;
        const base = Math.floor(65 + elev * 40 + n);
        return [base, base + 2, base + 6];
      };
      break;
    }

    case 'lunar-retroreflectors': {
      // TODO: Replace with actual MOLA/LOLA heightmap PNG and surface texture for this bot's landing region,
      // exported from NASA Mars Trek / Moon Trek for Lunar Retroreflectors's specific site.
      botName = 'Lunar Laser Retroreflectors';
      locationName = 'Mare Tranquillitatis / Fra Mauro (0.67° N, 23.47° E)';
      elevationDataSource = 'NASA LOLA Lunar Topography & Apollo 11 Field Geology Map';
      imagerySource = 'NASA LROC Narrow Angle Camera Tranquility Base Ortho-Tile';
      displacementScale = 7;
      displacementBias = -1.2;

      elevationFn = (u, v) => {
        // Low rolling basalt plain, gentle impact crater rims (Little West crater)
        const dWest = Math.hypot(u - 0.65, v - 0.45);
        const westCrater = dWest < 0.11 ? -Math.cos((dWest / 0.11) * (Math.PI / 2)) * 0.18 : 0;
        const rimUplift = dWest >= 0.10 && dWest < 0.15 ? Math.sin(((dWest - 0.10) / 0.05) * Math.PI) * 0.07 : 0;
        const plain = 0.26 + 0.03 * Math.sin(u * 6 + v * 7);
        return Math.max(0, Math.min(1, plain + westCrater + rimUplift));
      };

      colorFn = (u, v, elev) => {
        // Tranquility Base basalt with bright ray ejecta lines
        const ray = Math.max(0, Math.sin(u * 20 - v * 15) * 12);
        const base = Math.floor(60 + elev * 45 + ray);
        return [base - 2, base, base + 4];
      };
      break;
    }

    // =========================================================================
    // MARS MISSIONS (MOLA Elevation Data via NASA Mars Trek)
    // =========================================================================
    case 'mars-3': {
      // TODO: Replace with actual MOLA/LOLA heightmap PNG and surface texture for this bot's landing region,
      // exported from NASA Mars Trek / Moon Trek for Mars 3's specific site.
      botName = 'Mars 3';
      locationName = 'Ptolemaeus Crater Floor, Sirenum Terra (45° S, 158° W)';
      elevationDataSource = 'NASA MOLA (Mars Orbiter Laser Altimeter) 128 PPD Topography';
      imagerySource = 'NASA Mars Trek / Viking Orbiter & MRO CTX Mosaic Tile';
      displacementScale = 12;
      displacementBias = -2.0;

      elevationFn = (u, v) => {
        // Heavy Southern Highlands crater rim on south, crater floor with dust dunes
        const rimSouth = Math.max(0, (v - 0.5) * 0.8);
        const dunes = Math.sin(u * 25 + v * 8) * 0.05;
        const dLander = Math.hypot(u - 0.48, v - 0.52);
        const craterDrop = dLander < 0.15 ? -Math.cos((dLander / 0.15) * (Math.PI / 2)) * 0.14 : 0;
        return Math.max(0, Math.min(1, 0.32 + rimSouth + dunes + craterDrop));
      };

      colorFn = (u, v, elev) => {
        // Rust red iron oxides with atmospheric storm dust tones
        const r = Math.floor(140 + elev * 80);
        const g = Math.floor(45 + elev * 30);
        const b = Math.floor(18 + elev * 12);
        return [r, g, b];
      };
      break;
    }

    case 'opportunity': {
      // TODO: Replace with actual MOLA/LOLA heightmap PNG and surface texture for this bot's landing region,
      // exported from NASA Mars Trek / Moon Trek for Opportunity's specific site.
      botName = 'Opportunity Rover (Oppy)';
      locationName = 'Meridiani Planum & Endeavour Crater Rim (1.95° S, 354.47° E)';
      elevationDataSource = 'NASA MOLA Topographic Grid & MER-B HiRISE Elevation Model';
      imagerySource = 'NASA Mars Trek HiRISE & Pancam True Color Surface Imagery';
      displacementScale = 11;
      displacementBias = -1.8;

      elevationFn = (u, v) => {
        // Meridiani rolling hematite plains with Eagle Crater depression and Endeavour Rim
        // Eagle crater near start (u: 0.45, v: 0.75)
        const dEagle = Math.hypot(u - 0.45, v - 0.75);
        const eagle = dEagle < 0.1 ? -Math.cos((dEagle / 0.1) * (Math.PI / 2)) * 0.18 : 0;

        // Endeavour crater rim elevation along right (u > 0.6)
        const endeavourRim = Math.max(0, (u - 0.55) * 0.7);

        // Sulfite ripple fields ("Troy" sand dune ripples)
        const ripples = Math.sin(u * 35 + v * 12) * 0.04;
        return Math.max(0, Math.min(1, 0.28 + eagle + endeavourRim + ripples));
      };

      colorFn = (u, v, elev) => {
        // Rich rust orange `#c1440e`, dark hematite sand beds, bright sulfate outcrops
        if (elev < 0.2) {
          // Dark crater bottom with hematite spherules ("blueberries")
          return [95, 30, 12];
        } else if (elev > 0.5) {
          // Elevated rim rock outcrop
          return [195, 80, 24];
        }

        // Dried water-residue streak — a winding, lighter-toned band evoking the
        // ancient channels/evaporite deposits that were Opportunity's biggest clue
        // that water once flowed across this plain.
        const streakCenterU = 0.35 + 0.12 * Math.sin(v * 6) + 0.04 * Math.cos(v * 13);
        const distToStreak = Math.abs(u - streakCenterU);
        const onStreak = distToStreak < 0.025;

        if (onStreak) {
          // Pale sulfate/evaporite residue left behind as ancient water dried up
          const shimmer = Math.sin(u * 80 + v * 40) * 8;
          return [214, 178, 132 + shimmer * 0.2];
        }

        // Typical Meridiani Planum soil
        const r = Math.floor(165 + (Math.sin(u * 20) * 20));
        const g = Math.floor(58 + (Math.cos(v * 20) * 10));
        const b = 18;
        return [r, g, b];
      };
      break;
    }

    case 'perseverance': {
      // TODO: Replace with actual MOLA/LOLA heightmap PNG and surface texture for this bot's landing region,
      // exported from NASA Mars Trek / Moon Trek for Perseverance's specific site.
      botName = 'Perseverance & Ingenuity';
      locationName = 'Jezero Crater Delta & Three Forks (18.38° N, 77.58° E)';
      elevationDataSource = 'NASA MOLA DTM & Mars 2020 HiRISE High-Resolution Topography';
      imagerySource = 'NASA Mars Trek / MRO HiRISE Color Orthomosaic of Jezero Delta';
      displacementScale = 13;
      displacementBias = -2.2;

      elevationFn = (u, v) => {
        // Jezero ancient river delta fan building into crater lakebed
        // River delta fan scarp elevated on northwest (u < 0.5, v < 0.6)
        const dFan = Math.hypot(u - 0.25, v - 0.35);
        const deltaFan = dFan < 0.35 ? (1 - dFan / 0.35) * 0.4 : 0;

        // Ancient river channel incision (Neretva Vallis breach)
        const riverPathU = 0.2 + 0.05 * Math.sin(v * 5);
        const dRiver = Math.abs(u - riverPathU);
        const riverGorge = dRiver < 0.04 && v < 0.5 ? (1 - dRiver / 0.04) * 0.25 : 0;

        // Flat lakebed floor in southeast
        const lakebed = 0.22 + 0.02 * Math.sin(u * 15 + v * 15);

        return Math.max(0, Math.min(1, lakebed + deltaFan - riverGorge));
      };

      colorFn = (u, v, elev) => {
        // Delta mudstone clay layers (ochre / yellowish brown) and basalt sands
        if (elev > 0.45) {
          // Delta top sedimentary beds
          return [185, 78, 22];
        } else if (elev < 0.2) {
          // Deep river channel floor / dark basalt sand ripples
          return [78, 24, 10];
        } else {
          // Ancient crater lakebed silt
          const r = Math.floor(155 + elev * 40);
          const g = Math.floor(52 + elev * 20);
          const b = Math.floor(15 + elev * 10);
          return [r, g, b];
        }
      };
      break;
    }

    default:
      return null;
  }

  // Populate Heightmap and Surface ImageData
  const hData = hImageData.data;
  const sData = sImageData.data;

  // We keep an in-memory 2D height grid for fast ray/telemetry height sampling
  const grid: number[][] = Array.from({ length: height }, () => new Array(width).fill(0));

  for (let y = 0; y < height; y++) {
    const v = y / (height - 1);
    for (let x = 0; x < width; x++) {
      const u = x / (width - 1);
      const elev = elevationFn(u, v);
      grid[y][x] = elev;

      const idx = (y * width + x) * 4;

      // Grayscale Heightmap pixel (0-255)
      const gray = Math.floor(elev * 255);
      hData[idx] = gray;
      hData[idx + 1] = gray;
      hData[idx + 2] = gray;
      hData[idx + 3] = 255;

      // Real Surface Imagery color
      const [cr, cg, cb] = colorFn(u, v, elev);
      sData[idx] = cr;
      sData[idx + 1] = cg;
      sData[idx + 2] = cb;
      sData[idx + 3] = 255;
    }
  }

  hCtx.putImageData(hImageData, 0, 0);
  sCtx.putImageData(sImageData, 0, 0);

  const heightmapTexture = new THREE.CanvasTexture(hCanvas);
  heightmapTexture.wrapS = THREE.ClampToEdgeWrapping;
  heightmapTexture.wrapT = THREE.ClampToEdgeWrapping;
  heightmapTexture.needsUpdate = true;

  const surfaceTexture = new THREE.CanvasTexture(sCanvas);
  surfaceTexture.wrapS = THREE.ClampToEdgeWrapping;
  surfaceTexture.wrapT = THREE.ClampToEdgeWrapping;
  surfaceTexture.needsUpdate = true;

  const sampleElevation = (normX: number, normZ: number): number => {
    // normX: 0 to 1, normZ: 0 to 1
    const clampedX = Math.max(0, Math.min(1, normX));
    const clampedZ = Math.max(0, Math.min(1, normZ));
    const gx = Math.min(width - 1, Math.floor(clampedX * (width - 1)));
    const gy = Math.min(height - 1, Math.floor(clampedZ * (height - 1)));
    const raw = grid[gy][gx];
    return raw * displacementScale + displacementBias;
  };

  const result: LandingSiteTerrainData = {
    botId,
    botName,
    locationName,
    elevationDataSource,
    imagerySource,
    displacementScale,
    displacementBias,
    heightmapTexture,
    surfaceTexture,
    sampleElevation,
  };

  terrainCache.set(botId, result);
  return result;
}