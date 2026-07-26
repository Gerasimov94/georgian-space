"use client";

import { useMemo, useState } from "react";
import { seededShuffle } from "@/lib/course/generate";
import { useSpeech } from "@/lib/speech";
import { cn } from "@/lib/utils";
import type { ExerciseViewProps } from "./shared";

export function MatchPairsView({
  exercise,
  onDone,
}: ExerciseViewProps<"matchPairs">) {
  const lefts = useMemo(
    () => seededShuffle(exercise.pairs.map((pair) => pair.left), exercise.id),
    [exercise],
  );
  const rights = useMemo(
    () =>
      seededShuffle(
        exercise.pairs.map((pair) => pair.right),
        `${exercise.id}-right`,
      ),
    [exercise],
  );

  const { speak } = useSpeech();
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<string, string>>({});
  const [wrong, setWrong] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState(0);

  const select = (left: string) => {
    setSelectedLeft(left);
    speak(left);
  };

  const pick = (right: string) => {
    if (!selectedLeft) return;

    const expected = exercise.pairs.find(
      (pair) => pair.left === selectedLeft,
    )?.right;

    if (expected === right) {
      const next = { ...matched, [selectedLeft]: right };
      speak(selectedLeft);
      setMatched(next);
      setSelectedLeft(null);
      setWrong(null);
      if (Object.keys(next).length === exercise.pairs.length) {
        onDone(mistakes === 0);
      }
      return;
    }

    setWrong(right);
    setMistakes((count) => count + 1);
    setTimeout(() => setWrong(null), 500);
  };

  const isMatched = (value: string) =>
    value in matched || Object.values(matched).includes(value);

  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-5">
      <span className="label-caps">{exercise.prompt}</span>

      <div className="flex w-full flex-col gap-3">
        {lefts.map((left, index) => {
          const right = rights[index];
          return (
            <div key={left} className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={isMatched(left)}
                aria-pressed={selectedLeft === left}
                onClick={() => select(left)}
                className={cn(
                  "tile glyph flex min-h-14 items-center justify-center px-3 py-2 text-center text-lg break-words",
                  isMatched(left) && "tile-correct",
                  !isMatched(left) && selectedLeft === left && "tile-selected",
                )}
              >
                {left}
              </button>
              <button
                type="button"
                disabled={isMatched(right)}
                onClick={() => pick(right)}
                className={cn(
                  "tile flex min-h-14 items-center justify-center px-3 py-2 text-center text-sm break-words",
                  isMatched(right) && "tile-correct",
                  wrong === right && "tile-wrong",
                )}
              >
                {right}
              </button>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        {Object.keys(matched).length} / {exercise.pairs.length} matched
        {mistakes > 0 && ` · ${mistakes} miss${mistakes === 1 ? "" : "es"}`}
      </p>
    </div>
  );
}
