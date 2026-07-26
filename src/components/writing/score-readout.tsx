"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ScoreResult, Verdict } from "@/lib/handwriting/score";

const VERDICTS: Record<
  Verdict,
  { label: string; text: string; bar: string; badge: string }
> = {
  excellent: {
    label: "Excellent",
    text: "text-success",
    bar: "bg-success",
    badge: "border-success-border bg-success-soft text-success",
  },
  good: {
    label: "Good",
    text: "text-primary",
    bar: "bg-primary",
    badge: "border-primary/30 bg-accent text-accent-foreground",
  },
  close: {
    label: "Almost",
    text: "text-warning",
    bar: "bg-warning",
    badge: "border-warning-border bg-warning-soft text-warning",
  },
  again: {
    label: "Try again",
    text: "text-danger",
    bar: "bg-danger",
    badge: "border-danger-border bg-danger-soft text-danger",
  },
};

function Meter({
  label,
  value,
  bar,
}: {
  label: string;
  value: number;
  bar: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-16 shrink-0 text-xs text-muted-foreground">
        {label}
      </span>
      <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-[width] duration-300", bar)}
          style={{ width: `${Math.round(value * 100)}%` }}
        />
      </div>
      <span className="w-10 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
        {Math.round(value * 100)}%
      </span>
    </div>
  );
}

export function ScoreReadout({
  result,
  className,
}: {
  result: ScoreResult | null;
  className?: string;
}) {
  if (!result) {
    return (
      <div className={cn("flex flex-col gap-3", className)}>
        <div className="flex items-baseline gap-2">
          <span className="font-heading text-3xl leading-none text-muted-foreground/50 tabular-nums">
            —
          </span>
          <span className="text-xs text-muted-foreground">/ 100</span>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Each time you lift the pen, your ink is compared with the reference
          glyph: how much of the letter you covered, how close your lines are and
          whether the letter sits between the right guide lines.
        </p>
      </div>
    );
  }

  const verdict = VERDICTS[result.verdict];

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-baseline gap-2">
        <span
          className={cn(
            "font-heading text-3xl leading-none tabular-nums",
            verdict.text,
          )}
        >
          {result.score}
        </span>
        <span className="text-xs text-muted-foreground">/ 100</span>
        <Badge variant="outline" className={cn("ml-auto", verdict.badge)}>
          {verdict.label}
        </Badge>
      </div>

      <div className="flex flex-col gap-2">
        <Meter label="Shape" value={result.coverage} bar={verdict.bar} />
        <Meter label="Accuracy" value={result.precision} bar={verdict.bar} />
      </div>

      {result.hints.length > 0 && (
        <ul className="flex flex-col gap-1.5 text-sm text-muted-foreground">
          {result.hints.map((hint) => (
            <li key={hint} className="flex gap-2">
              <span aria-hidden className="text-primary">
                •
              </span>
              <span className="min-w-0 leading-snug">{hint}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
