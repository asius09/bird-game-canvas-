// --- THEME DEFINITIONS ---

export type ThemeColors = {
  // Backgrounds
  background: string;
  overlay: string;

  // Land/ground
  land: string;
  landGrid: string;

  // Platforms
  platform: string;
  platformHighlight: string;
  platformShadow: string;

  // Ball/player
  ball: string;
  ballHighlight: string;
  ballShadow: string;

  // Obstacles
  obstacle: string;
  obstacleOutline: string;

  // Collectibles
  collectible: string;
  collectibleOutline: string;

  // Goal
  goal: string;
  goalInner: string;
  goalPulse: string;

  // Text/UI
  text: string;
  textSecondary: string;

  // Buttons (canvas and UI)
  buttonBg: string;
  buttonBorder: string;
  buttonText: string;
  buttonHover: string;
  buttonActive: string;

  // Misc
  shadow: string;
};

// Default Theme (Modern, Minimal, Clean)
export const DEFAULT_COLORS: ThemeColors = {
  background: 'linear-gradient(135deg, #e3f2fd 0%, #fffde7 100%)', // light blue to light yellow
  overlay: 'rgba(255,255,255,0.95)',

  land: '#f5f5f5', // light gray
  landGrid: 'rgba(33, 150, 243, 0.08)', // subtle blue

  platform: '#1976d2', // blue
  platformHighlight: '#90caf9', // light blue highlight
  platformShadow: 'rgba(0,0,0,0.06)',

  ball: '#fff', // white
  ballHighlight: '#ffe082', // yellow highlight
  ballShadow: 'rgba(0,0,0,0.10)',

  obstacle: '#616161', // gray
  obstacleOutline: '#1976d2', // blue outline

  collectible: '#ffd600', // gold
  collectibleOutline: 'rgba(255, 214, 0, 0.13)',

  goal: '#fff', // white
  goalInner: '#1976d2', // blue
  goalPulse: '#ffd600', // gold

  text: '#263238', // dark gray
  textSecondary: '#1976d2', // blue

  buttonBg: 'rgba(255,255,255,0.50)',
  buttonBorder: '#1976d2',
  buttonText: '#263238',
  buttonHover: '#e3f2fd',
  buttonActive: '#bbdefb',

  shadow: '0 4px 32px 0 rgba(33, 150, 243, 0.08)',
};

export const ONE_PIECE_COLORS: ThemeColors = {
  background: 'linear-gradient(135deg, #6ec6f1 0%, #fef6e4 100%)', // ocean blue to sand
  overlay: 'rgba(255,255,255,0.92)',

  land: '#ffe5b4', // sand
  landGrid: 'rgba(255, 193, 7, 0.10)', // subtle yellow

  platform: '#f44336', // Luffy's vest red
  platformHighlight: '#ffb300', // sunny yellow highlight
  platformShadow: 'rgba(0,0,0,0.08)',

  ball: 'white', // Luffy's hat top
  ballHighlight: '#ffe082', // hat highlight
  ballShadow: 'rgba(0,0,0,0.13)',

  obstacle: '#263238', // dark navy (Zoro's bandana)
  obstacleOutline: '#f44336', // red outline

  collectible: '#ffd600', // gold (One Piece treasure)
  collectibleOutline: 'rgba(255, 214, 0, 0.18)',

  goal: '#fff', // white (freedom)
  goalInner: '#6ec6f1', // ocean blue
  goalPulse: '#ffd600', // gold

  text: '#263238', // dark navy
  textSecondary: '#f44336', // red

  buttonBg: 'rgba(255,255,255,0.85)',
  buttonBorder: '#f44336',
  buttonText: '#263238',
  buttonHover: '#ffe082',
  buttonActive: '#ffd600',

  shadow: '0 4px 32px 0 rgba(33, 150, 243, 0.10)',
};
export enum ThemeType {
  DEFAULT = 'default',
  ONE_PIECE = 'one_piece',
}

export const COLORS: ThemeColors = DEFAULT_COLORS;
