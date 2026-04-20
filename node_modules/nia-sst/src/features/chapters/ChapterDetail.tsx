import React, { useState } from 'react';
import type { ChapterData, MindMapNode } from '../../entities/chapter/types';
import { QuizEngine } from '../quiz/QuizEngine';
import { VideoPlayer } from './VideoPlayer';
import { Eye, EyeOff } from 'lucide-react';

type StudyMode = 'essence' | 'chain' | 'bigpicture' | 'essay' | 'quiz' | 'video';

const tabs: { id: StudyMode; label: string; emoji: string; description: string; color?: string }[] = [
  { id: 'essence',    label: 'The Essence',     emoji: '✨', description: 'Key bullet points' },
  { id: 'chain',      label: 'Chain Reaction',  emoji: '⛓️', description: 'Cause & Effect' },
  { id: 'bigpicture', label: 'Big Picture',     emoji: '🗺️', description: 'Mind Map' },
  { id: 'essay',      label: 'Essay Architect', emoji: '✍️', description: 'Writing starters & model answers' },
  { id: 'quiz',       label: 'Quiz Time!',      emoji: '🎯', description: 'Test yourself — 25 questions!' },
  { id: 'video',      label: 'Watch & Learn',   emoji: '▶️', description: 'YouTube video', color: 'red' },
];

// ── Essence ─────────────────────────────────────────────────────────────────
function EssenceView({ data }: { data: ChapterData['essence'] }) {
  return (
    <ul className="flex flex-col gap-4">
      {data.map((fact, i) => (
        <li key={fact.id} className="flex gap-4 items-start bg-white border-l-4 border-purple-500 rounded-r-2xl px-5 py-4 shadow-soft">
          <span className="text-purple-600 font-black text-lg w-7 flex-shrink-0">{i + 1}.</span>
          <p className="text-purple-900 font-medium leading-relaxed">{fact.text}</p>
        </li>
      ))}
    </ul>
  );
}

// ── Chain Reaction ───────────────────────────────────────────────────────────
function ChainReactionView({ data }: { data: ChapterData['chainReactions'] }) {
  return (
    <div className="flex flex-col gap-6">
      {data.map((item) => (
        <div key={item.id} className="grid grid-cols-[1fr,auto,1fr] gap-4 items-start">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
            <p className="text-xs font-black text-red-500 uppercase tracking-wider mb-1">🔥 Cause</p>
            <p className="text-red-900 font-semibold leading-snug text-sm">{item.cause}</p>
          </div>
          <div className="text-2xl text-purple-500 font-black flex-shrink-0 mt-6">→</div>
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4">
            <p className="text-xs font-black text-green-600 uppercase tracking-wider mb-1">💥 Effect</p>
            <p className="text-green-900 font-semibold leading-snug text-sm">{item.effect}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Mind Map ─────────────────────────────────────────────────────────────────
// Uses a clean tree layout: vertical stem → horizontal crossbar → vertical drops → children
function MindMapNodeView({ node, depth = 0 }: { node: MindMapNode; depth?: number }) {
  const nodeStyles = [
    'bg-purple-700 text-white font-black border-2 border-purple-900 text-sm shadow-soft',           // root
    'bg-purple-200 text-purple-900 font-black border-2 border-purple-600 text-xs',                   // level-1
    'bg-white text-purple-800 font-semibold border-2 border-purple-400 text-xs shadow-sm',           // level-2
  ];
  const style = nodeStyles[Math.min(depth, 2)];
  const children = node.children ?? [];
  const hasChildren = children.length > 0;

  return (
    <div className="flex flex-col items-center">
      {/* Node box */}
      <div className={`${style} px-4 py-2.5 rounded-2xl text-center whitespace-pre-line max-w-[160px] min-w-[100px]`}>
        {node.label}
      </div>

      {hasChildren && (
        <>
          {/* Vertical stem down from this node */}
          <div className="w-[3px] h-7 bg-purple-600" />

          {/* Horizontal crossbar + child columns */}
          <div className="relative flex">
            {/* Full-width crossbar absolutely positioned at the top of this flex container */}
            <div className="absolute top-0 left-[50px] right-[50px] h-[3px] bg-purple-600" />

            {children.map((child) => (
              <div key={child.id} className="flex flex-col items-center px-4 min-w-[120px]">
                {/* Vertical drop from crossbar to child */}
                <div className="w-[3px] h-7 bg-purple-500" />
                <MindMapNodeView node={child} depth={depth + 1} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function BigPictureView({ data }: { data: ChapterData['bigPicture'] }) {
  return (
    <div className="overflow-x-auto py-6 px-4">
      <div className="min-w-max flex justify-center">
        <MindMapNodeView node={data} />
      </div>
    </div>
  );
}

// ── Essay Architect ──────────────────────────────────────────────────────────
function EssayArchitectView({ data }: { data: ChapterData['essayStarters'] }) {
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const toggleReveal = (id: string) =>
    setRevealedIds((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <div className="flex flex-col gap-6">
      {data.map((item, i) => {
        const isRevealed = revealedIds.has(item.id);
        return (
          <div key={item.id} className="card-purple p-6" style={{ animationDelay: `${i * 100}ms` }}>
            <p className="text-xs font-black text-purple-500 uppercase tracking-wider mb-1">✍️ Essay Question</p>
            <p className="text-purple-900 font-bold leading-snug mb-4">{item.prompt}</p>
            <div className="bg-purple-50 border-l-4 border-purple-500 rounded-r-xl px-4 py-3 mb-4">
              <p className="text-xs font-black text-purple-500 mb-1">Start your answer here...</p>
              <p className="text-purple-800 font-semibold italic leading-relaxed">{item.starter}</p>
            </div>
            <button
              onClick={() => toggleReveal(item.id)}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-sm border-2 transition-all duration-300 ${
                isRevealed ? 'border-purple-300 bg-purple-100 text-purple-700' : 'border-purple-200 bg-white text-purple-600 hover:bg-purple-50'
              }`}
            >
              {isRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {isRevealed ? 'Hide Model Answer' : '👁️ Reveal Full Model Answer'}
            </button>
            {isRevealed && (
              <div className="mt-4 bg-green-50 border-2 border-green-200 rounded-2xl p-5 animate-in slide-in-from-top-2 duration-300">
                <p className="text-xs font-black text-green-600 uppercase tracking-wider mb-2">✅ Model Answer (for exam prep)</p>
                <p className="text-green-900 font-medium leading-relaxed text-sm whitespace-pre-line">{item.fullAnswer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
interface ChapterDetailProps {
  chapter: ChapterData;
}

export const ChapterDetail: React.FC<ChapterDetailProps> = ({ chapter }) => {
  const [activeMode, setActiveMode] = useState<StudyMode>('essence');

  return (
    <div className="flex flex-col gap-8">
      {/* Chapter Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-purple-600 rounded-3xl flex items-center justify-center text-3xl shadow-soft animate-bounce-subtle">
          {chapter.emoji}
        </div>
        <div>
          <p className="text-xs font-black text-purple-500 uppercase tracking-widest">Chapter {chapter.id}</p>
          <h2 className="text-2xl font-black text-purple-900">{chapter.title}</h2>
        </div>
      </div>

      {/* Tab Switcher — single source of truth, no duplicate */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((tab) => {
          const isActive = activeMode === tab.id;
          const isVideo = tab.id === 'video';
          const activeClass = isVideo
            ? 'bg-red-500 text-white shadow-soft scale-105'
            : 'bg-purple-600 text-white shadow-soft scale-105';
          const inactiveClass = isVideo
            ? 'bg-white text-red-500 border-2 border-red-100 hover:bg-red-50'
            : 'bg-white text-purple-700 border-2 border-purple-100 hover:bg-purple-50';
          return (
            <button
              key={tab.id}
              onClick={() => setActiveMode(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm transition-all duration-300 ${isActive ? activeClass : inactiveClass}`}
            >
              <span>{tab.emoji}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Mode description */}
      <div>
        <h3 className="text-lg font-black text-purple-900">
          {tabs.find((t) => t.id === activeMode)?.emoji}{' '}
          {tabs.find((t) => t.id === activeMode)?.label}
        </h3>
        <p className="text-purple-500 text-sm font-medium">{tabs.find((t) => t.id === activeMode)?.description}</p>
      </div>

      {/* Content */}
      <div className="animate-in fade-in duration-300">
        {activeMode === 'essence'    && <EssenceView data={chapter.essence} />}
        {activeMode === 'chain'      && <ChainReactionView data={chapter.chainReactions} />}
        {activeMode === 'bigpicture' && <BigPictureView data={chapter.bigPicture} />}
        {activeMode === 'essay'      && <EssayArchitectView data={chapter.essayStarters} />}
        {activeMode === 'quiz'       && <QuizEngine questions={chapter.quiz} chapterId={chapter.id} />}
        {activeMode === 'video'      && <VideoPlayer videoUrl={chapter.videoUrl ?? ''} title={chapter.title} />}
      </div>
    </div>
  );
};
