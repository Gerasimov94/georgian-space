"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SpeakableText } from "@/components/sound";
import { ScoreReadout } from "@/components/writing/score-readout";
import { WritingCanvas } from "@/components/writing/writing-canvas";
import { getLetter } from "@/lib/data/letters";
import { PASS_SCORE, type ScoreResult } from "@/lib/handwriting/score";
import { useProgress } from "@/lib/store/progress";
import type { ExerciseViewProps } from "./shared";

/** The handwriting canvas embedded in a lesson: pass the match to continue. */
export function WriteLetterView({
  exercise,
  onDone,
}: ExerciseViewProps<"writeLetter">) {
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [settled, setSettled] = useState(false);
  const record = useProgress((state) => state.recordLetterAttempt);
  const letter = getLetter(exercise.char);

  const handleResult = (next: ScoreResult) => {
    setResult(next);
    if (next.passed && !settled) {
      setSettled(true);
      record(exercise.char, next.score);
      onDone(true);
    }
  };

  const skip = () => {
    if (settled) return;
    setSettled(true);
    if (result) record(exercise.char, result.score);
    onDone(false);
  };

  return (
    <div className="grid w-full max-w-3xl gap-6 sm:grid-cols-[minmax(220px,280px)_1fr]">
      <WritingCanvas char={exercise.char} onResult={handleResult} />

      <div className="flex min-w-0 flex-col gap-4">
        <span className="label-caps">Write this letter</span>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <SpeakableText
            text={exercise.char}
            latin={letter?.latin}
            className="text-6xl leading-tight"
          />
          {letter && (
            <span className="text-sm text-muted-foreground">
              {letter.name} · {letter.latin} · {letter.soundsLike}
            </span>
          )}
        </div>
        {letter ? (
          <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <SpeakableText
              text={letter.example.ka}
              latin={letter.example.latin}
              className="text-base"
            />
            <span>
              {letter.example.latin} · {letter.example.en}
            </span>
          </p>
        ) : null}

        {exercise.helper && (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {exercise.helper}
          </p>
        )}

        <ScoreReadout result={result} />

        <p className="text-xs text-muted-foreground">
          A match of {PASS_SCORE} or more counts as correct.
        </p>

        {!settled && (
          <Button variant="ghost" size="sm" className="self-start" onClick={skip}>
            Skip this letter
          </Button>
        )}
      </div>
    </div>
  );
}
