import { describe, expect, it } from "vitest";
import {
  dueCards,
  gradeFromScore,
  isDue,
  MAX_EASE,
  MIN_EASE,
  newCard,
  review,
} from "./scheduler";

const NOW = Date.UTC(2026, 0, 1);
const DAY = 86_400_000;

describe("scheduler", () => {
  it("makes a new card due immediately", () => {
    expect(isDue(newCard("a", NOW), NOW)).toBe(true);
  });

  it("graduates a learning card to one day on good", () => {
    const card = review(newCard("a", NOW), "good", NOW);
    expect(card.learning).toBe(false);
    expect(card.interval).toBe(1);
    expect(card.due).toBe(NOW + DAY);
  });

  it("grows the interval by the ease factor on repeated good reviews", () => {
    let card = review(newCard("a", NOW), "good", NOW);
    card = review(card, "good", NOW);
    expect(card.interval).toBeCloseTo(2.5, 5);
  });

  it("sends a lapsed card back into learning with a short delay", () => {
    const graduated = review(newCard("a", NOW), "good", NOW);
    const lapsed = review(graduated, "again", NOW);

    expect(lapsed.learning).toBe(true);
    expect(lapsed.lapses).toBe(1);
    expect(lapsed.interval).toBe(0);
    expect(lapsed.due - NOW).toBeLessThan(10 * 60_000);
    expect(lapsed.ease).toBeLessThan(graduated.ease);
  });

  it("keeps ease inside its bounds", () => {
    let hard = newCard("a", NOW);
    for (let i = 0; i < 20; i += 1) hard = review(hard, "again", NOW);
    expect(hard.ease).toBe(MIN_EASE);

    let easy = newCard("b", NOW);
    for (let i = 0; i < 20; i += 1) easy = review(easy, "easy", NOW);
    expect(easy.ease).toBe(MAX_EASE);
  });

  it("caps the interval at a year", () => {
    let card = review(newCard("a", NOW), "easy", NOW);
    for (let i = 0; i < 30; i += 1) card = review(card, "easy", NOW);
    expect(card.interval).toBeLessThanOrEqual(365);
  });

  it("returns only due cards, soonest first", () => {
    const soon = { ...newCard("soon", NOW), due: NOW - 1000 };
    const overdue = { ...newCard("overdue", NOW), due: NOW - 50_000 };
    const later = { ...newCard("later", NOW), due: NOW + DAY };

    expect(dueCards([soon, later, overdue], NOW).map((c) => c.id)).toEqual([
      "overdue",
      "soon",
    ]);
  });

  it("maps drill scores onto grades", () => {
    expect(gradeFromScore(95)).toBe("easy");
    expect(gradeFromScore(80)).toBe("good");
    expect(gradeFromScore(60)).toBe("hard");
    expect(gradeFromScore(20)).toBe("again");
  });
});
