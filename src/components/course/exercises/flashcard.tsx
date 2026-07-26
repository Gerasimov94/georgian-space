"use client";

import { useState } from "react";
import { SoundButton } from "@/components/sound";
import { useSpeech } from "@/lib/speech";
import type { ExerciseViewProps } from "./shared";

export function FlashcardView({
  exercise,
  onDone,
}: ExerciseViewProps<"flashcard">) {
  const [revealed, setRevealed] = useState(false);
  const { speak } = useSpeech();

  // A new word should be heard, not just read, so revealing it plays it too.
  const reveal = () => {
    setRevealed(true);
    speak(exercise.item.ka, exercise.item.latin);
    onDone(true);
  };

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-5">
      <span className="label-caps">New word</span>

      <button
        type="button"
        onClick={reveal}
        className="tile flex min-h-44 w-full flex-col items-center justify-center gap-3 p-6 text-center"
      >
        <span className="glyph text-4xl leading-snug break-words">
          {exercise.item.ka}
        </span>
        <span className="label-caps">{exercise.item.latin}</span>
        {revealed ? (
          <span className="font-heading text-lg">{exercise.item.en}</span>
        ) : (
          <span className="text-xs text-muted-foreground">
            tap to hear it and see the meaning
          </span>
        )}
      </button>

      {revealed && exercise.item.note && (
        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          {exercise.item.note}
        </p>
      )}

      <SoundButton
        text={exercise.item.ka}
        latin={exercise.item.latin}
        variant="outline"
        size="sm"
        showLabel
      />
    </div>
  );
}
