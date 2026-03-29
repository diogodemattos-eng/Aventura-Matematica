export type Topic = 'addition' | 'subtraction' | 'multiplication' | 'division' | 'sequences' | 'geometry' | 'problems';

export interface Problem {
  id: string;
  question: string;
  options?: string[];
  answer: string;
  type: 'multiple-choice' | 'input' | 'drag-drop';
  hint?: string;
  visualData?: any;
}

export interface Level {
  id: number;
  title: string;
  topic: Topic;
  difficulty: 'easy' | 'medium' | 'hard';
  requiredStars: number;
  unlocked: boolean;
  starsEarned: number;
  problems: Problem[];
}

export interface GameState {
  view: 'home' | 'map' | 'game' | 'parents' | 'achievements';
  currentLevel: Level | null;
  totalPoints: number;
  totalStars: number;
  unlockedLevels: number[];
  medals: string[];
}
