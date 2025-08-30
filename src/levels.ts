// levels.ts
import { Chunk, Level } from '@/types';
import {
  BASE_WIDTH,
  BASE_HEIGHT,
  BALL_RADIUS,
  GOAL_WIDTH,
  GOAL_HEIGHT,
  STAR_RADIUS,
} from '@/constant/constants';

// Helper to create custom platforms
function createPlatform(x: number, y: number, width: number, height: number) {
  return {
    position: { x, y },
    size: { width, height },
  };
}

// Helper to create spikes
// Only allow width for 3 spikes at a time (3 * 18 = 54)
function createSpike(x: number, y: number, width: number) {
  const SPIKE_WIDTH = 18;
  const maxSpikeWidth = 3 * SPIKE_WIDTH;
  return {
    position: { x, y },
    size: { width: maxSpikeWidth, height: 18 },
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

// LEVEL 1: "The Gauntlet" - Introduction with challenge
const level1 = {
  id: 1,
  name: 'The Gauntlet',
  platforms: [
    // Starting platform
    createPlatform(50, BASE_HEIGHT / 2 + 100, 120, 20),
    // Jump challenge
    createPlatform(250, BASE_HEIGHT / 2 + 50, 100, 20),
    // Spike gap
    createPlatform(450, BASE_HEIGHT / 2, 100, 20),
    // Precision jump
    createPlatform(650, BASE_HEIGHT / 2 - 50, 80, 20),
    // Final approach
    createPlatform(850, BASE_HEIGHT / 2 - 100, 120, 20),
  ],
  obstacles: [
    // Spikes under the gap
    createSpike(350, BASE_HEIGHT / 2 + 20, 100),
    // Spikes on precision platform
    createSpike(650, BASE_HEIGHT / 2 - 30, 30),
    createSpike(700, BASE_HEIGHT / 2 - 30, 30),
  ],
  collectibles: [
    // Risky collectible over spikes
    createCollectible(400, BASE_HEIGHT / 2 - 80),
    // Precision collectible
    createCollectible(690, BASE_HEIGHT / 2 - 100),
    // Final collectible
    createCollectible(910, BASE_HEIGHT / 2 - 150),
  ],
  goal: {
    position: { x: 950, y: BASE_HEIGHT / 2 - 150 },
    size: { width: GOAL_WIDTH, height: GOAL_HEIGHT },
  },
  startPosition: { x: 110, y: BASE_HEIGHT / 2 + 80 },
};

// LEVEL 2: "Spike Alley" - Navigation challenge
const level2 = {
  id: 2,
  name: 'Spike Alley',
  platforms: [
    // Start
    createPlatform(50, BASE_HEIGHT / 2 + 50, 100, 20),
    // Safe platform
    createPlatform(250, BASE_HEIGHT / 2, 80, 20),
    // Spike alley entrance
    createPlatform(400, BASE_HEIGHT / 2 - 50, 60, 20),
    // Middle platform
    createPlatform(550, BASE_HEIGHT / 2, 60, 20),
    // Exit platform
    createPlatform(700, BASE_HEIGHT / 2 - 50, 80, 20),
    // Final platform
    createPlatform(900, BASE_HEIGHT / 2 - 100, 120, 20),
  ],
  obstacles: [
    // Spike alley - dense spikes
    createSpike(330, BASE_HEIGHT / 2 + 20, 70),
    createSpike(460, BASE_HEIGHT / 2 - 30, 40),
    createSpike(510, BASE_HEIGHT / 2 - 30, 40),
    createSpike(610, BASE_HEIGHT / 2 + 20, 90),
    // Guard spikes
    createSpike(700, BASE_HEIGHT / 2 - 30, 20),
    createSpike(780, BASE_HEIGHT / 2 - 30, 20),
  ],
  collectibles: [
    // Safe collectible
    createCollectible(290, BASE_HEIGHT / 2 - 50),
    // Risky alley collectible
    createCollectible(505, BASE_HEIGHT / 2 - 100),
    // Exit collectible
    createCollectible(950, BASE_HEIGHT / 2 - 150),
  ],
  goal: {
    position: { x: 1000, y: BASE_HEIGHT / 2 - 150 },
    size: { width: GOAL_WIDTH, height: GOAL_HEIGHT },
  },
  startPosition: { x: 100, y: BASE_HEIGHT / 2 + 30 },
};

// LEVEL 3: "Vertical Ascent" - Climbing challenge
const level3 = {
  id: 3,
  name: 'Vertical Ascent',
  platforms: [
    // Base platform
    createPlatform(50, BASE_HEIGHT / 2 + 150, 150, 20),
    // First step
    createPlatform(100, BASE_HEIGHT / 2 + 100, 100, 20),
    // Second step
    createPlatform(150, BASE_HEIGHT / 2 + 50, 100, 20),
    // Third step
    createPlatform(200, BASE_HEIGHT / 2, 100, 20),
    // Fourth step
    createPlatform(250, BASE_HEIGHT / 2 - 50, 100, 20),
    // Fifth step
    createPlatform(300, BASE_HEIGHT / 2 - 100, 100, 20),
    // Top platform
    createPlatform(350, BASE_HEIGHT / 2 - 150, 200, 20),
  ],
  obstacles: [
    // Spikes on steps
    createSpike(150, BASE_HEIGHT / 2 + 120, 30),
    createSpike(250, BASE_HEIGHT / 2 + 70, 30),
    createSpike(350, BASE_HEIGHT / 2 + 20, 30),
    createSpike(450, BASE_HEIGHT / 2 - 30, 30),
  ],
  collectibles: [
    // Step collectibles
    createCollectible(200, BASE_HEIGHT / 2 + 70),
    createCollectible(300, BASE_HEIGHT / 2 + 20),
    createCollectible(400, BASE_HEIGHT / 2 - 30),
    // Top collectible
    createCollectible(450, BASE_HEIGHT / 2 - 200),
  ],
  goal: {
    position: { x: 500, y: BASE_HEIGHT / 2 - 200 },
    size: { width: GOAL_WIDTH, height: GOAL_HEIGHT },
  },
  startPosition: { x: 125, y: BASE_HEIGHT / 2 + 130 },
};

// LEVEL 4: "Precision Path" - Timing and accuracy
const level4 = {
  id: 4,
  name: 'Precision Path',
  platforms: [
    // Start
    createPlatform(50, BASE_HEIGHT / 2, 80, 20),
    // Small platforms
    createPlatform(180, BASE_HEIGHT / 2 + 30, 50, 20),
    createPlatform(280, BASE_HEIGHT / 2, 50, 20),
    createPlatform(380, BASE_HEIGHT / 2 - 30, 50, 20),
    createPlatform(480, BASE_HEIGHT / 2, 50, 20),
    createPlatform(580, BASE_HEIGHT / 2 + 30, 50, 20),
    // Safe zone
    createPlatform(700, BASE_HEIGHT / 2, 120, 20),
    // Precision section
    createPlatform(900, BASE_HEIGHT / 2 - 50, 40, 20),
    createPlatform(1000, BASE_HEIGHT / 2, 40, 20),
    createPlatform(1100, BASE_HEIGHT / 2 - 50, 40, 20),
    // Final
    createPlatform(1200, BASE_HEIGHT / 2 - 100, 100, 20),
  ],
  obstacles: [
    // Spikes under small platforms
    createSpike(180, BASE_HEIGHT / 2 + 50, 50),
    createSpike(280, BASE_HEIGHT / 2 + 20, 50),
    createSpike(380, BASE_HEIGHT / 2 - 10, 50),
    createSpike(480, BASE_HEIGHT / 2 + 20, 50),
    createSpike(580, BASE_HEIGHT / 2 + 50, 50),
    // Precision spikes
    createSpike(900, BASE_HEIGHT / 2 - 30, 40),
    createSpike(1000, BASE_HEIGHT / 2 + 20, 40),
    createSpike(1100, BASE_HEIGHT / 2 - 30, 40),
  ],
  collectibles: [
    // Challenging collectibles
    createCollectible(230, BASE_HEIGHT / 2 - 50),
    createCollectible(530, BASE_HEIGHT / 2 - 50),
    createCollectible(760, BASE_HEIGHT / 2 - 50),
    createCollectible(1050, BASE_HEIGHT / 2 - 100),
    createCollectible(1250, BASE_HEIGHT / 2 - 150),
  ],
  goal: {
    position: { x: 1300, y: BASE_HEIGHT / 2 - 150 },
    size: { width: GOAL_WIDTH, height: GOAL_HEIGHT },
  },
  startPosition: { x: 90, y: BASE_HEIGHT / 2 - 20 },
};

// LEVEL 5: "The Ultimate Challenge" - Combines all elements
const level5 = {
  id: 5,
  name: 'The Ultimate Challenge',
  platforms: [
    // Start
    createPlatform(50, BASE_HEIGHT / 2 + 100, 100, 20),
    // Jump section
    createPlatform(200, BASE_HEIGHT / 2 + 50, 80, 20),
    createPlatform(350, BASE_HEIGHT / 2, 80, 20),
    // Vertical section
    createPlatform(400, BASE_HEIGHT / 2 - 50, 80, 20),
    createPlatform(450, BASE_HEIGHT / 2 - 100, 80, 20),
    createPlatform(500, BASE_HEIGHT / 2 - 150, 80, 20),
    // Spike alley
    createPlatform(600, BASE_HEIGHT / 2 - 100, 60, 20),
    createPlatform(750, BASE_HEIGHT / 2 - 50, 60, 20),
    // Precision section
    createPlatform(900, BASE_HEIGHT / 2, 50, 20),
    createPlatform(1000, BASE_HEIGHT / 2 - 50, 50, 20),
    createPlatform(1100, BASE_HEIGHT / 2, 50, 20),
    // Final approach
    createPlatform(1200, BASE_HEIGHT / 2 - 100, 100, 20),
  ],
  obstacles: [
    // Jump section spikes
    createSpike(280, BASE_HEIGHT / 2 + 70, 70),
    // Vertical section spikes
    createSpike(450, BASE_HEIGHT / 2 - 130, 30),
    createSpike(500, BASE_HEIGHT / 2 - 180, 30),
    // Spike alley
    createSpike(660, BASE_HEIGHT / 2 - 80, 40),
    createSpike(720, BASE_HEIGHT / 2 - 80, 30),
    createSpike(810, BASE_HEIGHT / 2 - 30, 40),
    // Precision spikes
    createSpike(900, BASE_HEIGHT / 2 + 20, 50),
    createSpike(1000, BASE_HEIGHT / 2 - 30, 50),
    createSpike(1100, BASE_HEIGHT / 2 + 20, 50),
  ],
  collectibles: [
    // Strategic collectibles
    createCollectible(275, BASE_HEIGHT / 2),
    createCollectible(475, BASE_HEIGHT / 2 - 200),
    createCollectible(675, BASE_HEIGHT / 2 - 150),
    createCollectible(950, BASE_HEIGHT / 2 - 100),
    createCollectible(1050, BASE_HEIGHT / 2 - 150),
    createCollectible(1250, BASE_HEIGHT / 2 - 200),
  ],
  goal: {
    position: { x: 1350, y: BASE_HEIGHT / 2 - 200 },
    size: { width: GOAL_WIDTH, height: GOAL_HEIGHT },
  },
  startPosition: { x: 100, y: BASE_HEIGHT / 2 + 80 },
};

export const LEVELS: Level[] = [level1, level2, level3, level4, level5];
