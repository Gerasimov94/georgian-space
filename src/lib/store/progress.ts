"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { del, get, set } from "idb-keyval";
import {
  dueCards,
  gradeFromScore,
  newCard,
  review,
  type Card,
  type Grade,
} from "@/lib/srs/scheduler";

export type LetterStat = {
  attempts: number;
  best: number;
  last: number;
  masteredAt: number | null;
};

export type LessonResult = {
  correct: number;
  total: number;
  completedAt: number;
};

export type LastPlace = { unitId: string; lessonId: string } | null;

type ProgressState = {
  letters: Record<string, LetterStat>;
  cards: Record<string, Card>;
  lessons: Record<string, LessonResult>;
  streak: { current: number; longest: number; lastDay: string | null };
  lastPlace: LastPlace;

  recordLetterAttempt: (char: string, score: number) => void;
  ensureCards: (ids: string[]) => void;
  gradeCard: (id: string, grade: Grade) => void;
  completeLesson: (
    unitId: string,
    lessonId: string,
    correct: number,
    total: number,
  ) => void;
  setLastPlace: (place: LastPlace) => void;
  resetAll: () => void;
};

const dayKey = (timestamp = Date.now()) =>
  new Date(timestamp).toISOString().slice(0, 10);

const previousDayKey = (timestamp = Date.now()) =>
  dayKey(timestamp - 86_400_000);

function bumpStreak(streak: ProgressState["streak"]): ProgressState["streak"] {
  const today = dayKey();
  if (streak.lastDay === today) return streak;

  const current = streak.lastDay === previousDayKey() ? streak.current + 1 : 1;
  return {
    current,
    longest: Math.max(streak.longest, current),
    lastDay: today,
  };
}

/** Cards for letters and vocabulary share one queue, separated by prefix. */
export const letterCardId = (char: string) => `letter:${char}`;
export const wordCardId = (ka: string) => `word:${ka}`;

const EMPTY: Pick<
  ProgressState,
  "letters" | "cards" | "lessons" | "streak" | "lastPlace"
> = {
  letters: {},
  cards: {},
  lessons: {},
  streak: { current: 0, longest: 0, lastDay: null },
  lastPlace: null,
};

export const useProgress = create<ProgressState>()(
  persist(
    (setState) => ({
      ...EMPTY,

      recordLetterAttempt: (char, score) =>
        setState((state) => {
          const previous = state.letters[char];
          const best = Math.max(previous?.best ?? 0, score);
          const stat: LetterStat = {
            attempts: (previous?.attempts ?? 0) + 1,
            best,
            last: score,
            masteredAt:
              previous?.masteredAt ?? (score >= 75 ? Date.now() : null),
          };

          const id = letterCardId(char);
          const card = state.cards[id] ?? newCard(id);

          return {
            letters: { ...state.letters, [char]: stat },
            cards: {
              ...state.cards,
              [id]: {
                ...review(card, gradeFromScore(score)),
                lastScore: score,
              },
            },
            streak: bumpStreak(state.streak),
          };
        }),

      ensureCards: (ids) =>
        setState((state) => {
          const missing = ids.filter((id) => !state.cards[id]);
          if (missing.length === 0) return state;

          const cards = { ...state.cards };
          for (const id of missing) cards[id] = newCard(id);
          return { cards };
        }),

      gradeCard: (id, grade) =>
        setState((state) => {
          const card = state.cards[id] ?? newCard(id);
          return {
            cards: { ...state.cards, [id]: review(card, grade) },
            streak: bumpStreak(state.streak),
          };
        }),

      completeLesson: (unitId, lessonId, correct, total) =>
        setState((state) => ({
          lessons: {
            ...state.lessons,
            [`${unitId}/${lessonId}`]: {
              correct,
              total,
              completedAt: Date.now(),
            },
          },
          lastPlace: { unitId, lessonId },
          streak: bumpStreak(state.streak),
        })),

      setLastPlace: (place) => setState({ lastPlace: place }),

      resetAll: () => setState({ ...EMPTY }),
    }),
    {
      name: "georgian-space-progress",
      version: 1,
      storage: createJSONStorage(() => ({
        getItem: async (name) => (await get<string>(name)) ?? null,
        setItem: async (name, value) => set(name, value),
        removeItem: async (name) => del(name),
      })),
      partialize: ({ letters, cards, lessons, streak, lastPlace }) => ({
        letters,
        cards,
        lessons,
        streak,
        lastPlace,
      }),
    },
  ),
);

/** True once IndexedDB has been read, so the UI can avoid flashing empty state. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    (onChange) => useProgress.persist.onFinishHydration(onChange),
    () => useProgress.persist.hasHydrated(),
    () => false,
  );
}

export function selectDueCards(state: ProgressState, now = Date.now()): Card[] {
  return dueCards(Object.values(state.cards), now);
}

export function selectMasteredLetters(state: ProgressState): string[] {
  return Object.entries(state.letters)
    .filter(([, stat]) => stat.best >= 75)
    .map(([char]) => char);
}

export function lessonKey(unitId: string, lessonId: string): string {
  return `${unitId}/${lessonId}`;
}
