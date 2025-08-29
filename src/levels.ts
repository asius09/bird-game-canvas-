// levels.ts
import { Level } from '@/types';

// --- Level Design Rules (see @page.tsx for physics and rendering) ---
// - Canvas is full width/height, but "land" is always at the bottom: y = canvas.height - LAND_HEIGHT (LAND_HEIGHT = 150)
// - Ball/player radius: 20px
// - Platform min height: 16px, typical: 20-24px
// - Platform min width: 80px, typical: 120-200px
// - Max jump height: ~120px (vertical gap between surfaces <= 110px for fair jumps)
// - All y values for platforms, obstacles, collectibles, and goal are above the land (y + height/radius < canvas.height - LAND_HEIGHT)
// - No overlaps: platforms, obstacles, collectibles, and goal must not overlap (account for their width/height/radius)
// - Collectibles (coins, stars, etc) are always in the air, never inside or touching platforms/obstacles, and always within jumpable range from a surface
// - The exit gate (goal) is always on a surface (platform or land), never floating
// - Obstacles can be on or near platforms, or float alone, but never overlap with collectibles
// - Surfaces (platforms) are spaced for jumpability and friction (horizontal gaps <= 300px, vertical <= 110px)
// - The level is broad and fills a 1280x720 canvas (full HD, but scales with window)
// - All elements are mapped to avoid overlap and maximize play area

export const LEVELS: Level[] = [
  {
    id: 1,
    name: 'Neon Playground XL',
    platforms: [
      // Floating platforms, staggered for jumpability (vertical gaps <= 110, horizontal <= 300)
      { position: { x: 200, y: 500 }, size: { width: 180, height: 22 } },
      { position: { x: 450, y: 410 }, size: { width: 160, height: 22 } },
      { position: { x: 650, y: 320 }, size: { width: 180, height: 22 } },
      { position: { x: 860, y: 250 }, size: { width: 180, height: 22 } },
      { position: { x: 1050, y: 200 }, size: { width: 180, height: 22 } },
      { position: { x: 1200, y: 150 }, size: { width: 180, height: 18 } },
    ],
    obstacles: [
      // All obstacles are spikes only
      {
        position: { x: 780, y: 298 },
        size: { width: 60, height: 22 },
        type: 'spike',
      },
    ],
    collectibles: [
      {
        position: { x: 280, y: 460 }, // centered above platform, 30px above
        radius: 16,
        type: 'ring',
        collected: false,
      },
      {
        position: { x: 540, y: 370 }, // centered above platform, 30px above
        radius: 16,
        type: 'ring',
        collected: false,
      },
      {
        position: { x: 720, y: 290 }, // centered above platform, 30px above
        radius: 16,
        type: 'ring',
        collected: false,
      },
      {
        position: { x: 1260, y: 120 }, // centered above platform, 30px above
        radius: 18,
        type: 'ring',
        collected: false,
      },
    ],
    // Gate/goal is always on a surface (here, on the secret platform)
    goal: { position: { x: 1330, y: 90 }, size: { width: 50, height: 60 } },
    // Start position is above the ground, with room for friction/acceleration
    startPosition: { x: 60, y: 540 },
  },
  // Add more levels here
];
