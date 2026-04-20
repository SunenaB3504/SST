// All content types used across features - strictly typed, no
// free-form strings to prevent hallucination.

export interface KeyFact {
  id: string;
  text: string;
}

export interface CauseEffect {
  id: string;
  cause: string;
  effect: string;
}

export interface MindMapNode {
  id: string;
  label: string;
  children?: MindMapNode[];
}

export interface EssayStarter {
  id: string;
  prompt: string;
  starter: string;
  fullAnswer: string;
}

export interface QuizOption {
  text: string;
}

// Question types for varied quiz experience
export type QuestionType = 'mcq' | 'true-false' | 'fill-blank' | 'spelling' | 'matching' | 'short-answer';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options: QuizOption[];   // Used by all types except short-answer
  correctIndex: number;    // Used by all types except short-answer
  modelAnswer?: string;    // Required for short-answer type
  pipsExplanation: string;
}

export interface ChapterData {
  id: number;
  title: string;
  module: 'explorer' | 'world-tour' | 'freedom-fighter' | 'young-citizen';
  emoji: string;
  videoUrl?: string;
  essence: KeyFact[];
  chainReactions: CauseEffect[];
  bigPicture: MindMapNode;
  essayStarters: EssayStarter[];
  quiz: QuizQuestion[];
}
