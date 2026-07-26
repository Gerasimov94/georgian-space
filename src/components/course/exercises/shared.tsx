"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { SoundButton } from "@/components/sound";
import { useSpeech } from "@/lib/speech";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/lib/course/types";

export type ExerciseViewProps<K extends Exercise["kind"]> = {
  exercise: Extract<Exercise, { kind: K }>;
  onDone: (correct: boolean) => void;
};

export function Prompt({
  children,
  georgian,
  helper,
  speakText,
}: {
  children: React.ReactNode;
  georgian?: boolean;
  helper?: string;
  /** Georgian text to offer as audio next to the prompt. */
  speakText?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="flex items-center justify-center gap-2">
        <p
          className={cn(
            "max-w-xl break-words",
            georgian
              ? "glyph text-4xl leading-snug sm:text-5xl"
              : "font-heading text-2xl leading-snug",
          )}
        >
          {children}
        </p>
        {speakText ? (
          <SoundButton text={speakText} variant="secondary" size="icon" />
        ) : null}
      </div>
      {helper && (
        <p className="max-w-md text-xs text-muted-foreground">{helper}</p>
      )}
    </div>
  );
}

/** Shared answer grid for every "pick one of these" exercise. */
export function OptionGrid({
  options,
  answer,
  onDone,
  georgian,
  columns = 2,
}: {
  options: string[];
  answer: string;
  onDone: (correct: boolean) => void;
  georgian?: boolean;
  columns?: 1 | 2;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const { speak } = useSpeech();

  const choose = (option: string) => {
    if (picked !== null) return;
    // Georgian options are read aloud, so a choice is also a listening moment.
    if (georgian) speak(option);
    setPicked(option);
    onDone(option === answer);
  };

  return (
    <div
      className={cn(
        "grid w-full max-w-xl gap-2",
        columns === 2 ? "sm:grid-cols-2" : "",
      )}
    >
      {options.map((option) => {
        const isAnswer = option === answer;
        const isPicked = option === picked;
        const settled = picked !== null;

        return (
          <button
            key={option}
            type="button"
            onClick={() => choose(option)}
            disabled={settled}
            className={cn(
              "tile flex items-center justify-between gap-2 px-4 py-3 text-left",
              georgian ? "glyph text-xl" : "text-sm",
              settled && isAnswer && "tile-correct",
              settled && isPicked && !isAnswer && "tile-wrong",
              settled && !isAnswer && !isPicked && "opacity-55",
            )}
          >
            <span className="min-w-0 break-words">{option}</span>
            {settled && isAnswer && (
              <Check className="size-4 shrink-0 text-success" />
            )}
            {settled && isPicked && !isAnswer && (
              <X className="size-4 shrink-0 text-danger" />
            )}
          </button>
        );
      })}
    </div>
  );
}

/** Normalizes free text so punctuation and spacing do not fail an answer. */
export function normalizeAnswer(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[?!.,]/g, "")
    .replace(/\s+/g, " ");
}
