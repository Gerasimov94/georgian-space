"use client";

import { useState } from "react";
import { SoundButton } from "@/components/sound";
import { useSpeech } from "@/lib/speech";
import { cn } from "@/lib/utils";
import { OptionGrid, type ExerciseViewProps } from "./shared";

/** The PDF's "fill in the missing letter" drill. */
export function FillGapView({ exercise, onDone }: ExerciseViewProps<"fillGap">) {
  const [filled, setFilled] = useState<string | null>(null);
  const { speak } = useSpeech();
  const letters = [...exercise.word];
  const answer = letters[exercise.index];

  const handle = (correct: boolean) => {
    setFilled(answer);
    speak(exercise.word);
    onDone(correct);
  };

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <span className="label-caps">Fill in the missing letter</span>

      <p className="glyph flex flex-wrap items-end justify-center gap-0.5 text-4xl leading-snug sm:text-5xl">
        {letters.map((letter, index) => (
          <span
            key={`${letter}-${index}`}
            className={cn(
              index === exercise.index &&
                "min-w-[1.2em] border-b-2 border-primary text-center",
              index === exercise.index && !filled && "text-muted-foreground/50",
              index === exercise.index && filled && "text-primary",
            )}
          >
            {index === exercise.index ? (filled ?? "·") : letter}
          </span>
        ))}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <p className="text-sm text-muted-foreground">{exercise.en}</p>
        <SoundButton text={exercise.word} label="Hear the word" />
      </div>

      <OptionGrid
        options={exercise.options}
        answer={answer}
        onDone={handle}
        georgian
      />
    </div>
  );
}
