import { SPIKE_HEIGHT, SPIKE_WIDTH } from '@/constant/constants';
import { COLORS } from '@/constant/theme.constant';
import { Level } from '@/types';

// --- Draw Obstacles (Spikes) ---
export function drawObstacles(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  currentLevel: React.RefObject<Level>,
  scale: number
) {
  if (!canvas || !ctx) return;
  currentLevel.current.obstacles.forEach((obstacle) => {
    ctx.fillStyle = COLORS.obstacle;
    // Use SPIKE_WIDTH from constants for spike count
    const spikeCount = Math.max(
      1,
      Math.floor((obstacle.size.width * scale) / SPIKE_WIDTH)
    );
    const actualSpikeWidth = (obstacle.size.width * scale) / spikeCount;

    for (let i = 0; i < spikeCount; i++) {
      const x = obstacle.position.x * scale + i * actualSpikeWidth;
      const baseY = (obstacle.position.y + obstacle.size.height) * scale;
      const tipY = baseY - Math.min(SPIKE_HEIGHT, obstacle.size.height * scale);

      ctx.beginPath();
      ctx.moveTo(x, baseY);
      ctx.lineTo(x + actualSpikeWidth / 2, tipY);
      ctx.lineTo(x + actualSpikeWidth, baseY);
      ctx.closePath();
      ctx.fill();
    }
  });
}
