import type { Lesson, Unit, Vocab } from "@/lib/course/types";
import { adjectivesUnit } from "./adjectives";
import { alphabetUnit } from "./alphabet";
import { bodyColorsUnit } from "./body-colors";
import { familyUnit } from "./family";
import { numbersUnit } from "./numbers";
import { readingUnit } from "./reading";
import { survivalUnit } from "./survival";
import { toBeUnit } from "./to-be";
import { verbsUnit } from "./verbs";

/**
 * Course order: reading comes before speaking, and every later unit only uses
 * words and grammar introduced earlier.
 */
export const UNITS: Unit[] = [
  alphabetUnit,
  readingUnit,
  survivalUnit,
  toBeUnit,
  familyUnit,
  adjectivesUnit,
  numbersUnit,
  verbsUnit,
  bodyColorsUnit,
];

export function getUnit(id: string): Unit | undefined {
  return UNITS.find((unit) => unit.id === id);
}

export function getLesson(
  unitId: string,
  lessonId: string,
): { unit: Unit; lesson: Lesson; next?: Lesson } | undefined {
  const unit = getUnit(unitId);
  if (!unit) return undefined;

  const index = unit.lessons.findIndex((lesson) => lesson.id === lessonId);
  if (index < 0) return undefined;

  return {
    unit,
    lesson: unit.lessons[index],
    next: unit.lessons[index + 1],
  };
}

/** Flat walk of the whole course, used by "continue where you left off". */
export function courseSequence(): { unitId: string; lessonId: string }[] {
  return UNITS.flatMap((unit) =>
    unit.lessons.map((lesson) => ({ unitId: unit.id, lessonId: lesson.id })),
  );
}

export function totalLessons(): number {
  return UNITS.reduce((sum, unit) => sum + unit.lessons.length, 0);
}

export function totalWords(): number {
  const words = new Set<string>();
  for (const unit of UNITS) {
    if (unit.id === "alphabet") continue;
    for (const item of unit.vocab) words.add(item.ka);
  }
  return words.size;
}

/** Every vocabulary item in the course, deduplicated, for card lookups. */
export function allVocab(): Map<string, Vocab> {
  const map = new Map<string, Vocab>();
  for (const unit of UNITS) {
    if (unit.id === "alphabet") continue;
    for (const item of unit.vocab) {
      if (!map.has(item.ka)) map.set(item.ka, item);
    }
  }
  return map;
}

/** The same items with the unit they were introduced in, for practice rounds. */
export function allVocabWithUnit(): (Vocab & { unitId: string; unit: string })[] {
  const seen = new Set<string>();
  const out: (Vocab & { unitId: string; unit: string })[] = [];
  for (const unit of UNITS) {
    if (unit.id === "alphabet") continue;
    for (const item of unit.vocab) {
      if (seen.has(item.ka)) continue;
      seen.add(item.ka);
      out.push({ ...item, unitId: unit.id, unit: unit.title });
    }
  }
  return out;
}
