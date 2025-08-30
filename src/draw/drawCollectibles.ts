import { useGameScale } from '@/hooks/useGameScale';
import { Level } from '@/types';
import { STAR_RADIUS as STAR_SIZE } from '@/constant/constants';
import { COLORS } from '@/constant/theme.constant';

// --- Draw Collectibles ---
export function drawCollectibles(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  currentLevel: React.RefObject<Level>,
  scale: number

) {
  if (!canvas || !ctx) return;
  currentLevel.current.collectibles.forEach((c) => {
    if (!c.collected) {
      ctx.save();
      ctx.translate(c.position.x * scale, c.position.y * scale);

      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        const x = Math.cos(angle) * STAR_SIZE;
        const y = Math.sin(angle) * STAR_SIZE;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        const innerAngle = angle + Math.PI / 5;
        const innerX = Math.cos(innerAngle) * (STAR_SIZE * 0.5);
        const innerY = Math.sin(innerAngle) * (STAR_SIZE * 0.5);
        ctx.lineTo(innerX, innerY);
      }
      ctx.closePath();

      ctx.fillStyle = COLORS.collectible;
      ctx.fill();

      ctx.lineWidth = 2 * scale;
      ctx.strokeStyle = COLORS.collectibleOutline;
      ctx.stroke();

      ctx.restore();
    }
  });
}
