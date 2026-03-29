/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Star, 
  Settings, 
  Play, 
  Home, 
  ChevronLeft, 
  Award, 
  Brain, 
  Heart,
  CheckCircle2,
  XCircle,
  Sparkles,
  User
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Topic, Problem, Level, GameState } from './types';
import { INITIAL_LEVELS, TOPIC_COLORS, TOPIC_LABELS } from './constants';

const MASCOT_URL = "https://picsum.photos/seed/cute-tiger-cartoon/200/200";

export default function App() {
  const [gameState, setGameState] = useState<GameState>({
    view: 'home',
    currentLevel: null,
    totalPoints: 0,
    totalStars: 0,
    unlockedLevels: [1],
    medals: []
  });

  const [levels, setLevels] = useState<Level[]>(INITIAL_LEVELS);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [lives, setLives] = useState(3);
  const [levelStars, setLevelStars] = useState(0);

  // Persistence (Mock)
  useEffect(() => {
    const saved = localStorage.getItem('math_adventure_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      setGameState(prev => ({ ...prev, ...parsed }));
      // Update levels unlocked state
      setLevels(prev => prev.map(l => ({
        ...l,
        unlocked: parsed.unlockedLevels.includes(l.id)
      })));
    }
  }, []);

  const saveProgress = useCallback((newState: Partial<GameState>) => {
    const updated = { ...gameState, ...newState };
    localStorage.setItem('math_adventure_state', JSON.stringify({
      totalPoints: updated.totalPoints,
      totalStars: updated.totalStars,
      unlockedLevels: updated.unlockedLevels,
      medals: updated.medals
    }));
  }, [gameState]);

  const handleStartLevel = (level: Level) => {
    if (!level.unlocked) return;
    setGameState(prev => ({ ...prev, view: 'game', currentLevel: level }));
    setCurrentProblemIndex(0);
    setLives(3);
    setLevelStars(0);
    setFeedback(null);
  };

  const handleAnswer = (answer: string) => {
    if (feedback) return;

    const currentProblem = gameState.currentLevel?.problems[currentProblemIndex];
    if (!currentProblem) return;

    if (answer === currentProblem.answer) {
      setFeedback('correct');
      setGameState(prev => ({ ...prev, totalPoints: prev.totalPoints + 10 }));
      
      // Play sound effect (simulated)
      setTimeout(() => {
        if (currentProblemIndex < (gameState.currentLevel?.problems.length || 0) - 1) {
          setCurrentProblemIndex(prev => prev + 1);
          setFeedback(null);
        } else {
          handleLevelComplete();
        }
      }, 1500);
    } else {
      setFeedback('incorrect');
      setLives(prev => Math.max(0, prev - 1));
      setTimeout(() => {
        setFeedback(null);
        if (lives <= 1) {
          setGameState(prev => ({ ...prev, view: 'map' }));
        }
      }, 1500);
    }
  };

  const handleLevelComplete = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FFA500', '#FF4500']
    });

    const earnedStars = lives === 3 ? 3 : lives === 2 ? 2 : 1;
    const nextLevelId = (gameState.currentLevel?.id || 0) + 1;
    
    const newUnlockedLevels = [...gameState.unlockedLevels];
    if (!newUnlockedLevels.includes(nextLevelId)) {
      newUnlockedLevels.push(nextLevelId);
    }

    const newTotalStars = gameState.totalStars + earnedStars;
    
    setGameState(prev => ({
      ...prev,
      view: 'map',
      totalStars: newTotalStars,
      unlockedLevels: newUnlockedLevels
    }));

    setLevels(prev => prev.map(l => {
      if (l.id === gameState.currentLevel?.id) {
        return { ...l, starsEarned: Math.max(l.starsEarned, earnedStars) };
      }
      if (l.id === nextLevelId) {
        return { ...l, unlocked: true };
      }
      return l;
    }));

    saveProgress({
      totalStars: newTotalStars,
      unlockedLevels: newUnlockedLevels
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-yellow-200 rounded-full blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-30 animate-pulse" />

      <AnimatePresence mode="wait">
        {gameState.view === 'home' && (
          <motion.div 
            key="home"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center z-10"
          >
            <div className="mb-8 relative inline-block">
              <img 
                src={MASCOT_URL} 
                alt="Tigre Mascote" 
                className="w-48 h-48 rounded-full border-8 border-white shadow-2xl bounce-slow"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-4 -right-4 bg-yellow-400 p-3 rounded-full shadow-lg">
                <Sparkles className="text-white w-8 h-8" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-sky-600 mb-4 drop-shadow-sm">
              Aventura Matemática
            </h1>
            <p className="text-xl text-slate-500 mb-12 max-w-md mx-auto font-medium">
              Aprenda matemática brincando com desafios incríveis e ganhe estrelas!
            </p>

            <div className="flex flex-col gap-4 items-center">
              <button 
                onClick={() => setGameState(prev => ({ ...prev, view: 'map' }))}
                className="group relative px-12 py-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-3xl text-3xl font-bold shadow-[0_8px_0_rgb(5,150,105)] active:shadow-none active:translate-y-2 transition-all flex items-center gap-3"
              >
                <Play className="w-10 h-10 fill-current" />
                JOGAR AGORA
              </button>
              
              <div className="flex gap-4 mt-8">
                <button 
                  onClick={() => setGameState(prev => ({ ...prev, view: 'parents' }))}
                  className="p-4 bg-white text-slate-400 rounded-2xl shadow-md hover:text-sky-500 transition-colors"
                >
                  <User className="w-8 h-8" />
                </button>
                <button className="p-4 bg-white text-slate-400 rounded-2xl shadow-md hover:text-sky-500 transition-colors">
                  <Settings className="w-8 h-8" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {gameState.view === 'map' && (
          <motion.div 
            key="map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-4xl h-full flex flex-col z-10"
          >
            <div className="flex items-center justify-between mb-8">
              <button 
                onClick={() => setGameState(prev => ({ ...prev, view: 'home' }))}
                className="p-3 bg-white rounded-2xl shadow-sm text-slate-500 hover:text-sky-500"
              >
                <Home className="w-8 h-8" />
              </button>
              
              <div className="flex gap-4">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm">
                  <Star className="text-yellow-400 fill-yellow-400 w-6 h-6" />
                  <span className="font-bold text-xl">{gameState.totalStars}</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm">
                  <Trophy className="text-orange-400 w-6 h-6" />
                  <span className="font-bold text-xl">{gameState.totalPoints}</span>
                </div>
              </div>
            </div>

            <h2 className="text-4xl font-bold text-sky-600 mb-8 text-center">Mapa da Aventura</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 overflow-y-auto pb-12 px-4">
              {levels.map((level) => (
                <motion.button
                  key={level.id}
                  whileHover={level.unlocked ? { scale: 1.05 } : {}}
                  whileTap={level.unlocked ? { scale: 0.95 } : {}}
                  onClick={() => handleStartLevel(level)}
                  className={`relative p-6 rounded-3xl text-left transition-all ${
                    level.unlocked 
                      ? `${TOPIC_COLORS[level.topic]} text-white shadow-xl cursor-pointer` 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed grayscale'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-sm font-bold uppercase tracking-wider opacity-80">
                      {TOPIC_LABELS[level.topic]}
                    </span>
                    {level.unlocked ? (
                      <div className="flex gap-1">
                        {[1, 2, 3].map(i => (
                          <Star 
                            key={i} 
                            className={`w-5 h-5 ${i <= level.starsEarned ? 'fill-yellow-300 text-yellow-300' : 'text-white/30'}`} 
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-xs">
                        <Star className="w-4 h-4" />
                        {level.requiredStars}
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2">{level.title}</h3>
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 opacity-80" />
                    <span className="text-sm font-medium capitalize">{level.difficulty}</span>
                  </div>

                  {!level.unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-3xl">
                      <Settings className="w-12 h-12 opacity-20 rotate-45" />
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {gameState.view === 'game' && gameState.currentLevel && (
          <motion.div 
            key="game"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl p-8 md:p-12 z-10 relative"
          >
            {/* Game Header */}
            <div className="flex items-center justify-between mb-8">
              <button 
                onClick={() => setGameState(prev => ({ ...prev, view: 'map' }))}
                className="p-2 text-slate-400 hover:text-sky-500"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              
              <div className="flex-1 mx-8 h-4 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-emerald-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentProblemIndex) / gameState.currentLevel.problems.length) * 100}%` }}
                />
              </div>

              <div className="flex gap-2">
                {[1, 2, 3].map(i => (
                  <Heart 
                    key={i} 
                    className={`w-8 h-8 ${i <= lives ? 'text-red-500 fill-red-500' : 'text-slate-200'}`} 
                  />
                ))}
              </div>
            </div>

            {/* Problem Area */}
            <div className="text-center py-12">
              <motion.div
                key={currentProblemIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <h3 className="text-5xl md:text-7xl font-bold text-slate-800">
                  {gameState.currentLevel.problems[currentProblemIndex].question}
                </h3>

                <div className="grid grid-cols-2 gap-4 mt-12">
                  {gameState.currentLevel.problems[currentProblemIndex].options?.map((option, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswer(option)}
                      disabled={!!feedback}
                      className={`py-6 rounded-3xl text-3xl font-bold transition-all border-4 ${
                        feedback === 'correct' && option === gameState.currentLevel?.problems[currentProblemIndex].answer
                          ? 'bg-emerald-500 border-emerald-600 text-white'
                          : feedback === 'incorrect' && option !== gameState.currentLevel?.problems[currentProblemIndex].answer
                          ? 'bg-white border-slate-100 text-slate-400 opacity-50'
                          : 'bg-white border-slate-100 text-slate-700 hover:border-sky-300 hover:bg-sky-50'
                      }`}
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Feedback Overlay */}
            <AnimatePresence>
              {feedback && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 rounded-[3rem] z-20"
                >
                  {feedback === 'correct' ? (
                    <>
                      <CheckCircle2 className="w-32 h-32 text-emerald-500 mb-4" />
                      <h4 className="text-4xl font-bold text-emerald-600">Muito bem!</h4>
                      <p className="text-xl text-emerald-500 font-medium">+10 pontos</p>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-32 h-32 text-red-500 mb-4" />
                      <h4 className="text-4xl font-bold text-red-600">Ops! Tente de novo</h4>
                      <p className="text-xl text-red-500 font-medium">Você perdeu um coração</p>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {gameState.view === 'parents' && (
          <motion.div 
            key="parents"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-2xl bg-white rounded-[3rem] shadow-xl p-8 z-10"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-slate-800">Área dos Pais</h2>
              <button 
                onClick={() => setGameState(prev => ({ ...prev, view: 'home' }))}
                className="p-2 text-slate-400 hover:text-sky-500"
              >
                <XCircle className="w-8 h-8" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-sky-50 p-6 rounded-3xl">
                <h3 className="font-bold text-sky-700 mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Progresso Geral
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-2xl shadow-sm">
                    <p className="text-sm text-slate-400">Total de Pontos</p>
                    <p className="text-2xl font-bold text-slate-700">{gameState.totalPoints}</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl shadow-sm">
                    <p className="text-sm text-slate-400">Estrelas Coletadas</p>
                    <p className="text-2xl font-bold text-slate-700">{gameState.totalStars}</p>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 p-6 rounded-3xl">
                <h3 className="font-bold text-emerald-700 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Conquistas
                </h3>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {gameState.totalStars >= 5 && (
                    <div className="flex-shrink-0 w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                      <Star className="text-white w-10 h-10 fill-white" />
                    </div>
                  )}
                  {gameState.unlockedLevels.length >= 3 && (
                    <div className="flex-shrink-0 w-20 h-20 bg-purple-400 rounded-full flex items-center justify-center shadow-lg">
                      <Brain className="text-white w-10 h-10" />
                    </div>
                  )}
                  <div className="flex-shrink-0 w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center border-4 border-dashed border-slate-300">
                    <Settings className="text-slate-400 w-8 h-8" />
                  </div>
                </div>
              </div>

              <div className="text-center text-sm text-slate-400 pt-4">
                Linguagem: Português (Brasil) • Versão 1.0.0
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Mascot in Corner (when not in home) */}
      {gameState.view !== 'home' && gameState.view !== 'game' && (
        <motion.div 
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed bottom-8 right-8 z-50 hidden md:block"
        >
          <div className="relative">
            <div className="absolute -top-16 -left-24 bg-white p-4 rounded-2xl shadow-lg text-sm font-bold text-sky-600 after:content-[''] after:absolute after:bottom-[-10px] after:right-4 after:border-l-[10px] after:border-l-transparent after:border-r-[10px] after:border-r-transparent after:border-t-[10px] after:border-t-white">
              Roarrr! Vamos aprender! 🐯
            </div>
            <img 
              src={MASCOT_URL} 
              alt="Tigre Mascote" 
              className="w-24 h-24 rounded-full border-4 border-white shadow-xl bounce-slow"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
