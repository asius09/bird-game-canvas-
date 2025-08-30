import { BALL_RADIUS } from '@/constant/constants';
import { COLORS } from '@/constant/theme.constant';
import { useGameScale } from '@/hooks/useGameScale';

// --- Draw Walls (like Bounce Nokia) ---
export function drawWalls(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  scale: number
) {
  if (!canvas || !ctx) return;
  // Wall thickness relative to ball radius
  const wallThickness = Math.max(BALL_RADIUS * 0.7, 8 * scale);

  ctx.save();
  ctx.fillStyle = COLORS.platform; // Use platform color for walls

  // Top wall
  ctx.fillRect(0, 0, canvas.width, wallThickness);
  // Left wall
  ctx.fillRect(0, 0, wallThickness, canvas.height);
  // Right wall
  ctx.fillRect(canvas.width - wallThickness, 0, wallThickness, canvas.height);
  // Optionally, bottom wall (but usually ground is LAND_HEIGHT)
  // ctx.fillRect(
  //   0,
  //   canvas.height - wallThickness,
  //   canvas.width,
  //   wallThickness
  // );

  // Add a highlight line for retro effect
  ctx.fillStyle = COLORS.platformHighlight;
  // Top highlight
  ctx.fillRect(0, 0, canvas.width, wallThickness * 0.18);
  // Left highlight
  ctx.fillRect(0, 0, wallThickness * 0.18, canvas.height);
  // Right highlight
  ctx.fillRect(
    canvas.width - wallThickness,
    0,
    wallThickness * 0.18,
    canvas.height
  );
  ctx.restore();
}
