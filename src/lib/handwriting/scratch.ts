export type ScratchContext =
  | CanvasRenderingContext2D
  | OffscreenCanvasRenderingContext2D;

/**
 * An offscreen 2d context for rasterizing masks. OffscreenCanvas is used when
 * available and a detached <canvas> otherwise (older Safari).
 */
export function createScratchContext(
  width: number,
  height: number,
): ScratchContext | null {
  if (typeof OffscreenCanvas !== "undefined") {
    const context = new OffscreenCanvas(width, height).getContext("2d", {
      willReadFrequently: true,
    });
    if (context) return context;
  }

  if (typeof document === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas.getContext("2d", { willReadFrequently: true });
}
