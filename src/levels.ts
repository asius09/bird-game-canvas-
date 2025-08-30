// levels.ts
import { Level } from '@/types';
import {
  BASE_WIDTH,
  BASE_HEIGHT,
  GOAL_WIDTH,
  GOAL_HEIGHT,
  STAR_RADIUS,
  SPIKE_HEIGHT,
  SPIKE_WIDTH,
} from '@/constant/constants';

// Helper to create custom platforms
function createPlatform(x: number, y: number, width: number, height: number) {
  return {
    position: { x, y },
    size: { width, height },
  };
}

// Helper to create spikes (variable width, but always a multiple of SPIKE_WIDTH)
function createSpike(x: number, y: number, spikeCount: number = 1) {
  const SPIKE_WIDTH = 18;
  return {
    position: { x, y },
    size: { width: spikeCount * SPIKE_WIDTH, height: 18 },
    type: 'spike' as const,
  };
}

// Helper to create collectible
function createCollectible(x: number, y: number) {
  return {
    position: { x, y },
    radius: STAR_RADIUS,
    type: 'ring' as const,
    collected: false,
  };
}

// LEVEL 1: "The Gauntlet" - Introduction with challenge, broader and with proper gapping
const level1 = {
  id: 1,
  name: 'The Gauntlet',
  platforms: [
    // Starting platform
    createPlatform(60, BASE_HEIGHT / 2 + 120, 180, 22),
    // First jump
    createPlatform(320, BASE_HEIGHT / 2 + 80, 180, 22),
    // Large gap, spike pit below
    createPlatform(600, BASE_HEIGHT / 2 + 40, 160, 22),
    // Mid-air platform, requires precision
    createPlatform(900, BASE_HEIGHT / 2 - 10, 250, 22),
    // Final approach, higher up
    createPlatform(1200, BASE_HEIGHT / 2 - 80, 180, 22),
  ],
  obstacles: [
    createSpike(
      320 + 180 - SPIKE_WIDTH * 3,
      BASE_HEIGHT / 2 + 80 - SPIKE_HEIGHT,
      3
    ),
    createSpike(1200, BASE_HEIGHT / 2 - 80 - SPIKE_HEIGHT, 3),
  ],
  collectibles: [
    // Risky collectible above spike pit
    createCollectible(700, BASE_HEIGHT / 2 - 10),
    // Mid-air collectible
    createCollectible(1000, BASE_HEIGHT / 2 - 60),
  ],
  goal: {
    position: {
      x: 1200 + 180 - GOAL_HEIGHT,
      y: BASE_HEIGHT / 2 - GOAL_HEIGHT * 2 - 30,
    },
    size: { width: GOAL_WIDTH, height: GOAL_HEIGHT },
  },
  startPosition: { x: 120, y: BASE_HEIGHT / 2 + 100 },
};

// LEVEL 2: "Spike Alley" - Broader, more spaced navigation challenge
const level2 = {
  id: 2,
  name: 'Spike Alley',
  platforms: [
    // Start platform
    createPlatform(80, BASE_HEIGHT / 2 + 100, 200, 22),
    // First spiked platform (not too high)
    createPlatform(340, BASE_HEIGHT / 2 + 40, 200, 22),
    // Second spiked platform (slightly higher)
    createPlatform(600, BASE_HEIGHT / 2, 200, 22),
    // Third spiked platform (a bit higher)
    createPlatform(860, BASE_HEIGHT / 2 - 40, 200, 22),
    // Final safe platform
    createPlatform(1080, BASE_HEIGHT / 2 - 80, 200, 22),
  ],
  obstacles: [
    // 5 spike groups, each at the end of its platform, fixed width (3 spikes)
    createSpike(
      80 + 200 - SPIKE_WIDTH * 3,
      BASE_HEIGHT / 2 + 100 - SPIKE_HEIGHT,
      3
    ),
    createSpike(
      340 + 200 - SPIKE_WIDTH * 3,
      BASE_HEIGHT / 2 + 40 - SPIKE_HEIGHT,
      3
    ),
    createSpike(600 + 200 - SPIKE_WIDTH * 3, BASE_HEIGHT / 2 - SPIKE_HEIGHT, 3),
    createSpike(
      860 + 200 - SPIKE_WIDTH * 3,
      BASE_HEIGHT / 2 - 40 - SPIKE_HEIGHT,
      3
    ),
    createSpike(
      1080 + 200 - SPIKE_WIDTH * 3,
      BASE_HEIGHT / 2 - 80 - SPIKE_HEIGHT,
      3
    ),
  ],
  collectibles: [
    // Collectibles above each spiked platform
    createCollectible(340 + 90, BASE_HEIGHT / 2 + 40 - 40),
    createCollectible(600 + 90, BASE_HEIGHT / 2 - 40),
    createCollectible(860 + 90, BASE_HEIGHT / 2 - 40 - 40),
    // Final collectible above last platform
    createCollectible(1120, BASE_HEIGHT / 2 - 80 - 40),
  ],
  goal: {
    position: { x: 1090, y: BASE_HEIGHT / 2 - 90 - GOAL_HEIGHT },
    size: { width: GOAL_WIDTH, height: GOAL_HEIGHT },
  },
  startPosition: { x: 120, y: BASE_HEIGHT / 2 + 60 },
};

// LEVEL 1: "Zigzag Gauntlet" - Centered, all platforms and objects around BASE_WIDTH/2, under 1000px width
const centerX = BASE_WIDTH / 2;
const level3 = {
  id: 3,
  name: 'Zigzag Gauntlet',
  platforms: [
    createPlatform(centerX - 100, BASE_HEIGHT / 2 + 140, centerX - 250, 22),
    createPlatform(centerX + 100, BASE_HEIGHT / 2 + 60, 500, 22),
    createPlatform(centerX - 450, BASE_HEIGHT / 2 + 140, 120, 22),
    createPlatform(centerX - 300, BASE_HEIGHT / 2 + 60, 120, 22),
    createPlatform(centerX - 130, BASE_HEIGHT / 2 - 20, 120, 22),
    createPlatform(centerX + 30, BASE_HEIGHT / 2 - 100, 120, 22),
    createPlatform(centerX + 300, BASE_HEIGHT / 2 - 100, 220, 22),
    createPlatform(centerX + 300, BASE_HEIGHT / 2 - 180, 150, 18),
    createPlatform(120, BASE_HEIGHT / 2 - 260, 600, 22),
  ],
  obstacles: [
    createSpike(centerX - 100, BASE_HEIGHT / 2 + 162, 3),
    createSpike(centerX + 30 + 100 - SPIKE_WIDTH * 2, BASE_HEIGHT / 2 + 82, 3),
    createSpike(centerX - 130, BASE_HEIGHT / 2 + 2, 3),
    createSpike(centerX + 130 - SPIKE_WIDTH * 2, BASE_HEIGHT / 2 - 78, 3),
    createSpike(centerX + 400 - SPIKE_WIDTH / 2, BASE_HEIGHT / 2 - 198, 3),
  ],
  collectibles: [
    createCollectible(centerX, BASE_HEIGHT / 2 + 190),
    createCollectible(centerX - 80, BASE_HEIGHT / 2 + 110),
    createCollectible(centerX + 80, BASE_HEIGHT / 2 + 30),
    createCollectible(centerX - 80, BASE_HEIGHT / 2 - 50),
    createCollectible(centerX + 80, BASE_HEIGHT / 2 - 130),
    createCollectible(centerX, BASE_HEIGHT / 2 - 210),
    createCollectible(centerX, BASE_HEIGHT / 2 - 280),
  ],
  goal: {
    // Goal at very top, above micro platform, centered
    position: { x: 130, y: BASE_HEIGHT / 2 - 270 - GOAL_HEIGHT },
    size: { width: GOAL_WIDTH, height: GOAL_HEIGHT },
  },
  startPosition: { x: centerX, y: BASE_HEIGHT },
};

// // LEVEL 4: "Precision Path" - Broader, more spaced, more structure
// const level4 = {
//   id: 4,
//   name: 'Precision Path',
//   platforms: [
//     // Start
//     createPlatform(100, BASE_HEIGHT / 2 + 40, 120, 22),
//     // Small platforms, spaced
//     createPlatform(350, BASE_HEIGHT / 2 + 80, 60, 22),
//     createPlatform(550, BASE_HEIGHT / 2 + 40, 60, 22),
//     createPlatform(750, BASE_HEIGHT / 2, 60, 22),
//     createPlatform(950, BASE_HEIGHT / 2 - 40, 60, 22),
//     createPlatform(1150, BASE_HEIGHT / 2 - 80, 60, 22),
//     // Safe zone, wide
//     createPlatform(1400, BASE_HEIGHT / 2 - 120, 180, 22),
//     // Precision section, small platforms
//     createPlatform(1700, BASE_HEIGHT / 2 - 160, 50, 22),
//     createPlatform(1800, BASE_HEIGHT / 2 - 200, 50, 22),
//     createPlatform(1900, BASE_HEIGHT / 2 - 240, 50, 22),
//     // Final
//     createPlatform(2050, BASE_HEIGHT / 2 - 280, 120, 22),
//   ],
//   obstacles: [
//     // Spikes under small platforms
//     createSpike(350, BASE_HEIGHT / 2 + 102, 2),
//     createSpike(550, BASE_HEIGHT / 2 + 62, 2),
//     createSpike(750, BASE_HEIGHT / 2 + 22, 2),
//     createSpike(950, BASE_HEIGHT / 2 - 18, 2),
//     createSpike(1150, BASE_HEIGHT / 2 - 58, 2),
//     // Precision spikes
//     createSpike(1700, BASE_HEIGHT / 2 - 138, 1),
//     createSpike(1800, BASE_HEIGHT / 2 - 178, 1),
//     createSpike(1900, BASE_HEIGHT / 2 - 218, 1),
//   ],
//   collectibles: [
//     // Challenging collectibles
//     createCollectible(410, BASE_HEIGHT / 2 + 10),
//     createCollectible(810, BASE_HEIGHT / 2 - 30),
//     createCollectible(1200, BASE_HEIGHT / 2 - 110),
//     createCollectible(1750, BASE_HEIGHT / 2 - 220),
//     createCollectible(2100, BASE_HEIGHT / 2 - 320),
//   ],
//   goal: {
//     position: { x: 2150, y: BASE_HEIGHT / 2 - 320 },
//     size: { width: GOAL_WIDTH, height: GOAL_HEIGHT },
//   },
//   startPosition: { x: 160, y: BASE_HEIGHT / 2 + 20 },
// };

// // LEVEL 5: "The Ultimate Challenge" - Broader, combines all elements, more structure
// const level5 = {
//   id: 5,
//   name: 'The Ultimate Challenge',
//   platforms: [
//     // Start
//     createPlatform(120, BASE_HEIGHT / 2 + 120, 140, 22),
//     // Jump section
//     createPlatform(400, BASE_HEIGHT / 2 + 80, 100, 22),
//     createPlatform(650, BASE_HEIGHT / 2 + 40, 100, 22),
//     // Vertical section
//     createPlatform(900, BASE_HEIGHT / 2, 100, 22),
//     createPlatform(1150, BASE_HEIGHT / 2 - 40, 100, 22),
//     createPlatform(1400, BASE_HEIGHT / 2 - 80, 100, 22),
//     // Spike alley, spaced
//     createPlatform(1650, BASE_HEIGHT / 2 - 120, 80, 22),
//     createPlatform(1850, BASE_HEIGHT / 2 - 160, 80, 22),
//     // Precision section
//     createPlatform(2050, BASE_HEIGHT / 2 - 200, 60, 22),
//     createPlatform(2200, BASE_HEIGHT / 2 - 240, 60, 22),
//     createPlatform(2350, BASE_HEIGHT / 2 - 280, 60, 22),
//     // Final approach, wide
//     createPlatform(2500, BASE_HEIGHT / 2 - 320, 180, 22),
//   ],
//   obstacles: [
//     // Jump section spikes
//     createSpike(520, BASE_HEIGHT / 2 + 102, 2),
//     // Vertical section spikes
//     createSpike(950, BASE_HEIGHT / 2 + 22, 2),
//     createSpike(1200, BASE_HEIGHT / 2 - 18, 2),
//     createSpike(1450, BASE_HEIGHT / 2 - 58, 2),
//     // Spike alley
//     createSpike(1700, BASE_HEIGHT / 2 - 98, 2),
//     createSpike(1900, BASE_HEIGHT / 2 - 138, 2),
//     // Precision spikes
//     createSpike(2100, BASE_HEIGHT / 2 - 218, 1),
//     createSpike(2250, BASE_HEIGHT / 2 - 258, 1),
//     createSpike(2400, BASE_HEIGHT / 2 - 298, 1),
//   ],
//   collectibles: [
//     // Strategic collectibles
//     createCollectible(480, BASE_HEIGHT / 2 + 60),
//     createCollectible(1000, BASE_HEIGHT / 2 - 30),
//     createCollectible(1500, BASE_HEIGHT / 2 - 110),
//     createCollectible(1750, BASE_HEIGHT / 2 - 180),
//     createCollectible(2300, BASE_HEIGHT / 2 - 320),
//     createCollectible(2600, BASE_HEIGHT / 2 - 360),
//   ],
//   goal: {
//     position: { x: 2650, y: BASE_HEIGHT / 2 - 360 },
//     size: { width: GOAL_WIDTH, height: GOAL_HEIGHT },
//   },
//   startPosition: { x: 180, y: BASE_HEIGHT / 2 + 100 },
// };

export const LEVELS: Level[] = [level1, level2, level3];
