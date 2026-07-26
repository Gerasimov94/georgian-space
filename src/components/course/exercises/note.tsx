"use client";

import { SpeakableText } from "@/components/sound";
import type { Exercise } from "@/lib/course/types";

/** Notes carry no answer; the player lets you continue past them directly. */
export function NoteView({
  exercise,
}: {
  exercise: Extract<Exercise, { kind: "note" }>;
}) {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <h2 className="font-heading text-xl font-medium">{exercise.title}</h2>
      <div className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
        {exercise.body.split("\n\n").map((paragraph) => (
          <p key={paragraph.slice(0, 24)} className="whitespace-pre-line">
            {paragraph}
          </p>
        ))}
      </div>

      {exercise.table && (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-secondary/70">
              <tr>
                {exercise.table.head.map((cell) => (
                  <th key={cell} className="px-3 py-2 text-left font-medium">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {exercise.table.rows.map((row) => (
                <tr key={row.join("|")} className="border-t">
                  {row.map((cell, column) => (
                    <td
                      key={`${cell}-${column}`}
                      className={
                        column === 0
                          ? "px-3 py-1.5 text-base"
                          : "px-3 py-1.5 text-muted-foreground"
                      }
                    >
                      {column === 0 ? (
                        <SpeakableText text={cell} className="text-base" />
                      ) : (
                        cell
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
