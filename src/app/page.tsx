'use client';
import React, { useRef, useEffect, useState } from 'react';
import { LevelManager } from '@/LevelManager';
import { Level } from '@/types';
import {
  IconPlayerPauseFilled,
  IconArrowUp,
  IconArrowLeft,
  IconArrowRight,
} from '@tabler/icons-react';
import { Button } from '@/components/Button';
import { COLORS } from '@/constant/theme.constant';
import { useGameScale } from '@/hooks/useGameScale';
import {
  BALL_RADIUS as BASE_BALL_RADIUS,
  LAND_HEIGHT as BASE_LAND_HEIGHT,
  SPIKE_WIDTH as BASE_SPIKE_WIDTH,
  SPIKE_HEIGHT as BASE_SPIKE_HEIGHT,
  GRAVITY,
  JUMP_FORCE,
  BOUNCE_FACTOR,
  FRICTION_GROUND,
  FRICTION_AIR,
  MAX_SPEED,
  ACCELERATION,
  BASE_WIDTH,
  BASE_HEIGHT,
  STAR_RADIUS,
  GOAL_WIDTH,
  GOAL_HEIGHT,
} from '@/constant/constants';

// --- Modular Drawing Functions ---
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// --- Main Game Component ---
export default function BounceGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scale = useGameScale();

  // Use @constants.ts for all fixed game object sizes
  const BALL_RADIUS = BASE_BALL_RADIUS * scale;
  const LAND_HEIGHT = BASE_LAND_HEIGHT * scale;
  const SPIKE_WIDTH = BASE_SPIKE_WIDTH * scale;
  const SPIKE_HEIGHT = BASE_SPIKE_HEIGHT * scale;
  const STAR_SIZE = STAR_RADIUS * scale;
  const GOAL_W = GOAL_WIDTH * scale;
  const GOAL_H = GOAL_HEIGHT * scale;

  // State
  const [gameState, setGameState] = useState<
    'start' | 'playing' | 'paused' | 'gameOver' | 'levelComplete'
  >('start');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);

  const levelManager = useRef<LevelManager>(new LevelManager());
  const currentLevel = useRef<Level>(levelManager.current.getCurrentLevel());

  // Player state
  const player = useRef({
    position: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    radius: BALL_RADIUS,
    isJumping: true,
    grounded: false,
    lastGrounded: false,
  });

  // Input state
  const keysPressed = useRef({ left: false, right: false });

  // --- Game Initialization ---
  const initializeGame = () => {
    const lvl = levelManager.current.getCurrentLevel();
    currentLevel.current = lvl;
    player.current = {
      position: { ...lvl.startPosition },
      velocity: { x: 0, y: 0 },
      radius: BALL_RADIUS,
      isJumping: true,
      grounded: false,
      lastGrounded: false,
    };
    setScore(0);
    setLevel(lvl.id);
    setGameState('playing');
  };

  // --- Start Game ---
  const startNewGame = () => {
    levelManager.current = new LevelManager();
    initializeGame();
  };

  // --- Canvas Drawing and Game Loop ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // --- Responsive Canvas ---
    const resizeCanvas = () => {
      // Use BASE_WIDTH/BASE_HEIGHT as aspect ratio reference, but fill window
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // --- Draw Background ---
    function drawBackground() {
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
      for (
        let y = canvas.height - LAND_HEIGHT;
        y < canvas.height;
        y += gridSize
      ) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      ctx.restore();
    }

    // --- Draw Platforms ---
    function drawPlatforms() {
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
          (12 / BASE_LAND_HEIGHT) * LAND_HEIGHT // 12px relative to land height
        );

        ctx.fillStyle = COLORS.platformShadow;
        ctx.fillRect(
          platform.position.x * scale,
          (platform.position.y +
            platform.size.height -
            (12 / BASE_LAND_HEIGHT) * BASE_LAND_HEIGHT) *
            scale,
          platform.size.width * scale,
          (12 / BASE_LAND_HEIGHT) * LAND_HEIGHT
        );
      });
    }

    // --- Draw Obstacles (Spikes) ---
    function drawObstacles() {
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
          const tipY =
            baseY - Math.min(SPIKE_HEIGHT, obstacle.size.height * scale);

          ctx.beginPath();
          ctx.moveTo(x, baseY);
          ctx.lineTo(x + actualSpikeWidth / 2, tipY);
          ctx.lineTo(x + actualSpikeWidth, baseY);
          ctx.closePath();
          ctx.fill();
        }
      });
    }

    // --- Draw Player Ball ---
    function drawPlayerBall() {
      if (!canvas || !ctx) return;
      const { position, radius } = player.current;
      ctx.beginPath();
      ctx.arc(position.x * scale, position.y * scale, radius, 0, Math.PI * 2);
      ctx.fillStyle = COLORS.ball;
      ctx.shadowColor = '#0008';
      ctx.shadowBlur = 8 * scale;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // --- Draw Collectibles ---
    function drawCollectibles() {
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

    // --- Draw Goal (platform color, always show "Next Level" label, only top rounded, bigger) ---
    function drawGoal() {
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
      const r = (18 / BASE_BALL_RADIUS) * BALL_RADIUS; // Use 18px relative to ball radius

      // Draw only top rounded rect for goal (bottom corners not rounded)
      ctx.beginPath();
      // Top left corner (rounded)
      ctx.moveTo(goalX + r, goalY);
      ctx.lineTo(goalX + goalWidth - r, goalY);
      ctx.quadraticCurveTo(
        goalX + goalWidth,
        goalY,
        goalX + goalWidth,
        goalY + r
      );
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
      const labelRadius = (10 / BASE_BALL_RADIUS) * BALL_RADIUS;
      drawRoundedRect(
        ctx,
        labelX,
        labelY,
        labelWidth,
        labelHeight,
        labelRadius
      );
      ctx.fill();
      ctx.globalAlpha = 1;

      ctx.font = `bold ${13 * scale}px Inter, sans-serif`;
      ctx.fillStyle = COLORS.buttonText;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        'Next Level',
        goalX + goalWidth / 2,
        labelY + labelHeight / 2
      );
      ctx.restore();
    }

    // --- Draw UI Overlay (Responsive) ---
    function drawUIOverlay() {
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

    // --- Main Draw ---
    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBackground();
      drawPlatforms();
      drawObstacles();
      drawCollectibles();
      drawGoal();
      drawPlayerBall();
      drawUIOverlay();
    }

    // --- Physics Update ---
    const updatePhysics = () => {
      if (gameState !== 'playing') return;

      const playerBall = player.current;
      const levelData = currentLevel.current;

      // Save last grounded state for coyote time
      playerBall.lastGrounded = playerBall.grounded;

      // Gravity (faster)
      playerBall.velocity.y += GRAVITY;

      // Input (faster acceleration)
      if (keysPressed.current.left) {
        playerBall.velocity.x -= ACCELERATION;
      }
      if (keysPressed.current.right) {
        playerBall.velocity.x += ACCELERATION;
      }

      // Clamp horizontal speed (higher max)
      playerBall.velocity.x = Math.max(
        -MAX_SPEED,
        Math.min(MAX_SPEED, playerBall.velocity.x)
      );

      // Apply friction
      if (playerBall.grounded) {
        playerBall.velocity.x *= FRICTION_GROUND;
      } else {
        playerBall.velocity.x *= FRICTION_AIR;
      }

      // Update position
      playerBall.position.x += playerBall.velocity.x;
      playerBall.position.y += playerBall.velocity.y;

      // Ground collision
      const groundY = (canvas.height - LAND_HEIGHT) / scale;
      if (playerBall.position.y + playerBall.radius > groundY) {
        playerBall.position.y = groundY - playerBall.radius;
        if (playerBall.velocity.y > 0) {
          playerBall.velocity.y = -playerBall.velocity.y * BOUNCE_FACTOR;
        }
        if (Math.abs(playerBall.velocity.y) < 1.2) {
          playerBall.velocity.y = 0;
          playerBall.isJumping = false;
        }
        playerBall.grounded = true;
      } else {
        playerBall.grounded = false;
      }

      // Platform collisions (AABB, resolve with proper axis separation)
      levelData.platforms.forEach((platform) => {
        const platformLeft = platform.position.x;
        const platformRight = platform.position.x + platform.size.width;
        const platformTop = platform.position.y;
        const platformBottom = platform.position.y + platform.size.height;

        const playerLeft = playerBall.position.x - playerBall.radius;
        const playerRight = playerBall.position.x + playerBall.radius;
        const playerTop = playerBall.position.y - playerBall.radius;
        const playerBottom = playerBall.position.y + playerBall.radius;

        if (
          playerRight > platformLeft &&
          playerLeft < platformRight &&
          playerBottom > platformTop &&
          playerTop < platformBottom
        ) {
          // Calculate overlap on each axis
          const overlapX1 = playerRight - platformLeft;
          const overlapX2 = platformRight - playerLeft;
          const overlapY1 = playerBottom - platformTop;
          const overlapY2 = platformBottom - playerTop;

          const minOverlapX = overlapX1 < overlapX2 ? overlapX1 : overlapX2;
          const minOverlapY = overlapY1 < overlapY2 ? overlapY1 : overlapY2;

          if (minOverlapY < minOverlapX) {
            // Resolve vertically
            if (
              playerBall.velocity.y > 0 &&
              playerBottom - playerBall.velocity.y <= platformTop
            ) {
              // Landing from above
              playerBall.position.y = platformTop - playerBall.radius;
              if (playerBall.velocity.y > 0) {
                playerBall.velocity.y = -playerBall.velocity.y * BOUNCE_FACTOR;
                if (Math.abs(playerBall.velocity.y) < 1.2) {
                  playerBall.velocity.y = 0;
                  playerBall.isJumping = false;
                }
              }
              playerBall.grounded = true;
            } else if (
              playerBall.velocity.y < 0 &&
              playerTop - playerBall.velocity.y >= platformBottom
            ) {
              // Hitting from below
              playerBall.position.y = platformBottom + playerBall.radius;
              playerBall.velocity.y = 0;
            } else {
              // Already overlapping vertically, push out
              if (overlapY1 < overlapY2) {
                playerBall.position.y -= overlapY1;
                playerBall.velocity.y = 0;
              } else {
                playerBall.position.y += overlapY2;
                playerBall.velocity.y = 0;
              }
            }
          } else {
            // Resolve horizontally
            if (playerBall.position.x < platformLeft) {
              playerBall.position.x = platformLeft - playerBall.radius;
              playerBall.velocity.x = 0;
            } else if (playerBall.position.x > platformRight) {
              playerBall.position.x = platformRight + playerBall.radius;
              playerBall.velocity.x = 0;
            } else {
              if (overlapX1 < overlapX2) {
                playerBall.position.x -= overlapX1;
                playerBall.velocity.x = 0;
              } else {
                playerBall.position.x += overlapX2;
                playerBall.velocity.x = 0;
              }
            }
          }
        }
      });

      // Collectibles collision (NO bounce on collect)
      levelData.collectibles.forEach((collectible) => {
        if (!collectible.collected) {
          const dx = playerBall.position.x - collectible.position.x;
          const dy = playerBall.position.y - collectible.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < playerBall.radius + STAR_RADIUS) {
            collectible.collected = true;
            setScore((prev) => prev + 10);
            // Do NOT bounce or change velocity on collect
          }
        }
      });

      // Obstacles collision
      levelData.obstacles.forEach((obstacle) => {
        if (
          playerBall.position.x + playerBall.radius > obstacle.position.x &&
          playerBall.position.x - playerBall.radius <
            obstacle.position.x + obstacle.size.width &&
          playerBall.position.y + playerBall.radius > obstacle.position.y &&
          playerBall.position.y - playerBall.radius <
            obstacle.position.y + obstacle.size.height
        ) {
          setGameState('gameOver');
          if (score > highScore) setHighScore(score);
        }
      });

      // Goal collision
      const goal = levelData.goal;
      if (
        playerBall.position.x + playerBall.radius > goal.position.x &&
        playerBall.position.x - playerBall.radius <
          goal.position.x + goal.size.width &&
        playerBall.position.y + playerBall.radius > goal.position.y &&
        playerBall.position.y - playerBall.radius <
          goal.position.y + goal.size.height
      ) {
        setGameState('levelComplete');
        setScore((prev) => prev + 50);
      }

      // Boundary checks (use canvas size, not BASE_WIDTH, for real edge)
      if (playerBall.position.x < playerBall.radius) {
        playerBall.position.x = playerBall.radius;
        playerBall.velocity.x *= -0.4;
      } else if (
        playerBall.position.x >
        canvas.width / scale - playerBall.radius
      ) {
        playerBall.position.x = canvas.width / scale - playerBall.radius;
        playerBall.velocity.x *= -0.4;
      }

      // Game over if fall off screen (use canvas height)
      if (playerBall.position.y > canvas.height / scale + 120) {
        setGameState('gameOver');
        if (score > highScore) setHighScore(score);
      }
    };

    // --- Game Loop (60 FPS, smooth) ---
    let animationFrameId: number;
    let lastFrameTime = performance.now();
    const FRAME_DURATION = 1000 / 60; // 60 FPS

    const gameLoop = () => {
      const now = performance.now();
      const delta = now - lastFrameTime;
      if (delta >= FRAME_DURATION) {
        updatePhysics();
        draw();
        lastFrameTime = now - (delta % FRAME_DURATION);
      }
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [gameState, level, score, highScore, scale]);

  // --- Keyboard Input ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') keysPressed.current.left = true;
      if (e.key === 'ArrowRight') keysPressed.current.right = true;

      // Jump (allow coyote time: short window after leaving ground)
      if (
        (e.key === ' ' || e.key === 'ArrowUp') &&
        !player.current.isJumping &&
        (player.current.grounded || player.current.lastGrounded)
      ) {
        player.current.velocity.y = JUMP_FORCE;
        player.current.isJumping = true;
        player.current.grounded = false;
      }

      // Pause/Resume
      if (e.key.toLowerCase() === 'p') {
        if (gameState === 'playing') setGameState('paused');
        else if (gameState === 'paused') setGameState('playing');
      }

      // Start game
      if (e.key === 'Enter' && gameState === 'start') startNewGame();

      // Restart game
      if (e.key === 'r' && gameState === 'gameOver') startNewGame();

      // Next level
      if (e.key === 'Enter' && gameState === 'levelComplete') {
        const nextLevel = levelManager.current.nextLevel();
        if (nextLevel) {
          currentLevel.current = nextLevel;
          player.current = {
            position: { ...nextLevel.startPosition },
            velocity: { x: 0, y: 0 },
            radius: BASE_BALL_RADIUS * scale,
            isJumping: true,
            grounded: false,
            lastGrounded: false,
          };
          setLevel(nextLevel.id);
          setGameState('playing');
        } else {
          setGameState('start');
        }
      }

      // Resume from pause
      if (e.key === 'Enter' && gameState === 'paused') setGameState('playing');
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') keysPressed.current.left = false;
      if (e.key === 'ArrowRight') keysPressed.current.right = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, scale]);

  // --- Canvas Button Clicks (Overlay) ---
  const handleCanvasOverlayClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Button hitboxes (responsive, use constants for base sizes)
    const getBtn = (w: number, h: number, yOffset: number) => ({
      cx: canvas.width / 2,
      cy: canvas.height / 2 + yOffset * scale,
      w: w * scale,
      h: h * scale,
    });

    if (gameState === 'start') {
      const btn = getBtn(
        canvas.width < 600 ? 220 : canvas.width < 900 ? 180 : 140,
        canvas.width < 600 ? 70 : canvas.width < 900 ? 56 : 44,
        60
      );
      if (isPointInButton(x, y, btn.cx, btn.cy, btn.w, btn.h)) startNewGame();
    } else if (gameState === 'gameOver') {
      const btn = getBtn(
        canvas.width < 600 ? 220 : canvas.width < 900 ? 180 : 140,
        canvas.width < 600 ? 70 : canvas.width < 900 ? 56 : 44,
        60
      );
      if (isPointInButton(x, y, btn.cx, btn.cy, btn.w, btn.h)) startNewGame();
    } else if (gameState === 'levelComplete') {
      const btn = getBtn(
        canvas.width < 600 ? 220 : canvas.width < 900 ? 180 : 140,
        canvas.width < 600 ? 70 : canvas.width < 900 ? 56 : 44,
        60
      );
      if (isPointInButton(x, y, btn.cx, btn.cy, btn.w, btn.h)) {
        const nextLevel = levelManager.current.nextLevel();
        if (nextLevel) {
          currentLevel.current = nextLevel;
          player.current = {
            position: { ...nextLevel.startPosition },
            velocity: { x: 0, y: 0 },
            radius: BASE_BALL_RADIUS * scale,
            isJumping: true,
            grounded: false,
            lastGrounded: false,
          };
          setLevel(nextLevel.id);
          setGameState('playing');
        } else {
          setGameState('start');
        }
      }
    } else if (gameState === 'paused') {
      const btn = getBtn(
        canvas.width < 600 ? 200 : 140,
        canvas.width < 600 ? 60 : 44,
        80
      );
      if (isPointInButton(x, y, btn.cx, btn.cy, btn.w, btn.h))
        setGameState('playing');
    }
  };

  // --- Helper: Button Hitbox ---
  function isPointInButton(
    px: number,
    py: number,
    centerX: number,
    centerY: number,
    width: number,
    height: number
  ) {
    return (
      px > centerX - width / 2 &&
      px < centerX + width / 2 &&
      py > centerY - height / 2 &&
      py < centerY + height / 2
    );
  }

  // --- Mobile Controls ---
  function handleMovementTouch(
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.TouchEvent<HTMLButtonElement>,
    direction: 'left' | 'right'
  ) {
    e.preventDefault();
    keysPressed.current[direction] = true;
  }

  const handleMovementRelease = (direction: 'left' | 'right') => {
    keysPressed.current[direction] = false;
  };

  // Use a ground proximity based on ball radius for consistency
  const GROUND_PROXIMITY = BALL_RADIUS * 0.75;

  const handleJump = () => {
    const playerBall = player.current;
    let nearGround = false;

    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const groundY = (canvas.height - LAND_HEIGHT) / scale;
      if (
        playerBall.position.y + playerBall.radius >=
          groundY - GROUND_PROXIMITY &&
        playerBall.position.y + playerBall.radius <= groundY + GROUND_PROXIMITY
      ) {
        nearGround = true;
      }
      // Check proximity to any platform
      const levelData = currentLevel.current;
      for (const platform of levelData.platforms) {
        const platformTop = platform.position.y;
        if (
          playerBall.position.x + playerBall.radius > platform.position.x &&
          playerBall.position.x - playerBall.radius <
            platform.position.x + platform.size.width &&
          playerBall.position.y + playerBall.radius >=
            platformTop - GROUND_PROXIMITY &&
          playerBall.position.y + playerBall.radius <=
            platformTop + GROUND_PROXIMITY
        ) {
          nearGround = true;
          break;
        }
      }
    }

    // Allow jump if grounded or within coyote time (lastGrounded)
    if (playerBall.grounded || playerBall.lastGrounded || nearGround) {
      playerBall.velocity.y = JUMP_FORCE;
      playerBall.isJumping = true;
      playerBall.grounded = false;
    } else {
      // In air: allow a single "air jump" (double jump)
      if (!playerBall.isJumping) {
        playerBall.velocity.y = JUMP_FORCE * 0.9;
        playerBall.isJumping = true;
      }
    }
  };

  // --- UI Layout (Responsive for Desktop, Tablet, Mobile Horizontal) ---
  const [isMobilePortrait, setIsMobilePortrait] = useState(false);
  useEffect(() => {
    function checkOrientation() {
      const isMobile = /Mobi|Android/i.test(navigator.userAgent);
      setIsMobilePortrait(isMobile && window.innerHeight > window.innerWidth);
    }
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  return (
    <div
      className={`relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden select-none`}
      style={{
        background: COLORS.background,
        padding: 'max(2vw, 16px)',
        boxSizing: 'border-box',
        touchAction: 'none',
        minHeight: '100dvh',
      }}
    >
      {/* Show rotate device message if on mobile portrait */}
      {isMobilePortrait && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80"
          style={{ color: '#fff', fontSize: 24, textAlign: 'center' }}
        >
          <div>
            <span role="img" aria-label="rotate" style={{ fontSize: 48 }}>
              🔄
            </span>
          </div>
          <div style={{ marginTop: 16 }}>
            Please rotate your device to play in landscape mode.
          </div>
        </div>
      )}

      <canvas
        ref={canvasRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        onClick={handleCanvasOverlayClick}
        style={{
          touchAction: 'none',
          width: '100vw',
          height: '100vh',
          maxWidth: '100vw',
          maxHeight: '100vh',
          display: 'block',
          zIndex: 1,
        }}
      />

      {/* Mobile Controls (bottom, large touch targets) */}
      {gameState === 'playing' && !isMobilePortrait && (
        <>
          {/* Jump Button (bottom left, larger on mobile) */}
          <Button
            className="fixed z-10"
            style={{
              left: 'min(4vw, 24px)',
              bottom: 'min(4vw, 24px)',
              width: `clamp(48px, ${BASE_BALL_RADIUS * 2.7 * scale}px, 80px)`,
              height: `clamp(48px, ${BASE_BALL_RADIUS * 2.7 * scale}px, 80px)`,
              borderRadius: '50%',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              fontSize: 0,
              padding: 0,
            }}
            aria-label="Jump"
            onClick={handleJump}
          >
            <IconArrowUp
              size={BASE_BALL_RADIUS * 1.8 * scale}
              stroke={2.2 * scale}
            />
          </Button>

          {/* Movement Buttons (bottom right, row, large touch targets) */}
          <div
            className="fixed z-10 flex gap-4"
            style={{
              right: 'min(4vw, 24px)',
              bottom: 'min(4vw, 24px)',
            }}
          >
            <Button
              aria-label="Move Left"
              style={{
                width: `clamp(48px, ${BASE_BALL_RADIUS * 2.7 * scale}px, 80px)`,
                height: `clamp(48px, ${BASE_BALL_RADIUS * 2.7 * scale}px, 80px)`,
                borderRadius: '50%',
                fontSize: 0,
                padding: 0,
              }}
              onMouseDown={(e) => handleMovementTouch(e, 'left')}
              onMouseUp={() => handleMovementRelease('left')}
              onTouchStart={(e) => handleMovementTouch(e, 'left')}
              onTouchEnd={() => handleMovementRelease('left')}
            >
              <IconArrowLeft
                size={BASE_BALL_RADIUS * 1.8 * scale}
                stroke={2.2 * scale}
              />
            </Button>

            <Button
              aria-label="Move Right"
              style={{
                width: `clamp(48px, ${BASE_BALL_RADIUS * 2.7 * scale}px, 80px)`,
                height: `clamp(48px, ${BASE_BALL_RADIUS * 2.7 * scale}px, 80px)`,
                borderRadius: '50%',
                fontSize: 0,
                padding: 0,
              }}
              onMouseDown={(e) => handleMovementTouch(e, 'right')}
              onMouseUp={() => handleMovementRelease('right')}
              onTouchStart={(e) => handleMovementTouch(e, 'right')}
              onTouchEnd={() => handleMovementRelease('right')}
            >
              <IconArrowRight
                size={BASE_BALL_RADIUS * 1.8 * scale}
                stroke={2.2 * scale}
              />
            </Button>
          </div>
        </>
      )}

      {/* Pause Button (top right, always visible on mobile/desktop) */}
      {gameState === 'playing' && !isMobilePortrait && (
        <Button
          className="fixed z-20 flex items-center justify-center"
          style={{
            top: 'min(2vw, 12px)',
            right: 'min(2vw, 12px)',
            width: `clamp(36px, ${BASE_BALL_RADIUS * 2 * scale}px, 64px)`,
            height: `clamp(36px, ${BASE_BALL_RADIUS * 2 * scale}px, 64px)`,
            borderRadius: '50%',
            fontSize: 0,
            padding: 0,
            background: COLORS.buttonBg,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
          aria-label="Pause"
          onClick={() => setGameState('paused')}
        >
          <IconPlayerPauseFilled
            style={{
              width: BASE_BALL_RADIUS * 1.3 * scale,
              height: BASE_BALL_RADIUS * 1.3 * scale,
            }}
          />
        </Button>
      )}
    </div>
  );
}
