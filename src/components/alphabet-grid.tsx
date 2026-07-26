"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, PenLine, Volume2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SoundButton, SpeakableText } from "@/components/sound";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LETTERS, type Letter } from "@/lib/data/letters";
import { useSpeech } from "@/lib/speech";
import { useProgress } from "@/lib/store/progress";
import { cn } from "@/lib/utils";

export function AlphabetGrid() {
  const [selected, setSelected] = useState<Letter | null>(null);
  const letters = useProgress((state) => state.letters);
  const { speak } = useSpeech();

  // Opening a letter also plays it: the sound is the point of this page.
  const open = (letter: Letter) => {
    setSelected(letter);
    speak(letter.char, letter.latin);
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {LETTERS.map((letter, index) => {
          const stat = letters[letter.char];
          const mastered = (stat?.best ?? 0) >= 75;

          return (
            <button
              key={letter.char}
              type="button"
              onClick={() => open(letter)}
              className="tile relative flex flex-col items-center gap-1 px-3 py-4 text-center"
            >
              <span className="absolute top-1.5 left-2 text-[0.65rem] text-muted-foreground tabular-nums">
                {index + 1}
              </span>
              <Volume2
                aria-hidden
                className="absolute top-1.5 right-2 size-3.5 text-primary/50"
              />
              <span className="glyph text-4xl">{letter.char}</span>
              <span className="text-sm">{letter.name}</span>
              <span className="text-xs text-muted-foreground">
                {letter.latin} · {letter.ipa}
              </span>
              {stat ? (
                <span
                  className={cn(
                    "flex items-center gap-1 text-xs tabular-nums",
                    mastered ? "text-success" : "text-muted-foreground",
                  )}
                >
                  {mastered ? <Check aria-hidden className="size-3" /> : null}
                  best {stat.best}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <Dialog
        open={selected !== null}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        <DialogContent className="max-w-md">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <span className="glyph text-5xl leading-none">
                    {selected.char}
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate">{selected.name}</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {selected.latin} · {selected.ipa}
                    </span>
                  </span>
                </DialogTitle>
                <DialogDescription>{selected.soundsLike}</DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-4 px-4 pb-4">
                {selected.tip && (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {selected.tip}
                  </p>
                )}

                <div className="flex flex-col gap-1 rounded-lg bg-secondary/60 p-3">
                  <span className="label-caps">Example</span>
                  <SpeakableText
                    text={selected.example.ka}
                    latin={selected.example.latin}
                    className="text-xl"
                  />
                  <span className="text-xs text-muted-foreground">
                    {selected.example.latin} · {selected.example.en}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <SoundButton
                    text={selected.char}
                    latin={selected.latin}
                    label="Hear the letter"
                    variant="outline"
                    size="sm"
                    showLabel
                  />
                  <Button size="sm" nativeButton={false} render={<Link href="/write" />}>
                    <PenLine className="size-4" /> Practise writing
                  </Button>
                  <Badge variant="outline" className="ml-auto tabular-nums">
                    {LETTERS.indexOf(selected) + 1} / {LETTERS.length}
                  </Badge>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
