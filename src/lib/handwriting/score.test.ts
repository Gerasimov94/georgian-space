import { describe, expect, it } from "vitest";
import { DIFF, PASS_SCORE, scoreDrawing } from "./score";
import { createMask, guidesFor, type Mask } from "./types";

const WIDTH = 360;
const HEIGHT = 400;
const GUIDES = guidesFor(HEIGHT); // midline 152, baseline 272

function blank(): Mask {
  return createMask(WIDTH, HEIGHT);
}

function fill(
  mask: Mask,
  left: number,
  top: number,
  right: number,
  bottom: number,
): Mask {
  for (let y = Math.max(0, top); y < Math.min(HEIGHT, bottom); y += 1) {
    for (let x = Math.max(0, left); x < Math.min(WIDTH, right); x += 1) {
      mask.data[y * WIDTH + x] = 1;
    }
  }
  return mask;
}

function shift(mask: Mask, dy: number): Mask {
  const moved = blank();
  for (let y = 0; y < HEIGHT; y += 1) {
    const target = y + dy;
    if (target < 0 || target >= HEIGHT) continue;
    for (let x = 0; x < WIDTH; x += 1) {
      moved.data[target * WIDTH + x] = mask.data[y * WIDTH + x];
    }
  }
  return moved;
}

/** A thick stem plus a crossbar: stands in for an x-height letter. */
function midlineGlyph(): Mask {
  const mask = blank();
  fill(mask, 150, GUIDES.midline, 180, GUIDES.baseline);
  fill(mask, 150, GUIDES.midline, 230, GUIDES.midline + 26);
  return mask;
}

/** The same stem, continued below the baseline. */
function descenderGlyph(): Mask {
  const mask = midlineGlyph();
  fill(mask, 150, GUIDES.baseline, 180, GUIDES.descender);
  return mask;
}

function count(diff: Uint8Array, kind: number): number {
  let total = 0;
  for (const value of diff) if (value === kind) total += 1;
  return total;
}

describe("scoreDrawing", () => {
  it("scores an exact copy of the glyph near perfect", () => {
    const target = midlineGlyph();
    const result = scoreDrawing({
      target,
      user: midlineGlyph(),
      guides: GUIDES,
      zone: "midline",
    });

    expect(result.score).toBeGreaterThan(90);
    expect(result.verdict).toBe("excellent");
    expect(result.passed).toBe(true);
    expect(result.hints).toHaveLength(0);
  });

  it("scores an empty canvas zero and says so", () => {
    const result = scoreDrawing({
      target: midlineGlyph(),
      user: blank(),
      guides: GUIDES,
      zone: "midline",
    });

    expect(result.score).toBe(0);
    expect(result.verdict).toBe("again");
    expect(result.hints[0]).toMatch(/draw/i);
  });

  it("scores a different letter low", () => {
    const target = blank();
    fill(target, 40, GUIDES.midline, 90, GUIDES.baseline);
    const user = blank();
    fill(user, 280, GUIDES.midline, 330, GUIDES.baseline);

    const result = scoreDrawing({
      target,
      user,
      guides: GUIDES,
      zone: "midline",
    });

    expect(result.score).toBeLessThan(25);
    expect(result.passed).toBe(false);
  });

  it("accepts a thin pen stroke through a thick printed stem", () => {
    const target = blank();
    fill(target, 150, GUIDES.midline, 186, GUIDES.baseline);
    const user = blank();
    fill(user, 166, GUIDES.midline, 172, GUIDES.baseline);

    const result = scoreDrawing({
      target,
      user,
      guides: GUIDES,
      zone: "midline",
    });

    expect(result.coverage).toBeGreaterThan(0.95);
    expect(result.precision).toBeGreaterThan(0.95);
    expect(result.score).toBeGreaterThanOrEqual(PASS_SCORE);
  });

  it("penalises a descender that never crosses the baseline", () => {
    const target = descenderGlyph();

    const placed = scoreDrawing({
      target,
      user: descenderGlyph(),
      guides: GUIDES,
      zone: "descender",
    });
    expect(placed.hints).toHaveLength(0);

    const raised = scoreDrawing({
      target,
      user: shift(descenderGlyph(), -70),
      guides: GUIDES,
      zone: "descender",
    });

    expect(raised.score).toBeLessThan(placed.score);
    expect(raised.hints.join(" ")).toMatch(/descender/i);
  });

  it("penalises an x-height letter drawn into the ascender zone", () => {
    const result = scoreDrawing({
      target: midlineGlyph(),
      user: shift(midlineGlyph(), -90),
      guides: GUIDES,
      zone: "midline",
    });

    expect(result.hints.join(" ")).toMatch(/below the midline/i);
    expect(result.passed).toBe(false);
  });

  it("penalises scribbling over the letter instead of tracing it", () => {
    const user = blank();
    fill(user, 130, GUIDES.midline - 20, 250, GUIDES.baseline + 20);

    const result = scoreDrawing({
      target: midlineGlyph(),
      user,
      guides: GUIDES,
      zone: "midline",
    });

    expect(result.passed).toBe(false);
    expect(result.hints.join(" ")).toMatch(/too much ink/i);
  });

  it("marks missing parts of the glyph in the diff overlay", () => {
    const target = midlineGlyph();
    fill(target, 230, GUIDES.midline, 300, GUIDES.midline + 26); // longer crossbar
    const user = blank();
    fill(user, 150, GUIDES.midline, 180, GUIDES.baseline); // stem only

    const result = scoreDrawing({
      target,
      user,
      guides: GUIDES,
      zone: "midline",
    });

    expect(count(result.diff, DIFF.missed)).toBeGreaterThan(0);
    expect(count(result.diff, DIFF.match)).toBeGreaterThan(0);
    expect(result.coverage).toBeLessThan(1);
    expect(result.verdict).not.toBe("excellent");
  });
});
