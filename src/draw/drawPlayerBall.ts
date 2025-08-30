import { COLORS } from '@/constant/theme.constant';
import { RefObject } from 'react';

// --- Draw Player Ball ---
export function drawPlayerBall(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  player: RefObject<{
    position: { x: number; y: number };
    velocity: { x: number; y: number };
    radius: number;
    isJumping: boolean;
    grounded: boolean;
    lastGrounded: boolean;
  }>,
  scale: number
) {
  if (!canvas || !ctx || !player?.current) return;
  const { position, radius } = player.current;
  ctx.beginPath();
  ctx.arc(position.x * scale, position.y * scale, radius, 0, Math.PI * 2);
  ctx.fillStyle = COLORS.ball;
  ctx.shadowColor = '#0008';
  ctx.shadowBlur = 8 * scale;
  ctx.fill();
  ctx.shadowBlur = 0;
}
