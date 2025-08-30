import { LAND_HEIGHT } from '@/constant/constants';
import { COLORS } from '@/constant/theme.constant';
import { useGameScale } from '@/hooks/useGameScale';
import { Level } from '@/types';

// --- Draw Platforms ---
export function drawPlatforms(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  currentLevel: React.RefObject<Level>,
  scale: number
) {
  if (!ctx) return;
  currentLevel.current.platforms.forEach((platform) => {
    ctx.fillStyle = COLORS.platform;
    ctx.fillRect(
      platform.position.x * scale,
      platform.position.y * scale,
      platform.size.width * scale,
      platform.size.height * scale
    );

    ctx.fillStyle = COLORS.platformHighlight;
    ctx.fillRect(
      platform.position.x * scale,
      platform.position.y * scale,
      platform.size.width * scale,
      (12 / LAND_HEIGHT) * LAND_HEIGHT // 12px relative to land height
    );

    ctx.fillStyle = COLORS.platformShadow;
    ctx.fillRect(
      platform.position.x * scale,
      (platform.position.y +
        platform.size.height -
        (12 / LAND_HEIGHT) * LAND_HEIGHT) *
        scale,
      platform.size.width * scale,
      (12 / LAND_HEIGHT) * LAND_HEIGHT
    );
  });
}
