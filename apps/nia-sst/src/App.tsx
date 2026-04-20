import React, { useState } from 'react';
import { Trophy, BookOpen, Star, Sparkles, Home, GraduationCap } from 'lucide-react';
import { ChapterDetail } from './features/chapters/ChapterDetail';
import { chaptersRegistry } from './entities/chapter';
import { useProgressStore } from './features/progress/store';
import type { ChapterData } from './entities/chapter/types';

type View = 'home' | 'chapter';

const MODULE_META: Record<ChapterData['module'], { label: string; emoji: string; color: string }> = {
  'explorer':       { label: 'The Explorer',       emoji: '🌍', color: 'bg-blue-50 border-blue-200 text-blue-900' },
  'world-tour':     { label: 'The World Tour',     emoji: '✈️', color: 'bg-amber-50 border-amber-200 text-amber-900' },
  'freedom-fighter':{ label: 'The Freedom Fighter', emoji: '🗡️', color: 'bg-red-50 border-red-200 text-red-900' },
  'young-citizen':  { label: 'The Young Citizen',  emoji: '🏛️', color: 'bg-green-50 border-green-200 text-green-900' },
};

export default function App() {
  const [view, setView] = useState<View>('home');
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);
  const { puppyTreats, masteredChapters } = useProgressStore();

  const selectedChapter = chaptersRegistry.find((c) => c.id === selectedChapterId);

  const openChapter = (id: number) => {
    setSelectedChapterId(id);
    setView('chapter');
  };

  return (
    <div className="min-h-screen bg-purple-50 flex flex-col items-center pb-24">
      {/* ─── Header ──────────────────────────────────────────────── */}
      <header className="w-full max-w-4xl flex justify-between items-center px-6 py-6">
        <button onClick={() => setView('home')} className="flex items-center gap-3 group">
          <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-2xl shadow-soft group-hover:scale-110 transition-transform animate-bounce-subtle">
            🐶
          </div>
          <div className="text-left">
            <h1 className="text-xl font-black text-purple-900 leading-tight">Nia's SST</h1>
            <p className="text-purple-500 font-medium text-xs">Purple Paws Adventure</p>
          </div>
        </button>

        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-2xl shadow-soft flex items-center gap-2 border border-purple-100">
            <Trophy className="text-yellow-500 w-4 h-4" />
            <span className="font-black text-purple-900 text-sm">{puppyTreats} Treats</span>
          </div>
          {view === 'chapter' && (
            <button
              onClick={() => setView('home')}
              className="bg-white px-4 py-2 rounded-2xl shadow-soft flex items-center gap-2 border border-purple-100 hover:bg-purple-50 transition-colors"
            >
              <Home className="w-4 h-4 text-purple-600" />
              <span className="font-bold text-purple-700 text-sm hidden sm:inline">Home</span>
            </button>
          )}
        </div>
      </header>

      {/* ─── Views ───────────────────────────────────────────────── */}
      <main className="w-full max-w-4xl px-6">

        {/* HOME VIEW */}
        {view === 'home' && (
          <div className="flex flex-col gap-12 animate-in fade-in duration-500">

            {/* Hero */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-4">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-sm font-bold">
                  <Sparkles className="w-4 h-4" />
                  CBSE Class V SST
                </div>
                <h2 className="text-5xl font-black text-purple-900 leading-[1.1]">
                  Let's explore<br />
                  <span className="text-purple-600">India & the World</span>
                </h2>
                <p className="text-purple-700 font-medium leading-relaxed">
                  Pip the Puppy is ready to guide you through maps, freedom fighters, world tours, and more! 🐾
                </p>
                <div className="flex gap-3">
                  <div className="bg-white rounded-2xl px-4 py-3 shadow-soft border border-purple-100 text-center">
                    <p className="text-2xl font-black text-purple-900">{chaptersRegistry.length}</p>
                    <p className="text-xs font-bold text-purple-500">Chapters</p>
                  </div>
                  <div className="bg-white rounded-2xl px-4 py-3 shadow-soft border border-purple-100 text-center">
                    <p className="text-2xl font-black text-green-600">{masteredChapters.length}</p>
                    <p className="text-xs font-bold text-purple-500">Mastered</p>
                  </div>
                  <div className="bg-white rounded-2xl px-4 py-3 shadow-soft border border-purple-100 text-center">
                    <p className="text-2xl font-black text-yellow-500">{puppyTreats}</p>
                    <p className="text-xs font-bold text-purple-500">🦴 Treats</p>
                  </div>
                </div>
              </div>

              {/* Pip Card */}
              <div className="card-purple p-8 flex flex-col items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-purple-50 rounded-full -mr-20 -mt-20 opacity-70" />
                <div className="text-[90px] mb-3 drop-shadow-md animate-bounce-subtle z-10">🐶</div>
                <div className="bg-purple-600 text-white px-5 py-2.5 rounded-2xl font-bold text-sm shadow-soft z-10">
                  "Woof! Pick a chapter!" 🐾
                </div>
                <div className="absolute bottom-4 flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-purple-200" />
                  ))}
                </div>
              </div>
            </div>

            {/* Chapters List */}
            <div>
              <div className="flex justify-between items-end mb-6">
                <h3 className="text-2xl font-black text-purple-900 flex items-center gap-2">
                  <GraduationCap className="text-purple-600" /> Chapters
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {chaptersRegistry.map((ch) => {
                  const meta = MODULE_META[ch.module];
                  const isMastered = masteredChapters.includes(ch.id);
                  return (
                    <button
                      key={ch.id}
                      onClick={() => openChapter(ch.id)}
                      className="card-purple p-5 text-left flex items-center gap-4 group"
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 border-2 ${meta.color}`}>
                        {ch.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-purple-400 uppercase tracking-wider">Ch. {ch.id} · {meta.label}</p>
                        <p className="font-black text-purple-900 leading-tight truncate">{ch.title}</p>
                        {isMastered && (
                          <p className="text-xs font-bold text-green-600 flex items-center gap-1 mt-1">
                            <Star className="w-3 h-3 fill-current" /> Mastered!
                          </p>
                        )}
                      </div>
                      <BookOpen className="w-5 h-5 text-purple-300 group-hover:text-purple-600 transition-colors flex-shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* CHAPTER VIEW */}
        {view === 'chapter' && selectedChapter && (
          <div className="animate-in slide-in-from-right-4 duration-400">
            <ChapterDetail chapter={selectedChapter} />
          </div>
        )}
      </main>
    </div>
  );
}
