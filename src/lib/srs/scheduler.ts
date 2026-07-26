/**
 * A compact SM-2: enough spacing behaviour to be useful, small enough to reason
 * about. Intervals are in days; short relearning steps are handled in minutes.
 */

export type Grade = "again" | "hard" | "good" | "easy";

export type Card = {
  id: string;
  ease: number;
  /** Days until the next review. 0 while the card is still being learned. */
  interval: number;
  reps: number;
  lapses: number;
  /** Epoch milliseconds. */
  due: number;
  learning: boolean;
  lastScore?: number;
};

export const MIN_EASE = 1.3;
export const MAX_EASE = 3;
export const MAX_INTERVAL = 365;

const MINUTE = 60_000;
const DAY = 86_400_000;

export function newCard(id: string, now = Date.now()): Card {
  return {
    id,
    ease: 2.5,
    interval: 0,
    reps: 0,
    lapses: 0,
    due: now,
    learning: true,
  };
}

const clampEase = (ease: number) =>
  Math.min(MAX_EASE, Math.max(MIN_EASE, Number(ease.toFixed(2))));

const clampInterval = (days: number) =>
  Math.min(MAX_INTERVAL, Math.round(days * 100) / 100);

export function review(card: Card, grade: Grade, now = Date.now()): Card {
  const next: Card = { ...card, reps: card.reps + 1 };

  switch (grade) {
    case "again":
      next.ease = clampEase(card.ease - 0.2);
      next.interval = 0;
      next.lapses = card.lapses + 1;
      next.learning = true;
      next.due = now + 5 * MINUTE;
      return next;

    case "hard":
      next.ease = clampEase(card.ease - 0.15);
      next.interval = card.learning ? 0.5 : clampInterval(card.interval * 1.2);
      next.learning = card.learning;
      next.due = now + Math.max(10 * MINUTE, next.interval * DAY);
      return next;

    case "good":
      next.ease = card.ease;
      next.interval = card.learning
        ? 1
        : clampInterval(Math.max(1, card.interval) * card.ease);
      next.learning = false;
      next.due = now + next.interval * DAY;
      return next;

    case "easy":
      next.ease = clampEase(card.ease + 0.15);
      next.interval = card.learning
        ? 3
        : clampInterval(Math.max(1, card.interval) * card.ease * 1.3);
      next.learning = false;
      next.due = now + next.interval * DAY;
      return next;
  }
}

export function isDue(card: Card, now = Date.now()): boolean {
  return card.due <= now;
}

export function dueCards(cards: Card[], now = Date.now()): Card[] {
  return cards.filter((card) => isDue(card, now)).sort((a, b) => a.due - b.due);
}

/** Turns a handwriting or quiz score into a grade, so drills feed the same queue. */
export function gradeFromScore(score: number): Grade {
  if (score >= 92) return "easy";
  if (score >= 75) return "good";
  if (score >= 55) return "hard";
  return "again";
}
