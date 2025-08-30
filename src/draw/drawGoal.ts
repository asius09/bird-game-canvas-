import { BALL_RADIUS, BASE_HEIGHT, BASE_WIDTH } from '@/constant/constants';
import { COLORS } from '@/constant/theme.constant';
import { useGameScale } from '@/hooks/useGameScale';
import { drawRoundedRect } from './drawRoundedRect';
import { Level } from '@/types';

// --- Draw Goal (platform color, always show "Next Level" label, only top rounded, bigger) ---
export function drawGoal(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  currentLevel: React.RefObject<Level>,
  scale: number
) {
  if (!canvas || !ctx) return;
  const g = currentLevel.current.goal;
  ctx.save();
  // Make the goal platform bigger (height and width increased by 30%)
  const scaleUp = 1.3;
  const goalX =
    g.position.x * scale - (g.size.width * scale * (scaleUp - 1)) / 2;
  const goalY =
    g.position.y * scale - (g.size.height * scale * (scaleUp - 1)) / 2;
  const goalWidth = g.size.width * scale * scaleUp;
  const goalHeight = g.size.height * scale * scaleUp;
  const r = (18 / BALL_RADIUS) * BALL_RADIUS; // Use 18px relative to ball radius

  // Draw only top rounded rect for goal (bottom corners not rounded)
  ctx.beginPath();
  // Top left corner (rounded)
  ctx.moveTo(goalX + r, goalY);
  ctx.lineTo(goalX + goalWidth - r, goalY);
  ctx.quadraticCurveTo(goalX + goalWidth, goalY, goalX + goalWidth, goalY + r);
  // Right side down to bottom right (not rounded)
  ctx.lineTo(goalX + goalWidth, goalY + goalHeight);
  // Bottom edge to bottom left (not rounded)
  ctx.lineTo(goalX, goalY + goalHeight);
  // Left side up to top left (rounded)
  ctx.lineTo(goalX, goalY + r);
  ctx.quadraticCurveTo(goalX, goalY, goalX + r, goalY);
  ctx.closePath();

  ctx.fillStyle = COLORS.platform;
  ctx.fill();
  ctx.lineWidth = 2.5 * scale;
  ctx.strokeStyle = COLORS.platformHighlight;
  ctx.stroke();
  ctx.restore();

  ctx.save();
  // Make the label smaller and move it up a bit
  const labelWidth = (100 / BASE_WIDTH) * canvas.width;
  const labelHeight = (24 / BASE_HEIGHT) * canvas.height;
  const labelX = goalX + goalWidth / 2 - labelWidth / 2;
  const labelY = goalY - labelHeight - (8 / BASE_HEIGHT) * canvas.height;
  ctx.globalAlpha = 0.96;
  ctx.fillStyle = COLORS.platformHighlight;
  ctx.beginPath();
  const labelRadius = (10 / BALL_RADIUS) * BALL_RADIUS;
  drawRoundedRect(ctx, labelX, labelY, labelWidth, labelHeight, labelRadius);
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.font = `bold ${13 * scale}px Inter, sans-serif`;
  ctx.fillStyle = COLORS.buttonText;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Next Level', goalX + goalWidth / 2, labelY + labelHeight / 2);
  ctx.restore();
}
