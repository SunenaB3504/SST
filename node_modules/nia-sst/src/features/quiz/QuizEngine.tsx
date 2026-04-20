import React, { useState } from 'react';
import type { QuizQuestion, QuestionType } from '../../entities/chapter/types';
import { useProgressStore } from '../progress/store';
import { Send } from 'lucide-react';

type QuizState = 'unanswered' | 'correct' | 'incorrect';

interface QuizEngineProps {
  questions: QuizQuestion[];
  chapterId: number;
}

// ── Type badge shown above question ──
const TYPE_META: Record<QuestionType, { label: string; emoji: string; color: string }> = {
  'mcq':          { label: 'Multiple Choice',  emoji: '🔘', color: 'bg-purple-100 text-purple-700' },
  'true-false':   { label: 'True or False?',   emoji: '⚖️', color: 'bg-blue-100 text-blue-700' },
  'fill-blank':   { label: 'Fill in the Blank',emoji: '✏️', color: 'bg-amber-100 text-amber-700' },
  'spelling':     { label: 'Spelling Check',   emoji: '🔤', color: 'bg-pink-100 text-pink-700' },
  'matching':     { label: 'Match It!',        emoji: '🔗', color: 'bg-teal-100 text-teal-700' },
  'short-answer': { label: 'Short Answer',     emoji: '📝', color: 'bg-orange-100 text-orange-700' },
};

export const QuizEngine: React.FC<QuizEngineProps> = ({ questions, chapterId }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [quizState, setQuizState] = useState<QuizState>('unanswered');
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  // Short-answer specific state
  const [shortAnswerText, setShortAnswerText] = useState('');
  const [shortAnswerSubmitted, setShortAnswerSubmitted] = useState(false);
  const { addTreats, masterChapter } = useProgressStore();

  const question = questions[currentIdx];
  const typeMeta = TYPE_META[question.type];
  const isTrueFalse = question.type === 'true-false';
  const isShortAnswer = question.type === 'short-answer';

  const handleSelect = (idx: number) => {
    if (quizState !== 'unanswered') return;
    setSelectedIdx(idx);
    const isCorrect = idx === question.correctIndex;
    setQuizState(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) {
      setScore((s) => s + 1);
      addTreats(10);
    }
  };

  const handleShortAnswerSubmit = () => {
    if (!shortAnswerText.trim()) return;
    setShortAnswerSubmitted(true);
  };

  const handleShortAnswerGrade = (correct: boolean) => {
    if (correct) { setScore((s) => s + 1); addTreats(10); setQuizState('correct'); }
    else { setQuizState('incorrect'); }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1);
      setSelectedIdx(null);
      setQuizState('unanswered');
      setShortAnswerText('');
      setShortAnswerSubmitted(false);
    } else {
      const finalScore = score + (quizState === 'correct' ? 1 : 0);
      setScore(finalScore);
      setFinished(true);
      if (finalScore === questions.length) masterChapter(chapterId);
    }
  };

  // ── Finished Screen ──
  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    const isPerfect = score === questions.length;
    const isGood = pct >= 70;
    return (
      <div className="flex flex-col items-center gap-6 py-8 animate-in fade-in duration-500">
        <div className="text-7xl animate-bounce-subtle">{isPerfect ? '🎉🐶🎉' : isGood ? '🐶🌟' : '🐶'}</div>
        <div className="text-center">
          <h3 className="text-2xl font-black text-purple-900">
            {isPerfect ? 'Woof! Perfect score!' : isGood ? 'Really well done, Nia!' : 'Keep practising, Nia!'}
          </h3>
          <p className="text-purple-600 font-medium mt-2">
            You got <span className="font-black text-purple-900">{score}</span> out of{' '}
            <span className="font-black text-purple-900">{questions.length}</span> correct!
            <span className="ml-2 text-purple-400">({pct}%)</span>
          </p>
          {isPerfect && <p className="text-sm text-green-600 font-bold mt-2">🌟 Chapter Mastered! +50 Puppy Treats Bonus!</p>}
        </div>
        {/* Score bar */}
        <div className="w-full max-w-xs bg-purple-100 rounded-full h-4 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${isPerfect ? 'bg-green-500' : isGood ? 'bg-purple-500' : 'bg-amber-400'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <button
          onClick={() => { setCurrentIdx(0); setSelectedIdx(null); setQuizState('unanswered'); setScore(0); setFinished(false); }}
          className="btn-primary"
        >
          Try Again 🔄
        </button>
      </div>
    );
  }

  // ── Option button style helper ──
  const optionClass = (idx: number) => {
    let base = 'w-full text-left px-6 py-4 rounded-2xl font-bold border-2 transition-all duration-300 ';
    if (quizState === 'unanswered') {
      base += 'border-purple-100 bg-white text-purple-800 hover:bg-purple-50 hover:border-purple-300 active:scale-95 cursor-pointer';
    } else if (idx === question.correctIndex) {
      base += 'border-green-400 bg-green-50 text-green-800';
    } else if (idx === selectedIdx) {
      base += 'border-red-300 bg-red-50 text-red-700';
    } else {
      base += 'border-purple-100 bg-white text-purple-300 opacity-50';
    }
    return base;
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm text-purple-600 font-bold">
        <span>Question {currentIdx + 1} of {questions.length}</span>
        <span>⭐ {score} correct</span>
      </div>
      <div className="w-full bg-purple-100 rounded-full h-2">
        <div
          className="bg-purple-600 h-full rounded-full transition-all duration-500"
          style={{ width: `${(currentIdx / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Type Badge */}
      <div className={`inline-flex self-start items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black ${typeMeta.color}`}>
        <span>{typeMeta.emoji}</span>
        <span>{typeMeta.label}</span>
      </div>

      {/* Question */}
      <div className="card-purple p-6">
        <p className="text-lg font-black text-purple-900 leading-snug">{question.question}</p>
      </div>

      {/* ── SHORT ANSWER UI ── */}
      {isShortAnswer ? (
        <div className="flex flex-col gap-4">
          {/* Text area */}
          {!shortAnswerSubmitted && (
            <>
              <div className="bg-orange-50 border-2 border-orange-100 rounded-2xl p-3 flex gap-2 items-start">
                <span className="text-xl">🐶</span>
                <p className="text-orange-800 font-medium text-sm">Think carefully, then write your answer below. Take your time!</p>
              </div>
              <textarea
                value={shortAnswerText}
                onChange={(e) => setShortAnswerText(e.target.value)}
                placeholder="Write your answer here..."
                rows={4}
                className="w-full bg-white border-2 border-purple-200 rounded-2xl px-5 py-4 text-purple-900 font-medium leading-relaxed focus:outline-none focus:border-purple-500 transition-colors resize-none"
              />
              <button
                onClick={handleShortAnswerSubmit}
                disabled={!shortAnswerText.trim()}
                className="btn-primary flex items-center gap-2 self-end disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                Submit My Answer
              </button>
            </>
          )}

          {/* After submit — show student's answer + model answer side by side */}
          {shortAnswerSubmitted && (
            <div className="flex flex-col gap-4 animate-in slide-in-from-bottom-3 duration-400">
              {/* Student's answer */}
              <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-4">
                <p className="text-xs font-black text-purple-500 uppercase tracking-wider mb-2">📝 Your Answer</p>
                <p className="text-purple-900 font-medium leading-relaxed whitespace-pre-wrap">{shortAnswerText}</p>
              </div>

              {/* Model answer */}
              <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-4">
                <p className="text-xs font-black text-green-600 uppercase tracking-wider mb-2">✅ Model Answer</p>
                <p className="text-green-900 font-medium leading-relaxed whitespace-pre-wrap">{question.modelAnswer}</p>
              </div>

              {/* Pip */}
              <div className="bg-orange-50 border-2 border-orange-100 rounded-2xl p-4 flex gap-3 items-start">
                <span className="text-3xl animate-bounce-subtle flex-shrink-0">🐶</span>
                <p className="text-orange-800 font-medium text-sm leading-relaxed">{question.pipsExplanation}</p>
              </div>

              {/* Self-grade — only if not yet graded */}
              {quizState === 'unanswered' && (
                <div className="flex flex-col gap-2">
                  <p className="text-center text-purple-700 font-bold text-sm">How did your answer compare?</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleShortAnswerGrade(true)}
                      className="flex items-center justify-center gap-2 py-4 rounded-2xl font-black border-2 border-green-300 bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                    >
                      <span className="text-2xl">✅</span> I got it right!
                    </button>
                    <button
                      onClick={() => handleShortAnswerGrade(false)}
                      className="flex items-center justify-center gap-2 py-4 rounded-2xl font-black border-2 border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                    >
                      <span className="text-2xl">📖</span> Need more practice
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* ── MCQ / TRUE-FALSE / SPELLING / FILL-BLANK / MATCHING OPTIONS ── */
        <>
          {isTrueFalse ? (
            <div className="grid grid-cols-2 gap-4">
              {question.options.map((opt, idx) => {
                const isTrueOpt = idx === 0;
                let base = 'flex flex-col items-center justify-center py-6 rounded-2xl font-black text-lg border-2 transition-all duration-300 active:scale-95 cursor-pointer gap-2 ';
                if (quizState === 'unanswered') {
                  base += isTrueOpt
                    ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
                    : 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100';
                } else if (idx === question.correctIndex) {
                  base += 'border-green-400 bg-green-100 text-green-800';
                } else if (idx === selectedIdx) {
                  base += 'border-red-400 bg-red-100 text-red-800';
                } else {
                  base += 'border-gray-200 bg-gray-50 text-gray-400 opacity-50';
                }
                return (
                  <button key={idx} className={base} onClick={() => handleSelect(idx)}>
                    <span className="text-4xl">{isTrueOpt ? '✅' : '❌'}</span>
                    {opt.text}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {question.options.map((opt, idx) => (
                <button key={idx} className={optionClass(idx)} onClick={() => handleSelect(idx)}>
                  <span className="mr-3 font-black">
                    {question.type === 'matching' ? '→' : ['A', 'B', 'C', 'D'][idx] + '.'}
                  </span>
                  {opt.text}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Pip's Explanation (MCQ-family only) */}
      {!isShortAnswer && quizState !== 'unanswered' && (
        <div className={`rounded-2xl p-5 border-2 flex gap-4 items-start animate-in slide-in-from-bottom-3 duration-500 ${
          quizState === 'correct' ? 'bg-purple-50 border-purple-200' : 'bg-amber-50 border-amber-200'
        }`}>
          <span className="text-4xl flex-shrink-0 animate-bounce-subtle">
            {quizState === 'correct' ? '🐶' : '🤔'}
          </span>
          <div>
            <p className="font-black text-purple-900 mb-1">
              {quizState === 'correct' ? 'Pip says: Woof, yes!' : 'Pip says: Not quite, but listen...'}
            </p>
            <p className="text-purple-800 font-medium leading-relaxed">{question.pipsExplanation}</p>
          </div>
        </div>
      )}

      {/* Next button — shown when any question is answered */}
      {quizState !== 'unanswered' && (
        <button className="btn-primary self-end animate-in fade-in duration-300" onClick={handleNext}>
          {currentIdx < questions.length - 1 ? 'Next Question →' : 'See My Score! 🎉'}
        </button>
      )}
    </div>
  );
};

