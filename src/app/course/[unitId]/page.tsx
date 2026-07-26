import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LessonStatus } from "@/components/course/lesson-status";
import { SpeakableText } from "@/components/sound";
import { UNITS, getUnit } from "@/lib/data/units";

export function generateStaticParams() {
  return UNITS.map((unit) => ({ unitId: unit.id }));
}

export default async function UnitPage({
  params,
}: {
  params: Promise<{ unitId: string }>;
}) {
  const { unitId } = await params;
  const unit = getUnit(unitId);
  if (!unit) notFound();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8">
      <div>
        <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/course" />}>
          <ArrowLeft className="size-4" /> All units
        </Button>
      </div>

      <header>
        <div className="flex flex-wrap items-baseline gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">
            {unit.title}
          </h1>
          {unit.ka ? (
            <span className="glyph text-lg text-muted-foreground">
              {unit.ka}
            </span>
          ) : null}
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {unit.description}
        </p>
      </header>

      <ol className="flex flex-col gap-2">
        {unit.lessons.map((lesson, index) => (
          <li key={lesson.id}>
            <Link
              href={`/course/${unit.id}/${lesson.id}`}
              className="tile flex items-center gap-4 p-4"
            >
              <span className="font-heading flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm text-accent-foreground tabular-nums">
                {index + 1}
              </span>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="font-heading truncate font-medium">
                  {lesson.title}
                </span>
                <span className="text-xs text-muted-foreground">
                  {lesson.subtitle ? `${lesson.subtitle} · ` : ""}
                  {lesson.exercises.length} steps
                </span>
              </div>
              <LessonStatus unitId={unit.id} lessonId={lesson.id} />
            </Link>
          </li>
        ))}
      </ol>

      {unit.id !== "alphabet" && (
        <Card className="py-5">
          <CardHeader>
            <CardTitle>Words in this unit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-xs text-muted-foreground">
              Tap any Georgian word to hear it.
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {unit.vocab.map((item) => (
                <li
                  key={item.ka}
                  className="flex min-w-0 items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2"
                >
                  <SpeakableText
                    text={item.ka}
                    latin={item.latin}
                    className="shrink-0 text-base"
                  />
                  <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
                    {item.en}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {item.latin}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
