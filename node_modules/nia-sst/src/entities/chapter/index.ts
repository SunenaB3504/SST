import type { ChapterData } from './types';
import { chapter1 } from './data/chapter1';
import { chapter2 } from './data/chapter2';
import { chapter3 } from './data/chapter3';
import { chapter4 } from './data/chapter4';
import { chapter5 } from './data/chapter5';
import { chapter6 } from './data/chapter6';
import { chapter7 } from './data/chapter7';
import { chapter8 } from './data/chapter8';
import { chapter9 } from './data/chapter9';
import { chapter10 } from './data/chapter10';
import { chapter11 } from './data/chapter11';
import { chapter12 } from './data/chapter12';
import { chapter13 } from './data/chapter13';
import { chapter14 } from './data/chapter14';
import { chapter15 } from './data/chapter15';
import { chapter16 } from './data/chapter16';

// Registry of all chapters. Add new chapter data files here in order.
export const chaptersRegistry: ChapterData[] = [
  chapter1,
  chapter2,
  chapter3,
  chapter4,
  chapter5,
  chapter6,
  chapter7,
  chapter8,
  chapter9,
  chapter10,
  chapter11,
  chapter12,
  chapter13,
  chapter14,
  chapter15,
  chapter16,
];

export const getChapterById = (id: number): ChapterData | undefined =>
  chaptersRegistry.find((ch) => ch.id === id);
