// --- BASE GAME CONSTANTS (Fixed Sizes) ---
export const BASE_WIDTH = 1200;
export const BASE_HEIGHT = 700;

// Fixed sizes for game objects (do not scale with screen)
export const BALL_RADIUS = 20; // Ball/player radius (px)
export const LAND_HEIGHT = 150; // Land/ground height (px)
export const SPIKE_WIDTH = 18; // Spike base width (px)
export const SPIKE_HEIGHT = (SPIKE_WIDTH * Math.sqrt(3)) / 2; // Spike height (equilateral triangle)
export const STAR_RADIUS = 14; // Collectible star radius (px)
export const GOAL_WIDTH = 40; // Goal width (px)
export const GOAL_HEIGHT = 60; // Goal height (px)

// --- Physics constants (FAST DEFAULTS, HARDCODED) ---
export const GRAVITY = 0.649; // 0.55 * 1.18
export const JUMP_FORCE = -14.75; // -12.5 * 1.18
export const BOUNCE_FACTOR = 0.3675; // 0.35 * 1.05
export const FRICTION_GROUND = 0.92;
export const FRICTION_AIR = 0.99;
export const MAX_SPEED = 9.775; // 8.5 * 1.15
export const ACCELERATION = 0.826; // 0.7 * 1.18

