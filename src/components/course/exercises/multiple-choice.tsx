"use client";

import { OptionGrid, Prompt, type ExerciseViewProps } from "./shared";

export function MultipleChoiceView({
  exercise,
  onDone,
}: ExerciseViewProps<"multipleChoice">) {
  const promptIsGeorgian = exercise.direction === "kaToEn";

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <span className="label-caps">
        {promptIsGeorgian
          ? "What does this mean?"
          : exercise.direction === "enToKa"
            ? "Say it in Georgian"
            : "Which letter is it?"}
      </span>

      <Prompt
        georgian={promptIsGeorgian}
        helper={exercise.helper}
        speakText={promptIsGeorgian ? exercise.prompt : undefined}
      >
        {exercise.prompt}
      </Prompt>

      <OptionGrid
        options={exercise.options}
        answer={exercise.answer}
        onDone={onDone}
        georgian={!promptIsGeorgian}
      />
    </div>
  );
}
