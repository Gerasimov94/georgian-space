import { createScratchContext } from "./scratch";
import { createMask, type Mask, type Point, type Stroke } from "./types";

/**
 * Drops points that are closer together than `min` pixels. Pointer events fire
 * far faster than a hand can move, and the duplicates make the quadratic
 * smoothing wobble.
 */
export function thin(points: Point[], min = 1.6): Point[] {
  if (points.length < 2) return points;
  const out: Point[] = [points[0]];
  for (const point of points.slice(1)) {
    const last = out[out.length - 1];
    if (Math.hypot(point.x - last.x, point.y - last.y) >= min) out.push(point);
  }
  if (out.length === 1) out.push(points[points.length - 1]);
  return out;
}

/**
 * Traces a stroke as a chain of quadratic curves through the midpoints of
 * consecutive samples, which is the cheap standard trick for smooth ink.
 */
export function tracePath(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  points: Point[],
): void {
  if (points.length === 0) return;

  ctx.beginPath();

  if (points.length < 3) {
    const [first] = points;
    const last = points[points.length - 1];
    ctx.moveTo(first.x, first.y);
    ctx.lineTo(last.x, last.y);
    ctx.stroke();
    return;
  }

  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length - 1; i += 1) {
    const midX = (points[i].x + points[i + 1].x) / 2;
    const midY = (points[i].y + points[i + 1].y) / 2;
    ctx.quadraticCurveTo(points[i].x, points[i].y, midX, midY);
  }
  const penultimate = points[points.length - 2];
  const last = points[points.length - 1];
  ctx.quadraticCurveTo(penultimate.x, penultimate.y, last.x, last.y);
  ctx.stroke();
}

export function drawStroke(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  stroke: Stroke,
  overrides?: { color?: string; width?: number },
): void {
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = overrides?.color ?? stroke.color;
  ctx.lineWidth = overrides?.width ?? stroke.width;
  tracePath(ctx, stroke.points);
  ctx.restore();
}

export function drawStrokes(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  strokes: Stroke[],
  overrides?: { color?: string; width?: number },
): void {
  for (const stroke of strokes) drawStroke(ctx, stroke, overrides);
}

/** Rasterizes strokes at a fixed pen width, independent of how they are drawn. */
export function strokesToMask(
  strokes: Stroke[],
  width: number,
  height: number,
  penWidth: number,
): Mask {
  const mask = createMask(width, height);
  if (strokes.length === 0) return mask;

  const ctx = createScratchContext(width, height);
  if (!ctx) return mask;

  ctx.clearRect(0, 0, width, height);
  drawStrokes(ctx, strokes, { color: "#fff", width: penWidth });

  const { data } = ctx.getImageData(0, 0, width, height);
  for (let i = 0, p = 3; i < mask.data.length; i += 1, p += 4) {
    mask.data[i] = data[p] > 96 ? 1 : 0;
  }
  return mask;
}

/** Single pen: dark ink on ivory paper, at the width used for scoring. */
export const INK_COLOR = "#2b2724";
export const PEN_WIDTH = 8;
