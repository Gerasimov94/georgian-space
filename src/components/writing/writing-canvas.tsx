"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Eraser, Eye, EyeOff, Layers2, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  drawDiff,
  drawGuides,
  fontsReady,
  georgianFontFamily,
  rasterizeGlyph,
  type GlyphRaster,
} from "@/lib/handwriting/raster";
import { scoreDrawing, type ScoreResult } from "@/lib/handwriting/score";
import {
  drawStrokes,
  INK_COLOR,
  PEN_WIDTH,
  strokesToMask,
  thin,
} from "@/lib/handwriting/strokes";
import { guidesFor, type Point, type Stroke } from "@/lib/handwriting/types";

/** Logical drawing size; the element scales to its container. */
const WIDTH = 340;
const HEIGHT = 440;
const GUIDES = guidesFor(HEIGHT);

export type WritingCanvasProps = {
  char: string;
  onResult?: (result: ScoreResult) => void;
  className?: string;
};

/**
 * Give this a `key` that changes with the letter: the canvas keeps its ink in
 * refs, so remounting is how a fresh sheet of paper is requested.
 */
export function WritingCanvas({
  char,
  onResult,
  className,
}: WritingCanvasProps) {
  const guideRef = useRef<HTMLCanvasElement>(null);
  const inkRef = useRef<HTMLCanvasElement>(null);
  const diffRef = useRef<HTMLCanvasElement>(null);

  const strokesRef = useRef<Stroke[]>([]);
  const activeRef = useRef<Stroke | null>(null);

  const [raster, setRaster] = useState<GlyphRaster | null>(null);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [strokeCount, setStrokeCount] = useState(0);
  const [drawing, setDrawing] = useState(false);
  const [ghost, setGhost] = useState(true);
  const [showDiff, setShowDiff] = useState(false);

  const dpr = useMemo(
    () =>
      typeof window === "undefined"
        ? 1
        : Math.min(2, window.devicePixelRatio || 1),
    [],
  );

  const context = useCallback(
    (ref: React.RefObject<HTMLCanvasElement | null>) => {
      const canvas = ref.current;
      if (!canvas) return null;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return ctx;
    },
    [dpr],
  );

  const paintGuides = useCallback(() => {
    const ctx = context(guideRef);
    if (!ctx) return;

    drawGuides(ctx, WIDTH, HEIGHT, GUIDES);

    if (ghost && raster) {
      ctx.save();
      ctx.globalAlpha = 0.13;
      ctx.fillStyle = INK_COLOR;
      ctx.font = `${raster.fontSize}px ${georgianFontFamily()}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      ctx.fillText(char, WIDTH / 2, GUIDES.baseline);
      ctx.restore();
    }
  }, [char, context, ghost, raster]);

  const paintInk = useCallback(() => {
    const ctx = context(inkRef);
    if (!ctx) return;
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    drawStrokes(ctx, strokesRef.current);
    if (activeRef.current) drawStrokes(ctx, [activeRef.current]);
  }, [context]);

  const paintDiff = useCallback(
    (next: ScoreResult | null) => {
      const ctx = context(diffRef);
      if (!ctx) return;
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      if (next && showDiff) drawDiff(ctx, next.diff, WIDTH, HEIGHT);
    },
    [context, showDiff],
  );

  // Rasterize the reference glyph once the webfont is available.
  useEffect(() => {
    let cancelled = false;
    void fontsReady().then(() => {
      if (cancelled) return;
      setRaster(rasterizeGlyph(char, WIDTH, HEIGHT, GUIDES));
    });
    return () => {
      cancelled = true;
    };
  }, [char]);

  useEffect(() => {
    paintGuides();
  }, [paintGuides]);

  useEffect(() => {
    paintInk();
  }, [paintInk, strokeCount]);

  useEffect(() => {
    paintDiff(result);
  }, [paintDiff, result]);

  const clear = useCallback(() => {
    strokesRef.current = [];
    activeRef.current = null;
    setStrokeCount(0);
    setResult(null);
  }, []);

  const evaluate = useCallback(() => {
    if (!raster || strokesRef.current.length === 0) return;

    const user = strokesToMask(strokesRef.current, WIDTH, HEIGHT, PEN_WIDTH);
    const next = scoreDrawing({
      target: raster.mask,
      user,
      guides: GUIDES,
      zone: raster.zone,
    });
    setResult(next);
    onResult?.(next);
  }, [onResult, raster]);

  const toLogical = (event: React.PointerEvent<HTMLCanvasElement>): Point => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * WIDTH,
      y: ((event.clientY - rect.top) / rect.height) * HEIGHT,
    };
  };

  const onPointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    activeRef.current = {
      points: [toLogical(event)],
      color: INK_COLOR,
      width: PEN_WIDTH,
    };
    setDrawing(true);
    paintInk();
  };

  const onPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!activeRef.current) return;
    activeRef.current.points.push(toLogical(event));
    paintInk();
  };

  const onPointerUp = () => {
    const stroke = activeRef.current;
    activeRef.current = null;
    setDrawing(false);
    if (!stroke) return;

    const points = thin(stroke.points);
    if (points.length > 1 || stroke.points.length === 1) {
      strokesRef.current = [...strokesRef.current, { ...stroke, points }];
      setStrokeCount(strokesRef.current.length);
    }
    paintInk();
    evaluate();
  };

  const undo = () => {
    strokesRef.current = strokesRef.current.slice(0, -1);
    setStrokeCount(strokesRef.current.length);
    if (strokesRef.current.length === 0) {
      setResult(null);
      paintDiff(null);
    } else {
      evaluate();
    }
  };

  const canvasProps = {
    width: WIDTH * dpr,
    height: HEIGHT * dpr,
    className: "absolute inset-0 h-full w-full",
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div
        className="drawing-surface relative w-full overflow-hidden rounded-xl border bg-card shadow-xs"
        style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}
      >
        <canvas ref={guideRef} {...canvasProps} />
        <canvas ref={inkRef} {...canvasProps} />
        <canvas ref={diffRef} {...canvasProps} />
        <canvas
          {...canvasProps}
          className="absolute inset-0 h-full w-full cursor-crosshair touch-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerLeave={onPointerUp}
        />
        {strokeCount === 0 && !drawing ? (
          <p className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-xs text-muted-foreground">
            Trace the faint letter, then lift your pen to be scored
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={clear}>
            <Eraser className="size-4" /> Clear
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={undo}
            disabled={strokeCount === 0}
          >
            <Undo2 className="size-4" /> Undo
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant={ghost ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setGhost((value) => !value)}
                >
                  {ghost ? (
                    <Eye className="size-4" />
                  ) : (
                    <EyeOff className="size-4" />
                  )}
                  Guide
                </Button>
              }
            />
            <TooltipContent>Show or hide the letter to trace</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant={showDiff ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setShowDiff((value) => !value)}
                  disabled={!result}
                >
                  <Layers2 className="size-4" /> Overlay
                </Button>
              }
            />
            <TooltipContent>
              Red = missed, amber = outside the letter
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

export {
  HEIGHT as CANVAS_HEIGHT,
  WIDTH as CANVAS_WIDTH,
  GUIDES as CANVAS_GUIDES,
};
