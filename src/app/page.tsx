"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Flame, Hash, Layers, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MasteryRing } from "@/components/mastery-ring";
import { SpeakableText } from "@/components/sound";
import { LETTER_COUNT } from "@/lib/data/letters";
import {
  UNITS,
  courseSequence,
  getLesson,
  totalLessons,
  totalWords,
} from "@/lib/data/units";
import { isDue } from "@/lib/srs/scheduler";
import { lessonKey, useHydrated, useProgress } from "@/lib/store/progress";

export default function HomePage() {
  const hydrated = useHydrated();
  const letters = useProgress((state) => state.letters);
  const lessons = useProgress((state) => state.lessons);
  const cards = useProgress((state) => state.cards);
  const streak = useProgress((state) => state.streak);

  const mastered = useMemo(
    () => Object.values(letters).filter((stat) => stat.best >= 75).length,
    [letters],
  );
  const due = useMemo(
    () => Object.values(cards).filter((card) => isDue(card)).length,
    [cards],
  );
  const doneLessons = Object.keys(lessons).length;

  /** The first lesson that has not been completed yet. */
  const nextStep = useMemo(() => {
    const sequence = courseSequence();
    const target =
      sequence.find(
        ({ unitId, lessonId }) => !lessons[lessonKey(unitId, lessonId)],
      ) ?? sequence[0];
    const found = getLesson(target.unitId, target.lessonId);
    return found ? { ...target, ...found } : null;
  }, [lessons]);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-10">
      <header className="max-w-2xl">
        <p className="label-caps">Georgian Space</p>
        <h1 className="mt-2">
          <SpeakableText
            text="გამარჯობა"
            latin="gamarjoba"
            className="text-4xl leading-tight text-primary hover:text-primary"
          />
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Learn Georgian by hand: {LETTER_COUNT} letters to write,{" "}
          {totalWords()} words to collect and {totalLessons()} lessons across{" "}
          {UNITS.length} units.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-[1.5fr_1fr]">
        <Card className="bg-accent/25 py-5 ring-primary/25">
          <CardHeader>
            <CardTitle>
              {doneLessons === 0 ? "Start here" : "Continue where you left off"}
            </CardTitle>
            {nextStep ? (
              <CardDescription className="truncate">
                {nextStep.unit.title}
                {nextStep.lesson.subtitle
                  ? ` · ${nextStep.lesson.subtitle}`
                  : ""}
              </CardDescription>
            ) : null}
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-4">
            {nextStep ? (
              <>
                <p className="font-heading text-xl leading-snug">
                  {nextStep.lesson.title}
                </p>
                <Button
                  className="self-start"
                  nativeButton={false}
                  render={
                    <Link
                      href={`/course/${nextStep.unitId}/${nextStep.lessonId}`}
                    />
                  }
                >
                  {doneLessons === 0 ? "Start learning" : "Continue"}
                  <ArrowRight className="size-4" />
                </Button>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Every lesson is done. Keep the words alive in the review queue.
              </p>
            )}

            <Separator className="mt-auto" />

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" nativeButton={false} render={<Link href="/write" />}>
                <PenLine className="size-4" /> Handwriting
              </Button>
              <Button
                variant="outline"
                size="sm"
                nativeButton={false} render={<Link href="/practice" />}
              >
                <Layers className="size-4" /> Practice
                {due > 0 ? ` (${due})` : ""}
              </Button>
              <Button
                variant="outline"
                size="sm"
                nativeButton={false} render={<Link href="/numbers" />}
              >
                <Hash className="size-4" /> Numbers
              </Button>
              <Button
                variant="outline"
                size="sm"
                nativeButton={false} render={<Link href="/alphabet" />}
              >
                <BookOpen className="size-4" /> Alphabet
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="py-5">
          <CardHeader>
            <CardTitle>Letters mastered</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <MasteryRing value={mastered} total={LETTER_COUNT} />
            <p className="text-center text-xs leading-relaxed text-muted-foreground">
              A letter counts as mastered once a drawing of it matches the
              reference glyph by 75 or more.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat
          icon={<Flame className="size-4" />}
          label="Day streak"
          value={hydrated ? streak.current : 0}
          hint={`longest ${hydrated ? streak.longest : 0}`}
        />
        <Stat
          icon={<Layers className="size-4" />}
          label="Cards due"
          value={hydrated ? due : 0}
          hint={`${Object.keys(cards).length} in the queue`}
        />
        <Stat
          icon={<BookOpen className="size-4" />}
          label="Lessons done"
          value={hydrated ? doneLessons : 0}
          hint={`of ${totalLessons()}`}
        />
      </div>

      <Card className="py-5">
        <CardHeader>
          <CardTitle>Units</CardTitle>
          <CardDescription>
            Nine units, from the alphabet to verbs and colours.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {UNITS.map((unit, index) => (
              <li key={unit.id}>
                <Link
                  href={`/course/${unit.id}`}
                  className="tile flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
                >
                  <span className="w-4 shrink-0 text-xs text-muted-foreground tabular-nums">
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{unit.title}</span>
                  {unit.ka ? (
                    <span className="glyph shrink-0 text-xs text-muted-foreground">
                      {unit.ka}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  hint: string;
}) {
  return (
    <Card className="py-4">
      <CardContent className="flex flex-col gap-1">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {icon}
          {label}
        </span>
        <span className="font-heading text-3xl leading-none tabular-nums">
          {value}
        </span>
        <span className="text-xs text-muted-foreground">{hint}</span>
      </CardContent>
    </Card>
  );
}
