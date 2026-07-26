# Georgian Space

A place to learn Georgian: handwriting practice with automatic letter matching,
a course of short lessons, matching cards with spaced repetition, and a numbers
page that explains the base-20 counting system.

Next.js 16 (App Router) · Tailwind CSS 4 · shadcn/ui · zustand + IndexedDB ·
vitest.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # unit tests (scoring, SRS, numerals)
npm run lint
npx tsc --noEmit
```

There is no backend. Progress (letter mastery, review queue, streak, lesson
results) is stored in the browser through IndexedDB, so clearing site data
resets everything.

## The pages

- `/` — where you left off, streak, letters mastered, units.
- `/course` — 9 units of short lessons: notes, flashcards, multiple choice,
  listening, matching, fill-the-gap, unscramble, typing and handwriting steps.
- `/write` — the handwriting studio: four guide lines, one letter at a time.
- `/practice` — pairing rounds (Georgian ↔ meaning) and the review queue.
- `/numbers` — every number 1–100 with its breakdown.
- `/alphabet` — all 33 letters with names, sounds and example words.

## How handwriting scoring works

Everything happens in the browser, on canvas pixels — no model, no server.

1. **Guides.** The canvas has four lines at fixed fractions of its height
   (`GUIDE_FRACTIONS` in `src/lib/handwriting/types.ts`). The x-height band,
   between midline and baseline, is the reference size.
2. **Reference glyph.** The letter is drawn to an offscreen canvas at a font size
   derived from the measured x-height of the webfont, sitting on the baseline,
   and thresholded into a binary mask (`raster.ts`). Its ascent and descent come
   from `measureText`, which is what classifies the letter as midline, ascender,
   descender or full — the four-line hint can never disagree with the glyph.
3. **Your ink.** Strokes are smoothed through midpoint quadratic curves and
   rasterized at a fixed pen width, so a thick or thin drawing scores the same
   (`strokes.ts`).
4. **Distance transform.** A two-pass chamfer transform gives, for every pixel,
   the distance to the nearest reference pixel and vice versa (`distance.ts`).
5. **Score.** `score.ts` combines *coverage* (how much of the letter you drew)
   and *precision* (how much of your ink lands on the letter, tolerant within a
   few pixels) as a harmonic mean, then subtracts penalties for sitting in the
   wrong band, drifting sideways or flooding the canvas with ink. 70 or more
   counts as a match; a letter is mastered at 75.

The overlay button shows what the score saw: red where the letter was missed,
amber where ink strayed outside it.

## Sound

Every Georgian string in the app can be heard: tap a letter, a word, a table
row, a match tile or a card. Very few systems ship a `ka-GE` voice, so when one
is missing the romanization is read by the closest available voice (Italian,
then Spanish, Portuguese, Russian) instead of going silent. Listening exercises
say so explicitly. Install a Georgian voice for the real pronunciation.

## Numbers

`src/lib/data/numbers.ts` composes the numerals rather than listing them, which
is also what produces the explanation shown on the cards:

- 1–19 are whole words; the teens are the unit plus `-მეტი` ("more than ten").
- Above twenty the system is vigesimal: a stem for the twenties
  (`ოც-`, `ორმოც-`, `სამოც-`, `ოთხმოც-`), then `და` ("and"), then a 1–19 word.
  So 47 is `ორმოცდაშვიდი` — two twenties and seven.
- Round twenties take `-ი`: `ოცი`, `ორმოცი`, `სამოცი`, `ოთხმოცი`. 100 is `ასი`.

## Spaced repetition

`src/lib/srs/scheduler.ts` is a compact SM-2: four grades (again / hard / good /
easy), an ease factor and a growing interval. Letters are graded from their
handwriting score, words from how they went in lessons and matching rounds, and
both share one queue.
