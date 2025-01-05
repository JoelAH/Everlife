export type GameMode = 'combat' | 'story' | 'inventory' | 'dialogue' | 'decision' | 'end';

export type ElementType = 'water' | 'earth' | 'wind' | 'fire' | 'misc';

export interface ElementalPower {
  name: string;
  element: ElementType;
  damage: number;
  energyCost: number;
  description: string;
}

export interface PlayerStats {
  health: number;
  maxHealth: number;
  energy: number;
  maxEnergy: number;
  experience: number;
  harmony: number;
}

export interface Enemy {
  name: string;
  health: number;
  maxHealth: number;
  attack: number;
  experience: number;
  type: string;
  description: string;
}

export interface Option {
  text: string;
  goto: number;
  choice?: number;
}

export interface GameState {
  step?: number;
  choice?: number;
  currentLocation: string;
  messages: string[];
  inventory: string[];
  elementalPowers: ElementalPower[];
  mode: GameMode;
  playerStats: PlayerStats;
  environmentStatus: number;
  currentEnemy?: Enemy;
  options?: Option[]
}

export interface Location {
  name: string;
  description?: string;
  environmentalThreat?: string;
  crisis?: {
    type: string;
    severity: number;
    description: string;
  };
  exits: string[];
  items: string[];
}

export interface GameAction {
  type: 'MOVE' | 'USE_POWER' | 'INTERACT' | 'HEAL_ENVIRONMENT';
  target?: string;
  power?: string;
  location?: string;
}