"use client";

import { Check } from "lucide-react";
import { LETTERS } from "@/lib/data/letters";
import { useProgress } from "@/lib/store/progress";
import { cn } from "@/lib/utils";

export function LetterRail({
  activeIndex,
  onSelect,
  className,
}: {
  activeIndex: number;
  onSelect: (index: number) => void;
  className?: string;
}) {
  const letters = useProgress((state) => state.letters);

  return (
    <div
      className={cn(
        "grid grid-cols-6 gap-1.5 sm:grid-cols-9 lg:grid-cols-11",
        className,
      )}
    >
      {LETTERS.map((letter, index) => {
        const stat = letters[letter.char];
        const mastered = (stat?.best ?? 0) >= 75;
        const active = index === activeIndex;

        return (
          <button
            key={letter.char}
            type="button"
            onClick={() => onSelect(index)}
            title={`${letter.char} — ${letter.name}${
              stat ? ` · best ${stat.best}` : ""
            }`}
            aria-pressed={active}
            className={cn(
              "tile glyph relative flex aspect-square items-center justify-center rounded-lg text-xl",
              active && "tile-selected",
            )}
          >
            {letter.char}
            {mastered && (
              <Check
                aria-hidden
                className="absolute right-0.5 bottom-0.5 size-3 text-success"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
