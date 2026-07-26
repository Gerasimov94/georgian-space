"use client";

import { Delete } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LETTERS } from "@/lib/data/letters";

/**
 * An on-screen Mkhedruli keyboard, so typing answers does not require installing
 * a Georgian layout.
 */
export function GeorgianKeyboard({
  onInsert,
  onBackspace,
  disabled,
}: {
  onInsert: (char: string) => void;
  onBackspace: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="grid grid-cols-9 gap-1 sm:grid-cols-12">
        {LETTERS.map((letter) => (
          <Button
            key={letter.char}
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={() => onInsert(letter.char)}
            className="glyph h-9 text-base"
          >
            {letter.char}
          </Button>
        ))}
      </div>
      <div className="flex gap-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => onInsert(" ")}
          className="flex-1"
        >
          space
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => onInsert("-")}
        >
          -
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={onBackspace}
          aria-label="Backspace"
        >
          <Delete className="size-4" />
        </Button>
      </div>
    </div>
  );
}
