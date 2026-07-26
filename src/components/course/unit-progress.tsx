"use client";

import { Progress } from "@/components/ui/progress";
import type { Unit } from "@/lib/course/types";
import { lessonKey, useProgress } from "@/lib/store/progress";

export function UnitProgress({ unit }: { unit: Unit }) {
  const lessons = useProgress((state) => state.lessons);

  const done = unit.lessons.filter(
    (lesson) => lessons[lessonKey(unit.id, lesson.id)],
  ).length;

  return (
    <div className="mt-1 flex items-center gap-3">
      <Progress
        value={(done / unit.lessons.length) * 100}
        className="max-w-40 flex-1"
      />
      <span className="text-xs text-muted-foreground tabular-nums">
        {done} / {unit.lessons.length} lessons
      </span>
    </div>
  );
}
