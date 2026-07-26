"use client";

import { useMemo, useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SoundButton } from "@/components/sound";
import { useSpeech } from "@/lib/speech";
import { cn } from "@/lib/utils";
import type { Vocab } from "@/lib/course/types";
import { seededShuffle } from "@/lib/course/generate";

export type MatchResult = { ka: string; firstTry: boolean };

type Side = "ka" | "en";
type Tile = { side: Side; ka: string; label: string };

/**
 * Pairing round: tap a Georgian word to hear it, then tap its meaning.
 * Solved pairs drop into a legend underneath, so the round doubles as a reading
 * list you can play back.
 *
 * Both columns live in one grid so a long meaning can never push its row out of
 * line with the Georgian word it belongs to.
 */
export function MatchBoard({
  items,
  seed,
  onComplete,
  className,
}: {
  items: Vocab[];
  seed: string;
  onComplete?: (results: MatchResult[]) => void;
  className?: string;
}) {
  const { speak } = useSpeech();

  const rows = useMemo(() => {
    const left: Tile[] = items.map((item) => ({
      side: "ka",
      ka: item.ka,
      label: item.ka,
    }));
    const right: Tile[] = items.map((item) => ({
      side: "en",
      ka: item.ka,
      label: item.en,
    }));
    const shuffledLeft = seededShuffle(left, `${seed}-ka`);
    const shuffledRight = seededShuffle(right, `${seed}-en`);
    return shuffledLeft.map((tile, index) => [tile, shuffledRight[index]]);
  }, [items, seed]);

  const [selected, setSelected] = useState<Tile | null>(null);
  const [wrong, setWrong] = useState<string | null>(null);
  const [solved, setSolved] = useState<MatchResult[]>([]);
  const [missed, setMissed] = useState<Set<string>>(new Set());

  const solvedKeys = new Set(solved.map((entry) => entry.ka));
  const byKa = useMemo(
    () => new Map(items.map((item) => [item.ka, item])),
    [items],
  );

  const choose = (tile: Tile) => {
    if (solvedKeys.has(tile.ka)) return;
    setWrong(null);

    const item = byKa.get(tile.ka);
    if (tile.side === "ka") speak(tile.ka, item?.latin);

    if (!selected || selected.side === tile.side) {
      setSelected(tile);
      return;
    }

    if (selected.ka === tile.ka) {
      // Say the Georgian word again on the pair that just clicked into place.
      speak(tile.ka, item?.latin);
      setSelected(null);
      const next = [...solved, { ka: tile.ka, firstTry: !missed.has(tile.ka) }];
      setSolved(next);
      if (next.length === items.length) onComplete?.(next);
      return;
    }

    // Wrong pairing: remember it so the pair no longer counts as a first try.
    setWrong(`${tile.side}:${tile.ka}`);
    setMissed((previous) => {
      const next = new Set(previous);
      next.add(selected.ka);
      next.add(tile.ka);
      return next;
    });
    setSelected(null);
  };

  const reset = () => {
    setSelected(null);
    setWrong(null);
    setSolved([]);
    setMissed(new Set());
  };

  const tileClass = (tile: Tile) => {
    const key = `${tile.side}:${tile.ka}`;
    const isSolved = solvedKeys.has(tile.ka);
    const isSelected = selected?.side === tile.side && selected?.ka === tile.ka;

    return cn(
      "tile flex min-h-16 items-center justify-center px-3 py-2 text-center break-words",
      isSolved && "tile-correct cursor-default",
      !isSolved && isSelected && "tile-selected",
      wrong === key && "tile-wrong",
    );
  };

  const done = solved.length === items.length;

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {done ? "Round complete." : "Tap a Georgian word to hear it, then tap its meaning."}
        </p>
        <span className="shrink-0 text-sm text-muted-foreground tabular-nums">
          {solved.length}/{items.length}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {rows.map(([left, right]) => (
          <div key={left.ka + right.ka} className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => choose(left)}
              disabled={solvedKeys.has(left.ka)}
              aria-pressed={selected?.side === "ka" && selected.ka === left.ka}
              className={tileClass(left)}
            >
              <span className="glyph text-lg leading-snug">{left.label}</span>
            </button>
            <button
              type="button"
              onClick={() => choose(right)}
              disabled={solvedKeys.has(right.ka)}
              aria-pressed={selected?.side === "en" && selected.ka === right.ka}
              className={tileClass(right)}
            >
              <span className="text-sm leading-snug">{right.label}</span>
            </button>
          </div>
        ))}
      </div>

      {solved.length > 0 ? (
        <>
          <Separator />
          <ul className="flex flex-col gap-3">
            {solved.map(({ ka, firstTry }) => {
              const item = byKa.get(ka);
              if (!item) return null;
              return (
                <li key={ka} className="flex items-start gap-3">
                  <Check
                    aria-hidden
                    className={cn(
                      "mt-1 size-4 shrink-0",
                      firstTry ? "text-success" : "text-warning",
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <span className="glyph text-base">{item.ka}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.latin}
                      </span>
                      <span className="text-sm">— {item.en}</span>
                    </p>
                    {item.note ? (
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                        {item.note}
                      </p>
                    ) : null}
                  </div>
                  <SoundButton text={item.ka} latin={item.latin} />
                </li>
              );
            })}
          </ul>
        </>
      ) : null}

      {done ? null : (
        <Button
          variant="ghost"
          size="sm"
          onClick={reset}
          disabled={solved.length === 0 && selected === null}
          className="self-start"
        >
          <RotateCcw className="size-4" /> Restart round
        </Button>
      )}
    </div>
  );
}
