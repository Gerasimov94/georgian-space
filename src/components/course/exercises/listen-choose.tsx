"use client";

import { useEffect } from "react";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSpeech } from "@/lib/speech";
import { OptionGrid, type ExerciseViewProps } from "./shared";

/**
 * The word is played on arrival and can be replayed. Without any voice at all
 * the word is shown instead, so the lesson still works in a silent browser.
 */
export function ListenChooseView({
  exercise,
  onDone,
}: ExerciseViewProps<"listenChoose">) {
  const { enabled, native, speak } = useSpeech();

  useEffect(() => {
    if (enabled) speak(exercise.ka);
  }, [enabled, exercise.ka, speak]);

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <span className="label-caps">
        {enabled ? "Listen and choose" : "Read and choose"}
      </span>

      {enabled ? (
        <Button size="lg" variant="secondary" onClick={() => speak(exercise.ka)}>
          <Volume2 className="size-5" /> Play again
        </Button>
      ) : (
        <p className="glyph text-4xl leading-snug">{exercise.ka}</p>
      )}

      {enabled && !native ? (
        <p className="max-w-sm text-center text-xs text-muted-foreground">
          No Georgian voice on this system, so the romanization is being read
          out. Install a ka-GE voice for the real thing.
        </p>
      ) : null}

      <OptionGrid
        options={exercise.options}
        answer={exercise.answer}
        onDone={onDone}
      />
    </div>
  );
}
