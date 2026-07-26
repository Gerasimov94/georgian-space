import type { Mask } from "./types";

const ORTHOGONAL = 1;
const DIAGONAL = Math.SQRT2;
const FAR = 1e9;

/**
 * Two-pass chamfer distance transform: for every pixel, the approximate
 * distance to the nearest ink pixel of `mask`. Ink pixels get 0.
 *
 * The 8-neighbour approximation is within a few percent of the true Euclidean
 * distance, which is far below the tolerance band the scorer uses.
 */
export function distanceTransform(mask: Mask): Float32Array {
  const { width, height, data } = mask;
  const dist = new Float32Array(width * height);

  for (let i = 0; i < data.length; i += 1) {
    dist[i] = data[i] ? 0 : FAR;
  }

  // Forward pass: top-left to bottom-right.
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = y * width + x;
      let best = dist[i];
      if (best === 0) continue;

      if (y > 0) {
        best = Math.min(best, dist[i - width] + ORTHOGONAL);
        if (x > 0) best = Math.min(best, dist[i - width - 1] + DIAGONAL);
        if (x < width - 1) best = Math.min(best, dist[i - width + 1] + DIAGONAL);
      }
      if (x > 0) best = Math.min(best, dist[i - 1] + ORTHOGONAL);

      dist[i] = best;
    }
  }

  // Backward pass: bottom-right to top-left.
  for (let y = height - 1; y >= 0; y -= 1) {
    for (let x = width - 1; x >= 0; x -= 1) {
      const i = y * width + x;
      let best = dist[i];
      if (best === 0) continue;

      if (y < height - 1) {
        best = Math.min(best, dist[i + width] + ORTHOGONAL);
        if (x > 0) best = Math.min(best, dist[i + width - 1] + DIAGONAL);
        if (x < width - 1) best = Math.min(best, dist[i + width + 1] + DIAGONAL);
      }
      if (x < width - 1) best = Math.min(best, dist[i + 1] + ORTHOGONAL);

      dist[i] = best;
    }
  }

  return dist;
}
