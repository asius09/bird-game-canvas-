import { BASE_WIDTH, LAND_HEIGHT } from '@/constant/constants';
import { COLORS } from '@/constant/theme.constant';

// --- Draw Background ---
export function drawBackground(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  scale: number
) {
  if (!canvas || !ctx) return;
  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, '#6ec6f1');
  grad.addColorStop(1, '#fef6e4');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = COLORS.land;
  ctx.fillRect(0, canvas.height - LAND_HEIGHT, canvas.width, LAND_HEIGHT);

  ctx.save();
  ctx.strokeStyle = COLORS.landGrid;
  ctx.lineWidth = 2 * scale;
  // Use a grid size based on BASE_WIDTH for consistency
  const gridSize = (36 / BASE_WIDTH) * canvas.width;
  for (let y = canvas.height - LAND_HEIGHT; y < canvas.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  ctx.restore();
}
