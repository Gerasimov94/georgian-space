"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SoundButton } from "@/components/sound";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MatchBoard, type MatchResult } from "@/components/practice/match-board";
import { getLetter } from "@/lib/data/letters";
import { allVocab, allVocabWithUnit } from "@/lib/data/units";
import { useSpeech } from "@/lib/speech";
import { isDue, type Grade } from "@/lib/srs/scheduler";
import { useHydrated, useProgress, wordCardId } from "@/lib/store/progress";
import type { Vocab } from "@/lib/course/types";

const ROUND_SIZE = 5;

const GRADES: { grade: Grade; label: string; hint: string }[] = [
  { grade: "again", label: "Again", hint: "in 5 min" },
  { grade: "hard", label: "Hard", hint: "sooner" },
  { grade: "good", label: "Good", hint: "on schedule" },
  { grade: "easy", label: "Easy", hint: "later" },
];

export default function PracticePage() {
  const hydrated = useHydrated();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8">
      <header className="max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight">Practice</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Match words to their meanings, or flip through whatever the spaced
          repetition queue thinks you are about to forget.
        </p>
      </header>

      {hydrated ? (
        <Tabs defaultValue="match" className="gap-4">
          <TabsList>
            <TabsTrigger value="match">Match</TabsTrigger>
            <TabsTrigger value="review">Review queue</TabsTrigger>
          </TabsList>
          <TabsContent value="match">
            <MatchPractice />
          </TabsContent>
          <TabsContent value="review">
            <FlipReview />
          </TabsContent>
        </Tabs>
      ) : (
        <p className="text-sm text-muted-foreground">Loading your progress…</p>
      )}
    </div>
  );
}

function MatchPractice() {
  const cards = useProgress((state) => state.cards);
  const gradeCard = useProgress((state) => state.gradeCard);
  const ensureCards = useProgress((state) => state.ensureCards);

  const [round, setRound] = useState(0);
  const [solvedRounds, setSolvedRounds] = useState(0);

  const pool = useMemo(() => allVocabWithUnit(), []);

  /**
   * Words already in the queue and due come first, then anything not seen yet,
   * so a round is always useful but never empty.
   */
  const items = useMemo<Vocab[]>(() => {
    const due = new Set(
      Object.values(cards)
        .filter((card) => card.id.startsWith("word:") && isDue(card))
        .map((card) => card.id.slice("word:".length)),
    );

    const ranked = [...pool].sort((a, b) => {
      const score = (item: Vocab) =>
        due.has(item.ka) ? 0 : cards[wordCardId(item.ka)] ? 2 : 1;
      return score(a) - score(b);
    });

    const start = (round * ROUND_SIZE) % Math.max(1, ranked.length);
    const slice = ranked.slice(start, start + ROUND_SIZE);
    return slice.length === ROUND_SIZE ? slice : ranked.slice(0, ROUND_SIZE);
  }, [cards, pool, round]);

  const onComplete = useCallback(
    (results: MatchResult[]) => {
      ensureCards(results.map((result) => wordCardId(result.ka)));
      for (const { ka, firstTry } of results) {
        gradeCard(wordCardId(ka), firstTry ? "good" : "hard");
      }
      setSolvedRounds((count) => count + 1);
    },
    [ensureCards, gradeCard],
  );

  return (
    <Card className="py-5">
      <CardHeader>
        <CardTitle>What is what</CardTitle>
        <CardDescription>
          Five pairs per round. Anything you pair on the first try counts as a
          clean review.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <MatchBoard
          key={round}
          items={items}
          seed={`round-${round}`}
          onComplete={onComplete}
        />
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={() => setRound((value) => value + 1)}>
            Next round <ArrowRight className="size-4" />
          </Button>
          <span className="text-sm text-muted-foreground tabular-nums">
            {solvedRounds} round{solvedRounds === 1 ? "" : "s"} finished
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function FlipReview() {
  const cards = useProgress((state) => state.cards);
  const gradeCard = useProgress((state) => state.gradeCard);
  const { speak } = useSpeech();

  const [revealed, setRevealed] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const vocab = useMemo(() => allVocab(), []);

  // The queue is recomputed from the store, so grading a card drops it out.
  const queue = useMemo(
    () =>
      Object.values(cards)
        .filter((card) => isDue(card))
        .sort((a, b) => a.due - b.due),
    [cards],
  );

  const total = Object.keys(cards).length;
  const card = queue[0];

  if (!card) {
    return (
      <Card className="py-5">
        <CardHeader>
          <CardTitle>
            {total === 0 ? "No cards yet" : "Nothing due right now"}
          </CardTitle>
          <CardDescription>
            {total === 0
              ? "Cards are created as you go through lessons, match words and practise letters."
              : `${reviewed} reviewed in this session · ${total} cards in the queue, all scheduled for later.`}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button nativeButton={false} render={<Link href="/course" />}>Continue the course</Button>
          <Button variant="outline" nativeButton={false} render={<Link href="/write" />}>
            <PenLine className="size-4" /> Practise writing
          </Button>
        </CardContent>
      </Card>
    );
  }

  const isLetter = card.id.startsWith("letter:");
  const value = card.id.slice(card.id.indexOf(":") + 1);
  const letter = isLetter ? getLetter(value) : undefined;
  const word = vocab.get(value);

  const back = isLetter
    ? letter
      ? `${letter.name} · ${letter.latin} · ${letter.soundsLike}`
      : value
    : word
      ? `${word.latin} · ${word.en}`
      : value;

  const grade = (nextGrade: Grade) => {
    gradeCard(card.id, nextGrade);
    setRevealed(false);
    setReviewed((count) => count + 1);
  };

  // Turning a card over plays it, so the answer arrives by ear as well as eye.
  const reveal = () => {
    setRevealed(true);
    speak(value, word?.latin ?? letter?.latin);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="label-caps">Due now</span>
          <span className="tabular-nums">{queue.length} left</span>
        </div>
        <Progress value={(reviewed / (reviewed + queue.length)) * 100} />
      </div>

      <Card className="py-5">
        <CardContent>
          <button
            type="button"
            onClick={reveal}
            className="tile flex min-h-52 w-full flex-col items-center justify-center gap-3 p-6 text-center"
          >
            <span className="glyph text-5xl leading-snug break-words">
              {value}
            </span>
            {revealed ? (
              <span className="text-sm text-muted-foreground">{back}</span>
            ) : (
              <span className="text-xs text-muted-foreground">
                tap to hear it and reveal · {isLetter ? "letter" : "word"}
              </span>
            )}
            {revealed && card.lastScore !== undefined ? (
              <span className="text-xs text-muted-foreground">
                last handwriting match: {card.lastScore}/100
              </span>
            ) : null}
          </button>
        </CardContent>
      </Card>

      <div className="flex items-center justify-center gap-2">
        <SoundButton
          text={value}
          latin={word?.latin ?? letter?.latin}
          variant="ghost"
          size="sm"
          showLabel
        />
        {isLetter ? (
          <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/write" />}>
            <PenLine className="size-4" /> Write it
          </Button>
        ) : null}
      </div>

      {revealed ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {GRADES.map(({ grade: nextGrade, label, hint }) => (
            <Button
              key={nextGrade}
              variant={nextGrade === "good" ? "default" : "outline"}
              size="lg"
              className="h-auto flex-col gap-0.5 py-3"
              onClick={() => grade(nextGrade)}
            >
              <span>{label}</span>
              <span className="text-[0.65rem] opacity-70">{hint}</span>
            </Button>
          ))}
        </div>
      ) : (
        <Button size="lg" onClick={reveal}>
          Show answer
        </Button>
      )}
    </div>
  );
}
