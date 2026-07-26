"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Dices } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SoundButton, SpeakableText } from "@/components/sound";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breakdown, NumberCard } from "@/components/numbers/number-card";
import {
  COMPOSED_NUMBERS,
  georgianNumber,
  numberRange,
  numbersOf,
  ROUND_NUMBERS,
} from "@/lib/data/numbers";
const FIRST_TWENTY = numberRange(1, 20);
const ROUND = numbersOf(ROUND_NUMBERS);
const COMPOSED = numbersOf(COMPOSED_NUMBERS);

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
  );
}

export default function NumbersPage() {
  const [value, setValue] = useState(47);
  const entry = useMemo(() => georgianNumber(value), [value]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8">
      <header className="max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight">Numbers</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Georgian counts in twenties. Above 20 you say how many twenties there
          are, join them with <span className="glyph">და</span> (“and”) and
          finish with a plain 1–19 word — so{" "}
          <span className="glyph">ორმოცდაშვიდი</span> is literally “two twenties
          and seven”, 47.
        </p>
      </header>

      <Card className="py-5">
        <CardHeader>
          <CardTitle>Build any number</CardTitle>
          <CardDescription>
            Drag or type a number between 1 and 100 to see how it is put
            together.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-4">
            <input
              type="number"
              min={1}
              max={100}
              value={value}
              onChange={(event) => {
                const next = Number(event.target.value);
                if (Number.isNaN(next)) return;
                setValue(Math.min(100, Math.max(1, Math.round(next))));
              }}
              aria-label="Number"
              className="font-heading h-12 w-20 rounded-lg border bg-card px-3 text-center text-2xl tabular-nums shadow-xs focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
            />
            <div className="flex min-w-40 flex-1 items-center">
              <Slider
                value={value}
                onValueChange={(next) =>
                  setValue(Array.isArray(next) ? next[0] : next)
                }
                min={1}
                max={100}
                step={1}
                aria-label="Choose a number"
              />
            </div>
            <div className="flex items-center gap-2">
              <SoundButton
                text={entry.ka}
                latin={entry.latin}
                variant="outline"
                size="sm"
                showLabel
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setValue(1 + Math.floor(Math.random() * 100))}
              >
                <Dices className="size-4" /> Random
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-xl bg-accent/40 p-5 ring-1 ring-primary/15">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <SpeakableText
                text={entry.ka}
                latin={entry.latin}
                className="text-3xl leading-snug"
              />
              <span className="text-sm text-muted-foreground">
                {entry.latin} · {entry.en}
              </span>
            </div>
            <Breakdown entry={entry} />
            <p className="text-sm leading-relaxed text-muted-foreground">
              {entry.why}
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="first" className="gap-4">
        <TabsList>
          <TabsTrigger value="first">1–20</TabsTrigger>
          <TabsTrigger value="round">Round numbers</TabsTrigger>
          <TabsTrigger value="composed">In twenties</TabsTrigger>
        </TabsList>

        <TabsContent value="first">
          <Grid>
            {FIRST_TWENTY.map((item) => (
              <NumberCard key={item.value} entry={item} />
            ))}
          </Grid>
        </TabsContent>

        <TabsContent value="round">
          <Grid>
            {ROUND.map((item) => (
              <NumberCard key={item.value} entry={item} />
            ))}
          </Grid>
        </TabsContent>

        <TabsContent value="composed">
          <Grid>
            {COMPOSED.map((item) => (
              <NumberCard key={item.value} entry={item} />
            ))}
          </Grid>
        </TabsContent>
      </Tabs>

      <Card className="py-5">
        <CardHeader>
          <CardTitle>Drill them</CardTitle>
          <CardDescription>
            The numbers unit turns these into matching and typing exercises.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button nativeButton={false} render={<Link href="/course/numbers" />}>
            Open the numbers unit
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
