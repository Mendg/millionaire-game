'use client';

import { useState, useEffect } from 'react';
import { Question } from '../types';

const MONEY_LADDER = [
  { level: 15, amount: '$1,000,000', safe: false },
  { level: 14, amount: '$500,000', safe: false },
  { level: 13, amount: '$250,000', safe: false },
  { level: 12, amount: '$125,000', safe: false },
  { level: 11, amount: '$64,000', safe: false },
  { level: 10, amount: '$32,000', safe: true },
  { level: 9, amount: '$16,000', safe: false },
  { level: 8, amount: '$8,000', safe: false },
  { level: 7, amount: '$4,000', safe: false },
  { level: 6, amount: '$2,000', safe: false },
  { level: 5, amount: '$1,000', safe: true },
  { level: 4, amount: '$500', safe: false },
  { level: 3, amount: '$300', safe: false },
  { level: 2, amount: '$200', safe: false },
  { level: 1, amount: '$100', safe: false },
];

type GameState = 'start' | 'playing' | 'revealed' | 'gameover' | 'walkaway' | 'winner';
type AnswerKey = 'A' | 'B' | 'C' | 'D';

function getSafeAmount(currentLevel: number): string {
  if (currentLevel > 10) return '$32,000';
  if (currentLevel > 5) return '$1,000';
  return '$0';
}

export default function GamePage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameState, setGameState] = useState<GameState>('start');
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerKey | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentQuestion = questions[currentIndex] ?? null;
  const currentLevel = currentIndex + 1;

  async function startGame() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/questions');
      if (!res.ok) throw new Error('Failed to load questions');
      const data: Question[] = await res.json();
      if (data.length === 0) {
        setError('No questions available. Please add questions in the admin panel.');
        setLoading(false);
        return;
      }
      setQuestions(data);
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setGameState('playing');
    } catch (err) {
      setError('Could not load questions. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }

  function selectAnswer(key: AnswerKey) {
    if (gameState !== 'playing') return;
    setSelectedAnswer(key);
  }

  function revealAnswer() {
    if (!selectedAnswer || !currentQuestion) return;
    setGameState('revealed');
  }

  function nextQuestion() {
    if (!currentQuestion) return;
    if (currentIndex + 1 >= questions.length) {
      setGameState('winner');
      return;
    }
    setCurrentIndex((i) => i + 1);
    setSelectedAnswer(null);
    setGameState('playing');
  }

  function walkAway() {
    setGameState('walkaway');
  }

  function playAgain() {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setGameState('start');
    setQuestions([]);
  }

  function getAnswerStyle(key: AnswerKey): string {
    const base =
      'answer-box relative flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 select-none';

    if (gameState === 'revealed' && currentQuestion) {
      if (key === currentQuestion.correct) {
        return `${base} bg-green-700 border-green-400 text-white shadow-[0_0_20px_rgba(74,222,128,0.5)]`;
      }
      if (key === selectedAnswer && key !== currentQuestion.correct) {
        return `${base} bg-red-700 border-red-400 text-white shadow-[0_0_20px_rgba(248,113,113,0.5)]`;
      }
      return `${base} bg-[#0d0d3b] border-[#2a2a6e] text-gray-500 opacity-50`;
    }

    if (selectedAnswer === key) {
      return `${base} bg-blue-700 border-blue-400 text-white shadow-[0_0_20px_rgba(96,165,250,0.6)]`;
    }

    return `${base} bg-[#0d0d3b] border-[#c9a84c] text-white hover:bg-[#1a1a5e] hover:shadow-[0_0_15px_rgba(201,168,76,0.4)]`;
  }

  const lostAmount = getSafeAmount(currentLevel);

  // Start Screen
  if (gameState === 'start') {
    return (
      <div className="min-h-screen bg-[#05051e] flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-[#c9a84c] mb-2 tracking-widest drop-shadow-[0_0_30px_rgba(201,168,76,0.8)]">
            WHO WANTS TO BE A
          </h1>
          <h2 className="text-8xl font-bold text-white mb-12 tracking-wider drop-shadow-[0_0_40px_rgba(255,255,255,0.4)]">
            MILLIONAIRE?
          </h2>
          {error && (
            <p className="text-red-400 text-xl mb-6 bg-red-900/30 px-6 py-3 rounded-lg border border-red-700">
              {error}
            </p>
          )}
          <button
            onClick={startGame}
            disabled={loading}
            className="px-16 py-6 text-3xl font-bold bg-[#c9a84c] text-[#05051e] rounded-full hover:bg-[#ffd700] transition-all duration-300 shadow-[0_0_40px_rgba(201,168,76,0.6)] hover:shadow-[0_0_60px_rgba(255,215,0,0.8)] disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'START GAME'}
          </button>
          <div className="mt-8">
            <a href="/admin" className="text-[#c9a84c] opacity-40 hover:opacity-70 text-sm transition-opacity">
              Admin Panel
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Game Over Screen
  if (gameState === 'gameover') {
    return (
      <div className="min-h-screen bg-[#05051e] flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="text-9xl mb-6">💔</div>
          <h1 className="text-6xl font-bold text-red-500 mb-4 tracking-widest">GAME OVER</h1>
          <p className="text-3xl text-gray-300 mb-2">That was the wrong answer.</p>
          <p className="text-2xl text-gray-400 mb-8">
            You walked away with{' '}
            <span className="text-[#c9a84c] font-bold text-4xl">{lostAmount}</span>
          </p>
          <button
            onClick={playAgain}
            className="px-12 py-5 text-2xl font-bold bg-[#c9a84c] text-[#05051e] rounded-full hover:bg-[#ffd700] transition-all duration-300 shadow-[0_0_30px_rgba(201,168,76,0.5)]"
          >
            PLAY AGAIN
          </button>
        </div>
      </div>
    );
  }

  // Walk Away Screen
  if (gameState === 'walkaway') {
    const walkedAmount = MONEY_LADDER.find((m) => m.level === currentLevel)?.amount ?? '$0';
    return (
      <div className="min-h-screen bg-[#05051e] flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="text-9xl mb-6">🚶</div>
          <h1 className="text-5xl font-bold text-[#c9a84c] mb-4 tracking-widest">YOU WALKED AWAY</h1>
          <p className="text-3xl text-gray-300 mb-2">Smart move!</p>
          <p className="text-2xl text-gray-400 mb-8">
            You take home{' '}
            <span className="text-[#c9a84c] font-bold text-5xl">{walkedAmount}</span>
          </p>
          <button
            onClick={playAgain}
            className="px-12 py-5 text-2xl font-bold bg-[#c9a84c] text-[#05051e] rounded-full hover:bg-[#ffd700] transition-all duration-300 shadow-[0_0_30px_rgba(201,168,76,0.5)]"
          >
            PLAY AGAIN
          </button>
        </div>
      </div>
    );
  }

  // Winner Screen
  if (gameState === 'winner') {
    return (
      <div className="min-h-screen bg-[#05051e] flex flex-col items-center justify-center overflow-hidden">
        <div className="text-center animate-pulse">
          <div className="text-9xl mb-4">🏆</div>
          <h1 className="text-7xl font-bold text-[#ffd700] mb-2 tracking-widest drop-shadow-[0_0_50px_rgba(255,215,0,1)]">
            WINNER!
          </h1>
          <h2 className="text-6xl font-bold text-white mb-6">$1,000,000</h2>
          <p className="text-3xl text-gray-300 mb-10">You answered all 15 questions correctly!</p>
          <button
            onClick={playAgain}
            className="px-12 py-5 text-2xl font-bold bg-[#ffd700] text-[#05051e] rounded-full hover:bg-white transition-all duration-300 shadow-[0_0_60px_rgba(255,215,0,0.8)]"
          >
            PLAY AGAIN
          </button>
        </div>
      </div>
    );
  }

  // Main Game Screen
  return (
    <div className="min-h-screen bg-[#05051e] flex">
      {/* Main game area */}
      <div className="flex-1 flex flex-col p-8 pr-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-[#c9a84c] text-2xl font-bold tracking-widest">
            WHO WANTS TO BE A MILLIONAIRE?
          </div>
          <div className="flex gap-4">
            <button
              onClick={walkAway}
              className="px-6 py-3 text-lg font-bold border-2 border-red-500 text-red-400 rounded-lg hover:bg-red-900/30 transition-all duration-200"
            >
              WALK AWAY
            </button>
          </div>
        </div>

        {/* Question number */}
        <div className="text-center mb-4">
          <span className="text-[#c9a84c] text-xl font-semibold tracking-widest">
            QUESTION {currentLevel} OF {questions.length}
          </span>
        </div>

        {/* Question box */}
        <div className="flex-1 flex flex-col justify-center">
          {currentQuestion && (
            <div className="border-2 border-[#c9a84c] rounded-2xl p-8 mb-10 bg-[#0a0a2e] shadow-[0_0_40px_rgba(201,168,76,0.3)] text-center">
              <p className="text-3xl text-white leading-relaxed font-semibold">
                {currentQuestion.question}
              </p>
            </div>
          )}

          {/* Answer grid */}
          {currentQuestion && (
            <div className="grid grid-cols-2 gap-4">
              {(['A', 'B', 'C', 'D'] as AnswerKey[]).map((key) => (
                <div
                  key={key}
                  className={getAnswerStyle(key)}
                  onClick={() => selectAnswer(key)}
                >
                  <span className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-current flex items-center justify-center text-lg font-bold">
                    {key}
                  </span>
                  <span className="text-xl font-medium leading-snug">
                    {currentQuestion.answers[key]}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Control buttons */}
          <div className="flex justify-center mt-8 gap-4">
            {gameState === 'playing' && selectedAnswer && (
              <button
                onClick={revealAnswer}
                className="px-12 py-4 text-xl font-bold bg-[#c9a84c] text-[#05051e] rounded-full hover:bg-[#ffd700] transition-all duration-300 shadow-[0_0_30px_rgba(201,168,76,0.5)] hover:shadow-[0_0_50px_rgba(255,215,0,0.7)]"
              >
                REVEAL ANSWER
              </button>
            )}
            {gameState === 'revealed' && currentQuestion && selectedAnswer === currentQuestion.correct && (
              <button
                onClick={nextQuestion}
                className="px-12 py-4 text-xl font-bold bg-green-600 text-white rounded-full hover:bg-green-500 transition-all duration-300 shadow-[0_0_30px_rgba(74,222,128,0.4)]"
              >
                {currentIndex + 1 >= questions.length ? 'CLAIM PRIZE' : 'NEXT QUESTION'}
              </button>
            )}
            {gameState === 'revealed' && currentQuestion && selectedAnswer !== currentQuestion.correct && (
              <button
                onClick={() => setGameState('gameover')}
                className="px-12 py-4 text-xl font-bold bg-red-700 text-white rounded-full hover:bg-red-600 transition-all duration-300 shadow-[0_0_30px_rgba(248,113,113,0.4)]"
              >
                GAME OVER
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Money Ladder Sidebar */}
      <div className="w-64 bg-[#07072a] border-l border-[#1a1a5e] p-4 flex flex-col justify-center">
        <div className="text-[#c9a84c] text-center text-sm font-bold tracking-widest mb-4">
          PRIZE LADDER
        </div>
        <div className="flex flex-col gap-0.5">
          {MONEY_LADDER.map((rung, index) => {
            const isCurrentLevel = rung.level === currentLevel && (gameState === 'playing' || gameState === 'revealed');
            const isPast = rung.level < currentLevel;

            return (
              <div key={rung.level}>
                {rung.safe && index > 0 && (
                  <div className="my-1 border-t border-dashed border-[#c9a84c] opacity-40" />
                )}
                <div
                  className={`flex items-center justify-between px-3 py-1.5 rounded transition-all duration-300 ${
                    isCurrentLevel
                      ? 'bg-[#c9a84c] text-[#05051e] shadow-[0_0_15px_rgba(201,168,76,0.6)]'
                      : isPast
                      ? 'text-green-400 opacity-60'
                      : 'text-gray-400'
                  }`}
                >
                  <span className={`text-xs font-medium ${isCurrentLevel ? 'text-[#05051e]' : ''}`}>
                    {rung.level}
                  </span>
                  <span
                    className={`text-sm font-bold ${
                      isCurrentLevel
                        ? 'text-[#05051e]'
                        : rung.safe
                        ? 'text-[#c9a84c]'
                        : ''
                    }`}
                  >
                    {rung.amount}
                  </span>
                  {rung.safe && (
                    <span className={`text-xs ${isCurrentLevel ? 'text-[#05051e]' : 'text-[#c9a84c]'}`}>
                      ★
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
