import { Chunk } from '@/types';
import {
  BASE_WIDTH,
  BASE_HEIGHT,
  BALL_RADIUS,
  LAND_HEIGHT,
  SPIKE_WIDTH,
  SPIKE_HEIGHT,
  STAR_RADIUS,
  GOAL_WIDTH,
  GOAL_HEIGHT,
} from '@/constant/constants';

// All chunk coordinates and sizes are in "game world" units, not pixels, and use constants for all dimensions.

export const basicJumpChunk: Chunk = {
  id: 'basicJump',
  name: 'Basic Jump',
  platforms: [
    {
      position: { x: 0, y: BASE_HEIGHT / 2 },
      size: { width: 5 * BALL_RADIUS, height: BALL_RADIUS * 0.85 },
    },
    {
      position: { x: 8 * BALL_RADIUS, y: BASE_HEIGHT / 2 },
      size: { width: 5 * BALL_RADIUS, height: BALL_RADIUS * 0.85 },
    },
  ],
  obstacles: [],
  collectibles: [],
  difficulty: 'easy',
  entryPoint: {
    x: 0.5 * 5 * BALL_RADIUS,
    y: BASE_HEIGHT / 2 - BALL_RADIUS,
  },
  exitPoint: {
    x: 8 * BALL_RADIUS + 0.5 * 5 * BALL_RADIUS,
    y: BASE_HEIGHT / 2 - BALL_RADIUS,
  },
};

export const spikeGapChunk: Chunk = {
  id: 'spikeGap',
  name: 'Spike Gap',
  platforms: [
    {
      position: { x: 0, y: BASE_HEIGHT / 2 + 20 },
      size: { width: 6 * BALL_RADIUS, height: BALL_RADIUS * 0.85 },
    },
    {
      position: { x: 8 * BALL_RADIUS, y: BASE_HEIGHT / 2 + 20 },
      size: { width: 6 * BALL_RADIUS, height: BALL_RADIUS * 0.85 },
    },
  ],
  obstacles: [
    {
      position: {
        x: 6 * BALL_RADIUS,
        y: BASE_HEIGHT / 2 + 20 + BALL_RADIUS * 0.85,
      },
      size: { width: 2 * BALL_RADIUS, height: SPIKE_HEIGHT },
      type: 'spike',
    },
  ],
  collectibles: [],
  difficulty: 'medium',
  entryPoint: {
    x: 0.5 * 6 * BALL_RADIUS,
    y: BASE_HEIGHT / 2 + 20 - BALL_RADIUS,
  },
  exitPoint: {
    x: 8 * BALL_RADIUS + 0.5 * 6 * BALL_RADIUS,
    y: BASE_HEIGHT / 2 + 20 - BALL_RADIUS,
  },
};

export const collectibleArcChunk: Chunk = {
  id: 'collectibleArc',
  name: 'Collectible Arc',
  platforms: [
    {
      position: { x: 0, y: BASE_HEIGHT / 2 + 50 },
      size: { width: 5 * BALL_RADIUS, height: BALL_RADIUS * 0.85 },
    },
    {
      position: { x: 10 * BALL_RADIUS, y: BASE_HEIGHT / 2 + 50 },
      size: { width: 5 * BALL_RADIUS, height: BALL_RADIUS * 0.85 },
    },
  ],
  obstacles: [],
  collectibles: [
    {
      position: {
        x: 5 * BALL_RADIUS,
        y: BASE_HEIGHT / 2 + 20,
      },
      radius: STAR_RADIUS,
      type: 'ring',
      collected: false,
    },
    {
      position: {
        x: 7.5 * BALL_RADIUS,
        y: BASE_HEIGHT / 2 - 10,
      },
      radius: STAR_RADIUS,
      type: 'ring',
      collected: false,
    },
    {
      position: {
        x: 10 * BALL_RADIUS,
        y: BASE_HEIGHT / 2 + 20,
      },
      radius: STAR_RADIUS,
      type: 'ring',
      collected: false,
    },
  ],
  difficulty: 'medium',
  entryPoint: {
    x: 0.5 * 5 * BALL_RADIUS,
    y: BASE_HEIGHT / 2 + 50 - BALL_RADIUS,
  },
  exitPoint: {
    x: 10 * BALL_RADIUS + 0.5 * 5 * BALL_RADIUS,
    y: BASE_HEIGHT / 2 + 50 - BALL_RADIUS,
  },
};

export const verticalClimbChunk: Chunk = {
  id: 'verticalClimb',
  name: 'Vertical Climb',
  platforms: [
    {
      position: { x: 0, y: BASE_HEIGHT / 2 + 100 },
      size: { width: 4 * BALL_RADIUS, height: BALL_RADIUS * 0.85 },
    },
    {
      position: { x: 2 * BALL_RADIUS, y: BASE_HEIGHT / 2 + 60 },
      size: { width: 4 * BALL_RADIUS, height: BALL_RADIUS * 0.85 },
    },
    {
      position: { x: 4 * BALL_RADIUS, y: BASE_HEIGHT / 2 + 20 },
      size: { width: 4 * BALL_RADIUS, height: BALL_RADIUS * 0.85 },
    },
    {
      position: { x: 6 * BALL_RADIUS, y: BASE_HEIGHT / 2 - 20 },
      size: { width: 4 * BALL_RADIUS, height: BALL_RADIUS * 0.85 },
    },
  ],
  obstacles: [],
  collectibles: [
    {
      position: {
        x: 8 * BALL_RADIUS + 0.5 * 4 * BALL_RADIUS,
        y: BASE_HEIGHT / 2 - 50,
      },
      radius: STAR_RADIUS,
      type: 'ring',
      collected: false,
    },
  ],
  difficulty: 'hard',
  entryPoint: {
    x: 0.5 * 4 * BALL_RADIUS,
    y: BASE_HEIGHT / 2 + 100 - BALL_RADIUS,
  },
  exitPoint: {
    x: 8 * BALL_RADIUS + 0.5 * 4 * BALL_RADIUS,
    y: BASE_HEIGHT / 2 - 50,
  },
};

export const obstacleTunnelChunk: Chunk = {
  id: 'obstacleTunnel',
  name: 'Obstacle Tunnel',
  platforms: [
    {
      position: { x: 0, y: BASE_HEIGHT / 2 + 20 },
      size: { width: 16 * BALL_RADIUS, height: BALL_RADIUS * 0.85 },
    },
  ],
  obstacles: [
    {
      position: {
        x: 3 * BALL_RADIUS,
        y: BASE_HEIGHT / 2 + 20 + BALL_RADIUS * 0.85,
      },
      size: { width: 2 * BALL_RADIUS, height: SPIKE_HEIGHT },
      type: 'spike',
    },
    {
      position: {
        x: 7 * BALL_RADIUS,
        y: BASE_HEIGHT / 2 + 20 + BALL_RADIUS * 0.85,
      },
      size: { width: 2 * BALL_RADIUS, height: SPIKE_HEIGHT },
      type: 'spike',
    },
    {
      position: {
        x: 11 * BALL_RADIUS,
        y: BASE_HEIGHT / 2 + 20 + BALL_RADIUS * 0.85,
      },
      size: { width: 2 * BALL_RADIUS, height: SPIKE_HEIGHT },
      type: 'spike',
    },
  ],
  collectibles: [
    {
      position: {
        x: 15 * BALL_RADIUS,
        y: BASE_HEIGHT / 2 - 20,
      },
      radius: STAR_RADIUS,
      type: 'ring',
      collected: false,
    },
  ],
  difficulty: 'hard',
  entryPoint: {
    x: 0.5 * BALL_RADIUS * 2,
    y: BASE_HEIGHT / 2 + 20 - BALL_RADIUS,
  },
  exitPoint: {
    x: 15 * BALL_RADIUS,
    y: BASE_HEIGHT / 2 + 20 - BALL_RADIUS,
  },
};

export const easyFlatChunk: Chunk = {
  id: 'easyFlat',
  name: 'Easy Flat',
  platforms: [
    {
      position: { x: 0, y: BASE_HEIGHT / 2 + 100 },
      size: { width: 12 * BALL_RADIUS, height: BALL_RADIUS * 0.85 },
    },
  ],
  obstacles: [],
  collectibles: [
    {
      position: {
        x: 6 * BALL_RADIUS,
        y: BASE_HEIGHT / 2 + 70,
      },
      radius: STAR_RADIUS,
      type: 'ring',
      collected: false,
    },
  ],
  difficulty: 'easy',
  entryPoint: {
    x: 1.5 * BALL_RADIUS,
    y: BASE_HEIGHT / 2 + 100 - BALL_RADIUS,
  },
  exitPoint: {
    x: 10.5 * BALL_RADIUS,
    y: BASE_HEIGHT / 2 + 100 - BALL_RADIUS,
  },
};
