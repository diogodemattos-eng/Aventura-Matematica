import { Level, Topic } from './types';

export const TOPIC_LABELS: Record<Topic, string> = {
  addition: 'Adição',
  subtraction: 'Subtração',
  multiplication: 'Multiplicação',
  division: 'Divisão',
  sequences: 'Sequências',
  geometry: 'Formas',
  problems: 'Problemas'
};

export const TOPIC_COLORS: Record<Topic, string> = {
  addition: 'bg-emerald-400',
  subtraction: 'bg-orange-400',
  multiplication: 'bg-purple-400',
  division: 'bg-blue-400',
  sequences: 'bg-pink-400',
  geometry: 'bg-yellow-400',
  problems: 'bg-indigo-400'
};

// Helper to generate levels
const generateLevels = (): Level[] => {
  const levels: Level[] = [];
  
  // Level 1: Addition Easy
  levels.push({
    id: 1,
    title: 'Somas Mágicas I',
    topic: 'addition',
    difficulty: 'easy',
    requiredStars: 0,
    unlocked: true,
    starsEarned: 0,
    problems: [
      { id: '1-1', question: 'Quanto é 2 + 3?', options: ['4', '5', '6', '7'], answer: '5', type: 'multiple-choice' },
      { id: '1-2', question: 'Quanto é 5 + 1?', options: ['4', '5', '6', '7'], answer: '6', type: 'multiple-choice' },
      { id: '1-3', question: 'Quanto é 4 + 4?', options: ['6', '7', '8', '9'], answer: '8', type: 'multiple-choice' },
    ]
  });

  // Level 2: Subtraction Easy
  levels.push({
    id: 2,
    title: 'Subtração Divertida',
    topic: 'subtraction',
    difficulty: 'easy',
    requiredStars: 2,
    unlocked: false,
    starsEarned: 0,
    problems: [
      { id: '2-1', question: 'Quanto é 5 - 2?', options: ['2', '3', '4', '5'], answer: '3', type: 'multiple-choice' },
      { id: '2-2', question: 'Quanto é 10 - 5?', options: ['4', '5', '6', '7'], answer: '5', type: 'multiple-choice' },
      { id: '2-3', question: 'Quanto é 8 - 4?', options: ['2', '3', '4', '5'], answer: '4', type: 'multiple-choice' },
    ]
  });

  // Level 3: Sequences
  levels.push({
    id: 3,
    title: 'O Próximo Número',
    topic: 'sequences',
    difficulty: 'easy',
    requiredStars: 4,
    unlocked: false,
    starsEarned: 0,
    problems: [
      { id: '3-1', question: 'Complete: 2, 4, 6, ...', options: ['7', '8', '9', '10'], answer: '8', type: 'multiple-choice' },
      { id: '3-2', question: 'Complete: 5, 10, 15, ...', options: ['16', '18', '20', '25'], answer: '20', type: 'multiple-choice' },
    ]
  });

  // Level 4: Geometry
  levels.push({
    id: 4,
    title: 'Mundo das Formas',
    topic: 'geometry',
    difficulty: 'easy',
    requiredStars: 6,
    unlocked: false,
    starsEarned: 0,
    problems: [
      { id: '4-1', question: 'Qual forma tem 3 lados?', options: ['Quadrado', 'Círculo', 'Triângulo', 'Retângulo'], answer: 'Triângulo', type: 'multiple-choice' },
      { id: '4-2', question: 'Qual forma é redonda?', options: ['Quadrado', 'Círculo', 'Triângulo', 'Retângulo'], answer: 'Círculo', type: 'multiple-choice' },
    ]
  });

  // Level 5: Multiplication
  levels.push({
    id: 5,
    title: 'Multiplicação Veloz',
    topic: 'multiplication',
    difficulty: 'medium',
    requiredStars: 8,
    unlocked: false,
    starsEarned: 0,
    problems: [
      { id: '5-1', question: 'Quanto é 2 x 3?', options: ['5', '6', '7', '8'], answer: '6', type: 'multiple-choice' },
      { id: '5-2', question: 'Quanto é 5 x 2?', options: ['8', '9', '10', '12'], answer: '10', type: 'multiple-choice' },
    ]
  });

  return levels;
};

export const INITIAL_LEVELS = generateLevels();
