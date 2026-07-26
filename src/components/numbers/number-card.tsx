"use client";

import { Card, CardContent } from "@/components/ui/card";
import { SoundButton } from "@/components/sound";
import { useSpeech } from "@/lib/speech";
import { cn } from "@/lib/utils";
import type { GeorgianNumber, NumberPart } from "@/lib/data/numbers";

function Piece({ part }: { part: NumberPart }) {
  const joiner = part.value === null;

  return (
    <span
      className={cn(
        "flex min-w-0 flex-col items-center rounded-md border px-2 py-1 text-center",
        joiner ? "border-dashed border-border" : "border-primary/20 bg-accent/60",
      )}
    >
      <span className="glyph text-sm leading-snug break-words">{part.ka}</span>
      <span className="text-[0.6875rem] leading-snug text-muted-foreground">
        {joiner ? "and" : part.en}
      </span>
    </span>
  );
}

/** Shows the parts of a composed number as chips joined by plus signs. */
export function Breakdown({ entry }: { entry: GeorgianNumber }) {
  if (entry.parts.length < 2) {
    return (
      <p className="text-xs text-muted-foreground">
        Base word · {entry.sum}
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {entry.parts.map((part, index) => (
        <Piece key={`${part.ka}-${index}`} part={part} />
      ))}
      <span className="ml-auto shrink-0 self-end font-mono text-xs text-muted-foreground tabular-nums">
        {entry.sum}
      </span>
    </div>
  );
}

export function NumberCard({
  entry,
  className,
}: {
  entry: GeorgianNumber;
  className?: string;
}) {
  const { speak } = useSpeech();

  return (
    <Card
      className={cn("cursor-pointer py-4 hover:ring-primary/30", className)}
      onClick={() => speak(entry.ka, entry.latin)}
    >
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="glyph text-xl leading-snug break-words">{entry.ka}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {entry.latin} · {entry.en}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <SoundButton text={entry.ka} latin={entry.latin} />
            <span className="font-heading rounded-md bg-accent px-2 py-0.5 text-lg text-accent-foreground tabular-nums">
              {entry.value}
            </span>
          </div>
        </div>

        <Breakdown entry={entry} />

        <p className="text-xs leading-relaxed text-muted-foreground">
          {entry.why}
        </p>
      </CardContent>
    </Card>
  );
}
