import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { UNITS } from "@/lib/data/units";
import { UnitProgress } from "@/components/course/unit-progress";

export const metadata = { title: "Course · Georgian Space" };

export default function CoursePage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8">
      <header className="max-w-2xl">
        <p className="label-caps">The course</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          From the alphabet to your first conversations
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {UNITS.length} units, each a handful of short lessons. Every word you
          meet is added to your review queue, and the letters are practised by
          hand.
        </p>
      </header>

      <ol className="flex flex-col gap-3">
        {UNITS.map((unit, index) => (
          <li key={unit.id}>
            <Link
              href={`/course/${unit.id}`}
              className="tile flex items-start gap-4 p-4"
            >
              <span className="font-heading flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm text-accent-foreground tabular-nums">
                {index + 1}
              </span>

              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <div className="flex flex-wrap items-baseline gap-2">
                  <h2 className="font-heading text-base font-medium">
                    {unit.title}
                  </h2>
                  {unit.ka ? (
                    <span className="glyph text-sm text-muted-foreground">
                      {unit.ka}
                    </span>
                  ) : null}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {unit.description}
                </p>
                <UnitProgress unit={unit} />
              </div>

              <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground" />
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
