export type Mask = {
  width: number;
  height: number;
  /** 1 where there is ink, 0 elsewhere. Row-major, length = width * height. */
  data: Uint8Array;
};

/** Y positions (in canvas pixels) of the four writing guide lines. */
export type Guides = {
  ascender: number;
  midline: number;
  baseline: number;
  descender: number;
};

export type BBox = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export type Point = { x: number; y: number };

export type Stroke = {
  points: Point[];
  color: string;
  width: number;
};

export function createMask(width: number, height: number): Mask {
  return { width, height, data: new Uint8Array(width * height) };
}

export function maskArea(mask: Mask): number {
  let area = 0;
  for (let i = 0; i < mask.data.length; i += 1) {
    if (mask.data[i]) area += 1;
  }
  return area;
}

export function maskBBox(mask: Mask): BBox | null {
  const { width, height, data } = mask;
  let left = width;
  let top = height;
  let right = -1;
  let bottom = -1;

  for (let y = 0; y < height; y += 1) {
    const row = y * width;
    for (let x = 0; x < width; x += 1) {
      if (!data[row + x]) continue;
      if (x < left) left = x;
      if (x > right) right = x;
      if (y < top) top = y;
      if (y > bottom) bottom = y;
    }
  }

  return right < 0 ? null : { left, top, right, bottom };
}

/**
 * Guide line placement, as fractions of canvas height. The x-height band
 * (midline to baseline) is the reference the glyph is scaled against, which
 * keeps ascenders and descenders landing where the lines promise they will.
 */
export const GUIDE_FRACTIONS = {
  ascender: 0.16,
  midline: 0.38,
  baseline: 0.68,
  descender: 0.9,
} as const;

export function guidesFor(height: number): Guides {
  return {
    ascender: Math.round(height * GUIDE_FRACTIONS.ascender),
    midline: Math.round(height * GUIDE_FRACTIONS.midline),
    baseline: Math.round(height * GUIDE_FRACTIONS.baseline),
    descender: Math.round(height * GUIDE_FRACTIONS.descender),
  };
}

export function xHeightOf(guides: Guides): number {
  return guides.baseline - guides.midline;
}
