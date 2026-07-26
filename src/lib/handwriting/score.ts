import { distanceTransform } from "./distance";
import {
  maskArea,
  maskBBox,
  xHeightOf,
  type Guides,
  type Mask,
} from "./types";
import type { LetterZone } from "@/lib/data/letters";

export const PASS_SCORE = 75;

/** Per-pixel classification of the comparison, for the overlay. */
export const DIFF = {
  none: 0,
  match: 1,
  missed: 2,
  stray: 3,
} as const;

export type Verdict = "excellent" | "good" | "close" | "again";

export type ScoreResult = {
  score: number;
  /** Share of the reference glyph that the drawing reached. */
  coverage: number;
  /** Share of the drawing that landed on the reference glyph. */
  precision: number;
  verdict: Verdict;
  passed: boolean;
  hints: string[];
  diff: Uint8Array;
  width: number;
  height: number;
};

export type ScoreOptions = {
  target: Mask;
  user: Mask;
  guides: Guides;
  zone: LetterZone;
};

const EMPTY_RESULT = (target: Mask): ScoreResult => ({
  score: 0,
  coverage: 0,
  precision: 0,
  verdict: "again",
  passed: false,
  hints: ["Draw the letter on the left to get a score."],
  diff: new Uint8Array(target.width * target.height),
  width: target.width,
  height: target.height,
});

/**
 * Compares a drawing against the rendered reference glyph.
 *
 * Coverage answers "did you draw all of the letter", precision answers "did you
 * only draw the letter", and both are measured with a tolerance band so that
 * ordinary handwriting wobble and the thickness difference between a pen stroke
 * and a printed stem do not count against you. Placement against the guide
 * lines and gross over-inking are then subtracted.
 */
export function scoreDrawing({
  target,
  user,
  guides,
  zone,
}: ScoreOptions): ScoreResult {
  if (target.width !== user.width || target.height !== user.height) {
    throw new Error("target and user masks must share dimensions");
  }

  const targetArea = maskArea(target);
  const userArea = maskArea(user);
  if (targetArea === 0 || userArea === 0) return EMPTY_RESULT(target);

  const height = target.height;
  const tolerance = 0.055 * height;
  const tightTolerance = 0.045 * height;

  const distToUser = distanceTransform(user);
  const distToTarget = distanceTransform(target);

  const diff = new Uint8Array(target.width * target.height);

  let covered = 0;
  let onTarget = 0;

  for (let i = 0; i < diff.length; i += 1) {
    const isTarget = target.data[i] === 1;
    const isUser = user.data[i] === 1;

    if (isTarget) {
      if (distToUser[i] <= tolerance) {
        covered += 1;
        diff[i] = DIFF.match;
      } else {
        diff[i] = DIFF.missed;
      }
    }

    if (isUser) {
      if (distToTarget[i] <= tightTolerance) {
        onTarget += 1;
        if (diff[i] === DIFF.none) diff[i] = DIFF.match;
      } else {
        diff[i] = DIFF.stray;
      }
    }
  }

  const coverage = covered / targetArea;
  const precision = onTarget / userArea;
  const hints: string[] = [];

  let score =
    coverage + precision > 0
      ? (100 * (2 * coverage * precision)) / (coverage + precision)
      : 0;

  score -= placementPenalty({ user, guides, zone, hints });
  score -= overInkPenalty({ userArea, targetArea, hints });

  if (coverage < 0.75) {
    hints.push("Part of the letter is missing — follow the whole shape.");
  }
  if (precision < 0.7) {
    hints.push("Some strokes stray outside the letter.");
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  return {
    score,
    coverage,
    precision,
    verdict: verdictFor(score),
    passed: score >= PASS_SCORE,
    hints,
    diff,
    width: target.width,
    height: target.height,
  };
}

function verdictFor(score: number): Verdict {
  if (score >= 90) return "excellent";
  if (score >= PASS_SCORE) return "good";
  if (score >= 55) return "close";
  return "again";
}

/**
 * Georgian is written on four lines, so a shape can be drawn perfectly and
 * still be wrong: ღ that never dips below the baseline is not ღ.
 */
function placementPenalty({
  user,
  guides,
  zone,
  hints,
}: {
  user: Mask;
  guides: Guides;
  zone: LetterZone;
  hints: string[];
}): number {
  const box = maskBBox(user);
  if (!box) return 0;

  const xHeight = xHeightOf(guides);
  const slack = 0.18 * xHeight;
  let penalty = 0;

  const wantsAscender = zone === "ascender" || zone === "full";
  const wantsDescender = zone === "descender" || zone === "full";

  if (wantsAscender && box.top > guides.midline - slack) {
    penalty += 12;
    hints.push("This letter has an ascender: reach above the midline.");
  }
  if (wantsDescender && box.bottom < guides.baseline + slack) {
    penalty += 12;
    hints.push("This letter is a descender: the tail must cross the baseline.");
  }
  if (!wantsAscender && box.top < guides.midline - slack * 1.6) {
    penalty += 8;
    hints.push("It should stay below the midline.");
  }
  if (!wantsDescender && box.bottom > guides.baseline + slack * 1.6) {
    penalty += 8;
    hints.push("It should sit on the baseline, not below it.");
  }

  return penalty;
}

/** A blob that covers the glyph would otherwise score well on both metrics. */
function overInkPenalty({
  userArea,
  targetArea,
  hints,
}: {
  userArea: number;
  targetArea: number;
  hints: string[];
}): number {
  const ratio = userArea / targetArea;
  if (ratio <= 1.7) return 0;
  if (ratio > 2.6) hints.push("Too much ink — draw thin, deliberate strokes.");
  return Math.min(25, (ratio - 1.7) * 22);
}
