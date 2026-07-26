"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GeorgianKeyboard } from "@/components/course/georgian-keyboard";
import { SoundButton } from "@/components/sound";
import { useSpeech } from "@/lib/speech";
import { cn } from "@/lib/utils";
import { normalizeAnswer, Prompt, type ExerciseViewProps } from "./shared";

export function TypeAnswerView({
  exercise,
  onDone,
}: ExerciseViewProps<"typeAnswer">) {
  const [value, setValue] = useState("");
  const [checked, setChecked] = useState<boolean | null>(null);
  const { speak } = useSpeech();

  const accepted = [exercise.answer, ...(exercise.alternatives ?? [])].map(
    normalizeAnswer,
  );

  const check = () => {
    const correct = accepted.includes(normalizeAnswer(value));
    setChecked(correct);
    // Right or wrong, you hear how the expected answer sounds.
    speak(exercise.answer);
    onDone(correct);
  };

  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-5">
      <span className="label-caps">Write it in Georgian</span>
      <Prompt helper={exercise.helper}>{exercise.prompt}</Prompt>

      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && checked === null && value.trim()) check();
        }}
        disabled={checked !== null}
        placeholder="…"
        className={cn(
          "glyph h-12 text-center text-xl",
          checked === true && "border-success-border bg-success-soft",
          checked === false && "border-danger-border bg-danger-soft",
        )}
      />

      {exercise.script === "georgian" && (
        <GeorgianKeyboard
          disabled={checked !== null}
          onInsert={(char) => setValue((current) => current + char)}
          onBackspace={() => setValue((current) => current.slice(0, -1))}
        />
      )}

      {checked === null ? (
        <Button onClick={check} disabled={!value.trim()}>
          Check
        </Button>
      ) : (
        <p
          className={cn(
            "flex flex-wrap items-center justify-center gap-2 text-center text-sm",
            checked ? "text-emerald-700" : "text-rose-700",
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
            <>
              Answer: <span className="glyph">{exercise.answer}</span>
            </>
          )}
          <SoundButton text={exercise.answer} label="Play again" />
        </p>
      )}
    </div>
  );
}
