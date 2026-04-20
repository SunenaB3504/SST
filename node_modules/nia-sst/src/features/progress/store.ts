import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ProgressStore {
  puppyTreats: number;
  masteredChapters: number[];
  currentChapterId: number | null;
  // Actions
  addTreats: (amount: number) => void;
  masterChapter: (chapterId: number) => void;
  setCurrentChapter: (chapterId: number) => void;
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set) => ({
      puppyTreats: 0,
      masteredChapters: [],
      currentChapterId: null,

      addTreats: (amount) =>
        set((state) => ({ puppyTreats: state.puppyTreats + amount })),

      masterChapter: (chapterId) =>
        set((state) => ({
          masteredChapters: state.masteredChapters.includes(chapterId)
            ? state.masteredChapters
            : [...state.masteredChapters, chapterId],
          puppyTreats: state.puppyTreats + 50, // Bonus treats for mastery!
        })),

      setCurrentChapter: (chapterId) =>
        set(() => ({ currentChapterId: chapterId })),
    }),
    {
      name: 'nia-sst-progress', // persists to localStorage
    }
  )
);
