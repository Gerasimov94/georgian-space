"use client";

import type { Exercise } from "@/lib/course/types";
import { FillGapView } from "./fill-gap";
import { FlashcardView } from "./flashcard";
import { ListenChooseView } from "./listen-choose";
import { MatchPairsView } from "./match-pairs";
import { MultipleChoiceView } from "./multiple-choice";
import { NoteView } from "./note";
import { TypeAnswerView } from "./type-answer";
import { UnscrambleView } from "./unscramble";
import { WriteLetterView } from "./write-letter";

export function ExerciseView({
  exercise,
  onDone,
}: {
  exercise: Exercise;
  onDone: (correct: boolean) => void;
}) {
  switch (exercise.kind) {
    case "note":
      return <NoteView exercise={exercise} />;
    case "flashcard":
      return <FlashcardView exercise={exercise} onDone={onDone} />;
    case "multipleChoice":
      return <MultipleChoiceView exercise={exercise} onDone={onDone} />;
    case "listenChoose":
      return <ListenChooseView exercise={exercise} onDone={onDone} />;
    case "fillGap":
      return <FillGapView exercise={exercise} onDone={onDone} />;
    case "matchPairs":
      return <MatchPairsView exercise={exercise} onDone={onDone} />;
    case "unscramble":
      return <UnscrambleView exercise={exercise} onDone={onDone} />;
    case "typeAnswer":
      return <TypeAnswerView exercise={exercise} onDone={onDone} />;
    case "writeLetter":
      return <WriteLetterView exercise={exercise} onDone={onDone} />;
  }
}
