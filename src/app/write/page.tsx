"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SpeakableText } from "@/components/sound";
import { LetterRail } from "@/components/writing/letter-rail";
import { ScoreReadout } from "@/components/writing/score-readout";
import {
  CANVAS_HEIGHT,
  WritingCanvas,
} from "@/components/writing/writing-canvas";
import { LETTERS, LETTER_COUNT, ZONE_HINTS } from "@/lib/data/letters";
import { guidesFor } from "@/lib/handwriting/types";
import { fontsReady, zoneOf } from "@/lib/handwriting/raster";
import type { ScoreResult } from "@/lib/handwriting/score";
import { useProgress } from "@/lib/store/progress";
import { useSpeech } from "@/lib/speech";

const GUIDES = guidesFor(CANVAS_HEIGHT);

export default function WritePage() {
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [zone, setZone] = useState<string | null>(null);

  const bestRef = useRef(0);
  const loggedRef = useRef(false);

  const letter = LETTERS[index];
  const record = useProgress((state) => state.recordLetterAttempt);
  const letters = useProgress((state) => state.letters);
  const stat = letters[letter.char];
  const { speak } = useSpeech();

  const mastered = useMemo(
    () => LETTERS.filter(({ char }) => (letters[char]?.best ?? 0) >= 75).length,
    [letters],
  );

  useEffect(() => {
    let cancelled = false;
    void fontsReady().then(() => {
      if (cancelled) return;
      setZone(ZONE_HINTS[zoneOf(letter.char, GUIDES)]);
    });
    return () => {
      cancelled = true;
    };
  }, [letter.char]);

  const commit = useCallback(() => {
    if (loggedRef.current || bestRef.current === 0) return;
    record(letter.char, bestRef.current);
    loggedRef.current = true;
  }, [letter.char, record]);

  const goTo = useCallback(
    (next: number) => {
      commit();
      bestRef.current = 0;
      loggedRef.current = false;
      setResult(null);
      setIndex(((next % LETTER_COUNT) + LETTER_COUNT) % LETTER_COUNT);
    },
    [commit],
  );

  const onResult = useCallback(
    (next: ScoreResult) => {
      setResult(next);
      bestRef.current = Math.max(bestRef.current, next.score);

      if (next.passed && !loggedRef.current) {
        record(letter.char, next.score);
        loggedRef.current = true;
        toast.success(`${letter.char} matched · ${next.score}/100`, {
          description: `${letter.name} — ${letter.soundsLike}`,
        });
      }
    },
    [letter, record],
  );

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight">Handwriting</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Four guide lines, one letter at a time. Ascenders reach the top
            dashed line, descenders drop below the baseline.
          </p>
        </div>
        <Badge variant="outline" className="shrink-0">
          {mastered} of {LETTER_COUNT} letters mastered
        </Badge>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,8fr)]">
        <Card className="py-5">
          <CardContent>
            <WritingCanvas
              key={letter.char}
              char={letter.char}
              onResult={onResult}
            />
          </CardContent>
        </Card>

        <div className="flex min-w-0 flex-col gap-6">
          <Card className="py-5">
            <CardHeader className="grid-cols-[auto_1fr_auto] items-center gap-2">
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => goTo(index - 1)}
                aria-label="Previous letter"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <div className="min-w-0 text-center">
                <CardTitle className="truncate">{letter.name}</CardTitle>
                <CardDescription className="text-xs tabular-nums">
                  Letter {index + 1} of {LETTER_COUNT}
                </CardDescription>
              </div>
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => goTo(index + 1)}
                aria-label="Next letter"
              >
                <ChevronRight className="size-4" />
              </Button>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              <button
                type="button"
                onClick={() => speak(letter.char, letter.latin)}
                aria-label={`Listen to ${letter.name}`}
                className="tile relative flex h-36 items-center justify-center"
              >
                <span className="glyph pb-1 text-8xl leading-[1.1]">
                  {letter.char}
                </span>
                <Volume2
                  aria-hidden
                  className="absolute top-3 right-3 size-5 text-primary/60"
                />
              </button>
              <p className="text-center text-xs text-muted-foreground">
                Tap the letter to hear its sound
              </p>

              <div className="flex flex-wrap items-center justify-center gap-1.5">
                <Badge variant="secondary">{letter.latin}</Badge>
                <Badge variant="outline" className="font-mono text-xs">
                  {letter.ipa}
                </Badge>
                <Badge variant="outline">{letter.soundsLike}</Badge>
                {stat ? (
                  <Badge variant="outline" className="tabular-nums">
                    best {stat.best}
                  </Badge>
                ) : null}
              </div>

              <Separator />

              <dl className="flex flex-col gap-3 text-sm">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <dt className="label-caps w-full">Example</dt>
                  <dd>
                    <SpeakableText
                      text={letter.example.ka}
                      latin={letter.example.latin}
                      className="text-base"
                    />
                  </dd>
                  <dd className="text-muted-foreground">
                    {letter.example.latin} · {letter.example.en}
                  </dd>
                </div>
                {zone ? (
                  <div>
                    <dt className="label-caps">Where it sits</dt>
                    <dd className="mt-0.5 leading-snug text-muted-foreground">
                      {zone}
                    </dd>
                  </div>
                ) : null}
                {letter.tip ? (
                  <div>
                    <dt className="label-caps">Tip</dt>
                    <dd className="mt-0.5 leading-snug text-muted-foreground">
                      {letter.tip}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </CardContent>
          </Card>

          <Card className="py-5">
            <CardHeader>
              <CardTitle>Match</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <ScoreReadout result={result} />
              <Button
                variant={result?.passed ? "default" : "outline"}
                onClick={() => goTo(index + 1)}
                className="self-start"
              >
                Next letter <ChevronRight className="size-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="py-5">
        <CardHeader>
          <CardTitle>All 33 letters</CardTitle>
          <CardDescription>
            A tick marks a letter you have drawn at 75 or better.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LetterRail activeIndex={index} onSelect={goTo} />
        </CardContent>
      </Card>
    </div>
  );
}
