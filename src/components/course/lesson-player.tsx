"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, PartyPopper, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ExerciseView } from "@/components/course/exercises";
import { isGraded, type Exercise, type Lesson } from "@/lib/course/types";
import { useProgress, wordCardId } from "@/lib/store/progress";
import { cn } from "@/lib/utils";

/** The Georgian word an exercise practises, used to schedule its card. */
function exerciseWords(exercise: Exercise): string[] {
  switch (exercise.kind) {
    case "flashcard":
      return [exercise.item.ka];
    case "multipleChoice":
      return exercise.direction === "kaToEn"
        ? [exercise.prompt]
        : [exercise.answer];
    case "listenChoose":
      return [exercise.ka];
    case "typeAnswer":
      return [exercise.answer];
    case "fillGap":
      return [exercise.word];
    case "matchPairs":
      return exercise.pairs.map((pair) => pair.left);
    default:
      return [];
  }
}

export function LessonPlayer({
  unitId,
  lesson,
  nextHref,
}: {
  unitId: string;
  lesson: Lesson;
  nextHref?: string;
}) {
  const [step, setStep] = useState(0);
  const [outcome, setOutcome] = useState<boolean | null>(null);
  const [summary, setSummary] = useState<{
    correct: number;
    total: number;
  } | null>(null);
  const [attempt, setAttempt] = useState(0);

  const stepRef = useRef(0);
  const resultsRef = useRef<Record<string, boolean>>({});

  const completeLesson = useProgress((state) => state.completeLesson);
  const ensureCards = useProgress((state) => state.ensureCards);
  const gradeCard = useProgress((state) => state.gradeCard);

  const total = lesson.exercises.length;
  const exercise = lesson.exercises[step];

  const onDone = useCallback(
    (correct: boolean) => {
      const current = lesson.exercises[stepRef.current];
      if (!current) return;
      if (resultsRef.current[current.id] !== undefined) return;
      resultsRef.current[current.id] = correct;
      setOutcome(correct);
    },
    [lesson],
  );

  const commit = useCallback(() => {
    const graded = lesson.exercises.filter(isGraded);
    const correct = graded.filter(
      (item) => resultsRef.current[item.id] === true,
    ).length;

    // Roll every exercise touching a word up into one grade for that word.
    const perWord = new Map<string, { right: number; wrong: number }>();
    for (const item of lesson.exercises) {
      if (!isGraded(item)) continue;
      const wasCorrect = resultsRef.current[item.id] === true;
      for (const word of exerciseWords(item)) {
        const tally = perWord.get(word) ?? { right: 0, wrong: 0 };
        if (wasCorrect) tally.right += 1;
        else tally.wrong += 1;
        perWord.set(word, tally);
      }
    }

    const ids = [...perWord.keys()].map(wordCardId);
    if (ids.length > 0) ensureCards(ids);
    for (const [word, tally] of perWord) {
      const grade =
        tally.wrong === 0 ? "good" : tally.right > 0 ? "hard" : "again";
      gradeCard(wordCardId(word), grade);
    }

    completeLesson(unitId, lesson.id, correct, graded.length);
    setSummary({ correct, total: graded.length });
  }, [completeLesson, ensureCards, gradeCard, lesson, unitId]);

  const advance = () => {
    if (step + 1 >= total) {
      commit();
      return;
    }
    stepRef.current = step + 1;
    setStep(step + 1);
    setOutcome(null);
  };

  const restart = () => {
    resultsRef.current = {};
    stepRef.current = 0;
    setStep(0);
    setOutcome(null);
    setSummary(null);
    setAttempt((value) => value + 1);
  };

  if (summary) {
    const percent = summary.total
      ? Math.round((summary.correct / summary.total) * 100)
      : 100;

    return (
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-5 px-4 py-10 text-center">
        <PartyPopper className="size-9 text-primary" />
        <h1 className="text-2xl font-semibold tracking-tight">
          {lesson.title} complete
        </h1>
        <p className="font-heading text-5xl tabular-nums">{percent}%</p>
        <p className="text-sm text-muted-foreground">
          {summary.correct} of {summary.total} answers correct. Words you met are
          now in your review queue.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Button variant="outline" onClick={restart}>
            <RotateCcw className="size-4" /> Practise again
          </Button>
          <Button nativeButton={false} render={<Link href={nextHref ?? `/course/${unitId}`} />}>
            {nextHref ? "Next lesson" : "Back to unit"}
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    );
  }

  const graded = isGraded(exercise);
  // Notes have nothing to answer, so they never block the Continue button.
  const canContinue = outcome !== null || exercise.kind === "note";

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="label-caps truncate">{lesson.title}</span>
          <span className="tabular-nums">
            {step + 1} / {total}
          </span>
        </div>
        <Progress value={((step + (canContinue ? 1 : 0)) / total) * 100} />
      </div>

      <div className="flex flex-1 items-center justify-center py-4">
        <ExerciseView
          key={`${exercise.id}-${attempt}`}
          exercise={exercise}
          onDone={onDone}
        />
      </div>

      <div
        className={cn(
          "flex items-center gap-3 border-t pt-4",
          outcome === true && graded && "border-success-border",
          outcome === false && "border-danger-border",
        )}
      >
        {graded && outcome !== null && (
          <span
            className={cn(
              "flex items-center gap-1.5 text-sm",
              outcome ? "text-success" : "text-danger",
            )}
          >
            {outcome ? <Check className="size-4" /> : <X className="size-4" />}
            {outcome ? "Correct" : "Not quite"}
          </span>
        )}

        <Button
          className="ml-auto"
          size="lg"
          disabled={!canContinue}
          onClick={advance}
        >
          {step + 1 >= total ? "Finish" : "Continue"}
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
