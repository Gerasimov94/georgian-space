import type { LetterZone } from "@/lib/data/letters";
import { createScratchContext } from "./scratch";
import { createMask, xHeightOf, type Guides, type Mask } from "./types";

/** Reference size used to measure the font's proportions once. */
const PROBE_SIZE = 200;
/** ა has neither ascender nor descender, so its height is the x-height. */
const X_HEIGHT_REFERENCE = "ა";

let cachedFamily: string | null = null;
let cachedXHeightRatio: number | null = null;

/**
 * next/font generates a hashed family name, so we read it back from an element
 * that already uses the `.font-georgian` class instead of hard-coding it.
 */
export function georgianFontFamily(): string {
  if (cachedFamily) return cachedFamily;
  if (typeof document === "undefined") return "sans-serif";

  const probe = document.createElement("span");
  probe.className = "font-georgian";
  probe.style.position = "absolute";
  probe.style.visibility = "hidden";
  probe.textContent = X_HEIGHT_REFERENCE;
  document.body.append(probe);
  const family = getComputedStyle(probe).fontFamily;
  probe.remove();

  cachedFamily = family || "sans-serif";
  return cachedFamily;
}

export async function fontsReady(): Promise<void> {
  if (typeof document === "undefined") return;
  try {
    await document.fonts.ready;
  } catch {
    // Font loading API is unavailable; the fallback family will be measured.
  }
}

const context = createScratchContext;

/** How tall the x-height band is, per unit of font size, in this font. */
function xHeightRatio(): number {
  if (cachedXHeightRatio) return cachedXHeightRatio;

  const ctx = context(PROBE_SIZE * 2, PROBE_SIZE * 2);
  if (!ctx) return 0.52;

  ctx.font = `${PROBE_SIZE}px ${georgianFontFamily()}`;
  const metrics = ctx.measureText(X_HEIGHT_REFERENCE);
  const ratio =
    (metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) /
    PROBE_SIZE;

  cachedXHeightRatio = ratio > 0.1 ? ratio : 0.52;
  return cachedXHeightRatio;
}

export function fontSizeForGuides(guides: Guides): number {
  return xHeightOf(guides) / xHeightRatio();
}

export type GlyphRaster = {
  mask: Mask;
  zone: LetterZone;
  fontSize: number;
  /** How far the glyph extends above the baseline, in pixels. */
  ascent: number;
  /** How far the glyph extends below the baseline, in pixels. */
  descent: number;
};

/**
 * Renders a glyph sitting on the baseline of the guide lines and returns it as a
 * binary mask. The vertical extent is measured from the font itself, so the
 * four-line classification can never disagree with what is actually drawn.
 */
export function rasterizeGlyph(
  char: string,
  width: number,
  height: number,
  guides: Guides,
): GlyphRaster {
  const fontSize = fontSizeForGuides(guides);
  const empty: GlyphRaster = {
    mask: createMask(width, height),
    zone: "midline",
    fontSize,
    ascent: 0,
    descent: 0,
  };

  const ctx = context(width, height);
  if (!ctx) return empty;

  ctx.clearRect(0, 0, width, height);
  ctx.font = `${fontSize}px ${georgianFontFamily()}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#fff";
  ctx.fillText(char, width / 2, guides.baseline);

  const metrics = ctx.measureText(char);
  const ascent = metrics.actualBoundingBoxAscent;
  const descent = metrics.actualBoundingBoxDescent;

  const mask = createMask(width, height);
  const { data } = ctx.getImageData(0, 0, width, height);
  for (let i = 0, p = 3; i < mask.data.length; i += 1, p += 4) {
    mask.data[i] = data[p] > 128 ? 1 : 0;
  }

  return {
    mask,
    zone: classifyZone(ascent, descent, guides),
    fontSize,
    ascent,
    descent,
  };
}

export function classifyZone(
  ascent: number,
  descent: number,
  guides: Guides,
): LetterZone {
  const xHeight = xHeightOf(guides);
  const hasAscender = ascent > xHeight * 1.14;
  const hasDescender = descent > xHeight * 0.12;

  if (hasAscender && hasDescender) return "full";
  if (hasAscender) return "ascender";
  if (hasDescender) return "descender";
  return "midline";
}

/** Cheap, cached zone lookup for UI that only needs the classification. */
const zoneCache = new Map<string, LetterZone>();

export function zoneOf(char: string, guides: Guides): LetterZone {
  const key = `${char}:${guides.midline}:${guides.baseline}`;
  const cached = zoneCache.get(key);
  if (cached) return cached;

  const ctx = context(8, 8);
  if (!ctx) return "midline";

  ctx.font = `${fontSizeForGuides(guides)}px ${georgianFontFamily()}`;
  const metrics = ctx.measureText(char);
  const zone = classifyZone(
    metrics.actualBoundingBoxAscent,
    metrics.actualBoundingBoxDescent,
    guides,
  );
  zoneCache.set(key, zone);
  return zone;
}

export function drawGuides(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  guides: Guides,
): void {
  ctx.save();
  ctx.clearRect(0, 0, width, height);

  // Faint vertical grid, like ruled paper.
  ctx.strokeStyle = "rgba(28, 25, 23, 0.045)";
  ctx.lineWidth = 1;
  const columns = 5;
  for (let i = 1; i < columns; i += 1) {
    const x = Math.round((width / columns) * i) + 0.5;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // The x-height band is drawn in the accent colour; the outer limits are
  // dashed and grey, matching how the four lines are described in the UI.
  const line = (y: number, color: string, dashed = false) => {
    ctx.beginPath();
    ctx.setLineDash(dashed ? [5, 7] : []);
    ctx.strokeStyle = color;
    ctx.moveTo(0, Math.round(y) + 0.5);
    ctx.lineTo(width, Math.round(y) + 0.5);
    ctx.stroke();
  };

  const limit = "rgba(28, 25, 23, 0.16)";
  line(guides.ascender, limit, true);
  line(guides.midline, "rgba(20, 96, 106, 0.3)");
  line(guides.baseline, "rgba(20, 96, 106, 0.55)");
  line(guides.descender, limit, true);

  ctx.restore();
}

/**
 * Paints the scoring overlay: what was missed and what strayed.
 *
 * The pixels are composed on a scratch canvas at logical size and then blitted,
 * because putImageData ignores the device-pixel-ratio transform.
 */
export function drawDiff(
  ctx: CanvasRenderingContext2D,
  diff: Uint8Array,
  width: number,
  height: number,
): void {
  const scratch = context(width, height);
  if (!scratch) return;

  const image = scratch.createImageData(width, height);
  for (let i = 0, p = 0; i < diff.length; i += 1, p += 4) {
    switch (diff[i]) {
      case 2: // missed part of the target glyph
        image.data[p] = 190;
        image.data[p + 1] = 60;
        image.data[p + 2] = 72;
        image.data[p + 3] = 130;
        break;
      case 3: // ink outside the glyph
        image.data[p] = 202;
        image.data[p + 1] = 138;
        image.data[p + 2] = 4;
        image.data[p + 3] = 150;
        break;
      case 1: // matched
        image.data[p] = 22;
        image.data[p + 1] = 128;
        image.data[p + 2] = 96;
        image.data[p + 3] = 70;
        break;
      default:
        image.data[p + 3] = 0;
    }
  }

  scratch.putImageData(image, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(scratch.canvas as CanvasImageSource, 0, 0, width, height);
}
