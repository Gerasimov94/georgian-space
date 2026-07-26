import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LessonPlayer } from "@/components/course/lesson-player";
import { UNITS, getLesson } from "@/lib/data/units";

export function generateStaticParams() {
  return UNITS.flatMap((unit) =>
    unit.lessons.map((lesson) => ({ unitId: unit.id, lessonId: lesson.id })),
  );
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ unitId: string; lessonId: string }>;
}) {
  const { unitId, lessonId } = await params;
  const found = getLesson(unitId, lessonId);
  if (!found) notFound();

  const { unit, lesson, next } = found;

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-3xl px-4 pt-4">
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false} render={<Link href={`/course/${unit.id}`} />}
        >
          <ArrowLeft className="size-4" /> {unit.title}
        </Button>
      </div>

      <LessonPlayer
        unitId={unit.id}
        lesson={lesson}
        nextHref={next ? `/course/${unit.id}/${next.id}` : undefined}
      />
    </div>
  );
}
