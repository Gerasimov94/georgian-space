import { describe, expect, it } from "vitest";
import { englishNumber, georgianNumber, numberRange } from "./numbers";

describe("georgianNumber", () => {
  it("returns the base words for 1 to 10", () => {
    expect(georgianNumber(1).ka).toBe("ერთი");
    expect(georgianNumber(8).ka).toBe("რვა");
    expect(georgianNumber(10).ka).toBe("ათი");
  });

  it("returns the teens as whole words", () => {
    expect(georgianNumber(11).ka).toBe("თერთმეტი");
    expect(georgianNumber(15).ka).toBe("თხუთმეტი");
    expect(georgianNumber(19).ka).toBe("ცხრამეტი");
  });

  it("builds the round twenties", () => {
    expect(georgianNumber(20).ka).toBe("ოცი");
    expect(georgianNumber(40).ka).toBe("ორმოცი");
    expect(georgianNumber(60).ka).toBe("სამოცი");
    expect(georgianNumber(80).ka).toBe("ოთხმოცი");
    expect(georgianNumber(100).ka).toBe("ასი");
  });

  it("composes twenties with a remainder", () => {
    expect(georgianNumber(21).ka).toBe("ოცდაერთი");
    expect(georgianNumber(30).ka).toBe("ოცდაათი");
    expect(georgianNumber(47).ka).toBe("ორმოცდაშვიდი");
    expect(georgianNumber(50).ka).toBe("ორმოცდაათი");
    expect(georgianNumber(63).ka).toBe("სამოცდასამი");
    expect(georgianNumber(88).ka).toBe("ოთხმოცდარვა");
    expect(georgianNumber(90).ka).toBe("ოთხმოცდაათი");
    expect(georgianNumber(99).ka).toBe("ოთხმოცდაცხრამეტი");
  });

  it("transliterates the composed words", () => {
    expect(georgianNumber(47).latin).toBe("ormotsdashvidi");
    expect(georgianNumber(30).latin).toBe("otsdaati");
    expect(georgianNumber(80).latin).toBe("otkhmotsi");
  });

  it("breaks composed numbers into twenties, and, remainder", () => {
    const { parts, sum } = georgianNumber(47);
    expect(parts.map((part) => part.ka)).toEqual(["ორმოც", "და", "შვიდი"]);
    expect(parts.map((part) => part.value)).toEqual([40, null, 7]);
    expect(sum).toBe("2 × 20 + 7");
  });

  it("keeps the parts consistent with the word for every number", () => {
    for (const entry of numberRange(1, 100)) {
      expect(entry.parts.map((part) => part.ka).join("")).toBe(entry.ka);
      expect(entry.parts.map((part) => part.latin).join("")).toBe(entry.latin);

      const total = entry.parts.reduce((sum, part) => sum + (part.value ?? 0), 0);
      expect(total).toBe(entry.value);
    }
  });

  it("rejects numbers outside 1 to 100", () => {
    expect(() => georgianNumber(0)).toThrow(RangeError);
    expect(() => georgianNumber(101)).toThrow(RangeError);
    expect(() => georgianNumber(4.5)).toThrow(RangeError);
  });
});

describe("englishNumber", () => {
  it("names numbers up to a hundred", () => {
    expect(englishNumber(7)).toBe("seven");
    expect(englishNumber(13)).toBe("thirteen");
    expect(englishNumber(40)).toBe("forty");
    expect(englishNumber(47)).toBe("forty-seven");
    expect(englishNumber(100)).toBe("one hundred");
  });
});
