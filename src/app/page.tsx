'use client';
import { useRef, useEffect, useState } from 'react';
import { LevelManager } from '@/LevelManager';
import { Level } from '@/types';
import {
  IconPlayerPauseFilled,
  IconArrowUp,
  IconArrowLeft,
  IconArrowRight,
} from '@tabler/icons-react';

// --- THEME DEFINITIONS ---

// Default Theme (Modern, Minimal, Clean)
const DEFAULT_COLORS = {
  // Backgrounds
  background: 'linear-gradient(135deg, #e3f2fd 0%, #fffde7 100%)', // light blue to light yellow
  overlay: 'rgba(255,255,255,0.95)',

  // Land/ground
  land: '#f5f5f5', // light gray
  landGrid: 'rgba(33, 150, 243, 0.08)', // subtle blue

  // Platforms
  platform: '#1976d2', // blue
  platformHighlight: '#90caf9', // light blue highlight
  platformShadow: 'rgba(0,0,0,0.06)',

  // Ball/player
  ball: '#fff', // white
  ballHighlight: '#ffe082', // yellow highlight
  ballShadow: 'rgba(0,0,0,0.10)',

  // Obstacles
  obstacle: '#616161', // gray
  obstacleOutline: '#1976d2', // blue outline

  // Collectibles
  collectible: '#ffd600', // gold
  collectibleOutline: 'rgba(255, 214, 0, 0.13)',

  // Goal
  goal: '#fff', // white
  goalInner: '#1976d2', // blue
  goalPulse: '#ffd600', // gold

  // Text/UI
  text: '#263238', // dark gray
  textSecondary: '#1976d2', // blue

  // Buttons (canvas and UI)
  buttonBg: 'rgba(255,255,255,0.90)',
  buttonBorder: '#1976d2',
  buttonText: '#263238',
  buttonHover: '#e3f2fd',
  buttonActive: '#bbdefb',

  // Misc
  shadow: '0 4px 32px 0 rgba(33, 150, 243, 0.08)',
};

// One Piece Inspired Theme (Modern, Minimal, Real Feel)
const ONE_PIECE_COLORS = {
  // Backgrounds
  background: 'linear-gradient(135deg, #6ec6f1 0%, #fef6e4 100%)', // ocean blue to sand
  overlay: 'rgba(255,255,255,0.92)',

  // Land/ground
  land: '#ffe5b4', // sand
  landGrid: 'rgba(255, 193, 7, 0.10)', // subtle yellow

  // Platforms
  platform: '#f44336', // Luffy's vest red
  platformHighlight: '#ffb300', // sunny yellow highlight
  platformShadow: 'rgba(0,0,0,0.08)',

  // Ball/player
  ball: 'white', // Luffy's hat top
  ballHighlight: '#ffe082', // hat highlight
  ballShadow: 'rgba(0,0,0,0.13)',

  // Obstacles
  obstacle: '#263238', // dark navy (Zoro's bandana)
  obstacleOutline: '#f44336', // red outline

  // Collectibles
  collectible: '#ffd600', // gold (One Piece treasure)
  collectibleOutline: 'rgba(255, 214, 0, 0.18)',

  // Goal
  goal: '#fff', // white (freedom)
  goalInner: '#6ec6f1', // ocean blue
  goalPulse: '#ffd600', // gold

  // Text/UI
  text: '#263238', // dark navy
  textSecondary: '#f44336', // red

  // Buttons (canvas and UI)
  buttonBg: 'rgba(255,255,255,0.85)',
  buttonBorder: '#f44336',
  buttonText: '#263238',
  buttonHover: '#ffe082',
  buttonActive: '#ffd600',

  // Misc
  shadow: '0 4px 32px 0 rgba(33, 150, 243, 0.10)',
};

// --- THEME SELECTION ---
// Set the default theme here. To use One Piece, set to ONE_PIECE_COLORS.
const COLORS = DEFAULT_COLORS;

// --- GAME CONSTANTS ---
const BALL_RADIUS = 16;
const GRAVITY = 0.42;
const JUMP_FORCE = -11;
const BOUNCE_FACTOR = 0.72;
const FRICTION = 0.89;
const MAX_SPEED = 7.5;

// --- MODERN MINIMAL BUTTON ---
function GameUIButton({
  children,
  onClick,
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`flex items-center justify-center rounded-xl font-semibold transition-all duration-150 focus:ring-2 focus:ring-yellow-400/40 focus:outline-none active:scale-97 ${className} `}
      style={{
        background: COLORS.buttonBg,
        color: COLORS.buttonText,
        border: `2px solid ${COLORS.buttonBorder}`,
        boxShadow: COLORS.shadow,
        padding: '1.2rem',
        fontSize: '2rem',
        minWidth: 64,
        minHeight: 64,
        touchAction: 'none',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        transition: 'background 0.18s, color 0.18s, border 0.18s',
        cursor: 'pointer',
      }}
      onMouseDown={onClick}
      onClick={onClick}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = COLORS.buttonHover)
      }
      onMouseLeave={(e) => (e.currentTarget.style.background = COLORS.buttonBg)}
      {...props}
    >
      {children}
    </button>
  );
}

// --- Main Game Component ---
export default function BounceGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
    };
    setScore(0);
    setLevel(lvl.id);
    setGameState('playing');
  };

  // --- Level Reset ---
  const resetCurrentLevel = () => {
    const lvl = currentLevel.current;
    player.current = {
      position: { ...lvl.startPosition },
      velocity: { x: 0, y: 0 },
      radius: BALL_RADIUS,
      isJumping: true,
      grounded: false,
    };
    levelManager.current.resetLevel();
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
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // --- Draw Background ---
    function drawBackground() {
      // Gradient background
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, '#6ec6f1');
      grad.addColorStop(1, '#fef6e4');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw "land" (sand) at the bottom
      const landHeight = 72;
      ctx.fillStyle = COLORS.land;
      ctx.fillRect(0, canvas.height - landHeight, canvas.width, landHeight);

      // Draw grid lines only on the land (horizontal lines only, no grid elsewhere)
      ctx.save();
      ctx.strokeStyle = COLORS.landGrid;
      ctx.lineWidth = 2;
      const gridSize = 36;
      for (
        let y = canvas.height - landHeight;
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
      currentLevel.current.platforms.forEach((platform) => {
        // Platform base (INCREASED HEIGHT)
        const increasedHeight = platform.size.height * 2; // double the height
        ctx.fillStyle = COLORS.platform;
        ctx.fillRect(
          platform.position.x,
          platform.position.y,
          platform.size.width,
          increasedHeight
        );

        // Highlight
        ctx.fillStyle = COLORS.platformHighlight;
        ctx.fillRect(
          platform.position.x,
          platform.position.y,
          platform.size.width,
          12 // double the highlight height for visual balance
        );

        // Shadow
        ctx.fillStyle = COLORS.platformShadow;
        ctx.fillRect(
          platform.position.x,
          platform.position.y + increasedHeight,
          platform.size.width,
          12 // double the shadow height for visual balance
        );
      });
    }

    // --- Draw Obstacles ---
    function drawObstacles() {
      currentLevel.current.obstacles.forEach((obstacle) => {
        ctx.fillStyle = COLORS.obstacle;
        const spikeCount = 6;
        const spikeWidth = obstacle.size.width / spikeCount;

        for (let i = 0; i < spikeCount; i++) {
          const x = obstacle.position.x + i * spikeWidth;
          ctx.beginPath();
          ctx.moveTo(x, obstacle.position.y + obstacle.size.height);
          ctx.lineTo(x + spikeWidth / 2, obstacle.position.y);
          ctx.lineTo(
            x + spikeWidth,
            obstacle.position.y + obstacle.size.height
          );
          ctx.closePath();
          ctx.fill();
          // Outline
          ctx.save();
          ctx.strokeStyle = COLORS.obstacleOutline;
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.restore();
        }
      });
    }

    // --- Draw Player Ball ---
    function drawPlayerBall() {
      const { position, radius } = player.current;

      // Draw shadow
      ctx.beginPath();
      ctx.ellipse(
        position.x,
        position.y + radius + 6,
        radius * 0.9,
        radius * 0.35,
        0,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = COLORS.ballShadow;
      ctx.fill();

      // Draw ball (white with yellow highlight)
      ctx.beginPath();
      ctx.arc(position.x, position.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = COLORS.ball;
      ctx.fill();

      // Draw highlight (yellow)
      ctx.beginPath();
      ctx.arc(
        position.x - radius * 0.3,
        position.y - radius * 0.3,
        radius * 0.45,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = COLORS.ballHighlight;
      ctx.fill();
    }

    // --- Draw Collectibles ---
    function drawCollectibles() {
      currentLevel.current.collectibles.forEach((c) => {
        if (!c.collected) {
          ctx.save();
          ctx.translate(c.position.x, c.position.y);

          // Gentle rotation animation
          const rotation = Date.now() / 1200;
          ctx.rotate(rotation);

          // Star shape
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
            const x = Math.cos(angle) * c.radius;
            const y = Math.sin(angle) * c.radius;

            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }

            const innerAngle = angle + Math.PI / 5;
            const innerX = Math.cos(innerAngle) * (c.radius * 0.5);
            const innerY = Math.sin(innerAngle) * (c.radius * 0.5);
            ctx.lineTo(innerX, innerY);
          }
          ctx.closePath();

          ctx.fillStyle = COLORS.collectible;
          ctx.fill();

          // Outline
          ctx.lineWidth = 2;
          ctx.strokeStyle = COLORS.collectibleOutline;
          ctx.stroke();

          ctx.restore();
        }
      });
    }

    // --- Draw Goal ---
    function drawGoal() {
      const g = currentLevel.current.goal;

      // Goal base
      ctx.beginPath();
      ctx.roundRect(
        g.position.x,
        g.position.y,
        g.size.width,
        g.size.height,
        12
      );
      ctx.fillStyle = COLORS.goal;
      ctx.fill();

      // Inner circle (ocean blue)
      ctx.beginPath();
      ctx.arc(
        g.position.x + g.size.width / 2,
        g.position.y + g.size.height / 2,
        g.size.width / 3,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = COLORS.goalInner;
      ctx.fill();

      // Pulse animation (gold)
      const pulse = Math.sin(Date.now() / 400) * 0.08 + 0.92;
      ctx.globalAlpha = pulse;
      ctx.lineWidth = 3;
      ctx.strokeStyle = COLORS.goalPulse;
      ctx.beginPath();
      ctx.arc(
        g.position.x + g.size.width / 2,
        g.position.y + g.size.height / 2,
        g.size.width / 2.1,
        0,
        Math.PI * 2
      );
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // --- Draw UI Overlay ---
    function drawUIOverlay() {
      ctx.save();

      // Score (top-left, with padding)
      ctx.font = 'bold 22px Inter, sans-serif';
      ctx.fillStyle = COLORS.text;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(`Score: ${score}`, 32, 32);

      // Level (centered at top, to avoid overlap with pause)
      ctx.textAlign = 'center';
      ctx.font = 'bold 22px Inter, sans-serif';
      ctx.fillStyle = COLORS.textSecondary;
      ctx.fillText(`Level: ${level}`, canvas.width / 2, 32);

      // Overlay screens
      if (
        gameState === 'start' ||
        gameState === 'paused' ||
        gameState === 'gameOver' ||
        gameState === 'levelComplete'
      ) {
        // Overlay background
        ctx.fillStyle = COLORS.overlay;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.textAlign = 'center';

        if (gameState === 'start') {
          ctx.font = 'bold 54px Inter, sans-serif';
          ctx.fillStyle = COLORS.textSecondary;
          ctx.fillText('Bounce!', canvas.width / 2, canvas.height / 2 - 120);

          ctx.font = '22px Inter, sans-serif';
          ctx.fillStyle = COLORS.text;
          ctx.fillText(
            'A modern adventure begins!',
            canvas.width / 2,
            canvas.height / 2 - 70
          );

          // High Score
          ctx.font = '20px Inter, sans-serif';
          ctx.fillStyle = COLORS.text;
          ctx.fillText(
            `High Score: ${highScore}`,
            canvas.width / 2,
            canvas.height / 2 - 30
          );

          // Start Button
          drawCanvasButton(
            ctx,
            canvas.width / 2,
            canvas.height / 2 + 60,
            220,
            70,
            'Start'
          );
        }

        if (gameState === 'paused') {
          ctx.font = 'bold 40px Inter, sans-serif';
          ctx.fillStyle = COLORS.textSecondary;
          ctx.fillText('Paused', canvas.width / 2, canvas.height / 2 - 30);

          ctx.font = '20px Inter, sans-serif';
          ctx.fillStyle = COLORS.text;
          ctx.fillText(
            'Press P or tap Resume to continue',
            canvas.width / 2,
            canvas.height / 2 + 20
          );

          // Resume Button
          drawCanvasButton(
            ctx,
            canvas.width / 2,
            canvas.height / 2 + 80,
            200,
            60,
            'Resume'
          );
        }

        if (gameState === 'gameOver') {
          ctx.font = 'bold 40px Inter, sans-serif';
          ctx.fillStyle = COLORS.obstacle;
          ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 50);

          ctx.font = '24px Inter, sans-serif';
          ctx.fillStyle = COLORS.text;
          ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2);

          // Restart Button
          drawCanvasButton(
            ctx,
            canvas.width / 2,
            canvas.height / 2 + 60,
            200,
            60,
            'Restart'
          );
        }

        if (gameState === 'levelComplete') {
          ctx.font = 'bold 40px Inter, sans-serif';
          ctx.fillStyle = COLORS.goalPulse;
          ctx.fillText(
            'Level Complete!',
            canvas.width / 2,
            canvas.height / 2 - 50
          );

          ctx.font = '24px Inter, sans-serif';
          ctx.fillStyle = COLORS.text;
          ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2);

          // Next Level Button
          drawCanvasButton(
            ctx,
            canvas.width / 2,
            canvas.height / 2 + 60,
            220,
            70,
            'Next Level'
          );
        }
      }

      ctx.restore();
    }

    // --- Helper: Draw Canvas Button ---
    function drawCanvasButton(
      ctx: CanvasRenderingContext2D,
      centerX: number,
      centerY: number,
      width: number,
      height: number,
      label: string
    ) {
      ctx.save();

      // Button background
      ctx.beginPath();
      ctx.roundRect(
        centerX - width / 2,
        centerY - height / 2,
        width,
        height,
        24
      );
      ctx.fillStyle = COLORS.buttonBg;
      ctx.globalAlpha = 0.98;
      ctx.fill();

      // Button border
      ctx.globalAlpha = 1;
      ctx.strokeStyle = COLORS.buttonBorder;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Button text
      ctx.font = 'bold 28px Inter, sans-serif';
      ctx.fillStyle = COLORS.buttonText;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, centerX, centerY);

      ctx.restore();
    }

    // --- Main Draw ---
    function draw() {
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

      const p = player.current;
      const lvl = currentLevel.current;

      // Gravity
      p.velocity.y += GRAVITY;

      // Input
      if (keysPressed.current.left) {
        p.velocity.x = Math.max(p.velocity.x - 0.5, -MAX_SPEED);
      } else if (keysPressed.current.right) {
        p.velocity.x = Math.min(p.velocity.x + 0.5, MAX_SPEED);
      } else {
        p.velocity.x *= FRICTION;
      }

      // Update position
      p.position.x += p.velocity.x;
      p.position.y += p.velocity.y;

      // Ground collision
      const groundY = canvas.height - 72;
      if (p.position.y + p.radius > groundY) {
        p.position.y = groundY - p.radius;
        p.velocity.y = -p.velocity.y * BOUNCE_FACTOR;
        p.isJumping = false;
        p.grounded = true;
      } else {
        p.grounded = false;
      }

      // Platform collisions (INCREASED HEIGHT)
      lvl.platforms.forEach((platform) => {
        const increasedHeight = platform.size.height * 2;
        if (
          p.position.x + p.radius > platform.position.x &&
          p.position.x - p.radius < platform.position.x + platform.size.width &&
          p.position.y + p.radius > platform.position.y &&
          p.position.y - p.radius < platform.position.y + increasedHeight &&
          p.velocity.y > 0
        ) {
          p.position.y = platform.position.y - p.radius;
          p.velocity.y = -p.velocity.y * BOUNCE_FACTOR;
          p.isJumping = false;
          p.grounded = true;
        }
      });

      // Collectibles collision
      lvl.collectibles.forEach((c) => {
        if (!c.collected) {
          const dx = p.position.x - c.position.x;
          const dy = p.position.y - c.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < p.radius + c.radius) {
            c.collected = true;
            setScore((prev) => prev + 10);
            p.velocity.y = -5;
          }
        }
      });

      // Obstacles collision
      lvl.obstacles.forEach((obstacle) => {
        if (
          p.position.x + p.radius > obstacle.position.x &&
          p.position.x - p.radius < obstacle.position.x + obstacle.size.width &&
          p.position.y + p.radius > obstacle.position.y &&
          p.position.y - p.radius < obstacle.position.y + obstacle.size.height
        ) {
          setGameState('gameOver');
          if (score > highScore) setHighScore(score);
        }
      });

      // Goal collision
      const g = lvl.goal;
      if (
        p.position.x + p.radius > g.position.x &&
        p.position.x - p.radius < g.position.x + g.size.width &&
        p.position.y + p.radius > g.position.y &&
        p.position.y - p.radius < g.position.y + g.size.height
      ) {
        setGameState('levelComplete');
        setScore((prev) => prev + 50);
      }

      // Boundary checks
      if (p.position.x < p.radius) {
        p.position.x = p.radius;
        p.velocity.x *= -0.5;
      } else if (p.position.x > canvas.width - p.radius) {
        p.position.x = canvas.width - p.radius;
        p.velocity.x *= -0.5;
      }

      // Game over if fall off screen
      if (p.position.y > canvas.height + 120) {
        setGameState('gameOver');
        if (score > highScore) setHighScore(score);
      }
    };

    // --- Game Loop ---
    let animationFrameId: number;
    const gameLoop = () => {
      updatePhysics();
      draw();
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [gameState, level, score, highScore]);

  // --- Keyboard Input ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') keysPressed.current.left = true;
      if (e.key === 'ArrowRight') keysPressed.current.right = true;

      // Jump
      if (
        (e.key === ' ' || e.key === 'ArrowUp') &&
        !player.current.isJumping &&
        player.current.grounded
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
            radius: BALL_RADIUS,
            isJumping: true,
            grounded: false,
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
  }, [gameState]);

  // --- Canvas Button Clicks (Overlay) ---
  const handleCanvasOverlayClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Button hitboxes
    if (gameState === 'start') {
      if (
        isPointInButton(x, y, canvas.width / 2, canvas.height / 2 + 60, 220, 70)
      ) {
        startNewGame();
      }
    } else if (gameState === 'gameOver') {
      if (
        isPointInButton(x, y, canvas.width / 2, canvas.height / 2 + 60, 200, 60)
      ) {
        startNewGame();
      }
    } else if (gameState === 'levelComplete') {
      if (
        isPointInButton(x, y, canvas.width / 2, canvas.height / 2 + 60, 220, 70)
      ) {
        const nextLevel = levelManager.current.nextLevel();
        if (nextLevel) {
          currentLevel.current = nextLevel;
          player.current = {
            position: { ...nextLevel.startPosition },
            velocity: { x: 0, y: 0 },
            radius: BALL_RADIUS,
            isJumping: true,
            grounded: false,
          };
          setLevel(nextLevel.id);
          setGameState('playing');
        } else {
          setGameState('start');
        }
      }
    } else if (gameState === 'paused') {
      if (
        isPointInButton(x, y, canvas.width / 2, canvas.height / 2 + 80, 200, 60)
      ) {
        setGameState('playing');
      }
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
  const handleMovementTouch = (
    e: React.TouchEvent<HTMLButtonElement>,
    direction: 'left' | 'right'
  ) => {
    e.preventDefault();
    keysPressed.current[direction] = true;
  };

  const handleMovementRelease = (direction: 'left' | 'right') => {
    keysPressed.current[direction] = false;
  };

  const handleJump = () => {
    if (!player.current.isJumping && player.current.grounded) {
      player.current.velocity.y = JUMP_FORCE;
      player.current.isJumping = true;
      player.current.grounded = false;
    }
  };

  // --- UI Layout ---
  return (
    <div
      className="relative min-h-screen w-full overflow-hidden select-none"
      style={{
        background: COLORS.background,
        padding: 'max(2vw, 16px)',
        boxSizing: 'border-box',
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        onClick={handleCanvasOverlayClick}
        style={{
          touchAction: 'none',
        }}
      />

      {/* Mobile Controls */}
      {gameState === 'playing' && (
        <>
          {/* Jump Button */}
          <GameUIButton
            className="absolute bottom-8 left-8"
            aria-label="Jump"
            onClick={handleJump}
          >
            <IconArrowUp size={44} stroke={2.2} />
          </GameUIButton>

          {/* Movement Buttons */}
          <div className="absolute right-8 bottom-8 flex gap-4">
            <GameUIButton
              aria-label="Move Left"
              onMouseDown={(e) => handleMovementTouch(e, 'left')}
              onMouseUp={() => handleMovementRelease('left')}
              onTouchStart={(e) => handleMovementTouch(e, 'left')}
              onTouchEnd={() => handleMovementRelease('left')}
            >
              <IconArrowLeft size={44} stroke={2.2} />
            </GameUIButton>

            <GameUIButton
              aria-label="Move Right"
              onMouseDown={(e) => handleMovementTouch(e, 'right')}
              onMouseUp={() => handleMovementRelease('right')}
              onTouchStart={(e) => handleMovementTouch(e, 'right')}
              onTouchEnd={() => handleMovementRelease('right')}
            >
              <IconArrowRight size={44} stroke={2.2} />
            </GameUIButton>
          </div>
        </>
      )}

      {/* Pause Button */}
      {gameState === 'playing' && (
        <GameUIButton
          className="absolute top-8 right-8"
          aria-label="Pause"
          onClick={() => setGameState('paused')}
        >
          <IconPlayerPauseFilled size={38} stroke={2.2} />
        </GameUIButton>
      )}
    </div>
  );
}
