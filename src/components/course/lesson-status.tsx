"use client";

import { CircleCheck } from "lucide-react";
import { lessonKey, useProgress } from "@/lib/store/progress";

export function LessonStatus({
  unitId,
  lessonId,
}: {
  unitId: string;
  lessonId: string;
}) {
  const result = useProgress(
    (state) => state.lessons[lessonKey(unitId, lessonId)],
  );

  if (!result) {
    return <span className="text-xs text-muted-foreground">not started</span>;
  }

  const percent = result.total
    ? Math.round((result.correct / result.total) * 100)
    : 100;

  return (
    <span className="flex shrink-0 items-center gap-1.5 text-xs text-success tabular-nums">
      <CircleCheck className="size-4" />
      {percent}%
    </span>
  );
}
