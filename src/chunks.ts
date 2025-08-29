// chunks.ts
import { Chunk } from '@/types';

export const basicJumpChunk: Chunk = {
  id: 'basicJump',
  name: 'Basic Jump',
  platforms: [
    { position: { x: 0, y: 300 }, size: { width: 100, height: 20 } },
    { position: { x: 200, y: 300 }, size: { width: 100, height: 20 } },
  ],
  obstacles: [],
  collectibles: [],
  difficulty: 'easy',
  entryPoint: { x: 50, y: 280 }, // Center of the first platform
  exitPoint: { x: 250, y: 280 }, // Center of the second platform
};

export const spikeGapChunk: Chunk = {
  id: 'spikeGap',
  name: 'Spike Gap',
  platforms: [
    { position: { x: 0, y: 320 }, size: { width: 120, height: 20 } },
    { position: { x: 220, y: 320 }, size: { width: 120, height: 20 } },
  ],
  obstacles: [
    {
      position: { x: 120, y: 338 },
      size: { width: 100, height: 18 },
      type: 'spike',
    },
  ],
  collectibles: [],
  difficulty: 'medium',
  entryPoint: { x: 60, y: 300 },
  exitPoint: { x: 280, y: 300 },
};

export const collectibleArcChunk: Chunk = {
  id: 'collectibleArc',
  name: 'Collectible Arc',
  platforms: [
    { position: { x: 0, y: 350 }, size: { width: 100, height: 20 } },
    { position: { x: 300, y: 350 }, size: { width: 100, height: 20 } },
  ],
  obstacles: [],
  collectibles: [
    {
      position: { x: 100, y: 320 },
      radius: 14,
      type: 'ring',
      collected: false,
    },
    {
      position: { x: 170, y: 290 },
      radius: 14,
      type: 'ring',
      collected: false,
    },
    {
      position: { x: 240, y: 320 },
      radius: 14,
      type: 'ring',
      collected: false,
    },
  ],
  difficulty: 'medium',
  entryPoint: { x: 50, y: 330 },
  exitPoint: { x: 350, y: 330 },
};

export const verticalClimbChunk: Chunk = {
  id: 'verticalClimb',
  name: 'Vertical Climb',
  platforms: [
    { position: { x: 0, y: 400 }, size: { width: 100, height: 20 } },
    { position: { x: 60, y: 340 }, size: { width: 100, height: 20 } },
    { position: { x: 120, y: 280 }, size: { width: 100, height: 20 } },
    { position: { x: 180, y: 220 }, size: { width: 100, height: 20 } },
  ],
  obstacles: [],
  collectibles: [
    {
      position: { x: 210, y: 190 },
      radius: 14,
      type: 'ring',
      collected: false,
    },
  ],
  difficulty: 'hard',
  entryPoint: { x: 50, y: 380 },
  exitPoint: { x: 230, y: 200 },
};

export const obstacleTunnelChunk: Chunk = {
  id: 'obstacleTunnel',
  name: 'Obstacle Tunnel',
  platforms: [{ position: { x: 0, y: 320 }, size: { width: 400, height: 20 } }],
  obstacles: [
    {
      position: { x: 80, y: 338 },
      size: { width: 40, height: 18 },
      type: 'spike',
    },
    {
      position: { x: 180, y: 338 },
      size: { width: 40, height: 18 },
      type: 'spike',
    },
    {
      position: { x: 280, y: 338 },
      size: { width: 40, height: 18 },
      type: 'spike',
    },
  ],
  collectibles: [
    {
      position: { x: 360, y: 290 },
      radius: 14,
      type: 'ring',
      collected: false,
    },
  ],
  difficulty: 'hard',
  entryPoint: { x: 20, y: 300 },
  exitPoint: { x: 380, y: 300 },
};

export const easyFlatChunk: Chunk = {
  id: 'easyFlat',
  name: 'Easy Flat',
  platforms: [{ position: { x: 0, y: 400 }, size: { width: 300, height: 20 } }],
  obstacles: [],
  collectibles: [
    {
      position: { x: 150, y: 370 },
      radius: 14,
      type: 'ring',
      collected: false,
    },
  ],
  difficulty: 'easy',
  entryPoint: { x: 30, y: 380 },
  exitPoint: { x: 270, y: 380 },
};
