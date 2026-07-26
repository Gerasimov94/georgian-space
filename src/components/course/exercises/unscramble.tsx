"use client";

import { useMemo, useState } from "react";
import { Check, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SoundButton } from "@/components/sound";
import { seededShuffle } from "@/lib/course/generate";
import { useSpeech } from "@/lib/speech";
import { cn } from "@/lib/utils";
import type { ExerciseViewProps } from "./shared";

export function UnscrambleView({
  exercise,
  onDone,
}: ExerciseViewProps<"unscramble">) {
  const pool = useMemo(
    () => seededShuffle(exercise.words, exercise.id),
    [exercise],
  );

  const [picked, setPicked] = useState<number[]>([]);
  const [checked, setChecked] = useState<boolean | null>(null);
  const { speak } = useSpeech();

  const remaining = pool.map((_, index) => index).filter((i) => !picked.includes(i));
  const sentence = picked.map((index) => pool[index]);

  const add = (index: number) => {
    setPicked((current) => [...current, index]);
    speak(pool[index]);
  };

  const check = () => {
    const correct = sentence.join(" ") === exercise.words.join(" ");
    setChecked(correct);
    // Hearing the full sentence is the reward for getting the order right.
    speak(exercise.words.join(" "));
    onDone(correct);
  };

  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-6">
      <span className="label-caps">Put the words in order</span>
      <p className="text-center text-sm text-muted-foreground">{exercise.en}</p>

      <div
        className={cn(
          "flex min-h-16 w-full flex-wrap items-center gap-2 rounded-xl border border-dashed bg-card p-3",
          checked === true && "border-success-border bg-success-soft",
          checked === false && "border-danger-border bg-danger-soft",
        )}
      >
        {sentence.length === 0 && (
          <span className="text-xs text-muted-foreground">
            tap the words below
          </span>
        )}
        {picked.map((index, position) => (
          <button
            key={`${index}-${position}`}
            type="button"
            disabled={checked !== null}
            onClick={() =>
              setPicked((current) => current.filter((_, i) => i !== position))
            }
            className="tile tile-selected glyph rounded-lg px-2.5 py-1.5 text-lg leading-snug"
          >
            {pool[index]}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {remaining.map((index) => (
          <button
            key={index}
            type="button"
            disabled={checked !== null}
            onClick={() => add(index)}
            className="tile glyph rounded-lg px-2.5 py-1.5 text-lg leading-snug"
          >
            {pool[index]}
          </button>
        ))}
      </div>

      {checked === null ? (
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => setPicked([])} disabled={picked.length === 0}>
            <RotateCcw className="size-4" /> Reset
          </Button>
          <Button onClick={check} disabled={remaining.length > 0}>
            Check
          </Button>
        </div>
      ) : (
        <p
          className={cn(
            "flex flex-wrap items-center justify-center gap-2 text-center text-sm",
            checked ? "text-success" : "text-danger",
          )}
        >
          {checked ? (
            <Check className="size-4 shrink-0" />
          ) : (
            <X className="size-4 shrink-0" />
          )}
          {checked ? (
            "Correct"
          ) : (
            <span className="glyph">{exercise.words.join(" ")}</span>
          )}
          <SoundButton text={exercise.words.join(" ")} label="Play again" />
        </p>
      )}
    </div>
  );
}
