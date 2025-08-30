// LevelManager.ts
import { Level } from '@/types';
import { LEVELS } from '@/levels';

/**
 * LevelManager is responsible for managing the game's levels,
 * including navigation, resetting, and state management.
 */
export class LevelManager {
  private levels: Level[];
  private currentLevelIndex: number;

  constructor(levels: Level[] = LEVELS) {
    // Defensive copy to avoid mutating the original LEVELS array
    this.levels = levels.map((level) => ({
      ...level,
      platforms: level.platforms.map((p) => ({ ...p })),
      obstacles: level.obstacles.map((o) => ({ ...o })),
      collectibles: level.collectibles.map((c) => ({ ...c })),
      goal: { ...level.goal },
      startPosition: { ...level.startPosition },
    }));
    this.currentLevelIndex = 0;
  }

  /**
   * Returns the current level object.
   */
  getCurrentLevel(): Level {
    return this.levels[this.currentLevelIndex];
  }

  /**
   * Loads a level by its ID. Throws if not found.
   * @param levelId The ID of the level to load.
   */
  loadLevel(levelId: number): Level {
    const levelIndex = this.levels.findIndex((level) => level.id === levelId);
    if (levelIndex === -1) {
      throw new Error(`Level with ID ${levelId} not found`);
    }
    this.currentLevelIndex = levelIndex;
    return this.getCurrentLevel();
  }

  /**
   * Advances to the next level, if available.
   * Returns the new level, or null if at the last level.
   */
  nextLevel(): Level | null {
    if (this.currentLevelIndex < this.levels.length - 1) {
      this.currentLevelIndex++;
      return this.getCurrentLevel();
    }
    return null;
  }

  /**
   * Resets the current level's collectibles and other stateful properties.
   */
  resetLevel(): void {
    const currentLevel = this.getCurrentLevel();
    // Reset collectibles
    currentLevel.collectibles.forEach((collectible) => {
      collectible.collected = false;
    });
    // Optionally, reset other stateful properties here if needed
  }

  /**
   * Returns true if there is a next level available.
   */
  hasNextLevel(): boolean {
    return this.currentLevelIndex < this.levels.length - 1;
  }

  /**
   * Returns true if there is a previous level available.
   */
  hasPreviousLevel(): boolean {
    return this.currentLevelIndex > 0;
  }

  /**
   * Goes to the previous level, if available.
   * Returns the new level, or null if at the first level.
   */
  previousLevel(): Level | null {
    if (this.currentLevelIndex > 0) {
      this.currentLevelIndex--;
      return this.getCurrentLevel();
    }
    return null;
  }

  /**
   * Returns the total number of levels.
   */
  getLevelCount(): number {
    return this.levels.length;
  }

  /**
   * Returns the current level index (0-based).
   */
  getCurrentLevelIndex(): number {
    return this.currentLevelIndex;
  }
}
