import { BASE_HEIGHT, BASE_WIDTH } from '@/constant/constants';
import { COLORS } from '@/constant/theme.constant';
import { GameState } from '@/types';

// --- Draw UI Overlay (Responsive) ---
export function drawUIOverlay(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  score: number,
  gameState: GameState,
  highScore: number,
  level: number,
  scale: number
) {
  if (!canvas || !ctx) return;

  ctx.save();

  ctx.font = `bold ${20 * scale}px sans-serif`;
  ctx.fillStyle = COLORS.text;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(
    `Score: ${score}`,
    (20 / BASE_WIDTH) * canvas.width,
    (20 / BASE_HEIGHT) * canvas.height
  );

  ctx.textAlign = 'center';
  ctx.fillStyle = COLORS.textSecondary;
  ctx.fillText(
    `Level: ${level}`,
    canvas.width / 2,
    (20 / BASE_HEIGHT) * canvas.height
  );

  if (gameState !== 'playing') {
    ctx.fillStyle = COLORS.overlay;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.textAlign = 'center';
    ctx.fillStyle = COLORS.text;
    ctx.font = `bold ${36 * scale}px sans-serif`;

    let mainText = '';
    let buttonText = '';
    if (gameState === 'start') {
      mainText = 'Bounce!';
      buttonText = 'Start';
    } else if (gameState === 'paused') {
      mainText = 'Paused';
      buttonText = 'Resume';
    } else if (gameState === 'gameOver') {
      mainText = 'Game Over';
      buttonText = 'Restart';
    } else if (gameState === 'levelComplete') {
      mainText = 'Level Complete!';
      buttonText = 'Next Level';
    }

    ctx.fillText(
      mainText,
      canvas.width / 2,
      canvas.height / 2 - (40 / BASE_HEIGHT) * canvas.height
    );

    if (gameState === 'gameOver' || gameState === 'levelComplete') {
      ctx.font = `${20 * scale}px sans-serif`;
      ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2);
    }

    // Button sizes based on constants and screen size
    let btnWidth = (140 / BASE_WIDTH) * canvas.width;
    let btnHeight = (44 / BASE_HEIGHT) * canvas.height;
    if (canvas.width < 600) {
      btnWidth = (220 / BASE_WIDTH) * canvas.width;
      btnHeight = (70 / BASE_HEIGHT) * canvas.height;
    } else if (canvas.width < 900) {
      btnWidth = (180 / BASE_WIDTH) * canvas.width;
      btnHeight = (56 / BASE_HEIGHT) * canvas.height;
    }
    ctx.font = `bold ${24 * scale}px sans-serif`;
    ctx.fillStyle = COLORS.buttonBg;
    ctx.fillRect(
      canvas.width / 2 - btnWidth / 2,
      canvas.height / 2 + (40 / BASE_HEIGHT) * canvas.height,
      btnWidth,
      btnHeight
    );
    ctx.strokeStyle = COLORS.buttonBorder;
    ctx.strokeRect(
      canvas.width / 2 - btnWidth / 2,
      canvas.height / 2 + (40 / BASE_HEIGHT) * canvas.height,
      btnWidth,
      btnHeight
    );
    ctx.fillStyle = COLORS.buttonText;
    ctx.textBaseline = 'middle';
    ctx.fillText(
      buttonText,
      canvas.width / 2,
      canvas.height / 2 + (40 / BASE_HEIGHT) * canvas.height + btnHeight / 2
    );
  }

  if (canvas.width > 600) {
    ctx.font = `bold ${16 * scale}px sans-serif`;
    ctx.fillStyle = COLORS.textSecondary;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText(
      `High Score: ${highScore}`,
      canvas.width - (20 / BASE_WIDTH) * canvas.width,
      (20 / BASE_HEIGHT) * canvas.height
    );
  }

  ctx.restore();
}
