export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Platform {
  position: Position;
  size: Size;
}

export interface Obstacle {
  position: Position;
  size: Size;
  type: 'spike';
}

export interface Collectible {
  position: Position;
  radius: number;
  type: 'ring';
  collected: boolean;
}

export interface Goal {
  position: Position;
  size: Size;
}

export interface Level {
  id: number;
  name: string;
  platforms: Platform[];
  obstacles: Obstacle[];
  collectibles: Collectible[];
  goal: Goal;
  startPosition: Position;
}

export interface Chunk {
  id: string;
  name: string;
  platforms: Platform[];
  obstacles: Obstacle[];
  collectibles: Collectible[];
  difficulty: 'easy' | 'medium' | 'hard';
  entryPoint: Position;
  exitPoint: Position;
}
